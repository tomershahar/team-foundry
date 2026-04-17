import fs from 'fs/promises';
import path from 'path';

const PRIVATE_ENTRY = 'team-foundry/private/';

/**
 * Appends `team-foundry/private/` to the .gitignore in targetDir.
 * Creates the file if it doesn't exist. No-op if the entry is already present.
 */
export async function writeGitignore(targetDir: string): Promise<void> {
  const gitignorePath = path.join(targetDir, '.gitignore');

  let existing = '';
  try {
    existing = await fs.readFile(gitignorePath, 'utf-8');
  } catch {
    // File doesn't exist — start fresh
  }

  // No-op if already present (check whole lines to avoid partial matches)
  const lines = existing.split('\n');
  if (lines.some((line) => line.trim() === PRIVATE_ENTRY)) {
    return;
  }

  const separator = existing.length > 0 && !existing.endsWith('\n') ? '\n' : '';
  await fs.writeFile(gitignorePath, `${existing}${separator}${PRIVATE_ENTRY}\n`, 'utf-8');
}
