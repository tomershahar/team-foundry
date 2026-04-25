---
purpose: Our honest quality stance — what "done" means, what debt we accept, and what we don't
read_when: When evaluating whether something is ready to ship, reviewing a PR, or discussing tech debt
last_updated: 2026-04-25
owner: Sarah
---

# Quality Bar

## Our honest stance

We are not a zero-bug team. We are a "no bugs that erode trust with customers" team. The distinction matters.

We will ship with known cosmetic issues, minor UX inconsistencies, and internal tech debt if shipping unblocks customer value. We will not ship with bugs that could cause a customer to process an invoice incorrectly, lose data, or be unable to complete their month-end.

## What "shipped" means

Something is shipped when it's live in production for all customers (or behind a flag for design partners) and we've verified the happy path manually in production. "Shipped" is not "deployed to staging."

## Bug triage

**P1 (fix immediately, on-call owns):** Any bug that causes incorrect invoice processing, data loss, or blocks a customer from completing their workflow. SLA: acknowledged in 1 hour, fix deployed within 24 hours.

**P2 (fix within 2 sprints):** Any bug that causes incorrect data display, broken navigation, or significant UX degradation. Tracked in Linear with owner.

**P3 (backlog, no SLA):** Visual bugs, minor UX inconsistencies, internal tool issues. Reviewed quarterly. We accept that some P3 bugs stay open.

## Tech debt we accept

- Component duplication in the frontend (we've chosen pragmatic over DRY in some older parts of the codebase)
- Mixed async patterns in the API layer (some older routes use callbacks; new code uses async/await)
- Inconsistent error handling in some legacy endpoints

These are documented in `engineering/decisions/` or in Linear. We do not pretend the debt doesn't exist.

## Tech debt we do not accept

- Any security-adjacent debt (auth, permissions, data access) — this is always P1 to resolve
- Database schema debt that would require a long-running migration on a table with >1M rows — we plan schema changes carefully
- Undocumented departures from our API contract — if we change behavior, we document it

## Code review standard

Every PR gets at least one human reviewer who is not the author. The reviewer is responsible for:
- Confirming the change does what the spec says
- Flagging any bugs they find
- Confirming tests exist and make sense

The reviewer is not responsible for redesigning the approach. If you have a better approach, raise it in a comment — but that's a conversation, not a blocker unless it's a correctness issue.

## On shipping imperfect things

We have shipped things we knew weren't perfect, and we've been right to do so. The vendor portal shipped with no bulk-invite flow. Mira complained about it. We shipped it anyway because the value of getting feedback on the core flow outweighed the cost of a missing feature. We added bulk-invite in the next sprint.

We do not use quality as an excuse to delay. We use quality as a reason to be honest about what we're trading off when we ship.
