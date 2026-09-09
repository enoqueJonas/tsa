# Rollback reasoning notes

Rollback safety is a property of the complete release transition, not only the application image.

Before claiming rollback is available, ask:

- Can the previous application version understand the current database schema?
- Did the release perform irreversible data transformation?
- Did it trigger external side effects that an old binary cannot undo?
- Is the previous artifact still retrievable by immutable identity?
- Is previous configuration still available and valid?
- Has the rollback path been exercised safely?

When reversal is unsafe, the runbook should define containment and forward recovery rather than pretending an old container solves the problem.
