import { describe, expect, it } from 'vitest';
import {
  calculateDoctorReport,
  doctorLabel,
  renderDoctorHuman,
  renderDoctorJson,
} from '../doctor.js';
import type { ContextHealthAnalysis, FileStatus, PointerFileStatus } from '../status.js';
import type { LinkFinding, RankedSuggestion } from '../link-checker.js';

function file(overrides: Partial<FileStatus> = {}): FileStatus {
  return {
    relativePath: 'team-foundry/product/outcomes.md',
    lastUpdated: '2026-07-01',
    owner: 'Alice',
    daysSinceUpdate: 0,
    commitsSinceUpdate: 0,
    exists: true,
    isEmpty: false,
    health: 'ok',
    ...overrides,
  };
}

function pointer(overrides: Partial<PointerFileStatus> = {}): PointerFileStatus {
  return {
    relativePath: 'CLAUDE.md',
    exists: true,
    drifted: false,
    ...overrides,
  };
}

function analysis(overrides: Partial<ContextHealthAnalysis> = {}): ContextHealthAnalysis {
  return {
    isFullProfile: true,
    results: [
      file(),
      file({ relativePath: 'team-foundry/product/customers.md' }),
      file({ relativePath: 'team-foundry/engineering/stack.md' }),
      file({ relativePath: 'team-foundry/data/metrics.md' }),
    ],
    linkFindings: [],
    pointerStatuses: [pointer()],
    rankedSuggestions: [],
    ...overrides,
  };
}

function scoreByKey(report: ReturnType<typeof calculateDoctorReport>, key: string) {
  return report.categories.find((category) => category.key === key)!;
}

describe('calculateDoctorReport()', () => {
  it('scores a repository with no team-foundry context at 0', () => {
    const report = calculateDoctorReport(
      analysis({
        results: [
          file({ exists: false, health: 'missing' }),
          file({ exists: false, health: 'missing' }),
        ],
        pointerStatuses: [pointer({ exists: false })],
      }),
    );
    expect(report.score).toBe(0);
    expect(report.label).toBe('Context risk');
    expect(report.categories.every((category) => category.score === 0)).toBe(true);
  });

  it('scores a complete, current, connected analysis at 100', () => {
    const report = calculateDoctorReport(analysis());
    expect(report.score).toBe(100);
    expect(report.label).toBe('Healthy');
    expect(report.categories.reduce((sum, category) => sum + category.score, 0)).toBe(100);
  });

  it('reduces only completeness for missing and empty files', () => {
    const report = calculateDoctorReport(
      analysis({
        results: [
          file(),
          file({ relativePath: 'team-foundry/product/customers.md' }),
          file({
            relativePath: 'team-foundry/engineering/stack.md',
            exists: false,
            health: 'missing',
          }),
          file({ relativePath: 'team-foundry/data/metrics.md', isEmpty: true, health: 'empty' }),
        ],
      }),
    );

    expect(scoreByKey(report, 'completeness').score).toBe(15);
    for (const category of report.categories.filter((item) => item.key !== 'completeness')) {
      expect(category.score).toBe(category.maxScore);
    }
  });

  it('reduces only freshness for stale applicable files', () => {
    const report = calculateDoctorReport(
      analysis({
        results: [file(), file({ health: 'stale', daysSinceUpdate: 90 })],
      }),
    );
    expect(scoreByKey(report, 'freshness').score).toBe(10);
    expect(scoreByKey(report, 'completeness').score).toBe(30);
  });

  it('scores connectedness by failed integrity rule families', () => {
    const findings: LinkFinding[] = [
      {
        type: 'outcome-metric',
        file: 'team-foundry/product/outcomes.md',
        item: 'Activation',
        detail: 'Activation is undefined',
      },
      {
        type: 'outcome-metric',
        file: 'team-foundry/product/north-star.md',
        item: 'Activation',
        detail: 'Activation is undefined in another file',
      },
      {
        type: 'now-assumption',
        file: 'team-foundry/product/now-next-later.md',
        item: 'Export',
        detail: 'Export has no assumption',
      },
    ];
    const report = calculateDoctorReport(analysis({ linkFindings: findings }));

    expect(scoreByKey(report, 'connectedness').score).toBe(8);
    expect(scoreByKey(report, 'connectedness').explanation).toBe(
      '1/3 integrity rule families clean',
    );
    expect(scoreByKey(report, 'completeness').score).toBe(30);
  });

  it('reduces only ownership when an existing file has no owner', () => {
    const report = calculateDoctorReport(
      analysis({
        results: [file(), file({ owner: null })],
      }),
    );
    expect(scoreByKey(report, 'ownership').score).toBe(5);
    expect(scoreByKey(report, 'completeness').score).toBe(30);
  });

  it('reduces tool routing for present drifted pointers', () => {
    const report = calculateDoctorReport(
      analysis({
        pointerStatuses: [pointer(), pointer({ relativePath: 'GEMINI.md', drifted: true })],
      }),
    );
    expect(scoreByKey(report, 'toolRouting').score).toBe(8);
  });

  it('does not penalize absent optional pointers', () => {
    const report = calculateDoctorReport(
      analysis({
        pointerStatuses: [
          pointer({ exists: false }),
          pointer({ relativePath: 'GEMINI.md', exists: false }),
        ],
      }),
    );
    expect(scoreByKey(report, 'toolRouting').score).toBe(15);
    expect(scoreByKey(report, 'toolRouting').explanation).toContain('No pointer files present');
  });

  it('uses the top existing ranked suggestion rather than reprioritizing', () => {
    const suggestion: RankedSuggestion = {
      item: 'O2',
      file: 'team-foundry/product/outcomes.md',
      detail: 'O2 has no linked assumption',
      score: 9,
      action: 'Link O2 to an assumption',
    };
    const report = calculateDoctorReport(analysis({ rankedSuggestions: [suggestion] }));
    expect(report.highestLeverageFix).toEqual({
      detail: suggestion.detail,
      file: suggestion.file,
      action: suggestion.action,
    });
  });
});

describe('doctorLabel()', () => {
  it.each([
    [69, 'Context risk'],
    [70, 'Needs attention'],
    [89, 'Needs attention'],
    [90, 'Healthy'],
  ] as const)('labels %i as %s', (score, label) => {
    expect(doctorLabel(score)).toBe(label);
  });
});

describe('Doctor renderers', () => {
  it('renders a versioned JSON contract without local paths or file contents', () => {
    const report = calculateDoctorReport(analysis());
    const output = renderDoctorJson(report);
    const parsed = JSON.parse(output);

    expect(parsed.schemaVersion).toBe(1);
    expect(parsed.score).toBe(100);
    expect(output).not.toContain('/Users/');
    expect(output).not.toContain('This file has real content');
  });

  it('renders five categories, one next action, and the full-status command', () => {
    const suggestion: RankedSuggestion = {
      item: 'O2',
      file: 'team-foundry/product/outcomes.md',
      detail: 'O2 has no linked assumption',
      score: 9,
      action: 'Link O2 to an assumption',
    };
    const output = renderDoctorHuman(
      calculateDoctorReport(analysis({ rankedSuggestions: [suggestion] })),
    );

    expect(output).toContain('Context health:');
    expect(output).toContain('Completeness');
    expect(output).toContain('Freshness');
    expect(output).toContain('Connectedness');
    expect(output).toContain('Ownership');
    expect(output).toContain('Tool routing');
    expect(output).toContain('Highest-leverage fix:');
    expect(output).toContain('product/outcomes.md');
    expect(output).toContain('npx create-team-foundry status');
    expect(output).not.toContain('/Users/');
  });
});
