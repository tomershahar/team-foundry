import fs from 'fs/promises';
import path from 'path';
import { CI_WORKFLOW_YAML, CI_WORKFLOW_PATH } from './templates/ci-workflow.js';

export { CI_WORKFLOW_PATH };

/**
 * Writes the team-foundry drift-gate GitHub Actions workflow. Refuses to
 * overwrite an existing workflow so a customized one is never clobbered.
 * Returns the relative path written, or null if it already existed.
 */
export async function runInitCi(targetDir: string): Promise<string | null> {
  const fullPath = path.join(targetDir, CI_WORKFLOW_PATH);
  try {
    await fs.access(fullPath);
    return null; // already present — leave it alone
  } catch {
    // not present — write it
  }
  await fs.mkdir(path.dirname(fullPath), { recursive: true });
  await fs.writeFile(fullPath, CI_WORKFLOW_YAML, 'utf-8');
  return CI_WORKFLOW_PATH;
}
