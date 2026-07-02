import { describe, expect, it } from 'vitest';
import fs from 'fs/promises';

const README_URL = new URL('../../README.md', import.meta.url);

describe('README evidence', () => {
  it('shows the controlled comparison before generated-file details', async () => {
    const readme = await fs.readFile(README_URL, 'utf-8');
    const comparison = readme.indexOf('## Controlled comparison');
    const generated = readme.indexOf('## What gets generated');

    expect(comparison).toBeGreaterThan(-1);
    expect(generated).toBeGreaterThan(comparison);
  });

  it('links the comparison to raw evidence and its source decision', async () => {
    const readme = await fs.readFile(README_URL, 'utf-8');

    expect(readme).toContain('docs/evidence/f07-controlled-comparison.md');
    expect(readme).toContain('example/team-foundry/engineering/decisions/ADR-005.md');
  });

  it('reports the observed scores, conditions, and real Doctor result', async () => {
    const readme = await fs.readFile(README_URL, 'utf-8');

    expect(readme).toContain('0/5');
    expect(readme).toContain('5/5');
    expect(readme).toContain('same prompt');
    expect(readme).toContain('80/100');
    expect(readme).toContain('0/16 populated files are current');
  });

  it('qualifies the result as one controlled example', async () => {
    const readme = await fs.readFile(README_URL, 'utf-8');

    expect(readme.toLowerCase()).toContain('in this controlled example');
    expect(readme).not.toMatch(/every (ai|agent)|always follows/i);
  });
});
