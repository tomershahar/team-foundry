import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { spawnSync } from 'child_process';
import { runStatus, analyzeFile, parseFrontmatter, daysSince, checkPointerFiles } from '../status.js';

async function makeTempDir(): Promise<string> {
  return fs.mkdtemp(path.join(os.tmpdir(), 'tf-status-test-'));
}

async function cleanup(dir: string): Promise<void> {
  await fs.rm(dir, { recursive: true, force: true });
}

async function writeFile(dir: string, rel: string, content: string): Promise<void> {
  const full = path.join(dir, rel);
  await fs.mkdir(path.dirname(full), { recursive: true });
  await fs.writeFile(full, content, 'utf-8');
}

const today = new Date().toISOString().split('T')[0];

const CURRENT_CONTENT = (owner = 'Alice') => `---
purpose: test
read_when: always
last_updated: ${today}
owner: ${owner}
---

# Test

This file has real content that a human wrote. It describes the north star metric
and explains what success looks like for the team this quarter and beyond.
`;

const STALE_CONTENT = `---
purpose: test
read_when: always
last_updated: 2020-01-01
owner: Bob
---

# Test

This file has real content that a human wrote. It describes the north star metric
and explains what success looks like for the team this quarter and beyond.
`;

const STUB_CONTENT = `---
purpose: test
read_when: always
last_updated: ${today}
owner:
---

# Outcomes

<!-- COACH: Run the onboarding interview to fill this in. -->
`;

describe('parseFrontmatter()', () => {
  it('extracts last_updated and owner', () => {
    const fm = parseFrontmatter(CURRENT_CONTENT());
    expect(fm['last_updated']).toBe(today);
    expect(fm['owner']).toBe('Alice');
  });

  it('returns empty object when no frontmatter', () => {
    expect(parseFrontmatter('# Just a heading\n\nSome text')).toEqual({});
  });

  it('handles blank owner field', () => {
    const fm = parseFrontmatter(STUB_CONTENT);
    expect(fm['owner']).toBe('');
  });
});

describe('daysSince()', () => {
  it('returns 0 for today', () => {
    expect(daysSince(today)).toBe(0);
  });

  it('returns ~1826 days for 2020-01-01', () => {
    const d = daysSince('2020-01-01');
    expect(d).not.toBeNull();
    expect(d!).toBeGreaterThan(1800);
  });

  it('returns null for malformed date', () => {
    expect(daysSince('TBD')).toBeNull();
    expect(daysSince('not-a-date')).toBeNull();
  });
});

describe('analyzeFile()', () => {
  let tmpDir: string;
  beforeEach(async () => { tmpDir = await makeTempDir(); });
  afterEach(async () => { await cleanup(tmpDir); });

  it('returns missing for non-existent file', async () => {
    const result = await analyzeFile(tmpDir, 'team-foundry/product/outcomes.md');
    expect(result.health).toBe('missing');
    expect(result.exists).toBe(false);
  });

  it('returns ok for a current, filled-in file', async () => {
    await writeFile(tmpDir, 'team-foundry/product/outcomes.md', CURRENT_CONTENT());
    const result = await analyzeFile(tmpDir, 'team-foundry/product/outcomes.md');
    expect(result.health).toBe('ok');
    expect(result.owner).toBe('Alice');
    expect(result.daysSinceUpdate).toBe(0);
  });

  it('returns stale for a file with old last_updated', async () => {
    await writeFile(tmpDir, 'team-foundry/product/outcomes.md', STALE_CONTENT);
    const result = await analyzeFile(tmpDir, 'team-foundry/product/outcomes.md');
    expect(result.health).toBe('stale');
    expect(result.daysSinceUpdate).toBeGreaterThan(44);
  });

  it('returns empty for a stub-only file (comments + headings, no real content)', async () => {
    await writeFile(tmpDir, 'team-foundry/product/outcomes.md', STUB_CONTENT);
    const result = await analyzeFile(tmpDir, 'team-foundry/product/outcomes.md');
    expect(result.health).toBe('empty');
  });

  it('detects blank owner', async () => {
    await writeFile(tmpDir, 'team-foundry/product/outcomes.md', STUB_CONTENT);
    const result = await analyzeFile(tmpDir, 'team-foundry/product/outcomes.md');
    expect(result.owner).toBeNull();
  });

  it('returns null daysSinceUpdate for malformed last_updated', async () => {
    const badDate = CURRENT_CONTENT().replace(today, 'TBD');
    await writeFile(tmpDir, 'team-foundry/product/outcomes.md', badDate);
    const result = await analyzeFile(tmpDir, 'team-foundry/product/outcomes.md');
    expect(result.daysSinceUpdate).toBeNull();
    // Should not be classified as stale when date is unparseable
    expect(result.health).not.toBe('stale');
  });
});

function git(dir: string, args: string[], dateEnv?: string): void {
  const env = dateEnv
    ? { ...process.env, GIT_AUTHOR_DATE: dateEnv, GIT_COMMITTER_DATE: dateEnv }
    : process.env;
  const result = spawnSync('git', ['-C', dir, ...args], { encoding: 'utf-8', env });
  if (result.status !== 0) throw new Error(`git ${args.join(' ')} failed: ${result.stderr}`);
}

function initGitRepo(dir: string): void {
  git(dir, ['init']);
  git(dir, ['config', 'user.email', 'test@example.com']);
  git(dir, ['config', 'user.name', 'Test']);
  git(dir, ['config', 'commit.gpgsign', 'false']);
}

function commitAll(dir: string, message: string, date?: string): void {
  git(dir, ['add', '-A']);
  git(dir, ['commit', '-m', message, '--no-verify'], date);
}

// Content with real body but no last_updated in frontmatter
const NO_DATE_CONTENT = `---
purpose: test
read_when: always
owner: Bob
---

# Test

This file has real content that a human wrote. It describes the north star metric
and explains what success looks like for the team this quarter and beyond.
`;

describe('analyzeFile() with git history', () => {
  let tmpDir: string;
  beforeEach(async () => { tmpDir = await makeTempDir(); });
  afterEach(async () => { await cleanup(tmpDir); });

  it('falls back to the git commit date when frontmatter has no last_updated', async () => {
    initGitRepo(tmpDir);
    await writeFile(tmpDir, 'team-foundry/product/outcomes.md', NO_DATE_CONTENT);
    commitAll(tmpDir, 'add outcomes', '2020-01-02T12:00:00');

    const result = await analyzeFile(tmpDir, 'team-foundry/product/outcomes.md');
    expect(result.lastUpdated).toBe('2020-01-02');
    expect(result.health).toBe('stale');
  });

  it('treats a file as current when its last commit is newer than a stale frontmatter date', async () => {
    initGitRepo(tmpDir);
    await writeFile(tmpDir, 'team-foundry/product/outcomes.md', STALE_CONTENT);
    commitAll(tmpDir, 'update outcomes'); // committed now

    const result = await analyzeFile(tmpDir, 'team-foundry/product/outcomes.md');
    expect(result.health).toBe('ok');
    expect(result.daysSinceUpdate).toBe(0);
  });

  it('counts plain commits since update, not just merge commits (squash-merge safe)', async () => {
    initGitRepo(tmpDir);
    await writeFile(tmpDir, 'team-foundry/product/outcomes.md', STALE_CONTENT);
    commitAll(tmpDir, 'add outcomes', '2020-01-01T12:00:00');
    await writeFile(tmpDir, 'other-a.md', 'unrelated change a');
    commitAll(tmpDir, 'squashed feature a');
    await writeFile(tmpDir, 'other-b.md', 'unrelated change b');
    commitAll(tmpDir, 'squashed feature b');

    const result = await analyzeFile(tmpDir, 'team-foundry/product/outcomes.md');
    expect(result.health).toBe('stale');
    expect(result.commitsSinceUpdate).toBeGreaterThanOrEqual(2);
  });

  it('keeps frontmatter date when the file is untracked', async () => {
    initGitRepo(tmpDir);
    await writeFile(tmpDir, 'team-foundry/product/outcomes.md', STALE_CONTENT);
    // never committed
    const result = await analyzeFile(tmpDir, 'team-foundry/product/outcomes.md');
    expect(result.lastUpdated).toBe('2020-01-01');
    expect(result.health).toBe('stale');
  });
});

describe('runStatus()', () => {
  let tmpDir: string;
  beforeEach(async () => { tmpDir = await makeTempDir(); });
  afterEach(async () => { await cleanup(tmpDir); });

  it('runs without throwing when team-foundry dir is missing', async () => {
    await expect(runStatus(tmpDir)).resolves.not.toThrow();
  });

  it('runs without throwing for a full-profile directory', async () => {
    await writeFile(tmpDir, 'team-foundry/team/trio.md', CURRENT_CONTENT());
    await writeFile(tmpDir, 'team-foundry/product/outcomes.md', CURRENT_CONTENT());
    await expect(runStatus(tmpDir)).resolves.not.toThrow();
  });

  it('checks only solo files when trio.md is absent', async () => {
    // Only solo files exist  -  should not throw or report full-only files as missing unexpectedly
    await writeFile(tmpDir, 'team-foundry/product/outcomes.md', CURRENT_CONTENT());
    await expect(runStatus(tmpDir)).resolves.not.toThrow();
  });

  it('detects full profile when trio.md exists', async () => {
    await writeFile(tmpDir, 'team-foundry/team/trio.md', CURRENT_CONTENT());
    await expect(runStatus(tmpDir)).resolves.not.toThrow();
  });

  it('outputs "No critical drift detected" when all files are current', async () => {
    // Write all solo files so there are no missing/stale/empty findings
    for (const rel of [
      'team-foundry/product/north-star.md',
      'team-foundry/product/outcomes.md',
      'team-foundry/product/customers.md',
      'team-foundry/engineering/stack.md',
    ]) {
      await writeFile(tmpDir, rel, CURRENT_CONTENT());
    }
    const lines: string[] = [];
    const logSpy = vi.spyOn(console, 'log').mockImplementation((...args) => {
      lines.push(args.join(' '));
    });
    await runStatus(tmpDir);
    logSpy.mockRestore();
    expect(lines.some(l => l.includes('No critical drift'))).toBe(true);
  });

  it('includes Top 3 Fix Suggestions section in output', async () => {
    // Create a stale file so there's at least one finding
    await writeFile(tmpDir, 'team-foundry/product/outcomes.md', STALE_CONTENT);
    const lines: string[] = [];
    const logSpy = vi.spyOn(console, 'log').mockImplementation((...args) => {
      lines.push(args.join(' '));
    });
    await runStatus(tmpDir);
    logSpy.mockRestore();
    expect(lines.some(l => l.includes('Top 3 Fix Suggestions'))).toBe(true);
  });

  it('does not output Link Integrity section on solo profile', async () => {
    await writeFile(tmpDir, 'team-foundry/product/outcomes.md', CURRENT_CONTENT());
    const lines: string[] = [];
    const logSpy = vi.spyOn(console, 'log').mockImplementation((...args) => {
      lines.push(args.join(' '));
    });
    await runStatus(tmpDir);
    logSpy.mockRestore();
    expect(lines.some(l => l.includes('Link Integrity'))).toBe(false);
  });

  it('outputs Link Integrity section on full profile when violations exist', async () => {
    // Full profile marker
    await writeFile(tmpDir, 'team-foundry/team/trio.md', CURRENT_CONTENT());
    // assumptions.md with a heading
    await writeFile(tmpDir, 'team-foundry/product/assumptions.md', `---
purpose: test
read_when: always
last_updated: ${today}
owner: Alice
---

## Speed matters

details
`);
    // now-next-later.md with a Now item that has no assumption reference
    await writeFile(tmpDir, 'team-foundry/product/now-next-later.md', `---
purpose: test
read_when: always
last_updated: ${today}
owner: Alice
---

### Now

## Orphan feature

no assumption linked here
`);

    const lines: string[] = [];
    const logSpy = vi.spyOn(console, 'log').mockImplementation((...args) => {
      lines.push(args.join(' '));
    });
    await runStatus(tmpDir);
    logSpy.mockRestore();

    expect(lines.some(l => l.includes('Link Integrity'))).toBe(true);
    expect(lines.some(l => l.includes('Orphan feature'))).toBe(true);
  });
});

describe('checkPointerFiles()', () => {
  let tmpDir: string;

  beforeEach(async () => { tmpDir = await makeTempDir(); });
  afterEach(async () => { await cleanup(tmpDir); });

  it('returns all pointer files as missing when none exist', async () => {
    const results = await checkPointerFiles(tmpDir);
    expect(results).toHaveLength(4);
    expect(results.map((r) => r.relativePath)).toContain('.github/copilot-instructions.md');
    expect(results.every((r) => !r.exists)).toBe(true);
    expect(results.every((r) => !r.drifted)).toBe(true);
  });

  it('marks existing file with AGENTS.md reference as ok (not drifted)', async () => {
    await fs.writeFile(path.join(tmpDir, 'CLAUDE.md'), '@AGENTS.md\nsome content', 'utf-8');
    const results = await checkPointerFiles(tmpDir);
    const claude = results.find((r) => r.relativePath === 'CLAUDE.md')!;
    expect(claude.exists).toBe(true);
    expect(claude.drifted).toBe(false);
  });

  it('marks existing file without AGENTS.md reference as drifted', async () => {
    await fs.writeFile(path.join(tmpDir, 'CLAUDE.md'), '# Old CLAUDE.md\nno reference here', 'utf-8');
    const results = await checkPointerFiles(tmpDir);
    const claude = results.find((r) => r.relativePath === 'CLAUDE.md')!;
    expect(claude.exists).toBe(true);
    expect(claude.drifted).toBe(true);
  });

  it('checks GEMINI.md for a valid @./AGENTS.md import', async () => {
    await fs.writeFile(path.join(tmpDir, 'GEMINI.md'), 'intro\n\n@./AGENTS.md\n', 'utf-8');
    const results = await checkPointerFiles(tmpDir);
    const gemini = results.find((r) => r.relativePath === 'GEMINI.md')!;
    expect(gemini.exists).toBe(true);
    expect(gemini.drifted).toBe(false);
  });

  it('marks GEMINI.md as drifted when it only mentions AGENTS.md in prose', async () => {
    await fs.writeFile(path.join(tmpDir, 'GEMINI.md'), 'read AGENTS.md', 'utf-8');
    const results = await checkPointerFiles(tmpDir);
    const gemini = results.find((r) => r.relativePath === 'GEMINI.md')!;
    expect(gemini.exists).toBe(true);
    expect(gemini.drifted).toBe(true);
  });

  it('checks .cursor/rules/team-foundry.mdc for a valid @AGENTS.md import', async () => {
    const dir = path.join(tmpDir, '.cursor', 'rules');
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, 'team-foundry.mdc'), 'intro\n\n@AGENTS.md\n', 'utf-8');
    const results = await checkPointerFiles(tmpDir);
    const cursor = results.find((r) => r.relativePath === '.cursor/rules/team-foundry.mdc')!;
    expect(cursor.exists).toBe(true);
    expect(cursor.drifted).toBe(false);
  });

  it('marks .cursor rule as drifted when it only mentions AGENTS.md in prose', async () => {
    const dir = path.join(tmpDir, '.cursor', 'rules');
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, 'team-foundry.mdc'), 'read AGENTS.md always', 'utf-8');
    const results = await checkPointerFiles(tmpDir);
    const cursor = results.find((r) => r.relativePath === '.cursor/rules/team-foundry.mdc')!;
    expect(cursor.exists).toBe(true);
    expect(cursor.drifted).toBe(true);
  });

  it('regression: a broken @DOES-NOT-EXIST.md import is not credited just because AGENTS.md appears elsewhere in the file (issue #5)', async () => {
    await fs.writeFile(
      path.join(tmpDir, 'CLAUDE.md'),
      '@DOES-NOT-EXIST.md\n\nThis should import AGENTS.md but the filename above is wrong.',
      'utf-8'
    );
    const results = await checkPointerFiles(tmpDir);
    const claude = results.find((r) => r.relativePath === 'CLAUDE.md')!;
    expect(claude.exists).toBe(true);
    expect(claude.drifted).toBe(true);
  });

  it('marks .github/copilot-instructions.md as ok when it mentions AGENTS.md in backticks', async () => {
    await fs.mkdir(path.join(tmpDir, '.github'), { recursive: true });
    await fs.writeFile(
      path.join(tmpDir, '.github', 'copilot-instructions.md'),
      'Read `AGENTS.md` before answering.',
      'utf-8'
    );
    const results = await checkPointerFiles(tmpDir);
    const copilot = results.find((r) => r.relativePath === '.github/copilot-instructions.md')!;
    expect(copilot.exists).toBe(true);
    expect(copilot.drifted).toBe(false);
  });
});
