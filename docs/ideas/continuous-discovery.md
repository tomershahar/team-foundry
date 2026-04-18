# Continuous Discovery (Teresa Torres)

## Problem Statement
How might we make continuous discovery a default habit — not a seasonal activity —
by embedding Torres' OST structure and assumption gates into team-foundry?

## Recommended Direction
Progressive disclosure aligned to the solo/full profile split. The coach is the
primary author of the OST — not the user.

**Solo profile** gets:
- An experiment column added to `now-next-later.md` (linked assumption + test status)
- Coach behavior B13 "build trap detector" — fires when items move to Now without
  a linked experiment result or a `Last Validated` date in `assumptions.md`
  within the last 30 days
- B13 is integrated with B3 (stale assumptions): B13 gates new work going in,
  B3 cleans stale beliefs already there — same coach voice, complementary triggers

**Full profile adds:**
- `team-foundry/product/ost.md` — a living Opportunity Solution Tree rendered as a
  Mermaid.js diagram. The coach owns this file: when the user mentions a new feature
  or opportunity in conversation, the coach maps it to the OST ("Based on our
  outcomes.md, this looks like it belongs under Opportunity Y — should I update
  the tree?") and drafts the update via the conversation-as-update protocol.
- Coach Mermaid rules: on every edit, the coach regenerates the full diagram block
  (never patches mid-diagram). When the tree exceeds ~15 nodes, coach switches to
  a nested-list fallback automatically and notes the switch in the draft.
- First-open framing in the file and in coach onboarding: "Think of an Opportunity
  as a customer pain point, not a feature idea. 'I can't find the checkout button'
  is an Opportunity. 'Add a big red button' is a Solution."

**Evidence in `assumptions.md`:**
`customers.md` is personas/JTBD — too high-level to serve as interview evidence.
`assumptions.md` gets a `Last Validated` date and optional transcript/note link
per assumption. B13 checks that field specifically. If `Last Validated` is absent
or >30 days old, B13 treats the assumption as unvalidated. No new file needed.

**File placement:** `ost.md` lives in `product/` (not a new `discovery/` subfolder).
Flat hierarchy keeps the AI context load low.

## Key Assumptions to Validate
- [ ] Coach full-rewrite model keeps Mermaid coherent after 3+ edits —
      **Pass criteria:** run 5 sequential OST updates in Iteration 11 worked example;
      the diagram must render without syntax errors in each state and the tree
      structure must remain semantically consistent. If it breaks once, the
      full-rewrite rule needs tightening before shipping.
- [ ] `Last Validated` in assumptions.md gives B13 enough signal without false positives —
      test by scaffolding a minimal repo with dated and undated assumptions and
      confirming B13 fires only on the undated/stale ones
- [ ] PMs unfamiliar with Torres grasp "Opportunity" from the first-open example alone —
      **Pass criteria:** share the ost.md stub with a non-Torres PM; they must be
      able to correctly classify 3 given items (pain point vs feature idea) without
      any external explanation. If they mis-classify, the example needs rewriting
      before this ships.

## MVP Scope
- Experiment column in `now-next-later.md` template (both profiles)
- `Last Validated` date + transcript link field in `assumptions.md` template (both profiles)
- `ost.md` template with Mermaid diagram + full-rewrite + complexity fallback rules
  (full profile only)
- First-open Torres vocabulary framing in `ost.md` frontmatter/intro
- B13 build trap behavior in coach.ts (both profiles, integrated with B3,
  checks `Last Validated` in assumptions.md)
- Coach instruction in `ost.md` and coach.ts: coach drafts all OST changes,
  user confirms via conversation-as-update protocol

## Not Doing (and Why)
- Separate `discovery-log.md` file — `Last Validated` in assumptions.md captures
  the signal B13 needs; a dedicated log adds maintenance burden without detection gain
- MCP connector specifically for interview notes — MCP ingestion is already handled
  in the existing ingestion protocol; no special-case needed here
- Hard-blocking "Now" movement — coach flags, teams decide
- Torres vocabulary tutorial beyond first-open example — one well-chosen example
  beats a glossary

## Open Questions (resolved)
- ~~Where does ost.md belong?~~ → `product/`, keep hierarchy flat
- ~~Should B13 reference B3?~~ → Yes, integrated — B13 gates new work, B3 cleans old
- ~~File count concern~~ → Focus on signal-to-noise, not count
- ~~Mermaid brittleness~~ → Full-rewrite on every edit; auto-fallback at ~15 nodes
- ~~Customer signal gap~~ → `Last Validated` field in assumptions.md, not a new file

## CPO Notes (Gemini, 2026-04-18)
- "Don't just give them a template. The Coach needs to be the one to draw the tree."
- "Without a log, B13 will be annoying" — resolved via Last Validated in assumptions.md
- "This moves team-foundry from a Documentation Tool to a Methodology Tool"
- "The Coherent Mermaid test is your make-or-break for Iteration 11"
- "The Non-Torres PM test is vital — or you'll have 1,000 teams building feature
  roadmaps disguised as Opportunity Trees"
