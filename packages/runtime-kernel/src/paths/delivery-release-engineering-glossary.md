# Release Engineering glossary

- **Build artifact** — output produced by a build process.
- **Release candidate** — one immutable artifact set being evaluated for release.
- **Release** — a candidate accepted/authorized under the organization's release process.
- **Promotion** — moving the same known candidate/release through a controlled state or environment boundary.
- **Deployment** — installing/starting a release in a target runtime environment.
- **Verification** — gathering evidence that the intended runtime state and representative behavior are correct.
- **Gate** — a condition or decision that must be satisfied before a release transition.
- **Rollback** — restoring a previous compatible application/runtime state.
- **Forward recovery** — repairing the current/new state when reversal is unsafe or impossible.
- **Last-known-good** — a previously verified release/state retained as a recovery reference.
