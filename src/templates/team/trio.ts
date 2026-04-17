import type { TemplateContext } from '../../types.js';

export function trioTemplate(ctx: TemplateContext): string {
  return `---
purpose: The product trio — who owns what decisions and how the three roles work together
read_when: Escalations, onboarding, clarifying ownership, any "who decides this?" conversation
last_updated: ${ctx.date}
---

# Team Trio

<!-- COACH: The product trio (PM, engineering lead, design lead) is the decision-making unit
     for the product. This file matters most when there's ambiguity about who decides what.

     The most common failure: the PM decides everything, engineering and design are consulted
     but not empowered. That's not a trio — it's a PM with advisors. Empowered trios make
     better decisions because the people with the deepest knowledge of each domain have real
     authority in it.

     The decision ownership table below should reflect how the trio actually operates,
     not how it's supposed to operate in theory. -->

<!-- GAP: No trio defined yet. The onboarding interview will ask:
     "Who are the three people on the product trio?
     Where does decision-making actually live right now — who has the final call on what?" -->

## Members

| Role | Person | Focus area |
|---|---|---|
| Product Manager | <!-- name --> | What to build and why |
| Engineering Lead | <!-- name --> | How to build it, tech debt, architecture |
| Design Lead | <!-- name --> | UX, flows, visual quality |

## How we make decisions

<!-- Describe the actual dynamic — not the org chart version.

     Questions worth answering:
     - Who has the final call on prioritization?
     - Who has the final call on architecture?
     - When the three of you disagree, how do you resolve it?
     - What decisions go outside the trio? -->

## Decision ownership

| Decision type | Owner | Input from |
|---|---|---|
| What to build (outcomes, prioritization) | PM | Trio |
| How to build it (architecture, tech approach) | Eng Lead | PM, Design |
| How it looks and works (UX, flows, details) | Design Lead | PM, Eng |
| When to ship | Trio | Stakeholders |

<!-- Edit this table to match how your trio actually works. If one person is making all
     decisions across all four rows, that's worth naming honestly. -->
`;
}
