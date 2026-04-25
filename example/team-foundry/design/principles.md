---
purpose: Design principles, tone of voice, and accessibility standards
read_when: When designing new features, writing UI copy, or reviewing designs
last_updated: 2026-04-25
---

# Design Principles

## Principles

**1. Confidence over completeness**
Finance professionals need to trust the information they see, not see all the information. When in doubt, show less and explain why. An exception view that shows three clearly-explained flags is better than one that shows twelve unexplained ones.

**2. The workflow knows where it is**
Every screen should answer: what am I looking at, what can I do here, and what happens next. We don't assume users navigate linearly. They jump between screens, come back to tasks mid-flow, and pick up where they left off. Design for interruption.

**3. Errors are invitations, not conclusions**
When the system flags something, it's not accusing — it's asking. Copy and visual treatment should reflect this. "This invoice looks different from your usual pattern — want to review it?" not "ERROR: Amount exceeds threshold."

**4. Nothing should require a tutorial**
If an AP lead has to read documentation to complete a core workflow, we've failed. We can offer tooltips and onboarding, but the workflow itself should be self-evident.

## Tone of voice

**Direct, not terse.** We say what we mean in as few words as it takes, but not fewer. "Review" is too short when "Review the flagged amount" is clearer.

**Grounded, not casual.** Finance is a domain where precision matters. We don't use exclamation marks in workflow states. We don't say "Looks great!" We say "Invoice approved."

**Specific, not generic.** "Something went wrong" is never acceptable error copy. "The invoice amount doesn't match any open PO — check vendor ABC's PO list" is.

**Calm under pressure.** When something fails or is flagged, the copy stays calm. Finance professionals are under real deadline pressure. The last thing they need is our UI escalating.

## Accessibility

WCAG 2.1 AA is our minimum for all customer-facing features. Specific requirements:
- All interactive elements are keyboard-navigable
- Color is never the only way to convey information (exception flags use both color and icon)
- All images and icons have descriptive alt text
- Minimum contrast ratio 4.5:1 for body text, 3:1 for large text

Emma owns accessibility review before any customer-facing feature ships. If there's a trade-off between visual polish and accessibility, accessibility wins.
