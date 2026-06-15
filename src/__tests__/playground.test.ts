import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { runPlayground, PLAYGROUND_DIR } from '../playground.js';
import { PLAYGROUND_FILES } from '../templates/playground/content.js';

async function makeTempDir(): Promise<string> {
  return fs.mkdtemp(path.join(os.tmpdir(), 'tf-playground-test-'));
}

async function cleanup(dir: string): Promise<void> {
  await fs.rm(dir, { recursive: true, force: true });
}

describe('PLAYGROUND_FILES', () => {
  it('bundles a populated foundry (not empty)', () => {
    expect(PLAYGROUND_FILES.length).toBeGreaterThan(10);
  });

  it('includes the AGENTS-readable product context', () => {
    const paths = PLAYGROUND_FILES.map((f) => f.relativePath);
    expect(paths).toContain('team-foundry/product/outcomes.md');
  });

  it('every entry has non-empty content', () => {
    for (const f of PLAYGROUND_FILES) {
      expect(f.content.trim().length).toBeGreaterThan(0);
    }
  });
});

describe('runPlayground()', () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await makeTempDir();
  });

  afterEach(async () => {
    await cleanup(tmpDir);
  });

  it('writes the playground into a dedicated subdirectory', async () => {
    const written = await runPlayground(tmpDir);
    expect(written.length).toBe(PLAYGROUND_FILES.length);
    const sample = path.join(tmpDir, PLAYGROUND_DIR, 'team-foundry/product/outcomes.md');
    const content = await fs.readFile(sample, 'utf-8');
    expect(content.trim().length).toBeGreaterThan(0);
  });

  it('creates nested directories as needed', async () => {
    await runPlayground(tmpDir);
    const nested = path.join(tmpDir, PLAYGROUND_DIR, 'team-foundry/engineering/decisions');
    const stat = await fs.stat(nested);
    expect(stat.isDirectory()).toBe(true);
  });

  it('refuses to overwrite a non-empty playground directory', async () => {
    const dest = path.join(tmpDir, PLAYGROUND_DIR);
    await fs.mkdir(dest, { recursive: true });
    await fs.writeFile(path.join(dest, 'keep.md'), 'existing');
    await expect(runPlayground(tmpDir)).rejects.toThrow(/already exists/i);
  });

  it('succeeds when the target subdirectory does not exist yet', async () => {
    const written = await runPlayground(tmpDir);
    expect(written.length).toBeGreaterThan(0);
  });
});
