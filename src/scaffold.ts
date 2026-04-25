import fs from 'fs/promises';
import path from 'path';
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
} from './templates/index.js';

interface FileEntry {
  /** Relative path within targetDir (e.g. "team-foundry/product/outcomes.md") */
  relativePath: string;
  content: (ctx: TemplateContext) => string;
}

/** Files written for every profile */
const SOLO_ENTRIES: FileEntry[] = [
  { relativePath: 'GETTING_STARTED.md', content: gettingStartedTemplate },
  { relativePath: '.team-foundry/coach.md', content: coachTemplate },
  { relativePath: 'team-foundry/product/north-star.md', content: northStarTemplate },
  { relativePath: 'team-foundry/product/outcomes.md', content: outcomesTemplate },
  { relativePath: 'team-foundry/product/customers.md', content: customersTemplate },
  { relativePath: 'team-foundry/engineering/stack.md', content: stackTemplate },
];

/** Additional files written only for full profile (flat layout) */
const FULL_ONLY_ENTRIES: FileEntry[] = [
  { relativePath: 'team-foundry/product/now-next-later.md', content: nowNextLaterTemplate },
  { relativePath: 'team-foundry/product/assumptions.md', content: assumptionsTemplate },
  { relativePath: 'team-foundry/product/risks.md', content: risksTemplate },
  { relativePath: 'team-foundry/team/trio.md', content: trioTemplate },
  { relativePath: 'team-foundry/team/working-agreement.md', content: workingAgreementTemplate },
  { relativePath: 'team-foundry/team/ai-practices.md', content: aiPracticesTemplate },
  { relativePath: 'team-foundry/engineering/quality-bar.md', content: qualityBarTemplate },
  {
    relativePath: 'team-foundry/engineering/decisions/README.md',
    content: decisionsReadmeTemplate,
  },
  { relativePath: 'team-foundry/design/principles.md', content: principlesTemplate },
  { relativePath: 'team-foundry/data/metrics.md', content: metricsTemplate },
  { relativePath: 'team-foundry/context/glossary.md', content: glossaryTemplate },
  { relativePath: 'team-foundry/context/stakeholders.md', content: stakeholdersTemplate },
  { relativePath: 'team-foundry/product/strategy.md', content: strategyTemplate },
];

/** Per-folder CLAUDE.md files written only for full profile in federated layout */
const FEDERATED_ENTRIES: FileEntry[] = [
  { relativePath: 'team-foundry/product/CLAUDE.md', content: federatedProductTemplate },
  { relativePath: 'team-foundry/team/CLAUDE.md', content: federatedTeamTemplate },
  { relativePath: 'team-foundry/engineering/CLAUDE.md', content: federatedEngineeringTemplate },
  { relativePath: 'team-foundry/design/CLAUDE.md', content: federatedDesignTemplate },
  { relativePath: 'team-foundry/data/CLAUDE.md', content: federatedDataTemplate },
  { relativePath: 'team-foundry/context/CLAUDE.md', content: federatedContextTemplate },
];

/** Returns the root instruction file entry/entries based on tool choice */
function rootEntries(tool: ScaffoldOptions['tool']): FileEntry[] {
  if (tool === 'claude') {
    return [{ relativePath: 'CLAUDE.md', content: rootClaudeTemplate }];
  }
  if (tool === 'gemini') {
    return [{ relativePath: 'GEMINI.md', content: rootGeminiTemplate }];
  }
  if (tool === 'cursor') {
    return [{ relativePath: '.cursor/rules/team-foundry.mdc', content: rootCursorTemplate }];
  }
  return [
    { relativePath: 'CLAUDE.md', content: rootClaudeTemplate },
    { relativePath: 'GEMINI.md', content: rootGeminiTemplate },
  ];
}

export async function scaffold(options: ScaffoldOptions): Promise<void> {
  const { targetDir, profile, tool, repoVisibility, date, ingestionPath, ingestion, federated } = options;

  const ctx: TemplateContext = { profile, tool, repoVisibility, date, ingestionPath, ingestion };

  const entries: FileEntry[] = [
    ...rootEntries(tool),
    ...SOLO_ENTRIES,
    ...(profile === 'full' ? FULL_ONLY_ENTRIES : []),
    ...(profile === 'full' && federated ? FEDERATED_ENTRIES : []),
  ];

  for (const entry of entries) {
    const fullPath = path.join(targetDir, entry.relativePath);
    const dir = path.dirname(fullPath);

    await fs.mkdir(dir, { recursive: true });

    // Skip if already exists — never overwrite without user confirmation
    try {
      await fs.access(fullPath);
      // File exists — skip
      continue;
    } catch {
      // File does not exist — write it
    }

    await fs.writeFile(fullPath, entry.content(ctx), 'utf-8');
  }
}

/** Returns the expected file paths for a given profile, tool, and layout (relative to targetDir) */
export function expectedPaths(
  profile: ScaffoldOptions['profile'],
  tool: ScaffoldOptions['tool'],
  federated = false,
): string[] {
  const roots =
    tool === 'both'
      ? ['CLAUDE.md', 'GEMINI.md']
      : tool === 'claude'
        ? ['CLAUDE.md']
        : tool === 'cursor'
          ? ['.cursor/rules/team-foundry.mdc']
          : ['GEMINI.md'];

  const solo = SOLO_ENTRIES.map((e) => e.relativePath);
  const full = profile === 'full' ? FULL_ONLY_ENTRIES.map((e) => e.relativePath) : [];
  const fed = profile === 'full' && federated ? FEDERATED_ENTRIES.map((e) => e.relativePath) : [];

  return [...roots, ...solo, ...full, ...fed];
}
