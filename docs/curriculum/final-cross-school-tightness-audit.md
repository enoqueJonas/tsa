# TSA Final Cross-School Tightness Audit

## Purpose

This audit is intentionally stricter than earlier completeness reviews. It does not ask only whether a topic exists somewhere in TSA. It asks whether the learner encounters each capability at the right time, implements important enterprise capabilities deeply enough, carries their evidence into the school milestone, and reaches later architecture/governance work without contradictory ownership or permanent duplicate infrastructure.

A curriculum is **tight** only when all of these are true:

1. important prerequisites appear before the work that depends on them;
2. major enterprise capabilities progress beyond reading/design when hands-on operation is the learning objective;
3. school milestones actually verify the strongest work introduced before them;
4. cross-school handoffs describe the system that really exists at that point in the journey;
5. product/evolution documentation matches the executable curriculum;
6. migration exercises end with explicit cutover/rollback/decommission state;
7. one primary technology owns a capability unless temporary coexistence has a bounded reason;
8. later Architect/Technical Steward work reassesses the actual accumulated stack rather than an older snapshot;
9. a topic is not counted as complete merely because a tool name, concept lesson or optional instruction exists;
10. no lesson silently assumes infrastructure that is only introduced in a later school.

## Audit method

The review traced the executable journey and school registries from Engineering Apprentice through Professional Engineer, then inspected the milestone and deep-path contracts for the enterprise capabilities added during the implementation-depth remediation pass.

The review specifically rechecked the kinds of gaps that escaped earlier audits: file servers and managed file transfer, SCM/scheduled automated testing and failure notifications, actual observability backends, secrets lifecycle, certificate renewal, schema migration, progressive delivery and decommissioning.

For each major capability the audit classified prerequisite ownership, implementation depth, milestone coverage, later continuity/reassessment and redundancy/authority boundaries.

## Strong and coherent capability chains

The following chains are now materially strong and do not need another technology added merely for coverage:

- Python/Django/DRF/PostgreSQL application foundation and domain authorization;
- Redis cache-aside pressure, staleness/invalidation/fallback and later reassessment;
- RabbitMQ async delivery, acknowledgement/retry/idempotency/DLQ/outbox reasoning and later reassessment;
- Linux, systemd, SELinux, firewalld, WireGuard, networking and homelab operation;
- Jenkins CI plus Nexus artifacts/internal dependencies and bounded CI migration reasoning;
- Docker/container delivery, Ansible configuration and immutable release promotion;
- OpenTofu infrastructure, Kubernetes/OpenShift platform delta and Argo CD GitOps authority;
- S3-compatible object storage with explicit PostgreSQL/NFS/Nexus/object boundaries;
- Quality strategy, test design, unit/component, API/integration, browser/environment and non-functional testing;
- SCM-triggered Jenkins quality execution, Jenkins CRON regression, durable reports and real failure notification;
- LDAP workforce directory -> Keycloak federation/OIDC -> Steward domain authorization;
- Vault dynamic PostgreSQL credentials with lease/rotation/revocation and Vault outage behavior;
- FTP legacy compatibility -> SFTP trust/identity -> bounded coexistence/rollback -> FTP decommission;
- PostgreSQL expand/coexist/backfill/switch/contract schema evolution;
- certificate issuance/trust/renewal/reload/failure-recovery lifecycle;
- Graylog centralized logs, Prometheus metrics, Grafana dashboards and OpenTelemetry/Tempo tracing;
- SLOs, incident management, capacity, controlled fault injection and tested backup/restore/DR;
- Architect and Technical Steward retain/simplify/migrate/replace/remove decision discipline.

## Findings that prevent a truthful tight verdict today

### F1 — HIGH: Enterprise file integration is sequenced before its NFS prerequisite

`Enterprise File and Batch Integration` is registered in System Thinker, but one of its required labs says to use the NFS service already built in Platform Builder. Platform Builder comes later in the journey. A learner following TSA in order cannot satisfy the path as written.

**Remediation:** move the operational enterprise file/batch integration path to Platform Builder after `Enterprise File and Directory Services`, or split the early system-design portion from the later operational integration.

### F2 — HIGH: Progressive delivery depends on Reliability telemetry that does not exist yet

The Cloud Engineer canary path requires Prometheus-backed automated Argo Rollouts analysis. Prometheus/Grafana are implemented later in Reliability Engineer.

**Remediation:** Cloud Engineer must still implement real automated canary analysis, but use a stage-appropriate analysis mechanism rather than assuming Prometheus. Reliability Engineer can later integrate Prometheus-backed release analysis after metrics exist.

### F3 — HIGH: Certificate lifecycle monitoring also assumes later Reliability infrastructure

The Cloud Engineer certificate path requires Prometheus/Grafana expiry monitoring and the existing alerting path, but those operational systems are introduced later.

**Remediation:** Cloud Engineer must prove renewal scheduling, endpoint certificate inspection and independent expiry/renewal-failure detection using a stage-appropriate scheduled probe/notification mechanism. Reliability Engineer later absorbs certificate expiry and renewal health into Prometheus/Grafana/Alertmanager.

### F4 — HIGH: Distributed tracing is ordered before the logs/metrics stack its incident lab requires

Reliability currently orders `Distributed Tracing` immediately after the Observability foundation, before Production Logging, Prometheus/Grafana and the integrated Graylog/Prometheus/Grafana stack. The tracing incident lab explicitly requires those later systems.

**Remediation:** reorder tracing after the logging, metrics and observability-stack implementation paths.

### F5 — HIGH: School milestones drifted behind the remediated curriculum

Several newly deepened paths are registered before their milestones, but the milestone still verifies the older curriculum state. Platform Builder omits NFS/SMB/LDAP; Delivery does not explicitly carry production schema-evolution evidence; Cloud omits object storage/deep certificate/progressive-delivery evidence; Quality does not gate the new SCM + CRON + received-notification contract; Security does not explicitly integrate LDAP/Keycloak, Vault or FTP->SFTP decommission evidence; Reliability underweights mandatory Tempo evidence; and Architect/Technical Steward stack inventories predate several newly mandatory components and migration end states.

**Remediation:** update milestones/handoffs to verify or reference the evidence produced by every material path without forcing the learner to repeat the lab.

### F6 — MEDIUM-HIGH: Alertmanager itself is not yet a mandatory operated component

Reliability implements Prometheus-compatible alert rules, routing concepts, firing/resolution evidence and notifications, but the path allows an unspecified available notification/routing mechanism. Alertmanager is a reference, not a required implementation.

**Remediation:** require one real learner-owned Alertmanager implementation integrated with Prometheus, one real notification route, grouping/routing, one inhibition/suppression case, firing/resolved evidence and controlled Alertmanager-unavailable behavior. Do not add a second alerting stack.

### F7 — MEDIUM: Artifact signing is conditional instead of a proven supply-chain gate

Security Steward has strong image/dependency scanning, SBOM, provenance and security-gate work. Signing/verification currently permits evidence only where tooling is available, so a learner may finish without proving that an unsigned or wrongly signed artifact is rejected.

**Remediation:** make one bounded Steward OCI artifact signing/verification implementation mandatory using a suitable signing tool. The release path must verify the expected identity/policy, and one unsigned/tampered/wrongly signed candidate must fail the gate.

### F8 — MEDIUM: Canonical product/evolution documentation is stale

The evolution map and product README do not yet reflect several completed remediations and some introduction points differ from the executable curriculum.

**Remediation:** update the evolution map, primary-implementation table, product README and implementation-depth audit after the sequencing and milestone corrections are merged.

## Deliberately not classified as gaps

The audit does not require Kafka as a second broker, Loki/ELK/OpenSearch beside Graylog, Jaeger beside Tempo, GitHub Actions beside Jenkins except bounded migration/comparison, another GitOps controller, another API gateway, full Windows Server/AD administration, database clustering solely for appearance, a service mesh without a requirement, or multiple permanent progressive-delivery strategies.

These exclusions are evidence that TSA is becoming tighter rather than an infrastructure zoo.

## Verdict

**Current verdict: NOT YET TIGHT.**

The curriculum is substantially stronger than the earlier version that was incorrectly described as complete. The remaining defects are concentrated and concrete: four prerequisite/order violations, milestone continuity drift, one missing alert-routing implementation, one conditional supply-chain control and stale canonical documentation.

TSA can be called tight only after F1-F8 are remediated and a final pass confirms that no remaining path requires a capability from a later school and every material implemented capability reaches a school exit gate or an explicit later handoff.
