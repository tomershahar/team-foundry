import type { TemplateContext } from '../../types.js';

export function federatedDesignTemplate(ctx: TemplateContext): string {
  return `---
purpose: Routing context for the design/ folder — read before answering design questions
read_when: Any question about UI copy, visual decisions, accessibility, or tone of voice
last_updated: ${ctx.date}
---

# Design context

This folder contains the team's design principles and standards.

| Topic | File |
|---|---|
| Design principles, tone of voice, accessibility | \`principles.md\` |

Read \`principles.md\` before writing UI copy, reviewing designs, or making visual decisions. The tone and accessibility standards here apply to all customer-facing work.
`;
}
