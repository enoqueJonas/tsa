# Quality Steward — Repository Evolution Contract

## Purpose

Quality Steward grows one real automation product: `steward-tests`. The learner must not generate a finished framework up front. Each increment introduces only the structure justified by concepts and repetition already experienced. Later refactoring is part of the learning.

This document is the implementation contract for Quality Steward lessons. If a lesson introduces a class, package, dependency or abstraction earlier than this progression allows, the lesson should be corrected or the contract deliberately revised.

## Architectural rules that apply throughout

- Java 17+ and Maven are the build/runtime foundation.
- JUnit 5 owns test discovery, lifecycle, parameterization, tags and extensions.
- REST Assured owns service/API HTTP automation after the raw-HTTP learning probe.
- Playwright Java owns browser automation.
- Jackson handles JSON/object mapping where typed contracts improve clarity.
- AssertJ provides expressive assertions.
- Allure provides human-readable execution evidence; logs and raw diagnostic artifacts remain available.
- Dependencies are explicit. Prefer constructor injection and composition.
- Do not introduce Spring solely to obtain dependency injection.
- Do not create a god `BaseTest`, global mutable client, global `Page`, or global `BrowserContext`.
- Steward-specific behavior remains in `steward-tests`; generic infrastructure may move to `tsa-test-core` only after proven repetition.
- Tests must remain readable as product behavior. Framework abstractions must not hide domain expectations.
- Parallel execution remains disabled until isolation and collision-safe data have been demonstrated.

---

# Increment 1 — Java Foundation

## Goal

Create the smallest credible Java test project and understand the mechanics that later libraries will abstract.

## Repository checkpoint

```text
steward-tests/
├── pom.xml
├── README.md
├── docs/
│   ├── architecture.md
│   └── tag-policy.md
└── src/
    └── test/
        ├── java/
        │   └── com/tsa/steward/
        │       ├── config/
        │       │   ├── Environment.java
        │       │   ├── TestSettings.java
        │       │   └── TestSettingsLoader.java
        │       ├── auth/
        │       │   └── TokenProvider.java
        │       ├── data/
        │       │   └── ServicePayload.java
        │       └── foundation/
        │           ├── HealthHttpClientTest.java
        │           └── JavaFoundationTest.java
        └── resources/
            └── junit-platform.properties
```

## Dependencies

Only dependencies justified by this checkpoint:
- JUnit Jupiter
- AssertJ if already introduced for readable Java assertions

Maven compiler and Surefire are configured explicitly.

## Required implementation

- `Environment` is an enum.
- `TestSettings` is immutable, preferably a record.
- `TestSettingsLoader` validates required configuration and fails fast.
- `TokenProvider` is an interface demonstrating dependency inversion.
- `ServicePayload` demonstrates immutable modeling.
- `HealthHttpClientTest` performs one intentionally small request with Java `HttpClient`.
- JUnit tags use a documented controlled vocabulary.

## Required evidence

- `mvn clean test` succeeds.
- A missing required configuration value produces an actionable failure.
- The learner can explain JVM/classpath/Maven/Surefire/JUnit responsibilities.
- The raw HTTP test demonstrates the transport ceremony later removed by REST Assured.

## Do not build yet

- REST Assured
- Playwright
- Page Objects
- Allure
- generic API client framework
- JUnit extensions merely for convenience
- parallel execution
- `tsa-test-core`
- Spring or another DI container

## Review gate

The learner must defend why constructor injection/composition is preferable to static global dependencies and why a `BaseTest` hierarchy is not needed.

---

# Increment 2 — API Foundation

## Goal

Replace repeated HTTP mechanics with REST Assured and grow a Steward-specific service-layer test system.

## Repository checkpoint

```text
steward-tests/
├── pom.xml
├── docs/
│   ├── architecture.md
│   └── tag-policy.md
└── src/test/
    ├── java/com/tsa/steward/
    │   ├── api/
    │   │   ├── StewardApiClient.java
    │   │   ├── ApiSpecifications.java
    │   │   └── model/
    │   │       ├── ServiceRequest.java
    │   │       └── ServiceResponse.java
    │   ├── auth/
    │   │   └── TokenProvider.java
    │   ├── config/
    │   │   ├── Environment.java
    │   │   ├── TestSettings.java
    │   │   └── TestSettingsLoader.java
    │   ├── data/
    │   │   └── ServiceDataBuilder.java
    │   └── tests/api/
    │       ├── HealthApiTest.java
    │       ├── ServiceRegistrationTest.java
    │       ├── ServiceLifecycleTest.java
    │       └── AuthorizationTest.java
    └── resources/
```

## New dependencies

- REST Assured
- Jackson Databind
- AssertJ if not already present

## Required implementation

Before abstraction:
- inspect real HTTP method/status/header/body semantics with the raw Java HTTP capability
- distinguish safe/idempotent operations and document retry/duplicate-delivery risk
- distinguish `Content-Type` from `Accept`
- capture sanitized correlation/request identity where available

Then introduce REST Assured:
- first write direct `given/when/then` tests so repetition is visible
- A minimal `RequestSpecification` centralizes transport defaults, not business assertions.
- `StewardApiClient` remains thin and Steward-specific and exposes product operations rather than a universal `execute(method,path,body)` API.
- Jackson records/DTOs represent selected stable contracts; dynamic/partial JSON may remain tree-based when that is clearer.
- Test-data builders expose meaningful defaults and unique identifiers.
- Caller identity is explicit for authorization scenarios through authentication abstractions; privileged tokens are never global defaults.
- REST Assured filters are limited to cross-cutting transport/evidence concerns and redact credentials.
- API tests assert semantic response/state behavior, not only status codes.

## Required evidence

- Raw `HttpClient` probe can be compared with its REST Assured replacement.
- Successful and rejected mutations are covered.
- Rejected mutations prove protected state remains unchanged.
- Retry/idempotency behavior is tested or its risk is explicitly documented for mutation endpoints.
- Denied mutations prove protected state remains unchanged.
- Repeated runs do not require manual cleanup.

## Do not build yet

- generic `ApiClient<T>` merely because generics exist
- browser automation
- Page Objects
- shared `tsa-test-core`
- parallel execution before isolation is proven
- business assertions inside `ApiSpecifications`

## Review gate

The learner must identify exactly which code is transport infrastructure and which code expresses Steward domain behavior.

---

# Increment 3 — Framework Consolidation

## Goal

Refactor demonstrated repetition into coherent infrastructure and improve diagnostics without turning the project into an abstraction exercise.

## Repository additions

```text
src/test/java/com/tsa/steward/
├── support/
│   ├── evidence/
│   │   ├── Evidence.java
│   │   └── AllureEvidence.java
│   ├── logging/
│   │   └── SafeTestLogger.java
│   └── junit/
│       └── TestContextExtension.java   # only if cross-cutting need is proven
└── tests/
    └── ...
```

## New capabilities

- SLF4J logging with secret redaction.
- Allure JUnit integration.
- Parameterized JUnit tests where scenarios share one rule.
- Controlled tag-based selection.
- Failure evidence includes environment/release/request identity.
- JUnit extension introduced only for genuinely cross-cutting lifecycle/context behavior.

## Required evidence

- Allure report from a real run.
- Controlled failing test demonstrates useful diagnostics.
- Secret/token values do not appear in logs or attachments.
- Parameterization improves clarity rather than compressing unrelated scenarios.

## Do not build yet

- browser abstraction
- `tsa-test-core`
- custom annotations unless a real repeated semantic need exists
- retries that convert first-attempt failures into invisible greens

## Review gate

Every framework abstraction must point to either repeated code, a safety requirement, or a diagnostic requirement that existed before the abstraction.

---

# Increment 4 — Browser Layer

## Goal

Add Playwright Java to the existing architecture without creating a separate UI framework.

## Repository additions

```text
src/test/java/com/tsa/steward/
├── ui/
│   ├── BrowserSession.java
│   ├── pages/
│   │   └── ServiceRegistryPage.java
│   └── components/
│       └── ... only when justified
└── tests/ui/
    ├── ServiceRegistrySmokeTest.java
    └── ServiceLifecycleUiTest.java
```

## New dependencies

- Playwright Java

## Required implementation

1. First write the unique browser-level claim; if API/component evidence can prove it more directly, do not create the browser test.
2. First browser flow uses Playwright locators directly.
3. `Playwright`/`Browser`/`BrowserContext`/`Page` ownership and cleanup are explicit; context is the default per-test session isolation boundary.
4. Semantic role/label/test-id locator policy is applied before structural selectors.
5. Playwright actionability/web-first assertions and observable application readiness replace arbitrary sleeps.
6. API helpers may create test preconditions where UI setup adds no evidence.
7. Authentication/storage-state reuse is deliberate, protected and never allowed to hide the login behavior when login itself is under test.
8. A second related flow creates actual repetition.
9. Only then extract the smallest useful Page/Component Object.
10. Trace, screenshot, console/network diagnostics are retained according to evidence policy and sanitized.
11. Parallel execution requires both BrowserContext isolation and collision-safe backend data; they are separate concerns.

## Required evidence

- Browser resources close after both pass and failure.
- The browser test proves behavior unique to the browser/user surface.
- API assertions have not been duplicated through the UI without justification.
- Page object extraction is supported by before/after repetition evidence.

## Do not build yet

- one Page Object per route by convention
- element getter libraries
- static global `Page`
- Selenium alongside Playwright without a specific compatibility requirement
- `tsa-test-core` extraction before the reuse audit

## Review gate

The learner must defend why each browser test belongs in a browser rather than at the API/component level.

---

# Increment 5 — Reuse Boundary Candidate

## Goal

Audit the now-real framework for infrastructure that is genuinely reusable across more than Steward.

## Candidate extraction

```text
tsa-test-core/
├── pom.xml
└── src/main/java/com/tsa/testcore/
    ├── config/
    ├── api/
    ├── browser/
    ├── evidence/
    ├── junit/
    └── data/
```

These package names are candidate capability boundaries, not a requirement to populate every directory.

## May move to tsa-test-core

Only proven generic infrastructure such as:
- configuration primitives
- generic REST Assured specification factories
- browser/context lifecycle foundations
- generic evidence/attachment helpers
- safe logging/redaction
- selected JUnit extensions
- generic unique-data utilities

## Must remain in steward-tests

- `StewardApiClient`
- Steward request/response models when they represent Steward contracts
- Steward page/component objects
- ownership/lifecycle/dependency workflows
- Steward-specific assertions
- product-specific test-data semantics

## Required evidence

- Written reuse-boundary decision for every extraction candidate.
- `tsa-test-core` has no dependency on Steward packages.
- Steward remains readable after extraction.
- Public API is intentionally small.
- Semantic versioning/compatibility policy is documented.

## Review gate

A helper being used twice inside Steward is not, by itself, proof that it belongs in a cross-project library.

---

# Increment 6 — Internal Distribution

## Goal

Do not create `tsa-test-core` yet. Record the candidate product-independent boundary and the evidence required from a genuine second consumer. Professional Engineer owns the later extraction gate; copied shared source remains prohibited.

## Required build

```text
tsa-test-core
   │
   ├── mvn test
   ├── mvn package
   └── mvn deploy
          │
          ▼
        Nexus
          │
          ▼
steward-tests pom.xml
   └── com.tsa:tsa-test-core:<version>
```

## Required evidence

- Proposed Maven coordinates, semantic-versioning policy and Nexus publication contract for the future library.
- Steward resolves the artifact through Maven.
- No source-copy or local-path final integration.
- Candidate upgrade is tested before promotion.
- Breaking/additive change policy is documented.

---

# Increment 7 — CI and Continuous Execution

## Goal

Make the quality platform reproducible, selective and operational.

## Repository additions

```text
steward-tests/
├── .gitlab-ci.yml
├── docker/
│   └── ... only required test dependencies
└── docs/
    ├── quality-gates.md
    ├── flake-policy.md
    └── execution-policy.md
```

## Required pipeline stages

1. compile/static validation
2. fast JUnit/API evidence
3. integration evidence
4. selected browser smoke
5. reports/diagnostic artifacts
6. tsa-test-core compatibility where relevant
7. scheduled broader regression

## Required controls

- governed JUnit tags
- immutable release/environment identity
- visible skipped/missing evidence
- first-attempt failure retention
- quarantine ownership/expiry policy
- parallelism only after isolation proof
- scheduled GitLab CI/CD regression with actionable notifications

## Review gate

A fast green pipeline is not successful if retries, skips or missing environments silently removed required evidence.

---

# Increment 8 — Quality Steward Milestone

## Deliverable

A defensible quality engineering platform, not merely a large automated suite.

The learner must demonstrate:
- risk-to-evidence traceability
- Java/Maven/JUnit engineering competence
- REST Assured service-layer architecture
- Playwright browser architecture
- deterministic data/lifecycle ownership
- useful diagnostics and Allure evidence
- controlled tags and execution portfolios
- safe parallelism or an explicit reason it remains disabled
- justified `tsa-test-core` candidate boundary with extraction explicitly deferred to the two-consumer gate
- Maven/Nexus dependency lifecycle
- GitLab CI/CD continuous/scheduled execution
- explicit unresolved risks that move to Security Steward or Reliability Engineer

## Final defense questions

1. Which framework abstractions were created only after repetition appeared?
2. Which code was deliberately kept Steward-specific?
3. What prevents a failed test from becoming an unexplained green result?
4. How are credentials and sensitive evidence protected?
5. How does a `tsa-test-core` change reach Steward safely?
6. What breaks if tests execute concurrently?
7. Why does each browser test require browser-level evidence?
8. Which quality risks remain outside automation, and why?

## Completion standard

The learner should be capable of starting a new enterprise Java automation project and making reasoned architecture choices rather than reproducing the TSA folder structure from memory.
