# F07 UAT — README comprehension test

**Status:** pending — protocol ready, respondents not yet run
**README commit under test:** `1925ceb` (update if the README changes before the run)
**Pass bar (per [spec](../action-plan/02-evidence-led-readme.md)):** at least 4 of 5 respondents pass all three questions without additional explanation.

## Protocol

**Recruit 5 people** unfamiliar with the repository, in the target audience (PMs or
engineers who have used an AI coding tool at least once). Aim for ~2 PMs, ~2 engineers,
1 wildcard. Exclude close collaborators who have already heard the pitch.

**Administer async (DM) or on a 5-minute call.** Send only the GitHub repo link. Intro,
verbatim:

> Doing a 3-minute test of a project README — not testing you, testing the doc. Read
> this for ~60 seconds, then answer 3 quick questions from what you understood. No wrong
> answers, and please don't research beyond the page:
> https://github.com/tomershahar/team-foundry

**Questions, exactly as worded:**

1. What problem does team-foundry solve?
2. What changed in the demonstrated agent answer?
3. What would you run first?

**Rules:** do not coach, clarify, or react between answers. "I'm not sure" is data —
record it verbatim. Run all five respondents against the same README commit; revise the
README only after the batch is complete.

## Scoring rubric

| Q | Pass looks like | Fail looks like |
|---|---|---|
| 1 | Anything in the territory of "AI coding tools don't know your team's product context / decisions, so they give generic or contradictory answers" | Mechanism instead of problem: "it generates markdown files", "a documentation tool", "something about AI agents?" |
| 2 | Any paraphrase showing they saw the before/after: "without context it gave a generic/wrong answer (0/5); with it, it cited the team's actual decisions (5/5)" | Didn't notice the comparison, or "it got better" with no substance |
| 3 | `npx create-team-foundry playground` (or "the playground"); also acceptable: `npx create-team-foundry` | "Read more docs", "clone the repo", no idea, or a command the README never mentions |

Q3 carries the funnel: it tests whether the README points readers at the 10-second value
moment. Score each answer against the rubric as written; do not reinterpret the rubric
after reading answers.

## Results

<!-- One block per respondent. Copy as needed. -->

### Respondent 1
- Profile: [PM / engineer / other; AI-tool experience]
- Read time before answering: [~seconds]
- Q1 (problem): "[verbatim]" — PASS/FAIL
- Q2 (what changed): "[verbatim]" — PASS/FAIL
- Q3 (run first): "[verbatim]" — PASS/FAIL
- Confusion noted verbatim: "[anything signalling friction]"

### Respondent 2
- Profile:
- Read time before answering:
- Q1 (problem): "" — PASS/FAIL
- Q2 (what changed): "" — PASS/FAIL
- Q3 (run first): "" — PASS/FAIL
- Confusion noted verbatim: ""

### Respondent 3
- Profile:
- Read time before answering:
- Q1 (problem): "" — PASS/FAIL
- Q2 (what changed): "" — PASS/FAIL
- Q3 (run first): "" — PASS/FAIL
- Confusion noted verbatim: ""

### Respondent 4
- Profile:
- Read time before answering:
- Q1 (problem): "" — PASS/FAIL
- Q2 (what changed): "" — PASS/FAIL
- Q3 (run first): "" — PASS/FAIL
- Confusion noted verbatim: ""

### Respondent 5
- Profile:
- Read time before answering:
- Q1 (problem): "" — PASS/FAIL
- Q2 (what changed): "" — PASS/FAIL
- Q3 (run first): "" — PASS/FAIL
- Confusion noted verbatim: ""

## Verdict

- Result: [N]/5 passed all three
- Verdict: PASS / FAIL
- Decision gate (per spec): [go / no-go on starting the F10 distribution experiment]
- If FAIL: list the confusion quotes driving the README revision, then re-run with fresh
  respondents against the revised commit.
