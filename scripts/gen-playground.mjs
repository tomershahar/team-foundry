#!/usr/bin/env node
/**
 * Regenerates src/templates/playground/content.ts from the example/ directory.
 * Run after changing example/: `node scripts/gen-playground.mjs`
 *
 * Content is embedded as a JSON array so markdown backticks / ${} need no
 * escaping, and it ships inside dist/ (the published package excludes example/).
 */
import { readdir, readFile, writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const exampleDir = path.join(root, 'example');
const outFile = path.join(root, 'src', 'templates', 'playground', 'content.ts');

const SKIP = new Set(['.DS_Store']);

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    if (SKIP.has(e.name)) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      files.push(...(await walk(full)));
    } else {
      files.push(full);
    }
  }
  return files;
}

const absFiles = (await walk(exampleDir)).sort();
const files = [];
for (const abs of absFiles) {
  const relativePath = path.relative(exampleDir, abs).split(path.sep).join('/');
  const content = await readFile(abs, 'utf-8');
  files.push({ relativePath, content });
}

const banner = `/* AUTO-GENERATED from example/ by scripts/gen-playground.mjs. Do not edit by hand. */
export interface PlaygroundFile {
  relativePath: string;
  content: string;
}

export const PLAYGROUND_FILES: PlaygroundFile[] = `;

await mkdir(path.dirname(outFile), { recursive: true });
await writeFile(outFile, banner + JSON.stringify(files, null, 2) + ';\n', 'utf-8');
console.log(`Wrote ${files.length} files to ${path.relative(root, outFile)}`);
