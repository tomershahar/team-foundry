import { readFileSync } from 'fs';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

/** Public repo the feedback issue is opened against. */
export const FEEDBACK_REPO = 'tomershahar/team-foundry';

/** One-line nudge shown at value moments (status, playground) to drive feedback. */
export const FEEDBACK_NUDGE =
  'Useful? Tell us in 30s — run: npx create-team-foundry feedback';

export interface FeedbackEnv {
  version: string;
  node: string;
  platform: string;
}

/**
 * Builds a prefilled GitHub "new issue" URL so the user goes from terminal to a
 * ready-to-submit issue in one click — no hunting for the repo, no blank form.
 * Pure: takes the environment explicitly so it's unit-testable.
 */
export function buildFeedbackUrl(env: FeedbackEnv): string {
  const title = 'Feedback: ';
  const body = [
    "What's working, what's not, or what you wish it did:",
    '',
    '',
    '---',
    `- create-team-foundry: ${env.version}`,
    `- node: ${env.node}`,
    `- platform: ${env.platform}`,
  ].join('\n');

  const params = new URLSearchParams({ title, body });
  return `https://github.com/${FEEDBACK_REPO}/issues/new?${params.toString()}`;
}

function readOwnVersion(): string {
  try {
    const dir = path.dirname(fileURLToPath(import.meta.url));
    const pkg = JSON.parse(readFileSync(path.join(dir, '..', 'package.json'), 'utf-8'));
    return typeof pkg.version === 'string' ? pkg.version : 'unknown';
  } catch {
    return 'unknown';
  }
}

// Best-effort: open the URL in the default browser. Never throws — printing the
// URL is the real contract; opening is a convenience.
function tryOpenBrowser(url: string): void {
  const cmd =
    process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';
  try {
    const child = spawn(cmd, [url], { stdio: 'ignore', detached: true });
    child.on('error', () => {});
    child.unref();
  } catch {
    // ignore — the printed URL is the fallback
  }
}

/** Prints (and best-effort opens) the prefilled feedback issue URL. */
export function runFeedback(): void {
  const url = buildFeedbackUrl({
    version: readOwnVersion(),
    node: process.version,
    platform: `${process.platform} ${process.arch}`,
  });
  console.log(
    `\nThanks for helping shape team-foundry. Opening a prefilled issue — if it\n` +
      `doesn't open automatically, paste this into your browser:\n\n  ${url}\n`,
  );
  tryOpenBrowser(url);
}
