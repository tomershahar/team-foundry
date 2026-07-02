import { describe, it, expect } from 'vitest';
import type { TemplateContext } from '../types.js';
import { hooksTemplate, rulesTemplate } from '../templates/index.js';
import { expectedPaths } from '../scaffold.js';

const baseCtx: TemplateContext = {
  profile: 'full',
  tool: 'claude',
  repoVisibility: 'internal',
  date: '2026-04-29',
};



describe('v3 Task 5  -  instructions/hooks.md template', () => {
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

  it('does not promise an uncommitted executable-hooks release', () => {
    const output = hooksTemplate(baseCtx);
    expect(output).not.toMatch(/v\d|--with-hooks|will generate real/i);
  });
});

describe('v3 Task 6  -  instructions/rules.md template', () => {
  it('rulesTemplate is a function that returns a string', () => {
    expect(typeof rulesTemplate).toBe('function');
    expect(typeof rulesTemplate(baseCtx)).toBe('string');
  });

  it('has YAML frontmatter with required fields', () => {
    const output = rulesTemplate(baseCtx);
    expect(output).toContain('purpose:');
    expect(output).toContain('read_when:');
    expect(output).toContain('last_updated:');
    expect(output).toContain('owner:');
  });

  it('last_updated matches context date', () => {
    expect(rulesTemplate(baseCtx)).toContain('2026-04-29');
  });

  it('contains 10 or fewer numbered rules', () => {
    const output = rulesTemplate(baseCtx);
    const ruleCount = (output.match(/^\d+\./gm) || []).length;
    expect(ruleCount).toBeGreaterThan(0);
    expect(ruleCount).toBeLessThanOrEqual(10);
  });

  it('covers coach voice / diagnostic-first rule', () => {
    expect(rulesTemplate(baseCtx)).toMatch(/diagnostic.first|coach voice|name the gap/i);
  });

  it('covers sourcing requirement rule', () => {
    expect(rulesTemplate(baseCtx)).toMatch(/source|attribution/i);
  });

  it('covers validated-vs-hypothesized rule', () => {
    expect(rulesTemplate(baseCtx)).toMatch(/validated|hypothesized/i);
  });

  it('covers hell-yes standard rule', () => {
    expect(rulesTemplate(baseCtx)).toMatch(/hell.yes|obviously essential|cut/i);
  });
});

describe('v3 Task 6  -  instructions/rules.md scaffold wiring', () => {
  it('full profile expectedPaths includes .team-foundry/instructions/rules.md', () => {
    expect(expectedPaths('full', 'claude')).toContain('.team-foundry/instructions/rules.md');
  });

  it('solo profile expectedPaths does NOT include .team-foundry/instructions/rules.md', () => {
    expect(expectedPaths('solo', 'claude')).not.toContain('.team-foundry/instructions/rules.md');
  });
});

describe('v3 Task 5  -  instructions/hooks.md scaffold wiring', () => {
  it('full profile expectedPaths includes .team-foundry/instructions/hooks.md', () => {
    const paths = expectedPaths('full', 'claude');
    expect(paths).toContain('.team-foundry/instructions/hooks.md');
  });

  it('solo profile expectedPaths does NOT include .team-foundry/instructions/hooks.md', () => {
    const paths = expectedPaths('solo', 'claude');
    expect(paths).not.toContain('.team-foundry/instructions/hooks.md');
  });

  it('full profile includes hooks.md and is larger than solo', () => {
    expect(expectedPaths('full', 'claude')).toContain('.team-foundry/instructions/hooks.md');
    expect(expectedPaths('full', 'claude').length).toBeGreaterThan(
      expectedPaths('solo', 'claude').length,
    );
  });
});
