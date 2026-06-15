import { describe, it, expect } from 'vitest';
import { buildFeedbackUrl, FEEDBACK_REPO, FEEDBACK_NUDGE } from '../feedback.js';

describe('buildFeedbackUrl()', () => {
  const env = { version: '3.5.0', node: 'v20.0.0', platform: 'darwin arm64' };

  it('points at the project repo new-issue endpoint', () => {
    const url = buildFeedbackUrl(env);
    expect(url.startsWith(`https://github.com/${FEEDBACK_REPO}/issues/new?`)).toBe(true);
  });

  it('prefills a title', () => {
    const url = buildFeedbackUrl(env);
    expect(url).toContain('title=Feedback');
  });

  it('embeds the environment in the body for triage', () => {
    const decoded = decodeURIComponent(buildFeedbackUrl(env));
    expect(decoded).toContain('create-team-foundry: 3.5.0');
    expect(decoded).toContain('node: v20.0.0');
    expect(decoded).toContain('platform: darwin arm64');
  });

  it('produces a valid, parseable URL', () => {
    expect(() => new URL(buildFeedbackUrl(env))).not.toThrow();
  });
});

describe('FEEDBACK_NUDGE', () => {
  it('tells the user how to give feedback', () => {
    expect(FEEDBACK_NUDGE).toContain('feedback');
  });
});
