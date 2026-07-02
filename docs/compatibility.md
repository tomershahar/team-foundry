[<- Back to README](../README.md)

# Tool compatibility

Verified on 2026-07-02. team-foundry keeps product context in one `AGENTS.md` and
generates the smallest adapter needed by each selected tool.

## Loading contracts

| Tool | Generated mechanism | Evidence status |
|---|---|---|
| Codex | `AGENTS.md` is loaded natively | Verified locally with `codex-cli 0.142.3`; [official Codex documentation](https://developers.openai.com/codex/guides/agents-md) |
| Claude Code | `CLAUDE.md` imports `@AGENTS.md` | Verified locally 2026-07-02 with Claude Code 2.1.198 on a playground fixture ([evidence](evidence/f08-claude-uat.md)); [Claude Code documents this exact adapter](https://code.claude.com/docs/en/memory#agentsmd) |
| Gemini CLI | `GEMINI.md` imports `@./AGENTS.md` | Verified locally 2026-07-02 with Gemini CLI 0.28.2 on a playground fixture ([evidence](evidence/f08-gemini-uat.md)); [Gemini CLI documents Markdown imports](https://geminicli.com/docs/cli/gemini-md/#modularize-context-with-imports) |
| Cursor | Root `AGENTS.md` plus an always-applied rule that imports it via `@AGENTS.md` and instructs reading `AGENTS.md` by name as a fallback | Verified locally 2026-07-02 with Cursor 3.9.16 and the UAT prompt on a playground fixture: agent answered from `north-star.md` and `outcomes.md` with correct citations ([evidence](evidence/f08-cursor-uat.md)). The run verifies the route, not `@`-expansion specifically — the explicit read instruction remains the guaranteed path |
| GitHub Copilot | `.github/copilot-instructions.md` asks Copilot to follow `AGENTS.md` | Route unverified; GitHub documents both file types, but support varies by surface and no documented import syntax connects them. See [repository instructions](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions) and the [support matrix](https://docs.github.com/en/copilot/reference/custom-instructions-support) |
| Other tools | `AGENTS.md` only | User-verified: select this only when the tool version explicitly supports `AGENTS.md` |

`Documented-only` means the generated mechanism matches current authoritative
documentation, but the maintainer did not run the UAT prompt in that tool during this
verification pass. `Route unverified` means both files are supported but the handoff
between them depends on agent behavior and still needs surface-specific UAT.

## Selection matrix

Counts below are for the flat layout. For `claude`, `both`, and `all`, the optional full
federated layout adds six scoped `CLAUDE.md` files. It is not offered for other selections.

| Selection | Required adapter files | Claude skills | Solo count | Full count |
|---|---|---:|---:|---:|
| `agents` | None; `AGENTS.md` only | 0 | 7 | 23 |
| `claude` | `CLAUDE.md` | 6 | 14 | 30 |
| `gemini` | `GEMINI.md` | 0 | 8 | 24 |
| `cursor` | `.cursor/rules/team-foundry.mdc` | 0 | 8 | 24 |
| `copilot` | `.github/copilot-instructions.md` | 0 | 8 | 24 |
| `both` | `CLAUDE.md`, `GEMINI.md` | 6 | 15 | 31 |
| `all` | All four adapters | 6 | 17 | 33 |

Automated characterization covers the exact path set for both profiles, adapter content,
Claude-skill isolation, merge/replace/skip protection, repeat-run idempotency, and migration.

## Existing files

When an instruction file already exists, setup asks separately for each file:

- **Merge:** preserve user content and maintain one marked team-foundry section.
- **Replace:** save the original under `.team-foundry/backups/` before writing.
- **Skip:** leave the file byte-identical.

The v3.3 migration upgrades only instruction files already present. It does not add
adapters for tools the repository did not previously use. Existing Copilot instructions
are preserved, with the team-foundry route added as a marked managed section.

## UAT prompt

For every locally available tool, open an isolated generated fixture and ask:

> What customer outcome is this repository optimizing for? Cite the source file.

Record the tool version, selected output, answer, and cited path. Keep unavailable tools
as `documented-only` until that run is completed.
