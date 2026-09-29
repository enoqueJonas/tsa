# Delivery Engineer — Deep Curriculum Audit

Status: structural, platform-consistency and school-boundary audit complete

## Purpose

Delivery Engineer turns a reviewed source change into an immutable, traceable, promotable and recoverable runtime release. The school owns the software delivery chain, not the underlying host baseline.

## Canonical progression

1. Software Delivery Foundations
2. Automation and Shell
3. Containers and Docker
4. Continuous Integration
5. Continuous Delivery and Deployment
6. Artifact, Dependency and Supply Chain Management
7. Release Engineering
8. Production Database Schema Evolution
9. CI Platform Migration Exercise
10. Delivery Engineer Milestone

## Finding resolved: duplicate configuration management

Delivery previously contained a full Ansible Configuration Management path after Platform Builder had already taught and operated:
- desired state;
- inventory;
- idempotency;
- roles;
- drift;
- secrets boundaries;
- canary fleet changes.

The duplicate Delivery path was removed from runtime.

Delivery consumes the Platform Builder-owned host baseline. It owns application delivery inputs and deployment contracts without taking authority over host configuration.

## Finding resolved: stale Jenkins architecture

Several Delivery quality activities still described Jenkins as TSA's primary CI implementation.

GitLab CI/CD is canonical. CI, CD, release and artifact practices were updated to use GitLab CI/CD semantics.

The migration exercise remains intentionally Jenkins-aware, but its direction is now explicit:

legacy/inherited Jenkins workflow → semantic-equivalence analysis → bounded coexistence → GitLab CI/CD → decommission legacy release path.

Jenkins is not a second target platform.

## Canonical delivery chain

source revision
→ review/integration evidence
→ clean CI validation
→ immutable package/image build
→ Nexus artifact identity
→ promotion/release decision
→ deployment of the same artifact
→ schema-compatible state transition
→ runtime verification
→ release evidence/recovery decision

Rebuilding during promotion/deployment breaks the chain.

## Strong existing decisions

### Containers follow platform understanding
The learner understands VM/OS/process/network boundaries before Docker. Containers are packaging/runtime isolation, not replacement for host/platform reasoning.

### CI stages answer risk questions
Pipeline stages are not UI decoration. Required evidence fails closed before artifact production.

### Build, release and run are distinct
The same immutable artifact moves through release/deployment; environment configuration is supplied separately.

### Nexus solves a real distribution problem
Internal packages are extracted only after real reuse and then published/consumed through repository infrastructure rather than filesystem copying.

### Release engineering is evidence-based
Semantic versioning, artifact identity, promotion, approvals and recovery are tied to explicit contracts.

### Database changes are releases
Schema evolution uses expand → migrate/backfill → switch → contract. Application rollback is explicitly distinguished from data rollback/restore/forward-fix.

### Migration is a semantic exercise
Changing CI products requires mapping triggers, execution, credentials, caches, artifacts, gates, evidence and failure behavior—not merely translating YAML.

## Boundaries

### Platform Builder
Platform owns hosts, OS baseline, network/storage and Ansible desired state. Delivery consumes that substrate.

### Cloud Engineer
Delivery owns software-delivery semantics. Cloud later owns provider/IaC/orchestration/GitOps infrastructure and deployment targets.

### Quality Steward
Delivery executes required checks; Quality designs the testing strategy/framework and evidence depth.

### Security Steward
Delivery follows least privilege and preserves supply-chain boundaries. Signing, provenance/security policy and broader software-supply-chain security deepen in Security.

### Reliability Engineer
Delivery verifies releases and recovery paths. SLOs, production telemetry, on-call and resilience programs remain Reliability.

## Regression questions

- Can every running release be traced to one source revision?
- Are build, release, promotion and deployment distinct?
- Is the artifact immutable after CI produces it?
- Does deployment select rather than rebuild?
- Are CI failures fail-closed?
- Is GitLab CI/CD the canonical implementation?
- Is Jenkins present only as legacy migration context?
- Is host desired state owned by Platform Builder rather than retaught?
- Are environment config, secrets, persistent state and artifact identity distinguished?
- Does Nexus distribution replace local-source copying?
- Can a release be rejected without losing evidence?
- Is schema evolution backward-compatible across overlapping application versions?
- Is rollback classified separately for application bytes and persistent data?
- Does the milestone prove commit-to-runtime traceability using the existing platform?
