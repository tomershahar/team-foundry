import fs from 'fs/promises';
import path from 'path';
import { ALWAYS_ROOT_ENTRIES, rootEntries } from './manifest.js';
import type { ScaffoldOptions } from './types.js';

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
export async function detectExistingFiles(
  targetDir: string,
  tool?: ScaffoldOptions['tool'],
): Promise<DetectedFile[]> {
  const results: DetectedFile[] = [];
  const paths = tool
    ? [...ALWAYS_ROOT_ENTRIES, ...rootEntries(tool)].map((entry) => entry.relativePath)
    : ROOT_INSTRUCTION_PATHS;

  for (const relPath of paths) {
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
