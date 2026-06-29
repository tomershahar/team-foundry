# PROGRESS.md  -  create-team-foundry

## Current State

- Package version: 3.5.0
- Change base: `123c040 docs: add SECURITY.md (supported versions, threat model, private reporting)`
- Type check: passing (`npx tsc --noEmit`, 2026-06-29)
- Lint: passing (`npm run lint`, 2026-06-29)
- Build: passing (`npm run build`, 2026-06-29)
- Tests: passing (user-reported `npm test`: 19 files, 817 tests; 2026-06-29)

## Completed

- Replaced stale v2 architecture and status references with the current v3.5 command and module model.
- Replaced placeholder feature tracking with the product's implemented capability groups.
- Tightened README positioning around missing product context and made AGENTS.md compatibility claims precise.
- Fixed AGENTS.md generation so Claude Code skills are advertised only when the selected tool set includes Claude Code.
- Reworked feedback prompts around one retention question: whether the user would use team-foundry again, and why.
- Added regression coverage for tool-specific skill advertising and focused feedback questions.

## In Progress

- No active implementation work in this change set.

## Known Issues

- Untracked feedback and scratch files predate this work and were intentionally left untouched.

## Next Steps

1. Publish the next package version when the change set is ready for npm.
2. Recruit a small group of users and ask the new retention question after they try the playground or onboarding.
3. Use feedback themes to choose the next product iteration rather than adding features speculatively.

---
*Updated 2026-06-29*
