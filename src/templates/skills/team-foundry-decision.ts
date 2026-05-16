import type { TemplateContext } from '../../types.js';

export function decisionSkillTemplate(_ctx: TemplateContext): string {
  return `---
description: Draft a new architecture decision record (ADR) from the current conversation
---

# /team-foundry-decision

You have been asked to draft an Architecture Decision Record (ADR) from this conversation.

## What to do

**Do not write any file until you have shown the proposed content and received explicit confirmation.**

### Step 1  -  extract the decision

From the conversation, identify:

- **The decision**: what was chosen (one sentence)
- **The context**: what problem were we solving, what constraints existed
- **The options considered**: what else was on the table (even if briefly)
- **The rationale**: why this option over the others
- **The consequences**: what becomes easier, what becomes harder, what we're committing to

If any of these are unclear, ask before drafting.

### Step 2  -  draft the ADR

Use this format:

\`\`\`markdown
---
title: [Short descriptive title]
date: [today's date]
status: Proposed
---

## Context
[What situation or problem led to this decision. What constraints were in play.]

## Decision
[The choice made, stated as a clear action or commitment.]

## Options considered
- **[Option A]**: [Brief description and why it was considered]
- **[Option B]**: [Brief description and why it was considered]

## Rationale
[Why this option over the others. What evidence or reasoning tipped it.]

## Consequences
- What becomes easier: [...]
- What becomes harder: [...]
- What we're committing to: [...]
\`\`\`

### Step 3  -  pick the file name

ADRs go in \`team-foundry/engineering/decisions/\`. Use the format \`NNN-short-title.md\` where NNN is the next sequential number. List the files in \`team-foundry/engineering/decisions/\` to find the highest existing number, then use that number + 1. If the directory is empty or does not exist, start at \`001\`.

### Step 4  -  confirm and write

Show the draft. Ask: "Should I write this to \`team-foundry/engineering/decisions/[filename].md\`?"

Do not write without confirmation.
`;
}
