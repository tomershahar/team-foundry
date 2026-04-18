import type { TemplateContext } from '../../types.js';

export function gettingStartedTemplate(ctx: TemplateContext): string {
  const toolName =
    ctx.tool === 'gemini'
      ? 'Gemini CLI'
      : ctx.tool === 'both'
        ? 'Claude Code or Gemini CLI'
        : 'Claude Code';

  const questionCount = ctx.profile === 'solo' ? '10' : '18–25';
  const fileCount = ctx.profile === 'solo' ? '7' : '19';

  const ingestionNote =
    ctx.ingestion === 'local' && ctx.ingestionPath
      ? `\n> **Before starting the interview**, tell ${toolName}:\n> "Read the docs in \`${ctx.ingestionPath}\` before we begin — use them to pre-populate answers."\n`
      : ctx.ingestion === 'paste'
        ? `\n> **Before starting the interview**, open \`.team-foundry/paste-content.md\`, paste your existing docs into it, and save. Then tell ${toolName}: "I've added docs to paste-content.md — use them to pre-populate answers."\n`
        : ctx.ingestion === 'mcp'
          ? `\n> **Before starting the interview**, make sure your MCP server is connected (Notion, Confluence, or Google Drive). Then tell ${toolName}: "Before we begin, pull any relevant strategy, roadmap, or customer research docs from [your MCP source] and use them to pre-populate answers."\n`
          : '';

  return `---
purpose: First-run instructions — what to do immediately after scaffolding
read_when: First time setting up team-foundry; onboarding a new team member to the repo
last_updated: ${ctx.date}
---

# Getting Started

You've scaffolded ${fileCount} files. They're mostly empty. One thing to do now:

> Open this project in **${toolName}** and say: **"Let's set up our team-foundry."**
${ingestionNote}
The AI will run the onboarding interview — ${questionCount} questions, about 30 minutes.
By the end, most files will be meaningfully populated.

## What the interview covers

Questions are grouped into themes, in this order:

1. **Identity** — what the team is and what it's building
2. **Purpose** — the outcomes you're working toward this quarter
3. **Customers** — named customers, direct quotes, jobs to be done
4. **Quality** — your honest stance on tech debt, bugs, and "shipped"
5. **Team** — how the trio works, how decisions get made
6. **Rhythm** — ceremonies, working norms, definition of done
7. **Technical** — stack, conventions, deployment
8. **Glossary** — domain terms and acronyms

The interview asks for evidence where it matters most:
- Customer names and direct quotes, not archetypes
- Outcome statements, not feature lists
- Your honest quality stance, not your aspirational one

Anything you skip gets marked as a gap — not silently omitted.

## After the interview

The coach keeps running. Things you can say at any time in ${toolName}:

| What to say | What happens |
|---|---|
| "let's do a team-foundry review" | Full audit — all files checked, findings listed |
| "review our outcomes" | Targeted review of one file (works for any file) |
| "what's missing from team-foundry?" | Lists gaps across all files |
| "run the weekly team-foundry review" | Weekly check-in, top 3 issues surfaced |

You can also just work normally — the coach surfaces gaps inline when they're relevant
to what you're doing, without you asking.

## File structure

\`\`\`
team-foundry/
├── product/     → outcomes, customers, roadmap, assumptions, risks
${ctx.profile === 'full' ? '├── team/        → trio, working agreement, AI practices\n' : ''}├── engineering/ → stack${ctx.profile === 'full' ? ', quality bar, decisions' : ''}
${ctx.profile === 'full' ? '├── design/      → principles\n├── data/        → metric definitions\n├── context/     → glossary and stakeholders\n' : ''}\`\`\`

## Sharing these files

team-foundry works best when everyone on the team is looking at the same files.
If you commit this to a shared Git repo, sync it via a shared folder, or use any
method your team already uses to share code — anyone using an AI tool will have
the same context.

If you're using a local or self-hosted AI tool, that's fine too. Just make sure
the repo or folder is accessible to everyone who needs it.

You can delete this file once the onboarding interview is complete.

<!-- GAP: Onboarding interview not yet run. Open ${toolName} and say "Let's set up our team-foundry." -->
`;
}
