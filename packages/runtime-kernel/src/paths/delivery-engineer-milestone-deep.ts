import type { Lesson } from "./lesson";

export const deliveryEngineerMilestoneDeepLessons: Lesson[] = [
    {
        id: "steward-delivery-platform-milestone-brief",
        title: "Milestone Brief: Steward Delivery Platform",
        activities: [{
            id: "steward-delivery-platform-milestone-brief-001",
            title: "Milestone Brief: Steward Delivery Platform",
            estimatedMinutes: 35,
            content: {
                type: "practical",
                objective: "Integrate the Delivery Engineer school into one credible commit-to-runtime delivery platform for Steward.",
                scenario: "Do not build parallel demo infrastructure. Reconcile the CI pipeline, container workflow, Nexus repositories, Ansible-managed host state, deployment automation and release process you already created into one evidence-backed system.",
                instructions: [
                    "Choose one real Steward release candidate and freeze its source revision, package versions and OCI image identity.",
                    "Draw the authoritative delivery path from source change through CI, Nexus, promotion, deployment and runtime verification.",
                    "Identify the owner and evidence for every transition in that path.",
                    "List any remaining manual or mutable step that can break traceability or repeatability.",
                ],
                deliverables: ["Authoritative delivery-path diagram", "Release candidate identity record", "Transition owner/evidence matrix", "Known manual/mutable gaps"],
                completionCriteria: ["The milestone reuses prior work rather than creating duplicate pipelines.", "Every artifact identity is explicit.", "Every major transition has evidence and ownership."],
            },
        }],
    },
    {
        id: "steward-delivery-platform-gate-1-ci-artifacts",
        title: "Gate 1: Source, CI and Artifact Integrity",
        activities: [{
            id: "steward-delivery-platform-gate-1-ci-artifacts-001",
            title: "Gate 1: Prove Source-to-Artifact Traceability",
            estimatedMinutes: 120,
            content: {
                type: "practical",
                objective: "Prove that reviewed Steward source produces traceable internal package and container artifacts without workstation-local handoffs.",
                scenario: "Use the existing CI and Nexus path. The goal is evidence, not adding more tools.",
                instructions: [
                    "Run the pipeline for the chosen source revision from a clean CI context.",
                    "Prove required checks and tests gate artifact production.",
                    "Publish steward-common through the approved internal package path when applicable.",
                    "Publish the Steward OCI image to Nexus and record its immutable digest.",
                    "Record source commit, CI run, package version/hash and image digest in one release candidate record.",
                    "Demonstrate one intentional CI failure that correctly prevents publish or promotion.",
                ],
                deliverables: ["CI evidence", "Internal package identity", "OCI digest", "Source-to-artifact traceability record", "Blocked-failure evidence"],
                completionCriteria: ["No consumer depends on producer filesystem state.", "Failed required checks cannot produce an accepted release candidate.", "The exact artifacts can be traced to the exact source revision."],
            },
        }],
    },
    {
        id: "steward-delivery-platform-gate-2-infrastructure",
        title: "Gate 2: Reproducible Delivery Infrastructure",
        activities: [{
            id: "steward-delivery-platform-gate-2-infrastructure-001",
            title: "Gate 2: Prove Host and Repository Reproducibility",
            estimatedMinutes: 120,
            content: {
                type: "practical",
                objective: "Prove the infrastructure required to deliver Steward is declared, reproducible and separated from application release state.",
                scenario: "The homelab already hosts Steward, CI execution and Nexus. Demonstrate that host configuration is not dependent on undocumented manual repair.",
                instructions: [
                    "Run the relevant Ansible configuration against the Steward delivery hosts.",
                    "Prove a second run converges without unnecessary change.",
                    "Introduce one safe host-level drift condition and repair it through declared configuration.",
                    "Verify Nexus persistence survives service recreation and that publisher/read-only permissions still behave as designed.",
                    "Document which state belongs to host configuration, Nexus persistence, application deployment and database persistence.",
                ],
                deliverables: ["Ansible convergence evidence", "Drift-repair evidence", "Nexus persistence evidence", "State-boundary map"],
                completionCriteria: ["Host preparation is reproducible.", "Repository persistence is not confused with disposable service state.", "Application deployment is not used as a substitute for host configuration management."],
            },
        }],
    },
    {
        id: "steward-delivery-platform-gate-3-promotion",
        title: "Gate 3: Promotion and Deployment",
        activities: [{
            id: "steward-delivery-platform-gate-3-promotion-001",
            title: "Gate 3: Promote the Same Candidate",
            estimatedMinutes: 150,
            content: {
                type: "practical",
                objective: "Promote and deploy the exact Steward candidate already verified by CI without rebuilding it between environments.",
                scenario: "Treat promotion as a controlled state transition. Environment-specific configuration may vary, but artifact bytes must not silently change.",
                instructions: [
                    "Define the promotion gates and the risk question each gate answers.",
                    "Capture approval or automated evidence for each gate.",
                    "Deploy using immutable artifact identity from Nexus.",
                    "Run migrations according to the documented compatibility/rollback plan.",
                    "Record target environment, deployment execution and running artifact identity.",
                ],
                deliverables: ["Gate matrix", "Promotion evidence", "Deployment execution record", "Running artifact identity", "Migration record"],
                completionCriteria: ["No artifact is rebuilt during promotion.", "Every gate has explicit evidence.", "The deployed runtime resolves to the approved candidate."],
            },
        }],
    },
    {
        id: "steward-delivery-platform-gate-4-verification",
        title: "Gate 4: Runtime Verification",
        activities: [{
            id: "steward-delivery-platform-gate-4-verification-001",
            title: "Gate 4: Prove the Release is Actually Serving",
            estimatedMinutes: 90,
            content: {
                type: "practical",
                objective: "Prove deployment success using runtime and client evidence rather than pipeline completion alone.",
                scenario: "A green deployment job is not sufficient proof that Steward is healthy or usable.",
                instructions: [
                    "Capture container/process health and the running release identity.",
                    "Verify database/dependency reachability required by Steward.",
                    "Exercise at least one representative authenticated Steward API path.",
                    "Compare expected behavior before and after the release.",
                    "Record the exact timestamp and release identity associated with verification."],
                deliverables: ["Health evidence", "Dependency reachability evidence", "Client/API verification", "Before/after release record"],
                completionCriteria: ["Verification proves application behavior.", "Evidence is tied to the exact release identity.", "A successful pipeline cannot substitute for failed runtime verification."],
            },
        }],
    },
    {
        id: "steward-delivery-platform-gate-5-failure",
        title: "Gate 5: Failure, Rollback and Recovery",
        activities: [{
            id: "steward-delivery-platform-gate-5-failure-001",
            title: "Gate 5: Fail the Delivery Platform Deliberately",
            estimatedMinutes: 150,
            content: {
                type: "practical",
                objective: "Demonstrate that Steward delivery can stop, recover and return to a verified state when a candidate is unacceptable.",
                scenario: "Use a safe controlled failure such as invalid configuration, failed verification or unavailable dependency. Do not damage valuable persistent data merely to manufacture failure.",
                instructions: [
                    "Predict the first stage that should detect the chosen failure.",
                    "Execute the delivery path until the failure is observed.",
                    "Capture the first trustworthy evidence that promotion or runtime should stop.",
                    "Apply the pre-defined rollback or forward-recovery strategy.",
                    "Prove the last-known-good or repaired state from the client perspective.",
                    "Confirm the required previous artifact is still available in Nexus and was not rebuilt during recovery."],
                deliverables: ["Failure evidence", "Recovery decision", "Rollback/forward-repair record", "Last-known-good client verification"],
                completionCriteria: ["Failure is detected by evidence.", "Recovery uses known artifacts and documented state assumptions.", "Persistent data compatibility is considered explicitly."],
            },
        }],
    },
    {
        id: "steward-delivery-platform-gate-6-handoff",
        title: "Gate 6: Delivery Platform Handoff",
        activities: [{
            id: "steward-delivery-platform-gate-6-handoff-001",
            title: "Gate 6: Produce the Engineering Handoff",
            estimatedMinutes: 75,
            content: {
                type: "practical",
                objective: "Produce a concise handoff that lets another engineer understand, operate and extend the Steward delivery platform.",
                scenario: "Cloud Engineer will later move the now-containerized and automated system onto cloud/VPS infrastructure. The handoff should make the current delivery contract explicit without prematurely solving cloud architecture.",
                instructions: [
                    "Document the authoritative source-to-runtime path and major trust boundaries.",
                    "Record CI runner assumptions, Nexus endpoints, repository roles, artifact naming/versioning and Ansible inventory boundaries.",
                    "Reference the release runbook and recovery procedure.",
                    "List current capacity/failure-domain constraints that matter when moving to cloud infrastructure.",
                    "List security, quality and reliability work intentionally deferred to later schools."],
                deliverables: ["Delivery platform architecture/handoff", "Runbook references", "Environment and capacity assumptions", "Deferred-work register"],
                completionCriteria: ["The handoff is concise and reviewable.", "It separates current facts from future recommendations.", "Later schools have clear inputs without duplicating Delivery Engineer work."],
            },
        }],
    },
    {
        id: "steward-delivery-platform-review",
        title: "Milestone Review and Exit Criteria",
        activities: [{
            id: "steward-delivery-platform-review-001",
            title: "Delivery Engineer Exit Review",
            estimatedMinutes: 45,
            content: {
                type: "reflection",
                prompt: "Assume your development laptop disappears and you are not available. Can another engineer take a reviewed Steward commit, reproduce the required delivery infrastructure, obtain the correct internal dependencies, produce and identify the release artifacts, promote the exact candidate, deploy it, verify it and recover from a failed release using only versioned configuration, Nexus, pipeline evidence and runbooks? Identify every remaining step that still depends on your personal machine or memory.\n\nThen explain which parts of the platform are Delivery Engineer responsibilities and which concerns must now pass to Cloud Engineer, Quality Steward, Security Steward and Reliability Engineer.",
                minimumCharacters: 400,
            },
        }],
    },
];
