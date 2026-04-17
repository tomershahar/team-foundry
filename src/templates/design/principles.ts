import type { TemplateContext } from '../../types.js';

export function principlesTemplate(ctx: TemplateContext): string {
  return `---
purpose: Design principles, tone of voice, and accessibility stance
read_when: Designing new features, writing copy, reviewing designs, evaluating UX tradeoffs
last_updated: ${ctx.date}
---

# Design Principles

<!-- COACH: Useful design principles resolve disagreements. If a principle doesn't help
     two people with different instincts reach the same decision, it's decorative.

     "Simple and intuitive" is decorative — everyone agrees and it resolves nothing.
     "When a feature adds complexity, default to not building it rather than adding
     progressive disclosure" resolves a real class of disagreements.

     Aim for 3–5 principles that are specific enough to be wrong — meaning a reasonable
     person could disagree with them. Those are the ones that do work. -->

<!-- GAP: No design principles defined yet. The onboarding interview will ask:
     "What's a design decision your team made that a reasonable person might disagree with?
     What principle was behind it?" -->

## Principles

<!-- For each principle:
     - State it as a clear preference, not a platitude
     - Add a brief rationale (one sentence — the "because")
     - Optionally include an example of it in practice

     Example:
     **We show one path, not all options.**
     Because our users are completing tasks under time pressure — presenting choices
     increases cognitive load without increasing success rates. When we've tested
     multiple-choice vs. guided flows, guided wins. -->

## Tone of voice

<!-- How does the product speak to users?
     The most useful format: three adjectives, then examples of what to say and what not to say.

     Example:
     **Voice:** Direct, plain, calm.
     ✓ "Your report is ready." — not "Your report has been successfully generated."
     ✓ "Something went wrong. Try again." — not "An unexpected error has occurred." -->

## Accessibility

<!-- What's the team's accessibility standard?
     Examples of specific stances:
     - "We target WCAG 2.1 AA. All new components must pass axe-core before merge."
     - "We don't have a formal standard yet. We fix obvious issues when we find them."
       (Honest for early-stage; worth naming so you can improve it.) -->
`;
}
