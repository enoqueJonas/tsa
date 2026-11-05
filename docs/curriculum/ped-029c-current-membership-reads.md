# PED-029C — Current Membership must scope collection and detail reads

Date: 2026-11-05. Continuation from merged #398 (`eb4a73ee`), strictly after #385. Related: #396, #321, #318.

## Checkpoint inspection

The original continuation request names work since #385. Inspection of current master and actual lesson sources found that PED-019 already removes pre-Identity authenticated Team assumptions; PED-020 teaches real versioned HTTP; PED-021 generates and compares OpenAPI; PED-022 executes configuration failures; PED-023–027 split and integrate the migrated Steward lab. PED-028, #397 and #398 then establish Membership 0007, real JWT and one authorized PATCH. Those completed lessons are retained. No PostgreSQL or filtering/search/ordering/pagination lesson is rewritten.

The next documented defect is #396 checkpoint C: an authorized object PATCH does not establish collection visibility. DRF's object permission hook does not automatically scope lists. A total count or later page can disclose another Team's data even if visible rows on the first page look correct.

## Lesson and executable evidence

Add **Scope Signed Steward Collections and Detail Reads** between current Membership PATCH and ownership rules, retaining every prior activity ID. It teaches authentication versus read visibility versus maintainer write authority, a current Membership SQL subquery, explicit recognized roles, scope before COUNT/LIMIT and before detail lookup, deliberate concealed 404, query allowlisting, and diagnostic failures.

The learner saves three complete source files:

- `registry/membership_read_api.py`: actual Simple JWT, IsAuthenticated, current viewer/maintainer Membership, read-only list/detail, two-row pages.
- `registry/membership_read_urls.py`: isolated URLConf reusing real token/whoami endpoints; absent from normal config URLs.
- `registry/membership_read_lab.py`: actual obtain/access JWTs; three own-Team Services across two pages, one foreign Service; exact IDs and count on every next link; real SQL checks on COUNT and LIMIT; same-Team detail 200; foreign and absent detail 404 with equal JSON; unauthenticated 401; forged owner/role or repeated page 400; unsupported write 405; multi-Team union; unknown role and removed Membership reveal nothing under the same still-valid JWT; other principal unaffected; all Service columns unchanged.

All new fixtures live inside a rollback transaction, so this checkpoint can rerun without deleting earlier domain data. PostgreSQL sequences may advance. The earlier Ana revocation is not silently undone. An independent second-user transfer requires predicting the effect of revoking only one of two Memberships.

The existing source-derived Django regression extracts these exact lesson files and executes them immediately after the real 0007/JWT/PATCH evidence, on the same migrated PostgreSQL database. Three independent source mutants must fail an assertion: unscoped list, unscoped detail, and unknown role accepted. Correct source is restored in a finally block; subprocess bytecode caches are removed between variants.

## Verification

- Local curriculum integrity audit: passed, 273 runtime path files.
- Local runtime-kernel TypeScript compile: passed.
- Local full source-derived Django regression: passed, including all three new policy mutants; real disposable PostgreSQL 14 with Django 5.2.19, DRF 3.18.3, Simple JWT 5.5.1.
- CI workflow enabled for the new branch; PostgreSQL 17 and complete matching-head build/browser results remain separate until actually observed.
- Initial broader smoke attempt was constrained by unavailable loopback binding and missing Python packages; it is not a passing result. A rerun uses the temporary dependency environment and allowed local-server execution.

## Scope still open

Create/delete, nested Environment/ServiceDependency writes, ownership transfer, refresh rotation/blacklist/logout, secured-route OpenAPI, concurrent policy changes between COUNT/page statements, human rendered review/progress re-entry and uncoached novice validation remain outstanding. A read checkpoint plus the preceding narrow PATCH must not be described as a complete secure Steward API. Leave #396 and broader learner-validation issues open.

## Primary references

- [DRF object permission limitations](https://www.django-rest-framework.org/api-guide/permissions/#limitations-of-object-level-permissions): list and create need their own controls.
- [DRF current-user filtering](https://www.django-rest-framework.org/api-guide/filtering/#filtering-against-the-current-user): scope querysets from the authenticated principal.
