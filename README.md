# team-foundry

**Make your AI's judgment calls match your product reality.**

Not just the facts — the context that tells your AI which facts matter, which claims are validated, and which sources to trust when signals conflict.

```bash
npx create-team-foundry
```

**Run in your shared repo. Then say: `"Let's set up our team-foundry."`**
If your repo already has a README and commit history, setup takes about 1 minute — the AI reads your repo and pre-fills the answers. Starting fresh takes 15–25 minutes. Either way, your AI starts using the context immediately.

→ **[See what it looks like when populated](example/)** — a fully filled-in team-foundry for Clearline, a fictional 8-person B2B SaaS team. Open `example/` in Claude Code or Cursor and ask anything.

**[team-foundry.com](https://team-foundry.com)** · We're early — [a star helps other teams find this](https://github.com/tomershahar/team-foundry).

---

## The problem

**Before team-foundry:**
> You ask the AI to help prioritize a sprint. It gives solid generic advice — but doesn't know your north star metric, hasn't seen your open assumptions, and has no idea that your top customer churned last month.

**After team-foundry:**
> The AI references your outcomes, flags an assumption that's been untested for 45 days, and notes that two roadmap items haven't been updated since 8 PRs shipped. It offers to draft the fixes. You confirm.

That context used to live in someone's head, a Notion page nobody reads, or a wiki 6 months stale. team-foundry puts it in your shared repo — where every AI tool reads it every session.

---

## Set up once. Everyone gets the same context.

**No cloud. No sync service. No extra accounts.** team-foundry uses your existing repo as the shared space.

**One person sets it up**
Run `npx create-team-foundry` in your shared repo. The CLI scaffolds a `team-foundry/` folder, generates the right tool file (`CLAUDE.md`, `GEMINI.md`, or `.cursor/rules/`), and commits everything to git.

**Everyone else pulls**
Teammates `git pull`. They now have the same team-foundry files locally. Their Claude Code, Cursor, or Gemini CLI reads from the same files yours does. No installs, no logins, no setup.

**Updates flow through git**
When someone updates a file — or the coach drafts an update they confirm — it's a normal git commit. Push, pull, review in PRs. Everyone stays in sync the same way they already sync code.

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

*Your repo is the shared space. Git is the sync. team-foundry adds the structure and the coach.*

---

## How it fits together

| Layer | What it is | team-foundry component |
|---|---|---|
| **Context** | What your team knows | `team-foundry/` files — outcomes, customers, decisions, metrics, … |
| **Behavior** | How the AI acts on it | `CLAUDE.md` / `GEMINI.md` / `.cursor/rules/` + `hierarchy.md` + `instructions/` |
| **Actions** | What you can trigger | Coach commands, `status`, `migrate` |
| **Connections** | Where it runs | Git, Claude Code, Cursor, Gemini CLI, Codex / generic agents |

---

## What gets created

**Solo profile (1–3 people):** 8 files, ~1 minute with repo scan / ~15 minutes fresh.
**Full profile (4–15 people):** 24 files, ~1 minute with repo scan / ~25 minutes fresh.

| Profile | Files | Includes |
|---|---|---|
| Solo | 8 | Root instruction file, AGENTS.md, getting started guide, coach playbook, north star, outcomes, customers, stack |
| Full | 24 | Everything above + strategy, roadmap, assumptions, risks, trio, working agreement, AI practices, quality bar, decisions log, design principles, metrics, glossary, stakeholders, hierarchy, hooks, rules |
| Full (federated) | 30 | Everything above + per-folder routing files for multi-instance setups |

Every file has YAML frontmatter (`purpose`, `read_when`, `last_updated`, `owner`) so the AI knows when to load it and why. Data-heavy files (outcomes, customers, metrics, assumptions, roadmap) also include `source:` and `last_validated:` so the AI knows whether to trust the data.

## Supported tools

| Tool | File generated |
|---|---|
| Claude Code | `CLAUDE.md` |
| Gemini CLI | `GEMINI.md` |
| Cursor | `.cursor/rules/team-foundry.mdc` |
| OpenAI Codex / generic agents | `AGENTS.md` |
| Both (Claude + Gemini) | `CLAUDE.md` + `GEMINI.md` |

## The coach

After setup, the coach watches your files for drift while you work. It runs in three modes:

- **Inline** — silent by default. Surfaces one sentence when a gap is directly relevant to what you're working on. Never interrupts.
- **Explicit** — `"let's do a team-foundry review"`. Full audit, all files, findings by severity.
- **Scheduled** — weekly check-in, top 3 findings, offers to draft fixes.

**The coach never writes without your confirmation.**

### What it catches

| Pattern | Example |
|---|---|
| **Output-as-outcome drift** | `outcomes.md` says "ship the dashboard" instead of "reduce time-to-insight for SMB analysts" |
| **Assumption fossilization** | Core assumption logged 94 days ago, never retested, still driving three roadmap items |
| **Customer ghost syndrome** | Enterprise persona last interviewed in February. Three Q2 features built "for enterprise." |
| **Decision amnesia** | Q1 ADR rejects microservices. Q3 discussion reopens it with no reference to what changed. |
| **Reality drift** | 8 PRs shipped since `outcomes.md` was last updated. Coach cites the commit messages. |
| **Build-trap signal** | "Add collaborative editing" moves to Now with no linked assumption and no validation. |
| **Unsourced claim** | A number or percentage in a data file has no `source:` value or inline attribution. |
| **Confidence collapse** | A hypothesis in `## Hypothesized` is referenced as fact in strategy or roadmap decisions. |

Every finding cites the specific file, the specific content, and the evidence. Not "this looks stale."

### Triggering the coach

| What to say | What happens |
|---|---|
| `"let's do a team-foundry review"` | Full audit — all files, findings by severity |
| `"review our outcomes"` | Targeted review of one file |
| `"tell me about feature X"` | Synthesizes status, rationale, customer evidence, open bets |
| `"run the weekly review"` | Top 3 issues, draft fixes offered |

## Status command

```bash
npx create-team-foundry status
```

Health table across all your files: last updated, days since update, PRs shipped since then, owner, health classification (ok / stale / empty / missing). Link integrity checks flag outcomes with no linked assumption, Now items with no validated bet, and metrics referenced but not defined.

## Migrate from v2

If you already have a v2 team-foundry, upgrade to v3 with:

```bash
npx create-team-foundry migrate --to v3
```

This adds the three new v3 files (`hierarchy.md`, `instructions/hooks.md`, `instructions/rules.md`) and appends `source:` / `last_validated:` to the frontmatter of your five data-heavy files. **Existing files are never overwritten.** Your content is preserved exactly — the migration is additive only.

Existing v2 repos continue to work without migrating. v3 is the new default for new repos.

---

```bash
npx create-team-foundry
```

**Run in your shared repo. Then say: `"Let's set up our team-foundry."`**

---

## Getting buy-in

| Objection | Response |
|---|---|
| "I don't have time to learn a new tool" | There's nothing to learn. Run one command. The files appear. Your AI tool reads them automatically — no new workflow, no new app. |
| "We already document things" | Documentation lives in Notion or Confluence and your AI tool has never seen it. team-foundry puts it in your repo, in plain markdown, where every AI tool reads it every session. |
| "I'm not technical enough" | The CLI asks plain-English questions. The files it creates are markdown. The coach speaks in sentences. No code required. |
| "AI output isn't good enough yet" | That's exactly what context fixes. team-foundry gives the AI your product reality so its answers are specific to your team, not generic. |

---

## What's new in v3

- **Sourced facts** — every claim in a data-heavy file has a `source:` and `last_validated:` field. The AI knows when to trust a number and when to ask where it came from.
- **Validated vs hypothesized** — outcomes, customers, and roadmap items are explicitly split into what's backed by evidence and what's a bet. The coach flags when a hypothesis gets treated as a fact.
- **Instruction architecture** — full profile gets `hierarchy.md` (which source wins when context conflicts), `instructions/hooks.md` (enforced pre-action behaviors), and `instructions/rules.md` (always-loaded coaching rules). The root file stays minimal; depth loads on demand.
- **Pre-built skills** (Claude Code) — six slash commands that run directly in your Claude Code session: orient to context, check status, audit files, capture learnings, draft decisions, and synthesize a feature brief. Your knowledge stays in your files — skills are just pointers, not copies.

## Advanced: Skills (Claude Code)

Six slash commands ship with every Claude Code setup. They read your team-foundry files and act on them — no extra configuration needed.

| Skill | What it does |
|---|---|
| `/team-foundry-intro` | Orient to the team — reads all context files, produces a summary |
| `/team-foundry-status` | Status read — what's on track, at risk, or blocked this cycle |
| `/team-foundry-review` | Full audit — all files checked, findings by severity |
| `/team-foundry-capture` | Capture what was learned in this session into the right file |
| `/team-foundry-decision` | Draft an ADR from the current conversation |
| `/team-foundry-feature` | Synthesize everything team-foundry knows about a specific feature |

**Pointers, not copies.** Skills don't duplicate your team context — they point Claude Code at the right team-foundry files and tell it what to do with them. The knowledge lives in your files. The skills just know how to read it.

## Advanced: The flywheel

The longer you use team-foundry, the more useful it gets:

1. **Set up** — scaffold files, run the interview, fill in what you know
2. **Work** — AI reads context, gives better answers, flags gaps inline
3. **Learn** — when something was decided or validated, the coach offers to capture it (`/team-foundry-capture`)
4. **Update** — confirm the draft, it commits to git, everyone pulls
5. **Review** — next session, AI reads the updated files → answers get better

Each cycle tightens the loop. The coach makes step 3→4 nearly automatic.

---

## What's next

**v3.x (planned)**
- `--json` output for `status` — pipe findings into CI or dashboards
- `--strict` mode — fail CI when critical drift is detected
- `--with-hooks` flag — generate real Claude Code hook scripts wired to `.claude/settings.json`
- MCP server — expose team-foundry context as a tool for agents that don't read files natively

**Exploring**
- Cross-repo federation — one team-foundry for a platform team read by multiple product repos
- Status webhooks — post weekly drift report to Slack without leaving the terminal
- Team onboarding flow — guided interview for new team members joining an existing team-foundry

Have a use case or feature idea? [Open an issue](https://github.com/tomershahar/team-foundry/issues).

---

## Requirements

- Node 18+
- Claude Code, Gemini CLI, Cursor, or any AI tool that reads files from your repo

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT
