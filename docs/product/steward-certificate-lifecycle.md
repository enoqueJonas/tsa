# Steward Certificate Lifecycle

## Decision

Cloud Engineer must operate the complete public TLS certificate lifecycle for Steward, not merely obtain a certificate once. Kong remains the public TLS termination boundary established by the internet-networking curriculum.

The lifecycle covers identity and trust validation, private-key ownership, ACME renewal automation, gateway reload/deployment, independent expiry monitoring, renewal-failure alerting and controlled recovery.

## Definition of done

A certificate lifecycle is healthy only when:

1. the public Steward hostname serves the expected leaf certificate and complete usable chain;
2. hostname/SAN validation succeeds from an external client;
3. private-key access is restricted and key material is absent from source/evidence;
4. renewal runs automatically through a repeatable scheduler/platform mechanism;
5. the renewal path has been exercised safely using staging/dry-run where available;
6. replacement certificate material is actually loaded by Kong;
7. the certificate served publicly is monitored for remaining validity;
8. renewal-job failure is observable independently of endpoint expiry;
9. alerts provide enough lead time to recover before expiry;
10. a deliberately broken renewal dependency can be diagnosed and recovered through a documented runbook.

## Monitoring boundary

Monitoring only a certificate file on disk is insufficient because Kong may still serve stale material. Monitoring only the renewal job is also insufficient because a successful renewal may fail to deploy/reload. Steward therefore monitors the certificate presented at the client-facing endpoint and separately records renewal scheduler/job health.

Prometheus/Grafana and the existing alerting/notification path remain the primary operational monitoring surfaces. No separate certificate-specific monitoring stack is introduced.

## Failure exercise

The learner deliberately breaks one safe ACME dependency such as challenge routing, DNS permission/configuration or required network reachability while the existing certificate remains valid. This models the dangerous real-world condition where users see no immediate outage while the future expiry incident is already developing.

Recovery ends only after automated renewal health is restored, alerting is verified and the public endpoint is re-inspected.

## Ownership boundary

Certificate automation credentials and private keys are secrets and inherit the least-privilege/secrets-management discipline established elsewhere in TSA. Certificate lifecycle management does not make Kong, Vault or the application interchangeable responsibilities.
