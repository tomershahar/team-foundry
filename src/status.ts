import fs from 'fs/promises';
import path from 'path';
import { spawnSync } from 'child_process';
import { runLinkChecks, rankFindings } from './link-checker.js';
import type { LinkFinding } from './link-checker.js';
import { trackedPaths } from './manifest.js';

export interface FileStatus {
  relativePath: string;
  lastUpdated: string | null;
  owner: string | null;
  daysSinceUpdate: number | null;
  commitsSinceUpdate: number | null;
  exists: boolean;
  isEmpty: boolean;
  health: 'ok' | 'stale' | 'missing' | 'empty';
}

export interface StatusAnalysis {
  isFullProfile: boolean;
  results: FileStatus[];
  linkFindings: LinkFinding[];
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

// Derived from the manifest (entries with tracked: true) — the same source
// scaffold writes from, so status can't drift when files are added or renamed.
const SOLO_FILES = trackedPaths('solo');
const ALL_FILES = trackedPaths('full');

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

/**
 * Gathers raw status data (file health + link integrity) without rendering.
 * Shared by the human `status` view and the `--ci` gate so the two can't drift.
 * Link checks run on the full profile only (solo has no metrics/assumptions).
 */
export async function gatherStatus(targetDir: string): Promise<StatusAnalysis> {
  const fullProfileFile = path.join(targetDir, 'team-foundry/team/trio.md');
  let isFullProfile = false;
  try { await fs.access(fullProfileFile); isFullProfile = true; } catch { /* solo */ }

  const filesToCheck = isFullProfile ? ALL_FILES : SOLO_FILES;
  const results = await Promise.all(filesToCheck.map(f => analyzeFile(targetDir, f)));
  const linkFindings = isFullProfile ? await runLinkChecks(targetDir) : [];

  return { isFullProfile, results, linkFindings };
}

export interface CiCounts {
  missing: number;
  empty: number;
  stale: number;
  linkFindings: number;
}

export interface CiDecision {
  code: 0 | 1;
  failures: string[];
  warnings: string[];
}

/**
 * Pure exit-code decision for `status --ci`. Missing files and link-integrity
 * issues are hard failures (these mean an AI is reading nothing, or reading
 * contradictory context). Stale/empty are warn-only unless `maxStale` is set,
 * which lets a team additionally fail the build when too many files go stale.
 */
export function ciExitDecision(c: CiCounts, opts: { maxStale?: number } = {}): CiDecision {
  const failures: string[] = [];
  const warnings: string[] = [];

  if (c.missing > 0) failures.push(`${c.missing} missing context file(s)`);
  if (c.linkFindings > 0) failures.push(`${c.linkFindings} link-integrity issue(s)`);

  if (opts.maxStale !== undefined && c.stale > opts.maxStale) {
    failures.push(`${c.stale} stale file(s) exceeds --max-stale=${opts.maxStale}`);
  } else if (c.stale > 0) {
    warnings.push(`${c.stale} stale file(s)`);
  }
  if (c.empty > 0) warnings.push(`${c.empty} empty file(s)`);

  return { code: failures.length > 0 ? 1 : 0, failures, warnings };
}

/**
 * Non-interactive drift gate for CI. Prints a concise summary and returns the
 * process exit code (0 clean, 1 drift). The caller sets process.exitCode.
 */
export async function runStatusCi(
  targetDir: string,
  opts: { maxStale?: number } = {},
): Promise<number> {
  const { results, linkFindings } = await gatherStatus(targetDir);
  const counts: CiCounts = {
    missing: results.filter(r => r.health === 'missing').length,
    empty: results.filter(r => r.health === 'empty').length,
    stale: results.filter(r => r.health === 'stale').length,
    linkFindings: linkFindings.length,
  };
  const decision = ciExitDecision(counts, opts);

  console.log('team-foundry status --ci');
  console.log(
    `  ${counts.missing} missing  ${counts.empty} empty  ${counts.stale} stale  ${counts.linkFindings} link issue(s)`,
  );
  for (const f of decision.failures) console.log(`  FAIL: ${f}`);
  for (const w of decision.warnings) console.log(`  warn: ${w}`);
  console.log(decision.code === 0 ? '  team-foundry: context OK' : '  team-foundry: drift detected');

  return decision.code;
}

export async function runStatus(targetDir: string): Promise<void> {
  const { isFullProfile, results, linkFindings: gatheredLinks } = await gatherStatus(targetDir);

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
  const linkFindings: LinkFinding[] = gatheredLinks;
  if (isFullProfile) {
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
