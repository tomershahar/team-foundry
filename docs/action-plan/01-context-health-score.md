# Spec 01: Context Health Score / Doctor

**Status:** Passing  
**Outcome:** A user can see, understand, and share how usable their repository context is.  
**Command:** `npx create-team-foundry doctor`  
**Depends on:** Existing `status` analysis and link checker

## Problem

The current `status` command reports useful detail, but the transformation remains hard
to summarize. Users need one visible answer to: "Is my team context usable, and what
single improvement matters most?"

This is not a second health engine. Doctor is a product-facing renderer over shared,
deterministic analysis.

## User Experience

```text
team-foundry doctor

Context health: 81/100  Needs attention

  Completeness      26/30
  Freshness         15/20
  Connectedness     18/25
  Ownership          8/10
  Tool routing      14/15

Highest-leverage fix:
  O2 has no linked assumption or validation signal.
  In: product/outcomes.md

Run `npx create-team-foundry status` for the full report.
```

`doctor --json` returns a versioned object for screenshots, CI adapters, and future
integrations. It must not include absolute paths, file contents, or environment data.

## Scoring Contract

The score is an explanation aid, not a scientific measure. Every point must map to an
observable repository condition and the category totals must always sum to 100.

| Category | Weight | Inputs |
|---|---:|---|
| Completeness | 30 | Required tracked files exist and are not placeholder-empty |
| Freshness | 20 | Tracked files are within existing staleness thresholds |
| Connectedness | 25 | Outcome/metric, roadmap/assumption, and assumption/outcome links are valid |
| Ownership | 10 | Existing tracked files have an owner |
| Tool routing | 15 | Present pointer files reference `AGENTS.md`; absent unselected pointers do not count against the score |

Rules:

- Category scores use proportions, not arbitrary per-file penalties.
- A category with no applicable checks receives full credit and explains why.
- Scores are rounded only after category calculation.
- Labels: `90–100 Healthy`, `70–89 Needs attention`, `<70 Context risk`.
- The highest-leverage fix reuses `rankFindings`; Doctor does not invent a second priority model.
- Identical repository state produces identical output, apart from date-sensitive freshness.

## Architecture

Refactor analysis from rendering before adding the new command:

- `src/status.ts`: expose a reusable `analyzeContextHealth(targetDir)` result containing file health, links, owners, pointer state, and ranked findings.
- `src/doctor.ts`: pure score calculation plus human and JSON renderers.
- `src/index.ts`: route `doctor` and `doctor --json`.
- `src/types.ts` or local exported interfaces: versioned Doctor result contract.
- `src/__tests__/doctor.test.ts`: score and renderer tests.
- `src/__tests__/cli.test.ts`: command routing smoke coverage.
- `README.md`: command table only in this iteration; the evidence section belongs to Spec 02.

Do not duplicate filesystem traversal or link analysis in `doctor.ts`.

## Non-Goals

- No LLM judgment, hosted dashboard, telemetry, MCP server, or network request.
- No competitive benchmark or claim that 81 is objectively "better" than another team.
- No failure exit code based on the score; `status --ci` remains the enforcement surface.
- No gamified badges in the first iteration.

## Development Track

### 1. Planner

- Trace `gatherStatus`, pointer checks, owner extraction, and `rankFindings`.
- Propose the smallest public analysis result that supports both Status and Doctor.
- List behavior-preserving refactors separately from new behavior.
- Stop for approval before changing `status.ts`.

### 2. Test Author: Red

Add failing tests first for:

- A complete, current, connected fixture scoring 100.
- Missing and empty files reducing only Completeness.
- Stale files reducing only Freshness.
- Link findings reducing Connectedness.
- Missing owners reducing Ownership.
- A present drifted pointer reducing Tool routing while absent optional pointers do not.
- Category totals summing to the total score.
- Boundary labels at 69, 70, 89, and 90.
- Stable JSON schema with `schemaVersion: 1`.
- No absolute target path in JSON or human output.
- Existing `status` output behavior remaining unchanged after analysis extraction.

### 3. Developer: Green

- Extract shared analysis without changing status semantics.
- Implement pure category calculators and renderers.
- Add CLI routing and concise help text.
- Keep output width usable in an 80-column terminal.
- Make no unrelated template or prompt changes.

### 4. Test Verifier

Run focused tests during development, then:

```bash
npx tsc --noEmit
npm run lint
npm run build
```

The user runs `npm test` and reports the output. Do not mark passing before that report.

### 5. Independent Code Review

Review in a fresh context for:

- Score manipulation or double-counting.
- Drift between Doctor and Status analysis.
- Optional pointer files being treated as required.
- Unstable JSON fields or accidental local-data disclosure.
- Regressions to `status --ci` exit behavior.
- Missing edge-case tests for empty profiles and malformed frontmatter.

### 6. UAT

Exercise Doctor against:

1. The populated Clearline playground.
2. A fresh empty scaffold.
3. A fixture with one broken link and one stale file.
4. An AGENTS-only installation with no tool pointers.

Record command output for Spec 02. The screenshot must come from a real fixture, not
manually composed terminal text.

## Acceptance Criteria

- `doctor` produces a score, five explained categories, and one next action.
- `doctor --json` is deterministic, versioned, and privacy-safe.
- Status and Doctor use one analysis path.
- Existing Status and CI behavior remains compatible.
- Typecheck, lint, build, user-run tests, independent review, and UAT all pass.

## Decision Gate

After release, ask at least ten users whether the score made the product easier to
understand or share. If it does not improve comprehension or engagement, do not build
a dashboard around it; retain the useful analysis and reconsider the score presentation.

## Verification Evidence

- User reported `npm test` passing on 2026-07-02.
- `npx tsc --noEmit`, `npm run lint`, and `npm run build` pass.
- UAT results:
  - no team-foundry installation: 0/100, installation fix shown
  - fresh solo scaffold: 70/100, empty stack context prioritized
  - populated AGENTS-only fixture: full Tool routing credit with no pointers
  - broken outcome/assumption fixture: Connectedness reduced and broken link prioritized
- Review confirmed Status and Doctor share analysis and ranking while `status --ci`
  retains its existing exit behavior.
- Follow-up code review disposition:
  - fixed contradictory degraded-Connectedness wording
  - derived Doctor rule families from the canonical link-checker list
  - centralized category labels and weights
  - removed Doctor-only work from the CI analysis path
  - parallelized independent status and pointer reads
  - deferred CLI test spawn-helper consolidation as unrelated test-infrastructure cleanup
- User reported the post-review `npm test` rerun passing on 2026-07-02.
