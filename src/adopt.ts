import fs from 'fs/promises';
import path from 'path';

export interface AdoptableFile {
  /** Display label / source path, e.g. '.cursorrules' */
  source: string;
  content: string;
}

/** Where adopted content is captured for review. */
export const IMPORTED_RULES_PATH = 'team-foundry/context/imported-rules.md';

// Known pre-team-foundry AI instruction files, in the order they're presented.
const CANDIDATE_FILES = [
  '.cursorrules',
  '.windsurfrules',
  '.clinerules',
  'CLAUDE.md',
  'GEMINI.md',
  'AGENTS.md',
  '.github/copilot-instructions.md',
];

// A file is "ours" (already team-foundry-managed) if it mentions team-foundry —
// adopting it would just re-import our own pointer, so we skip it.
function isTeamFoundryManaged(content: string): boolean {
  return /team-foundry/i.test(content);
}

async function readIfAdoptable(fullPath: string): Promise<string | null> {
  try {
    const content = await fs.readFile(fullPath, 'utf-8');
    if (!content.trim()) return null; // empty file, nothing to adopt
    if (isTeamFoundryManaged(content)) return null;
    return content;
  } catch {
    return null;
  }
}

/**
 * Finds pre-existing AI instruction files worth importing: the known root files
 * plus any non-team-foundry `.mdc` rules under `.cursor/rules/`. Files already
 * managed by team-foundry (they mention it) and empty files are skipped.
 */
export async function detectAdoptableFiles(targetDir: string): Promise<AdoptableFile[]> {
  const found: AdoptableFile[] = [];

  for (const rel of CANDIDATE_FILES) {
    const content = await readIfAdoptable(path.join(targetDir, rel));
    if (content !== null) found.push({ source: rel, content });
  }

  // Cursor multi-rule layout: .cursor/rules/*.mdc (skip our own team-foundry.mdc)
  const cursorRulesDir = path.join(targetDir, '.cursor', 'rules');
  try {
    const entries = await fs.readdir(cursorRulesDir);
    for (const name of entries.sort()) {
      if (!name.endsWith('.mdc') || name === 'team-foundry.mdc') continue;
      const content = await readIfAdoptable(path.join(cursorRulesDir, name));
      if (content !== null) found.push({ source: `.cursor/rules/${name}`, content });
    }
  } catch {
    // no .cursor/rules dir
  }

  return found;
}

/**
 * Composes the imported-rules document from detected files. Pure (no fs) so it
 * can be unit-tested. Each source becomes a section with provenance so a reader
 * knows where the rules came from and can move them into the right place.
 */
export function buildAdoptedContent(files: AdoptableFile[], date: string): string {
  const sections = files
    .map((f) => `## From \`${f.source}\`\n\n${f.content.trim()}`)
    .join('\n\n---\n\n');

  return `---
purpose: AI instructions imported from pre-team-foundry config files, pending sorting into the right context files
read_when: During onboarding, when deciding where existing rules belong
last_updated: ${date}
owner:
---

# Imported AI rules

These rules were imported from your existing AI config files so nothing is lost in
the move to team-foundry. Review each section and move the content into the file
where it belongs (conventions → \`engineering/stack.md\`, quality rules →
\`engineering/quality-bar.md\`, product context → \`product/\`, etc.), then delete
this file once everything has a home.

${sections}
`;
}

export interface AdoptResult {
  /** Relative path written, or null when there was nothing to adopt. */
  written: string | null;
  sources: string[];
}

/**
 * Captures existing AI-rules files into team-foundry/context/imported-rules.md.
 * Refuses to overwrite an existing imported-rules.md. Returns what it did.
 */
export async function runAdopt(targetDir: string, date: string): Promise<AdoptResult> {
  const files = await detectAdoptableFiles(targetDir);
  if (files.length === 0) return { written: null, sources: [] };

  const dest = path.join(targetDir, IMPORTED_RULES_PATH);
  let exists = false;
  try {
    await fs.access(dest);
    exists = true;
  } catch {
    // ENOENT — happy path
  }
  if (exists) {
    throw new Error(
      `${IMPORTED_RULES_PATH} already exists. Review or remove it before adopting again.`,
    );
  }

  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.writeFile(dest, buildAdoptedContent(files, date), 'utf-8');
  return { written: IMPORTED_RULES_PATH, sources: files.map((f) => f.source) };
}
