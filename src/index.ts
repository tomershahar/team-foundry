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

async function checkDirectory(targetDir: string): Promise<void> {
  // Hard block: running inside the team-foundry source repo itself
  const prdPath = path.join(targetDir, 'team-foundry-prd-v2.md');
  const scaffoldPath = path.join(targetDir, 'src', 'scaffold.ts');
  let isSourceRepo = false;
  try { await fs.access(prdPath); isSourceRepo = true; } catch { /* ok */ }
  try { await fs.access(scaffoldPath); isSourceRepo = true; } catch { /* ok */ }

  if (isSourceRepo) {
    log.error(
      "You're running create-team-foundry inside the team-foundry source repo.\n" +
      'This will overwrite development files.\n\n' +
      'cd to your product repo first, then run this command again.',
    );
    process.exit(1);
  }

  // Soft warn: looks like a Node.js project
  const pkgPath = path.join(targetDir, 'package.json');
  const srcPath = path.join(targetDir, 'src');
  let hasPkg = false;
  let hasSrc = false;
  try { await fs.access(pkgPath); hasPkg = true; } catch { /* ok */ }
  try { await fs.access(srcPath); hasSrc = true; } catch { /* ok */ }

  if (hasPkg && hasSrc) {
    log.warn(
      'This directory has a package.json and src/ — it looks like a Node.js project.\n' +
      'team-foundry works best in your product repo, not inside a library or CLI repo.\n' +
      'If this is the right place, continue. Otherwise Ctrl-C and cd to your product repo.',
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

  await checkDirectory(targetDir);

  const answers = await runPrompts();
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

  const tool = TOOL_LABEL[answers.tool];
  let ingestionNote: string;

  if (answers.ingestion === 'paste') {
    ingestionNote =
      `\nNext steps:\n\n` +
      `  1. Open .team-foundry/paste-content.md and paste in your existing docs\n` +
      `     (strategy, roadmaps, customer research). Save the file.\n\n` +
      `  2. cd ${targetDir}\n\n` +
      `  3. Open ${tool} and say:\n\n` +
      `       "Let's set up our team-foundry. I've added docs to\n` +
      `        paste-content.md — use them to pre-populate answers."\n`;
  } else if (answers.ingestion === 'mcp') {
    ingestionNote =
      `\nNext steps:\n\n` +
      `  1. cd ${targetDir}\n\n` +
      `  2. Open ${tool}.\n\n` +
      `  3. In ${tool} settings, connect your MCP server\n` +
      `     (Notion, Confluence, or Google Drive) if you haven't already.\n\n` +
      `  4. Then say:\n\n` +
      `       "Let's set up our team-foundry. Before we begin, pull any\n` +
      `        relevant strategy, roadmap, or customer research from\n` +
      `        [your MCP source] and use them to pre-populate answers."\n`;
  } else if (answers.ingestion === 'local') {
    ingestionNote =
      `\nNext steps:\n\n` +
      `  1. cd ${targetDir}\n\n` +
      `  2. Open ${tool} and say:\n\n` +
      `       "Let's set up our team-foundry. Before we begin, read the\n` +
      `        docs in ${answers.ingestionPath ?? '[your docs folder]'} and use them to pre-populate answers."\n`;
  } else {
    ingestionNote =
      `\nNext steps:\n\n` +
      `  1. cd ${targetDir}\n\n` +
      `  2. Open ${tool} and say:\n\n` +
      `       "Let's set up our team-foundry."\n\n` +
      `  You can add existing docs later by editing .team-foundry/paste-content.md.\n`;
  }

  outro(
    `Done! Your files are in:\n\n  ${targetDir}\n` +
      ingestionNote +
      `\nSee GETTING_STARTED.md for more detail.\n\n` +
      `Reminder: team-foundry works best in a shared repo — one the whole\n` +
      `team commits to, so everyone's AI tool gets the same context.`,
  );
}

main().catch((err: unknown) => {
  log.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
