# Spec 05: Distribution Experiment

**Status:** Blocked until Specs 01 and 02 provide visible proof  
**Outcome:** More qualified visitors experience the product and provide actionable feedback.  
**Type:** Product-growth and documentation track; not primarily application code

## Problem

Package downloads without repository engagement can mean several different things:
automated installs, one-time trials, weak first value, unclear positioning, or poor traffic
quality. Distribution work must test these explanations rather than treating stars as the
product outcome.

The product should be promoted through the pain it solves: coding agents making decisions
without current customer, outcome, assumption, or architecture context.

## Four-Week Experiment

### Assets required before launch

- Real Doctor output from Spec 01.
- Reproducible before/after example from Spec 02.
- A direct playground command.
- Focused feedback issue asking whether the user would use it again and why.

### Channels

1. GitHub description and accurate topics.
2. Relevant AGENTS.md, context-engineering, and coding-agent community directories that
   accept tool submissions.
3. One pain-led article built around the drift taxonomy:
   - output-as-outcome drift
   - assumption fossilization
   - customer ghost syndrome
   - decision amnesia
4. Targeted outreach to 10–20 product/engineering practitioners for a short observed trial.

Each submission must follow the destination’s contribution rules. No unsolicited dependency
PRs to starter kits, mass posting, purchased stars, or generic launch spam.

## Measurement Ledger

Create a dated internal ledger for each activity:

| Field | Meaning |
|---|---|
| Date and channel | Where and when it was published |
| Pain/message | The exact framing used |
| Destination URL | Reproducible evidence that the activity occurred |
| Visits/downloads | Available aggregate signal; note source and limitations |
| Playground trials | Directly reported or observed, never inferred from downloads |
| Feedback conversations | Count plus recurring themes |
| Would use again | Yes / no / unclear with reason |
| Stars/issues | Secondary engagement signal |

No product telemetry is added. Use public platform analytics and consented interviews.
Never identify individual users in the repository ledger.

## Success Criteria

The primary signal is learning, not a vanity threshold:

- At least 10 observed or directly confirmed trials.
- At least 5 substantive feedback responses.
- A clear top reason for "would use again" and "would not use again."
- At least one channel produces qualified trials beyond the maintainer’s existing network.

Secondary signals: GitHub stars, issues, README visits, and npm downloads. Report them, but
do not call the experiment successful solely because one number increased.

## Scope

- Confirm GitHub description, homepage, and topics.
- Prepare truthful directory submissions using the same evidence package.
- Publish one standalone pain-led article with team-foundry introduced after the problem.
- Run short user sessions with one task and three questions.
- Synthesize themes and choose the next product iteration.

## Non-Goals

- No paid campaign, launch-day pile-on, broad influencer outreach, telemetry SDK, email
  collection, starter-kit dependency PRs, or MCP marketplace build.
- No repeated submissions to irrelevant directories.
- No changing the product during the four-week window unless a critical onboarding defect blocks trials.

## Development Track

### 1. Experiment Planner

- Record baseline date, package version, GitHub stars/issues, weekly downloads, and available traffic.
- Define the audience: product-minded engineers and technical product leaders using coding agents in shared repositories.
- Freeze the evidence assets and write one hypothesis per channel.
- Create the measurement ledger before publishing.

### 2. Acceptance-Test Author

Define checks for every public asset:

- Description states the user benefit, not only "CLI scaffolder."
- Topics are accurate and not keyword stuffing.
- Directory copy matches actual supported tools and commands.
- Article examples link to reproducible repository evidence.
- Every call to action points to playground, Doctor, or focused feedback.
- No claim depends on downloads being unique human users.
- All links resolve before publication.

### 3. Content / Distribution Developer

- Update repository metadata.
- Prepare directory submissions one at a time according to local rules.
- Draft and technically review the drift-taxonomy article.
- Recruit trial participants personally; ask them to narrate confusion rather than teaching the tool.
- Log activity and evidence without personal data.

### 4. Verification

- Check every public link, command, version, and compatibility claim.
- Run the playground and Doctor commands exactly as published.
- For repository documentation changes, run formatting/link checks; for code changes, follow the full project test gate and ask the user to run `npm test`.

### 5. Independent Review

Use three distinct reviews:

- **Product review:** Does the message target a real pain and the intended audience?
- **Technical review:** Are commands, outputs, and compatibility claims true?
- **Ethics/privacy review:** Are measurement and outreach consented, aggregate, and free of dark patterns?

### 6. Weekly Checkpoints

At the end of each week, record observations without changing the success criteria. Do not
rewrite the message after every weak day. At week four, synthesize:

- Which channel produced qualified trials?
- Where did users stop?
- What made people say they would or would not return?
- Is the next constraint awareness, first value, ongoing drift, or team adoption?

## Acceptance Criteria

- All required proof assets exist and are reproducible before promotion.
- Metadata and submissions are accurate.
- The four-week ledger contains evidence, limitations, and qualitative themes.
- At least 10 trials and 5 substantive responses are collected or the shortfall is explicitly reported.
- A release/positioning decision is made from the findings.

## Decision Rules

- **Visitors do not try it:** improve channel/message fit.
- **Visitors try but do not finish:** improve onboarding and time-to-value.
- **Users finish but would not return:** improve recurring value before adding distribution.
- **Users value it but context later decays:** proceed with Spec 04.
- **No channel produces qualified users:** narrow the audience and recruit manually before more product work.
