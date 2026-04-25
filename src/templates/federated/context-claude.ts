import type { TemplateContext } from '../../types.js';

export function federatedContextTemplate(ctx: TemplateContext): string {
  return `---
purpose: Routing context for the context/ folder — read before using domain terminology
read_when: Any question involving domain terms, acronyms, or stakeholder communication
last_updated: ${ctx.date}
---

# Domain context

This folder contains the team's shared vocabulary and stakeholder map.

| Topic | File |
|---|---|
| Domain terms and acronyms | \`glossary.md\` |
| Stakeholders and what they care about | \`stakeholders.md\` |

Read \`glossary.md\` when writing specs, copy, or anything using domain-specific terms — especially terms flagged as "used inconsistently." Read \`stakeholders.md\` before drafting any communication intended for a specific stakeholder.
`;
}
