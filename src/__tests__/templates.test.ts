import { describe, it, expect } from 'vitest';
import type { TemplateContext } from '../types.js';
import {
  rootClaudeTemplate,
  rootGeminiTemplate,
  rootCursorTemplate,
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
  strategyTemplate,
} from '../templates/index.js';
import { expectedPaths } from '../scaffold.js';

const baseCtx: TemplateContext = {
  profile: 'full',
  tool: 'claude',
  repoVisibility: 'internal',
  date: '2026-04-17',
};

const allTemplates = [
  ['root-claude', rootClaudeTemplate],
  ['root-gemini', rootGeminiTemplate],
  ['root-cursor', rootCursorTemplate],
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
  ['strategy', strategyTemplate],
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

  it('root-cursor contains routing map', () => {
    expect(rootCursorTemplate(baseCtx)).toMatch(/routing|outcomes\.md|customers\.md/i);
  });

  it('root-cursor contains coach activation instructions', () => {
    expect(rootCursorTemplate(baseCtx)).toMatch(/coach|team-foundry review/i);
  });

  it('root-cursor contains last_updated frontmatter', () => {
    expect(rootCursorTemplate(baseCtx)).toContain('last_updated');
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
    expect(gettingStartedTemplate(soloCtx)).toContain('10');
  });

  it('getting-started mentions full question count for full profile', () => {
    expect(gettingStartedTemplate(baseCtx)).toContain('18–25');
  });
});

describe('Ingestion path', () => {
  const ingestionCtx = { ...baseCtx, ingestionPath: './uat-mock-docs' };

  it('getting-started includes ingestion path hint when ingestionPath is set', () => {
    const output = gettingStartedTemplate(ingestionCtx);
    expect(output).toContain('./uat-mock-docs');
    expect(output).toContain('pre-populate answers');
  });

  it('getting-started has no ingestion hint when ingestionPath is absent', () => {
    expect(gettingStartedTemplate(baseCtx)).not.toContain('pre-populate answers');
  });

  it('coach includes ingestion docs section when ingestionPath is set', () => {
    const output = coachTemplate(ingestionCtx);
    expect(output).toContain('./uat-mock-docs');
    expect(output).toContain('Existing docs');
    expect(output).toContain("Every answer needs the user's confirmation");
  });

  it('coach has no ingestion docs section when ingestionPath is absent', () => {
    expect(coachTemplate(baseCtx)).not.toContain('Existing docs:');
  });
});

describe('Iteration 3 — root routing and coach', () => {
  it('root-claude contains routing map table', () => {
    const output = rootClaudeTemplate(baseCtx);
    expect(output).toContain('## Routing map');
    expect(output).toContain('team-foundry/product/outcomes.md');
    expect(output).toContain('team-foundry/engineering/quality-bar.md');
  });

  it('root-gemini contains routing map table', () => {
    const output = rootGeminiTemplate(baseCtx);
    expect(output).toContain('## Routing map');
    expect(output).toContain('team-foundry/product/outcomes.md');
  });

  it('root-claude contains coach pointer with load instruction', () => {
    const output = rootClaudeTemplate(baseCtx);
    expect(output).toContain('.team-foundry/coach.md');
    expect(output).toContain('Explicit mode');
    expect(output).toContain('Scheduled mode');
    expect(output).toContain('Inline mode');
  });

  it('root-gemini contains coach pointer with load instruction', () => {
    const output = rootGeminiTemplate(baseCtx);
    expect(output).toContain('.team-foundry/coach.md');
    expect(output).toContain('Explicit mode');
  });

  it('root files instruct AI to load coach.md before activating', () => {
    for (const output of [rootClaudeTemplate(baseCtx), rootGeminiTemplate(baseCtx)]) {
      expect(output).toContain('.team-foundry/coach.md');
      expect(output).toContain('before activating any mode');
    }
  });

  it('coach contains three activation modes', () => {
    const output = coachTemplate(baseCtx);
    expect(output).toContain('### Inline');
    expect(output).toContain('### Explicit');
    expect(output).toContain('### Scheduled');
  });

  it('coach contains trigger phrases for explicit mode', () => {
    const output = coachTemplate(baseCtx);
    expect(output).toContain("let's do a team-foundry review");
    expect(output).toContain('team-foundry audit');
  });

  it('coach scheduled mode has proactive session-open prompt', () => {
    const output = coachTemplate(baseCtx);
    expect(output).toContain("It's been");
    expect(output).toContain('run it now, skip, or snooze');
  });

  it('coach contains personality guardrails', () => {
    const output = coachTemplate(baseCtx);
    expect(output).toContain('Diagnostic-first');
    expect(output).toContain('No silent writes');
    expect(output).toContain('Assume transition, not failure');
  });

  it('coach contains prohibited phrases list', () => {
    const output = coachTemplate(baseCtx);
    expect(output).toContain('## Prohibited phrases');
    expect(output).toContain('journey');
    expect(output).toContain('empower');
  });

  it('coach contains nudge memory section scoped to inline mode only', () => {
    const output = coachTemplate(baseCtx);
    expect(output).toContain('## Nudge memory');
    expect(output).toContain('7 days');
    expect(output).toContain('Applies to Mode 1 (inline) only');
    expect(output).toContain('Modes 2 (explicit) and 3 (scheduled) ignore');
  });

  it('coach inline mode is always-on, not triggered', () => {
    const output = coachTemplate(baseCtx);
    expect(output).toContain('always on');
    expect(output).toContain('silently evaluate');
  });

  it('coach scheduled mode can be turned off', () => {
    expect(coachTemplate(baseCtx)).toContain('Can be turned off in configuration');
  });

  it('coach contains quarterly retrospective', () => {
    const output = coachTemplate(baseCtx);
    expect(output).toContain('## Quarterly retrospective');
    expect(output).toContain('90 days');
  });
});

describe('Iteration 4 — onboarding interview', () => {
  it('coach contains onboarding interview section', () => {
    expect(coachTemplate(baseCtx)).toContain('## Onboarding interview');
  });

  it('coach contains onboarding trigger phrases', () => {
    const output = coachTemplate(baseCtx);
    expect(output).toContain("Let's set up our team-foundry");
    expect(output).toContain('run the onboarding');
  });

  it('coach contains all 9 theme headings for both profiles', () => {
    for (const ctx of [baseCtx, { ...baseCtx, profile: 'solo' as const }]) {
      const output = coachTemplate(ctx);
      expect(output).toContain('### Theme 1: Identity');
      expect(output).toContain('### Theme 2: Purpose');
      expect(output).toContain('### Theme 3: Measurement');
      expect(output).toContain('### Theme 4: Customers');
      expect(output).toContain('### Theme 5: Quality');
      expect(output).toContain('### Theme 6: Team');
      expect(output).toContain('### Theme 7: Rhythm');
      expect(output).toContain('### Theme 8: Technical');
      expect(output).toContain('### Theme 9: Glossary');
    }
  });

  it('coach solo profile marks Team and Rhythm as skipped', () => {
    const soloCtx = { ...baseCtx, profile: 'solo' as const };
    const output = coachTemplate(soloCtx);
    expect(output).toContain('Skipped for solo profile');
  });

  it('coach full profile mentions 18–25 questions', () => {
    expect(coachTemplate(baseCtx)).toContain('18–25');
  });

  it('coach solo profile mentions exactly 10 questions', () => {
    const soloCtx = { ...baseCtx, profile: 'solo' as const };
    expect(coachTemplate(soloCtx)).toContain('10 questions');
    expect(coachTemplate(soloCtx)).not.toContain('10–12');
  });

  it('coach contains evidence demand for outcomes (outcome-shaped language)', () => {
    const output = coachTemplate(baseCtx);
    expect(output).toContain('Evidence demand');
    expect(output).toContain('outcome-shaped');
  });

  it('coach contains evidence demand for customers (named people)', () => {
    const output = coachTemplate(baseCtx);
    expect(output).toContain('real names');
  });

  it('coach contains skip / gap-tracking instructions', () => {
    const output = coachTemplate(baseCtx);
    expect(output).toContain('gap marker');
    expect(output).toContain('move on');
  });

  it('coach contains file-write instructions after each question', () => {
    const output = coachTemplate(baseCtx);
    expect(output).toContain('After the answer: write');
    expect(output).toContain('product/outcomes.md');
    expect(output).toContain('product/customers.md');
    expect(output).toContain('engineering/quality-bar.md');
    expect(output).toContain('engineering/stack.md');
  });

  it('coach contains interview close instructions', () => {
    const output = coachTemplate(baseCtx);
    expect(output).toContain('### Interview close');
    expect(output).toContain('Read back what was populated');
    expect(output).toContain('List what\'s still a gap');
    expect(output).toContain('Suggest one next action');
  });

  it('coach offers to delete GETTING_STARTED.md at end', () => {
    expect(coachTemplate(baseCtx)).toContain('GETTING_STARTED.md');
  });

  it('coach GETTING_STARTED.md delete offer is conditioned on file existence', () => {
    expect(coachTemplate(baseCtx)).toContain('only if it exists');
  });

  it('coach contains opening framing with time estimate for full profile', () => {
    expect(coachTemplate(baseCtx)).toContain('25–35 minutes');
  });

  it('coach contains opening framing with time estimate for solo profile', () => {
    const soloCtx = { ...baseCtx, profile: 'solo' as const };
    expect(coachTemplate(soloCtx)).toContain('15–20 minutes');
  });

  it('coach opening framing states 9 themes for both profiles', () => {
    expect(coachTemplate(baseCtx)).toContain('9 themes');
    const soloCtx = { ...baseCtx, profile: 'solo' as const };
    expect(coachTemplate(soloCtx)).toContain('9 themes');
  });

  it('coach full profile Q numbers are contiguous Q1–Q23', () => {
    const output = coachTemplate(baseCtx);
    for (let i = 1; i <= 23; i++) {
      expect(output, `Q${i} missing in full profile`).toContain(`**Q${i}`);
    }
  });

  it('coach solo profile Q numbers are contiguous Q1–Q10', () => {
    const soloCtx = { ...baseCtx, profile: 'solo' as const };
    const output = coachTemplate(soloCtx);
    for (let i = 1; i <= 10; i++) {
      expect(output, `Q${i} missing in solo profile`).toContain(`**Q${i}`);
    }
    expect(output).not.toContain('**Q11');
  });

  it('root-claude trigger phrases include coach mode', () => {
    expect(rootClaudeTemplate(baseCtx)).toContain('coach mode');
  });

  it('root-gemini trigger phrases include coach mode', () => {
    expect(rootGeminiTemplate(baseCtx)).toContain('coach mode');
  });

  it('root files have user-facing trigger phrase table', () => {
    for (const output of [rootClaudeTemplate(baseCtx), rootGeminiTemplate(baseCtx)]) {
      expect(output).toContain("let's do a team-foundry review");
      expect(output).toContain("what's missing from team-foundry");
      expect(output).toContain('run the weekly team-foundry review');
    }
  });

  it('getting-started has user-facing trigger phrase table', () => {
    const output = gettingStartedTemplate(baseCtx);
    expect(output).toContain("let's do a team-foundry review");
    expect(output).toContain("what's missing from team-foundry");
  });
});

describe('Iteration 5 — Coach behaviors core (1–4)', () => {
  // Behavior 1: outputs-vs-outcomes
  it('coach contains Behavior 1 section heading', () => {
    expect(coachTemplate(baseCtx)).toContain('Behavior 1: Outputs framed as outcomes');
  });

  it('coach B1 names the specific file', () => {
    expect(coachTemplate(baseCtx)).toContain('product/outcomes.md');
  });

  it('coach B1 distinguishes output language from outcome language', () => {
    const output = coachTemplate(baseCtx);
    expect(output).toContain('Output language');
    expect(output).toContain('Outcome language');
  });

  it('coach B1 offers to reframe', () => {
    expect(coachTemplate(baseCtx)).toContain('reframe');
  });

  it('coach B1 defines inline trigger for prioritization questions', () => {
    const output = coachTemplate(baseCtx);
    expect(output).toContain('Inline trigger');
    expect(output).toContain('prioritization');
  });

  // Behavior 2: customer contact staleness
  it('coach contains Behavior 2 section heading', () => {
    expect(coachTemplate(baseCtx)).toContain('Behavior 2: Customer contact staleness');
  });

  it('coach B2 names the 60-day threshold', () => {
    expect(coachTemplate(baseCtx)).toContain('60');
  });

  it('coach B2 references the specific file', () => {
    expect(coachTemplate(baseCtx)).toContain('product/customers.md');
  });

  it('coach B2 requires naming specific persona and date', () => {
    const output = coachTemplate(baseCtx);
    expect(output).toContain('last_contact');
    expect(output).toContain('YYYY-MM-DD');
  });

  it('coach B2 prohibits vague language about customers', () => {
    expect(coachTemplate(baseCtx)).toContain('Never say "some customers"');
  });

  // Behavior 3: stale assumptions
  it('coach contains Behavior 3 section heading', () => {
    expect(coachTemplate(baseCtx)).toContain('Behavior 3: Stale assumptions');
  });

  it('coach B3 names the 30-day threshold', () => {
    expect(coachTemplate(baseCtx)).toContain('30 days');
  });

  it('coach B3 references the specific file', () => {
    expect(coachTemplate(baseCtx)).toContain('product/assumptions.md');
  });

  it('coach B3 checks for tested status', () => {
    const output = coachTemplate(baseCtx);
    expect(output).toContain('status: tested');
  });

  it('coach B3 offers to draft test method or update', () => {
    expect(coachTemplate(baseCtx)).toContain('needs testing');
  });

  // Behavior 4: decisions without rationale
  it('coach contains Behavior 4 section heading', () => {
    expect(coachTemplate(baseCtx)).toContain('Behavior 4: Decisions without rationale');
  });

  it('coach B4 references the decisions directory', () => {
    expect(coachTemplate(baseCtx)).toContain('engineering/decisions/');
  });

  it('coach B4 describes what missing rationale looks like', () => {
    const output = coachTemplate(baseCtx);
    expect(output).toContain('gap marker');
  });

  it('coach B4 offers to draft rationale from context', () => {
    expect(coachTemplate(baseCtx)).toContain('draft it from context');
  });

  it('coach B4 inline trigger mentions architectural decisions', () => {
    const output = coachTemplate(baseCtx);
    expect(output).toContain('architectural decision');
  });

  // Explicit mode audit order
  it('coach explicit mode runs behaviors in priority order B1→B4 (summary line)', () => {
    const output = coachTemplate(baseCtx);
    const b1pos = output.indexOf('B1 (outputs-vs-outcomes)');
    const b2pos = output.indexOf('B2 (customer staleness)');
    const b3pos = output.indexOf('B3 (stale assumptions)');
    const b4pos = output.indexOf('B4 (decisions without rationale)');
    expect(b1pos).toBeGreaterThan(-1);
    expect(b2pos).toBeGreaterThan(b1pos);
    expect(b3pos).toBeGreaterThan(b2pos);
    expect(b4pos).toBeGreaterThan(b3pos);
  });

  it('coach Behavior sections appear in priority order B1→B4', () => {
    const output = coachTemplate(baseCtx);
    const b1pos = output.indexOf('### Behavior 1:');
    const b2pos = output.indexOf('### Behavior 2:');
    const b3pos = output.indexOf('### Behavior 3:');
    const b4pos = output.indexOf('### Behavior 4:');
    expect(b1pos).toBeGreaterThan(-1);
    expect(b2pos).toBeGreaterThan(b1pos);
    expect(b3pos).toBeGreaterThan(b2pos);
    expect(b4pos).toBeGreaterThan(b3pos);
  });

  it('coach explicit mode does not write files during audit', () => {
    expect(coachTemplate(baseCtx)).toContain('audit is a report only');
  });

  it('coach scheduled mode runs all behaviors internally then surfaces top 3', () => {
    const output = coachTemplate(baseCtx);
    expect(output).toContain('Run all behaviors internally');
    expect(output).toContain('top 3 findings');
  });

  it('coach inline mode uses priority order as tiebreaker', () => {
    expect(coachTemplate(baseCtx)).toContain('highest-priority behavior whose inline trigger condition');
  });

  // Conversation-as-update protocol
  it('coach contains conversation-as-update protocol section', () => {
    expect(coachTemplate(baseCtx)).toContain('Conversation-as-update protocol');
  });

  it('coach protocol has inline mode carve-out', () => {
    const output = coachTemplate(baseCtx);
    expect(output).toContain('In inline mode:');
    expect(output).toContain('Steps 2 and 3 only apply if the user replies');
  });

  it('coach protocol has three steps in order', () => {
    const output = coachTemplate(baseCtx);
    const step1 = output.indexOf('Step 1');
    const step2 = output.indexOf('Step 2');
    const step3 = output.indexOf('Step 3');
    expect(step1).toBeGreaterThan(-1);
    expect(step2).toBeGreaterThan(step1);
    expect(step3).toBeGreaterThan(step2);
  });

  it('coach protocol diagnosis is a separate message from the draft', () => {
    expect(coachTemplate(baseCtx)).toContain('Do not include the draft in the same message as the diagnosis');
  });

  it('coach protocol requires explicit confirmation before writing', () => {
    const output = coachTemplate(baseCtx);
    expect(output).toContain('Only after the team says yes');
    expect(output).toContain('Silence is not confirmation');
  });

  it('coach protocol prevents clarification loops', () => {
    const output = coachTemplate(baseCtx);
    expect(output).toContain('clarification is also ambiguous');
    expect(output).toContain('treat it as rejection');
  });

  it('coach protocol lists what counts as confirmation', () => {
    expect(coachTemplate(baseCtx)).toContain('What counts as confirmation');
  });

  it('coach protocol lists what counts as rejection', () => {
    expect(coachTemplate(baseCtx)).toContain('What counts as rejection');
  });

  // Severity labels
  it('coach behaviors have severity labels', () => {
    const output = coachTemplate(baseCtx);
    expect(output).toContain('**Severity:**');
  });

  // B3 date precedence
  it('coach B3 defines date field precedence', () => {
    const output = coachTemplate(baseCtx);
    expect(output).toContain('added_on:');
    expect(output).toContain('Fall back to the file\'s');
  });

  // B2 draft offer as choice
  it('coach B2 presents draft options as a choice', () => {
    expect(coachTemplate(baseCtx)).toContain('Ask which they\'d prefer before drafting');
  });

  // GAP comment removed
  it('coach no longer has the behaviors-pending GAP comment', () => {
    expect(coachTemplate(baseCtx)).not.toContain('Coach behaviors (the 12 diagnostic checks) are added in a later iteration');
  });
});

describe('Iteration 6 — Conversation-as-update', () => {
  it('protocol has a draft format block with File: header', () => {
    expect(coachTemplate(baseCtx)).toContain('### File: team-foundry/');
  });

  it('protocol has inline mode carve-out for Step 2', () => {
    expect(coachTemplate(baseCtx)).toContain('Step 2 draft is also produced in a follow-up message');
  });

  it('protocol specifies full file rewrite, not partial patch', () => {
    const output = coachTemplate(baseCtx);
    expect(output).toContain('Always show the complete file');
  });

  it('write step instructs updating last_updated to today', () => {
    expect(coachTemplate(baseCtx)).toContain('last_updated');
    expect(coachTemplate(baseCtx)).toContain("today's date");
  });

  it('edit loop is capped at one round', () => {
    const output = coachTemplate(baseCtx);
    expect(output).toContain('This loop runs once');
  });

  it('rejection path tells AI not to resurface within nudge window', () => {
    const output = coachTemplate(baseCtx);
    expect(output).toContain("Got it — skipping that one");
  });

  it('B1 has a Draft looks like block', () => {
    const output = coachTemplate(baseCtx);
    const b1Start = output.indexOf('Behavior 1:');
    const b2Start = output.indexOf('Behavior 2:');
    expect(output.slice(b1Start, b2Start)).toContain('Draft looks like');
  });

  it('B2 has a Draft looks like block for both options', () => {
    const output = coachTemplate(baseCtx);
    const b2Start = output.indexOf('Behavior 2:');
    const b3Start = output.indexOf('Behavior 3:');
    const b2Section = output.slice(b2Start, b3Start);
    expect(b2Section).toContain('Draft looks like (option 1)');
    expect(b2Section).toContain('Draft looks like (option 2)');
  });

  it('B3 has a Draft looks like block', () => {
    const output = coachTemplate(baseCtx);
    const b3Start = output.indexOf('Behavior 3:');
    const b4Start = output.indexOf('Behavior 4:');
    expect(output.slice(b3Start, b4Start)).toContain('Draft looks like');
  });

  it('B4 has a Draft looks like block', () => {
    const output = coachTemplate(baseCtx);
    const b4Start = output.indexOf('Behavior 4:');
    const quarterlyStart = output.indexOf('Quarterly retrospective');
    expect(output.slice(b4Start, quarterlyStart)).toContain('Draft looks like');
  });
});

describe('Iteration 9 — Coach behaviors B5–B12', () => {
  it('explicit mode instruction references all 12 behaviors', () => {
    expect(coachTemplate(baseCtx)).toContain('B1→B12');
  });

  it('coach has Behavior 5 section', () => {
    expect(coachTemplate(baseCtx)).toContain('Behavior 5: Reality drift');
  });

  it('B5 references git commits and PRs', () => {
    const output = coachTemplate(baseCtx);
    const b5Start = output.indexOf('Behavior 5:');
    const b6Start = output.indexOf('Behavior 6:');
    const b5 = output.slice(b5Start, b6Start);
    expect(b5).toContain('commit');
    expect(b5).toContain('signals available in the repo');
  });

  it('coach has Behavior 6 section', () => {
    expect(coachTemplate(baseCtx)).toContain('Behavior 6: Quality bar drift');
  });

  it('B6 references engineering/quality-bar.md', () => {
    const output = coachTemplate(baseCtx);
    const b6Start = output.indexOf('Behavior 6:');
    const b7Start = output.indexOf('Behavior 7:');
    expect(output.slice(b6Start, b7Start)).toContain('quality-bar.md');
  });

  it('coach has Behavior 7 section', () => {
    expect(coachTemplate(baseCtx)).toContain('Behavior 7: Metrics without definitions');
  });

  it('B7 references data/metrics.md', () => {
    const output = coachTemplate(baseCtx);
    const b7Start = output.indexOf('Behavior 7:');
    const b8Start = output.indexOf('Behavior 8:');
    expect(output.slice(b7Start, b8Start)).toContain('data/metrics.md');
  });

  it('coach has Behavior 8 section', () => {
    expect(coachTemplate(baseCtx)).toContain('Behavior 8: Risks listed but never revisited');
  });

  it('B8 references product/risks.md', () => {
    const output = coachTemplate(baseCtx);
    const b8Start = output.indexOf('Behavior 8:');
    const b9Start = output.indexOf('Behavior 9:');
    expect(output.slice(b8Start, b9Start)).toContain('product/risks.md');
  });

  it('coach has Behavior 9 section', () => {
    expect(coachTemplate(baseCtx)).toContain('Behavior 9: Four alignment questions audit');
  });

  it('B9 has quarterly cadence note', () => {
    const output = coachTemplate(baseCtx);
    const b9Start = output.indexOf('Behavior 9:');
    const b10Start = output.indexOf('Behavior 10:');
    const b9 = output.slice(b9Start, b10Start);
    expect(b9).toContain('quarterly');
    expect(b9).toContain('90');
  });

  it('B9 is not an inline behavior', () => {
    const output = coachTemplate(baseCtx);
    const b9Start = output.indexOf('Behavior 9:');
    const b10Start = output.indexOf('Behavior 10:');
    expect(output.slice(b9Start, b10Start)).toContain('Not an inline behavior');
  });

  it('coach has Behavior 10 section', () => {
    expect(coachTemplate(baseCtx)).toContain('Behavior 10: Bedrock need challenge');
  });

  it('B10 mentions underlying need', () => {
    const output = coachTemplate(baseCtx);
    const b10Start = output.indexOf('Behavior 10:');
    const b11Start = output.indexOf('Behavior 11:');
    expect(output.slice(b10Start, b11Start)).toContain('underlying need');
  });

  it('B10 is periodic not constant', () => {
    const output = coachTemplate(baseCtx);
    const b10Start = output.indexOf('Behavior 10:');
    const b11Start = output.indexOf('Behavior 11:');
    expect(output.slice(b10Start, b11Start)).toContain('periodic');
  });

  it('coach has Behavior 11 section', () => {
    expect(coachTemplate(baseCtx)).toContain('Behavior 11: Gap-filling nudges');
  });

  it('B11 nudge memory applies', () => {
    const output = coachTemplate(baseCtx);
    const b11Start = output.indexOf('Behavior 11:');
    const b12Start = output.indexOf('Behavior 12:');
    expect(output.slice(b11Start, b12Start)).toContain('nudge memory');
  });

  it('coach has Behavior 12 section', () => {
    expect(coachTemplate(baseCtx)).toContain('Behavior 12: MCP suggestions');
  });

  it('B12 mentions Notion, Confluence, Google Drive', () => {
    const output = coachTemplate(baseCtx);
    const b12Start = output.indexOf('Behavior 12:');
    const quarterlyStart = output.indexOf('Quarterly retrospective');
    const b12 = output.slice(b12Start, quarterlyStart);
    expect(b12).toContain('Notion MCP');
    expect(b12).toContain('Confluence MCP');
    expect(b12).toContain('Google Drive MCP');
  });

  it('each of B5–B12 has a Draft looks like block', () => {
    const output = coachTemplate(baseCtx);
    for (let i = 5; i <= 12; i++) {
      const bStart = output.indexOf(`Behavior ${i}:`);
      const bEnd = i < 12
        ? output.indexOf(`Behavior ${i + 1}:`)
        : output.indexOf('Quarterly retrospective');
      const section = output.slice(bStart, bEnd);
      // B10, B11, B12 have draft looks like or "Nothing to draft" / offer
      if (i <= 9) {
        expect(section).toContain('Draft looks like');
      }
    }
  });
});

describe('Iteration 7 — Artifact ingestion (local folder)', () => {
  const ingestionCtx: TemplateContext = { ...baseCtx, ingestionPath: './docs' };

  it('ingestion block does not render when ingestionPath is absent', () => {
    expect(coachTemplate(baseCtx)).not.toContain('Shared ingestion reference');
  });

  it('ingestion block renders when ingestionPath is set', () => {
    expect(coachTemplate(ingestionCtx)).toContain('Shared ingestion reference');
  });

  it('ingestion block includes the stale doc check step', () => {
    expect(coachTemplate(ingestionCtx)).toContain('Stale doc check');
  });

  it('ingestion block includes file-mapping table', () => {
    const output = coachTemplate(ingestionCtx);
    expect(output).toContain('product/north-star.md');
    expect(output).toContain('product/outcomes.md');
    expect(output).toContain('product/customers.md');
    expect(output).toContain('engineering/decisions/');
    expect(output).toContain('context/glossary.md');
  });

  it('ingestion block defines all three confidence levels', () => {
    const output = coachTemplate(ingestionCtx);
    expect(output).toContain('High confidence');
    expect(output).toContain('Medium confidence');
    expect(output).toContain('Low confidence');
  });

  it('ingestion block enforces no silent writes', () => {
    expect(coachTemplate(ingestionCtx)).toContain('No silent writes from ingestion');
  });

  it('ingestion block says never skip questions', () => {
    expect(coachTemplate(ingestionCtx)).toContain('Do not skip questions just because the docs seem to cover them');
  });

  it('ingestion block flags stale as 6 months', () => {
    expect(coachTemplate(ingestionCtx)).toContain('6 months');
  });

  it('ingestion block warns to only map files that exist on disk', () => {
    expect(coachTemplate(ingestionCtx)).toContain('Only map content to files that were materialised on disk');
  });
});

describe('Iteration 8 — Artifact ingestion (MCP + paste)', () => {
  const mcpCtx: TemplateContext = { ...baseCtx, ingestion: 'mcp' };
  const pasteCtx: TemplateContext = { ...baseCtx, ingestion: 'paste' };
  const skipCtx: TemplateContext = { ...baseCtx, ingestion: 'skip' };

  it('MCP block renders when ingestion is mcp', () => {
    expect(coachTemplate(mcpCtx)).toContain('MCP source guidance');
  });

  it('MCP block does not render for local, paste, or skip', () => {
    expect(coachTemplate(baseCtx)).not.toContain('MCP source guidance');
    expect(coachTemplate(pasteCtx)).not.toContain('MCP source guidance');
    expect(coachTemplate(skipCtx)).not.toContain('MCP source guidance');
  });

  it('MCP block includes Notion, Confluence, Google Drive guidance', () => {
    const output = coachTemplate(mcpCtx);
    expect(output).toContain('Notion MCP');
    expect(output).toContain('Confluence MCP');
    expect(output).toContain('Google Drive MCP');
  });

  it('MCP block includes fallback when no servers respond', () => {
    expect(coachTemplate(mcpCtx)).toContain('If no MCP servers respond at all');
  });

  it('MCP block includes feedback summary before interview', () => {
    expect(coachTemplate(mcpCtx)).toContain('Feedback summary');
  });

  it('MCP block enforces no silent writes', () => {
    expect(coachTemplate(mcpCtx)).toContain('No silent writes from ingestion');
  });

  it('paste block renders when ingestion is paste', () => {
    expect(coachTemplate(pasteCtx)).toContain('paste content');
  });

  it('paste block does not render for mcp, local, or skip', () => {
    expect(coachTemplate(mcpCtx)).not.toContain('Paste them now');
    expect(coachTemplate(skipCtx)).not.toContain('Paste them now');
  });

  it('paste block instructs AI to wait for paste before interview', () => {
    expect(coachTemplate(pasteCtx)).toContain('Paste them now');
  });

  it('paste block includes feedback summary after paste', () => {
    expect(coachTemplate(pasteCtx)).toContain('Feedback summary');
  });

  it('paste block has fallback if nothing is pasted', () => {
    expect(coachTemplate(pasteCtx)).toContain("No problem — I'll ask each question fresh");
  });

  it('paste block enforces no silent writes', () => {
    expect(coachTemplate(pasteCtx)).toContain('No silent writes from ingestion');
  });

  it('skip and absent produce no ingestion block', () => {
    expect(coachTemplate(skipCtx)).not.toContain('Shared ingestion reference');
    expect(coachTemplate(baseCtx)).not.toContain('Shared ingestion reference');
  });
});

describe('Iteration 10 — Quarterly retrospective', () => {
  it('retro section has a trigger definition with last_retrospective and last_updated fallback', () => {
    const output = coachTemplate(baseCtx);
    const retroStart = output.indexOf('## Quarterly retrospective');
    const onboardingStart = output.indexOf('## Onboarding interview');
    const retro = output.slice(retroStart, onboardingStart);
    expect(retro).toContain('last_retrospective');
    expect(retro).toContain('last_updated');
  });

  it('retro trigger references 90-day threshold', () => {
    const output = coachTemplate(baseCtx);
    const retroStart = output.indexOf('## Quarterly retrospective');
    const onboardingStart = output.indexOf('## Onboarding interview');
    const retro = output.slice(retroStart, onboardingStart);
    expect(retro).toContain('90');
  });

  it('retro is never offered inline', () => {
    const output = coachTemplate(baseCtx);
    const retroStart = output.indexOf('## Quarterly retrospective');
    const onboardingStart = output.indexOf('## Onboarding interview');
    expect(output.slice(retroStart, onboardingStart)).toContain('Never offer the retrospective inline');
  });

  it('retro has a decline path', () => {
    const output = coachTemplate(baseCtx);
    const retroStart = output.indexOf('## Quarterly retrospective');
    const onboardingStart = output.indexOf('## Onboarding interview');
    expect(output.slice(retroStart, onboardingStart)).toContain("check back in a week");
  });

  it('retro has all 5 questions', () => {
    const output = coachTemplate(baseCtx);
    const retroStart = output.indexOf('## Quarterly retrospective');
    const onboardingStart = output.indexOf('## Onboarding interview');
    const retro = output.slice(retroStart, onboardingStart);
    expect(retro).toContain('Q1.');
    expect(retro).toContain('Q2.');
    expect(retro).toContain('Q3.');
    expect(retro).toContain('Q4.');
    expect(retro).toContain('Q5.');
  });

  it('retro has response storage format with Retrospective log', () => {
    const output = coachTemplate(baseCtx);
    const retroStart = output.indexOf('## Quarterly retrospective');
    const onboardingStart = output.indexOf('## Onboarding interview');
    expect(output.slice(retroStart, onboardingStart)).toContain('Retrospective log');
  });

  it('retro storage updates last_retrospective after writing', () => {
    const output = coachTemplate(baseCtx);
    const retroStart = output.indexOf('## Quarterly retrospective');
    const onboardingStart = output.indexOf('## Onboarding interview');
    const retro = output.slice(retroStart, onboardingStart);
    expect(retro).toContain('last_retrospective');
    expect(retro).toContain("today's date");
  });

  it('retro has nudge tuning table', () => {
    const output = coachTemplate(baseCtx);
    const retroStart = output.indexOf('## Quarterly retrospective');
    const onboardingStart = output.indexOf('## Onboarding interview');
    expect(output.slice(retroStart, onboardingStart)).toContain('Nudge tuning');
  });

  it('nudge tuning maps Q1 to B1 and Q2 to B2', () => {
    const output = coachTemplate(baseCtx);
    const retroStart = output.indexOf('## Quarterly retrospective');
    const onboardingStart = output.indexOf('## Onboarding interview');
    const retro = output.slice(retroStart, onboardingStart);
    expect(retro).toContain('Lower B1 threshold');
    expect(retro).toContain('Lower B2 staleness threshold');
  });
});

describe('Iteration 9b — strategy.md template', () => {
  const output = () => strategyTemplate(baseCtx);

  it('has parseable frontmatter with required fields', () => {
    const fm = parseFrontmatter(output());
    expect(fm).not.toBeNull();
    expect(fm!.purpose).toBeTruthy();
    expect(fm!.read_when).toBeTruthy();
    expect(fm!.last_updated).toBeTruthy();
  });

  it('contains Diagnosis section', () => {
    expect(output()).toContain('## Diagnosis');
  });

  it('contains Guiding Policy section', () => {
    expect(output()).toContain('## Guiding Policy');
  });

  it('contains Coherent Actions section', () => {
    expect(output()).toContain('## Coherent Actions');
  });

  it('contains first-open framing about saying no', () => {
    expect(output().toLowerCase()).toMatch(/only useful if it says no/);
  });

  it('contains coach interrogation instruction for platitude policies', () => {
    expect(output().toLowerCase()).toMatch(/all yes|says no to something/);
  });

  it('contains BAD example in Coherent Actions', () => {
    expect(output()).toMatch(/BAD/);
  });

  it('contains GOOD example in Coherent Actions', () => {
    expect(output()).toMatch(/GOOD/);
  });

  it('anchors Diagnosis to north-star', () => {
    expect(output().toLowerCase()).toMatch(/north.star/);
  });
});

describe('Iteration 9b — assumptions.md new fields', () => {
  const output = () => assumptionsTemplate(baseCtx);

  it('contains Last Validated field', () => {
    expect(output()).toMatch(/Last Validated:/);
  });

  it('contains Evidence field', () => {
    expect(output()).toMatch(/Evidence:/);
  });

  it('contains Experiment readouts section', () => {
    expect(output()).toContain('## Experiment readouts');
  });

  it('readout section has do-not-pre-fill instruction', () => {
    const readoutIdx = output().indexOf('## Experiment readouts');
    expect(readoutIdx).toBeGreaterThan(-1);
    const readoutSection = output().slice(readoutIdx);
    expect(readoutSection.toLowerCase()).toMatch(/do not pre.fill|not pre.fill/);
  });
});

describe('Iteration 9b — B13 build-trap detector', () => {
  const output = () => coachTemplate(baseCtx);

  it('coach contains B13 build-trap section', () => {
    expect(output()).toMatch(/B13|build.trap/i);
  });

  it('B13 trigger references now-next-later.md Now section', () => {
    const coachOutput = output();
    const b13Start = coachOutput.search(/B13|build.trap/i);
    const b13Section = coachOutput.slice(b13Start, b13Start + 800);
    expect(b13Section.toLowerCase()).toMatch(/now.next.later|"now"/);
  });

  it('B13 references Last Validated in assumptions.md', () => {
    const coachOutput = output();
    const b13Start = coachOutput.search(/B13|build.trap/i);
    const b13Section = coachOutput.slice(b13Start, b13Start + 800);
    expect(b13Section).toMatch(/Last Validated/);
  });

  it('B13 offers to draft an assumption entry', () => {
    const coachOutput = output();
    const b13Start = coachOutput.search(/B13|build.trap/i);
    const b13Section = coachOutput.slice(b13Start, b13Start + 800);
    expect(b13Section.toLowerCase()).toMatch(/draft.*assumption|assumption.*entry/);
  });

  it('B13 does not block — no "will not proceed" language', () => {
    const coachOutput = output();
    const b13Start = coachOutput.search(/B13|build.trap/i);
    const b13Section = coachOutput.slice(b13Start, b13Start + 800);
    expect(b13Section.toLowerCase()).not.toMatch(/will not proceed|blocked|cannot proceed/);
  });
});

describe('Iteration 9b — B15 Phase 2 experiment readout', () => {
  const output = () => coachTemplate(baseCtx);

  it('coach contains B15 Phase 2 section', () => {
    expect(output()).toMatch(/B15|experiment readout/i);
  });

  it('B15 trigger references experiment result signals', () => {
    const coachOutput = output();
    const b15Start = coachOutput.search(/B15|experiment readout/i);
    const b15Section = coachOutput.slice(b15Start, b15Start + 1000);
    expect(b15Section.toLowerCase()).toMatch(/results came back|we saw|experiment ended/);
  });

  it('B15 includes gap analysis for >20% delta', () => {
    const coachOutput = output();
    const b15Start = coachOutput.search(/B15|experiment readout/i);
    const b15Section = coachOutput.slice(b15Start, b15Start + 1000);
    expect(b15Section).toMatch(/20%|gap analysis/i);
  });

  it('B15 includes segment check instruction', () => {
    const coachOutput = output();
    const b15Start = coachOutput.search(/B15|experiment readout/i);
    const b15Section = coachOutput.slice(b15Start, b15Start + 1000);
    expect(b15Section.toLowerCase()).toMatch(/segment/);
  });

  it('B15 draft format includes expected/actual table', () => {
    const coachOutput = output();
    const b15Start = coachOutput.search(/B15|experiment readout/i);
    const b15Section = coachOutput.slice(b15Start, b15Start + 1200);
    expect(b15Section).toMatch(/Expected.*Actual|expected.*actual/i);
  });

  it('B15 does not block', () => {
    const coachOutput = output();
    const b15Start = coachOutput.search(/B15|experiment readout/i);
    const b15Section = coachOutput.slice(b15Start, b15Start + 1000);
    expect(b15Section.toLowerCase()).not.toMatch(/will not proceed|blocked|cannot proceed/);
  });
});

describe('Iteration 9b — B16 strategy coherence', () => {
  const output = () => coachTemplate(baseCtx);

  it('coach contains B16 strategy coherence section', () => {
    expect(output()).toMatch(/B16|strategy coherence/i);
  });

  it('B16 trigger references now-next-later.md and strategy.md', () => {
    const coachOutput = output();
    const b16Start = coachOutput.search(/B16|strategy coherence/i);
    const b16Section = coachOutput.slice(b16Start, b16Start + 1000);
    expect(b16Section.toLowerCase()).toMatch(/now.next.later/);
    expect(b16Section.toLowerCase()).toMatch(/strategy\.md/);
  });

  it('B16 includes solo fallback (one question, no file required)', () => {
    const coachOutput = output();
    const b16Start = coachOutput.search(/B16|strategy coherence/i);
    const b16Section = coachOutput.slice(b16Start, b16Start + 1000);
    expect(b16Section.toLowerCase()).toMatch(/solo|strategy\.md.*absent|no strategy/);
  });

  it('B16 never blocks', () => {
    const coachOutput = output();
    const b16Start = coachOutput.search(/B16|strategy coherence/i);
    const b16Section = coachOutput.slice(b16Start, b16Start + 1000);
    expect(b16Section.toLowerCase()).not.toMatch(/will not add|blocked|cannot add/);
  });

  it('B16 affirms aligned items briefly', () => {
    const coachOutput = output();
    const b16Start = coachOutput.search(/B16|strategy coherence/i);
    const b16Section = coachOutput.slice(b16Start, b16Start + 1000);
    expect(b16Section.toLowerCase()).toMatch(/aligns|affirm|connects/);
  });
});

describe('Iteration 9b — F4.9 context priority hierarchy', () => {
  const output = () => coachTemplate(baseCtx);

  it('coach contains context priority section', () => {
    expect(output()).toMatch(/[Cc]ontext priority/);
  });

  it('priority hierarchy lists north-star first', () => {
    const coachOutput = output();
    const priorityStart = coachOutput.search(/[Cc]ontext priority/);
    const prioritySection = coachOutput.slice(priorityStart, priorityStart + 600);
    expect(prioritySection.toLowerCase()).toMatch(/north.star/);
  });

  it('priority hierarchy lists strategy.md second', () => {
    const coachOutput = output();
    const priorityStart = coachOutput.search(/[Cc]ontext priority/);
    const prioritySection = coachOutput.slice(priorityStart, priorityStart + 600);
    const northStarPos = prioritySection.toLowerCase().indexOf('north-star');
    const strategyPos = prioritySection.toLowerCase().indexOf('strategy');
    expect(strategyPos).toBeGreaterThan(northStarPos);
  });

  it('priority hierarchy includes outcomes and now-next-later', () => {
    const coachOutput = output();
    const priorityStart = coachOutput.search(/[Cc]ontext priority/);
    const prioritySection = coachOutput.slice(priorityStart, priorityStart + 600);
    expect(prioritySection.toLowerCase()).toMatch(/outcomes/);
    expect(prioritySection.toLowerCase()).toMatch(/now.next.later/);
  });

  it('instructs coach to name conflicts explicitly', () => {
    const coachOutput = output();
    const priorityStart = coachOutput.search(/[Cc]ontext priority/);
    const prioritySection = coachOutput.slice(priorityStart, priorityStart + 600);
    expect(prioritySection.toLowerCase()).toMatch(/name.*conflict|conflict.*explicit/);
  });
});

describe('B17 — team-specific lesson capture', () => {
  const output = () => coachTemplate(baseCtx);

  it('coach contains B17 section', () => {
    expect(output()).toMatch(/Behavior 17|team.specific lesson/i);
  });

  it('B17 triggers on recurring-pattern signal phrases', () => {
    const coachOutput = output();
    const b17Start = coachOutput.search(/Behavior 17|team.specific lesson/i);
    const b17Section = coachOutput.slice(b17Start, b17Start + 1500);
    expect(b17Section.toLowerCase()).toMatch(/we keep doing|third time|we always/);
  });

  it('B17 offers to add rule to team-lessons.md', () => {
    const coachOutput = output();
    const b17Start = coachOutput.search(/Behavior 17|team.specific lesson/i);
    const b17Section = coachOutput.slice(b17Start, b17Start + 1500);
    expect(b17Section).toMatch(/team-lessons\.md/);
  });

  it('B17 follows conversation-as-update protocol (draft then confirm)', () => {
    const coachOutput = output();
    const b17Start = coachOutput.search(/Behavior 17|team.specific lesson/i);
    const b17Section = coachOutput.slice(b17Start, b17Start + 1500);
    expect(b17Section.toLowerCase()).toMatch(/confirm|confirmation|edit/);
  });

  it('B17 supports rule retirement', () => {
    const coachOutput = output();
    const b17Start = coachOutput.search(/Behavior 17|team.specific lesson/i);
    const b17Section = coachOutput.slice(b17Start, b17Start + 2000);
    expect(b17Section.toLowerCase()).toMatch(/retir/);
  });

  it('team-lessons.md loading instruction present in context priority section', () => {
    const coachOutput = output();
    const priorityStart = coachOutput.search(/[Cc]ontext priority/);
    const prioritySection = coachOutput.slice(priorityStart, priorityStart + 1000);
    expect(prioritySection).toMatch(/team-lessons\.md/);
  });

  it('B17 applies to both solo and full profiles', () => {
    const soloOutput = coachTemplate({ ...baseCtx, profile: 'solo' });
    const fullOutput = coachTemplate({ ...baseCtx, profile: 'full' });
    expect(soloOutput).toMatch(/Behavior 17|team.specific lesson/i);
    expect(fullOutput).toMatch(/Behavior 17|team.specific lesson/i);
  });
});

describe('Iteration 9b — scaffold strategy.md wiring', () => {
  it('full profile includes strategy.md', () => {
    const fullPaths = expectedPaths('full', 'claude');
    expect(fullPaths).toContain('team-foundry/product/strategy.md');
  });

  it('solo profile does not include strategy.md', () => {
    const soloPaths = expectedPaths('solo', 'claude');
    expect(soloPaths).not.toContain('team-foundry/product/strategy.md');
  });

  it('full profile has one more file than before (strategy.md added)', () => {
    const fullPaths = expectedPaths('full', 'claude');
    const soloPaths = expectedPaths('solo', 'claude');
    // full has all solo files + 13 full-only files (was 12, now 13 with strategy.md)
    expect(fullPaths.length - soloPaths.length).toBe(13);
  });
});
