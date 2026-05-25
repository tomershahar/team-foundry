# Skill Parity Guide

The six `/team-foundry-*` slash commands work only in **Claude Code**. This guide documents equivalent workflows for Cursor and Codex (and any agent that reads `AGENTS.md`).

---

## Cursor (Composer / Chat)

Use these trigger phrases in Cursor's Composer or Chat:

| Claude Code Skill | Equivalent Cursor prompt |
|---|---|
| `/team-foundry-intro` | *"Read the team-foundry files and give me a session summary — who we are, what we're working toward, and what's currently at risk."* |
| `/team-foundry-status` | *"Read `team-foundry/product/outcomes.md` and `team-foundry/product/now-next-later.md`. Tell me what's on track, at risk, or blocked this cycle."* |
| `/team-foundry-review` | *"Audit all files under `team-foundry/`. List findings by severity — staleness, gaps, drift between outcomes and roadmap."* |
| `/team-foundry-capture` | *"Capture the decisions and learnings from this conversation into the right team-foundry file. Show me the proposed change before writing."* |
| `/team-foundry-decision` | *"Draft an Architecture Decision Record (ADR) from this conversation. Use the format in `team-foundry/engineering/decisions/`."* |
| `/team-foundry-feature` | *"Synthesize everything team-foundry knows about [feature name]: current status, open assumptions, customer evidence, and risks."* |

---

## Codex / other agents (AGENTS.md–native)

These agents read `AGENTS.md` directly. Copy the prompt recipe into the chat, or add a `## Prompt Recipes` section at the bottom of your `AGENTS.md` so they're always in context.

| Skill | Prompt recipe |
|---|---|
| Intro | `"Read AGENTS.md and all files under team-foundry/. Summarize team context, current goals, and what's at risk this cycle."` |
| Status | `"Read team-foundry/product/outcomes.md and team-foundry/product/now-next-later.md. Report what's on track, at risk, or blocked. Cite specific files."` |
| Review | `"Audit all files under team-foundry/ for staleness, gaps, and drift. List findings by severity: critical (blocks a decision), warning (actionable this week), info (note for later)."` |
| Capture | `"Based on this conversation, identify what was decided or learned. Propose updates to the appropriate team-foundry files. Show the diff before writing."` |
| Decision | `"Draft an Architecture Decision Record (ADR) based on this conversation. Use the template format from team-foundry/engineering/decisions/ if one exists, otherwise use standard ADR format."` |
| Feature | `"Synthesize everything in team-foundry/ about [feature]: status in now-next-later.md, linked assumptions, customer evidence from customers.md, open risks, and any ADRs."` |

---

## Adding prompt recipes to AGENTS.md (optional)

If you're running an agent that reads `AGENTS.md` at session start, you can embed these recipes directly so they're always available. Add this block to the bottom of your `AGENTS.md`:

```markdown
## Prompt Recipes

Copy-paste these prompts to trigger team-foundry workflows:

- **Session intro:** "Read AGENTS.md and all team-foundry/ files. Summarize context, goals, and risks."
- **Status check:** "Read outcomes.md and now-next-later.md. What's on track, at risk, or blocked?"
- **Full review:** "Audit all team-foundry/ files for staleness and drift. List findings by severity."
- **Capture:** "Propose updates to team-foundry/ files based on this conversation. Show before writing."
- **Decision:** "Draft an ADR from this conversation using the format in engineering/decisions/."
- **Feature:** "Synthesize team-foundry knowledge about [feature]: status, assumptions, evidence, risks."
```

---

## Future: generating Cursor/Codex skill files

Generating actual `.cursor/rules/` files and AGENTS.md instruction blocks for each skill is deferred to v3.4. See `SPEC-cross-tool-refactor.md` → Change 4 for the rationale.
