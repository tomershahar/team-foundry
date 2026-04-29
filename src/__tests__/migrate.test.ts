import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { detectMigrateState, writeIfAbsent, appendFrontmatterFields } from '../migrate.js';

async function makeTempDir(): Promise<string> {
  return fs.mkdtemp(path.join(os.tmpdir(), 'team-foundry-migrate-test-'));
}

async function cleanup(dir: string): Promise<void> {
  await fs.rm(dir, { recursive: true, force: true });
}

describe('v3 Task 11 — migrate: detectMigrateState', () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await makeTempDir();
  });

  afterEach(async () => {
    await cleanup(tmpDir);
  });

  it('returns "none" when no .team-foundry directory exists', async () => {
    const state = await detectMigrateState(tmpDir);
    expect(state).toBe('none');
  });

  it('returns "v2" when .team-foundry exists without hierarchy.md', async () => {
    await fs.mkdir(path.join(tmpDir, '.team-foundry'), { recursive: true });
    await fs.writeFile(path.join(tmpDir, '.team-foundry', 'coach.md'), '# Coach\n', 'utf-8');
    const state = await detectMigrateState(tmpDir);
    expect(state).toBe('v2');
  });

  it('returns "v3" when .team-foundry/hierarchy.md is present', async () => {
    await fs.mkdir(path.join(tmpDir, '.team-foundry'), { recursive: true });
    await fs.writeFile(path.join(tmpDir, '.team-foundry', 'coach.md'), '# Coach\n', 'utf-8');
    await fs.writeFile(path.join(tmpDir, '.team-foundry', 'hierarchy.md'), '# Hierarchy\n', 'utf-8');
    const state = await detectMigrateState(tmpDir);
    expect(state).toBe('v3');
  });

  it('returns "v3" even when hierarchy.md is the only file present', async () => {
    await fs.mkdir(path.join(tmpDir, '.team-foundry'), { recursive: true });
    await fs.writeFile(path.join(tmpDir, '.team-foundry', 'hierarchy.md'), '# Hierarchy\n', 'utf-8');
    const state = await detectMigrateState(tmpDir);
    expect(state).toBe('v3');
  });
});

describe('v3 Task 12 — migrate: writeIfAbsent', () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await makeTempDir();
  });

  afterEach(async () => {
    await cleanup(tmpDir);
  });

  it('writes the file when it does not exist', async () => {
    const filePath = path.join(tmpDir, 'new-file.md');
    await writeIfAbsent(filePath, '# Hello\n');
    const content = await fs.readFile(filePath, 'utf-8');
    expect(content).toBe('# Hello\n');
  });

  it('does not overwrite an existing file', async () => {
    const filePath = path.join(tmpDir, 'existing.md');
    await fs.writeFile(filePath, '# Original\n', 'utf-8');
    await writeIfAbsent(filePath, '# Replacement\n');
    const content = await fs.readFile(filePath, 'utf-8');
    expect(content).toBe('# Original\n');
  });

  it('creates intermediate directories', async () => {
    const filePath = path.join(tmpDir, 'a', 'b', 'c.md');
    await writeIfAbsent(filePath, '# Nested\n');
    const content = await fs.readFile(filePath, 'utf-8');
    expect(content).toBe('# Nested\n');
  });
});

describe('v3 Task 13 — migrate: appendFrontmatterFields', () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await makeTempDir();
  });

  afterEach(async () => {
    await cleanup(tmpDir);
  });

  it('appends source: and last_validated: when both are missing', async () => {
    const filePath = path.join(tmpDir, 'outcomes.md');
    await fs.writeFile(filePath, '---\npurpose: test\nowner:\n---\n\n# Outcomes\n', 'utf-8');
    await appendFrontmatterFields(filePath);
    const content = await fs.readFile(filePath, 'utf-8');
    expect(content).toContain('source: ~');
    expect(content).toContain('last_validated: ~');
  });

  it('does not duplicate source: if already present', async () => {
    const filePath = path.join(tmpDir, 'outcomes.md');
    await fs.writeFile(filePath, '---\npurpose: test\nsource: Q1 2026\nowner:\n---\n\n# Body\n', 'utf-8');
    await appendFrontmatterFields(filePath);
    const content = await fs.readFile(filePath, 'utf-8');
    const count = (content.match(/source:/g) || []).length;
    expect(count).toBe(1);
  });

  it('does not duplicate last_validated: if already present', async () => {
    const filePath = path.join(tmpDir, 'outcomes.md');
    await fs.writeFile(filePath, '---\npurpose: test\nlast_validated: 2026-01-01\nowner:\n---\n\n# Body\n', 'utf-8');
    await appendFrontmatterFields(filePath);
    const content = await fs.readFile(filePath, 'utf-8');
    const count = (content.match(/last_validated:/g) || []).length;
    expect(count).toBe(1);
  });

  it('preserves content below the closing --- delimiter exactly', async () => {
    const body = '\n# Outcomes\n\nSome content here.\n\n## This quarter\n\n- Item one\n';
    const filePath = path.join(tmpDir, 'outcomes.md');
    await fs.writeFile(filePath, `---\npurpose: test\nowner:\n---${body}`, 'utf-8');
    await appendFrontmatterFields(filePath);
    const content = await fs.readFile(filePath, 'utf-8');
    expect(content.endsWith(body)).toBe(true);
  });

  it('skips files without YAML frontmatter', async () => {
    const filePath = path.join(tmpDir, 'no-frontmatter.md');
    const original = '# No frontmatter here\n\nJust content.\n';
    await fs.writeFile(filePath, original, 'utf-8');
    await appendFrontmatterFields(filePath);
    const content = await fs.readFile(filePath, 'utf-8');
    expect(content).toBe(original);
  });

  it('skips gracefully when the file does not exist', async () => {
    await expect(
      appendFrontmatterFields(path.join(tmpDir, 'nonexistent.md'))
    ).resolves.toBeUndefined();
  });
});
