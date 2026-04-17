import { describe, it, expect } from 'vitest';
import type { TemplateContext } from '../types.js';
import {
  rootClaudeTemplate,
  rootGeminiTemplate,
  gettingStartedTemplate,
  coachTemplate,
  northStarTemplate,
  outcomesTemplate,
  customersTemplate,
  nowNextLaterTemplate,
  assumptionsTemplate,
  risksTemplate,
  trioTemplate,
  workingAgreementTemplate,
  aiPracticesTemplate,
  stackTemplate,
  qualityBarTemplate,
  decisionsReadmeTemplate,
  principlesTemplate,
  metricsTemplate,
  glossaryTemplate,
  stakeholdersTemplate,
} from '../templates/index.js';

const baseCtx: TemplateContext = {
  profile: 'full',
  tool: 'claude',
  repoVisibility: 'internal',
  date: '2026-04-17',
};

const allTemplates = [
  ['root-claude', rootClaudeTemplate],
  ['root-gemini', rootGeminiTemplate],
  ['getting-started', gettingStartedTemplate],
  ['coach', coachTemplate],
  ['north-star', northStarTemplate],
  ['outcomes', outcomesTemplate],
  ['customers', customersTemplate],
  ['now-next-later', nowNextLaterTemplate],
  ['assumptions', assumptionsTemplate],
  ['risks', risksTemplate],
  ['trio', trioTemplate],
  ['working-agreement', workingAgreementTemplate],
  ['ai-practices', aiPracticesTemplate],
  ['stack', stackTemplate],
  ['quality-bar', qualityBarTemplate],
  ['decisions-readme', decisionsReadmeTemplate],
  ['principles', principlesTemplate],
  ['metrics', metricsTemplate],
  ['glossary', glossaryTemplate],
  ['stakeholders', stakeholdersTemplate],
] as const;

/**
 * Extracts the YAML frontmatter block from a template output.
 * Returns null if the file doesn't start with ---.
 */
function parseFrontmatter(content: string): Record<string, string> | null {
  if (!content.startsWith('---')) return null;
  const end = content.indexOf('\n---', 3);
  if (end === -1) return null;
  const block = content.slice(4, end); // skip opening ---\n
  const result: Record<string, string> = {};
  for (const line of block.split('\n')) {
    const colon = line.indexOf(':');
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    const value = line.slice(colon + 1).trim();
    if (key) result[key] = value;
  }
  return result;
}

describe('frontmatter validity', () => {
  it.each(allTemplates)('%s has parseable YAML frontmatter', (_name, templateFn) => {
    const output = (templateFn as (ctx: TemplateContext) => string)(baseCtx);
    const fm = parseFrontmatter(output);
    expect(fm, 'frontmatter block not found').not.toBeNull();
  });

  it.each(allTemplates)('%s frontmatter has non-empty required keys', (_name, templateFn) => {
    const output = (templateFn as (ctx: TemplateContext) => string)(baseCtx);
    const fm = parseFrontmatter(output)!;
    expect(fm['purpose'], 'purpose is empty').toBeTruthy();
    expect(fm['read_when'], 'read_when is empty').toBeTruthy();
    expect(fm['last_updated'], 'last_updated is empty').toBeTruthy();
  });

  it.each(allTemplates)('%s last_updated matches context date', (_name, templateFn) => {
    const output = (templateFn as (ctx: TemplateContext) => string)(baseCtx);
    const fm = parseFrontmatter(output)!;
    expect(fm['last_updated']).toBe('2026-04-17');
  });
});

describe('template stubs', () => {
  it.each(allTemplates)('%s contains required frontmatter fields', (_name, templateFn) => {
    const output = (templateFn as (ctx: TemplateContext) => string)(baseCtx);
    expect(output).toContain('purpose:');
    expect(output).toContain('read_when:');
    expect(output).toContain('last_updated:');
  });

  it.each(allTemplates)('%s contains a GAP marker', (_name, templateFn) => {
    const output = (templateFn as (ctx: TemplateContext) => string)(baseCtx);
    expect(output).toContain('<!-- GAP:');
  });

  it.each(allTemplates)('%s includes the date from context', (_name, templateFn) => {
    const output = (templateFn as (ctx: TemplateContext) => string)(baseCtx);
    expect(output).toContain('2026-04-17');
  });

  it('root-claude uses CLAUDE.md heading', () => {
    expect(rootClaudeTemplate(baseCtx)).toContain('# CLAUDE.md');
  });

  it('root-gemini uses GEMINI.md heading', () => {
    expect(rootGeminiTemplate(baseCtx)).toContain('# GEMINI.md');
  });

  it('customers template adds public visibility note for public repos', () => {
    const publicCtx = { ...baseCtx, repoVisibility: 'public' as const };
    expect(customersTemplate(publicCtx)).toContain('This repo is public');
  });

  it('customers template has no visibility note for internal repos', () => {
    expect(customersTemplate(baseCtx)).not.toContain('This repo is public');
  });

  it('getting-started mentions solo question count for solo profile', () => {
    const soloCtx = { ...baseCtx, profile: 'solo' as const };
    expect(gettingStartedTemplate(soloCtx)).toContain('10–12');
  });

  it('getting-started mentions full question count for full profile', () => {
    expect(gettingStartedTemplate(baseCtx)).toContain('18–25');
  });
});
