# Quality Steward — End-to-End Curriculum Audit

Status: active regression checklist  
Canonical architecture contract: `docs/curriculum/quality-steward-repository-evolution.md`

## Audit purpose

This audit checks the complete Quality Steward path for prerequisite order, duplicate teaching, stale technology assumptions, concrete repository evolution and milestone value. A lesson should either establish a new concept/capability, apply an earlier policy at a new boundary, or produce evidence that advances `steward-tests` toward the final platform.

## Canonical progression

1. Quality Engineering — risk, strategy, testability and evidence.
2. Test Analysis and Design — derive coverage before automating.
3. Java for Test Framework Engineering — Java/JVM/Maven/JUnit execution backbone.
4. Unit and Component Testing — in-process Steward Python/Django tests.
5. API and Integration Testing — external Java/JUnit/REST Assured/Jackson/AssertJ platform.
6. Automation Framework Engineering — logging, evidence, Allure, failure taxonomy, retry/flake policy.
7. Browser and Environment Testing — Playwright Java and browser-specific evidence.
8. Reusable Test Infrastructure — audit, extract and publish `tsa-test-core` only after proven repetition.
9. Non-functional Quality — performance/accessibility/compatibility/integrity measurement.
10. Quality in Containers and CI — Testcontainers plus GitLab CI/CD orchestration.
11. Continuous and Scheduled Quality Execution — trigger/cadence policy and scheduled regression.
12. Steward Quality Platform — integrated final evidence and review.

## Resolved findings

### CI implementation
GitLab CI/CD is canonical. Jenkins-first and GitHub-Actions-first Quality Steward assumptions are removed. GitLab-specific concepts include runners/executors, `.gitlab-ci.yml`, jobs/stages, `rules`, `needs`, cache versus artifacts, variables/protected resources, environments, manual gates and scheduled pipelines.

### Unit/component ecosystem
Steward in-process unit/component tests remain Python/Django/pytest-oriented. The external automation platform remains Java. Earlier JUnit/Java resource/rendering leakage into this module was corrected.

### API example language
Python/Django-style authorization and database-assertion snippets accidentally rendered as Java were replaced with Java/REST-Assured-oriented examples.

### Reuse timing
Internal package compatibility for the future `tsa-test-core` is not taught as if the package already exists during early API foundations. The reusable-core boundary remains after browser evidence, followed by Maven/Nexus publication and later CI consumer compatibility.

### Framework versus CI responsibilities
Framework Engineering owns failure taxonomy, evidence identity, retry semantics, first-pass reliability and quarantine policy. GitLab CI applies/preserves those policies; it does not redefine them.

### Testcontainers and GitLab milestones
The controlled-integration and GitLab-pipeline milestones are included in the exported runtime lesson path. They prove the real runner/container boundary rather than existing only as unreachable declarations.

## Intentional reinforcement, not duplication

- Test design introduces pairwise selection; compatibility engineering later applies risk-based matrix reduction to supported technology combinations.
- Java concurrency establishes language/shared-state mechanics; browser and CI modules apply those mechanics to Page/BrowserContext/data isolation and parallel execution.
- Framework diagnostics define evidence/failure policy; browser, Testcontainers and GitLab add boundary-specific evidence.
- API virtualization introduces controlled remote failure; Non-functional Quality later measures state integrity and recovery through a bounded failure experiment.
- Maven/Nexus mechanics are learned before `tsa-test-core`; actual extraction/publication happens only after reuse is demonstrated.

## Repository-evolution checkpoints

### Increment 1 — Java foundation
No REST Assured, Playwright, speculative framework hierarchy, Spring-for-DI or `tsa-test-core`.

### Increment 2 — API foundation
REST Assured/Jackson/AssertJ and Steward-specific API clients/models/data. No browser or shared-core extraction.

### Increment 3 — framework operability
SLF4J, Allure/evidence, failure classification and governed retry/flake policy. No browser abstraction.

### Increment 4 — browser
Direct semantic locators first, explicit Playwright/Browser/BrowserContext/Page ownership, then smallest Page/Component abstractions after demonstrated repetition.

### Increment 5 — reuse boundary
Audit proven generic infrastructure. Steward-specific clients, DTOs, pages, workflows and assertions stay local. Deferred extraction is valid.

### Increment 6 — distribution
Versioned Maven JAR published to Nexus and consumed through an explicit dependency; no source-copy/local-path final integration.

### Increment 7 — GitLab CI/CD
Testcontainers-backed controlled integration, runner/runtime architecture, secure variables, cache/artifact separation, pipeline-source rules, evidence-preserving gates and scheduled regression.

### Increment 8 — final platform
Risk-to-evidence traceability across in-process, API, browser, controlled integration and selected non-functional evidence, with maintainable reuse and diagnosable GitLab execution.

## Regression checks for future edits

- Does a lesson introduce a dependency before the learner understands the problem it solves?
- Does it create `tsa-test-core` before cross-project reuse is demonstrated?
- Does it move Steward domain behavior into the generic core?
- Does a Python/Django example appear in a Java external-automation lesson or vice versa?
- Does CI redefine retry/flake/failure policy instead of consuming the framework policy?
- Does a browser test duplicate an API claim without unique browser evidence?
- Does a performance result omit workload/environment/release context?
- Does a Testcontainers test get confused with evidence against an already-deployed UAT environment?
- Does cache hold evidence that belongs in artifacts?
- Can a failed/aborted/skipped mandatory check disappear from release evidence?
- Can a secret reach logs, reports, traces or untrusted merge-request jobs?
- Is a milestone declared but missing from the exported runtime path?
- Does a new abstraction have demonstrated repetition or a clear boundary need?

## Remaining deliberate boundaries

Security testing here remains limited to quality evidence and safe negative behavior; threat modeling, application security architecture and security operations belong to Security Steward.

Reliability-oriented testing here proves bounded failure behavior and state integrity; SLOs, production telemetry, incident engineering, resilience architecture and broader fault experimentation belong to Reliability Engineer.

Performance work here establishes trustworthy workload/baseline evidence; production capacity planning and performance observability remain later operational disciplines.
