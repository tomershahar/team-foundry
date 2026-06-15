import fs from 'fs/promises';
import path from 'path';
import type { ScaffoldOptions, TemplateContext } from './types.js';
import { readProjectSignals, extractProjectIdentity } from './extract.js';
import {
  ALWAYS_ROOT_ENTRIES,
  SOLO_ENTRIES,
  FULL_ONLY_ENTRIES,
  FEDERATED_ENTRIES,
  CLAUDE_SKILLS_ENTRIES,
  rootEntries,
  includesClaudeSkills,
  type FileEntry,
} from './manifest.js';

const MERGE_MARKER_START = '<!-- BEGIN TEAM-FOUNDRY SECTION -->';
const MERGE_MARKER_END = '<!-- END TEAM-FOUNDRY SECTION -->';

const ROOT_INSTRUCTION_PATHS = new Set([
  'AGENTS.md',
  'CLAUDE.md',
  'GEMINI.md',
  '.cursor/rules/team-foundry.mdc',
  '.github/copilot-instructions.md',
]);

async function applyMergeDecision(
  fullPath: string,
  relativePath: string,
  newContent: string,
  decision: 'merge' | 'replace' | 'skip',
  targetDir: string,
): Promise<boolean> {
  if (decision === 'skip') return false;

  if (decision === 'replace') {
    const filename = path.basename(relativePath);
    const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const backupsDir = path.join(targetDir, '.team-foundry', 'backups');
    await fs.mkdir(backupsDir, { recursive: true });
    let backupPath = path.join(backupsDir, `${filename}.${ts}.backup`);
    let suffix = 2;
    let conflict = true;
    while (conflict) {
      try {
        await fs.access(backupPath);
        backupPath = path.join(backupsDir, `${filename}.${ts}-${suffix++}.backup`);
      } catch {
        conflict = false;
      }
    }
    const existing = await fs.readFile(fullPath, 'utf-8');
    await fs.writeFile(backupPath, existing, 'utf-8');
    await fs.writeFile(fullPath, newContent, 'utf-8');
    return true;
  }

  // 'merge'
  const existing = await fs.readFile(fullPath, 'utf-8');
  const wrappedContent = `${MERGE_MARKER_START}\n${newContent}\n${MERGE_MARKER_END}`;
  let merged: string;

  if (existing.includes(MERGE_MARKER_START)) {
    const startIdx = existing.indexOf(MERGE_MARKER_START);
    const endMarkerIdx = existing.indexOf(MERGE_MARKER_END);
    if (endMarkerIdx === -1) {
      // Marker block is incomplete — treat as no block and append
      merged = existing + '\n\n' + wrappedContent;
    } else {
      merged = existing.slice(0, startIdx) + wrappedContent + existing.slice(endMarkerIdx + MERGE_MARKER_END.length);
    }
  } else {
    merged = existing + '\n\n' + wrappedContent;
  }

  await fs.writeFile(fullPath, merged, 'utf-8');
  return true;
}

export async function scaffold(options: ScaffoldOptions): Promise<string[]> {
  const { targetDir, profile, tool, repoVisibility, date, ingestionPath, ingestion, federated, mergeDecisions } = options;

  let extractedStack: TemplateContext['extractedStack'] = undefined;
  
  // Prefer targetDir: when scaffold is called with an explicit output path, that
  // project's package.json should win. cwd is the fallback (and in the normal CLI
  // flow targetDir IS cwd, so behavior there is unchanged).
  const pathsToTry = [
    path.join(targetDir, 'package.json'),
    path.join(process.cwd(), 'package.json'),
  ];

  let pkgPath: string | null = null;
  for (const p of pathsToTry) {
    try {
      await fs.access(p);
      pkgPath = p;
      break;
    } catch {
      // ignore
    }
  }

  if (pkgPath) {
    try {
      const pkgStr = await fs.readFile(pkgPath, 'utf-8');
      const pkg = JSON.parse(pkgStr);
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };
      extractedStack = {
        name: pkg.name,
        dependencies: pkg.dependencies,
        devDependencies: pkg.devDependencies,
        hasTypeScript: 'typescript' in deps,
        hasVitest: 'vitest' in deps,
        hasJest: 'jest' in deps,
        hasEslint: 'eslint' in deps,
        hasPrettier: 'prettier' in deps,
      };
    } catch {
      // ignore invalid package.json
    }
  }

  // Deterministic identity extraction (package.json / README / git user). No
  // network, no AI; missing sources degrade to undefined and the templates fall
  // back to their existing GAP placeholders.
  const projectIdentity = extractProjectIdentity(await readProjectSignals(targetDir));

  const ctx: TemplateContext = {
    profile,
    tool,
    repoVisibility,
    date,
    ingestionPath,
    ingestion,
    federated,
    extractedStack,
    projectIdentity,
  };

  const entries: FileEntry[] = [
    ...ALWAYS_ROOT_ENTRIES,
    ...rootEntries(tool),
    ...SOLO_ENTRIES,
    ...(profile === 'full' ? FULL_ONLY_ENTRIES : []),
    ...(profile === 'full' && federated ? FEDERATED_ENTRIES : []),
    ...(includesClaudeSkills(tool) ? CLAUDE_SKILLS_ENTRIES : []),
  ];

  const written: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(targetDir, entry.relativePath);
    const dir = path.dirname(fullPath);
    await fs.mkdir(dir, { recursive: true });

    const content = fillDefaultOwner(entry.content(ctx), projectIdentity.defaultOwner);

    // Root instruction files: apply merge decision if file exists and mergeDecisions is provided
    if (ROOT_INSTRUCTION_PATHS.has(entry.relativePath) && mergeDecisions !== undefined) {
      let fileExists = false;
      try {
        await fs.access(fullPath);
        fileExists = true;
      } catch { /* not found */ }

      if (fileExists) {
        const decision = mergeDecisions[entry.relativePath] ?? 'merge';
        const didWrite = await applyMergeDecision(
          fullPath,
          entry.relativePath,
          content,
          decision,
          targetDir,
        );
        if (didWrite) written.push(entry.relativePath);
        continue;
      }
    }

    // Default: skip if already exists
    try {
      await fs.access(fullPath);
      continue; // file exists — skip
    } catch { /* not found — write it */ }

    await fs.writeFile(fullPath, content, 'utf-8');
    written.push(entry.relativePath);
  }

  return written;
}

/**
 * Fills an empty `owner:` frontmatter line with the detected git user. Only the
 * first empty owner line (the frontmatter one) is touched; templates that ship
 * a non-empty owner are left alone. Function replacement avoids `$` in names
 * being interpreted as replacement patterns.
 */
function fillDefaultOwner(content: string, owner: string | undefined): string {
  if (!owner) return content;
  return content.replace(/^(owner:)[ \t]*$/m, (_m, p1: string) => `${p1} ${owner}`);
}

/** Returns the git add + commit command appropriate for the chosen tool. */
export function gitAddCommand(tool: ScaffoldOptions['tool']): string {
  const toolFiles: string[] = [];
  if (tool === 'claude' || tool === 'both' || tool === 'all') toolFiles.push('CLAUDE.md', '.claude/');
  if (tool === 'gemini' || tool === 'both' || tool === 'all') toolFiles.push('GEMINI.md');
  if (tool === 'cursor' || tool === 'all') toolFiles.push('.cursor/');
  if (tool === 'copilot' || tool === 'all') toolFiles.push('.github/copilot-instructions.md');

  const paths = [
    'team-foundry/',
    '.team-foundry/',
    'AGENTS.md',
    'GETTING_STARTED.md',
    ...toolFiles,
  ].join(' ');

  return `git add ${paths} && git commit -m "Add team-foundry"`;
}

/** Returns the expected file paths for a given profile, tool, and layout (relative to targetDir) */
export function expectedPaths(
  profile: ScaffoldOptions['profile'],
  tool: ScaffoldOptions['tool'],
  federated = false,
): string[] {
  const roots = rootEntries(tool).map((e) => e.relativePath);
  const alwaysRoot = ALWAYS_ROOT_ENTRIES.map((e) => e.relativePath);
  const solo = SOLO_ENTRIES.map((e) => e.relativePath);
  const full = profile === 'full' ? FULL_ONLY_ENTRIES.map((e) => e.relativePath) : [];
  const fed = profile === 'full' && federated ? FEDERATED_ENTRIES.map((e) => e.relativePath) : [];
  const skills = includesClaudeSkills(tool) ? CLAUDE_SKILLS_ENTRIES.map((e) => e.relativePath) : [];

  return [...alwaysRoot, ...roots, ...solo, ...full, ...fed, ...skills];
}
