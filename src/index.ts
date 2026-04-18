import fs from 'fs/promises';
import path from 'path';
import { outro, log, confirm } from '@clack/prompts';
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

async function warnIfDevDirectory(targetDir: string): Promise<void> {
  const pkgPath = path.join(targetDir, 'package.json');
  const srcPath = path.join(targetDir, 'src');
  let hasPkg = false;
  let hasSrc = false;
  try { await fs.access(pkgPath); hasPkg = true; } catch { /* ok */ }
  try { await fs.access(srcPath); hasSrc = true; } catch { /* ok */ }

  if (hasPkg && hasSrc) {
    log.warn(
      'This directory already has a package.json and src/ folder — it looks like a Node.js project.\n' +
      'team-foundry should be run in your product/engineering repo, not a Node.js library repo.\n' +
      'If this is correct, continue. Otherwise Ctrl-C and cd to your product repo first.',
    );
    const ok = await confirm({ message: 'Continue anyway?' });
    if (!ok) {
      outro('Cancelled. cd to your product repo and try again.');
      process.exit(0);
    }
  }
}

async function main(): Promise<void> {
  const targetDir = process.cwd();

  await warnIfDevDirectory(targetDir);

  const answers = await runPrompts();
  const date = new Date().toISOString().split('T')[0];

  await scaffold({ ...answers, targetDir, date });
  await writeGitignore(targetDir);

  let pasteNote = '';
  if (answers.ingestion === 'paste') {
    const pastePath = path.join(targetDir, '.team-foundry', 'paste-content.md');
    try {
      await fs.access(pastePath);
    } catch {
      await fs.writeFile(pastePath, PASTE_PLACEHOLDER, 'utf-8');
    }
    pasteNote =
      `\n⚠  Before opening Claude Code:\n` +
      `   Open and fill in this file with your existing docs:\n\n` +
      `   ${pastePath}\n\n` +
      `   The coach will use it during the onboarding interview.\n`;
  }

  outro(
    `Done! Your files are in:\n\n  ${targetDir}\n\n` +
      (pasteNote ? pasteNote + '\nThen open' : 'Open') +
      ` that directory in ${TOOL_LABEL[answers.tool]} and say:\n\n  "Let's set up our team-foundry."\n\n` +
      `See GETTING_STARTED.md for what happens next.\n\n` +
      `Reminder: team-foundry works best when the whole team can see these files.\n` +
      `Make sure this repo is accessible to everyone who uses AI tools on your team —\n` +
      `shared Git repo, synced folder, or however your team shares code.`,
  );
}

main().catch((err: unknown) => {
  log.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
