# PED-018 — Real DRF filtering and pagination before applied Steward queries

**Scope:** Builder → Django & API Engineering, strictly after PostgreSQL, the persisted Book API and real DRF error handling. Existing IDs are preserved. New foundational readings precede the existing applied `Filtering, Searching and Ordering` and `Pagination` lessons.

Related: [#321](https://github.com/enoqueJonas/tsa/issues/321), [#318](https://github.com/enoqueJonas/tsa/issues/318), [PED-016](ped-016-drf-persistence-bridge.md), [PED-017](ped-017-drf-real-http-error-handling.md).

## Demonstrated deficiencies

The existing `Filtering, Searching and Ordering` module explained authorization scoping, equality, `icontains` and allowed sorts, but its only executable program was a **pure Python parser** of `lifecycle` and `ordering`. Its practical required an authenticated Steward queryset before the Identity module had taught how to build one. There was no actual `APIView` receiving GET parameters, no executed SQL, and no returned database rows/HTTP validation.

The existing `Pagination` module explained offset shifts and cursors but its executable example sliced an in-memory Python list. No learner ran `PageNumberPagination`, `CursorPagination`, real GET links, changing row count, invalid page parameters, or a bounded page size. A repeated record printed from a list was not evidence of a database-backed API pagination design.

## Two learner-first lessons inserted

### 1. Filter, Search and Order a Real Book API

After `Persist a Book Through a Real DRF API` and `See How DRF Turns Exceptions into HTTP Responses`, the learner creates:

- `catalogue/query_books.py`: complete DRF `APIView`; explicit allowed `year` / `search` / `ordering` params, strict four-digit year, bounded case-insensitive substring search, four fixed order choices, PK tie-breaker, unknown-field and duplicate-parameter rejection.
- `catalogue/urls.py`: append `query-books/`, preserving existing routes and settings.
- `catalogue/query_request_lab.py`: six repeatable fixture Books, actual Client GETs demonstrating six ordered results, intersected year/search producing three rows, deterministic `-year,pk`, six rejected query cases with HTTP 400 and no writes. `CaptureQueriesContext` checks that SQL **actually executed** contains the relevant WHERE and ORDER BY clauses.
- Source-derived CI adds a previously unseen seventh row, predicting and observing four results for year 2023; no prompt-specific fixed fixture masking is accepted.

The example explicitly separates a public query parameter from trusted authorization: the tutorial Book API has no authenticated Team scope and is **not** a production multitenant design.

### 2. Paginate Real Book Records Across Requests

After the query lesson and before the existing applied Steward Pagination lesson, the learner creates:

- `catalogue/page_books.py`: real `PageNumberPagination` with default size 2 / maximum size 3, and `CursorPagination` with unique stable shelf-code ordering. The PageBooks view reuses the actual validated QuerySet, validates page/page_size and passes its unevaluated QuerySet into DRF.
- `catalogue/urls.py`: append `page-books/` and `cursor-books/` after other paths.
- `catalogue/pagination_request_lab.py`: five invented Page Lab Books; first page returns Birch and Cedar, `count=5`. A separate HTTP request after inserting an earlier-sorting Aardvark yields Cedar **again** on page 2 and `count=6`. Continuing with the cursor saved **before** insertion instead yields Delta and Elm with no duplicate **in this specific unique, unchanged ordering-key scenario**.
- It checks requested page_size=100 is capped at 3, four malformed/unsupported/duplicate inputs yield 400 and out-of-range page 999 yields 404.

The cursor response has no total count; changing sort keys, permissions, deletions and unrelated snapshots remain separate issues. The Aardvark insertion deliberately makes this a **one-time** experiment; it is not misrepresented as a repeatedly idempotent test.

## Research and teaching translation

| Source | Verified mechanism | Original TSA implementation |
| --- | --- | --- |
| [DRF — Filtering](https://www.django-rest-framework.org/api-guide/filtering/) | `get_queryset`/filtering, `SearchFilter`'s `icontains` semantics, explicit `ordering_fields` recommendation, scoping before client filters | Explicit simple QuerySet builder without installing `django-filter` prematurely; real DRF GET and protected allowlist |
| [DRF — Pagination](https://www.django-rest-framework.org/api-guide/pagination/) | PageNumberPagination `page_size_query_param`/`max_page_size`, CursorPagination's stable/unique ordering requirement, opaque links | Complete page-number and cursor views, changing-table test and 100→3 size cap |
| [Django — QuerySet API](https://docs.djangoproject.com/en/5.2/ref/models/querysets/) | Exact filters, case-insensitive substring search and explicit sorting | Executed WHERE + ORDER BY SQL capture and returned-row assertions |
| [Django — Test Client](https://docs.djangoproject.com/en/5.2/topics/testing/tools/) | In-process HTTP requests against real database state | Separate client GETs, meaningful negative responses and persisted row state |

The examples were authored specifically for TSA. Tests run against the learner-visible source. No unrelated video is claimed as viewed.

## Verification stages

- **Written source:** added on this PR, original applied lesson IDs intact.
- **Source-derived execution:** `scripts/check-builder-django-live-lab.mjs` now extracts and executes all published file snippets in the same migrated `tsa-django-intro` scratch project; CI result still required.
- **Curriculum/regression/build/browser:** full matching-head CI still required.
- **Human rendered inspection and progress re-entry:** UNVERIFIED.
- **Uncoached novice learner transfer:** UNVERIFIED. Independent learner should add a new supported filter, predict real query/result behavior, and explain cursor vs numbered-page consistency under a new mutation pattern.

**Next forward-only work:** Applied Steward query authorization after Identity prerequisites, API versioning, OpenAPI/configuration/integrated lab and subsequent schools. Do not reopen already-read PostgreSQL lessons without a demonstrated prerequisite blocker.
