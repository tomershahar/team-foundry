---
purpose: Metric definitions, ownership, and data sources — the single source of truth for what numbers mean
read_when: When discussing metrics, writing specs with success criteria, or reviewing dashboards
last_updated: 2026-04-25
---

# Metrics

*If a metric isn't defined here, it doesn't exist as an official metric. If someone cites a number in a meeting and it's not here, ask where it's defined.*

## North Star

**% of invoices processed without manual intervention** (NSM)
Definition: an invoice is "processed without manual intervention" if it moves from received → approved → posted without a human modifying it, overriding a flag, or manually routing it after the initial upload. Auto-approved invoices count. Invoices that trigger an exception but are resolved by the system based on pre-set rules count.
Owner: David
Source: production DB, `invoice_events` table, computed daily
Reported: weekly in the Monday trio sync

## Acquisition & activation

**Time-to-first-auto-approval (TTFAA)**
Definition: time in calendar days between a customer's first invoice upload and their first invoice being auto-approved without a manual override.
Owner: David
Source: `invoice_events` table
Note: we track per cohort (signup month). Current baseline: 6.2 days.

**Onboarding completion rate**
Definition: % of customers who complete the onboarding checklist (vendor setup, first upload, first approval workflow configured) within 14 days of account creation.
Owner: Sarah
Source: Mixpanel (onboarding events)
Current baseline: 74%

## Retention & engagement

**Monthly active AP leads**
Definition: any user with the AP Lead role who performs at least one invoice-related action (upload, review, approve, flag) in the calendar month.
Owner: David
Source: Mixpanel
Note: "active" means action on invoice workflow specifically — logging in alone doesn't count.

**Customer NPS**
Definition: standard NPS methodology (0–10 scale, promoters 9–10, detractors 0–6). Surveyed quarterly via email, 3 months after onboarding for new customers.
Owner: Sarah
Source: Delighted survey
Current baseline: 42

## Quality & reliability

**Auto-approval accuracy rate**
Definition: % of auto-approved invoices that were not subsequently flagged by the customer as incorrect within 30 days.
Owner: Marcus (engineering accountability), David (measurement)
Source: `invoice_overrides` table — invoices marked as incorrectly auto-approved
Current baseline: 99.1%
Note: this is a lagging indicator. Customers don't always report errors.

**P1 incident frequency**
Definition: number of P1 incidents (per definition in quality-bar.md) per calendar month.
Owner: Marcus
Source: PagerDuty + incident log
Current: 0.8/month (rolling 3-month average)

## What we don't measure (and why)

- **Feature adoption breadth** — we don't optimize for how many features customers use. Deep use of 3 features beats shallow use of 9.
- **Invoice processing volume** — a vanity metric. Volume favors large customers over happy ones.
- **Ticket resolution time** — we track ticket volume (as a signal of workflow errors), not resolution time. Resolution time incentivizes closing tickets fast, not fixing the underlying issue.
