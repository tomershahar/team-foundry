import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { scaffold, expectedPaths } from '../scaffold.js';
import type { ScaffoldOptions } from '../types.js';

async function makeTempDir(): Promise<string> {
  return fs.mkdtemp(path.join(os.tmpdir(), 'team-foundry-test-'));
}

async function cleanup(dir: string): Promise<void> {
  await fs.rm(dir, { recursive: true, force: true });
}

const baseOptions: ScaffoldOptions = {
  profile: 'full',
  tool: 'claude',
  repoVisibility: 'internal',
  date: '2026-04-17',
  targetDir: '', // set per test
  ingestion: 'skip',
};

describe('scaffold()', () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await makeTempDir();
  });

  afterEach(async () => {
    await cleanup(tmpDir);
  });

  it('writes CLAUDE.md for claude tool', async () => {
    await scaffold({ ...baseOptions, targetDir: tmpDir });
    const exists = await fs
      .access(path.join(tmpDir, 'CLAUDE.md'))
      .then(() => true)
      .catch(() => false);
    expect(exists).toBe(true);
  });

  it('writes GEMINI.md for gemini tool', async () => {
    await scaffold({ ...baseOptions, tool: 'gemini', targetDir: tmpDir });
    expect(
      await fs
        .access(path.join(tmpDir, 'GEMINI.md'))
        .then(() => true)
        .catch(() => false),
    ).toBe(true);
    expect(
      await fs
        .access(path.join(tmpDir, 'CLAUDE.md'))
        .then(() => true)
        .catch(() => false),
    ).toBe(false);
  });

  it('writes both CLAUDE.md and GEMINI.md for both tool', async () => {
    await scaffold({ ...baseOptions, tool: 'both', targetDir: tmpDir });
    for (const name of ['CLAUDE.md', 'GEMINI.md']) {
      expect(
        await fs
          .access(path.join(tmpDir, name))
          .then(() => true)
          .catch(() => false),
      ).toBe(true);
    }
  });

  it('solo profile writes correct files', async () => {
    await scaffold({ ...baseOptions, profile: 'solo', targetDir: tmpDir });
    const paths = expectedPaths('solo', 'claude');

    for (const p of paths) {
      const exists = await fs
        .access(path.join(tmpDir, p))
        .then(() => true)
        .catch(() => false);
      expect(exists, `Expected ${p} to exist`).toBe(true);
    }
  });

  it('solo profile does not write full-only files', async () => {
    await scaffold({ ...baseOptions, profile: 'solo', targetDir: tmpDir });
    const fullOnlyPaths = expectedPaths('full', 'claude').filter(
      (p) => !expectedPaths('solo', 'claude').includes(p),
    );

    for (const p of fullOnlyPaths) {
      const exists = await fs
        .access(path.join(tmpDir, p))
        .then(() => true)
        .catch(() => false);
      expect(exists, `Expected ${p} NOT to exist for solo profile`).toBe(false);
    }
  });

  it('full profile writes all expected files', async () => {
    await scaffold({ ...baseOptions, targetDir: tmpDir });
    const paths = expectedPaths('full', 'claude');

    for (const p of paths) {
      const exists = await fs
        .access(path.join(tmpDir, p))
        .then(() => true)
        .catch(() => false);
      expect(exists, `Expected ${p} to exist`).toBe(true);
    }
  });

  it('creates nested directories as needed', async () => {
    await scaffold({ ...baseOptions, targetDir: tmpDir });
    const dirExists = await fs
      .access(path.join(tmpDir, 'team-foundry', 'engineering', 'decisions'))
      .then(() => true)
      .catch(() => false);
    expect(dirExists).toBe(true);
  });

  it('does not crash if targetDir already exists', async () => {
    await expect(scaffold({ ...baseOptions, targetDir: tmpDir })).resolves.not.toThrow();
  });

  it('skips existing files without error', async () => {
    const claudePath = path.join(tmpDir, 'CLAUDE.md');
    await fs.writeFile(claudePath, 'existing content', 'utf-8');

    await scaffold({ ...baseOptions, targetDir: tmpDir });

    const content = await fs.readFile(claudePath, 'utf-8');
    expect(content).toBe('existing content');
  });

  it('generated files contain frontmatter', async () => {
    await scaffold({ ...baseOptions, targetDir: tmpDir });
    const content = await fs.readFile(
      path.join(tmpDir, 'team-foundry/product/outcomes.md'),
      'utf-8',
    );
    expect(content).toContain('purpose:');
    expect(content).toContain('read_when:');
    expect(content).toContain('last_updated: 2026-04-17');
  });
});

describe('expectedPaths()', () => {
  it('returns 1 root for claude', () => {
    const paths = expectedPaths('full', 'claude');
    expect(paths.filter((p) => p === 'CLAUDE.md' || p === 'GEMINI.md')).toHaveLength(1);
    expect(paths).toContain('CLAUDE.md');
  });

  it('returns 2 roots for both', () => {
    const paths = expectedPaths('full', 'both');
    expect(paths).toContain('CLAUDE.md');
    expect(paths).toContain('GEMINI.md');
  });

  it('solo has fewer paths than full', () => {
    expect(expectedPaths('solo', 'claude').length).toBeLessThan(
      expectedPaths('full', 'claude').length,
    );
  });

  it('solo profile produces exactly 7 files (matches README)', () => {
    expect(expectedPaths('solo', 'claude').length).toBe(7);
  });

  it('full profile produces exactly 20 files (matches README)', () => {
    expect(expectedPaths('full', 'claude').length).toBe(20);
  });
});
