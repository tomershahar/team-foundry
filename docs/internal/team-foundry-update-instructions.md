# team-foundry — Update Instructions (Post-Launch Iteration)

**Source:** Learnings from Abhinav Mishra's "Stop Training Individuals. Start Building Context Infrastructure." (April 2026) — adjacent product thesis, cataloged patterns worth integrating without copying his product.

**Principle:** team-foundry remains what it is — a mirror for product teams, grounded in Cagan/Rumelt/Torres methodology. These updates sharpen positioning and add one small mechanism. They do not expand scope into code review, PR automation, or workflow orchestration.

Hold the line on existing PRD principles. If any task below feels like it's pulling team-foundry toward Mishra's 4-command developer workflow, stop and flag it.

---

## Tasks, in priority order

### Task 1 — Add "shared floor, individual ceiling" positioning to README

**What:** Add a new section to the README (after the problem description, before the usage/install section) that explicitly frames team-foundry as setting a shared floor for team context without capping individual ceiling.

**Why:** This framing addresses a real concern some PMs and engineers have about AI tooling — that it homogenizes thinking or constrains autonomy. team-foundry does neither. It sets a baseline every team member operates from; what individuals do above that baseline is unchanged.

**Exact text to add (adapt tone to match rest of README):**

> **Shared floor, individual ceiling**
>
> team-foundry sets a shared baseline of context that every team member's AI tool reads from. Outcomes, customers, decisions, quality bar, glossary — the things everyone should be grounded in.
>
> It does not cap what individuals do above that baseline. A senior PM can add their own prompts, their own discovery framework, their own depth. An engineer can bring their own AI practices. A designer can layer on top.
>
> The floor is shared. The ceiling is individual. That's the point.

**Placement:** Immediately after the problem scenario, before the install/usage instructions.

**Acceptance:** README has this section, phrasing matches surrounding tone (no emojis, no marketing hype), and it's scannable on a phone in under 10 seconds.

---

### Task 2 — Catalog the specific drift patterns the coach catches

**What:** Add a section to the README titled "What drift looks like" that lists 5–7 specific, named drift patterns the coach catches. Each gets a short name, a one-line description, and a one-line example.

**Why:** Specificity signals credibility. Abstract claims ("the coach catches drift") don't convince anyone. Named patterns with examples do. This is also ready-made material for future LinkedIn posts and the methodology doc.

**Patterns to include (phrasing is a draft — refine for voice):**

1. **Output-as-outcome drift** — an item listed as an outcome that's actually a shipped feature or output.
   Example: `outcomes.md` says "ship the new dashboard" instead of "reduce time-to-insight for SMB analysts."

2. **Assumption fossilization** — a core assumption logged long ago, never revisited, now silently driving decisions.
   Example: `assumptions.md` lists "users want faster checkout" dated 94 days ago. Three roadmap items cite it. No one's tested it.

3. **Customer ghost syndrome** — a persona defined in `customers.md` with no direct team contact in 60+ days, while roadmap items still claim to serve them.
   Example: Enterprise persona last interviewed in February. Three Q2 features built "for enterprise."

4. **Metric ambiguity** — a metric cited across files without a clear definition, leading to team members meaning different things when they say it.
   Example: "Active user" referenced in `outcomes.md` and `metrics.md` with no agreed definition. PM means weekly; engineer means daily.

5. **Decision amnesia** — a previous ADR rejecting an approach is invisible to a current discussion heading toward the same approach.
   Example: Q1 ADR rejects monolith-to-microservices migration. Q3 discussion reopens it with no reference to the prior decision or what changed.

6. **Output roadmap disguised as strategy** (full profile only) — `strategy.md` guiding policy is all "yes," doesn't name what the team is deliberately not pursuing.
   Example: "We will be the best tool for product teams." No "we will not build X for Y."

7. **Build-trap signal** — item moves into "Now" with no linked experiment and no validated assumption within 30 days.
   Example: "Add collaborative editing" moves to Now. No assumption linked. Last validation: none.

**Placement:** In the README, in a section after the "Shared floor, individual ceiling" section. Could be a table or a list. Keep it scannable.

**Acceptance:** Five to seven patterns present, each with a name + one-line description + one-line example. Readable in under 60 seconds. Matches tone of rest of README.

---

### Task 3 — Add "agent-agnostic" positioning to README and roadmap

**What:** Two small additions.

**3a.** Add one line to the README in the intro or positioning section:

> team-foundry is agent-agnostic by design. The context files are the product. The AI tool reading them is a replaceable component.

**3b.** Add a new line to the roadmap or v2 section (create one if it doesn't exist):

> **v2 shortlist includes Cursor support.** team-foundry v1 supports Claude Code and Gemini CLI. Cursor is the highest-priority v2 addition.

**Why:** Positions team-foundry correctly for a market where the AI tool layer is changing rapidly. Users should know their investment in writing team-foundry files isn't locked to one vendor. Cursor has a larger user base than Claude Code in some segments and is the obvious next tool to support.

**Acceptance:** Both lines present, phrased cleanly, not buried.

---

### Task 4 — Add `team-lessons.md` mechanism to the coach

**What:** Add a new optional file and a new coach behavior.

**4a.** New file: `.team-foundry/team-lessons.md`. Created lazily — not scaffolded at init, only created when the coach first uses it. Contains team-specific coaching rules the team has accumulated.

Structure:

```markdown
---
purpose: Team-specific coaching rules learned from this team's patterns
read_when: Coach runs any coaching behavior
last_updated: [date]
---

# Team lessons

Rules this specific team has accumulated for their coach.
Added when the team flags a recurring issue they want the coach to watch for.

## Active rules

- [date] [rule] — [context]

## Retired rules

- [date retired] [rule] — [why retired]
```

**4b.** New coach behavior: **B17 — Team-specific lesson capture.**

Trigger: when the user flags a recurring issue in conversation ("we keep doing X," "this is the third time we've had this problem," "we always confuse Y with Z"), the coach offers:

> "Sounds like a recurring pattern. Want me to add a coaching rule to `team-lessons.md` so I watch for this on future triggers?"

If the user confirms, coach drafts the rule, user edits or confirms, coach writes it to the file.

**4c.** Standing instruction in `coach.md`: load `team-lessons.md` when running any coaching behavior (alongside existing file reads). Apply team-specific rules with equal weight to built-in behaviors, scoped to the team that wrote them.

**Why:** Mishra's core insight is that the workflow learns — every production incident becomes a guardrail. team-foundry's version is lighter: every recurring team pattern becomes a coaching rule. Small mechanism, compounding benefit over months.

**Acceptance:**
- File created only when needed, not at scaffold.
- B17 triggers on signal phrases, follows conversation-as-update pattern (draft, confirm, write).
- `team-lessons.md` is read alongside other files during coaching runs.
- Rule retirement is supported (move from "Active" to "Retired" with date).
- Update PRD Appendix A file spine to note `team-lessons.md` as a lazy-created file.
- Update F4.3 behavior list to include B17.

---

### Task 5 — Plan (not implement) telemetry for concrete impact metrics

**What:** Do not implement telemetry now. But add a section to the PRD (under Success Metrics or a new Telemetry Plan section) that notes three metrics the product should eventually measure, how they'd be measured, and the privacy approach.

**Metrics to plan:**

1. **Context references per session** — count of team-foundry file references in AI tool responses, per session, per team (anonymized).
2. **Onboarding time saved** — time between `npx create-team-foundry` and a new team member's first successful AI session using the context.
3. **Drift items caught per active team per week** — count of coach flags, whether resolved, retired, or ignored.

**Privacy requirements:**
- Opt-in, disabled by default.
- Clear disclosure at install (`create-team-foundry` prompts ask if telemetry is ok).
- No file content ever transmitted — only counts, timings, and anonymized team IDs.
- User can inspect and clear collected data locally.

**Why:** Mishra's piece is credible partly because it cites concrete numbers (test coverage 80%+, zero AI-induced regressions since adoption, new dev ramp in days). team-foundry will eventually need its own credible numbers. Planning the capture mechanism now is cheap; retrofitting later is expensive.

**Acceptance:** PRD has a Telemetry Plan section with the three metrics, measurement approach, and privacy requirements. No code implemented yet. Flagged as v2 scope.

---

## What to explicitly NOT do

These are adjacent ideas from Mishra's piece that would damage team-foundry if copied. Do not add any of them.

1. **Do not add a 4-command workflow** (`start`, `build`, `push`, `review-pr` or equivalents). team-foundry is not a workflow engine.

2. **Do not add PR review automation** or behavioral diff analysis on PRs. Out of scope. Different product.

3. **Do not add enterprise/CTO positioning** ("$X/year for Y engineers"). Wrong audience for team-foundry. PMs and EMs adopt this, not CTOs approving budget.

4. **Do not copy the long-form thought-leadership post structure.** team-foundry's README is a product README, not a thesis.

5. **Do not expand team-foundry into code quality tooling.** If a task starts pulling toward "the coach reviews commits for code smells" or similar, stop.

---

## Order of execution

Do the tasks in this order. Each is independently shippable. No task depends on a later task.

1. Task 1 (README — shared floor, individual ceiling)
2. Task 2 (README — drift pattern catalog)
3. Task 3 (README + roadmap — agent-agnostic + Cursor)
4. Task 4 (Coach — team-lessons.md + B17)
5. Task 5 (PRD — telemetry plan, not implementation)

After each task: TDD if code, manual UAT by Tom if content. Do not batch tasks into one commit.

---

## Acceptance for the full update

- README is visibly sharper and more credible to a reader who's never heard of team-foundry.
- PRD reflects B17 and telemetry plan additions.
- Coach handles `team-lessons.md` correctly.
- No scope drift toward workflow engine, PR automation, or code review.
- Tom signs off on each task before moving to the next.

---

## Source attribution (for your reference, not for the README)

Abhinav Mishra, "Stop Training Individuals. Start Building Context Infrastructure." (Hashnode, April 2026). URL: https://iabhinavmishra.hashnode.dev/stop-training-individuals-start-building-context-infrastructure

Specific learnings lifted:
- "Shared floor, individual ceiling" framing → Task 1
- Specific failure mode cataloging → Task 2 (patterns are team-foundry-specific, not Mishra's)
- Agent-agnostic positioning → Task 3
- "The workflow learns" concept → Task 4 (implemented as lightweight team-lessons.md, not as Mishra's guardrail accumulation)
- Concrete impact metrics → Task 5 (planned only, not implemented)

Attribution in the README or methodology doc is optional. Mishra's piece is thought leadership, not a product we're forking. If we do credit him, a single line in the methodology doc is sufficient.
