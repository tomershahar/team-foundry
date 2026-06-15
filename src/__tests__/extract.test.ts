import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import {
  extractProjectIdentity,
  extractReadmeTitle,
  firstReadmeParagraph,
  readProjectSignals,
} from '../extract.js';

async function makeTempDir(): Promise<string> {
  return fs.mkdtemp(path.join(os.tmpdir(), 'tf-extract-test-'));
}

async function cleanup(dir: string): Promise<void> {
  await fs.rm(dir, { recursive: true, force: true });
}

describe('extractReadmeTitle()', () => {
  it('returns the first H1 heading text', () => {
    expect(extractReadmeTitle('# my-project\n\nbody')).toBe('my-project');
  });

  it('ignores ## and deeper headings', () => {
    expect(extractReadmeTitle('## sub\n\n# real-title')).toBe('real-title');
  });

  it('returns undefined when there is no H1', () => {
    expect(extractReadmeTitle('no headings here')).toBeUndefined();
  });
});

describe('firstReadmeParagraph()', () => {
  it('skips the H1 and returns the first real paragraph', () => {
    const readme = '# Title\n\nThis is the summary line.\n\nMore stuff.';
    expect(firstReadmeParagraph(readme)).toBe('This is the summary line.');
  });

  it('skips badge and image lines', () => {
    const readme =
      '# Title\n\n![badge](x.svg)\n[![npm](a)](b)\n\nThe actual description.';
    expect(firstReadmeParagraph(readme)).toBe('The actual description.');
  });

  it('strips bold markers from a bold-first-line readme', () => {
    const readme = '# Title\n\n**Bold tagline here.**\n\n[![npm](a)](b)';
    expect(firstReadmeParagraph(readme)).toBe('Bold tagline here.');
  });

  it('skips horizontal rules and HTML comments', () => {
    const readme = '# Title\n\n<!-- hidden -->\n\n---\n\nReal text.';
    expect(firstReadmeParagraph(readme)).toBe('Real text.');
  });

  it('joins multi-line paragraphs into one string', () => {
    const readme = '# Title\n\nline one\nline two\n\nnext para';
    expect(firstReadmeParagraph(readme)).toBe('line one line two');
  });

  it('returns undefined when there is no prose', () => {
    expect(firstReadmeParagraph('# Title\n\n![only](badge.svg)')).toBeUndefined();
  });
});

describe('extractProjectIdentity()', () => {
  it('prefers package.json name and description', () => {
    const id = extractProjectIdentity({
      pkg: { name: 'acme', description: 'Acme does things.' },
      readme: '# fallback-title\n\nfallback summary',
      gitUser: 'Jane Dev',
    });
    expect(id.name).toBe('acme');
    expect(id.summary).toBe('Acme does things.');
    expect(id.defaultOwner).toBe('Jane Dev');
  });

  it('falls back to README title and first paragraph when pkg fields are missing', () => {
    const id = extractProjectIdentity({
      pkg: { name: undefined, description: undefined },
      readme: '# readme-title\n\nReadme summary sentence.',
      gitUser: null,
    });
    expect(id.name).toBe('readme-title');
    expect(id.summary).toBe('Readme summary sentence.');
    expect(id.defaultOwner).toBeUndefined();
  });

  it('cleans markdown links out of the summary', () => {
    const id = extractProjectIdentity({
      pkg: null,
      readme: '# T\n\nSee [the docs](http://x) for more.',
      gitUser: null,
    });
    expect(id.summary).toBe('See the docs for more.');
  });

  it('caps an overly long summary with an ellipsis', () => {
    const long = 'x'.repeat(400);
    const id = extractProjectIdentity({ pkg: { description: long }, readme: null, gitUser: null });
    expect(id.summary!.length).toBeLessThanOrEqual(280);
    expect(id.summary!.endsWith('…')).toBe(true);
  });

  it('returns an empty object when nothing is extractable', () => {
    expect(extractProjectIdentity({ pkg: null, readme: null, gitUser: null })).toEqual({});
  });
});

describe('readProjectSignals()', () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await makeTempDir();
  });

  afterEach(async () => {
    await cleanup(tmpDir);
  });

  it('reads package.json name and description', async () => {
    await fs.writeFile(
      path.join(tmpDir, 'package.json'),
      JSON.stringify({ name: 'pkg-name', description: 'pkg desc' }),
    );
    const signals = await readProjectSignals(tmpDir);
    expect(signals.pkg).toEqual({ name: 'pkg-name', description: 'pkg desc' });
  });

  it('reads README.md when present (case-insensitive)', async () => {
    await fs.writeFile(path.join(tmpDir, 'README.md'), '# Hi\n\nbody');
    const signals = await readProjectSignals(tmpDir);
    expect(signals.readme).toContain('# Hi');
  });

  it('returns null pkg and readme when neither exists', async () => {
    const signals = await readProjectSignals(tmpDir);
    expect(signals.pkg).toBeNull();
    expect(signals.readme).toBeNull();
  });

  it('ignores malformed package.json without throwing', async () => {
    await fs.writeFile(path.join(tmpDir, 'package.json'), '{ not json');
    const signals = await readProjectSignals(tmpDir);
    expect(signals.pkg).toBeNull();
  });
});
