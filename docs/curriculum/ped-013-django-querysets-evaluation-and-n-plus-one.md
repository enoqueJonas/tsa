# PED-013 — Django QuerySet evaluation, result caching and N+1 from first principles

**Learner boundary:** Builder → Django & API Engineering, after the PostgreSQL module and the new Django models/migrations lessons. This remediation is forward-only: do not reopen already-read Python, Web/API or PostgreSQL material absent a concrete blocking prerequisite defect.

**Related:** [PED-012](ped-012-django-models-before-steward.md), [#321](https://github.com/enoqueJonas/tsa/issues/321), [#318](https://github.com/enoqueJonas/tsa/issues/318).

## Defect at the learner-facing source

The existing `ORM Query Behavior and Performance` reading was roughly 4,000 characters and combined lazy evaluation, caching, multiple retrieval contracts, forward/reverse loading, N+1, raw SQL and transactions. Its only code fragment referenced `Service`, `Service.Lifecycle` and `owning_team` without a complete local dataset, setup, runnable measurement or observed output. The practical asked for query counting before showing a learner how to count SQL. A 50-minute reading with that prerequisite burden is not standalone instruction.

## Three additive prerequisite lessons

| New reading | What becomes independently understandable | Exact learner-verifiable output |
| --- | --- | --- |
| **Build and Execute Your First QuerySet** | `Book.objects` manager, QuerySet description, `filter`, `exclude`, `order_by`, generated SQL, actual evaluation, cached second iteration | `construction_queries: 0`, `evaluation_queries: 1`, `reuse_queries: 0`; titles from known four-book fixture |
| **Choose Django Query Methods and Reuse Results** | `get` vs `first` vs `exists` vs `count`, distinct result shapes and exceptions, same QuerySet cache vs fresh QuerySet, uncached index trap | 1 query for reused QuerySet, 2 for two fresh ones, `GET_MISSING_REJECTED`, `GET_MULTIPLE_REJECTED`, two independent index queries |
| **Load Related Django Rows Without Repeating Queries** | ForeignKey directions and cardinality, why accessing relations causes extra SQL, `select_related` join vs `prefetch_related` second lookup, evidence of unchanged results | Reverse 4→2 queries; forward 4→1; row equivalence checked; unseen fourth parent gives 5→2 |

The previous `ORM Query Behavior and Performance` lesson retains its ID and now follows these novice-readable foundations as an applied Steward performance review. The already-migrated `tsa-django-intro` catalogue from PED-012 remains the only prerequisite to these independent lessons.

## Data and failure boundaries

- An idempotent `catalogue/query_seed.py` establishes four `Book` rows, three `ReadingList` rows and three membership rows. It uses `get_or_create`, does not delete learner rows, and explicitly explains that expected counts refer to this known scratch dataset.
- `CaptureQueriesContext` counts real SQL statements issued by the Django connection; it is not a mock, not an external PostgreSQL server, not a complete latency benchmark and not a claim that one execution pattern is universally faster.
- `Book.objects.get` deliberately raises `DoesNotExist` and `MultipleObjectsReturned`; neither is incorrectly portrayed as network failure.
- A fresh, unevaluated QuerySet is used for each count; an already-populated result cache can conceal the first read.
- The N+1 experiments check both SQL counts **and identical returned rows**. A bounded two-query prefetch is not assumed to be always optimal for very large child collections.
- Forward ForeignKey `select_related` and reverse one-to-many `prefetch_related` are taught separately and justified from cardinality, rather than supplied as magical method names.
- The Steward exercise follows, not precedes, this foundation; its related-name paths must be verified against the actual registry models.

## Research and teaching translation

| Source | Reviewed mechanism | Original TSA teaching |
| --- | --- | --- |
| [Django 5.2 — Making queries](https://docs.djangoproject.com/en/5.2/topics/db/queries/) | Manager/QuerySet use, lazy evaluation, query filters and cache behavior | A complete script measuring 0 construction queries and 1 executed SELECT, then cached reuse |
| [Django 5.2 — QuerySet reference](https://docs.djangoproject.com/en/5.2/ref/models/querysets/) | Evaluation triggers, `get`, `first`, `count`, `exists`, relationship loading and `iterator` caveat | An independent real-data experiment with both result contracts and expected negative cases |
| [Django 5.2 — Database access optimization](https://docs.djangoproject.com/en/5.2/topics/db/optimization/) | Measuring actual query patterns and prefetch decisions; caution against redundant `exists`/`count` | A before/after N+1 query count plus no-change to result rows |
| [Django Internals — Evaluation and the result cache](https://djangointernals.dev/querysets/evaluation) | Explanation of `_result_cache`, narrow queries and instance-specific cache | Explains why two indexing operations can issue two queries and why first iteration differs from second |
| [Django Internals — Counting queries](https://djangointernals.dev/testing/query-assertions) | Test instrumentation with `CaptureQueriesContext` and count boundaries | Explicit SQL capture without requiring the learner to install a third-party monitoring service |

The listed references were inspected for the relevant published mechanisms and are optional reinforcement. No video is claimed as watched or independently verified. Source explanations and all runnable code are authored within the TSA lesson.

## Source-executed validation contract

`scripts/check-builder-django-live-lab.mjs` now extracts **exactly** the published four scripts from the authored Django source, runs them in the separate real Django scratch project *after* first and second migrations, validates the stable console outputs, and reruns the seed to verify idempotence. It checks source lesson order and published practical overrides. In addition to the 4/2 and 4/1 baseline examples, it adds a previously unseen fourth reading list, asserts identical logical rows, and proves the unoptimized reverse lookup grows to 5 statements while prefetch remains 2.

**Acceptance stages:**
- **Source authored:** YES, via this branch, subject to code review.
- **Source-derived execution:** PENDING matching-head CI.
- **Whole curriculum/test/build:** PENDING matching-head CI.
- **Rendered reading/practical and progress persistence:** UNVERIFIED (browser automation checks availability/navigation but cannot grade conceptual depth).
- **Independent novice transfer:** UNVERIFIED; a real learner should create a new parent/child domain, recognize a new N+1 access pattern, choose an appropriate loading strategy and justify not changing code when metrics do not support it.

## Next module work

Review remaining Django & API Engineering content in learner order, including applied ORM/transactions, schema evolution, serializers, views and routing, filtering/pagination, versioning/OpenAPI, configuration/logging and integrated lab. Only then continue Identity/Auth → Software Craft → Builder milestone → next schools. Preserve old activity IDs, track technical and human validation separately, and do not represent tests as a novice learning outcome.
