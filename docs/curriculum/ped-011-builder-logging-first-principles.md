# PED-011 — Builder logging first principles, after PostgreSQL

**Scope:** Builder → Django and API Engineering → immediately following PostgreSQL. This is an incremental source-depth remediation, not a claim that the whole Django module is complete or validated. Related: [PED-010](ped-010-builder-django-first-principles.md), [#321](https://github.com/enoqueJonas/tsa/issues/321), [#318](https://github.com/enoqueJonas/tsa/issues/318).

## Defect and dependency boundary

The prior **Application Logging** reading contained five short conceptual observations but no executable logger, handler or Django `LOGGING` example. Its practical asked a novice to add structured logging to the Steward project without first proving an ordinary Python log reaches an output destination or showing why messages disappear/duplicate.

Do **not** require Docker, Graylog, an observability stack, production deployment or a finished Steward application to learn a framework's own logging mechanism. The learner knows Python, HTTP and a Django scratch project from earlier Builder modules. Later operational/reliability schools introduce collection, retention, centralized querying, alerting and incident workflows.

## Lesson changes

1. **New, independent reading:** `Python Logging: Follow a Message to Its Destination` (new lesson ID). It introduces record, logger, handler, formatter, levels, filters and hierarchical propagation using two entire Python standard-library programs. One emits exactly the WARNING that survives its handler; the other demonstrates an actual duplicate and how propagation changes it.
2. **Existing lesson retained:** `Application Logging` keeps its lesson/activity IDs. It now shows a complete **catalogue** example: `config/settings.py` dictionary, `catalogue/logging_demo.py`, `python manage.py shell -c ...`, INFO and WARNING observations, a deliberate handler-level failure and a duplicate-output diagnosis. Expected stderr/stdout ordering is correctly qualified.
3. **Application exercise:** Only after the independent example works does the learner add appropriately scoped safe events to Steward. The module practical continues to use the existing Django scratch project.
4. **Explicit non-goals:** no log collector/Graylog setup here, no assumption that console logs persist after process exit, and no claim that filtering a teaching token proves production-wide data protection.

## Primary research and teaching translation

| Source and reading level | Verified mechanism | Teaching translation |
| --- | --- | --- |
| [Python Logging HOWTO](https://docs.python.org/3/howto/logging.html), direct section inspection | Logger and handler thresholds, Formatter, StreamHandler and Python levels | A self-contained, copyable `io.StringIO` example displays the exact WARNING but not INFO |
| [Django 5.2 How to configure and use logging](https://docs.djangoproject.com/en/5.2/howto/logging/), direct section inspection | `LOGGING` uses dictConfig, hierarchical logger naming, propagation, recommended `disable_existing_loggers=False` and setup timing | An actual module logger inherits `catalogue` settings and writes once to console with readable severity and namespace |
| [Django logging reference](https://docs.djangoproject.com/en/5.2/topics/logging/), direct section inspection | Django default configuration and the consequences of disabling existing loggers | A failure lesson checks missing/duplicate events before altering app code |

A video is **not represented as watched or independently verified** for this narrow topic. These references support factual correctness; the lesson itself contains the mechanisms and examples, rather than outsourcing explanation.

## Executable acceptance

The real source-execution check is `scripts/check-builder-django-live-lab.mjs`, which extracts the **exact published** Python and Django examples from `builder-django-rich.ts` and asserts:

- ordinary `logging` INFO suppression at a WARNING handler;
- propagation creates two copies and a configured boundary reduces it to one;
- the existing beginner Django project accepts the exact `LOGGING` dictionary and application module;
- valid and rejected application events appear once; valid and invalid return values are independent of logs;
- changing the handler threshold from INFO to WARNING removes only the INFO output, without masking the rejection.

The script is already part of the PostgreSQL-backed Builder Django GitHub Actions job. **Do not mark it technically verified until the matching branch-head CI run is green.** Neither source tests nor simulated browser traversals qualify as a successful independent novice teach-back.

## Forward-only audit priority

The learner is still studying PostgreSQL. Don't spend the next remediation cycle reopening PostgreSQL or previously read Python/Web API lessons. Continue through the remaining **Django & API Engineering** content in actual learner order, then **Identity, Authentication & Authorization**, **Software Craft**, and **Steward API v1**, followed by the subsequent schools.

This source change is **REMEDIATED / TECHNICAL CI PENDING / RENDERED REVIEW PENDING / NOVICE TRANSFER PENDING** until evidence is recorded. A proposed transfer is to add a `films` logger in an unrelated Django app, reproduce a duplicate via ancestor handlers, restore one output, and justify which request fields are safe to log without copying the example.
