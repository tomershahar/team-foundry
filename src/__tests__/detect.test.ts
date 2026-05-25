import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { detectExistingFiles } from '../detect.js';

async function makeTempDir(): Promise<string> {
  return fs.mkdtemp(path.join(os.tmpdir(), 'tf-detect-test-'));
}

async function cleanup(dir: string): Promise<void> {
  await fs.rm(dir, { recursive: true, force: true });
}

describe('detectExistingFiles()', () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await makeTempDir();
  });

  afterEach(async () => {
    await cleanup(tmpDir);
  });

  it('returns empty array when no root instruction files exist', async () => {
    const found = await detectExistingFiles(tmpDir);
    expect(found).toEqual([]);
  });

  it('detects CLAUDE.md with correct line count', async () => {
    await fs.writeFile(path.join(tmpDir, 'CLAUDE.md'), 'line1\nline2\nline3', 'utf-8');
    const found = await detectExistingFiles(tmpDir);
    expect(found).toHaveLength(1);
    expect(found[0].relativePath).toBe('CLAUDE.md');
    expect(found[0].lineCount).toBe(3);
  });

  it('detects GEMINI.md', async () => {
    await fs.writeFile(path.join(tmpDir, 'GEMINI.md'), 'content', 'utf-8');
    const found = await detectExistingFiles(tmpDir);
    expect(found.map((f) => f.relativePath)).toContain('GEMINI.md');
  });

  it('detects AGENTS.md', async () => {
    await fs.writeFile(path.join(tmpDir, 'AGENTS.md'), 'content', 'utf-8');
    const found = await detectExistingFiles(tmpDir);
    expect(found.map((f) => f.relativePath)).toContain('AGENTS.md');
  });

  it('detects .cursor/rules/*.mdc files', async () => {
    const rulesDir = path.join(tmpDir, '.cursor', 'rules');
    await fs.mkdir(rulesDir, { recursive: true });
    await fs.writeFile(path.join(rulesDir, 'my-rules.mdc'), 'rule content\nline2', 'utf-8');
    const found = await detectExistingFiles(tmpDir);
    expect(found.map((f) => f.relativePath)).toContain('.cursor/rules/my-rules.mdc');
    expect(found.find((f) => f.relativePath === '.cursor/rules/my-rules.mdc')?.lineCount).toBe(2);
  });

  it('detects multiple files at once', async () => {
    await fs.writeFile(path.join(tmpDir, 'CLAUDE.md'), 'a', 'utf-8');
    await fs.writeFile(path.join(tmpDir, 'GEMINI.md'), 'b', 'utf-8');
    const found = await detectExistingFiles(tmpDir);
    expect(found).toHaveLength(2);
  });

  it('detects .cursor/rules/*.md files (not only .mdc)', async () => {
    const rulesDir = path.join(tmpDir, '.cursor', 'rules');
    await fs.mkdir(rulesDir, { recursive: true });
    await fs.writeFile(path.join(rulesDir, 'extra.md'), 'line1\nline2', 'utf-8');
    const found = await detectExistingFiles(tmpDir);
    expect(found.map((f) => f.relativePath)).toContain('.cursor/rules/extra.md');
  });

  it('ignores non-matching files in .cursor/rules/', async () => {
    const rulesDir = path.join(tmpDir, '.cursor', 'rules');
    await fs.mkdir(rulesDir, { recursive: true });
    await fs.writeFile(path.join(rulesDir, 'notes.txt'), 'ignored', 'utf-8');
    const found = await detectExistingFiles(tmpDir);
    expect(found.map((f) => f.relativePath)).not.toContain('.cursor/rules/notes.txt');
  });
});
