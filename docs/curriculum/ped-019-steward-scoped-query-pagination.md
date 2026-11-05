# PED-019 — Applied Steward queries and pages without an untaught Identity prerequisite

**Scope:** Builder → Django & API Engineering, after the real beginner Book filtering and pagination labs. The existing **Filtering, Searching and Ordering** and **Pagination** lesson IDs remain unchanged.

Related: [#321](https://github.com/enoqueJonas/tsa/issues/321), [PED-018](ped-018-drf-query-pagination-real-api.md), [PED-017](ped-017-drf-real-http-error-handling.md).

## Defect and instructional boundary

The preceding Book API lessons show real query filtering, sorting, and numbered/cursor pagination over stored Books. The existing applied Steward lessons still asked learners to *authenticate as Team A* and use a `Membership`-derived authorized base queryset. But the complete Identity & Authorization module is **later** in the learner journey. The existing executable examples were synthetic Python parsers/list slicing, so an unprepared learner could not complete the Steward practical independently.

This remediation **does not invent authentication**, a fake request identity header, an unverified JWT or a production `Membership` shortcut. It teaches the database correctness invariant in a disposable fixture selected only through Django server-side test settings.

## Rebuilt learner contract

**Server-selected fixture:** `registry/training_scope.py` reads `TSA_TRAINING_TEAM_ID` from trusted `override_settings` inside a test. The value cannot come from query params or client headers. It is explicitly **not** a security control to deploy; later Identity lessons must replace it with membership derived from a verified principal and object-level permission checks.

**Sequence:**
1. Create `registry/training_scope.py`: actual `Service.objects.filter(owning_team_id=team_id)` first; only afterward append validated `lifecycle`, `criticality`, `owning_team`, bounded `search`, and allowed ordering with unique PK tie-breaker. Valid `owning_team=B` request while server context selects A narrows to zero; invalid values get HTTP 400; missing trusted server context gets HTTP 403.
2. Create `registry/training_query_views.py`: real DRF `APIView` list and `PageNumberPagination` (two default results, three maximum); count and page operate on the already-scoped QuerySet. Create `registry/training_scoped_urls.py` as **unpublished local-only URLConf**. Verify `config/urls.py` never includes it.
3. Run `registry/seed_scoped_services.py`: five Team A and three Team B invented UAT Services with real FK and lifecycle; no invalid production Service without a production Environment.
4. Run `registry/scoped_filter_lab.py`: actual HTTP + SQL evidence: count five for Team A, no Team B rows, lifecycle=uat and criticality=high intersection of two, forged other-team owner zero, seven unsupported/repeated query forms return 400 with no writes, missing server scope returns 403.
5. Run `registry/scoped_page_lab.py`: actual HTTP: first page Birch/Cedar and count five; QuerySet SQL for page two includes owner scope, ORDER BY and OFFSET; inserting an earlier-sorting Aardvark yields Cedar duplicated on second page and count six. Requested size 100 capped at three; invalid/repeated parameters 400, missing page 404; switching **server settings** to Team B yields three Team B rows, not the six Team A rows.

The page experiment uses one deliberate insertion and should be executed on a fresh fictional dataset or reset only those fictional training rows for repetition. The earlier Book exercise already tested real cursor pagination under a stable immutable ordering key; this applied exercise focuses on correct **scoping before count/paging**, not duplicating that cursor lesson.

## Why this order

A database query cannot identify an authenticated user's teams on its own. Learners now understand:

- A *server-selected visibility predicate* is a prerequisite input to filtering and pagination.
- Untrusted client parameters can narrow an existing scope but must never broaden it.
- SQL `COUNT` and `LIMIT/OFFSET` must operate on the scoped QuerySet, not on an unbounded base list.
- Even correct per-request ordering does not create a frozen snapshot across separate HTTP requests.
- **What is not established:** authentication, real Team membership, per-Service permissions, revocation behavior, safe public deployment, concurrent state invariants or novice mastery.

## Evidence and acceptance

- Lesson source: `packages/runtime-kernel/src/paths/builder-django-rich.ts`.
- Exact practical overrides: `packages/runtime-kernel/src/paths/builder-django-quality.ts`.
- Extract-and-run real Django test: `scripts/check-builder-django-live-lab.mjs`.
- Reference behavior: [DRF Filtering](https://www.django-rest-framework.org/api-guide/filtering/), [DRF Pagination](https://www.django-rest-framework.org/api-guide/pagination/), [Django QuerySets](https://docs.djangoproject.com/en/5.2/ref/models/querysets/), [Django test client](https://docs.djangoproject.com/en/5.2/topics/testing/tools/).
- Technical acceptance: matching-head full curriculum CI plus integration in isolated PostgreSQL, to be verified before merging.
- **Rendered human readability, progress persistence and uncoached novel-domain transfer: not validated by this CI.** Keep issue #321 open.

**Next:** API Versioning remains a pure function compatibility example and needs a genuine versioned HTTP contract without prematurely requiring authenticated Steward. Then OpenAPI and configuration integration, end-to-end Django module lab and Identity/Auth. Do not reopen already-studied PostgreSQL without a demonstrated prerequisite blocker.
