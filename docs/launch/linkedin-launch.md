# LinkedIn Post Draft

---

I built a small open-source CLI that's been quietly improving how our AI coding sessions go.

The problem: Claude Code and Gemini CLI are powerful, but they don't know anything about your product. Every session, you're starting from zero — explaining who your customers are, what you're building and why, what quality means to your team.

**team-foundry** scaffolds a `team-foundry/` directory of structured files that live in your repo and get read as context automatically. Outcomes, customers, strategy, quality bar, architecture decisions, glossary, team norms.

It also generates a coaching layer that runs inline as you work — it notices when your files go stale, when your roadmap has items with no validated assumptions behind them, or when what you said about quality doesn't match your commit history.

```
npx create-team-foundry
```

Three things I'd want you to know before trying it:

1. **It's a mirror, not a template pack.** The files are shaped to make gaps visible — not to give you well-structured platitudes to fill in. A half-empty outcomes.md is more useful than a full one with output language.

2. **The coach doesn't block you.** It flags, diagnoses, offers to draft a fix. You confirm. It writes. No lectures.

3. **It won't fix culture problems.** If your team isn't having the real conversations about outcomes, customers, and quality — no tool helps. What team-foundry does is make those conversations easier to start and easier to keep current.

Two profiles: solo (7 files for 1–3 person teams) and full (15 files for 4–15 person teams).

GitHub: [link] — MIT license, contributions welcome.

Curious if others have found good ways to give AI tools persistent product context. What's working for your team?
