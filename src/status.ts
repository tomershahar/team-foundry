import fs from 'fs/promises';
import path from 'path';
import { execSync } from 'child_process';

interface FileStatus {
  relativePath: string;
  lastUpdated: string | null;
  owner: string | null;
  daysSinceUpdate: number | null;
  prsSinceUpdate: number | null;
  exists: boolean;
  isEmpty: boolean;
  health: 'ok' | 'stale' | 'missing' | 'empty';
}

const CONTENT_FILES = [
  'team-foundry/product/north-star.md',
  'team-foundry/product/outcomes.md',
  'team-foundry/product/customers.md',
  'team-foundry/product/now-next-later.md',
  'team-foundry/product/assumptions.md',
  'team-foundry/product/risks.md',
  'team-foundry/product/strategy.md',
  'team-foundry/team/trio.md',
  'team-foundry/team/working-agreement.md',
  'team-foundry/team/ai-practices.md',
  'team-foundry/engineering/stack.md',
  'team-foundry/engineering/quality-bar.md',
  'team-foundry/design/principles.md',
  'team-foundry/data/metrics.md',
  'team-foundry/context/glossary.md',
  'team-foundry/context/stakeholders.md',
];

const STALE_DAYS = 45;

function parseFrontmatter(content: string): Record<string, string> {
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

function daysSince(dateStr: string): number {
  const then = new Date(dateStr).getTime();
  const now = Date.now();
  return Math.floor((now - then) / 86400000);
}

function prsSinceDate(targetDir: string, dateStr: string): number | null {
  try {
    const since = new Date(dateStr).toISOString();
    const out = execSync(
      `git -C "${targetDir}" log --oneline --merges --since="${since}" 2>/dev/null`,
      { encoding: 'utf-8', timeout: 5000 },
    );
    return out.trim().split('\n').filter(Boolean).length;
  } catch {
    return null;
  }
}

async function analyzeFile(targetDir: string, relativePath: string): Promise<FileStatus> {
  const fullPath = path.join(targetDir, relativePath);
  let exists = false;
  let isEmpty = false;
  let lastUpdated: string | null = null;
  let owner: string | null = null;
  let daysSinceUpdate: number | null = null;
  let prsSince: number | null = null;

  try {
    const content = await fs.readFile(fullPath, 'utf-8');
    exists = true;
    const body = content.replace(/^---[\s\S]*?---\n?/, '').trim();
    isEmpty = body.length < 50;

    const fm = parseFrontmatter(content);
    if (fm['last_updated']) {
      lastUpdated = fm['last_updated'];
      daysSinceUpdate = daysSince(lastUpdated);
      prsSince = prsSinceDate(targetDir, lastUpdated);
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
    prsSinceUpdate: prsSince,
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
  const name = s.relativePath.replace('team-foundry/', '');
  const updated = s.lastUpdated ?? '—';
  const age = s.daysSinceUpdate !== null ? `${s.daysSinceUpdate}d` : '—';
  const prs = s.prsSinceUpdate !== null ? `${s.prsSinceUpdate} PRs` : '—';
  const owner = s.owner || '—';
  return `  ${icon}  ${name.padEnd(42)} ${updated.padEnd(12)} ${age.padEnd(6)} ${prs.padEnd(8)} ${owner}`;
}

function whyNudge(s: FileStatus): string {
  const parts: string[] = [];
  if (s.daysSinceUpdate !== null) parts.push(`${s.daysSinceUpdate} days since last update`);
  if (s.prsSinceUpdate !== null && s.prsSinceUpdate > 0)
    parts.push(`${s.prsSinceUpdate} PRs shipped since then`);
  if (!s.owner) parts.push('no owner set');
  return parts.join(', ');
}

export async function runStatus(targetDir: string): Promise<void> {
  // Detect which files are present (auto-detect profile)
  const fullProfileFile = path.join(targetDir, 'team-foundry/team/trio.md');
  let isFullProfile = false;
  try { await fs.access(fullProfileFile); isFullProfile = true; } catch { /* solo */ }

  const filesToCheck = isFullProfile
    ? CONTENT_FILES
    : CONTENT_FILES.filter(p =>
        ['north-star', 'outcomes', 'customers', 'stack'].some(k => p.includes(k)),
      );

  const results = await Promise.all(filesToCheck.map(f => analyzeFile(targetDir, f)));

  const ok = results.filter(r => r.health === 'ok');
  const stale = results.filter(r => r.health === 'stale');
  const empty = results.filter(r => r.health === 'empty');
  const missing = results.filter(r => r.health === 'missing');

  console.log('\n  team-foundry status\n');
  console.log(`  ${'File'.padEnd(44)} ${'Last updated'.padEnd(12)} ${'Age'.padEnd(6)} ${'PRs'.padEnd(8)} Owner`);
  console.log(`  ${'─'.repeat(90)}`);
  for (const s of results) console.log(formatRow(s));
  console.log();

  console.log(`  ✓ ${ok.length} current   ~ ${stale.length} stale   ○ ${empty.length} empty   ✗ ${missing.length} missing\n`);

  if (stale.length > 0) {
    console.log('  Stale files — why this nudge:\n');
    for (const s of stale) {
      console.log(`    ~ ${s.relativePath.replace('team-foundry/', '')}`);
      console.log(`      ${whyNudge(s)}\n`);
    }
  }

  if (empty.length > 0) {
    console.log('  Empty files — not yet filled in:\n');
    for (const s of empty) {
      console.log(`    ○ ${s.relativePath.replace('team-foundry/', '')}`);
    }
    console.log();
  }

  if (missing.length > 0) {
    console.log('  Missing files — run `npx create-team-foundry` to scaffold:\n');
    for (const s of missing) {
      console.log(`    ✗ ${s.relativePath.replace('team-foundry/', '')}`);
    }
    console.log();
  }

  const noOwner = results.filter(r => r.exists && !r.owner);
  if (noOwner.length > 0) {
    console.log(`  ${noOwner.length} file(s) have no owner set. Add \`owner: <name>\` to their frontmatter.\n`);
  }
}
