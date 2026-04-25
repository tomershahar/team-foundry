import type { TemplateContext } from '../../types.js';

export function qualityBarTemplate(ctx: TemplateContext): string {
  return `---
purpose: The team's honest stance on tech debt, bugs, and what "shipped" actually means
read_when: Code review, sprint planning, evaluating shortcuts, any quality-vs-speed conversation
last_updated: ${ctx.date}
owner: 
---

# Quality Bar

<!-- COACH: This file asks for the honest answer, not the aspirational one.

     "We aim for zero tech debt" is not useful — no team achieves it. "We address tech debt
     one sprint per quarter and consciously accept it otherwise" is honest and actionable.

     The reason this matters: teams with unwritten quality standards make the same arguments
     in every code review. The same people make the same points. Nothing gets resolved.
     A written quality bar is a decision that was made once, clearly, so it doesn't need
     to be relitigated every time someone wants to ship fast.

     The coach will surface this file when it notices a mismatch — if your quality bar says
     "zero tolerance for open bugs" but the commit history shows 3 months of bug accumulation,
     it will name that gap directly. That's the point. Not to shame the team, but to make
     the tradeoff visible so you can decide whether you're okay with it. -->

<!-- GAP: No quality bar defined yet. The onboarding interview will ask:
     "What's your team's honest stance on tech debt and bugs?
     Not what you wish it were — what it actually is right now." -->

## Our stance on tech debt

<!-- How does the team actually handle tech debt — not how you'd like to?

     Examples of honest answers:
     - "We pay it down in Q4 each year and live with it the rest of the time."
     - "We address it opportunistically — when we touch code, we improve it."
     - "We're in a period of intentional accumulation to hit a launch date.
       We've agreed to a 30% slowdown budget afterward to pay it back."
     - "We don't have a policy, which means it accumulates by default."
       (This is also a valid honest answer.) -->

## Our stance on bugs

<!-- What's the actual policy on bugs? What severity thresholds trigger what response?

     Examples:
     - "P0 (data loss, security) — fix before anything else ships."
     - "P1 (core flow broken) — fix within 48 hours."
     - "P2 and below — triaged into the backlog, addressed when convenient."
     - "We don't triage bugs systematically right now." -->

## Definition of "shipped"

<!-- What must be true for the team to call something done?

     Be specific. Examples:
     - "Code merged to main, deployed to prod, and the feature flag is on for 10% of users."
     - "Deployed to prod with monitoring alerts configured and an on-call owner named."
     - "Merged, deployed, and verified by a team member in the production environment."

     "Merged" is not shipped. What's the full definition? -->

## Current deliberate tradeoffs

<!-- What quality gaps are you consciously accepting right now, and why?
     This section is most valuable when it has a time horizon:
     "We're accepting [X] until [date/milestone] because [reason]." -->
`;
}
