# Spec 02: Evidence-Led README

**Status:** Implemented and tests passing; five-person comprehension UAT pending
**Outcome:** A skeptical visitor can understand the behavioral difference within 60 seconds.  
**Depends on:** Spec 01 UAT output

## Problem

The README now explains the missing-context problem and shows generated files, but it
still asks readers to infer that better files produce better agent decisions. The next
pass must show observed behavior, with enough provenance that it does not read as a
marketing example invented after the fact.

## Evidence Package

Create one controlled comparison using the same repository snapshot, model/tool, prompt,
and date:

1. **Without context:** temporarily exclude generated team-foundry routing from the fixture.
2. **With context:** restore the committed team-foundry files.
3. Ask one decision-shaped prompt that requires customer, outcome, or ADR knowledge.
4. Preserve short transcript excerpts and references to the source context used.
5. Run Doctor on the populated fixture and capture its real output.

Recommended prompt:

> We are adding export support. Which format and implementation constraints should we use, and why?

The Clearline fixture may be extended with a specific export ADR only if that ADR is
useful beyond the demonstration and reads like authentic team context.

## README Target Structure

The first viewport remains concise:

1. Pain statement.
2. Install or playground command.
3. Real before/after decision excerpt.
4. Real Doctor output or image.
5. How it works and generated-file details below.

The comparison must label the tool/model and capture date. Use "in this controlled
example," not universal claims such as "every agent always follows the decision."

## Files

- `README.md`: restructure and evidence copy.
- `assets/`: one optimized Doctor image only if terminal text is not readable inline.
- `example/`: only if a missing decision is genuinely needed for the scenario.
- `src/templates/playground/content.ts`: regenerate through `npm run gen:playground` if example content changes; never hand-edit the generated module.
- `docs/evidence/`: raw, trimmed transcript evidence and reproduction notes.

## Non-Goals

- No invented transcript, cherry-picked sentence presented without surrounding conclusion,
  anonymous testimonial, benchmark claim, autoplay demo, or major visual redesign.
- No new CLI feature beyond the already-approved Doctor dependency.
- No claim that all tools consume instructions identically.

## Development Track

### 1. Evidence Planner

- Choose the fixture, prompt, tool/model, and success rubric before running either case.
- Define what counts as an improved answer: cites the committed decision, respects its
  rejected alternatives, and connects the recommendation to an outcome or customer.
- Write reproduction steps before viewing results to reduce cherry-picking.

### 2. Acceptance-Test Author

Because this is primarily documentation, define checks before editing:

- README has a visible before/after excerpt above "What gets generated."
- Both excerpts identify the same prompt and controlled conditions.
- Every product claim in the comparison links to transcript evidence or fixture content.
- Doctor output matches a real command run.
- Existing install, playground, supported-tools, commands, and feedback information remains findable.
- All local Markdown links resolve.
- README does not say every tool reads `AGENTS.md` natively.

If example content changes, add template/playground tests before regeneration.

### 3. Evidence Producer

- Run the two cases without changing the rubric.
- Preserve the full raw outputs internally; trim only for readability in README.
- Record tool/model version, date, fixture commit, prompt, and any manual setup.
- If the result does not demonstrate a meaningful difference, report that result and
  revise the product hypothesis rather than polishing it into a success story.

### 4. Documentation Developer

- Rewrite around the observed difference, not the generated file count.
- Prefer terminal text over an image when it remains readable.
- Keep asset size modest and add accurate alt text when an image is used.
- Preserve the playground as the fastest self-serve reproduction path.

### 5. Test Verifier

- Run link and asset checks defined during planning.
- If templates changed: run typecheck, lint, build, and ask the user to run `npm test`.
- If only Markdown/assets changed: verify links, image dimensions, and rendered layout.

### 6. Independent Editorial and Technical Review

Use two review passes:

- **Editorial:** Can a new visitor state the problem, observed change, and next action after 60 seconds?
- **Technical:** Are the transcript, tool compatibility, and Doctor claims reproducible and appropriately qualified?

Reviewers must see the raw evidence, not only the polished README.

### 7. UAT

Ask five people unfamiliar with the repository:

1. What problem does team-foundry solve?
2. What changed in the demonstrated agent answer?
3. What would you run first?

Pass when at least four answer all three without additional explanation. Record confusion
verbatim; do not coach respondents toward the intended answer.

## Acceptance Criteria

- The README shows a real, reproducible before/after agent decision.
- Doctor output is real and traceable to a fixture.
- Claims are precise and tool compatibility remains honest.
- Existing reference information remains accessible.
- Editorial review, technical review, and comprehension UAT pass.

## Decision Gate

Publish this evidence before starting the distribution experiment. If the controlled
comparison does not show a meaningful improvement, pause promotion and fix the product
or scenario rather than increasing traffic to an unclear promise.
