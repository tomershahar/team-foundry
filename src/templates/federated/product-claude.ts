import type { TemplateContext } from '../../types.js';

export function federatedProductTemplate(ctx: TemplateContext): string {
  return `---
purpose: Routing context for the product/ folder — read before answering product questions
read_when: Any question about outcomes, customers, roadmap, strategy, assumptions, or risks
last_updated: ${ctx.date}
---

# Product context

This folder contains the team's product thinking. Read the relevant file before answering.

| Topic | File |
|---|---|
| Vision and north star metric | \`north-star.md\` |
| This quarter's outcomes | \`outcomes.md\` |
| Named customers and personas | \`customers.md\` |
| What we're building now / next / later | \`now-next-later.md\` |
| Strategic logic and guiding policy | \`strategy.md\` |
| Open assumptions and untested bets | \`assumptions.md\` |
| Key product risks | \`risks.md\` |

Files with recent \`last_updated\` dates are more reliable than older ones. If asked about freshness, note if a file hasn't been updated in 60+ days.
`;
}
