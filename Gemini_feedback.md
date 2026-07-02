he repository tomershahar/team-foundry provides an interesting solution to a common challenge in modern software development: AI-assisted context drift.
Since I cannot browse the live filesystem or dynamically pull down every line of code without specialized tools, I will evaluate the project's core thesis, design, and architecture based on its public specifications, structural design, and objective.
🎯 The Core Thesis: What Problem is it Solving?
The primary value proposition of Team Foundry is clear:
"A CLI that scaffolds shared context for AI coding tools. Outcomes, customers, decisions, quality bar — in your repo."
In the current landscape of agentic engineering (using tools like Claude Code, Cursor, Gemini CLI, etc.), AI agents are highly effective at solving localized, isolated engineering problems (e.g., "write a test for this component"). However, they lack macro-context. They don't naturally know:
•	Who the customer is or what user segment this feature serves.
•	Why a certain architectural tradeoff was made six months ago.
•	What the engineering team's exact definitions of done or quality bars are.
Without this, AI tools suffer from "token amnesia" or accidentally drift away from a team's established engineering paradigms. By scaffolding this context directly into the repository (likely using standardized Markdown files, JSON structures, or .ai configuration trails), Team Foundry turns the repository into a self-documenting environment that an AI agent can read upfront.
🏗️ High-Level Architectural Review
1. Developer Experience (DX) via a CLI
Choosing a TypeScript-based CLI is the correct approach here.
•	Frictionless Integration: Developers don't want to manage complex UIs to update AI context. A CLI fits seamlessly into existing terminal workflows, pre-commit hooks, or CI/CD pipelines.
•	Local-First / Git-Native: Keeping the shared context directly in the repository ensures that context updates are version-controlled. If a team changes an engineering decision, it’s tracked in a Git commit. When an AI agent checks out a specific branch, it gets the exact context matching that branch's evolutionary state.
2. Multi-Tool Compatibility
The project maps directly to tags like cursor, claude-code, and gemini-cli. This design acknowledges that teams don't stick to a single AI ecosystem. By providing a unified scaffolding layer, it acts as a "translation middleware" that structures data cleanly so any LLM-based agent can digest it through standard file-parsing tools.
⚡ Strengths of the Solution
•	Solves the "Garbage In, Garbage Out" Problem: The biggest bottleneck for AI coding isn't model capability; it’s context quality. By enforcing a scaffolding structure (Outcomes, Decisions, Quality Bar), it forces human developers to codify their implicit knowledge into explicit, machine-readable documentation.
•	Reduction in AI Token Overhead: Instead of a developer pasting 4,000 words of background into a prompt every time they run an agent, a structured, indexed folder configuration allows an AI tool to pick and choose only the context relevant to the current task.
•	Bridges Product Management & Engineering: Standardizing "Outcomes" and "Customers" alongside "Quality Bars" brings product-level context directly to the codebase where the AI is operating.
🛠️ Areas for Improvement & Hard Feedback
If this solution is going to scale from a handy personal/team script to an essential piece of infrastructure, there are a few operational realities it needs to address:
1. The "Stale Documentation" Trap
The fatal flaw of any documentation-as-code system is human behavior: developers forget to update it. If a developer bypasses the CLI and changes code without updating the context scaffolding, the AI agent will start making assumptions based on out-of-date parameters.
•	Recommendation: The CLI needs a verify or lint command that can be integrated into Github Actions. It should scan recent Git diffs and flag if major behavioral or architectural changes were made without a corresponding update to the Team Foundry context files.
2. Guarding Against Context Bloat
If a repository records every micro-decision, the context folder will quickly become hundreds of files deep. When an AI agent processes the entire directory, it might hit context window constraints or degrade in performance due to "lost in the middle" phenomena.
•	Recommendation: Implement an auto-archiving or indexing strategy. A single foundry-index.json or a summary map should guide the AI to the specific context file it actually needs based on the path it's modifying.
3. Missing the Integration with MCP (Model Context Protocol)
While text/markdown scaffolding in a repo is great, modern AI tools are heavily shifting toward the Model Context Protocol (MCP).
•	Recommendation: Team Foundry should expose its scaffolded context not just as passive files, but as an MCP Server. This would allow a tool like Claude Code or Cursor to actively call tools like get_architectural_decision(topic) rather than wandering through markdown files blindly.
📋 The Verdict
Score: 8.5/10
team-foundry is tackling the exact right problem at the exact right time. It moves AI development away from "magic prompts" and toward structured, reproducible AI governance-as-code.
If the tool focuses heavily on automating the maintenance of these context files (e.g., using AI to automatically draft the updates to the "Decision Trail" based on closed PR summary descriptions), it could become an indispensable utility in the modern agentic stack.