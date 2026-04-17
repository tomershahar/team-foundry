import type { TemplateContext } from '../types.js';

export function rootGeminiTemplate(ctx: TemplateContext): string {
  return `---
purpose: Identity, routing map, and coach activation for Gemini CLI
read_when: Every session — this is the root instruction file
last_updated: ${ctx.date}
---

# GEMINI.md

This repo uses **team-foundry** — a set of structured files that give you real team context.
Read this file first. It tells you where to look for everything else.

## Who we are

<!-- GAP: Complete the onboarding interview to fill in team identity. Run: "Let's set up our team-foundry." -->

## Routing map

| You need to know… | Read… |
|---|---|
| What success looks like | \`team-foundry/product/north-star.md\` |
| What we're working toward this quarter | \`team-foundry/product/outcomes.md\` |
| Who our customers are | \`team-foundry/product/customers.md\` |
| What we're building now / next / later | \`team-foundry/product/now-next-later.md\` |
| Open assumptions and bets | \`team-foundry/product/assumptions.md\` |
| Key risks | \`team-foundry/product/risks.md\` |
| How the team is structured | \`team-foundry/team/trio.md\` |
| How we work together | \`team-foundry/team/working-agreement.md\` |
| How we use AI | \`team-foundry/team/ai-practices.md\` |
| Our tech stack and conventions | \`team-foundry/engineering/stack.md\` |
| Our stance on quality and tech debt | \`team-foundry/engineering/quality-bar.md\` |
| Past architecture decisions | \`team-foundry/engineering/decisions/\` |
| Design principles | \`team-foundry/design/principles.md\` |
| Metric definitions | \`team-foundry/data/metrics.md\` |
| Domain terms and acronyms | \`team-foundry/context/glossary.md\` |
| Stakeholders and what they care about | \`team-foundry/context/stakeholders.md\` |

## Coach

The team-foundry coach is in \`.team-foundry/coach.md\`. It activates in three ways:

- **Inline** — when your question would benefit from an empty or stale file
- **Explicit** — when you say "let's do a team-foundry review"
- **Scheduled** — weekly audit (run it by saying "run the weekly team-foundry review")

Load the coach with: "Load the team-foundry coach and run [mode]."
`;
}
