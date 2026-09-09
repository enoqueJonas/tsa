# Internal Dependency and Artifact Management

This document is part of the durable TSA curriculum specification.

## Why this capability belongs in TSA

Real engineering organizations frequently produce software that is consumed by other internal systems but should not be published to public package registries. Engineers therefore need to understand not only how to consume dependencies from PyPI or npm, but how to design, package, version, publish, secure, operate and govern internally owned dependencies and artifacts.

TSA will practice this as a cross-journey capability using the continuing Steward ecosystem rather than a disposable repository-manager demo.

## Continuing scenario

During Builder, the learner extracts a small genuinely reusable Python package from Steward API, provisionally named `steward-common`. It remains a normal locally consumed package at this stage. The purpose is to create a real producer/consumer dependency that later creates the need for internal distribution.

During Delivery Engineer, a second internal consumer needs the package. Copying source code between repositories is explicitly rejected. The learner deploys and operates an internal artifact repository in the homelab, with Sonatype Nexus Repository as the reference implementation unless a later curriculum decision selects an equivalent product.

During Quality Steward, the same principle is applied to test engineering. The Steward automation framework is built first as a coherent project. Only after generic testing infrastructure has demonstrated a legitimate reuse boundary does the learner extract a reusable internal testing package, provisionally named `tsa-test-core`. Steward-specific domain helpers remain in the Steward test project.

The target flow becomes:

```text
Application and test source repositories
        |
        v
CI -> test -> build -> version -> publish
                              |
                              v
                    Internal Repository
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

## Builder — create an internal dependency

Builder introduces the software-design side of the problem before repository infrastructure exists.

Add to Software Craft:
- reusable modules vs reusable packages
- package boundaries and public APIs
- avoiding accidental coupling
- semantic versioning for a library
- building a Python distribution
- consuming a local/private source package during development
- Lab: Extract `steward-common` from Steward API

Builder milestone evidence should include a small internal package only when the extracted behavior is genuinely reusable. The learner must not create a shared library merely to satisfy the curriculum.

The package is not yet published to Nexus. Builder establishes the dependency and the design problem; Delivery Engineer solves distribution and lifecycle management.

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
- reusable pytest fixtures and plugins
- reusable HTTP/client foundations
- shared assertions and evidence/reporting helpers
- versioning test infrastructure
- Lab: Extract `tsa-test-core`
- Lab: Publish and Consume `tsa-test-core` from the Internal Repository

Candidate `tsa-test-core` capabilities may include:
- environment/configuration loading
- generic HTTP client foundations
- retry/wait utilities where justified
- common assertions
- structured test logging
- test metadata and evidence capture
- reporting helpers
- genuinely generic pytest fixtures/plugins

Steward-specific operations such as `create_steward_user`, Steward domain clients, Steward page objects and business assertions must remain in the Steward automation project unless later evidence proves a broader reuse boundary.

A second test project must eventually consume `tsa-test-core`. The Professional Engineer capstone is a strong candidate. This provides evidence that the package is actually reusable rather than an artificial curriculum extraction.

Quality Steward must also test package compatibility and consumer contracts, verify package publishing in CI, and reason about how dependency changes affect downstream test suites.

## Later-school progression

### Cloud Engineer
Understand how an internal repository changes when hosted remotely: storage, TLS, DNS, backups, access boundaries, availability and cost. It does not need to be moved to cloud if the homelab remains the better engineering choice.

### Security Steward
Secure repository access, credentials and CI publishing permissions; scan application packages, test packages and images; reason about dependency confusion, malicious packages, provenance and software supply-chain attacks.

### Reliability Engineer
Monitor repository availability, storage growth, failed publishing/download operations and backup/restore. Treat the artifact repository as a real internal service on which both delivery and quality pipelines can depend.

### Architect
Reason about shared-library coupling, version compatibility, ownership boundaries and when a shared package is preferable to a service/API boundary. Evaluate whether `tsa-test-core` remains cohesive as additional consumers appear.

### Technical Steward
Define approved-source policy, internal package ownership, version/lifecycle policy, retention, third-party dependency governance, end-of-life handling, provenance requirements and exception processes. Include ownership and compatibility policy for shared engineering libraries such as `tsa-test-core`.

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
