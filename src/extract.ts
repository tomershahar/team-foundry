import { readFile } from 'fs/promises';
import path from 'path';
import { spawnSync } from 'child_process';

/**
 * Raw, unprocessed signals read from the target repo. fs/exec lives here at the
 * edge; the pure extraction logic (extractProjectIdentity) takes this shape so it
 * stays fully unit-testable without touching the filesystem.
 */
export interface ProjectSignals {
  pkg: { name?: string; description?: string } | null;
  readme: string | null;
  gitUser: string | null;
}

/**
 * Deterministic identity derived from repo signals. Every field is optional —
 * callers fall back to the existing GAP placeholders when a field is absent.
 */
export interface ProjectIdentity {
  name?: string;
  summary?: string;
  defaultOwner?: string;
}

const SUMMARY_MAX = 280;

/** Returns the text of the first level-1 (`# `) heading, or undefined. */
export function extractReadmeTitle(readme: string): string | undefined {
  for (const line of readme.split('\n')) {
    const m = line.match(/^#\s+(.+?)\s*$/);
    if (m) return m[1].trim();
  }
  return undefined;
}

// Lines that never count as prose: blanks, headings, comments, badges/images,
// raw HTML, blockquotes, code fences, horizontal rules, and table rows.
function isSkippableLine(line: string): boolean {
  const t = line.trim();
  if (t === '') return true;
  if (t.startsWith('#')) return true;
  if (t.startsWith('<!--')) return true;
  if (t.startsWith('![') || t.startsWith('[![')) return true;
  if (t.startsWith('<')) return true;
  if (t.startsWith('>')) return true;
  if (t.startsWith('```')) return true;
  if (t.startsWith('|')) return true;
  if (/^[-*_=]{3,}$/.test(t)) return true;
  return false;
}

/**
 * Returns the first block of consecutive prose lines, joined with spaces and
 * stripped of inline markdown. Skips headings, badges, images, HTML, rules,
 * comments, and tables. Undefined when the README has no prose.
 */
export function firstReadmeParagraph(readme: string): string | undefined {
  const buf: string[] = [];
  for (const line of readme.split('\n')) {
    if (isSkippableLine(line)) {
      if (buf.length > 0) break; // paragraph ended
      continue;
    }
    buf.push(line.trim());
  }
  if (buf.length === 0) return undefined;
  return cleanInline(buf.join(' '));
}

// Strip inline markdown so the summary reads as plain prose.
function cleanInline(s: string): string {
  return s
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // images
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // links → link text
    .replace(/[*_`]/g, '') // emphasis / inline code
    .replace(/\s+/g, ' ')
    .trim();
}

function cap(s: string, n: number): string {
  if (s.length <= n) return s;
  return s.slice(0, n - 1).trimEnd() + '…';
}

/**
 * Derives project identity from signals. package.json wins over README; git
 * user.name supplies a default owner. Pure: no fs, no exec, no network.
 */
export function extractProjectIdentity(signals: ProjectSignals): ProjectIdentity {
  const id: ProjectIdentity = {};

  const name =
    signals.pkg?.name?.trim() ||
    (signals.readme ? extractReadmeTitle(signals.readme) : undefined);
  if (name) id.name = name;

  const rawSummary =
    signals.pkg?.description?.trim() ||
    (signals.readme ? firstReadmeParagraph(signals.readme) : undefined);
  if (rawSummary) {
    const summary = cap(cleanInline(rawSummary), SUMMARY_MAX);
    if (summary) id.summary = summary;
  }

  const owner = signals.gitUser?.trim();
  if (owner) id.defaultOwner = owner;

  return id;
}

function readGitUser(targetDir: string): string | null {
  try {
    const r = spawnSync('git', ['-C', targetDir, 'config', 'user.name'], {
      encoding: 'utf-8',
      timeout: 5000,
    });
    if (r.status !== 0) return null;
    // Collapse any internal whitespace/newlines to a single space so the value
    // can't break out of its single-line YAML frontmatter slot.
    const name = r.stdout.replace(/\s+/g, ' ').trim();
    return name || null;
  } catch {
    return null;
  }
}

/**
 * Reads package.json, README (case-insensitive), and git user.name from
 * targetDir. Every source is optional and failures degrade to null — a repo
 * with none of them still scaffolds, just without pre-filled identity.
 */
export async function readProjectSignals(targetDir: string): Promise<ProjectSignals> {
  let pkg: ProjectSignals['pkg'] = null;
  try {
    const raw = await readFile(path.join(targetDir, 'package.json'), 'utf-8');
    const parsed = JSON.parse(raw);
    pkg = { name: parsed.name, description: parsed.description };
  } catch {
    // missing or malformed package.json — leave null
  }

  let readme: string | null = null;
  for (const candidate of ['README.md', 'readme.md', 'Readme.md', 'README.markdown']) {
    try {
      readme = await readFile(path.join(targetDir, candidate), 'utf-8');
      break;
    } catch {
      // try next candidate
    }
  }

  return { pkg, readme, gitUser: readGitUser(targetDir) };
}
