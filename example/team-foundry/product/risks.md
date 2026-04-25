---
purpose: Key product risks — value, usability, feasibility, viability
read_when: When evaluating new bets, writing specs, or reviewing quarterly priorities
last_updated: 2026-04-25
owner: Sarah
---

# Risks

## Value risks (will this solve the right problem?)

**R-V1 — Customers say they want trust, but what they actually need is speed**
Likelihood: medium | Impact: high
If our trust-first strategy is wrong, and customers actually leave us for a faster/cheaper product that does less careful checking, our entire Q2 bet is off.
Watch signal: churn reasons. If any churned customer in Q2 cites "too slow" or "too cautious" rather than "didn't trust it," this risk is activating.
Owner: Sarah

**R-V2 — Exception UI v2 helps the AP lead but doesn't change approver behavior**
Likelihood: medium | Impact: medium
The exception redesign is for AP leads. But approver behavior (A2) is the deeper problem. We might ship a beautiful exception view and still have approvers rubber-stamping.
Watch signal: approval decision time after routing change. If it doesn't increase, we haven't changed behavior.
Owner: Sarah + Leo

## Usability risks (will customers be able to use it?)

**R-U1 — The tolerance configuration is too technical for non-technical AP leads**
Likelihood: high | Impact: medium
The audit trail for tolerance settings (Now item) assumes customers understand what the tolerance setting does. Most don't. If we add visibility without adding explanation, we might increase confusion.
Mitigation: Emma is designing the tolerance UI with an inline explanation layer. Testing with Taru before launch.
Owner: Emma

## Feasibility risks (can we build it?)

**R-F1 — Multi-approver workflow is more complex than scoped**
Likelihood: medium | Impact: low (only affects O4, which is stretch)
Sequential approval sounds simple but has edge cases: what if approver 1 rejects? What if the invoice is edited between approvals? We've scoped the happy path. The edge cases might blow up the estimate.
Mitigation: only starting this if O1–O2 are on track. Time-boxed discovery sprint before committing to build.
Owner: Marcus + Aino

## Viability risks (can we sustain this?)

**R-Vi1 — We're dependent on a single enterprise design partner**
Likelihood: low | Impact: high
Kestrel Logistics (Mira) is our primary design partner for the exception UI. If they churn or disengage before we launch, we lose our main feedback loop.
Mitigation: recruiting a second design partner from the waitlist. Target: one more by May 15.
Owner: Sarah
