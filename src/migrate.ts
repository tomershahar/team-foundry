import fs from 'fs/promises';
import path from 'path';
import { confirm, log, outro } from '@clack/prompts';
import { hierarchyTemplate, hooksTemplate, rulesTemplate } from './templates/index.js';
import type { TemplateContext } from './types.js';

export type MigrateState = 'none' | 'v2' | 'v3';

/** Detects the current team-foundry version in targetDir. */
export async function detectMigrateState(targetDir: string): Promise<MigrateState> {
  const tfDir = path.join(targetDir, '.team-foundry');

  try {
    await fs.access(tfDir);
  } catch {
    return 'none';
  }

  try {
    await fs.access(path.join(tfDir, 'hierarchy.md'));
    return 'v3';
  } catch {
    return 'v2';
  }
}

/** Writes a file only if it does not already exist. */
export async function writeIfAbsent(filePath: string, content: string): Promise<void> {
  try {
    await fs.access(filePath);
  } catch {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, content, 'utf-8');
  }
}

/** Appends source: and last_validated: to a file's YAML frontmatter if missing. */
export async function appendFrontmatterFields(filePath: string): Promise<void> {
  let content: string;
  try {
    content = await fs.readFile(filePath, 'utf-8');
  } catch {
    return;
  }

  if (!content.startsWith('---')) return;

  const closeIdx = content.indexOf('\n---', 3);
  if (closeIdx === -1) return;

  const frontmatter = content.slice(0, closeIdx);
  const rest = content.slice(closeIdx);

  let updated = frontmatter;
  if (!frontmatter.includes('last_validated:')) {
    updated += '\nlast_validated: ~';
  }
  if (!frontmatter.includes('source:')) {
    updated += '\nsource: ~';
  }

  if (updated === frontmatter) return;

  await fs.writeFile(filePath, updated + rest, 'utf-8');
}

const DATA_HEAVY_FILES = [
  'team-foundry/product/outcomes.md',
  'team-foundry/product/customers.md',
  'team-foundry/data/metrics.md',
  'team-foundry/product/assumptions.md',
  'team-foundry/product/now-next-later.md',
];

export async function runMigrate(targetDir: string): Promise<void> {
  const state = await detectMigrateState(targetDir);

  if (state === 'none') {
    log.error('No existing team-foundry found. Run npx create-team-foundry to scaffold v3.');
    process.exit(1);
  }

  if (state === 'v3') {
    outro('Already on v3. Nothing to migrate.');
    return;
  }

  log.info(
    'v2 team-foundry detected. Migration will add:\n\n' +
    '  .team-foundry/hierarchy.md\n' +
    '  .team-foundry/instructions/hooks.md\n' +
    '  .team-foundry/instructions/rules.md\n\n' +
    'And append source: / last_validated: to frontmatter of:\n\n' +
    DATA_HEAVY_FILES.map((f) => `  ${f}`).join('\n') + '\n\n' +
    'Existing files are never overwritten.',
  );

  const ok = await confirm({ message: 'Proceed with migration?' });
  if (!ok) {
    outro('Migration cancelled. No files were changed.');
    return;
  }

  const date = new Date().toISOString().split('T')[0];
  const ctx: TemplateContext = {
    profile: 'full',
    tool: 'claude',
    repoVisibility: 'internal',
    date,
  };

  const tfDir = path.join(targetDir, '.team-foundry');
  await writeIfAbsent(path.join(tfDir, 'hierarchy.md'), hierarchyTemplate(ctx));
  await writeIfAbsent(path.join(tfDir, 'instructions', 'hooks.md'), hooksTemplate(ctx));
  await writeIfAbsent(path.join(tfDir, 'instructions', 'rules.md'), rulesTemplate(ctx));

  for (const relPath of DATA_HEAVY_FILES) {
    const filePath = path.join(targetDir, relPath);
    await appendFrontmatterFields(filePath);
  }

  outro(
    'Migration complete.\n\n' +
    'New files added to .team-foundry/. Your existing content is untouched.\n\n' +
    'Open your AI tool and say: "Read .team-foundry/hierarchy.md and let\'s review\n' +
    'what changed in v3."',
  );
}
