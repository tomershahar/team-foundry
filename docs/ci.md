[← Back to README](../README.md)

# Drift gate in CI

team-foundry context only helps if it stays true. The `status --ci` command turns
the existing drift checks into a build gate so context can't silently rot.

## One-time setup

```bash
npx create-team-foundry init-ci
```

This writes `.github/workflows/team-foundry.yml`. Commit it. From then on every pull
request runs the drift gate.

> The workflow checks out with `fetch-depth: 0` because the staleness signal reads
> git history. Don't remove that line.

## What it checks

```bash
npx create-team-foundry status --ci
```

| Signal | Default behavior |
|---|---|
| **Missing** context file | **Fails** the build (exit 1) — an AI is reading nothing |
| **Link-integrity** issue (e.g. an outcome references an undefined metric) | **Fails** the build — an AI would read contradictory context |
| **Stale** file (no update in 45+ days) | Warning only |
| **Empty** file (stub never filled in) | Warning only |

Stale and empty are warn-only because they're judgment calls, not correctness
failures. To enforce freshness too:

```bash
npx create-team-foundry status --max-stale=5 --ci   # also fails when > 5 files are stale
```

## Output

```
team-foundry status --ci
  0 missing  2 empty  1 stale  0 link issue(s)
  warn: 1 stale file(s)
  warn: 2 empty file(s)
  team-foundry: context OK
```

Exit code is `0` when clean and `1` on drift, so it plugs into any CI system, not
just GitHub Actions — run `npx create-team-foundry status --ci` anywhere.
