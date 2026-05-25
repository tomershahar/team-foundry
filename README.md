# team-foundry

**Your AI gives generic advice because it doesn't know your team. team-foundry fixes that.**

[![npm](https://img.shields.io/npm/v/create-team-foundry)](https://www.npmjs.com/package/create-team-foundry) [![npm downloads](https://img.shields.io/npm/dw/create-team-foundry)](https://www.npmjs.com/package/create-team-foundry) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

```bash
npx create-team-foundry
```

30-second proof: browse [`example/`](example/) - a fully populated team-foundry for Clearline, a fictional 8-person B2B SaaS team. Open it in Claude Code or Cursor and ask a question. See below for what to try.

---

## Before and after

**Before team-foundry:**
> You ask the AI to help prioritize a sprint. It gives solid generic advice - but doesn't know your north star metric, hasn't seen your open assumptions, and has no idea that your top customer churned last month.

**After team-foundry:**
> The AI references your outcomes, flags an assumption that's been untested for 45 days, and notes that two roadmap items haven't been updated since 8 PRs shipped. It offers to draft the fixes. You confirm.

That context used to live in someone's head, a Notion page nobody reads, or a wiki 6 months stale. team-foundry puts it in your shared repo, where every AI tool reads it every session.

---

## See it work

The [`example/`](example/) folder is a complete team-foundry for Clearline, a fictional invoice-processing startup. Every file is populated with realistic content - real-feeling outcomes, customer quotes, ADRs, quality stances. Not placeholders.

Open `example/` in Claude Code or Cursor, then try these prompts:

- `"What are we working toward this quarter?"` - the AI reads `outcomes.md` and summarizes the quarter's goals with customer context.
- `"Should we prioritize collaborative editing?"` - the AI checks `assumptions.md`, finds no validated bet, and flags the build trap.
- `"What architecture decisions have we made and why?"` - the AI walks the `decisions/` folder and synthesizes the reasoning.

The difference from a repo without team-foundry: the AI doesn't guess. It cites specific files, specific evidence, specific staleness.

Want to clone and explore locally:

```bash
git clone https://github.com/tomershahar/team-foundry-example
```

Then open the folder in Claude Code and ask anything.

---

## What the coach catches

The coach watches your files for drift while you work. It never writes without your confirmation. Every finding cites the specific file, the specific content, and the evidence. Not "this looks stale."

| Pattern | Example |
|---|---|
| **Assumption fossilization** | Core assumption logged 94 days ago, never retested, still driving three roadmap items |
| **Output-as-outcome drift** | `outcomes.md` says "ship the dashboard" instead of "reduce time-to-insight for SMB analysts" |
| **Customer ghost syndrome** | Enterprise persona last interviewed in February. Three Q2 features built "for enterprise." |
| **Reality drift** | 8 PRs shipped since `outcomes.md` was last updated. Coach cites the commit messages. |
| **Build-trap signal** | "Add collaborative editing" moves to Now with no linked assumption and no validation. |

<details>
<summary>How to trigger the coach</summary>

| What to say | What happens |
|---|---|
| `"let's do a team-foundry review"` | Full audit - all files, findings by severity |
| `"review our outcomes"` | Targeted review of one file |
| `"tell me about feature X"` | Synthesizes status, rationale, customer evidence, open bets |
| `"run the weekly review"` | Top 3 issues, draft fixes offered |

The coach runs in three modes. **Inline** is silent by default, surfaces one sentence when a gap is directly relevant to what you're working on. **Explicit** runs on demand for a full audit. **Scheduled** does a weekly check-in with the top 3 findings.

</details>

---

## How it works

**No cloud. No sync service. No extra accounts.**

One person runs `npx create-team-foundry` in the shared repo. The CLI scaffolds a `team-foundry/` folder and generates the right tool file (`CLAUDE.md`, `GEMINI.md`, or `.cursor/rules/`). Commit and push.

Teammates `git pull`. Their AI tool reads from the same files. No installs, no logins, no setup.

Updates flow through git. When the coach drafts a fix and you confirm it, it commits normally. Push, pull, review in PRs.

```
                ┌────────────────────────┐
                │   Your shared repo     │
                │   (GitHub / GitLab)    │
                │                        │
                │   team-foundry/        │
                │     ├─ outcomes.md     │
                │     ├─ customers.md    │
                │     ├─ decisions/      │
                │     └─ ...             │
                └───────────┬────────────┘
                            │
              git pull / push (no other sync)
                            │
          ┌─────────────────┼─────────────────┐
          ▼                 ▼                 ▼
    ┌──────────┐      ┌──────────┐      ┌──────────┐
    │   PM     │      │ Engineer │      │ Designer │
    │ Claude   │      │ Cursor   │      │ Gemini   │
    │ Code     │      │          │      │ CLI      │
    └──────────┘      └──────────┘      └──────────┘
```

Your repo is the shared space. Git is the sync. team-foundry adds the structure and the coach.

---

## What you get

**Start with solo: 8 files, ~1 minute setup if your repo already has a README and commit history** (the CLI reads your repo and pre-fills the answers). That's enough to make your AI meaningfully better immediately.

When the team grows or the context gets more complex, you can grow into the full profile. The files are additive - nothing from solo is replaced.

| Profile | Files | Includes |
|---|---|---|
| **Solo** (default) | 8 | Root instruction file, AGENTS.md, getting started guide, coach playbook, north star, outcomes, customers, stack |
| Full | 24 | Everything above + strategy, roadmap, assumptions, risks, trio, working agreement, AI practices, quality bar, decisions log, design principles, metrics, glossary, stakeholders, hierarchy, hooks, rules |
| Full (federated) | 30 | Everything above + per-folder routing files for multi-instance setups |

Every file has YAML frontmatter (`purpose`, `read_when`, `last_updated`, `owner`) so the AI knows when to load it and why. Data-heavy files also include `source:` and `last_validated:` so the AI knows whether to trust a number.

---

## Supported tools

All scaffolds generate `AGENTS.md` as the shared foundation. Tool-specific files are thin pointers that load it.

| Tool | Files generated |
|---|---|
| Claude Code | `CLAUDE.md` (pointer) + `AGENTS.md` |
| Gemini CLI | `GEMINI.md` (pointer) + `AGENTS.md` |
| Cursor | `.cursor/rules/team-foundry.mdc` (pointer) + `AGENTS.md` |
| Both (Claude + Gemini) | `CLAUDE.md` + `GEMINI.md` (pointers) + `AGENTS.md` |
| All tools (Recommended) | `CLAUDE.md` + `GEMINI.md` + `.cursor/rules/team-foundry.mdc` (pointers) + `AGENTS.md` |

---

<details>
<summary>Status command</summary>

```bash
npx create-team-foundry status
```

Health table across all your files: last updated, days since update, PRs shipped since then, owner, health classification (ok / stale / empty / missing). Link integrity checks flag outcomes with no linked assumption, Now items with no validated bet, and metrics referenced but not defined.

</details>

<details>
<summary>Advanced: Claude Code Skills</summary>

These slash commands are Claude Code–only. For equivalent workflows in Cursor and Codex, see [`skill-parity.md`](skill-parity.md).

Six slash commands ship with every Claude Code setup. They read your team-foundry files and act on them - no extra configuration needed.

| Skill | What it does |
|---|---|
| `/team-foundry-intro` | Orient to the team - reads all context files, produces a summary |
| `/team-foundry-status` | Status read - what's on track, at risk, or blocked this cycle |
| `/team-foundry-review` | Full audit - all files checked, findings by severity |
| `/team-foundry-capture` | Capture what was learned in this session into the right file |
| `/team-foundry-decision` | Draft an ADR from the current conversation |
| `/team-foundry-feature` | Synthesize everything team-foundry knows about a specific feature |

Skills don't duplicate your team context. They point Claude Code at the right files and tell it what to do with them. The knowledge lives in your files.

</details>

<details>
<summary>Advanced: The flywheel</summary>

1. **Set up** - scaffold files, run the interview, fill in what you know
2. **Work** - AI reads context, gives better answers, flags gaps inline
3. **Learn** - when something was decided or validated, the coach offers to capture it (`/team-foundry-capture`)
4. **Update** - confirm the draft, it commits to git, everyone pulls
5. **Review** - next session, AI reads the updated files, answers get better

Each cycle tightens the loop. The coach makes step 3 to 4 nearly automatic.

</details>

<details>
<summary>What's new in v3.2 & v3</summary>

### v3.2 (UX & DX Onboarding Focus)
- **Zero-Config Auto-Extraction**: The CLI dynamically scans your `package.json` to auto-detect your project's technology stack (Runtime, Frameworks like Next.js/React/Express, Tooling like Vitest/Jest/ESLint/Prettier/Vite) and auto-populates `engineering/stack.md` and root instructions with no extra effort.
- **Progressive Ingestion Flow**: Overwhelming 8-option prompt is compressed into a clean, progressive menu: Standard Scan, Supplement with external docs, or Start fresh. Less cognitive load, faster setups.
- **Visual Gratification & CTA**: Stunning final console outro with clear project location summary and GitHub Star box.

### v3.0 (Context Integrity & Pre-built Skills)
- **Sourced facts** - every claim in a data-heavy file has a `source:` and `last_validated:` field. The AI knows when to trust a number and when to ask where it came from.
- **Validated vs hypothesized** - outcomes, customers, and roadmap items are split into what's backed by evidence and what's a bet. The coach flags when a hypothesis gets treated as a fact.
- **Instruction architecture** - full profile gets `hierarchy.md` (which source wins when context conflicts), `instructions/hooks.md` (enforced pre-action behaviors), and `instructions/rules.md` (always-loaded coaching rules). The root file stays minimal; depth loads on demand.
- **Pre-built skills** (Claude Code) - six slash commands that run directly in your Claude Code session.

</details>

<details>
<summary>Migrate from v2</summary>

```bash
npx create-team-foundry migrate --to v3
```

Adds the three new v3 files (`hierarchy.md`, `instructions/hooks.md`, `instructions/rules.md`) and appends `source:` / `last_validated:` to the frontmatter of your five data-heavy files. **Existing files are never overwritten.** Your content is preserved exactly - the migration is additive only.

Existing v2 repos continue to work without migrating. v3 is the new default for new repos.

</details>

<details>
<summary>Getting buy-in</summary>

| Objection | Response |
|---|---|
| "I don't have time to learn a new tool" | There's nothing to learn. Run one command. The files appear. Your AI tool reads them automatically - no new workflow, no new app. |
| "We already document things" | Documentation lives in Notion or Confluence and your AI tool has never seen it. team-foundry puts it in your repo, in plain markdown, where every AI tool reads it every session. |
| "I'm not technical enough" | The CLI asks plain-English questions. The files it creates are markdown. The coach speaks in sentences. No code required. |
| "AI output isn't good enough yet" | That's exactly what context fixes. team-foundry gives the AI your product reality so its answers are specific to your team, not generic. |

</details>

---

## Requirements

- Node 18+
- Claude Code, Gemini CLI, Cursor, or any AI tool that reads files from your repo

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT
