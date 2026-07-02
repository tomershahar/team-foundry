# PROGRESS.md  -  create-team-foundry

## Current State

- Package version: 3.5.0
- Change base: `21c2c33 improve positioning and feedback flow`
- Type check: passing (`npx tsc --noEmit`, 2026-07-01)
- Lint: passing (`npm run lint`, 2026-06-29)
- Build: passing (`npm run build`, 2026-06-29)
- Tests: passing (user-reported post-review `npm test` rerun; 2026-07-02)

## Completed

- Replaced stale v2 architecture and status references with the current v3.5 command and module model.
- Replaced placeholder feature tracking with the product's implemented capability groups.
- Tightened README positioning around missing product context and made AGENTS.md compatibility claims precise.
- Fixed AGENTS.md generation so Claude Code skills are advertised only when the selected tool set includes Claude Code.
- Reworked feedback prompts around one retention question: whether the user would use team-foundry again, and why.
- Added regression coverage for tool-specific skill advertising and focused feedback questions.
- Reconciled the five-item three-AI review with the current v3.5 implementation.
- Added five independent implementation specs under `docs/action-plan/`, each with
  planning, test-first or acceptance-first work, implementation, verification, independent
  review, UAT, and release gates.
- Added F06-F10 to feature tracking with partial and dependency-blocked states preserved.
- Implemented F06 Doctor with deterministic five-category scoring, privacy-safe JSON,
  one highest-leverage fix, and shared Status analysis.
- Added Doctor unit and CLI coverage; typecheck, lint, and build pass locally.
- Completed F06 UAT across no-installation, fresh-scaffold, AGENTS-only, and broken-link fixtures.
- Applied F06 review fixes for Connectedness wording, rule-family exhaustiveness,
  category-definition duplication, CI-path overhead, and independent I/O parallelism.
- Dropped F09 lightweight drift automation by maintainer decision; existing Status and CI
  checks are sufficient.

## In Progress

- F06 Context Health Score / Doctor is passing after review fixes.
- F07 Evidence-led README is partially delivered and waits for real Doctor output.
- F08 AGENTS.md compatibility hardening can run independently.
- F09 drift automation is dropped. F10 distribution waits for F07 evidence.

## Known Issues

- Untracked feedback and scratch files predate this work and were intentionally left untouched.
- The bundled Clearline playground predates AGENTS.md primacy and currently scores 65/100:
  its content is stale and its legacy CLAUDE.md does not reference AGENTS.md. Refresh under F07.

## Next Steps

1. Commit F06 separately from the next development track.
2. Start F07 by refreshing the Clearline playground and defining the controlled comparison rubric.
3. Capture real before/after evidence without changing the rubric after seeing results.
4. Run F08 characterization independently when capacity allows.

---
*Updated 2026-07-02*
