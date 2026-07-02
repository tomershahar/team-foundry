# F08 UAT — Claude Code loading contract

**Date:** 2026-07-02
**Fixture:** isolated playground (built from commit `e8c370f`), prompt run non-interactively via `claude -p` in the fixture directory
**Adapter under test:** `CLAUDE.md` (`@AGENTS.md` import)
**Claude Code version:** 2.1.198

## Prompt

> What customer outcome is this repository optimizing for? Cite the source file.

## Response (verbatim)

> The repository is optimizing for **touchless invoice processing**: the north star metric is **% of invoices processed without manual intervention** (per customer, rolling 30 days) — currently at 61%, targeting 72% by end of Q2 2026. An invoice counts as "processed without manual intervention" when it moves from received → approved → posted without a human touching it after the initial upload.
>
> The underlying customer outcome, per the vision statement, is that finance teams at mid-market companies close their month-end without chasing anyone — eliminating the 30–40% of the month-end cycle AP leads currently spend chasing approvals, reconciling mismatched POs, and hunting down documentation.
>
> Source: `team-foundry/product/north-star.md` (lines 12–22). It also notes what they deliberately *aren't* optimizing for — invoice volume and feature adoption breadth — with balancing metrics (NPS, approval exception rate, time-to-first-auto-approval, support ticket volume) to keep automation from eroding trust.

## Verdict

**Pass.** The response reproduces baseline/target figures and a line-range citation from
the correct source file. The `CLAUDE.md → @AGENTS.md` import route delivered the shared context.
