# Enterprise Implementation Depth Audit

## Purpose

This audit extends TSA's Steward requirements audit with a stricter question: for each important enterprise capability, does the learner merely learn or design it, or must they actually implement, integrate, break, operate and reassess it?

TSA keeps strong scaffolding in the early Builder stage intentionally. Difficulty increases as engineering ownership grows; early specificity is not itself a curriculum defect.

## Implementation-depth standard

A mature hands-on capability should progress through as many of these stages as the learning objective justifies:

1. **Learn** — understand the problem, model and operating semantics.
2. **Design** — make explicit architecture and responsibility decisions.
3. **Implement** — run the technology or capability against a real Steward requirement.
4. **Integrate** — connect it to Steward and its existing platform rather than leaving an isolated demo.
5. **Break** — introduce controlled failure, security or compatibility pressure.
6. **Operate** — troubleshoot, recover, monitor, rotate, retain or maintain it.
7. **Reassess / migrate** — decide whether it remains appropriate and practise bounded migration where migration itself is valuable learning.

The target is not to force every technology through all seven stages. The target is to prevent important enterprise capabilities from ending at slides, diagrams or decision records when hands-on experience is the educational objective.

## Scenario-forced learning rule

TSA may manufacture a credible Steward business or engineering requirement so an important technology becomes justified and can be implemented. The scenario must create the problem before the technology is treated as the answer.

One primary implementation remains the default for a capability. Alternatives are comparison technologies unless a bounded migration/replacement exercise is itself the learning objective.

## Confirmed strong areas

The audit currently considers the following areas materially hands-on already: PostgreSQL and relational data, Redis, RabbitMQ, Jenkins, Nexus, Docker, Kubernetes, OpenShift migration/platform delta, Argo CD, Kong, Keycloak/OIDC, Prometheus, Grafana, Graylog, backup/disaster recovery, enterprise file services and file-based integration, and LDAP-to-Keycloak workforce identity federation.

Quality automation already has strong framework, CI-stage, report/artifact and quality-gate foundations. The remediation below closes the remaining operational execution gap by making repository-triggered execution, scheduled regression and failure notification mandatory proof rather than implied behavior.

These areas still participate in later architecture reassessment; being strong does not mean they must remain permanently in Steward.

## Remediated: continuous and scheduled automated quality execution

Quality Steward must operate automated testing as a feedback system rather than a collection of suites that a tester starts manually.

Required implementation proof:

- Jenkins starts a real quality run from the repository SCM integration on the agreed push and/or pull-request event;
- change-triggered execution uses a deliberately fast, high-signal portfolio appropriate for merge feedback;
- Jenkins also starts broader regression from a real cron schedule without manual intervention;
- scheduled coverage is allowed to differ from push coverage for explicit risk/cost reasons;
- every run records trigger type, commit/release identity, environment and selected evidence;
- machine-readable results and useful human-readable reports are published and retained;
- relevant failure diagnostics survive failed stages;
- one real learner-owned notification channel receives an actionable failure alert;
- a controlled deterministic test failure proves the pipeline becomes non-green, reports remain available and the notification is actually delivered;
- recovery is demonstrated without deleting the historical failure evidence;
- infrastructure/environment failure, flaky evidence and repeated alerts must not be converted into misleading green results or uncontrolled notification noise.

Manual Build Now remains useful for investigation but cannot be used as evidence that SCM or scheduled automation works.

## Confirmed remediation areas

### Enterprise file services and file-based integration

This remediation has been implemented through the Platform Builder enterprise file-services path and the Steward enterprise file-integration path. NFS is the primary shared-filesystem implementation, Samba/SMB is bounded interoperability exposure, and Steward operates a deliberately legacy FTP batch boundary. Secure FTP-to-SFTP migration remains a later Security Steward continuity exercise rather than a reason to remove the legacy learning pressure early.

### Object storage

Cloud Engineer already teaches object-storage semantics. The gap is implementation depth. TSA must require one real S3-compatible object-storage implementation for a legitimate Steward use case such as exports, evidence bundles, report archives or backup artifacts.

The learner must demonstrate bucket/key design, access policy, lifecycle/retention, successful and denied access, and failure/recovery behavior. The exercise must explicitly compare object semantics with NFS/file semantics and Nexus artifact semantics.

### Enterprise directory services

This remediation has been implemented. Platform Builder now operates a real LDAP homelab directory with secure bind/search and controlled failures, while Security Steward federates that directory into Keycloak and proves OIDC login into Steward. Active Directory/Kerberos/DNS relationships remain essential architecture knowledge rather than a full Windows Server administration detour.

### Distributed tracing

The existing tracing decision gate may legitimately end with no backend. That is architecturally defensible but insufficient for TSA's implementation-depth goal.

TSA must manufacture a cross-boundary Steward diagnostic scenario and require OpenTelemetry instrumentation plus one primary tracing backend. Tempo and Jaeger may be compared; only the selected primary needs permanent implementation. The learner must trace a real request/workflow across meaningful boundaries, introduce latency/failure, use traces to answer a question that logs/metrics answer poorly, and document operational cost and failure behavior.

### Centralized secrets platform

The current curriculum permits a secrets-platform design/prototype without mandatory adoption. TSA must require operating a dedicated secrets platform at least once. Vault is the primary learning implementation unless later evidence changes the product decision.

The exercise should include a real Steward secret lifecycle, preferably short-lived/dynamic credentials where feasible, authentication/authorization to Vault, lease/rotation/revocation evidence, secret non-disclosure, and a controlled Vault-unavailability scenario. Architect may later retain, simplify, migrate or remove the platform.

### Production database schema evolution

Release Engineering already understands migration sets and rollback constraints. TSA must add a live compatibility exercise using an expand/migrate-or-backfill/switch/contract style change while old and new application versions may overlap. The learner must prove compatibility, migration observability, rollback/forward-fix reasoning and final cleanup.

### Progressive delivery

Kubernetes rolling rollout/rollback remains the primary baseline. TSA should require one bounded non-default deployment-strategy implementation, selecting blue/green or canary based on the scenario. The objective is to understand traffic transition, verification, rollback and data/schema compatibility rather than to permanently operate several deployment systems.

### Certificate lifecycle operations

TLS/ACME concepts already exist. TSA must deepen the operational exercise so the learner issues a real learner-owned certificate where feasible, inspects identity/chain/expiry, automates renewal, tests renewal/reload behavior, detects a near-expiry or failed-renewal condition, and verifies recovery without exposing private keys.

## Storage capability boundaries

The curriculum must explicitly preserve these distinctions:

- **block storage** — volume/disk semantics;
- **file storage** — mounted path/directory semantics such as NFS/SMB;
- **object storage** — bucket/key/API semantics;
- **relational storage** — transactional application state in PostgreSQL;
- **artifact repositories** — versioned software/package/image distribution through Nexus;
- **backup storage** — recoverable copies governed by recovery objectives.

Learning several of these does not violate TSA's no-redundancy rule because they solve different storage problems.

## Anti-zoo guardrail

This audit does not justify adding technologies for name recognition. TSA should not permanently operate multiple products that own the same capability merely for exposure. Graylog + Loki + ELK, multiple brokers, multiple CI platforms, multiple gateways or multiple orchestrators remain comparison/migration cases unless a real requirement proves otherwise.

## Remediation order

Completed focused remediations:

1. enterprise file services and file-based Steward integration;
2. LDAP/directory-services homelab and Keycloak/Steward federation;
3. continuous and scheduled automated quality execution with failure feedback.

Remaining focused remediations should proceed in this order:

1. real object-storage implementation;
2. mandatory distributed tracing implementation;
3. mandatory Vault implementation;
4. production schema-evolution exercise;
5. progressive-delivery exercise;
6. certificate-lifecycle operations;
7. FTP-to-SFTP security migration and continuity check;
8. final cross-school continuity and redundancy audit.

Each remediation should update both the relevant curriculum modules and the Steward evolution/product documentation so the exercises remain one coherent product journey.
