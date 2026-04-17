import type { TemplateContext } from '../../types.js';

export function aiPracticesTemplate(ctx: TemplateContext): string {
  return `---
purpose: How this team uses AI tools — what's working, what we've decided not to do, and our norms
read_when: Onboarding engineers, evaluating new AI tooling, retrospectives on AI-assisted work
last_updated: ${ctx.date}
---

# AI Practices

<!-- COACH: Most teams' AI practices are implicit — each person has their own approach and
     nobody's compared notes. This file makes them explicit, which does two things:
     (1) new team members onboard faster, and (2) the team can actually improve its practices
     instead of each person iterating in isolation.

     The most useful entries here aren't "we use Claude Code" — they're the non-obvious
     parts: the prompting patterns that work, the places where AI makes things worse,
     the review norms the team has agreed on. -->

<!-- GAP: No AI practices documented yet. The onboarding interview will ask:
     "Where is AI actually accelerating the team right now?
     Where have you tried it and found it doesn't help, or makes things worse?" -->

## Tools in use

<!-- Which AI tools, and for what specifically?
     "Claude Code for feature implementation" is less useful than
     "Claude Code for greenfield feature work and debugging; not used for migrations
     or security-sensitive changes without senior review." -->

## What's working

<!-- The concrete wins. Specific tasks or workflows where AI has measurably helped.
     Examples worth recording:
     - "Writing test scaffolding — cuts setup time from ~45 min to ~10 min."
     - "First-pass code review catches style issues before human review."
     - "Explaining unfamiliar codebases to new team members during onboarding." -->

## What we don't use AI for

<!-- Deliberate decisions about where AI isn't in the loop, and the reasoning.
     Examples:
     - "Database migrations — too easy to generate plausible-but-wrong SQL."
     - "Customer-facing copy — voice and tone require human judgment."
     - "Security-sensitive changes — reviewed by a human before any AI-suggested code merges." -->

## Review norms

<!-- How does the team review AI-generated code?
     What do you tell new engineers about AI-assisted work?
     What's the bar for merging AI-suggested changes? -->
`;
}
