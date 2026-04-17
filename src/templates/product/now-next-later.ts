import type { TemplateContext } from '../../types.js';

export function nowNextLaterTemplate(ctx: TemplateContext): string {
  return `---
purpose: What we're building now, what we're committed to next, and what's directional
read_when: Sprint planning, stakeholder updates, evaluating new requests, prioritization discussions
last_updated: ${ctx.date}
---

# Now / Next / Later

<!-- COACH: This is a roadmap format, not a backlog. The key distinction:

     NOW = active work. Things in progress right now, with owners and outcomes.
     NEXT = committed but not started. Sequenced — there's a reason this comes after "now."
     LATER = directional only. Not a promise, not a queue. Subject to change as you learn.

     Common failure modes:
     - "Later" becomes a dumping ground for every idea anyone has ever had
     - "Next" is a copy of the backlog, not a commitment
     - Nothing in "now" or "next" is connected to an outcome

     The test for each item: which outcome in outcomes.md does this serve?
     If you can't answer that, the item either shouldn't be here or outcomes.md needs updating.

     The coach will flag items in "now" that have been there more than one sprint without
     moving, and "later" items that have no outcome connection. -->

<!-- GAP: No roadmap defined yet. The onboarding interview will ask:
     "What is the team actively working on right now?
     What have you committed to doing after that?
     What's directional but not yet committed?" -->

## Now

<!-- Active work. For each item: what it is, which outcome it serves, who owns it.

     Example:
     - **Self-serve report fix flow** → outcome: ops managers close reconciliation in <30 min
       Owner: [name] | Started: [date] -->

## Next

<!-- Committed, sequenced. Not just "things we want to do" — things with a clear reason
     they follow from what's in "now."

     If everything in "next" could plausibly be first, it isn't sequenced — it's a list.
     What's the actual ordering rationale? -->

## Later

<!-- Directional bets. Not scheduled, not promised. These represent current thinking,
     not commitments. Anyone reading this should understand they're subject to change
     as the team learns more.

     It's okay for "later" to be short. A short, honest "later" is better than a long,
     wishful one. -->
`;
}
