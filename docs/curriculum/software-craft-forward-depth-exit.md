# Builder Software Craft — forward depth checkpoint (2026-11-05)

**PR:** #401, branch `curriculum/software-craft-observability-error-contracts`.

## Boundary

This remediation resumes immediately after the merged Identity, Authentication & Authorization module (PR #399). Earlier Builder lessons (Python, Web/API, PostgreSQL, Django/DRF and Identity) are retained. Software Craft keeps its **22 existing lessons and their activity IDs**, adds four narrowly scoped lessons, and keeps the existing final review lab ID.

The original module already contained substantive local Git history, bisect, real merge conflict, refactoring/characterization, dependency, configuration, CI, review, documentation and performance exercises. A new broad rewrite would be misleading. This checkpoint fixes observable logging and dependency-proof defects and divides documentation and error boundaries into distinct teachable units.

## Actual gaps and changes

1. **Logging mechanics before operational event design.** The original Useful Logging lesson taught an application event but did not first build a logger/handler/formatter mental model. New lesson `software-craft-python-logging-from-first-principles` proves two thresholds and one negative, explains propagation and explicitly avoids reconfiguring production loggers.
2. **Non-vacuous redaction evidence.** The old log example checked that a sample token was absent even though the sample token was not used as input. The strengthened exercise passes an unsafe `authorization` field in a source context, applies a deliberate allowlist for the logger, checks the emitted message and proves that a `repr(context)` mutant would leak the actual supplied token. The original caption and observable safe record output are preserved for legacy source-derived smoke tests.
3. **Error trust boundary before API error design.** New lesson `software-craft-failure-boundaries-and-public-error-contracts` distinguishes 400/401/403/404/409/500, defines a stable and restricted public shape, proves a SQL-secret-reflection mutant, and checks a concealed 404 equivalence.
4. **Carry pure reasoning into real HTTP.** The existing Designing Errors lesson now explicitly reuses the earlier **real signed Steward Django/PostgreSQL** contract lab. It teaches why checking a mapping table does not establish actual 401/403/404/409/200 behavior or fail-closed storage. An unexpected 500 sanitization test is not claimed without a separate private route.
5. **Dependency declaration versus installed state.** The existing Managing Dependencies reading now runs a Python 3.11+ offline `ast`/`tomllib` experiment. It identifies directly imported `rich` missing from a PEP 621 manifest, models the correction, and catches a deliberately removed PyYAML declaration. It explicitly does not claim full PEP 508 resolution, dynamic-import tracing, installation, license or CVE assessment.
6. **Architecture Decision Records.** A separate lesson uses the training SQL-versus-Django database isolation choice to teach context, credible alternatives, consequences, falsifiable validation and supersession. The worked ADR is a training example and not a production approval.
7. **Operational Runbooks and Safe Diagnostic Handoffs.** A separate lesson teaches read-only Django checks, classification of 401/403/404/409/5xx, no-secret evidence, mandatory stop conditions and escalation. No production remediation is authorized by the text.
8. **Independent practice.** All four new lessons have scenario, instructions, deliverables and verifiable pass criteria in `builder-software-craft-quality.ts`.

## Gates and nonclaims

- **Structural/source edits:** committed. Existing IDs intentionally preserved; **four new three-activity lessons (26 authored lessons in total)**.
- **Published Python and negative mutants:** `scripts/check-builder-software-craft-logging-errors.mjs` runs the exact Python from four learner-visible snippets and rejects four deliberate bad implementations. The dedicated PR workflow also compiles TypeScript, executes the full curriculum smoke suite and builds TSA.
- **CI:** record a specific matching-head run only when it completes. An intermediate run exposed a pre-existing caption/output compatibility contract; that was repaired without discarding the stronger assertions.
- **Rendered browser:** `scripts/check-builder-software-craft-browser.py` now targets the seven modified/new reading surfaces, copyable source, 390px overflow and reading-to-practical scroll reset in a disposable Chromium learner profile. Its CI result must be checked separately before reporting the gate as passed.
- **Independent learner competence:** the synthetic browser and source harness do **not** establish it. Do not mark learner validated or close global remediation issues on their basis.
- **Production observability:** not claimed. The logger experiment is local Python with no proof of reverse-proxy/APM behavior, retention, authorization of log readers or cross-system redaction.
- **Production error safety:** not claimed. The source-derived example models public policy; separate HTTP probes verify known status families on the earlier Steward training registry. Unexpected 500 leakage needs a purposely failing private endpoint if it is to be claimed.

**Merge rule:** new PR stays draft until a matching-head CI run proves source-derived positive/negative Python, full smoke suite, TypeScript, application build, browser rendering and structural audit. Preserve the distinct learner-validation gate even after a technical merge.
