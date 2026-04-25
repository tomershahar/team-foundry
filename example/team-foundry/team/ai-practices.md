---
purpose: How we use AI tools — what we delegate, what we don't, and how to do it well
read_when: When onboarding someone new or discussing how to use AI in our workflow
last_updated: 2026-04-25
owner: Sarah
---

# AI Practices

## What we use

- **Claude Code** — primary AI coding tool. All engineers have access. Used in the shared product repo (this one) and in individual branches.
- **Gemini CLI** — secondary. Marcus uses it for architecture review. Optional.
- **Cursor** — Jake uses it for frontend work. Acceptable as long as the team-foundry context files are in scope.

## What we delegate to AI

**Good uses:**
- First drafts of specs and ADRs (Sarah and Marcus both do this — AI writes the first draft, humans edit and own)
- Code review second pass (after the human reviewer has gone first — AI catches things humans miss, not the reverse)
- Test coverage gap analysis (Priya runs this before PRs)
- Refactoring within well-understood boundaries (rename, restructure, not rearchitect)
- Synthesizing customer interview notes into themes (David uses this; always reviewed before anything is acted on)

**Not delegated:**
- Architecture decisions — AI can inform, humans decide, decisions go in `engineering/decisions/`
- Customer communication — no AI-generated emails or Slack messages to customers
- Prioritization decisions — AI can surface trade-offs, Sarah decides
- Incident root cause — AI can help investigate, but the RCA written to customers is always human-reviewed

## Rules

**Prompt with context.** When using Claude Code in this repo, the team-foundry files are context. Don't re-explain the product, the customers, or the quality bar in prompts — those are already loaded.

**Output is a draft, not a decision.** Any AI output that affects product direction, architecture, or customer communication is a draft until a human has read and confirmed it. "Claude suggested X" is not a justification — "I reviewed Claude's suggestion and think X because Y" is.

**Note when AI was used.** In PRs: a one-line note if AI helped write significant portions of the code ("AI-assisted: test coverage"). In ADRs: note if AI wrote the first draft. Not to disclaim, but to give reviewers context.

## What good AI-assisted work looks like

Sarah's process for specs: prompt Claude with the outcome and customer quotes from this repo, get a first draft, edit it until she'd be comfortable defending every sentence in a customer call, then share for review. The spec reads as hers because she's edited it to be hers.

Priya's process for code review: does her own review first, then asks Claude to review the same PR. If Claude finds something she missed, she either fixes it or documents why it's acceptable. If Claude is wrong, she corrects it in the thread so it's visible.
