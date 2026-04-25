import type { TemplateContext } from '../../types.js';

export function federatedDataTemplate(ctx: TemplateContext): string {
  return `---
purpose: Routing context for the data/ folder — read before discussing metrics
read_when: Any question about metrics, success criteria, or what numbers mean
last_updated: ${ctx.date}
---

# Data context

This folder contains metric definitions for this team.

| Topic | File |
|---|---|
| Metric definitions, ownership, data sources | \`metrics.md\` |

Read \`metrics.md\` before citing any metric or writing success criteria in a spec. If a metric isn't defined here, it doesn't have an agreed definition — flag that rather than inventing one.
`;
}
