import fs from 'fs/promises';
import path from 'path';
import { outro, log, confirm, select, isCancel } from '@clack/prompts';
import { runPrompts } from './prompts.js';
import { scaffold, gitAddCommand } from './scaffold.js';
import { writeGitignore } from './gitignore.js';
import { runStatus } from './status.js';
import { runMigrate } from './migrate.js';

function groupByFolder(paths: string[]): Record<string, string[]> {
  const groups: Record<string, string[]> = {};
  for (const p of paths) {
    const parts = p.split('/');
    const folder = parts.length > 1 ? parts[0] : '.';
    const file = parts.length > 1 ? parts.slice(1).join('/') : p;
    (groups[folder] ??= []).push(file);
  }
  return groups;
}

const TOOL_LABEL: Record<string, string> = {
  claude: 'Claude Code',
  gemini: 'Gemini CLI',
  cursor: 'Cursor',
  both: 'Claude Code or Gemini CLI',
};

const PASTE_PLACEHOLDER = `# Paste your existing docs here

Paste any existing strategy docs, roadmaps, customer research, or notes below.
The coach will use this content to pre-populate answers during the onboarding interview.

You can paste multiple documents  -  just separate them with a heading like:

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
      'This directory has a package.json and src/  -  it looks like a Node.js project.\n' +
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

async function checkExistingInstall(targetDir: string): Promise<'status' | 'migrate' | 'continue' | null> {
  try {
    await fs.access(path.join(targetDir, 'team-foundry'));
  } catch {
    return null; // not installed
  }

  log.warn(
    'team-foundry is already set up in this directory.\n' +
    'What would you like to do?',
  );

  const choice = await select({
    message: 'Choose an option:',
    options: [
      { value: 'status', label: 'Run status  -  see which files are stale or missing' },
      { value: 'migrate', label: 'Run migrate  -  upgrade to the latest profile' },
      { value: 'continue', label: 'Continue anyway  -  re-run setup (adds any missing files)' },
    ],
  });

  if (isCancel(choice)) {
    outro('Cancelled.');
    process.exit(0);
  }

  return choice as 'status' | 'migrate' | 'continue';
}

async function main(): Promise<void> {
  const targetDir = process.cwd();

  if (process.argv[2] === 'status') {
    await runStatus(targetDir);
    return;
  }

  if (process.argv[2] === 'migrate') {
    await runMigrate(targetDir);
    return;
  }

  await checkDirectory(targetDir);

  const installChoice = await checkExistingInstall(targetDir);
  if (installChoice === 'status') { await runStatus(targetDir); return; }
  if (installChoice === 'migrate') { await runMigrate(targetDir); return; }

  const answers = await runPrompts();
  const date = new Date().toISOString().split('T')[0];

  const writtenPaths = await scaffold({ ...answers, targetDir, date });
  await writeGitignore(targetDir);

  if (answers.ingestion === 'paste' || answers.ingestion === 'repo+paste') {
    const pastePath = path.join(targetDir, '.team-foundry', 'paste-content.md');
    try {
      await fs.access(pastePath);
    } catch {
      await fs.writeFile(pastePath, PASTE_PLACEHOLDER, 'utf-8');
      writtenPaths.push('.team-foundry/paste-content.md');
    }
  }

  if (writtenPaths.length > 0) {
    const grouped = groupByFolder(writtenPaths);
    const lines = ['', 'Files created:'];
    for (const [folder, files] of Object.entries(grouped)) {
      lines.push(`  ${folder}/`);
      for (const file of files) lines.push(`    ${file}`);
    }
    lines.push('', 'Commit when ready:');
    lines.push(`  ${gitAddCommand(answers.tool)}`);
    log.info(lines.join('\n'));
  } else {
    log.info('No new files created  -  all files already exist.');
  }

  const tool = TOOL_LABEL[answers.tool];
  let ingestionNote: string;

  if (answers.ingestion === 'repo') {
    ingestionNote =
      `\nNext steps:\n\n` +
      `  1. cd ${targetDir}\n\n` +
      `  2. Open ${tool} and say:\n\n` +
      `       "Let's set up our team-foundry."\n\n` +
      `  The AI will read your repo (README, package.json, git history, GitHub\n` +
      `  PRs/issues) and pre-fill answers before asking questions.\n`;
  } else if (answers.ingestion === 'repo+local') {
    ingestionNote =
      `\nNext steps:\n\n` +
      `  1. cd ${targetDir}\n\n` +
      `  2. Open ${tool} and say:\n\n` +
      `       "Let's set up our team-foundry."\n\n` +
      `  The AI will read your repo first, then supplement with the docs in\n` +
      `  ${answers.ingestionPath ?? '[your docs folder]'}.\n`;
  } else if (answers.ingestion === 'repo+mcp') {
    ingestionNote =
      `\nNext steps:\n\n` +
      `  1. In ${tool} settings, connect your MCP server\n` +
      `     (Notion, Confluence, or Google Drive) if you haven't already.\n\n` +
      `  2. cd ${targetDir}\n\n` +
      `  3. Open ${tool} and say:\n\n` +
      `       "Let's set up our team-foundry."\n\n` +
      `  The AI will read your repo first, then supplement from your MCP source.\n`;
  } else if (answers.ingestion === 'repo+paste') {
    ingestionNote =
      `\nNext steps:\n\n` +
      `  1. Open .team-foundry/paste-content.md and paste in your existing docs\n` +
      `     (strategy, roadmaps, customer research). Save the file.\n\n` +
      `  2. cd ${targetDir}\n\n` +
      `  3. Open ${tool} and say:\n\n` +
      `       "Let's set up our team-foundry. I've added docs to\n` +
      `        paste-content.md  -  use them to supplement the repo scan."\n`;
  } else if (answers.ingestion === 'paste') {
    ingestionNote =
      `\nNext steps:\n\n` +
      `  1. Open .team-foundry/paste-content.md and paste in your existing docs\n` +
      `     (strategy, roadmaps, customer research). Save the file.\n\n` +
      `  2. cd ${targetDir}\n\n` +
      `  3. Open ${tool} and say:\n\n` +
      `       "Let's set up our team-foundry. I've added docs to\n` +
      `        paste-content.md  -  use them to pre-populate answers."\n`;
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
      `Reminder: team-foundry works best in a shared repo  -  one the whole\n` +
      `team commits to, so everyone's AI tool gets the same context.\n\n` +
      `────────────────────────────────────────────────────────────\n` +
      `🌟 Enjoying team-foundry?\n` +
      `   Help us grow by leaving a star or feedback on GitHub!\n` +
      `   👉 https://github.com/tomershahar/team-foundry\n` +
      `────────────────────────────────────────────────────────────`
  );
}

main().catch((err: unknown) => {
  log.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
