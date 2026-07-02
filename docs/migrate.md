[← Back to README](../README.md)

# Migrating

## From v2 to v3

```bash
npx create-team-foundry migrate --to v3
```

Adds the three new v3 files (`hierarchy.md`, `instructions/hooks.md`, `instructions/rules.md`) and appends `source:` / `last_validated:` to the frontmatter of your five data-heavy files.

**Existing files are never overwritten.** Your content is preserved exactly — the migration is additive only.

Existing v2 repos continue to work without migrating. v3 is the new default for new repos.

---

## From v3.x to v3.3

```bash
npx create-team-foundry migrate --to v3.3
```

Upgrades existing team-foundry repos to the pointer architecture:

1. Backs up existing `CLAUDE.md`, `GEMINI.md`, `.cursor/rules/team-foundry.mdc`, and `.github/copilot-instructions.md` files to `.team-foundry/backups/` with a timestamp
2. Rewrites legacy Claude, Gemini, and Cursor files as thin adapters; preserves existing Copilot instructions and adds a marked team-foundry route
3. If your `AGENTS.md` is the old thin v3.2 format (< 40 lines), backs it up and upgrades it to the new primary format

> **Note:** All replaced files are backed up before anything is written. You can find them at `.team-foundry/backups/{filename}.{timestamp}.backup` and restore manually if needed.

The command shows a summary of changes and asks for confirmation before proceeding.
