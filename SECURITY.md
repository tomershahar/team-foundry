# Security Policy

## Supported Versions

team-foundry is distributed via `npx create-team-foundry`, which always fetches the
latest release — so in practice nearly everyone runs the newest version. Security
fixes land in the latest minor and are published to npm.

| Version | Supported          |
| ------- | ------------------ |
| 3.5.x   | :white_check_mark: |
| < 3.5.0 | :x:                |

If you're pinned to an older version, upgrade with `npx create-team-foundry@latest`.

## Threat model (what to keep in mind)

team-foundry is a **local-first CLI with no backend, no network calls, no telemetry,
and no secrets**. It:

- reads `package.json`, `README`, and existing AI-rules files in the target repo;
- runs read-only `git` commands (via `spawnSync` with argument arrays — no shell);
- writes Markdown/config files into the current repo, never overwriting your content
  silently (existing files are skipped, or backed up before replace).

The most relevant risks are therefore around generated/imported content and the files
the CLI writes — for example, malformed input that produces broken output, or a path
that escapes the intended directory. Reports in those areas are especially welcome.

## Reporting a Vulnerability

Please **do not open a public issue** for security problems.

Report privately via GitHub's **"Report a vulnerability"** button:
**Security tab → Report a vulnerability**
(https://github.com/tomershahar/team-foundry/security/advisories/new)

What to expect:

- **Acknowledgement** within **3 business days**.
- An initial assessment (accepted / needs-info / declined, with reasoning) within
  **7 business days**.
- If accepted: a fix on the latest minor, a published npm release, and a GitHub
  Security Advisory crediting you (unless you prefer to remain anonymous).
- If declined: a short explanation of why, so you can follow up if you disagree.

Please include the version, your OS/Node version, reproduction steps, and the impact
you observed. Thank you for helping keep team-foundry users safe.
