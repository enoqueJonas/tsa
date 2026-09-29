# Quality Steward → Security Steward Transition Audit

Status: canonical boundary and prerequisite contract

## Purpose

Quality Steward establishes trustworthy verification. Security Steward changes the learner's question from **"does the system satisfy this expected/negative behavior?"** to **"what can an adversary abuse, why is it possible, what trust decision failed, and which layered control reduces the risk?"**

Security Steward must reuse the existing quality platform for regression evidence without becoming a second QA curriculum.

## Capabilities already available before Security Steward

### Builder / System Thinker
- HTTP/API contracts, Django/DRF, PostgreSQL and application architecture
- authentication versus authorization, JWT lifecycle, roles/permissions and object-level access
- boundaries, dependencies, data flows, failure modes and ADRs

### Platform / Delivery / Cloud
- Linux users/permissions/services/logs and SSH
- TCP/IP, DNS, routing, firewalls and TLS foundations
- Docker images/runtime/networking and Compose
- GitLab CI/CD, runners, variables, artifacts, gates and deployment workflows
- Nexus/internal dependencies, artifact provenance/SBOM/signing foundations
- VPS/cloud IAM, secrets and internet-facing deployment boundaries

### Quality Steward
- risk-based testing and negative testing
- API auth/authz/idempotency/state-integrity evidence
- browser session/storage/cookie behavior
- safe evidence/redaction and failure classification
- dependency failure experiments
- Testcontainers-controlled dependencies
- GitLab evidence/gates and security-aware CI-variable handling

Security Steward should reference these capabilities instead of reteaching their functional mechanics.

## Security Steward progression

1. **Security Foundations** — assets, attack surface, trust, risk, least privilege and defense in depth.
2. **Threat Modeling** — actors, flows, boundaries, STRIDE/abuse cases and prioritized mitigations.
3. **Web and API Threats** — exploit mechanics and attack paths against learner-controlled systems.
4. **Practical Vulnerability Laboratory** — safely reproduce, capture evidence, remediate hypotheses and retest.
5. **Application Security** — convert findings/threats into secure design/code/configuration and durable regression controls.
6. **Linux and Network Security** — harden the host/network trust boundary already understood operationally.
7. **Container and Delivery Security** — secure images, runtime permissions, GitLab identities, Nexus/dependencies, SBOM/scanning and supply chain.
8. **Artifact Signing and Verification** — move from signing concepts to enforced consumer verification/trust policy.
9. **Identity and Secrets Security** — federation/token/workload identity and secret-lifecycle boundaries.
10. **Vault and Dynamic Secrets** — implement a secrets platform and short-lived/dynamic credential patterns.
11. **Internal PKI and Machine Trust** — certificates, trust roots, issuance/rotation/revocation and workload trust.
12. **Enterprise Directory Federation** — integrate enterprise identity boundaries deliberately.
13. **Secure File Transfer Migration** — apply protocol/trust/migration reasoning to FTP→SFTP.
14. **Security Steward Milestone** — assess and harden the complete Steward system and defend residual risk.

## Boundary: Quality negative test vs security engineering

A Quality Steward test may prove:
- user B receives 403 when modifying user A's resource
- logout token behavior matches the documented contract
- upload validation rejects a prohibited file type
- cookies have expected security attributes

Security Steward must go further:
- identify the protected asset and attacker capability
- trace the authorization/session/upload trust boundary
- understand exploit preconditions and bypass paths
- estimate impact and prioritize risk
- choose preventive/detective controls
- implement/harden the control
- retest the attack path
- add durable regression evidence where appropriate
- record residual risk

The existing Java REST Assured/Playwright platform may execute regression checks after remediation, but security reasoning and exploit reproduction are not reduced to framework test cases.

## Boundary: vulnerability discovery vs application hardening

Web/API Threats and the Vulnerability Laboratory teach how weaknesses work and how to reproduce them safely. Application Security follows immediately afterward so confirmed threats/findings become requirements, code/configuration controls and regression evidence while the attack path is still understood.

Host/network, supply-chain and identity/platform hardening then expand outward from the application boundary.

## Boundary: Security Steward vs Reliability Engineer

Security Steward may design security logging/audit evidence, certificate/secret rotation requirements and failure-safe controls. Reliability Engineer later owns production SLOs, telemetry operations, incident response mechanics, capacity and broad resilience engineering.

## Boundary: Security Steward vs governance

Security Steward identifies assets, risks, controls, evidence and residual risk. Technical Steward/governance later turns this into broader policy, assurance, ownership and organizational decision systems.

## Regression checks

- Is a lesson reteaching HTTP, Linux, Docker, GitLab or JWT mechanics rather than applying them to an adversarial/trust problem?
- Does a web/API lesson merely repeat a Quality Steward negative test without exploit/risk/control reasoning?
- Does a scanner result become a security conclusion without contextual triage?
- Does AppSec hardening occur close enough to vulnerability discovery to convert findings into code/configuration controls?
- Does a security control include positive/adversarial retest evidence?
- Are secrets/tokens/payloads kept out of learner evidence?
- Is an exercise safely confined to learner-controlled systems?
- Does supply-chain security cover both application dependencies and internal artifacts such as `tsa-test-core`?
- Is signing followed by verification/enforcement rather than treated as ceremonial evidence?
- Does identity architecture keep IdP/gateway/platform authentication distinct from Steward domain authorization?
- Are residual risks handed forward rather than hidden by successful tests?
