# Cross-Tool Support Refactor — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make AGENTS.md the single source of truth for team context; reduce tool-specific files to thin pointers; add an "all tools" option; detect-and-merge existing files; and document skill parity for Cursor/Codex users.

**Architecture:** Four coordinated changes: (1) rewrite four root templates so AGENTS.md is primary and CLAUDE.md/GEMINI.md/.cursor rule are pointers, (2) add `tool='all'` and a new detect+merge flow separated cleanly between a pure `detect.ts` helper, prompt logic in `prompts.ts`, and pure data flow into `scaffold.ts`, (3) extend `status.ts` with pointer drift detection, (4) extend `migrate.ts` with a v3.3 case that upgrades existing team-foundry repos.

**Tech Stack:** TypeScript, Node.js, Vitest (tests), `@clack/prompts` (CLI UI), `fs/promises` (file I/O). Run tests with `npm test`.

---

## File map

| File | Role after this change |
|---|---|
| `src/types.ts` | Add `'all'` to `tool` union; add `mergeDecisions` to `ScaffoldOptions` |
| `src/templates/root-agents.ts` | Full primary content (routing map + coach + renamed skills section) |
| `src/templates/root-claude.ts` | Pointer: `@AGENTS.md` directive + `> [!IMPORTANT]` callout + skill table only |
| `src/templates/root-gemini.ts` | Pointer: `> [!IMPORTANT]` callout only |
| `src/templates/root-cursor.ts` | Pointer: frontmatter (`alwaysApply: true`, `globs: *`) + prose instruction |
| `src/detect.ts` | New — `detectExistingFiles(targetDir)`: scans for pre-existing root instruction files |
| `src/scaffold.ts` | `rootEntries()` handles `'all'`; write loop consults `mergeDecisions`; merge/replace/skip logic |
| `src/prompts.ts` | Add `'all'` option (first, recommended); add `runMergePrompts()` |
| `src/index.ts` | Wire detect → merge prompts → pass `mergeDecisions` into `scaffold()`; update `TOOL_LABEL` |
| `src/status.ts` | Add `checkPointerFiles()` and print pointer section in status output |
| `src/migrate.ts` | Add `'v3.3'` `MigrateState` and `migrateToV33()` |
| `docs/skill-parity.md` | New — parity table for Cursor and Codex workflows |
| `src/__tests__/detect.test.ts` | New — unit tests for `detectExistingFiles` |
| `src/__tests__/scaffold.test.ts` | Extend — `tool='all'`, merge/replace/skip, pointer content |
| `src/__tests__/status.test.ts` | Extend — pointer drift detection |
| `src/__tests__/migrate.test.ts` | Extend — v3.3 migration |

---

## Task 1: Extend types

**Files:**
- Modify: `src/types.ts`

- [ ] **Step 1: Add `'all'` to the tool union and `mergeDecisions` to `ScaffoldOptions`**

Replace the current `types.ts` content with:

```typescript
/**
 * Context passed to every template function.
 */
export interface TemplateContext {
  profile: 'solo' | 'full';
  tool: 'claude' | 'gemini' | 'cursor' | 'both' | 'all';
  repoVisibility: 'public' | 'internal' | 'private';
  /** ISO date string YYYY-MM-DD */
  date: string;
  ingestionPath?: string;
  ingestion?: 'local' | 'mcp' | 'paste' | 'skip' | 'repo' | 'repo+local' | 'repo+mcp' | 'repo+paste';
  /** Whether to generate per-folder CLAUDE.md files (full profile only; ignored for solo) */
  federated?: boolean;
  /** Auto-extracted stack details from package.json */
  extractedStack?: {
    name?: string;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    hasTypeScript?: boolean;
    hasVitest?: boolean;
    hasJest?: boolean;
    hasEslint?: boolean;
    hasPrettier?: boolean;
  };
}

/**
 * Full options collected from the CLI prompts + derived values.
 */
export interface ScaffoldOptions extends TemplateContext {
  /** Absolute path to the directory being scaffolded into */
  targetDir: string;
  ingestion: 'local' | 'mcp' | 'paste' | 'skip' | 'repo' | 'repo+local' | 'repo+mcp' | 'repo+paste';
  /**
   * Per-file decisions for existing root instruction files detected before scaffold.
   * Key: relative path (e.g. 'CLAUDE.md', '.cursor/rules/team-foundry.mdc').
   * Missing key defaults to 'merge'.
   */
  mergeDecisions?: Record<string, 'merge' | 'replace' | 'skip'>;
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /Users/tomershahar/Documents/Projects/team-foundry && npx tsc --noEmit
```

Expected: no errors (the `tool` union expansion is backward-compatible).

- [ ] **Step 3: Commit**

```bash
git add src/types.ts
git commit -m "feat(types): add 'all' tool option and mergeDecisions to ScaffoldOptions"
```

---

## Task 2: Rewrite `root-agents.ts` — primary file

AGENTS.md is now the single source of truth. It gets the full routing map, full coach section, and the (renamed) Claude Code skills section. It no longer defers to CLAUDE.md for anything.

**Files:**
- Modify: `src/templates/root-agents.ts`
- Test: `src/__tests__/templates.test.ts` (extend existing)

- [ ] **Step 1: Write the failing test**

Open `src/__tests__/templates.test.ts`. Add at the bottom of the existing describe block (or in a new one):

```typescript
import { rootAgentsTemplate } from '../templates/root-agents.js';

describe('rootAgentsTemplate()', () => {
  const baseCtx: TemplateContext = {
    profile: 'full',
    tool: 'claude',
    repoVisibility: 'internal',
    date: '2026-05-25',
    ingestion: 'skip',
  };

  it('contains the routing map table', () => {
    const out = rootAgentsTemplate(baseCtx);
    expect(out).toContain('team-foundry/product/outcomes.md');
    expect(out).toContain('team-foundry/engineering/stack.md');
  });

  it('contains the coach section', () => {
    const out = rootAgentsTemplate(baseCtx);
    expect(out).toContain('team-foundry review');
    expect(out).toContain('Draft-then-confirm rule');
  });

  it('has Claude Code Skills section (not plain Skills)', () => {
    const out = rootAgentsTemplate(baseCtx);
    expect(out).toContain('## Claude Code Skills');
    expect(out).not.toContain('\n## Skills\n');
  });

  it('notes skill-parity.md for non-Claude users', () => {
    const out = rootAgentsTemplate(baseCtx);
    expect(out).toContain('docs/skill-parity.md');
  });

  it('does NOT tell user to see CLAUDE.md for the skill table', () => {
    const out = rootAgentsTemplate(baseCtx);
    expect(out).not.toContain('See CLAUDE.md for the full skill table');
  });

  it('solo profile omits full-only routing rows', () => {
    const out = rootAgentsTemplate({ ...baseCtx, profile: 'solo' });
    expect(out).not.toContain('team-foundry/product/assumptions.md');
  });

  it('full profile includes all routing rows', () => {
    const out = rootAgentsTemplate({ ...baseCtx, profile: 'full' });
    expect(out).toContain('team-foundry/product/assumptions.md');
  });
});
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
npm test -- --reporter=verbose 2>&1 | grep -A 5 "rootAgentsTemplate"
```

Expected: several FAILs (the current template still says "See CLAUDE.md" etc.).

- [ ] **Step 3: Rewrite `src/templates/root-agents.ts`**

```typescript
import type { TemplateContext } from '../types.js';

export function rootAgentsTemplate(ctx: TemplateContext): string {
  const isSolo = ctx.profile === 'solo';
  return `---
purpose: Primary context file — routes all AI tools to team-foundry context
read_when: always
last_updated: ${ctx.date}
owner:
---

# Agents

This repo uses **team-foundry** — structured files that give AI tools real team context.
Read this file first. It tells you where to find everything and how to activate the coach.

<!-- GAP: The project overview hasn't been filled in yet. Run the onboarding interview to populate it. -->

## Project overview

<!-- Filled in during the onboarding interview. -->

## Where to find context

| Topic | Path |
|---|---|
| Vision and north star metric | \`team-foundry/product/north-star.md\` |
| This quarter's outcomes | \`team-foundry/product/outcomes.md\` |
| Who our customers are | \`team-foundry/product/customers.md\` |
| Tech stack and conventions | \`team-foundry/engineering/stack.md\` |${isSolo ? '' : `
| Current roadmap | \`team-foundry/product/now-next-later.md\` |
| Strategic logic | \`team-foundry/product/strategy.md\` |
| Open assumptions | \`team-foundry/product/assumptions.md\` |
| Key risks | \`team-foundry/product/risks.md\` |
| Team norms and DoD | \`team-foundry/team/working-agreement.md\` |
| How we use AI tools | \`team-foundry/team/ai-practices.md\` |
| Quality stance | \`team-foundry/engineering/quality-bar.md\` |
| Architecture decisions | \`team-foundry/engineering/decisions/\` |
| Design principles | \`team-foundry/design/principles.md\` |
| Metric definitions | \`team-foundry/data/metrics.md\` |
| Domain terms | \`team-foundry/context/glossary.md\` |
| Stakeholders | \`team-foundry/context/stakeholders.md\` |`}

## Setup

See \`team-foundry/engineering/stack.md\` for the tech stack, local setup steps, and environment requirements.

## Code conventions

See \`team-foundry/engineering/stack.md\` for language and framework conventions.${isSolo ? '' : `
See \`team-foundry/engineering/quality-bar.md\` for the quality bar, bug triage policy, and definition of done.`}

## Areas of caution

- **Silent edits** — the team-foundry coach never writes files without the user's explicit confirmation. Do not write to \`team-foundry/\` files without confirmation.
- **Private folder** — \`team-foundry/private/\` is gitignored. Do not read from or write to it.${isSolo ? '' : `
- **ADR commitments** — architecture decisions in \`team-foundry/engineering/decisions/\` represent committed choices. Treat them as constraints unless the user explicitly opens a discussion.`}

## Coach

The team-foundry coach keeps these files honest over time. It runs automatically when
it notices something relevant to your current work. You can also invoke it directly:

| What to say | What happens |
|---|---|
| "Let's set up our team-foundry" | Runs the onboarding interview (first time only) |
| "let's do a team-foundry review" | Full audit — all files checked, findings listed |
| "coach mode" | Same as above |
| "review our [outcomes / customers / stack / etc.]" | Targeted review of one file |
| "what's missing from team-foundry?" | Lists gaps across all files |
| "run the weekly team-foundry review" | Weekly check-in, top 3 issues surfaced |

<!-- AI instructions:
     - Normal coding sessions: do NOT load coach.md. Use the routing map above to load
       specific files only when directly relevant to the user's question.
     - Explicit mode / Scheduled mode / onboarding: load .team-foundry/coach.md in full
       before activating any mode. Triggered only by the phrases in the table above.
     - Inline mode nudges: if you notice a clear gap in a team-foundry file while answering
       a normal question, surface it in one sentence — without loading the full coach.md.
       Keep it brief and non-blocking. Do not coach unprompted on back-to-back messages. -->

**Draft-then-confirm rule:** the coach always shows a proposed file change and waits for confirmation before writing. Silence is not confirmation.

## Claude Code Skills

<!-- Claude Code only — for equivalent workflows in Cursor and Codex, see \`docs/skill-parity.md\` -->

Pre-built skills are in \`.claude/skills/\`. Invoke with a slash command:

| Skill | What it does |
|---|---|
| \`/team-foundry-intro\` | Orient to the team — reads all context files, produces a summary |
| \`/team-foundry-status\` | Status read — what's on track, at risk, or blocked this cycle |
| \`/team-foundry-review\` | Full audit — all files checked, findings by severity |
| \`/team-foundry-capture\` | Capture what was learned in this session into the right file |
| \`/team-foundry-decision\` | Draft an ADR from the current conversation |
| \`/team-foundry-feature\` | Synthesize everything team-foundry knows about a specific feature |
${isSolo ? '' : `
## Glossary

See \`team-foundry/context/glossary.md\` for domain terms, acronyms, and known naming inconsistencies between teams.
`}`;
}
```

- [ ] **Step 4: Run tests**

```bash
npm test -- --reporter=verbose 2>&1 | grep -A 5 "rootAgentsTemplate"
```

Expected: all new tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/templates/root-agents.ts src/__tests__/templates.test.ts
git commit -m "feat(templates): AGENTS.md becomes primary — full routing map, coach, renamed skills section"
```

---

## Task 3: Rewrite `root-claude.ts` — pointer file

CLAUDE.md becomes a thin pointer: `@AGENTS.md` directive + human-readable callout + skill table only.

**Files:**
- Modify: `src/templates/root-claude.ts`
- Test: `src/__tests__/templates.test.ts`

- [ ] **Step 1: Write the failing test**

Add to `src/__tests__/templates.test.ts`:

```typescript
import { rootClaudeTemplate } from '../templates/root-claude.js';

describe('rootClaudeTemplate() — pointer', () => {
  const baseCtx: TemplateContext = {
    profile: 'full',
    tool: 'claude',
    repoVisibility: 'internal',
    date: '2026-05-25',
    ingestion: 'skip',
  };

  it('starts with @AGENTS.md directive', () => {
    const out = rootClaudeTemplate(baseCtx);
    expect(out.trimStart()).toMatch(/^@AGENTS\.md/);
  });

  it('contains the [!IMPORTANT] callout', () => {
    const out = rootClaudeTemplate(baseCtx);
    expect(out).toContain('> [!IMPORTANT]');
    expect(out).toContain('AGENTS.md');
  });

  it('contains the skill table', () => {
    const out = rootClaudeTemplate(baseCtx);
    expect(out).toContain('/team-foundry-intro');
    expect(out).toContain('/team-foundry-review');
  });

  it('does NOT contain the routing map table', () => {
    const out = rootClaudeTemplate(baseCtx);
    expect(out).not.toContain('team-foundry/product/outcomes.md');
  });

  it('does NOT contain the coach trigger table', () => {
    const out = rootClaudeTemplate(baseCtx);
    // The coach table lives in AGENTS.md now
    expect(out).not.toContain('"let\'s do a team-foundry review"');
  });
});
```

- [ ] **Step 2: Run to confirm failure**

```bash
npm test -- --reporter=verbose 2>&1 | grep -A 5 "rootClaudeTemplate"
```

Expected: FAILs on "starts with @AGENTS.md" and "does NOT contain routing map".

- [ ] **Step 3: Rewrite `src/templates/root-claude.ts`**

```typescript
import type { TemplateContext } from '../types.js';

export function rootClaudeTemplate(_ctx: TemplateContext): string {
  return `@AGENTS.md

> [!IMPORTANT]
> The primary routing map, team identity, coach activation, and coding conventions are
> defined in **AGENTS.md** — Claude Code injects its content above.
> The section below is Claude Code–specific.

## Claude Code Skills

Pre-built skills are in \`.claude/skills/\`. Invoke with a slash command:

| Skill | What it does |
|---|---|
| \`/team-foundry-intro\` | Orient to the team — reads all context files, produces a summary |
| \`/team-foundry-status\` | Status read — what's on track, at risk, or blocked this cycle |
| \`/team-foundry-review\` | Full audit — all files checked, findings by severity |
| \`/team-foundry-capture\` | Capture what was learned in this session into the right file |
| \`/team-foundry-decision\` | Draft an ADR from the current conversation |
| \`/team-foundry-feature\` | Synthesize everything team-foundry knows about a specific feature |
`;
}
```

Note: `_ctx` is unused — the pointer is tool-specific but not profile- or date-specific. The underscore prefix silences the TypeScript unused-parameter warning.

- [ ] **Step 4: Run tests**

```bash
npm test -- --reporter=verbose 2>&1 | grep -A 5 "rootClaudeTemplate"
```

Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add src/templates/root-claude.ts src/__tests__/templates.test.ts
git commit -m "feat(templates): CLAUDE.md becomes pointer — @AGENTS.md directive + skill table"
```

---

## Task 4: Rewrite `root-gemini.ts` — pointer file

**Files:**
- Modify: `src/templates/root-gemini.ts`
- Test: `src/__tests__/templates.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
import { rootGeminiTemplate } from '../templates/root-gemini.js';

describe('rootGeminiTemplate() — pointer', () => {
  const baseCtx: TemplateContext = {
    profile: 'full',
    tool: 'gemini',
    repoVisibility: 'internal',
    date: '2026-05-25',
    ingestion: 'skip',
  };

  it('contains [!IMPORTANT] callout instructing Gemini to read AGENTS.md', () => {
    const out = rootGeminiTemplate(baseCtx);
    expect(out).toContain('> [!IMPORTANT]');
    expect(out).toContain('AGENTS.md');
    expect(out).toContain('MUST read');
  });

  it('does NOT contain the routing map table', () => {
    const out = rootGeminiTemplate(baseCtx);
    expect(out).not.toContain('team-foundry/product/outcomes.md');
  });

  it('does NOT contain a skill table', () => {
    const out = rootGeminiTemplate(baseCtx);
    expect(out).not.toContain('/team-foundry-intro');
  });
});
```

- [ ] **Step 2: Run to confirm failure**

```bash
npm test -- --reporter=verbose 2>&1 | grep -A 5 "rootGeminiTemplate"
```

- [ ] **Step 3: Rewrite `src/templates/root-gemini.ts`**

```typescript
import type { TemplateContext } from '../types.js';

export function rootGeminiTemplate(ctx: TemplateContext): string {
  return `---
purpose: Root instruction pointer for Gemini CLI
read_when: startup
last_updated: ${ctx.date}
owner:
---

# GEMINI.md

This repository uses **team-foundry** for shared AI context.

> [!IMPORTANT]
> The primary routing map, team identity, coach activation, and coding conventions are
> defined in **AGENTS.md**. You MUST read \`AGENTS.md\` in full at the start of your session
> to orient yourself before answering any questions or modifying code.
`;
}
```

- [ ] **Step 4: Run tests**

```bash
npm test -- --reporter=verbose 2>&1 | grep -A 5 "rootGeminiTemplate"
```

- [ ] **Step 5: Commit**

```bash
git add src/templates/root-gemini.ts src/__tests__/templates.test.ts
git commit -m "feat(templates): GEMINI.md becomes pointer — [!IMPORTANT] callout to read AGENTS.md"
```

---

## Task 5: Rewrite `root-cursor.ts` — pointer file

**Files:**
- Modify: `src/templates/root-cursor.ts`
- Test: `src/__tests__/templates.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
import { rootCursorTemplate } from '../templates/root-cursor.js';

describe('rootCursorTemplate() — pointer', () => {
  const baseCtx: TemplateContext = {
    profile: 'full',
    tool: 'cursor',
    repoVisibility: 'internal',
    date: '2026-05-25',
    ingestion: 'skip',
  };

  it('frontmatter has alwaysApply: true and globs: *', () => {
    const out = rootCursorTemplate(baseCtx);
    expect(out).toContain('alwaysApply: true');
    expect(out).toContain('globs: *');
  });

  it('instructs Cursor to read AGENTS.md', () => {
    const out = rootCursorTemplate(baseCtx);
    expect(out).toContain('AGENTS.md');
    expect(out).toContain('read');
  });

  it('includes draft-then-confirm rule', () => {
    const out = rootCursorTemplate(baseCtx);
    expect(out).toContain('team-foundry/');
    expect(out).toContain('confirmation');
  });

  it('does NOT contain the routing map table', () => {
    const out = rootCursorTemplate(baseCtx);
    expect(out).not.toContain('team-foundry/product/outcomes.md');
  });
});
```

- [ ] **Step 2: Run to confirm failure**

```bash
npm test -- --reporter=verbose 2>&1 | grep -A 5 "rootCursorTemplate"
```

- [ ] **Step 3: Rewrite `src/templates/root-cursor.ts`**

```typescript
import type { TemplateContext } from '../types.js';

export function rootCursorTemplate(_ctx: TemplateContext): string {
  return `---
description: Team-foundry context loader for Cursor
globs: *
alwaysApply: true
---

# team-foundry

This repository uses **team-foundry** for shared AI context.

- Always read and follow the primary project overview, routing map, coach instructions, and code conventions defined in \`AGENTS.md\` before answering user requests or modifying code.
- Do not write to the \`team-foundry/\` directory without the user's explicit confirmation.
`;
}
```

- [ ] **Step 4: Run tests**

```bash
npm test -- --reporter=verbose 2>&1 | grep -A 5 "rootCursorTemplate"
```

- [ ] **Step 5: Commit**

```bash
git add src/templates/root-cursor.ts src/__tests__/templates.test.ts
git commit -m "feat(templates): .cursor rule becomes pointer — alwaysApply frontmatter + prose instruction"
```

---

## Task 6: Create `src/detect.ts`

A pure async helper — no prompts, no side effects. Scans for pre-existing root instruction files and returns them with line counts.

**Files:**
- Create: `src/detect.ts`
- Create: `src/__tests__/detect.test.ts`

- [ ] **Step 1: Write `src/__tests__/detect.test.ts`**

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { detectExistingFiles } from '../detect.js';

async function makeTempDir(): Promise<string> {
  return fs.mkdtemp(path.join(os.tmpdir(), 'tf-detect-test-'));
}
async function cleanup(dir: string): Promise<void> {
  await fs.rm(dir, { recursive: true, force: true });
}

describe('detectExistingFiles()', () => {
  let tmpDir: string;

  beforeEach(async () => { tmpDir = await makeTempDir(); });
  afterEach(async () => { await cleanup(tmpDir); });

  it('returns empty array when no root instruction files exist', async () => {
    const found = await detectExistingFiles(tmpDir);
    expect(found).toEqual([]);
  });

  it('detects CLAUDE.md with correct line count', async () => {
    await fs.writeFile(path.join(tmpDir, 'CLAUDE.md'), 'line1\nline2\nline3', 'utf-8');
    const found = await detectExistingFiles(tmpDir);
    expect(found).toHaveLength(1);
    expect(found[0].relativePath).toBe('CLAUDE.md');
    expect(found[0].lineCount).toBe(3);
  });

  it('detects GEMINI.md', async () => {
    await fs.writeFile(path.join(tmpDir, 'GEMINI.md'), 'content', 'utf-8');
    const found = await detectExistingFiles(tmpDir);
    expect(found.map((f) => f.relativePath)).toContain('GEMINI.md');
  });

  it('detects AGENTS.md', async () => {
    await fs.writeFile(path.join(tmpDir, 'AGENTS.md'), 'content', 'utf-8');
    const found = await detectExistingFiles(tmpDir);
    expect(found.map((f) => f.relativePath)).toContain('AGENTS.md');
  });

  it('detects .cursor/rules/*.mdc files', async () => {
    const rulesDir = path.join(tmpDir, '.cursor', 'rules');
    await fs.mkdir(rulesDir, { recursive: true });
    await fs.writeFile(path.join(rulesDir, 'my-rules.mdc'), 'rule content\nline2', 'utf-8');
    const found = await detectExistingFiles(tmpDir);
    expect(found.map((f) => f.relativePath)).toContain('.cursor/rules/my-rules.mdc');
    expect(found.find((f) => f.relativePath === '.cursor/rules/my-rules.mdc')?.lineCount).toBe(2);
  });

  it('detects multiple files at once', async () => {
    await fs.writeFile(path.join(tmpDir, 'CLAUDE.md'), 'a', 'utf-8');
    await fs.writeFile(path.join(tmpDir, 'GEMINI.md'), 'b', 'utf-8');
    const found = await detectExistingFiles(tmpDir);
    expect(found).toHaveLength(2);
  });
});
```

- [ ] **Step 2: Run to confirm tests fail (module not found)**

```bash
npm test -- src/__tests__/detect.test.ts 2>&1 | tail -10
```

Expected: error about missing module `../detect.js`.

- [ ] **Step 3: Create `src/detect.ts`**

```typescript
import fs from 'fs/promises';
import path from 'path';

export interface DetectedFile {
  relativePath: string;
  lineCount: number;
}

/** Root instruction file paths that team-foundry manages (fixed paths). */
const FIXED_ROOT_PATHS = ['AGENTS.md', 'CLAUDE.md', 'GEMINI.md'];

/**
 * Scans targetDir for pre-existing root instruction files.
 * Returns detected files with their line counts.
 * Pure function — no prompts, no side effects.
 */
export async function detectExistingFiles(targetDir: string): Promise<DetectedFile[]> {
  const found: DetectedFile[] = [];

  for (const relPath of FIXED_ROOT_PATHS) {
    try {
      const content = await fs.readFile(path.join(targetDir, relPath), 'utf-8');
      found.push({ relativePath: relPath, lineCount: content.split('\n').length });
    } catch {
      // file not found — skip
    }
  }

  // Also scan .cursor/rules/ for any .mdc or .md files
  const cursorRulesDir = path.join(targetDir, '.cursor', 'rules');
  try {
    const entries = await fs.readdir(cursorRulesDir);
    for (const entry of entries) {
      if (entry.endsWith('.mdc') || entry.endsWith('.md')) {
        const relPath = `.cursor/rules/${entry}`;
        try {
          const content = await fs.readFile(path.join(targetDir, relPath), 'utf-8');
          found.push({ relativePath: relPath, lineCount: content.split('\n').length });
        } catch {
          // skip unreadable files
        }
      }
    }
  } catch {
    // .cursor/rules/ doesn't exist — skip
  }

  return found;
}
```

- [ ] **Step 4: Run tests**

```bash
npm test -- src/__tests__/detect.test.ts --reporter=verbose
```

Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add src/detect.ts src/__tests__/detect.test.ts
git commit -m "feat(detect): add detectExistingFiles helper for pre-scaffold scan"
```

---

## Task 7: Extend `scaffold.ts` — `tool='all'` and merge/replace/skip

Two sub-changes in one commit: (a) `rootEntries()` handles `'all'`, `expectedPaths()` handles `'all'`, `gitAddCommand()` handles `'all'`; (b) write loop applies merge decisions for root instruction files.

**Files:**
- Modify: `src/scaffold.ts`
- Modify: `src/__tests__/scaffold.test.ts`

### 7a — `tool = 'all'`

- [ ] **Step 1: Write the failing tests for `tool='all'`**

Add to `src/__tests__/scaffold.test.ts`:

```typescript
it('tool=all writes CLAUDE.md, GEMINI.md, and .cursor/rules/team-foundry.mdc', async () => {
  await scaffold({ ...baseOptions, tool: 'all', targetDir: tmpDir });
  for (const relPath of ['CLAUDE.md', 'GEMINI.md', '.cursor/rules/team-foundry.mdc']) {
    const exists = await fs.access(path.join(tmpDir, relPath)).then(() => true).catch(() => false);
    expect(exists, `Expected ${relPath} to exist for tool=all`).toBe(true);
  }
});

it('tool=all writes Claude Code skills', async () => {
  await scaffold({ ...baseOptions, tool: 'all', targetDir: tmpDir });
  const exists = await fs.access(path.join(tmpDir, '.claude/skills/team-foundry-intro.md'))
    .then(() => true).catch(() => false);
  expect(exists).toBe(true);
});

it('gitAddCommand includes all tool files for tool=all', () => {
  const cmd = gitAddCommand('all');
  expect(cmd).toContain('CLAUDE.md');
  expect(cmd).toContain('GEMINI.md');
  expect(cmd).toContain('.cursor/');
  expect(cmd).toContain('.claude/');
});

it('expectedPaths for tool=all includes all pointer files', () => {
  const paths = expectedPaths('full', 'all');
  expect(paths).toContain('CLAUDE.md');
  expect(paths).toContain('GEMINI.md');
  expect(paths).toContain('.cursor/rules/team-foundry.mdc');
  expect(paths).toContain('.claude/skills/team-foundry-intro.md');
});
```

- [ ] **Step 2: Run to confirm failure**

```bash
npm test -- src/__tests__/scaffold.test.ts --reporter=verbose 2>&1 | grep -E "FAIL|✓|×" | head -20
```

- [ ] **Step 3: Update `rootEntries()`, `expectedPaths()`, `gitAddCommand()` in `scaffold.ts`**

In `rootEntries()`, add the `'all'` case (add after the `'both'` return):

```typescript
// 'all' — all pointer files
return [
  { relativePath: 'CLAUDE.md', content: rootClaudeTemplate },
  { relativePath: 'GEMINI.md', content: rootGeminiTemplate },
  { relativePath: '.cursor/rules/team-foundry.mdc', content: rootCursorTemplate },
];
```

Change the `includesSkills` line from:
```typescript
const includesSkills = tool === 'claude' || tool === 'both';
```
to:
```typescript
const includesSkills = tool === 'claude' || tool === 'both' || tool === 'all';
```

In `gitAddCommand()`, add handling for `'all'`:
```typescript
export function gitAddCommand(tool: ScaffoldOptions['tool']): string {
  const toolFiles: string[] = [];
  if (tool === 'claude' || tool === 'both' || tool === 'all') toolFiles.push('CLAUDE.md', '.claude/');
  if (tool === 'gemini' || tool === 'both' || tool === 'all') toolFiles.push('GEMINI.md');
  if (tool === 'cursor' || tool === 'all') toolFiles.push('.cursor/');

  const paths = [
    'team-foundry/',
    '.team-foundry/',
    'AGENTS.md',
    'GETTING_STARTED.md',
    ...toolFiles,
  ].join(' ');

  return `git add ${paths} && git commit -m "Add team-foundry"`;
}
```

In `expectedPaths()`, extend the `roots` assignment:
```typescript
const roots =
  tool === 'both'
    ? ['CLAUDE.md', 'GEMINI.md']
    : tool === 'claude'
      ? ['CLAUDE.md']
      : tool === 'cursor'
        ? ['.cursor/rules/team-foundry.mdc']
        : tool === 'all'
          ? ['CLAUDE.md', 'GEMINI.md', '.cursor/rules/team-foundry.mdc']
          : ['GEMINI.md'];

const skills =
  (tool === 'claude' || tool === 'both' || tool === 'all')
    ? CLAUDE_SKILLS_ENTRIES.map((e) => e.relativePath)
    : [];
```

- [ ] **Step 4: Run tests for tool=all**

```bash
npm test -- src/__tests__/scaffold.test.ts --reporter=verbose 2>&1 | grep -E "tool=all|gitAddCommand|expectedPaths"
```

Expected: all new tests pass.

### 7b — Merge/replace/skip logic

- [ ] **Step 5: Write the failing merge/replace/skip tests**

Add to `src/__tests__/scaffold.test.ts`:

```typescript
describe('mergeDecisions', () => {
  it('merge: preserves existing content above markers and appends team-foundry block', async () => {
    const claudePath = path.join(tmpDir, 'CLAUDE.md');
    await fs.writeFile(claudePath, '# My existing CLAUDE.md\n\nSome custom rules here.', 'utf-8');

    await scaffold({
      ...baseOptions,
      targetDir: tmpDir,
      mergeDecisions: { 'CLAUDE.md': 'merge' },
    });

    const content = await fs.readFile(claudePath, 'utf-8');
    expect(content).toContain('# My existing CLAUDE.md');
    expect(content).toContain('Some custom rules here.');
    expect(content).toContain('<!-- BEGIN TEAM-FOUNDRY SECTION -->');
    expect(content).toContain('<!-- END TEAM-FOUNDRY SECTION -->');
    expect(content).toContain('@AGENTS.md');
  });

  it('merge: second merge replaces the team-foundry block, not appends', async () => {
    const claudePath = path.join(tmpDir, 'CLAUDE.md');
    const existing = `# My CLAUDE.md\n\n<!-- BEGIN TEAM-FOUNDRY SECTION -->\nold content\n<!-- END TEAM-FOUNDRY SECTION -->`;
    await fs.writeFile(claudePath, existing, 'utf-8');

    await scaffold({
      ...baseOptions,
      targetDir: tmpDir,
      mergeDecisions: { 'CLAUDE.md': 'merge' },
    });

    const content = await fs.readFile(claudePath, 'utf-8');
    expect(content).not.toContain('old content');
    expect(content).toContain('@AGENTS.md');
    // Only one BEGIN marker
    expect(content.split('<!-- BEGIN TEAM-FOUNDRY SECTION -->').length).toBe(2);
  });

  it('replace: backs up existing file to .team-foundry/backups/ and writes fresh', async () => {
    const claudePath = path.join(tmpDir, 'CLAUDE.md');
    await fs.writeFile(claudePath, 'original content', 'utf-8');

    await scaffold({
      ...baseOptions,
      targetDir: tmpDir,
      mergeDecisions: { 'CLAUDE.md': 'replace' },
    });

    // Fresh content written
    const content = await fs.readFile(claudePath, 'utf-8');
    expect(content).not.toBe('original content');
    expect(content).toContain('@AGENTS.md');

    // Backup exists
    const backupsDir = path.join(tmpDir, '.team-foundry', 'backups');
    const backups = await fs.readdir(backupsDir);
    expect(backups.some((f) => f.startsWith('CLAUDE.md') && f.endsWith('.backup'))).toBe(true);

    // Backup has original content
    const backupContent = await fs.readFile(path.join(backupsDir, backups[0]), 'utf-8');
    expect(backupContent).toBe('original content');
  });

  it('skip: leaves existing file untouched, writes all other files', async () => {
    const claudePath = path.join(tmpDir, 'CLAUDE.md');
    await fs.writeFile(claudePath, 'do not touch', 'utf-8');

    await scaffold({
      ...baseOptions,
      targetDir: tmpDir,
      mergeDecisions: { 'CLAUDE.md': 'skip' },
    });

    const content = await fs.readFile(claudePath, 'utf-8');
    expect(content).toBe('do not touch');

    // Other files were still written
    const agentsExists = await fs.access(path.join(tmpDir, 'AGENTS.md')).then(() => true).catch(() => false);
    expect(agentsExists).toBe(true);
  });

  it('missing mergeDecisions key defaults to merge', async () => {
    const claudePath = path.join(tmpDir, 'CLAUDE.md');
    await fs.writeFile(claudePath, '# Existing', 'utf-8');

    await scaffold({
      ...baseOptions,
      targetDir: tmpDir,
      mergeDecisions: {}, // CLAUDE.md not listed — should default to merge
    });

    const content = await fs.readFile(claudePath, 'utf-8');
    expect(content).toContain('# Existing');
    expect(content).toContain('<!-- BEGIN TEAM-FOUNDRY SECTION -->');
  });
});
```

- [ ] **Step 6: Run to confirm failure**

```bash
npm test -- src/__tests__/scaffold.test.ts -t "mergeDecisions" --reporter=verbose 2>&1 | tail -20
```

- [ ] **Step 7: Add merge/replace/skip logic to `scaffold.ts`**

Add these constants and helper function before the `scaffold()` export:

```typescript
const MERGE_MARKER_START = '<!-- BEGIN TEAM-FOUNDRY SECTION -->';
const MERGE_MARKER_END = '<!-- END TEAM-FOUNDRY SECTION -->';

/** Set of relative paths that are root instruction files and subject to merge decisions */
const ROOT_INSTRUCTION_PATHS = new Set([
  'AGENTS.md',
  'CLAUDE.md',
  'GEMINI.md',
  '.cursor/rules/team-foundry.mdc',
]);

async function applyMergeDecision(
  fullPath: string,
  relativePath: string,
  newContent: string,
  decision: 'merge' | 'replace' | 'skip',
  targetDir: string,
): Promise<boolean> {
  if (decision === 'skip') return false;

  if (decision === 'replace') {
    const filename = path.basename(relativePath);
    const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const backupsDir = path.join(targetDir, '.team-foundry', 'backups');
    await fs.mkdir(backupsDir, { recursive: true });
    let backupPath = path.join(backupsDir, `${filename}.${ts}.backup`);
    let suffix = 2;
    while (true) {
      try {
        await fs.access(backupPath);
        backupPath = path.join(backupsDir, `${filename}.${ts}-${suffix++}.backup`);
      } catch {
        break;
      }
    }
    const existing = await fs.readFile(fullPath, 'utf-8');
    await fs.writeFile(backupPath, existing, 'utf-8');
    await fs.writeFile(fullPath, newContent, 'utf-8');
    return true;
  }

  // 'merge'
  const existing = await fs.readFile(fullPath, 'utf-8');
  const wrappedContent = `${MERGE_MARKER_START}\n${newContent}\n${MERGE_MARKER_END}`;
  let merged: string;

  if (existing.includes(MERGE_MARKER_START)) {
    const startIdx = existing.indexOf(MERGE_MARKER_START);
    const endIdx = existing.indexOf(MERGE_MARKER_END) + MERGE_MARKER_END.length;
    merged = existing.slice(0, startIdx) + wrappedContent + existing.slice(endIdx);
  } else {
    merged = existing + '\n\n' + wrappedContent;
  }

  await fs.writeFile(fullPath, merged, 'utf-8');
  return true;
}
```

Then update the write loop in `scaffold()` to consult merge decisions:

```typescript
for (const entry of entries) {
  const fullPath = path.join(targetDir, entry.relativePath);
  const dir = path.dirname(fullPath);
  await fs.mkdir(dir, { recursive: true });

  // Root instruction files: apply merge decision if the file already exists
  if (ROOT_INSTRUCTION_PATHS.has(entry.relativePath) && options.mergeDecisions !== undefined) {
    let fileExists = false;
    try {
      await fs.access(fullPath);
      fileExists = true;
    } catch { /* not found */ }

    if (fileExists) {
      const decision = options.mergeDecisions[entry.relativePath] ?? 'merge';
      const didWrite = await applyMergeDecision(
        fullPath,
        entry.relativePath,
        entry.content(ctx),
        decision,
        targetDir,
      );
      if (didWrite) written.push(entry.relativePath);
      continue;
    }
  }

  // Default: skip if already exists
  try {
    await fs.access(fullPath);
    continue; // file exists — skip
  } catch { /* not found — write it */ }

  await fs.writeFile(fullPath, entry.content(ctx), 'utf-8');
  written.push(entry.relativePath);
}
```

Note: the `options` parameter must be accessible in scope. In the current `scaffold()` signature, the options are destructured at the top. Add `const options = { mergeDecisions }` or keep the raw `options` reference by restructuring slightly. The cleanest approach: keep the destructuring but also keep a reference to the full options object:

At the start of `scaffold()`, change:
```typescript
export async function scaffold(options: ScaffoldOptions): Promise<string[]> {
  const { targetDir, profile, tool, repoVisibility, date, ingestionPath, ingestion, federated } = options;
```
to add `mergeDecisions`:
```typescript
  const { targetDir, profile, tool, repoVisibility, date, ingestionPath, ingestion, federated, mergeDecisions } = options;
```

- [ ] **Step 8: Run all scaffold tests**

```bash
npm test -- src/__tests__/scaffold.test.ts --reporter=verbose 2>&1 | grep -E "FAIL|✓|×"
```

Expected: all pass (including pre-existing tests).

- [ ] **Step 9: Commit**

```bash
git add src/scaffold.ts src/__tests__/scaffold.test.ts
git commit -m "feat(scaffold): add tool='all' support and merge/replace/skip for existing root files"
```

---

## Task 8: Extend `prompts.ts` — `'all'` option and `runMergePrompts()`

**Files:**
- Modify: `src/prompts.ts`
- Modify: `src/__tests__/prompts.test.ts`

- [ ] **Step 1: Write the failing test for `questionCount` with `'all'`**

Open `src/__tests__/prompts.test.ts` and add:

```typescript
it("questionCount with tool='all' is same as 'both'", () => {
  // 'all' behaves like 'both' for question count purposes — no extra questions
  expect(questionCount('full', false, 'skip')).toBe(5);
  expect(questionCount('solo', false, 'skip')).toBe(4);
});
```

- [ ] **Step 2: Run to confirm it passes trivially** (questionCount doesn't care about tool)

```bash
npm test -- src/__tests__/prompts.test.ts --reporter=verbose 2>&1 | tail -10
```

- [ ] **Step 3: Update `runPrompts()` in `prompts.ts`**

Change the tool `select` options from:

```typescript
options: [
  { value: 'claude', label: 'Claude Code' },
  { value: 'gemini', label: 'Gemini CLI' },
  { value: 'cursor', label: 'Cursor' },
  { value: 'both', label: 'Multiple (Claude Code + Gemini CLI)' },
],
```

to:

```typescript
options: [
  {
    value: 'all',
    label: 'All tools (Recommended — generates pointers for Claude Code, Gemini CLI, Cursor, and AGENTS.md)',
  },
  { value: 'claude', label: 'Claude Code' },
  { value: 'gemini', label: 'Gemini CLI' },
  { value: 'cursor', label: 'Cursor' },
  { value: 'both', label: 'Multiple (Claude Code + Gemini CLI)' },
],
```

- [ ] **Step 4: Add `runMergePrompts()` to `prompts.ts`**

Add this import at the top of `prompts.ts`:

```typescript
import type { DetectedFile } from './detect.js';
```

Add this function at the bottom of `prompts.ts` (after `runPrompts`):

```typescript
/**
 * For each detected existing root instruction file, asks the user whether to
 * merge, replace, or skip. Returns a decisions map keyed by relative path.
 */
export async function runMergePrompts(
  detected: DetectedFile[],
): Promise<Record<string, 'merge' | 'replace' | 'skip'>> {
  const decisions: Record<string, 'merge' | 'replace' | 'skip'> = {};

  for (const file of detected) {
    const choice = await select({
      message: `Found existing ${file.relativePath} (${file.lineCount} lines). What should team-foundry do?`,
      options: [
        {
          value: 'merge',
          label: 'Merge — append team-foundry section, preserve existing content (recommended)',
        },
        {
          value: 'replace',
          label: 'Replace — back up to .team-foundry/backups/, write fresh',
        },
        {
          value: 'skip',
          label: 'Skip — leave it alone, scaffold everything else',
        },
      ],
    });
    cancelIfNeeded(choice);
    decisions[file.relativePath] = choice as 'merge' | 'replace' | 'skip';
  }

  return decisions;
}
```

- [ ] **Step 5: Run all prompts tests**

```bash
npm test -- src/__tests__/prompts.test.ts --reporter=verbose
```

Expected: all pass.

- [ ] **Step 6: Commit**

```bash
git add src/prompts.ts src/__tests__/prompts.test.ts
git commit -m "feat(prompts): add 'all tools' option (first, recommended) and runMergePrompts()"
```

---

## Task 9: Wire `index.ts` — detection → merge prompts → scaffold

**Files:**
- Modify: `src/index.ts`

No new tests needed here — this is wiring. The integration is covered by scaffold tests and e2e manual testing.

- [ ] **Step 1: Add imports to `index.ts`**

Add to the top of `src/index.ts`:

```typescript
import { detectExistingFiles } from './detect.js';
import { runMergePrompts } from './prompts.js';
```

- [ ] **Step 2: Update `TOOL_LABEL` to include `'all'`**

```typescript
const TOOL_LABEL: Record<string, string> = {
  claude: 'Claude Code',
  gemini: 'Gemini CLI',
  cursor: 'Cursor',
  both: 'Claude Code or Gemini CLI',
  all: 'Claude Code, Gemini CLI, or Cursor',
};
```

- [ ] **Step 3: Insert detection + merge prompts between `runPrompts()` and `scaffold()` in `main()`**

Replace:
```typescript
const answers = await runPrompts();
const date = new Date().toISOString().split('T')[0];

const writtenPaths = await scaffold({ ...answers, targetDir, date });
```

With:
```typescript
const answers = await runPrompts();
const date = new Date().toISOString().split('T')[0];

// Detect existing root instruction files and collect per-file merge decisions
const detectedFiles = await detectExistingFiles(targetDir);
const mergeDecisions = detectedFiles.length > 0
  ? await runMergePrompts(detectedFiles)
  : {};

const writtenPaths = await scaffold({ ...answers, targetDir, date, mergeDecisions });
```

- [ ] **Step 4: Compile check**

```bash
cd /Users/tomershahar/Documents/Projects/team-foundry && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Run full test suite**

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/index.ts
git commit -m "feat(index): wire detectExistingFiles → runMergePrompts → scaffold with mergeDecisions"
```

---

## Task 10: Extend `status.ts` — pointer file drift detection

**Files:**
- Modify: `src/status.ts`
- Modify: `src/__tests__/status.test.ts`

- [ ] **Step 1: Write the failing tests**

Open `src/__tests__/status.test.ts` and add a new `describe` block:

```typescript
import { checkPointerFiles } from '../status.js';

describe('checkPointerFiles()', () => {
  let tmpDir: string;

  beforeEach(async () => { tmpDir = await makeTempDir(); });
  afterEach(async () => { await cleanup(tmpDir); });

  it('returns all three pointer files as missing when none exist', async () => {
    const results = await checkPointerFiles(tmpDir);
    expect(results).toHaveLength(3);
    expect(results.every((r) => !r.exists)).toBe(true);
    expect(results.every((r) => !r.drifted)).toBe(true);
  });

  it('marks existing file with AGENTS.md reference as ok', async () => {
    await fs.writeFile(path.join(tmpDir, 'CLAUDE.md'), '@AGENTS.md\nsome content', 'utf-8');
    const results = await checkPointerFiles(tmpDir);
    const claude = results.find((r) => r.relativePath === 'CLAUDE.md')!;
    expect(claude.exists).toBe(true);
    expect(claude.drifted).toBe(false);
  });

  it('marks existing file without AGENTS.md reference as drifted', async () => {
    await fs.writeFile(path.join(tmpDir, 'CLAUDE.md'), '# Old CLAUDE.md\nno reference here', 'utf-8');
    const results = await checkPointerFiles(tmpDir);
    const claude = results.find((r) => r.relativePath === 'CLAUDE.md')!;
    expect(claude.exists).toBe(true);
    expect(claude.drifted).toBe(true);
  });

  it('checks .cursor/rules/team-foundry.mdc', async () => {
    const dir = path.join(tmpDir, '.cursor', 'rules');
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, 'team-foundry.mdc'), 'read AGENTS.md always', 'utf-8');
    const results = await checkPointerFiles(tmpDir);
    const cursor = results.find((r) => r.relativePath === '.cursor/rules/team-foundry.mdc')!;
    expect(cursor.exists).toBe(true);
    expect(cursor.drifted).toBe(false);
  });
});
```

Also add `makeTempDir` and `cleanup` helpers if they don't already exist in `status.test.ts` (they likely do — check the file).

- [ ] **Step 2: Run to confirm failure**

```bash
npm test -- src/__tests__/status.test.ts -t "checkPointerFiles" --reporter=verbose 2>&1 | tail -15
```

Expected: `checkPointerFiles is not exported` or similar.

- [ ] **Step 3: Add `checkPointerFiles` to `src/status.ts`**

Add this type and function after the existing type definitions:

```typescript
export interface PointerFileStatus {
  relativePath: string;
  exists: boolean;
  /** true if file exists but does not contain the string 'AGENTS.md' */
  drifted: boolean;
}

const POINTER_FILE_PATHS = [
  'CLAUDE.md',
  'GEMINI.md',
  '.cursor/rules/team-foundry.mdc',
];

export async function checkPointerFiles(targetDir: string): Promise<PointerFileStatus[]> {
  const results: PointerFileStatus[] = [];
  for (const relPath of POINTER_FILE_PATHS) {
    try {
      const content = await fs.readFile(path.join(targetDir, relPath), 'utf-8');
      results.push({
        relativePath: relPath,
        exists: true,
        drifted: !content.includes('AGENTS.md'),
      });
    } catch {
      results.push({ relativePath: relPath, exists: false, drifted: false });
    }
  }
  return results;
}
```

- [ ] **Step 4: Surface pointer status in `runStatus()`**

In `runStatus()`, after the existing file-status output, add a pointer files section. Find the end of the function (before the final `outro`) and add:

```typescript
// Pointer files section
const pointerStatuses = await checkPointerFiles(targetDir);
const pointerLines = [
  '',
  'Pointer files (each must reference AGENTS.md):',
  '',
];
for (const p of pointerStatuses) {
  let symbol: string;
  let label: string;
  if (!p.exists) {
    symbol = '○';
    label = 'not present';
  } else if (p.drifted) {
    symbol = '⚠';
    label = 'drifted / out of sync — AGENTS.md reference missing';
  } else {
    symbol = '✓';
    label = 'ok';
  }
  pointerLines.push(`  ${symbol}  ${p.relativePath.padEnd(40)} ${label}`);
}
log.info(pointerLines.join('\n'));
```

- [ ] **Step 5: Run status tests**

```bash
npm test -- src/__tests__/status.test.ts --reporter=verbose
```

Expected: all pass.

- [ ] **Step 6: Commit**

```bash
git add src/status.ts src/__tests__/status.test.ts
git commit -m "feat(status): add pointer file existence and drift detection to status output"
```

---

## Task 11: Extend `migrate.ts` — v3.3 upgrade path

This adds `npx create-team-foundry migrate --to v3.3` for repos currently on v3.x that want to adopt the new pointer architecture.

**Files:**
- Modify: `src/migrate.ts`
- Modify: `src/__tests__/migrate.test.ts`

- [ ] **Step 1: Write the failing tests**

Open `src/__tests__/migrate.test.ts`. Add:

```typescript
import { migrateToV33, detectMigrateState } from '../migrate.js';
import { rootClaudeTemplate, rootGeminiTemplate, rootCursorTemplate, rootAgentsTemplate } from '../templates/index.js';

describe('migrateToV33()', () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await makeTempDir();
    // Seed a minimal v3 team-foundry repo
    await fs.mkdir(path.join(tmpDir, '.team-foundry'), { recursive: true });
    await fs.writeFile(path.join(tmpDir, '.team-foundry', 'hierarchy.md'), 'hierarchy', 'utf-8');
    await fs.mkdir(path.join(tmpDir, 'team-foundry'), { recursive: true });
  });
  afterEach(async () => { await cleanup(tmpDir); });

  it('backs up CLAUDE.md to .team-foundry/backups/ before replacing', async () => {
    await fs.writeFile(path.join(tmpDir, 'CLAUDE.md'), 'old full content', 'utf-8');

    await migrateToV33(tmpDir);

    const backupsDir = path.join(tmpDir, '.team-foundry', 'backups');
    const backups = await fs.readdir(backupsDir);
    expect(backups.some((f) => f.startsWith('CLAUDE.md') && f.endsWith('.backup'))).toBe(true);
  });

  it('writes new pointer CLAUDE.md with @AGENTS.md directive', async () => {
    await fs.writeFile(path.join(tmpDir, 'CLAUDE.md'), 'old full content', 'utf-8');

    await migrateToV33(tmpDir);

    const content = await fs.readFile(path.join(tmpDir, 'CLAUDE.md'), 'utf-8');
    expect(content).toContain('@AGENTS.md');
    expect(content).not.toBe('old full content');
  });

  it('upgrades thin AGENTS.md (< 40 lines) to primary format', async () => {
    const thin = 'thin agents content\n'.repeat(5); // 5 lines — under threshold
    await fs.writeFile(path.join(tmpDir, 'AGENTS.md'), thin, 'utf-8');

    await migrateToV33(tmpDir);

    const content = await fs.readFile(path.join(tmpDir, 'AGENTS.md'), 'utf-8');
    expect(content).toContain('Where to find context'); // routing map heading from primary template
    expect(content.split('\n').length).toBeGreaterThan(40);
  });

  it('does NOT replace AGENTS.md that already looks like primary (>= 40 lines)', async () => {
    const large = 'line\n'.repeat(50); // 50 lines
    await fs.writeFile(path.join(tmpDir, 'AGENTS.md'), large, 'utf-8');

    await migrateToV33(tmpDir);

    const content = await fs.readFile(path.join(tmpDir, 'AGENTS.md'), 'utf-8');
    expect(content).toBe(large);
  });

  it('skips GEMINI.md if not present', async () => {
    await migrateToV33(tmpDir);
    const exists = await fs.access(path.join(tmpDir, 'GEMINI.md')).then(() => true).catch(() => false);
    expect(exists).toBe(false);
  });

  it('backs up and replaces GEMINI.md if present', async () => {
    await fs.writeFile(path.join(tmpDir, 'GEMINI.md'), 'old gemini', 'utf-8');

    await migrateToV33(tmpDir);

    const content = await fs.readFile(path.join(tmpDir, 'GEMINI.md'), 'utf-8');
    expect(content).toContain('AGENTS.md');
    expect(content).not.toBe('old gemini');

    const backupsDir = path.join(tmpDir, '.team-foundry', 'backups');
    const backups = await fs.readdir(backupsDir);
    expect(backups.some((f) => f.startsWith('GEMINI.md'))).toBe(true);
  });
});
```

- [ ] **Step 2: Run to confirm failure**

```bash
npm test -- src/__tests__/migrate.test.ts -t "migrateToV33" --reporter=verbose 2>&1 | tail -15
```

- [ ] **Step 3: Update `MigrateState` and add `migrateToV33()` to `src/migrate.ts`**

Change the `MigrateState` type:
```typescript
export type MigrateState = 'none' | 'v2' | 'v3' | 'v3.3';
```

Add these imports to `migrate.ts`:
```typescript
import {
  rootClaudeTemplate,
  rootGeminiTemplate,
  rootCursorTemplate,
  rootAgentsTemplate,
} from './templates/index.js';
import type { TemplateContext } from './types.js';
```

Add the `migrateToV33()` function (before `runMigrate`):

```typescript
/**
 * Upgrades a v3.x repo to v3.3 pointer architecture:
 * - Backs up and replaces CLAUDE.md, GEMINI.md, .cursor/rules/team-foundry.mdc with pointer templates.
 * - If AGENTS.md is thin (< 40 lines), backs up and replaces with the new primary template.
 */
export async function migrateToV33(targetDir: string): Promise<void> {
  const date = new Date().toISOString().split('T')[0];
  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const backupsDir = path.join(targetDir, '.team-foundry', 'backups');
  await fs.mkdir(backupsDir, { recursive: true });

  // Detect tool to determine which pointer files were present
  const tool = await detectTool(targetDir);

  // Minimal context for template rendering — profile 'full' is safe default for migration
  const ctx: TemplateContext = {
    profile: 'full',
    tool,
    repoVisibility: 'internal',
    date,
    federated: false,
    ingestion: 'skip',
  };

  // Files to back up and replace with pointer templates
  const pointerCandidates: Array<{ relPath: string; template: (c: TemplateContext) => string }> = [
    { relPath: 'CLAUDE.md', template: rootClaudeTemplate },
    { relPath: 'GEMINI.md', template: rootGeminiTemplate },
    { relPath: '.cursor/rules/team-foundry.mdc', template: rootCursorTemplate },
  ];

  for (const { relPath, template } of pointerCandidates) {
    const fullPath = path.join(targetDir, relPath);
    try {
      const existing = await fs.readFile(fullPath, 'utf-8');
      const backupPath = path.join(backupsDir, `${path.basename(relPath)}.${ts}.backup`);
      await fs.writeFile(backupPath, existing, 'utf-8');
      await fs.writeFile(fullPath, template(ctx), 'utf-8');
      log.info(`  ✓  Upgraded ${relPath}  →  backup saved to .team-foundry/backups/`);
    } catch {
      // file doesn't exist — skip
    }
  }

  // Upgrade AGENTS.md if it's the thin v3.2 pointer (heuristic: < 40 lines)
  const agentsPath = path.join(targetDir, 'AGENTS.md');
  try {
    const existing = await fs.readFile(agentsPath, 'utf-8');
    if (existing.split('\n').length < 40) {
      const backupPath = path.join(backupsDir, `AGENTS.md.${ts}.backup`);
      await fs.writeFile(backupPath, existing, 'utf-8');
      await fs.writeFile(agentsPath, rootAgentsTemplate(ctx), 'utf-8');
      log.info(`  ✓  Upgraded AGENTS.md to primary format  →  backup saved to .team-foundry/backups/`);
    } else {
      log.info(`  ○  AGENTS.md looks like primary already (≥ 40 lines) — skipped`);
    }
  } catch {
    // no AGENTS.md — skip
  }
}
```

- [ ] **Step 4: Hook `migrateToV33` into `runMigrate()` for the `--to v3.3` flag**

In `runMigrate()`, add a check at the top for the `--to v3.3` flag:

```typescript
export async function runMigrate(targetDir: string): Promise<void> {
  // v3.3 migration: pointer architecture
  if (process.argv.includes('--to') && process.argv[process.argv.indexOf('--to') + 1] === 'v3.3') {
    const state = await detectMigrateState(targetDir);
    if (state === 'none') {
      log.error('No team-foundry found. Run npx create-team-foundry to set up first.');
      process.exit(1);
    }
    log.info(
      'Upgrading to v3.3 pointer architecture.\n\n' +
      'Changes:\n' +
      '  • CLAUDE.md, GEMINI.md, .cursor rules → thin pointer files\n' +
      '  • AGENTS.md → primary context file (if currently thin)\n\n' +
      'All replaced files are backed up to .team-foundry/backups/ first.',
    );
    const ok = await confirm({ message: 'Proceed?' });
    if (!ok) { outro('Migration cancelled.'); return; }

    await migrateToV33(targetDir);
    outro('v3.3 migration complete. Review the changes and commit when ready.');
    return;
  }

  // ... existing v2→v3 migration code continues below
```

- [ ] **Step 5: Run migrate tests**

```bash
npm test -- src/__tests__/migrate.test.ts --reporter=verbose
```

Expected: all pass.

- [ ] **Step 6: Run full test suite**

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 7: Commit**

```bash
git add src/migrate.ts src/__tests__/migrate.test.ts
git commit -m "feat(migrate): add v3.3 migration — upgrades existing repos to pointer architecture"
```

---

## Task 12: Create `docs/skill-parity.md`

Documentation only — no code changes, no tests.

**Files:**
- Create: `docs/skill-parity.md`

- [ ] **Step 1: Create the file**

```bash
mkdir -p /Users/tomershahar/Documents/Projects/team-foundry/docs
```

Write `docs/skill-parity.md`:

````markdown
# Skill Parity Guide

The six `/team-foundry-*` slash commands work only in **Claude Code**. This guide documents equivalent workflows for Cursor and Codex (and any agent that reads `AGENTS.md`).

---

## Cursor (Composer / Chat)

Use these trigger phrases in Cursor's Composer or Chat:

| Claude Code Skill | Equivalent Cursor prompt |
|---|---|
| `/team-foundry-intro` | *"Read the team-foundry files and give me a session summary — who we are, what we're working toward, and what's currently at risk."* |
| `/team-foundry-status` | *"Read `team-foundry/product/outcomes.md` and `team-foundry/product/now-next-later.md`. Tell me what's on track, at risk, or blocked this cycle."* |
| `/team-foundry-review` | *"Audit all files under `team-foundry/`. List findings by severity — staleness, gaps, drift between outcomes and roadmap."* |
| `/team-foundry-capture` | *"Capture the decisions and learnings from this conversation into the right team-foundry file. Show me the proposed change before writing."* |
| `/team-foundry-decision` | *"Draft an Architecture Decision Record (ADR) from this conversation. Use the format in `team-foundry/engineering/decisions/`."* |
| `/team-foundry-feature` | *"Synthesize everything team-foundry knows about [feature name]: current status, open assumptions, customer evidence, and risks."* |

---

## Codex / other agents (AGENTS.md–native)

These agents read `AGENTS.md` directly. Copy the prompt recipe into the chat, or add a `## Prompt Recipes` section at the bottom of your `AGENTS.md` so they're always in context.

| Skill | Prompt recipe |
|---|---|
| Intro | `"Read AGENTS.md and all files under team-foundry/. Summarize team context, current goals, and what's at risk this cycle."` |
| Status | `"Read team-foundry/product/outcomes.md and team-foundry/product/now-next-later.md. Report what's on track, at risk, or blocked. Cite specific files."` |
| Review | `"Audit all files under team-foundry/ for staleness, gaps, and drift. List findings by severity: critical (blocks a decision), warning (actionable this week), info (note for later)."` |
| Capture | `"Based on this conversation, identify what was decided or learned. Propose updates to the appropriate team-foundry files. Show the diff before writing."` |
| Decision | `"Draft an Architecture Decision Record (ADR) based on this conversation. Use the template format from team-foundry/engineering/decisions/ if one exists, otherwise use standard ADR format."` |
| Feature | `"Synthesize everything in team-foundry/ about [feature]: status in now-next-later.md, linked assumptions, customer evidence from customers.md, open risks, and any ADRs."` |

---

## Adding prompt recipes to AGENTS.md (optional)

If you're running an agent that reads `AGENTS.md` at session start, you can embed these recipes directly so they're always available. Add this block to the bottom of your `AGENTS.md`:

```markdown
## Prompt Recipes

Copy-paste these prompts to trigger team-foundry workflows:

- **Session intro:** "Read AGENTS.md and all team-foundry/ files. Summarize context, goals, and risks."
- **Status check:** "Read outcomes.md and now-next-later.md. What's on track, at risk, or blocked?"
- **Full review:** "Audit all team-foundry/ files for staleness and drift. List findings by severity."
- **Capture:** "Propose updates to team-foundry/ files based on this conversation. Show before writing."
- **Decision:** "Draft an ADR from this conversation using the format in engineering/decisions/."
- **Feature:** "Synthesize team-foundry knowledge about [feature]: status, assumptions, evidence, risks."
```

---

## Future: generating Cursor/Codex skill files

Generating actual `.cursor/rules/` files and AGENTS.md instruction blocks for each skill is deferred to v3.4. See `SPEC-cross-tool-refactor.md` → Change 4 for the rationale.
````

- [ ] **Step 2: Commit**

```bash
git add docs/skill-parity.md
git commit -m "docs: add skill-parity.md — Cursor and Codex equivalents for six Claude Code skills"
```

---

## Self-review

### Spec coverage check

| Spec requirement | Covered by task |
|---|---|
| AGENTS.md is primary — full routing map + coach + skills section renamed | Task 2 |
| CLAUDE.md → pointer with `@AGENTS.md` + callout + skill table | Task 3 |
| GEMINI.md → pointer with `[!IMPORTANT]` callout | Task 4 |
| `.cursor/rules/team-foundry.mdc` → pointer with `alwaysApply: true`, `globs: *`, prose | Task 5 |
| `tool='all'` option, first and recommended in prompts | Task 7a, Task 8 |
| `tool='all'` scaffold writes all three pointer files + AGENTS.md + skills | Task 7a |
| `gitAddCommand` and `expectedPaths` handle `'all'` | Task 7a |
| Status: pointer file presence + drift detection | Task 10 |
| Detect existing root instruction files | Task 6 |
| Merge: preserve content + wrap in markers, replace existing marker block | Task 7b |
| Replace: timestamped backup to `.team-foundry/backups/` | Task 7b |
| Skip: leave file untouched | Task 7b |
| Missing mergeDecisions key defaults to merge | Task 7b |
| Prompt placement: detection in `detect.ts`, prompts in `prompts.ts`, no prompts in `scaffold.ts` | Tasks 6, 8, 9 |
| `mergeDecisions` in `ScaffoldOptions` | Task 1 |
| v3.3 migration for existing team-foundry repos | Task 11 |
| `docs/skill-parity.md` with parity table + Codex prompt recipes section | Task 12 |
| Skills section renamed in README / generated files | Tasks 2, 3 (README deferred per user) |

### Placeholder scan

No TBDs or "implement later" items found. Every task has concrete code.

### Type consistency

- `ScaffoldOptions['tool']` union includes `'all'` from Task 1 — used consistently in Tasks 7, 8.
- `mergeDecisions` added to `ScaffoldOptions` in Task 1 — destructured in Task 7, passed in Task 9.
- `DetectedFile` defined in Task 6 (`detect.ts`) — imported in Task 8 (`prompts.ts`).
- `PointerFileStatus` defined and exported in Task 10 (`status.ts`) — used in tests.
- `migrateToV33` exported from Task 11 — imported in test file.
- `MERGE_MARKER_START` / `MERGE_MARKER_END` — defined in `scaffold.ts`, referenced only in tests via the written file content (no import needed in tests).
