# Changelog

## [2.0.0] — 2026-04-25

### What's new in v2

**Cursor support**
`npx create-team-foundry` now supports Cursor as a tool option. Generates `.cursor/rules/team-foundry.mdc` with `alwaysApply: true` — works alongside Claude Code and Gemini CLI, or on its own.

**Federated CLAUDE.md layout**
Full-profile teams can opt into federated mode: each major folder (`product/`, `team/`, `engineering/`, `design/`, `data/`, `context/`) gets its own `CLAUDE.md` routing file. Designed for teams using multiple Claude Code instances or per-folder context loading.

**Status command**
`npx create-team-foundry status` — shows a health table across all team-foundry files: last updated, days since update, PRs shipped since update, owner, and health classification (ok / stale / empty / missing). Stale files include a "why this nudge" explanation with specific evidence.

**Owner metadata**
All content templates now include an `owner:` field in YAML frontmatter. Set it to the person responsible for keeping that file current. The status command surfaces files with no owner set.

**Reality observation layer**
The coach now reads recent git activity at the start of every explicit/scheduled review session. Drift findings cite specific commit messages and day counts — not vague "this looks stale" observations.

**Feature queries**
The coach handles "tell me about feature X" queries by reading the relevant files across the repo (outcomes, customers, now-next-later, assumptions, decisions) and synthesizing a single response. Profile-aware: solo and full profiles get appropriately scoped answers.

**Worked example**
`example/` contains a fully populated team-foundry for Clearline, a fictional B2B SaaS team. 22 files, 8-person team, realistic content. Reference it when setting up your own.

**Gemini CLI support**
`GEMINI.md` generation added alongside `CLAUDE.md`. Use `tool: both` to generate both files simultaneously.

### Breaking changes

None. v1 scaffolds are fully compatible with v2. Run `npx create-team-foundry status` on an existing v1 repo to see what's missing.

---

## [1.0.0] — 2025-12-01

Initial release. Solo and full profiles. Claude Code support. Coach playbook. Onboarding interview. B1–B17 coaching behaviors.
