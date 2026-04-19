# team-foundry

**Stop the "Context Drift." Give your AI coding tools a shared product brain.**

`npx create-team-foundry` scaffolds a structured context layer in your repo. It ensures every AI tool used by every team member—PM, Engineer, or Designer—is grounded in the same strategy, outcomes, and engineering decisions..

```
npx create-team-foundry
```

That's it. Answer 4 questions. Files appear in your repo.

**Run this in your shared product/engineering repo** — the one the whole team commits to. That's how everyone's AI tool picks up the same context automatically. Running it in a personal or feature branch repo works for solo use but misses the point for teams.

---

## What it does

Most teams use AI tools for code. The AI gives better answers when it knows what the product is for, who the customers are, and what quality means to this team.

team-foundry puts that context in your shared repo — not in a wiki, not in Notion, not in someone's head. Every team member's AI tool reads the same files every session, automatically.

It also installs a coach: a set of behaviors that notice when your files go stale, when your roadmap outpaces your assumptions, or when your strategy has drifted from your execution. The coach flags gaps inline while you work. You confirm; it writes.

## What gets created

**Solo profile (1–3 people):** 7 files. Identity, north star, outcomes, customers, stack, coach.

**Full profile (4–15 people):** 15 files. Everything above plus strategy, roadmap, assumptions, risks, trio, working agreement, AI practices, quality bar, decisions log, design principles, metrics, glossary, stakeholders.

Every file has YAML frontmatter (`purpose`, `read_when`, `last_updated`) so the AI knows when to load it and why.

## The honest note

team-foundry enables the work of building a shared understanding of your product. It doesn't replace it. If your team isn't willing to have the hard conversations about outcomes, customers, and quality — no tool fixes that. What team-foundry does is make those conversations easier to start, and easier to keep current.

## Shared floor, individual ceiling

team-foundry sets a shared baseline of context that every team member's AI tool reads from. Outcomes, customers, decisions, quality bar, glossary — the things everyone should be grounded in.

It does not cap what individuals do above that baseline. A senior PM can add their own prompts, their own discovery framework, their own depth. An engineer can bring their own AI practices. A designer can layer on top.

The floor is shared. The ceiling is individual. That's the point.

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

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT
