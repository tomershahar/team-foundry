import type { TemplateContext } from '../types.js';

export function rootCursorTemplate(_ctx: TemplateContext): string {
  // Pointer is context-agnostic: profile and tool variations are handled by AGENTS.md.
  // _ctx is accepted to satisfy the TemplateContext signature used by scaffold.ts.
  return `---
description: Team-foundry context loader for Cursor
globs: *
alwaysApply: true
---

# team-foundry

This repository uses **team-foundry** for shared AI context.

- Always read and follow the primary project overview, routing map, coach instructions, and code conventions defined in \`AGENTS.md\` before answering user requests or modifying code.
- Do not write to the \`team-foundry/\` directory without the user's explicit confirmation.
`;
}
