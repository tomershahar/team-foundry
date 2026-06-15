# team-foundry

**Great products come from teams that share context. When the PM's AI, the engineer's AI, and the designer's AI all know different things, the work fragments and customers feel it. team-foundry puts your team's context in one place every AI reads.**

[![npm](https://img.shields.io/npm/v/create-team-foundry)](https://www.npmjs.com/package/create-team-foundry)
[![npm downloads](https://img.shields.io/npm/dw/create-team-foundry)](https://www.npmjs.com/package/create-team-foundry)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

```bash
npx create-team-foundry
```

![Three teammates — PM on Claude Code, Engineer on Cursor, Designer on Gemini CLI — all connected to a shared AGENTS.md](assets/hero.svg)

---

## Try it in 60 seconds

```bash
npx create-team-foundry playground
```

This drops a fully-populated example team (Clearline, a fictional 8-person B2B SaaS company) into `team-foundry-playground/`. Open it in Claude Code, Cursor, or Gemini CLI and ask:

- *"What are we working toward this quarter?"*
- *"Should we prioritize collaborative editing?"*
- *"What architecture decisions have we made and why?"*

The AI answers with the team's actual context. No guessing. The same content lives in [`example/`](example/) if you'd rather browse it.

---

## What gets generated

A real, populated `AGENTS.md` looks like this — the single file every AI tool reads:

```markdown
# Agents

## Project overview

**clearline** — Finance teams at mid-market companies close their month-end
without chasing anyone.

## Where to find context

| Topic | Path |
|---|---|
| Vision and north star metric | team-foundry/product/north-star.md |
| This quarter's outcomes      | team-foundry/product/outcomes.md  |
| Who our customers are        | team-foundry/product/customers.md |
| Tech stack and conventions   | team-foundry/engineering/stack.md |
| Architecture decisions       | team-foundry/engineering/decisions/ |
```

…and an outcome it routes to reads like a PM wrote it, not a template:

```markdown
### O1 — AP leads process month-end in under 2 days
Baseline: 4.1 days average (cohort data, Q1 2026). Target: ≤2 days.
Signal: time-to-close in approval routing data, tracked per cohort.
Why it matters: month-end duration is the #1 complaint in NPS verbatims.
```

### Before / after

| | What the AI sees |
|---|---|
| **Before team-foundry** | Each teammate's AI guesses from code + whatever they paste into chat |
| **Right after `npx create-team-foundry`** | `AGENTS.md` with project overview, stack, and owners **auto-detected from your `package.json`, README, and git** — the rest scaffolded as visible gaps to fill |
| **After onboarding** | Outcomes, customers, decisions, and quality bar — every AI answers the same way |

### Who edits what

- **You edit** everything under `team-foundry/` (outcomes, customers, decisions…). These are your team's words.
- **The CLI generates and owns** the pointer files (`CLAUDE.md`, `GEMINI.md`, `.cursor/rules/…`) and the `AGENTS.md` scaffold. Re-running is safe — it merges in place.
- **Keep it honest** with `npx create-team-foundry status` (and `status --ci` in CI).

---

## How it works

One person runs `npx create-team-foundry` in the shared repo. The CLI generates `AGENTS.md` (the shared context every AI tool reads) plus thin pointer files for each tool your team uses. Commit and push. Teammates `git pull`. Done.

No cloud. No sync service. No accounts. Git is the sync.

---

## Supported tools

| Tool | Files generated |
|---|---|
| Claude Code | `CLAUDE.md` (pointer) + `AGENTS.md` |
| Gemini CLI | `GEMINI.md` (pointer) + `AGENTS.md` |
| Cursor | `.cursor/rules/team-foundry.mdc` (pointer) + `AGENTS.md` |
| GitHub Copilot | `.github/copilot-instructions.md` (pointer) + `AGENTS.md` |
| Other (Codex, Copilot CLI, Windsurf…) | `AGENTS.md` only — these read it natively |
| All tools (Recommended) | All pointers + `AGENTS.md` |

---

## Commands

| Command | What it does |
|---|---|
| `npx create-team-foundry` | Scaffold context into the current repo (interactive) |
| `npx create-team-foundry adopt` | Import existing `.cursorrules`/`CLAUDE.md`/etc. before scaffolding |
| `npx create-team-foundry playground` | Drop a populated example team into `team-foundry-playground/` |
| `npx create-team-foundry status` | Health table: stale, empty, missing, link-integrity, owners |
| `npx create-team-foundry status --ci` | Same checks, non-interactive, exits 1 on drift (for CI) |
| `npx create-team-foundry init-ci` | Write a GitHub Action that runs the drift gate on every PR |
| `npx create-team-foundry migrate` | Upgrade an existing install to the latest profile |

---

## Learn more

- [How it works](docs/how-it-works.md) — architecture, AGENTS.md primacy, pointer files, detect-and-merge, drift detection
- [Drift gate in CI](docs/ci.md) — `status --ci`, the GitHub Action, and what fails a build
- [The coach](docs/coach.md) — drift detection patterns, trigger phrases, three modes, the flywheel
- [Claude Code skills](docs/skills.md) — six slash commands and their file layout
- [Profiles](docs/profiles.md) — solo, full, federated; file counts and frontmatter
- [Migrating](docs/migrate.md) — upgrade paths from v2 and v3.x to v3.3
- [Getting buy-in](docs/getting-buy-in.md) — handling team objections
- [Changelog](CHANGELOG.md)

---

## Requirements

Node 18+. Claude Code, Gemini CLI, Cursor, or any AI tool that reads files from your repo.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT
