import type { TemplateContext } from '../../types.js';

export function workingAgreementTemplate(ctx: TemplateContext): string {
  return `---
purpose: Definition of done, definition of ready, ceremonies, and team norms — the honest version
read_when: Code review, sprint planning, retrospectives, any "this isn't how we said we'd work" moment
last_updated: ${ctx.date}
owner: 
---

# Working Agreement

<!-- COACH: The value of a working agreement isn't the content — it's that it was written down.
     Undocumented norms create friction because people assume different things and don't
     know there's a disagreement until something goes wrong.

     This file should describe how the team actually works, not how it aspires to work.
     An aspirational working agreement that doesn't match reality is worse than none —
     it generates confusion and makes newer team members feel like they're missing something.

     If the honest answer is "we don't have a real DoD yet," write that. That's the gap
     worth closing. -->

<!-- GAP: No working agreement defined yet. The onboarding interview will ask:
     "What does done actually mean on your team — not in theory, in practice?
     What do you expect a piece of work to have before it enters a sprint?" -->

## Definition of done

<!-- What must be true for the team to call something shipped?

     Examples of specific DoDs:
     - "Code reviewed and merged, deployed to prod, feature flag on for internal users,
       no new errors in Sentry for 24 hours."
     - "Merged, deployed, verified by the PM in the production environment, and documented
       in the release notes."
     - "Merged. That's it for now — we're moving fast and checking in prod manually."
       (Honest and fine for early-stage teams.)

     Vague answers to avoid: "fully tested and working." Tested by whom? Working for whom? -->

## Definition of ready

<!-- What does a piece of work need before it enters a sprint or gets picked up?

     Examples:
     - "A problem statement, an acceptance criterion, and a design spec if it has UI."
     - "A ticket with enough context that an engineer can start without asking questions."
     - "We don't have a formal DoR — we discuss in planning and figure it out." -->

## Ceremonies

<!-- What rituals does the team run, at what cadence, and with what purpose?
     Be honest about which ones are actually useful vs. which are habit.

     Example format:
     - **Daily standup** — 15 min, M–F. What's blocked, what's in review, what ships today.
     - **Sprint planning** — 2 hours, fortnightly. Commit to the sprint from the "next" column.
     - **Retrospective** — 1 hour, end of sprint. What to keep, drop, or try. -->

## Norms

<!-- How does the team communicate? How do you handle disagreement?
     What would a new team member need to know to not feel like they're missing the rules?

     Examples worth documenting:
     - "We default to async communication. Slack messages don't require immediate responses."
     - "Code review feedback uses the prefix system: blocker / suggestion / nit."
     - "If you disagree with a decision, raise it in the planning meeting — not in Slack." -->
`;
}
