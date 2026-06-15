import type { TemplateContext } from '../types.js';

export function rootCopilotTemplate(ctx: TemplateContext): string {
  return `---
purpose: Root instruction pointer for GitHub Copilot
read_when: startup
last_updated: ${ctx.date}
owner:
---

# Copilot instructions

This repository uses **team-foundry** for shared AI context.

The primary routing map, team identity, coach activation, and coding conventions are
defined in **AGENTS.md**. Read \`AGENTS.md\` in full before answering questions or
modifying code, and follow the file it routes you to for the task at hand.
`;
}
