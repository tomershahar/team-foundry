# F07 — Simulated comprehension probe (fresh-context agents)

**Date:** 2026-07-08
**README commit under test:** `1925ceb`
**Method:** five fresh-context AI agents (Claude Sonnet), each assigned a distinct reader
persona matching the [human UAT protocol](f07-comprehension-uat.md) recruit profile
(2 PMs, 2 engineers, 1 wildcard). Each agent received **only the README text** — no repo
access, no tools, no prior project knowledge — and answered the protocol's three
questions verbatim. Scoring used the rubric committed in the protocol before any answers
were read.

**What this is and is not:** this is a *proxy* for the spec's five-person human UAT, not
a replacement. Agents are stronger readers than skimming humans, so PASSes here are
weak-positive evidence and FAILs would be strong-negative. Confusion notes are the most
transferable signal. The maintainer decides whether this satisfies the F07 gate or
whether a human run is still required.

## Result: 5/5 passed all three questions (bar: 4/5)

| Reader persona | Q1 problem | Q2 what changed | Q3 run first |
|---|---|---|---|
| Senior PM, B2B SaaS, occasional Claude Code | PASS | PASS | PASS — playground |
| Staff engineer, heavy Cursor user, process-tool skeptic | PASS | PASS | PASS — playground |
| PM-turned-founder, CLI novice | PASS | PASS | PASS — playground |
| Backend engineer, Gemini CLI, fast skimmer | PASS | PASS | PASS — playground |
| Product designer, low CLI comfort (wildcard) | PASS | PASS (needed a re-read) | PASS — playground, friction noted |

All five independently chose `playground` as the first command — the funnel's primary
call-to-action is landing.

## Confusion themes (verbatim highlights)

1. **"Clearline" used before it is introduced** (2 readers): "'Clearline' appears
   suddenly as if I know what it is … buried after the comparison table already asked me
   to care about it."
2. **The model-ID sentence reads as evasive** (2 readers): "Hiding the model ID in a
   benchmark you're using for marketing is a yellow flag, not a transparency win."
3. **"Pointer file" is undefined jargon** (2 readers): "I don't know what a 'pointer
   file' is or what it does."
4. **Copilot's "surface-specific verification" is unparseable** (2 readers): "I don't
   know what 'surface-specific verification' means and whether that's a known limitation
   or a warning that it's broken."
5. **Non-CLI readers can't picture "open the folder in Claude Code"** (1 reader, designer
   persona): "I don't know what 'open a folder in Claude Code' means physically. Is that
   a VS Code extension? A terminal thing?"
6. **Doctor category names undefined** (1 reader): "'connectedness' and 'integrity rule
   families' … I'd have no idea what's being measured there without clicking through."

Items 1–4 were fixed in the commit following this probe (Clearline introduced inline,
model sentence rewritten plainly, adapter-file sentence de-jargoned, Copilot row now
says "not yet verified end-to-end" with a help-wanted link). Items 5–6 are recorded as
open editorial candidates, not blockers.

## Raw responses

Full verbatim answers from all five personas are preserved below.

### Reader 1 — Senior PM
- Q1: "Your AI coding tools all give different answers because they only see code — they don't know your team's decisions, priorities, or customers. team-foundry creates a shared, versioned context layer in your repo so every tool reads the same product context, not whatever each person happened to paste into chat."
- Q2: "Without context, the agent gave a reasonable but wrong recommendation — 'automate migrations in CI' — which conflicted with an existing team decision. With context, it gave the opposite recommendation and backed it up with specific incidents, owners, and an active ADR. The answer didn't just get longer; it got different."
- Q3: "`npx create-team-foundry playground` — I want to see a populated example before I commit to scaffolding anything in our actual repo."
- Confusion: model-ID sentence required two reads; Clearline unintroduced.

### Reader 2 — Staff engineer (skeptic)
- Q1: "It injects shared product context — outcomes, customers, decisions, quality bars — into a repo so every teammate's AI tool reads the same ground truth … The divergent-agents-giving-different-answers framing is the sharpest version of the problem and it landed."
- Q2: "Without context … directly contradicted an existing team decision — scored 0/5. With context, it cited specific incidents, owners, and an active ADR — scored 5/5. The content changed, not just the length or tone."
- Q3: "`npx create-team-foundry playground` — no commitment … If the files look like something a real PM wrote and not a JIRA template graveyard, I'd consider the real setup."
- Confusion: model-ID as "yellow flag"; Clearline unintroduced; "Git is the sync" tagline; formatting nit in Who-edits-what.

### Reader 3 — Founder, CLI novice
- Q1: "It stops your team's AIs from giving contradictory advice because they're all flying blind."
- Q2: "The answer went from generic-but-wrong to specific-and-grounded."
- Q3: playground — "but I'm a little fuzzy on whether I need to do something special in Claude to make it read those files."
- Confusion: "pointer file" undefined; `@AGENTS.md` syntax unfamiliar; Copilot hedge ambiguous.

### Reader 4 — Backend engineer, skimmer
- Q1: "team-foundry writes that product context into versioned files in the repo so every tool reads the same shared ground truth."
- Q2: "The answer wasn't just longer, it was actually different."
- Q3: playground, then "open the playground folder in Gemini CLI and ask it one of the suggested questions to see if the routing actually works."
- Confusion: "surface-specific verification"; doctor category names.

### Reader 5 — Designer (wildcard)
- Q1: "Like a shared brain for the whole team's AI setup, stored in the repo."
- Q2: "Honestly, I had to re-read this a couple times … the answer didn't just get longer, it actually changed direction."
- Q3: playground — "I'd open that folder in Claude in the browser... wait, it says 'Claude Code' specifically. That's where I'd get stuck."
- Confusion: doesn't know what "open a folder in Claude Code" means physically; "pointer file" undefined.
