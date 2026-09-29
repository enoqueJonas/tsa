# Builder — Deep Curriculum Audit

Status: structural, boundary and resource-targeting audit complete

## Purpose

Builder turns Apprentice reasoning/workbench fluency into the ability to build and explain a production-shaped backend. The learner should understand language, protocol, data and framework behavior rather than assembling a Django application from framework recipes.

## Canonical progression

1. Programming with Python
2. Web and API Foundations
3. Relational Data and PostgreSQL
4. Django and API Engineering
5. Identity, Authentication and Authorization
6. Software Craft
7. Steward API v1 milestone

## Structural conclusion

The sequence is sound.

Python precedes framework use. HTTP semantics precede DRF. Relational modeling and SQL precede Django ORM. Authentication and authorization are explicit rather than hidden inside framework defaults. Software Craft then consolidates dependency/config/logging/refactoring/review concerns before the API v1 milestone.

No additional headline module is required.

## Apprentice prerequisite correction

Engineering Apprentice now explicitly teaches shell/filesystem, Git fundamentals, basic process inspection and command-line HTTP observation. Builder can therefore deepen those skills rather than silently introducing them.

## Resource remediation

### PostgreSQL
The original data module had strong authored content but reused broad PostgreSQL/Django documentation.

Resources are now routed by lesson:
- relational/schema → PostgreSQL DDL;
- querying/filtering/joins/subqueries → PostgreSQL query docs;
- aggregation → aggregate functions;
- CTEs/recursive queries → WITH queries;
- transactions/concurrency → transaction isolation;
- constraints → constraint docs;
- indexes → index docs;
- plans/performance → EXPLAIN;
- direct DB practice → psql;
- ORM/N+1 → Django queries plus database-plan evidence where relevant;
- migrations → Django migrations + PostgreSQL DDL;
- concurrency → transaction isolation + explicit locking.

### Django/DRF
Resources are now routed by lesson:
- request lifecycle → Django request/response;
- app boundaries → Django applications;
- models → Django models;
- serializers → DRF serializers;
- views/routing → DRF views;
- validation → DRF validators;
- error handling → DRF exceptions;
- filtering → DRF filtering;
- pagination → DRF pagination;
- API documentation → OpenAPI;
- configuration → Django settings;
- logging → Django logging.

## Strong existing decisions

### Relational data before ORM
Builder does not teach data only through Django. The learner models facts, keys, constraints, joins, transactions, plans and concurrency before relying on ORM abstractions.

### Framework abstractions are inspectable
Django/DRF lessons repeatedly require the learner to trace what the framework does and compare abstractions rather than treating ViewSets/serializers as magic.

### Authentication is not authorization
Identity/Auth explicitly separates identity, authentication and authorization and includes negative access behavior.

### Internal reuse is earned
Software Craft explicitly says not to create `steward-common` speculatively. A shared package requires multiple real consumers. Nexus publication belongs later.

### Performance stays bounded
Builder teaches performance awareness and evidence, not capacity engineering or production performance programs.

## Boundaries

### System Thinker
Builder may create clean modules and explicit contracts but does not redesign Steward into distributed services or teach enterprise integration architecture.

### Platform Builder
Builder consumes a developer workstation and local PostgreSQL; it does not own host/network/storage administration.

### Delivery Engineer
Builder uses Git and manages dependencies/configuration but does not own CI/CD, artifact publication or release automation.

### Quality Steward
Builder verifies its behavior and writes appropriate developer tests, but it does not build the organization-wide automation/testing platform.

### Security Steward
Builder must implement correct auth/authz and safe baseline behavior. It does not perform adversarial security assessment or organization-wide security engineering.

### Reliability Engineer
Builder emits useful application logs and handles failures deliberately. It does not implement SLOs, observability platforms, on-call or resilience programs.

## Regression questions

- Can the learner explain Python behavior before framework behavior?
- Can they inspect an HTTP exchange without Postman being the mental model?
- Can they write/query a relational model without the ORM?
- Can they explain what SQL the ORM generates when necessary?
- Are domain invariants protected at the appropriate data/application boundary?
- Are authentication and authorization demonstrably distinct?
- Are negative access cases tested?
- Is every dependency justified?
- Is internal package extraction based on real reuse?
- Is logging useful without leaking sensitive data?
- Does Steward API v1 synthesize the school rather than introduce the next one?
- Are later-school infrastructure/distributed-system concerns kept out?
