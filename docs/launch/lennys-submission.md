# Lenny's Newsletter Submission Draft

**Submission type:** Tool / resource recommendation

---

**Tool name:** team-foundry

**One-line description:** An open-source CLI that scaffolds structured product context files your AI coding tools read natively — outcomes, customers, strategy, quality bar, decisions — plus a coaching layer that notices when they go stale.

**What problem does it solve?**

AI coding tools give better answers when they know what the product is for. Most teams don't have that context written down anywhere the AI can read it. It lives in wikis, Notion, Slack threads, and people's heads.

team-foundry generates a `team-foundry/` directory in your repo — files like `outcomes.md`, `customers.md`, `strategy.md`, `quality-bar.md` — with YAML frontmatter that tells Claude Code, Gemini CLI, and other AI tools when to load each file. The AI reads them every session, automatically.

It also generates a coach: a set of behaviors that run inline as you work, flagging when your roadmap has items with no validated assumptions (the build trap), when your experiment results need a proper readout, or when your strategy file doesn't actually rule anything out.

**Why is it different from just writing docs?**

Three reasons:

1. **Structure that AI tools can navigate.** Every file has `purpose`, `read_when`, and `last_updated` fields in YAML frontmatter. The AI knows when to load each one without being told.

2. **A coach that surfaces drift.** Files go stale. The coach notices — customer personas older than 60 days, assumptions older than 30 days with no validation, quality-bar.md that contradicts what the commit history shows. It flags these inline, offers to draft fixes, and waits for confirmation before writing anything.

3. **Gaps as signal.** The templates are designed to make missing information visible, not hide it behind placeholders. A half-empty outcomes.md with output language is more useful than a full one that looks complete.

**Who is it for?**

Product teams of 1–15 people using Claude Code or Gemini CLI for development. Especially useful for solo founders and small teams who are moving fast and losing track of whether the AI understands what they're building.

**How to try it:**

```
npx create-team-foundry
```

Answer 4 questions. Takes ~30 minutes to fill in properly via the built-in onboarding interview.

**GitHub:** [link] — MIT license, open source.

**Honest caveat (I'd want you to include this):**

This makes it easier to build shared product understanding. It doesn't build it for you. If the team isn't willing to have the hard conversations about outcomes, customers, and quality — no tool helps. What team-foundry does is make those conversations easier to start and easier to maintain.

---

*Happy to provide a worked example, screenshots, or a longer write-up if useful for the newsletter.*
