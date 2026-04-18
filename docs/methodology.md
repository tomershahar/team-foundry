# team-foundry methodology

This doc explains the thinking behind team-foundry for people who want to understand why it's built the way it is. It's optional reading — you don't need it to use the tool.

---

## The problem

AI coding tools get better answers when they have context: what the product is, who it's for, what quality means, what's being built and why.

Most teams don't have this context written down in a form the AI can read. It lives in wikis, Notion docs, Slack threads, and people's heads. The AI gets none of it.

The obvious solution — paste it into the system prompt — doesn't scale. You hit token limits. The context goes stale. Different team members give the AI different context and get different answers.

team-foundry solves this by putting the context in your repo as structured files. The AI reads them natively. They stay current because the coach flags drift. No tokens spent on context that doesn't change; full context available when it does.

---

## What we borrowed from Marty Cagan

The file structure maps closely to the product thinking in *Inspired* and *Empowered*:

**North star / outcomes / customers** — These three files encode the "why" behind what the team is building. The outcomes file in particular is shaped by Cagan's emphasis on outcome-based roadmaps over output-based ones. The coach (Behavior 1) catches when outcomes.md contains feature launches instead of customer behavior changes.

**Continuous discovery** — The assumptions.md file is designed around Teresa Torres's continuous discovery framework. Every roadmap item should have a validated assumption behind it. The coach (Behavior 13) flags when items reach Now/Next without one.

**Strategy kernel** — The strategy.md file (full profile) is structured around Richard Rumelt's strategy kernel from *Good Strategy / Bad Strategy*: Diagnosis → Guiding Policy → Coherent Actions. The guiding policy is only useful if it says no to something. The coach (Behavior 16) checks for platitude policies and contradictions with the roadmap.

**The product trio** — The trio.md and working-agreement.md files exist because Cagan's model requires PM, eng lead, and design lead to be empowered collaborators, not a hierarchy. Writing down how the trio makes decisions and what the definition of done means removes the most common sources of sprint friction.

---

## What we borrowed from Delta Force

The coach's diagnostic-first, non-blocking approach is influenced by the Delta Force selection principle: identify what's actually happening before prescribing action. The coach names the gap before offering a fix. It never generates templates for the team to fill in — that would produce cargo-cult artifacts. It reflects the team's own thinking back at them, including the parts that have gone stale.

The "mirror, not template pack" phrase in the coach playbook is the key idea. A team that fills in the templates without the underlying thinking hasn't built a shared understanding. A team that fills in the files because the coach has named the specific gap they're actually experiencing has.

---

## Design decisions

**Why files instead of a database?**

Files in a repo have properties that matter here: they're versionable, diffable, searchable, and readable by any AI tool without integration work. A database requires an API, which requires trust and tokens. Files require neither.

**Why YAML frontmatter?**

The `purpose` and `read_when` fields tell the AI when to load each file. Without them, the AI has to guess — and usually loads everything, burning the context window on material that isn't relevant. Frontmatter makes context loading intentional and efficient.

**Why two profiles?**

Solo teams (1–3 people) don't need a trio agreement, a stakeholder map, or a formal strategy doc. Adding those files when they're empty creates noise, not signal. The solo profile gives a team the minimum viable context layer. The full profile adds the files that become load-bearing as teams grow.

**Why a coach in a file instead of a hosted service?**

A hosted service means API keys, tokens, rate limits, and a dependency on our infrastructure. The coach in a file is loaded into the AI tool the team is already using. It costs nothing to run, works offline, and has no latency. The trade-off is that the coach can't proactively push notifications — but that's a feature, not a bug. The team is in control of when it runs.

**Why "hell-yes standard"?**

Every file, every coaching behavior, every onboarding question has to be obviously essential or it gets cut. The cost of an unnecessary file is real: token budget, maintenance burden, and most importantly, the team stopping trusting that the files say things worth reading.

---

## What this doesn't do

team-foundry makes it easier to build shared product understanding. It doesn't build it for you.

If your team isn't having the hard conversations — about outcomes vs. outputs, about who your real customers are, about what quality actually means in practice — team-foundry will give you well-structured empty files and a coach that politely notes the gaps. The conversations still have to happen. The tool just makes the gaps visible and gives you a place to record the answers when you do.
