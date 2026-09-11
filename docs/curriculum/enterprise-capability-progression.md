# Enterprise Capability Progression

## Purpose

TSA prepares engineers to reason about and operate realistic enterprise systems without becoming a catalogue of disconnected products. Enterprise technologies enter the journey only when they teach a distinct engineering capability and when the learner has enough prior knowledge to understand the problem the technology solves.

This specification records the enterprise-readiness amendment discovered during the Content Quality phase. It is a cross-journey contract: later lesson authoring and platform implementation must preserve the progression described here.

## Governing principles

### One strong implementation per capability

**One strong implementation for each important engineering capability; alternatives are taught conceptually and through architectural comparison.**

TSA does not optimize for the largest possible tool list. The learner should become capable with one representative implementation, understand the underlying engineering model, and be able to evaluate alternatives.

### Steward creates the reason to learn infrastructure

**New infrastructure exists because Steward develops a problem or operational requirement that requires it.**

A technology must not be attached to Steward merely because it is popular. The curriculum should first establish the problem, constraint, failure mode or scale/operational need; the learner then evaluates the capability, implements the chosen technology, gathers evidence and records the new trade-offs and failure modes.

### Budget-conscious enterprise learning

The primary learning path must remain practical for a learner without enterprise software subscriptions or a large cloud budget. Prefer local, self-hosted and open-source implementations where they teach the same transferable concepts. Paid managed services may be compared conceptually or used optionally, but they are not prerequisites for completing TSA.

## Enterprise reference stack

| Capability | Primary TSA implementation | Alternatives / comparisons |
| --- | --- | --- |
| Enterprise Linux | Rocky Linux | RHEL, AlmaLinux, Ubuntu, CentOS Stream |
| Host automation / configuration management | Ansible | shell automation, other configuration-management approaches |
| Application backend | Python + Django/DRF | alternatives discussed when architecture requires them |
| Relational database | PostgreSQL | managed relational databases and other enterprise RDBMS concepts |
| Cache / fast ephemeral state | Redis | in-process caches and managed cache services |
| Asynchronous messaging | RabbitMQ | Kafka and other broker/event-streaming models |
| Enterprise identity | Keycloak + OIDC/OAuth 2.0 concepts | managed IdPs and enterprise SSO alternatives |
| API gateway | Kong | Nginx/reverse proxy, cloud gateways and other API-management products |
| Source control | Git + GitHub | enterprise Git hosting alternatives |
| CI/CD orchestration | Jenkins | GitHub Actions and other hosted CI/CD systems |
| Artifact/dependency repository | Nexus-style private repository | other artifact/package registries |
| Containers | Docker, with Podman concepts where useful | OCI-compatible alternatives |
| Infrastructure as Code | OpenTofu, teaching Terraform language/model concepts | Terraform and provider-managed IaC alternatives |
| Container orchestration | Kubernetes | managed Kubernetes offerings |
| Enterprise application platform | OpenShift | vanilla/managed Kubernetes and other platforms |
| GitOps | Argo CD | pipeline-push deployment and other reconciliation tools |
| Secrets management | secrets-lifecycle concepts plus a self-hosted Vault-style implementation where practical | cloud secret managers and platform-native secret stores |
| Metrics | Prometheus | managed metrics platforms |
| Visualization | Grafana | enterprise observability suites |
| Logs | TSA-selected centralized logging stack | Loki/ELK/OpenSearch-style alternatives |

The table identifies teaching defaults, not permanent architectural mandates. Architect and Technical Steward must be able to challenge these choices using evidence.

## Cross-school progression

### Builder — application and data foundations

Builder remains intentionally application-focused. Steward API v1 uses PostgreSQL and develops enough relational depth to support later operational work.

Relational Data & PostgreSQL must include the foundations a software engineer needs to collaborate intelligently with database specialists: schema design, constraints, transactions, isolation/concurrency foundations, indexes, query plans, performance, ORM behavior and migration safety.

Do not turn Builder into a DBA course. Operational database administration deepens later when the learner has a deployed system to operate.

### System Thinker — distributed-system pressure and integration models

System Thinker must introduce the reasoning needed before adding distributed infrastructure.

Steward should develop justified scenarios for:

- caching and cache invalidation;
- synchronous versus asynchronous communication;
- queues, events and background processing;
- producer/consumer responsibilities;
- acknowledgements and delivery semantics;
- retries and backoff;
- duplicate delivery and idempotency;
- dead-letter queues;
- ordering;
- eventual consistency;
- failure boundaries and coupling.

**Redis** is the primary cache implementation. The learner must measure or demonstrate why caching is useful, choose what may be cached, define TTL/invalidation behavior and investigate stale-cache and cache-unavailable scenarios.

**RabbitMQ** is the primary messaging implementation because it exposes queues, exchanges/routing, acknowledgements, retries, dead-lettering and competing consumers clearly. Kafka is taught as an important alternative with a different event-stream/log model, including partitions, consumer groups, retention and replay. A later architecture exercise should require a reasoned RabbitMQ-versus-Kafka decision.

Steward may publish meaningful domain/integration events such as `ServiceRegistered`, `ServiceOwnershipChanged`, `ServiceLifecycleChanged` and `ServiceRetired` only where a real consumer exists. Suitable consumers include an audit worker or notification worker. Events must not be added solely to make the architecture look distributed.

### Platform Builder — enterprise Linux and networking

Rocky Linux becomes TSA's primary server distribution for Platform Builder labs. The curriculum teaches transferable Linux fundamentals while deliberately exposing RHEL-family administration conventions.

The learner should become comfortable with:

- package management with DNF/RPM concepts;
- users, groups and permissions;
- systemd and journald;
- storage and mounts;
- SSH;
- firewalld;
- SELinux concepts and practical troubleshooting;
- processes, services and scheduled work;
- networking and DNS;
- patching and operating-system lifecycle;
- logs and evidence-driven troubleshooting.

RHEL is taught conceptually as the enterprise commercial distribution; AlmaLinux, Ubuntu and CentOS Stream are compared. No RHEL subscription is required.

Networking depth must be sufficient to troubleshoot real service-to-service failures: IP addressing, subnetting, routing, DNS, NAT, TCP/UDP, ports/sockets, TLS, firewalls, proxies/reverse proxies, load balancing, gateways, service discovery and later network policies. Labs should use tools such as `curl`, `dig`, `ss`, `ip`, `nc`, `openssl s_client`, `traceroute` and `tcpdump` where appropriate.

### Delivery Engineer — CI/CD, configuration and artifact lifecycle

CI/CD concepts remain tool-independent first, then **Jenkins** becomes the primary self-hosted enterprise implementation. GitHub Actions remains a comparison/secondary implementation rather than disappearing from the curriculum.

The Jenkins progression should cover:

- controller/agent architecture;
- executors and build isolation;
- jobs versus pipelines;
- Pipeline as Code and `Jenkinsfile`;
- declarative versus scripted pipeline concepts;
- stages, steps, conditions and parallelism;
- credentials and secret injection;
- webhooks/triggers;
- caching and artifacts;
- test/report publication;
- shared libraries concepts;
- failure diagnosis and recovery;
- pipeline security and least privilege.

Steward's delivery pipeline should build, test, scan, package, publish internal dependencies to the private artifact repository, build the container image and produce deployment evidence.

**Ansible** becomes the primary configuration-management implementation after the learner has experienced manual Linux administration and shell automation. Learners use inventories, playbooks, variables, templates, handlers and roles to configure Steward infrastructure idempotently and investigate configuration drift.

### Cloud Engineer — IaC, gateway, orchestration and enterprise platform

Infrastructure as Code uses **OpenTofu** as the primary no-subscription implementation while teaching Terraform's declarative model, HCL ecosystem, providers, state, plan/apply lifecycle, variables, outputs and modules. Cloud-provider usage must remain budget-conscious; local/homelab and low-cost VPS targets are valid where they teach the capability.

The learner must distinguish a reverse proxy, load balancer, API gateway, Kubernetes ingress and application server.

**Kong** becomes the primary API-gateway implementation. The gateway progression covers:

- edge routing and upstreams;
- TLS termination/placement trade-offs;
- authentication integration/enforcement boundaries;
- rate limiting;
- CORS and request/response policies;
- correlation/request IDs;
- API/version/path routing;
- gateway logs and metrics;
- gateway failure modes;
- what must remain application/domain logic.

Steward is exposed through Kong and the learner must prove that domain authorization and business invariants remain owned by Steward rather than being misplaced into gateway configuration.

Kubernetes remains the orchestration foundation. **OpenShift** is taught after Kubernetes as an enterprise application platform, not as a duplicate Kubernetes course. Learners compare Projects/namespaces, Routes/Ingress, Operators/OLM, security controls such as SCC concepts, RBAC, registry/build/deployment integrations and the `oc` workflow. A practical migration/deployment of Steward should identify what remains standard Kubernetes, what OpenShift adds and what operational/security assumptions change.

**Argo CD** introduces GitOps after the learner understands pipeline-driven deployment. Jenkins remains responsible for build/test/package/publish concerns; Argo CD reconciles declared environment state from Git to Kubernetes/OpenShift. The curriculum must explicitly compare push-based pipeline deployment with pull/reconciliation-based GitOps.

### Security Steward — enterprise identity and secrets lifecycle

Application authentication from Builder evolves into enterprise identity.

**Keycloak** is the primary self-hosted identity provider. The learner should understand:

- identity provider responsibilities;
- OAuth 2.0 and OpenID Connect roles and flows at an engineering level;
- realms/tenants concepts;
- clients;
- users, groups and roles;
- SSO;
- token validation;
- service/workload identities;
- federation concepts;
- mapping enterprise identity into application authorization.

A target architecture may evolve toward `User → Keycloak → Kong → Steward`, while Steward retains domain authorization such as team membership, ownership and object-level permissions.

Secrets work must progress beyond `.env`. Teach classification, storage, access control, injection, rotation, revocation, auditability, short-lived credentials/workload identity concepts, and avoiding secrets in Git, images, CI logs and artifacts. A self-hosted Vault-style implementation may be used where practical, but no paid secrets service is a completion requirement.

### Reliability Engineer — operate the whole platform

Observability must cover the expanded system, not only the Django process. Learners should observe and reason about Steward, PostgreSQL, Redis, RabbitMQ, Kong, Jenkins/deployment components and Kubernetes/OpenShift where present.

Database operations deepen here into a practical **database stewardship / DBA-awareness** strand:

- roles and privileges;
- connection management and pooling;
- slow-query investigation;
- indexes and query-plan evidence under realistic load;
- locks, blocking and deadlock investigation;
- backup strategy;
- restore testing;
- RPO/RTO implications;
- replication and high-availability concepts;
- database metrics and capacity/storage growth;
- safe migrations and operational change.

Learners should perform incidents such as a slow Steward query/database saturation investigation and a controlled backup/restore recovery exercise. The objective is not to graduate as a DBA; it is to become an engineer who understands database operational risk and can collaborate effectively with database specialists.

### Architect — challenge the accumulated stack

Architect must not assume every introduced component belongs in the final architecture. Learners use accumulated evidence to evaluate:

- whether Redis provides enough value for its consistency/operational cost;
- whether asynchronous messaging is justified;
- RabbitMQ versus Kafka for a stated workload;
- whether Kong is needed or a simpler edge component is sufficient;
- Jenkins versus hosted CI/CD trade-offs;
- Kubernetes versus OpenShift versus simpler hosting;
- push deployment versus GitOps;
- self-managed versus managed data/identity/secrets infrastructure;
- when a modular monolith remains preferable to service decomposition.

Removing unnecessary infrastructure is a valid—and often strong—architecture decision.

## Steward evolution guardrail

The mature learning environment may eventually contain:

```text
Users
  |
  v
Keycloak ---- OIDC ----> Kong
                         |
                         v
                     Steward API
                      /   |    \
                     /    |     \
             PostgreSQL  Redis  RabbitMQ
                                  |
                           background consumers

Git ---> Jenkins ---> tests/scans ---> private artifact repository / registry
                                            |
                                            v
OpenTofu ---> infrastructure            OpenShift
Ansible  ---> host/configuration            ^
                                             |
Environment Git ---> Argo CD ----------------+

Prometheus ---> Grafana
central logs / traces ---> operational investigation
```

This diagram is a capability map, **not a requirement that every component must remain in the final production architecture**. Steward stays a credible product rather than a technology demo. Each addition needs a curriculum-established reason, measurable or inspectable evidence, documented trade-offs and an explicit failure model.

## Cost guardrail

The core path should be completable with learner-owned hardware/VMs, containers and free/open-source software. Low-cost VPS/cloud usage may be introduced when public infrastructure itself is the learning objective, but labs should have local alternatives wherever practical. No RHEL, managed Terraform, managed identity, managed messaging, managed Redis, managed OpenShift or commercial observability subscription is required.

## Content Quality implication

This amendment does not trigger a wholesale rewrite of already strong schools. During Content Quality, each affected school is audited against this specification. Existing strong lessons are preserved; missing capabilities are added at the correct prerequisite point; generic exercises are replaced only where they prevent meaningful practice.

The progression remains:

**problem/context → mental model → implementation/experiment → failure or alternative → evidence → review/decision.**
