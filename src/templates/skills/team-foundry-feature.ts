import type { TemplateContext } from '../../types.js';

export function featureSkillTemplate(_ctx: TemplateContext): string {
  return `---
name: team-foundry-feature
description: Synthesize everything team-foundry knows about a specific feature or work item
---

# /team-foundry-feature

You have been asked to synthesize the full team context for a specific feature or work item.

## What to do

Ask (or infer from the conversation): **what feature or work item are we focusing on?**

Then read the team-foundry files for everything relevant to it:

### Product context
- \`team-foundry/product/outcomes.md\`  -  which outcome(s) does this feature serve?
- \`team-foundry/product/customers.md\`  -  which customer segment is this for?
- \`team-foundry/product/now-next-later.md\`  -  where does this sit in the roadmap? (if present)
- \`team-foundry/product/assumptions.md\`  -  what assumptions is this feature resting on? (if present)

### Design and quality
- \`team-foundry/design/principles.md\`  -  design constraints that apply (if present)
- \`team-foundry/engineering/quality-bar.md\`  -  definition of done (if present)

### Prior decisions
- \`team-foundry/engineering/decisions/\`  -  any ADRs that affect this feature's approach

### Domain context
- \`team-foundry/context/glossary.md\`  -  terms relevant to this feature (if present)

## Output format

Produce a feature brief:

**Feature:** [name]

**Why this matters:** [which validated outcome it moves, for which customer segment]

**Assumptions underneath it:** [open assumptions from assumptions.md that this feature depends on]

**Design constraints:** [relevant principles or quality bar items]

**Prior decisions that shape the approach:** [relevant ADRs]

**What the AI should keep in mind while working on this:** [anything that would change how code is written, what trade-offs to make, what not to do]

## If files are sparse

If the team-foundry files don't have enough to answer the questions above, say so explicitly:

"I can see this feature targets [X], but there's no validated customer segment in customers.md to confirm who it's for. Before we build, it's worth checking whether [assumption] holds."

Don't invent context. Surface the gap instead.
`;
}
