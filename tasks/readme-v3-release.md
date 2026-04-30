# README updates for v3 release

> Apply only when v3 is ready to ship. Confirm v3 branch status before starting.

## High priority (required for v3 to ship)

**1. Update opening line if v3 positioning shifted**
Current: *"Make your AI coding outputs align with your product reality."*
v3 is the judgment layer (sourced facts, confidence marking, hierarchy). Consider:
- Keep current — still accurate, doesn't oversell v3
- v3 angle: *"Make your AI's judgment calls match your product reality. Not just the facts — the context that lets your AI know which facts matter."*

**2. Update the "What gets created" file count**
v3 changes the file structure (Hooks/Rules/Reference for full profile). Current table: solo=7, full=20, federated=26. Update with v3 numbers and reference the new architecture.

**3. Add a "What's new in v3" section near the top**
Brief, scannable. Three bullets max. Position above the install command so v2 users immediately see what changed:
- Sourced facts: every claim has source + date
- Validated vs hypothesized: explicit confidence marking on customers, outcomes, assumptions
- Architecture: Hooks/Rules/Reference layering for full profile (lighter root, deeper context loaded on demand)

**4. Update the drift patterns table to include new v3 patterns**
Current table has 6 patterns. v3 should add at least 2:
- **Unsourced claim** — fact stated without attribution or date
- **Confidence collapse** — hypothesis treated as validated fact in roadmap or strategy

**5. Update "What's next" section**
v3 will be current. Current section lists v2.x and v3 items, most now shipped. Replace with actual v3.x and v4 candidates. Be honest about what's exploration vs committed.

---

## Medium priority (quality additions if time permits)

**6. Add migration guidance**
`npx create-team-foundry migrate --to v3` is shipping in v3.0. Document: who should migrate, what gets preserved, what gets prompted, how to roll back. (This is already started in the README — expand it.)

**7. Update the "Supported tools" table**
Confirm AGENTS.md is still included. Add any new tool support if v3 adds it.

**8. Add the four-bucket framing (Carl Vellotti's framework)**
Apply to team-foundry's existing components without restructuring the product. One paragraph or small table:
- Context: the team-foundry/ files (outcomes, customers, decisions, etc.)
- Actions: the coach commands, status command, drift detection
- Behavior: CLAUDE.md, GEMINI.md, .cursor/rules/, AGENTS.md, hierarchy.md
- Connections: git, GitHub, Claude Code, Cursor, Gemini CLI, Codex

**9. Add a concrete time-savings example**
Replace or supplement the current abstract before/after with one specific recurring workflow showing time saved. Requires real timing — don't fabricate.

---

## Low priority (polish)

**10. Add a "Getting buy-in" section**
Objection-handling table for PMs/EMs advocating for team-foundry. Four rows max:
- "I don't have time to learn a new tool"
- "We already document things"
- "I'm not technical enough"
- "AI output isn't good enough"

**11. Update the Clearline example reference**
Clearline already has v3 structure (updated in Task 14). Verify the README reference is accurate.

**12. Star CTA tuning**
Current: *"team-foundry.com · If this helps your team, a star helps others find it."*
Consider being more direct given the early stage. Don't beg, but be honest.

---

## Things NOT to change

- Do not redo "Set up once. Everyone gets the same context" section — it works
- Do not change the drift patterns table structure — just add rows
- Do not change the supported tools table format
- Do not add testimonials — no real user quotes yet
- Do not add new generic AI illustrations or imagery
- Do not change License, Contributing link, or Requirements

---

## Execution order

1. Items 1–5 first (required)
2. Items 6–9 if time allows
3. Items 10–12 are polish — skip if any item above isn't done well

## Acceptance criteria

- README accurately describes what v3 does, no claims about unshipped features
- A v2 user understands what changed and whether to migrate
- A new visitor reading in under 90 seconds understands what team-foundry is, what it does, and how to install it
- No stale references to v1 or "upcoming Cursor support"
