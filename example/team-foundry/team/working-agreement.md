---
purpose: Team norms, definition of done, ceremonies, and how we work
read_when: When onboarding someone new, resolving a process question, or reviewing team health
last_updated: 2026-04-25
---

# Working Agreement

## Definition of Done

A feature is done when:
- [ ] Acceptance criteria in the spec are met and verified by the author
- [ ] A second engineer has reviewed the PR and approved
- [ ] Tests cover the happy path and the primary error case
- [ ] Leo or Emma has reviewed the UI against the design (for customer-facing changes)
- [ ] Sarah has confirmed the behavior matches the intended outcome (not just the spec)
- [ ] No known P1 bugs are introduced (checked via regression test run)
- [ ] `last_updated` in any affected team-foundry files is updated

## Definition of Ready (for a sprint)

A story is ready to be pulled into a sprint when:
- The problem is stated (not just the solution)
- Acceptance criteria exist and are testable
- Designs are finalized for customer-facing changes
- Dependencies are identified and either resolved or accepted as risks
- The engineer who will pick it up has read the spec and has no blocking questions

## Ceremonies

**Sprint planning (every 2 weeks, Tuesday):** Marcus facilitates. We review what's carrying over, confirm capacity, pull in ready stories. Goal: everyone leaves knowing what they're working on and why.

**Weekly trio sync (Monday 10:00):** Sarah, Marcus, Leo. Not a status meeting. We review outcome metrics, surface decisions that need alignment, and unblock each other. If there's nothing to align on, we end early.

**Sprint retrospective (every 2 weeks, alternating Friday):** Whole team. 45 minutes. We use a Start/Stop/Continue format. Action items go into Linear, owned by someone, due by next retro.

**Demo (every 2 weeks, same Friday as retro):** Priya, Jake, or Aino demo what shipped. Sarah and Leo present the customer context for why it matters. Async Loom if anyone can't attend.

## Norms

**Async first.** Default to Linear comments and Slack threads for updates. Synchronous time is for decisions and discussion, not status.

**No meeting before 10:00 or after 16:00.** Priya and Aino are in different time zones (London and Helsinki). This window works for everyone.

**Specs before sprint.** Sarah writes the spec before the sprint, not during. If a spec isn't ready, the story isn't ready.

**One thing at a time.** We do not start new features while the current sprint has incomplete P0 items. We complete before we expand.

**No silent concerns.** If you have a concern about a decision, you say it in the meeting, not in DMs afterward. If you didn't say it then, it doesn't count as a blocker later.

## On-call

Engineering on-call rotates weekly: Priya → Jake → Aino → repeat. On-call owns P1 incident response and customer escalations. Rotation posted in #engineering every Monday.
