# Enterprise Remediation Closure

## Status

The implementation-depth remediation pass is complete. The original audit standard remains: important enterprise capabilities should progress through learn, design, implement, integrate, break, operate and reassess/migrate to the depth justified by the learning objective.

This closure records what changed after the original audit so the historical audit does not become a misleading backlog.

## Completed remediation chain

1. Enterprise file services: learner-owned NFS plus bounded Samba/SMB interoperability.
2. Steward file and batch integration: file contracts, legacy FTP, deterministic processing and NFS integration.
3. Enterprise directory services: real LDAP plus Keycloak federation and Steward OIDC/domain-authorization boundaries.
4. Continuous and scheduled quality execution: SCM-triggered Jenkins feedback, Jenkins cron regression, retained reports and delivered failure notification.
5. S3-compatible object storage: real object-store deployment, Steward integration, least privilege, lifecycle and failure/recovery.
6. Distributed tracing: OpenTelemetry plus Tempo, cross-boundary propagation, RabbitMQ handoff and metrics/traces/logs incident correlation.
7. Centralized secrets: real non-dev Vault, workload auth, audit and dynamic leased PostgreSQL credentials with revocation/outage exercises.
8. Production schema evolution: expand/coexist/backfill/switch/contract with old/new application overlap, restartable migration and rollback/forward-fix reasoning.
9. Progressive delivery: Argo Rollouts canary with Prometheus analysis, staged exposure, automated abort and telemetry-failure handling.
10. Certificate lifecycle: public certificate inspection, automated ACME renewal/reload, served-certificate expiry monitoring and broken-renewal recovery.
11. Secure file-transfer migration: bounded FTP/SFTP coexistence, rollback rehearsal, SFTP cutover and final FTP decommission.
12. Reliability sequencing: Graylog and Prometheus/Grafana are operational before the OpenTelemetry/Tempo cross-signal tracing incident.
13. Alert routing: learner-owned Prometheus Alertmanager with real receiver delivery, grouping, inhibition, failure and recovery.
14. Artifact trust: Cosign signs immutable Steward OCI identities, verification is enforced before deployment/promotion, untrusted signers fail closed and signing trust is rotated.

## Continuity corrections

The remediation pass also corrected dependencies between schools instead of solving them with prose assumptions:

- Enterprise File and Batch Integration now follows the Platform Builder file-service substrate it consumes.
- Reliability tracing now follows the logging and metrics implementations required by its investigation workflow.
- Security Steward artifact signing builds on Delivery Engineer's immutable Nexus artifacts, provenance and SBOM evidence rather than re-owning artifact production.
- FTP exists long enough to teach a real legacy boundary and is then removed through a bounded SFTP migration instead of becoming permanent duplicate infrastructure.
- Argo CD remains GitOps desired-state authority while Argo Rollouts owns the bounded progressive-rollout state machine; the tools are not presented as competing deployment authorities.

## Capability ownership after remediation

| Capability | Primary implementation / owner |
| --- | --- |
| Relational application state | PostgreSQL |
| Shared Linux file service | NFS |
| Windows-compatible file interoperability | Samba/SMB, bounded exposure |
| Managed file transfer | SFTP after FTP migration |
| Object/blob storage | S3-compatible object storage |
| Software/package/image distribution | Nexus |
| Async messaging | RabbitMQ |
| Cache/ephemeral acceleration | Redis |
| CI and release automation | Jenkins |
| GitOps desired state | Argo CD |
| Progressive rollout state machine | Argo Rollouts |
| Container orchestration | Kubernetes; OpenShift as bounded platform migration/delta |
| API edge policy | Kong |
| Workforce directory | LDAP; AD/Kerberos retained as enterprise context |
| Authentication/federation/token boundary | Keycloak/OIDC |
| Domain authorization | Steward |
| Dynamic secrets | Vault |
| Metrics | Prometheus |
| Alert routing/delivery | Alertmanager |
| Operational visualization | Grafana |
| Centralized logs | Graylog |
| Distributed tracing | OpenTelemetry + Tempo |
| Artifact signing/verification | Cosign |

## Anti-zoo conclusion

The final enterprise path deliberately contains many technologies because it teaches different enterprise capabilities, not because every product is a permanent architecture recommendation. Competing tools remain comparisons unless migration itself is the exercise. Architect and Technical Steward retain explicit authority to simplify, replace or remove components when evidence shows the operational cost exceeds the value.

Mandatory implementation means the learner must acquire operational evidence once. It does not mean the final Steward architecture must retain every implementation forever.

## Curriculum remediation gate

The enterprise implementation-depth remediation is considered closed when the curriculum can answer all of the following with a concrete learner exercise rather than only a reading or ADR:

- Where does Steward store relational, file, object and artifact state, and what happens when each boundary fails?
- How are internal packages/images built, distributed, inventoried, signed and verified before deployment?
- How do push/PR and scheduled quality runs execute automatically, preserve reports and notify on failure?
- How are workforce identity, application authorization and dynamic machine credentials separated?
- How does the learner diagnose one incident across metrics, traces and centralized logs?
- How are alerts evaluated, routed and delivered when something actionable fails?
- How does a database schema evolve while application versions overlap?
- How does a candidate release receive bounded traffic and abort safely on evidence?
- How are certificates renewed, reloaded, monitored and recovered before expiry?
- How is a legacy FTP integration migrated to SFTP with explicit coexistence, rollback, cutover and decommission?

Current curriculum coverage satisfies this remediation gate. Further curriculum additions should therefore require a newly demonstrated capability gap or a deliberate product-evolution requirement rather than additional technology-name coverage.
