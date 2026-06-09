import type { TemplateContext } from '../../types.js';

export function introSkillTemplate(_ctx: TemplateContext): string {
  return `---
name: team-foundry-intro
description: Team and product overview  -  great for onboarding a new session or new team member
---

# /team-foundry-intro

You have been asked to orient yourself to this team's product context.

## What to do

Read the following files in order. After reading each one, note what you learned and what questions it raises.

1. **Who we are and why we exist**
   - \`team-foundry/product/north-star.md\`  -  mission, long-term vision, success metric
   - \`team-foundry/product/customers.md\`  -  who we serve, validated segments, pain points

2. **What we're working toward**
   - \`team-foundry/product/outcomes.md\`  -  current cycle outcomes and their status
   - \`team-foundry/product/strategy.md\`  -  how we're choosing to win (if present)

3. **How we work**
   - \`team-foundry/team/trio.md\`  -  PM, engineering lead, design lead (if present)
   - \`team-foundry/team/working-agreement.md\`  -  norms and expectations (if present)

4. **What we're building on**
   - \`team-foundry/engineering/stack.md\`  -  tech stack, key constraints
   - \`team-foundry/engineering/quality-bar.md\`  -  definition of done (if present)

5. **Shared language**
   - \`team-foundry/context/glossary.md\`  -  domain terms (if present)

## After reading

Summarize what you know in three parts:

**This team exists to:** [one sentence from north-star]

**Right now they're focused on:** [current outcomes in plain language]

**Key constraints I should keep in mind:** [stack, quality bar, working agreement norms]

Then ask: "Is there anything outdated or missing from these files before we start?"

## Files that may not exist

For solo profile setups, only a subset of these files is present. Skip any that are missing  -  do not report them as errors.
`;
}
