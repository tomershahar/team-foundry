import fs from 'fs/promises';
import path from 'path';
import { outro, log } from '@clack/prompts';
import { runPrompts } from './prompts.js';
import { scaffold } from './scaffold.js';
import { writeGitignore } from './gitignore.js';

const TOOL_LABEL: Record<string, string> = {
  claude: 'Claude Code',
  gemini: 'Gemini CLI',
  both: 'Claude Code or Gemini CLI',
};

const PASTE_PLACEHOLDER = `# Paste your existing docs here

Paste any existing strategy docs, roadmaps, customer research, or notes below.
The coach will use this content to pre-populate answers during the onboarding interview.

You can paste multiple documents — just separate them with a heading like:

---
## [Document name]
[content]
---

When you're done, save this file and start the onboarding interview.
`;

async function main(): Promise<void> {
  const answers = await runPrompts();

  const targetDir = process.cwd();
  const date = new Date().toISOString().split('T')[0];

  await scaffold({ ...answers, targetDir, date });
  await writeGitignore(targetDir);

  if (answers.ingestion === 'paste') {
    const pastePath = path.join(targetDir, '.team-foundry', 'paste-content.md');
    try {
      await fs.access(pastePath);
    } catch {
      await fs.writeFile(pastePath, PASTE_PLACEHOLDER, 'utf-8');
    }
  }

  const pasteNote =
    answers.ingestion === 'paste'
      ? `\nNext: paste your existing docs into .team-foundry/paste-content.md, then open this project.\n`
      : '';

  outro(
    `Done! Your files are in:\n\n  ${targetDir}\n\n` +
      `Open that directory in ${TOOL_LABEL[answers.tool]} and say:\n\n  "Let's set up our team-foundry."\n` +
      pasteNote +
      `\nSee GETTING_STARTED.md for what happens next.\n\n` +
      `Reminder: team-foundry works best when the whole team can see these files.\n` +
      `Make sure this repo is accessible to everyone who uses AI tools on your team —\n` +
      `shared Git repo, synced folder, or however your team shares code.`,
  );
}

main().catch((err: unknown) => {
  log.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});

main().catch((err: unknown) => {
  log.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
