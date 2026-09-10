import type { Lesson } from "./lesson";

function practicalLesson(id: string, title: string, objective: string, instructions: string[], deliverables: string[], criteria: string[]): Lesson {
    return {
        id: `steward-internet-environment-${id}`,
        title,
        activities: [
            {
                id: `steward-internet-environment-${id}-001`,
                title,
                estimatedMinutes: 90,
                content: {
                    type: "practical",
                    objective,
                    scenario: "You are completing the Cloud Engineer school by proving one coherent Steward internet environment. Reuse the existing immutable application artifact, delivery pipeline and homelab lessons. Do not build a parallel demo stack or add managed services without a stated requirement.",
                    instructions,
                    deliverables,
                    completionCriteria: criteria,
                },
            },
        ],
    };
}

const brief: Lesson = {
    id: "steward-internet-environment-brief",
    title: "Milestone Brief: Steward Internet Environment",
    activities: [
        {
            id: "steward-internet-environment-brief-001",
            title: "Milestone Brief: Steward Internet Environment",
            estimatedMinutes: 45,
            content: {
                type: "reading",
                body: "The Cloud Engineer milestone proves that Steward can move from a learner-managed homelab to a deliberately designed internet-hosted environment without losing the engineering discipline established in Delivery Engineer.",
                blocks: [
                    { type: "heading", id: "goal", text: "What this milestone proves", level: 2 },
                    { type: "paragraph", text: "The goal is not to collect cloud services. The goal is to show that you can choose a hosting model, provision remote infrastructure, expose the right network path, encode infrastructure as code, control identity and secrets, reason about failure and recovery, and explain the cost of the resulting system." },
                    { type: "list", items: ["One real Steward release candidate is reused; the cloud environment does not rebuild application source by hand.", "Internet exposure is explicit: DNS, TLS, ingress and administrative access are separate concerns.", "Infrastructure is reproducible through Terraform or OpenTofu where the curriculum introduced IaC.", "Managed services are used only where a driver justifies their cost and responsibility shift.", "Backup and recovery are demonstrated, not assumed.", "The final architecture includes an explicit monthly cost model and accepted risks."] },
                    { type: "heading", id: "evidence-chain", text: "The evidence chain", level: 2 },
                    { type: "code", language: "text", caption: "Milestone evidence flow", code: "Steward source/release identity\n        ↓\nimmutable artifact from delivery platform\n        ↓\nIaC-defined remote infrastructure\n        ↓\nDNS + TLS + controlled ingress\n        ↓\nrunning Steward release\n        ↓\nexternal verification + recovery evidence\n        ↓\narchitecture + cost handoff" },
                    { type: "callout", tone: "steward", title: "Cloud boundary", body: "Cloud Engineer changes the infrastructure environment and makes it reproducible. It does not yet replace Quality, Security or Reliability with shallow checklists. Preserve clear handoffs into those schools." },
                ],
            },
        },
    ],
};

const gate1 = practicalLesson(
    "gate-1-hosting-architecture",
    "Gate 1: Hosting and Architecture Baseline",
    "Freeze the target architecture and explain why it is the smallest defensible remote design for Steward.",
    [
        "Start from the final Cloud Architecture and Cost review, not from a blank diagram.",
        "Record the chosen region, hosting model, compute, storage, database, virtual-network, ingress, identity, secret and backup decisions.",
        "For every managed service, state the operational responsibility transferred to the provider and the new dependency or cost introduced.",
        "Compare the target with Steward Homelab v1 and the single-VPS baseline.",
        "List accepted risks and explicitly deferred improvements.",
    ],
    ["Target architecture diagram", "Responsibility matrix", "Decision and accepted-risk register"],
    ["Every component has a stated driver.", "The design is explainable without relying only on provider product names.", "The architecture remains proportionate to Steward's current requirements."],
);

const gate2 = practicalLesson(
    "gate-2-iac-provisioning",
    "Gate 2: Reproducible Infrastructure",
    "Provision the remote Steward environment from reviewed Infrastructure as Code rather than console-only state.",
    [
        "Run formatting and validation for the Terraform/OpenTofu configuration.",
        "Generate a fresh plan and review create, update, replace and destroy actions before apply.",
        "Apply the configuration using the intended provider identity and record the resulting infrastructure identifiers and outputs.",
        "Re-run plan after apply and prove the configuration converges to no unintended changes.",
        "Verify that state is protected according to the remote-state design and that secrets are not committed or printed as ordinary outputs.",
    ],
    ["Reviewed IaC plan", "Apply evidence", "Post-apply convergence evidence", "State protection note"],
    ["Infrastructure exists because of versioned configuration.", "A second plan has no unexplained drift.", "State and provider credentials are treated as control-plane assets."],
);

const gate3 = practicalLesson(
    "gate-3-network-identity",
    "Gate 3: Network, Identity and Secrets Boundaries",
    "Prove that Steward's public request path and administrative/control-plane paths are deliberately separated.",
    [
        "Trace the external HTTPS path from DNS resolution through provider routing/firewall, TLS termination and the application listener.",
        "Confirm that database and backend-only ports are not directly exposed to the public internet.",
        "Demonstrate the intended SSH or alternative administrative path and show how it differs from public user ingress.",
        "Record the cloud IAM identities used by a human operator, infrastructure automation and the running workload.",
        "Trace one runtime secret from its managed source to the application without exposing its value in source, image, logs or IaC state output.",
    ],
    ["End-to-end network path", "Exposure matrix", "IAM responsibility map", "Secret-delivery evidence"],
    ["Public and administrative entry paths are distinct.", "No database or unnecessary backend port is public.", "Human, automation and workload identities are not one shared administrator identity."],
);

const gate4 = practicalLesson(
    "gate-4-release-verification",
    "Gate 4: Deploy and Verify the Steward Release",
    "Deploy the same immutable Steward artifact through the established delivery process and verify it from outside the cloud environment.",
    [
        "Choose one existing release candidate and record its source revision, application version and immutable image/package identity.",
        "Deploy that exact artifact to the IaC-provisioned environment; do not rebuild source on the target host.",
        "Record configuration and migration assumptions separately from artifact identity.",
        "Verify DNS resolution, certificate validity, HTTPS response and a representative authenticated Steward API request from an external client.",
        "Capture the running release identity and prove it matches the selected candidate.",
    ],
    ["Release identity record", "Deployment evidence", "External client verification", "Running-version proof"],
    ["The deployed bytes are traceable to the selected candidate.", "Success is demonstrated from a real external client rather than inferred from IaC or pipeline success.", "Configuration differences did not create a hidden rebuild-per-environment process."],
);

const gate5 = practicalLesson(
    "gate-5-recovery-failure",
    "Gate 5: Failure and Recovery Drill",
    "Demonstrate that one important cloud failure can be detected, diagnosed and recovered using documented evidence rather than memory.",
    [
        "Choose one safe failure scenario such as compute replacement, firewall misconfiguration, failed application deployment or restore into an isolated target.",
        "Before creating the failure, predict which signal should detect it and which evidence should distinguish infrastructure, network and application causes.",
        "Introduce the failure in a controlled manner and capture the first trustworthy symptom.",
        "Recover using IaC, the existing release artifact and the documented backup/recovery path as applicable.",
        "Verify recovery from the client perspective and record actual recovery time and any data-loss implication.",
    ],
    ["Failure hypothesis", "Detection evidence", "Recovery execution record", "Post-recovery client proof", "Observed recovery time"],
    ["The drill is safe and reversible.", "Recovery does not depend on rebuilding an old release or undocumented manual state.", "The final verification proves service recovery, not just resource recreation."],
);

const gate6 = practicalLesson(
    "gate-6-cost-operability",
    "Gate 6: Cost and Operability Review",
    "Prove that the remote environment is financially explainable and operationally proportionate.",
    [
        "List all billable resources and classify fixed/allocated versus usage-dependent cost drivers.",
        "Produce the expected monthly baseline using current provider pricing assumptions and record the date/source of those assumptions in your project notes.",
        "Compare actual or forecast spend with the budget threshold defined earlier in Cloud Engineer.",
        "Identify idle, oversized or redundant resources and either remove/right-size them or justify their retention.",
        "Document which provider-native monitoring and backup signals an operator should review before later Reliability work begins.",
    ],
    ["Monthly cost model", "Budget threshold and response", "Right-sizing decision", "Minimal cloud operations checklist"],
    ["Every persistent paid resource has an owner and reason to exist.", "Cost is treated as an architecture characteristic rather than an afterthought.", "The review does not prematurely duplicate Reliability Engineer's deeper observability work."],
);

const gate7 = practicalLesson(
    "gate-7-handoff",
    "Gate 7: Cloud Platform Handoff",
    "Produce a concise handoff that another engineer could use to understand, reproduce and safely operate the Steward internet environment.",
    [
        "Document the authoritative architecture and the public request path.",
        "Reference the IaC root, state backend assumptions, provider identity boundaries and destructive-change rules.",
        "Reference the Steward deployment/release path and immutable artifact source.",
        "Document DNS/TLS ownership, backup/recovery method, cost baseline and current failure domains.",
        "Separate completed Cloud Engineer concerns from work intentionally deferred to Quality Steward, Security Steward and Reliability Engineer.",
        "Record the most important known limitation that the next school should inherit rather than silently solving it here.",
    ],
    ["Cloud handoff document", "Architecture and dependency references", "Deferred-work register"],
    ["Another engineer can locate the infrastructure, release and recovery sources without personal memory.", "Deferred work is assigned to the correct later school.", "The handoff preserves both technical and cost assumptions."],
);

const review: Lesson = {
    id: "steward-internet-environment-review",
    title: "Milestone Review and Exit Criteria",
    activities: [
        {
            id: "steward-internet-environment-review-001",
            title: "Cloud Engineer Exit Review",
            estimatedMinutes: 45,
            content: {
                type: "reflection",
                prompt: "Can another engineer recreate the Steward internet environment from versioned infrastructure and delivery artifacts without relying on your laptop, cloud-console memory or undocumented manual steps? Explain the full path from immutable application artifact to IaC-provisioned infrastructure to DNS/TLS exposure and external verification. Identify the current single points of failure, the accepted monthly cost, the recovery evidence you actually proved, and which remaining concerns now belong specifically to Quality Steward, Security Steward and Reliability Engineer rather than Cloud Engineer.",
                minimumCharacters: 400,
            },
        },
    ],
};

export const cloudEngineerMilestoneDeepLessons: Lesson[] = [brief, gate1, gate2, gate3, gate4, gate5, gate6, gate7, review];
