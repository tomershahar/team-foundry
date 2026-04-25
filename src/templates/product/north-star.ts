import type { TemplateContext } from '../../types.js';

export function northStarTemplate(ctx: TemplateContext): string {
  return `---
purpose: The single metric that best captures whether we're creating the value we intend to create
read_when: Setting quarterly direction, evaluating big bets, writing OKRs, onboarding new team members
last_updated: ${ctx.date}
owner: 
---

# North Star

<!-- COACH: The most common mistake here is picking a revenue or engagement metric as the
     north star. Revenue follows from value creation — it's a lag indicator. The north star
     should be the leading indicator that tells you whether you're actually delivering the
     value your customers came for.

     Airbnb's NSM is "nights booked" — not revenue. Spotify's is "time spent listening" — not
     subscriptions. Both measure whether the core value exchange happened.

     A well-chosen NSM has three properties:
     1. It measures customer value delivered, not company value captured
     2. When it goes up, you're confident the business is healthier
     3. It can be decomposed — you can identify which inputs drive it

     If your NSM goes up when you grow the team but not when customers succeed, it's the
     wrong metric. -->

<!-- GAP: No north star defined yet. The onboarding interview will ask:
     "What's the single number that, if it went up consistently, you'd be confident you
     were winning? Not revenue — what does revenue follow from?" -->

## Vision

<!-- One sentence. Specific enough that in five years you can tell whether you got there.
     "A world where small businesses run their operations without needing a finance degree."
     Not: "We want to be the leading platform for operational efficiency." -->

## North star metric

<!-- The metric. How it's defined. Where it's measured.
     Be precise: "weekly active users" is vague. "Users who complete at least one
     meaningful action (as defined in data/metrics.md) in a rolling 7-day window" is not. -->

## Balancing metrics

<!-- 2–3 metrics that guard against gaming the NSM in ways that hurt the product.
     Every NSM can be gamed. Balancing metrics make that visible.

     Example: if NSM is "tasks created," a balancing metric might be "tasks completed
     within 7 days" — because a feature that makes it easy to create junk tasks moves
     the NSM without creating value. -->
`;
}
