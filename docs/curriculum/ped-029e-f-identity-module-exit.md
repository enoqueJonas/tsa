# PED-029E/F — Builder Identity module remediation evidence (2026-11-05)

Related issues: #396, #321, #318, #315. Draft PR: #399.

## Learner sequence and changes

The completed PostgreSQL and earlier Django/DRF lessons are not rewritten. The continuing **Identity, Authentication & Authorization** module now has independently navigable checkpoints for real JWT authentication, current Membership authorization, scoped collection/detail reads, server-authorized creation, nested Environment and directed ServiceDependency creation, explicit Owner transfer policy, atomic ownership/audit transfer, and two newly added lessons:

- **PED-029E — Rotate Refresh Tokens and Prove Logout with Real HTTP.** Complete published `config/settings.py` append, `registry/session_lifecycle_urls.py`, `registry/session_lifecycle_lab.py`. Uses original hashed account and the SAME 0008 PostgreSQL registry; migrates Simple JWT blacklist, rotates twice, rejects stale refresh, blacklists at logout, proves separate access-token expiry and unchanged domain rows.
- **PED-029F — Publish a Secure Steward Contract and Inspect Token-Safe Logs.** Complete `registry/secure_contract_views.py`, `registry/secure_contract_api_urls.py`, `registry/secure_contract_urls.py`, `registry/secure_contract_lab.py`. Delegates to REAL signed Service detail and atomic transfer handlers, generates the API contract from the same routes, compares JWT and 200/400/401/403/404/409 behavior and audit persistence, and inspects a bounded `django.request` log sample.

The previously thin Authentication Flows and Ownership and Access Rules now trace prerequisites, actors, stored authority and failure decisions. Common Authentication and Authorization Mistakes explicitly separates implemented behavior from unimplemented DELETE/rate controls.

The original final Lab: Secure Steward API activity IDs are preserved. Its 180-minute undifferentiated build is replaced by a **seven-boundary evidence matrix**, ordered executable checkpoints, an independent Team A/Team B case and an eight-question teach-back scored 0–2 with 14/16 pass threshold and no zero on key security concepts.

## Module-wide order and baseline-policy correction

The module has 26 lessons and 78 unique activity IDs (including the preserved capstone IDs). The formerly shallow **Authentication Flows** and **Ownership and Access Rules** now each have seven prerequisite-first sections and concrete policy/HTTP decision traces. The flow uses the actual signed rename route `/training/identity/services/<id>/rename/`, not a fictional generic PATCH endpoint.

**Important staged execution constraint:** the first real JWT lab is intended to run with `ROTATE_REFRESH_TOKENS=False` and asserts no replacement refresh field. PED-029E later changes that setting to `True`, applies `token_blacklist` migrations, and asserts the opposite policy. The capstone has been corrected to preserve the first lab's actual baseline evidence and then verify rotation in the later environment; replaying the baseline script after the policy change is an invalid test, not a learning failure. The stage-specific instructions are in the final lab's code block.

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

## 2026-11-05 local execution report and targeted correction

A real learner-local run after checking out this PR branch established the following, rather than only relying on a previous green head:

- `node scripts/check-identity-module-integrity.mjs`: **passed** before the fix.
- `pnpm test`: **34 passed, 4 failed out of 38**. The failures were one **Identity TypeScript error** and three separate System Thinker prerequisites: XML/XSD lacked `lxml`; SFTP lacked `asyncssh`; the FTP subprocess exited before listening. FTP launches `python -m pyftpdlib` with stderr hidden, so missing `pyftpdlib` is a plausible diagnosis, **not established** solely from that message.
- `pnpm build`: **failed** with TS2353 in `builder-identity-auth-deep.ts` on final capstone reading blocks; a heading incorrectly included `items` and another heading incorrectly included `title`/`code`/`caption`. The learner-facing strict structural inventory reported zero findings but did not catch those type errors.
- `node scripts/check-builder-django-live-lab.mjs`: **did not run its PostgreSQL work**, because `PGDATABASE` was undefined rather than the guarded disposable `tsa_steward_lab`. This is not evidence that signed JWT/SQL logic passed or failed.
- Strict learner-facing structural audit: **passed** (12 schools, 128 paths, 1,384 lessons, 4,102 activities, zero structural findings). This is not a manual depth or learner-transfer result.

**Committed source correction:** replace invalid heading extras with properly typed separate `heading` / `list` / `code` blocks, remove duplicate contradictory post-rotation commands, and preserve the three-stage JWT baseline → Membership/Ownership → refresh-blacklist chronology. Commit `c9bfbd182ef6b7fbb01f741d9087055bcb6619b1`. New gate `scripts/check-identity-module-integrity.mjs` parses the final lab, rejects extra properties on heading blocks and requires a single three-stage command block with correct policy transition order. Commit `11afe0d62416bd777f85cbe42fa1f69831481a07`.

**Verification honesty:** the fix and stronger guard are committed, and the resulting capstone block was parsed/inspected through the connected repository. Matching-head TypeScript compilation, full test/build, PostgreSQL HTTP regression, browser rendering and novice scoring **still require actual execution output**. Do not promote these to passed from the correction alone.

For a repeat local Python smoke run, use an activated disposable Python environment and install the CI-declared requirements (`lxml>=5,<8`, `pyftpdlib>=2,<3`, `asyncssh>=2.20,<3`). Confirm those imports under the *same* `python3` used by Node subprocesses. The FTP port must be bindable on localhost; inspect server startup separately if the package is present.

For the live Django lab, use a **dedicated disposable PostgreSQL instance**, configured with `PGHOST`, `PGPORT`, `PGDATABASE=tsa_steward_lab`, `PGUSER` and `PGPASSWORD` verified via `psql`. The script creates additional specifically named training databases, so do not point it at a valuable PostgreSQL cluster or rerun blindly against persistent training databases. CI uses PostgreSQL 17 and installs Django/DRF/psycopg/drf-spectacular/SimpleJWT; a separate local run needs those dependencies. Never bypass the database guard by setting only `PGDATABASE`.

