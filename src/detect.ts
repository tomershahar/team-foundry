import fs from 'fs/promises';
import path from 'path';

export interface DetectedFile {
  relativePath: string;
  lineCount: number;
}

/**
 * Scans targetDir for pre-existing root instruction files and cursor rules.
 * Returns an array of detected files with their line counts.
 *
 * Files checked:
 * - CLAUDE.md, GEMINI.md, AGENTS.md (in targetDir root)
 * - Any .mdc or .md files in .cursor/rules/
 *
 * Silently skips paths that don't exist.
 */
export async function detectExistingFiles(targetDir: string): Promise<DetectedFile[]> {
  const results: DetectedFile[] = [];

  // Root instruction files to check
  const rootFiles = ['CLAUDE.md', 'GEMINI.md', 'AGENTS.md'];

  for (const fileName of rootFiles) {
    const fullPath = path.join(targetDir, fileName);
    try {
      const content = await fs.readFile(fullPath, 'utf-8');
      const lineCount = content.split('\n').length;
      results.push({
        relativePath: fileName,
        lineCount,
      });
    } catch {
      // File doesn't exist, skip silently
    }
  }

  // Scan .cursor/rules/ for .mdc and .md files
  const rulesDir = path.join(targetDir, '.cursor', 'rules');
  try {
    const entries = await fs.readdir(rulesDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isFile() && (entry.name.endsWith('.mdc') || entry.name.endsWith('.md'))) {
        const fullPath = path.join(rulesDir, entry.name);
        const content = await fs.readFile(fullPath, 'utf-8');
        const lineCount = content.split('\n').length;
        results.push({
          relativePath: path.join('.cursor', 'rules', entry.name),
          lineCount,
        });
      }
    }
  } catch {
    // .cursor/rules/ directory doesn't exist, skip silently
  }

  return results;
}
