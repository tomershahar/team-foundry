# team-foundry

**Make your AI coding outputs align with your product reality.**

Your AI tool gives better answers when it knows what the product is for, who the customers are, and what quality means. team-foundry puts that context in your shared repo — where every tool, every team member reads the same thing, automatically.

```bash
npx create-team-foundry
```

**Run in your shared repo. Then say: `"Let's set up our team-foundry."`**
Setup takes 15–25 minutes. Your AI starts using the context immediately.

→ **[See what it looks like when populated](example/)** — a fully filled-in team-foundry for Clearline, a fictional 8-person B2B SaaS team. Open `example/` in Claude Code or Cursor and ask anything.

---

## The problem

**Before team-foundry:**
> You ask the AI to help prioritize a sprint. It gives solid generic advice — but doesn't know your north star metric, hasn't seen your open assumptions, and has no idea that your top customer churned last month.

**After team-foundry:**
> The AI references your outcomes, flags an assumption that's been untested for 45 days, and notes that two roadmap items haven't been updated since 8 PRs shipped. It offers to draft the fixes. You confirm.

That context used to live in someone's head, a Notion page nobody reads, or a wiki 6 months stale. team-foundry puts it in your shared repo — where every AI tool reads it every session.

---

```bash
npx create-team-foundry
```

**Try it in 2 minutes.** Answer a few questions. Files appear. Open your AI tool. Done.

---

## What gets created

**Solo profile (1–3 people):** 7 files, ~15 minutes.
**Full profile (4–15 people):** 20 files, ~25 minutes.

| Profile | Files | Includes |
|---|---|---|
| Solo | 7 | Root instruction file, coach playbook, north star, outcomes, customers, stack |
| Full | 20 | Everything above + strategy, roadmap, assumptions, risks, trio, working agreement, AI practices, quality bar, decisions log, design principles, metrics, glossary, stakeholders |
| Full (federated) | 26 | Everything above + per-folder routing files for multi-instance setups |

Every file has YAML frontmatter (`purpose`, `read_when`, `last_updated`, `owner`) so the AI knows when to load it and why.

## Supported tools

| Tool | File generated |
|---|---|
| Claude Code | `CLAUDE.md` |
| Gemini CLI | `GEMINI.md` |
| Cursor | `.cursor/rules/team-foundry.mdc` |
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

Health table across all your files: last updated, days since update, PRs shipped since then, owner, health classification (ok / stale / empty / missing).

---

```bash
npx create-team-foundry
```

**Run in your shared repo. 15 minutes. Then ask: `"Let's set up our team-foundry."`**

---

## Requirements

- Node 18+
- Claude Code, Gemini CLI, Cursor, or any AI tool that reads files from your repo

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT
