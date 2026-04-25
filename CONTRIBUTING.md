# Contributing to team-foundry

Thanks for your interest. team-foundry is a small, opinionated tool — contributions that sharpen the existing scope are welcome. Contributions that expand scope are considered carefully.

## What we're looking for

- Bug fixes
- Template content improvements (better coaching language, sharper onboarding questions)
- Corrections to file counts, routing maps, or frontmatter
- Test coverage gaps
- Documentation clarity

## What we're not looking for right now

- New AI tool integrations (beyond claude/gemini/cursor)
- Backend services or hosted components
- Telemetry changes
- Large new features without prior discussion

If you're unsure, open an issue first and describe what you want to change and why.

## Setup

```bash
git clone https://github.com/tomershahar/team-foundry
cd team-foundry
npm install
npm test        # all tests should pass before you start
```

## Development workflow

```bash
npm run build       # compile TypeScript via tsup
npm test            # run Vitest suite
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
```

Tests live in `src/__tests__/`. Each iteration has its own test file. Add tests for any behavior you change.

Content changes to `example/` (the Clearline worked example) have no automated tests — they're reviewed manually. If you improve example files, verify internal consistency: assumptions reference outcomes by exact heading text, Now items in now-next-later.md use `##` headings with linked assumptions, and metric names in north-star.md `### Key Metrics` match headings in data/metrics.md.

## Templates

Templates are pure functions in `src/templates/`. Each returns a string. They receive a `TemplateContext` (see `src/types.ts`). No side effects, no file I/O, no imports beyond types.

The coach template (`src/templates/coach.ts`) is the most complex. It's a large template literal with profile-conditional blocks. Read the existing patterns before adding new ones — especially how `isSolo` gates full-only content.

## Pull requests

- Keep PRs small and focused. One behavior change per PR.
- Tests must pass.
- `npm run typecheck` and `npm run lint` must pass.
- Describe what you changed and why in the PR description — not just what.
- If you're changing coaching language, explain the reasoning. Coaching text is intentional; word choices matter.

## Content standard

Generated content must read as written by a thoughtful senior PM, not a template. If it sounds like boilerplate, it's not ready. The hell-yes standard applies: every file, coaching behavior, and question must be obviously essential or it gets cut.

## Questions

Open an issue. We read them.
