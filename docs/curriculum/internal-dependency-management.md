# Internal Dependency and Artifact Management

This document is part of the durable TSA curriculum specification.

## Why this capability belongs in TSA

Real engineering organizations frequently produce software that is consumed by other internal systems but should not be published to public package registries. Engineers therefore need to understand not only how to consume dependencies from PyPI or npm, but how to design, package, version, publish, secure, operate and govern internally owned dependencies and artifacts.

TSA will practice this as a cross-journey capability using the continuing Steward ecosystem rather than a disposable repository-manager demo.

## Continuing scenario

During Builder, the learner audits Steward for a genuinely reusable Python-package boundary, provisionally named `steward-common`. The package is extracted only if more than one real consumer already demonstrates a stable domain-independent capability; otherwise Builder records the candidate/defer decision. The curriculum must not manufacture a shared library merely to create later artifact-management work.

During Delivery Engineer, Nexus is independently earned by immutable container distribution and is deployed/operated as the internal artifact repository. If `steward-common` has already earned extraction through real consumers, Delivery also publishes and consumes it through Nexus. Otherwise Python/npm package mechanics use explicitly labeled training fixtures without inventing permanent Steward architecture.

During Quality Steward, the same principle is applied to test engineering. The Steward automation framework is built first as a Java 17+ Maven project using JUnit 5, REST Assured and Playwright Java. Quality Steward identifies and documents candidate generic testing infrastructure, but keeps it inside `steward-tests`. Extraction into a reusable Maven library named `tsa-test-core` is deferred until Professional Engineer supplies a genuine second compatible test consumer. Steward-specific API clients, page/workflow objects and domain assertions always remain in the Steward test project.

The eventual end-of-journey flow becomes the following. `tsa-test-core` is shown only as the post-Professional-Engineer state after the genuine two-consumer gate has been satisfied:

```text
Application and test source repositories
        |
        v
CI -> test -> build -> version -> publish
                              |
                              v
                    Internal Maven Repository
                    /        |         \
              private PyPI  npm     container
                 /     \                |
                v       v               v
      steward-common  tsa-test-core  deployments
                |       |
                v       +--------------------+
         internal apps                       |
                                      Steward tests
                                             |
                                      future system tests
```

## Builder — evaluate an internal dependency boundary

Builder introduces the software-design side of the problem before repository infrastructure exists.

Add to Software Craft:
- reusable modules vs reusable packages
- package boundaries and public APIs
- avoiding accidental coupling
- semantic versioning for a library
- building/versioning a Python distribution package
- consuming a local/private Python package during development
- Lab: Audit the `steward-common` Boundary; extract only if the real-consumer gate is satisfied

Builder milestone evidence should include a small internal package only when the extracted behavior is genuinely reusable. The learner must not create a shared library merely to satisfy the curriculum.

If the package earns extraction, it is not yet published to Nexus. Builder establishes the justified boundary; Delivery Engineer later solves durable distribution and lifecycle management. If the gate is not met, the defer decision is the correct Builder outcome.

## Delivery Engineer — own the artifact platform

Expand the existing Artifact and Supply-Chain Foundations module into **Artifact, Dependency and Supply-Chain Management**.

Planned lessons include repository-manager architecture; hosted, proxy and group repositories; PyPI/npm/container distribution; Nexus in the homelab; authentication; internal publishing and consumption; proxying public dependencies; versioning; retention; provenance; SBOMs; signing; scanning; and CI-driven publication.

The Delivery Engineer milestone must demonstrate that internal artifacts are versioned and published by automation and that a separate consumer can resolve an approved version from the internal repository without copying source code.

## Quality Steward — build a reusable testing foundation

The learner must first build the Steward automation framework with its own configuration, fixtures, clients, helpers, assertions, evidence capture and reporting. Extraction happens only after the learner can identify infrastructure that is independent of Steward's domain and useful to another test project.

Add to Automation Framework Engineering:
- framework code vs domain-specific test code
- recognizing reusable testing infrastructure
- public APIs for test libraries
- reusable JUnit 5 extensions and test infrastructure
- reusable HTTP/client foundations
- shared assertions and evidence/reporting helpers
- versioning test infrastructure
- Lab: Audit the Candidate `tsa-test-core` Reuse Boundary
- Lab: Design the Future Maven/Nexus Publication and Compatibility Contract

Candidate `tsa-test-core` capabilities may include:
- validated environment/configuration loading
- generic REST Assured request/response specifications and transport helpers
- Playwright browser/context lifecycle foundations
- generic JUnit 5 extensions, tags and execution metadata
- Jackson serialization support and test-data foundations
- Allure attachments/evidence helpers and diagnostic capture
- logging and safe secret-redaction helpers

Steward domain clients, workflows, page/component models and business assertions stay outside the shared library.

A second real test project is a prerequisite for creating `tsa-test-core`, not merely a later validation. Professional Engineer deliberately provides that evidence when its independently designed system has overlapping product-independent test infrastructure. Only then does the learner extract, version, publish and consume the library from both projects.

Quality Steward must design the future compatibility/consumer contract and CI publication checks for `tsa-test-core`, but must not execute them against a fabricated library. It can exercise real package compatibility and publishing mechanics with internal artifacts that legitimately exist at this stage, such as `steward-common`, while reasoning about how a later shared test-library change would affect downstream suites.

## Later-school progression

### Cloud Engineer
Understand how an internal repository changes when hosted remotely: storage, TLS, DNS, backups, access boundaries, availability and cost. It does not need to be moved to cloud if the homelab remains the better engineering choice.

### Security Steward
Secure repository access, credentials and CI publishing permissions; scan application packages, test packages and images; reason about dependency confusion, malicious packages, provenance and software supply-chain attacks.

### Reliability Engineer
Monitor repository availability, storage growth, failed publishing/download operations and backup/restore. Treat the artifact repository as a real internal service on which both delivery and quality pipelines can depend.

### Architect
Reason about shared-library coupling, version compatibility, ownership boundaries and when a shared package is preferable to a service/API boundary. `steward-common` is implemented evidence only when its real-consumer gate previously earned extraction; otherwise use the recorded defer decision as architecture evidence. `tsa-test-core` remains a future candidate and must not be evaluated as an existing shared library before Professional Engineer earns its extraction gate.

### Technical Steward
Define approved-source policy, internal package ownership, version/lifecycle policy, retention, third-party dependency governance, end-of-life handling, provenance requirements and exception processes. Apply concrete governance to shared artifacts that actually exist, and define a conditional ownership/compatibility policy for `tsa-test-core` that activates only if Professional Engineer later earns its extraction gate.

### Professional Engineer
Use the independent capstone as a second real consumer of appropriate internal platform capabilities. Where justified, its automation project consumes an approved version of `tsa-test-core` from the internal repository and provides compatibility evidence. The capstone must remain independently designed; consuming a shared engineering foundation does not make it a clone of Steward.

## Capability evidence

By the end of the journey, the learner should be able to demonstrate:
- design of internal reusable application and testing packages with deliberate public APIs
- distinction between reusable infrastructure and domain-specific code
- package build and semantic versioning
- operation of a private artifact/package repository
- hosted and proxied repositories
- authenticated publishing and consumption
- CI-driven package publication
- private PyPI and npm/pnpm consumption
- internal container image storage
- multiple consumers of a shared internal testing foundation
- compatibility testing for internal package upgrades
- artifact retention and backup thinking
- dependency provenance/SBOM awareness
- package and image scanning
- governance of internally and externally sourced dependencies

The goal is not to learn Nexus buttons or to turn every helper into a package. The goal is to understand the engineering system that allows an organization to design, own, distribute, reuse and evolve software dependencies safely and repeatably.
