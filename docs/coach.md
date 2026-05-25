[← Back to README](../README.md)

# The coach

The coach watches your files for drift while you work. It never writes without your confirmation. Every finding cites the specific file, the specific content, and the evidence — not "this looks stale."

---

## What the coach catches

| Pattern | Example |
|---|---|
| **Assumption fossilization** | Core assumption logged 94 days ago, never retested, still driving three roadmap items |
| **Output-as-outcome drift** | `outcomes.md` says "ship the dashboard" instead of "reduce time-to-insight for SMB analysts" |
| **Customer ghost syndrome** | Enterprise persona last interviewed in February. Three Q2 features built "for enterprise." |
| **Reality drift** | 8 PRs shipped since `outcomes.md` was last updated. Coach cites the commit messages. |
| **Build-trap signal** | "Add collaborative editing" moves to Now with no linked assumption and no validation. |

---

## How to trigger the coach

| What to say | What happens |
|---|---|
| `"let's do a team-foundry review"` | Full audit — all files, findings by severity |
| `"review our outcomes"` | Targeted review of one file |
| `"tell me about feature X"` | Synthesizes status, rationale, customer evidence, open bets |
| `"run the weekly review"` | Top 3 issues, draft fixes offered |
| `"let's set up our team-foundry"` | Runs the onboarding interview (first time only) |

---

## Three modes

**Inline** — silent by default. Surfaces one sentence when a gap is directly relevant to what you're working on. No interruption unless it matters.

**Explicit** — runs on demand for a full audit. Use `"let's do a team-foundry review"` to trigger it. Lists all findings by severity with proposed fixes.

**Scheduled** — weekly check-in with the top 3 findings. Surfaces what's drifted since the last review and what's now at risk.

> **Tip:** The coach is most useful in Explicit mode at the start of a planning cycle — run it once before sprint planning and let it surface what's stale before you commit to work.

---

## The flywheel

The coach is the engine that keeps context fresh over time.

1. **Set up** — scaffold files, run the onboarding interview, fill in what you know
2. **Work** — AI reads context, gives better answers, flags gaps inline
3. **Learn** — when something was decided or validated, the coach offers to capture it (`/team-foundry-capture`)
4. **Update** — confirm the draft, it commits to git, everyone pulls
5. **Review** — next session, AI reads the updated files, answers get better

Each cycle tightens the loop. The coach makes step 3 to 4 nearly automatic.
