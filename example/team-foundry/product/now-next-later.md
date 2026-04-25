---
purpose: Roadmap in Now/Next/Later format — execution, not strategy
read_when: When discussing what's being built, sprint planning, or stakeholder updates
last_updated: 2026-04-25
owner: Sarah
---

# Now / Next / Later

*Now = active this sprint or blocked for launch. Next = committed for this quarter. Later = real intention, no date.*

### Now

## Exception UI v2

Assumption: A1 — AP leads will trust the exception UI if it explains the "why"
Redesigned exception detail view showing why an invoice was flagged and what to check. In development (Priya + Leo). Target: ship by May 9.

## Approval routing by invoice amount

Assumption: A2 — Approval fatigue is the primary reason approvers approve without reading
Threshold-based routing so low-risk invoices skip senior approver. In development (Jake). Unblocked.

## Tolerance configuration audit trail

Assumption: A1 — AP leads will trust the exception UI if it explains the "why"
Show history of changes to auto-approval tolerance per customer. Scoped, starting next sprint (Aino).

### Next

- **Onboarding flow rework** — reduce time-to-first-auto-approval from 6.2 to ≤5 days. Owner: Emma (design), Priya (eng). Requires customer journey research first (scheduled May 14).
- **Multi-approver workflow (basic)** — sequential approval for invoices above a configurable threshold. Required for O4 (stretch). Only starts if O1–O2 on track by May 15.
- **Vendor matching confidence score** — show AP lead how confident Clearline is in the vendor match, not just the match result. Taru's indirect ask.

### Later

- International invoice formats (VAT number validation, different date formats) — 3 customers asked; not enough to prioritize
- Mobile notification for pending approvals — James mentioned it; unclear if it changes behavior or just moves noise
- Audit package export (one-click PDF for external auditors) — common ask, low development complexity, likely Q3
- ERP write-back for SAP Business One — 6 prospects mentioned it; blocked on partnership conversation

## Recently shipped (Q1 2026)

- Bulk upload with deduplication detection
- Vendor portal (vendors submit invoices directly, reducing AP admin)
- Dashboard redesign (replaced 4 legacy views with 1 unified view)
- CSV export for reconciliation
