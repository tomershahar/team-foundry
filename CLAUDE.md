# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

team-foundry is an open-source Node CLI (`npx create-team-foundry`) that helps product teams articulate outcomes, customers, decisions, and quality bars into files that AI coding tools (Claude Code, Gemini CLI) read natively. It's a culture artifact first, AI context second.

The PRD is in `team-foundry-prd-v2.md` — treat it as the source of truth for requirements.

## Status

Pre-implementation. The PRD defines 13 build iterations (see Appendix B). No code exists yet.

## Architecture (from PRD)

- **Node CLI** — entry point is `npx create-team-foundry`. Scaffolds a `team-foundry/` directory with profile-aware file materialization (6 files for solo, 14 for full team).
- **No backend** — zero hosted services, API keys, or token costs. Everything runs on the user's own AI tool.
- **Coach system** — instructions embedded in generated files (`.team-foundry/coach.md`), not a separate runtime. Root `CLAUDE.md`/`GEMINI.md` contains only identity + routing map + coach pointer to preserve token budget.
- **Two profiles** — solo (1-3 people) and full (4-15 people). Single spine, profile controls which files are materialized on disk.
- **File frontmatter** — every generated file has YAML frontmatter with `purpose`, `read_when`, `last_updated`.

## Key Design Decisions

- Files are structured to make gaps visible, not hide them (mirror, not template pack)
- Coach is diagnostic-first: names the gap before suggesting a fix
- No silent writes — user always confirms before files are modified
- Skipped onboarding answers become tracked gaps (commented-out placeholders)
- Root instruction file is kept minimal; full coach playbook loaded on demand

## Build Iterations

The PRD defines iterations 1-13. Each is independently testable with TDD. UAT sign-off required between iterations. See PRD Appendix B for full details.

## Quality Standards

- TDD per iteration — tests pass before iteration is complete
- Generated content must read as written by a thoughtful senior PM, not a template
- Hell-yes standard: every file, coaching behavior, and onboarding question must be obviously essential or it's cut
