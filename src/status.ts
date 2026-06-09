import fs from 'fs/promises';
import path from 'path';
import { spawnSync } from 'child_process';
import { runLinkChecks, rankFindings } from './link-checker.js';
import type { LinkFinding } from './link-checker.js';

interface FileStatus {
  relativePath: string;
  lastUpdated: string | null;
  owner: string | null;
  daysSinceUpdate: number | null;
  commitsSinceUpdate: number | null;
  exists: boolean;
  isEmpty: boolean;
  health: 'ok' | 'stale' | 'missing' | 'empty';
}

export interface PointerFileStatus {
  relativePath: string;
  exists: boolean;
  /**
   * true if the file exists but does not contain the string 'AGENTS.md'.
   * Only meaningful when exists === true; always false when exists === false.
   */
  drifted: boolean;
}

const POINTER_FILE_PATHS = [
  'CLAUDE.md',
  'GEMINI.md',
  '.cursor/rules/team-foundry.mdc',
];

export async function checkPointerFiles(targetDir: string): Promise<PointerFileStatus[]> {
  const results: PointerFileStatus[] = [];
  for (const relPath of POINTER_FILE_PATHS) {
    try {
      const content = await fs.readFile(path.join(targetDir, relPath), 'utf-8');
      results.push({
        relativePath: relPath,
        exists: true,
        drifted: !content.includes('AGENTS.md'),
      });
    } catch {
      results.push({ relativePath: relPath, exists: false, drifted: false });
    }
  }
  return results;
}

// Matches SOLO_ENTRIES in scaffold.ts (excluding root + coach which have no owner field)
const SOLO_FILES = [
  'team-foundry/product/north-star.md',
  'team-foundry/product/outcomes.md',
  'team-foundry/product/customers.md',
  'team-foundry/engineering/stack.md',
];

const FULL_ONLY_FILES = [
  'team-foundry/product/now-next-later.md',
  'team-foundry/product/assumptions.md',
  'team-foundry/product/risks.md',
  'team-foundry/product/strategy.md',
  'team-foundry/team/trio.md',
  'team-foundry/team/working-agreement.md',
  'team-foundry/team/ai-practices.md',
  'team-foundry/engineering/quality-bar.md',
  'team-foundry/design/principles.md',
  'team-foundry/data/metrics.md',
  'team-foundry/context/glossary.md',
  'team-foundry/context/stakeholders.md',
];

const ALL_FILES = [...SOLO_FILES, ...FULL_ONLY_FILES];

const STALE_DAYS = 45;

export function parseFrontmatter(content: string): Record<string, string> {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const result: Record<string, string> = {};
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    result[key] = value;
  }
  return result;
}

export function daysSince(dateStr: string): number | null {
  const then = new Date(dateStr).getTime();
  if (isNaN(then)) return null;
  return Math.floor((Date.now() - then) / 86400000);
}

// Counts all commits, not just merge commits: squash-merge workflows (the GitHub
// default for many teams) produce no merge commits, which made the old PR count
// read 0 and silently kill the staleness signal.
function commitsSinceDate(targetDir: string, dateStr: string): number | null {
  try {
    const since = new Date(dateStr).toISOString();
    if (isNaN(new Date(dateStr).getTime())) return null;
    const result = spawnSync(
      'git',
      ['-C', targetDir, 'log', '--oneline', `--since=${since}`],
      { encoding: 'utf-8', timeout: 5000 },
    );
    if (result.status !== 0) return null;
    return result.stdout.trim().split('\n').filter(Boolean).length;
  } catch {
    return null;
  }
}

// Date (YYYY-MM-DD) of the last commit that touched the file, or null when the
// file is untracked or the directory is not a git repo.
function gitLastCommitDate(targetDir: string, relativePath: string): string | null {
  try {
    const result = spawnSync(
      'git',
      ['-C', targetDir, 'log', '-1', '--format=%cs', '--', relativePath],
      { encoding: 'utf-8', timeout: 5000 },
    );
    if (result.status !== 0) return null;
    return result.stdout.trim() || null;
  } catch {
    return null;
  }
}

// Frontmatter last_updated relies on humans maintaining it — the exact failure
// mode status exists to catch. Git history is the honest signal, so the more
// recent of the two dates wins. A malformed-but-present frontmatter date is
// preserved when there is no git date, so it still shows up in output.
function effectiveLastUpdated(fmDate: string | null, gitDate: string | null): string | null {
  const fmTime = fmDate ? new Date(fmDate).getTime() : NaN;
  const gitTime = gitDate ? new Date(gitDate).getTime() : NaN;
  if (isNaN(fmTime) && isNaN(gitTime)) return fmDate ?? gitDate;
  if (isNaN(fmTime)) return gitDate;
  if (isNaN(gitTime)) return fmDate;
  return fmTime >= gitTime ? fmDate : gitDate;
}

function isEffectivelyEmpty(body: string): boolean {
  // Strip HTML comments (template placeholders) and markdown headings
  const stripped = body
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/^#+\s.*$/gm, '')
    .trim();
  return stripped.length < 30;
}

export async function analyzeFile(targetDir: string, relativePath: string): Promise<FileStatus> {
  const fullPath = path.join(targetDir, relativePath);
  let exists = false;
  let isEmpty = false;
  let lastUpdated: string | null = null;
  let owner: string | null = null;
  let daysSinceUpdate: number | null = null;
  let commitsSince: number | null = null;

  try {
    const content = await fs.readFile(fullPath, 'utf-8');
    exists = true;
    const body = content.replace(/^---[\s\S]*?---\n?/, '').trim();
    isEmpty = isEffectivelyEmpty(body);

    const fm = parseFrontmatter(content);
    const gitDate = gitLastCommitDate(targetDir, relativePath);
    lastUpdated = effectiveLastUpdated(fm['last_updated'] || null, gitDate);
    if (lastUpdated) {
      daysSinceUpdate = daysSince(lastUpdated);
      commitsSince = commitsSinceDate(targetDir, lastUpdated);
    }
    owner = fm['owner'] || null;
  } catch {
    // file doesn't exist
  }

  let health: FileStatus['health'] = 'ok';
  if (!exists) health = 'missing';
  else if (isEmpty) health = 'empty';
  else if (daysSinceUpdate !== null && daysSinceUpdate >= STALE_DAYS) health = 'stale';

  return {
    relativePath,
    lastUpdated,
    owner,
    daysSinceUpdate,
    commitsSinceUpdate: commitsSince,
    exists,
    isEmpty,
    health,
  };
}

function healthIcon(health: FileStatus['health']): string {
  if (health === 'ok') return '✓';
  if (health === 'stale') return '~';
  if (health === 'empty') return '○';
  return '✗';
}

function formatRow(s: FileStatus): string {
  const icon = healthIcon(s.health);
  const rawName = s.relativePath.replace('team-foundry/', '');
  const name = rawName.slice(0, 42).padEnd(42);
  const updated = s.lastUpdated ?? ' - ';
  const age = s.daysSinceUpdate !== null ? `${s.daysSinceUpdate}d` : ' - ';
  const commits = s.commitsSinceUpdate !== null ? `${s.commitsSinceUpdate}` : ' - ';
  const owner = s.owner || ' - ';
  return `  ${icon}  ${name} ${updated.padEnd(12)} ${age.padEnd(6)} ${commits.padEnd(8)} ${owner}`;
}

function whyNudge(s: FileStatus): string {
  const parts: string[] = [];
  if (s.daysSinceUpdate !== null) parts.push(`${s.daysSinceUpdate} days since last update`);
  if (s.commitsSinceUpdate !== null && s.commitsSinceUpdate > 0)
    parts.push(`${s.commitsSinceUpdate} commits shipped since then`);
  if (!s.owner) parts.push('no owner set');
  return parts.join(', ');
}

export async function runStatus(targetDir: string): Promise<void> {
  // Detect profile: full if any full-only file exists, solo otherwise
  const fullProfileFile = path.join(targetDir, 'team-foundry/team/trio.md');
  let isFullProfile = false;
  try { await fs.access(fullProfileFile); isFullProfile = true; } catch { /* solo */ }

  const filesToCheck = isFullProfile ? ALL_FILES : SOLO_FILES;

  const results = await Promise.all(filesToCheck.map(f => analyzeFile(targetDir, f)));

  const ok = results.filter(r => r.health === 'ok');
  const stale = results.filter(r => r.health === 'stale');
  const empty = results.filter(r => r.health === 'empty');
  const missing = results.filter(r => r.health === 'missing');

  console.log('\n  team-foundry status\n');
  console.log(`  ${'File'.padEnd(44)} ${'Last updated'.padEnd(12)} ${'Age'.padEnd(6)} ${'Commits'.padEnd(8)} Owner`);
  console.log(`  ${'─'.repeat(90)}`);
  for (const s of results) console.log(formatRow(s));
  console.log();

  console.log(`  ✓ ${ok.length} current   ~ ${stale.length} stale   ○ ${empty.length} empty   ✗ ${missing.length} missing\n`);

  // Link integrity section (full profile only)
  let linkFindings: LinkFinding[] = [];
  if (isFullProfile) {
    linkFindings = await runLinkChecks(targetDir);
    if (linkFindings.length > 0) {
      console.log(`  Link Integrity`);
      console.log(`  ${'─'.repeat(60)}`);
      const byType: Record<string, LinkFinding[]> = {};
      for (const f of linkFindings) {
        (byType[f.type] ??= []).push(f);
      }
      const typeLabels: Record<string, string> = {
        'outcome-metric': 'Outcome references undefined metric',
        'now-assumption': 'Now item missing linked assumption',
        'assumption-outcome': 'Assumption/outcome unlinked',
      };
      for (const [type, items] of Object.entries(byType)) {
        console.log(`\n  ! ${typeLabels[type] ?? type}`);
        for (const item of items) {
          console.log(`      ${item.file.replace('team-foundry/', '')} → ${item.detail}`);
        }
      }
      console.log();
    }
  }

  // Top 3 fix suggestions
  const healthForRanking = results
    .filter((r): r is FileStatus & { health: 'stale' | 'empty' | 'missing' } => r.health !== 'ok')
    .map(r => ({
      file: r.relativePath,
      health: r.health,
      commits: r.commitsSinceUpdate ?? 0,
    }));

  const top3 = rankFindings(healthForRanking, linkFindings);
  console.log(`  Top 3 Fix Suggestions`);
  console.log(`  ${'─'.repeat(60)}`);
  if (top3.length === 0) {
    console.log('  No critical drift detected this week.\n');
  } else {
    for (let i = 0; i < top3.length; i++) {
      const s = top3[i];
      console.log(`\n  ${i + 1}) ${s.detail}`);
      console.log(`     In: ${s.file.replace('team-foundry/', '')}`);
      console.log(`     Action: ${s.action}`);
    }
    console.log();
  }

  if (stale.length > 0) {
    console.log('  Stale files  -  why this nudge:\n');
    for (const s of stale) {
      console.log(`    ~ ${s.relativePath.replace('team-foundry/', '')}`);
      console.log(`      ${whyNudge(s)}\n`);
    }
  }

  if (empty.length > 0) {
    console.log('  Empty files  -  not yet filled in:\n');
    for (const s of empty) {
      console.log(`    ○ ${s.relativePath.replace('team-foundry/', '')}`);
    }
    console.log();
  }

  if (missing.length > 0) {
    console.log('  Missing files  -  run `npx create-team-foundry` to scaffold:\n');
    for (const s of missing) {
      console.log(`    ✗ ${s.relativePath.replace('team-foundry/', '')}`);
    }
    console.log();
  }

  const noOwner = results.filter(r => r.exists && !r.owner);
  if (noOwner.length > 0) {
    console.log(`  ${noOwner.length} file(s) have no owner set. Add \`owner: <name>\` to their frontmatter.\n`);
  }

  // Pointer files section
  const pointerStatuses = await checkPointerFiles(targetDir);
  const pointerLines = [
    '',
    'Pointer files (each should reference AGENTS.md):',
    '',
  ];
  for (const p of pointerStatuses) {
    let symbol: string;
    let label: string;
    if (!p.exists) {
      symbol = '○';
      label = 'not present';
    } else if (p.drifted) {
      symbol = '⚠';
      label = 'drifted / out of sync — AGENTS.md reference missing';
    } else {
      symbol = '✓';
      label = 'ok';
    }
    pointerLines.push(`  ${symbol}  ${p.relativePath.padEnd(40)} ${label}`);
  }
  console.log(pointerLines.join('\n'));
}
