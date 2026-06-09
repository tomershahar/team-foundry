import type { ScaffoldOptions, TemplateContext } from './types.js';
import {
  federatedProductTemplate,
  federatedTeamTemplate,
  federatedEngineeringTemplate,
  federatedDesignTemplate,
  federatedDataTemplate,
  federatedContextTemplate,
} from './templates/federated/index.js';
import {
  introSkillTemplate,
  statusSkillTemplate,
  reviewSkillTemplate,
  captureSkillTemplate,
  decisionSkillTemplate,
  featureSkillTemplate,
} from './templates/skills/index.js';
import {
  rootClaudeTemplate,
  rootGeminiTemplate,
  rootCursorTemplate,
  rootAgentsTemplate,
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
  hierarchyTemplate,
  hooksTemplate,
  rulesTemplate,
} from './templates/index.js';

/**
 * Single source of truth for every file team-foundry materializes.
 * scaffold() writes from these entries; status derives its tracked-file
 * lists from the same entries, so the two can no longer drift apart.
 */
export interface FileEntry {
  /** Relative path within targetDir (e.g. "team-foundry/product/outcomes.md") */
  relativePath: string;
  content: (ctx: TemplateContext) => string;
  /**
   * Tracked by `status`: content files with owner/last_updated frontmatter whose
   * health (stale/empty/missing) is reported. Infrastructure files (coach,
   * instructions, READMEs, skills) are not tracked.
   */
  tracked?: boolean;
}

/** Root files always written regardless of tool choice */
export const ALWAYS_ROOT_ENTRIES: FileEntry[] = [
  { relativePath: 'AGENTS.md', content: rootAgentsTemplate },
];

/** Files written for every profile */
export const SOLO_ENTRIES: FileEntry[] = [
  { relativePath: 'GETTING_STARTED.md', content: gettingStartedTemplate },
  { relativePath: '.team-foundry/coach.md', content: coachTemplate },
  { relativePath: 'team-foundry/product/north-star.md', content: northStarTemplate, tracked: true },
  { relativePath: 'team-foundry/product/outcomes.md', content: outcomesTemplate, tracked: true },
  { relativePath: 'team-foundry/product/customers.md', content: customersTemplate, tracked: true },
  { relativePath: 'team-foundry/engineering/stack.md', content: stackTemplate, tracked: true },
];

/** Additional files written only for full profile (flat layout) */
export const FULL_ONLY_ENTRIES: FileEntry[] = [
  { relativePath: 'team-foundry/product/now-next-later.md', content: nowNextLaterTemplate, tracked: true },
  { relativePath: 'team-foundry/product/assumptions.md', content: assumptionsTemplate, tracked: true },
  { relativePath: 'team-foundry/product/risks.md', content: risksTemplate, tracked: true },
  { relativePath: 'team-foundry/team/trio.md', content: trioTemplate, tracked: true },
  { relativePath: 'team-foundry/team/working-agreement.md', content: workingAgreementTemplate, tracked: true },
  { relativePath: 'team-foundry/team/ai-practices.md', content: aiPracticesTemplate, tracked: true },
  { relativePath: 'team-foundry/engineering/quality-bar.md', content: qualityBarTemplate, tracked: true },
  {
    relativePath: 'team-foundry/engineering/decisions/README.md',
    content: decisionsReadmeTemplate,
  },
  { relativePath: 'team-foundry/design/principles.md', content: principlesTemplate, tracked: true },
  { relativePath: 'team-foundry/data/metrics.md', content: metricsTemplate, tracked: true },
  { relativePath: 'team-foundry/context/glossary.md', content: glossaryTemplate, tracked: true },
  { relativePath: 'team-foundry/context/stakeholders.md', content: stakeholdersTemplate, tracked: true },
  { relativePath: 'team-foundry/product/strategy.md', content: strategyTemplate, tracked: true },
  { relativePath: '.team-foundry/hierarchy.md', content: hierarchyTemplate },
  { relativePath: '.team-foundry/instructions/hooks.md', content: hooksTemplate },
  { relativePath: '.team-foundry/instructions/rules.md', content: rulesTemplate },
];

/** Per-folder CLAUDE.md files written only for full profile in federated layout */
export const FEDERATED_ENTRIES: FileEntry[] = [
  { relativePath: 'team-foundry/product/CLAUDE.md', content: federatedProductTemplate },
  { relativePath: 'team-foundry/team/CLAUDE.md', content: federatedTeamTemplate },
  { relativePath: 'team-foundry/engineering/CLAUDE.md', content: federatedEngineeringTemplate },
  { relativePath: 'team-foundry/design/CLAUDE.md', content: federatedDesignTemplate },
  { relativePath: 'team-foundry/data/CLAUDE.md', content: federatedDataTemplate },
  { relativePath: 'team-foundry/context/CLAUDE.md', content: federatedContextTemplate },
];

/** Pre-built Claude Code skill files  -  written when tool is claude or both.
 *  Layout is .claude/skills/<name>/SKILL.md per the skills spec — flat .md files
 *  directly in .claude/skills/ are not discovered by Claude Code. */
export const CLAUDE_SKILLS_ENTRIES: FileEntry[] = [
  { relativePath: '.claude/skills/team-foundry-intro/SKILL.md', content: introSkillTemplate },
  { relativePath: '.claude/skills/team-foundry-status/SKILL.md', content: statusSkillTemplate },
  { relativePath: '.claude/skills/team-foundry-review/SKILL.md', content: reviewSkillTemplate },
  { relativePath: '.claude/skills/team-foundry-capture/SKILL.md', content: captureSkillTemplate },
  { relativePath: '.claude/skills/team-foundry-decision/SKILL.md', content: decisionSkillTemplate },
  { relativePath: '.claude/skills/team-foundry-feature/SKILL.md', content: featureSkillTemplate },
];

/** Returns the root instruction file entry/entries based on tool choice */
export function rootEntries(tool: ScaffoldOptions['tool']): FileEntry[] {
  if (tool === 'claude') {
    return [{ relativePath: 'CLAUDE.md', content: rootClaudeTemplate }];
  }
  if (tool === 'gemini') {
    return [{ relativePath: 'GEMINI.md', content: rootGeminiTemplate }];
  }
  if (tool === 'cursor') {
    return [{ relativePath: '.cursor/rules/team-foundry.mdc', content: rootCursorTemplate }];
  }
  if (tool === 'all') {
    return [
      { relativePath: 'CLAUDE.md', content: rootClaudeTemplate },
      { relativePath: 'GEMINI.md', content: rootGeminiTemplate },
      { relativePath: '.cursor/rules/team-foundry.mdc', content: rootCursorTemplate },
    ];
  }
  return [
    { relativePath: 'CLAUDE.md', content: rootClaudeTemplate },
    { relativePath: 'GEMINI.md', content: rootGeminiTemplate },
  ];
}

/** True when the tool choice includes Claude Code (and therefore its skills) */
export function includesClaudeSkills(tool: ScaffoldOptions['tool']): boolean {
  return tool === 'claude' || tool === 'both' || tool === 'all';
}

/** Relative paths of files whose health `status` reports, in display order */
export function trackedPaths(profile: ScaffoldOptions['profile']): string[] {
  const entries = profile === 'full' ? [...SOLO_ENTRIES, ...FULL_ONLY_ENTRIES] : SOLO_ENTRIES;
  return entries.filter((e) => e.tracked).map((e) => e.relativePath);
}
