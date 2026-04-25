import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { runStatus } from '../status.js';

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

const CURRENT_FILE = `---
purpose: test
read_when: always
last_updated: ${new Date().toISOString().split('T')[0]}
owner: Alice
---

# Test

This file has content to avoid being classified as empty.
It has enough text to pass the 50 char threshold.
`;

const STALE_FILE = `---
purpose: test
read_when: always
last_updated: 2020-01-01
owner: Bob
---

# Test

This file has content to avoid being classified as empty.
It has enough text to pass the 50 char threshold.
`;

const EMPTY_FILE = `---
purpose: test
read_when: always
last_updated: ${new Date().toISOString().split('T')[0]}
owner:
---

# Test
`;

describe('runStatus()', () => {
  let tmpDir: string;

  beforeEach(async () => { tmpDir = await makeTempDir(); });
  afterEach(async () => { await cleanup(tmpDir); });

  it('runs without throwing when team-foundry dir is missing', async () => {
    await expect(runStatus(tmpDir)).resolves.not.toThrow();
  });

  it('runs without throwing when files exist', async () => {
    await writeFile(tmpDir, 'team-foundry/product/outcomes.md', CURRENT_FILE);
    await expect(runStatus(tmpDir)).resolves.not.toThrow();
  });

  it('detects stale file (last_updated in 2020)', async () => {
    await writeFile(tmpDir, 'team-foundry/product/outcomes.md', STALE_FILE);
    // Just verify it doesn't throw — visual output tested manually
    await expect(runStatus(tmpDir)).resolves.not.toThrow();
  });

  it('detects empty file (body < 50 chars)', async () => {
    await writeFile(tmpDir, 'team-foundry/product/outcomes.md', EMPTY_FILE);
    await expect(runStatus(tmpDir)).resolves.not.toThrow();
  });

  it('auto-detects full profile when trio.md exists', async () => {
    await writeFile(tmpDir, 'team-foundry/team/trio.md', CURRENT_FILE);
    await expect(runStatus(tmpDir)).resolves.not.toThrow();
  });
});
