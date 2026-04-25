import type { TemplateContext } from '../../types.js';

export function stackTemplate(ctx: TemplateContext): string {
  return `---
purpose: Tech stack, conventions, deployment pipeline, and local dev setup
read_when: Writing code, reviewing PRs, evaluating new dependencies, onboarding engineers
last_updated: ${ctx.date}
owner: 
---

# Engineering Stack

<!-- GAP: No stack documented yet. The onboarding interview will ask:
     "What's the tech stack? What would surprise an incoming engineer about how this codebase works?" -->

## Stack

<!-- Languages, frameworks, key libraries, infrastructure. Include versions where they matter.

     Example format:
     - **Runtime:** Node 20 / TypeScript 5.4
     - **Framework:** Next.js 14 (App Router)
     - **Database:** PostgreSQL 15 via Prisma ORM
     - **Infrastructure:** AWS — ECS for services, RDS for database, S3 for assets
     - **CI/CD:** GitHub Actions → ECR → ECS deploy -->

## Conventions

<!-- The things that would confuse a new engineer who otherwise knows the stack.
     Don't document what TypeScript or React already document — document what's specific to this repo.

     Examples worth capturing:
     - "All API routes are in src/app/api/ and follow REST conventions except for X."
     - "We use Zod for all runtime validation at API boundaries."
     - "Database queries go through the repository layer in src/repositories/ — never direct Prisma
       calls in components or API routes."
     - "Feature flags are managed in src/flags.ts — check there before shipping anything gated." -->

## Local dev setup

<!-- The exact steps. Assume the engineer has Node installed and nothing else.
     Commands should be copy-pasteable. -->

## Deployment

<!-- How does code get from a merged PR to production?
     What environments exist? What's the rollback procedure?
     Who gets paged if something breaks in prod? -->
`;
}
