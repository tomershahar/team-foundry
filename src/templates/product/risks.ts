import type { TemplateContext } from '../../types.js';

export function risksTemplate(ctx: TemplateContext): string {
  return `---
purpose: The four product risks — tracked so they don't become surprises at launch
read_when: Scoping new features, go/no-go decisions, discovery planning, quarterly reviews
last_updated: ${ctx.date}
---

# Risks

<!-- COACH: Most teams only track feasibility risk ("can we build it?"). The other three
     are harder to see but more often fatal.

     Value risk is the one that kills the most products: you built the thing, it works,
     and customers don't care. Usability risk is what kills the second most: you built
     the right thing but customers can't figure out how to use it.

     Each section should name specific risks, not categories. "Users might not adopt it"
     is a category. "Ops managers won't switch from their existing Excel workflow because
     they've spent two years building macros in it" is a risk you can do something about.

     The coach will flag risks older than 90 days without a mitigation or acceptance note. -->

<!-- GAP: No risks logged yet. The onboarding interview will ask:
     "What's the biggest thing that could go wrong with what you're building right now?
     What would make this a complete waste of 6 months?" -->

## Value risk

<!-- Will customers care enough to change their behavior?
     Not "is there a market" — but specifically: will the people you're building for
     actually switch from what they're doing today?

     The relevant question: what are they doing instead right now, and why would they stop? -->

## Usability risk

<!-- Can customers figure out how to get their job done using this?
     Especially: without you in the room explaining it to them.

     The relevant question: who would struggle with this, and where specifically would they get stuck? -->

## Feasibility risk

<!-- Can we actually build this with our current team, stack, and timeline?
     Name the specific technical unknowns, not just "it's complex."

     The relevant question: what's the part our engineers are least confident about? -->

## Viability risk

<!-- Does this work for the business?
     Legal, regulatory, margin, partnership dependencies, platform risk.

     The relevant question: is there anything outside our control that could make this
     impossible or not worth doing even if everything else goes right? -->
`;
}
