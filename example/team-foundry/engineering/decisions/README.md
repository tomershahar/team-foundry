---
purpose: Index of architecture decisions made by the Clearline engineering team
read_when: Before making a significant technical decision; when onboarding a new engineer
last_updated: 2026-04-25
---

# Architecture Decisions

Decisions are recorded here when we make a non-obvious technical choice that a future engineer might question. If it's obvious, it doesn't need a record. If it could reasonably have gone a different way and we want to remember why it went this way, it goes here.

## Index

| ADR | Decision | Date | Status |
|---|---|---|---|
| ADR-001 | Use command/query separation in the API layer | 2024-03-12 | Active |
| ADR-002 | No UI component library — maintain our own | 2024-05-20 | Active |
| ADR-003 | No database mocking in integration tests | 2024-09-08 | Active |
| ADR-004 | Staging VPC shares prod VPC (accepted risk) | 2024-11-14 | Active — under review |
| ADR-005 | Manual migration deploys, not pipeline-automated | 2025-02-03 | Active |

---

## ADR-001 — Command/query separation in the API layer

**Date:** 2024-03-12 | **Decided by:** Marcus, Priya

**Context:** The API was growing and read/write code was getting tangled. We were considering full CQRS, event sourcing, or a simpler separation.

**Decision:** Write paths go through command handler classes. Read paths query the DB directly via service functions. No event sourcing, no event bus.

**Rationale:** Full CQRS was too much infrastructure for our team size. But the co-mingling of reads and writes was causing bugs. The command pattern gave us the separation we needed without the overhead.

**Consequences:** New write endpoints always go through a command handler. Read endpoints can query directly. This means two mental models for developers — documented in onboarding.

---

## ADR-002 — No UI component library

**Date:** 2024-05-20 | **Decided by:** Leo, Marcus

**Context:** We evaluated shadcn/ui, Radix, and Mantine. All had trade-offs: too opinionated on styling, hard to override, or too heavy.

**Decision:** Maintain our own small component set in `src/components/ui/`. Currently ~25 components.

**Rationale:** We need full control over accessibility and styling. Our design system is simple enough that maintaining 25 components is cheaper than fighting a third-party library.

**Consequences:** We own the component maintenance burden. When hiring, we need to explain this — some engineers find it refreshing, some find it annoying.

---

## ADR-003 — No database mocking in integration tests

**Date:** 2024-09-08 | **Decided by:** Marcus, Priya

**Context:** We had a migration fail in production in August 2024 that our integration tests didn't catch. The tests used an in-memory mock that didn't reflect real DB behavior.

**Decision:** All integration tests hit a real test database. Seeded via factory functions. No mocking of DB layer.

**Rationale:** The August incident cost us 4 hours of incident response and a customer apology email. The cost of that incident was higher than the cost of slower tests.

**Consequences:** Integration tests are slower (~3× vs. mocked). CI takes longer. Worth it.

---

## ADR-004 — Staging VPC shares prod VPC

**Date:** 2024-11-14 | **Decided by:** Marcus

**Context:** We evaluated full VPC separation for staging vs. prod. The cost and complexity were significant for our team size.

**Decision:** Staging uses the same VPC as prod, with separate security groups. This is a known risk.

**Rationale:** At our current scale, the probability of a staging incident affecting prod is low and the cost is acceptable. This decision will be revisited at 250 customers.

**Status:** Under review — Priya has flagged that as we approach 200 customers, this risk is rising. Scheduled for architectural review in Q3 2026.

---

## ADR-005 — Manual migration deploys

**Date:** 2025-02-03 | **Decided by:** Marcus

**Context:** We considered automating database migrations in the deployment pipeline.

**Decision:** Marcus manually runs migrations in a deployment window before triggering the deploy.

**Rationale:** We've had two incidents where an automated migration ran against unexpected data and required rollback. The manual step adds 10 minutes to deployments and has prevented 3 near-misses.

**Consequences:** Marcus is a bottleneck for deployments. Priya is being trained as backup. We accept this trade-off.
