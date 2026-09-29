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

## Existing resources retained for later focused passes

The following modules already use authoritative sources but still deserve finer activity-level routing in a subsequent pass:
- Linux and Network Security;
- Container and Delivery Security;
- Vault implementation;
- Enterprise Directory Federation;
- secure file-transfer migration;
- artifact signing/verification.

Identity and Secrets already supports per-spec resource overrides and is structurally ahead of the older modules.

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

## Next resource targets

The remaining high-value resource work is to deepen:
1. Linux/network lessons with authoritative OS/OpenSSH/firewall/audit/TLS references;
2. supply-chain lessons with GitLab, Docker/OCI, Nexus, Sigstore and SBOM/provenance sources by topic;
3. Vault activities with initialization, audit, policies, auth, leases and database-engine docs;
4. federation with exact Keycloak LDAP/federation and OpenLDAP lifecycle sections;
5. SFTP with sshd_config, sftp, authorized_keys and host-key verification references;
6. signing with exact Cosign sign/verify/identity-policy documentation.

The audit should favor depth and relevance over maximizing link count.
