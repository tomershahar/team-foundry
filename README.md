# team-foundry

**Give your AI coding tool the context it needs to be a real product partner.**

`npx create-team-foundry` scaffolds a `team-foundry/` directory of structured files — outcomes, customers, decisions, quality bar, strategy — in a format that Claude Code, Gemini CLI, and other AI tools read natively as context.

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

## Strategy in Git

Putting strategy and product context in a repo might feel wrong. A few things worth knowing:

- The `.gitignore` template excludes `team-foundry/private/` by default — put sensitive material there
- During setup you choose repo visibility (public / internal / private) and the coach adjusts its language accordingly
- Nothing in the generated files requires sensitive data — personas use first names, metrics use your definitions, decisions record rationale not revenue

If your repo is public and you're concerned, use the solo profile and keep customers.md to job roles rather than names.

## The coach

The coach lives in `.team-foundry/coach.md` and is loaded on demand to preserve token budget. It runs in three modes:

- **Inline** — always on, silent unless something relevant to your current question is stale or missing
- **Explicit** — triggered by "let's do a team-foundry review," runs a full audit
- **Scheduled** — proactive weekly check-in, surfaces top 3 findings

The coach never writes without your confirmation.

## Requirements

- Node 18+
- Claude Code, Gemini CLI, or any AI tool that reads files from your repo as context

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT
