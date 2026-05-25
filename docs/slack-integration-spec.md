# Slack Integration Spec (MVP -> v1.1)

## Goal

Make `team-foundry` a weekly operating habit inside Slack, not a one-time setup tool.

Primary outcomes:
- Increase weekly `status` usage.
- Surface drift early in a place teams already coordinate.
- Turn findings into clear, owner-visible next actions.

## Non-goals (MVP)

- No automatic file writes from Slack.
- No LLM-based auto-remediation from Slack.
- No always-on noisy alerts.

## User Problems

- Teams forget to run `npx create-team-foundry status`.
- Drift appears only after planning or execution has already diverged.
- Accountability is weak when ownership is not visible in team workflow tools.

## Proposed Solution

Add Slack delivery and command surface around `team-foundry status`:

1. Scheduled weekly status post to a configured channel.
2. On-demand slash command for current health.
3. Top 3 fix suggestions with owner mentions when available.
4. Optional PR/merge nudge when drift increases.

## Personas

- PM/EM trio who owns product direction and execution quality.
- Engineers who need context integrity but do not want process overhead.
- Team lead who wants lightweight governance without heavy tooling.

## MVP Scope

### 1) Weekly summary message

Trigger:
- Weekly cron (default Monday 09:00 workspace timezone).

Message content:
- Health summary counts (`ok`, `stale`, `empty`, `missing`).
- Link integrity findings count (if available from enhanced status).
- Top 3 fixes (title + file + why + action).
- Call to action: "Run full review" command.

### 2) Slash command

Command:
- `/team-foundry status`

Behavior:
- Executes current repo health check.
- Returns short summary in-channel.
- Includes "View details" thread reply (or second expanded response).

Optional subcommands (MVP if low effort):
- `/team-foundry status --full`
- `/team-foundry review outcomes`

### 3) Owner mentions

If frontmatter includes `owner`, mention mapped Slack user in findings.

Mapping options:
- Static map file (`.team-foundry/slack-owners.json`).
- Convention fallback (owner name exact-match to Slack display name).

### 4) Notification controls

Configurable:
- Channel ID
- Cadence (weekly default)
- Max findings in message (default 3)
- Mention mode (`none`, `owners`, `all`)

## Architecture

### Option A (recommended MVP): Thin Slack adapter + CLI execution

- Keep scoring and logic in existing CLI.
- Add machine-readable output mode:
  - `npx create-team-foundry status --json`
- Slack adapter service/script:
  1. Runs CLI command.
  2. Parses JSON.
  3. Formats Block Kit message.
  4. Posts to Slack.

Benefits:
- Single source of truth remains CLI.
- Lower integration risk and maintenance cost.

### Option B: Native Slack bot with replicated logic

Not recommended for MVP due to duplicated business logic.

## Data Contract (for `status --json`)

Minimum JSON shape:

```json
{
  "generated_at": "2026-04-25T10:00:00.000Z",
  "profile": "solo|full",
  "summary": { "ok": 0, "stale": 0, "empty": 0, "missing": 0 },
  "link_findings": [
    {
      "type": "outcome_metric_missing|now_assumption_missing|assumption_outcome_unlinked",
      "severity": "low|medium|high",
      "files": ["team-foundry/product/outcomes.md"],
      "message": "Outcome references undefined metric: Activation Rate"
    }
  ],
  "top_fixes": [
    {
      "title": "Define Activation Rate in data/metrics.md",
      "priority_score": 14,
      "files": [
        "team-foundry/product/outcomes.md",
        "team-foundry/data/metrics.md"
      ],
      "why": "Referenced in outcomes but undefined in metrics.",
      "action": "Add formula, source, window, owner, and last_updated."
    }
  ],
  "owners": {
    "team-foundry/product/outcomes.md": "Sarah"
  }
}
```

## Slack Message Contract

### Weekly post layout

Header:
- "Team Foundry Weekly Health"

Body:
- Summary chips: `ok`, `stale`, `empty`, `missing`
- Link findings count
- Top 3 fixes

Footer:
- "Run `/team-foundry status --full` for full details."

### Thread details layout

- Group by finding type.
- Show exact file paths.
- Include evidence line snippets only if short and safe to display.

## Security and Privacy

- Do not post raw sensitive content from files.
- Post metadata and concise findings only.
- Support redaction mode for private repos:
  - hide excerpts
  - show file path + issue only

## Reliability Requirements

- If Slack API fails, command exits non-zero and logs failure reason.
- If status command fails, Slack adapter posts a minimal error status.
- Retry policy: exponential backoff (max 3 attempts).

## Success Metrics

Primary:
- Weekly active repos running status (WAU-repo).
- % weeks with at least one Slack status post delivered.
- % top-3 fixes resolved within 7 days.

Secondary:
- Median age of stale files.
- Reduction in unlinked outcome/metric/assumption findings over time.

## Rollout Plan

### Phase 1 (MVP)
- Add `status --json`.
- Build scheduled Slack poster script.
- Add `/team-foundry status` command.

### Phase 2
- Owner mention mapping and mention controls.
- Threaded detail responses.

### Phase 3
- PR drift nudge after merge thresholds (for example, N PRs since update).
- Optional "draft fix" links to local workflow docs.

## Acceptance Criteria

- Weekly job posts summary to configured channel with top 3 fixes.
- Slash command returns summary in <5 seconds for typical repo.
- No file writes happen from Slack interactions.
- If owner map exists, mentions resolve correctly for at least 90% of files with owners.

## Open Questions

- Should `/team-foundry review` be in MVP or phase 2?
- Should private repos default to redaction mode?
- Do we need GitHub App signals (merged PR count) in MVP or can we rely on local git history only?

