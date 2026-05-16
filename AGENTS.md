# AGENTS.md  -  create-team-foundry

## Project Overview

`create-team-foundry` is an open-source Node CLI (`npx create-team-foundry`) that scaffolds structured context files into any repo so AI coding tools (Claude Code, Gemini CLI, Cursor) can read team outcomes, decisions, and quality bars natively.

Tech stack: TypeScript, Node 18+, tsup (build), vitest (tests), @clack/prompts (interactive CLI)

## Startup Rules

Before writing any code, complete in order:

1. Read this file completely.
2. Read `CLAUDE.md` for project overview, design decisions, and quality standards.
3. Read `ARCHITECTURE.md` to understand the layer structure.
4. Read `PROGRESS.md` to find current iteration state and next steps.
5. Read `feature_list.json` to see current feature status.

Do NOT run `bash init.sh`  -  it is currently empty.

## Run Commands

- Install: `npm install`
- Build: `npm run build`
- Dev (watch): `npm run dev`
- Tests: `npm test`  -  **do not run this directly; share the command with the user and ask them to run it**
- Type check: `npx tsc --noEmit`
- Lint: `npm run lint`

## Hard Constraints

- All code must pass type checking before commit
- Do not commit broken builds
- TDD per iteration  -  tests must pass before an iteration is complete
- No silent writes  -  user always confirms before files are modified
- Generated content must read as written by a thoughtful senior PM, not a template
- Hell-yes standard: every file, coaching behavior, and onboarding question must be obviously essential or it's cut

## Testing

- Tests live in `src/__tests__/`
- Test runner: vitest
- **Never run `npm test` yourself**  -  tell the user to run it and share output with you

## Topic Docs

- [Architecture](ARCHITECTURE.md)  -  read before modifying any layer boundaries
- [CLAUDE.md](CLAUDE.md)  -  source of truth for project design decisions
- [PROGRESS.md](PROGRESS.md)  -  current iteration state and next steps
- [feature_list.json](feature_list.json)  -  feature tracking

## Definition of Done

A feature is complete when:
1. The user has run `npm test` and reported zero errors
2. The feature appears in `feature_list.json` with status `"passing"` and evidence
3. No console errors during normal operation
4. `npx tsc --noEmit` passes

## Session Handoff

- **Start of session**: Read `PROGRESS.md`, resume from "Next Steps"
- **End of session**: Update `PROGRESS.md`, ask user to run `npm test`, commit all work
