import { outro, log } from '@clack/prompts';
import { runPrompts } from './prompts.js';
import { scaffold } from './scaffold.js';
import { writeGitignore } from './gitignore.js';

const TOOL_LABEL: Record<string, string> = {
  claude: 'Claude Code',
  gemini: 'Gemini CLI',
  both: 'Claude Code or Gemini CLI',
};

async function main(): Promise<void> {
  const answers = await runPrompts();

  const targetDir = process.cwd();
  const date = new Date().toISOString().split('T')[0];

  await scaffold({ ...answers, targetDir, date });
  await writeGitignore(targetDir);

  outro(
    `Done! Open this project in ${TOOL_LABEL[answers.tool]} and say:\n\n  "Let's set up our team-foundry."\n\nSee GETTING_STARTED.md for what happens next.`,
  );
}

main().catch((err: unknown) => {
  log.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
