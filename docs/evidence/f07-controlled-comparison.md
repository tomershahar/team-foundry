# F07 Controlled Comparison Evidence

## Purpose

Test whether repository-owned product and engineering context changes an AI coding
tool's recommendation. This protocol was fixed before either response was captured.

## Fixed Conditions

- **Fixture:** Clearline example at the same repository commit for both runs.
- **Tool/model:** Same Codex background-agent runner and inherited configuration for both
  runs, with no model override. The runner did not expose the exact model ID.
- **Capture date:** Record when responses are produced.
- **Prompt:** Identical text in both runs.
- **Difference between runs:** Team-foundry routing and context are unavailable in the
  control run and present in the context-enabled run.
- **No follow-up steering:** Evaluate the first complete response only.

## Prompt

> Our deploys are slow. Should we automate database migrations in CI? Give a recommendation and implementation constraints.

## Why This Prompt

Clearline has an explicit active decision in
[`ADR-005`](../../example/team-foundry/engineering/decisions/ADR-005.md): database
migrations remain a manual deployment step after two incidents and three prevented
near-misses. The context also records Marcus as the current operator, Priya as backup,
and a quality stance that rejects data-integrity risk.

The question is plausible, consequential, and cannot be answered specifically from
generic coding knowledge alone.

## Evaluation Rubric

Score each response against the same five binary checks:

| Check | Pass condition |
|---|---|
| Existing decision | Identifies ADR-005 or clearly states that Clearline has already decided against pipeline-automated migrations |
| Decision respect | Does not recommend implementing automation without explicitly reopening the active ADR |
| Evidence | Mentions the prior incidents, near-misses, or manual deployment-window rationale |
| Constraints | Mentions the Marcus/Priya operational ownership constraint or an equivalent repository-specific constraint |
| Product consequence | Connects migration safety to data integrity, customer trust, or Clearline's documented quality bar |

The comparison is useful only if the context-enabled response is more repository-specific.
It does not need to be longer, and the control response is not treated as "bad" merely
for lacking information it could not access.

## Reproduction

### Control fixture

Copy the Clearline example while excluding:

- `AGENTS.md`
- tool pointer files
- `.team-foundry/`
- `team-foundry/`

Keep the same human README and any ordinary source files.

### Context-enabled fixture

Copy the refreshed `example/` directory outside the source repository so its enclosing
git history cannot affect Doctor's effective freshness dates. The comparison capture used:

```bash
capture=$(mktemp -d /tmp/team-foundry-f07-capture.XXXXXX)
mkdir -p "$capture/control" "$capture/context"
cp -R example/. "$capture/context/"
cp example/README.md example/GETTING_STARTED.md example/.gitignore "$capture/control/"
```

To reproduce the captured Doctor output from the bundled playground, build the current
checkout and run both commands outside the source repository:

```bash
repo_root=$PWD
npm run build
doctor_fixture=$(mktemp -d /tmp/team-foundry-f07-doctor.XXXXXX)
(cd "$doctor_fixture" && node "$repo_root/dist/index.js" playground)
(cd "$doctor_fixture/team-foundry-playground" && node "$repo_root/dist/index.js" doctor)
```

### Capture procedure

1. Open a fresh agent session in the control fixture.
2. Record tool/model label, date, prompt, and complete first response.
3. Open a separate fresh session with identical settings in the context-enabled fixture.
4. Record the same metadata and complete first response.
5. Score both responses without changing the rubric.
6. Preserve raw responses below before trimming excerpts for README.

## Raw Evidence

### Control

- **Tool/model:** Codex background agent, inherited session model (no model override;
  exact model ID was not exposed by the runner)
- **Date:** 2026-07-02
- **Fixture:** commit `d4b585c`; team-foundry routing and context excluded
- **Response:**

```text
Recommendation: Automate migration validation in CI and execution in the deployment
pipeline, but do not let every CI job modify a shared database.

Implementation constraints:

- Run migrations once per environment using a deployment lock.
- Require backward-compatible, expand-and-contract schema changes.
- Gate destructive or long-running migrations for manual approval.
- Set lock and statement timeouts; avoid large table rewrites.
- Run data backfills asynchronously, outside the deploy path.
- Test against a production-like schema and verify rollback or roll-forward procedures.
- Use narrowly scoped database credentials and immutable migration artifacts.
- Capture duration, status, and errors; stop application rollout on failure.
- Deploy the compatible application version before removing old columns or constraints.
- Maintain backups and rehearse recovery.

This should remove coordination delays from routine deploys. If migrations themselves
are slow, automation alone will not help; they must be split into online schema changes
and background backfills.
```

- **Rubric score:** 0/5

### Context enabled

- **Tool/model:** Codex background agent, inherited session model (no model override;
  exact model ID was not exposed by the runner)
- **Date:** 2026-07-02
- **Fixture:** commit `d4b585c`; bundled playground SHA-256
  `ddac226668970cb86e2cd2fcaeed0353712cf99d772b23350c5858cf8a3a636f`
- **Doctor capture date:** 2026-07-02
- **Doctor command:** `node dist/index.js doctor` from a freshly generated playground
- **Doctor output:**

```text
team-foundry doctor

Context health: 80/100  Needs attention

  Completeness      30/30
    16/16 required context files contain real content
  Freshness         0/20
    0/16 populated files are current
  Connectedness     25/25
    3/3 integrity rule families clean
  Ownership         10/10
    16/16 existing files have an owner
  Tool routing      15/15
    4/4 present pointer files reference AGENTS.md

Highest-leverage fix:
  File is stale: context/glossary.md
  In: context/glossary.md
  Action: Update last_updated in team-foundry/context/glossary.md and review content for accuracy
```

The frozen Clearline example records Q2 context last updated in April 2026. Its freshness
finding is preserved rather than hidden by changing metadata solely for this comparison.
- **Response:**

```text
Recommendation: automate migration validation in CI, but do not automatically execute
production migrations yet.

The current manual step adds only about 10 minutes, has prevented three near-misses,
and follows two failed automated migrations. Removing it would trade a known bottleneck
for material data-loss and customer-trust risk (ADR-005). Instead, remove Marcus as the
single point of failure by completing Priya's training and providing a repeatable,
approval-gated runbook.

Implementation constraints:

- CI must apply every migration to a real PostgreSQL test database, never a mock (ADR-003).
- Validate upgrades from a production-like schema and representative data, not only an
  empty database.
- Keep Prisma migrations, the YYYYMMDD_description naming convention, and the prohibition
  on raw SQL (stack.md).
- Require backward-compatible expand/contract migrations so old and new application
  versions can coexist during deployment.
- Detect destructive changes, long locks, and migrations affecting tables above 1M rows;
  those require an explicit migration plan (quality-bar.md).
- Production execution remains a single-run, human-approved deployment job with audit
  logs, timeout/lock limits, monitoring, and a tested roll-forward or restore procedure.
- A failed migration must stop the application deployment automatically.
- Revisit full automation only after several months of measured, incident-free gated
  runs. Superseding the active ADR requires Marcus's technical decision and a new ADR.
```

- **Rubric score:** 5/5

## Scoring

| Check | Control | Context enabled |
|---|---:|---:|
| Existing decision | 0 | 1 |
| Decision respect | 0 | 1 |
| Evidence | 0 | 1 |
| Constraints | 0 | 1 |
| Product consequence | 0 | 1 |
| **Total** | **0/5** | **5/5** |

The control answer is reasonable generic engineering advice, but it recommends the
pipeline execution Clearline explicitly rejected. The context-enabled answer changes
the recommendation and grounds its constraints in the active ADRs, named owners, stack,
and quality bar.

## Publication Check

The README comparison was written only after both raw responses and Doctor output were
recorded. The context-enabled response materially outperformed the control on the fixed
repository-specificity rubric, so the comparison passed the publication gate.
