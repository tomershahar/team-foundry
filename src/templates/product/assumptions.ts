import type { TemplateContext } from '../../types.js';

export function assumptionsTemplate(ctx: TemplateContext): string {
  return `---
purpose: Open assumptions and untested beliefs — the bets the team is currently making
read_when: Designing discovery work, scoping experiments, retros, any time a decision feels risky
last_updated: ${ctx.date}
owner: 
---

# Assumptions

<!-- COACH: Every product decision rests on assumptions. Most teams don't write them down,
     which means they can't tell when reality has disproved them.

     An assumption worth logging is one where being wrong would change what you build.
     "Users want this" is an assumption. "Users will pay for it" is a different assumption.
     "Our engineers can build it in 6 weeks" is a third one. They have different failure modes.

     The coach will flag any assumption older than 30 days without a tested/invalidated note.
     Not because 30 days is a magic number — but because an assumption that old with no
     evidence either way is a risk you've stopped thinking about. -->

<!-- GAP: No assumptions logged yet. The onboarding interview will ask:
     "What are the three biggest things you're assuming are true about your customers,
     your market, or your product that you haven't yet validated?" -->

## Open (untested)

<!-- Each assumption should include:
     - The belief itself, stated as a falsifiable claim (not a hope)
     - When you added it — so you know how old it is
     - What decision it affects — so you know what's at stake if it's wrong
     - How you'd test it — the smallest experiment that would give you real signal

     Example:
     ### Ops managers will self-serve report fixes without training
     **Added:** 2026-03-01
     **Last Validated:** *(never tested)*
     **Evidence:** *(none yet)*
     **What's at stake:** The entire "no-support-required" positioning depends on this.
       If they can't self-serve, we need a customer success layer.
     **How to test:** Give 5 ops managers access to the new fix-flow with no documentation.
       Observe whether they complete it or reach out for help. -->

## Tested

<!-- Assumptions you've gathered real evidence on. Include what you did and what you learned.
     Each entry should include:
     - The claim
     - Last Validated: YYYY-MM-DD
     - Evidence: link to transcript, note, or experiment result
     - What you changed because of it -->

## Invalidated

<!-- Assumptions you proved wrong. Don't delete these — they're your most valuable history.
     Record what you assumed, what you found instead, and what you changed because of it. -->

## Experiment readouts

<!-- Populated by the coach after experiment results arrive.
     Format: expected → actual, segment breakdown, conclusion, next step.
     Do not pre-fill — the coach drafts this after confirming results with you.

     Example structure:
     ### Experiment readout — [name] ([date])
     | | Expected | Actual |
     |---|---|---|
     | Overall | +X | +Y |
     | Segment: [primary] | +X | +Y |
     **Gap analysis:** [why the delta happened]
     **Conclusion:** validated / invalidated / inconclusive
     **Next:** [action] -->
`;
}
