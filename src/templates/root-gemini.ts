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

@./AGENTS.md

> [!IMPORTANT]
> The primary routing map, team identity, coach activation, and coding conventions are
> imported from **AGENTS.md** above. Follow that shared context before answering questions
> or modifying code.
`;
}
