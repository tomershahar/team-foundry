---
purpose: Tech stack, conventions, and deployment — what we're running and how
read_when: When writing code, reviewing PRs, evaluating new tools, or onboarding an engineer
last_updated: 2026-04-25
---

# Engineering Stack

## Core stack

**Frontend:** React 18, TypeScript, Tailwind CSS, Vite. No UI component library — we maintain our own small component set in `src/components/ui/`. The surprising thing: we have a strict rule that no component can have more than one reason to change (modified SRP). It's enforced in code review, not in tooling.

**Backend:** Node.js (Express), TypeScript, Prisma ORM, PostgreSQL. The API is a REST API with one unusual choice: we use a command/query separation pattern (not full CQRS) — write paths go through command handlers, read paths query the DB directly. This was an ADR from 2024 that's paid off.

**Infrastructure:** AWS. ECS Fargate for the API, RDS PostgreSQL, S3 for invoice PDF storage. Deployed via Terraform. The surprising thing: we have two separate RDS instances (prod and staging) but staging shares the same VPC as prod — this is a known risk and is documented in ADR-004.

**Auth:** Auth0 for customer-facing auth. Internal admin uses a separate Auth0 tenant with stricter MFA.

## Conventions

**TypeScript:** strict mode, no `any`. If you need `any`, discuss in the PR — it's almost always avoidable.

**API:** REST with consistent error envelope: `{ error: { code, message, detail } }`. Error codes are documented in `docs/api-error-codes.md`. Do not invent new error codes without adding them to the doc.

**Database:** All schema changes via Prisma migrations. No raw SQL in migrations. Migration files are named `YYYYMMDD_description`. We do not run migrations in the deploy pipeline automatically — Marcus runs them manually in a deployment window and then triggers deploy.

**Testing:** Vitest for unit, Playwright for E2E. We do not mock the database in integration tests — we learned this the hard way in 2024 (ADR-003). Test data is seeded via factory functions in `src/test/factories/`.

**PR size:** Target <400 lines changed. Over 600 lines requires a comment explaining why it couldn't be split. This isn't a rule — it's a default expectation.

## Deployment

**Release cadence:** We deploy every Tuesday and Thursday, usually between 12:00 and 14:00 UTC. Hotfixes can deploy any time with Marcus's approval.

**Deploy process:** `main` branch → automated CI → Priya or Marcus manually triggers deploy from GitHub Actions. No auto-deploy to production. Staging auto-deploys on merge to `main`.

**Feature flags:** We use LaunchDarkly. New customer-facing features ship behind a flag and are rolled out to design partners first. Flag cleanup is tracked in Linear.

**Monitoring:** Datadog for APM and logs, PagerDuty for alerting. On-call rotation is in `team/working-agreement.md`.
