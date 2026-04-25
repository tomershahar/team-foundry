import { intro, select, text, outro, isCancel } from '@clack/prompts';
import type { ScaffoldOptions } from './types.js';

type PromptResult = Omit<ScaffoldOptions, 'targetDir' | 'date'>;

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
      { value: 'solo', label: '1–3 people  (solo profile — 7 files)' },
      { value: 'full', label: '4–15 people  (full profile — 19 files)' },
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
        { value: 'flat', label: 'Flat  (one root CLAUDE.md — simpler, recommended for most teams)' },
        { value: 'federated', label: 'Federated  (CLAUDE.md per folder — for larger teams, 8+ people)' },
      ],
    });
    cancelIfNeeded(federatedAnswer);
    federated = federatedAnswer === 'federated';
  }

  const ingestion = await select({
    message:
      'Do you have existing docs to ingest?\n  (Strategy docs, old roadmaps, customer research — the interview uses them to pre-populate answers)',
    options: [
      { value: 'local', label: 'Local folder  (exported docs on disk)' },
      { value: 'mcp', label: 'MCP source  (Notion, Confluence, Google Drive)' },
      { value: 'paste', label: 'Paste content  (we\'ll create a file for you to fill in)' },
      { value: 'skip', label: 'Skip  (start fresh)' },
    ],
  });
  cancelIfNeeded(ingestion);

  let ingestionPath: string | undefined;
  if (ingestion === 'local') {
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
