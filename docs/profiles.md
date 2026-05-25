[← Back to README](../README.md)

# Profiles

team-foundry ships two profiles. Start with solo — it's enough to make your AI meaningfully better immediately. Grow into full when the team or context complexity demands it. The files are additive: nothing from solo is replaced.

---

## Profile comparison

| Profile | Files | Includes |
|---|---|---|
| **Solo** | 8–16 | AGENTS.md (primary) + pointer file(s) for your tool(s) + getting started guide, coach playbook, north star, outcomes, customers, stack. Count varies: 8 for single tool, up to 16 for "all tools" with Claude Code skills. |
| **Full** | 24 | Everything above + strategy, roadmap, assumptions, risks, trio, working agreement, AI practices, quality bar, decisions log, design principles, metrics, glossary, stakeholders, hierarchy, hooks, rules |
| **Full (federated)** | 30 | Everything above + per-folder `CLAUDE.md` routing files for multi-instance setups (8+ person teams) |

> **Tip:** Solo is the right default for most teams. The full profile adds structure that pays off at 4+ people — before that it can feel like overhead.

---

## File frontmatter

Every generated file has YAML frontmatter so the AI knows when to load it and why:

```yaml
---
purpose: What this file is for
read_when: startup | on-demand | always
last_updated: 2026-05-25
owner: name or role
---
```

Data-heavy files (outcomes, customers, assumptions, metrics) also include:

```yaml
source: where this data came from
last_validated: date it was last checked against reality
```

The `source:` and `last_validated:` fields let the AI reason about trust: a metric from a dashboard validated last week is treated differently from one last touched six months ago.

---

## Federated layout

The federated option (full profile only) adds a `CLAUDE.md` inside each content folder — `team-foundry/product/`, `team-foundry/engineering/`, `team-foundry/team/`, etc. Each one is a short routing file for that area, loaded automatically when Claude Code is working in that folder.

Use federated for larger teams (8+ people) where different roles own different folders and the full routing map is too much to load every session.
