# team-foundry — Product Requirements Document

**Author:** Tom Shahar
**Status:** v2.1 (build-ready)
**Last updated:** April 18, 2026

---

## TL;DR

team-foundry is an open-source CLI that helps a product team articulate and maintain the things that matter most to how they work — their outcomes, their customers, their decisions, their quality bar — in a format their AI coding tools can read natively. The act of articulating those things sharpens the team. Keeping them current keeps the team honest. As a side effect, Claude Code and Gemini CLI become meaningfully better partners because they finally have real context.

It runs entirely on the AI tool the team already uses. No backend, no API keys, no token costs on the maintainer's side.

---

## Problem

### The surface problem: AI tools have amnesia

Product teams using Claude Code and Gemini CLI start every session from zero. The AI doesn't know what the team is building, what outcomes matter, who the customers are, what decisions have already been made, or what "good" looks like for this product. Teams compensate by re-explaining context in every prompt. The AI produces generic advice or, worse, confidently contradicts the team's own strategy.

The partial fix — writing a CLAUDE.md or GEMINI.md at the repo root — is widely known and widely under-used. Teams write three lines about their tech stack and call it done. The information that would actually help the AI (outcomes, customer knowledge, decision history, team rituals, quality stance) lives scattered across Confluence, Notion, Slack threads, and meeting decks, never in the repo where the AI reads.

### The deeper problem: most teams have never articulated these things at all

The real problem isn't that the files are missing. It's that the *thinking* is missing. Most product teams operate on partially-shared assumptions about their customers, fuzzy outcomes that are really outputs in disguise, quality bars nobody wrote down, and decisions that were made in a meeting nobody logged. Drift happens invisibly because there's nothing to drift from.

Dean Bloembergen at Owner.com puts it bluntly: teams naturally drift toward disorder. Priorities blur. Energy scatters. People start optimizing locally. Entropy is the default. The teams that stay aligned do so because they've made reality undeniable — shared customers, shared data, shared firsthand experience — and because they've committed their thinking to an artifact the whole team shares.

team-foundry sits at that intersection. It's a lightweight team operating artifact that forces the articulation work, maintains it against drift, and serves as the shared brain — for the team, and for the AI tools the team uses.

### Why this matters more in 2026

Dean's point about AI is correct: it's not an equalizer, it's a multiplier. Exceptional teams use AI to compress months into days. Average teams use it to move slightly faster in the wrong direction. The difference is context. A team that has articulated its outcomes, customers, and quality bar gives its AI tools a multiplier. A team that hasn't gives its AI tools a megaphone for mediocrity.

This is why team-foundry is a culture artifact first and an AI tool second. The files help the AI, but the articulation helps the team — and without the articulation, the AI help is shallow.

---

## Who it's for

**Primary user:** The PM, EM, or staff engineer on a product team (3–15 people) who has already adopted Claude Code or Gemini CLI and noticed the AI isn't as useful as it should be. This person has often already written a CLAUDE.md and been disappointed.

**Secondary user:** The product leader (Head of Product, VP Product, CTO) running a multi-team adoption of AI coding tools, who sees usage being uneven across teams and wants a shared pattern without top-down mandate.

**Tertiary user:** The solo founder or 1–3 person builder team who wants the structure of a real product team's thinking without the overhead of a 15-person team.

**Explicitly not for:** Enterprise AI governance teams looking for policy enforcement. Large org rollouts with compliance requirements. Teams that don't already use AI coding tools. Teams that believe software alone will make them better without doing the articulation work.

---

## Goals

**Primary goals**

1. A new team can go from `npx create-team-foundry` to a populated, honest team-foundry in under 30 minutes, including ingesting their existing docs.
2. After setup, any Claude Code or Gemini CLI session in the repo produces visibly better, team-specific output — referencing the team's actual customers, outcomes, and constraints, not generic advice.
3. The built-in coach surfaces at least one genuinely useful insight per active week — a gap, a drift, a contradiction between stated values and observed behavior — and offers a concrete next step or drafts the fix directly.
4. A team using team-foundry for 90 days reports (via simple self-assessment) more clarity on their outcomes, more honest awareness of their quality gaps, and more grounded customer empathy than they had before. Measured by a built-in 5-question retrospective the coach offers quarterly.
5. Adoption: 100+ GitHub stars in the first month, at least 10 external teams with signed-off team-foundries in use (measured via opt-in telemetry or PR/issue signal).
6. Narrative fit: credible as the flagship practical artifact of the Engineering for Tomorrow thesis — "tools are 20%, culture is 80%" — living explicitly at the intersection.

**Secondary goals**

7. Runs entirely on the user's own Claude Code / Gemini CLI. Zero maintainer-side infrastructure, zero API keys collected, zero token costs borne by team-foundry.
8. Reads as faithful to Cagan-inspired empowered-team principles and Delta Force craft standards, without lecturing. Meets teams where they are and offers concrete next steps toward where they could be.
9. Works for a solo builder and a 15-person team using one spine with profile-aware materialization. No separate products, no migration.

---

## Non-goals

- **Not a SaaS.** No accounts, auth, billing, dashboard, or hosted backend.
- **Not an enterprise tool.** No RBAC, audit logs, or compliance features in v1.
- **Not a replacement for Linear, Jira, Notion, or Confluence.** team-foundry describes the team; it doesn't manage work.
- **Not a team-management platform.** No OKR tracking, 1:1 notes, or performance features.
- **Not AI-tool-agnostic in v1.** Claude Code and Gemini CLI only. Cursor, Windsurf, etc. are v2+.
- **Not a methodology enforcer.** The coach suggests, asks, drafts fixes. It never blocks or corrects.
- **Not bundled with live integrations.** Jira/Notion/Confluence happens via the user's own MCP servers. team-foundry guides, doesn't host.
- **Not a culture-in-a-box.** Software can enable culture work. It cannot substitute for hard team conversations. team-foundry says this explicitly rather than implying otherwise.
- **Features deferred to v2 (not rejected — pending adoption evidence before shipping):** agent support (`agents.md`, B14 context bundle, CLI agent flag, reset anchor concept), pre-launch scenario forcing (B15 Phase 1, pessimistic/realistic/optimistic scenario block), and the Opportunity Solution Tree file (`ost.md` with Mermaid rendering and coach-as-primary-author pattern). Each is a defensible idea. None ships until we have real signal that v1 users want it.

---

## Core product principle

**team-foundry is a mirror, not a template pack.**

Templates give teams a structure to fill. Mirrors reflect what's actually there — including the gaps, the drift, and the difference between stated values and observed behavior. A template shipped alone becomes stale within a month. A mirror stays useful as long as the team keeps looking at it.

Every design decision in this PRD traces back to this principle:

- Files are structured to make gaps visible, not hide them.
- The coach surfaces drift between what files claim and what commits/conversations show.
- The onboarding interview demands specific evidence (named customers, actual quotes) rather than accepting generic answers.
- Coaching behaviors are diagnostic-first: they name the gap honestly before suggesting a next step.

If team-foundry ever becomes "here are 18 templates, fill them in," we've failed.

---

## User journey

### Day 0 — First setup (≤30 minutes, done once)

A team lead decides to try team-foundry. They run:

```
npx create-team-foundry
```

The CLI asks four scoping questions:

1. Which AI tool does the team use? (Claude Code / Gemini CLI / both)
2. Team size profile? (Solo or 1–3 people / Full product team of 4–15)
3. Is this repo public, internal-only, or private? (Affects what the coach suggests including.)
4. Do you have existing documentation to ingest? (Local folder path / MCP source / Paste content / Skip)

Based on profile, the CLI materializes the right files — solo profile creates 6 files, full profile creates 15. The solo team literally does not see a `team/topology.md` file, because they don't need one yet. Growth later adds files via coach suggestion.

The CLI generates the appropriate root instruction file (`CLAUDE.md`, `GEMINI.md`, or both), writes a `GETTING_STARTED.md` with a single instruction:

> Open this project in Claude Code (or Gemini CLI) and say: *"Let's set up our team-foundry."*

The team lead opens Claude Code. The root instruction file tells Claude Code to conduct the onboarding interview. It's a guided conversation — 18–25 questions for full profile, 10–12 for solo — grouped by theme (identity → purpose → measurement → customers → quality → team → rhythm → technical → glossary). Each question explains why it matters in one sentence and gives 2–3 example answers from other teams.

The onboarding interview demands specific evidence where it matters:

- "Name three customers by name and one specific thing you learned from each by talking to them directly."
- "Write your outcomes in the form 'we want X to change for Y customer segment,' not 'we want to ship feature Z.'"
- "What's your team's stance on tech debt and bug backlogs? The honest answer, not the aspirational one."

If the team has ingested existing docs, the coach pre-populates with high-confidence draft answers for the user to confirm, edit, or reject. Low-confidence items become explicit gaps, not silent guesses.

By the end of the interview:

- 70–90% of files are meaningfully populated (not just "filled in")
- Remaining gaps are explicit, with a one-line note of what's missing and why it matters
- The coach ends with a walkthrough: what each folder does, how to invoke the coach, and one suggested first action

### Day 1 onward — Normal work with sharper context

The team works as they normally would. Claude Code and Gemini CLI sessions in this repo now have real team context. Feature prioritization questions get answered against actual outcomes. Code reviews reference the quality bar the team wrote down. Discovery conversations cite actual customer quotes.

Files evolve in two ways:

- **Direct editing** — users edit files in their editor; AI tools read updated content next session.
- **Conversational updates** — users tell Claude Code "add a decision to our ADR folder about Postgres vs DynamoDB" and the AI writes the file.

When the coach notices drift, it offers to draft the update: *"I notice you shipped the new kiosk flow three weeks ago but `product/now-next-later.md` still lists it under 'next.' Want me to draft an update moving it to 'done' and pulling something forward into 'next'?"* User confirms or edits. No silent writes.

### Week 2+ — The coach earns its keep

The coach activates in three modes. Only one requires explicit user action.

- **Inline** — Primary mode. Always on. Every time the user asks the AI tool anything in the repo, the coach silently evaluates whether the question surfaces a gap, drift, or contradiction in team-foundry files. If yes, it speaks briefly inside the normal response — cites the specific file, names the issue, offers to draft a fix. If nothing relevant, it stays silent. The user does not invoke this; it emerges from the context of their actual work. Nudge memory applies here only.
- **Explicit** — User types a trigger phrase. Runs the full audit (all fifteen behaviors) or a targeted one if scoped. Ignores nudge memory — user wants the full picture. Trigger phrases are listed in the generated `CLAUDE.md`/`GEMINI.md` Coach section so users can find them without reading docs. Key phrases: "let's do a team-foundry review," "coach mode," "review our [file]," "what's missing from team-foundry?"
- **Scheduled** — Proactive. When the user opens a session on or after the scheduled review day (weekly default), coach opens with: "It's been N days since our last review — run it now, skip, or snooze?" Can be turned off in configuration; Modes 1 and 2 remain. Ignores nudge memory when run.

Coaching behaviors, in priority order:

1. **Outputs framed as outcomes** in `product/outcomes.md`. Coach names the pattern honestly, explains why it matters, offers to reframe.
2. **Customer contact staleness** — any persona in `product/customers.md` without direct contact in 60+ days gets flagged.
3. **Stale assumptions** in `product/assumptions.md` older than 30 days that haven't been tested or updated.
4. **Decisions without rationale** in `engineering/decisions/`.
5. **Reality drift** — difference between what files claim and what commits/PRs/conversations show. (Coach reads the last N commits or PRs if available.)
6. **Quality bar drift** — if `engineering/quality-bar.md` says "zero tolerance for bug backlogs" but the team has an open-bug-count growing, coach surfaces it.
7. **Metrics without definitions** in `data/metrics.md`.
8. **Risks listed but never revisited** in `product/risks.md`.
9. **The "four alignment questions" audit** — can a new team member answer (1) why does this matter, (2) what does success look like, (3) what's the strategy, (4) what matters right now, from the files alone? Coach checks quarterly.
10. **Bedrock need challenge** — when team writes a feature idea, coach periodically asks "what's the underlying need? Is there a deeper level?"
11. **Gap-filling nudges** — when user asks something that would benefit from an empty file, coach suggests filling it.
12. **MCP suggestions** — when the user would benefit from live data, coach suggests installing the relevant MCP server.
13. **Build-trap detector (B13)** — when an item moves into the "Now" section of `product/now-next-later.md` without either (a) a linked experiment reference or (b) a `Last Validated` date in `product/assumptions.md` within the last 30 days, coach names the gap and offers to draft an assumption entry or link an existing one. Integrates with behavior 3 (stale assumptions): B3 cleans stale beliefs already there, B13 gates new work going in. Same coach voice.
14. **Experiment readout: gap analysis + segment check (B15 Phase 2)** — when conversation signals that experiment results are in ("we saw X%", "results came back", "experiment ended"), coach runs two checks before accepting a ship/kill decision: (a) if actual vs. expected delta > 20%, ask "why?" before moving on; (b) "Did you check results by your primary customer segment? Topline failures sometimes hide segment wins." Coach drafts a readout entry in `assumptions.md`: expected → actual, segment breakdown (or explicit note it wasn't checked), conclusion, what's next. User confirms.
15. **Strategy coherence (B16)** — when an item is added to `product/now-next-later.md` or discussed as a candidate (full profile): coach checks whether the item reinforces the guiding policy in `product/strategy.md`. If yes, affirm briefly. If unclear: "How does this connect to [guiding policy]? Walk me through it." If no: "This looks like it pursues [different direction]. That's not necessarily wrong, but it's a strategy conversation, not a prioritization call." Never blocks. For solo profile (no `strategy.md`): coach asks one question when items go into Now — "How does this help you win against [competitor/alternative] for [target customer]?" If the PM can't answer in one sentence, that's the signal.

**Guardrails for all behaviors — B13, B15 Phase 2, B16 specifically:**

- No silent writes. Every drafted entry follows the conversation-as-update protocol (F4.4): coach drafts, user confirms, coach writes.
- No blocking. Every behavior names the gap and offers a next step. None prevent the user from proceeding.
- Nudge memory applies (F4.5). Once flagged, don't repeat within the 7-day window unless user asks.
- Mode 1 (inline) activation only. These behaviors surface when the user's work triggers them — not as standalone commands.
- Hell-yes test applies. If any of B13, B15 Phase 2, or B16 feels like a nag rather than a help after integration, flag it for cut during Iteration 11 UAT.

**Coach personality — guardrails:**

- Curious, specific, non-preachy.
- Diagnostic-first: names the gap honestly before suggesting a fix.
- Assumes teams are in transition, not failing. Never lectures or implies the team should already know better.
- Never frames speed vs. quality as a tradeoff. Dean's framing: quality is what allows speed to compound.
- Cites the team's own files, not general wisdom.
- Offers to draft the fix, not just flag the problem.
- Has memory of recent nudges (inline mode only) to avoid repetition within a configurable window. Explicit and scheduled reviews always give the full picture.
- Never uses "journey" as a verb, never uses "empower" as a verb, never ends with "let me know if I can help further."

### Month 3+ — Quarterly retrospective

Every 90 days, the coach offers a 5-question retrospective to the team:

1. Can you describe your outcomes more clearly than you could 90 days ago?
2. Do you know your customers better than you did 90 days ago?
3. Has your quality bar become more honest (not necessarily higher, more honest)?
4. Have you made better-informed product decisions because of the context in team-foundry?
5. What's one thing in team-foundry that feels stale and needs attention?

Self-reported, no-login, purely for the team's own calibration. Coach uses the answers to tune ongoing nudges. The quarterly retrospective also includes a **strategy coherence check** (B16 Phase 2 equivalent): coach reviews all "Now" and "Next" items against the guiding policy in `strategy.md` and flags drift or missing coherent actions. This folds into the existing retrospective conversation rather than running as a separate named phase.

This is also the primary user-facing success metric (Goal 4).

---

## Requirements

### Functional requirements

**F1 — CLI scaffolding**

- F1.1 — Single entry: `npx create-team-foundry`. Node-based. No install required.
- F1.2 — Interactive prompts: AI tool, team-size profile, repo visibility, doc ingestion source.
- F1.3 — Generates the appropriate root instruction file(s): `CLAUDE.md`, `GEMINI.md`, or both.
- F1.4 — **Profile-aware file materialization.** Single spine, but solo profile creates only 6 files and full profile creates 15. Unmaterialized files don't exist on disk; they're added later via coach-guided upgrade if the team grows.
- F1.5 — **File-level frontmatter for AI consumption.** Every generated file opens with a YAML frontmatter block containing `purpose`, `read_when`, and `last_updated`. This lets AI tools route reads efficiently.
- F1.6 — Generates `.gitignore` template that excludes `team-foundry/private/` by default for teams that want to sideline sensitive content.
- F1.7 — Completes in under 10 seconds on standard hardware.

**F2 — Onboarding interview**

- F2.1 — Conducted inside Claude Code / Gemini CLI, not in the CLI itself. Root instruction file tells the AI how to run it.
- F2.2 — Sequence: identity → purpose → measurement → customers → quality → team → rhythm → technical → glossary.
- F2.3 — 18–25 questions for full profile, 10–12 for solo. Plain language, not jargon.
- F2.4 — Each question includes: why it matters (one sentence), 2–3 example answers, explicit permission to skip.
- F2.5 — Skipped answers become tracked gaps in the relevant file (commented-out placeholder with a note).
- F2.6 — **Demanding evidence where it matters:** customers file requires named customers + direct quotes, outcomes file requires outcome-shaped language, quality-bar file requires honest stance.
- F2.7 — Answers written directly into files as the interview progresses. User sees files filling up in real time.
- F2.8 — Repo visibility answer (public/internal/private) adjusts coach language for the session ("I notice this is public — keep customer names generic in customers.md").
- F2.9 — Total onboarding time: target 30 minutes, hard cap 45 minutes.

**F3 — Artifact ingestion**

- F3.1 — Two input modes:
  - **Local folder** containing exported docs (md, pdf, docx, pptx, txt). AI tool reads natively.
  - **MCP source** (Notion MCP, Confluence MCP, Google Drive MCP) the user has installed.
- F3.2 — Extracted context presented as draft answers for user confirmation with confidence levels:
  - High confidence: draft pre-populated, user confirms or edits.
  - Medium confidence: draft shown as question, user chooses.
  - Low confidence: skipped, marked as gap.
- F3.3 — No silent writes from ingestion. User always sees and approves.

**F4 — The coach**

- F4.0 — **Root-file routing map.** Root `CLAUDE.md` / `GEMINI.md` contains only identity, routing map (which file to read for which query type), and coach activation pattern. Full coach playbook lives in `.team-foundry/coach.md`, loaded on demand. This preserves token budget.
- F4.1 — Lives as instructions embedded in team-foundry files. No separate runtime. Activates whenever the user interacts with the AI tool in the repo.
- F4.2 — Three activation modes: **inline** (always-on, silently evaluates every interaction), **explicit** (user-invoked, full or targeted audit), **scheduled** (proactive session-open prompt, weekly default, configurable). Only explicit requires user action. Trigger phrases for explicit mode are surfaced in the generated root file (`CLAUDE.md`/`GEMINI.md`) and `GETTING_STARTED.md` so users can discover them without reading documentation. See User Journey section for full mode descriptions.
- F4.3 — **Fifteen coaching behaviors**, in priority order as listed in the User Journey section above. Behaviors 1–12 are the core set. Behaviors 13 (build-trap detector), 14 (experiment readout — segment check + gap analysis), and 15 (strategy coherence) were added in v2.1. Behavior 14 in the implementation sequence (B14 agent context bundle) is deferred to v2.
- F4.4 — **Conversation-as-update mechanism.** Coach offers to draft fixes for every drift it flags. User confirms, edits, or rejects. Coach writes the file after confirmation. No silent writes.
- F4.5 — **Nudge memory applies to inline mode only.** Coach tracks recently-flagged issues and doesn't repeat within a configurable window (default 7 days). Explicit and scheduled modes ignore memory — when the user asks for a review, they get the full picture.
- F4.6 — **Reality drift detection.** Coach reads the last N commits or PRs (when available) and flags contradictions between stated files and observed behavior.
- F4.7 — **Quarterly retrospective.** 5-question self-assessment the coach offers every 90 days. Includes a strategy coherence check (B16 Phase 2): coach reviews Now/Next items against `strategy.md` guiding policy as part of the same retrospective conversation, not a separate named phase.
- F4.8 — **Personality guardrails** as listed in the User Journey section. Enforced via explicit instructions in `.team-foundry/coach.md`.
- F4.9 — **Context priority hierarchy.** When files contradict each other, the coach resolves conflicts in this order and names the conflict explicitly rather than silently picking one:
  1. `north-star.md` — destination, never overridden
  2. `strategy.md` — the route (full profile only; absent for solo)
  3. `outcomes.md` — current cycle commitments
  4. `now-next-later.md` — execution, lowest authority
  This hierarchy is a standing instruction in `.team-foundry/coach.md`, not a named behavior. It applies whenever the coach detects that two files point in different directions.

**F5 — Update and maintenance**

- F5.1 — Users can edit any file directly. AI tool reads updated content next session.
- F5.2 — Users can update via conversation. AI tool drafts, user confirms, AI tool writes.
- F5.3 — `team-foundry review` (as a conversational trigger in the AI tool) runs the full audit.
- F5.4 — No file is ever overwritten without user confirmation.

**F6 — Tool support**

- F6.1 — v1: Claude Code, Gemini CLI.
- F6.2 — CLI flag `--tool=claude|gemini|both`. Default: prompt.
- F6.3 — Generated files functionally equivalent across tools. Only filename and tool-specific pragmas differ.

### Non-functional requirements

**N1 — Quality**

- TDD per iteration. Tests pass before iteration is considered complete.
- UAT by Tom between iterations. No iteration proceeds without sign-off.
- Generated content reads as written by a thoughtful senior PM, not a template. Judged by Tom during UAT.
- **Hell-yes standard** (per Dean Bloembergen): every file in the spine, every coaching behavior, and every question in the onboarding interview must pass a hell-yes test. If it's not obviously essential, it's cut.

**N2 — Zero maintainer-side infrastructure**

- No hosted services, no API keys collected, no token costs.
- Opt-in telemetry only, clear disclosure, disabled by default.

**N3 — Licensing and openness**

- MIT license.
- GitHub-first, public development.
- Contribution guide, code of conduct, issue templates.

**N4 — Performance**

- CLI scaffolding: under 10 seconds.
- Onboarding: 30 minute target, 45 minute hard cap.

**N5 — Privacy**

- All data stays in the user's repo.
- `.gitignore` template excludes `team-foundry/private/` by default.
- Onboarding asks repo visibility, adjusts coach language.
- README section explicitly addresses the "strategy in Git" concern with practical guidance.

**N6 — Documentation**

- README explains team-foundry in under 60 seconds of reading.
- Separate methodology doc covers the Cagan + Delta Force thinking. Available, not required.
- At least one fully worked example repo showing a realistic team in mature state.
- **Explicit honest note:** team-foundry enables culture work, it doesn't replace it. If the team isn't willing to do hard conversations about outcomes, customers, and quality, no tool fixes that. Stated in README.

### Success metrics

**Primary (user-facing):**

- **Context surfacing rate** — count of team-foundry file references per AI session per week. Higher = better. Surfaced to the team by the coach in weekly reviews.
- **Quarterly retrospective scores** — aggregate self-reported clarity improvements on outcomes, customers, and quality. Measured via F4.7.

**Secondary (maintainer-facing):**

- GitHub stars, issues, PRs, external team adoption.
- Drift-fix rate — how many drift items the coach caught and fixed vs. let go stale (opt-in telemetry only).

---

## Open questions

1. **Coach scheduled-review default.** Weekly for active teams, but quiet teams might get alert fatigue. Options: weekly / bi-weekly / adaptive based on commit activity.
2. **Gap-marking UX.** When a field is skipped, do we write a commented-out placeholder in the file, a separate `.team-foundry/gaps.md` file, or both? Separate is easier to scan; in-file is easier to fill.
3. **Worked example identity.** A recommerce trio is the natural fit given Tom's context but risks being read as a Swappie artifact pre-decision. Alternatives: fictional SaaS, fictional marketplace, fictional fintech. **Recommendation: decide after Swappie week-17.**
4. **Solo-to-full upgrade path.** When a solo team grows to 4+ people, coach detects and offers to add files. What exactly triggers the detection? Commit-author count? Team member count in `team/trio.md`? User self-declaration?
5. **MCP discovery.** No registry of "good MCP servers for product teams" exists. Curate a short recommended list, or link to general registry?
6. **Telemetry default.** Opt-in (principled default) or opt-out (better data for iteration). Recommendation: opt-in.
7. **Name availability.** "team-foundry" needs npm and GitHub availability check before public commit. Fallback list prepared if taken.
8. **Reality-drift detection scope.** Coach reads last N commits/PRs. What's N? Configurable? Free for AI tools to decide based on context budget?
9. **Nudge-memory duration default.** 7 days feels right for most. Should it be user-configurable per behavior?
10. **Strategy coherence platitude check.** Coach interrogates a guiding policy that doesn't say no to anything. What's the exit condition — does the coach accept the second draft unconditionally, or can it push back twice?

---

## Appendix A — File spine (final, hell-yes cut applied)

Full profile: **15 files** across 6 folders. Solo profile: **6 files** marked with (S).

```
team-foundry/
├── CLAUDE.md  (or GEMINI.md, or both)         # Root: identity + routing map + coach pointer (S)
├── GETTING_STARTED.md                          # First-run walkthrough (S)
├── .team-foundry/
│   └── coach.md                                # Full coach playbook (loaded on demand)
├── product/
│   ├── north-star.md                           # Vision, NSM, balancing metrics (S)
│   ├── outcomes.md                             # Current quarter outcomes, outcome-shaped (S)
│   ├── customers.md                            # Named customers, personas, JTBD, quotes (S)
│   ├── now-next-later.md                       # Roadmap in Dean's format
│   ├── assumptions.md                          # Open questions, untested beliefs (with dates)
│   ├── risks.md                                # Value/usability/feasibility/viability
│   └── strategy.md                             # Rumelt kernel: Diagnosis, Guiding Policy, Coherent Actions
├── team/
│   ├── trio.md                                 # Product trio roles + members
│   ├── working-agreement.md                    # DoD, DoR, ceremonies, norms
│   └── ai-practices.md                         # How this team uses AI
├── engineering/
│   ├── stack.md                                # Tech, conventions, deployment (S)
│   ├── quality-bar.md                          # Stance on tech debt, bugs, "shipped" definition
│   └── decisions/                              # ADR folder
├── design/
│   └── principles.md                           # Tone, accessibility, design values (merged)
├── data/
│   └── metrics.md                              # Definitions, ownership, sources
└── context/
    ├── glossary.md                             # Domain terms + acronyms
    └── stakeholders.md                         # Who cares, what they care about
```

**New in v2.1 — `product/strategy.md` (full profile only):**
Three sections per Rumelt's Strategy Kernel:
- **Diagnosis** — anchored to `north-star.md`. First-fill coach prompt: "Our North Star is [X] — what's the biggest obstacle currently stopping us from hitting it?" That answer is the Diagnosis.
- **Guiding Policy** — what we're betting on and explicitly what we're NOT doing. Coach interrogates any draft that doesn't say no: "This policy is all yes. For this to be a strategy, tell me one type of customer or feature we're explicitly not pursuing this quarter."
- **Coherent Actions** — initiatives that reinforce the guiding policy. Pre-populated with inline BAD/GOOD comment examples.

First-open coach framing: "The guiding policy is only useful if it says no to something. 'We want to be the best product tool' is not a strategy. 'We win by X, which means we won't do Y' is."

**Updated in v2.1 — `product/assumptions.md`:**
Each assumption entry gains two new optional fields:
- `Last Validated:` date — checked by B13 (build-trap detector) and B3 (stale assumptions).
- `Evidence:` link — optional transcript or note URL. Checked by B15 Phase 2 (experiment readout) when assessing customer signal quality.

A readout section is added to the file template (not pre-populated at scaffold; populated by B15 Phase 2 after experiment results come in):
```
## Experiment readouts
<!-- Populated by the coach after experiment results — expected → actual, segment breakdown, conclusion, next step -->
```

**What was cut from v1 (18 → 14 files, now 15 with strategy.md):**

- `design/system.md` merged into `design/principles.md` (most teams don't have a design system yet; separate file was overhead).
- `team/topology.md` cut (Team Topologies vocabulary is too niche to justify a dedicated file; can be referenced in `team/trio.md` if relevant).
- `product/discovery.md` + `product/delivery.md` merged into `product/now-next-later.md` per Dean's format (tighter and more opinionated).

**Solo profile materializes 6 files:** root + GETTING_STARTED + north-star + outcomes + customers + stack. Other 9 files added later via coach-guided upgrade if team grows. `strategy.md` is full profile only; solo gets the B16 nudge question without a file.

---

## Appendix B — Build order (TDD/UAT iterations)

Each iteration is independently testable and independently useful. No iteration ships until tests pass and Tom signs off on UAT. Order is chosen so foundations are solid before the hardest pieces (coach behaviors, reality drift) are layered on.

**Iteration 1 — CLI scaffolding foundation**
Node CLI skeleton, arg parsing, prompt library. Generates empty folder structure (full profile 15 files, solo profile 6). Picks correct root filename per tool. Writes `.gitignore`. Tests: CLI runs end-to-end, correct structure per profile, no edge-case crashes.

**Iteration 2 — Static templates and frontmatter**
All files get stub content with YAML frontmatter (`purpose`, `read_when`, `last_updated`). Purpose headers, commented-out placeholders. Includes `strategy.md` stub (full profile) and updated `assumptions.md` with `Last Validated` and `Evidence` fields and readout section. Tests: files match expected content, frontmatter is parseable.

**Iteration 3 — Root routing and coach stub**
Root `CLAUDE.md` / `GEMINI.md` gets identity + routing map + coach pointer. `.team-foundry/coach.md` gets the base playbook (personality, activation modes, context priority hierarchy, no behaviors yet). Tests: AI tools read and route correctly, coach activates on trigger phrases.

**Iteration 4 — Onboarding interview**
Interview sequence, themes, example answers, skip handling, demanding-evidence patterns. Writes answers directly into files with gap tracking. Tests: interview runs in Claude Code and Gemini CLI, populates files correctly, gaps tracked.

**Iteration 5 — Coach behaviors core (1–4)**
Outputs-vs-outcomes, customer contact staleness, stale assumptions, decisions without rationale. Inline + explicit modes. Tests: behaviors trigger correctly, grounded in team's files, no false positives.

**Iteration 6 — Conversation-as-update mechanism**
Coach offers to draft fixes. User confirms/edits/rejects. Files written after confirmation. No silent writes. Tests: draft + confirm + write flow works cleanly across behaviors.

**Iteration 7 — Artifact ingestion (local folder)**
User points at folder of exported docs. AI tool reads natively. Confidence-based drafts surfaced for confirmation. Tests: docs read correctly, drafts accurate at high confidence, gaps correct at low confidence.

**Iteration 8 — Artifact ingestion (MCP)**
Same confirmation flow via MCP-connected sources. Fallback to local if MCP absent. Tests: MCP calls work, fallback clean.

**Iteration 9 — Coach behaviors full set (5–15)**
Reality drift, quality bar drift, metrics, risks, alignment audit, bedrock need, gap-filling, MCP suggestions (behaviors 5–12). Build-trap detector (B13), experiment readout segment check + gap analysis (B15 Phase 2), and strategy coherence inline (B16). Nudge memory. Scheduled review. Strategy coherence check folded into quarterly retrospective (F4.7) — not a separate named phase. Tests: all fifteen behaviors trigger correctly, no repetition within memory window, B13/B15/B16 follow no-silent-writes and no-blocking guardrails, scheduled review runs end-to-end.

**Iteration 10 — Quarterly retrospective**
5-question self-assessment. Coach offers every 90 days. Includes strategy coherence check as part of the retrospective conversation. Aggregates responses internally, feeds back into nudge tuning. Tests: retrospective triggers on schedule, responses stored correctly, nudge tuning observable.

**Iteration 11 — Worked example repo**
Fully populated team-foundry for a fictional product team. Identity decision deferred to post-Swappie-week-17. Published as separate repo or branch. Includes populated `strategy.md` (full profile), `Last Validated` fields in `assumptions.md`, and at least one experiment readout entry. Hell-yes test: B13, B15 Phase 2, B16 each validated as genuinely useful vs. nagging in context of the worked example. Tests: example is internally consistent, reads as credible to Cagan-literate reviewers and passes Tom's UAT.

**Iteration 12 — Documentation and launch prep**
README (60-second explanation), methodology doc, contribution guide, code of conduct, issue templates. Explicit note on "software enables, doesn't replace, culture work." LinkedIn post draft, Lenny's submission draft, HN launch draft. Go/no-go decision on public announcement.

**Iteration 13 — Public launch**
Go live. Monitor feedback, respond to issues, track adoption signals.

---

## Appendix C — What changed from v1 to v2

27 changes, grouped by source.

**From CPO (Gemini) feedback (12):**

1. Conversation-as-update mechanism (F4.4)
2. Single spine with profile-aware materialization (F1.4)
3. Diagnostic-first coach personality (F4.8)
4. Root routing map + coach in separate file (F4.0)
5. File-level frontmatter for AI consumption (F1.5)
6. Coach activation: inline + explicit + scheduled with nudge memory (F4.2, F4.5)
7. `.gitignore` template for private/ (F1.6)
8. Repo visibility in onboarding (F2.8)
9. Context surfacing rate as primary success metric (Goals 4, Success metrics)
10. New iteration for routing + frontmatter (Build order Iteration 2, 3)
11. Conversation-as-update expanded in iteration 6 (Build order)
12. File spine annotated with profile (Appendix A)

**From Delta Force article (9):**

13. `product/discovery.md` + `delivery.md` merged into `now-next-later.md` (Appendix A)
14. Four-alignment-questions audit in coach (User Journey, F4.3 behavior 9)
15. Customer contact staleness tracking (User Journey, F4.3 behavior 2)
16. Demanding structure for customers.md (F2.6)
17. Bedrock need challenge (F4.3 behavior 10)
18. New file `engineering/quality-bar.md` (Appendix A)
19. Coach never frames speed vs. quality as tradeoff (F4.8)
20. Hell-yes cut applied to file spine: 18 → 14 (Appendix A, N1)
21. Reality drift concept in coach (F4.6)

**From culture-first reframing (6):**

22. TL;DR rewritten (team artifact first, AI context second)
23. Problem section expanded to cover missing articulation, not just missing files (Problem)
24. New goal: 90-day clarity improvement measured via retrospective (Goals 4)
25. Coach role framed as mirror, not template filler (Core product principle)
26. Quarterly retrospective added (F4.7, User Journey Month 3+)
27. Explicit honest note that software enables culture work but cannot replace it (N6, Non-goals)

---

## Appendix D — What changed from v2 to v2.1

11 changes from four feature proposals (continuous-discovery, experiment-readout-discipline, strategy-coherence, agent-augmented-team), reviewed by Gemini CPO.

**Added to v1 scope:**

1. **B13 — Build-trap detector** (F4.3 behavior 13, Iteration 9): triggers when "Now" item lacks experiment reference or recent `Last Validated` date. Integrates with B3. No blocking, follows F4.4.
2. **B15 Phase 2 — Experiment readout** (F4.3 behavior 14, Iteration 9): gap analysis + segment check when experiment results surface in conversation. Drafts readout entry in `assumptions.md`. No blocking, follows F4.4.
3. **B16 — Strategy coherence inline** (F4.3 behavior 15, Iteration 9): checks roadmap items against `strategy.md` guiding policy. Solo fallback question when file absent. Quarterly coherence check folded into F4.7 retrospective.
4. **F4.9 — Context priority hierarchy**: standing conflict resolution rule in `coach.md`. Order: north-star → strategy → outcomes → now-next-later.
5. **`product/strategy.md`** (Appendix A, Iteration 2+9): full profile only. Diagnosis anchored to north-star; guiding policy interrogated by coach if it doesn't say no; coherent actions with BAD/GOOD examples. Full profile 14 → 15 files.
6. **`assumptions.md` new fields**: `Last Validated` date + `Evidence` link per entry; experiment readout section (scaffold-empty, coach-populated).
7. **Non-goals updated**: explicit v2 deferrals paragraph listing agent support, pre-launch scenario forcing, OST file.
8. **Open question 10 added**: strategy coherence platitude check exit condition.

**Explicitly deferred to v2 (not rejected):**

9. `agents.md`, B14 context bundle, CLI agent flag, reset anchor — agent-augmented team feature.
10. B15 Phase 1 — pre-launch scenario forcing (pessimistic/realistic/optimistic block).
11. `ost.md` — Opportunity Solution Tree with Mermaid rendering and coach-as-primary-author pattern.

**Inconsistencies flagged during integration:**

- Iteration 1 and Iteration 2 build order previously referenced "14 files" for full profile. Updated to 15 throughout.
- F4.3 previously said "twelve coaching behaviors." Updated to fifteen.
- User Journey explicit mode trigger phrase updated from "all twelve behaviors" to "all fifteen behaviors."
- F1.4 previously said "solo profile creates only 6 files and full profile creates 14." Updated to 15.
- Day 0 user journey previously said "full profile creates 14." Updated to 15.
- The quarterly retrospective section (Month 3+) now explicitly notes the strategy coherence check is folded in, not a separate phase — prevents a future implementer from adding a duplicate scheduled behavior.
