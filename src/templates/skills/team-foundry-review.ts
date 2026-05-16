import type { TemplateContext } from '../../types.js';

export function reviewSkillTemplate(_ctx: TemplateContext): string {
  return `---
description: Full team-foundry audit by the coach  -  all files, findings by severity
---

# /team-foundry-review

You have been asked to audit this team's team-foundry files and act as a diagnostic coach.

## What to do

Read every team-foundry file that exists:

- \`team-foundry/product/\`  -  all files
- \`team-foundry/team/\`  -  all files (if present)
- \`team-foundry/engineering/\`  -  all files
- \`team-foundry/design/\`  -  all files (if present)
- \`team-foundry/data/\`  -  all files (if present)
- \`team-foundry/context/\`  -  all files (if present)
- \`.team-foundry/coach.md\`  -  coaching playbook (if present)

## Audit findings format

Group findings by severity:

### Critical  -  acting on bad information
[Claims marked Validated with no \`source:\` reference or inline evidence. Outcomes with no signal. Decisions that contradict each other. These are the cases where the AI is most likely to give wrong advice.]

### Important  -  gaps that limit usefulness
[Files with placeholder content. Missing sections for the profile. Stale \`last_validated\` dates (>90 days). Outcomes with no owner. Assumptions with no test plan.]

### Suggestions  -  would strengthen the context
[Things that would make AI answers more specific: adding a source to a hypothesis, filling in a glossary term, adding a stakeholder. Low urgency.]

## After findings

Recommend the top 3 actions in priority order. For each one, say:
- What to do (one sentence)
- Which file to update
- Why it matters for AI accuracy

## Tone

Name gaps directly. "outcomes.md has four outcomes, three of which are placeholders with no signal" is useful. Softening findings makes the audit pointless.
`;
}
