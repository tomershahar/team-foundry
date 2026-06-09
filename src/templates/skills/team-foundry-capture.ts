import type { TemplateContext } from '../../types.js';

export function captureSkillTemplate(_ctx: TemplateContext): string {
  return `---
name: team-foundry-capture
description: Capture what was learned in this session into the right team-foundry file
---

# /team-foundry-capture

You have been asked to capture what was learned or decided in this session into the team's team-foundry files.

## What to do

**Do not write any file until you have shown the proposed content and received explicit confirmation.**

### Step 1  -  identify what's worth keeping

Review this conversation for:

- **Validated claims**: something that was confirmed by data, user research, or a real event (e.g., "we tested X and users did Y")
- **Decisions**: something the team chose to do or not do, and why
- **Invalidated assumptions**: something the team believed that turned out to be wrong
- **New risks or blockers**: something that emerged that could affect the work
- **Glossary terms**: domain language that came up and should be defined for the AI

Ignore: process discussions, brainstorming that went nowhere, anything already in the files.

### Step 2  -  map to the right file

| What you learned | Where it goes |
|------------------|---------------|
| An outcome is now validated | \`team-foundry/product/outcomes.md\`  -  move to Validated section, add source |
| A customer segment was confirmed | \`team-foundry/product/customers.md\`  -  add to Validated with source |
| An assumption was tested | \`team-foundry/product/assumptions.md\`  -  update status, add result |
| A key decision was made | \`team-foundry/engineering/decisions/\`  -  new ADR or update existing |
| A new risk surfaced | \`team-foundry/product/risks.md\`  -  add with impact and mitigation |
| A term needs defining | \`team-foundry/context/glossary.md\`  -  add entry |
| A metric moved | \`team-foundry/data/metrics.md\`  -  update with date and source |

### Step 3  -  write the update

For each piece of learning, draft the update text and show it to the team before writing. Include:

- The claim or decision in plain language
- The source or evidence (who said it, what data, what date)
- For validated items: update \`last_validated:\` in the frontmatter if stale

### Step 4  -  confirm and write

Show the proposed changes. Ask: "Should I write these to the files?"

Do not write anything without confirmation.
`;
}
