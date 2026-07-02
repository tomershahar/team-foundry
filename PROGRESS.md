# PROGRESS.md  -  create-team-foundry

## Current State

- Package version: 3.5.0
- Change base: `e3fd421 drop planned drift automation`
- Type check: passing (`npx tsc --noEmit`, 2026-07-02)
- Lint: passing (`npm run lint`, 2026-07-02)
- Build: passing (`npm run build`, 2026-07-02)
- Tests: passing (user-reported F07 `npm test`, 2026-07-02)

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
- Refreshed the Clearline playground around `AGENTS.md` primacy with thin Claude, Gemini,
  Cursor, and GitHub Copilot pointers and regenerated the bundled playground.
- Captured a fixed-rubric, same-prompt comparison: 0/5 without repository context and
  5/5 with it. Preserved full responses and reproduction notes under `docs/evidence/`.
- Captured real Doctor output from the generated playground: 80/100, with the frozen Q2
  example's stale April context reported honestly rather than cosmetically refreshed.
- Reworked the README to lead with observed behavior and added documentation acceptance
  checks plus a regression check against uncommitted executable-hook promises.
- Completed an independent F07 review and resolved its reproduction, model disclosure,
  hierarchy authority, and complete playground-parity findings.

## In Progress

- F07 implementation, evidence capture, independent review, and automated tests are
  complete; five-person comprehension UAT remains.
- F08 AGENTS.md compatibility hardening can run independently.
- F09 drift automation is dropped. F10 distribution waits for F07 verification sign-off.

## Known Issues

- Untracked feedback and scratch files predate this work and were intentionally left untouched.
- The bundled Clearline playground intentionally remains a frozen Q2 2026 snapshot. Doctor
  scores it 80/100 and flags all 16 tracked files as stale; routing now scores 15/15.

## Next Steps

1. Run the five-person README comprehension UAT and record answers verbatim.
2. Mark F07 passing, then start F10 distribution or run F08 characterization independently.

---
*Updated 2026-07-02*
