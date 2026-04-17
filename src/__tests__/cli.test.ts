import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../../');
const DIST_ENTRY = path.join(ROOT, 'dist/index.js');

async function makeTempDir(): Promise<string> {
  return fs.mkdtemp(path.join(os.tmpdir(), 'team-foundry-cli-test-'));
}

async function cleanup(dir: string): Promise<void> {
  await fs.rm(dir, { recursive: true, force: true });
}

/**
 * Runs the CLI in a temp directory, piping mock arrow-key stdin answers.
 * @clack/prompts `select` reads arrow keys; we send Enter (\r) to accept the
 * first (default) option for each of the 4 questions.
 */
function runCli(cwd: string): Promise<{ code: number | null; stdout: string; stderr: string }> {
  return new Promise((resolve) => {
    const proc = spawn('node', [DIST_ENTRY], {
      cwd,
      env: { ...process.env, FORCE_COLOR: '0' },
    });

    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (chunk: Buffer) => {
      stdout += chunk.toString();
    });
    proc.stderr.on('data', (chunk: Buffer) => {
      stderr += chunk.toString();
    });

    // Send Enter after a brief delay to accept default option for each prompt
    // @clack/prompts renders immediately and waits for input
    let entersSent = 0;
    const sendEnter = () => {
      if (entersSent < 4) {
        proc.stdin.write('\r');
        entersSent++;
        setTimeout(sendEnter, 100);
      } else {
        proc.stdin.end();
      }
    };
    setTimeout(sendEnter, 200);

    proc.on('close', (code) => {
      resolve({ code, stdout, stderr });
    });
  });
}

describe('CLI smoke test', () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await makeTempDir();
  });

  afterEach(async () => {
    await cleanup(tmpDir);
  });

  it('exits with code 0', async () => {
    const { code } = await runCli(tmpDir);
    expect(code).toBe(0);
  }, 15_000);

  it('creates CLAUDE.md in the target directory', async () => {
    await runCli(tmpDir);
    const exists = await fs
      .access(path.join(tmpDir, 'CLAUDE.md'))
      .then(() => true)
      .catch(() => false);
    expect(exists).toBe(true);
  }, 15_000);

  it('creates team-foundry/product/outcomes.md', async () => {
    await runCli(tmpDir);
    const exists = await fs
      .access(path.join(tmpDir, 'team-foundry/product/outcomes.md'))
      .then(() => true)
      .catch(() => false);
    expect(exists).toBe(true);
  }, 15_000);

  it('appends team-foundry/private/ to .gitignore', async () => {
    await runCli(tmpDir);
    const content = await fs.readFile(path.join(tmpDir, '.gitignore'), 'utf-8');
    expect(content).toContain('team-foundry/private/');
  }, 15_000);
});
