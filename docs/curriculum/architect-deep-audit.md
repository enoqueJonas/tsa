# Architect — Deep Curriculum Audit

Status: active regression record  
Evolution contract: `architect-evolution.md`

## Audit conclusion

Architect has a strong evidence-first philosophy and already rejects architecture-as-fashion. Its largest gaps are not missing headline patterns; they are documentation drift and uneven teaching depth/resources across modules.

## Canonical progression

1. Architecture Fundamentals
2. Domain Modeling
3. Modularity
4. Architectural Styles
5. Data Architecture
6. Integration and Messaging
7. Scalability and Distributed Systems
8. Resilience Architecture
9. Architecture Evaluation and Governance
10. Steward Architecture Evolution

Domain Modeling intentionally precedes Modularity and Styles: business language, invariants and ownership should inform structural boundaries before styles are selected.

## Findings resolved

### Journey order disagreed with runtime
Runtime was already domain-first, but the journey documented Modularity and Styles before Domain Modeling. The journey now matches runtime.

### Stale Jenkins implementation in final milestone
The final milestone still described Jenkins despite TSA's GitLab CI/CD migration. It now evaluates GitLab CI/CD pipeline-driven deployment authority against Argo CD GitOps reconciliation where relevant.

### Simplification discipline concentrated at the milestone
Many modules already warn against speculative distribution, but the new evolution contract makes retain/simplify/change a school-wide decision rule.

## Strong existing areas

- Architecture Fundamentals frames architecture as drivers, constraints, quality attributes, trade-offs and evidence.
- Modularity explicitly requires a boundary to buy reduced coupling, protected invariants, ownership or independent evolution.
- Architectural Styles states that styles are not a maturity ladder.
- Domain Modeling warns against framework-shaped DDD and unnecessary DDD ceremony.
- Data Architecture explicitly allows shared PostgreSQL/logical ownership and requires justification before database-per-service.
- Integration includes a dedicated "When Not to Add a Message Broker" lesson.
- Scalability explicitly says not to assume distribution is the target state.
- Resilience reuses demonstrated Reliability failure modes rather than imagined ones.
- Governance covers ADRs, scenario evaluation, fitness functions, standards/context, technology selection, build-vs-buy, architecture debt, decision rights and package governance.
- Final milestone requires an option that preserves the current structure, challenges every enterprise platform layer, accepts simplification and requires the learner to defend deliberately rejected complexity.

## Gaps requiring the next pass

### Data Architecture has no structured learning resources
Its lessons are substantive but currently depend almost entirely on authored prose. Add targeted primary/high-quality resources for transactions/isolation, schema evolution, caching, data ownership, derived/read models and audit/history.

### Integration and Messaging has no structured learning resources
Add exact resources for HTTP/synchronous coupling, messaging semantics, queues/pub-sub, commands/events, idempotency, delivery semantics, contract evolution and backpressure. Avoid teaching RabbitMQ/Kafka before the integration semantics.

### Scalability and Distributed Systems has no structured learning resources
Add targeted material for scaling, load distribution, replication, partitioning, CAP/consistency and coordination. Keep measured demand before mechanism.

### Resilience Architecture has no structured learning resources
This school must not duplicate Reliability's implementation lessons. Resources should support architecture-level placement/trade-offs of failure controls and reference earlier Reliability evidence.

### Evaluation and Governance has no structured learning resources
Add resources for ADRs, ATAM/scenario-based evaluation, fitness functions/evolutionary architecture, technology selection and dependency governance.

### Existing resource bundles are too generic
Fundamentals, Domain Modeling, Modularity and Architectural Styles currently repeat the same module-level resource bundle. Apply lesson-specific routing as done in Quality, Security and Reliability.

## Duplication boundaries

### Domain/Modularity vs System Thinker
Architect should evaluate mature-system boundaries from accumulated evidence, not reteach elementary SOLID/package design.

### Data/Integration vs Reliability
Reliability owns operational behavior and failure evidence. Architect uses that evidence to decide structural/data/integration boundaries.

### Resilience vs Reliability
Reliability teaches timeout/retry/backpressure/fault experiments operationally. Architect asks whether topology, ownership or dependency boundaries should change because of demonstrated failure behavior.

### Architecture governance vs Technical Steward
Architect governs architecture decisions and technical boundaries. Technical Steward later expands to organization-wide technology strategy, capability, portfolio and long-term governance.

## Runtime integrity

All Architect deep modules are imported by `architect.ts`, and `architectPaths` exposes the complete ten-stage school including the final milestone.

Repository-wide Jenkins search is clean after the milestone correction.

## Regression questions

- Is the architecture driver stated before the technology?
- Are fact, assumption and forecast separated?
- Is retaining the current design evaluated?
- Is simplification/removal considered where complexity is costly?
- Are domain ownership and invariants considered before service boundaries?
- Is distribution justified by evidence rather than maturity language?
- Does a broker solve a real temporal/buffering/fan-out problem?
- Does a cache have explicit freshness/invalidation/source-of-truth semantics?
- Are scalability decisions tied to measured demand or an explicit forecast?
- Does resilience architecture reuse Reliability evidence rather than repeat controls mechanically?
- Does governance automate/proportion controls rather than create approval theater?
- Does every major decision define a reconsideration trigger?
- Does the final defense explain rejected complexity as well as chosen complexity?
- Is every lesson reachable through runtime?
