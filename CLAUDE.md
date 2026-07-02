# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

team-foundry is an open-source Node CLI (`npx create-team-foundry`) that helps product
teams articulate outcomes, customers, decisions, and quality bars into repository files.
Tools receive that context through native `AGENTS.md` support or generated adapters. It's
a culture artifact first, AI context second.

## Status

v3.6.0 is published to npm. `PROGRESS.md` records current work and `feature_list.json` tracks verification state.

Implemented: manifest-driven scaffolding, solo/full/federated layouts, multi-tool pointers, project identity extraction, safe merge/replace/skip behavior, adopt and migrate flows, playground, drift status and CI gate, Claude Code skills, and prefilled feedback.

## Architecture

- **Node CLI**  -  entry point is `npx create-team-foundry`; command routing lives in `src/index.ts`.
- **Profiles**  -  solo (7-17 files), full flat (23-33), and Claude-capable federated
  (36-39). Profile and tool selection control which files are materialized on disk.
- **Tools**  -  Claude Code, Gemini CLI, Cursor, GitHub Copilot, AGENTS.md-native tools, combined selections, and all tools.
- **Manifest**  -  `src/manifest.ts` is the source of truth for generated and status-tracked files.
- **No backend**  -  zero hosted services, API keys, or token costs. Everything runs on the user's own AI tool.
- **Coach system**  -  instructions embedded in `.team-foundry/coach.md`, not a separate runtime. Root instruction file is kept minimal; full coach playbook loaded on demand.
- **File frontmatter**  -  every generated file has YAML frontmatter with `purpose`, `read_when`, `last_updated`, `owner`.

## Key Design Decisions

- Files are structured to make gaps visible, not hide them (mirror, not template pack)
- Coach is diagnostic-first: names the gap before suggesting a fix
- No silent writes  -  user always confirms before files are modified
- Root instruction file is kept minimal; full coach playbook loaded on demand
- `AGENTS.md` is the shared routing map; tool-specific files point to it
- Claude skills are generated and advertised only when the selected tool set includes Claude Code

## Quality Standards

- TDD per iteration  -  tests pass before iteration is complete
- Generated content must read as written by a thoughtful senior PM, not a template
- Hell-yes standard: every file, coaching behavior, and onboarding question must be obviously essential or it's cut
