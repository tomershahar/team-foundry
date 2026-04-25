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
import { runPrompts } from '../prompts.js';

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
});
