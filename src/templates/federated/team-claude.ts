import type { TemplateContext } from '../../types.js';

export function federatedTeamTemplate(ctx: TemplateContext): string {
  return `---
purpose: Routing context for the team/ folder — read before answering team questions
read_when: Any question about who owns decisions, how the team works, or AI tool usage
last_updated: ${ctx.date}
---

# Team context

This folder describes how the product trio works and how the team operates.

| Topic | File |
|---|---|
| Who's on the trio and how decisions are made | \`trio.md\` |
| Ceremonies, DoD, working norms | \`working-agreement.md\` |
| How this team uses AI tools | \`ai-practices.md\` |

When answering questions about ownership or process, read \`trio.md\` first. It reflects how the team actually operates, not an org chart.
`;
}
