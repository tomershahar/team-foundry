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
