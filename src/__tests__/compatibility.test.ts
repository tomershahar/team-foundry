import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { expectedPaths, scaffold } from '../scaffold.js';
import { detectTool, migrateToV33 } from '../migrate.js';
import type { ScaffoldOptions } from '../types.js';

const TOOLS = ['agents', 'claude', 'gemini', 'cursor', 'copilot', 'both', 'all'] as const;
type Tool = (typeof TOOLS)[number];

const POINTERS = {
  claude: 'CLAUDE.md',
  gemini: 'GEMINI.md',
  cursor: '.cursor/rules/team-foundry.mdc',
  copilot: '.github/copilot-instructions.md',
} as const;

const CLAUDE_SKILLS = [
  '.claude/skills/team-foundry-intro/SKILL.md',
  '.claude/skills/team-foundry-status/SKILL.md',
  '.claude/skills/team-foundry-review/SKILL.md',
  '.claude/skills/team-foundry-capture/SKILL.md',
  '.claude/skills/team-foundry-decision/SKILL.md',
  '.claude/skills/team-foundry-feature/SKILL.md',
];

const SOLO_BASE = [
  'AGENTS.md',
  'GETTING_STARTED.md',
  '.team-foundry/coach.md',
  'team-foundry/product/north-star.md',
  'team-foundry/product/outcomes.md',
  'team-foundry/product/customers.md',
  'team-foundry/engineering/stack.md',
];

const FULL_ONLY = [
  'team-foundry/product/now-next-later.md',
  'team-foundry/product/assumptions.md',
  'team-foundry/product/risks.md',
  'team-foundry/team/trio.md',
  'team-foundry/team/working-agreement.md',
  'team-foundry/team/ai-practices.md',
  'team-foundry/engineering/quality-bar.md',
  'team-foundry/engineering/decisions/README.md',
  'team-foundry/design/principles.md',
  'team-foundry/data/metrics.md',
  'team-foundry/context/glossary.md',
  'team-foundry/context/stakeholders.md',
  'team-foundry/product/strategy.md',
  '.team-foundry/hierarchy.md',
  '.team-foundry/instructions/hooks.md',
  '.team-foundry/instructions/rules.md',
];

const TOOL_ADDITIONS: Record<Tool, string[]> = {
  agents: [],
  claude: [POINTERS.claude, ...CLAUDE_SKILLS],
  gemini: [POINTERS.gemini],
  cursor: [POINTERS.cursor],
  copilot: [POINTERS.copilot],
  both: [POINTERS.claude, POINTERS.gemini, ...CLAUDE_SKILLS],
  all: [...Object.values(POINTERS), ...CLAUDE_SKILLS],
};

function sorted(values: Iterable<string>): string[] {
  return [...values].sort();
}

async function makeTempDir(): Promise<string> {
  return fs.mkdtemp(path.join(os.tmpdir(), 'tf-compatibility-'));
}

async function snapshotTree(dir: string, root = dir): Promise<Map<string, string>> {
  const result = new Map<string, string>();
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      for (const [relativePath, content] of await snapshotTree(fullPath, root)) {
        result.set(relativePath, content);
      }
    } else {
      result.set(path.relative(root, fullPath).split(path.sep).join('/'), await fs.readFile(fullPath, 'utf-8'));
    }
  }
  return result;
}

function options(targetDir: string, tool: Tool, profile: 'solo' | 'full' = 'full'): ScaffoldOptions {
  return {
    targetDir,
    tool,
    profile,
    repoVisibility: 'internal',
    date: '2026-07-02',
    ingestion: 'skip',
  };
}

describe('compatibility path matrix', () => {
  for (const profile of ['solo', 'full'] as const) {
    for (const tool of TOOLS) {
      it(`${profile}/${tool} has the exact contracted path set`, () => {
        const base = profile === 'full' ? [...SOLO_BASE, ...FULL_ONLY] : SOLO_BASE;
        expect(sorted(expectedPaths(profile, tool))).toEqual(sorted([...base, ...TOOL_ADDITIONS[tool]]));
      });
    }
  }

  for (const tool of TOOLS) {
    it(`${tool} isolates Claude skills correctly`, () => {
      const skillPaths = expectedPaths('full', tool).filter((file) => file.startsWith('.claude/skills/'));
      expect(sorted(skillPaths)).toEqual(
        tool === 'claude' || tool === 'both' || tool === 'all' ? sorted(CLAUDE_SKILLS) : [],
      );
    });

    it(`${tool} isolates federated Claude routing correctly`, () => {
      const nestedClaudePaths = expectedPaths('full', tool, true).filter(
        (file) => file.startsWith('team-foundry/') && file.endsWith('/CLAUDE.md'),
      );
      expect(nestedClaudePaths).toHaveLength(
        tool === 'claude' || tool === 'both' || tool === 'all' ? 6 : 0,
      );
    });
  }

  it('scaffolds every flat matrix row to the exact contracted tree', async () => {
    const root = await makeTempDir();
    try {
      for (const profile of ['solo', 'full'] as const) {
        for (const tool of TOOLS) {
          const targetDir = path.join(root, profile, tool);
          await fs.mkdir(targetDir, { recursive: true });
          await scaffold(options(targetDir, tool, profile));
          const base = profile === 'full' ? [...SOLO_BASE, ...FULL_ONLY] : SOLO_BASE;
          expect(sorted((await snapshotTree(targetDir)).keys())).toEqual(
            sorted([...base, ...TOOL_ADDITIONS[tool]]),
          );
        }
      }
    } finally {
      await fs.rm(root, { recursive: true, force: true });
    }
  });

  it('scaffolds federated routes only for Claude-capable selections', async () => {
    const root = await makeTempDir();
    try {
      for (const tool of TOOLS) {
        const targetDir = path.join(root, tool);
        await fs.mkdir(targetDir, { recursive: true });
        await scaffold({ ...options(targetDir, tool), federated: true });
        const nestedClaudePaths = sorted((await snapshotTree(targetDir)).keys()).filter(
          (file) => file.startsWith('team-foundry/') && file.endsWith('/CLAUDE.md'),
        );
        expect(nestedClaudePaths).toHaveLength(
          tool === 'claude' || tool === 'both' || tool === 'all' ? 6 : 0,
        );
      }
    } finally {
      await fs.rm(root, { recursive: true, force: true });
    }
  });
});

describe('compatibility loading contracts', () => {
  let tmpDir: string;

  beforeEach(async () => { tmpDir = await makeTempDir(); });
  afterEach(async () => { await fs.rm(tmpDir, { recursive: true, force: true }); });

  it('Claude imports AGENTS.md', async () => {
    await scaffold(options(tmpDir, 'claude'));
    expect(await fs.readFile(path.join(tmpDir, POINTERS.claude), 'utf-8')).toMatch(/^@AGENTS\.md/);
  });

  it('Gemini imports AGENTS.md through GEMINI.md', async () => {
    await scaffold(options(tmpDir, 'gemini'));
    expect(await fs.readFile(path.join(tmpDir, POINTERS.gemini), 'utf-8')).toContain('@./AGENTS.md');
  });

  it('Cursor includes AGENTS.md from its always-applied rule', async () => {
    await scaffold(options(tmpDir, 'cursor'));
    const content = await fs.readFile(path.join(tmpDir, POINTERS.cursor), 'utf-8');
    expect(content).toContain('alwaysApply: true');
    expect(content).toContain('@AGENTS.md');
  });

  it('Copilot routes to AGENTS.md through repository instructions', async () => {
    await scaffold(options(tmpDir, 'copilot'));
    expect(await fs.readFile(path.join(tmpDir, POINTERS.copilot), 'utf-8')).toContain('AGENTS.md');
  });

  it('keeps product context out of every pointer', async () => {
    await scaffold(options(tmpDir, 'all'));
    for (const pointer of Object.values(POINTERS)) {
      const content = await fs.readFile(path.join(tmpDir, pointer), 'utf-8');
      expect(content).not.toContain('## Where to find context');
      expect(content).not.toContain('## Project overview');
    }
  });
});

describe('existing instruction protection', () => {
  let tmpDir: string;

  beforeEach(async () => { tmpDir = await makeTempDir(); });
  afterEach(async () => { await fs.rm(tmpDir, { recursive: true, force: true }); });

  for (const pointer of Object.values(POINTERS)) {
    it(`merge preserves ${pointer} and inserts one managed AGENTS.md reference`, async () => {
      const fullPath = path.join(tmpDir, pointer);
      await fs.mkdir(path.dirname(fullPath), { recursive: true });
      await fs.writeFile(fullPath, '# User instructions\n\nKeep this.', 'utf-8');

      await scaffold({
        ...options(tmpDir, 'all'),
        mergeDecisions: { [pointer]: 'merge' },
      });

      const content = await fs.readFile(fullPath, 'utf-8');
      expect(content).toContain('Keep this.');
      expect(content).toContain('AGENTS.md');
      expect(content.match(/BEGIN TEAM-FOUNDRY SECTION/g)).toHaveLength(1);
      if (pointer === POINTERS.cursor) {
        expect(content).toMatch(/^---\n[\s\S]*?alwaysApply: true[\s\S]*?\n---/);
      }
    });

    it(`replace backs up ${pointer} before writing its adapter`, async () => {
      const fullPath = path.join(tmpDir, pointer);
      await fs.mkdir(path.dirname(fullPath), { recursive: true });
      await fs.writeFile(fullPath, 'original pointer', 'utf-8');

      await scaffold({
        ...options(tmpDir, 'all'),
        mergeDecisions: { [pointer]: 'replace' },
      });

      const backups = await fs.readdir(path.join(tmpDir, '.team-foundry/backups'));
      expect(backups.some((file) => file.startsWith(path.basename(pointer)))).toBe(true);
      expect(await fs.readFile(fullPath, 'utf-8')).toContain('AGENTS.md');
    });

    it(`skip leaves ${pointer} byte-identical`, async () => {
      const fullPath = path.join(tmpDir, pointer);
      await fs.mkdir(path.dirname(fullPath), { recursive: true });
      await fs.writeFile(fullPath, 'do not change\n', 'utf-8');

      await scaffold({
        ...options(tmpDir, 'all'),
        mergeDecisions: { [pointer]: 'skip' },
      });

      expect(await fs.readFile(fullPath, 'utf-8')).toBe('do not change\n');
    });
  }

  it('protects an existing AGENTS.md for merge, replace, and skip decisions', async () => {
    for (const decision of ['merge', 'replace', 'skip'] as const) {
      const fixture = path.join(tmpDir, decision);
      await fs.mkdir(fixture, { recursive: true });
      await fs.writeFile(path.join(fixture, 'AGENTS.md'), `existing ${decision}\n`, 'utf-8');

      await scaffold({
        ...options(fixture, 'agents'),
        mergeDecisions: { 'AGENTS.md': decision },
      });

      const content = await fs.readFile(path.join(fixture, 'AGENTS.md'), 'utf-8');
      if (decision === 'skip') expect(content).toBe('existing skip\n');
      if (decision === 'merge') expect(content).toContain('existing merge');
      if (decision === 'replace') {
        expect(content).not.toContain('existing replace');
        expect(await fs.readdir(path.join(fixture, '.team-foundry/backups'))).toHaveLength(1);
      }
    }
  });

  it('activates a merged Cursor rule while preserving its metadata and body', async () => {
    const fullPath = path.join(tmpDir, POINTERS.cursor);
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(
      fullPath,
      '---\ndescription: Existing rule\nglobs: src/**\nalwaysApply: false\n---\n\n# Existing body\n',
      'utf-8',
    );

    await scaffold({
      ...options(tmpDir, 'cursor'),
      mergeDecisions: { [POINTERS.cursor]: 'merge' },
    });

    const content = await fs.readFile(fullPath, 'utf-8');
    const frontmatter = content.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
    expect(frontmatter).toContain('description: Existing rule');
    expect(frontmatter).toContain('globs: src/**');
    expect(frontmatter).toContain('alwaysApply: true');
    expect(content).toContain('# Existing body');
    expect(content.match(/^---$/gm)).toHaveLength(2);
  });

  it('merges a CRLF-encoded Cursor rule without duplicating frontmatter', async () => {
    const fullPath = path.join(tmpDir, POINTERS.cursor);
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(
      fullPath,
      '---\r\ndescription: Existing rule\r\nglobs: src/**\r\nalwaysApply: false\r\n---\r\n\r\n# Existing body\r\n',
      'utf-8',
    );

    await scaffold({
      ...options(tmpDir, 'cursor'),
      mergeDecisions: { [POINTERS.cursor]: 'merge' },
    });

    const content = await fs.readFile(fullPath, 'utf-8');
    const frontmatter = content.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
    expect(frontmatter).toContain('description: Existing rule');
    expect(frontmatter).toContain('alwaysApply: true');
    expect(content).toContain('# Existing body');
    expect(content.match(/^---$/gm)).toHaveLength(2);
  });

  it('adds alwaysApply to a merged Cursor rule whose frontmatter lacks it', async () => {
    const fullPath = path.join(tmpDir, POINTERS.cursor);
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(
      fullPath,
      '---\ndescription: Existing rule\nglobs: src/**\n---\n\n# Existing body\n',
      'utf-8',
    );

    await scaffold({
      ...options(tmpDir, 'cursor'),
      mergeDecisions: { [POINTERS.cursor]: 'merge' },
    });

    const content = await fs.readFile(fullPath, 'utf-8');
    const frontmatter = content.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
    expect(frontmatter).toContain('description: Existing rule');
    expect(frontmatter).toContain('alwaysApply: true');
    expect(content.match(/^---$/gm)).toHaveLength(2);
  });

  it('injects generated frontmatter when merging a Cursor rule that has none', async () => {
    const fullPath = path.join(tmpDir, POINTERS.cursor);
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, '# Existing body\n', 'utf-8');

    await scaffold({
      ...options(tmpDir, 'cursor'),
      mergeDecisions: { [POINTERS.cursor]: 'merge' },
    });

    const content = await fs.readFile(fullPath, 'utf-8');
    const frontmatter = content.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
    expect(frontmatter).toContain('alwaysApply: true');
    expect(content).toContain('# Existing body');
    expect(content.match(/^---$/gm)).toHaveLength(2);
  });

  it('is byte-identical when scaffold is re-run without overwrite decisions', async () => {
    await scaffold(options(tmpDir, 'all'));
    const first = await snapshotTree(tmpDir);
    const written = await scaffold(options(tmpDir, 'all'));

    expect(written).toEqual([]);
    expect(await snapshotTree(tmpDir)).toEqual(first);
  });
});

describe('migration compatibility', () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await makeTempDir();
    await fs.mkdir(path.join(tmpDir, '.team-foundry'), { recursive: true });
    await fs.writeFile(path.join(tmpDir, '.team-foundry/hierarchy.md'), 'v3', 'utf-8');
  });
  afterEach(async () => { await fs.rm(tmpDir, { recursive: true, force: true }); });

  it('detects a Copilot-only installation', async () => {
    await fs.mkdir(path.join(tmpDir, '.github'), { recursive: true });
    await fs.writeFile(path.join(tmpDir, POINTERS.copilot), 'old', 'utf-8');
    expect(await detectTool(tmpDir)).toBe('copilot');
  });

  it('backs up and upgrades an existing Copilot pointer', async () => {
    await fs.mkdir(path.join(tmpDir, '.github'), { recursive: true });
    await fs.writeFile(path.join(tmpDir, POINTERS.copilot), 'old copilot instructions', 'utf-8');

    await migrateToV33(tmpDir);

    const content = await fs.readFile(path.join(tmpDir, POINTERS.copilot), 'utf-8');
    expect(content).toContain('old copilot instructions');
    expect(content).toContain('AGENTS.md');
    expect(content.match(/BEGIN TEAM-FOUNDRY SECTION/g)).toHaveLength(1);
    const backups = await fs.readdir(path.join(tmpDir, '.team-foundry/backups'));
    expect(backups.some((file) => file.startsWith('copilot-instructions.md'))).toBe(true);
  });

  it('does not create pointer files that were not already present', async () => {
    await fs.writeFile(path.join(tmpDir, POINTERS.claude), 'old Claude instructions', 'utf-8');
    await migrateToV33(tmpDir);

    for (const pointer of [POINTERS.gemini, POINTERS.cursor, POINTERS.copilot]) {
      await expect(fs.access(path.join(tmpDir, pointer))).rejects.toThrow();
    }
  });
});
