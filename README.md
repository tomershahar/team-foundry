# team-foundry

**Great products come from teams that share context. When the PM's AI, the engineer's AI, and the designer's AI all know different things, the work fragments and customers feel it. team-foundry puts your team's context in one place every AI reads.**

[![npm](https://img.shields.io/npm/v/create-team-foundry)](https://www.npmjs.com/package/create-team-foundry)
[![npm downloads](https://img.shields.io/npm/dw/create-team-foundry)](https://www.npmjs.com/package/create-team-foundry)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

```bash
npx create-team-foundry
```

![Three teammates — PM on Claude Code, Engineer on Cursor, Designer on Gemini CLI — all connected to a shared AGENTS.md](assets/hero.svg)

---

## See it in action

The [`example/`](example/) folder is a complete team-foundry for Clearline, a fictional 8-person B2B SaaS team. Open it in Claude Code or Cursor and ask:

- *"What are we working toward this quarter?"*
- *"Should we prioritize collaborative editing?"*
- *"What architecture decisions have we made and why?"*

The AI answers with your team's actual context. No guessing.

```bash
git clone https://github.com/tomershahar/team-foundry-example
```

---

## How it works

One person runs `npx create-team-foundry` in the shared repo. The CLI generates `AGENTS.md` (the shared context every AI tool reads) plus thin pointer files for each tool your team uses. Commit and push. Teammates `git pull`. Done.

No cloud. No sync service. No accounts. Git is the sync.

---

## Supported tools

| Tool | Files generated |
|---|---|
| Claude Code | `CLAUDE.md` (pointer) + `AGENTS.md` |
| Gemini CLI | `GEMINI.md` (pointer) + `AGENTS.md` |
| Cursor | `.cursor/rules/team-foundry.mdc` (pointer) + `AGENTS.md` |
| Both (Claude + Gemini) | `CLAUDE.md` + `GEMINI.md` (pointers) + `AGENTS.md` |
| All tools (Recommended) | All pointers + `AGENTS.md` |

---

## Learn more

- [How it works](docs/how-it-works.md) — architecture, AGENTS.md primacy, pointer files, detect-and-merge, drift detection
- [The coach](docs/coach.md) — drift detection patterns, trigger phrases, three modes, the flywheel
- [Claude Code skills](docs/skills.md) — six slash commands and their file layout
- [Profiles](docs/profiles.md) — solo, full, federated; file counts and frontmatter
- [Migrating](docs/migrate.md) — upgrade paths from v2 and v3.x to v3.3
- [Getting buy-in](docs/getting-buy-in.md) — handling team objections
- [Changelog](CHANGELOG.md)

---

## Requirements

Node 18+. Claude Code, Gemini CLI, Cursor, or any AI tool that reads files from your repo.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT
