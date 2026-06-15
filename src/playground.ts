import fs from 'fs/promises';
import path from 'path';
import { PLAYGROUND_FILES } from './templates/playground/content.js';

/** Subdirectory the playground is scaffolded into, relative to the target dir. */
export const PLAYGROUND_DIR = 'team-foundry-playground';

/**
 * Writes the fully-populated Clearline example into <targetDir>/team-foundry-playground
 * so a user can experience the tool in under a minute without the onboarding
 * interview. Refuses to write into a non-empty playground directory to avoid
 * clobbering anything the user put there.
 */
export async function runPlayground(targetDir: string): Promise<string[]> {
  const dest = path.join(targetDir, PLAYGROUND_DIR);

  try {
    const existing = await fs.readdir(dest);
    if (existing.length > 0) {
      throw new Error(
        `${PLAYGROUND_DIR}/ already exists and is not empty. ` +
          `Remove it (or rename it) and run the playground again.`,
      );
    }
  } catch (err) {
    // ENOENT = directory doesn't exist yet, which is the happy path.
    if ((err as NodeJS.ErrnoException).code !== 'ENOENT') throw err;
  }

  const written: string[] = [];
  for (const file of PLAYGROUND_FILES) {
    const fullPath = path.join(dest, file.relativePath);
    // Defense-in-depth: bundled content is trusted, but never let a relativePath
    // escape the playground directory.
    const rel = path.relative(dest, fullPath);
    if (rel.startsWith('..') || path.isAbsolute(rel)) {
      throw new Error(`Refusing to write outside playground: ${file.relativePath}`);
    }
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, file.content, 'utf-8');
    written.push(path.join(PLAYGROUND_DIR, file.relativePath));
  }
  return written;
}
