export interface LinkFinding {
  type: 'outcome-metric' | 'now-assumption' | 'assumption-outcome';
  file: string;
  item: string;
  detail: string;
}

export interface RankedSuggestion {
  item: string;
  file: string;
  detail: string;
  score: number;
  action: string;
}

interface HealthFinding {
  file: string;
  health: 'stale' | 'empty' | 'missing';
  prs: number;
}

const SEVERITY: Record<string, number> = {
  missing: 3,
  'outcome-metric': 3,
  'now-assumption': 3,
  'assumption-outcome': 3,
  stale: 2,
  empty: 2,
};

function recencyFactor(prs: number): number {
  if (prs > 3) return 2;
  if (prs > 0) return 1;
  return 0;
}

function actionForHealth(health: 'stale' | 'empty' | 'missing', file: string): string {
  if (health === 'missing') return `Run \`npx create-team-foundry\` to scaffold ${file}`;
  if (health === 'empty') return `Fill in ${file} with real content (remove stub placeholder)`;
  return `Update last_updated in ${file} and review content for accuracy`;
}

function actionForLink(type: LinkFinding['type'], item: string, file: string): string {
  if (type === 'outcome-metric') return `Define "${item}" in data/metrics.md with formula, source, window, owner`;
  if (type === 'now-assumption') return `Add assumption reference to "${item}" in ${file} or link it in assumptions.md`;
  return `Add cross-reference between "${item}" and a related outcome or assumption`;
}

export function rankFindings(
  healthFindings: HealthFinding[],
  linkFindings: LinkFinding[],
): RankedSuggestion[] {
  const candidates: RankedSuggestion[] = [];

  for (const h of healthFindings) {
    const severity = SEVERITY[h.health] ?? 1;
    const score = severity * 3 + recencyFactor(h.prs) ;
    candidates.push({
      item: h.file,
      file: h.file,
      detail: `File is ${h.health}`,
      score,
      action: actionForHealth(h.health, h.file),
    });
  }

  for (const l of linkFindings) {
    const severity = SEVERITY[l.type] ?? 1;
    const score = severity * 3;
    candidates.push({
      item: l.item,
      file: l.file,
      detail: l.detail,
      score,
      action: actionForLink(l.type, l.item, l.file),
    });
  }

  candidates.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.file.localeCompare(b.file);
  });

  return candidates.slice(0, 3);
}

// Extract ## heading names from content.
// If section is provided, only headings inside that ### section are returned.
export function extractHeadings(content: string, section?: string): string[] {
  if (!content.trim()) return [];

  let source = content;
  if (section) {
    const sectionRe = new RegExp(`###\\s+${escapeRe(section)}\\s*\\n([\\s\\S]*?)(?=###|$)`);
    const match = source.match(sectionRe);
    source = match ? match[1] : '';
  }

  const headings: string[] = [];
  for (const line of source.split('\n')) {
    const m = line.match(/^##\s+(.+)$/);
    if (m) headings.push(m[1].trim());
  }
  return headings;
}

// Returns a map of ## heading name → body text (text until next ## heading).
export function extractSectionBodies(content: string): Record<string, string> {
  const result: Record<string, string> = {};
  const lines = content.split('\n');
  let currentHeading: string | null = null;
  const bodyLines: string[] = [];

  for (const line of lines) {
    const m = line.match(/^##\s+(.+)$/);
    if (m) {
      if (currentHeading !== null) result[currentHeading] = bodyLines.join('\n').trim();
      currentHeading = m[1].trim();
      bodyLines.length = 0;
    } else if (currentHeading !== null) {
      bodyLines.push(line);
    }
  }
  if (currentHeading !== null) result[currentHeading] = bodyLines.join('\n').trim();
  return result;
}

// Rule 1: Outcome/north-star ## headings that aren't in metrics.md ## headings.
export function checkOutcomeMetricLinks(
  outcomesContent: string,
  northStarContent: string,
  metricsContent: string,
): LinkFinding[] {
  const defined = new Set(extractHeadings(metricsContent));
  if (defined.size === 0) return []; // no metric set to check against

  const findings: LinkFinding[] = [];
  const referencedInOutcomes = extractHeadings(outcomesContent);
  const referencedInNorthStar = extractHeadings(northStarContent);

  for (const heading of referencedInOutcomes) {
    if (!defined.has(heading)) {
      findings.push({
        type: 'outcome-metric',
        file: 'team-foundry/product/outcomes.md',
        item: heading,
        detail: `"${heading}" referenced in outcomes.md but not defined in data/metrics.md`,
      });
    }
  }
  for (const heading of referencedInNorthStar) {
    if (!defined.has(heading)) {
      findings.push({
        type: 'outcome-metric',
        file: 'team-foundry/product/north-star.md',
        item: heading,
        detail: `"${heading}" referenced in north-star.md but not defined in data/metrics.md`,
      });
    }
  }
  return findings;
}

// Rule 2: Now items in now-next-later.md that don't reference any assumption heading.
export function checkNowAssumptionLinks(
  nowNextLaterContent: string,
  assumptionsContent: string,
): LinkFinding[] {
  if (!nowNextLaterContent.trim()) return [];

  const assumptionHeadings = extractHeadings(assumptionsContent);
  const nowItems = extractHeadings(nowNextLaterContent, 'Now');
  const bodies = extractSectionBodies(nowNextLaterContent);

  const findings: LinkFinding[] = [];
  for (const item of nowItems) {
    const body = bodies[item] ?? '';
    const referencesAssumption = assumptionHeadings.some(a => body.includes(a));
    if (!referencesAssumption) {
      findings.push({
        type: 'now-assumption',
        file: 'team-foundry/product/now-next-later.md',
        item,
        detail: `Now item "${item}" has no linked assumption in product/assumptions.md`,
      });
    }
  }
  return findings;
}

// Rule 3: Assumptions with no outcome reference AND outcomes with no assumption reference.
export function checkAssumptionOutcomeReciprocity(
  assumptionsContent: string,
  outcomesContent: string,
): LinkFinding[] {
  if (!assumptionsContent.trim() || !outcomesContent.trim()) return [];

  const outcomeHeadings = extractHeadings(outcomesContent);
  const assumptionHeadings = extractHeadings(assumptionsContent);
  const assumptionBodies = extractSectionBodies(assumptionsContent);
  const outcomeBodies = extractSectionBodies(outcomesContent);

  const findings: LinkFinding[] = [];

  for (const assumption of assumptionHeadings) {
    const body = assumptionBodies[assumption] ?? '';
    if (!outcomeHeadings.some(o => body.includes(o))) {
      findings.push({
        type: 'assumption-outcome',
        file: 'team-foundry/product/assumptions.md',
        item: assumption,
        detail: `Assumption "${assumption}" does not reference any outcome`,
      });
    }
  }

  for (const outcome of outcomeHeadings) {
    const body = outcomeBodies[outcome] ?? '';
    if (!assumptionHeadings.some(a => body.includes(a))) {
      findings.push({
        type: 'assumption-outcome',
        file: 'team-foundry/product/outcomes.md',
        item: outcome,
        detail: `Outcome "${outcome}" does not reference any assumption`,
      });
    }
  }

  return findings;
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function readOptional(filePath: string): Promise<string> {
  try {
    const { readFile } = await import('fs/promises');
    return await readFile(filePath, 'utf-8');
  } catch {
    return '';
  }
}

export async function runLinkChecks(targetDir: string): Promise<LinkFinding[]> {
  const p = (rel: string) => `${targetDir}/${rel}`;
  const [outcomes, northStar, metrics, nowNext, assumptions] = await Promise.all([
    readOptional(p('team-foundry/product/outcomes.md')),
    readOptional(p('team-foundry/product/north-star.md')),
    readOptional(p('team-foundry/data/metrics.md')),
    readOptional(p('team-foundry/product/now-next-later.md')),
    readOptional(p('team-foundry/product/assumptions.md')),
  ]);

  return [
    ...checkOutcomeMetricLinks(outcomes, northStar, metrics),
    ...checkNowAssumptionLinks(nowNext, assumptions),
    ...checkAssumptionOutcomeReciprocity(assumptions, outcomes),
  ];
}
