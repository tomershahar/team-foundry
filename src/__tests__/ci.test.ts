import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { runInitCi, CI_WORKFLOW_PATH } from '../ci.js';

describe('runInitCi()', () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'tf-initci-test-'));
  });

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  it('writes the workflow file and returns its path', async () => {
    const written = await runInitCi(tmpDir);
    expect(written).toBe(CI_WORKFLOW_PATH);
    const content = await fs.readFile(path.join(tmpDir, CI_WORKFLOW_PATH), 'utf-8');
    expect(content).toContain('create-team-foundry status --ci');
    expect(content).toContain('fetch-depth: 0');
  });

  it('does not overwrite an existing workflow', async () => {
    const full = path.join(tmpDir, CI_WORKFLOW_PATH);
    await fs.mkdir(path.dirname(full), { recursive: true });
    await fs.writeFile(full, 'custom workflow');
    const written = await runInitCi(tmpDir);
    expect(written).toBeNull();
    expect(await fs.readFile(full, 'utf-8')).toBe('custom workflow');
  });
});
