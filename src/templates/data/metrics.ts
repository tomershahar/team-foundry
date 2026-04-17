import type { TemplateContext } from '../../types.js';

export function metricsTemplate(ctx: TemplateContext): string {
  return `---
purpose: Metric definitions, ownership, and data sources — so the team means the same thing
read_when: Building dashboards, writing OKRs, reviewing product health, debugging data discrepancies
last_updated: ${ctx.date}
---

# Metrics

<!-- COACH: Undefined metrics are a reliable source of team confusion.

     "Active users went up 12% this month" means something specific only if everyone agrees
     on what "active" means, what window it's measured in, and which data source is authoritative.
     Without that, two people can look at the same number and reach different conclusions.

     This file is not a dashboard — it's a definitions document. The goal is that anyone
     on the team can read an entry and know exactly what the number counts and how to find it.

     The coach will flag metrics referenced in outcomes.md that don't have definitions here. -->

<!-- GAP: No metrics defined yet. The onboarding interview will ask:
     "What are the 3–5 numbers you look at to understand whether the product is healthy?
     How is each one defined, and where does the data come from?" -->

## Definitions

<!-- For each metric:
     - Name it precisely (not "engagement" — "weekly active users")
     - Define exactly what's being counted
     - Specify the time window if applicable
     - Name the data source and who owns it
     - Note the review cadence

     Example:

     ### Weekly active users (WAU)
     **Definition:** Distinct users who triggered at least one "meaningful action" event
       (see events/meaningful-actions.ts for the full list) in a rolling 7-day window.
     **Excludes:** Internal team accounts (email domain @yourcompany.com).
     **Source:** Amplitude — "WAU" report in the Core Metrics dashboard.
     **Owner:** [Name] — ping them if numbers look wrong.
     **Reviewed:** Weekly in Monday product review. -->
`;
}
