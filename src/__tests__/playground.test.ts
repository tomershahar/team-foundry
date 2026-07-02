import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import { runPlayground, PLAYGROUND_DIR } from '../playground.js';
import { PLAYGROUND_FILES } from '../templates/playground/content.js';

const EXAMPLE_DIR = fileURLToPath(new URL('../../example/', import.meta.url));

async function readTree(dir: string, root = dir): Promise<Map<string, string>> {
  const files = new Map<string, string>();
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === '.DS_Store') continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const nested = await readTree(fullPath, root);
      for (const [relativePath, content] of nested) files.set(relativePath, content);
    } else {
      files.set(path.relative(root, fullPath).split(path.sep).join('/'), await fs.readFile(fullPath, 'utf-8'));
    }
  }
  return files;
}

async function makeTempDir(): Promise<string> {
  return fs.mkdtemp(path.join(os.tmpdir(), 'tf-playground-test-'));
}

async function cleanup(dir: string): Promise<void> {
  await fs.rm(dir, { recursive: true, force: true });
}

describe('PLAYGROUND_FILES', () => {
  it('bundles a populated foundry (not empty)', () => {
    expect(PLAYGROUND_FILES.length).toBeGreaterThan(10);
  });

  it('includes the AGENTS-readable product context', () => {
    const paths = PLAYGROUND_FILES.map((f) => f.relativePath);
    expect(paths).toContain('team-foundry/product/outcomes.md');
  });

  it('bundles AGENTS.md as the shared routing source', () => {
    const agents = PLAYGROUND_FILES.find((f) => f.relativePath === 'AGENTS.md');
    expect(agents?.content).toContain('Clearline');
    expect(agents?.content).toContain('team-foundry/engineering/decisions/');
  });

  it('bundles thin pointers for every advertised playground tool', () => {
    const pointerPaths = [
      'CLAUDE.md',
      'GEMINI.md',
      '.cursor/rules/team-foundry.mdc',
      '.github/copilot-instructions.md',
    ];
    for (const pointerPath of pointerPaths) {
      const pointer = PLAYGROUND_FILES.find((f) => f.relativePath === pointerPath);
      expect(pointer?.content).toContain('AGENTS.md');
    }
  });

  it('keeps CLAUDE.md as a thin pointer rather than a second routing map', () => {
    const claude = PLAYGROUND_FILES.find((f) => f.relativePath === 'CLAUDE.md');
    expect(claude?.content.trimStart()).toMatch(/^@AGENTS\.md/);
    expect(claude?.content).not.toContain('## Routing map');
  });

  it('every entry has non-empty content', () => {
    for (const f of PLAYGROUND_FILES) {
      expect(f.content.trim().length).toBeGreaterThan(0);
    }
  });

  it('matches the complete example tree byte for byte', async () => {
    const exampleFiles = await readTree(EXAMPLE_DIR);
    const bundledFiles = new Map(PLAYGROUND_FILES.map((file) => [file.relativePath, file.content]));

    expect(bundledFiles).toEqual(exampleFiles);
  });
});

describe('runPlayground()', () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await makeTempDir();
  });

  afterEach(async () => {
    await cleanup(tmpDir);
  });

  it('writes the playground into a dedicated subdirectory', async () => {
    const written = await runPlayground(tmpDir);
    expect(written.length).toBe(PLAYGROUND_FILES.length);
    const sample = path.join(tmpDir, PLAYGROUND_DIR, 'team-foundry/product/outcomes.md');
    const content = await fs.readFile(sample, 'utf-8');
    expect(content.trim().length).toBeGreaterThan(0);
  });

  it('creates nested directories as needed', async () => {
    await runPlayground(tmpDir);
    const nested = path.join(tmpDir, PLAYGROUND_DIR, 'team-foundry/engineering/decisions');
    const stat = await fs.stat(nested);
    expect(stat.isDirectory()).toBe(true);
  });

  it('refuses to overwrite a non-empty playground directory', async () => {
    const dest = path.join(tmpDir, PLAYGROUND_DIR);
    await fs.mkdir(dest, { recursive: true });
    await fs.writeFile(path.join(dest, 'keep.md'), 'existing');
    await expect(runPlayground(tmpDir)).rejects.toThrow(/already exists/i);
  });

  it('succeeds when the target subdirectory does not exist yet', async () => {
    const written = await runPlayground(tmpDir);
    expect(written.length).toBeGreaterThan(0);
  });
});
