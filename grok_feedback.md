**Honest feedback on team-foundry (https://github.com/tomershahar/team-foundry):**

### What it is (in a nutshell)
It's a **smart, opinionated CLI** (`npx create-team-foundry`) that bootstraps a **shared context system** inside your Git repo for AI coding tools (Claude Code, Gemini CLI, Cursor, etc.). It creates:

- A central `AGENTS.md` (or equivalent) with team-level knowledge: outcomes, customers, decisions/ADRs, quality bars, roadmap, assumptions, etc.
- Thin **pointer files** for specific tools (e.g., `CLAUDE.md`, `.cursor/rules/...`).
- A `.team-foundry/` directory with structured Markdown files + YAML frontmatter (owner, last_updated, purpose, source/validation info).
- A built-in "**Coach**" system: diagnostic patterns that help the AI notice drift, staleness, gaps, or inconsistencies.

Everything lives in Git → no cloud, no accounts, no extra sync. One person runs the CLI, commits, team pulls, and every AI now has the same context. There's also a `status` command, migration tools, and pre-built Claude skills.

### Strengths (what's genuinely good)

- **Addresses a real, painful problem** extremely well. AI tools are powerful but fragmented across team members/roles. This creates a single source of truth that feels native to the tools. The example repo (Clearline) is excellent — realistic, not placeholder content.
- **Thoughtful architecture**: Pointers + central `AGENTS.md`, detect-and-merge on re-runs, backups, frontmatter for ownership/staleness, git-aware status checks. Recent improvements (e.g., skills layout fix in v3.4.0, better staleness detection) show iteration.
- **Low friction & safe**: No silent writes, progressive onboarding, auto-detection from `package.json`/README, migration paths. Profiles (solo/full/federated) make it scalable.
- **Dogfooding & self-awareness**: The repo itself uses the system heavily (AGENTS.md, PROGRESS.md, CLAUDE.md, etc.). Lots of meta-documentation (docs/, coach behaviors, etc.).
- **Great DX focus**: Beautiful prompts (clack), realistic generated content, knowledge flywheel via skills/capture.
- Open source (MIT), active development, clear changelog.

This feels like something built by someone who's actually used AI tools in a team and got frustrated.

### Areas for improvement / critiques

- **Adoption barrier is still high**:
  - Requires team buy-in and discipline to keep files fresh. The "Coach" helps a lot, but it's still another thing to maintain.
  - Initial setup (even with the interview flow) takes time and thought. Solo devs might love it; larger teams need a champion.
  - Documentation is thorough but *very* dense — lots of interlocking docs. Could benefit from a clearer "Getting Started in 5 minutes" path or video.

- **Scope & complexity creep**:
  - It has evolved nicely (pointer architecture, skills, status, etc.), but the full profile + coach + skills + federated mode is quite a lot. Risk of feeling like "yet another process layer."
  - Some features (e.g., git-based staleness) assume certain workflows (may need tweaks for monorepos, squash-merge heavy teams — though recent fixes help).

- **Polish & discoverability**:
  - Repo has only ~1 star (as of my check). Needs more marketing/examples/testimonials. The website (team-foundry.com) is mentioned but I didn't deep-dive it.
  - Code quality seems solid from structure (TypeScript, tests, tsup, etc.), but I couldn't pull full source easily here — assuming it's clean given the self-imposed standards.
  - Skills discovery bug fixed recently (v3.4) suggests there have been some rough edges in AI-tool integration.

- **Potential extensions** (nice-to-haves):
  - Better integration with existing docs (Notion, Confluence import?).
  - More tool support (e.g., Windsurf, other Cursor-like tools, VS Code agents).
  - Optional lightweight validation (e.g., link checker for frontmatter references).
  - Templates or starters for common domains (SaaS, mobile, etc.).

### Overall verdict

**Strongly recommended for teams (or even ambitious solo devs) heavily using Claude/Cursor/Gemini in their workflow.** It's one of the more thoughtful solutions I've seen to the "AI context fragmentation" problem. The Git-centric, no-vendor-lock-in approach is refreshing and sustainable.

It's not magic — success still depends on the team actually using and maintaining the context — but it lowers the bar dramatically and provides excellent guardrails (Coach, status, frontmatter).

**Score**: 8.5/10 for the problem it targets. With better marketing and a few more polish iterations, it could become a go-to tool in the AI-augmented dev ecosystem.

If you're the author (Tomer), great work — keep shipping the small, high-signal improvements. If you're evaluating it for your team, try the example repo first and run it on a side project. Let me know if you want me to dig into specific parts (e.g., a particular doc or potential improvements)!