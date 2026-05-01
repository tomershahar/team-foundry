import { intro, select, text, outro, isCancel } from '@clack/prompts';
import type { ScaffoldOptions } from './types.js';

type PromptResult = Omit<ScaffoldOptions, 'targetDir' | 'date'>;

/** Returns the total number of questions for a given path through the prompt sequence. */
export function questionCount(
  profile: 'solo' | 'full' | undefined,
  federated: boolean | undefined,
  ingestion: string | undefined,
): number {
  if (profile === undefined) return 5; // estimate: profile unknown
  const hasLocalPath = ingestion === 'local' || ingestion === 'repo+local';
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
    hint: '1 of ~5',
    options: [
      { value: 'claude', label: 'Claude Code' },
      { value: 'gemini', label: 'Gemini CLI' },
      { value: 'cursor', label: 'Cursor' },
      { value: 'both', label: 'Multiple (Claude Code + Gemini CLI)' },
    ],
  });
  cancelIfNeeded(tool);

  const profile = await select({
    message: 'Team size?',
    hint: '2 of ~5',
    options: [
      { value: 'solo', label: '1–3 people  (solo profile — 7 files)' },
      { value: 'full', label: '4–15 people  (full profile — 20 files)' },
    ],
  });
  cancelIfNeeded(profile);

  const profileTyped = profile as 'solo' | 'full';
  const totalNoFed = questionCount(profileTyped, false, undefined);

  const repoVisibility = await select({
    message: 'Is this repo public, internal-only, or private?',
    hint: `3 of ${totalNoFed}`,
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
      hint: '4 of ?',
      options: [
        { value: 'flat', label: 'Flat  (one root CLAUDE.md — simpler, recommended for most teams)' },
        { value: 'federated', label: 'Federated  (CLAUDE.md per folder — for larger teams, 8+ people)' },
      ],
    });
    cancelIfNeeded(federatedAnswer);
    federated = federatedAnswer === 'federated';
  }

  const federatedResolved = federated ?? false;
  const ingestionQ = profileTyped === 'solo' ? 4 : 5;

  const ingestion = await select({
    message:
      'Do you have existing docs to ingest?\n  (Strategy docs, old roadmaps, customer research — the interview uses them to pre-populate answers)',
    hint: `${ingestionQ} of ${questionCount(profileTyped, federatedResolved, undefined)}`,
    options: [
      { value: 'repo', label: 'Repo signals only  (README, package.json, git history, GitHub PRs/issues)' },
      { value: 'repo+local', label: 'Repo + local docs folder  (repo signals + point me at a folder)' },
      { value: 'repo+mcp', label: 'Repo + MCP source  (repo signals + Notion, Confluence, Google Drive)' },
      { value: 'repo+paste', label: 'Repo + paste content  (repo signals + paste docs into paste-content.md)' },
      { value: 'local', label: 'Local docs folder only  (no repo scan)' },
      { value: 'mcp', label: 'MCP source only  (no repo scan)' },
      { value: 'paste', label: 'Paste content only  (no repo scan)' },
      { value: 'skip', label: 'Skip  (start fresh)' },
    ],
  });
  cancelIfNeeded(ingestion);

  let ingestionPath: string | undefined;
  if (ingestion === 'local' || ingestion === 'repo+local') {
    const total = questionCount(profileTyped, federatedResolved, ingestion as string);
    const rawPath = await text({
      message: 'Path to the folder containing your docs?',
      hint: `${total} of ${total}`,
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
