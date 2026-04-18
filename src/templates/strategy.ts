import type { TemplateContext } from '../types.js';

export function strategyTemplate(ctx: TemplateContext): string {
  return `---
purpose: The strategic logic connecting our north-star gap to what we're building. Read before adding anything to the roadmap.
read_when: Roadmap planning, evaluating new feature requests, quarterly retrospective, when a new item is proposed for Now or Next
last_updated: ${ctx.date}
---

# Strategy

> **Coach note — first fill:** The guiding policy is only useful if it says no to something.
> "We want to be the best product tool" is not a strategy. "We win by X,
> which means we won't do Y" is.
>
> Start with the Diagnosis: open \`north-star.md\` and ask yourself — what is the
> biggest obstacle currently stopping us from hitting that metric? That answer is
> the Diagnosis.

## Diagnosis

<!-- What is the specific challenge we are solving? Not a goal — a named problem
     with evidence. Anchor this to the gap in your north-star.md metric.

     Example: "Activation is stuck at 45% for SMB. Teams sign up, connect their
     tools, and then stop — not because they don't see value, but because the first
     session doesn't pull them into a real workflow."

     Bad: "We want to grow faster."
     Good: "Our NSM is at X, 18 points below target. The data shows the gap is
            entirely in the first 7 days — teams that activate retain at 78%." -->

---

## Guiding Policy

<!-- The approach that addresses the diagnosis — what you're betting on, and
     explicitly what you are NOT doing.

     Coach will ask: if your policy doesn't rule something out, it isn't a strategy yet.
     Before saving this section, complete the sentence: "We win by X, which means
     we won't do Y."

     Example: "We win by being the easiest tool for the finance-averse founder.
     We are not building an enterprise platform — no SSO, no multi-entity
     consolidation, no RBAC beyond owner/submitter."

     What we're saying no to this year:
     - [Thing 1 you are explicitly not pursuing]
     - [Thing 2 you are explicitly not pursuing] -->

---

## Coherent Actions

<!-- GAP: No coherent actions defined yet. These should directly address the diagnosis.

     Initiatives that directly reinforce the guiding policy. Each item here should
     have a clear answer to: "how does this address the diagnosis?"

     <!-- BAD: "Improve the dashboard" — vague, no connection to diagnosis or guiding policy -->
     <!-- GOOD: "Guided first-run wizard" — directly addresses the activation gap in the diagnosis -->

     Add your current coherent actions below: -->

`;
}
