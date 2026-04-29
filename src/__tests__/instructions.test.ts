import { describe, it, expect } from 'vitest';
import type { TemplateContext } from '../types.js';
import { hooksTemplate } from '../templates/index.js';
import { expectedPaths } from '../scaffold.js';

const baseCtx: TemplateContext = {
  profile: 'full',
  tool: 'claude',
  repoVisibility: 'internal',
  date: '2026-04-29',
};

const soloCtx: TemplateContext = { ...baseCtx, profile: 'solo' };

describe('v3 Task 5 — instructions/hooks.md template', () => {
  it('hooksTemplate is a function that returns a string', () => {
    expect(typeof hooksTemplate).toBe('function');
    expect(typeof hooksTemplate(baseCtx)).toBe('string');
  });

  it('has YAML frontmatter with required fields', () => {
    const output = hooksTemplate(baseCtx);
    expect(output).toContain('purpose:');
    expect(output).toContain('read_when:');
    expect(output).toContain('last_updated:');
    expect(output).toContain('owner:');
  });

  it('last_updated matches context date', () => {
    expect(hooksTemplate(baseCtx)).toContain('2026-04-29');
  });

  it('contains at least three enforced behavior sections', () => {
    const output = hooksTemplate(baseCtx);
    const sectionCount = (output.match(/^##\s/gm) || []).length;
    expect(sectionCount).toBeGreaterThanOrEqual(3);
  });

  it('instructs AI to read hierarchy.md before reconciling conflicts', () => {
    expect(hooksTemplate(baseCtx)).toContain('hierarchy.md');
  });

  it('instructs AI to ask before editing team-foundry files', () => {
    const output = hooksTemplate(baseCtx).toLowerCase();
    expect(output).toMatch(/ask before.*edit|before.*edit.*team-foundry|conversation-as-update/);
  });

  it('instructs AI to ask before using paid tools or MCPs', () => {
    const output = hooksTemplate(baseCtx).toLowerCase();
    expect(output).toMatch(/paid|mcp|external tool/);
  });

  it('opens with a clarifying note that these are markdown conventions not executable hooks', () => {
    const output = hooksTemplate(baseCtx);
    expect(output).toMatch(/markdown|convention|not.*executable|not.*script/i);
  });
});

describe('v3 Task 5 — instructions/hooks.md scaffold wiring', () => {
  it('full profile expectedPaths includes .team-foundry/instructions/hooks.md', () => {
    const paths = expectedPaths('full', 'claude');
    expect(paths).toContain('.team-foundry/instructions/hooks.md');
  });

  it('solo profile expectedPaths does NOT include .team-foundry/instructions/hooks.md', () => {
    const paths = expectedPaths('solo', 'claude');
    expect(paths).not.toContain('.team-foundry/instructions/hooks.md');
  });

  it('full profile has 15 more files than solo (14 from before + hooks.md)', () => {
    const fullPaths = expectedPaths('full', 'claude');
    const soloPaths = expectedPaths('solo', 'claude');
    expect(fullPaths.length - soloPaths.length).toBe(15);
  });
});
