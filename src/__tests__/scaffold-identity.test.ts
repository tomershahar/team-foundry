import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { spawnSync } from 'child_process';
import { scaffold } from '../scaffold.js';

const baseOpts = {
  profile: 'solo' as const,
  tool: 'claude' as const,
  repoVisibility: 'private' as const,
  date: '2026-06-15',
  ingestion: 'skip' as const,
};

async function read(dir: string, rel: string): Promise<string> {
  return fs.readFile(path.join(dir, rel), 'utf-8');
}

describe('scaffold project identity', () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'tf-ident-test-'));
  });

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  it('fills AGENTS.md project overview from package.json', async () => {
    await fs.writeFile(
      path.join(tmpDir, 'package.json'),
      JSON.stringify({ name: 'acme-app', description: 'Acme does invoicing for SMBs.' }),
    );
    await scaffold({ ...baseOpts, targetDir: tmpDir });
    const agents = await read(tmpDir, 'AGENTS.md');
    expect(agents).toContain('**acme-app**');
    expect(agents).toContain('Acme does invoicing for SMBs.');
    expect(agents).not.toContain("project overview hasn't been filled in");
  });

  it('keeps the GAP placeholder when nothing is extractable', async () => {
    await scaffold({ ...baseOpts, targetDir: tmpDir });
    const agents = await read(tmpDir, 'AGENTS.md');
    expect(agents).toContain("project overview hasn't been filled in");
  });

  it('defaults empty owner frontmatter to the git user name', async () => {
    spawnSync('git', ['-C', tmpDir, 'init'], { encoding: 'utf-8' });
    spawnSync('git', ['-C', tmpDir, 'config', 'user.name', 'Casey Dev'], { encoding: 'utf-8' });
    await scaffold({ ...baseOpts, targetDir: tmpDir });
    const northStar = await read(tmpDir, 'team-foundry/product/north-star.md');
    expect(northStar).toMatch(/^owner: Casey Dev$/m);
  });
});
