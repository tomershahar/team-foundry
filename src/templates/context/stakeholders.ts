import type { TemplateContext } from '../../types.js';

export function stakeholdersTemplate(ctx: TemplateContext): string {
  return `---
purpose: Who cares about this product, what they care about, and how the team works with them
read_when: Stakeholder updates, go/no-go decisions, escalations, quarterly planning
last_updated: ${ctx.date}
---

# Stakeholders

<!-- COACH: Stakeholder management fails most often when the team doesn't have a clear
     picture of what each stakeholder actually cares about — not what they say they care about
     in all-hands meetings, but what they ask about in 1:1s and what they escalate when it's off.

     This file is most useful when it's specific: not "the CEO cares about growth"
     but "the CEO asks about new seller acquisition every week and escalates when it
     drops below 200/week." That specificity changes how you frame updates. -->

<!-- GAP: No stakeholders defined yet. The onboarding interview will ask:
     "Who outside the trio cares about what this team does?
     What does each of them actually watch, and how do you keep them informed?" -->

<!-- For each stakeholder:

     ### [Name / role]
     **What they actually care about:** [The metric or outcome they ask about most — not the official answer]
     **How they prefer to be updated:** [Format, cadence, channel]
     **What triggers an escalation from them:** [The thing that causes them to get involved]
     **Notes:** [Anything else that helps the team work with them effectively]

     Example:

     ### Head of Product
     **What they actually care about:** Whether the team is moving — velocity signals, not just outcomes.
       Asks about shipped features more than outcome metrics.
     **How they prefer to be updated:** Written weekly update in Notion by Friday EOD.
       Does not want to be pulled into standups.
     **What triggers an escalation:** Missed sprint commitments two weeks in a row, or
       a customer complaint that reaches them before it reaches the team.
     **Notes:** Prefers bad news early and in writing. Doesn't like surprises in reviews. -->
`;
}
