[← Back to README](../README.md)

# Claude Code Skills

Six slash commands ship with every Claude Code setup (`tool=claude`, `tool=both`, or `tool=all`). They are written as individual `.md` files to `.claude/skills/` — one file per skill, each with a `description:` frontmatter field that Claude Code surfaces as the slash command. No extra configuration needed.

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

Each skill is a single `.md` file in `.claude/skills/`:

```
.claude/skills/
  team-foundry-intro.md
  team-foundry-status.md
  team-foundry-review.md
  team-foundry-capture.md
  team-foundry-decision.md
  team-foundry-feature.md
```

Each file has `description:` frontmatter (what Claude Code shows in the slash command picker) and a `# /team-foundry-<name>` heading followed by structured instructions for what to read and what to produce.
