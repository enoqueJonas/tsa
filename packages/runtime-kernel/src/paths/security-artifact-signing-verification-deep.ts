import type { LearningResource, LessonBlock } from "../activities/content";
import type { Lesson } from "./lesson";

const cosign: LearningResource = { title: "Sigstore Cosign", url: "https://docs.sigstore.dev/cosign/" };
const sigstoreSecurity: LearningResource = { title: "Sigstore security model", url: "https://docs.sigstore.dev/about/security/" };

const blocks: LessonBlock[] = [
    { type: "paragraph", text: "Delivery Engineer created immutable Steward artifacts, provenance records and SBOMs. Security Steward now turns signing from a concept into an enforced trust control: sign one exact artifact identity, verify it independently, reject tampering or the wrong signer, and make deployment fail closed when verification does not satisfy policy." },
    { type: "heading", id: "trust", text: "Signing is useful only when verification is enforced", level: 2 },
    { type: "list", items: [
        "The signed subject is an immutable artifact identity such as an OCI digest, not a mutable tag alone.",
        "Cosign is TSA's primary implementation tool for the exercise; do not add a second signing stack merely for exposure.",
        "Signer identity, key/workload identity and verifier trust policy are separate decisions.",
        "SBOM/provenance evidence should remain bound to the same release identity.",
        "A valid signature from an untrusted identity must not become automatic authorization to deploy."
    ] },
    { type: "resources", title: "Continue learning", resources: [cosign, sigstoreSecurity] },
];

export const artifactSigningVerificationDeepLessons: Lesson[] = [
    {
        id: "security-artifact-signing-verification",
        title: "Artifact Signing and Verification",
        activities: [
            { id: "security-artifact-signing-verification-001", title: "From Provenance Evidence to Enforced Trust", estimatedMinutes: 40, content: { type: "reading", body: "Implement signing only after Steward has immutable release identities and a real repository/registry boundary.", blocks } },
            {
                id: "security-artifact-signing-verification-002",
                title: "Sign a Steward Release with Cosign",
                estimatedMinutes: 150,
                content: { type: "practical", objective: "Produce verifiable signing evidence for the exact Steward OCI artifact already published through the approved delivery chain.", scenario: "Nexus contains the image Jenkins built, but artifact location and digest alone do not prove that the artifact passed through the trusted release-signing identity.", instructions: [
                    "Select one approved Steward container image by immutable digest and record its source revision, Jenkins build and Nexus identity before signing.",
                    "Choose a Cosign signing identity model appropriate to the learner environment. Prefer workload/keyless identity when the environment supports it; otherwise use a deliberately managed lab key and document custody, rotation and compromise limits.",
                    "Never commit a private signing key, token or recovery material to Git or ordinary evidence.",
                    "Sign the exact image digest and independently verify the signature from a clean verifier context.",
                    "Bind or retain the corresponding SBOM/provenance evidence against the same artifact identity and prove that the subject digests agree.",
                    "Record what the successful verification proves and what it does not prove about source quality, vulnerability status or authorization."
                ], deliverables: ["Signed Steward image digest", "Signer/trust decision", "Independent verification evidence", "Artifact-SBOM/provenance identity link", "Signing-material custody note"], completionCriteria: ["The signed subject is immutable.", "Cosign signing and independent verification actually run.", "Live signing secrets are absent from source/evidence.", "SBOM/provenance and signature refer to the intended release identity.", "Signer authenticity is distinguished from artifact quality." ] },
            },
            {
                id: "security-artifact-signing-verification-003",
                title: "Enforce Verification Before Deployment",
                estimatedMinutes: 150,
                content: { type: "practical", objective: "Make the delivery path reject artifacts that do not satisfy Steward's signing trust policy.", scenario: "A signature that nobody checks does not protect the release path. The deployment gate must verify both artifact identity and the expected signer/trust root before promotion.", instructions: [
                    "Add a verification stage to the existing Jenkins/release path before the selected deployment/promotion boundary.",
                    "Pin verification to the immutable artifact digest and expected signer/key/workload identity rather than accepting any cryptographically valid signature.",
                    "Prove a correctly signed approved Steward image passes and proceeds to the next delivery stage.",
                    "Attempt verification with an unsigned artifact or intentionally invalid signature and prove the pipeline fails closed before deployment.",
                    "Create a second safe signing identity or equivalent wrong-signer case and prove a cryptographically valid but unauthorized signer is rejected.",
                    "Preserve verification output as release evidence without leaking sensitive signing material."
                ], deliverables: ["Versioned verification gate", "Trusted-signer policy", "Successful gate evidence", "Unsigned/invalid rejection", "Wrong-signer rejection", "Retained verification evidence"], completionCriteria: ["Deployment/promotion depends on successful signature verification.", "Verification is bound to the intended artifact digest.", "Any valid signer is not automatically trusted.", "Unsigned/invalid content is blocked.", "A valid but untrusted signer is blocked." ] },
            },
            {
                id: "security-artifact-signing-verification-004",
                title: "Break and Recover the Signing Trust Chain",
                estimatedMinutes: 120,
                content: { type: "practical", objective: "Operate signing as a lifecycle rather than a one-time command.", scenario: "A signing credential is rotated or suspected compromised. Releases must move to the replacement identity without silently continuing to trust the old one forever.", instructions: [
                    "Baseline one successful sign/verify/deployment-gate cycle.",
                    "Rotate or replace the learner-owned signing identity/key using a controlled procedure.",
                    "Prove newly signed content verifies under the replacement trust policy.",
                    "Prove the retired identity no longer authorizes a new release after the cutover, while preserving historical evidence needed to explain older releases.",
                    "Document compromise response: stop signing, identify affected release window, rotate trust, re-sign/rebuild where justified, and communicate verification policy changes.",
                    "Define monitoring/audit evidence for unexpected verification failures or signing use."
                ], deliverables: ["Signing rotation/cutover record", "Replacement verification evidence", "Retired-signer rejection", "Historical-verification decision", "Compromise-response runbook", "Audit/monitoring requirements"], completionCriteria: ["Signing trust can be rotated deliberately.", "The retired signer cannot authorize new releases after cutover.", "Historical evidence is not destroyed merely to rotate current trust.", "Compromise response identifies both signer and affected artifact identities.", "The learner can operate the trust lifecycle, not only run Cosign once." ] },
            },
            { id: "security-artifact-signing-verification-005", title: "Defend Steward's Artifact Trust Policy", estimatedMinutes: 20, content: { type: "reflection", prompt: "Explain the complete Steward artifact-trust chain from source revision and Jenkins build to Nexus digest, SBOM/provenance, Cosign signature, verifier trust policy and deployment gate. Explain why a checksum alone is insufficient, why any valid signature is insufficient, how signer rotation affects old versus new releases, and what evidence would justify changing the signing model later.", minimumCharacters: 350 } },
        ],
    },
];
