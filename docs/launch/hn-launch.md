# HN Launch Post Draft

**Title:** Show HN: team-foundry – scaffold product context files that AI coding tools read natively

---

**Body:**

I've been frustrated that AI coding tools are great at writing code but don't know anything about the product: who it's for, what success looks like, or what quality means to this team. Every session starts from zero.

The obvious fix — putting context in the system prompt — doesn't scale. You hit token limits and the context goes stale.

team-foundry generates a `team-foundry/` directory of structured files (outcomes, customers, strategy, quality bar, decisions log) with YAML frontmatter that tells the AI when to load each one. It also generates a `.team-foundry/coach.md` that runs as a coaching layer — it flags when files go stale, when roadmap items have no validated assumptions behind them, or when your stated quality bar contradicts your commit history.

```
npx create-team-foundry
```

Answer 4 questions (AI tool, team size, repo visibility, whether you have docs to ingest). Takes about 30 minutes to fill in properly via the onboarding interview.

The coach never writes without your confirmation. No API keys. No hosted service. Everything runs on whatever AI tool you're already using.

Two profiles: solo (7 files, 1–3 people) and full (15 files, 4–15 people).

Honest caveat: this makes it easier to build shared product understanding, not automatic. If your team isn't willing to have the hard conversations about outcomes, customers, and quality — no tool fixes that.

GitHub: [link]

Happy to answer questions about the design decisions or the coach behavior system.

---

**Tags:** show-hn, open-source, developer-tools, ai
