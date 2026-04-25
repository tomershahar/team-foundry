import type { TemplateContext } from '../../types.js';

export function glossaryTemplate(ctx: TemplateContext): string {
  return `---
purpose: Domain terms, acronyms, and jargon specific to this team and product
read_when: Onboarding, writing specs, any time a term feels ambiguous or overloaded
last_updated: ${ctx.date}
owner: 
---

# Glossary

<!-- COACH: Every team develops vocabulary that means something specific in their context
     and something different everywhere else. "User," "customer," "account," "workspace" —
     these words carry meaning that newcomers and AI tools can only guess at.

     This file doesn't need to be comprehensive — just the terms that would confuse an
     outsider, or that the team itself uses inconsistently.

     The coach will suggest adding terms when it notices words used without definition
     in specs or conversations. -->

<!-- GAP: No terms defined yet. The onboarding interview will ask:
     "What words does your team use that would confuse someone from outside?
     What terms does your team use inconsistently with each other?" -->

<!-- Add terms alphabetically. For each entry:
     - Use the team's specific meaning, not the generic one
     - Note if the term conflicts with common usage (e.g., "seller" means X here, not Y)
     - Include acronyms the team uses regularly

     Example:

     **Listing** — a single item posted for sale by a seller. Distinct from a "product"
     (the catalog record) and a "transaction" (the completed sale). When we say "listings
     went up," we mean new posts, not catalog growth.

     **Ops** — short for "operations team," always referring to internal ops, never
     to the seller's own operations. Context: this was confusing early on and caused
     miscommunication in several planning sessions. -->
`;
}
