import type { LearningResource, LessonBlock } from "../activities/content";
import type { Lesson } from "./lesson";

const owaspSupplyChain: LearningResource = { title: "OWASP Software Supply Chain Security", url: "https://owasp.org/www-project-software-supply-chain-security/" };
const sigstore: LearningResource = { title: "Sigstore Documentation", url: "https://docs.sigstore.dev/" };
const spdx: LearningResource = { title: "SPDX", url: "https://spdx.dev/" };
const cyclonedx: LearningResource = { title: "CycloneDX", url: "https://cyclonedx.org/" };

const titles = [
    "Container Attack Surface",
    "Minimal and Trusted Base Images",
    "Image Scanning",
    "Container Runtime Permissions",
    "Secrets in Delivery",
    "CI/CD Identities and Least Privilege",
    "Protected Environments and Approval Boundaries",
    "Dependency Scanning",
    "SAST and DAST Concepts",
    "Software Supply-chain Security",
    "Dependency Confusion",
    "Typosquatting and Malicious Packages",
    "Internal Repository Trust Boundaries",
    "Package Provenance and Integrity",
    "SBOMs as Security Evidence",
    "Signing and Verification Concepts",
    "Security Gates and Exceptions",
    "Protecting Internal Publishing Credentials",
    "Securing steward-common and tsa-test-core Consumption",
] as const;

type Topic = (typeof titles)[number];

type Guidance = {
    intro: string;
    steward: string;
    practice: string[];
    reflection: string;
};

const guidance: Record<Topic, Guidance> = {
    "Container Attack Surface": {
        intro: "Containers reduce packaging friction, not security responsibility. Their attack surface includes image contents, runtime privileges, mounted files, exposed sockets, orchestration controls and the host kernel they ultimately share.",
        steward: "Steward containers should be assessed as part of the same trust model as the API, PostgreSQL, reverse proxy and delivery pipeline. A small image does not help if it runs privileged, mounts sensitive host paths or exposes unnecessary services.",
        practice: ["Inventory Steward container images, mounts, ports, users and runtime privileges.", "Map each exposure to a real Steward asset or trust boundary.", "Identify one unnecessary capability or reachable path.", "Document the control that should reduce it."],
        reflection: "Why is a container boundary not equivalent to a virtual-machine security boundary?",
    },
    "Minimal and Trusted Base Images": {
        intro: "Base images define a large portion of the software and trust inherited by every container. Minimality reduces unnecessary components; trust requires knowing where the image came from, how it is maintained and whether the selected version is intentional.",
        steward: "Steward should avoid convenience images containing shells, package managers or tools that production does not need, while still preserving debuggability through planned operational methods.",
        practice: ["Identify Steward base images and their sources.", "Compare installed components with runtime needs.", "Pin or otherwise make the selected base version intentional.", "Record the trade-off between minimality and operations."],
        reflection: "Why can an extremely small image still be a poor security choice?",
    },
    "Image Scanning": {
        intro: "Image scanning finds known vulnerabilities and risky contents in built artifacts. Scan results are inputs to risk decisions, not automatic proof that an image is safe or unsafe.",
        steward: "Steward image findings should be tied to whether the affected package is present, reachable, fixable and actually loaded in the deployed artifact.",
        practice: ["Scan a Steward image with an approved learner tool.", "Triage findings by severity, exploitability and reachability.", "Identify one fixable high-value issue.", "Rebuild and rescan after remediation."],
        reflection: "Why should a scanner result not be treated as a deployment decision by itself?",
    },
    "Container Runtime Permissions": {
        intro: "Runtime security is strongly influenced by which user a process runs as, which Linux capabilities it receives, which filesystem paths are writable and whether privilege escalation is possible.",
        steward: "Steward services should run with the narrowest permissions that support their actual responsibilities, especially around package caches, configuration, secrets and host mounts.",
        practice: ["Inspect effective user, capabilities and writable mounts for Steward containers.", "Identify one excessive permission.", "Reduce it in the learner environment.", "Retest application startup and required behavior."],
        reflection: "What security property improves when a Steward container runs as a non-root user with limited writable paths?",
    },
    "Secrets in Delivery": {
        intro: "Delivery systems routinely handle registry tokens, repository credentials, deployment keys and application secrets. A secure pipeline minimizes exposure in logs, artifacts, environment variables and long-lived runner state.",
        steward: "Nexus credentials, deployment tokens and signing material must never be baked into Steward images or committed into pipeline configuration.",
        practice: ["Map every secret used from build through deployment.", "Check whether any secret is copied into artifacts or logs.", "Move one weak secret usage into an appropriate secret store or protected variable.", "Verify masked and scoped use."],
        reflection: "Why is deleting a secret from a later image layer insufficient if it existed in an earlier layer?",
    },
    "CI/CD Identities and Least Privilege": {
        intro: "Pipelines are machine actors with real authority. Their identities should be scoped to the smallest repositories, environments and actions required for each stage.",
        steward: "A test job that only downloads tsa-test-core should not share the same credentials as a release job that can publish packages or deploy production Steward.",
        practice: ["Inventory CI identities and permissions.", "Separate read, publish and deploy capabilities.", "Reduce one overbroad credential or permission.", "Verify the intended pipeline still succeeds."],
        reflection: "Why should CI jobs be treated as separate actors instead of one trusted pipeline?",
    },
    "Protected Environments and Approval Boundaries": {
        intro: "Environment protection creates deliberate control points between code execution and sensitive deployment authority. Approvals are useful when they protect a meaningful boundary rather than adding ceremony everywhere.",
        steward: "Publishing shared internal packages and deploying production Steward are higher-impact transitions than running unit tests and should have distinct protection policies.",
        practice: ["Map Steward pipeline stages to environments and authority.", "Identify where production or publishing privilege first appears.", "Add or refine one approval/protection boundary.", "Document emergency and rollback behavior."],
        reflection: "When does an approval gate improve security, and when does it merely slow delivery?",
    },
    "Dependency Scanning": {
        intro: "Dependency scanning identifies known issues in third-party libraries and transitive packages. Useful triage considers version, reachability, exploit conditions and available fixes.",
        steward: "Steward and tsa-test-core should produce dependency evidence that distinguishes direct and transitive risk and avoids upgrading blindly without compatibility testing.",
        practice: ["Scan Steward application dependencies.", "Classify direct versus transitive findings.", "Remediate one meaningful finding.", "Run regression tests after the dependency change."],
        reflection: "Why can an uncritical automated dependency upgrade itself create risk?",
    },
    "SAST and DAST Concepts": {
        intro: "SAST analyzes source or compiled code without exercising a deployed service; DAST observes a running application from the outside. They answer different questions and both produce false positives and blind spots.",
        steward: "Steward should use these tools as complementary evidence around already-modeled threats, not as substitutes for architecture understanding or manual reasoning.",
        practice: ["Run one static and one dynamic security check against learner-controlled Steward.", "Compare what each tool can and cannot observe.", "Triage at least one result from each.", "Record one threat neither tool adequately covers."],
        reflection: "Give one Steward weakness SAST is better positioned to detect and one DAST is better positioned to detect.",
    },
    "Software Supply-chain Security": {
        intro: "The software supply chain includes source, dependencies, build systems, internal repositories, images, signatures, deployment and every identity allowed to modify those artifacts.",
        steward: "Steward's chain includes source control, CI, Nexus, steward-common, tsa-test-core, container images and deployment targets. A compromise at any authoritative step can become trusted downstream.",
        practice: ["Draw Steward's source-to-deployment supply chain.", "Mark identities and trust boundaries.", "Identify one high-impact tampering point.", "Define preventive and detective controls for it."],
        reflection: "Why is securing source code alone insufficient to secure the Steward release?",
    },
    "Dependency Confusion": {
        intro: "Dependency confusion occurs when a package resolver can be tricked into selecting an unintended package from a less-trusted repository, often because internal names also exist externally.",
        steward: "Internal packages such as steward-common and tsa-test-core must resolve from the intended internal repository with deliberate namespace and repository-ordering policy.",
        practice: ["Inspect current package-source configuration.", "Document where internal package names can resolve from.", "Harden repository routing or namespace policy.", "Verify resolution uses the intended source."],
        reflection: "How can a perfectly legitimate public package become dangerous when its name collides with an internal package?",
    },
    "Typosquatting and Malicious Packages": {
        intro: "Package ecosystems can contain deliberately deceptive names or compromised releases. Security therefore includes verifying dependency identity, maintainer trust and change intent, not only vulnerability databases.",
        steward: "Reviewers should be suspicious of unexpected new dependencies, especially ones whose names resemble common packages or whose functionality could be implemented without another dependency.",
        practice: ["Review recent Steward dependency additions.", "Check package identity and provenance signals.", "Identify one dependency that deserves enhanced scrutiny.", "Document approval criteria for future additions."],
        reflection: "Why might a package with zero known CVEs still be unsafe to add?",
    },
    "Internal Repository Trust Boundaries": {
        intro: "An internal repository centralizes control but also becomes a high-value trust boundary. Read, publish, promote and administer permissions should be distinct and auditable.",
        steward: "Nexus should not be treated as trusted merely because it is internal. Its publisher identities, hosted/proxy repositories and promotion rules must be explicit.",
        practice: ["Map Nexus repositories and roles used by Steward.", "Separate consumer, publisher and administrator authority.", "Identify one overly broad trust assumption.", "Define the evidence needed to verify repository policy."],
        reflection: "Why can moving packages into Nexus reduce one risk while creating another concentration-of-trust risk?",
    },
    "Package Provenance and Integrity": {
        intro: "Integrity answers whether an artifact changed; provenance answers where it came from and how it was produced. Strong release evidence connects artifact identity back to an expected build process and source revision.",
        steward: "A steward-common version should be traceable to source and pipeline execution rather than trusted only because a file with that version exists in Nexus.",
        practice: ["Select one internal package release.", "Trace it to source revision and build job.", "Capture digest or immutable artifact identity.", "Document any provenance gap."],
        reflection: "Why is a checksum useful but insufficient as full provenance evidence?",
    },
    "SBOMs as Security Evidence": {
        intro: "A Software Bill of Materials records components contained in an artifact so teams can answer what is affected when a dependency issue emerges. Its value depends on accuracy, artifact linkage and lifecycle integration.",
        steward: "Steward images and internal packages should generate SBOM evidence where tooling supports it, then retain that evidence with the corresponding release.",
        practice: ["Generate an SBOM for a Steward artifact.", "Inspect direct and transitive components.", "Link the SBOM to an artifact digest or version.", "Use it to answer one hypothetical vulnerability-impact question."],
        reflection: "Why is an SBOM generated once and never associated with a release of limited security value?",
    },
    "Signing and Verification Concepts": {
        intro: "Signing establishes a verifiable relationship between an artifact and a trusted signing identity or workflow. Verification matters only when consumers actually enforce the expected trust policy.",
        steward: "Steward can use signing concepts for packages or container images, but the curriculum emphasizes understanding trust roots, verification and keyless/workload identity patterns before adopting tooling blindly.",
        practice: ["Choose one Steward artifact type suitable for signing.", "Define the trusted signer or workflow identity.", "Produce signing/verification evidence where tooling is available.", "Document what a failed verification should block."],
        reflection: "Why does signing an artifact provide little protection if deployment never verifies the signature?",
    },
    "Security Gates and Exceptions": {
        intro: "Security gates turn evidence into delivery policy. Good gates block clearly unacceptable risk while allowing documented exceptions for context that automation cannot understand.",
        steward: "A critical exploitable dependency or failed provenance check may justify blocking Steward delivery; an irrelevant scanner finding may justify a time-bounded exception with ownership.",
        practice: ["Choose one security check suitable for a delivery gate.", "Define pass/fail criteria.", "Define exception owner, justification and expiry.", "Test both a pass and controlled failure path."],
        reflection: "Why should security exceptions expire instead of becoming permanent suppressions?",
    },
    "Protecting Internal Publishing Credentials": {
        intro: "Publishing credentials can alter what every downstream consumer trusts. They deserve narrow scope, short lifetime where possible, protected storage and strong auditability.",
        steward: "Credentials that publish steward-common or tsa-test-core should be available only to the release job and must not also provide Nexus administration capability.",
        practice: ["Inspect how internal publishing credentials are stored and injected.", "Verify scope and repository permissions.", "Reduce one exposure or excessive permission.", "Confirm logs and artifacts do not contain the secret."],
        reflection: "Why are internal package-publishing credentials potentially more dangerous than ordinary package-read credentials?",
    },
    "Securing steward-common and tsa-test-core Consumption": {
        intro: "Shared internal packages amplify both engineering consistency and security impact. Consumers must know which repository, package version and integrity/provenance evidence they are trusting.",
        steward: "Steward and its tests should resolve steward-common and tsa-test-core from approved internal sources, pin versions intentionally and make unexpected source/version changes observable in review and CI.",
        practice: ["Trace how Steward resolves both internal packages.", "Verify repository source and selected versions.", "Identify how an unauthorized version change would be detected.", "Record a reproducible trusted-consumption policy."],
        reflection: "Why does introducing reusable internal packages increase the importance of supply-chain controls?",
    },
};

function blocksFor(topic: Topic, item: Guidance): LessonBlock[] {
    return [
        { type: "paragraph", text: item.intro },
        { type: "heading", id: `${topic.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-principles`, text: "Security reasoning", level: 2 },
        { type: "list", items: ["Identify the artifact, identity or trust boundary involved.", "Distinguish verified evidence from assumed trust.", "Reduce privilege and ambiguity before adding more tooling.", "Retest delivery behavior after each security change."] },
        { type: "heading", id: `${topic.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-steward`, text: "Apply it to Steward", level: 2 },
        { type: "paragraph", text: item.steward },
        { type: "callout", tone: "steward", title: "Stewardship checkpoint", body: "The trusted path is source → CI identity → build artifact → internal repository/registry → verification → deployment/consumption. Every lesson should make at least one trust decision in that path explicit and evidence-backed." },
        { type: "resources", title: "Continue learning", resources: [owaspSupplyChain, sigstore, spdx, cyclonedx] },
    ];
}

function lessonFrom(topic: Topic): Lesson {
    const item = guidance[topic];
    const slug = topic.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    return {
        id: `container-and-delivery-security-${slug}`,
        title: topic,
        activities: [
            {
                id: `container-and-delivery-security-${slug}-001`,
                title: topic,
                estimatedMinutes: 45,
                content: { type: "reading", body: item.intro, blocks: blocksFor(topic, item) },
            },
            {
                id: `container-and-delivery-security-${slug}-002`,
                title: `Secure: ${topic}`,
                estimatedMinutes: 55,
                content: {
                    type: "practical",
                    objective: `Apply ${topic} to the real learner-controlled Steward delivery ecosystem.`,
                    scenario: "Use Steward source, CI/CD, Nexus/internal repositories, container images, steward-common, tsa-test-core and deployment targets. Change only systems you are authorized to administer and capture before/after evidence.",
                    instructions: item.practice,
                    deliverables: ["Supply-chain/security evidence", "Configuration or policy change", "Verification and residual-risk note"],
                    completionCriteria: ["The work addresses a real Steward trust boundary or threat.", "The security claim is backed by observable evidence.", "Normal build, test, publish or deployment behavior is retested after the change."],
                },
            },
            {
                id: `container-and-delivery-security-${slug}-003`,
                title: `Knowledge Check: ${topic}`,
                estimatedMinutes: 10,
                content: { type: "reflection", prompt: item.reflection, minimumCharacters: 200 },
            },
        ],
    };
}

const lab: Lesson = {
    id: "container-and-delivery-security-steward-supply-chain-lab",
    title: "Lab: Harden the Steward Software Supply Chain",
    activities: [
        {
            id: "container-and-delivery-security-steward-supply-chain-lab-001",
            title: "Map and Baseline the Trusted Delivery Path",
            estimatedMinutes: 90,
            content: {
                type: "practical",
                objective: "Produce an evidence-backed model of how Steward code and internal dependencies become trusted running artifacts.",
                scenario: "Start from the existing Steward threat model and Linux/network hardening evidence. Include source, CI identities, Nexus, steward-common, tsa-test-core, container images and deployment targets.",
                instructions: ["Draw the source-to-deployment chain.", "Mark read, publish, promote, deploy and administer identities.", "Record repository routing and internal package resolution.", "Capture current scanning, provenance, SBOM and verification evidence."],
                deliverables: ["Supply-chain map", "Identity/permission matrix", "Artifact trust baseline", "Prioritized gaps"],
                completionCriteria: ["The model reflects the actual Steward delivery path.", "Internal dependency trust is explicit.", "Assumptions are separated from verified controls."],
            },
        },
        {
            id: "container-and-delivery-security-steward-supply-chain-lab-002",
            title: "Implement High-value Supply-chain Controls",
            estimatedMinutes: 150,
            content: {
                type: "practical",
                objective: "Reduce the highest-impact Steward delivery and dependency risks while preserving usable engineering flow.",
                scenario: "Prioritize controls that constrain publisher/deployer authority and make artifact identity, source and contents observable.",
                instructions: ["Apply least privilege to CI and internal repository credentials.", "Harden dependency resolution against confusion or unintended sources.", "Scan dependencies and images and remediate at least one meaningful issue.", "Generate provenance, digest and/or SBOM evidence where supported.", "Verify steward-common and tsa-test-core resolve from intended repositories and versions."],
                deliverables: ["Security control changes", "Scan evidence", "Provenance/SBOM evidence", "Trusted-consumption verification"],
                completionCriteria: ["Controls protect named threats or trust boundaries.", "Internal package consumption is deterministic and evidenced.", "The delivery pipeline still performs its intended work."],
            },
        },
        {
            id: "container-and-delivery-security-steward-supply-chain-lab-003",
            title: "Define Gates, Exceptions and Residual Risk",
            estimatedMinutes: 90,
            content: {
                type: "practical",
                objective: "Turn supply-chain hardening into durable delivery policy and reusable Security Steward evidence.",
                scenario: "Use the evidence created in the previous activities to decide which controls should prevent delivery, which should warn and how justified exceptions are governed.",
                instructions: ["Define at least one security gate with objective pass/fail criteria.", "Define a time-bounded exception process with owner and expiry.", "Retest a controlled failure path.", "Update findings and threat-model entries with verified state and residual risk."],
                deliverables: ["Security gate policy", "Exception policy", "Failure-path evidence", "Updated residual-risk register"],
                completionCriteria: ["Gates are tied to meaningful risk.", "Exceptions are accountable and temporary.", "Final claims distinguish implemented controls from future recommendations."],
            },
        },
    ],
};

export const containerAndDeliverySecurityDeepLessons: Lesson[] = [...titles.map(lessonFrom), lab];
