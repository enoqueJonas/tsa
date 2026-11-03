# PED-005 — Security Steward whole-school authored-source audit

**Status: SOURCE AUDIT IN PROGRESS.** No real Keycloak/Vault system, independent learner understanding or production controls verified. [Tracking issue #326](https://github.com/enoqueJonas/tsa/issues/326).

## Actual school inventory — 14 paths in learner order

| Path | Original source | Source classification / high-risk learner question |
|---|---|---|
| 1. Security Foundations | `security-foundations-deep.ts` | Existing eight original concept lessons; assess trust boundary, least privilege and prevention/detection evidence before tools |
| 2. Threat Modeling | `security-threat-modeling-deep.ts` | Nine original concept lessons; require reachable path, threat preconditions, discriminating observations and ownership |
| 3. Web and API Threats | `security-web-api-threats-deep.ts` | Original OWASP/API concepts; distinguish authentication, object-level authorization, output encoding, CSRF, SSRF, upload handling |
| 4. Practical Vulnerability Laboratory | `security-vulnerability-laboratory-deep.ts` | Original intentional weakness and bounded lab concepts; no tests on unauthorized systems |
| 5. Application Security | `security-application-deep.ts` | Original controls and regression; security scanner result cannot substitute for domain authorization |
| 6. Linux and Network Security | `security-linux-network-deep.ts` | Original OS/network boundary material; verify read-only observation and recovery before applying dangerous firewall or SSH changes |
| 7. Container and Delivery Security | `security-container-delivery-deep.ts` | Original supply-chain concepts; pin digest and enforce trusted signers and runtime constraints independently |
| 8. Artifact Signing/Verification | `security-artifact-signing-verification-deep.ts` | Original practical-first signing lesson; trusted signer and tampered bytes both matter |
| 9. Identity and Secrets Security | `security-identity-secrets-deep.ts` | Eight original concept lessons; OAuth2/OIDC roles, issuer/audience validation, Keycloak realm/client/role, domain authorization, secret lifecycle |
| 10. Vault and Dynamic Secrets | `security-vault-implementation-deep.ts` | One original reading followed by three large labs; explain policy, token auth, database lease, TTL/renew/revoke and outage as independent stages |
| 11. Internal PKI and Machine Trust | `security-internal-pki-machine-trust-deep.ts`, `security-internal-pki-milestone.ts` | Original PKI model and trust chain; SAN, trusted anchor, validity, key custody, revocation and mTLS failure |
| 12. Enterprise Directory Federation | `security-enterprise-directory-federation-deep.ts` | Four original readings; LDAP directory identity != Keycloak federation != Steward authorization |
| 13. FTP→SFTP Secure Migration | `security-secure-file-transfer-migration-deep.ts` | One source reading plus practical stages; SSH identity, integrity and disabling legacy plaintext |
| 14. Security Steward Milestone | `security-steward-milestone-deep.ts` | Source-authored briefing and defense; link exact release/identity to negative tests, residual risk and recovery |

## Current structural deficiency

The school entrypoint `security-steward.ts` prepends a **generic orientation lesson for every path** and a **synthetic reading before each practical**. These pages paraphrase objectives but do not teach the underlying mechanism; they can obscure the actual authored source. Remove synthetic wrappers without renaming original lesson/activity IDs; verify navigation and stored-progress re-entry rather than claiming completion from activity count.

## Acceptance gates

1. Inventory and remediate **all 14 source paths**, preserving the original lesson IDs. Split complex concepts when their prerequisites and worked examples cannot fit one coherent lesson.
2. Show the actual authority chain: user/client → authorization server (Keycloak) → signed token → resource server verification → **separate** object/domain authorization. Include invalid signature, issuer, audience, expiry and insufficient permission as distinguishable negative outcomes.
3. Show Vault auth → token policy → secrets engine → short-lived database credential → renewal/replacement/revocation. Distinguish a local data-model demo from a real Vault/PostgreSQL runtime.
4. Execute **exact published** safe examples in CI when possible, including denial and corrupted/expired cases. Real Keycloak, Vault, identity federation, PKI and lab networks remain **UNVERIFIED** until deployed and observed.
5. Traverse rendered school pages on desktop and mobile, verify code rendering, re-entry and source learning order, and separately require independent learner teach-back. Automated navigation is not comprehension.
6. Keep issue #326 OPEN until runtime and independent transfer evidence is real.
