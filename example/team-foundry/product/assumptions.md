---
purpose: Open assumptions and untested bets — things we're acting on without full evidence
read_when: When evaluating roadmap items, writing specs, or reviewing whether to continue a bet
last_updated: 2026-04-25
---

# Assumptions

*Each assumption has: what we're betting, why we believe it, how to test it, and when it expires.*

## Active assumptions

**A1 — AP leads will trust the exception UI if it explains the "why," not just the "what"**
Logged: 2026-03-10 | Expires: 2026-06-01
We believe: showing the reason for a flag (e.g., "amount 12% above 90-day average for this vendor") is sufficient to move trust scores. We're betting the entire exception UI v2 on this.
Evidence so far: Mira told us "I need to know why it flagged it, not just that it did." One customer. Directional.
How to test: post-launch interview with 5 customers on exception UI v2. Target: 4/5 say they feel confident in the flag reason without double-checking.
Last validated: 2026-04-11 (Mira session confirmed the direction, not the hypothesis)

**A2 — Approval fatigue is the primary reason approvers approve without reading**
Logged: 2026-02-18 | Expires: 2026-05-15
We believe: approvers are rubber-stamping because volume is too high, not because they don't care. If we reduce volume to only meaningful approvals, quality improves.
Evidence so far: James said "there are too many [invoices in the queue]." One data point.
How to test: track approval decision time before/after routing change. If average time per approval increases after we remove low-risk items, it suggests approvers are actually reading.
Last validated: 2026-03-28 (James session)

**A3 — Time-to-first-auto-approval is the right proxy for onboarding success**
Logged: 2026-01-22 | Expires: 2026-07-01
We believe: the moment a customer sees their first invoice auto-approved without errors is the trust-building moment. Getting there faster predicts long-term retention.
Evidence so far: 90-day retention is 3× higher for customers who hit first auto-approval in ≤5 days vs. >10 days (internal cohort analysis, N=43).
How to test: this assumption is reasonably validated. Next test: does improving time-to-first-auto-approval actually improve retention in the next 2 cohorts?
Last validated: 2026-04-02 (David's cohort analysis)

## Experiment readouts

*Completed experiments are logged here. Do not pre-fill.*

**[2026-03-15] Vendor portal adoption test**
Hypothesis: vendors will submit invoices directly if given a simple portal, reducing AP admin by 20%.
Result: 38% of vendors invited to the portal submitted at least one invoice within 30 days. AP admin time reduced by 14% on average (target was 20%). Partially validated — enough to ship, not enough to retire the assumption entirely.
Action taken: shipped vendor portal in Q1. Monitoring 60-day adoption.
