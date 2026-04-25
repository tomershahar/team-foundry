import type { TemplateContext } from '../../types.js';

export function decisionsReadmeTemplate(ctx: TemplateContext): string {
  return `---
purpose: Index and template for architecture decision records (ADRs)
read_when: Evaluating architectural choices, understanding why the codebase looks the way it does
last_updated: ${ctx.date}
owner: 
---

# Architecture Decisions

<!-- GAP: No decisions recorded yet. Add an ADR any time the team makes a significant
     technical decision — especially one where a future engineer might ask "why did they do it this way?" -->

Each file in this folder is an Architecture Decision Record.
Name files: \`YYYYMMDD-short-description.md\` (e.g. \`20260401-use-postgres-not-dynamodb.md\`).

## What's worth an ADR

Good candidates:
- Choosing between two real technical options where the reasons aren't obvious
- Accepting a known tradeoff (performance vs. simplicity, consistency vs. availability)
- Decisions that will be hard or expensive to reverse
- Anything where a future engineer might reasonably ask "why didn't you just use X?"

Not worth an ADR: routine implementation choices where one option is clearly better.

## ADR template

\`\`\`markdown
# [Decision title — imperative, specific]

**Date:** YYYY-MM-DD
**Status:** Proposed | Accepted | Deprecated | Superseded by [filename]

## Context

What situation prompted this decision? What constraints were we operating under?
What options did we actually consider?

## Decision

What did we decide?

## Rationale

Why this option over the alternatives? What are we trading off?
Be honest about the downsides — they're the most useful part for future engineers.

## Consequences

What becomes easier because of this decision?
What becomes harder? What's now off the table?
\`\`\`
`;
}
