import type { TemplateContext } from '../../types.js';

export function stackTemplate(ctx: TemplateContext): string {
  const ext = ctx.extractedStack;
  let gapComment = '';
  let stackContent = '';

  if (ext) {
    const runtime = ext.hasTypeScript ? 'TypeScript' : 'JavaScript';
    const frameworks: string[] = [];
    const deps = { ...ext.dependencies, ...ext.devDependencies };
    if ('next' in deps) frameworks.push('Next.js');
    if ('react' in deps) frameworks.push('React');
    if ('vue' in deps) frameworks.push('Vue');
    if ('svelte' in deps) frameworks.push('Svelte');
    if ('express' in deps) frameworks.push('Express');
    if ('koa' in deps) frameworks.push('Koa');
    if ('fastify' in deps) frameworks.push('Fastify');
    if ('nest' in deps) frameworks.push('NestJS');

    const tools: string[] = [];
    if (ext.hasVitest) tools.push('Vitest');
    if (ext.hasJest) tools.push('Jest');
    if (ext.hasEslint) tools.push('ESLint');
    if (ext.hasPrettier) tools.push('Prettier');
    if ('tsup' in deps) tools.push('tsup');
    if ('vite' in deps) tools.push('Vite');
    if ('webpack' in deps) tools.push('Webpack');

    stackContent = `Auto-detected technologies:
- **Runtime:** Node.js / ${runtime}
${frameworks.length > 0 ? `- **Frameworks:** ${frameworks.join(', ')}\n` : ''}${tools.length > 0 ? `- **Tooling:** ${tools.join(', ')}\n` : ''}`;
  } else {
    gapComment = `<!-- GAP: No stack documented yet. The onboarding interview will ask:
     "What's the tech stack? What would surprise an incoming engineer about how this codebase works?" -->

`;
    stackContent = `<!-- Languages, frameworks, key libraries, infrastructure. Include versions where they matter.

     Example format:
     - **Runtime:** Node 20 / TypeScript 5.4
     - **Framework:** Next.js 14 (App Router)
     - **Database:** PostgreSQL 15 via Prisma ORM
     - **Infrastructure:** AWS  -  ECS for services, RDS for database, S3 for assets
     - **CI/CD:** GitHub Actions → ECR → ECS deploy -->`;
  }

  return `---
purpose: Tech stack, conventions, deployment pipeline, and local dev setup
read_when: Writing code, reviewing PRs, evaluating new dependencies, onboarding engineers
last_updated: ${ctx.date}
owner: 
---

# Engineering Stack

${gapComment}## Stack

${stackContent}

## Conventions

<!-- The things that would confuse a new engineer who otherwise knows the stack.
     Don't document what TypeScript or React already document  -  document what's specific to this repo.

     Examples worth capturing:
     - "All API routes are in src/app/api/ and follow REST conventions except for X."
     - "We use Zod for all runtime validation at API boundaries."
     - "Database queries go through the repository layer in src/repositories/  -  never direct Prisma
       calls in components or API routes."
     - "Feature flags are managed in src/flags.ts  -  check there before shipping anything gated." -->

## Local dev setup

<!-- The exact steps. Assume the engineer has Node installed and nothing else.
     Commands should be copy-pasteable. -->

## Deployment

<!-- How does code get from a merged PR to production?
     What environments exist? What's the rollback procedure?
     Who gets paged if something breaks in prod? -->
`;
}
