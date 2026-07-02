# Spec 03: AGENTS.md Compatibility Hardening

**Status:** Verification track; core bridge already delivered  
**Outcome:** Every advertised tool receives the shared routing context through a verified mechanism.  
**May run independently:** Yes

## Baseline

v3.5 already generates `AGENTS.md` for every tool choice and thin pointers for Claude
Code, Gemini CLI, Cursor, and GitHub Copilot. Re-running setup supports merge, replace,
or skip for existing instruction files. Claude-only skills are now advertised only when
Claude Code is selected.

This item must not be implemented as a new bridge. It is a characterization, compatibility,
and documentation-hardening pass over the shipped architecture.

## Compatibility Contract

| Selection | Required output | Loading contract |
|---|---|---|
| `agents` | `AGENTS.md` | The selected tool reads AGENTS.md according to its own support |
| `claude` | `AGENTS.md`, `CLAUDE.md`, Claude skills | CLAUDE.md includes AGENTS.md and may add Claude-only workflows |
| `gemini` | `AGENTS.md`, `GEMINI.md` | GEMINI.md explicitly routes the tool to AGENTS.md |
| `cursor` | `AGENTS.md`, `.cursor/rules/team-foundry.mdc` | Always-applied rule routes Cursor to AGENTS.md |
| `copilot` | `AGENTS.md`, `.github/copilot-instructions.md` | Copilot instruction file routes to AGENTS.md |
| `both` | Claude + Gemini outputs | Both pointers share one AGENTS.md source |
| `all` | All supported pointers | One AGENTS.md source; no duplicated product context |

Documentation must distinguish native AGENTS.md support from pointer-based compatibility.
Support claims need a reproducible check or authoritative tool documentation.

## Scope

- Consolidate a fixture matrix for all seven tool selections.
- Characterize expected paths and required pointer content.
- Test merge/replace/skip behavior when each root file already exists.
- Verify no tool-specific content leaks into unrelated selections.
- Audit README, docs, CLI labels, and migration messaging against the matrix.
- Correct only demonstrated gaps.

## Non-Goals

- No new context standard, symlink strategy, plugin runtime, or duplicated AGENTS content.
- No expansion to another tool without an explicit loading mechanism and fixture.
- No rewrite of working pointer templates for stylistic consistency.
- No claim that all tools interpret instructions identically.

## Development Track

### 1. Compatibility Planner

- Inventory `TemplateContext['tool']`, prompt choices, manifest routing, migration paths,
  and existing scaffold tests.
- Build a current matrix of generated paths and loading mechanisms.
- Mark each row `verified`, `documented-only`, or `unsupported`; do not infer support from branding.

### 2. Test Author: Characterization First

Add or consolidate tests before implementation:

- Exact generated path set for each tool selection and both profiles.
- Every generated pointer references `AGENTS.md`.
- AGENTS-only selection emits no pointer or Claude skills.
- Claude, both, and all emit six discoverable skill paths.
- Gemini, Cursor, Copilot, and agents selections emit no `.claude/skills/` references.
- Existing pointer merge preserves user content and inserts one managed reference.
- Replace creates a backup; skip leaves content byte-identical.
- Re-running scaffold is idempotent.
- Migration does not add unrelated tool files.

These are regression tests even when they pass immediately. The red phase begins only
for an observed contract gap.

### 3. Developer

- Fix only failing matrix rows or inaccurate documentation.
- Keep `src/manifest.ts` the single source of generated-file selection.
- Keep pointer templates thin and product context centralized in AGENTS.md.
- Add a tool only through types, prompts, manifest, template, tests, and docs together.

### 4. Test Verifier

```bash
npx tsc --noEmit
npm run lint
npm run build
```

The user runs `npm test`. Also scaffold every tool choice into isolated temporary fixtures
and compare the file tree to the matrix.

### 5. Independent Code Review

Review for:

- Tool claims unsupported by the generated mechanism.
- Product context duplicated into pointer files.
- Existing user instructions overwritten or reordered unsafely.
- Claude skills generated or advertised for non-Claude selections.
- Tests asserting strings without proving the complete path set.
- Migration and fresh-scaffold behavior diverging.

### 6. UAT

Open one generated fixture in each tool available to the maintainer and ask:

> What customer outcome is this repository optimizing for? Cite the source file.

Record tool version, generated selection, answer, and cited path. Unavailable tools remain
`documented-only`; do not call them verified.

## Acceptance Criteria

- The compatibility matrix is represented in automated fixtures.
- Every advertised path routes to one AGENTS.md source of truth.
- Existing instruction files remain protected.
- Documentation labels native and pointer-based loading accurately.
- All automated checks and available-tool UAT pass.

## Release Decision

If the existing implementation satisfies the full contract, close this item as verified
with tests and UAT evidence; do not create code churn merely to produce a release.
