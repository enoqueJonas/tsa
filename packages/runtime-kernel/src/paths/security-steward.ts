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

function path(id: string, title: string, lessons: AuthoredLesson[]): AuthoredLearningPath { return { id, title, lessons }; }

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
    linuxAndNetworkSecurity,
    containerAndDeliverySecurity,
    artifactSigningVerification,
    identityAndSecretsSecurity,
    vaultSecretsPlatform,
    internalPkiMachineTrust,
    enterpriseDirectoryFederation,
    secureFileTransferMigration,
    applicationSecurity,
    stewardSecurityAssessment,
];