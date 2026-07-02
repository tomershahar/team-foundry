# Three-AI Review Action Plan

## Purpose

This package turns the five recommendations synthesized from independent Claude,
GPT-style, and Gemini reviews into separate implementation tracks. The source review
is preserved in the attached research note; these specs reconcile it with the v3.5
codebase rather than assuming every recommendation is still unbuilt.

## Current-State Reconciliation

| Item | Current state in v3.5 | Remaining work | Spec status |
|---|---|---|---|
| 1. Context Health Score | `status`, link integrity, ranking, `status --ci`, and `init-ci` already exist | Add a legible score, category breakdown, stable machine output, and a shareable Doctor experience | Planned |
| 2. README before/after proof | Playground, generated excerpts, and a high-level before/after are present | Capture a real controlled transcript and real Doctor output; replace abstract claims with evidence | Planned |
| 3. AGENTS.md bridge | `AGENTS.md` is already primary; Claude, Gemini, Cursor, and Copilot pointers exist | Characterize and harden the compatibility matrix; correct any unsupported documentation claims | Verification track |
| 4. Lightweight drift automation | Manual status, CI mode, and PR workflow already exist | Add low-noise scheduled/change-aware automation, gated by evidence from Item 1 | Conditional |
| 5. Distribution mechanics | GitHub description and in-product feedback ask were improved | Topics, durable directory submissions, pain-led content, and measurement ledger remain | Blocked by Items 1–2 |

## Sequencing

```text
01 Doctor score
    -> 02 Evidence-led README
        -> 05 Distribution experiment

03 AGENTS compatibility hardening may run independently.

04 Drift automation starts only if Doctor usage or feedback shows that ongoing
context decay is a meaningful problem after first value is understood.
```

This sequencing is a product decision, not just a dependency graph. Item 1 tests
whether visible transformation improves engagement. Item 4 must not become runtime
infrastructure built before that hypothesis has evidence.

## Delivery Protocol

Each item is its own development track and may be assigned to a separate developer or
agent session. No track inherits an unreviewed implementation from another track.

1. **Plan:** Re-read the item spec and relevant code. Produce the exact files and risks.
2. **Test author:** Add failing behavioral tests or, for non-code work, explicit acceptance checks.
3. **Developer:** Implement only the approved scope. Do not weaken the tests.
4. **Test verifier:** Run focused checks, typecheck, lint, and build. The user runs `npm test`.
5. **Code reviewer:** Review the diff against the spec from a fresh context. Findings lead.
6. **UAT owner:** Exercise the user workflow and record evidence.
7. **Release owner:** Update tracking only after tests and UAT pass.

The test author, developer, and code reviewer should be separate contexts when practical.
The human maintainer owns product acceptance and the final release decision.

## Specs

1. [Context Health Score / Doctor](01-context-health-score.md)
2. [Evidence-Led README](02-evidence-led-readme.md)
3. [AGENTS.md Compatibility Hardening](03-agents-compatibility.md)
4. [Lightweight Drift Automation](04-drift-automation.md)
5. [Distribution Experiment](05-distribution.md)

## Portfolio Exit Criteria

- Every item has an explicit outcome, non-goals, acceptance criteria, and decision gate.
- Delivered behavior is not listed as greenfield work.
- No item adds a backend, telemetry, paid API, or mandatory hosted service.
- Distribution work points to observable product proof, not only feature claims.
- `feature_list.json` reflects the status and evidence for each initiative.
