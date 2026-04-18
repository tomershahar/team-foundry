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
      .mockResolvedValueOnce('mcp');

    const result = await runPrompts();

    expect(result).toEqual({
      tool: 'both',
      profile: 'full',
      repoVisibility: 'private',
      ingestion: 'mcp',
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

  it('calls select exactly 4 times for non-local ingestion', async () => {
    vi.mocked(select)
      .mockResolvedValueOnce('claude')
      .mockResolvedValueOnce('solo')
      .mockResolvedValueOnce('internal')
      .mockResolvedValueOnce('skip');

    await runPrompts();

    expect(select).toHaveBeenCalledTimes(4);
  });
});
