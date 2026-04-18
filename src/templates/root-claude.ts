import type { TemplateContext } from '../types.js';

export function rootClaudeTemplate(ctx: TemplateContext): string {
  return `---
purpose: Identity, routing map, and coach activation — read at the start of every session
read_when: Every Claude Code session in this repo — this is the root instruction file
last_updated: ${ctx.date}
---

# CLAUDE.md

This repo uses **team-foundry** — structured files that give you real team context.
Read this file first. It tells you where to find everything and how to activate the coach.

<!-- GAP: The onboarding interview hasn't run yet.
     When the user says "Let's set up our team-foundry" or similar, do this:
     1. Read GETTING_STARTED.md for context on what to expect
     2. Load .team-foundry/coach.md — it contains the interview sequence
     3. Begin the onboarding interview as described there
     Do not improvise the interview. Follow the sequence in coach.md. -->

## Who we are

<!-- Filled in during the onboarding interview. -->

## Routing map

When the user's question relates to any of the following, read the corresponding file
before answering. Files with recent \`last_updated\` dates are more reliable than older ones.

| Topic | File |
|---|---|
| Who we are / what this product does | CLAUDE.md — "Who we are" section (this file) |
| What success looks like / vision | \`team-foundry/product/north-star.md\` |
| What we're working toward this quarter | \`team-foundry/product/outcomes.md\` |
| Who our customers are | \`team-foundry/product/customers.md\` |
| What we're building now / next / later | \`team-foundry/product/now-next-later.md\` |
| Strategic logic and guiding policy | \`team-foundry/product/strategy.md\` |
| Open assumptions and untested bets | \`team-foundry/product/assumptions.md\` |
| Key product risks | \`team-foundry/product/risks.md\` |
| How the product trio works | \`team-foundry/team/trio.md\` |
| Team norms, DoD, ceremonies | \`team-foundry/team/working-agreement.md\` |
| How we use AI tools | \`team-foundry/team/ai-practices.md\` |
| Tech stack and conventions | \`team-foundry/engineering/stack.md\` |
| Quality stance and tech debt policy | \`team-foundry/engineering/quality-bar.md\` |
| Past architecture decisions | \`team-foundry/engineering/decisions/\` |
| Design principles and tone | \`team-foundry/design/principles.md\` |
| Metric definitions | \`team-foundry/data/metrics.md\` |
| Domain terms and acronyms | \`team-foundry/context/glossary.md\` |
| Stakeholders and what they care about | \`team-foundry/context/stakeholders.md\` |

## Coach

The team-foundry coach keeps these files honest over time. It runs automatically when
it notices something relevant to your current work. You can also invoke it directly:

| What to say | What happens |
|---|---|
| "Let's set up our team-foundry" | Runs the onboarding interview (first time only) |
| "let's do a team-foundry review" | Full audit — all files checked, findings listed |
| "coach mode" | Same as above |
| "review our [outcomes / customers / stack / etc.]" | Targeted review of one file |
| "what's missing from team-foundry?" | Lists gaps across all files |
| "run the weekly team-foundry review" | Weekly check-in, top 3 issues surfaced |

<!-- AI instructions:
     - Normal coding sessions: do NOT load coach.md. Use the routing map above to load
       specific files only when directly relevant to the user's question.
     - Coach mode (explicit/scheduled/onboarding): load .team-foundry/coach.md in full
       before responding. Triggered only by the phrases in the table above.
     - Inline nudges: if you notice a clear gap in a team-foundry file while answering
       a normal question, surface it in one sentence — without loading the full coach.md.
       Keep it brief and non-blocking. Do not coach unprompted on back-to-back messages. -->
`;
}
