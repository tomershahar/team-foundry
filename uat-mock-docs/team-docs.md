# Swappie Team Docs

This folder contains our working strategy and team context. Exported for AI ingestion.

---

## What we build

Swappie is a recommerce marketplace for refurbished iPhones, operating across 12 European
markets. We buy used iPhones from consumers, grade and refurbish them, and resell them with
a warranty. The product spans a consumer-facing shop, a seller trade-in flow, and an internal
operations platform used by our grading technicians.

**Stage:** Scaling. We have strong PMF in Finland and Sweden, and are expanding into Germany
and the Netherlands.

**Team:**
- PM: Tomer (product lead)
- Eng lead: Jonas
- Design lead: Priya
- 4 backend engineers, 2 frontend engineers, 1 data analyst

---

## Outcomes this quarter

We want sellers to complete the trade-in condition assessment without contacting support.
Currently 34% of trade-in sessions end with a support chat before the seller gets a price.
Target: reduce that to under 10%.

Secondary: buyers who receive a device should feel the condition matched what was described.
Current mismatch rate (buyer-reported): 8%. Target: under 4%.

---

## North star metric

**Seller-to-buyer match rate** — the percentage of trade-in listings that result in a
completed sale within 14 days of listing. Currently 61%. Target: 72% by end of Q2.

**Balancing metrics:**
- Seller NPS (so we don't improve match rate by lowering seller price offers)
- Buyer return rate due to condition mismatch (so we don't improve match rate by
  over-describing device condition)

---

## Metrics we actually watch

1. **Match rate** — % of listings sold within 14 days. Source: internal DB, reviewed weekly.
2. **Support contact rate during trade-in** — % of trade-in sessions where seller opens
   chat before completing the flow. Source: Intercom + Amplitude. Reviewed weekly.
3. **Condition mismatch rate** — % of delivered orders where buyer reports condition doesn't
   match description. Source: post-delivery survey. Reviewed bi-weekly.
4. **Grading throughput** — devices graded per technician per day. Source: ops platform DB.
   Reviewed weekly with ops team.
5. **P1 bug count** — open P1s in Linear. Reviewed every Monday morning in planning.

---

## Customers

**Marcus Lindqvist** — private seller, Helsinki
Last contact: 2026-02-14 (user interview, 45 min)
He sells 2–3 iPhones per year when he upgrades. Main friction: the condition grading
questions feel arbitrary. He doesn't know whether a small scratch counts as "good" or
"fair" and is afraid of getting a lower price than expected.
Quote: "I just want to know before I ship it. The uncertainty is the worst part — not even
the price, just not knowing what grade I'll get."

**Sarah Korhonen** — power seller, Tampere
Last contact: 2026-01-30 (support ticket review + follow-up call)
She sells 15–20 phones per year, mostly on behalf of family and friends. Expert user.
Main frustration: the bulk listing flow breaks when adding more than 5 devices at once.
She works around it by listing one at a time. Has never contacted support about the
condition grading because she's learned the system by trial and error.
Quote: "I've figured it out, but it took me maybe 10 sessions to understand what 'good'
actually means. New sellers must be completely lost."

**Dmitri Volkov** — grading technician, warehouse ops
Last contact: 2026-03-01 (shadowing session, 2 hours)
Internal customer. Uses the ops platform 8 hours a day for physical device grading.
Main pain: the grading UI doesn't match the physical inspection order — he has to scroll
back and forth between sections. Causes mistakes and slows throughput.
Quote: "I do the screen first, always. But the form asks about the body first. So I have
to remember and go back. After 200 phones you start making errors."

---

## Assumptions (open)

1. Sellers who see a price estimate before completing the condition form will complete
   the flow at a higher rate. (Added 2026-03-10. Untested.)

2. The condition mismatch problem is primarily caused by sellers misunderstanding the
   grading rubric, not by technician grading errors. (Added 2026-02-20. Partially tested:
   technician accuracy audit showed <2% error rate, supporting this assumption.)

3. German market sellers have similar friction patterns to Finnish sellers.
   (Added 2026-03-20. Untested — German launch is Q3.)

4. Showing comparison photos for each condition grade will reduce support contact rate
   by at least 30%. (Added 2026-04-01. Untested — in design now.)

---

## Quality bar

**Tech debt stance:** We address it opportunistically. If we're touching a file, we clean
it up. We don't have a dedicated allocation but we do a "debt sprint" at the start of each
quarter — 1 week, no features. The last one was January 2026.

**Definition of "shipped":** Merged, deployed to production, and smoke-tested by the PM
in the live environment. Feature flags used for anything touching the trade-in flow.

**Current deliberate tradeoffs:**
- No automated E2E tests for the ops platform. We're moving too fast on the ops side and
  the UI changes weekly. Accepted until the ops platform stabilizes post-Q2.
- The seller trade-in flow has no component tests — only unit tests on business logic.
  We're paying this back in Q2 as part of the condition assessment redesign.

---

## How the team works

**Decision-making:** The PM has the call on prioritization. Eng lead has veto on technical
feasibility. If we can't resolve in 30 minutes, we write down the options, sleep on it,
and decide async the next morning.

**Definition of done:** Merged, deployed to prod, smoke-tested, PM notified.
For features touching the trade-in flow: also requires a 24-hour monitoring window with
no spike in support contact rate before we call it done.

**Ceremonies:**
- Monday planning (45 min) — useful. Sets the week.
- Wednesday sync (30 min) — useful. Catches blockers mid-week.
- Friday retro (30 min) — useful when we do it. We skip it 1 in 4 weeks.
- Monthly stakeholder review — useful. Forces us to synthesize.

**How we make prioritization decisions when the trio disagrees:**
Customer evidence wins. Whoever has a stronger customer signal makes the call. If it's
genuinely unclear, the PM decides and documents the reasoning in the decisions folder.

---

## Tech stack

- **Frontend:** React 18, TypeScript, Tailwind. Deployed on Vercel.
- **Backend:** Node.js / Express, TypeScript, PostgreSQL via Prisma.
- **Ops platform:** Separate React app, same stack. Deployed separately on Vercel.
- **Data:** Amplitude for product analytics, Metabase for internal dashboards.
- **CI/CD:** GitHub Actions → Vercel preview per PR → manual promote to prod.

**What would surprise an incoming engineer:**
- We have two Prisma schemas — one for the consumer app, one for the ops platform.
  They share a database but have separate schema files that must be kept in sync manually.
  There's a comment in both explaining why. Long story involving a migration gone wrong in 2024.
- The grading logic lives entirely in the backend. The frontend is a pure display layer.
  Don't put grading business logic in React components.
- Feature flags are implemented with a simple DB table — no third-party tool. The flag
  names are in `/src/config/flags.ts`.

**Deployment:** Merge to main → GitHub Actions runs tests → auto-deploys to Vercel preview.
Prod promotion is manual: a team member clicks "promote" in Vercel after smoke test.

---

## Architecture decisions

**2024-11-15 — Split Prisma schemas**
Context: We tried merging the consumer and ops schemas in November 2024. The migration
broke the ops platform for 4 hours during a high-volume grading day.
Decision: Keep two separate schema files.
Rationale: The ops platform has different access patterns and change velocity than the
consumer app. Shared schema creates coordination overhead and merge risk that outweighs
the convenience of a single file. We accept the manual sync cost.

**2025-03-01 — No third-party feature flag tool**
Context: Evaluated LaunchDarkly and Statsig in Q1 2025.
Decision: Implement feature flags with a DB table.
Rationale: Our flag usage is simple (on/off per market, no percentage rollouts needed yet).
Adding a third-party SDK adds latency and a vendor dependency for something a 20-line DB
query handles adequately. Revisit when we need percentage rollouts or A/B testing.

---

## Glossary

- **Listing** — a single device posted for sale by a seller. Not to be confused with
  "product" (the catalog record for a model) or "transaction" (the completed purchase).
- **Grade** — the condition category assigned to a device: Pristine / Good / Fair / Poor.
  Assigned by the seller during trade-in and verified by our grading technician.
- **Trade-in** — the seller flow: seller describes device condition, gets a price offer,
  ships the device. Ends when we receive and verify the device.
- **Ops platform** — the internal tool used by grading technicians. Separate app from
  the consumer-facing shop.
- **Match rate** — see North star metric above. Internally sometimes called "conversion
  rate" but match rate is the correct term — don't confuse with checkout conversion.
- **P1** — a bug that breaks a core flow for any user in production. Requires same-day fix.
  P2 is significant but not blocking. P3 is minor.

**Inconsistencies to flag:**
- "Conversion rate" is used inconsistently — sometimes means match rate, sometimes means
  checkout-to-purchase rate. Always clarify in context.
- "Admin" sometimes means the ops platform, sometimes means an internal dashboard in the
  consumer app. Use "ops platform" and "admin dashboard" to disambiguate.

---

## Stakeholders

**Ville Tolvanen — CEO**
Watches: match rate, revenue per device, market expansion progress.
Prefers: monthly written update + a 30-min sync. Doesn't want to be surprised.

**Anna Mäkinen — Head of Operations**
Watches: grading throughput, technician error rate, ops platform reliability.
Prefers: weekly Slack summary. Will escalate immediately if ops platform goes down.

**Investors (board)**
Watches: GMV, seller acquisition cost, buyer repeat purchase rate.
Prefers: monthly board deck. Tomer presents.
