import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { runStatus, analyzeFile, parseFrontmatter, daysSince } from '../status.js';

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
    // Only solo files exist — should not throw or report full-only files as missing unexpectedly
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
});
