# team-foundry v2 — Product Requirements Document

**Author:** Tom Shahar
**Status:** v2 (build-ready)
**Last updated:** April 26, 2026
**Predecessor:** v1 (shipped April 2026, 53 unique cloners in first week, validated by Helsinki Context is King 3 event)

---

## TL;DR

team-foundry v2 turns the v1 scaffolder into a living, multi-tool, populated-by-default Context Engine. The headline shift: v1 created a structure, v2 keeps that structure honest. The coach now drafts file updates from observed reality (commits, PRs, changelog), the product supports Cursor in addition to Claude Code and Gemini CLI, larger teams get a federated context architecture that scales, and a worked example repo gives every new visitor something visceral to clone instead of templates to imagine.

Distribution shifts in parallel: a populated example repo and the new "Context Engine for product teams" positioning let team-foundry meet the audience the v1 launch reached the edge of.

---

## What changed since v1, in one paragraph

v1 launched April 2026 with a CLI scaffolder, file spine, and inline coach. It got 134 clones from 53 unique cloners in the first week on the back of one LinkedIn post. The Helsinki Context is King 3 event surfaced three universal pains: staleness ("nudging humans to update docs doesn't scale"), context fragmentation across modules ("everyone solves duplication with scripts"), and the pull toward markdown-in-repos as the dominant substrate. Hannah Stulberg's parallel team-os-example-repo hit 26 stars in a similar window with a fully populated fictional team, demonstrating that examples convert better than templates. Mishra's "Stop Training Individuals" piece reinforced the floor-not-ceiling framing and named "the workflow learns" as the missing maintenance layer. v2 closes those three gaps.

---

## Goals (revised from v1)

**Primary**

1. **A new visitor can clone the worked example repo and use it inside Claude Code within 5 minutes**, without running the CLI. The example is the product's strongest sales tool.
2. **The coach drafts file updates from observed reality**, not just nudges humans to update. After 90 days of use, a team-foundry should not have stale outcomes, stale customers, or stale decisions if the team is shipping work.
3. **Cursor support reaches parity with Claude Code and Gemini CLI** for v1 features. The architectural promise of "agent-agnostic" stops being aspirational.
4. **Larger teams (10+ people, multiple workstreams) can use team-foundry without context bloat**, via the federated CLAUDE.md pattern in the full profile.
5. **External adoption reaches 200+ unique cloners and 5+ teams reporting they use it on a real product** within 60 days of v2 ship.

**Secondary**

6. Same v1 invariants hold: zero maintainer-side infrastructure, MIT license, runs on the user's own LLM tooling.
7. Coach personality stays diagnostic-first, transition-aware, never lectures, never frames speed vs. quality as a tradeoff.
8. The product still passes the hell-yes test on every file and every behavior. v2 cuts as aggressively as it adds.

---

## Non-goals (explicit)

These are deferred or rejected. v2 does not implement any of them.

- **No real-time streaming context pipelines.** Real-time freshness is the wrong tier for product team context. Weekly is fine, daily is generous.
- **No work orchestration features.** Kaiku, Linear, n8n, Slack are the work orchestration layer. team-foundry is the context layer.
- **No agent framework or multi-agent orchestration.** Different product.
- **No enterprise governance, RBAC, audit logs, or compliance features.** Wrong audience.
- **No `agents.md` / B14 (agent context bundle).** Deferred from v1, still no signal it's needed.
- **No `ost.md` (Opportunity Solution Tree).** Mermaid rendering is brittle, Torres vocabulary creates a barrier, the file would need real adoption evidence first.
- **No B15 Phase 1 (pre-launch scenario forcing).** Signal detection is unresolved.
- **No cross-repo team-foundry sync** (parent repo with shared context, child repos with overrides). Real architectural change, deserves v3 with v2 user evidence to inform it.
- **No paid tier, no SaaS, no hosted backend.**

---

## Core product principle (carried from v1, sharpened)

**team-foundry is a mirror, not a director.**

v1 stated this. v2 sharpens it: the mirror now actively drafts what reality says it should say, and asks the team to confirm. It does not direct. It does not decide. It does not block. It reflects what's actually true and offers to update the files to match.

The line between mirror and director is preserved by these rules:

- The coach drafts; the user confirms; the coach writes only after confirmation.
- The coach never blocks the team from shipping or moving forward.
- The coach surfaces gaps and contradictions, then offers the next step. It does not enforce.
- Disagreements between observed reality and team-foundry files are presented as questions, not corrections.

If any v2 feature drifts toward directing, blocking, or enforcing, it gets cut.

---

## Scope: what v2 ships

### Theme 1 — Make it real (worked example + distribution)

**1.1 Worked example repo**

A fully populated team-foundry for a fictional product team called Northbeam (placeholder name; final name decided during build).

- Separate repo: `team-foundry-example` (or similar) under the same GitHub user.
- Fictional 8-person product trio: PM, EM, 3 engineers, 2 designers, 1 analyst.
- Fictional product: a B2B SaaS for invoice processing (chosen for being relatable and uncontroversial; specifically not recommerce given Swappie context).
- Every file in the spine populated with realistic content. Not theater — real-feeling outcomes, real-feeling customer quotes, real-feeling ADRs, real-feeling quality bar discussions.
- README links to it prominently from team-foundry main README: "see what populated looks like."
- Example uses Claude Code variant by default; Gemini CLI and Cursor variants in branches.

**1.2 README repositioning**

Update main team-foundry README to lead with the new positioning:

> team-foundry is a Context Engine for product teams.
>
> It scaffolds the shared brain your AI coding tools read from — outcomes, customers, decisions, quality bar — in a repo every team member commits to.

Add Hannah's framing as a pull-quote near the top: *"Scaling isn't about making yourself faster. It's about making your team better."* Attribution to Hannah Stulberg with link.

Add a one-paragraph "What does populated look like?" section linking to the worked example repo.

**1.3 Event synthesis post**

Not a product feature, but a v2 deliverable: a public LinkedIn post synthesizing the Helsinki event. Drafted in `docs/launch/event-synthesis.md` for editing, posted as part of v2 launch.

### Theme 2 — Keep it honest (auto-staleness + drafting)

**2.1 Reality observation layer**

The coach reads, in addition to the team-foundry files themselves:

- Last N git commits (configurable, default 50)
- Recently-merged PR titles and descriptions (when accessible)
- Changelog entries if `CHANGELOG.md` exists
- Issue/ticket closures if Linear/Jira/GitHub Issues MCP is connected (best-effort, no hard dependency)

This becomes "observed reality" against which file content is checked.

**2.2 Drift detection (B18)**

New coach behavior. Triggers:

- Inline: when the user asks Claude something that would be answered differently by the file content vs. observed reality.
- Scheduled: weekly, the coach runs a full drift check and surfaces top issues.
- Explicit: user says "check team-foundry against reality" or similar.

Drift types detected:

- **Outcomes drift**: shipped features still listed as "in discovery"; outcomes the team is no longer working toward still listed as current.
- **Customer drift**: personas not contacted in N days while still being cited in roadmap items.
- **Decision drift**: ADRs whose conclusions are contradicted by recent commits.
- **Quality bar drift**: stated quality bar (e.g., "zero tolerance for bug backlogs") contradicted by observed bug count or PR patterns.
- **Strategy drift**: items in `now-next-later.md` that don't connect to the guiding policy in `strategy.md`.

**2.3 Draft-update mechanism**

For every drift detected, the coach:

1. Names the drift specifically, citing both the file and the observed reality.
2. Drafts the proposed update as a diff or a "before/after" snippet.
3. Asks the user to confirm, edit, or reject.
4. Writes the file only after explicit confirmation.

Example interaction:

> Coach: I noticed PR #847 merged last Tuesday shipped the new dashboard, but `product/now-next-later.md` still lists "ship dashboard v1" under Next. Want me to draft the update? Here's the proposed change:
>
> ```diff
> ## Next
> - - Ship dashboard v1
> - - User auth refresh
> + - User auth refresh
>
> ## Done (this quarter)
> + - Dashboard v1 (PR #847, shipped Apr 22)
> ```
>
> Confirm and I'll write it, or tell me to adjust.

The coach never writes silently. Always drafts, always confirms.

**2.4 Nudge-memory expansion**

v1 had a 7-day nudge-memory window per behavior. v2 extends this:

- Per drift item, not just per behavior.
- Configurable per file (some teams want weekly checks on outcomes, monthly on stack).
- "Snooze" option: user can tell the coach "remind me about this in two weeks" and the coach respects it.

### Theme 3 — Scale it (federated context for larger teams)

**3.1 Federated CLAUDE.md option**

For full profile teams above a configurable size threshold (default 8+ people), the CLI offers federated mode:

- Root CLAUDE.md / GEMINI.md stays small, contains routing only.
- Each major folder (`product/`, `team/`, `engineering/`, `design/`, `data/`, `context/`) gets its own CLAUDE.md.
- Folder-level CLAUDE.md describes what's in that folder, when to read its files, and any folder-specific coaching rules.
- The coach playbook in `.team-foundry/coach.md` is shared across all folders.

Optional, not forced. Teams can choose flat or federated at scaffold time, and switch later via `team-foundry federate` command.

**3.2 Feature index**

New CLI command: `team-foundry index`.

Generates a lookup file (`feature-index.yaml` or similar) mapping every feature/work item to its related artifacts: PRDs, ADRs, customer quotes, outcome it supports, current status.

The coach uses this index to answer "tell me everything about feature X" without grep-ing the whole repo. Index regenerates on-demand or via a `--watch` flag.

**3.3 Team member IDs in templates**

Update `team/trio.md` and any team-related templates to include optional ID fields:

```yaml
- name: Jordan Kim
  role: Engineering
  github: jordankim
  slack: U0C3D4E5F6A    # optional
  linear: c3d4e5f6-a7b8-9012-cdef-123456789012    # optional
```

Onboarding interview asks for these where they're known. Files that include IDs let the AI tools take cross-platform actions; teams that don't fill them in lose nothing.

### Theme 4 — Make it broader (Cursor support + telemetry foundation)

**4.1 Cursor support**

Add Cursor as a first-class supported tool. Specifically:

- CLI flag: `--tool=cursor` accepted alongside `claude` and `gemini`.
- Generates `.cursorrules` file (Cursor's equivalent of CLAUDE.md).
- All v1 features work in Cursor: routing, coach activation, drift detection, draft updates.
- Worked example repo includes Cursor variant.
- README explicitly lists supported tools and how to switch between them.

Cursor has the largest user base among AI coding tools according to public adoption signals, and excluding it kept v1 in a smaller pond than necessary.

**4.2 Team-lessons mechanism (B17)**

Carried from the Mishra-round update instructions. Implementing now in v2.

- New file: `.team-foundry/team-lessons.md`. Created lazily, only when first needed.
- New coach behavior B17: when the user signals a recurring team-specific pattern ("we keep doing X," "this is the third time we've had this issue"), the coach offers to add a team-specific coaching rule.
- Standing instruction: coach loads `team-lessons.md` on every coaching run and applies the rules with equal weight to built-in behaviors.
- Rule retirement supported: rules can move from "Active" to "Retired" with a date and reason.

**4.3 Telemetry foundation**

Lightweight, opt-in, foundation only. Does not analyze user content. Captures:

- Anonymized count of file references per AI session (which of the team-foundry files were read).
- Coach activation counts by mode (inline / explicit / scheduled).
- Coach activation counts by behavior (B1, B2, etc.).
- Drift items caught vs. resolved vs. ignored.

What it does not capture: any file content, any team identifying information, any user identifying information.

Disabled by default. Opt-in at install time with clear disclosure. User can inspect and clear local telemetry data anytime via `team-foundry telemetry status` and `team-foundry telemetry clear`.

Local-first storage in `.team-foundry/telemetry.jsonl`. Optional aggregate upload to a public dashboard (no team identification) is a future addition, not v2 scope.

---

## File spine changes from v1 to v2

**Added:**

- `.team-foundry/coach.md` — already in v1, stays.
- `.team-foundry/team-lessons.md` — lazy-created (B17 / 4.2).
- `.team-foundry/telemetry.jsonl` — opt-in only (4.3).
- `.team-foundry/feature-index.yaml` — generated by `team-foundry index` (3.2).

**Changed:**

- `team/trio.md` template gets optional ID fields (3.3).
- All folder-level CLAUDE.md files (federated mode, 3.1).
- `.cursorrules` added when `--tool=cursor` flag used (4.1).

**Unchanged from v1:**

- All product files (north-star.md, outcomes.md, customers.md, now-next-later.md, assumptions.md, risks.md, strategy.md).
- All team files except trio.md template (working-agreement.md, ai-practices.md).
- All engineering files (stack.md, quality-bar.md, decisions/).
- design/principles.md.
- data/metrics.md.
- context/glossary.md, context/stakeholders.md.

Total v2 file count: 15 (full profile, flat) or 21 (full profile, federated). Solo profile stays at 6.

---

## Coach behavior list (v2)

Carrying B1-B17 from v1 and the prior update. Adding B18.

| ID | Behavior | Mode | New in v2 |
|----|----------|------|-----------|
| B1 | Outputs framed as outcomes | Inline | |
| B2 | Customer contact staleness | Inline | |
| B3 | Stale assumptions (>30d) | Inline | |
| B4 | Decisions without rationale | Inline | |
| B5 | Reality drift (file vs. behavior) | Inline | Subsumed by B18, kept for back-compat |
| B6 | Quality bar drift | Inline | |
| B7 | Metrics without definitions | Inline | |
| B8 | Risks listed but never revisited | Inline | |
| B9 | Four alignment questions audit | Scheduled | |
| B10 | Bedrock need challenge | Inline | |
| B11 | Gap-filling nudges | Inline | |
| B12 | MCP suggestions | Inline | |
| B13 | Build trap detector | Inline | |
| B14 | (Reserved — agent context bundle, not implemented) | — | — |
| B15 | Experiment readout (segment + gap) | Inline | |
| B16 | Strategy coherence | Inline | |
| B17 | Team-specific lesson capture | Inline | **Yes** |
| B18 | Drift detection with draft updates | Inline + Scheduled + Explicit | **Yes (replaces B5)** |

---

## Build order (TDD/UAT iterations)

Each iteration is independently shippable and independently testable. UAT by Tom between iterations. No iteration ships until tests pass and Tom signs off.

**Iteration 1 — Worked example repo**
Build the populated team-foundry for the fictional product team. Separate repo. Link from main README. No code changes to team-foundry CLI itself. This iteration ships first because it has the highest distribution leverage.

Acceptance: someone unfamiliar with team-foundry can clone the example repo, open it in Claude Code, ask questions about the fictional team, and get grounded answers. Tom UAT: "this feels like a real product team, not a template."

**Iteration 2 — README repositioning + event synthesis post**
Update main team-foundry README. Lead with "Context Engine for product teams" framing. Add Hannah's pull-quote. Link the example repo prominently. Draft event synthesis post in `docs/launch/`.

Acceptance: README reads as a credible product page, not a technical manual. Event post drafted, ready to post when v2 ships.

**Iteration 3 — Cursor support**
CLI flag, `.cursorrules` template, all v1 features work in Cursor. Update example repo to include Cursor variant in a branch.

Acceptance: `npx create-team-foundry --tool=cursor` produces a working setup. Tested in Cursor itself.

**Iteration 4 — Team member IDs in templates**
Update `team/trio.md` template to include optional GitHub/Slack/Linear ID fields. Update onboarding interview to ask for them.

Acceptance: scaffold a fresh team-foundry, run onboarding, verify IDs flow into the template correctly.

**Iteration 5 — Reality observation layer**
Coach reads last N git commits, recently-merged PRs, changelog. Builds an internal "observed reality" representation per session.

Acceptance: coach can answer "what's changed in the last week?" by reading commits, not files. Tested on the worked example repo with synthetic commits.

**Iteration 6 — B18 drift detection (read-only)**
Coach detects all five drift types (outcomes, customer, decision, quality bar, strategy) and reports them. No drafting yet. No writing.

Acceptance: coach correctly flags drift on the worked example repo when synthetic drift is introduced. Zero false positives on a clean repo.

**Iteration 7 — Draft-update mechanism**
Coach drafts proposed file updates as diffs. User confirms, edits, or rejects. Coach writes only after confirmation. Apply to all B18 drift types and B1-B16 where it makes sense.

Acceptance: coach drafts cleanly. User confirmation flow works in Claude Code, Gemini CLI, and Cursor. No silent writes ever.

**Iteration 8 — Nudge-memory expansion**
Per-item memory, per-file configurability, snooze option.

Acceptance: coach respects memory windows correctly. Snooze persists across sessions.

**Iteration 9 — Federated CLAUDE.md option**
CLI offers federated mode for full profile. Each major folder gets its own CLAUDE.md. Routing in root file points to folder files. `team-foundry federate` command converts flat to federated.

Acceptance: federated mode works correctly in Claude Code, Gemini CLI, Cursor. Switching from flat to federated preserves all content.

**Iteration 10 — Feature index**
`team-foundry index` command. Generates `feature-index.yaml`. Coach uses index for "tell me about feature X" queries.

Acceptance: index correctly maps features to artifacts on the worked example repo. Coach answers feature queries faster and more completely with index than without.

**Iteration 11 — Team-lessons mechanism (B17)**
Lazy-create `team-lessons.md`. B17 behavior. Coach loads team-lessons on every coaching run.

Acceptance: B17 triggers on signal phrases. Team-specific rules apply correctly alongside built-in behaviors.

**Iteration 12 — Telemetry foundation**
Opt-in collection at install. Local-first storage. Inspect/clear commands. No content captured.

Acceptance: telemetry off by default. Opt-in flow is clear. Captured data is local, anonymized, inspectable.

**Iteration 13 — Final UAT + launch prep**
Full end-to-end UAT on a fresh install. Update CONTRIBUTING.md, CHANGELOG.md, release notes for v2.0.0. Tag and release.

Acceptance: clean install of v2 works flawlessly. v2 launch post and event synthesis post both ready. Tom signs off on the full product.

**Iteration 14 — Public launch**
Publish v2.0.0 release. Post event synthesis on LinkedIn. Submit Show HN. Direct outreach to specific people (Aaro Isosaari, Hannah Stulberg, 3-5 others).

Acceptance: v2 is publicly available, announcement is live, outreach is sent.

---

## Open questions

These are decisions to make during build, not before.

1. **Final name for the worked example fictional company.** "Northbeam" is a placeholder. Final name should be uncontroversial, not match any real company we'd be confused with.
2. **Default scheduled-review cadence** for B18 drift checks. Weekly is the v1 default. Should v2 keep weekly, go bi-weekly, or be adaptive based on commit activity?
3. **Federated mode default for the worked example repo.** Show flat or federated? Recommendation: flat in main, federated in a branch, so visitors see both.
4. **Cursor support details.** Does `.cursorrules` accept the same routing pattern as `CLAUDE.md`? Verify during Iteration 3 build.
5. **Telemetry aggregate upload.** Out of scope for v2. Note in PRD as v2.1 candidate.
6. **Hannah Stulberg attribution.** Should we ask her permission before quoting her pull-quote in our README? Recommendation: yes, send a friendly note, link her Substack.

---

## Success metrics

**Primary (user-facing):**

- **Visitors-to-cloners ratio** for the worked example repo: target 30% (visitors who clone the example after viewing it).
- **Cloners-to-active-users ratio**: target 20% within 30 days (cloners who run the CLI on their own repo and have at least one coach interaction).
- **Drift items caught and resolved per active team per week**: target 2+ after 30 days of use. Measured via opt-in telemetry.
- **Quarterly retrospective scores** (carried from v1): self-reported clarity improvements on outcomes, customers, quality bar.

**Secondary (maintainer-facing):**

- 200+ unique cloners on main team-foundry repo within 60 days of v2 ship.
- 100+ stars on worked example repo within 60 days.
- 5+ external teams reporting they use it on a real product.
- 1+ inbound conversation with someone in the Helsinki Context Engineering scene (Aaro, Kaiku team, Aiven, etc.) leading to mutual visibility.

---

## What v2 deliberately does NOT solve

These are real problems we know exist. v2 chooses not to solve them, with reasons.

- **Cross-repo context sharing.** Real architectural change. Defer to v3 with v2 user evidence.
- **Live integrations beyond MCP suggestions.** No native Notion/Confluence/Drive sync. Users bring their own MCP servers.
- **Team-foundry as a SaaS.** Wrong shape for this product. The local-first, repo-native model is the moat.
- **AI-native onboarding (auto-extract from existing docs at scale).** v1 has light artifact ingestion; v2 doesn't expand it. Real demand would shift this priority.
- **Multi-tenancy / org-level team-foundry.** One team, one repo, one team-foundry. Going multi-tenant breaks the local-first model.

---

## Risk register

**R1 — The worked example repo backfires by setting wrong expectations.**
A populated example shows the maximal version of team-foundry. Real teams will have less complete files, and the example might feel intimidating or unattainable. Mitigation: include a "this is a mature team-foundry — yours can start much smaller" note prominently in the example repo's README.

**R2 — B18 drift detection produces false positives.**
The coach reads commits and PRs and could misinterpret them, flagging drift that isn't drift. Mitigation: confidence levels (high/medium/low), and the coach surfaces low-confidence items as questions, not statements.

**R3 — Cursor's `.cursorrules` format diverges from what we expect.**
Cursor's tooling evolves quickly. The Iteration 3 implementation may break if Cursor changes the format. Mitigation: keep the Cursor-specific code isolated in one module, test against current Cursor on each release.

**R4 — Federated mode introduces context conflicts.**
With multiple CLAUDE.md files, the AI tool might receive contradictory instructions. Mitigation: routing in root file establishes precedence; folder-level files describe content, not behavior; coach.md is the single source of truth for behavior.

**R5 — Telemetry, even opt-in, hurts adoption.**
Some users will reflexively distrust any telemetry. Mitigation: clear disclosure, off-by-default, easy inspection, easy removal. Telemetry's value to the project is internal iteration, not external pitching.

**R6 — Distribution still doesn't reach the right audience.**
v1 reached 53 unique cloners; v2 needs 200+. This depends as much on distribution moves (event synthesis post, outreach to Aaro/Hannah/Helsinki scene) as on product features. Mitigation: treat distribution as a v2 deliverable equal in weight to product features, not as marketing afterthought.

---

## Implementation notes for Claude Code

- TDD throughout. Write tests first per iteration.
- UAT by Tom between iterations. No batch-and-merge.
- Each iteration commits separately. No mixing iterations in single commits.
- All v1 invariants hold: TypeScript, @clack/prompts, tsup, vitest.
- All v1 architectural decisions hold: agent-agnostic by design, files-are-the-product, coach-as-instructions-not-runtime, no silent writes, mirror-not-director.
- Cursor support means Cursor itself, not Cursor IDE plugins or extensions. Test against Cursor's current `.cursorrules` format.
- Worked example repo is a separate GitHub repository, not a folder inside the main repo.
- Event synthesis post is content, not code. Drafted in `docs/launch/event-synthesis.md`, posted manually by Tom on launch day.

---

## Appendix A — What was deferred from v1 update instructions and is now in v2

For traceability:

| Source | Item | v2 status |
|--------|------|-----------|
| Mishra round (post-v1) | Shared floor / individual ceiling | Already in README from v1 update; carried forward |
| Mishra round (post-v1) | Drift pattern catalog in README | Already in v1 README; expanded in worked example |
| Mishra round (post-v1) | Agent-agnostic positioning | Realized via Cursor support in 4.1 |
| Mishra round (post-v1) | Team-lessons.md + B17 | In v2 (4.2) |
| Mishra round (post-v1) | Telemetry plan | In v2 (4.3, foundation only) |
| Helsinki event | Auto-staleness with drafts | In v2 (Theme 2) |
| Helsinki event | Cross-repo sync | Deferred to v3 |
| Helsinki event | Federated context for larger teams | In v2 (3.1) |
| Helsinki event | Markdown as substrate | Already core; no change |
| Hannah Stulberg's example | Worked example repo | In v2 (1.1) |
| Hannah Stulberg's example | Federated CLAUDE.md | In v2 (3.1) |
| Hannah Stulberg's example | Feature index | In v2 (3.2) |
| Hannah Stulberg's example | Team member IDs | In v2 (3.3) |
| Hannah Stulberg's example | "Scaling isn't about making yourself faster" framing | In v2 (1.2 README) |

---

## Appendix B — What was considered and rejected for v2

For honesty and future reference:

- `agents.md` and B14 (agent context bundle) — no signal of demand, deferred again.
- `ost.md` (Opportunity Solution Tree with Mermaid) — too brittle, too much methodology overhead. Defer until real user request.
- B15 Phase 1 (pre-launch scenario forcing) — signal detection problem unresolved.
- Real-time streaming context (Aiven pattern) — wrong tier.
- Work orchestration features — out of scope.
- Enterprise governance — wrong audience.
- Cross-repo team-foundry sync — defer to v3.
- AI-native onboarding from existing docs — v1 has light version, no demand to expand.
- Multi-tenancy / org-level team-foundry — breaks local-first model.
- SaaS / hosted version — wrong shape.

These are not bad ideas. They are good ideas that haven't earned their way into v2. v3 planning will revisit each with the benefit of v2 user evidence.
