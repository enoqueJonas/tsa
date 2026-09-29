# System Thinker — Deep Curriculum Audit

Status: structural, runtime-boundary and resource audit complete

## Purpose

System Thinker teaches the learner to reason about a software system beyond individual endpoints/classes: problem framing, actors, boundaries, responsibilities, dependencies, data movement, integration semantics, distributed state, failure and explicit architectural decisions.

It is not the Architect school. Decisions remain bounded to the evolving Steward system and the learner's current evidence.

## Canonical progression

1. Requirements and Problem Framing
2. System Boundaries and Context
3. Modeling Software Systems
4. Components and Dependencies
5. Data Flow and Integration
6. Enterprise File and Batch Integration
7. SOAP and XML Enterprise Integration
8. Distributed State and Messaging
9. Failure Modes
10. Architecture Decisions and Trade-offs
11. Steward API System Design Portfolio

## Runtime finding resolved: stranded file-integration curriculum

`system-thinker-enterprise-file-integration-deep.ts` was fully authored but not imported by `system-thinker.ts`, making the path unreachable.

It is now a canonical runtime path after general Data Flow and Integration and before SOAP/XML.

This ordering teaches interaction models progressively:
- general flow/contract reasoning;
- explicit file/batch exchange;
- contract-heavy synchronous SOAP/XML;
- distributed state and asynchronous messaging;
- cross-cutting failure analysis;
- evidence-based architecture decisions.

## SOAP/XML resource remediation

The SOAP/XML path was entirely practical and had no structured external references.

It now carries an authoritative reference set:
- W3C XML 1.0;
- W3C XML Namespaces;
- W3C XML Schema;
- W3C WSDL 1.1;
- W3C SOAP 1.2;
- OWASP XXE prevention for safe XML parsing.

The references support implementation/diagnosis without turning SOAP into a preferred architecture.

## Strong existing areas

### Problem framing before modeling
The learner separates stakeholder requests from requirements and makes constraints, assumptions, quality concerns and acceptance evidence explicit before drawing structure.

### Context before components
C4/arc42 context work asks who interacts across which boundary and why. It explicitly avoids drawing the codebase as a context diagram.

### Responsibilities before decomposition
Components/dependencies asks what responsibility a boundary owns and what coupling it creates before restructuring code.

### Flow semantics before integration products
Data Flow distinguishes synchronous/asynchronous interaction, compatibility, partial state and ambiguity before RabbitMQ/Redis appear.

### Distributed infrastructure must be earned
The distributed-state path explicitly requires a demonstrated pressure, simpler alternatives and acceptance evidence before adding Redis/RabbitMQ. PostgreSQL remains authoritative unless a later decision deliberately changes ownership.

### RabbitMQ and Kafka are not interchangeable badges
The curriculum compares routed work delivery with durable partitioned-log semantics rather than treating Kafka as the more advanced broker.

### Failure analysis comes after concrete boundaries
Retries, partial success, capacity and recovery are analyzed against integrations the learner has actually built/modelled.

### ADRs follow evidence
Architecture Decisions explicitly says not to manufacture microservices and requires forces/options/evidence.

## Boundaries

### Builder
System Thinker consumes the working Steward API. It does not reteach Python/Django/PostgreSQL fundamentals.

### Platform Builder
System Thinker models network/system dependencies but does not teach network, OS, virtualization or host administration.

### Delivery Engineer
Integration contract/version concerns may identify release implications, but System Thinker does not own CI/CD or artifact pipelines.

### Security Steward
Trust boundaries and safe XML parsing are necessary system-design inputs. Full threat modeling/adversarial testing remains Security.

### Reliability Engineer
Failure modes are modeled and local resilience assumptions can be tested. SLOs, telemetry platforms, on-call, capacity programs and production reliability remain Reliability.

### Architect
System Thinker introduces bounded architectural decisions for one evolving system. Architect later compares structural styles/data/integration/distribution/resilience across competing quality attributes and simplification options.

## Regression questions

- Is the problem framed before a solution is selected?
- Does each diagram answer an explicit question?
- Are responsibilities and dependencies semantically named?
- Are synchronous, asynchronous and file-based contracts distinguished?
- Can the learner diagnose XML/schema/WSDL/SOAP failures at different layers?
- Does SOAP remain isolated behind an adapter rather than shaping Steward's domain?
- Is file exchange treated as an API contract with lifecycle/idempotency/recovery concerns?
- Is distributed state added only after simpler alternatives?
- Is PostgreSQL authority explicit when Redis is only a cache?
- Are redelivery/idempotency and dual-write consequences demonstrated?
- Are failure scenarios based on real system boundaries?
- Do ADRs preserve rejected alternatives and evidence?
- Is every authored path reachable from runtime?
