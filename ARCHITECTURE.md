# Architecture  -  create-team-foundry

## System Overview

`create-team-foundry` is a Node CLI that scaffolds structured markdown context files into any repo. It has no backend  -  all logic runs locally. Users run it once (or periodically) to generate or update `.team-foundry/` files that their AI tools read natively.

## Layer Diagram

```
npx create-team-foundry
        │
        ▼
   src/index.ts          ← CLI entry: command routing (scaffold | status | migrate)
        │
   ┌────┴────────────────────────┐
   │                             │
src/prompts.ts           src/status.ts / src/migrate.ts
(interactive prompts)    (subcommands)
        │
src/scaffold.ts          ← core scaffold engine: resolves profile → writes files
        │
   ┌────┴────────────────┐
   │                     │
src/templates/       src/types.ts
(file templates)     (shared types)
```

## Key Modules

| File | Responsibility |
|------|---------------|
| `src/index.ts` | Entry point, command routing, first-run UX |
| `src/prompts.ts` | Interactive @clack/prompts flows |
| `src/scaffold.ts` | Template resolution, file writing, profile logic |
| `src/status.ts` | `status` subcommand  -  reads existing `.team-foundry/` and reports health |
| `src/migrate.ts` | Migration logic for existing team-foundry installations |
| `src/link-checker.ts` | Validates cross-file links in generated output |
| `src/types.ts` | Shared TypeScript types |
| `src/gitignore.ts` | Gitignore update logic |

## Profiles

| Profile | Files generated |
|---------|----------------|
| `solo` | 7 files (minimal  -  one PM working alone) |
| `full` | 20 files flat structure |
| `federated` | 26 files with squad-level subdirectories |

## Tools Supported

| Tool flag | Output |
|-----------|--------|
| `claude` | CLAUDE.md root instruction file |
| `gemini` | GEMINI.md root instruction file |
| `cursor` | `.cursor/rules/team-foundry.mdc` |
| `both` | CLAUDE.md + GEMINI.md |

## Data Flow

1. User runs `npx create-team-foundry`
2. `index.ts` detects if first-run or re-run, routes to appropriate flow
3. `prompts.ts` collects: tool, profile, team name, owner
4. `scaffold.ts` resolves template set for the profile, interpolates frontmatter, writes files
5. Files land in `.team-foundry/` with YAML frontmatter (`purpose`, `read_when`, `last_updated`, `owner`)

## Storage Layout

```
<user's repo>/
├── CLAUDE.md                        ← root AI instruction file (claude)
├── GEMINI.md                        ← root AI instruction file (gemini)
├── .cursor/rules/team-foundry.mdc   ← cursor rules
└── .team-foundry/
    ├── coach.md                     ← diagnostic coach playbook
    ├── outcomes.md
    ├── customers.md
    ├── decisions.md
    ├── quality.md
    └── ... (profile-dependent files)
```

## Design Constraints

- No backend, no API keys, no token costs
- No silent writes  -  user confirms before any file is written or overwritten
- Root instruction file stays minimal; coach playbook loaded on demand
- Files expose gaps, not hide them (mirror, not template pack)
