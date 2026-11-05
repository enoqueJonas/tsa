# PED-022 — Test Django startup configuration, not an unrelated parser

**Curriculum:** Builder → Django & API Engineering, immediately after generated OpenAPI/runtime validation and before the existing-ID `Configuration and Environments` lesson.

**Related:** [#321](https://github.com/enoqueJonas/tsa/issues/321), [#318](https://github.com/enoqueJonas/tsa/issues/318), [PED-021](ped-021-drf-generated-openapi-http-conformance.md).

## Defect

The original configuration lesson explained database and DEBUG risks correctly but its only runnable example parsed a standalone Python dict. A green printout did not prove that Django used the accepted values, rejected a dangerous database name, or stopped execution before an operation ran. The practical immediately asked for production-ready environment configuration rather than teaching real `config/settings.py` effects.

## Beginner-first repair

**New lesson:** `Make Django Refuse Unsafe Training Configuration`, before existing `Configuration and Environments`. The original ID and progression remain unchanged.

Uses the already-migrated `tsa-django-intro` Book project; no remote Postgres, Docker, new app or real credential.

1. `config/lab_guard.py`: `validated_lab_configuration(env, base_dir)` accepts only explicit training mode `local`, filename `db.sqlite3` resolved under the current Django project, strict lower-case `true/false`, local-only hosts `testserver,localhost,127.0.0.1`, and a nonempty sufficiently long secret. The key is never included in an exception or log. This is an **opt-in local exercise guard**, not a production security implementation.
2. Append a small block to `config/settings.py`, activated by `TSA_VALIDATE_TRAINING_SETTINGS=1`. It sets the actual Django `DATABASES`, `DEBUG`, `ALLOWED_HOSTS` and `SECRET_KEY` from the validated result; it does not destroy existing DRF exception/schema configuration.
3. `catalogue/settings_startup_lab.py`: a real `subprocess.run` harness executes **new Django interpreters**. Valid settings lead to the actual local migrated SQLite database and a Book count. Five invalid environments fail Django startup before a deliberately supplied `shell -c` sentinel body can execute: wrong database target `bank_production`, invalid mixed-case DEBUG, wildcard hostname, nonlocal mode, and empty key. It checks expected safe error messages, the generated in-memory key absent from stderr, no sentinel, no `bank_production` file and unchanged database rows.
4. An explicit command sequence `python manage.py check` and `python manage.py shell -c "exec(open('catalogue/settings_startup_lab.py').read())"` demonstrates how Django imports settings and where it exits.

## Assumptions and limits

This lab validates the local SQLite path under the actual Django settings and proves invalid input fails before one controlled shell operation. It is intentionally **not** a production configuration guard and the opt-in condition must not be copied as a production safety assurance. Real deployment will need unconditional safety rules, protected database credentials, secured hosts/TLS, CSRF/cookies/proxies, logging, secrets provisioning and object-level authorization. The later applied `Configuration and Environments` practical remains the design exercise for those concerns.

## References and evidence

- [Django settings](https://docs.djangoproject.com/en/5.2/topics/settings/), [deployment checklist](https://docs.djangoproject.com/en/5.2/howto/deployment/checklist/), [Python subprocess](https://docs.python.org/3/library/subprocess.html).
- Exact learner source in `packages/runtime-kernel/src/paths/builder-django-rich.ts`; practical override in `builder-django-quality.ts`.
- `scripts/check-builder-django-live-lab.mjs` extracts the published settings/guard/test and executes them in the same migrated, previously used scratch catalogue in CI.
- **Technical verification** requires matching-head full CI with real Django subprocess positive/negative tests.
- **Uncoached novice comprehension, manual rendered-depth review and saved-progress re-entry** remain unverified by automated passing jobs.

**Next:** Review and strengthen applied Configuration & Environments only where necessary, then integrated Django/Steward lab, Identity/Authorization, Software Craft and other Builder lessons. Keep #321 open until learner-validated.
