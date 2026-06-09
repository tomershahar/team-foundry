[← Back to README](../README.md)

# Claude Code Skills

Six slash commands ship with every Claude Code setup (`tool=claude`, `tool=both`, or `tool=all`). Each skill is a folder under `.claude/skills/` containing a `SKILL.md` — the layout Claude Code discovers automatically. The folder name becomes the slash command; the `description:` frontmatter tells Claude when to load the skill on its own. No extra configuration needed.

> **Note:** These slash commands are Claude Code–only. For equivalent workflows in Cursor and Codex, see [`skill-parity.md`](../skill-parity.md).

---

## The six skills

| Skill | What it does |
|---|---|
| `/team-foundry-intro` | Orient to the team — reads all context files, produces a summary |
| `/team-foundry-status` | Status read — what's on track, at risk, or blocked this cycle |
| `/team-foundry-review` | Full audit — all files checked, findings by severity |
| `/team-foundry-capture` | Capture what was learned in this session into the right file |
| `/team-foundry-decision` | Draft an ADR from the current conversation |
| `/team-foundry-feature` | Synthesize everything team-foundry knows about a specific feature |

Skills don't duplicate your team context. They point Claude Code at the right files and tell it what to do with them. The knowledge lives in your files.

---

## File layout

Each skill is a folder in `.claude/skills/` with a `SKILL.md` inside:

```
.claude/skills/
  team-foundry-intro/SKILL.md
  team-foundry-status/SKILL.md
  team-foundry-review/SKILL.md
  team-foundry-capture/SKILL.md
  team-foundry-decision/SKILL.md
  team-foundry-feature/SKILL.md
```

Each `SKILL.md` has `name:` and `description:` frontmatter (the description is what Claude Code uses to decide when to load the skill automatically) and a `# /team-foundry-<name>` heading followed by structured instructions for what to read and what to produce.

> **Upgrading from an older install?** Versions before 3.4 wrote skills as flat `.md` files directly in `.claude/skills/`, which Claude Code does not discover. Run `npx create-team-foundry migrate` — it moves them to the folder layout automatically.
