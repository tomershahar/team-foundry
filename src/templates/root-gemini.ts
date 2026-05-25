import type { TemplateContext } from '../types.js';

export function rootGeminiTemplate(ctx: TemplateContext): string {
  return `---
purpose: Root instruction pointer for Gemini CLI
read_when: startup
last_updated: ${ctx.date}
owner:
---

# GEMINI.md

This repository uses **team-foundry** for shared AI context.

> [!IMPORTANT]
> The primary routing map, team identity, coach activation, and coding conventions are
> defined in **AGENTS.md**. You MUST read \`AGENTS.md\` in full at the start of your session
> to orient yourself before answering any questions or modifying code.
`;
}
