import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { detectMigrateState, detectTool, writeIfAbsent, appendFrontmatterFields, runMigrate } from '../migrate.js';

vi.mock('@clack/prompts', () => ({
  confirm: vi.fn(),
  log: { info: vi.fn(), error: vi.fn() },
  outro: vi.fn(),
}));

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

describe('v3 — migrate: detectTool', () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await makeTempDir();
  });

  afterEach(async () => {
    await cleanup(tmpDir);
  });

  it('detects claude when CLAUDE.md is present', async () => {
    await fs.writeFile(path.join(tmpDir, 'CLAUDE.md'), '', 'utf-8');
    expect(await detectTool(tmpDir)).toBe('claude');
  });

  it('detects gemini when GEMINI.md is present', async () => {
    await fs.writeFile(path.join(tmpDir, 'GEMINI.md'), '', 'utf-8');
    expect(await detectTool(tmpDir)).toBe('gemini');
  });

  it('detects cursor when .cursor/rules/team-foundry.mdc is present', async () => {
    await fs.mkdir(path.join(tmpDir, '.cursor', 'rules'), { recursive: true });
    await fs.writeFile(path.join(tmpDir, '.cursor', 'rules', 'team-foundry.mdc'), '', 'utf-8');
    expect(await detectTool(tmpDir)).toBe('cursor');
  });

  it('defaults to claude when no root file is found', async () => {
    expect(await detectTool(tmpDir)).toBe('claude');
  });

  it('prefers cursor over gemini when both files exist', async () => {
    await fs.mkdir(path.join(tmpDir, '.cursor', 'rules'), { recursive: true });
    await fs.writeFile(path.join(tmpDir, '.cursor', 'rules', 'team-foundry.mdc'), '', 'utf-8');
    await fs.writeFile(path.join(tmpDir, 'GEMINI.md'), '', 'utf-8');
    expect(await detectTool(tmpDir)).toBe('cursor');
  });
});

describe('v3 — migrate: runMigrate orchestration', () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await makeTempDir();
    vi.clearAllMocks();
  });

  afterEach(async () => {
    await cleanup(tmpDir);
  });

  it('exits early with error when no .team-foundry directory exists', async () => {
    const { log } = await import('@clack/prompts');
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => { throw new Error('process.exit'); });

    await expect(runMigrate(tmpDir)).rejects.toThrow('process.exit');
    expect(log.error).toHaveBeenCalledWith(expect.stringContaining('No existing team-foundry found'));
    exitSpy.mockRestore();
  });

  it('exits early with outro when already on v3 (hierarchy.md present)', async () => {
    const { outro } = await import('@clack/prompts');
    await fs.mkdir(path.join(tmpDir, '.team-foundry'), { recursive: true });
    await fs.writeFile(path.join(tmpDir, '.team-foundry', 'hierarchy.md'), '# Hierarchy\n', 'utf-8');

    await runMigrate(tmpDir);
    expect(outro).toHaveBeenCalledWith(expect.stringContaining('Already on v3'));
  });

  it('cancels without writing files when user declines confirmation', async () => {
    const { confirm, outro } = await import('@clack/prompts');
    vi.mocked(confirm).mockResolvedValue(false);

    await fs.mkdir(path.join(tmpDir, '.team-foundry'), { recursive: true });
    await fs.writeFile(path.join(tmpDir, '.team-foundry', 'coach.md'), '# Coach\n', 'utf-8');

    await runMigrate(tmpDir);
    expect(outro).toHaveBeenCalledWith(expect.stringContaining('cancelled'));

    const hierarchyExists = await fs.access(path.join(tmpDir, '.team-foundry', 'hierarchy.md')).then(() => true).catch(() => false);
    expect(hierarchyExists).toBe(false);
  });

  it('writes v3 files when user confirms on a v2 install', async () => {
    const { confirm } = await import('@clack/prompts');
    vi.mocked(confirm).mockResolvedValue(true);

    await fs.mkdir(path.join(tmpDir, '.team-foundry'), { recursive: true });
    await fs.writeFile(path.join(tmpDir, '.team-foundry', 'coach.md'), '# Coach\n', 'utf-8');
    await fs.writeFile(path.join(tmpDir, 'CLAUDE.md'), '# Root\n', 'utf-8');

    await runMigrate(tmpDir);

    const hierarchy = await fs.access(path.join(tmpDir, '.team-foundry', 'hierarchy.md')).then(() => true).catch(() => false);
    const hooks = await fs.access(path.join(tmpDir, '.team-foundry', 'instructions', 'hooks.md')).then(() => true).catch(() => false);
    const rules = await fs.access(path.join(tmpDir, '.team-foundry', 'instructions', 'rules.md')).then(() => true).catch(() => false);
    expect(hierarchy).toBe(true);
    expect(hooks).toBe(true);
    expect(rules).toBe(true);
  });

  it('does not overwrite existing v3 files on re-run', async () => {
    const { confirm } = await import('@clack/prompts');
    vi.mocked(confirm).mockResolvedValue(true);

    await fs.mkdir(path.join(tmpDir, '.team-foundry'), { recursive: true });
    await fs.writeFile(path.join(tmpDir, '.team-foundry', 'coach.md'), '# Coach\n', 'utf-8');
    const existingHierarchy = '# My custom hierarchy\n';
    await fs.writeFile(path.join(tmpDir, '.team-foundry', 'hierarchy.md'), existingHierarchy, 'utf-8');

    // Re-running on what now looks like v3 should short-circuit
    await runMigrate(tmpDir);
    const content = await fs.readFile(path.join(tmpDir, '.team-foundry', 'hierarchy.md'), 'utf-8');
    expect(content).toBe(existingHierarchy);
  });
});
