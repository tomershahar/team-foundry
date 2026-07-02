# Manual E2E Test Plan — v3.3.0 Release

This test plan provides step-by-step instructions to manually verify the new pointer architecture, the **"All tools"** option, the **existing-file detect & merge** flow, and the **v3.3 migration** command.

---

## Preparation: Build the CLI
Ensure you have the latest code built locally before starting:
```bash
npm run build
```
We will reference the compiled entry point as `node [path-to-repo]/dist/index.js` (e.g. `node ../dist/index.js` from within a test subdirectory).

---

## Scenario 1: Fresh Scaffold with "All Tools" Choice

### Goal
Verify that scaffolding with the **"All tools"** option correctly generates the unified `AGENTS.md` context file along with three separate, thin pointer files (`CLAUDE.md`, `GEMINI.md`, and `.cursor/rules/team-foundry.mdc`) and Claude Code skills.

### Steps
1. Create a fresh temporary directory outside the `team-foundry` source tree and navigate into it:
   ```bash
   mkdir -p ../tf-sandbox-fresh && cd ../tf-sandbox-fresh
   ```
2. Initialize a mock `package.json` to allow auto-detection:
   ```bash
   npm init -y
   ```
3. Run the compiled CLI from your sandbox:
   ```bash
   node ../team-foundry/dist/index.js
   ```
4. Follow the interactive prompts:
   * **Which AI tool does your team use?** Select `All tools (Recommended)`
   * **Team size?** Select `1–3 people (solo profile - 7 files)`
   * **Is this repo public, internal-only, or private?** Select `Public`
   * **Where should the AI look for existing team context?** Select `Start fresh (Blank templates)`
5. Verify the console logs show the files created.

### Verification Checkpoints
- [ ] **Check AGENTS.md**: Open `AGENTS.md`. Verify it contains the full team-foundry routing table, areas of caution, and Claude Code skills list.
- [ ] **Check CLAUDE.md Pointer**: Open `CLAUDE.md`. Verify it contains **only** the `@AGENTS.md` include directive, the `> [!IMPORTANT]` callout, and the Claude Code skills list. It must **not** contain the full routing table.
- [ ] **Check GEMINI.md Pointer**: Open `GEMINI.md`. Verify it contains **only** a `> [!IMPORTANT]` callout instructing Gemini to read `AGENTS.md`.
- [ ] **Check Cursor Pointer**: Open `.cursor/rules/team-foundry.mdc`. Verify the rule has frontmatter containing `alwaysApply: true` and `globs: *`, and a body instructing Cursor to read `AGENTS.md`.
- [ ] **Check Claude Skills**: Verify that `.claude/skills/` contains the six `.md` skill files.

---

## Scenario 2: Pointer File Status & Drift Detection

### Goal
Verify that `status` accurately reports pointer file health and flags drift if a pointer file has been modified to omit the `AGENTS.md` reference.

### Steps
1. In the same sandbox directory (`../tf-sandbox-fresh`), run the `status` command:
   ```bash
   node ../team-foundry/dist/index.js status
   ```
2. Observe the new **Pointer files** output block. It should report all three pointer files as `✓ ok`.
3. Open `GEMINI.md` and modify it. Delete the words `AGENTS.md` and replace them with generic text:
   ```markdown
   # GEMINI.md
   This is a modified file with no references to the agents file.
   ```
4. Run `status` again:
   ```bash
   node ../team-foundry/dist/index.js status
   ```

### Verification Checkpoints
- [ ] **Drift Detected**: Verify that the pointer status block flags `GEMINI.md` with a warning (`⚠`) and labels it as `drifted / out of sync — AGENTS.md reference missing`.
- [ ] **Other Pointers Unaffected**: Verify that `CLAUDE.md` and `.cursor/rules/team-foundry.mdc` are still flagged as `✓ ok`.

---

## Scenario 3: Pre-Existing File Detection & Merge Options

### Goal
Verify that during setup, `team-foundry` scans for pre-existing files and handles **Merge**, **Replace**, and **Skip** decisions correctly.

### Steps
1. Create a new sandbox directory:
   ```bash
   mkdir -p ../tf-sandbox-existing && cd ../tf-sandbox-existing
   ```
2. Create a custom, pre-existing `CLAUDE.md` containing some manual project instructions:
   ```markdown
   # Custom CLAUDE.md
   - Never import from lodash directly.
   - Always run lint before committing.
   ```
3. Run the compiled CLI from this directory:
   ```bash
   node ../team-foundry/dist/index.js
   ```
4. Select `Claude Code`, `Solo profile`, `Start fresh`.
5. Observe the CLI scanner alert:
   > `Found existing CLAUDE.md (3 lines). What should team-foundry do?`

### Test Option A: Merge (Recommended)
1. Select `Merge — append team-foundry section, preserve existing content (recommended)`.
2. Scaffolding completes. Open `CLAUDE.md`.
3. Verify your custom rules (`# Custom CLAUDE.md`) are still at the top of the file.
4. Verify the team-foundry pointer content is successfully appended at the bottom, wrapped cleanly between:
   ```markdown
   <!-- BEGIN TEAM-FOUNDRY SECTION -->
   @AGENTS.md
   ...
   <!-- END TEAM-FOUNDRY SECTION -->
   ```
5. Run the CLI a *second time* and select **Merge** again. Verify that `CLAUDE.md` does *not* duplicate the team-foundry segment—it should cleanly replace the block between the existing markers.

### Test Option B: Replace
1. Re-seed a clean mock file `CLAUDE.md` with `original content`.
2. Run the CLI, select `Replace — back up to .team-foundry/backups/, write fresh`.
3. Open `CLAUDE.md`. Verify it is now a clean pointer containing **only** the team-foundry pointer template.
4. Verify that `.team-foundry/backups/` contains a backup file named `CLAUDE.md.[timestamp].backup` containing the string `original content`.

### Test Option C: Skip
1. Re-seed a clean mock file `CLAUDE.md` with `do not touch`.
2. Run the CLI, select `Skip — leave it alone, scaffold everything else`.
3. Verify `CLAUDE.md` is **completely untouched** (still says `do not touch`).
4. Verify that other files (like `AGENTS.md`) were successfully written.

---

## Scenario 4: Upgrade Migration (v3.3)

### Goal
Verify that the `migrate --to v3.3` subcommand upgrades a v3.2-style repository to the pointer architecture cleanly and safely.

### Steps
1. Create a sandbox directory representing an existing v3.2 install:
   ```bash
   mkdir -p ../tf-sandbox-migrate && cd ../tf-sandbox-migrate
   mkdir -p .team-foundry && mkdir -p team-foundry
   ```
2. Write a full-size, old-style `CLAUDE.md` (e.g. 50+ lines) at the root:
   ```markdown
   # CLAUDE.md
   Some old context.
   This file is 50 lines long.
   ...
   ```
3. Write a thin, old-style pointer `AGENTS.md` (under 40 lines) at the root:
   ```markdown
   # AGENTS.md
   See CLAUDE.md for full routing instructions.
   ```
4. Seed mock hierarchy so migrate knows it's team-foundry:
   ```bash
   echo "hierarchy" > .team-foundry/hierarchy.md
   ```
5. Execute the migration command:
   ```bash
   node ../team-foundry/dist/index.js migrate --to v3.3
   ```
6. Select `Proceed` when prompted.

### Verification Checkpoints
- [ ] **Pointer Swapped**: Open `CLAUDE.md`. Verify it has been replaced with the thin `@AGENTS.md` pointer template.
- [ ] **AGENTS.md Upgraded**: Open `AGENTS.md`. Verify it has been upgraded to the full primary context routing template (it should now be 100+ lines long).
- [ ] **Backups Saved**: Verify that `.team-foundry/backups/` contains timestamped backups of both your original `CLAUDE.md` and your original `AGENTS.md`.
