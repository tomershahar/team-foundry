# Spec — Iteration 9b: v2.1 PRD additions

## Objective

Implement the four additions introduced in PRD v2.1 that were scoped to Iteration 9
but not built during the original Iteration 9 pass:

1. `product/strategy.md` template (full profile only)
2. `assumptions.md` new fields: `Last Validated`, `Evidence`, readout section
3. B13, B15 Phase 2, B16 coach behaviors in coach.ts
4. F4.9 Context Priority Hierarchy in coach.ts

All changes are content/template only — no CLI prompts, no new npm packages, no
changes to the scaffold engine beyond adding one file entry.

---

## 1. New file — `product/strategy.md` (full profile only)

### Template content

Three sections per Rumelt's Strategy Kernel:

**Diagnosis**
- Instructs the team to anchor to `north-star.md`
- First-fill coach prompt embedded in the placeholder:
  "Our North Star is [X from north-star.md] — what's the biggest obstacle currently
  stopping us from hitting it? That answer is the Diagnosis."
- Example format: named problem with evidence, not a goal

**Guiding Policy**
- Instructs the team to state what they're betting on AND what they're not doing
- Coach interrogation note embedded: if the draft doesn't say no to something,
  coach will ask "This policy is all yes. Tell me one type of customer or feature
  you're explicitly not pursuing this quarter."
- First-open framing: "The guiding policy is only useful if it says no to something.
  'We want to be the best product tool' is not a strategy. 'We win by X, which means
  we won't do Y' is."

**Coherent Actions**
- Initiatives that reinforce the guiding policy
- Pre-populated with inline BAD/GOOD comment examples:
  - BAD: an item that doesn't connect to the guiding policy
  - GOOD: an item that directly addresses the diagnosis

### Scaffold wiring

Add to `FULL_ONLY_ENTRIES` in `src/scaffold.ts`:
```typescript
{ relativePath: 'team-foundry/product/strategy.md', content: strategyTemplate }
```

Full profile file count: 14 → 15. Update `expectedPaths` accordingly (handled
automatically by adding to FULL_ONLY_ENTRIES).

---

## 2. Updated template — `assumptions.md`

Add two new fields per assumption entry:

```markdown
**Last Validated:** YYYY-MM-DD  ← new; leave blank if never tested
**Evidence:** [link or note]    ← new; optional transcript or note URL
```

Add a readout section at the end of the file (scaffold-empty, coach-populated):

```markdown
## Experiment readouts
<!-- Populated by the coach after experiment results arrive.
     Format: expected → actual, segment breakdown, conclusion, next step.
     Do not pre-fill — the coach drafts this after confirming results with you. -->
```

The `Last Validated` field is what B13 and B3 check. The readout section is what
B15 Phase 2 populates via the conversation-as-update protocol.

---

## 3. New coach behaviors in coach.ts

All three behaviors follow existing coach behavior structure:
- Named section with trigger condition
- Inline mode (Mode 1) only
- No blocking — names the gap, offers a next step
- No silent writes — follows conversation-as-update protocol (F4.4)
- Nudge memory applies (7-day window, inline mode only)

### B13 — Build-trap detector

**Position in behavior list:** After B3 (stale assumptions) — same coach voice,
complementary triggers. B3 cleans stale beliefs already there; B13 gates new work.

**Trigger:** Item moves into "Now" section of `now-next-later.md` without either:
(a) a linked experiment reference, or
(b) a `Last Validated` date in `assumptions.md` within the last 30 days

**Coach response pattern:**
> "This item is moving to Now without a linked experiment or a recent validated
> assumption. That's the build trap — we ship things that feel right but haven't
> been tested. Want me to draft an assumption entry for this, or link an existing one?"

**Draft looks like:** A new assumption entry in `assumptions.md` with the claim,
status: open, Last Validated: blank, Evidence: blank. User confirms before writing.

### B15 Phase 2 — Experiment readout: segment check + gap analysis

**Position:** After B5 (reality drift) — it's a form of reality check on experiment
conclusions.

**Trigger:** Conversation signals that experiment results are in:
- "we saw X%", "the results came back", "experiment ended", "the experiment showed"

**Coach two-step before accepting ship/kill:**

Step 1 — Gap analysis:
If actual vs. expected delta > 20%: "That's a meaningful gap from what we expected.
Do you understand why before we decide what to do with it?"

Step 2 — Segment check:
"Did you check results by your primary customer segment? Topline failures sometimes
hide segment wins — and topline wins sometimes hide segment losses."

**Draft looks like:** A readout entry in `assumptions.md` under the relevant
assumption (or in the `## Experiment readouts` section if no linked assumption exists):

```
### Experiment readout — [name] ([date])

| | Expected | Actual |
|---|---|---|
| Overall | [X] | [Y] |
| Segment: [primary] | [X] | [Y] |
| Segment: [secondary] | [X] | [Y] |

**Gap analysis:** [explanation]
**Segment breakdown:** [insight]
**Conclusion:** [validated / invalidated / inconclusive]
**Next:** [next action]
```

User confirms before writing.

**B15 Phase 1 (pre-launch scenario forcing) is deferred to v2. Do not implement.**

### B16 — Strategy coherence (inline)

**Position:** After B1 (outputs vs. outcomes) — strategy coherence is the highest-level
filter before outcome framing.

**Trigger:** Item added to `now-next-later.md` or discussed as a roadmap candidate.

**Coach checks:** Does this item reinforce the guiding policy in `strategy.md`?

- If `strategy.md` doesn't exist (solo profile or not yet filled): coach asks one
  question: "How does this help you win against [competitor/alternative] for
  [target customer]? If you can't answer in one sentence, that's worth pausing on."
- If `strategy.md` exists and item aligns: brief affirmation — "This connects to
  [guiding policy excerpt]."
- If unclear: "How does this connect to [guiding policy]? Walk me through it."
- If no: "This looks like it pursues [different direction]. That's not necessarily
  wrong, but it's a strategy conversation, not a prioritization call."

Never blocks. PM owns the decision.

**90-day coherence audit is NOT a new named behavior.** It folds into the existing
quarterly retrospective (F4.7). Do not add a separate scheduled behavior.

---

## 4. F4.9 — Context Priority Hierarchy in coach.ts

**Not a named behavior — a standing instruction** in the coach playbook.

When files contradict each other, the coach resolves in this order and names the
conflict explicitly rather than silently picking one:

1. `north-star.md` — destination, never overridden
2. `strategy.md` — the route (full profile only; absent for solo)
3. `outcomes.md` — current cycle commitments
4. `now-next-later.md` — execution, lowest authority

Add as a section `## Context priority` in coach.ts, placed near the top of the
coach playbook (before behaviors), so it applies to all coach interactions.

---

## Testing strategy

### New tests for strategy.md template

- `strategyTemplate` exists and is exported from `src/templates/index.ts`
- Output contains `purpose`, `read_when`, `last_updated` in frontmatter
- Output contains "Diagnosis", "Guiding Policy", "Coherent Actions" sections
- Output contains the first-open framing ("only useful if it says no")
- Output contains coach interrogation instruction for platitude policies
- Output contains BAD/GOOD comment examples in Coherent Actions section
- Scaffold: full profile includes `team-foundry/product/strategy.md`
- Scaffold: solo profile does NOT include `team-foundry/product/strategy.md`

### New tests for assumptions.md template

- Output contains `Last Validated:` field
- Output contains `Evidence:` field
- Output contains `## Experiment readouts` section
- Output contains the "Do not pre-fill" coach instruction in the readout comment

### New tests for coach behaviors (in templates.test.ts)

**B13:**
- Coach contains "B13" or "build-trap" or "build trap" section
- B13 trigger condition references `now-next-later.md` "Now" section
- B13 references `Last Validated` in `assumptions.md`
- B13 offers to draft an assumption entry
- B13 follows no-blocking guardrail (does not say "will not proceed" or "blocked")

**B15 Phase 2:**
- Coach contains B15 Phase 2 section
- B15 trigger condition references experiment result signals
- B15 includes gap analysis (>20% delta check)
- B15 includes segment check instruction
- B15 draft format includes expected/actual table
- B15 follows no-blocking guardrail

**B16:**
- Coach contains B16 section
- B16 trigger references `now-next-later.md` and `strategy.md`
- B16 includes solo fallback (one question, no file required)
- B16 never blocks (does not say "will not add" or "blocked")
- B16 affirms aligned items briefly

**F4.9:**
- Coach contains "Context priority" or "context priority hierarchy" section
- Section lists north-star, strategy, outcomes, now-next-later in order
- Section instructs coach to name conflicts explicitly

### Scaffold count tests

Update scaffold tests: full profile expected file count 14 → 15.

---

## Boundaries

**Always:**
- B13, B15, B16 each include an explicit "no blocking" instruction
- B13, B15, B16 each reference the conversation-as-update protocol for drafts
- B13, B15, B16 each note that nudge memory applies (7-day window, inline only)
- strategy.md template is full profile only — never added to solo profile

**Never:**
- B15 Phase 1 (pre-launch scenario forcing) — deferred to v2, do not implement
- 90-day strategy coherence audit as a new named behavior — folds into F4.7 only
- Blocking any user action from B13, B15, or B16

**Hell-yes test:** After implementation, re-read B13, B15 Phase 2, and B16 in
coach.ts. Each must feel like a genuine PM coaching moment, not a compliance check.
If any reads like a nag, rewrite it before marking the iteration complete.

---

## Files changed

| File | Change |
|---|---|
| `src/templates/strategy.ts` | New file — strategyTemplate function |
| `src/templates/assumptions.ts` | Add Last Validated, Evidence fields, readout section |
| `src/templates/index.ts` | Export strategyTemplate |
| `src/scaffold.ts` | Add strategy.md to FULL_ONLY_ENTRIES |
| `src/templates/coach.ts` | Add B13, B15 Phase 2, B16, F4.9 |
| `src/__tests__/templates.test.ts` | New describe blocks for all of the above |
| `src/__tests__/scaffold.test.ts` | Update full profile count 14 → 15 |
