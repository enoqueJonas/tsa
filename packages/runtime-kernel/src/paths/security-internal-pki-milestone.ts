import type { AuthoredLesson } from "./normalize-authored-curriculum";

export const internalPkiImplementationMilestone: AuthoredLesson = {
    id: "internal-pki-operated-trust-milestone",
    title: "Milestone: Operate Steward Internal Machine Trust",
    summary: "Prove the internal PKI as a working machine-trust capability before deciding its long-term ownership and Vault migration path.",
    objectives: ["Operate issuance, trust distribution and mTLS on a real Steward path.", "Prove rotation and revocation change live trust behavior.", "Recover from a broken chain without disabling verification."],
    activities: [{
        type: "practical",
        title: "Build and prove the internal trust platform",
        objective: "Demonstrate the complete internal certificate lifecycle on the selected Steward service-to-service boundary.",
        scenario: "The CA hierarchy and individual lifecycle exercises exist. The milestone must prove they form one operated trust system rather than isolated OpenSSL labs.",
        instructions: ["Capture the root/intermediate, trust-store, server/client identity and mTLS topology without exposing private material.", "Issue or rotate the selected server and client identities and verify the certificates actually served/used on the network.", "Prove no-client and untrusted-client requests fail closed while the intended identity succeeds.", "Revoke a previously valid client identity and prove it is rejected before natural expiry.", "Introduce one broken-chain/trust-distribution condition, diagnose it from protocol/certificate evidence and recover without disabling TLS verification.", "Produce the PKI operations runbook covering issuance, rotation, revocation, trust distribution and emergency recovery."],
        deliverables: ["Internal trust topology", "Live mTLS evidence", "Rotation evidence", "Revocation evidence", "Broken-chain recovery evidence", "PKI operations runbook"],
        completionCriteria: ["Machine identity is cryptographically enforced on a real internal path.", "Rotation and revocation are demonstrated against live behavior.", "Trust failures are recovered without insecure verification bypasses.", "No private key or secret is exposed in ordinary evidence."],
    }],
};
