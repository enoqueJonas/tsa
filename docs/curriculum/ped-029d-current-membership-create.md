# PED-029D — Authorize Service creation before an object exists

Date: 2026-11-05. Continuation of PR #399's signed collection/detail checkpoint, parent `7dbc8e823a86395cf398541e3457e55ad99e6118`. Related: #396 checkpoint C, #321, #318.

## Demonstrated gap and learner sequence

The preceding lessons prove real JWT authentication, one current-Membership PATCH, and current-Membership list/detail visibility. None authorizes a new Service: there is no persisted Service on which to invoke an object permission check. The integrated pre-Identity POST uses a server-selected synthetic Team and explicitly defers genuine Membership. That earlier lesson remains intact.

Add **Authorize a Signed Steward Service Creation** after signed reads and before ownership rules. Preserve all previous lesson/activity identifiers. It reuses the same migrated 0007 PostgreSQL registry and `ServiceCreateInput` / `ServiceRead` from the integrated lab. The lesson distinguishes a URL's proposed destination Team from current database authority, viewer read permission from maintainer create permission, and server-owned UAT creation from production promotion.

## Exact published files and checks

- `registry/membership_create_api.py`: real Simple JWT and IsAuthenticated; current user/selected Team/MAINTAINER lookup under an atomic boundary with a locked matching Membership. No separate Team-existence response to unauthorized callers. Explicit JSON-object/field allowlist; query parameters refused; checked Membership supplies owner and the server sets UAT. PostgreSQL uniqueness errors become 400 outside an inner savepoint. No client role, owner, creator or lifecycle assignment.
- `registry/membership_create_urls.py`: isolated URLConf reusing real token/whoami and signed detail reads; never included in normal config URLs.
- `registry/membership_create_lab.py`: actual tokens from hashed users, missing-token 401; viewer, cross-Team and missing-Membership 403; forged fields and invalid inputs 400; every denied request compares every Service column before/after. Authorized 201 must add exactly one row with checked owner/UAT, signed detail 200, and a fresh Django process must reopen the COMMITTED row using its own connection. Duplicate name and duplicate slug each fail with unchanged data; a subsequent valid POST succeeds. Downgrade and Membership deletion deny the SAME JWT while whoami still authenticates; the other Team maintainer still creates for its own Team.
- Setup intentionally commits fictional fixtures so the independent connection can see them. `finally` cleans only known newly created Team/user IDs and their otherwise unreferenced new Services, on success or assertion failure. Prefix preconditions stop on pre-existing fictional fixtures without deleting by prefix. Original Services and Reviews are compared after cleanup. An interrupted process may require inspecting leftover fictional fixtures; sequence values may advance.
- Independent learner transfer: give one principal a second Team VIEWER Membership, predict refusal, change only that row to MAINTAINER and predict success with the same JWT and distinct input. This is an assessment prompt, not a claim of learner mastery.

The existing source-derived Django regression extracts and runs all three exact published files in the SAME 0007 database after the read checkpoint. It must reject three independently changed policies: viewer may create, destination Team not checked, and unsupported authority fields silently accepted. Failed variants must also leave no fictional Team/user fixtures, and correct API source is restored in `finally` with bytecode caches cleared between subprocesses.

## Verification record

- Runtime-kernel TypeScript compilation: passed locally.
- Curriculum integrity: passed locally, 273 runtime path files.
- Full source-derived Django/PostgreSQL regression: passed locally, including committed-row child-process read and all six read/create policy mutants. All 36 curriculum smoke tests passed (0 failures/skips).
- Matching-head PostgreSQL 17/build/browser CI remains separate from local PostgreSQL 14 execution.
- Human rendered review, progress re-entry and uncoached transfer remain unverified.

## Boundaries left open

Nested Environment/ServiceDependency writes, delete, ownership transfer, refresh rotation/blacklist/logout and secure-route OpenAPI remain separate work. The narrow Membership lock does not prove universal concurrent revocation or account-deactivation semantics. Global name/slug conflicts may reveal that a value is in use; product visibility policy must decide how to handle that. No training URL is published and no claim of production readiness is made. Keep #396 open.

Primary sources: [DRF object-permission limitations](https://www.django-rest-framework.org/api-guide/permissions/#limitations-of-object-level-permissions), [Django explicit transactions and database errors](https://docs.djangoproject.com/en/5.2/topics/db/transactions/#controlling-transactions-explicitly).
