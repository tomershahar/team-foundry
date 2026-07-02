import { LINK_FINDING_TYPES } from './link-checker.js';
import { analyzeContextHealth } from './status.js';
import type { ContextHealthAnalysis } from './status.js';

export type DoctorCategoryKey =
  | 'completeness'
  | 'freshness'
  | 'connectedness'
  | 'ownership'
  | 'toolRouting';

export interface DoctorCategory {
  key: DoctorCategoryKey;
  label: string;
  score: number;
  maxScore: number;
  explanation: string;
}

export interface DoctorFix {
  detail: string;
  file: string;
  action: string;
}

export interface DoctorReport {
  schemaVersion: 1;
  score: number;
  label: 'Healthy' | 'Needs attention' | 'Context risk';
  categories: DoctorCategory[];
  highestLeverageFix: DoctorFix | null;
}

const CATEGORY_DEFINITIONS: Record<DoctorCategoryKey, { label: string; maxScore: number }> = {
  completeness: { label: 'Completeness', maxScore: 30 },
  freshness: { label: 'Freshness', maxScore: 20 },
  connectedness: { label: 'Connectedness', maxScore: 25 },
  ownership: { label: 'Ownership', maxScore: 10 },
  toolRouting: { label: 'Tool routing', maxScore: 15 },
};

function proportionalScore(passing: number, total: number, maxScore: number): number {
  if (total === 0) return maxScore;
  return Math.round((passing / total) * maxScore);
}

export function doctorLabel(score: number): DoctorReport['label'] {
  if (score >= 90) return 'Healthy';
  if (score >= 70) return 'Needs attention';
  return 'Context risk';
}

function category(key: DoctorCategoryKey, score: number, explanation: string): DoctorCategory {
  const definition = CATEGORY_DEFINITIONS[key];
  return {
    key,
    label: definition.label,
    score,
    maxScore: definition.maxScore,
    explanation,
  };
}

function unavailableCategory(key: DoctorCategoryKey): DoctorCategory {
  return category(key, 0, 'No team-foundry context detected');
}

function highestLeverageFix(analysis: ContextHealthAnalysis): DoctorFix | null {
  const topSuggestion = analysis.rankedSuggestions[0];
  return topSuggestion
    ? {
        detail: topSuggestion.detail,
        file: topSuggestion.file,
        action: topSuggestion.action,
      }
    : null;
}

export function calculateDoctorReport(analysis: ContextHealthAnalysis): DoctorReport {
  const hasContext = analysis.results.some((result) => result.exists);
  if (!hasContext) {
    const categories: DoctorCategory[] = [
      unavailableCategory('completeness'),
      unavailableCategory('freshness'),
      unavailableCategory('connectedness'),
      unavailableCategory('ownership'),
      unavailableCategory('toolRouting'),
    ];
    return {
      schemaVersion: 1,
      score: 0,
      label: 'Context risk',
      categories,
      highestLeverageFix: highestLeverageFix(analysis),
    };
  }

  const complete = analysis.results.filter((result) => result.exists && !result.isEmpty).length;
  const completenessScore = proportionalScore(
    complete,
    analysis.results.length,
    CATEGORY_DEFINITIONS.completeness.maxScore,
  );

  const freshnessApplicable = analysis.results.filter((result) => result.exists && !result.isEmpty);
  const current = freshnessApplicable.filter((result) => result.health !== 'stale').length;
  const freshnessScore = proportionalScore(
    current,
    freshnessApplicable.length,
    CATEGORY_DEFINITIONS.freshness.maxScore,
  );

  const failedConnectionRules = new Set(analysis.linkFindings.map((finding) => finding.type));
  const connectednessApplicable = analysis.isFullProfile ? LINK_FINDING_TYPES.length : 0;
  const passingConnectionRules = analysis.isFullProfile
    ? LINK_FINDING_TYPES.filter((rule) => !failedConnectionRules.has(rule)).length
    : 0;
  const connectednessScore = proportionalScore(
    passingConnectionRules,
    connectednessApplicable,
    CATEGORY_DEFINITIONS.connectedness.maxScore,
  );

  const ownershipApplicable = analysis.results.filter((result) => result.exists);
  const owned = ownershipApplicable.filter((result) => Boolean(result.owner)).length;
  const ownershipScore = proportionalScore(
    owned,
    ownershipApplicable.length,
    CATEGORY_DEFINITIONS.ownership.maxScore,
  );

  const presentPointers = analysis.pointerStatuses.filter((pointer) => pointer.exists);
  const healthyPointers = presentPointers.filter((pointer) => !pointer.drifted).length;
  const toolRoutingScore = proportionalScore(
    healthyPointers,
    presentPointers.length,
    CATEGORY_DEFINITIONS.toolRouting.maxScore,
  );

  const categories: DoctorCategory[] = [
    category(
      'completeness',
      completenessScore,
      `${complete}/${analysis.results.length} required context files contain real content`,
    ),
    category(
      'freshness',
      freshnessScore,
      freshnessApplicable.length === 0
        ? 'No populated files to assess; no additional freshness penalty'
        : `${current}/${freshnessApplicable.length} populated files are current`,
    ),
    category(
      'connectedness',
      connectednessScore,
      analysis.isFullProfile
        ? `${passingConnectionRules}/${LINK_FINDING_TYPES.length} integrity rule families clean`
        : 'Solo profile has no applicable cross-file integrity rules',
    ),
    category(
      'ownership',
      ownershipScore,
      ownershipApplicable.length === 0
        ? 'No existing files to assign; no additional ownership penalty'
        : `${owned}/${ownershipApplicable.length} existing files have an owner`,
    ),
    category(
      'toolRouting',
      toolRoutingScore,
      presentPointers.length === 0
        ? 'No pointer files present; AGENTS-only setups need none'
        : `${healthyPointers}/${presentPointers.length} present pointer files reference AGENTS.md`,
    ),
  ];

  const score = categories.reduce((sum, category) => sum + category.score, 0);
  return {
    schemaVersion: 1,
    score,
    label: doctorLabel(score),
    categories,
    highestLeverageFix: highestLeverageFix(analysis),
  };
}

function displayPath(relativePath: string): string {
  return relativePath.replace(/^team-foundry\//, '');
}

export function renderDoctorHuman(report: DoctorReport): string {
  const lines = [
    '',
    'team-foundry doctor',
    '',
    `Context health: ${report.score}/100  ${report.label}`,
    '',
  ];

  for (const category of report.categories) {
    lines.push(`  ${category.label.padEnd(17)} ${category.score}/${category.maxScore}`);
    lines.push(`    ${category.explanation}`);
  }

  lines.push('', 'Highest-leverage fix:');
  if (report.highestLeverageFix) {
    lines.push(`  ${report.highestLeverageFix.detail}`);
    lines.push(`  In: ${displayPath(report.highestLeverageFix.file)}`);
    lines.push(`  Action: ${report.highestLeverageFix.action}`);
  } else {
    lines.push('  No critical context gaps detected.');
  }

  lines.push('', 'Run `npx create-team-foundry status` for the full report.', '');
  return lines.join('\n');
}

export function renderDoctorJson(report: DoctorReport): string {
  return JSON.stringify(report, null, 2);
}

export async function runDoctor(
  targetDir: string,
  options: { json?: boolean } = {},
): Promise<void> {
  const report = calculateDoctorReport(await analyzeContextHealth(targetDir));
  console.log(options.json ? renderDoctorJson(report) : renderDoctorHuman(report));
}
