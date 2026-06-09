import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { scaffold, expectedPaths, gitAddCommand } from '../scaffold.js';
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

  it('solo profile produces exactly 14 files (8 base + 6 skills)', () => {
    expect(expectedPaths('solo', 'claude').length).toBe(14);
  });

  it('full profile includes all v3 architecture files', () => {
    const paths = expectedPaths('full', 'claude');
    expect(paths).toContain('.team-foundry/hierarchy.md');
    expect(paths).toContain('.team-foundry/instructions/hooks.md');
  });

  it('full profile has more files than solo', () => {
    expect(expectedPaths('full', 'claude').length).toBeGreaterThan(
      expectedPaths('solo', 'claude').length,
    );
  });

  it('full profile federated has 6 more files than full flat (one per folder CLAUDE.md)', () => {
    const flat = expectedPaths('full', 'claude', false);
    const federated = expectedPaths('full', 'claude', true);
    expect(federated.length - flat.length).toBe(6);
  });

  it('solo profile federated still produces 14 files (federated ignored, skills included)', () => {
    expect(expectedPaths('solo', 'claude', true).length).toBe(14);
  });

  it('cursor tool produces .cursor/rules/team-foundry.mdc', () => {
    const paths = expectedPaths('full', 'cursor');
    expect(paths).toContain('.cursor/rules/team-foundry.mdc');
  });

  it('cursor tool does not produce CLAUDE.md or GEMINI.md', () => {
    const paths = expectedPaths('full', 'cursor');
    expect(paths).not.toContain('CLAUDE.md');
    expect(paths).not.toContain('GEMINI.md');
  });

  it('cursor solo profile produces exactly 8 files', () => {
    expect(expectedPaths('solo', 'cursor').length).toBe(8);
  });

  it('cursor full profile has fewer files than claude full profile (no skills)', () => {
    expect(expectedPaths('full', 'cursor').length).toBeLessThan(
      expectedPaths('full', 'claude').length,
    );
  });
});

describe('scaffold()  -  cursor tool', () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await makeTempDir();
  });

  afterEach(async () => {
    await cleanup(tmpDir);
  });

  it('writes .cursor/rules/team-foundry.mdc for cursor tool', async () => {
    await scaffold({ ...baseOptions, tool: 'cursor', targetDir: tmpDir });
    const exists = await fs
      .access(path.join(tmpDir, '.cursor/rules/team-foundry.mdc'))
      .then(() => true)
      .catch(() => false);
    expect(exists).toBe(true);
  });

  it('does not write CLAUDE.md or GEMINI.md for cursor tool', async () => {
    await scaffold({ ...baseOptions, tool: 'cursor', targetDir: tmpDir });
    for (const name of ['CLAUDE.md', 'GEMINI.md']) {
      const exists = await fs
        .access(path.join(tmpDir, name))
        .then(() => true)
        .catch(() => false);
      expect(exists, `${name} should not exist for cursor tool`).toBe(false);
    }
  });
});

describe('Phase 8  -  Task 16: Claude Code skill paths in expectedPaths()', () => {
  const SKILL_PATHS = [
    '.claude/skills/team-foundry-intro.md',
    '.claude/skills/team-foundry-status.md',
    '.claude/skills/team-foundry-review.md',
    '.claude/skills/team-foundry-capture.md',
    '.claude/skills/team-foundry-decision.md',
    '.claude/skills/team-foundry-feature.md',
  ];

  it('full profile claude tool includes all 6 skill paths', () => {
    const paths = expectedPaths('full', 'claude');
    for (const p of SKILL_PATHS) {
      expect(paths).toContain(p);
    }
  });

  it('solo profile claude tool includes all 6 skill paths', () => {
    const paths = expectedPaths('solo', 'claude');
    for (const p of SKILL_PATHS) {
      expect(paths).toContain(p);
    }
  });

  it('both tool includes all 6 skill paths', () => {
    const paths = expectedPaths('full', 'both');
    for (const p of SKILL_PATHS) {
      expect(paths).toContain(p);
    }
  });

  it('gemini tool does NOT include skill paths', () => {
    const paths = expectedPaths('full', 'gemini');
    for (const p of SKILL_PATHS) {
      expect(paths).not.toContain(p);
    }
  });

  it('cursor tool does NOT include skill paths', () => {
    const paths = expectedPaths('full', 'cursor');
    for (const p of SKILL_PATHS) {
      expect(paths).not.toContain(p);
    }
  });
});

describe('Phase 8  -  Task 16: scaffold() writes skill files for claude tool', () => {
  let tmpDir: string;

  beforeEach(async () => { tmpDir = await makeTempDir(); });
  afterEach(async () => { await cleanup(tmpDir); });

  const SKILL_PATHS = [
    '.claude/skills/team-foundry-intro.md',
    '.claude/skills/team-foundry-status.md',
    '.claude/skills/team-foundry-review.md',
    '.claude/skills/team-foundry-capture.md',
    '.claude/skills/team-foundry-decision.md',
    '.claude/skills/team-foundry-feature.md',
  ];

  it('writes all 6 skill files for claude tool', async () => {
    await scaffold({ ...baseOptions, tool: 'claude', targetDir: tmpDir });
    for (const p of SKILL_PATHS) {
      const exists = await fs.access(path.join(tmpDir, p)).then(() => true).catch(() => false);
      expect(exists, `${p} should exist for claude tool`).toBe(true);
    }
  });

  it('writes all 6 skill files for both tool', async () => {
    await scaffold({ ...baseOptions, tool: 'both', targetDir: tmpDir });
    for (const p of SKILL_PATHS) {
      const exists = await fs.access(path.join(tmpDir, p)).then(() => true).catch(() => false);
      expect(exists, `${p} should exist for both tool`).toBe(true);
    }
  });

  it('does NOT write skill files for gemini tool', async () => {
    await scaffold({ ...baseOptions, tool: 'gemini', targetDir: tmpDir });
    for (const p of SKILL_PATHS) {
      const exists = await fs.access(path.join(tmpDir, p)).then(() => true).catch(() => false);
      expect(exists, `${p} should not exist for gemini tool`).toBe(false);
    }
  });

  it('does NOT write skill files for cursor tool', async () => {
    await scaffold({ ...baseOptions, tool: 'cursor', targetDir: tmpDir });
    for (const p of SKILL_PATHS) {
      const exists = await fs.access(path.join(tmpDir, p)).then(() => true).catch(() => false);
      expect(exists, `${p} should not exist for cursor tool`).toBe(false);
    }
  });
});

describe('scaffold()  -  federated mode', () => {
  let tmpDir: string;

  beforeEach(async () => { tmpDir = await makeTempDir(); });
  afterEach(async () => { await cleanup(tmpDir); });

  const federatedFolders = ['product', 'team', 'engineering', 'design', 'data', 'context'];

  it('flat mode does not write folder-level CLAUDE.md files', async () => {
    await scaffold({ ...baseOptions, federated: false, targetDir: tmpDir });
    for (const folder of federatedFolders) {
      const exists = await fs
        .access(path.join(tmpDir, `team-foundry/${folder}/CLAUDE.md`))
        .then(() => true).catch(() => false);
      expect(exists, `team-foundry/${folder}/CLAUDE.md should not exist in flat mode`).toBe(false);
    }
  });

  it('federated mode writes CLAUDE.md in each major folder', async () => {
    await scaffold({ ...baseOptions, federated: true, targetDir: tmpDir });
    for (const folder of federatedFolders) {
      const exists = await fs
        .access(path.join(tmpDir, `team-foundry/${folder}/CLAUDE.md`))
        .then(() => true).catch(() => false);
      expect(exists, `team-foundry/${folder}/CLAUDE.md should exist in federated mode`).toBe(true);
    }
  });

  it('federated mode still writes the root CLAUDE.md', async () => {
    await scaffold({ ...baseOptions, federated: true, targetDir: tmpDir });
    const exists = await fs
      .access(path.join(tmpDir, 'CLAUDE.md'))
      .then(() => true).catch(() => false);
    expect(exists).toBe(true);
  });

  it('federated mode is ignored for solo profile', async () => {
    await scaffold({ ...baseOptions, profile: 'solo', federated: true, targetDir: tmpDir });
    for (const folder of federatedFolders) {
      const exists = await fs
        .access(path.join(tmpDir, `team-foundry/${folder}/CLAUDE.md`))
        .then(() => true).catch(() => false);
      expect(exists, `team-foundry/${folder}/CLAUDE.md should not exist for solo profile`).toBe(false);
    }
  });
});

describe('scaffold()  -  returns written file paths', () => {
  let tmpDir: string;
  beforeEach(async () => { tmpDir = await makeTempDir(); });
  afterEach(async () => { await cleanup(tmpDir); });

  it('returns an array of relative paths for files written', async () => {
    const written = await scaffold({ ...baseOptions, targetDir: tmpDir });
    expect(Array.isArray(written)).toBe(true);
    expect(written.length).toBeGreaterThan(0);
  });

  it('returns only files that were written, not skipped', async () => {
    const written1 = await scaffold({ ...baseOptions, targetDir: tmpDir });
    const written2 = await scaffold({ ...baseOptions, targetDir: tmpDir });
    expect(written2).toHaveLength(0);
    expect(new Set(written1)).toEqual(new Set(expectedPaths('full', 'claude')));
  });

  it('returned paths are relative (no leading slash)', async () => {
    const written = await scaffold({ ...baseOptions, targetDir: tmpDir });
    for (const p of written) {
      expect(p.startsWith('/')).toBe(false);
    }
  });
});

describe('gitAddCommand()', () => {
  it('includes CLAUDE.md and .claude/ for claude tool', () => {
    const cmd = gitAddCommand('claude');
    expect(cmd).toContain('CLAUDE.md');
    expect(cmd).toContain('.claude/');
    expect(cmd).not.toContain('GEMINI.md');
  });

  it('includes GEMINI.md but not .claude/ for gemini tool', () => {
    const cmd = gitAddCommand('gemini');
    expect(cmd).toContain('GEMINI.md');
    expect(cmd).not.toContain('.claude/');
    expect(cmd).not.toContain('CLAUDE.md');
  });

  it('includes .cursor/ for cursor tool', () => {
    const cmd = gitAddCommand('cursor');
    expect(cmd).toContain('.cursor/');
    expect(cmd).not.toContain('CLAUDE.md');
    expect(cmd).not.toContain('GEMINI.md');
  });

  it('includes both CLAUDE.md and GEMINI.md and .claude/ for both tool', () => {
    const cmd = gitAddCommand('both');
    expect(cmd).toContain('CLAUDE.md');
    expect(cmd).toContain('GEMINI.md');
    expect(cmd).toContain('.claude/');
  });

  it('always includes team-foundry/ and AGENTS.md', () => {
    for (const tool of ['claude', 'gemini', 'cursor', 'both'] as const) {
      const cmd = gitAddCommand(tool);
      expect(cmd).toContain('team-foundry/');
      expect(cmd).toContain('AGENTS.md');
    }
  });

  it('ends with a git commit command', () => {
    expect(gitAddCommand('claude')).toContain('git commit');
  });

  it('gitAddCommand includes all tool files for tool=all', () => {
    const cmd = gitAddCommand('all');
    expect(cmd).toContain('CLAUDE.md');
    expect(cmd).toContain('GEMINI.md');
    expect(cmd).toContain('.cursor/');
    expect(cmd).toContain('.claude/');
  });
});

describe('scaffold() — tool=all', () => {
  let tmpDir: string;

  beforeEach(async () => { tmpDir = await makeTempDir(); });
  afterEach(async () => { await cleanup(tmpDir); });

  it('tool=all writes CLAUDE.md, GEMINI.md, and .cursor/rules/team-foundry.mdc', async () => {
    await scaffold({ ...baseOptions, tool: 'all', targetDir: tmpDir });
    for (const relPath of ['CLAUDE.md', 'GEMINI.md', '.cursor/rules/team-foundry.mdc']) {
      const exists = await fs.access(path.join(tmpDir, relPath)).then(() => true).catch(() => false);
      expect(exists, `Expected ${relPath} to exist for tool=all`).toBe(true);
    }
  });

  it('tool=all writes Claude Code skills', async () => {
    await scaffold({ ...baseOptions, tool: 'all', targetDir: tmpDir });
    const exists = await fs.access(path.join(tmpDir, '.claude/skills/team-foundry-intro.md'))
      .then(() => true).catch(() => false);
    expect(exists).toBe(true);
  });

  it('expectedPaths for tool=all includes all pointer files and skills', () => {
    const paths = expectedPaths('full', 'all');
    expect(paths).toContain('CLAUDE.md');
    expect(paths).toContain('GEMINI.md');
    expect(paths).toContain('.cursor/rules/team-foundry.mdc');
    expect(paths).toContain('.claude/skills/team-foundry-intro.md');
  });
});

describe('scaffold() — mergeDecisions', () => {
  let tmpDir: string;

  beforeEach(async () => { tmpDir = await makeTempDir(); });
  afterEach(async () => { await cleanup(tmpDir); });

  it('merge: preserves existing content above markers and appends team-foundry block', async () => {
    const claudePath = path.join(tmpDir, 'CLAUDE.md');
    await fs.writeFile(claudePath, '# My existing CLAUDE.md\n\nSome custom rules here.', 'utf-8');

    await scaffold({
      ...baseOptions,
      targetDir: tmpDir,
      mergeDecisions: { 'CLAUDE.md': 'merge' },
    });

    const content = await fs.readFile(claudePath, 'utf-8');
    expect(content).toContain('# My existing CLAUDE.md');
    expect(content).toContain('Some custom rules here.');
    expect(content).toContain('<!-- BEGIN TEAM-FOUNDRY SECTION -->');
    expect(content).toContain('<!-- END TEAM-FOUNDRY SECTION -->');
    expect(content).toContain('@AGENTS.md');
  });

  it('merge: second merge replaces the team-foundry block, not appends', async () => {
    const claudePath = path.join(tmpDir, 'CLAUDE.md');
    const existing = `# My CLAUDE.md\n\n<!-- BEGIN TEAM-FOUNDRY SECTION -->\nold content\n<!-- END TEAM-FOUNDRY SECTION -->`;
    await fs.writeFile(claudePath, existing, 'utf-8');

    await scaffold({
      ...baseOptions,
      targetDir: tmpDir,
      mergeDecisions: { 'CLAUDE.md': 'merge' },
    });

    const content = await fs.readFile(claudePath, 'utf-8');
    expect(content).not.toContain('old content');
    expect(content).toContain('@AGENTS.md');
    expect(content.split('<!-- BEGIN TEAM-FOUNDRY SECTION -->').length).toBe(2);
  });

  it('replace: backs up existing file to .team-foundry/backups/ and writes fresh', async () => {
    const claudePath = path.join(tmpDir, 'CLAUDE.md');
    await fs.writeFile(claudePath, 'original content', 'utf-8');

    await scaffold({
      ...baseOptions,
      targetDir: tmpDir,
      mergeDecisions: { 'CLAUDE.md': 'replace' },
    });

    const content = await fs.readFile(claudePath, 'utf-8');
    expect(content).not.toBe('original content');
    expect(content).toContain('@AGENTS.md');

    const backupsDir = path.join(tmpDir, '.team-foundry', 'backups');
    const backups = await fs.readdir(backupsDir);
    expect(backups.some((f) => f.startsWith('CLAUDE.md') && f.endsWith('.backup'))).toBe(true);

    const backupContent = await fs.readFile(path.join(backupsDir, backups[0]), 'utf-8');
    expect(backupContent).toBe('original content');
  });

  it('skip: leaves existing file untouched, writes all other files', async () => {
    const claudePath = path.join(tmpDir, 'CLAUDE.md');
    await fs.writeFile(claudePath, 'do not touch', 'utf-8');

    await scaffold({
      ...baseOptions,
      targetDir: tmpDir,
      mergeDecisions: { 'CLAUDE.md': 'skip' },
    });

    const content = await fs.readFile(claudePath, 'utf-8');
    expect(content).toBe('do not touch');

    const agentsExists = await fs.access(path.join(tmpDir, 'AGENTS.md')).then(() => true).catch(() => false);
    expect(agentsExists).toBe(true);
  });

  it('missing mergeDecisions key defaults to merge', async () => {
    const claudePath = path.join(tmpDir, 'CLAUDE.md');
    await fs.writeFile(claudePath, '# Existing', 'utf-8');

    await scaffold({
      ...baseOptions,
      targetDir: tmpDir,
      mergeDecisions: {},
    });

    const content = await fs.readFile(claudePath, 'utf-8');
    expect(content).toContain('# Existing');
    expect(content).toContain('<!-- BEGIN TEAM-FOUNDRY SECTION -->');
  });

  it('merge: falls back to append when END marker is missing (asymmetric block)', async () => {
    const claudePath = path.join(tmpDir, 'CLAUDE.md');
    // START marker present but END marker missing — simulates manual edit corruption
    await fs.writeFile(claudePath, `# My CLAUDE.md\n\n<!-- BEGIN TEAM-FOUNDRY SECTION -->\ntruncated content`, 'utf-8');

    await scaffold({
      ...baseOptions,
      targetDir: tmpDir,
      mergeDecisions: { 'CLAUDE.md': 'merge' },
    });

    const content = await fs.readFile(claudePath, 'utf-8');
    // Should append, not corrupt
    expect(content).toContain('# My CLAUDE.md');
    expect(content).toContain('@AGENTS.md');
    // Should have exactly one END marker
    expect(content.includes('<!-- END TEAM-FOUNDRY SECTION -->')).toBe(true);
  });

  it('tool=all: all three pointer files get merge treatment when they pre-exist', async () => {
    // Pre-seed all three pointer files
    await fs.writeFile(path.join(tmpDir, 'CLAUDE.md'), '# Existing Claude', 'utf-8');
    await fs.writeFile(path.join(tmpDir, 'GEMINI.md'), '# Existing Gemini', 'utf-8');
    const cursorDir = path.join(tmpDir, '.cursor', 'rules');
    await fs.mkdir(cursorDir, { recursive: true });
    await fs.writeFile(path.join(cursorDir, 'team-foundry.mdc'), '# Existing Cursor', 'utf-8');

    await scaffold({
      ...baseOptions,
      tool: 'all',
      targetDir: tmpDir,
      mergeDecisions: {
        'CLAUDE.md': 'merge',
        'GEMINI.md': 'merge',
        '.cursor/rules/team-foundry.mdc': 'merge',
      },
    });

    // All three should contain the merge markers
    const claudeContent = await fs.readFile(path.join(tmpDir, 'CLAUDE.md'), 'utf-8');
    const geminiContent = await fs.readFile(path.join(tmpDir, 'GEMINI.md'), 'utf-8');
    const cursorContent = await fs.readFile(path.join(cursorDir, 'team-foundry.mdc'), 'utf-8');

    expect(claudeContent).toContain('# Existing Claude');
    expect(claudeContent).toContain('<!-- BEGIN TEAM-FOUNDRY SECTION -->');
    expect(geminiContent).toContain('# Existing Gemini');
    expect(geminiContent).toContain('<!-- BEGIN TEAM-FOUNDRY SECTION -->');
    expect(cursorContent).toContain('# Existing Cursor');
    expect(cursorContent).toContain('<!-- BEGIN TEAM-FOUNDRY SECTION -->');
  });
});

describe('stack extraction package.json precedence', () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await makeTempDir();
  });

  afterEach(async () => {
    await cleanup(tmpDir);
  });

  it("reads targetDir's package.json, not the cwd's", async () => {
    // The test process cwd is the team-foundry repo itself (TypeScript + tsup).
    // targetDir gets a distinctly different package.json — Vue, plain JS.
    await fs.writeFile(
      path.join(tmpDir, 'package.json'),
      JSON.stringify({ name: 'target-project', dependencies: { vue: '^3.0.0' } }),
      'utf-8',
    );

    await scaffold({ ...baseOptions, targetDir: tmpDir });

    const stack = await fs.readFile(
      path.join(tmpDir, 'team-foundry/engineering/stack.md'),
      'utf-8',
    );
    expect(stack).toContain('Vue');
    expect(stack).not.toContain('tsup');
  });
});
