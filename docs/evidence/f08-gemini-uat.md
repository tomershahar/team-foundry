# F08 UAT — Gemini CLI loading contract

**Date:** 2026-07-02
**Fixture:** isolated playground (built from commit `e8c370f`), prompt run non-interactively via `gemini -p` in the fixture directory
**Adapter under test:** `GEMINI.md` (`@./AGENTS.md` import plus follow-instruction callout)
**Gemini CLI version:** 0.28.2

## Prompt

> What customer outcome is this repository optimizing for? Cite the source file.

## Response (verbatim)

> The customer outcome this repository is optimizing for is enabling **finance teams at mid-market companies to close their month-end without chasing anyone**, specifically aiming to reduce the time AP leads spend on manual follow-ups, approvals, reconciling, and documentation to zero. The core metric for this is the "% of invoices processed without manual intervention."
>
> Source file: `team-foundry/product/north-star.md`

## Verdict

**Pass.** The response names the correct outcome, quotes the north-star metric, and cites
the correct source path. The `GEMINI.md → @./AGENTS.md` route delivered the shared context.
