# PED-014 — Real Django model exercise must be runnable and respect Steward lifecycle

**Scope:** Builder → Django and API Engineering → `Models and Domain Data` (after the independent Django model, migration, relationship and QuerySet prerequisites). This is a targeted follow-up to the forward-only audit: no changes to already-read Python, Web/API or PostgreSQL.

## Demonstrated defect

The `Models and Domain Data` reading contained **two** examples using `from .models import ...` as though those were executable in a top-level `python manage.py shell`. Without a package context, that relative import fails. The same example used `Service.Lifecycle.PRODUCTION` and saved a Service without a production Environment, silently violating Steward's published cross-table rule. Its caption claimed that the output selected *active* services even though the QuerySet filtered by lifecycle, not the separate `active` flag.

These are correctness failures, not wording issues. The lesson previously told the learner to copy code that either failed or taught an invalid domain example.

## Repair

The original `Models and Domain Data` lesson ID is retained. Its model inspection and query/validation examples are now complete, isolated-registry scripts. The first, `registry/inspect_models.py`, imports actual classes, reads `Model._meta.fields`, distinguishes the `uat` lifecycle from a `production` deployment kind and reports the schema fields without mutating rows. The second, `registry/models_lab.py`:

- uses `from registry.models import Team, Service` in the correctly initialized `tsa_steward_django_lab` shell;
- creates/reuses a uniquely named Workshop Team and UAT Service with `get_or_create`, without falsely claiming production readiness;
- selects the one known row using `select_related('owning_team')`, displays expected owner and `uat` lifecycle, and identifies the SQL JOIN;
- demonstrates a true `ValidationError` when a made-up lifecycle value passes through `full_clean()`, and explains that choices aren't automatically enforced on bare `save()`;
- explicitly differentiates the PostgreSQL-backed Steward registry from the independent local catalogue used for the prior QuerySet primers.

The source-derived `check-builder-django-live-lab.mjs` runs the exact read-only model inspection and runs the UAT model/validation example twice against the real migrated PostgreSQL-backed Django registry. It asserts stable output, correct actual field names, successful JOIN behavior, no duplicate Workshop Service and an actual invalid-lifecycle rejection. The example runs **after** the previous Steward fixture-specific tests so its new UAT row does not invalidate existing expected counts.

## Evidence and limits

- Source rewritten and exact integration assertions authored on this branch.
- Matching-head CI and rendered browser results must be checked before technical acceptance.
- No independent novice has been observed performing the exercise; **learner validated = NO**.
- This change does not claim that model field choices enforce business invariants below all direct SQL writers. Production readiness must be protected by the later transactional application commands and controlled database access.

## Next

After merging, finish the remaining Django & API Engineering readthrough and independent lab gates. Continue Identity/Auth, Software Craft, Steward milestone, then later schools in learner order. Do not reopen PostgreSQL merely because this Django example references its model.
