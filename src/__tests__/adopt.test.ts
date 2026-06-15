import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import {
  detectAdoptableFiles,
  buildAdoptedContent,
  runAdopt,
  IMPORTED_RULES_PATH,
} from '../adopt.js';

async function makeTempDir(): Promise<string> {
  return fs.mkdtemp(path.join(os.tmpdir(), 'tf-adopt-test-'));
}

async function write(dir: string, rel: string, content: string): Promise<void> {
  const full = path.join(dir, rel);
  await fs.mkdir(path.dirname(full), { recursive: true });
  await fs.writeFile(full, content);
}

describe('buildAdoptedContent()', () => {
  it('renders a section per source with provenance', () => {
    const doc = buildAdoptedContent(
      [
        { source: '.cursorrules', content: 'Always use tabs.' },
        { source: 'CLAUDE.md', content: 'Be terse.' },
      ],
      '2026-06-15',
    );
    expect(doc).toContain('## From `.cursorrules`');
    expect(doc).toContain('Always use tabs.');
    expect(doc).toContain('## From `CLAUDE.md`');
    expect(doc).toContain('Be terse.');
    expect(doc).toContain('last_updated: 2026-06-15');
  });
});

describe('detectAdoptableFiles()', () => {
  let tmpDir: string;
  beforeEach(async () => { tmpDir = await makeTempDir(); });
  afterEach(async () => { await fs.rm(tmpDir, { recursive: true, force: true }); });

  it('finds pre-existing rules files', async () => {
    await write(tmpDir, '.cursorrules', 'rule one');
    await write(tmpDir, 'CLAUDE.md', 'my project claude rules');
    const found = await detectAdoptableFiles(tmpDir);
    const sources = found.map((f) => f.source);
    expect(sources).toContain('.cursorrules');
    expect(sources).toContain('CLAUDE.md');
  });

  it('skips files already managed by team-foundry', async () => {
    await write(tmpDir, 'CLAUDE.md', 'This repo uses team-foundry. See AGENTS.md.');
    const found = await detectAdoptableFiles(tmpDir);
    expect(found.map((f) => f.source)).not.toContain('CLAUDE.md');
  });

  it('skips empty files', async () => {
    await write(tmpDir, '.cursorrules', '   \n');
    const found = await detectAdoptableFiles(tmpDir);
    expect(found).toHaveLength(0);
  });

  it('finds .cursor/rules/*.mdc but skips team-foundry.mdc', async () => {
    await write(tmpDir, '.cursor/rules/style.mdc', 'custom style rule');
    await write(tmpDir, '.cursor/rules/team-foundry.mdc', 'points at AGENTS.md (team-foundry)');
    const found = await detectAdoptableFiles(tmpDir);
    const sources = found.map((f) => f.source);
    expect(sources).toContain('.cursor/rules/style.mdc');
    expect(sources).not.toContain('.cursor/rules/team-foundry.mdc');
  });
});

describe('runAdopt()', () => {
  let tmpDir: string;
  beforeEach(async () => { tmpDir = await makeTempDir(); });
  afterEach(async () => { await fs.rm(tmpDir, { recursive: true, force: true }); });

  it('writes imported-rules.md from detected files', async () => {
    await write(tmpDir, '.cursorrules', 'tabs not spaces');
    const result = await runAdopt(tmpDir, '2026-06-15');
    expect(result.written).toBe(IMPORTED_RULES_PATH);
    expect(result.sources).toContain('.cursorrules');
    const content = await fs.readFile(path.join(tmpDir, IMPORTED_RULES_PATH), 'utf-8');
    expect(content).toContain('tabs not spaces');
  });

  it('returns written: null when nothing to adopt', async () => {
    const result = await runAdopt(tmpDir, '2026-06-15');
    expect(result.written).toBeNull();
  });

  it('refuses to overwrite an existing imported-rules.md', async () => {
    await write(tmpDir, '.cursorrules', 'rule');
    await write(tmpDir, IMPORTED_RULES_PATH, 'existing import');
    await expect(runAdopt(tmpDir, '2026-06-15')).rejects.toThrow(/already exists/i);
  });
});
