First, the central insight worth absorbing:
Anna's core argument: the problem isn't a lack of context, it's the form of it. Most teams already have files. The files are fact dumps. Fact dumps don't help LLMs make judgment calls.
That distinction — facts vs. context designed for judgment — is the sharpest framing I've seen for what team-foundry is actually trying to do. Your README currently positions team-foundry as solving "shared context across team members." Anna's framing reveals that's only half the value. The other half is "context structured for AI judgment, not just retrieval."
Look at her bad-vs-good example. Both contain the same facts. The "good" version sources every number, separates validated from hypothesized ICP, names anti-patterns, surfaces decisions with reasoning. The LLM reading the good version can make better calls because the structure encodes how to think about the facts, not just the facts themselves.
team-foundry's templates are closer to the bad column than the good column right now. That's worth sitting with.
Five specific things worth lifting into team-foundry:
1. Sourcing every fact with attribution and date.
Your current outcomes.md, customers.md, metrics.md templates ask the user to write down what's true. Anna's version asks for the source and date alongside the fact. "NRR: 108% (Q4 2025)" not just "NRR around 108%". "ICP A-Invest: IT consultancies, 62% win rate (cohort data 3yr)" not just "ICP is mid-market finance."
This is a small template change with significant impact. Adding source: and last_validated: fields to YAML frontmatter, plus a convention of inline (source, date) for individual claims, would meaningfully change what the AI does with the file. The coach could then catch unsourced claims as a drift pattern.
Concrete addition to v2.x: Drift pattern "Unsourced claim" — coach flags any quantitative claim in team-foundry files that lacks attribution.
2. Separating validated from hypothesized.
Anna's example: the bad version says "ICP: planning consultancies and cities". The good version splits VALIDATED (with cohort data) from anti-ICP (with reasoning) from hypothesized. Three categories, not one.
Your assumptions.md already gestures at this with the "validated/hypothesized/risk" distinction. But the customers.md, now-next-later.md, outcomes.md templates don't carry the same structure. They mix what's known with what's hoped for.
Concrete addition: Update the customers, outcomes, and roadmap templates to require explicit Status: validated | hypothesized | exploring fields. The coach catches anything tagged "validated" without a linked source.
3. Confidence marking on claims.
Anna's framework: fact (source?) / inference (what happened?) / hypothesis / needs investigation. Four confidence levels, made explicit.
This is more rigorous than what your current templates ask for. It would change how the AI uses the file — instead of treating everything as equally true, it can apply different weight based on confidence. "Customer X churned" (fact) gets treated differently from "Customer X churned because of pricing" (inference) which gets treated differently from "Pricing is hurting retention" (hypothesis).
Concrete addition: Add an optional inline convention [fact] [inference] [hypothesis] [investigate] that users can apply to claims. The coach can read these tags. Don't force it — make it a power-user feature documented in the README.
4. The strict trust hierarchy.
Slide 13 lays out four hierarchies the LLM should respect:

File hierarchy (constitution > context > memory > project logs)
Data sources (measured > assessment > notes > customer claims)
Expertise (domain expert > you > AI's general knowledge > web search)
Version authority (working docs latest wins; research newer ≠ supersede)

This is the deepest piece of the talk and the hardest to implement. Your current .team-foundry/coach.md doesn't establish these hierarchies. The AI treats your outcomes.md and your customer interview notes as roughly equivalent inputs.
Concrete addition: Add a team-foundry/.team-foundry/hierarchy.md file that the coach loads on every session. Establishes precedence rules: when claims conflict, validated cohort data outranks customer claims; recent commits outrank quarterly outcomes docs; ADRs outrank current discussion. This is an opinionated stance team-foundry should take.
5. The Hooks/Rules/Reference architecture.
Slide 12 is genuinely sharp. Anna's structure:

Hooks — enforced compliance (the AI literally cannot skip)
Rules — always loaded but easily skipped, so keep minimal
Reference — loaded on demand

The reasoning: LLMs have a working instruction limit (~150 for best models). Stuffing every rule into "always loaded" degrades quality.
Your current architecture is closer to "everything is always loaded if it gets read at all." The CLAUDE.md routes to other files but everything is in the rules layer conceptually.
Concrete addition: Reorganize your .team-foundry/ structure into three folders: hooks/ (enforced via Claude Code hooks if available), rules/ (always-loaded behavioral guidelines, kept minimal), reference/ (the bulk of team-foundry content, loaded on demand). This is a v3 architectural change, not a v2 tweak. But it's the most impactful structural shift in the whole talk.
What NOT to lift:
A few things in Anna's talk are right for her use case but wrong for yours.
Don't add the GTM-specific examples. Sales call intelligence (slide 14) and agentic content workflows (slide 15) are her domain. Don't templatize them into team-foundry — different audience, different problem.
Don't add complexity for solo users. Anna is a power user with 95% of her day in the terminal. Your solo profile users are not. Hooks, hierarchies, confidence marking — useful for full profile, overkill for solo. Keep the solo profile simple. Add depth only in full.
Don't pivot toward the GTM/business-context audience. Anna's product is essentially a GTM context OS. Yours is a product team context OS. Adjacent but different. Don't broaden into her territory; she'll do it better.
The most important meta-observation:
You went to this talk yesterday. You came back asking how to improve team-foundry. That's the right move. But notice the pattern: Anna built her own version of this for herself, refined it through real consulting work over months, and turned the talk into a credibility move at a Claude Code meetup. She didn't learn this from a podcast or a Reddit thread. She learned it by doing the work on her own GTM problems.
You're doing the same thing in a different domain. The Anna approach for you is: keep using team-foundry on YKI Master, SKB Cup, and team-foundry itself. The depth you're noticing in Anna's templates came from solving her own problems for years. Your depth will come the same way.
Three improvement points format:

Add source: and last_validated: to YAML frontmatter, plus a "unsourced claim" drift pattern. Single highest-impact, lowest-effort change. v2.1 candidate.
Split validated/hypothesized/exploring on customers, outcomes, and roadmap templates. Forces users to be honest about confidence. v2.1 candidate.
Plan a v3 architectural shift to Hooks/Rules/Reference. This is the deep change. Not a quick win. Worth a small spec, then real evaluation against the v2 architecture before committing.

The talk is good enough that I'd recommend something most people would skip: reach out to Anna directly. She's in Helsinki, working on the adjacent problem, and would probably engage with a thoughtful "I built team-foundry, your talk crystallized something for me, can I show it to you" message. That's a 15-minute conversation worth more than another iteration of features.Opus 4.7