import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock @clack/prompts before importing the module under test
vi.mock('@clack/prompts', () => ({
  intro: vi.fn(),
  outro: vi.fn(),
  select: vi.fn(),
  text: vi.fn(),
  isCancel: vi.fn().mockReturnValue(false),
}));

import { intro, select, text } from '@clack/prompts';
import { runPrompts, questionCount, runMergePrompts } from '../prompts.js';
import type { DetectedFile } from '../detect.js';

describe('runPrompts()', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns correct options for claude/full/internal/flat/skip', async () => {
    vi.mocked(select)
      .mockResolvedValueOnce('claude')   // tool
      .mockResolvedValueOnce('full')     // profile
      .mockResolvedValueOnce('internal') // visibility
      .mockResolvedValueOnce('flat')     // federated
      .mockResolvedValueOnce('skip');    // ingestion

    const result = await runPrompts();

    expect(result).toEqual({
      tool: 'claude',
      profile: 'full',
      repoVisibility: 'internal',
      ingestion: 'skip',
      federated: false,
    });
  });

  it('returns federated: true when federated layout selected', async () => {
    vi.mocked(select)
      .mockResolvedValueOnce('claude')
      .mockResolvedValueOnce('full')
      .mockResolvedValueOnce('internal')
      .mockResolvedValueOnce('federated')
      .mockResolvedValueOnce('skip');

    const result = await runPrompts();
    expect(result.federated).toBe(true);
  });

  it('does not ask federated question for solo profile', async () => {
    vi.mocked(select)
      .mockResolvedValueOnce('claude')
      .mockResolvedValueOnce('solo')
      .mockResolvedValueOnce('internal')
      .mockResolvedValueOnce('skip');

    const result = await runPrompts();
    expect(result.federated).toBeUndefined();
    expect(select).toHaveBeenCalledTimes(4); // no extra question
  });

  it('returns ingestionPath when local folder is selected', async () => {
    vi.mocked(select)
      .mockResolvedValueOnce('gemini')
      .mockResolvedValueOnce('solo')
      .mockResolvedValueOnce('public')
      .mockResolvedValueOnce('local');
    vi.mocked(text).mockResolvedValueOnce('./uat-mock-docs');

    const result = await runPrompts();

    expect(result).toEqual({
      tool: 'gemini',
      profile: 'solo',
      repoVisibility: 'public',
      ingestion: 'local',
      ingestionPath: './uat-mock-docs',
    });
    expect(text).toHaveBeenCalledTimes(1);
  });

  it('does not ask for path when ingestion is not local', async () => {
    vi.mocked(select)
      .mockResolvedValueOnce('both')
      .mockResolvedValueOnce('full')
      .mockResolvedValueOnce('private')
      .mockResolvedValueOnce('flat')
      .mockResolvedValueOnce('mcp');

    const result = await runPrompts();

    expect(result).toEqual({
      tool: 'both',
      profile: 'full',
      repoVisibility: 'private',
      ingestion: 'mcp',
      federated: false,
    });
    expect(text).not.toHaveBeenCalled();
  });

  it('calls intro at the start', async () => {
    vi.mocked(select)
      .mockResolvedValueOnce('claude')
      .mockResolvedValueOnce('solo')
      .mockResolvedValueOnce('internal')
      .mockResolvedValueOnce('skip');

    await runPrompts();

    expect(intro).toHaveBeenCalledWith('create-team-foundry');
  });

  it('returns correct options for cursor tool', async () => {
    vi.mocked(select)
      .mockResolvedValueOnce('cursor')
      .mockResolvedValueOnce('full')
      .mockResolvedValueOnce('internal')
      .mockResolvedValueOnce('flat')
      .mockResolvedValueOnce('skip');

    const result = await runPrompts();

    expect(result).toEqual({
      tool: 'cursor',
      profile: 'full',
      repoVisibility: 'internal',
      ingestion: 'skip',
      federated: false,
    });
  });

  it('calls select exactly 4 times for solo non-local ingestion', async () => {
    vi.mocked(select)
      .mockResolvedValueOnce('claude')
      .mockResolvedValueOnce('solo')
      .mockResolvedValueOnce('internal')
      .mockResolvedValueOnce('skip');

    await runPrompts();

    expect(select).toHaveBeenCalledTimes(4);
  });

  it('returns repo ingestion when repo signals only selected', async () => {
    vi.mocked(select)
      .mockResolvedValueOnce('claude')
      .mockResolvedValueOnce('solo')
      .mockResolvedValueOnce('internal')
      .mockResolvedValueOnce('repo');

    const result = await runPrompts();
    expect(result.ingestion).toBe('repo');
    expect(text).not.toHaveBeenCalled();
  });

  it('returns repo+local and prompts for path', async () => {
    vi.mocked(select)
      .mockResolvedValueOnce('claude')
      .mockResolvedValueOnce('solo')
      .mockResolvedValueOnce('internal')
      .mockResolvedValueOnce('repo+local');
    vi.mocked(text).mockResolvedValueOnce('./docs');

    const result = await runPrompts();
    expect(result.ingestion).toBe('repo+local');
    expect(result.ingestionPath).toBe('./docs');
    expect(text).toHaveBeenCalledTimes(1);
  });

  it('returns repo+mcp and does not prompt for path', async () => {
    vi.mocked(select)
      .mockResolvedValueOnce('claude')
      .mockResolvedValueOnce('solo')
      .mockResolvedValueOnce('internal')
      .mockResolvedValueOnce('repo+mcp');

    const result = await runPrompts();
    expect(result.ingestion).toBe('repo+mcp');
    expect(text).not.toHaveBeenCalled();
  });

  it('returns repo+paste and does not prompt for path', async () => {
    vi.mocked(select)
      .mockResolvedValueOnce('claude')
      .mockResolvedValueOnce('solo')
      .mockResolvedValueOnce('internal')
      .mockResolvedValueOnce('repo+paste');

    const result = await runPrompts();
    expect(result.ingestion).toBe('repo+paste');
    expect(text).not.toHaveBeenCalled();
  });

  it('calls select 5 times for full profile non-local ingestion', async () => {
    vi.mocked(select)
      .mockResolvedValueOnce('claude')
      .mockResolvedValueOnce('full')
      .mockResolvedValueOnce('internal')
      .mockResolvedValueOnce('flat')
      .mockResolvedValueOnce('skip');

    await runPrompts();

    expect(select).toHaveBeenCalledTimes(5);
  });

  it('returns repo+local via supplement progressive menu and prompts for path', async () => {
    vi.mocked(select)
      .mockResolvedValueOnce('claude')
      .mockResolvedValueOnce('solo')
      .mockResolvedValueOnce('internal')
      .mockResolvedValueOnce('supplement')
      .mockResolvedValueOnce('repo+local');
    vi.mocked(text).mockResolvedValueOnce('./progressive-docs');

    const result = await runPrompts();
    expect(result.ingestion).toBe('repo+local');
    expect(result.ingestionPath).toBe('./progressive-docs');
    expect(select).toHaveBeenCalledTimes(5);
    expect(text).toHaveBeenCalledTimes(1);
  });

  it('returns repo+mcp via supplement progressive menu', async () => {
    vi.mocked(select)
      .mockResolvedValueOnce('claude')
      .mockResolvedValueOnce('solo')
      .mockResolvedValueOnce('internal')
      .mockResolvedValueOnce('supplement')
      .mockResolvedValueOnce('repo+mcp');

    const result = await runPrompts();
    expect(result.ingestion).toBe('repo+mcp');
    expect(result.ingestionPath).toBeUndefined();
    expect(select).toHaveBeenCalledTimes(5);
    expect(text).not.toHaveBeenCalled();
  });

  it('returns repo+paste via supplement progressive menu', async () => {
    vi.mocked(select)
      .mockResolvedValueOnce('claude')
      .mockResolvedValueOnce('solo')
      .mockResolvedValueOnce('internal')
      .mockResolvedValueOnce('supplement')
      .mockResolvedValueOnce('repo+paste');

    const result = await runPrompts();
    expect(result.ingestion).toBe('repo+paste');
    expect(result.ingestionPath).toBeUndefined();
    expect(select).toHaveBeenCalledTimes(5);
    expect(text).not.toHaveBeenCalled();
  });
});

describe('questionCount()', () => {
  it('returns 5 estimate when profile is unknown', () => {
    expect(questionCount(undefined, undefined, undefined)).toBe(5);
  });

  it('returns 4 for solo, no local ingestion', () => {
    expect(questionCount('solo', undefined, 'skip')).toBe(4);
    expect(questionCount('solo', undefined, 'repo')).toBe(4);
  });

  it('returns 5 for solo, local ingestion', () => {
    expect(questionCount('solo', undefined, 'repo+local')).toBe(5);
  });

  it('returns 5 for full-flat, no local ingestion', () => {
    expect(questionCount('full', false, 'skip')).toBe(5);
    expect(questionCount('full', false, 'repo')).toBe(5);
  });

  it('returns 6 for full-flat, local ingestion', () => {
    expect(questionCount('full', false, 'repo+local')).toBe(6);
  });

  it('returns 6 for full-federated, no local ingestion', () => {
    expect(questionCount('full', true, 'skip')).toBe(6);
    expect(questionCount('full', true, 'repo')).toBe(6);
  });

  it('returns 7 for full-federated, local ingestion', () => {
    expect(questionCount('full', true, 'repo+local')).toBe(7);
  });
});

describe('runMergePrompts export', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('is exported as a function', () => {
    expect(typeof runMergePrompts).toBe('function');
  });

  it('returns a Promise', () => {
    // Call with empty array — no prompts will be shown, returns immediately
    const result = runMergePrompts([]);
    expect(result).toBeInstanceOf(Promise);
    return result.then((decisions) => {
      expect(decisions).toEqual({});
    });
  });

  it('returns decisions for each detected file when multiple files provided', async () => {
    // Mock select to return 'merge' for first call and 'skip' for second call
    let callCount = 0;
    vi.mocked(select).mockImplementation(async () => {
      callCount++;
      return callCount === 1 ? 'merge' : 'skip';
    });

    const detected: DetectedFile[] = [
      { relativePath: 'CLAUDE.md', lineCount: 10 },
      { relativePath: 'GEMINI.md', lineCount: 5 },
    ];

    const result = await runMergePrompts(detected);

    expect(result['CLAUDE.md']).toBe('merge');
    expect(result['GEMINI.md']).toBe('skip');
  });
});
