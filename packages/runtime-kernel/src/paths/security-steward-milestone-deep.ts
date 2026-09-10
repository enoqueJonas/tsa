import type { LearningResource, LessonBlock } from "../activities/content";
import type { Lesson } from "./lesson";

const asvs: LearningResource = { title: "OWASP Application Security Verification Standard", url: "https://owasp.org/www-project-application-security-verification-standard/" };
const threatModeling: LearningResource = { title: "OWASP Threat Modeling", url: "https://owasp.org/www-community/Threat_Modeling" };
const ssdf: LearningResource = { title: "NIST Secure Software Development Framework", url: "https://csrc.nist.gov/Projects/ssdf" };

const briefingBlocks: LessonBlock[] = [
    { type: "paragraph", text: "The Security Steward milestone is not another security scan. It is the point where the learner must defend the security posture of the complete Steward ecosystem using evidence accumulated across the school: threat models, attack-path assessments, controlled reproductions, host and network hardening, supply-chain controls, application mitigations and regression tests." },
    { type: "heading", id: "milestone-security-claim", text: "From findings to defensible security claims", level: 2 },
    { type: "list", items: ["A finding states what was observed and why it matters.", "A mitigation states what changed.", "Retest evidence demonstrates whether the change actually altered the threat path.", "A verified control is a security claim supported by current evidence.", "Residual risk records what remains exposed, uncertain, accepted or deferred."] },
    { type: "paragraph", text: "The final assessment must preserve these distinctions. A scanner showing zero critical findings is not equivalent to a secure system, and a recommendation written in a report is not equivalent to an implemented control." },
    { type: "heading", id: "milestone-system-scope", text: "Assess Steward as one system", level: 2 },
    { type: "paragraph", text: "The scope includes the Steward API and identity model, PostgreSQL and sensitive data, Linux hosts and network paths, containers, CI/CD identities, deployment environments, Nexus/internal artifact repositories, external dependencies, and shared internal packages such as steward-common and tsa-test-core. The assessment should follow trust relationships across those boundaries instead of evaluating each technology in isolation." },
    { type: "callout", tone: "steward", title: "Evidence before opinion", body: "Every important conclusion in the final security assessment should point to evidence: a threat-model entry, request/response capture, test, configuration, scan result, package provenance record, SBOM, log event, hardening verification or retest. When evidence is missing, say that the control is unverified." },
    { type: "heading", id: "milestone-defense", text: "Prepare to defend engineering decisions", level: 2 },
    { type: "list", items: ["Why was this risk prioritized above another?", "Which control actually breaks or reduces the threat path?", "How do you know legitimate behavior still works?", "Which controls are preventive, detective or recovery-oriented?", "Which claims are automated continuously and which require periodic verification?", "What residual risk remains and who should own it?", "What would cause you to revisit the decision?"] },
    { type: "resources", title: "Reference frameworks", resources: [asvs, threatModeling, ssdf] },
];

export const stewardSecurityAssessmentDeepLessons: Lesson[] = [
    {
        id: "security-steward-milestone-briefing",
        title: "Milestone Briefing: Build a Defensible Steward Security Posture",
        activities: [
            { id: "security-steward-milestone-briefing-001", title: "Integrate the Security Steward Evidence", estimatedMinutes: 45, content: { type: "reading", body: "Prepare for the final Security Steward assessment by integrating evidence across the complete Steward ecosystem.", blocks: briefingBlocks } },
            { id: "security-steward-milestone-briefing-002", title: "Evidence Readiness Check", estimatedMinutes: 45, content: { type: "practical", objective: "Determine whether the accumulated Security Steward work is sufficient to support final security claims.", scenario: "Before changing anything else, inventory what evidence already exists and expose gaps honestly.", instructions: ["List the current threat model, findings, mitigations, retests, host/network evidence, supply-chain evidence and security regression results.", "Mark each important control as verified, partially verified, recommended/unimplemented or unknown.", "Identify stale evidence that no longer reflects the current Steward implementation.", "Create a short gap plan for evidence that must be refreshed during the milestone."], deliverables: ["Security evidence index", "Control-verification matrix", "Evidence gap plan"], completionCriteria: ["Every major Security Steward domain has identifiable evidence or an explicit gap.", "Recommendations are not mislabeled as verified controls.", "Stale or uncertain evidence is visible." ] } },
        ],
    },
    {
        id: "security-steward-milestone-assessment",
        title: "Milestone: Steward Security Assessment and Hardening",
        activities: [
            {
                id: "security-steward-milestone-assessment-001",
                title: "Rebaseline Threats, Assets and Trust Boundaries",
                estimatedMinutes: 90,
                content: {
                    type: "practical",
                    objective: "Refresh the Steward security model so the final assessment represents the system that actually exists.",
                    scenario: "Steward has evolved through Builder, platform, delivery, quality and Security Steward work. Reconcile the original threat model with the current architecture and implemented controls before drawing final conclusions.",
                    instructions: ["Inventory current actors, assets, data/control flows and trust boundaries.", "Include API, database, Linux/network, containers, CI/CD, Nexus/internal repositories, steward-common and tsa-test-core.", "Update abuse cases and threat entries affected by architecture or control changes.", "Mark assumptions and identify newly introduced trust relationships.", "Select the highest-priority threat paths for final verification."],
                    deliverables: ["Updated Steward threat model", "Current system/security boundary diagram", "Prioritized final-verification scope"],
                    completionCriteria: ["The model represents the current Steward ecosystem.", "Internal package and delivery trust boundaries are included.", "Final verification scope is risk-driven rather than checklist-driven."],
                },
            },
            {
                id: "security-steward-milestone-assessment-002",
                title: "Verify Controls Across the Steward Stack",
                estimatedMinutes: 180,
                content: {
                    type: "practical",
                    objective: "Produce current evidence for the most important security controls across application, infrastructure and delivery boundaries.",
                    scenario: "Reuse existing evidence where it is still valid, but rerun or refresh evidence when the implementation has changed or the security claim is important enough to require current proof.",
                    instructions: ["Verify representative authentication, authorization, validation, abuse-resistance and data-protection controls.", "Verify host identity/privilege, SSH, firewall/service exposure, logging and TLS/network boundaries.", "Verify container runtime assumptions and delivery identities/secrets.", "Verify Nexus/internal repository trust, approved resolution for steward-common and tsa-test-core, dependency/image scanning, and provenance/SBOM evidence where implemented.", "Run the Steward security regression layer and capture pipeline evidence.", "For every failed or partial control, record impact and decide whether to remediate now or carry residual risk."],
                    deliverables: ["Cross-stack control evidence bundle", "Security regression execution", "Supply-chain trust evidence", "Updated findings register"],
                    completionCriteria: ["Claims are supported by current evidence.", "Both successful controls and remaining weaknesses are recorded.", "Security verification does not break legitimate Steward workflows."],
                },
            },
            {
                id: "security-steward-milestone-assessment-003",
                title: "Close High-priority Gaps and Retest",
                estimatedMinutes: 150,
                content: {
                    type: "practical",
                    objective: "Reduce the most important remaining Steward risks and prove the effect of the changes.",
                    scenario: "Do not attempt to eliminate every theoretical weakness. Choose the gaps whose mitigation meaningfully improves Steward's security posture and can be justified against cost, complexity and operational consequences.",
                    instructions: ["Prioritize open findings using demonstrated impact, plausibility, exposure and existing control strength.", "Implement a representative set of high-value hardening changes across at least two security layers where gaps exist.", "Retest the original threat path after each mitigation.", "Run relevant functional/regression checks to detect security-induced breakage.", "Update threat entries, findings and residual risk based on the retest result."],
                    deliverables: ["Hardening changes", "Before/after security evidence", "Functional/regression evidence", "Updated residual-risk register"],
                    completionCriteria: ["Each claimed mitigation has retest evidence.", "Tradeoffs and operational consequences are documented.", "Deferred risks remain visible with rationale and ownership needs."],
                },
            },
            {
                id: "security-steward-milestone-assessment-004",
                title: "Publish the Steward Security Assessment",
                estimatedMinutes: 120,
                content: {
                    type: "practical",
                    objective: "Create a professional security assessment that a technical reviewer can audit and challenge.",
                    scenario: "The report is an engineering artifact, not a marketing statement. It should let another engineer understand scope, evidence, verified controls, findings, residual risk and the reasoning behind priorities.",
                    instructions: ["Write an executive summary that states posture without claiming absolute security.", "Document scope, architecture/trust boundaries and assessment methodology.", "Present prioritized findings with evidence, affected assets, mitigation and retest status.", "Create a verified-controls section separate from recommendations.", "Include host/network, application, delivery/container and software-supply-chain conclusions.", "Include the residual-risk register, assumptions, exceptions and recommended next verification dates or triggers.", "Link evidence artifacts without embedding secret values."],
                    deliverables: ["Steward Security Assessment", "Verified-controls register", "Prioritized findings", "Residual-risk register", "Evidence index"],
                    completionCriteria: ["The report distinguishes evidence, inference and recommendation.", "A reviewer can trace major conclusions to artifacts.", "The assessment covers the complete Steward security boundary.", "No sensitive credentials or unnecessary exploit material are included."],
                },
            },
            {
                id: "security-steward-milestone-assessment-005",
                title: "Defend the Security Posture",
                estimatedMinutes: 60,
                content: {
                    type: "practical",
                    objective: "Demonstrate Security Steward capability by defending the assessment's decisions, evidence and remaining risks.",
                    scenario: "Treat this as a technical review with a skeptical engineering/security panel. The goal is not to claim perfection; it is to show that you understand the system, can distinguish proof from assumption and can make responsible risk decisions.",
                    instructions: ["Present the three most important Steward threat paths and the controls that reduce them.", "Demonstrate at least one security regression control and one infrastructure or supply-chain verification artifact.", "Explain one risk you accepted or deferred and why.", "Explain one mitigation tradeoff that affected operability, delivery speed or architecture.", "Answer what evidence would make you change one of your conclusions.", "Record reviewer challenges as follow-up actions where they expose real gaps."],
                    deliverables: ["Security posture presentation/defense notes", "Demonstrated evidence", "Reviewer challenge log", "Follow-up actions"],
                    completionCriteria: ["The learner can defend conclusions without overstating certainty.", "Evidence supports the demonstrated claims.", "Tradeoffs and residual risk are explained as engineering decisions.", "Valid review challenges become explicit follow-up work."],
                },
            },
        ],
    },
];
