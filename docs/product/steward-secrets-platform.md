# Steward Secrets Platform

## Decision

Security Steward must operate HashiCorp Vault at least once as Steward's dedicated secrets-platform implementation. The scenario is justified by a concrete lifecycle problem: a long-lived PostgreSQL application credential has become a rotation, revocation and audit burden.

The mandatory learning implementation uses Vault's database secrets engine to issue leased PostgreSQL credentials to Steward. Storing the same permanent password in Vault KV does not satisfy the dynamic-secret objective.

## Responsibility boundary

- Keycloak authenticates human/application identities for the OIDC boundary.
- Kubernetes/OpenShift Secret may transport/bootstrap selected secret material but is not the complete lifecycle authority for this exercise.
- Vault authenticates workloads, evaluates secret policy, issues/revokes leased credentials and records secret-control-plane audit events.
- PostgreSQL enforces the privileges of the generated database identity.
- Steward must tolerate credential replacement and must never use Vault root credentials as an application identity.

## Mandatory evidence

The learner must deploy Vault outside development mode with persistent state and protected transport, establish safe initialization/recovery handling, enable audit evidence, create non-root policies/identities, and prove allowed plus denied operations.

The learner must then configure a real PostgreSQL dynamic-secret role, authenticate Steward/workload to Vault without a root token, obtain and use a leased credential, demonstrate least privilege, renew or replace the credential, revoke it, prove the revoked credential no longer works and restore service with a newly issued credential.

Finally, the learner must make Vault unavailable during a controlled experiment, distinguish already-issued credentials from new/renewed secret acquisition, prove Steward does not silently fall back to an unmanaged permanent password, recover Vault, rotate/revoke the workload's Vault identity and define Vault monitoring/recovery responsibilities.

## Reassessment rule

Mandatory implementation does not mean mandatory permanence. Architect and Technical Steward later reassess whether Vault's centralized policy, dynamic credentials and auditability justify its operational cost. Retention, simplification, replacement or removal must be evidence-based. A replacement secrets platform is a bounded migration rather than permanent duplicate infrastructure.
