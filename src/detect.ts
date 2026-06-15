import fs from 'fs/promises';
import path from 'path';

export interface DetectedFile {
  relativePath: string;
  lineCount: number;
}

/**
 * The exact set of root instruction paths team-foundry will write.
 * Detection is limited to this set so that merge decisions collected by
 * runMergePrompts always correspond to files scaffold() will actually touch.
 */
const ROOT_INSTRUCTION_PATHS = [
  'CLAUDE.md',
  'GEMINI.md',
  'AGENTS.md',
  '.cursor/rules/team-foundry.mdc',
  '.github/copilot-instructions.md',
];

/**
 * Scans targetDir for pre-existing root instruction files that team-foundry
 * would write. Returns an array of detected files with their line counts.
 *
 * Only the paths in ROOT_INSTRUCTION_PATHS are checked — this keeps the
 * detection set in sync with what scaffold() will write, so every merge
 * decision collected by runMergePrompts is actionable.
 *
 * Silently skips paths that don't exist.
 */
export async function detectExistingFiles(targetDir: string): Promise<DetectedFile[]> {
  const results: DetectedFile[] = [];

  for (const relPath of ROOT_INSTRUCTION_PATHS) {
    const fullPath = path.join(targetDir, relPath);
    try {
      const content = await fs.readFile(fullPath, 'utf-8');
      const lineCount = content.split('\n').length;
      results.push({ relativePath: relPath, lineCount });
    } catch {
      // File doesn't exist — skip silently
    }
  }

  return results;
}
