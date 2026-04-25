# SPEC: Enhanced Status Command — Link Integrity + Top 3 Fix Suggestions

## 1. Objective

Upgrade `npx create-team-foundry status` from a file-health checker into a weekly drift-detection ritual. Add link integrity checks between outcomes/metrics/assumptions and surface the top 3 highest-impact fixes.

**Target users:** PM or tech lead running a weekly team ritual. Wants to see what's broken and what to fix first — not just a health table.

**Success metric:** Running the command takes < 2 minutes of triage. The top 3 suggestions are always actionable.

---

## 2. Commands

No new commands. This extends the existing `npx create-team-foundry status` command.

**Output sections (in order):**
1. Health Table (existing — unchanged)
2. Link Integrity Findings (new — full profile only)
3. Top 3 Fix Suggestions (new — all profiles)
4. Existing stale/empty/missing detail sections (unchanged)

---

## 3. Project Structure

**Files to create:**
- `src/link-checker.ts` — link parsing and integrity check logic
- `src/__tests__/link-checker.test.ts` — unit tests for parsers and check rules

**Files to modify:**
- `src/status.ts` — import and call `runLinkChecks()`, compute top 3, print new sections

**No new CLI flags. No new files on disk. Read-only.**

---

## 4. Feature Specification

### 4.1 Profile detection

Link checks run **only on full profile** (detected by presence of `team-foundry/team/trio.md`).

On solo profile: link integrity section is silently skipped. Top 3 is computed from health findings only.

Note: `runStatus` currently has a bug — `isFullProfile` is always `false` (never assigned from the `fs.stat` check). Fix this as part of this work.

### 4.2 Link integrity checks (heading-based matching only)

**Rule 1: Outcome → Metric**
- Extract `## Heading` names from `team-foundry/data/metrics.md` → defined metric set
- Scan `team-foundry/product/outcomes.md` and `team-foundry/product/north-star.md` body text for `## Heading` names
- Flag any heading in outcomes/north-star not present in the defined metric set

**Rule 2: Now item → Assumption**
- Extract `## Heading` names from `team-foundry/product/assumptions.md` → defined assumption set
- Extract `## Heading` names from `team-foundry/product/now-next-later.md` where item is in a `### Now` section
- For each Now item heading, check whether any assumption heading appears in the body text of that Now item section
- Flag Now items with no assumption reference

**Rule 3: Assumption ↔ Outcome reciprocity**
- Extract `## Heading` names from `team-foundry/product/assumptions.md`
- Extract `## Heading` names from `team-foundry/product/outcomes.md`
- Flag assumptions whose body text references no outcome heading
- Flag outcomes whose body text references no assumption heading

**Missing file behavior:** If a file needed for a check doesn't exist, skip that check silently.

### 4.3 Finding model

```typescript
interface LinkFinding {
  type: 'outcome-metric' | 'now-assumption' | 'assumption-outcome';
  file: string;           // file where the issue lives
  item: string;           // heading name of the offending item
  detail: string;         // human-readable explanation
}
```

### 4.4 Top 3 Fix Suggestions

Combine all findings (health + link integrity) into a single ranked list.

**Scoring:**

```
severity:  missing-file=3, missing-link=3, stale=2, empty=2
reach:     number of distinct downstream files referencing this file
recency:   prsSinceUpdate > 3 → +2, > 0 → +1, else 0

priority_score = severity * 3 + reach * 2 + recency_factor
```

Return top 3 by score. On tie: deterministic order (alphabetical by file path).

**Output format per suggestion:**
```
1) Define "Activation Rate" in data/metrics.md
   Why: referenced in product/outcomes.md but undefined
   Action: add formula, source, window, owner, last_updated
```

**If no findings:** print `  No critical drift detected this week.`

---

## 5. CLI Output

```
  team-foundry status

  [existing health table]

  Link Integrity                              (full profile only)
  ──────────────────────────────────────────
  ! Outcome references undefined metric
      product/outcomes.md → "Activation Rate" not in data/metrics.md
  ! Now item missing linked assumption
      product/now-next-later.md → "Onboarding redesign" has no linked assumption

  Top 3 Fix Suggestions
  ──────────────────────────────────────────
  1) Define "Activation Rate" in data/metrics.md
     Why: referenced in product/outcomes.md but undefined
     Action: add formula, source, window, owner, last_updated

  2) ...

  [existing stale / empty / missing detail sections]
```

---

## 6. Code Style

Follow existing patterns in `src/status.ts`:
- Pure functions with explicit typed parameters
- `spawnSync` not `execSync` (no shell injection)
- `async/await` for file reads
- Export individual functions for unit testing
- No classes
- No external parsing libraries — plain regex on headings is sufficient

---

## 7. Testing Strategy

### Unit tests (`src/__tests__/link-checker.test.ts`)

- `extractHeadings(content, section?)` — extracts `## Heading` names, optionally scoped to a `### Section`
- `checkOutcomeMetricLinks(outcomes, northStar, metrics)` — returns `LinkFinding[]`
- `checkNowAssumptionLinks(nowNextLater, assumptions)` — returns `LinkFinding[]`
- `checkAssumptionOutcomeReciprocity(assumptions, outcomes)` — returns `LinkFinding[]`
- `rankFindings(healthFindings, linkFindings)` — returns top 3 sorted correctly

All tests use inline string fixtures (no temp files needed for parser tests).

### Integration tests (`src/__tests__/status.test.ts` additions)

- Full profile repo: flags undefined metric references, flags Now items missing assumption links, returns exactly 3 suggestions when ≥ 3 findings
- Solo profile repo: link section absent, top 3 drawn from health findings only
- No findings: output contains "No critical drift detected this week"
- Snapshot test: full output structure for a known fixture repo

### NFRs

- Runtime < 2s (excluding git latency)
- Deterministic output (same input → same order)
- No writes to disk

---

## 8. Acceptance Criteria

- [ ] Solo profile: no link errors, still shows health table + top 3 from health findings
- [ ] Full profile: Rule 1, 2, 3 findings appear correctly
- [ ] Top 3 includes both health and link findings, ranked by priority formula
- [ ] Tie-breaking is alphabetical by file path
- [ ] Missing files for link checks degrade gracefully (no crash, no output for that check)
- [ ] `isFullProfile` bug in `runStatus` fixed
- [ ] All unit tests pass, including snapshot of CLI output sections
- [ ] `npm run typecheck` passes
- [ ] `npm test` passes

---

## 9. Out of Scope

- Auto-fixing files
- LLM semantic matching (heading-only in v1)
- `--json` or `--strict` flags (v1.1)
- Slack/email notifications
- Historical trend storage
