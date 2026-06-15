import { readFile } from 'fs/promises';

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
  /** Commits in the repo since the file's last update (squash-merge safe, unlike counting merge commits) */
  commits: number;
}

const SEVERITY: Record<string, number> = {
  missing: 3,
  'outcome-metric': 3,
  'now-assumption': 3,
  'assumption-outcome': 3,
  stale: 2,
  empty: 2,
};

function recencyFactor(commits: number): number {
  if (commits > 3) return 2;
  if (commits > 0) return 1;
  return 0;
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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
    const score = severity * 3 + recencyFactor(h.commits);
    candidates.push({
      item: h.file,
      file: h.file,
      detail: `File is ${h.health}: ${h.file.replace('team-foundry/', '')}`,
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
// Regex anchors to line boundaries so ### inside code blocks or inline text is ignored.
export function extractHeadings(content: string, section?: string): string[] {
  if (!content.trim()) return [];

  let source = content;
  if (section) {
    // Match the ### section header and capture everything until the next ### (or end of string).
    // (?:^|\n) anchors to line start without requiring multiline flag.
    const sectionRe = new RegExp(
      `(?:^|\\n)###\\s+${escapeRe(section)}\\s*\\n([\\s\\S]*?)(?=\\n###|$)`
    );
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

// Rule 1: ## headings in a "## Key Metrics" section of outcomes/north-star not defined in metrics.md.
// Scoped to "Key Metrics" subsection to avoid false positives from structural headings.
export function checkOutcomeMetricLinks(
  outcomesContent: string,
  northStarContent: string,
  metricsContent: string,
): LinkFinding[] {
  const defined = new Set(extractHeadings(metricsContent));
  if (defined.size === 0) return []; // no metric set to check against

  const findings: LinkFinding[] = [];

  // Only check ## headings nested under a "### Key Metrics" section
  const fromOutcomes = extractHeadings(outcomesContent, 'Key Metrics');
  const fromNorthStar = extractHeadings(northStarContent, 'Key Metrics');

  for (const heading of fromOutcomes) {
    if (!defined.has(heading)) {
      findings.push({
        type: 'outcome-metric',
        file: 'team-foundry/product/outcomes.md',
        item: heading,
        detail: `"${heading}" in outcomes.md#Key Metrics is not defined in data/metrics.md`,
      });
    }
  }
  for (const heading of fromNorthStar) {
    if (!defined.has(heading)) {
      findings.push({
        type: 'outcome-metric',
        file: 'team-foundry/product/north-star.md',
        item: heading,
        detail: `"${heading}" in north-star.md#Key Metrics is not defined in data/metrics.md`,
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
  if (assumptionHeadings.length === 0) return []; // no assumptions defined  -  nothing to check against

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

// Extracts items tagged with an ID (e.g. `### O1  -  …`, `## A2 …`) from ## or
// ### headings, with each item's body (text until the next heading of any level).
// Headings without an ID prefix — grouping headings like "Validated outcomes" or
// "Experiment readouts" — are skipped, so they can't produce false positives.
function extractIdItems(content: string, prefix: 'O' | 'A'): { id: string; body: string }[] {
  const idHead = new RegExp(`^#{2,3}\\s+(${prefix}\\d+)\\b`);
  const anyHead = /^#{2,3}\s+/;
  const items: { id: string; body: string }[] = [];
  let cur: { id: string; body: string } | null = null;

  for (const line of content.split('\n')) {
    const m = line.match(idHead);
    if (m) {
      if (cur) items.push(cur);
      cur = { id: m[1], body: '' };
      continue;
    }
    if (anyHead.test(line)) {
      // A non-item heading ends the current item's body.
      if (cur) { items.push(cur); cur = null; }
      continue;
    }
    if (cur) cur.body += line + '\n';
  }
  if (cur) items.push(cur);
  return items;
}

// Rule 3: every outcome should have a linked assumption and vice versa. Matching
// is by ID token (O1, A2 …) and symmetric — a reference in either file links both
// items, since teams usually write the link once ("Outcome: O1" on the assumption).
// When neither file uses the ID convention there's no signal, so it stays silent
// rather than flagging freeform prose.
export function checkAssumptionOutcomeReciprocity(
  assumptionsContent: string,
  outcomesContent: string,
): LinkFinding[] {
  if (!assumptionsContent.trim() || !outcomesContent.trim()) return [];

  const outcomes = extractIdItems(outcomesContent, 'O');
  const assumptions = extractIdItems(assumptionsContent, 'A');
  if (outcomes.length === 0 || assumptions.length === 0) return [];

  const linkedO = new Set<string>();
  const linkedA = new Set<string>();
  const mentions = (body: string, id: string) => new RegExp(`\\b${id}\\b`).test(body);

  for (const a of assumptions) {
    for (const o of outcomes) {
      if (mentions(a.body, o.id) || mentions(o.body, a.id)) {
        linkedA.add(a.id);
        linkedO.add(o.id);
      }
    }
  }

  const findings: LinkFinding[] = [];
  for (const a of assumptions) {
    if (!linkedA.has(a.id)) {
      findings.push({
        type: 'assumption-outcome',
        file: 'team-foundry/product/assumptions.md',
        item: a.id,
        detail: `Assumption "${a.id}" does not reference any outcome`,
      });
    }
  }
  for (const o of outcomes) {
    if (!linkedO.has(o.id)) {
      findings.push({
        type: 'assumption-outcome',
        file: 'team-foundry/product/outcomes.md',
        item: o.id,
        detail: `Outcome "${o.id}" does not reference any assumption`,
      });
    }
  }

  return findings;
}

async function readOptional(filePath: string): Promise<string> {
  try {
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
