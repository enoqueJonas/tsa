# Quality Steward — Learning Resource Audit

Status: canonical resource-selection policy

## Purpose

Quality Steward resources should help the learner continue exactly the concept taught by the lesson. A module-wide list repeated on every lesson is not sufficient merely because every link is technically relevant somewhere in the module.

## Selection policy

1. Prefer primary official documentation for tool/framework mechanics.
2. Use secondary conceptual sources only when they explain a design distinction better than API/reference documentation.
3. Target two to four resources for a lesson when possible.
4. Do not attach a tool merely because it appears elsewhere in the same module.
5. Keep prerequisite material earlier in the journey instead of compensating with large resource bundles later.
6. A resource must support the current lesson boundary, not a future architecture.
7. Videos remain governed by the multimedia audit and are additive; they do not replace authoritative reference documentation.

## Implemented routing

### Java / Maven / JUnit
- JVM/language concepts → dev.java
- Maven lifecycle/plugins → Maven lifecycle and plugin guides
- dependency resolution/scopes → Maven dependency mechanism
- JUnit mechanics → JUnit user guide
- parameterized tests → JUnit parameterized-test section
- extensions/annotation framework use → JUnit extension model
- concurrency → Java concurrency plus JUnit where test lifecycle matters

### Django unit/component testing
- test design/feedback → Software Engineering at Google plus Django testing
- Django isolation/database behavior → Django testing/test-database docs
- doubles/mocks → Mocks Aren't Stubs plus pytest fixtures
- general execution → Django/pytest primary docs

### API/integration
- HTTP semantics → MDN HTTP plus REST Assured
- REST Assured DSL/specs/filters/clients/auth → REST Assured plus JUnit where appropriate
- Jackson mapping → Jackson Databind
- schema validation → JSON Schema
- assertions/database evidence → JUnit/AssertJ
- consumer contract concepts → Pact only where contract testing is actually taught

### Framework operability
- logging → SLF4J
- Allure integration/evidence → Allure JUnit 5 and attachments docs
- artifact policy → Allure attachments plus Playwright where browser evidence matters
- retry/flake policy → JUnit/framework behavior rather than unrelated browser/API docs
- architecture → the actual JUnit/REST Assured/Playwright components being composed

### Playwright/browser
- runtime/isolation/parallel ownership → browser contexts
- locators/page abstractions → locator docs
- waiting → actionability
- navigation/network → navigation docs
- auth/storage → authentication + contexts
- frames/popups/downloads → their dedicated Playwright pages
- diagnostics → Trace Viewer
- responsive design → MDN responsive design
- cross-browser/remote execution → browser docs plus BrowserStack only where that boundary is taught

### Non-functional quality
- workload models/scenarios → k6 scenarios/executors/open-vs-closed docs
- checks/thresholds → k6 threshold docs
- accessibility evaluation → W3C WAI evaluation/WCAG/keyboard guidance
- browser compatibility → MDN compatibility data
- transaction/concurrency evidence → PostgreSQL isolation docs

### Testcontainers / GitLab CI/CD
- lifecycle/readiness → Testcontainers JUnit/wait strategy docs
- database containers → PostgreSQL module
- networking → Testcontainers networking
- runners/runtime → GitLab runner docs plus Testcontainers/Docker when relevant
- rules/DAG → GitLab rules and needs
- cache/artifacts → GitLab caching/artifact guidance
- CI security → GitLab variables/runners
- environments/gates → GitLab environments

## Intentional small generic bundles

Continuous/Scheduled Execution keeps a small GitLab CI + scheduled-pipelines + JUnit set because its lessons share one narrow execution-cadence boundary.

Reusable Test Infrastructure keeps Maven + JUnit because its activities are practical architecture milestones around Java package extraction/publication; Nexus-specific concepts are already established by the internal-dependency curriculum and repository-evolution contract.

## Regression checks

- Is the same three-to-five-link bundle being repeated across unrelated lesson IDs?
- Does the first resource directly explain the lesson's main mechanism?
- Is an official source available but replaced by a generic blog/vendor marketing guide?
- Is a secondary source included because it adds a useful mental model rather than because it ranks well in search?
- Does a lesson link to technology that is not used at that point in repository evolution?
- Would removing one resource make the set more focused without losing necessary depth?
- Are resource URLs and titles still valid when the module is substantially edited?
