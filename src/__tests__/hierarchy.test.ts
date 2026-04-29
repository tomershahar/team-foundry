import { describe, it, expect } from 'vitest';
import type { TemplateContext } from '../types.js';
import { hierarchyTemplate } from '../templates/index.js';
import { expectedPaths } from '../scaffold.js';

const baseCtx: TemplateContext = {
  profile: 'full',
  tool: 'claude',
  repoVisibility: 'internal',
  date: '2026-04-29',
};

const soloCtx: TemplateContext = { ...baseCtx, profile: 'solo' };

describe('v3 Task 3 — hierarchy.md template', () => {
  it('hierarchyTemplate is a function that returns a string', () => {
    expect(typeof hierarchyTemplate).toBe('function');
    expect(typeof hierarchyTemplate(baseCtx)).toBe('string');
  });

  it('has parseable YAML frontmatter with required fields', () => {
    const output = hierarchyTemplate(baseCtx);
    expect(output).toContain('purpose:');
    expect(output).toContain('read_when:');
    expect(output).toContain('last_updated:');
    expect(output).toContain('owner:');
  });

  it('last_updated matches context date', () => {
    expect(hierarchyTemplate(baseCtx)).toContain('2026-04-29');
  });

  it('contains File Precedence section', () => {
    expect(hierarchyTemplate(baseCtx)).toContain('File Precedence');
  });

  it('contains Data Source Precedence section', () => {
    expect(hierarchyTemplate(baseCtx)).toContain('Data Source Precedence');
  });

  it('contains Expertise Precedence section', () => {
    expect(hierarchyTemplate(baseCtx)).toContain('Expertise Precedence');
  });

  it('contains Version Authority section', () => {
    expect(hierarchyTemplate(baseCtx)).toContain('Version Authority');
  });

  it('File Precedence lists constitution before context files before memory', () => {
    const output = hierarchyTemplate(baseCtx);
    const start = output.indexOf('## File Precedence');
    const end = output.indexOf('## Data Source Precedence');
    const fileSection = output.slice(start, end);
    const constitutionPos = fileSection.indexOf('Constitution');
    const contextPos = fileSection.indexOf('Context files');
    const memoryPos = fileSection.indexOf('Memory');
    expect(constitutionPos).toBeGreaterThan(-1);
    expect(contextPos).toBeGreaterThan(constitutionPos);
    expect(memoryPos).toBeGreaterThan(contextPos);
  });

  it('Data Source Precedence ranks measured data above customer claims', () => {
    const output = hierarchyTemplate(baseCtx);
    const dataSection = output.slice(output.indexOf('Data Source Precedence'));
    const measuredPos = dataSection.search(/measured|live data/i);
    const claimsPos = dataSection.search(/customer claim/i);
    expect(measuredPos).toBeGreaterThan(-1);
    expect(claimsPos).toBeGreaterThan(measuredPos);
  });

  it('Expertise Precedence ranks domain expert above AI general knowledge', () => {
    const output = hierarchyTemplate(baseCtx);
    const expertSection = output.slice(output.indexOf('Expertise Precedence'));
    const expertPos = expertSection.search(/domain expert/i);
    const aiPos = expertSection.search(/AI.*(general|knowledge)/i);
    expect(expertPos).toBeGreaterThan(-1);
    expect(aiPos).toBeGreaterThan(expertPos);
  });
});

describe('v3 Task 3 — hierarchy.md scaffold wiring', () => {
  it('full profile expectedPaths includes .team-foundry/hierarchy.md', () => {
    const paths = expectedPaths('full', 'claude');
    expect(paths).toContain('.team-foundry/hierarchy.md');
  });

  it('solo profile expectedPaths does NOT include .team-foundry/hierarchy.md', () => {
    const paths = expectedPaths('solo', 'claude');
    expect(paths).not.toContain('.team-foundry/hierarchy.md');
  });

  it('full profile has one more file than before (hierarchy.md added)', () => {
    const fullPaths = expectedPaths('full', 'claude');
    const soloPaths = expectedPaths('solo', 'claude');
    // was 13 full-only files (from v2); now 14 with hierarchy.md
    expect(fullPaths.length - soloPaths.length).toBe(14);
  });
});
