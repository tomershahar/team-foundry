# Contributing to team-foundry

Thanks for your interest. team-foundry is a small, opinionated project. Contributions are welcome but the bar is high — every addition has to earn its place.

## What we're looking for

- Bug fixes (something doesn't work as documented)
- Template improvements (content is clearer, more accurate, or better structured)
- New coach behaviors (well-reasoned, with acceptance criteria)
- Test coverage gaps

## What we're not looking for right now

- New profiles beyond solo/full
- Support for AI tools beyond Claude Code and Gemini CLI
- Integrations with external services
- UI or web app versions

If you're unsure whether something fits, open an issue before writing code.

## How to contribute

1. Fork the repo and create a branch from `main`
2. Make your change
3. Write or update tests — all PRs require passing tests
4. Run `npm test` and `npm run typecheck` locally
5. Open a pull request with a clear description of what changed and why

## Development

```bash
npm install
npm run build      # compile TypeScript
npm test           # run Vitest suite
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
```

## Template content

Templates are in `src/templates/`. Each is a pure function `(ctx: TemplateContext) => string`. Content changes don't require new tests unless they change the structural contract (frontmatter keys, section headings, required markers).

The hell-yes standard applies: every addition to a template must be obviously essential or it gets cut.

## Coach behaviors

New behaviors require:
- A clear trigger condition (what file state or user question fires it)
- A severity level (Blocker / Important / Minor)
- A "what to say" script in the coach's voice
- A "what to draft" description
- An inline trigger
- Tests in `src/__tests__/templates.test.ts`

## Code of conduct

See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
