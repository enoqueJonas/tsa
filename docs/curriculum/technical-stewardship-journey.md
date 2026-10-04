# Technical Stewardship Journey — Curriculum Specification v1

## Vision

The Technical Stewardship Journey develops an engineer by repeatedly applying new disciplines to systems they already understand. TSA deliberately avoids disposable tutorial projects when an existing project can provide a richer learning environment.

The learner should eventually be able to say: **I built it, modeled it, hosted it, delivered it, tested it, attacked and secured it, observed it, operated it, evolved its architecture, governed it, and can defend the decisions I made.**

The journey is intentionally ambitious. Completing lessons alone is not sufficient; capabilities must be demonstrated through labs, artifacts, milestones, and eventually independent engineering work.

---

# 01 — Engineering Apprentice

## Purpose
Develop engineering habits before framework specialization: evidence, systems thinking, trade-offs, investigation, communication, and deliberate learning.

## Modules

### Engineering Foundations
- Thinking Like an Engineer
- Systems Thinking
- Trade-offs
- Debugging as Investigation
- Engineering Decisions
- Evidence and Technical Reasoning
- Learning as an Engineering Skill
- Communicating Technical Work

## Incremental Quality Steward build
The learner does not wait for a final framework lab. Each module changes the same `steward-tests` project:

1. **Java Foundation** — create Maven/JUnit project, configuration, DI boundaries, tag policy and raw HTTP probe.
2. **API Foundation** — introduce REST Assured, typed contracts, API client, test-data builders and service-layer evidence.
3. **Framework Consolidation** — refactor only proven repetition; add diagnostics, Allure, selection and maintainability controls.
4. **Browser Layer** — add Playwright Java, explicit browser/context ownership, direct-locator smoke flow, then extract page/component objects from repetition.
5. **Reuse Boundary** — evaluate candidate generic configuration/API/browser/evidence/JUnit infrastructure, document the proposed boundary, and keep it inside `steward-tests` until a genuine second consumer proves reuse.
6. **Internal Distribution Preparation** — exercise Maven/Nexus publication mechanics with appropriate artifacts, but defer `tsa-test-core` extraction/publication until Professional Engineer creates a genuine second compatible consumer.
7. **CI and Continuous Execution** — containerize dependencies, add GitLab CI/CD gates/selection/artifacts and scheduled regression.
8. **Quality Steward Milestone** — defend the completed quality platform, its evidence model, framework boundaries and unresolved risks.

## Labs
- Debugging investigation
- Analyze an unfamiliar system
- Compare competing technical choices using evidence
- Record an engineering decision
- Write initial handbook entries

## Milestone
**Engineering Investigation** — analyze a software system/problem, gather evidence, identify trade-offs, communicate conclusions, and reflect on the investigation.

---

# 02 — Builder

## Purpose
Build a serious backend system locally and develop practical software craft. The milestone must go substantially beyond CRUD.

## Module 1 — Programming with Python
- Development environment and tooling
- Python syntax and data types
- Control flow
- Functions
- Collections and data structures
- Modules and packages
- Exceptions and error handling
- Object-oriented programming
- Iterators/comprehensions and useful language features
- Type hints
- Dependency management and virtual environments
- Debugging Python

## Module 2 — Web and API Foundations
- How the web works
- Client/server architecture
- HTTP requests and responses
- Methods, headers, status codes, content types
- JSON
- REST principles and trade-offs
- Resource modeling
- API contracts
- curl and Postman

## Module 3 — Relational Data and PostgreSQL
- Relational model
- SQL fundamentals
- SELECT/INSERT/UPDATE/DELETE
- Filtering and ordering
- Aggregation
- GROUP BY and HAVING
- INNER/LEFT/RIGHT joins
- Subqueries
- Common Table Expressions
- Transactions and ACID
- Constraints
- Keys and relationships
- Schema design
- Normalization and denormalization trade-offs
- Indexes
- Query plans and EXPLAIN
- Query performance fundamentals
- PostgreSQL
- Django ORM
- ORM vs SQL
- N+1 query problems
- Migrations
- Concurrency fundamentals

## Module 4 — Django and API Engineering
- Django fundamentals
- Django REST Framework
- Project/application structure
- Models
- Serializers
- Views/viewsets and routing
- Validation
- Error handling
- Filtering, searching, ordering and pagination
- API versioning concepts
- OpenAPI/Swagger documentation
- Configuration and environments
- Logging

## Module 5 — Identity, Authentication and Authorization
- Identity concepts
- Authentication vs authorization
- Password storage and hashing
- JWT structure and lifecycle
- Access and refresh tokens
- Expiration and rotation concepts
- Authentication flows
- Roles and permissions
- Object-level authorization
- Ownership and access rules
- Common authentication mistakes

## Module 6 — Software Craft
- Git fundamentals
- Branching and collaboration
- Readable code
- Separation of concerns
- Refactoring
- Dependency management
- Configuration
- Application logging
- Documentation
- Error design
- Basic performance awareness

## Labs
The learner incrementally constructs Steward API rather than completing disconnected exercises.

## Milestone — Steward API v1
A multi-user, documented REST API with meaningful domain rules, PostgreSQL persistence, relational queries, JWT authentication, authorization/permissions, validation, robust errors, filtering/search/pagination, migrations, configuration, logging, and API documentation. The domain must be complex enough to require relationships, non-trivial queries, and authorization rules.

---

# 03 — System Thinker

## Purpose
Move from writing endpoints to understanding systems, boundaries, dependencies, behavior and decisions.

## Modules
- Requirements and problem framing
- Functional and quality requirements
- System boundaries and context
- Modeling software systems
- Components and dependencies
- Data flow and integration
- State and lifecycle thinking
- Failure modes
- Coupling and cohesion foundations
- Architecture characteristics introduction
- C4-style system communication
- Architecture Decision Records
- Trade-off analysis

## Labs
- Create Steward API system context
- Identify actors and boundaries
- Model components and dependencies
- Map important data flows
- Analyze failure scenarios
- Identify quality attributes
- Write ADRs for real decisions

## Milestone
**Steward API System Design Portfolio** — diagrams, requirements, failure analysis, quality attributes, ADRs, and justified design decisions for the existing application.

---

# 04 — Platform Builder

## Purpose
Build and operate the learner-owned infrastructure substrate beneath Steward, progressing from computing/OS fundamentals through Linux, network engineering, virtualization, bare metal and a serviceable mixed-estate homelab.

The executable path registry in `platform-builder.ts` is authoritative for path composition and order. This specification describes the intended capability progression.

## Module 1 — Computer and Operating-System Foundations
- CPU, memory, storage and I/O
- Operating-system responsibilities
- Kernel/user space, processes and threads
- Filesystems and host resource reasoning

## Module 2 — Linux Administration
- Rocky Linux as the primary server distribution
- Shell, users/groups, permissions and packages
- Processes, systemd, logs and scheduled work
- Storage/mounts, SSH and host administration

## Module 3 — Networking Foundations
- Ethernet, IP addressing/subnetting and ARP
- TCP/UDP, ports/sockets and routing
- DHCP, DNS, NAT and firewalls
- HTTP/TLS from the network perspective
- Evidence-driven troubleshooting

## Module 4 — Packet Tracer Network Engineering
- Build and inspect routed/switched topologies
- Addressing, segmentation and reachability
- Failure isolation before touching application configuration

## Module 5 — Virtualization
- Hypervisors and virtual machines
- VM networking, disks/resources and snapshots
- Failure/recovery and workload placement

## Module 6 — Bare-Metal Foundations
- Physical compute/storage/network constraints
- Firmware/boot and hardware inventory
- Failure domains, power and recoverability

## Module 7 — Budget Homelab
- Select budget/used hardware from requirements
- Design topology, addressing, switching and isolation
- Establish remote administration and backup expectations
- Move Steward from laptop-only execution into learner-owned infrastructure

## Module 8 — Proxmox Homelab Platform
- Operate the homelab as a virtualization platform
- VM lifecycle, networking, storage and recovery
- Separate platform administration from application operation

## Module 9 — Enterprise Storage and NAS
- Storage roles, filesystems and network storage
- Capacity, permissions, durability and backup boundaries
- Operate shared storage without treating replication as backup

## Module 10 — Core Infrastructure Services
- DNS, DHCP and time synchronization
- Service ownership, configuration and troubleshooting
- Build stable infrastructure dependencies for later schools

## Module 11 — Platform Configuration Management
- Repeatable host configuration
- Idempotency and inventory
- Configuration drift and verification
- Establish the automation substrate later Delivery work consumes

## Module 12 — OS Patching Lifecycle
- Package/update policy
- Maintenance, reboot and rollback/recovery planning
- Patch evidence and operational risk

## Module 13 — Windows and PowerShell Enterprise
- Windows administration fundamentals
- PowerShell automation
- Mixed Linux/Windows estate reasoning
- Identity/network/service-management boundaries

## Module 14 — Enterprise Infrastructure Services
- Operate enterprise-style shared infrastructure from the accumulated homelab
- File/directory/service boundaries and access
- Produce the infrastructure prerequisites consumed by later integration and security work

## Module 15 — Steward Homelab v1
Demonstrate Steward on learner-managed infrastructure with documented topology, host/platform ownership, networking, core services, configuration management, patching, storage, recovery and mixed-estate boundaries. The milestone proves an operable substrate for Delivery Engineer rather than merely a collection of installed products.

---

# 05 — Delivery Engineer

## Purpose
Make software reproducibly buildable, packageable, testable, releasable and deployable.

## Module 1 — Software Delivery Foundations
- Source-to-production lifecycle
- Git workflows
- Pull requests and reviews
- Semantic Versioning
- Conventional Commits
- Release notes and changelogs
- Build artifacts
- Environment promotion

## Module 2 — Automation and Shell
- Shell scripting
- Exit codes and pipes
- Environment variables
- Repeatable scripts
- Make/Task-style automation
- Idempotency concepts

## Module 3 — Containers and Docker
- Containers vs VMs
- Namespaces/cgroups concepts
- Docker architecture
- Images and layers
- Dockerfiles
- Build context
- Multi-stage builds
- Volumes
- Container networking
- Docker Compose
- Health checks
- Registries
- Image tagging
- Image optimization
- Container debugging

## Module 4 — Continuous Integration
- Pipeline architecture
- Jobs, stages and dependencies
- Runners/agents
- GitLab CI/CD as the canonical CI implementation
- `.gitlab-ci.yml`, jobs, stages, runners, `rules`, `needs`, variables, caches and artifacts
- Merge request, branch/tag and scheduled pipeline sources
- Self-hosted runners
- Caching
- Pipeline artifacts
- Secrets and variables
- Parallelism
- Automated checks
- Test stages
- Quality gates
- Container builds in CI

## Module 5 — Continuous Delivery and Deployment
- CI vs continuous delivery vs deployment
- Environment management
- Deployment automation
- Release approvals
- Database migrations in releases
- Rollback
- Rolling deployments
- Blue/green deployments
- Canary concepts
- Feature flags concepts

## Module 6 — Configuration Management
- Configuration drift
- Desired state and idempotency
- Ansible fundamentals
- Inventories
- Playbooks
- Roles concepts
- Automating homelab/server configuration

## Module 7 — Artifact and Supply-Chain Foundations
- Container registries
- Artifact retention
- Dependency provenance concepts
- SBOM introduction
- Signing/provenance concepts
- Dependency and image scanning foundations

## Module 8 — Release Engineering
- Release candidates
- Promotion and gates
- Deployment evidence
- Release observability
- Failure handling
- Release runbooks

## Labs
- Containerize Steward API
- Build production-oriented Dockerfile
- Compose application and dependencies
- Publish images
- Install self-hosted CI runner in homelab
- Build multi-stage CI pipeline
- Automate server configuration with Ansible
- Automate deployment and rollback

## Milestone
**Steward Delivery Platform** — commit-to-deployment pipeline producing versioned artifacts/images and reproducibly deploying Steward API to learner-managed infrastructure.

---

# 06 — Cloud Engineer

## Purpose
Operate a real internet-facing remote environment while learning the concepts behind cloud infrastructure. Begin with an affordable VPS before relying heavily on managed cloud abstractions.

## Module 1 — Cloud and Hosting Models
- On-premises, colocation, VPS and cloud
- IaaS/PaaS/SaaS
- Regions and availability concepts
- Shared responsibility
- Cost awareness

## Module 2 — VPS Operations
- Selecting a budget VPS
- Provisioning
- Public addressing
- SSH
- Provider firewall/security controls
- OS lifecycle
- Remote recovery concepts

## Module 3 — Internet Networking
- Public/private addressing
- Routing
- DNS
- Domains and records
- TLS certificates
- Reverse proxies
- Ingress concepts
- Firewalls

## Module 4 — Cloud Building Blocks
- Compute
- Storage
- Managed databases
- Virtual networks
- Load balancers
- IAM
- Secrets
- Monitoring
- Backups

## Module 5 — Infrastructure as Code
- Declarative infrastructure concepts
- Terraform/OpenTofu fundamentals
- State
- Variables and outputs
- Modules concepts
- Plan/apply lifecycle

## Module 6 — Cloud Architecture and Cost
- Availability
- Scalability
- Security boundaries
- Backup/recovery
- Cost estimation
- Cost controls
- Managed vs self-managed trade-offs

## Labs
- Purchase/provision a budget VPS
- Secure administrative access
- Configure DNS/TLS
- Deploy containerized Steward API
- Automate VPS deployment
- Compare self-managed VPS components with AWS/Azure/cloud equivalents
- Introduce IaC where supported/useful

## Milestone
**Steward Internet Environment** — publicly reachable, TLS-protected, documented deployment on a budget VPS with automated delivery, backups and operational controls.

---

# 07 — Quality Steward

> Implementation contract: [`quality-steward-repository-evolution.md`](./quality-steward-repository-evolution.md). Quality Steward lessons must evolve the same `steward-tests` artifact according to these checkpoints rather than introducing the finished framework early.

## Purpose
Learn quality engineering deeply and build a real automation framework against the increasingly realistic Steward platform.

## Module 1 — Quality Engineering
- Quality vs testing
- Quality risks
- Test strategy
- Test levels and types
- Risk-based testing
- Shift-left/shift-right concepts
- Testability

## Module 2 — Test Analysis and Design
- Requirements analysis
- Equivalence partitioning
- Boundary values
- Decision tables
- State transitions
- Pairwise/combinatorial concepts
- Exploratory testing
- Negative testing
- Traceability

## Module 3 — Java for Test Framework Engineering
- Java/JVM execution model and Maven project structure
- Maven lifecycle phases vs plugin goals, effective POM and reproducible plugin configuration
- Dependency graphs, scopes, mediation, `dependencyManagement`, local repository, Nexus and SNAPSHOT tradeoffs
- Surefire vs Failsafe and test-discovery boundaries
- Classes, records, enums, access modifiers and immutability
- Object identity, `equals`, `hashCode` and safe diagnostic `toString`
- Interfaces, composition and dependency direction
- Constructor dependency injection before DI containers
- Generics, collections and type erasure
- Exceptions, cause preservation and try-with-resources
- Annotations, retention and reflection
- JUnit Platform vs Jupiter/TestEngine, discovery and the complete Maven → Surefire → Platform → Jupiter execution chain
- JUnit test-instance lifecycle and resource ownership
- Parameterized tests/MethodSource and diagnostic invocation naming
- JUnit extension callbacks, `ParameterResolver` and extension-state boundaries
- JUnit tags and governed test selection
- Lambdas, functional interfaces, streams and Optional
- Concurrency, shared state, visibility/atomicity, `ThreadLocal` risks and thread-safety fundamentals
- **Execution milestone:** explain and debug `mvn test` end-to-end, inspect effective POM/dependency tree, prove tag selection/parameterization and build one deliberately narrow extension
- **Increment:** create `steward-tests`, establish Maven/JUnit, immutable configuration, constructor injection, tag policy and one raw Java HttpClient probe

## Module 4 — Unit and Component Testing
- Unit-test design
- Isolation
- Test doubles
- Mocks/stubs/fakes
- Coverage and its limitations

## Module 5 — API and Integration Testing
- HTTP semantics before tooling: methods, safety/idempotency, status/header/representation semantics, content negotiation and retry risk
- Introduce REST Assured by replacing the earlier raw HttpClient ceremony
- Direct `given/when/then` execution before extracting specifications
- Request/response specification boundaries and immutable specification construction
- Authentication architecture with explicit caller identity and credential redaction
- Jackson serialization/deserialization, typed DTOs and dynamic JSON tradeoffs
- REST Assured filters for correlation and sanitized diagnostics
- Thin product API clients versus generic REST god-clients
- Negative testing, protected-state assertions, duplicate delivery and idempotency
- Grow typed Steward API clients, Jackson models and AssertJ assertions
- API test design
- Authentication/authorization tests
- Schema/contract validation
- Database assertions
- Integration boundaries
- Contract testing concepts
- Mocking/service virtualization

## Module 6 — Automation Framework Engineering
- Java 17+ test-project structure and Maven lifecycle
- JUnit 5 fundamentals, lifecycle, parameterized tests, tags and extensions
- Framework architecture and dependency direction
- Validated environment/configuration model
- Test-data builders, isolation and deterministic cleanup
- REST Assured API clients and request/response specifications
- Jackson DTO/JSON mapping and AssertJ assertions
- Decide whether each scenario actually requires browser evidence
- Playwright Java runtime ownership: Playwright → Browser → BrowserContext → Page
- BrowserContext session isolation versus shared backend-data isolation
- DOM and accessibility-tree semantics; role/label/test-id locator policy
- Playwright actionability, auto-waiting and web-first assertions
- SPA navigation, network observation and application-readiness signals
- Cookies, local/session storage and secure authentication-state reuse
- Playwright Java browser/context lifecycle after the API/framework substrate exists
- UI abstractions/Page Objects and component objects where appropriate
- Logging, Allure reporting and diagnostic evidence
- Screenshots/traces/video only where diagnostically useful
- Parallel execution, collision-safe data and test isolation
- Retry/quarantine strategy and flaky-test risks
- Maintainability, public APIs and framework ownership
- Identify candidate reusable infrastructure for a future `tsa-test-core` extraction; do not extract before the two-consumer gate
- Define the future versioned Maven/Nexus publication and compatibility contract for `tsa-test-core`
- SLF4J logging architecture, levels, execution context and secret redaction
- Stable run/test/attempt identity across logs, API evidence, browser artifacts and reports
- Failure taxonomy: product, automation/framework, environment/infrastructure and precondition
- Allure as evidence presentation: meaningful steps, metadata, sanitized attachments and stable history identity
- Artifact capture, sensitivity, naming and retention policy
- Retry eligibility with first-attempt evidence preservation and mutation safety
- Flake measurement using first-pass/recovered outcomes
- Quarantine ownership, visibility, aging and exit criteria
- Operability indicators beyond pass percentage
- **Operability milestone:** diagnose a simulated unattended mixed API/browser regression run from evidence alone


## Module 7 — Browser and Environment Testing
- Browser differences
- Responsive testing
- Cross-browser strategy
- BrowserStack or equivalent cloud test infrastructure
- Local vs remote execution

## Module 8 — Reusable Test Infrastructure and Internal Distribution
- Audit the proven API/browser/configuration/evidence infrastructure for genuine cross-project reuse
- Keep Steward clients, contracts, page objects, workflows and business assertions local
- Keep approved generic candidates inside `steward-tests` until a genuine second consumer proves the boundary
- Define a small intentional public API and compatibility policy
- Build a versioned Maven JAR
- Prepare Nexus coordinates, versioning and compatibility evidence for later extraction/publication
- Prove consumer compatibility before promotion

## Module 9 — Non-functional Quality
- Performance concepts
- Load/stress/spike/endurance distinctions
- Basic accessibility testing
- Compatibility
- Reliability-oriented tests

- Performance measurement model: latency distributions, throughput, errors, saturation and warm-up
- k6 VUs, iterations, scenarios, closed versus arrival-rate/open workload models
- k6 checks versus thresholds and evidence-backed threshold selection
- Performance experiment validity: release/environment/dataset/generator identity and comparable-run discipline
- Accessibility automation plus keyboard/manual semantic evidence; no scanner-only accessibility claims
- Compatibility-contract engineering and risk-based reduction of combinatorial matrices
- Controlled dependency failure through recovery with post-failure state-integrity evidence
- Non-functional execution cadence: merge request versus scheduled versus release/manual evidence
- **Measurement milestone:** defend workload, environment, interpretation and limitations—not just the resulting number

## Module 10 — Quality in Containers and CI/CD
- Testcontainers Java lifecycle and JUnit integration
- PostgreSQLContainer and container-derived connection configuration
- Testcontainers vs Docker Compose vs deployed/UAT environment boundaries
- Container readiness, cleanup, version pinning and test-data isolation
- GitLab Runner execution model and runner/environment assumptions
- GitLab CI/CD `rules`, `needs`, caches, artifacts, reports and protected/masked variables
- Test containers/environments
- Running tests against Dockerized services
- Ephemeral test environments concepts
- Test stages in pipelines
- Parallelization
- Reports/artifacts
- Quality gates
- Test selection
- Failure triage

## Labs
- Write Steward API quality strategy
- Build the Steward Java/Maven automation platform from first principles with JUnit 5, REST Assured and Playwright Java
- Add API and UI/system tests as applicable
- Execute against Docker environment
- Add BrowserStack cross-browser execution where applicable
- Add automated tests to existing pipeline
- Publish reports/evidence
- Add meaningful quality gates

## Milestone
**Steward Quality Platform** — documented test strategy plus maintainable automation framework integrated into the delivery pipeline and capable of testing the real containerized application.

---

# 08 — Security Steward

## Purpose
Move from trustworthy quality evidence to adversarial security engineering: model assets and trust boundaries, reproduce weaknesses only in controlled systems, harden application/platform/supply-chain identity boundaries, verify controls, and defend residual risk.

> Transition contract: [`security-steward-transition-audit.md`](./security-steward-transition-audit.md). Security Steward reuses HTTP/Linux/Docker/GitLab/JWT/testing mechanics learned earlier and applies them to attacker capability, exploitability, trust and layered controls rather than reteaching their functional operation.

## Module 1 — Security Foundations
- Confidentiality, integrity and availability
- Assets, threats, vulnerabilities, controls and risk
- Attack surface and trust boundaries
- Least privilege and defense in depth
- Preventive, detective and corrective controls
- Risk treatment and residual risk

## Module 2 — Threat Modeling
- Assets and actors
- Data flows and trust boundaries
- Threat identification and STRIDE-style thinking
- Abuse cases
- Risk prioritization
- Mitigation design
- Living threat models

## Module 3 — Web and API Threats
- Injection/SQL injection, XSS and CSRF
- Broken authentication and token/session attacks
- Broken authorization/IDOR
- SSRF, path traversal and file-upload risks
- Command injection and insecure deserialization concepts
- Security misconfiguration and secrets exposure
- API abuse and rate limiting
- Cryptographic failures
- Vulnerable dependencies
- Logging/monitoring failures
- Mass assignment/excessive exposure
- Exploit preconditions, impact and bypass paths—not only negative test cases

## Module 4 — Practical Vulnerability Laboratory
- Isolated vulnerable applications and safe lab networking
- Intercepting/proxying and observing behavior
- Reproduce representative attacks only in learner-controlled systems
- Capture reproducible evidence
- Develop mitigation hypotheses
- Retest and write actionable findings

## Module 5 — Application Security Engineering
- Secure authentication lifecycle
- Authorization design and object-level enforcement
- Input validation and safe APIs
- Secure error handling
- Secrets lifecycle
- Security headers/configuration
- Security logging/audit evidence
- Abuse resistance/rate limiting
- Data protection
- Security-focused code review
- Abuse cases and negative security requirements
- Durable security regression testing using the existing quality platform

## Module 6 — Linux and Network Security
- Users/groups/permissions and sudo boundaries
- SSH hardening
- Host firewalling and service exposure
- Patch/update windows
- File/secret permissions
- Logging/auditing
- Segmentation and administrative boundaries
- TLS/certificate configuration

## Module 7 — Container and Delivery Security
- Container attack surface and runtime permissions
- Minimal/trusted base images and image scanning
- Delivery secrets and GitLab CI identities/least privilege
- Protected environments and approval boundaries
- Dependency scanning and contextual remediation
- SAST/DAST as complementary evidence
- Software supply-chain threats
- Dependency confusion, typosquatting and malicious packages
- Nexus/internal repository trust boundaries
- Package provenance/integrity
- SBOMs
- Security gates/exceptions
- Protecting internal publishing credentials and `tsa-test-core` consumption

## Module 8 — Artifact Signing and Verification
- Artifact identity, digests and signatures
- Sigstore/Cosign concepts and trust model
- Signing Steward artifacts
- Consumer verification
- Enforcement/failure behavior

## Module 9 — Identity and Secrets Security
- Identity/trust boundaries
- OAuth 2.0 / OpenID Connect concepts
- Keycloak/federated identity
- Service/workload identity
- Token validation and audience/issuer boundaries
- Secret lifecycle and rotation
- Gateway identity boundaries
- Domain authorization remains in Steward

## Module 10 — Vault and Dynamic Secrets
- Vault architecture and trust
- Authentication methods
- Policies
- Static versus dynamic secrets
- Short-lived database/service credentials
- Rotation/revocation and audit evidence

## Module 11 — Internal PKI and Machine Trust
- PKI hierarchy and trust roots
- Certificates and key lifecycle
- Internal issuance
- TLS/mTLS concepts
- Rotation and revocation
- Machine/workload trust implementation

## Module 12 — Enterprise Directory Federation
- Enterprise directory concepts
- Federation boundaries
- Group/claim mapping
- Authentication versus domain authorization
- Failure/bypass analysis

## Module 13 — Secure File Transfer Migration
- FTP threat model
- SFTP/SSH trust and host-key verification
- Key lifecycle and least privilege
- Migration/rollback evidence
- Secure operational transfer design

## Labs
Use deliberately vulnerable applications only in isolated learning infrastructure. Apply findings to Steward through explicit requirements, code/configuration changes and positive/adversarial retest evidence. Reuse the Java quality platform where durable regression automation adds value.

## Milestone
**Steward Security Assessment and Hardening** — living threat model, controlled assessment, reproducible findings, application/host/container/delivery/identity hardening, supply-chain and machine-trust controls, durable regression evidence, and a defended residual-risk register.

---

# 09 — Reliability Engineer

## Purpose
Operate Steward under uncertainty and failure. Reliability is engineering of user-visible service behavior, recovery and operational decision-making—not installation of monitoring products.

## Module 1 — Reliability and SRE Foundations
- Reliability as a quality attribute
- Availability, failure and recovery
- SRE principles and toil
- Risk/reliability trade-offs and ownership

## Module 2 — Service Level Engineering
- User journeys and service boundaries
- SLIs, SLOs and SLAs
- Error budgets
- Windowing and meaningful targets
- Release/risk decisions driven by objectives

> Reliability intent comes before instrumentation: define what must be reliable before deciding which telemetry to collect.

## Module 3 — Observability
- Observability vs monitoring
- Logs, metrics and traces
- Telemetry design and correlation/context
- Instrumentation and OpenTelemetry
- Golden signals
- Telemetry cost/noise
- Tracing-backend architecture decision

## Module 4 — Production Logging
- Structured logs and levels
- Correlation/request/trace context
- Diagnostic usefulness vs noise
- Privacy/security and retention
- Centralized logging architecture decision
- Graylog implementation boundary used by the Steward reliability program

## Module 5 — Metrics, Prometheus and Grafana
- Metric types and application/infrastructure metrics
- Prometheus architecture/exporters/discovery
- PromQL and recording rules
- Grafana and dashboard design
- Nexus/platform and delivery metrics

## Module 6 — Distributed Tracing
- Trace/span/context model
- OpenTelemetry instrumentation
- propagation across Steward boundaries
- Tempo as the selected implementation path
- trace/log/metric correlation and diagnostic evidence

## Module 7 — Observability Stack Integration
- Cross-signal navigation
- consistent service/release/environment identity
- symptom → metric → trace → log investigation
- gaps, cost and ownership

## Module 8 — Alerting and On-call
- Symptoms vs causes
- actionable alerts and alert fatigue
- severity/escalation/routing
- runbooks and handover
- SLO-aware alerting

## Module 9 — Alertmanager Operations
- routing, grouping and inhibition
- receivers and notification behavior
- HA/availability expectations where justified
- firing/resolution evidence

## Module 10 — Database Stewardship
- PostgreSQL roles/privileges and connections
- slow queries/plans
- locks/deadlocks
- safe migrations
- backup/restore, RPO/RTO
- capacity and health

## Module 11 — Performance and Capacity
- latency/throughput/saturation
- bottlenecks and baselines
- load/stress evidence
- capacity planning and headroom
- queueing/contention
- artifact/platform capacity

## Module 12 — Resilience and Distributed Failure
- timeouts, retries, backoff and jitter
- circuit breakers and idempotency
- partial/dependency/cascading failure
- queues/backpressure
- graceful degradation and retry storms
- dependency reliability budgets

## Module 13 — Data Protection and Disaster Recovery
- backup integrity and restore testing
- RPO/RTO
- database recovery
- artifact repository recovery
- configuration/infrastructure recovery
- measured recovery evidence

## Module 14 — Incident Management
- detection and triage
- roles/communication/mitigation
- timeline and decision records
- root cause and contributing factors
- blameless postmortems
- corrective actions and near misses

## Module 15 — Fault Injection and Reliability Experiments
- hypothesis and steady state
- blast radius/abort controls
- process/container/resource/dependency/database failures
- artifact-repository failure
- recovery verification
- chaos-engineering principles and safety

## Module 16 — Reliability Engineer Milestone
**Steward Reliability Program** — defend SLOs, cross-signal observability, actionable alerts, PostgreSQL/data recovery, capacity boundaries, resilience controls, incident response and controlled failure evidence across Steward and its active platform dependencies.

---

# 10 — Architect

## Purpose
Develop the ability to make, challenge and defend architecture decisions under competing constraints. Architecture is not synonymous with microservices, cloud products or diagramming. Simplifying or retaining the current system is a first-class architectural outcome.

## Module 1 — Architecture Fundamentals
- Architecture vs design
- Drivers, constraints and quality attributes
- Trade-offs and fitness for purpose
- Evolution and architecture documentation

## Module 2 — Domain Modeling
- Business language and domain boundaries
- Entities, value objects and aggregates
- Invariants and transaction boundaries
- Bounded contexts/context maps
- When DDD is and is not worth its cost

## Module 3 — Modularity
- Coupling and cohesion
- Dependency direction and encapsulation
- Package/module ownership
- Shared-library boundaries
- Modular monoliths
- Service boundaries and distributed-monolith risk

## Module 4 — Architectural Styles
- Layered and hexagonal/ports-and-adapters concepts
- Modular monoliths
- SOA/microservices
- Event-driven architecture
- Serverless
- Distribution cost
- Choosing rather than collecting styles

## Module 5 — Data Architecture
- Data ownership and schema boundaries
- Transactional consistency
- Duplication/derived views/read models
- Caching
- Database-per-service trade-offs
- Migration/evolution and audit/history

## Module 6 — Integration and Messaging
- Integration styles and synchronous APIs
- Asynchronous messaging
- Queues vs publish-subscribe
- Commands vs events
- Delivery semantics and idempotency
- Contract evolution
- Backpressure/failure
- When not to add a broker

## Module 7 — Scalability and Distributed Systems
- Vertical vs horizontal scaling
- Statelessness and load distribution
- Caching/contention
- Replication and partitioning
- CAP/consistency reasoning
- Coordination/distributed failure
- Measured demand before distribution

## Module 8 — Resilience Architecture
- Designing for failure
- Timeouts/retries and retry storms
- isolation/bulkheads/circuit breakers
- redundancy and graceful degradation
- failure-domain and recovery consequences
- architecture changes validated with Reliability evidence

## Module 9 — Architecture Evaluation and Governance
- ADRs and architecture reviews
- scenario-based evaluation
- fitness functions and evolutionary architecture
- standards with contextual exceptions
- technology selection and build-vs-buy
- architecture debt
- governance without bottlenecks
- dependency/package governance
- steward-common and tsa-test-core review

## Module 10 — Architect Milestone
**Steward Architecture Evolution** — reconstruct the current system, evaluate retain/change/simplify options, implement the smallest justified improvement and defend both retained and rejected complexity.

A valid outcome can retain a modular monolith, shared PostgreSQL, RabbitMQ or the current platform when evidence supports them. Unnecessary microservices, brokers, caches, databases, service meshes or orchestration layers are architecture failures rather than maturity badges.

---

# 11 — Technical Steward

## Purpose
Expand from engineering systems to stewarding technology over time: strategy, capability investment, standards, governance, risk, controls, decisions, people and long-term technical health. The school connects engineering evidence to organizational choices without becoming generic business management.

## Module 1 — Technical Leadership
- Technical ownership
- Influence without authority
- Decision-making
- Communication
- Mentoring
- Technical reviews

## Module 2 — Engineering Governance
- Governance vs management
- Decision rights
- Accountability
- Policies, standards, procedures and guidelines
- Exception processes
- Governance without unnecessary bureaucracy

## Module 3 — IT and Technology Governance
- Business/technology alignment
- Value delivery
- Resource stewardship
- Performance oversight
- Governance structures
- COBIT concepts
- ITIL/service-management concepts
- ISO management-system concepts
- NIST framework landscape

## Module 4 — Technology Strategy and Capability Planning
- Technology outcomes and planning horizons
- Strategic choices and explicit non-choices
- Technology capability mapping
- Investment and prioritization
- Build/buy/learn/simplify/retire decisions
- Evidence-gated roadmaps and reconsideration triggers

## Module 5 — Technology Risk
- Risk identification
- Likelihood/impact
- Inherent vs residual risk
- Risk appetite/tolerance concepts
- Risk treatment
- Risk acceptance
- Risk registers
- KRIs

## Module 6 — Controls, Compliance and Assurance
- Preventive/detective/corrective controls
- Control objectives
- Control design
- Control effectiveness
- Evidence
- Testing controls
- Compliance vs security
- Audit fundamentals
- Remediation tracking

## Module 7 — Architecture Governance
- Architecture principles
- Standards
- Technology selection
- Architecture review
- Exceptions
- Lifecycle management

## Module 8 — Security and Data Governance
- Security governance
- Roles and accountability
- Policy hierarchy
- Data ownership
- Classification concepts
- Retention/privacy concepts
- Access governance

## Module 9 — Change and Service Governance
- Change risk
- Change controls
- Release governance
- Service ownership
- Incident/problem/change relationships
- Operational readiness

## Module 10 — Third-party and Technology Lifecycle Risk
- Vendor assessment
- Dependency risk
- SaaS/cloud considerations
- End-of-life technology
- Exit/continuity considerations

## Module 11 — Technical Debt and Engineering Health
- Identifying debt
- Measuring/communicating debt
- Prioritization
- Engineering health metrics
- KPIs vs KRIs
- Sustainable remediation

## Module 12 — Engineering Handbook and Standards
- Writing standards people can use
- Runbooks and playbooks
- Decision records
- Review checklists
- Knowledge stewardship

## Labs
The learner governs the platform built in previous schools: create policies/standards, risk register, controls, evidence, architecture review, change process, vendor assessment scenario, technical-debt assessment and handbook entries.

## Milestone
**Technical Stewardship Review** — governance pack and simulated review of the Steward platform covering architecture, risk, controls, change, security, reliability, technical debt, ownership and evidence.

---

# 12 — Professional Engineer

## Purpose
Prove independent engineering judgment. The learner now receives a problem and constraints rather than a tutorial sequence.

This school deliberately reduces hand-holding.

## Module 1 — Professional Practice and Ethics
- Public interest and foreseeable harm
- Privacy and responsible data practice
- Limits of competence and uncertainty
- Responsible escalation and professional dissent
- Traceability and accountability

## Module 2 — Problem Discovery
- Stakeholders
- Requirements
- Constraints
- Ambiguity
- Quality attributes
- Risk

## Module 3 — Engineering Proposal
- System design
- Architecture decisions
- Delivery plan
- Quality strategy
- Security strategy
- Reliability strategy
- Operational model
- Cost model
- Governance considerations

## Module 4 — Independent Build
The learner creates a **second substantial system from a blank repository**. It must not simply clone Steward API. The project should force meaningful decisions across software, data, infrastructure, delivery, quality, security and operations.

## Module 5 — Production Readiness
- Deployment
- Observability
- Security assessment
- Performance evidence
- Backup/recovery
- Runbooks
- Risk/control evidence

## Module 6 — Engineering Portfolio and Reflective Practice
- Claim-to-evidence portfolio
- Reflective practice and changed decisions
- Continuing professional development based on evidence gaps

## Module 7 — Engineering Defence
- Present architecture
- Explain trade-offs
- Demonstrate evidence
- Defend decisions
- Respond to review challenges
- Identify limitations and future evolution

## Capstone requirements
The final system must include evidence of:
- requirements and system modeling
- substantial implementation
- relational/data design
- authentication/authorization where appropriate
- automated tests
- reproducible environments
- CI/CD
- infrastructure
- security engineering
- observability
- reliability engineering
- architecture decisions
- documentation/runbooks
- technology risk/governance thinking
- cost awareness

## Final portfolio
- Source code
- Running system
- Architecture portfolio
- ADRs
- Infrastructure definitions/configuration
- CI/CD evidence
- Automation framework/test evidence
- Security assessment
- Dashboards/SLOs
- Runbooks
- Recovery evidence
- Risk/control artifacts
- Engineering handbook contributions
- Capstone presentation and defence

## Final milestone
**Professional Engineering Capstone and Defence** — independently take a non-trivial system from ambiguous problem to demonstrably operable engineering product and defend the decisions using evidence.

---

# Cross-journey progression

The continuing Steward system evolves approximately as follows:

1. Engineering reasoning
2. Advanced local Python/Django/PostgreSQL API
3. Modeled and documented system
4. Linux-hosted service and physical homelab
5. Containerized, automated delivery platform
6. Internet-facing VPS/cloud environment
7. Quality-engineered system and automation framework
8. Threat-modeled, assessed and hardened system
9. Observable and reliability-engineered service
10. Architecturally evaluated and deliberately evolved system
11. Governed technology service
12. Independent second-system capstone

# Curriculum design constraints

- Do not reduce schools to certification exam objectives.
- Certifications may reinforce the journey but do not define it.
- Prefer labs that operate on real TSA systems over disposable toy exercises.
- Use isolated intentionally vulnerable systems for offensive security practice.
- New technology must solve a learning or system problem; do not add tools merely for résumé breadth.
- Advanced topics should be taught when prerequisites make them understandable.
- Milestones must require synthesis rather than checklist completion.
- Full lessons will eventually combine TSA-authored teaching with researched primary/official documentation, books, high-quality articles, courses and videos.
- Lesson resources and exercise resources are selected independently and should not be duplicated without a reason.
- Practice labs are a first-class TSA platform capability, not supplementary content.
- Portfolio artifacts should be real evidence that can be reviewed by another engineer.

# Status

**Specification:** v1 draft

**Current implementation:** Engineering Apprentice / Engineering Foundations skeleton and core learning-runtime capabilities.

**Current strategy:** finish the curriculum and product hierarchy wide, then build lessons deep from the beginning of the journey.