# Safe failure-lab guidance

The controlled failed-release exercise should create useful evidence without destroying valuable learner state.

Prefer:
- invalid non-secret runtime configuration;
- intentionally unavailable dependency in a disposable test context;
- failed representative verification;
- incorrect but reversible port/routing configuration.

Avoid:
- deleting the Nexus blob store;
- corrupting the primary PostgreSQL data directory;
- exposing real credentials;
- destructive migration experiments against the only copy of learner data.

The goal is release-decision practice, not disaster for its own sake.
