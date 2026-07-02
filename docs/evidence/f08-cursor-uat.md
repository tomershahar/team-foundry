# F08 UAT — Cursor loading contract

**Date:** 2026-07-02
**Fixture:** isolated playground (`node dist/index.js playground`, built from commit `e8c370f`), opened as its own Cursor workspace
**Adapter under test:** `.cursor/rules/team-foundry.mdc` (always-applied rule: `@AGENTS.md` import plus explicit read-`AGENTS.md` instruction)
**Cursor version:** 3.9.16

## Prompt

> What customer outcome is this repository optimizing for? Cite the source file.

## Response (verbatim)

> This repository is optimizing for **finance teams at mid-market companies closing month-end without chasing anyone** — specifically, increasing the share of invoices that flow from received → approved → posted **without manual intervention after the initial upload**.
>
> That is the **North Star Metric** in `team-foundry/product/north-star.md`:
>
> > **% of invoices processed without manual intervention** (per customer, rolling 30 days)
>
> Current baseline: **61%**
> Q2 2026 target: **72%**
>
> The vision behind it:
>
> > Finance teams at mid-market companies close their month-end without chasing anyone.
>
> Clearline exists because AP leads currently spend **30–40%** of month-end manually following up on approvals, reconciling PO mismatches, and hunting documentation — and the goal is to drive that work toward zero.
>
> For **this quarter (Q2 2026)**, the same repo frames three validated customer outcomes in `team-foundry/product/outcomes.md`:
>
> 1. **O1** — AP leads process month-end in **under 2 days** (from 4.1 days)
> 2. **O2** — New customers reach their **first auto-approved invoice within 5 days** (from 6.2 days)
> 3. **O3** — Finance managers **trust the exception queue enough to stop spot-checking** auto-approvals
>
> Those quarter outcomes support the north star; they are not separate goals. The repo is **not** optimizing for invoice volume processed or broad feature adoption (`north-star.md` explicitly calls those out).
>
> **Primary source:** `team-foundry/product/north-star.md`
> **Quarter-level outcomes:** `team-foundry/product/outcomes.md`

## Verdict

**Pass.** The response reproduces verbatim detail from multiple context files (baseline/target
figures, outcome IDs, non-goals) and cites both source paths correctly, so the generated
adapter demonstrably routed the agent to the shared context.

**Scope of the evidence:** this verifies the loading *route* end-to-end. It does not
discriminate whether Cursor expanded the in-body `@AGENTS.md` reference or the agent
followed the rule's explicit read instruction — the response did not record tool-call
visibility. The explicit read instruction remains the documented guaranteed path.
