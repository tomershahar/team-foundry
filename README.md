# team-foundry

**A Context Engine for product teams.**

team-foundry scaffolds the shared brain your AI coding tools read from — outcomes, customers, decisions, quality bar — in a repo every team member commits to. Every AI tool, every team member, the same context. Automatically.

```
npx create-team-foundry
```

Answer 4 questions. Files appear in your repo. That's it.

team-foundry is agent-agnostic by design. The context files are the product. The AI tool reading them is a replaceable component.

**Run this in your shared product/engineering repo** — the one the whole team commits to. Running it in a personal repo works for solo use but misses the point for teams.

---

## See what populated looks like

→ **[example/](example/)** — a fully populated team-foundry for Clearline, a fictional 8-person B2B SaaS team. Clone this repo, open `example/` in Claude Code, and ask the AI anything about the team. This is what your team-foundry can look like after the setup conversation.

## What it does

Most teams use AI tools for code. The AI gives better answers when it knows what the product is for, who the customers are, and what quality means to this team.

team-foundry puts that context in your shared repo — not in a wiki, not in Notion, not in someone's head. Every team member's AI tool reads the same files every session, automatically.

It also installs a coach: a set of behaviors that notice when your files go stale, when your roadmap outpaces your assumptions, or when your strategy has drifted from your execution. The coach flags gaps inline while you work. You confirm; it writes.

## What gets created

**Solo profile (1–3 people):** 7 files. Root instruction file, getting started guide, coach playbook, north star, outcomes, customers, stack.

**Full profile (4–15 people):** 20 files. Everything above plus strategy, roadmap, assumptions, risks, trio, working agreement, AI practices, quality bar, decisions log, design principles, metrics, glossary, stakeholders.

Every file has YAML frontmatter (`purpose`, `read_when`, `last_updated`) so the AI knows when to load it and why.

## The honest note

team-foundry enables the work of building a shared understanding of your product. It doesn't replace it. If your team isn't willing to have the hard conversations about outcomes, customers, and quality — no tool fixes that. What team-foundry does is make those conversations easier to start, and easier to keep current.

## Shared floor, individual ceiling

team-foundry sets a shared baseline of context that every team member's AI tool reads from. Outcomes, customers, decisions, quality bar, glossary — the things everyone should be grounded in.

It does not cap what individuals do above that baseline. A senior PM can add their own prompts, their own discovery framework, their own depth. An engineer can bring their own AI practices. A designer can layer on top.

The floor is shared. The ceiling is individual. That's the point.

## What drift looks like

The coach catches specific, named patterns. These are the most common:

| Pattern | What it is | Example |
|---|---|---|
| **Output-as-outcome drift** | An outcome that's actually a shipped feature | `outcomes.md` says "ship the new dashboard" instead of "reduce time-to-insight for SMB analysts" |
| **Assumption fossilization** | A core assumption logged long ago, never revisited, still driving decisions | `assumptions.md` lists "users want faster checkout" dated 94 days ago. Three roadmap items cite it. No one's tested it. |
| **Customer ghost syndrome** | A persona with no direct team contact in 60+ days, while roadmap items still claim to serve them | Enterprise persona last interviewed in February. Three Q2 features built "for enterprise." |
| **Metric ambiguity** | A metric cited across files without an agreed definition | "Active user" in `outcomes.md` and `metrics.md` with no shared definition. PM means weekly; engineer means daily. |
| **Decision amnesia** | A previous ADR rejecting an approach is invisible to a discussion heading the same direction | Q1 ADR rejects microservices migration. Q3 discussion reopens it with no reference to what changed. |
| **Output roadmap disguised as strategy** | `strategy.md` guiding policy is all "yes" — doesn't name what the team is deliberately not pursuing | "We will be the best tool for product teams." No "we will not build X for Y." |
| **Build-trap signal** | An item moves into "Now" with no linked experiment and no validated assumption | "Add collaborative editing" moves to Now. No assumption linked. Last validation: none. |

## Strategy in Git

Putting strategy and product context in a repo might feel wrong. A few things worth knowing:

- The `.gitignore` template excludes `team-foundry/private/` by default — put sensitive material there
- During setup you choose repo visibility (public / internal / private) and the coach adjusts its language accordingly
- Nothing in the generated files requires sensitive data — personas use first names, metrics use your definitions, decisions record rationale not revenue

If your repo is public and you're concerned, use the solo profile and keep customers.md to job roles rather than names.

## The coach

The coach lives in `.team-foundry/coach.md` and is loaded on demand to preserve token budget. It runs in three modes:

- **Inline** — silent by default. If the AI notices a clear gap in a team-foundry file while answering a normal question, it surfaces it in one sentence and moves on. It does not interrupt coding sessions.
- **Explicit** — triggered by "let's do a team-foundry review," runs a full audit across all files
- **Scheduled** — proactive weekly check-in, surfaces top 3 findings

The coach never writes without your confirmation.

### Triggering the coach

Say any of these to your AI tool:

| What to say | What happens |
|---|---|
| `"let's do a team-foundry review"` | Full audit — all files checked, findings listed |
| `"coach mode"` | Same as above |
| `"review our outcomes"` | Targeted review of one file |
| `"what's missing from team-foundry?"` | Lists gaps across all files |
| `"run the weekly team-foundry review"` | Weekly check-in, top 3 issues |

### Turning off inline nudges

If you find the inline nudges too frequent, add this to your `CLAUDE.md` (or `GEMINI.md`):

```
## team-foundry coach
inline-nudges: off
```

The coach will then only run when you explicitly ask for it.

## Requirements

- Node 18+
- Claude Code, Gemini CLI, or any AI tool that reads files from your repo as context

## What's next

team-foundry v1 supports Claude Code and Gemini CLI. Cursor is the highest-priority v2 addition — it has the largest active user base of any AI coding tool and fits the same file-based context model.

v2 shortlist: Cursor support and scheduled coach runs via cron.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT
