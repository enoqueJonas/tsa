# Security Steward — Deep Curriculum Audit

Status: active regression checklist  
Transition contract: `security-steward-transition-audit.md`  
Evolution contract: `security-steward-repository-evolution.md`

## Audit conclusion

Security Steward has sufficient domain breadth. The principal risks were sequencing, incremental integration and final-evidence coverage rather than missing headline security topics.

The canonical learning arc is:

```text
quality evidence
→ security/risk language
→ threat model
→ attack mechanics
→ safe reproduction
→ application hardening
→ host/network hardening
→ delivery/supply-chain hardening
→ signing + enforced verification
→ identity/secrets
→ Vault
→ PKI/machine trust
→ enterprise federation
→ secure-transfer migration
→ integrated security assessment
```

## Findings resolved

### Application hardening was too late
Application Security previously followed infrastructure, supply-chain, identity, Vault, PKI, federation and secure-transfer material. It now follows the vulnerability laboratory so the learner immediately converts attack evidence into design/code/configuration controls and regression evidence.

### Final milestone did not represent the full school
The final assessment previously emphasized application, host/network and supply-chain evidence but did not explicitly require Vault, PKI, federation or secure-transfer evidence. Those domains are now part of evidence readiness, cross-stack verification and the final report.

### Journey specification lagged runtime
The journey document described a much smaller Security Steward than the runtime. It now reflects all implemented paths and their correct order.

### No repository/platform evolution contract
Security Steward now has an incremental contract preventing product-first learning, scanner-driven conclusions and disconnected labs.

### Quality/Security overlap was ambiguous
The transition contract now distinguishes a negative behavioral test from adversarial trust/risk/control reasoning. Existing REST Assured/Playwright automation is reused for durable regression, not treated as the security discipline itself.

## Strong existing areas

### Threat reasoning
Security Foundations and Threat Modeling establish assets, actors, flows, trust boundaries, attack surface, STRIDE/abuse cases, mitigation and residual risk before specialized tooling.

### Web/API attack surface
Coverage includes injection, XSS, CSRF, authentication/session threats, IDOR, SSRF, traversal, uploads, command injection, deserialization, misconfiguration, secret exposure, abuse, cryptographic failures, dependencies, logging and mass-assignment/exposure concerns.

### Safe practical work
The Vulnerability Laboratory requires isolated/learner-controlled systems, reproduction evidence, mitigation and retest rather than uncontrolled target scanning.

### Application hardening
Authentication lifecycle, authorization, validation, errors, secrets, headers/configuration, security logging, abuse resistance, data protection, code review, negative requirements and regression testing form a coherent secure-coding layer.

### Platform security
Linux/network lessons harden identities, sudo/SSH, exposure/firewalls, patching, file permissions, logging, segmentation and TLS using infrastructure knowledge learned earlier.

### Software supply chain
The curriculum follows real TSA assets: GitLab identities, Nexus, dependencies, internal packages, images, SBOMs, provenance, signing, publishing credentials and consumer trust.

### Identity and machine trust
The sequence correctly separates federation/authentication, gateway/platform identity, Steward domain authorization, Vault secret lifecycle and PKI machine identity.

### Enterprise integration
Directory federation and FTP→SFTP migration apply security reasoning to realistic enterprise boundaries instead of stopping at web-application security.

## Deliberate boundaries

Security Steward does not become:
- a penetration-testing certification course,
- a full Windows/Active Directory administration school,
- a SOC/SIEM operations curriculum,
- a Reliability/SRE curriculum,
- a governance/compliance school.

Those concerns may be introduced only far enough to secure and reason about Steward; later TSA schools own their operational/governance depth.

## Remaining quality work

### Resource targeting
Several Security Steward deep modules still attach one generic module-wide resource bundle to every lesson. This is pedagogically weaker than the lesson-specific resource routing already implemented in Quality Steward. A dedicated Security Steward resource audit should target OWASP cheat sheets/ASVS sections, Django security guidance, GitLab security documentation, Sigstore/Cosign, Vault, Keycloak/OIDC, OpenSSH and PKI sources to the exact lesson.

### Tool implementation depth
Security tools should be selected only after the control/evidence problem is established. Where TSA chooses a concrete implementation (for example Cosign, Vault or Keycloak), the lesson must teach the underlying trust model before commands/configuration.

## Runtime integrity

`academy-journey.ts` wires each deep school path array into the normalized runtime journey. Security Steward's 14 paths are present in `securityStewardPaths`, including the repositioned Application Security path and the final milestone.

A repository-level integrity guard now checks:
- exported deep/quality/rich lesson arrays are consumed by runtime source,
- standalone milestone symbols are composed/referenced,
- runtime school path arrays are wired through `academy-journey.ts`,
- Jenkins references do not reappear outside the explicitly permitted Quality Steward-owned files.

Command:

```bash
pnpm audit:curriculum
```

The runtime integrity rule is also part of the Security Steward evolution contract so future standalone lessons/milestones must be wired before merge.

## Regression questions

- Does the learner understand the asset/trust boundary before the security product?
- Is exploitation limited to learner-controlled/authorized systems?
- Is a scanner finding being confused with a verified vulnerability?
- Is a recommendation being confused with an implemented control?
- Does each hardening change preserve legitimate behavior?
- Does known attack behavior receive durable regression evidence when useful?
- Are secrets/tokens excluded from evidence?
- Is GitLab the CI implementation rather than an interchangeable example?
- Is signing actually verified by consumers?
- Does Keycloak/gateway/platform identity remain separate from Steward domain authorization?
- Does Vault solve a demonstrated lifecycle problem?
- Does PKI evidence prove identity/trust rather than merely successful TLS?
- Is FTP actually decommissioned after SFTP migration?
- Does the final milestone contain evidence from every major Security Steward domain?
- Is every declared lesson reachable in the runtime?
