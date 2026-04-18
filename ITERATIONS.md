# team-foundry — Iteration Status

**Legend:** ✅ done · ⏳ pending · ❌ not done · ➡️ next

---

## Iteration 1 — CLI scaffolding foundation
**Goal:** `npx create-team-foundry` runs, asks 4 questions, writes correct file tree, writes `.gitignore`.

| Gate | Status | Notes |
|---|---|---|
| Implementation | ✅ | All 7 tasks complete |
| Tests passing | ✅ | 94/94 |
| Code review | ✅ | 4 fixes applied (file counts, outro path, tool label, date assertion) |
| UAT (Tom sign-off) | ✅ | Signed off |

---

## Iteration 2 — Static templates and frontmatter
**Goal:** All generated files have quality content, YAML frontmatter is parseable, content reads as written by a thoughtful senior PM.

| Gate | Status | Notes |
|---|---|---|
| Implementation | ✅ | All 20 templates improved + frontmatter parseability tests added |
| Tests passing | ✅ | Confirmed by Tom |
| Code review | ❌ | Skipped (content-only changes, no logic) |
| UAT (Tom sign-off) | ✅ | Signed off |

---

## Iteration 3 — Root routing and coach stub
**Goal:** Root `CLAUDE.md`/`GEMINI.md` has identity + routing map + coach pointer. `.team-foundry/coach.md` has full base playbook (personality, activation modes, trigger phrases). No coach behaviors yet.

| Gate | Status | Notes |
|---|---|---|
| Implementation | ✅ | coach.ts fully written; root templates tightened; 14 new tests |
| Tests passing | ✅ | Confirmed by Tom |
| Code review | ✅ | Done alongside Iteration 4 review |
| UAT (Tom sign-off) | ✅ | Trigger phrase recognized; routing verified by tests; full activation deferred to post-Iteration 4 |

---

## Iteration 4 — Onboarding interview ➡️
**Goal:** Interview sequence in coach.md (18–25 questions / 10–12 for solo), grouped by theme, writes answers to files, tracks gaps, demands evidence for customers/outcomes/quality.

| Gate | Status | Notes |
|---|---|---|
| Implementation | ✅ | Full 9-theme interview in coach.ts; 9 themes for both profiles (solo themes skipped with notice); 23 questions full / 10 solo; evidence demands, gap tracking, file-write instructions, interview close |
| Tests passing | ✅ | 186/186 passing |
| Code review | ✅ | 5 fixes: solo theme count, "coach mode" trigger in root files, Q11 hardcoded, GETTING_STARTED.md delete conditioned, Q-contiguity + theme count tests added |
| UAT (Tom sign-off) | ✅ | Interview end-to-end verified in Claude Code |
| UAT (Tom sign-off) | ⏳ | Test ingestion path: run interview with existing docs (local folder / MCP / paste) — not yet covered |

---

## Iteration 5 — Coach behaviors core (1–4)
**Goal:** Outputs-vs-outcomes, customer contact staleness, stale assumptions, decisions without rationale. Inline + explicit modes.

| Gate | Status | Notes |
|---|---|---|
| Implementation | ✅ | B1–B4 in coach.ts; explicit mode audit order; conversation-as-update protocol |
| Tests passing | ✅ | 229/229 passing (incl. discoverability fix) |
| Code review | ✅ | 9 fixes applied: inline mode carve-out, scheduled contradiction, priority tiebreaker, B3 date precedence, severity labels, B2 draft choice, clarification loop prevention, behavior section order test, scheduled top-3 test |
| UAT (Tom sign-off) | ✅ | Signed off |

---

## Iteration 6 — Conversation-as-update mechanism
**Goal:** Coach drafts fixes, user confirms/edits/rejects, files written after confirmation. No silent writes.

| Gate | Status | Notes |
|---|---|---|
| Implementation | ✅ | Draft format contract, full-file rewrite rule, edit loop cap, rejection path, Draft looks like blocks on B1–B4 |
| Tests passing | ✅ | 9 new tests, all passing |
| Code review | ✅ | 3 fixes: B2 option 2 draft format, inline Step 2 carve-out, B4 blockquote style |
| UAT (Tom sign-off) | ✅ | Skipped — content-only changes, no runtime logic |

---

## Iteration 7 — Artifact ingestion (local folder)
**Goal:** User points at a folder of docs. AI reads natively. Confidence-based drafts surfaced for confirmation.

| Gate | Status | Notes |
|---|---|---|
| Implementation | ✅ | 4-step ingestion protocol: stale doc check, file mapping, confidence rubric, interview integration |
| Tests passing | ✅ | 9 new tests passing |
| Code review | ✅ | 2 fixes: solo profile file-mapping note, separator before interview section |
| UAT (Tom sign-off) | ✅ | Skipped — content-only, no runtime logic |

---

## Iteration 8 — Artifact ingestion (MCP)
**Goal:** Same confirmation flow via MCP-connected sources (Notion, Confluence, Google Drive). Fallback to local if MCP absent.

| Gate | Status | Notes |
|---|---|---|
| Implementation | ✅ | MCP branch (Notion/Confluence/Drive guidance, fallback, feedback summary), paste branch, shared ingestion reference |
| Tests passing | ✅ | All passing |
| Code review | ✅ | 3 fixes: inlined confidence rubric in MCP/paste, extracted shared file-mapping table |
| UAT (Tom sign-off) | ✅ | Skipped — content-only, no runtime logic |

---

## Iteration 9 — Coach behaviors full set (5–12)
**Goal:** Reality drift, quality bar drift, metrics, risks, alignment audit, bedrock need, gap-filling, MCP suggestions. Nudge memory. Scheduled review.

| Gate | Status | Notes |
|---|---|---|
| Implementation | ❌ | Not started |
| Tests passing | ❌ | |
| Code review | ❌ | |
| UAT (Tom sign-off) | ❌ | |

---

## Iteration 10 — Quarterly retrospective
**Goal:** 5-question self-assessment, offered every 90 days, feeds back into nudge tuning.

| Gate | Status | Notes |
|---|---|---|
| Implementation | ❌ | Not started |
| Tests passing | ❌ | |
| Code review | ❌ | |
| UAT (Tom sign-off) | ❌ | |

---

## Iteration 11 — Worked example repo
**Goal:** Fully populated team-foundry for a fictional product team. Internally consistent, passes Cagan-literate review.

| Gate | Status | Notes |
|---|---|---|
| Implementation | ❌ | Not started — identity of fictional team TBD |
| Tests passing | ❌ | |
| Code review | ❌ | |
| UAT (Tom sign-off) | ❌ | |

---

## Iteration 12 — Documentation and launch prep
**Goal:** README (60-second read), methodology doc, contribution guide, code of conduct, issue templates. Launch drafts.

| Gate | Status | Notes |
|---|---|---|
| Implementation | ❌ | Not started |
| Tests passing | ❌ | n/a |
| Code review | ❌ | |
| UAT (Tom sign-off) | ❌ | |

---

## Iteration 13 — Public launch
**Goal:** Go live. Monitor feedback, respond to issues, track adoption.

| Gate | Status | Notes |
|---|---|---|
| Implementation | ❌ | Not started |
| Tests passing | ❌ | n/a |
| Code review | ❌ | n/a |
| UAT (Tom sign-off) | ❌ | Go/no-go decision |

---

## Immediate next actions

1. Spec and implement Iteration 9 — coach behaviors full set (5–12)
2. UAT Iteration 4 pending item — test ingestion path with existing docs (local folder)
