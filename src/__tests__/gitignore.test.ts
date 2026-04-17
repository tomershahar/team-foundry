import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { writeGitignore } from '../gitignore.js';

async function makeTempDir(): Promise<string> {
  return fs.mkdtemp(path.join(os.tmpdir(), 'team-foundry-gi-test-'));
}

async function cleanup(dir: string): Promise<void> {
  await fs.rm(dir, { recursive: true, force: true });
}

describe('writeGitignore()', () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await makeTempDir();
  });

  afterEach(async () => {
    await cleanup(tmpDir);
  });

  it('creates .gitignore with the entry when file does not exist', async () => {
    await writeGitignore(tmpDir);
    const content = await fs.readFile(path.join(tmpDir, '.gitignore'), 'utf-8');
    expect(content).toContain('team-foundry/private/');
  });

  it('appends entry to existing .gitignore', async () => {
    const gitignorePath = path.join(tmpDir, '.gitignore');
    await fs.writeFile(gitignorePath, 'node_modules/\ndist/\n', 'utf-8');

    await writeGitignore(tmpDir);

    const content = await fs.readFile(gitignorePath, 'utf-8');
    expect(content).toContain('node_modules/');
    expect(content).toContain('dist/');
    expect(content).toContain('team-foundry/private/');
  });

  it('preserves existing content when appending', async () => {
    const gitignorePath = path.join(tmpDir, '.gitignore');
    const original = 'node_modules/\n*.env\n';
    await fs.writeFile(gitignorePath, original, 'utf-8');

    await writeGitignore(tmpDir);

    const content = await fs.readFile(gitignorePath, 'utf-8');
    expect(content.startsWith('node_modules/')).toBe(true);
  });

  it('is a no-op if entry already present', async () => {
    const gitignorePath = path.join(tmpDir, '.gitignore');
    await fs.writeFile(gitignorePath, 'node_modules/\nteam-foundry/private/\n', 'utf-8');

    await writeGitignore(tmpDir);

    const content = await fs.readFile(gitignorePath, 'utf-8');
    const count = content.split('team-foundry/private/').length - 1;
    expect(count).toBe(1);
  });

  it('does not duplicate entry when called twice', async () => {
    await writeGitignore(tmpDir);
    await writeGitignore(tmpDir);

    const content = await fs.readFile(path.join(tmpDir, '.gitignore'), 'utf-8');
    const count = content.split('team-foundry/private/').length - 1;
    expect(count).toBe(1);
  });

  it('appends with a newline separator when existing file has no trailing newline', async () => {
    const gitignorePath = path.join(tmpDir, '.gitignore');
    await fs.writeFile(gitignorePath, 'node_modules/', 'utf-8');

    await writeGitignore(tmpDir);

    const content = await fs.readFile(gitignorePath, 'utf-8');
    expect(content).toBe('node_modules/\nteam-foundry/private/\n');
  });
});
