# Security Steward — Learning Resource Audit

Status: active curriculum quality record

## Goal

Security Steward resources must prepare the learner for the exact security decision or exercise immediately ahead. A generic OWASP homepage attached to every lesson is not sufficient when an authoritative topic-specific reference exists.

## Resource hierarchy

Prefer, in order:

1. standards and primary security guidance — NIST, RFCs, OWASP project/cheat-sheet material;
2. official implementation documentation — Django/DRF, GitLab, Sigstore/Cosign, Vault, Keycloak, OpenSSH/OpenSSL, OS vendor docs;
3. high-quality interactive security learning — PortSwigger Web Security Academy and deliberately vulnerable learner-controlled labs;
4. secondary articles only when primary sources do not teach the concept adequately.

Resources are not implementation recipes by themselves. TSA still teaches the trust/risk/control model before tool commands.

## Changes made

### Security Foundations
Replaced the universal four-link bundle with concept routing:
- CIA/control framing → NIST CSF;
- risk vocabulary/treatment → NIST SP 800-30 + OWASP risk methodology;
- attack surface/trust boundaries → OWASP threat modeling/attack-surface material;
- least privilege/zero-trust reasoning → NIST SP 800-207/CISA;
- secure-by-design context where appropriate.

### Threat Modeling
Resources now follow the activity:
- process/flows/boundaries → OWASP threat-model process;
- STRIDE → Microsoft STRIDE guidance;
- abuse cases → OWASP Abuse Case;
- prioritization → NIST risk-assessment guidance.

### Web and API Threats
Each threat now routes to its specific OWASP Cheat Sheet or PortSwigger surface. Examples include SQL injection, XSS, CSRF, authorization/IDOR, SSRF, file upload, command injection, deserialization, secrets, session management, cryptographic storage, vulnerable dependencies, logging and mass assignment.

OWASP Top 10/API Top 10 remain context/index resources rather than being used as the detailed lesson for every weakness.

### Application Security
Control lessons now use the matching implementation/security guidance:
- authentication → OWASP Authentication + DRF Authentication;
- authorization → OWASP Authorization + DRF Permissions;
- validation → OWASP Input Validation + DRF Serializers;
- errors, secrets, headers, logging, abuse resistance and cryptographic storage → corresponding OWASP guidance;
- secure code review → OWASP Code Review Guide;
- negative requirements → OWASP Abuse Case;
- regression → ASVS plus relevant cheat-sheet references.

### Internal PKI
The PKI path previously had no structured learning-resource layer. Every PKI lesson now starts with targeted material:
- RFC 5280 for X.509 trust semantics;
- OpenSSL verify/x509/ca documentation for chain, issuance and revocation mechanics;
- Red Hat and Microsoft trust-store documentation for cross-platform trust distribution;
- Vault PKI docs for the later ownership/reassessment decision.

## Second-pass modules completed

### Linux and Network Security
Removed the repeated secondary hardening bundle. Lessons now use authoritative Red Hat, systemd, OpenSSH, Microsoft, NIST and TLS/OpenSSL references according to the control being changed.

### Container and Delivery Security
Resources now follow the actual supply-chain decision: Docker build/runtime security, GitLab container/dependency scanning, SAST/DAST, protected environments, CI variables/job tokens, OWASP supply-chain guidance, SLSA, SPDX/CycloneDX and Sigstore/Cosign.

### Vault
The module now exposes the exact official documentation needed for production hardening, initialization, audit devices, policies, authentication, database dynamic secrets, leases/revocation and health. Practical activity schema remains unchanged.

### Enterprise Directory Federation
Federation-model lessons use OIDC and user-storage concepts; LDAP implementation uses Keycloak LDAP/OpenLDAP/RFC 4511; lifecycle lessons stay on federation behavior; Active Directory context uses Microsoft AD DS guidance plus the Keycloak federation boundary.

### Secure File Transfer
The SFTP path now includes the exact OpenSSH server/client/key/restriction references required to reason about chroot/SFTP-only behavior, host-key verification, client identity and key restrictions.

### Artifact Signing and Verification
The signing path now includes Sigstore's security model, exact Cosign sign/verify/keyless guidance, GitLab CI/CD ID-token documentation and SLSA provenance. Stale Jenkins implementation language discovered in the first pass remains removed.

Identity and Secrets already supports per-spec resource overrides and remains structurally aligned with this approach.

## Correctness finding discovered during resource audit

Artifact Signing and Verification still contained stale Jenkins implementation instructions. Security Steward now refers to the canonical GitLab CI/CD delivery path instead. Security does not introduce an alternate CI implementation.

## Resource-quality regression rules

When adding or editing a Security Steward lesson:

- do not attach a broad resource merely because it is authoritative;
- prefer the exact standard/cheat sheet/docs page for the lesson;
- use official tool documentation for implementation mechanics;
- teach the underlying security model before product commands;
- avoid duplicate links that add no new learning value;
- distinguish a reference from a course/video/documentation resource using `LearningResource.kind`;
- never make external offensive-security exercises depend on unauthorized targets;
- keep resource selection aligned with the concrete Steward exercise.

## Completion state

The deep Security Steward resource audit is now complete at the module level. Future work is maintenance rather than a known structural gap: verify links during curriculum changes, keep resource targeting narrow, and split a module further only when a lesson genuinely requires a different authoritative source.

The audit should favor depth and relevance over maximizing link count.
