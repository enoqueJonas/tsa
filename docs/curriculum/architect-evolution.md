# Architect — Steward Evolution Contract

Status: canonical implementation contract

## Purpose

Architect is the synthesis school. The learner already knows how to build, deliver, secure and operate Steward. The architect's job is to decide which structures remain justified as drivers change.

Architecture is not a technology-accumulation exercise. A decision that removes a service, broker, cache, gateway, duplicated abstraction or operational layer can be more architecturally mature than adding one.

## Governing loop

```text
business / engineering driver
        ↓
quality-attribute scenario + constraints
        ↓
current-state evidence
        ↓
credible options
  retain / simplify / change
        ↓
trade-off and failure analysis
        ↓
smallest justified decision
        ↓
implementation / fitness evidence
        ↓
ADR + reconsideration trigger
```

## Decision rules

For every consequential architecture decision:

1. State the driver before the technology.
2. Separate observed fact, assumption and forecast.
3. Include retaining the current design when credible.
4. Include simplification/removal when current complexity may no longer earn its cost.
5. Evaluate operational, security, reliability, data, delivery, migration and cognitive consequences.
6. Prefer reversible decisions when uncertainty is high.
7. Define evidence that would invalidate or reopen the decision.
8. Do not introduce distribution to solve a problem that measured capacity, modularity or ownership can solve more simply.

## Increment 1 — Architecture baseline

Reconstruct Steward from evidence accumulated in earlier schools:
- application/module boundaries
- PostgreSQL/data ownership
- APIs/integrations
- shared packages and Nexus
- GitLab CI/CD and GitOps/deployment authority
- infrastructure/platform boundaries
- Kong/Keycloak/security boundaries
- observability/SLO/recovery evidence

Deliver:
- current-state views
- driver/constraint register
- quality-attribute scenarios
- architecture risks and assumptions

## Increment 2 — Domain and modular boundaries

Use business language, invariants, change coupling and ownership to challenge existing module/package boundaries.

Do not split a service merely because a bounded context can be named.

Deliver:
- domain/context map
- module/dependency map
- shared-library assessment
- boundary decision(s)

## Increment 3 — Structural style challenge

Evaluate the existing architecture against layered/hexagonal/modular-monolith/service/event/serverless characteristics.

Required option set for any proposed distribution:
- retain current structure;
- improve internal modularity;
- distribute only the boundary justified by a driver.

## Increment 4 — Data architecture

Challenge ownership, transaction boundaries, derived data, caching and physical separation.

PostgreSQL remains authoritative unless a demonstrated driver justifies another state boundary.

A cache may improve performance; it must not silently become a source of truth.

## Increment 5 — Integration architecture

Classify interactions by ownership, temporal coupling, consistency and failure behavior.

RabbitMQ or another broker is justified only when buffering, temporal decoupling, fan-out or another explicit requirement outweighs its operational cost.

## Increment 6 — Scale and distribution

Use measured Reliability/Quality evidence before selecting scale mechanisms.

Evaluate:
- tuning/vertical capacity;
- stateless horizontal scale;
- caching/contention reduction;
- replication/partitioning;
- distribution/coordination cost.

Do not solve hypothetical hyperscale.

## Increment 7 — Resilience architecture

Reuse Reliability failure evidence to decide whether topology or boundary changes are required.

Do not simply stack retries, breakers, replicas and queues. Each mechanism must address a named failure path and introduce understood secondary failure modes.

## Increment 8 — Evaluation and governance

Turn significant decisions into:
- ADRs
- scenario-based reviews
- fitness functions
- lightweight standards/defaults
- ownership and decision rights
- package/dependency lifecycle rules
- architecture-debt items backed by measurable cost/risk

Governance should reduce repeated decision cost without becoming a central approval queue.

## Increment 9 — Simplification review

Before the final target architecture, explicitly review whether each major platform/dependency still earns its place.

Challenge, where present:
- Redis
- RabbitMQ
- Kong
- Keycloak
- OpenShift/Kubernetes
- Argo CD
- Graylog/Tempo/Prometheus/Grafana
- Nexus
- shared packages
- additional databases/caches/gateways

"Keep" is valid. "Remove" is valid. "Replace" is valid. Each requires evidence.

## Increment 10 — Steward Architecture Evolution

The final milestone must:
- compare retain/current, simplify and change options where credible;
- implement at least one meaningful, bounded improvement;
- validate the characteristic it claims to improve;
- record ADRs and reconsideration triggers;
- produce a sequenced roadmap;
- distinguish immediate work from conditional future evolution;
- explicitly document deliberately rejected complexity.

## Boundaries with earlier schools

Architect consumes rather than reteaches:
- Builder/System Thinker software-design fundamentals;
- Platform/Delivery/Cloud implementation mechanics;
- Quality evidence;
- Security trust/control evidence;
- Reliability SLO, incident, capacity and failure evidence.

A short recap is allowed only to support an architecture decision.

## Boundary with Technical Steward

Architect decides structures and technical trade-offs. Technical Steward later expands to organizational technology strategy, standards, portfolio/governance, capability investment and long-horizon stewardship.

## Runtime integrity

Every Architect lesson and milestone must remain reachable through `architectPaths` and the academy journey.

Run:

```bash
pnpm audit:curriculum
```

before merging curriculum changes.
