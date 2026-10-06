# Security Steward — Repository and Platform Evolution Contract

Status: canonical implementation contract

## Purpose

Security Steward hardens the same Steward ecosystem built throughout TSA. It does not begin with a finished security platform, disconnected cyber labs or a pile of scanners. Each increment starts from an identified asset/threat/trust boundary, produces evidence, changes the smallest justified control and verifies both adversarial and legitimate behavior.

The controlled vulnerability laboratory is intentionally separate when exploitation would be unsafe against the normal Steward environment. Lessons may reproduce weaknesses only in learner-owned/authorized infrastructure.

## Governing loop

```text
asset / trust boundary
        ↓
threat hypothesis
        ↓
safe reproduction or evidence
        ↓
risk / impact
        ↓
control decision
        ↓
implementation / hardening
        ↓
adversarial retest + legitimate regression
        ↓
verified control or residual risk
```

A scanner finding is not a verified vulnerability. A recommendation is not an implemented control. A passing regression is not proof that no other attack path exists.

## Increment 1 — Security baseline and living threat model

Artifacts:
- Steward asset/actor inventory
- system/data-flow/trust-boundary model
- attack-surface inventory
- prioritized threat/abuse-case register
- initial residual-risk register

Constraints:
- reuse System Thinker diagrams where still accurate
- distinguish facts, assumptions and unknowns
- do not add security products merely to make the diagram look mature

Exit evidence:
- important assets and trust boundaries are traceable to real Steward architecture
- prioritized threats have explicit reasoning and candidate controls

## Increment 2 — Controlled web/API attack evidence

Use the existing Steward quality evidence plus isolated vulnerable systems where required.

Artifacts:
- representative web/API attack-path reproductions
- request/response/proxy evidence with secrets redacted
- exploit preconditions, affected asset and impact
- actionable findings

Constraints:
- learner-owned/authorized targets only
- negative REST Assured/Playwright tests alone do not satisfy exploit reasoning
- no uncontrolled destructive testing
- no secret/token values committed as evidence

Exit evidence:
- learner can distinguish functional negative behavior from an exploitable trust failure
- findings are reproducible and prioritized

## Increment 3 — Application hardening and durable regression

Modify Steward code/configuration only after the relevant threat is understood.

Artifacts:
- authentication/authorization/input/error/configuration controls
- security logging/abuse/data-protection improvements
- secure-code-review evidence
- positive + adversarial retest
- durable regression checks in the existing quality platform where appropriate

Constraints:
- domain authorization stays in Steward
- security headers/scanners are not substitutes for authorization or validation
- regression automation records known properties; it does not claim complete security

## Increment 4 — Host and network hardening

Apply Linux/network knowledge already earned.

Artifacts:
- privilege/service/firewall/SSH/TLS baseline
- reduced exposure
- patch/update policy
- security/audit evidence
- segmentation/admin-boundary decisions

Constraints:
- do not reteach generic Linux/network operation
- every hardening action maps to a named exposure/threat
- preserve required operability and recovery access

## Increment 5 — Delivery and software-supply-chain hardening

Secure the actual path:
`source → GitLab → build → Nexus/registry → artifact → deployment → consumer`.

Artifacts:
- CI identity/permission matrix
- dependency/image scan triage
- internal repository trust policy
- deterministic consumption/provenance for `steward-common` only if its earlier real-consumer extraction gate was earned; if extraction was deferred, preserve that recorded absence rather than manufacturing a package; `tsa-test-core` enters the supply-chain model only after Professional Engineer satisfies its genuine two-consumer extraction gate
- SBOM/provenance evidence
- security gate + time-bounded exception policy

Constraints:
- GitLab CI/CD is canonical; do not introduce a second CI implementation
- scan severity alone is not deployment policy
- publishing/deployment credentials are narrower than ordinary test/read credentials
- caches/artifacts/logs must not leak secrets

## Increment 6 — Artifact signing and enforced verification

Artifacts:
- immutable artifact identity/digest
- signing identity/trust policy
- signature/provenance evidence
- consumer verification
- controlled failed-verification proof

Constraint:
Signing without consumer verification/enforcement does not complete this increment.

## Increment 7 — Identity and secrets architecture

Artifacts:
- identity-authority matrix
- OIDC/federation/token-validation boundary
- service/workload identity
- gateway-versus-domain-authorization decision
- secret inventory/lifecycle
- rotation/revocation evidence

Constraints:
- Keycloak authenticates/federates; it does not own Steward business authorization
- gateway identity controls do not justify bypassing backend authorization
- do not record secret/token values in evidence
- the selected workforce directory owns workforce identity data, Keycloak owns federation/authentication, and Steward remains authoritative for domain authorization; do not create competing identity authorities

## Increment 8 — Vault and dynamic secrets

Artifacts:
- Vault trust/unseal/auth architecture
- least-privilege policies
- application/workload authentication
- dynamic/short-lived credential flow where justified
- rotation/revocation/audit evidence
- controlled Vault failure/recovery behavior

Constraint:
Vault is introduced because the existing secret lifecycle has a demonstrated problem to solve, not because a security curriculum must contain Vault.

## Increment 9 — PKI and machine trust

Artifacts:
- trust-root/intermediate/leaf model
- issuance and protected key lifecycle
- certificate verification
- rotation/revocation
- TLS/mTLS use where justified
- failure evidence for expired/untrusted/wrong-identity certificates

Constraints:
- TLS success alone is not sufficient; the learner must explain what identity was verified and by which trust root/policy.
- public ACME/Kong certificate lifecycle and internal workload PKI remain distinct unless an explicit later architecture decision migrates ownership; internal PKI evolution must end with one authoritative issuer design rather than permanent competing issuers.

## Increment 10 — Enterprise federation

Artifacts:
- directory/Keycloak/Steward authority matrix
- secure federation connection
- synthetic user/group federation
- claim-mapping decision
- disablement/group-freshness evidence
- outage/bind-credential/TLS-trust failure evidence

Constraint:
Directory groups may provide coarse identity context but must not silently duplicate Steward's domain ownership model.

## Increment 11 — Secure transfer migration

Artifacts:
- SFTP machine identity and host-key trust
- contract parity with the existing batch/file interface
- bounded FTP/SFTP coexistence
- rehearsed rollback
- FTP credential/listener/firewall decommission evidence

Constraint:
Migration is incomplete while FTP remains an indefinite fallback.

## Increment 12 — Security Steward milestone

The final assessment integrates evidence from every prior increment.

Required outputs:
- current living threat model
- prioritized findings/remediation register
- verified-controls matrix
- security regression evidence
- application/host/network hardening evidence
- delivery/supply-chain/artifact-verification evidence
- identity/Vault/PKI/federation evidence
- secure-transfer end-state evidence
- residual-risk register with owner/status/revisit trigger
- defensible final assessment

## Cross-cutting rules

- Prefer a real Steward boundary over a disposable exercise when safe.
- Use isolated vulnerable applications when exploitation against Steward would create unnecessary risk.
- Evidence must identify environment/release/control state without exposing credentials or sensitive values.
- Every material hardening change needs a legitimate-behavior regression.
- Security tools produce evidence; they do not own risk decisions.
- Unknown/unverified remains visible.
- Later Reliability work owns production SLOs/telemetry/incident operations; Security Steward hands forward security requirements and residual risks.

## Runtime integrity rule

Every lesson or milestone declared for a TSA school must be reachable through that school's exported path array and ultimately through `technicalStewardshipJourney`. A declared lesson that is not included in a path is a curriculum defect even if TypeScript compiles.

When adding a standalone decision lesson or milestone:
1. add it to the intended path's `lessons` array,
2. verify the path is included in the school's exported `*Paths` array,
3. verify the school is replaced/wired in `academy-journey.ts`,
4. run the curriculum/runtime integrity check before merge.

## CI implementation rule

GitLab CI/CD is TSA's canonical CI implementation. Do not add a second CI implementation path, alternate pipeline configuration format or platform-specific lab to another school unless the canonical architecture is deliberately revised.
