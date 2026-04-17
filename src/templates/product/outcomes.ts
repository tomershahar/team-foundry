import type { TemplateContext } from '../../types.js';

export function outcomesTemplate(ctx: TemplateContext): string {
  return `---
purpose: Current quarter outcomes — the changes in customer behavior that define success this quarter
read_when: Prioritizing work, writing specs, deciding what to build next, evaluating tradeoffs
last_updated: ${ctx.date}
---

# Outcomes

<!-- COACH: The most common failure here is listing outputs (features, launches, milestones)
     rather than outcomes (changes in what customers do, feel, or achieve).

     Test: can you tell at the end of the quarter whether it happened?
     Output: "Launch the new onboarding flow" — ships on day 1, done, unclear if it helped.
     Outcome: "New users complete their first meaningful action within 7 days of signup" — measurable.

     If your outcomes read like a sprint plan, they're outputs. Reframe: what do you want
     customers to DO differently, or be able to DO that they couldn't before? -->

<!-- GAP: No outcomes defined yet. The onboarding interview will ask:
     "Write your outcomes in the form 'we want X to change for Y customer segment.'
     What does winning this quarter look like for your customers, not your roadmap?" -->

## This quarter

<!-- List 2–4 outcome statements. Each should be falsifiable — you'll know at quarter-end
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
`;
}
