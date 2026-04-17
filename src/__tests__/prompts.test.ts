import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock @clack/prompts before importing the module under test
vi.mock('@clack/prompts', () => ({
  intro: vi.fn(),
  outro: vi.fn(),
  select: vi.fn(),
  isCancel: vi.fn().mockReturnValue(false),
}));

import { intro, select } from '@clack/prompts';
import { runPrompts } from '../prompts.js';

describe('runPrompts()', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns correct options for claude/full/internal/skip', async () => {
    vi.mocked(select)
      .mockResolvedValueOnce('claude')
      .mockResolvedValueOnce('full')
      .mockResolvedValueOnce('internal')
      .mockResolvedValueOnce('skip');

    const result = await runPrompts();

    expect(result).toEqual({
      tool: 'claude',
      profile: 'full',
      repoVisibility: 'internal',
      ingestion: 'skip',
    });
  });

  it('returns correct options for gemini/solo/public/local', async () => {
    vi.mocked(select)
      .mockResolvedValueOnce('gemini')
      .mockResolvedValueOnce('solo')
      .mockResolvedValueOnce('public')
      .mockResolvedValueOnce('local');

    const result = await runPrompts();

    expect(result).toEqual({
      tool: 'gemini',
      profile: 'solo',
      repoVisibility: 'public',
      ingestion: 'local',
    });
  });

  it('returns correct options for both/full/private/mcp', async () => {
    vi.mocked(select)
      .mockResolvedValueOnce('both')
      .mockResolvedValueOnce('full')
      .mockResolvedValueOnce('private')
      .mockResolvedValueOnce('mcp');

    const result = await runPrompts();

    expect(result).toEqual({
      tool: 'both',
      profile: 'full',
      repoVisibility: 'private',
      ingestion: 'mcp',
    });
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

  it('calls select exactly 4 times', async () => {
    vi.mocked(select)
      .mockResolvedValueOnce('claude')
      .mockResolvedValueOnce('solo')
      .mockResolvedValueOnce('internal')
      .mockResolvedValueOnce('skip');

    await runPrompts();

    expect(select).toHaveBeenCalledTimes(4);
  });
});
