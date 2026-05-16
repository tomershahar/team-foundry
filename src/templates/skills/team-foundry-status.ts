import type { TemplateContext } from '../../types.js';

export function statusSkillTemplate(_ctx: TemplateContext): string {
  return `---
description: Current sprint/cycle status  -  what's on track, what's at risk, what's blocked
---

# /team-foundry-status

You have been asked for a status read on this team's current work.

## What to do

Read these files:

- \`team-foundry/product/outcomes.md\`  -  current cycle outcomes and their validation status
- \`team-foundry/product/now-next-later.md\`  -  what's in flight, what's queued (if present)
- \`team-foundry/product/assumptions.md\`  -  open assumptions that could invalidate work (if present)
- \`team-foundry/product/risks.md\`  -  known risks and their mitigations (if present)

## Report format

Produce a status report in this structure:

### On track
[Outcomes or work items that are validated and progressing. Cite the source field or inline evidence if present.]

### At risk
[Work that lacks validation, has an open assumption underneath it, or has a known risk with no mitigation. Be specific about what's missing.]

### Blocked
[Anything explicitly marked blocked or waiting on a dependency.]

### Gaps I noticed
[Files that exist but have placeholder content. Sections that are empty. Frontmatter with no \`last_validated\` date on items marked Validated. Claims in a Validated section with no \`source:\` reference.]

## Tone

Be direct. "No validated outcomes this cycle" is a useful status. "Everything looks great" when files have placeholders is not.

If the files are mostly empty or stubbed, say: "The team-foundry files exist but haven't been filled in yet. The highest-value thing right now is completing [most important missing section]."
`;
}
