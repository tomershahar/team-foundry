# Agent-Augmented Solo Team

## Problem Statement
How might we help a solo PM working with AI agents maintain the same clarity,
accountability, and working agreements that a human team would have — without
adding unnecessary structure for people who don't work this way?

## Recommended Direction
A CLI flag on the solo profile: "Do you work with AI agents as team members?"
If yes, three additions unlock:

**1. `team-foundry/team/agents.md`** — the autonomy contract
Lives in `team/` alongside trio.md — agents are team members, not tools.
Defines each AI agent on the team:
- Handle/name (e.g. "Claude Code", "Cursor Agent")
- Role and what it owns
- What it can do autonomously (no confirmation needed)
- What it must ask before doing (escalation triggers — e.g. "Ask before adding
  a new NPM package", "Ask before changing the data model")
- Known failure modes / what to watch for
- **Reset anchor** — a compact snippet the human can paste mid-session to
  re-center the agent when context window drift causes it to forget the contract.
  Contains: role summary, top 3 escalation triggers, key file references.
  Example: "You are [role]. Before acting: check stack.md and quality-bar.md.
  Always ask before [escalation trigger 1] or [escalation trigger 2]."

**2. Coach self-check behavior (B14)** — the context bundle protocol
Framing: in Claude Code the coach and the agent are the same entity. B14 is not
an interruption — it's the agent grounding itself before starting work.

B14 only fires when `agents.md` exists (opt-in gate). When triggered:
"Before I start that, let me pull in the relevant constraints from our
team-foundry files to make sure I don't go off-track."

The self-check assembles:
- Relevant outcome from `outcomes.md`
- Constraints from `quality-bar.md` and `stack.md`
- Autonomy boundaries from `agents.md`
- Any open assumptions from `assumptions.md` that apply

B14 is suggestive, not a full stop. It presents the bundle as a draft and
proceeds unless the human objects. No Clippy-style interruptions.

**3. GETTING_STARTED.md handoff protocol section** (when agent flag is yes)
Teaches the human how to use the self-check effectively:
- How to trigger a context bundle deliberately
- When to paste the reset anchor from `agents.md`
- How to log significant agent decisions for accountability

**Optional:** `team-foundry/engineering/agent-decisions/README.md` — a log
of decisions the agent made autonomously. Coach prompts after significant
autonomous actions. Absence is fine; presence creates an audit trail.

**Structure:** CLI flag, not a new profile. Full profile teams can also opt in —
agents.md works for any team size.

## Key Assumptions to Validate
- [ ] Solo PMs can define meaningful escalation triggers before they've worked
      with an agent long enough to know where it goes wrong —
      test by asking 3 solo Claude Code users to fill in agents.md cold and
      checking if the triggers are specific enough to be actionable
- [ ] The reset anchor actually re-centers the agent mid-session —
      test by filling a context window, pasting the anchor, and checking if
      the agent's next action respects the autonomy boundaries again
- [ ] AI agents read `agents.md` natively without explicit instruction —
      test with Claude Code, Cursor, and Gemini CLI in a scaffolded repo

## MVP Scope
- CLI flag: "Do you work with AI agents?" (yes/no), shown after profile selection
- `agents.md` template in `team/` with reset anchor section (solo + full, flag yes)
- B14 self-check behavior in coach.ts (fires on directive language only when
  `agents.md` exists; suggestive not blocking)
- `GETTING_STARTED.md` handoff protocol section when agent flag is yes
- Optional `agent-decisions/README.md` template (coach prompts, not auto-created)

## Not Doing (and Why)
- New "agent-augmented" profile — CLI flag keeps test matrix flat; flag is sufficient
- Agent-to-agent coordination — out of scope; human + agents, not multi-agent orchestration
- Enforcing which files agents read — no runtime; can only structure files and
  trust the agent's context window
- Real-time agent monitoring — no runtime; coach works from file state

## Open Questions (resolved)
- ~~Where does agents.md live?~~ → `team/` — agents are team members
- ~~Does B14 fire on any directive language?~~ → Only when agents.md exists (opt-in)
- ~~Agent-specific GETTING_STARTED section?~~ → Yes, when flag is yes

## CPO Notes (Gemini, 2026-04-18)
- "You are solving the Management Gap in the AI era — treating agents as team
  members, not tools"
- "B14 should be suggestive, not intrusive — avoid Clippy"
- "Frame B14 as a self-check, not an interruption — the coach and agent are the
  same entity in Claude Code"
- "The reset anchor addresses context window drift — the most common cause of
  agents going off-rails mid-session"
- "This turns team-foundry into a Safety Rail for AI Development — governance
  for the solo founder"
