import { intro, select, text, outro, isCancel } from '@clack/prompts';
import type { ScaffoldOptions } from './types.js';
import type { DetectedFile } from './detect.js';

type PromptResult = Omit<ScaffoldOptions, 'targetDir' | 'date'>;

/**
 * Returns the total number of questions for a given path through the prompt sequence.
 * Note: the UI no longer surfaces standalone 'local'/'mcp'/'paste' ingestion values
 * (they're only reachable via the supplement sub-menu as 'repo+local' etc.), so
 * hasLocalPath only triggers for 'repo+local' in practice.
 */
export function questionCount(
  profile: 'solo' | 'full' | undefined,
  federated: boolean | undefined,
  ingestion: string | undefined,
): number {
  if (profile === undefined) return 5; // estimate: profile unknown
  const hasLocalPath = ingestion === 'repo+local';
  if (profile === 'solo') return hasLocalPath ? 5 : 4;
  // full profile
  const base = federated ? 6 : 5;
  return hasLocalPath ? base + 1 : base;
}

function cancelIfNeeded(value: unknown): void {
  if (isCancel(value)) {
    outro('Cancelled.');
    process.exit(0);
  }
}

export async function runPrompts(): Promise<PromptResult> {
  intro('create-team-foundry');

  const tool = await select({
    message: 'Which AI tool does your team use?',
    options: [
      {
        value: 'all',
        label: 'All tools (Recommended — generates pointers for Claude Code, Gemini CLI, Cursor, and AGENTS.md)',
      },
      { value: 'claude', label: 'Claude Code' },
      { value: 'gemini', label: 'Gemini CLI' },
      { value: 'cursor', label: 'Cursor' },
      { value: 'both', label: 'Multiple (Claude Code + Gemini CLI)' },
    ],
  });
  cancelIfNeeded(tool);

  const profile = await select({
    message: 'Team size?',
    options: [
      { value: 'solo', label: '1–3 people  (solo profile  -  7 files)' },
      { value: 'full', label: '4–15 people  (full profile  -  20 files)' },
    ],
  });
  cancelIfNeeded(profile);

  const repoVisibility = await select({
    message: 'Is this repo public, internal-only, or private?',
    options: [
      { value: 'public', label: 'Public  (GitHub public, open source)' },
      { value: 'internal', label: 'Internal  (company-private, not public)' },
      { value: 'private', label: 'Private  (personal or confidential)' },
    ],
  });
  cancelIfNeeded(repoVisibility);

  let federated: boolean | undefined;
  if (profile === 'full') {
    const federatedAnswer = await select({
      message: 'Context layout?',
      options: [
        { value: 'flat', label: 'Flat  (one root CLAUDE.md  -  simpler, recommended for most teams)' },
        { value: 'federated', label: 'Federated  (CLAUDE.md per folder  -  for larger teams, 8+ people)' },
      ],
    });
    cancelIfNeeded(federatedAnswer);
    federated = federatedAnswer === 'federated';
  }

  const ingestionChoice = await select({
    message: 'Where should the AI look for existing team context?',
    options: [
      { value: 'repo', label: 'Standard Scan (README, package.json, and Git history) [Recommended]' },
      { value: 'supplement', label: 'Supplement with external docs... (Local folder, Notion, Confluence, etc.)' },
      { value: 'skip', label: 'Start fresh (Blank templates)' },
    ],
  });
  cancelIfNeeded(ingestionChoice);

  let ingestion = ingestionChoice as ScaffoldOptions['ingestion'] | 'supplement';

  if (ingestion === 'supplement') {
    const supplementChoice = await select({
      message: 'How would you like to provide these external docs?',
      options: [
        { value: 'repo+local', label: 'Point to a local folder (e.g. ./docs)' },
        { value: 'repo+paste', label: 'Paste into a single file (.team-foundry/paste-content.md)' },
        { value: 'repo+mcp', label: 'Connect via MCP (Notion, Confluence, Google Drive)' },
      ],
    });
    cancelIfNeeded(supplementChoice);
    ingestion = supplementChoice as ScaffoldOptions['ingestion'];
  }

  let ingestionPath: string | undefined;
  if (ingestion === 'local' || ingestion === 'repo+local') {
    const rawPath = await text({
      message: 'Path to the folder containing your docs?',
      placeholder: './docs  or  /Users/you/exports',
      validate: (value) => {
        if (!value.trim()) return 'Please enter a path.';
      },
    });
    cancelIfNeeded(rawPath);
    ingestionPath = (rawPath as string).trim();
  }

  return {
    tool: tool as ScaffoldOptions['tool'],
    profile: profile as ScaffoldOptions['profile'],
    repoVisibility: repoVisibility as ScaffoldOptions['repoVisibility'],
    ingestion: ingestion as ScaffoldOptions['ingestion'],
    ingestionPath,
    federated,
  };
}

/**
 * For each detected existing root instruction file, asks the user whether to
 * merge, replace, or skip. Returns a decisions map keyed by relative path.
 */
export async function runMergePrompts(
  detected: DetectedFile[],
): Promise<Record<string, 'merge' | 'replace' | 'skip'>> {
  const decisions: Record<string, 'merge' | 'replace' | 'skip'> = {};

  for (const file of detected) {
    const choice = await select({
      message: `Found existing ${file.relativePath} (${file.lineCount} lines). What should team-foundry do?`,
      options: [
        {
          value: 'merge',
          label: 'Merge — append team-foundry section, preserve existing content (recommended)',
        },
        {
          value: 'replace',
          label: 'Replace — back up to .team-foundry/backups/, write fresh',
        },
        {
          value: 'skip',
          label: 'Skip — leave it alone, scaffold everything else',
        },
      ],
    });
    cancelIfNeeded(choice);
    decisions[file.relativePath] = choice as 'merge' | 'replace' | 'skip';
  }

  return decisions;
}
