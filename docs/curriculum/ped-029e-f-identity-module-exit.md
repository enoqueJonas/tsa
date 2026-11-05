# PED-029E/F — Builder Identity module remediation evidence (2026-11-05)

Related issues: #396, #321, #318, #315. Draft PR: #399.

## Learner sequence and changes

The completed PostgreSQL and earlier Django/DRF lessons are not rewritten. The continuing **Identity, Authentication & Authorization** module now has independently navigable checkpoints for real JWT authentication, current Membership authorization, scoped collection/detail reads, server-authorized creation, nested Environment and directed ServiceDependency creation, explicit Owner transfer policy, atomic ownership/audit transfer, and two newly added lessons:

- **PED-029E — Rotate Refresh Tokens and Prove Logout with Real HTTP.** Complete published `config/settings.py` append, `registry/session_lifecycle_urls.py`, `registry/session_lifecycle_lab.py`. Uses original hashed account and the SAME 0008 PostgreSQL registry; migrates Simple JWT blacklist, rotates twice, rejects stale refresh, blacklists at logout, proves separate access-token expiry and unchanged domain rows.
- **PED-029F — Publish a Secure Steward Contract and Inspect Token-Safe Logs.** Complete `registry/secure_contract_views.py`, `registry/secure_contract_api_urls.py`, `registry/secure_contract_urls.py`, `registry/secure_contract_lab.py`. Delegates to REAL signed Service detail and atomic transfer handlers, generates the API contract from the same routes, compares JWT and 200/400/401/403/404/409 behavior and audit persistence, and inspects a bounded `django.request` log sample.

The previously thin Authentication Flows and Ownership and Access Rules now trace prerequisites, actors, stored authority and failure decisions. Common Authentication and Authorization Mistakes explicitly separates implemented behavior from unimplemented DELETE/rate controls.

The original final Lab: Secure Steward API activity IDs are preserved. Its 180-minute undifferentiated build is replaced by a **seven-boundary evidence matrix**, ordered executable checkpoints, an independent Team A/Team B case and an eight-question teach-back scored 0–2 with 14/16 pass threshold and no zero on key security concepts.

## Safeguards

- `scripts/check-builder-django-live-lab.mjs` extracts exact new learner source and attempts real HTTP/SQL work over the same migrated registry, not mock JWTs or a separate SQLite demo.
- `scripts/check-identity-module-integrity.mjs` checks order, exact source captions, Python AST syntax, preserved activity identifiers and the transfer rubric.
- `scripts/tests/curriculum-smoke.test.mjs` invokes the module integrity check.
- All tutorial URLConfs stay private; `config/urls.py` is inspected for accidental inclusion.

## Evidence status

- **SOURCE WRITTEN:** yes, committed on PR #399. Manual source/ID inspection found 26 lessons and the expected new snippets.
- **MATCHING-HEAD AUTOMATED CHECKS:** NOT YET VERIFIED. Existing earlier results attached to PR #399 apply to older SHA `8ebd32a`; do not reuse them for the new refresh/OpenAPI/capstone commits.
- **RENDERED PAGE/PROGRESS AND INDEPENDENT NOVICE TRANSFER:** NOT VERIFIED. Never mark `VALIDATED` based on green TypeScript/test/build alone.
- **PRODUCTION SECURITY:** not claimed.

Run against latest branch/head:

```bash
git fetch origin
git switch curriculum/forward-identity-checkpoints
git pull --ff-only origin curriculum/forward-identity-checkpoints
node scripts/check-identity-module-integrity.mjs
node scripts/check-builder-django-live-lab.mjs
pnpm test
pnpm build
node scripts/audit-learner-facing-curriculum.mjs --strict
```

The live Django lab requires the PostgreSQL/dependencies established for earlier real labs. Include actual output and SHA before changing evidence status.

## Explicit residual work

Concurrent refresh single-use/family revocation; immediate access logout; account-wide logout; nested child update/delete/reparenting; cross-Team dependency reconciliation; multi-writer transfer guarantees; secure OpenAPI for all deployed routes; reverse-proxy/WAF/APM log safety; manual rendered navigation/progress and uncoached learner scoring. Those are separate claims and are not automatically solved by source remediation.

**Classification:** Instructional source remediated, latest-head execution and learner validation pending. Keep #396, #321, #318 and #315 open.
