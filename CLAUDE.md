# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

team-foundry is an open-source Node CLI (`npx create-team-foundry`) that helps product teams articulate outcomes, customers, decisions, and quality bars into files that AI coding tools (Claude Code, Gemini CLI) read natively. It's a culture artifact first, AI context second.

The PRD is in `team-foundry-prd-v2.md` — treat it as the source of truth for requirements.

## Status

v2 in active development. Core CLI is implemented and published to npm. See `ITERATIONS.md` for current iteration progress.

Completed: scaffold engine, all templates (solo + full + federated), cursor support, coach playbook, reality observation layer, status command, owner frontmatter.

## Architecture

- **Node CLI** — entry point is `npx create-team-foundry`. Also supports `npx create-team-foundry status`.
- **Profiles** — solo (7 files) and full (20 files flat, 26 federated). Profile controls which files are materialized on disk.
- **Tools** — `claude` (CLAUDE.md), `gemini` (GEMINI.md), `cursor` (.cursor/rules/team-foundry.mdc), `both`.
- **No backend** — zero hosted services, API keys, or token costs. Everything runs on the user's own AI tool.
- **Coach system** — instructions embedded in `.team-foundry/coach.md`, not a separate runtime. Root instruction file is kept minimal; full coach playbook loaded on demand.
- **File frontmatter** — every generated file has YAML frontmatter with `purpose`, `read_when`, `last_updated`, `owner`.

## Key Design Decisions

- Files are structured to make gaps visible, not hide them (mirror, not template pack)
- Coach is diagnostic-first: names the gap before suggesting a fix
- No silent writes — user always confirms before files are modified
- Root instruction file is kept minimal; full coach playbook loaded on demand

## Quality Standards

- TDD per iteration — tests pass before iteration is complete
- Generated content must read as written by a thoughtful senior PM, not a template
- Hell-yes standard: every file, coaching behavior, and onboarding question must be obviously essential or it's cut
