import type { TemplateContext } from '../../types.js';

export function outcomesTemplate(ctx: TemplateContext): string {
  return `---
purpose: Current quarter outcomes  -  the changes in customer behavior that define success this quarter
read_when: Prioritizing work, writing specs, deciding what to build next, evaluating tradeoffs
last_updated: ${ctx.date}
last_validated: ~
source: ~
owner:
---

# Outcomes

<!-- COACH: The most common failure here is listing outputs (features, launches, milestones)
     rather than outcomes (changes in what customers do, feel, or achieve).

     Test: can you tell at the end of the quarter whether it happened?
     Output: "Launch the new onboarding flow"  -  ships on day 1, done, unclear if it helped.
     Outcome: "New users complete their first meaningful action within 7 days of signup"  -  measurable.

     If your outcomes read like a sprint plan, they're outputs. Reframe: what do you want
     customers to DO differently, or be able to DO that they couldn't before? -->

<!-- GAP: No outcomes defined yet. The onboarding interview will ask:
     "Write your outcomes in the form 'we want X to change for Y customer segment.'
     What does winning this quarter look like for your customers, not your roadmap?" -->

<!-- CONVENTION: give each outcome an ID (### O1, ### O2 ...). The status command
     links outcomes to the assumptions behind them by that ID, so an outcome with no
     backing bet is visible. Reference the ID from product/assumptions.md (e.g. "Outcome: O1"). -->

${ctx.profile === 'full' ? `## Validated outcomes

<!-- Outcomes confirmed by data: cohort analysis, retention curves, usage metrics, or direct
     customer evidence. Each entry needs a source  -  inline (source, date) or in the frontmatter.
     If you can't name the evidence, move it to Hypothesized.

     Format: outcome statement + evidence reference + date confirmed.
     Example: "New sellers list their first item within 48h of signup (cohort data, Q1 2026)" -->

## Hypothesized outcomes

<!-- Outcomes you believe are worth pursuing but haven't yet validated with data.
     State the assumption and what would confirm it.

     Format: outcome statement + assumption + validation signal.
     Example: "Ops managers close reconciliation in <30 min  -  assumed from 3 sales calls.
     Validate: measure time-on-task for 5 ops managers over one cycle." -->
` : `## This quarter

<!-- List 2–4 outcome statements. Each should be falsifiable  -  you'll know at quarter-end
     whether it happened.

     Examples of outcome-shaped language:
     - "Ops managers can close their monthly reconciliation in under 30 minutes without
       escalating to engineering."
     - "New sellers list their first item within 48 hours of signup, without support."
     - "Teams that were blocked on data access unblock themselves using self-serve tools."

     Examples of output-shaped language to avoid:
     - "Ship the new dashboard" (feature, not behavior change)
     - "Complete the API integration" (milestone, not customer outcome)
     - "Improve retention" (direction, not a measurable change) -->
`}
`;
}
