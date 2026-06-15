import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { ciExitDecision, runStatusCi } from '../status.js';
import { scaffold } from '../scaffold.js';

describe('ciExitDecision()', () => {
  it('returns 0 when everything is clean', () => {
    const d = ciExitDecision({ missing: 0, empty: 0, stale: 0, linkFindings: 0 });
    expect(d.code).toBe(0);
    expect(d.failures).toEqual([]);
  });

  it('hard-fails on missing files', () => {
    const d = ciExitDecision({ missing: 2, empty: 0, stale: 0, linkFindings: 0 });
    expect(d.code).toBe(1);
    expect(d.failures.join(' ')).toMatch(/missing/);
  });

  it('hard-fails on link-integrity issues', () => {
    const d = ciExitDecision({ missing: 0, empty: 0, stale: 0, linkFindings: 3 });
    expect(d.code).toBe(1);
    expect(d.failures.join(' ')).toMatch(/link-integrity/);
  });

  it('treats stale and empty as warnings by default (exit 0)', () => {
    const d = ciExitDecision({ missing: 0, empty: 5, stale: 4, linkFindings: 0 });
    expect(d.code).toBe(0);
    expect(d.warnings.length).toBe(2);
  });

  it('fails when stale exceeds --max-stale', () => {
    const d = ciExitDecision({ missing: 0, empty: 0, stale: 4, linkFindings: 0 }, { maxStale: 3 });
    expect(d.code).toBe(1);
    expect(d.failures.join(' ')).toMatch(/--max-stale=3/);
  });

  it('does not fail when stale is within --max-stale', () => {
    const d = ciExitDecision({ missing: 0, empty: 0, stale: 3, linkFindings: 0 }, { maxStale: 3 });
    expect(d.code).toBe(0);
    expect(d.warnings.join(' ')).toMatch(/stale/);
  });
});

describe('runStatusCi()', () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'tf-ci-test-'));
  });

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  it('returns exit code 1 when no foundry exists (all files missing)', async () => {
    const code = await runStatusCi(tmpDir);
    expect(code).toBe(1);
  });

  it('returns exit code 0 for a freshly scaffolded foundry (empties are warnings)', async () => {
    await scaffold({
      targetDir: tmpDir,
      profile: 'solo',
      tool: 'claude',
      repoVisibility: 'private',
      date: '2026-06-15',
      ingestion: 'skip',
    });
    const code = await runStatusCi(tmpDir);
    expect(code).toBe(0);
  });
});
