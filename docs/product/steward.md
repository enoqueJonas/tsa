# Steward — Product and Domain Definition

## Product statement

**Steward is an internal Engineering Service Registry and Technology Stewardship platform.**

It helps an engineering organization know what technical services it owns, who is responsible for them, what they depend on, where they run, what lifecycle state they are in, and what engineering risks, decisions and operational obligations surround them.

Steward is the primary continuing system built and evolved throughout the Technical Stewardship Academy.

## Why this domain

The domain is deliberately aligned with the academy itself. It gives the learner a credible system whose concerns naturally expand from programming and data modeling into delivery, cloud, quality, security, reliability, architecture and governance.

Steward must remain a real product problem, not a playground for forcing every technology into one application.

## What Steward is not

Steward is **not**:

- a xitique or contribution-management system
- a financial cooperative platform
- a reimplementation of the learner's monograph system
- a generic task manager
- Jira
- a full ITSM suite
- a Backstage clone
- a reason to introduce microservices, messaging or distributed infrastructure without evidence

## Core questions Steward should answer

For a technical service such as `Payments API`, Steward should eventually make questions like these easy to answer:

- Who owns this service?
- Which team supports it?
- Who is its technical owner?
- What lifecycle state and criticality does it have?
- Which environments does it run in?
- What other services does it depend on?
- Which services depend on it?
- What architecture decisions affect it?
- What open technical risks exist?
- Where are its runbooks and documentation?
- What incidents or reliability concerns are associated with it?
- Does it meet the organization's engineering standards?
- When was it last reviewed?

## Builder scope — Steward API v1

Builder must create a useful first version without prematurely implementing the governance platform that later schools will need.

### Initial domain

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

Recommended initial entities:

### User

A person who can authenticate to Steward.

### Team

An engineering or technology team responsible for one or more technical services.

### Membership

Connects a User to a Team with a role such as member, maintainer or owner.

### Service

A software service, application, platform component or other independently owned technical capability.

Representative fields may include:

```json
{
  "name": "Payments API",
  "slug": "payments-api",
  "description": "Processes internal payment instructions",
  "criticality": "high",
  "lifecycle": "production",
  "ownerTeam": "Payments Engineering"
}
```

### Environment

Represents a meaningful runtime environment of a service, such as development, UAT or production.

### ServiceDependency

Represents a directed dependency from one Service to another.

### ServiceReview

Records a lightweight engineering review of a service. Builder only needs enough review information to exercise relationships, authorization, filtering and historical records. Governance-specific review models arrive later.

## Initial business rules

The following rules give Builder genuine domain behavior rather than CRUD-only endpoints:

1. Every Service must have an owning Team.
2. Only appropriately authorized members of the owning Team may modify a Service.
3. A Team Owner may transfer service ownership according to explicit authorization rules.
4. A production Service must have at least one production Environment.
5. A Service cannot depend on itself.
6. Duplicate ServiceDependency relationships are forbidden.
7. A Team with active owned Services cannot be deleted until ownership is resolved.
8. Retired Services cannot accept new dependencies.
9. Critical Services require an explicit technical owner by the point that capability is introduced.

Rules may be refined while Builder is authored, but changes must preserve the product direction rather than mutate Steward into an unrelated domain.

## Representative API surface

The exact contract is designed during Builder, but a credible shape is:

```text
GET    /services/
POST   /services/
GET    /services/{id}/
PATCH  /services/{id}/

GET    /teams/
POST   /teams/

POST   /services/{id}/dependencies/
DELETE /services/{id}/dependencies/{dependencyId}/

GET    /services/{id}/reviews/
POST   /services/{id}/reviews/
```

Useful filters may include:

```text
GET /services?criticality=high
GET /services?lifecycle=production
GET /services?team=payments
GET /services?depends_on=authentication-api
```

## Relational reasoning

The domain must support real relational questions. Examples:

- Which teams own the most high-criticality services?
- Which production services have no recorded production environment?
- Which services have the largest number of internal dependencies?
- Which services depend directly on Authentication Service?
- Which teams have overdue service reviews?

For example:

```sql
SELECT team.name, COUNT(service.id)
FROM team
JOIN service ON service.owner_team_id = team.id
WHERE service.criticality = 'high'
GROUP BY team.name
ORDER BY COUNT(service.id) DESC;
```

These questions are intentionally useful later for SQL, indexing, EXPLAIN, ORM trade-offs, N+1 analysis and reporting.

## Authorization model

Steward should naturally exercise layered authorization:

```text
User
↓
Team membership
↓
Membership role
↓
Service ownership
↓
Object-level permission
```

This allows Security Steward to investigate realistic broken-access-control scenarios later without inventing a separate target application.

## Cross-school evolution

### Engineering Apprentice

No Steward implementation is required. Examples may reference technical systems, services and engineering ownership where useful, but the school remains about reasoning habits.

### Builder

Build Steward API v1: users, teams, memberships, services, environments, dependencies, reviews, authentication, authorization, relational data and API behavior.

### System Thinker

Model Steward's actors, boundaries, responsibilities, data flows, dependencies, failure modes and architecture decisions. Do not add features merely to satisfy the school.

### Platform Builder

Operate Steward on Linux and in the learner-controlled homelab.

### Delivery Engineer

Containerize and automate delivery, create CI/CD, introduce the internal artifact platform, and publish/consume justified internal packages.

### Cloud Engineer

Run a budget-conscious internet-accessible Steward environment with DNS, TLS, IaC, backups and explicit cost trade-offs.

### Quality Steward

Build a serious quality strategy and automation platform around Steward. A small Engineering Portal UI may be introduced when it creates a legitimate browser-facing product need and therefore a credible Playwright target.

### Security Steward

Threat-model and harden Steward, including object-level authorization, infrastructure, delivery pipelines, internal packages and artifact services.

### Reliability Engineer

Operate Steward as a measurable service with logs, metrics, dashboards, SLIs/SLOs, alerts, incident response, capacity planning, recovery and controlled reliability experiments.

### Architect

Evaluate Steward's structure using accumulated evidence. Shared packages, modular-monolith boundaries, data ownership and integration choices may be retained or changed. Distributed architecture is never a graduation requirement.

### Technical Steward

Expand Steward toward its natural product destination: technology risks, controls, standards, exceptions, architecture decisions, technical debt, lifecycle governance, ownership and engineering-health reviews.

### Professional Engineer

Steward remains portfolio evidence, but the learner builds a second substantial system from a blank repository to prove independent capability.

## Long-term product direction

A mature Steward may expose an engineering portal such as:

```text
Payments API
────────────────────────────
Owner              Payments Engineering
Technical Owner    Ana João
Criticality        HIGH
Lifecycle          Production

Dependencies
├── Authentication Service
├── Core Banking Adapter
└── Notification Service

Engineering Health 82%
Open Risks         3
Policy Exceptions  1
Overdue Controls   2
Open Tech Debt     7
```

This is a direction, not a Builder backlog. Features enter the product only when the curriculum has established the concepts needed to design them responsibly.

## Domain lock

This document is the canonical domain reference for the continuing TSA system.

Examples, labs and milestones should use this domain unless a focused standalone experiment is pedagogically better. Significant changes to the Steward domain must be deliberate and reflected here so the system does not drift based on ad-hoc lesson examples or chat history.
