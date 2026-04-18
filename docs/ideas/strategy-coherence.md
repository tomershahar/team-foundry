# Strategy Coherence (Rumelt's Strategy Kernel)

## Problem Statement
How might we prevent roadmap drift — where individual items each seem reasonable
but the overall roadmap pursues three different strategies at once?

## Recommended Direction
A two-trigger coach behavior (B16) using Rumelt's Strategy Kernel as the lens:
Diagnosis → Guiding Policy → Coherent Actions. The kernel lives in a new
lightweight file; the coach checks items against it inline and audits the full
roadmap quarterly.

**New file: `team-foundry/product/strategy.md`** (full profile only)
Three sections:

- **Diagnosis:** Anchored to North Star. Coach prompt on first fill: "Our North
  Star is [X from north-star.md] — what's the biggest obstacle currently stopping
  us from hitting it?" That answer is the Diagnosis. Not a goal, a named problem
  with evidence.
  Example: "Activation is stuck at 45% for SMB; enterprise churns at month 3
  due to integration complexity."

- **Guiding Policy:** The approach that addresses the diagnosis — what we're
  betting on, and explicitly what we're NOT doing. Coach interrogates any draft
  that doesn't say no: "This policy is all yes. For this to be a strategy, tell me
  one type of customer or feature we're explicitly not pursuing this quarter."
  Example: "We win by being the easiest tool for a solo PM to ship evidence-backed
  decisions. We are not building an enterprise platform."

- **Coherent Actions:** Initiatives that reinforce the guiding policy. Pre-populated
  with inline comments showing bad vs. good examples:
  ```
  <!-- BAD: "Improve the dashboard" — too vague, doesn't connect to guiding policy -->
  <!-- GOOD: "Add activation funnel view for SMB segment" — directly addresses diagnosis -->
  ```

Coach first-open framing: "The guiding policy is only useful if it says no to
something. 'We want to be the best product tool' is not a strategy. 'We win
by X, which means we won't do Y' is."

**B16 Phase 1 — Item-level inline check**
Triggers when an item is added to `now-next-later.md` or discussed as a candidate.

Coach checks: Does this item reinforce the guiding policy in `strategy.md`?
- If yes: "This aligns with [guiding policy excerpt] — good."
- If unclear: "How does this connect to [guiding policy]? Walk me through it."
- If no: "This looks like it pursues [different direction]. That's not necessarily
  wrong, but it's a strategy conversation, not a prioritization call."

Coach doesn't block — it names the tension and asks the PM to own the decision.

**Solo profile — lightweight B16**
No strategy.md required. Coach asks one question when items are added to Now/Next:
"How does this help you win against [competitor / alternative] for [target customer]?"
If the PM can't answer in one sentence, that's the signal.

**B16 Phase 2 — Quarterly coherence audit**
Triggers on the same 90-day cadence as the retrospective.

Coach reviews all "Now" and "Next" items against the guiding policy and flags:
- Items with no clear connection to the guiding policy
- Clusters suggesting a different strategy emerging ("3 of your 5 Next items look
  like enterprise features — is the guiding policy still accurate?")
- Missing coherent actions ("Your diagnosis mentions activation, but nothing in
  Now/Next addresses it")

Coach drafts a coherence summary — not a lecture, a mirror. PM confirms before
any changes are written.

**Context priority hierarchy** (addresses product/ folder growth):
As `product/` grows, the coach uses this conflict resolution order when files
contradict each other:
1. `north-star.md` — destination, never overridden
2. `strategy.md` — the route; overrides tactical prioritization
3. `outcomes.md` — current cycle commitments
4. `ost.md` — discovery tree; subordinate to committed outcomes
5. `now-next-later.md` — execution; lowest authority

This hierarchy lives in coach.ts as a standing instruction. When the coach
detects a conflict between files, it names it explicitly and resolves using
this order rather than silently picking one.

## Key Assumptions to Validate
- [ ] Coach interrogation prevents platitude guiding policies —
      test in Iteration 11: write a platitude first, check if the coach correctly
      challenges it and elicits a "no" statement before accepting the draft
- [ ] Diagnosis anchored to North Star stays coherent as north-star.md evolves —
      test by updating north-star.md and checking if B16 Phase 2 flags the
      now-disconnected diagnosis
- [ ] Context priority hierarchy resolves real conflicts without feeling pedantic —
      test with a scenario where ost.md and outcomes.md point in different
      directions and confirm the coach names the conflict and resolves correctly

## MVP Scope
- `strategy.md` template with Diagnosis/Guiding Policy/Coherent Actions (full profile)
- Diagnosis anchored to North Star via coach prompt on first fill
- Coach interrogates platitude guiding policies before accepting
- Bad/Good examples as inline comments in Coherent Actions section
- B16 in coach.ts: item-level inline check + 90-day audit (integrated with B12)
- Solo lightweight B16: one-question nudge, no strategy.md required
- Context priority hierarchy in coach.ts as a standing conflict resolution rule

## Not Doing (and Why)
- strategy.md for solo — one question is enough; a 3-part doc is overhead
- Rumelt vocabulary tutorial — bad/good examples in comments do the job
- Blocking roadmap items — coach names tension, PM decides
- Separate "context map" file — hierarchy lives in coach.ts instructions, not
  another file the PM has to maintain

## Open Questions (resolved)
- ~~Replace or augment north-star.md?~~ → Augment; North Star is destination,
  strategy is route; Diagnosis dynamically linked to North Star
- ~~Solo lightweight B16?~~ → Yes, one question, no file required
- ~~Context window junk drawer as product/ grows?~~ → Priority hierarchy in
  coach.ts: north-star > strategy > outcomes > ost > now-next-later

## CPO Notes (Gemini, 2026-04-18)
- "Starting with Diagnosis is a professional-grade move — evidence before solutions"
- "80% of PMs will write platitudes — the coach must interrogate, not just template"
- "The Quarterly Mirror catches stealth drift where individual items make sense
  but the aggregate is a mess"
- "This makes team-foundry a Strategic Architect, not just a tactical assistant"
