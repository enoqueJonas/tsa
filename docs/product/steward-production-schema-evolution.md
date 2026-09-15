# Steward Production Schema Evolution

## Decision

Delivery Engineer must perform one real backward-compatible PostgreSQL schema evolution against populated Steward data while old and new application versions overlap.

A successful framework migration command is not sufficient evidence. The learner must demonstrate the lifecycle of persistent-state change across release boundaries.

## Required lifecycle

1. **Expand** — add a representation that is compatible with the currently running application.
2. **Coexist** — old and new application versions must be able to operate against the expanded schema for the intended release window.
3. **Backfill/migrate data** — existing rows move through a restartable, observable process rather than an opaque startup mutation.
4. **Verify** — deterministic checks prove migration completeness and consistency.
5. **Switch** — the new representation becomes authoritative only after its gates pass.
6. **Observe/recover** — a controlled post-switch failure forces an explicit rollback-versus-forward-fix decision.
7. **Contract** — obsolete schema/compatibility behavior is removed only after the old-version dependency and rollback window are intentionally closed.

## Recovery boundary

Application rollback and database rollback are different operations. Once persistent state changes, the previous application may or may not remain compatible. Every migration must classify which stages are backward compatible, reversible, forward-only, or dependent on backup/restore.

Destructive reverse migrations are not the default recovery strategy. A known compatible application rollback or a controlled forward fix is often safer than attempting to reconstruct mutated production data.

## Mandatory evidence

The learner must preserve evidence of populated pre-migration data, old-version operation after expand, old/new coexistence, an interrupted and safely restarted backfill, migration load/locking observations, deterministic data verification, post-switch failure and recovery, a contract safety gate, and the final contracted schema.

## Release integration

The release manifest identifies the migration set. The release runbook must state migration preconditions, verification, stop criteria and recovery choices. The pipeline must not automatically run destructive contract migrations merely because the new application deployment succeeded.
