import { applicationSecurityDeepLessons } from "./security-application-deep";
import { artifactSigningVerificationDeepLessons } from "./security-artifact-signing-verification-deep";
import { containerAndDeliverySecurityDeepLessons } from "./security-container-delivery-deep";
import { enterpriseDirectoryFederationDeepLessons } from "./security-enterprise-directory-federation-deep";
import { securityFoundationsDeepLessons } from "./security-foundations-deep";
import { securityIdentitySecretsDeepLessons } from "./security-identity-secrets-deep";
import { internalPkiMachineTrustDeepLessons } from "./security-internal-pki-machine-trust-deep";
import { internalPkiImplementationMilestone } from "./security-internal-pki-milestone";
import { linuxAndNetworkSecurityDeepLessons } from "./security-linux-network-deep";
import { secureFileTransferMigrationDeepLessons } from "./security-secure-file-transfer-migration-deep";
import { stewardSecurityAssessmentDeepLessons } from "./security-steward-milestone-deep";
import { threatModelingDeepLessons } from "./security-threat-modeling-deep";
import { vaultImplementationDeepLessons } from "./security-vault-implementation-deep";
import { vulnerabilityLaboratoryDeepLessons } from "./security-vulnerability-laboratory-deep";
import { webAndApiThreatsDeepLessons } from "./security-web-api-threats-deep";
import type { AuthoredLearningPath, AuthoredLesson } from "./normalize-authored-curriculum";

type SecurityModel = { model: string; experiment: string; failure: string };
const securityModels: Record<string, SecurityModel> = {
    "security-foundations": { model: "Define assets, trust boundaries and controls before using scanners.", experiment: "Map Steward's data, users, servers and attackers; identify what each control protects.", failure: "A configuration setting is not an effective control without verification." },
    "threat-modeling": { model: "Model realistic attacker goals, reachable entry points and impacts, not an arbitrary vulnerability list.", experiment: "Draw a request through proxy, API and database and identify where trust changes.", failure: "A threat without a plausible path and asset is speculation." },
    "web-and-api-threats": { model: "Authorization, injection, XSS, session and upload risks have different conditions and safe tests.", experiment: "Use synthetic identities and controlled inputs to verify API object ownership and output encoding.", failure: "A rejected payload does not prove all variants safe; record the exact tested surface." },
    "vulnerability-laboratory": { model: "A vulnerability finding needs reproducible steps, observed effect, impact and scope.", experiment: "On a disposable intentionally vulnerable lab, show baseline, bounded exploit, remediation and regression proof.", failure: "Never apply exercises to targets without explicit authorization." },
    "application-security": { model: "Threat controls belong inside input handling, identity, business logic and dependency boundaries.", experiment: "Trace a malicious request from untrusted input through validation, authorization and persistence.", failure: "A green security scan does not prove absence of logic-level flaws." },
    "linux-and-network-security": { model: "Host security uses identity, minimum privilege, update state, network filtering and audit evidence.", experiment: "Trace SSH login and one app request through user permissions, local firewall and service logs.", failure: "Blocking a port without preserving administrator access can lock out recovery." },
    "container-and-delivery-security": { model: "Image dependencies, build provenance, runtime privileges and deployment credentials are independent surfaces.", experiment: "Inspect a non-root container, digest-pinned image and CI secret access in a test pipeline.", failure: "A small image or passing scan cannot by itself prove runtime isolation." },
    "artifact-signing-verification": { model: "A signature binds bytes to a signing identity; verification must also establish trusted signer and policy.", experiment: "Sign a disposable artifact, verify it under an explicit key policy, then tamper with a copy and observe rejection.", failure: "A cryptographically valid signature from an untrusted key is not authorization to deploy." },
    "identity-and-secrets-security": { model: "Authentication, authorization, secrets distribution and token expiry are different responsibilities.", experiment: "Test separate user identities, restricted scopes, token expiry and revocation in a disposable Steward flow.", failure: "A valid token must not grant another user's object rights." },
    "vault-secrets-platform": { model: "A secret platform requires authenticated access, least-privilege policies, lease lifecycle and recovery.", experiment: "Issue a short-lived lab credential, validate allowed access, deny another role and revoke the lease.", failure: "Secret rotation is incomplete until old credentials no longer work." },
    "internal-pki-machine-trust": { model: "A trust chain depends on issuer, SAN, valid dates, key custody and revocation policy.", experiment: "Issue a certificate for a lab service and test valid-hostname connection and wrong-hostname rejection.", failure: "A successful TLS handshake with verification disabled is not trust validation." },
    "enterprise-directory-federation": { model: "Directory identity, bind permissions, federation claims and application authorization are separate.", experiment: "Bind with a least-privilege synthetic service identity, verify scoped query results and denied access.", failure: "Directory authentication alone must not grant administrative application privileges." },
    "secure-file-transfer-migration": { model: "Migrating FTP to SFTP changes transport, user isolation, credentials and operational failure behavior.", experiment: "Transfer a synthetic file by SFTP, compare its hash and verify a legacy plaintext endpoint is unavailable.", failure: "A successful file transfer without integrity and access-denial evidence is insufficient." },
    "steward-security-assessment-and-hardening": { model: "A final assessment ties assets, realistic threats, implemented controls and reproducible negative tests.", experiment: "Demonstrate one end-to-end attack-path prevention and one recovery with before/after evidence.", failure: "Do not declare the platform secure from a checklist or a scan count." },
};
function path(id: string, title: string, lessons: AuthoredLesson[]): AuthoredLearningPath {
    const guide = securityModels[id];
    if (!guide) throw new Error(`Missing Security Steward model for ${id}`);
    const prepared = lessons.map((lesson) => ({ ...lesson, activities: lesson.activities.flatMap((activity) => {
        const content = "content" in activity ? activity.content : activity;
        if (!content || content.type !== "practical") return [activity];
        const instructions = Array.isArray(content.instructions) ? content.instructions : [];
        const criteria = Array.isArray(content.completionCriteria) ? content.completionCriteria : [];
        return [{ type: "reading" as const, title: `Prepare securely: ${activity.title}`, description: [`Scenario: ${content.scenario ?? lesson.title}`, `Trust boundary: ${guide.model}`, `Worked example: ${guide.experiment}`, `Initial observations: ${instructions.slice(0,3).join("; ")}`, `Required evidence: ${criteria.join("; ")}`, `Negative path and recovery: ${guide.failure}`, "Use only controlled synthetic data and explicitly authorized targets; restore the baseline and prove the same consumer-level operation succeeds."].join("\\n\\n") }, activity];
    }) }));
    const overview: AuthoredLesson = { id: `${id}-security-orientation`, title: `Worked security model: ${title}`, activities: [{ type: "reading", title: "Threat, controlled experiment and expected rejection", description: [guide.model, guide.experiment, guide.failure].join("\\n\\n") }] };
    return { id, title, lessons: [overview, ...prepared] };
}

export const securityFoundations = path("security-foundations", "Security Foundations", securityFoundationsDeepLessons);
export const threatModeling = path("threat-modeling", "Threat Modeling", threatModelingDeepLessons);
export const webAndApiThreats = path("web-and-api-threats", "Web and API Threats", webAndApiThreatsDeepLessons);
export const vulnerabilityLaboratory = path("vulnerability-laboratory", "Practical Vulnerability Laboratory", vulnerabilityLaboratoryDeepLessons);
export const linuxAndNetworkSecurity = path("linux-and-network-security", "Linux and Network Security", linuxAndNetworkSecurityDeepLessons);
export const containerAndDeliverySecurity = path("container-and-delivery-security", "Container and Delivery Security", containerAndDeliverySecurityDeepLessons);
export const artifactSigningVerification = path("artifact-signing-verification", "Artifact Signing and Verification", artifactSigningVerificationDeepLessons);
export const identityAndSecretsSecurity = path("identity-and-secrets-security", "Identity and Secrets Security", securityIdentitySecretsDeepLessons);
export const vaultSecretsPlatform = path("vault-secrets-platform", "Vault and Dynamic Secrets", vaultImplementationDeepLessons);
const internalPkiLessons = [...internalPkiMachineTrustDeepLessons.slice(0, -1), internalPkiImplementationMilestone, ...internalPkiMachineTrustDeepLessons.slice(-1)];
export const internalPkiMachineTrust = path("internal-pki-machine-trust", "Internal PKI and Machine Trust", internalPkiLessons);
export const enterpriseDirectoryFederation = path("enterprise-directory-federation", "Enterprise Directory Federation", enterpriseDirectoryFederationDeepLessons);
export const secureFileTransferMigration = path("secure-file-transfer-migration", "FTP to SFTP Secure Transfer Migration", secureFileTransferMigrationDeepLessons);
export const applicationSecurity = path("application-security", "Application Security", applicationSecurityDeepLessons);
export const stewardSecurityAssessment = path("steward-security-assessment-and-hardening", "Security Steward Milestone", stewardSecurityAssessmentDeepLessons);

export const securityStewardPaths: AuthoredLearningPath[] = [
    securityFoundations,
    threatModeling,
    webAndApiThreats,
    vulnerabilityLaboratory,
    applicationSecurity,
    linuxAndNetworkSecurity,
    containerAndDeliverySecurity,
    artifactSigningVerification,
    identityAndSecretsSecurity,
    vaultSecretsPlatform,
    internalPkiMachineTrust,
    enterpriseDirectoryFederation,
    secureFileTransferMigration,
    stewardSecurityAssessment,
];