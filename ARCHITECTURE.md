# Architecture  -  create-team-foundry

## System Overview

`create-team-foundry` is a Node CLI that scaffolds structured markdown context files into
any repo. It has no backend - all logic runs locally. Users run it once (or periodically)
to generate or update context consumed through native `AGENTS.md` support or tool adapters.

## Layer Diagram

```
npx create-team-foundry
        │
        ▼
   src/index.ts          ← CLI entry and command routing
        │
   ┌────┴──────────────────────────────────────────────┐
   │                                                   │
src/prompts.ts                          command modules
(interactive setup)                    status / doctor / migrate / adopt / CI / playground / feedback
        │
src/scaffold.ts          ← safe file writing, merge decisions, backups
        │
src/manifest.ts          ← source of truth for generated and tracked files
        │
src/templates/ + src/types.ts
```

## Key Modules

| File | Responsibility |
|------|---------------|
| `src/index.ts` | Entry point, command routing, first-run UX |
| `src/prompts.ts` | Interactive @clack/prompts flows |
| `src/scaffold.ts` | File writing, root-file merge behavior, backups, profile materialization |
| `src/manifest.ts` | Generated-file registry, profile/tool selection, tracked status paths |
| `src/status.ts` | `status` subcommand  -  reads existing `.team-foundry/` and reports health |
| `src/doctor.ts` | `doctor` subcommand  -  scores shared status analysis and recommends one fix |
| `src/migrate.ts` | Migration logic for existing team-foundry installations |
| `src/adopt.ts` | Imports existing AI instruction files into a reviewable transition file |
| `src/detect.ts` | Detects existing instruction files before setup/adoption |
| `src/extract.ts` | Extracts project identity and stack hints from the repository |
| `src/ci.ts` | Installs the GitHub Actions drift gate |
| `src/playground.ts` | Materializes the populated example project |
| `src/feedback.ts` | Builds and opens a prefilled GitHub feedback issue |
| `src/link-checker.ts` | Validates cross-file links in generated output |
| `src/types.ts` | Shared TypeScript types |
| `src/gitignore.ts` | Gitignore update logic |

## Profiles

| Profile | Files generated |
|---------|----------------|
| `solo` | 7 base files; 7-17 including selected adapters and skills |
| `full` | 23 base files; 23-33 including selected adapters and skills |
| `federated` | 36-39 files; Claude-capable full output plus 6 scoped routing files |

## Tools Supported

| Tool flag | Output |
|-----------|--------|
| `claude` | `AGENTS.md`, `CLAUDE.md` import, Claude skills |
| `gemini` | `AGENTS.md`, `GEMINI.md` import |
| `cursor` | `.cursor/rules/team-foundry.mdc` |
| `copilot` | `.github/copilot-instructions.md` |
| `agents` | `AGENTS.md` only; user confirms tool support |
| `both` | Claude + Gemini outputs |
| `all` | All pointer files + `AGENTS.md` |

## Data Flow

1. User runs `npx create-team-foundry`
2. `index.ts` detects if first-run or re-run, routes to appropriate flow
3. `prompts.ts` collects tool, profile, visibility, layout, and ingestion choices
4. `detect.ts` finds existing root instruction files and the user chooses merge, replace, or skip
5. `extract.ts` reads repository identity and stack hints
6. `manifest.ts` resolves the profile/tool-specific file set
7. `scaffold.ts` renders templates, protects existing content, and writes confirmed changes
8. Content lands in `team-foundry/`; operational files live in `.team-foundry/`

## Storage Layout

```
<user's repo>/
├── AGENTS.md                        ← shared routing source
├── CLAUDE.md                        ← Claude import adapter
├── GEMINI.md                        ← Gemini import adapter
├── .cursor/rules/team-foundry.mdc   ← cursor rules
├── .github/copilot-instructions.md  ← GitHub Copilot pointer
├── team-foundry/                    ← team-owned product and engineering context
│   ├── product/
│   ├── engineering/
│   └── ... (profile-dependent folders)
└── .team-foundry/                   ← coach and operational instructions
```

## Design Constraints

- No backend, no API keys, no token costs
- No silent writes  -  user confirms before any file is written or overwritten
- The shared routing source stays focused; coach playbook loads on demand
- Files expose gaps, not hide them (mirror, not template pack)
