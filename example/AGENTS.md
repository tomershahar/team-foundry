---
purpose: Shared entry point for AI tools - Clearline identity, routing, and working constraints
read_when: always
last_updated: 2026-07-02
owner: Sarah
---

# Clearline

This repository is the team-foundry playground for **Clearline**, a fictional B2B SaaS
team helping mid-market finance teams process, approve, and reconcile vendor invoices
without spreadsheet chaos.

Clearline has 140 paying customers and an 8-person product team. It competes on workflow
simplicity, trust, and speed-to-first-value rather than feature breadth.

## Where to find context

Read the smallest set of files needed for the task before answering.

| Topic | Path |
|---|---|
| Vision and north star metric | `team-foundry/product/north-star.md` |
| This quarter's outcomes | `team-foundry/product/outcomes.md` |
| Customers and their evidence | `team-foundry/product/customers.md` |
| Current roadmap | `team-foundry/product/now-next-later.md` |
| Strategic logic | `team-foundry/product/strategy.md` |
| Open assumptions | `team-foundry/product/assumptions.md` |
| Key risks | `team-foundry/product/risks.md` |
| Team members and decisions | `team-foundry/team/trio.md` |
| Team norms and definition of done | `team-foundry/team/working-agreement.md` |
| AI working practices | `team-foundry/team/ai-practices.md` |
| Tech stack and conventions | `team-foundry/engineering/stack.md` |
| Quality stance | `team-foundry/engineering/quality-bar.md` |
| Architecture decisions | `team-foundry/engineering/decisions/` |
| Design principles | `team-foundry/design/principles.md` |
| Metric definitions | `team-foundry/data/metrics.md` |
| Domain terms | `team-foundry/context/glossary.md` |
| Stakeholders | `team-foundry/context/stakeholders.md` |
| Conflict precedence | `.team-foundry/hierarchy.md` |

## Working constraints

- Treat active ADRs as constraints unless the user explicitly asks to reopen a decision.
- Distinguish validated evidence from assumptions and roadmap intent.
- Cite the relevant context file when a recommendation depends on team-specific evidence.
- Never modify `team-foundry/` files without showing the proposed change and receiving
  explicit confirmation.
- Do not read from or write to `team-foundry/private/`.

## Coach

Read `.team-foundry/coach.md` before responding to `coach mode`,
`let's do a team-foundry review`, `team-foundry audit`,
`what's missing from team-foundry`, or `run the weekly team-foundry review`.

The coach drafts changes first and waits for confirmation before writing them.
