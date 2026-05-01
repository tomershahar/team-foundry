---
purpose: Trust precedence rules the coach applies when context conflicts across files
read_when: Before reconciling conflicting signals; when claims in different files disagree
last_updated: 2026-04-29
owner: team
---

# Context Hierarchy

When signals conflict across team-foundry files, apply these precedence rules in order.
Do not average conflicting data — name the conflict and state which source wins and why.

## File Precedence

1. **Constitution** — CLAUDE.md / GEMINI.md (always-loaded rules and routing)
2. **Context files** — team-foundry/ files (the substance of what the team knows)
3. **Memory / notes** — session notes, conversation history
4. **Project logs** — git log, CI output, issue trackers

*When a context file contradicts a memory note, the context file wins.*

## Data Source Precedence

1. **Measured live data** — dashboards, analytics, cohort exports with a date
2. **Own assessment** — team's direct analysis with reasoning
3. **Own notes** — meeting notes, interview summaries
4. **Automatic notes** — AI-generated summaries, auto-transcripts
5. **Customer claims** — what customers say (without corroborating data)

*When cohort data disagrees with a customer claim, cohort data wins.*
*Always note which source tier a claim comes from.*

## Expertise Precedence

1. **Domain expert** — someone with direct, validated experience in this area
2. **Team** — collective judgment based on what the team has observed
3. **AI general knowledge** — the model's training knowledge (no team-specific context)
4. **Web search** — external sources with no team context

*When your domain expert's view conflicts with AI general knowledge, the expert wins.*

## Version Authority

- **Working docs** (team-foundry/ files, CLAUDE.md): latest commit wins
- **Research** (customer interviews, experiments, market data): newer does not supersede older —
  it adds a data point. A 2026 interview does not erase a 2025 cohort result; it adds signal.
  Surface both and name the gap.

## How to Apply

When you see conflicting signals:
1. Name the conflict explicitly — do not silently pick one
2. State which source wins per the hierarchy above
3. Note what evidence would resolve the conflict
