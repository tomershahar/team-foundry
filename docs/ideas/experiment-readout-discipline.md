# Experiment Readout Discipline

## Problem Statement
How might we stop PMs from making ship/kill decisions based on topline experiment
results — by coaching scenario thinking before launch and segment analysis after?

## Recommended Direction
A single linked coach behavior (B15) with two phases:

**Phase 1 — Pre-experiment: scenario forcing**
Triggers when an experiment or feature is about to launch (item moves to "Now"
without a scenario range, or user says "we're shipping X").

Coach asks:
- What's the pessimistic outcome, and is the feature still worth shipping at that number?
- What's the realistic outcome you're planning around?
- What's the optimistic case, and what would drive it?
- What's the single biggest sensitivity — the assumption that, if wrong, changes the decision?

Coach drafts a scenario block into `assumptions.md` before the experiment ships:

```
| Scenario     | Metric | Value | Confidence |
|---|---|---|---|
| Pessimistic  | activation rate | +1pp | If onboarding completion < 40% |
| Realistic    | activation rate | +4pp | Baseline assumption |
| Optimistic   | activation rate | +8pp | If segment A responds as expected |
| Key sensitivity | segment A response rate | — | Make or break |
```

**Phase 2 — Post-experiment: gap analysis + segment check**
Triggers when experiment results are pasted or discussed ("we saw X%", "the results
came back", "experiment ended").

Coach runs a two-step check before accepting a ship/kill decision:
1. **Gap analysis:** Expected vs actual. If delta > 20%, coach asks "why?" before
   moving on. Blocks premature conclusions.
2. **Segment check:** "Before you kill this — did you check results by your primary
   customer segment? Topline failures sometimes hide segment wins."

Coach drafts a readout entry into `assumptions.md` (or a linked experiment section):
- Expected → actual
- Segment breakdown (or explicit note that it wasn't checked)
- Conclusion: validated / invalidated / inconclusive
- What's next

Both phases are part of B15. Phase 1 fires on launch signals, Phase 2 fires on
result signals. They reference the same assumption entry — pre fills it, post closes it.

## Key Assumptions to Validate
- [ ] Coach can reliably detect "about to launch" and "results are in" signals
      from conversation alone — test in Iteration 11 by running a scripted
      experiment conversation and checking if B15 fires at the right moments
- [ ] PMs will actually fill in the scenario block — or will they skip it?
      Test: does making it a draft (coach writes it, PM confirms) reduce friction
      enough that the block gets written?
- [ ] Segment check catches real missed wins — validate with course case study:
      guided onboarding was -1.3pp overall but +10.7pp for 5-20 person teams

## MVP Scope
- B15 in coach.ts with two trigger conditions and two draft formats
- Scenario block template added to `assumptions.md` (both profiles)
- Experiment readout section in `assumptions.md` (both profiles)
- B15 integrated with B13 (build trap): B13 checks for scenario block before
  item moves to Now; B15 fills it

## Not Doing (and Why)
- Separate `experiments.md` file — assumptions.md already tracks validation state;
  keeping experiment records there avoids fragmentation
- Statistical significance checks — no runtime; coach can ask about sample size
  but can't compute significance
- Automated segment analysis — coach prompts the human to check segments, doesn't
  run the analysis

## Open Questions
- Should the scenario block be required before "Now" (hard gate) or just prompted
  (soft nudge)? Recommendation: soft nudge — coach flags absence, team decides
- Does B15 Phase 2 need a separate file section, or can it annotate the same
  assumption entry Phase 1 created?
