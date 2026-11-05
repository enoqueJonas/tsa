# Software Craft — forward-only instructional depth and module exit

**Scope:** Builder's next unread module after the merged Identity/Auth work. Keep all existing lesson/activity IDs and the later Steward API milestone unchanged. Do not rewrite already-read PostgreSQL material.

## Source audit and changes

A source inspection of `builder-software-craft-deep.ts` found 22 regular lessons plus an existing independent milestone. The Git, conflict, refactoring and testing lessons already had substantial executable examples. Rewriting them purely to add length would not improve the learning experience. The weaker boundaries were:

- The existing **Configuration** lesson described parsing but did not make precedence, typed cross-setting validation, and *fail before side effects* distinct independent outcomes.
- **Useful Logging** demonstrated a successful event, but did not prove both denied and permitted events with nonempty output and a deliberate credential-leak negative.
- **Designing Errors** mapped domain errors in a pure function, but did not independently prove actual HTTP statuses, machine-readable codes, client actions and response sanitization.
- **Managing Dependencies** asked the learner to examine direct/transitive dependencies without a complete independent executable inventory starting point.
- **Technical Documentation** defined ADRs and runbooks but lacked a complete contrasting worked pair with explicit verification limits.

The forward change adds three separately navigable lessons and their learner-specific practice specifications:

1. **Configuration Precedence and Startup Gates**, following Configuration. An actual deterministic Python 3 settings parser validates required PostgreSQL target, typed debug and bounded workers, refuses unsafe production debug, and asserts the simulated listener cannot start before validation. A separate exercise proves source precedence; the `bool('false')` counterexample must be observed.
2. **Logging Failure Paths and Correlation**, following Useful Logging. An actual in-memory JSON logger emits a denied and a permitted event with stable correlation fields. A separate unsafe local logger produces a synthetic credential-leak mutation that must be rejected; empty output cannot pass.
3. **HTTP Error Contracts and Client Oracles**, following Designing Errors. An ephemeral loopback-only HTTP server accepts requests and produces independently checked 400/401/403/404/409/500/200 responses, stable JSON codes and a public-internals leak negative. Its lab tokens are explicitly **not** real JWTs and its success response makes **no** database write claim.

The existing Managing Dependencies reading now includes an offline Python standard-library inventory and a synthetic direct/transitive counterexample. The Technical Documentation reading now contrasts a fully specified proposed ADR with a bounded, non-destructive diagnostic runbook. They are examples, **not** evidence of a deployed system.

## Evidence gates

- `node scripts/check-software-craft-source-labs.mjs` executes **seven exact source-extracted published Python programs**, checking positive outputs, actual negative cases, preserved mechanism text and source/quality override integrity.
- `pnpm test`, `pnpm build` and `node scripts/audit-learner-facing-curriculum.mjs --strict` guard the complete repository.
- `python3 scripts/check-software-craft-browser.py` renders the five affected lessons, checks code copy affordances at desktop/390px, enforces scroll-to-top on Next and uses disposable synthetic IndexedDB state to verify practice/reflection persistence without modifying a real learner account.
- The dedicated PR workflow `.github/workflows/software-craft-pr.yml` uses Ubuntu 24.04 / Playwright 1.58. It does not require Docker or PostgreSQL for these **standalone** Software Craft exercises; real Steward database/JWT behavior was separately checked in the previous module.

**Current status:** source authored, execution **not yet established** on the latest branch. Do not mark a code snippet verified solely because it exists. Do not mark novice learning validated solely because Chromium or unit tests pass. A learner independently completing the exercise, identifying a deliberate wrong implementation and earning the stated assessment threshold remains a separate human acceptance condition.

**Module stop boundary:** finish and verify Software Craft before moving into the Steward API v1 milestone or another school. The original 22 lesson IDs and capstone activity IDs remain stable. Do not merge until matching-head CI is green; report real failures and correct source rather than weakening tests.
