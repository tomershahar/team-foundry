# Changelog

## [3.5.0]  -  2026-06-15

### What's new (Time-to-aha + drift gate)

**Project identity auto-extraction**
- `AGENTS.md` now opens with a real project overview auto-detected from `package.json` (name + description), falling back to your README's title and first paragraph. No network, no AI — purely local.
- Empty `owner:` frontmatter is pre-filled with your `git config user.name` (still editable). Closes the gap where the "Standard Scan" prompt promised more than the CLI delivered.

**Playground mode**
- `npx create-team-foundry playground` scaffolds the fully-populated Clearline example into `team-foundry-playground/` so you can experience the tool in under a minute, before doing any onboarding. Refuses to overwrite a non-empty playground directory.

**Drift gate for CI**
- `npx create-team-foundry status --ci` runs the existing drift checks non-interactively and exits `1` on missing files or link-integrity issues (stale/empty are warn-only). `--max-stale=N` also fails when more than N files are stale.
- `npx create-team-foundry init-ci` writes `.github/workflows/team-foundry.yml` (checks out with `fetch-depth: 0` so staleness history is available). See [docs/ci.md](docs/ci.md).

**Wider tool coverage**
- New tool options: **GitHub Copilot** (`.github/copilot-instructions.md` pointer) and **Other** (`AGENTS.md` only, for any tool that reads it natively — Codex, Copilot CLI, Windsurf). "All tools" now includes the Copilot pointer. Pointer-drift detection and detect-and-merge cover the new files too.

**`adopt` — bring your existing rules**
- `npx create-team-foundry adopt` imports pre-existing AI config (`.cursorrules`, `.windsurfrules`, `.clinerules`, `CLAUDE.md`, `GEMINI.md`, `AGENTS.md`, `.github/copilot-instructions.md`, `.cursor/rules/*.mdc`) into `team-foundry/context/imported-rules.md` with provenance, so a team moving to team-foundry doesn't start from a blank page. Skips files already managed by team-foundry; refuses to clobber an existing import.

**More accurate drift detection**
- The outcome↔assumption link check is now ID-based (`O1`/`A1`) and symmetric: a reference in either file links both, grouping headings are no longer mistaken for items, and it stays silent on freeform prose. Fixes false positives that flagged correctly-linked files (including the bundled example, which now passes its own `status --ci`). Templates suggest the ID convention.

**Feedback funnel**
- `npx create-team-foundry feedback` opens a prefilled GitHub issue (title, body, and environment filled in) so feedback is one command away instead of "go find the repo." A one-line nudge now appears at value moments — the `status` output and the `playground` outro (re-run regularly), not just the install screen.

**README evidence pass**
- README now shows a real generated `AGENTS.md` excerpt, a before/after, a commands table, and which files humans edit vs the CLI owns.

### Internal
- `src/extract.ts` — pure, unit-tested identity extraction (fs/exec isolated at the edge).
- `status.ts` refactored so the human view and `--ci` gate share one `gatherStatus()` analysis path; `ciExitDecision()` is pure and unit-tested.
- `scripts/gen-playground.mjs` regenerates the bundled playground content from `example/`.

## [3.4.0]  -  2026-06-09

### Fixed

**Claude Code skills are now actually discovered** (important — upgrade recommended)
- Skills were written as flat `.md` files directly in `.claude/skills/`, a layout Claude Code does not discover. All six skills (`/team-foundry-intro`, `/team-foundry-status`, `/team-foundry-review`, `/team-foundry-capture`, `/team-foundry-decision`, `/team-foundry-feature`) were silently non-functional in every install to date.
- Skills are now written as `.claude/skills/<name>/SKILL.md` with `name:` frontmatter, per the skills spec.
- **Existing installs:** run `npx create-team-foundry migrate` — it moves the old flat files into the new layout automatically (idempotent, never overwrites your edits, leaves your own custom skills alone).

**`status` staleness signal works on squash-merge repos**
- Activity since a file's last update was counted with `git log --merges`, which is always 0 on squash-merge workflows (the GitHub default for many teams). It now counts all commits; the output column is "Commits" instead of "PRs".

**`status` no longer trusts stale frontmatter alone**
- A file's effective last-updated date is now the more recent of its `last_updated` frontmatter and its last git commit date, so files people actually edit aren't flagged stale just because nobody bumped the frontmatter — and forgotten frontmatter can't hide real staleness.

**CLI safety fixes**
- Pressing Ctrl-C on the "Continue anyway?" prompt no longer proceeds as if you answered yes.
- Stack auto-extraction now prefers the target directory's `package.json` over the invocation directory's when they differ.

### Internal
- New `src/manifest.ts` is the single source of truth for every generated file; `scaffold` and `status` both derive from it, with drift-guard tests.

## [3.3.0]  -  2026-05-25

### What's new in v3.3 (Pointer Architecture)
- `AGENTS.md` is now the primary shared context file; `CLAUDE.md`, `GEMINI.md`, and `.cursor/rules/team-foundry.mdc` become thin pointer files that reference it.
- `npx create-team-foundry migrate --to v3.3` upgrades existing installs (originals backed up to `.team-foundry/backups/`).
- `status` checks pointer files for drift (missing `AGENTS.md` reference).
- See the README and `docs/migrate.md` for full release notes.

## [3.2.0]  -  2026-05-20

### What's new in v3.2 (UX & DX Focus)

**Zero-Config Auto-Extraction**
- The CLI dynamically scans your root `package.json` to auto-detect your project's technology stack (Runtime, Frameworks like Next.js/React/Express, Tooling like Vitest/Jest/ESLint/Prettier/Vite).
- Pre-populates the generated `engineering/stack.md` with detected tech metadata, eliminating empty templates and boilerplates.
- Automatically populates the project name under the `## Who we are` section across root instructions (`CLAUDE.md`, `GEMINI.md`, and `.cursor/rules/team-foundry.mdc`).
- Extraction gracefully attempts `process.cwd()` (invocation path) and falls back to `targetDir` (destination path) to ensure flawless subdirectory scaffolding.

**Progressive Ingestion Flow**
- Replaced the overwhelming 8-option ingestion menu with a clean, progressive 3-option select:
  1. **Standard Scan** (Reads README, package.json, and Git history)
  2. **Supplement with external docs** (triggers a sub-menu to choose: Local Folder, Paste Content, or MCP Source)
  3. **Start fresh** (Blank templates)
- Reduces initial choice paralysis and onboarding friction significantly, while maintaining full backward-compatibility under the hood.

**Beautiful Outro with GitHub Star CTA**
- Added an aesthetically designed console box inside the onboarding `outro` flow to encourage community engagement and GitHub stars.

## [3.0.0]  -  2026-04-30

### What's new in v3

**Sourced facts**
Five data-heavy files (`outcomes.md`, `customers.md`, `assumptions.md`, `now-next-later.md`, `metrics.md`) now include `source:` and `last_validated:` frontmatter fields. The AI knows when to trust a number and when to ask where it came from. Coach Behavior 18 flags unsourced quantitative claims; Behavior 19 flags validated entries with no evidence.

**Validated vs hypothesized sections**
Outcomes, customers, and roadmap items are explicitly split into what's backed by evidence and what's a bet. Hypothesis sections carry a signal to the AI that these items are unconfirmed. Coach Behavior 19 fires when a hypothesis gets treated as a fact.

**Instruction architecture**
Full profile adds three new files: `hierarchy.md` (which source wins when context conflicts), `instructions/hooks.md` (enforced pre-action behaviors), and `instructions/rules.md` (always-loaded coaching rules). The root instruction file stays minimal; depth loads on demand.

**Pre-built Claude Code skills**
Six slash commands ship with every Claude Code setup (tool: claude or both):
- `/team-foundry-intro`  -  orient to the team, produce a session summary
- `/team-foundry-status`  -  what's on track, at risk, or blocked this cycle
- `/team-foundry-review`  -  full audit, findings by severity
- `/team-foundry-capture`  -  capture session learnings into the right files
- `/team-foundry-decision`  -  draft an ADR from the current conversation
- `/team-foundry-feature`  -  synthesize everything known about a specific feature

Skills are pointers, not copies  -  they read your team-foundry files and act on them. The knowledge lives in your files.

**Knowledge capture flywheel (full profile only)**
Coach Behavior 20 (full profile only): at the end of a session where something was learned or decided, the coach offers to run `/team-foundry-capture`. Coach Behavior 17 now includes a routing table distinguishing team process patterns (→ `team-lessons.md`) from validated data, decisions, and risks (→ `/team-foundry-capture` or `/team-foundry-decision`).

**Migration command**
`npx create-team-foundry migrate --to v3` upgrades existing v2 repos: adds the three new v3 files and appends `source:` / `last_validated:` frontmatter to the five data-heavy files. Additive only  -  existing content is never overwritten.

### Breaking changes

None. v2 scaffolds are fully compatible with v3. Run `npx create-team-foundry migrate --to v3` to add v3 features to an existing repo.

---

## [2.0.0]  -  2026-04-25

### What's new in v2

**Cursor support**
`npx create-team-foundry` now supports Cursor as a tool option. Generates `.cursor/rules/team-foundry.mdc` with `alwaysApply: true`  -  works alongside Claude Code and Gemini CLI, or on its own.

**Federated CLAUDE.md layout**
Full-profile teams can opt into federated mode: each major folder (`product/`, `team/`, `engineering/`, `design/`, `data/`, `context/`) gets its own `CLAUDE.md` routing file. Designed for teams using multiple Claude Code instances or per-folder context loading.

**Status command**
`npx create-team-foundry status`  -  shows a health table across all team-foundry files: last updated, days since update, PRs shipped since update, owner, and health classification (ok / stale / empty / missing). Stale files include a "why this nudge" explanation with specific evidence.

**Owner metadata**
All content templates now include an `owner:` field in YAML frontmatter. Set it to the person responsible for keeping that file current. The status command surfaces files with no owner set.

**Reality observation layer**
The coach now reads recent git activity at the start of every explicit/scheduled review session. Drift findings cite specific commit messages and day counts  -  not vague "this looks stale" observations.

**Feature queries**
The coach handles "tell me about feature X" queries by reading the relevant files across the repo (outcomes, customers, now-next-later, assumptions, decisions) and synthesizing a single response. Profile-aware: solo and full profiles get appropriately scoped answers.

**Worked example**
`example/` contains a fully populated team-foundry for Clearline, a fictional B2B SaaS team. 8-person team, realistic content across 22 team-foundry files including 5 individual ADRs. Reference it when setting up your own.

**Gemini CLI support**
`GEMINI.md` generation added alongside `CLAUDE.md`. Use `tool: both` to generate both files simultaneously.

### Breaking changes

None. v1 scaffolds are fully compatible with v2. Run `npx create-team-foundry status` on an existing v1 repo to see what's missing.

---

## [1.0.0]  -  2025-12-01

Initial release. Solo and full profiles. Claude Code support. Coach playbook with 17 drift-detection behaviors. Onboarding interview (18–25 questions) to populate files from scratch or from existing docs.
