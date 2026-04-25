import type { TemplateContext } from '../../types.js';

export function federatedEngineeringTemplate(ctx: TemplateContext): string {
  return `---
purpose: Routing context for the engineering/ folder — read before answering technical questions
read_when: Any question about the stack, conventions, tech debt, or past architecture decisions
last_updated: ${ctx.date}
---

# Engineering context

This folder contains the team's technical context. Read before writing or reviewing code.

| Topic | File |
|---|---|
| Stack, conventions, deployment | \`stack.md\` |
| Quality stance and tech debt policy | \`quality-bar.md\` |
| Past architecture decisions | \`decisions/\` |

Always read \`stack.md\` before writing code for this repo — it contains the conventions and the non-obvious choices that would surprise an outsider. Read the relevant ADR in \`decisions/\` before making a technical decision that's already been decided.
`;
}
