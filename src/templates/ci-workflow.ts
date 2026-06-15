/**
 * GitHub Actions workflow that fails a PR when team-foundry context drifts.
 * fetch-depth: 0 is required because the staleness check reads git history.
 */
export const CI_WORKFLOW_YAML = `name: team-foundry context drift

on:
  pull_request:
  workflow_dispatch:

jobs:
  drift:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0 # status uses git history for staleness signals
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      # Fails the build on missing files or link-integrity issues.
      # Add --max-stale=N to also fail when more than N files go stale.
      - run: npx create-team-foundry status --ci
`;

export const CI_WORKFLOW_PATH = '.github/workflows/team-foundry.yml';
