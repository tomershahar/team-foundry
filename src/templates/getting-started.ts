import type { TemplateContext } from '../../types.js';

export function gettingStartedTemplate(ctx: TemplateContext): string {
  const toolName =
    ctx.tool === 'gemini'
      ? 'Gemini CLI'
      : ctx.tool === 'both'
        ? 'Claude Code or Gemini CLI'
        : 'Claude Code';

  const questionCount = ctx.profile === 'solo' ? '10–12' : '18–25';
  const fileCount = ctx.profile === 'solo' ? '7' : '19';

  return `---
purpose: First-run instructions — what to do immediately after scaffolding
read_when: First time setting up team-foundry; onboarding a new team member to the repo
last_updated: ${ctx.date}
---

# Getting Started

You've scaffolded ${fileCount} files. They're mostly empty. One thing to do now:

> Open this project in **${toolName}** and say: **"Let's set up our team-foundry."**

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

- **Edit files directly** — the AI reads updated content in the next session
- **Update via conversation** — tell ${toolName} to update a file; it drafts, you confirm, it writes
- **Run a review** — say "let's do a team-foundry review" for a full audit at any time
- **Weekly** — the coach will surface drift and gaps in your normal work sessions

## File structure

\`\`\`
team-foundry/
├── product/     → outcomes, customers, roadmap, assumptions, risks
${ctx.profile === 'full' ? '├── team/        → trio, working agreement, AI practices\n' : ''}├── engineering/ → stack${ctx.profile === 'full' ? ', quality bar, decisions' : ''}
${ctx.profile === 'full' ? '├── design/      → principles\n├── data/        → metric definitions\n├── context/     → glossary and stakeholders\n' : ''}\`\`\`

You can delete this file once the onboarding interview is complete.

<!-- GAP: Onboarding interview not yet run. Open ${toolName} and say "Let's set up our team-foundry." -->
`;
}
