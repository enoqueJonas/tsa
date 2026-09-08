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

## Module 3 — Django and API Engineering
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

## Module 4 — Relational Data and PostgreSQL
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
Understand the computing platform beneath applications, progressing from a virtual Linux machine to a budget physical homelab.

## Module 1 — Computer and Operating-System Foundations
- CPU, memory, storage and I/O
- Operating-system responsibilities
- Kernel/user space concepts
- Processes and threads
- Filesystems

## Module 2 — Linux Administration
- Ubuntu Server installation
- Shell fluency
- Files and directories
- Users and groups
- Permissions
- Packages
- Processes
- systemd and services
- Environment and configuration
- Logs and journal
- Scheduled tasks
- Storage and mounts
- SSH and key authentication

## Module 3 — Networking Foundations
- OSI/TCP-IP mental models
- Ethernet
- IP addressing and subnetting
- ARP
- TCP and UDP
- Ports and sockets
- Routing
- DHCP
- DNS
- NAT
- Firewalls
- HTTP/TLS from the network perspective
- Network troubleshooting tools

## Module 4 — Virtualization
- Hypervisors and virtual machines
- VM networking modes
- Virtual disks/resources
- Snapshots and recovery
- Create and administer Ubuntu VMs

## Module 5 — Building the Budget Homelab
- Selecting used/budget hardware
- CPU/RAM/storage/NIC trade-offs
- Power and reliability considerations
- Ethernet switching
- Cabling
- Basic network topology
- Static addressing
- Multiple machines/VMs
- Remote administration
- Firewalling
- Local DNS concepts
- Reverse proxy
- Backups
- Safe exposure and isolation
- VLAN concepts where hardware permits

## Labs
- Create Ubuntu Server VM
- SSH and harden basic remote access
- Diagnose processes/networking
- Run PostgreSQL and Steward API
- Run Steward API as a system service
- Design homelab topology
- Acquire/configure budget homelab hardware
- Connect hosts through a switch
- Move workloads from laptop-only VM into the lab

## Milestone
**Steward Homelab v1** — Steward API operating as a service on learner-managed Linux infrastructure with documented topology, access, networking, service management and backup approach.

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
- GitHub Actions and/or Jenkins
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

## Module 3 — Unit and Component Testing
- Unit-test design
- Isolation
- Test doubles
- Mocks/stubs/fakes
- Coverage and its limitations

## Module 4 — API and Integration Testing
- API test design
- Authentication/authorization tests
- Schema/contract validation
- Database assertions
- Integration boundaries
- Contract testing concepts
- Mocking/service virtualization

## Module 5 — Automation Framework Engineering
- What makes a framework
- Framework architecture
- Playwright with Python
- pytest
- Configuration
- Fixtures
- Test data
- API clients
- UI abstractions/Page Objects where appropriate
- Helpers/utilities
- Assertions
- Markers/tags
- Parameterization
- Logging
- Reporting
- Screenshots/traces/videos
- Parallel execution
- Retry strategy and flaky-test risks
- Maintainability and code quality

## Module 6 — Browser and Environment Testing
- Browser differences
- Responsive testing
- Cross-browser strategy
- BrowserStack or equivalent cloud test infrastructure
- Local vs remote execution

## Module 7 — Non-functional Quality
- Performance concepts
- Load/stress/spike/endurance distinctions
- Basic accessibility testing
- Compatibility
- Reliability-oriented tests

## Module 8 — Quality in Containers and CI/CD
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
- Build Playwright/Python automation framework from first principles
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
Understand common threats by safely observing and reproducing vulnerabilities in controlled labs, then secure the system built throughout TSA.

## Module 1 — Security Foundations
- Confidentiality, integrity and availability
- Assets, threats, vulnerabilities and risk
- Attack surface
- Least privilege
- Defense in depth
- Trust boundaries

## Module 2 — Threat Modeling
- Assets and actors
- Data flows
- Trust boundaries
- Threat identification
- STRIDE-style thinking
- Risk prioritization
- Mitigations

## Module 3 — Web and API Threats
- Injection and SQL injection
- Cross-site scripting
- CSRF
- Broken authentication
- Broken authorization/IDOR
- SSRF
- Path traversal
- File upload risks
- Command injection
- Insecure deserialization concepts
- Security misconfiguration
- Sensitive data/secrets exposure
- API abuse
- Rate limiting
- Token/session attacks
- Cryptographic failures
- Vulnerable dependencies
- Logging/monitoring failures

## Module 4 — Practical Vulnerability Laboratory
- Isolated vulnerable applications
- Safe lab networking
- Observe vulnerability behavior
- Reproduce representative attacks in the lab
- Analyze evidence
- Implement mitigation
- Retest

## Module 5 — Linux and Network Security
- Users/permissions
- SSH hardening
- Firewalling
- Service exposure
- Patch management
- Privilege concepts
- Logging/auditing
- Network segmentation concepts

## Module 6 — Container and Delivery Security
- Container attack surface
- Image scanning
- Minimal images
- Runtime permissions
- Secrets
- CI/CD permissions
- Dependency scanning
- SAST/DAST concepts
- Supply-chain risks
- Security gates

## Module 7 — Application Security Engineering
- Secure authentication
- Authorization testing
- Input validation
- Secret management
- Secure headers/configuration
- Security logging
- Abuse cases

## Labs
Use deliberately vulnerable applications only in isolated learning infrastructure, then apply defensive lessons to Steward API and its platform.

## Milestone
**Steward Security Assessment and Hardening** — threat model, controlled assessment, findings, remediation, Linux/container/application hardening, pipeline security controls, and retest evidence.

---

# 09 — Reliability Engineer

## Purpose
Learn to operate systems under uncertainty and failure. Reliability is treated as engineering work, not a monitoring dashboard exercise.

## Module 1 — Reliability and SRE Foundations
- Reliability as a quality attribute
- Availability
- Failure and recovery
- SRE principles
- Toil
- Risk and reliability trade-offs

## Module 2 — Observability
- Observability vs monitoring
- Logs, metrics and traces
- Telemetry design
- Correlation/context
- Instrumentation
- OpenTelemetry concepts

## Module 3 — Logging
- Structured logging
- Log levels
- Correlation IDs
- Centralization concepts
- Useful vs noisy logs
- Security/privacy considerations

## Module 4 — Metrics, Prometheus and Grafana
- Counters/gauges/histograms
- Application and infrastructure metrics
- Prometheus architecture
- Exporters
- PromQL fundamentals
- Grafana dashboards
- Dashboard design

## Module 5 — Service Level Engineering
- SLIs
- SLOs
- SLAs
- Error budgets
- Measuring user-visible reliability
- Choosing meaningful objectives

## Module 6 — Alerting and On-call Thinking
- Symptoms vs causes
- Actionable alerts
- Alert fatigue
- Severity
- Escalation
- Runbooks

## Module 7 — Performance and Capacity
- Latency and throughput
- Saturation
- Bottlenecks
- Load/stress testing
- Capacity planning
- Resource utilization
- Database/application bottlenecks
- Performance baselines

## Module 8 — Resilience and Distributed Failure
- Timeouts
- Retries
- Exponential backoff/jitter concepts
- Circuit breakers
- Idempotency
- Partial failure
- Dependency failure
- Cascading failure
- Queue/backpressure concepts
- Graceful degradation

## Module 9 — Data Protection and Disaster Recovery
- Backup strategies
- Restore testing
- RPO/RTO
- Disaster scenarios
- Recovery procedures
- Data durability

## Module 10 — Incident Management
- Detection
- Triage
- Incident roles
- Communication
- Mitigation
- Root-cause analysis
- Blameless postmortems
- Corrective actions

## Module 11 — Fault Injection and Reliability Experiments
- Hypothesis-driven experiments
- Controlled failure injection
- Killing processes/containers
- Resource exhaustion concepts
- Network/dependency failure simulation
- Recovery verification
- Chaos engineering principles and safety

## Labs
- Instrument Steward API
- Deploy Prometheus/Grafana in homelab or VPS environment
- Build dashboards
- Define SLIs/SLOs
- Configure actionable alerts
- Establish performance baseline
- Run load tests
- Perform backup and restore drill
- Inject controlled failures
- Respond to simulated incident
- Produce postmortem and reliability improvements

## Milestone
**Steward Reliability Program** — observable service with SLOs, dashboards, alerts, capacity evidence, tested recovery, runbooks, controlled failure experiment and completed incident/postmortem.

---

# 10 — Architect

## Purpose
Develop the ability to make and defend architecture decisions under competing constraints. Architecture is not synonymous with microservices or diagramming.

## Module 1 — Architecture Fundamentals
- Architecture vs design
- Architecture characteristics
- Constraints
- Trade-offs
- Fitness for purpose

## Module 2 — Modularity
- Coupling and cohesion
- Components/modules
- Dependency direction
- Boundaries
- Modular monoliths
- When distribution is justified

## Module 3 — Architectural Styles
- Layered architecture
- Hexagonal/ports-and-adapters concepts
- Event-driven architecture
- Service-oriented/microservices concepts
- Serverless concepts
- Choosing rather than collecting styles

## Module 4 — Domain Modeling
- Domain boundaries
- Domain-Driven Design fundamentals
- Entities/value objects/aggregates concepts
- Bounded contexts
- Ubiquitous language
- When DDD is and is not worth the cost

## Module 5 — Data Architecture
- Transactional boundaries
- Consistency
- Caching
- Replication concepts
- Partitioning concepts
- Data ownership
- Eventual consistency

## Module 6 — Integration and Messaging
- Synchronous vs asynchronous integration
- Messaging
- Queues
- Events
- Delivery semantics concepts
- Idempotency
- Failure handling

## Module 7 — Scalability and Distributed Systems
- Horizontal/vertical scaling
- Load balancing
- Statelessness
- Caching
- Distributed-system constraints
- CAP theorem as a reasoning tool
- Consistency/availability trade-offs
- Distributed failure

## Module 8 — Resilience Architecture
- Redundancy
- Isolation
- Bulkheads
- Timeouts/retries
- Circuit breakers
- Graceful degradation
- Disaster scenarios

## Module 9 — Architecture Evaluation and Governance
- ADRs
- Architecture reviews
- Architecture fitness functions
- Evolutionary architecture
- Technical debt
- Architecture katas
- Cost/performance/security/reliability trade-offs

## Labs
- Perform architecture katas
- Re-evaluate Steward API characteristics
- Identify scaling and reliability constraints
- Prototype alternative designs
- Introduce messaging/caching only where a scenario justifies them
- Create architecture fitness checks where practical
- Defend keep/change decisions

## Milestone
**Steward Architecture Evolution** — evidence-based architecture assessment and implemented evolution. Keeping a modular monolith is a valid outcome when justified; unnecessary microservices are a failure, not a badge.

---

# 11 — Technical Steward

## Purpose
Expand from engineering systems to stewarding technology: standards, governance, risk, controls, decisions, people and long-term technical health.

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

## Module 4 — Technology Risk
- Risk identification
- Likelihood/impact
- Inherent vs residual risk
- Risk appetite/tolerance concepts
- Risk treatment
- Risk acceptance
- Risk registers
- KRIs

## Module 5 — Controls, Compliance and Assurance
- Preventive/detective/corrective controls
- Control objectives
- Control design
- Control effectiveness
- Evidence
- Testing controls
- Compliance vs security
- Audit fundamentals
- Remediation tracking

## Module 6 — Architecture Governance
- Architecture principles
- Standards
- Technology selection
- Architecture review
- Exceptions
- Lifecycle management

## Module 7 — Security and Data Governance
- Security governance
- Roles and accountability
- Policy hierarchy
- Data ownership
- Classification concepts
- Retention/privacy concepts
- Access governance

## Module 8 — Change and Service Governance
- Change risk
- Change controls
- Release governance
- Service ownership
- Incident/problem/change relationships
- Operational readiness

## Module 9 — Third-party and Technology Lifecycle Risk
- Vendor assessment
- Dependency risk
- SaaS/cloud considerations
- End-of-life technology
- Exit/continuity considerations

## Module 10 — Technical Debt and Engineering Health
- Identifying debt
- Measuring/communicating debt
- Prioritization
- Engineering health metrics
- KPIs vs KRIs
- Sustainable remediation

## Module 11 — Engineering Handbook and Standards
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

## Module 1 — Problem Discovery
- Stakeholders
- Requirements
- Constraints
- Ambiguity
- Quality attributes
- Risk

## Module 2 — Engineering Proposal
- System design
- Architecture decisions
- Delivery plan
- Quality strategy
- Security strategy
- Reliability strategy
- Operational model
- Cost model
- Governance considerations

## Module 3 — Independent Build
The learner creates a **second substantial system from a blank repository**. It must not simply clone Steward API. The project should force meaningful decisions across software, data, infrastructure, delivery, quality, security and operations.

## Module 4 — Production Readiness
- Deployment
- Observability
- Security assessment
- Performance evidence
- Backup/recovery
- Runbooks
- Risk/control evidence

## Module 5 — Engineering Defence
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