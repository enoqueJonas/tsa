# Architect — Learning Resource Audit

Status: complete module-level resource audit

## Goal

Architect resources must improve decision quality. They should teach architecture semantics, trade-offs and evaluation before product mechanics. A resource is useful only when it helps the learner decide whether a structure is justified.

## Selection policy

1. Prefer architecture/research references for structural reasoning.
2. Prefer official product documentation only when product mechanics materially affect the architecture decision.
3. Route resources by lesson rather than attaching one module-wide bundle.
4. Reuse earlier-school evidence rather than reteaching implementation.
5. Keep resource sets small; link count is not curriculum depth.

## Completed targeting

### Architecture Fundamentals
- architecture meaning/design significance → SEI
- drivers/quality attributes/trade-offs → SEI
- fitness/evolution → evolutionary-architecture material
- documentation/views → arc42

### Domain Modeling
- language/general DDD → DDD reference
- bounded contexts/context mapping → bounded-context material
- aggregates/invariants → aggregate material
- DDD restraint → general DDD + bounded contexts

### Modularity
- module/boundary reasoning → bounded-context/common architecture material
- shared libraries/modular monoliths → monolith-first material
- service boundaries → bounded-context + monolith-first reasoning
- distributed-monolith risk → distribution-cost/monolith reasoning

### Architectural Styles
- microservices/SOA/distribution cost → Fowler microservices material
- event-driven → AWS event-driven + architecture patterns
- serverless → dedicated serverless architecture material
- style selection → comparison/trade-off references

### Data Architecture
- ownership/schema boundaries → PostgreSQL DDL as concrete relational context
- transaction consistency → PostgreSQL isolation
- derived/read models → CQRS reference
- caching → architecture caching guidance
- database separation → transactions/read-model trade-offs
- migration/evolution → PostgreSQL DDL
- history/audit → event-sourcing/history reference used as a comparison, not a mandated pattern

### Integration and Messaging
- integration styles → enterprise integration references
- async/queues/pub-sub → architecture guidance + AMQP concepts
- delivery/reliability → RabbitMQ reliability semantics
- idempotency → safe-retry/idempotent API guidance
- failure/backpressure → broker reliability guidance
- no-broker decisions → technology-choice guidance plus concrete broker cost

### Scalability and Distributed Systems
- scale/demand → Well-Architected demand/scaling material
- distributed-system cost → Google SRE
- replication → PostgreSQL HA/replication
- partitioning → data-partitioning guidance
- consistency/availability → Gilbert/Lynch CAP paper + distributed-systems material
- coordination/sagas → distributed-system reasoning
- capacity-before-complexity → demand/scaling + distributed-system cost

### Resilience Architecture
Resources deliberately overlap selected Reliability references, but the activity changes: Architect uses them to decide placement/topology/boundaries and reuses prior failure evidence rather than re-running implementation instruction.
- cascading failure → Google SRE
- timeout/retry policy → AWS Builders' Library
- breaker/bulkhead placement → Azure architecture patterns
- redundancy/RPO/RTO → disaster-recovery architecture guidance

### Architecture Evaluation and Governance
- ADRs → ADR reference
- reviews/scenario evaluation → SEI ATAM
- fitness/evolution → fitness-function material
- technology standards/selection → Technology Radar as an example of contextual lifecycle thinking
- dependency/shared-package lifecycle → Semantic Versioning + ADR discipline

## Boundary checks

### No tool-first architecture
RabbitMQ, PostgreSQL, Kubernetes/OpenShift, Redis, Kong, Keycloak and other existing Steward technologies remain evidence to evaluate, not target architecture outcomes.

### No Reliability duplication
Resilience Architecture asks whether failure evidence justifies structural change. Reliability remains responsible for operational controls, experiments, SLOs and recovery evidence.

### No Quality duplication
Architect consumes performance/test evidence to make structural decisions. It does not rebuild the measurement framework.

### No Security duplication
Architect consumes trust-boundary/control evidence to decide placement and authority. It does not repeat exploit/hardening labs.

## Runtime and repository integrity

All Architect modules remain exported through `architectPaths`.

Repository-wide Jenkins search is clean.

Run `pnpm audit:curriculum` before merging curriculum changes.

## Regression questions

- Does the first resource support the lesson's decision, not merely its technology?
- Is a broad module bundle hiding a more exact reference?
- Is a product introduced before the architecture semantics that justify it?
- Is an earlier-school implementation topic being unnecessarily retaught?
- Does a resource imply that a pattern/style is a maturity destination?
- Does distributed-systems material explain coordination/consistency costs?
- Does resilience material reuse demonstrated Reliability evidence?
- Does governance material produce lightweight enforceable decisions rather than ceremony?
- Can the learner use the resources to justify doing nothing or simplifying?
