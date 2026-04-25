---
purpose: Vision, north star metric, and balancing metrics — the destination
read_when: When discussing product direction, prioritization, or long-term bets
last_updated: 2026-04-25
owner: Sarah
---

# North Star

## Vision

Finance teams at mid-market companies close their month-end without chasing anyone.

Today, AP leads spend 30–40% of their month-end cycle manually following up on approvals, reconciling mismatched POs, and hunting down backup documentation. We exist to make that time go to zero.

## North Star Metric

**% of invoices processed without manual intervention** (per customer, rolling 30 days)

Current baseline: 61% across active customers
Target by end of Q2 2026: 72%
Definition: an invoice is processed without manual intervention if it moves from received → approved → posted without a human touching it after the initial upload.

### Key Metrics

## North Star

Current: 61%. Target Q2: 72%.

### Balancing metrics

We track these to make sure we're not improving the NSM at the expense of what matters:

| Metric | Why it balances | Current |
|---|---|---|
| Customer NPS | Automation that breaks trust isn't automation | 42 |
| Approval exception rate | Too many auto-approvals could mean we're skipping checks that matter | 8.3% |
| Time-to-first-auto-approval (TTFAA) | NSM improvements shouldn't come at cost of onboarding | 6.2 days |
| Support ticket volume | Catches cases where automation creates downstream problems | 14/mo avg |

### Not optimizing for

We are deliberately not optimizing for invoice volume processed (a vanity metric that favors large customers over happy ones) or feature adoption breadth (we'd rather customers use 3 features deeply than 9 features shallowly).
