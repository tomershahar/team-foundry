import type { TemplateContext } from '../types.js';

export function rootAgentsTemplate(ctx: TemplateContext): string {
  const isSolo = ctx.profile === 'solo';
  return `---
purpose: Entry point for AI agents — routes to team-foundry context files
read_when: always
last_updated: ${ctx.date}
owner:
---

# Agents

This repo uses **team-foundry** — structured files that give AI tools real team context.
Use this file to orient yourself and find the right files before answering.

## Project overview

<!-- GAP: The project overview hasn't been filled in yet. Run the onboarding interview to populate it. -->

## Where to find context

| Topic | Path |
|---|---|
| Vision and north star metric | \`team-foundry/product/north-star.md\` |
| This quarter's outcomes | \`team-foundry/product/outcomes.md\` |
| Who our customers are | \`team-foundry/product/customers.md\` |
| Tech stack and conventions | \`team-foundry/engineering/stack.md\` |${isSolo ? '' : `
| Current roadmap | \`team-foundry/product/now-next-later.md\` |
| Strategic logic | \`team-foundry/product/strategy.md\` |
| Open assumptions | \`team-foundry/product/assumptions.md\` |
| Key risks | \`team-foundry/product/risks.md\` |
| Team norms and DoD | \`team-foundry/team/working-agreement.md\` |
| How we use AI tools | \`team-foundry/team/ai-practices.md\` |
| Quality stance | \`team-foundry/engineering/quality-bar.md\` |
| Architecture decisions | \`team-foundry/engineering/decisions/\` |
| Design principles | \`team-foundry/design/principles.md\` |
| Metric definitions | \`team-foundry/data/metrics.md\` |
| Domain terms | \`team-foundry/context/glossary.md\` |
| Stakeholders | \`team-foundry/context/stakeholders.md\` |`}

## Setup

See \`team-foundry/engineering/stack.md\` for the tech stack, local setup steps, and environment requirements.

## Code conventions

See \`team-foundry/engineering/stack.md\` for language and framework conventions.${isSolo ? '' : `
See \`team-foundry/engineering/quality-bar.md\` for the quality bar, bug triage policy, and definition of done.`}

## Areas of caution

- **Silent edits** — the team-foundry coach never writes files without the user's explicit confirmation. Do not write to \`team-foundry/\` files without confirmation.
- **Private folder** — \`team-foundry/private/\` is gitignored. Do not read from or write to it.${isSolo ? '' : `
- **ADR commitments** — architecture decisions in \`team-foundry/engineering/decisions/\` represent committed choices. Treat them as constraints unless the user explicitly opens a discussion.`}

## Working with the team-foundry coach

The coach runs in three modes — inline (always on, surfaces one-sentence nudges), explicit (triggered by "coach mode" or "let's do a team-foundry review"), and scheduled (weekly check-in, top 3 findings). See CLAUDE.md or GEMINI.md for the full trigger phrase table and loading instructions.

**Draft-then-confirm rule:** the coach always shows a proposed file change and waits for confirmation before writing. Silence is not confirmation.
${isSolo ? '' : `
## Glossary

See \`team-foundry/context/glossary.md\` for domain terms, acronyms, and known naming inconsistencies between teams.
`}`;
}
