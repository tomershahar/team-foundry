import { describe, it, expect } from 'vitest';
import {
  extractHeadings,
  extractSectionBodies,
  checkOutcomeMetricLinks,
  checkNowAssumptionLinks,
  checkAssumptionOutcomeReciprocity,
  rankFindings,
} from '../link-checker.js';
import type { LinkFinding } from '../link-checker.js';

// ── extractHeadings ──────────────────────────────────────────────────────────

describe('extractHeadings()', () => {
  it('extracts ## headings from content', () => {
    const content = `# Doc\n\n## Alpha\n\nsome text\n\n## Beta\n\nother text`;
    expect(extractHeadings(content)).toEqual(['Alpha', 'Beta']);
  });

  it('returns empty array when no ## headings', () => {
    expect(extractHeadings('# Just a title\n\nsome text')).toEqual([]);
  });

  it('scoped to a ### section when section arg given', () => {
    const content = `### Now\n\n## Feature A\n\nsome text\n\n### Next\n\n## Feature B\n\ntext`;
    expect(extractHeadings(content, 'Now')).toEqual(['Feature A']);
  });

  it('strips leading/trailing whitespace from heading names', () => {
    expect(extractHeadings('##  Trimmed  \n\ntext')).toEqual(['Trimmed']);
  });
});

// ── extractSectionBodies ─────────────────────────────────────────────────────

describe('extractSectionBodies()', () => {
  it('returns map of heading → body text', () => {
    const content = `## Alpha\n\nsome alpha text\n\n## Beta\n\nbeta content`;
    const bodies = extractSectionBodies(content);
    expect(bodies['Alpha']).toContain('some alpha text');
    expect(bodies['Beta']).toContain('beta content');
  });

  it('returns empty map when no ## headings', () => {
    expect(extractSectionBodies('# title\nno headings')).toEqual({});
  });
});

// ── checkOutcomeMetricLinks ───────────────────────────────────────────────────

describe('checkOutcomeMetricLinks()', () => {
  const metricsContent = `## Activation Rate\n\nformula: ...\n\n## Retention\n\nformula: ...`;
  const outcomesContent = `## Activation Rate\n\nWe track this metric.\n\n## Retention\n\nLinked here.`;
  const northStarContent = `## Churn Rate\n\nWe want to minimize this.`;

  it('returns empty when all referenced metrics are defined', () => {
    const findings = checkOutcomeMetricLinks(outcomesContent, '', metricsContent);
    expect(findings).toHaveLength(0);
  });

  it('flags a metric heading in north-star not present in metrics.md', () => {
    const findings = checkOutcomeMetricLinks('', northStarContent, metricsContent);
    expect(findings).toHaveLength(1);
    expect(findings[0].item).toBe('Churn Rate');
    expect(findings[0].type).toBe('outcome-metric');
  });

  it('returns empty when metrics content is empty (file missing)', () => {
    // Cannot flag anything without a defined metric set
    const findings = checkOutcomeMetricLinks(outcomesContent, northStarContent, '');
    expect(findings).toHaveLength(0);
  });
});

// ── checkNowAssumptionLinks ───────────────────────────────────────────────────

describe('checkNowAssumptionLinks()', () => {
  const assumptionsContent = `## Users want onboarding\n\ndetails\n\n## Speed matters\n\ndetails`;
  const nowNextContent = `### Now\n\n## Onboarding redesign\n\nUsers want onboarding is the key assumption.\n\n## Performance work\n\nno assumption referenced here.\n\n### Next\n\n## Future thing\n\nsome text`;

  it('flags Now items with no assumption reference', () => {
    const findings = checkNowAssumptionLinks(nowNextContent, assumptionsContent);
    expect(findings.some(f => f.item === 'Performance work')).toBe(true);
  });

  it('does not flag Now items that reference an assumption heading', () => {
    const findings = checkNowAssumptionLinks(nowNextContent, assumptionsContent);
    expect(findings.some(f => f.item === 'Onboarding redesign')).toBe(false);
  });

  it('does not flag items in ### Next sections', () => {
    const findings = checkNowAssumptionLinks(nowNextContent, assumptionsContent);
    expect(findings.some(f => f.item === 'Future thing')).toBe(false);
  });

  it('returns empty when nowNextLater content is empty', () => {
    expect(checkNowAssumptionLinks('', assumptionsContent)).toHaveLength(0);
  });
});

// ── checkAssumptionOutcomeReciprocity ─────────────────────────────────────────

describe('checkAssumptionOutcomeReciprocity()', () => {
  const outcomesContent = `## Grow activation\n\nsome text\n\n## Reduce churn\n\nsome text`;
  const assumptionsContent = `## Speed matters\n\nLinked to Grow activation outcome.\n\n## Orphan assumption\n\nno outcome mentioned here.`;

  it('flags assumptions that reference no outcome heading', () => {
    const findings = checkAssumptionOutcomeReciprocity(assumptionsContent, outcomesContent);
    expect(findings.some(f => f.item === 'Orphan assumption' && f.type === 'assumption-outcome')).toBe(true);
  });

  it('does not flag assumptions that reference an outcome', () => {
    const findings = checkAssumptionOutcomeReciprocity(assumptionsContent, outcomesContent);
    expect(findings.some(f => f.item === 'Speed matters')).toBe(false);
  });

  it('flags outcomes that reference no assumption heading', () => {
    const findings = checkAssumptionOutcomeReciprocity(assumptionsContent, outcomesContent);
    expect(findings.some(f => f.item === 'Reduce churn' && f.type === 'assumption-outcome')).toBe(true);
  });

  it('returns empty when either content is empty', () => {
    expect(checkAssumptionOutcomeReciprocity('', outcomesContent)).toHaveLength(0);
    expect(checkAssumptionOutcomeReciprocity(assumptionsContent, '')).toHaveLength(0);
  });
});

// ── rankFindings ──────────────────────────────────────────────────────────────

describe('rankFindings()', () => {
  const makeLink = (item: string, file: string): LinkFinding => ({
    type: 'outcome-metric',
    file,
    item,
    detail: `detail for ${item}`,
  });

  const makeHealth = (file: string, health: 'stale' | 'empty' | 'missing', prs = 0) => ({
    file,
    health,
    prs,
  });

  it('returns at most 3 suggestions', () => {
    const links: LinkFinding[] = [
      makeLink('A', 'file-a.md'),
      makeLink('B', 'file-b.md'),
      makeLink('C', 'file-c.md'),
      makeLink('D', 'file-d.md'),
    ];
    const result = rankFindings([], links);
    expect(result.length).toBeLessThanOrEqual(3);
  });

  it('ranks missing-link and missing-file higher than stale', () => {
    const health = [makeHealth('stale-file.md', 'stale', 0)];
    const links = [makeLink('Undefined Metric', 'outcomes.md')];
    const result = rankFindings(health, links);
    // link finding (severity 3) should outrank stale (severity 2)
    expect(result[0].item).toBe('Undefined Metric');
  });

  it('breaks ties alphabetically by file path', () => {
    const links: LinkFinding[] = [
      makeLink('Z item', 'z-file.md'),
      makeLink('A item', 'a-file.md'),
    ];
    const result = rankFindings([], links);
    expect(result[0].item).toBe('A item');
  });

  it('returns empty when no findings', () => {
    expect(rankFindings([], [])).toHaveLength(0);
  });

  it('returns "no drift" sentinel when findings is empty', () => {
    const result = rankFindings([], []);
    expect(result).toHaveLength(0);
  });

  it('boosts score for files with recent PRs', () => {
    const healthNoPrs = [makeHealth('a.md', 'stale', 0)];
    const healthWithPrs = [makeHealth('b.md', 'stale', 5)];
    const r1 = rankFindings(healthNoPrs, []);
    const r2 = rankFindings(healthWithPrs, []);
    expect(r2[0].score).toBeGreaterThan(r1[0].score);
  });
});
