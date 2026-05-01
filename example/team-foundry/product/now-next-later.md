---
purpose: Roadmap in Now/Next/Later format — execution, not strategy
read_when: When discussing what's being built, sprint planning, or stakeholder updates
last_updated: 2026-04-29
last_validated: 2026-04-25
source: Q2 planning session (Sarah, Marcus, Apr 2026)
owner: Sarah
---

# Now / Next / Later

*Now = active this sprint or blocked for launch. Next = committed for this quarter. Later = real intention, no date.*

## Now (validated outcomes)

Active work connected to a validated outcome (O1–O3) with evidence backing the bet.

### Exception UI v2
→ O3: Finance managers trust the exception queue enough to stop spot-checking
Evidence: 6/10 customers manually verify auto-approvals (customer interviews, Apr 2026)
In development (Priya + Leo). Target: ship by May 9.

### Approval routing by invoice amount
→ O1: AP leads process month-end in under 2 days
Evidence: approval fatigue is the #1 NPS verbatim theme this quarter
In development (Jake). Unblocked.

### Tolerance configuration audit trail
→ O3: Finance managers trust the exception queue
Evidence: Mira Halonen raised this directly (Apr 2026 session)
Scoped, starting next sprint (Aino).

## Now (hypothesized outcomes)

Active work connected to an outcome we believe in but haven't fully validated.

### Onboarding flow rework
→ O2: New customers reach first auto-approved invoice within 5 days (hypothesis: friction in current onboarding is the cause)
What would validate it: time-to-first-auto-approval drops from 6.2 to ≤5 days in next cohort
Owner: Emma (design), Priya (eng). Requires customer journey research first (scheduled May 14).

### Multi-approver workflow (basic)
→ O4: One enterprise customer reaches 80% auto-processing rate (stretch — not yet validated)
Only starts if O1–O2 on track by May 15. Required for O4 but O4 itself is hypothesized.

### Vendor matching confidence score
→ O3: Finance managers trust the exception queue
Hypothesis: showing match confidence (not just the match result) reduces manual verification
Taru's indirect ask; not confirmed as a primary driver yet.

## Later

*Not scheduled, not promised. Current thinking, subject to change as we learn.*

- International invoice formats (VAT number validation, different date formats) — 3 customers asked; not enough to prioritize
- Mobile notification for pending approvals — James mentioned it; unclear if it changes behavior or just moves noise
- Audit package export (one-click PDF for external auditors) — common ask, low development complexity, likely Q3
- ERP write-back for SAP Business One — 6 prospects mentioned it; blocked on partnership conversation

## Recently shipped (Q1 2026)

- Bulk upload with deduplication detection
- Vendor portal (vendors submit invoices directly, reducing AP admin)
- Dashboard redesign (replaced 4 legacy views with 1 unified view)
- CSV export for reconciliation
