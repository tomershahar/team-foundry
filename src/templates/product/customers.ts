import type { TemplateContext } from '../../types.js';

export function customersTemplate(ctx: TemplateContext): string {
  const visibilityNote =
    ctx.repoVisibility === 'public'
      ? '\n<!-- NOTE: This repo is public. Use role/segment rather than full names. -->\n'
      : '';

  return `---
purpose: Named customers, personas, jobs to be done, and direct quotes from real conversations
read_when: Writing specs, prioritizing features, evaluating tradeoffs, any time you're guessing what customers want
last_updated: ${ctx.date}
---

# Customers
${visibilityNote}
<!-- COACH: Generic personas ("busy professionals who want efficiency") are not useful here.
     They don't resolve disagreements and they don't challenge assumptions.

     What makes this file useful is specificity:
     - A real name (or anonymized role) you can point to
     - Something they said verbatim, or close to it
     - A date you actually spoke with them — because customer knowledge decays

     "Sarah, Head of Ops at a mid-market retailer, told us in March: 'I spend every Monday
     morning fixing the same three report errors. My team thinks I have a process, but I'm
     just firefighting.'" — that's useful context. An AI can reason from that.

     The coach will flag any persona without a direct contact date in the last 60 days.
     If you haven't talked to customers recently, that's the gap worth naming. -->

<!-- GAP: No customers defined yet. The onboarding interview will ask:
     "Name three customers you've spoken to directly. For each: what did you learn,
     and when was the last time you talked to them?" -->

## Personas

<!-- For each persona below:
     - Give them a name or a specific role (not a label like "power user")
     - Record the last time you had a direct conversation with someone in this segment
     - Write the job they're trying to get done — what they hired your product to do
     - List the friction points that get in their way
     - Include at least one direct quote, verbatim or paraphrased closely

     The JTBD framing: "When [situation], I want to [motivation], so I can [expected outcome]."
     It forces you to describe the context that triggers the need, not just the need itself. -->

<!--
### [Name or role — e.g. "Marcus, Senior Ops Analyst"]
**Segment:** [Company type, size, or context]
**Last direct contact:** YYYY-MM-DD
**Job to be done:** When [situation], I want to [motivation], so I can [expected outcome].
**What gets in their way:** [Specific friction — the more concrete the better]
**Quote:** "[Something they actually said]"
**What we learned:** [The non-obvious thing — the thing that would surprise an outsider]
-->
`;
}
