# team-foundry

**A Context Engine for product teams.**

team-foundry puts your product context — outcomes, customers, decisions, quality bar — into files your AI coding tools read natively. Every tool. Every team member. The same context, automatically.

```
npx create-team-foundry
```

→ **[See what it looks like when populated](example/)** — a fully filled-in team-foundry for Clearline, a fictional 8-person B2B SaaS team. Clone this repo, open `example/` in Claude Code or Cursor, and ask the AI anything about the team.

---

## The problem

Your AI coding tool gives better answers when it knows what the product is for, who the customers are, and what quality means to your team.

That context lives in someone's head, a Notion page nobody reads, or a wiki that's 6 months stale. It never makes it into the session where the AI is actually making decisions with you.

team-foundry puts it in your shared repo — where everyone commits, and every AI tool reads it automatically.

## What it does

Run `npx create-team-foundry` in your shared product/engineering repo. Answer a set of questions. Files appear. Done.

**Solo profile (1–3 people):** 7 files, ~15 minutes to set up.
**Full profile (4–15 people):** 20 files, ~25 minutes to set up.

Every file has YAML frontmatter (`purpose`, `read_when`, `last_updated`, `owner`) so the AI knows when to load it and why.

After setup, open your AI tool and say: `"Let's set up our team-foundry."` The coach runs an onboarding interview, populates your files from your answers, and starts watching for drift.

## What gets created

| Profile | Files | Includes |
|---|---|---|
| Solo | 7 | Root instruction file, coach playbook, north star, outcomes, customers, stack |
| Full | 20 | Everything above + strategy, roadmap, assumptions, risks, trio, working agreement, AI practices, quality bar, decisions log, design principles, metrics, glossary, stakeholders |
| Full (federated) | 26 | Everything above + per-folder CLAUDE.md routing files for multi-instance setups |

## The coach

The coach lives in `.team-foundry/coach.md`. It runs in three modes:

- **Inline** — silent by default. If the AI notices a gap in a team-foundry file while answering a normal question, it surfaces it in one sentence and moves on. Never interrupts a coding session.
- **Explicit** — triggered by `"let's do a team-foundry review"`. Full audit, all files, findings grouped by severity.
- **Scheduled** — weekly check-in, surfaces the top 3 findings, offers to draft fixes.

The coach never writes without your confirmation.

### What the coach catches

| Pattern | Example |
|---|---|
| **Output-as-outcome drift** | `outcomes.md` says "ship the new dashboard" instead of "reduce time-to-insight for SMB analysts" |
| **Assumption fossilization** | Core assumption logged 94 days ago, never retested, still driving three roadmap items |
| **Customer ghost syndrome** | Enterprise persona last interviewed in February. Three Q2 features built "for enterprise." |
| **Decision amnesia** | Q1 ADR rejects microservices. Q3 discussion reopens it with no reference to what changed. |
| **Build-trap signal** | "Add collaborative editing" moves to Now with no linked experiment and no validated assumption |
| **Reality drift** | 8 PRs shipped since `outcomes.md` was last updated. Files don't reflect what actually happened. |

Every finding cites the specific file, the specific content, and the evidence — not a vague "this looks stale."

### Triggering the coach

| What to say | What happens |
|---|---|
| `"let's do a team-foundry review"` | Full audit — all files checked, findings listed by severity |
| `"coach mode"` | Same as above |
| `"review our outcomes"` | Targeted review of one file |
| `"tell me about feature X"` | Coach reads 5 files and synthesizes status, rationale, customer evidence, open bets |
| `"run the weekly team-foundry review"` | Weekly check-in, top 3 issues |

### Turning off inline nudges

Add to your `CLAUDE.md` or `GEMINI.md`:

```
## team-foundry coach
inline-nudges: off
```

## Status command

```
npx create-team-foundry status
```

Shows a health table across all your team-foundry files: last updated, days since update, PRs shipped since then, owner, and health classification (ok / stale / empty / missing).

## Supported tools

| Tool | File generated |
|---|---|
| Claude Code | `CLAUDE.md` |
| Gemini CLI | `GEMINI.md` |
| Cursor | `.cursor/rules/team-foundry.mdc` |
| Both (Claude + Gemini) | `CLAUDE.md` + `GEMINI.md` |

## The honest note

team-foundry enables the work of building shared product understanding. It doesn't replace it. If your team isn't willing to have the hard conversations about outcomes, customers, and quality — no tool fixes that. What team-foundry does is make those conversations easier to start, and easier to keep current.

## Shared floor, individual ceiling

team-foundry sets a baseline every team member's AI tool reads from. It does not cap what individuals do above that baseline. A senior PM can add their own prompts. An engineer can bring their own practices. A designer can layer on top.

The floor is shared. The ceiling is individual.

## Strategy in Git

- `.gitignore` excludes `team-foundry/private/` by default — sensitive material goes there
- During setup you choose repo visibility (public / internal / private) and the coach adjusts accordingly
- Nothing in the generated files requires sensitive data — personas use first names, metrics use your definitions, decisions record rationale not revenue

## Requirements

- Node 18+
- Claude Code, Gemini CLI, Cursor, or any AI tool that reads files from your repo as context

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT
