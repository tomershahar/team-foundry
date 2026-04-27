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

    // Send inputs for each prompt:
    // Q1 tool (select): Enter → claude (default)
    // Q2 profile (select): Enter → solo (default)
    // Q3 repoVisibility (select): Enter → public (default)
    // Q4 ingestion (select): arrow-down ×7 then Enter → skip (last of 8 options, avoids path prompt)
    // @clack/prompts uses arrow keys for select navigation
    const inputs: (() => void)[] = [
      () => proc.stdin.write('\r'),               // Q1: select claude
      () => proc.stdin.write('\r'),               // Q2: select solo
      () => proc.stdin.write('\r'),               // Q3: select public
      () => proc.stdin.write('\x1b[B\x1b[B\x1b[B\x1b[B\x1b[B\x1b[B\x1b[B\r'), // Q4: down ×7 → skip
    ];
    let step = 0;
    const sendNext = () => {
      if (step < inputs.length) {
        inputs[step++]();
        setTimeout(sendNext, 150);
      } else {
        proc.stdin.end();
      }
    };
    setTimeout(sendNext, 200);

    proc.on('close', (code) => {
      resolve({ code, stdout, stderr });
    });
  });
}

function runCliPaste(cwd: string): Promise<{ code: number | null; stdout: string }> {
  return new Promise((resolve) => {
    const proc = spawn('node', [DIST_ENTRY], {
      cwd,
      env: { ...process.env, FORCE_COLOR: '0' },
    });
    let stdout = '';
    proc.stdout.on('data', (chunk: Buffer) => { stdout += chunk.toString(); });
    proc.stderr.on('data', () => {});
    // Q4: down ×6 → paste option (index 6 in 8-option menu)
    const inputs: (() => void)[] = [
      () => proc.stdin.write('\r'),               // Q1: claude
      () => proc.stdin.write('\r'),               // Q2: solo
      () => proc.stdin.write('\r'),               // Q3: public
      () => proc.stdin.write('\x1b[B\x1b[B\x1b[B\x1b[B\x1b[B\x1b[B\r'),  // Q4: down ×6 → paste
    ];
    let step = 0;
    const sendNext = () => {
      if (step < inputs.length) { inputs[step++](); setTimeout(sendNext, 150); }
      else { proc.stdin.end(); }
    };
    setTimeout(sendNext, 200);
    proc.on('close', (code) => { resolve({ code, stdout }); });
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

  it('outro includes the target directory path', async () => {
    const { stdout } = await runCli(tmpDir);
    expect(stdout).toContain(tmpDir);
  }, 15_000);
});

describe('CLI repo ingestion', () => {
  let tmpDir: string;

  beforeEach(async () => { tmpDir = await makeTempDir(); });
  afterEach(async () => { await cleanup(tmpDir); });

  it('outro mentions repo scan when repo is selected', async () => {
    const result = await new Promise<{ code: number | null; stdout: string }>((resolve) => {
      const proc = spawn('node', [DIST_ENTRY], {
        cwd: tmpDir,
        env: { ...process.env, FORCE_COLOR: '0' },
      });
      let stdout = '';
      proc.stdout.on('data', (chunk: Buffer) => { stdout += chunk.toString(); });
      proc.stderr.on('data', () => {});
      // Q4: Enter → repo (first option, no arrows)
      const inputs: (() => void)[] = [
        () => proc.stdin.write('\r'), // Q1: claude
        () => proc.stdin.write('\r'), // Q2: solo
        () => proc.stdin.write('\r'), // Q3: public
        () => proc.stdin.write('\r'), // Q4: repo (default, first option)
      ];
      let step = 0;
      const sendNext = () => {
        if (step < inputs.length) { inputs[step++](); setTimeout(sendNext, 150); }
        else { proc.stdin.end(); }
      };
      setTimeout(sendNext, 200);
      proc.on('close', (code) => { resolve({ code, stdout }); });
    });
    expect(result.stdout).toMatch(/repo|README|git history/i);
  }, 15_000);

  it('repo+paste creates paste-content.md', async () => {
    const result = await new Promise<{ code: number | null; stdout: string }>((resolve) => {
      const proc = spawn('node', [DIST_ENTRY], {
        cwd: tmpDir,
        env: { ...process.env, FORCE_COLOR: '0' },
      });
      let stdout = '';
      proc.stdout.on('data', (chunk: Buffer) => { stdout += chunk.toString(); });
      proc.stderr.on('data', () => {});
      // Q4: down ×3 → repo+paste (index 3)
      const inputs: (() => void)[] = [
        () => proc.stdin.write('\r'),               // Q1: claude
        () => proc.stdin.write('\r'),               // Q2: solo
        () => proc.stdin.write('\r'),               // Q3: public
        () => proc.stdin.write('\x1b[B\x1b[B\x1b[B\r'), // Q4: down ×3 → repo+paste
      ];
      let step = 0;
      const sendNext = () => {
        if (step < inputs.length) { inputs[step++](); setTimeout(sendNext, 150); }
        else { proc.stdin.end(); }
      };
      setTimeout(sendNext, 200);
      proc.on('close', (code) => { resolve({ code, stdout }); });
    });
    const exists = await fs
      .access(path.join(tmpDir, '.team-foundry', 'paste-content.md'))
      .then(() => true).catch(() => false);
    expect(exists).toBe(true);
    expect(result.stdout).toContain('paste-content.md');
  }, 15_000);
});

describe('CLI paste ingestion', () => {
  let tmpDir: string;

  beforeEach(async () => { tmpDir = await makeTempDir(); });
  afterEach(async () => { await cleanup(tmpDir); });

  it('creates .team-foundry/paste-content.md when paste is selected', async () => {
    await runCliPaste(tmpDir);
    const exists = await fs
      .access(path.join(tmpDir, '.team-foundry', 'paste-content.md'))
      .then(() => true)
      .catch(() => false);
    expect(exists).toBe(true);
  }, 15_000);

  it('outro tells user to fill in paste-content.md', async () => {
    const { stdout } = await runCliPaste(tmpDir);
    expect(stdout).toContain('paste-content.md');
  }, 15_000);
});
