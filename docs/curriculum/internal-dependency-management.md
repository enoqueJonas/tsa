# Internal Dependency and Artifact Management

This document is part of the durable TSA curriculum specification.

## Why this capability belongs in TSA

Real engineering organizations frequently produce software that is consumed by other internal systems but should not be published to public package registries. Engineers therefore need to understand not only how to consume dependencies from PyPI or npm, but how to design, package, version, publish, secure, operate and govern internally owned dependencies and artifacts.

TSA will practice this as a cross-journey capability using the continuing Steward ecosystem rather than a disposable repository-manager demo.

## Continuing scenario

During Builder, the learner extracts a small genuinely reusable Python package from Steward API, provisionally named `steward-common`. It remains a normal locally consumed package at this stage. The purpose is to create a real producer/consumer dependency that later creates the need for internal distribution.

During Delivery Engineer, a second internal consumer needs the package. Copying source code between repositories is explicitly rejected. The learner deploys and operates an internal artifact repository in the homelab, with Sonatype Nexus Repository as the reference implementation unless a later curriculum decision selects an equivalent product.

The target flow is:

```text
Steward source repositories
        |
        v
CI -> test -> build -> version -> publish
                              |
                              v
                    Internal Repository
                    /        |         \
              private PyPI  npm     container
                    |        |          |
                    v        v          v
             internal apps  UI/libs  deployments
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

Planned lessons:
- Why organizations use internal artifact repositories
- Package registries vs artifact repositories
- Public vs private dependencies
- Repository manager architecture
- Hosted, proxy and group repository concepts
- Python/PyPI package distribution
- npm package distribution
- Container registries
- Deploying Nexus Repository in the homelab
- Authentication and permissions
- Publishing internal Python packages
- Consuming internal Python packages with pip
- Publishing internal npm packages
- Consuming internal npm packages with npm/pnpm
- Publishing Steward container images internally
- Proxying and caching public dependencies
- Internal package versioning
- Prerelease, snapshot and release concepts
- Artifact retention and cleanup
- Dependency provenance
- SBOM fundamentals
- Signing and provenance concepts
- Dependency, package and image scanning
- Lab: Build the Steward Internal Artifact Repository
- Lab: Publish and consume `steward-common` through CI

The Delivery Engineer milestone must demonstrate that internal artifacts are versioned and published by automation and that a separate consumer can resolve an approved version from the internal repository without copying source code.

## Later-school progression

### Cloud Engineer
Understand how an internal repository changes when hosted remotely: storage, TLS, DNS, backups, access boundaries, availability and cost. It does not need to be moved to cloud if the homelab remains the better engineering choice.

### Quality Steward
Test package compatibility and consumer contracts, verify package publishing in CI, and consider how dependency changes affect downstream systems.

### Security Steward
Secure repository access, credentials and CI publishing permissions; scan packages/images; reason about dependency confusion, malicious packages, provenance and software supply-chain attacks.

### Reliability Engineer
Monitor repository availability, storage growth, failed publishing/download operations and backup/restore. Treat the artifact repository as a real internal service on which delivery can depend.

### Architect
Reason about shared-library coupling, version compatibility, ownership boundaries and when a shared package is preferable to a service/API boundary.

### Technical Steward
Define approved-source policy, internal package ownership, version/lifecycle policy, retention, third-party dependency governance, end-of-life handling, provenance requirements and exception processes.

## Capability evidence

By the end of the journey, the learner should be able to demonstrate:
- design of an internal reusable package with a deliberate public API
- package build and semantic versioning
- operation of a private artifact/package repository
- hosted and proxied repositories
- authenticated publishing and consumption
- CI-driven package publication
- private PyPI consumption
- private npm/pnpm consumption
- internal container image storage
- artifact retention and backup thinking
- dependency provenance/SBOM awareness
- package and image scanning
- governance of internally and externally sourced dependencies

The goal is not to learn Nexus buttons. The goal is to understand the engineering system that allows an organization to own and distribute its software dependencies safely and repeatably.
