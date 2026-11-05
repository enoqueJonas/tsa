# Builder Software Craft — forward depth checkpoint (2026-11-05)

**PR:** #401, branch `curriculum/software-craft-observability-error-contracts`.

## Boundary

This remediation resumes immediately after the merged Identity, Authentication & Authorization module (PR #399). Earlier Builder lessons (Python, Web/API, PostgreSQL, Django/DRF and Identity) are retained. Software Craft keeps its **22 existing lessons and their activity IDs**, adds two narrowly scoped prerequisite lessons, and keeps the existing final review lab ID.

The original module already contained substantive local Git history, bisect, real merge conflict, refactoring/characterization, dependency, configuration, CI, review, documentation and performance exercises. A new broad rewrite would be misleading. This checkpoint instead fixes two actual learner-facing proof defects.

## Actual gaps and changes

1. **Logging mechanics before operational event design.** The original Useful Logging lesson taught an application event but did not first build a logger/handler/formatter mental model. New lesson `software-craft-python-logging-from-first-principles` proves two thresholds and one negative, explains propagation and explicitly avoids reconfiguring production loggers.
2. **Non-vacuous redaction evidence.** The old log example checked that a sample token was absent even though the sample token was not used as input. The strengthened exercise passes an unsafe `authorization` field in a source context, applies a deliberate allowlist for the logger, checks the emitted message and proves that a `repr(context)` mutant would leak the actual supplied token. The original caption and observable safe record output are preserved for legacy source-derived smoke tests.
3. **Error trust boundary before API error design.** New lesson `software-craft-failure-boundaries-and-public-error-contracts` distinguishes 400/401/403/404/409/500, defines a stable and restricted public shape, proves a SQL-secret-reflection mutant, and checks a concealed 404 equivalence.
4. **Carry pure reasoning into real HTTP.** The existing Designing Errors lesson now explicitly reuses the earlier **real signed Steward Django/PostgreSQL** contract lab. It teaches why checking a mapping table does not establish actual 401/403/404/409/200 behavior or fail-closed storage. An unexpected 500 sanitization test is not claimed without a separate private route.
5. **Independently executable practice.** Both new checkpoints have scenario, instructions, deliverables and verifiable pass criteria in `builder-software-craft-quality.ts`.

## Gates and nonclaims

- **Structural/source edits:** committed. Existing IDs intentionally preserved; two new three-activity lessons.
- **Published Python and negative mutants:** `scripts/check-builder-software-craft-logging-errors.mjs` runs the exact Python from three learner-visible snippets and rejects three deliberate bad implementations. The dedicated PR workflow also compiles TypeScript, executes the full curriculum smoke suite and builds TSA.
- **CI:** record a specific matching-head run only when it completes. An intermediate run exposed a pre-existing caption/output compatibility contract; that was repaired without discarding the stronger assertions.
- **Rendered learner browser and independent transfer:** not proven by source compilation or CI. Do not mark learner validated or close global remediation issues based on this checkpoint.
- **Production observability:** not claimed. The logger experiment is local Python with no proof of reverse-proxy/APM behavior, retention, authorization of log readers or cross-system redaction.
- **Production error safety:** not claimed. The source-derived example models public policy; separate HTTP probes verify known status families on the earlier Steward training registry. Unexpected 500 leakage needs a purposely failing private endpoint if it is to be claimed.

**Merge rule:** new PR stays draft until a matching-head CI run proves source-derived positive/negative Python, full smoke suite, TypeScript and application build. Preserve the distinct learner-validation gate even after a technical merge.
