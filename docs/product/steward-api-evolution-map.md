# Steward API — Product Vision and Evolution Map

## Purpose

This document defines how the **Steward API** grows throughout the Technical Stewardship Academy and, equally importantly, what the learner is expected to understand before each expansion.

The goal is not to hand the learner an enterprise system to copy. The goal is to evolve one credible product slowly enough that each new concern is understandable, testable and justified by the concepts already learned.

The canonical domain definition remains [`steward.md`](./steward.md). This document is the implementation and learning progression for that product.

## Learning contract

The Steward API follows five rules throughout TSA:

1. **The learner implements the system.** TSA provides requirements, constraints, acceptance criteria, architecture questions and review criteria; it does not turn the project into a copy-and-paste tutorial.
2. **Capabilities are introduced only after their concepts are taught.** Authentication, containers, CI/CD, observability, governance and other concerns must not appear simply because they are common in enterprise systems.
3. **Every addition must solve a real product or engineering problem.** No technology is added merely to put it on a CV.
4. **The learner must be able to explain the current system end-to-end.** If a capability cannot be explained in terms of domain, data flow, failure behaviour and trade-offs, the system has grown too quickly.
5. **Architecture may change when evidence justifies it.** The initial architecture is not sacred. Premature complexity is not a graduation requirement.

## Product destination

Steward is an internal Engineering Service Registry and Technology Stewardship platform.

At maturity, it should help an engineering organization answer questions such as:

- What technical systems and services do we own?
- Which team and technical owner are accountable for each one?
- What does a service depend on, and what depends on it?
- Where does it run and what lifecycle state is it in?
- What architecture decisions affect it?
- What technical risks, debt, exceptions and controls exist?
- Is the service healthy, supportable and compliant with engineering standards?
- When was it last reviewed, and what actions remain open?

The final product direction is intentionally broad enough to support enterprise engineering concerns, but the learner reaches it through small, understandable versions.

## Core domain

The initial domain remains deliberately compact:

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

Later schools may add concepts such as TechnicalOwner, ArchitectureDecision, TechnologyRisk, Control, Exception, TechnicalDebtItem, OperationalObjective and IncidentReference, but only when those concepts have a genuine place in the curriculum and product.

## Version progression

### Steward v0 — Domain before framework

**School:** Engineering Apprentice / transition into Builder

No production application is required yet. The learner should understand the problem before implementing it.

The learner should be able to explain:

- what a technical service is in the Steward domain;
- why ownership matters;
- the difference between a User, Team and Membership;
- why Team ownership is different from individual technical accountability;
- why a service dependency is directional;
- which rules belong to the domain rather than the HTTP layer.

**Exit condition:** the learner can describe the first product version without referring to framework code.

---

### Steward v1 — Useful relational API

**School:** Builder

This is the first real implementation.

#### Capabilities

- users;
- teams;
- team memberships;
- services;
- environments;
- service dependencies;
- lightweight service reviews;
- authentication;
- authorization based on membership and ownership;
- filtering and relational queries;
- PostgreSQL persistence;
- REST API behaviour;
- validation and useful error responses;
- automated unit/API tests;
- API documentation.

#### Example product stories

- Register a technical service and assign it to an owning team.
- Add development, UAT and production environments to a service.
- Record that Payments API depends on Authentication Service.
- Prevent a service from depending on itself.
- Prevent duplicate dependencies.
- Prevent unauthorized users from changing another team's service.
- List high-criticality production services owned by a team.
- Record an engineering review without overwriting previous review history.

#### What is deliberately excluded

- microservices;
- Redis;
- message brokers;
- Kubernetes;
- advanced governance workflows;
- centralized logging platforms;
- SSO/OIDC infrastructure;
- complex event-driven architecture;
- a large frontend application.

#### Learner must be able to explain

- the database relationships and constraints;
- where business rules are enforced and why;
- serializer/request validation versus domain validation;
- authentication versus authorization;
- object-level authorization;
- transaction boundaries for multi-record changes;
- HTTP status choices;
- why each endpoint exists;
- important ORM queries and their SQL consequences;
- how the tests prove important rules rather than merely increase coverage.

**Exit condition:** the learner can draw the v1 data model, trace a request from HTTP to database and back, explain the main business rules, and debug a failing request without relying on copied code.

---

### Steward v1.1 — System model and explicit decisions

**School:** System Thinker

The goal is not feature growth. The existing system becomes something the learner can reason about structurally.

#### Work introduced

- system context diagram;
- actors and external dependencies;
- component and responsibility boundaries;
- request/data-flow diagrams;
- failure-mode analysis;
- explicit architecture decision records;
- data ownership decisions;
- dependency analysis;
- identification of coupling and accidental complexity.

Possible product changes are allowed only when the analysis reveals a real design problem.

**Exit condition:** the learner can explain not only how Steward works, but why its boundaries and dependencies look the way they do.

---

### Steward v1.2 — Operable on a real machine

**School:** Platform Builder

Steward leaves the developer laptop abstraction and becomes software that must be operated.

#### Work introduced

- Linux runtime host;
- process and service management;
- filesystem and permission decisions;
- environment configuration;
- database operation basics;
- network exposure and firewall reasoning;
- backup and restore exercises;
- operational troubleshooting using Linux tools.

**Exit condition:** the learner can deploy, start, stop, inspect and troubleshoot Steward on a Linux host without treating the operating system as invisible infrastructure.

---

### Steward v1.3 — Reproducible delivery

**School:** Delivery Engineer

#### Work introduced

- containerization;
- reproducible builds;
- CI quality gates;
- automated tests in pipeline;
- artifact/version management;
- internal package/repository usage where justified;
- deployment automation;
- release/versioning strategy;
- rollback reasoning.

A private artifact platform such as Nexus becomes meaningful here because Steward now has a delivery and dependency-supply-chain problem to solve.

**Exit condition:** a fresh environment can build and deliver a known Steward version through a documented automated path.

---

### Steward v1.4 — Internet-accessible environment

**School:** Cloud Engineer

#### Work introduced

- infrastructure as code;
- DNS;
- TLS;
- network/security boundaries;
- managed versus self-managed infrastructure decisions;
- persistent storage and backup strategy;
- secrets/configuration handling appropriate to the current maturity;
- explicit cost estimates and cost controls;
- recovery from infrastructure replacement.

The goal is not to use every cloud service. The learner should know what is being paid for, what can fail, and how the application reaches the database and the internet.

**Exit condition:** Steward can be reproduced in a budget-conscious cloud environment from documented infrastructure and deployment definitions.

---

### Steward v2 — Quality as an engineered capability

**School:** Quality Steward

The application is now substantial enough to justify a dedicated quality strategy.

#### Work introduced

- risk-based test strategy;
- test pyramid/portfolio decisions based on actual risks;
- API integration suites;
- database and contract validation;
- negative-path and authorization testing;
- test-data strategy;
- containerized test execution;
- CI quality reporting;
- performance testing when justified by explicit behaviour;
- a small Engineering Portal UI if a browser surface is useful to the product;
- Playwright/browser automation only after that UI exists.

The frontend must not be invented merely to create a Playwright exercise. It should expose useful service-registry workflows.

**Exit condition:** the learner can explain what is tested, what is intentionally not tested at each layer, the risks covered, and the remaining blind spots.

---

### Steward v2.1 — Security model and hardened boundaries

**School:** Security Steward

#### Work introduced

- formal threat model;
- stronger identity and session/token design;
- object-level access-control testing;
- secure secret handling;
- dependency and artifact security;
- container/runtime hardening;
- secure headers and API protections where relevant;
- abuse cases and rate-limiting decisions;
- vulnerability-management workflow;
- audit-relevant security events.

OIDC/Keycloak may be introduced only when the identity problem justifies it. It is not mandatory merely because enterprise systems commonly use SSO.

**Exit condition:** the learner can identify trust boundaries, articulate major threats, demonstrate important controls and explain residual risk.

---

### Steward v2.2 — Measurable and recoverable service

**School:** Reliability Engineer

#### Work introduced

- structured production logs;
- centralized logging platform;
- application and infrastructure metrics;
- dashboards;
- tracing where useful;
- SLIs and SLOs;
- actionable alerts;
- incident response;
- runbooks;
- capacity and performance analysis;
- backup/recovery objectives;
- fault-injection or controlled failure experiments;
- post-incident learning.

Prometheus/Grafana and the chosen logging/tracing technologies enter because the learner now has reliability questions to answer, not because observability tooling belongs on a checklist.

**Exit condition:** the learner can detect, diagnose, communicate and recover from realistic Steward failures using evidence produced by the system.

---

### Steward v3 — Architecture under evidence

**School:** Architect

This is a deliberate reassessment point.

#### Questions to answer

- Is the modular structure still appropriate?
- Which boundaries are genuine domain boundaries versus folder boundaries?
- Are synchronous integrations still appropriate?
- Is any shared component becoming an independent platform capability?
- Is the current database ownership model still sound?
- Where are scalability limits actually visible?
- Which resilience techniques are justified by observed failure modes?
- Would messaging solve a demonstrated problem or merely introduce distributed complexity?

A modular monolith is a valid final answer. Microservices are permitted only when the learner can justify the operational and organizational cost.

**Exit condition:** the learner produces architecture decisions grounded in accumulated product, delivery, quality, security and reliability evidence.

---

### Steward v4 — Technology stewardship platform

**School:** Technical Steward

Only here does Steward expand strongly into governance.

#### Natural capabilities

- architecture decisions linked to services;
- technology risks and risk ownership;
- engineering controls and evidence;
- standards and policy checks;
- temporary exceptions with owners and expiry dates;
- technical debt registers;
- service lifecycle governance;
- engineering-health reviews;
- ownership-review cadence;
- third-party/dependency lifecycle concerns;
- audit/history of important governance decisions.

The learner should distinguish governance from bureaucracy. Every control, review or approval must protect a stated engineering, operational, security or regulatory objective.

**Exit condition:** the learner can design governance that improves engineering outcomes while preserving clear accountability and proportionate controls.

---

### Professional Engineer — Independence proof

Steward remains a significant portfolio system and a source of architectural evidence, but the learner must **not** simply keep extending Steward for the capstone.

The Professional Engineer stage requires a second substantial system from a blank repository. This proves that the learner can transfer the capabilities learned through Steward to a new domain without the curriculum already having made the core decisions.

## Capability-to-school map

| Capability | First introduced | Expected maturity later |
| --- | --- | --- |
| Domain model and business rules | Builder | Architect / Technical Steward |
| PostgreSQL and relational modelling | Builder | Reliability / Architect |
| REST API | Builder | Quality / Security |
| Authentication and basic authorization | Builder | Security Steward |
| Architecture decisions | System Thinker | Architect / Technical Steward |
| Linux operation | Platform Builder | Reliability Engineer |
| Containers | Delivery Engineer | Security / Reliability |
| CI/CD | Delivery Engineer | Quality / Security |
| Private artifact/dependency repository | Delivery Engineer | Security / Technical Steward |
| Cloud/IaC/DNS/TLS | Cloud Engineer | Security / Reliability |
| Browser UI | Quality Steward, if product-justified | Security / Reliability |
| Test automation platform | Quality Steward | Delivery / Reliability |
| Threat modelling and hardening | Security Steward | Technical Steward |
| Metrics/logs/tracing | Reliability Engineer | Architect |
| SLOs/alerts/incidents | Reliability Engineer | Technical Steward |
| Distributed architecture | Architect, only if justified | Not mandatory |
| Risks/controls/exceptions/debt governance | Technical Steward | Professional evidence |

## The anti-overwhelm gate

Before TSA asks the learner to implement a new Steward capability, the curriculum should be able to answer all of the following:

1. What problem does this capability solve?
2. Has the learner already studied the concepts needed to reason about it?
3. Can the capability be introduced in a small vertical slice?
4. What acceptance criteria prove it works?
5. What failure cases should the learner investigate?
6. What design decision should the learner make rather than be handed?
7. What should remain deliberately out of scope?
8. What evidence should the learner preserve in the TSA portfolio?

If those questions cannot be answered, the capability is not ready to enter the Steward project.

## Definition of understanding

The learner does **not** demonstrate understanding merely because the application runs.

For each meaningful Steward milestone, the learner should increasingly be able to:

- state the requirement in their own words;
- draw or describe the relevant domain/system model;
- explain the important implementation choices;
- trace data through the system;
- predict important failure modes;
- diagnose a deliberately broken scenario;
- explain the security and operational consequences;
- defend a trade-off;
- identify what they would improve with more time or evidence.

This is the primary safeguard against TSA becoming a sequence of sophisticated code-generation exercises.

## Curriculum authoring rule

Any future TSA lesson or milestone that materially changes Steward must remain consistent with [`steward.md`](./steward.md) and this evolution map.

If a future lesson needs a capability earlier than this map allows, the curriculum should first explain why the prerequisite reasoning has changed. The roadmap should then be deliberately updated rather than silently bypassed.
