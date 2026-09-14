# Steward API — Product Vision and Evolution Map

## Purpose

This document defines how the **Steward API** grows throughout the Technical Stewardship Academy and what the learner must understand before each expansion.

The goal is not to hand the learner an enterprise system to copy. Steward evolves through credible engineering pressures so each new concern is understandable, testable and connected to a reason.

The canonical domain definition remains [`steward.md`](./steward.md). Requirement quality is governed by [`steward-requirement-authoring-standard.md`](./steward-requirement-authoring-standard.md).

## Learning contract

1. **The learner implements the system.** TSA supplies requirements, constraints, acceptance criteria and review questions, not a finished solution.
2. **Concepts precede implementation.** A technology is introduced only after the learner has enough foundation to reason about it.
3. **Scenario-forced learning, not tool-forced architecture.** TSA may deliberately evolve Steward into a credible situation in which a selected enterprise technology solves a real requirement. The scenario creates the pressure; the tool does not invent its own justification.
4. **One primary implementation per capability by default.** TSA does not permanently accumulate two CI systems, two brokers, two GitOps controllers or two API gateways merely for exposure.
5. **Alternatives are still learned.** Competing technologies are normally compared through architecture analysis, bounded experiments or documentation rather than duplicated production implementations.
6. **Migration/replacement is a first-class learning exercise.** When migration itself is the objective, TSA may require a temporary old-and-new coexistence, cutover, rollback and decommissioning exercise. Duplication must have an explicit migration purpose and end state.
7. **Learning implementation does not imply product permanence.** A technology deliberately implemented for learning may later be retained, simplified, replaced or removed when later evidence warrants it.
8. **The learner must explain the system end-to-end.** Domain, data flow, failure behaviour, ownership and trade-offs must remain understandable as the system grows.

## Technology introduction pattern

A major technology exercise should normally follow this sequence:

1. Establish the current simpler baseline.
2. Introduce a credible new organizational, scale, reliability, security or delivery pressure.
3. State the required outcome and constraints without pretending the technology is free.
4. Compare at least one credible alternative or the option to retain the current state.
5. Select TSA's primary implementation technology for the capability and explain the learning objective.
6. Implement a bounded vertical slice.
7. Break it deliberately and investigate its new failure modes.
8. Preserve evidence and record what responsibility the technology adds.
9. Later reassess whether it should remain in Steward.

This permits TSA to guarantee meaningful hands-on exposure while still teaching architectural judgment.

## Product destination

Steward is an internal Engineering Service Registry and Technology Stewardship platform. At maturity it should help an engineering organization understand service ownership, dependencies, environments, architecture decisions, risks, controls, technical debt, operational health and review history.

## Core domain

```text
User
 │
 └── Membership
       │
       ▼
      Team
       │
       └── owns
            │
            ▼
          Service
            │
            ├── Environment
            ├── ServiceDependency
            └── ServiceReview
```

Later schools may add TechnicalOwner, ArchitectureDecision, TechnologyRisk, Control, Exception, TechnicalDebtItem, OperationalObjective and IncidentReference when the product scenario calls for them.

## Version progression

### Steward v0 — Domain before framework

**School:** Engineering Apprentice / transition into Builder

Understand service ownership, users/teams/memberships, directional dependencies and domain rules before production framework code.

**Exit condition:** describe the first product version without referring to framework code.

### Steward v1 — Useful relational API

**School:** Builder

Build the first real Steward API using the curriculum's Python/Django/DRF/PostgreSQL constraints. Capabilities include users, teams, memberships, services, environments, dependencies, lightweight reviews, authentication, ownership authorization, relational queries, deliberate API failures, tests and API documentation.

Important product rules are explicit; the learner owns the relational design, rule placement, endpoint/resource organization, transaction reasoning and implementation structure.

**Deliberately excluded:** Redis, brokers, Kubernetes, microservices, centralized observability, SSO infrastructure and advanced governance.

**Exit condition:** draw the data model, trace requests end-to-end, explain business rules and diagnose failures without copied code.

### Steward v1.1 — System model plus deliberate distributed-pressure labs

**School:** System Thinker

First model the existing v1: context, actors, boundaries, responsibilities, data flows, failure modes, coupling and ADRs.

Then TSA deliberately introduces two bounded pressures after the simpler system is understood:

- a repeatedly queried catalogue path remains expensive after query/pagination/index work, creating a shared read-caching requirement;
- post-commit lifecycle side effects must survive slow/unavailable consumers without delaying the authoritative HTTP transaction, creating an asynchronous-delivery requirement.

TSA uses **Redis as the primary cache implementation** and **RabbitMQ as the primary broker implementation** so the learner gains hands-on experience with cache authority/staleness/invalidation and queue routing/acknowledgement/retry/idempotency/DLQ behavior. Alternatives such as database-only optimization or Kafka are compared but are not second permanent implementations.

These are learning-driven scenarios with explicit engineering pressures. The learner must still prove the simpler fixes were considered and understand the new failure cost.

**Exit condition:** explain the original architecture, the pressures that caused the distributed additions, their authority/failure boundaries, and the conditions under which either could later be removed.

### Steward v1.2 — Operable on a real machine

**School:** Platform Builder

Operate the actual accumulated Steward topology on Linux: process/service management, permissions, configuration, networking/firewalling, database operations, backup/restore and troubleshooting. Redis/RabbitMQ are operated only because System Thinker has already created their explicit learning scenarios.

**Exit condition:** deploy, inspect, stop/start, recover and troubleshoot the system without treating the OS as invisible.

### Steward v1.3 — Reproducible enterprise delivery

**School:** Delivery Engineer

Introduce containerization, reproducible builds, automated tests/gates, release identity, deployment automation and rollback.

TSA deliberately creates a shared-artifact/supply-chain requirement and uses **Nexus as the primary private artifact/dependency repository**. CI needs a durable enterprise implementation, so **Jenkins is the primary CI system**. GitHub Actions is used for comparison, not a duplicate mandatory production pipeline.

A later bounded **CI migration exercise** may migrate a representative pipeline between Jenkins and an alternative CI platform. The learning objective is migration planning: semantic equivalence, credentials, artifacts, cutover, rollback, coexistence window and decommissioning—not operating two permanent CI systems.

**Exit condition:** a fresh environment can build and deliver a known Steward version through a traceable automated path, and the learner understands the ownership added by Jenkins and Nexus.

### Steward v1.4 — Cloud and orchestrated runtime

**School:** Cloud Engineer

First make Steward reproducible in a budget-conscious cloud environment using IaC, DNS/TLS, explicit network boundaries, storage/backup, configuration/secrets and cost controls.

Then the curriculum deliberately evolves the runtime pressure: Steward now has multiple deployable workloads (API plus justified workers), needs health-based replacement, controlled rolling releases, environment-independent configuration, service discovery, horizontal replica management and a declarative desired-state runtime. A single-host/container-compose operating model is no longer sufficient for the learning scenario.

That pressure justifies **Kubernetes as the primary orchestration implementation**. The learner implements workloads, Services, probes, resources, configuration/secrets boundaries, RBAC and rollout/rollback behavior.

TSA then includes a bounded **Kubernetes → OpenShift migration/platform-delta exercise**. OpenShift is not deployed beside Kubernetes forever. The learner identifies what remains standard Kubernetes, what OpenShift adds, migrates a representative Steward workload, validates security/routing/operability, plans rollback and records the decommission/retention decision.

**Argo CD is the primary GitOps implementation** once declarative workload state exists. Alternative GitOps controllers are comparison subjects unless a migration exercise explicitly calls for them.

**Exit condition:** reproduce and operate Steward through declarative infrastructure/workload definitions, explain why orchestration became useful, and distinguish Kubernetes concepts from OpenShift platform additions.

### Steward v2 — Quality as an engineered capability

**School:** Quality Steward

Build a risk-based test portfolio around the now-distributed/deployed product: API integration, database/contract validation, authorization negatives, test data, containerized execution, CI reporting and performance investigation. A small Engineering Portal UI may be introduced through a real service-registry workflow, enabling browser automation without inventing a UI only for Playwright.

**Exit condition:** explain what each test layer protects and its remaining blind spots.

### Steward v2.1 — Security model and hardened boundaries

**School:** Security Steward

Threat-model the actual accumulated system and harden identity, authorization, secrets, dependencies/artifacts, containers/platform, API abuse boundaries and audit-relevant events.

TSA may deliberately introduce an organizational SSO/federated-identity requirement and use **Keycloak/OIDC as the primary identity implementation**. The scenario must explain why local application-managed authentication no longer satisfies the organization. Alternative IdPs are compared rather than simultaneously operated.

Likewise, an API-edge policy requirement may justify **Kong as the primary gateway** when centralized edge concerns genuinely exist. Steward retains domain authorization; the gateway must not become a duplicate business-policy engine.

**Exit condition:** demonstrate important controls and residual risk across the real trust boundaries.

### Steward v2.2 — Measurable and recoverable service

**School:** Reliability Engineer

Introduce structured/centralized logs, metrics, dashboards, useful tracing, SLIs/SLOs, actionable alerts, incident response, runbooks, capacity analysis, recovery objectives and controlled failure experiments.

TSA creates realistic operational questions that justify the selected observability stack. **Prometheus/Grafana are the primary metrics/dashboard implementation**; the chosen centralized logging and tracing backends are each single primary implementations. Alternatives are compared, not accumulated.

**Exit condition:** detect, diagnose, communicate and recover from realistic Steward failures using system evidence.

### Steward v3 — Architecture under evidence

**School:** Architect

Reassess the accumulated architecture. By now TSA has intentionally created enough pressure to give the learner real enterprise components to judge. Ask whether Redis, RabbitMQ, Kubernetes/OpenShift, Argo CD, Kong, Keycloak, Jenkins, Nexus and observability components still earn their complexity.

Architecture exercises may include **migration/replacement drills** where the educational objective is explicitly to move a capability safely: characterize current behavior, compare replacement, design compatibility, run bounded coexistence, cut over, prove rollback and decommission the superseded component.

A migration exercise must not leave both technologies as permanent architecture unless a separate requirement genuinely needs both.

A modular monolith remains valid. Microservices are introduced only through a deliberate scenario with multiple independently deployable/owned capabilities and a defensible reason for separate lifecycle—not merely because Kubernetes exists.

**Exit condition:** produce evidence-grounded retain/simplify/replace/remove decisions and safely execute at least one bounded architecture/platform migration exercise.

### Steward v4 — Technology stewardship platform

**School:** Technical Steward

Expand strongly into architecture decisions, technology risks, controls/evidence, standards, temporary exceptions, technical debt, lifecycle governance, engineering-health reviews, ownership review and dependency lifecycle.

Review the **actual accumulated Steward ecosystem**, including technologies deliberately introduced for learning and any that were later migrated or removed. Historical implementation does not make a component permanently mandatory. Governance must preserve accountable ownership and also make removal/simplification possible.

**Exit condition:** design governance that improves engineering outcomes and can defend technology lifecycle decisions without bureaucracy or tool permanence.

### Professional Engineer — Independence proof

Steward remains portfolio evidence, but the capstone is a second substantial system from a blank repository. This proves transfer rather than continued execution of curriculum-made decisions.

## Primary implementation and comparison map

| Capability | Primary Steward implementation | Alternative learning mode |
| --- | --- | --- |
| Relational persistence | PostgreSQL | compare data models where relevant |
| Shared read cache | Redis | database/query-only baseline; other caches conceptually |
| Async broker | RabbitMQ | Kafka comparison / architecture exercise |
| CI | Jenkins | GitHub Actions comparison; optional migration drill |
| Artifact/dependency repository | Nexus | repository-manager comparison |
| Container orchestration | Kubernetes | simpler host/Compose baseline |
| Enterprise Kubernetes platform | OpenShift migration exercise | managed/vanilla Kubernetes comparison |
| GitOps | Argo CD | alternative controller comparison |
| Identity/SSO | Keycloak/OIDC when SSO scenario enters | other IdP comparison |
| API gateway | Kong when edge-policy scenario enters | ingress/direct edge comparison |
| Metrics/dashboards | Prometheus/Grafana | alternative observability comparison |

This table defines curriculum exposure, not irreversible final architecture.

## Duplication rule

Two technologies that substantially provide the same capability may coexist only when at least one of these is true:

- they serve materially different requirements;
- a bounded comparison experiment requires temporary coexistence;
- a migration/replacement exercise requires an explicit transition window.

Every temporary duplication exercise must define its end state. "Keep both because we learned both" is not an acceptable architecture decision.

## Anti-overwhelm gate

Before a new Steward capability enters the project, TSA must answer:

1. What problem or deliberately constructed learning scenario creates the need?
2. Have prerequisite concepts already been taught?
3. What simpler baseline exists and why is it now insufficient for this scenario?
4. What is the primary technology and what capability does it own?
5. Which alternatives will be compared rather than permanently implemented?
6. Can it be introduced as a bounded vertical slice?
7. What failure cases must be investigated?
8. What design decisions remain with the learner?
9. What is explicitly out of scope?
10. What evidence proves understanding?
11. If this is a migration, what are coexistence, rollback and decommission conditions?

## Definition of understanding

Running software is insufficient. The learner must increasingly be able to state the requirement, model the relevant system, trace data, explain technology responsibility, reproduce failure, diagnose it, defend a trade-off, compare an alternative, and identify conditions for retention or removal.

## Curriculum authoring rule

Future Steward lessons and milestones must remain consistent with [`steward.md`](./steward.md), this evolution map and [`steward-requirement-authoring-standard.md`](./steward-requirement-authoring-standard.md).

TSA may intentionally create requirements to guarantee practical exposure to important enterprise technologies. It must create the requirement **before** treating the technology as justified, and it must not turn exposure into permanent redundant architecture.