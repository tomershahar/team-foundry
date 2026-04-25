---
purpose: Strategic logic — diagnosis, guiding policy, coherent actions
read_when: When evaluating new features, setting quarterly priorities, or onboarding a new team member
last_updated: 2026-04-25
---

# Strategy

## Diagnosis

Mid-market finance teams are being sold automation tools that automate the easy 80% and leave them more exposed on the hard 20%. They end up with a system they don't trust, so they keep doing manual checks alongside it — doubling their work instead of halving it.

The core problem isn't that invoice processing is slow. It's that finance professionals can't tell, from inside the tool, whether the automation is working correctly. When they can't tell, they don't trust it. When they don't trust it, they check everything manually. The automation becomes theater.

## Guiding policy

We win on trust, not feature depth. Every roadmap decision either builds trust in the automation or it doesn't. We will not compete on the number of integrations, the breadth of ERP support, or the sophistication of the analytics layer. We will compete on: does the AP lead sleep better at night because Clearline is running?

This means we explicitly will not:
- Build features that only matter after trust is established (advanced analytics, multi-entity consolidation) until trust scores are healthy
- Expand to new invoice formats or regions until our core workflow is verifiably trusted by 80%+ of active customers
- Add approval workflow complexity (multi-tier, conditional routing) until the single-tier flow is working reliably

## Coherent actions

These are the actions that follow directly from the guiding policy:

1. **Exception UI redesign** — the current exception view shows what happened; the new one will show why Clearline flagged it and what the AP lead should check. Transparency builds trust.

2. **Approval fatigue reduction** — smart routing that separates low-risk from high-risk invoices before they reach the approver. Reduces noise, increases signal.

3. **Configurable tolerance with audit trail** — Mira's problem. The tolerance setting needs to be visible, explainable, and auditable. Black-box settings destroy trust.

4. **Time-to-first-value optimization** — customers who see the automation working on their first week are more likely to trust it long-term. Onboarding is part of trust-building.

## What this strategy says no to

- Building for the enterprise segment before SMB trust is high
- Adding analytics dashboards that don't connect to the trust narrative
- Expanding the integration catalog ahead of deepening existing integrations
