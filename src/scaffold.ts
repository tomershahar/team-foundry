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

const MERGE_MARKER_START = '<!-- BEGIN TEAM-FOUNDRY SECTION -->';
const MERGE_MARKER_END = '<!-- END TEAM-FOUNDRY SECTION -->';

const ROOT_INSTRUCTION_PATHS = new Set([
  'AGENTS.md',
  'CLAUDE.md',
  'GEMINI.md',
  '.cursor/rules/team-foundry.mdc',
]);

interface FileEntry {
  /** Relative path within targetDir (e.g. "team-foundry/product/outcomes.md") */
  relativePath: string;
  content: (ctx: TemplateContext) => string;
}

/** Root files always written regardless of tool choice */
const ALWAYS_ROOT_ENTRIES: FileEntry[] = [
  { relativePath: 'AGENTS.md', content: rootAgentsTemplate },
];

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
  { relativePath: '.team-foundry/hierarchy.md', content: hierarchyTemplate },
  { relativePath: '.team-foundry/instructions/hooks.md', content: hooksTemplate },
  { relativePath: '.team-foundry/instructions/rules.md', content: rulesTemplate },
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

/** Pre-built Claude Code skill files  -  written when tool is claude or both */
const CLAUDE_SKILLS_ENTRIES: FileEntry[] = [
  { relativePath: '.claude/skills/team-foundry-intro.md', content: introSkillTemplate },
  { relativePath: '.claude/skills/team-foundry-status.md', content: statusSkillTemplate },
  { relativePath: '.claude/skills/team-foundry-review.md', content: reviewSkillTemplate },
  { relativePath: '.claude/skills/team-foundry-capture.md', content: captureSkillTemplate },
  { relativePath: '.claude/skills/team-foundry-decision.md', content: decisionSkillTemplate },
  { relativePath: '.claude/skills/team-foundry-feature.md', content: featureSkillTemplate },
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

async function applyMergeDecision(
  fullPath: string,
  relativePath: string,
  newContent: string,
  decision: 'merge' | 'replace' | 'skip',
  targetDir: string,
): Promise<boolean> {
  if (decision === 'skip') return false;

  if (decision === 'replace') {
    const filename = path.basename(relativePath);
    const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const backupsDir = path.join(targetDir, '.team-foundry', 'backups');
    await fs.mkdir(backupsDir, { recursive: true });
    let backupPath = path.join(backupsDir, `${filename}.${ts}.backup`);
    let suffix = 2;
    while (true) {
      try {
        await fs.access(backupPath);
        backupPath = path.join(backupsDir, `${filename}.${ts}-${suffix++}.backup`);
      } catch {
        break;
      }
    }
    const existing = await fs.readFile(fullPath, 'utf-8');
    await fs.writeFile(backupPath, existing, 'utf-8');
    await fs.writeFile(fullPath, newContent, 'utf-8');
    return true;
  }

  // 'merge'
  const existing = await fs.readFile(fullPath, 'utf-8');
  const wrappedContent = `${MERGE_MARKER_START}\n${newContent}\n${MERGE_MARKER_END}`;
  let merged: string;

  if (existing.includes(MERGE_MARKER_START)) {
    const startIdx = existing.indexOf(MERGE_MARKER_START);
    const endIdx = existing.indexOf(MERGE_MARKER_END) + MERGE_MARKER_END.length;
    merged = existing.slice(0, startIdx) + wrappedContent + existing.slice(endIdx);
  } else {
    merged = existing + '\n\n' + wrappedContent;
  }

  await fs.writeFile(fullPath, merged, 'utf-8');
  return true;
}

export async function scaffold(options: ScaffoldOptions): Promise<string[]> {
  const { targetDir, profile, tool, repoVisibility, date, ingestionPath, ingestion, federated, mergeDecisions } = options;

  let extractedStack: TemplateContext['extractedStack'] = undefined;
  
  // Prefer cwd: users almost always run the CLI from their project root.
  // targetDir is the fallback for when scaffold is called with an explicit output path.
  const pathsToTry = [
    path.join(process.cwd(), 'package.json'),
    path.join(targetDir, 'package.json'),
  ];

  let pkgPath: string | null = null;
  for (const p of pathsToTry) {
    try {
      await fs.access(p);
      pkgPath = p;
      break;
    } catch {
      // ignore
    }
  }

  if (pkgPath) {
    try {
      const pkgStr = await fs.readFile(pkgPath, 'utf-8');
      const pkg = JSON.parse(pkgStr);
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };
      extractedStack = {
        name: pkg.name,
        dependencies: pkg.dependencies,
        devDependencies: pkg.devDependencies,
        hasTypeScript: 'typescript' in deps,
        hasVitest: 'vitest' in deps,
        hasJest: 'jest' in deps,
        hasEslint: 'eslint' in deps,
        hasPrettier: 'prettier' in deps,
      };
    } catch {
      // ignore invalid package.json
    }
  }

  const ctx: TemplateContext = {
    profile,
    tool,
    repoVisibility,
    date,
    ingestionPath,
    ingestion,
    federated,
    extractedStack
  };

  const includesSkills = tool === 'claude' || tool === 'both' || tool === 'all';

  const entries: FileEntry[] = [
    ...ALWAYS_ROOT_ENTRIES,
    ...rootEntries(tool),
    ...SOLO_ENTRIES,
    ...(profile === 'full' ? FULL_ONLY_ENTRIES : []),
    ...(profile === 'full' && federated ? FEDERATED_ENTRIES : []),
    ...(includesSkills ? CLAUDE_SKILLS_ENTRIES : []),
  ];

  const written: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(targetDir, entry.relativePath);
    const dir = path.dirname(fullPath);
    await fs.mkdir(dir, { recursive: true });

    // Root instruction files: apply merge decision if file exists and mergeDecisions is provided
    if (ROOT_INSTRUCTION_PATHS.has(entry.relativePath) && mergeDecisions !== undefined) {
      let fileExists = false;
      try {
        await fs.access(fullPath);
        fileExists = true;
      } catch { /* not found */ }

      if (fileExists) {
        const decision = mergeDecisions[entry.relativePath] ?? 'merge';
        const didWrite = await applyMergeDecision(
          fullPath,
          entry.relativePath,
          entry.content(ctx),
          decision,
          targetDir,
        );
        if (didWrite) written.push(entry.relativePath);
        continue;
      }
    }

    // Default: skip if already exists
    try {
      await fs.access(fullPath);
      continue; // file exists — skip
    } catch { /* not found — write it */ }

    await fs.writeFile(fullPath, entry.content(ctx), 'utf-8');
    written.push(entry.relativePath);
  }

  return written;
}

/** Returns the git add + commit command appropriate for the chosen tool. */
export function gitAddCommand(tool: ScaffoldOptions['tool']): string {
  const toolFiles: string[] = [];
  if (tool === 'claude' || tool === 'both' || tool === 'all') toolFiles.push('CLAUDE.md', '.claude/');
  if (tool === 'gemini' || tool === 'both' || tool === 'all') toolFiles.push('GEMINI.md');
  if (tool === 'cursor' || tool === 'all') toolFiles.push('.cursor/');

  const paths = [
    'team-foundry/',
    '.team-foundry/',
    'AGENTS.md',
    'GETTING_STARTED.md',
    ...toolFiles,
  ].join(' ');

  return `git add ${paths} && git commit -m "Add team-foundry"`;
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
          : tool === 'all'
            ? ['CLAUDE.md', 'GEMINI.md', '.cursor/rules/team-foundry.mdc']
            : ['GEMINI.md'];

  const alwaysRoot = ALWAYS_ROOT_ENTRIES.map((e) => e.relativePath);
  const solo = SOLO_ENTRIES.map((e) => e.relativePath);
  const full = profile === 'full' ? FULL_ONLY_ENTRIES.map((e) => e.relativePath) : [];
  const fed = profile === 'full' && federated ? FEDERATED_ENTRIES.map((e) => e.relativePath) : [];
  const skills = (tool === 'claude' || tool === 'both' || tool === 'all') ? CLAUDE_SKILLS_ENTRIES.map((e) => e.relativePath) : [];

  return [...alwaysRoot, ...roots, ...solo, ...full, ...fed, ...skills];
}
