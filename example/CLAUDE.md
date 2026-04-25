---
purpose: Identity, routing map, and coach activation — read at the start of every session
read_when: Every Claude Code session in this repo — this is the root instruction file
last_updated: 2026-04-25
---

# CLAUDE.md

This repo uses **team-foundry** — structured files that give you real team context.
Read this file first. It tells you where to find everything and how to activate the coach.

## Who we are

**Clearline** — we help mid-market finance teams process, approve, and reconcile vendor invoices without the spreadsheet chaos.

8-person product trio: Sarah Chen (PM), Marcus Rodriguez (EM), Priya Patel / Jake Morrison / Aino Virtanen (engineering), Leo Kwan / Emma Thornton (design), David Osei (analytics).

We're a B2B SaaS, 4 years old, 140 paying customers, ARR in the $3–5M range. Our customers are finance managers and AP leads at companies with 50–500 employees. We compete on workflow simplicity and speed-to-first-value, not on feature depth.

## Routing map

When the user's question relates to any of the following, read the corresponding file before answering.

| Topic | File |
|---|---|
| What success looks like / vision | `team-foundry/product/north-star.md` |
| What we're working toward this quarter | `team-foundry/product/outcomes.md` |
| Who our customers are | `team-foundry/product/customers.md` |
| What we're building now / next / later | `team-foundry/product/now-next-later.md` |
| Strategic logic and guiding policy | `team-foundry/product/strategy.md` |
| Open assumptions and untested bets | `team-foundry/product/assumptions.md` |
| Key product risks | `team-foundry/product/risks.md` |
| How the product trio works | `team-foundry/team/trio.md` |
| Team norms, DoD, ceremonies | `team-foundry/team/working-agreement.md` |
| How we use AI tools | `team-foundry/team/ai-practices.md` |
| Tech stack and conventions | `team-foundry/engineering/stack.md` |
| Quality stance and tech debt policy | `team-foundry/engineering/quality-bar.md` |
| Past architecture decisions | `team-foundry/engineering/decisions/` |
| Design principles and tone | `team-foundry/design/principles.md` |
| Metric definitions | `team-foundry/data/metrics.md` |
| Domain terms and acronyms | `team-foundry/context/glossary.md` |
| Stakeholders and what they care about | `team-foundry/context/stakeholders.md` |

## Coach

The team-foundry coach keeps these files honest over time.

| What to say | What happens |
|---|---|
| "let's do a team-foundry review" | Full audit — all files checked, findings listed |
| "coach mode" | Same as above |
| "review our outcomes" | Targeted review of one file |
| "what's missing from team-foundry?" | Lists gaps across all files |
| "run the weekly team-foundry review" | Weekly check-in, top 3 issues surfaced |

<!-- AI instructions:
     - Normal coding sessions: do NOT load coach.md. Use the routing map above to load
       specific files only when directly relevant to the user's question.
     - Explicit mode / Scheduled mode / onboarding: load .team-foundry/coach.md in full
       before activating any mode. Triggered only by the phrases in the table above.
     - Inline mode nudges: if you notice a clear gap in a team-foundry file while answering
       a normal question, surface it in one sentence — without loading the full coach.md.
       Keep it brief and non-blocking. Do not coach unprompted on back-to-back messages. -->
