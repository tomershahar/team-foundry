import type { TemplateContext } from '../../types.js';

export function hooksTemplate(ctx: TemplateContext): string {
  return `---
purpose: Enforced behavioral instructions  -  the AI must follow these before acting
read_when: Before editing any team-foundry file; before using external tools or paid APIs
last_updated: ${ctx.date}
owner: team
---

# Hooks

These are markdown conventions, not executable scripts. They define behaviors the AI
must treat as enforced  -  not suggestions to weigh against convenience.

In v3.1, an optional \`--with-hooks\` flag will generate real Claude Code hook scripts
wired to \`.claude/settings.json\`. For now, treat this file as the enforcement layer.

---

## Before reconciling conflicting signals

Read \`.team-foundry/hierarchy.md\` first.
Do not average conflicting claims. Name the conflict, state which source wins per the
hierarchy, and note what evidence would resolve it.

**Never do:** silently pick the more recent or more confident-sounding claim without
stating which hierarchy tier it comes from.

---

## Before editing any team-foundry file

Follow the conversation-as-update protocol in \`.team-foundry/coach.md\`.

1. Surface the finding and name the gap (diagnosis message)
2. Draft the proposed change in a separate message
3. Wait for explicit confirmation before writing

**Never do:** edit team-foundry files without showing the draft and receiving
a clear "yes", "looks good", "go ahead", or equivalent. Silence is not confirmation.

---

## Before using paid tools or external MCPs

Ask first. Paid tools include: web search APIs, external MCP servers billed per call,
AI image generation, or any tool that incurs a cost outside this session.

State: what tool you want to use, why, and what the alternative is if the user declines.

**Never do:** trigger a paid or external tool call without the user's explicit approval
in the current session.
`;
}
