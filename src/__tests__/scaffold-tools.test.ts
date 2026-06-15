import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { scaffold, expectedPaths, gitAddCommand } from '../scaffold.js';
import { rootCopilotTemplate } from '../templates/index.js';

const COPILOT_PATH = '.github/copilot-instructions.md';
const POINTERS = ['CLAUDE.md', 'GEMINI.md', '.cursor/rules/team-foundry.mdc', COPILOT_PATH];

const baseOpts = {
  profile: 'full' as const,
  repoVisibility: 'private' as const,
  date: '2026-06-15',
  ingestion: 'skip' as const,
};

describe('rootCopilotTemplate()', () => {
  it('points at AGENTS.md', () => {
    expect(rootCopilotTemplate({ ...baseOpts, tool: 'copilot' })).toContain('AGENTS.md');
  });
});

describe('expectedPaths() for copilot and agents', () => {
  it('copilot produces .github/copilot-instructions.md and no other pointer', () => {
    const paths = expectedPaths('full', 'copilot');
    expect(paths).toContain(COPILOT_PATH);
    expect(paths).toContain('AGENTS.md');
    expect(paths).not.toContain('CLAUDE.md');
    expect(paths).not.toContain('.cursor/rules/team-foundry.mdc');
  });

  it('agents produces AGENTS.md and no pointer files at all', () => {
    const paths = expectedPaths('full', 'agents');
    expect(paths).toContain('AGENTS.md');
    for (const p of POINTERS) expect(paths).not.toContain(p);
  });

  it('all includes the copilot pointer', () => {
    expect(expectedPaths('full', 'all')).toContain(COPILOT_PATH);
  });
});

describe('scaffold() for copilot and agents', () => {
  let tmpDir: string;
  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'tf-tools-test-'));
  });
  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  it('copilot writes the copilot pointer referencing AGENTS.md', async () => {
    await scaffold({ ...baseOpts, tool: 'copilot', targetDir: tmpDir });
    const content = await fs.readFile(path.join(tmpDir, COPILOT_PATH), 'utf-8');
    expect(content).toContain('AGENTS.md');
  });

  it('agents writes AGENTS.md but no pointer files', async () => {
    await scaffold({ ...baseOpts, tool: 'agents', targetDir: tmpDir });
    const agentsExists = await fs.access(path.join(tmpDir, 'AGENTS.md')).then(() => true).catch(() => false);
    expect(agentsExists).toBe(true);
    for (const p of POINTERS) {
      const exists = await fs.access(path.join(tmpDir, p)).then(() => true).catch(() => false);
      expect(exists).toBe(false);
    }
  });
});

describe('gitAddCommand() for copilot', () => {
  it('includes the copilot pointer path', () => {
    expect(gitAddCommand('copilot')).toContain(COPILOT_PATH);
  });
});
