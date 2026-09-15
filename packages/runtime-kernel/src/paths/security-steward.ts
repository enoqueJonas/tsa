import { applicationSecurityDeepLessons } from "./security-application-deep";
import { artifactSigningVerificationDeepLessons } from "./security-artifact-signing-verification-deep";
import { containerAndDeliverySecurityDeepLessons } from "./security-container-delivery-deep";
import { enterpriseDirectoryFederationDeepLessons } from "./security-enterprise-directory-federation-deep";
import { securityFoundationsDeepLessons } from "./security-foundations-deep";
import { securityIdentitySecretsDeepLessons } from "./security-identity-secrets-deep";
import { linuxAndNetworkSecurityDeepLessons } from "./security-linux-network-deep";
import { secureFileTransferMigrationDeepLessons } from "./security-secure-file-transfer-migration-deep";
import { stewardSecurityAssessmentDeepLessons } from "./security-steward-milestone-deep";
import { threatModelingDeepLessons } from "./security-threat-modeling-deep";
import { vaultImplementationDeepLessons } from "./security-vault-implementation-deep";
import { vulnerabilityLaboratoryDeepLessons } from "./security-vulnerability-laboratory-deep";
import { webAndApiThreatsDeepLessons } from "./security-web-api-threats-deep";
import type { LearningPath } from "./learning-path";

export const securityFoundations: LearningPath = { id: "security-foundations", title: "Security Foundations", lessons: securityFoundationsDeepLessons };
export const threatModeling: LearningPath = { id: "threat-modeling", title: "Threat Modeling", lessons: threatModelingDeepLessons };
export const webAndApiThreats: LearningPath = { id: "web-and-api-threats", title: "Web and API Threats", lessons: webAndApiThreatsDeepLessons };
export const vulnerabilityLaboratory: LearningPath = { id: "vulnerability-laboratory", title: "Practical Vulnerability Laboratory", lessons: vulnerabilityLaboratoryDeepLessons };
export const linuxAndNetworkSecurity: LearningPath = { id: "linux-and-network-security", title: "Linux and Network Security", lessons: linuxAndNetworkSecurityDeepLessons };
export const containerAndDeliverySecurity: LearningPath = { id: "container-and-delivery-security", title: "Container and Delivery Security", lessons: containerAndDeliverySecurityDeepLessons };
export const artifactSigningVerification: LearningPath = { id: "artifact-signing-verification", title: "Artifact Signing and Verification", lessons: artifactSigningVerificationDeepLessons };
export const identityAndSecretsSecurity: LearningPath = { id: "identity-and-secrets-security", title: "Identity and Secrets Security", lessons: securityIdentitySecretsDeepLessons };
export const vaultSecretsPlatform: LearningPath = { id: "vault-secrets-platform", title: "Vault and Dynamic Secrets", lessons: vaultImplementationDeepLessons };
export const enterpriseDirectoryFederation: LearningPath = { id: "enterprise-directory-federation", title: "Enterprise Directory Federation", lessons: enterpriseDirectoryFederationDeepLessons };
export const secureFileTransferMigration: LearningPath = { id: "secure-file-transfer-migration", title: "FTP to SFTP Secure Transfer Migration", lessons: secureFileTransferMigrationDeepLessons };
export const applicationSecurity: LearningPath = { id: "application-security", title: "Application Security", lessons: applicationSecurityDeepLessons };
export const stewardSecurityAssessment: LearningPath = { id: "steward-security-assessment-and-hardening", title: "Security Steward Milestone", lessons: stewardSecurityAssessmentDeepLessons };

export const securityStewardPaths: LearningPath[] = [
    securityFoundations,
    threatModeling,
    webAndApiThreats,
    vulnerabilityLaboratory,
    linuxAndNetworkSecurity,
    containerAndDeliverySecurity,
    artifactSigningVerification,
    identityAndSecretsSecurity,
    vaultSecretsPlatform,
    enterpriseDirectoryFederation,
    secureFileTransferMigration,
    applicationSecurity,
    stewardSecurityAssessment,
];
