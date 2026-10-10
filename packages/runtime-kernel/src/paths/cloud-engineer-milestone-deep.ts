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
                    scenario: "You are completing the Cloud Engineer school by proving one coherent Steward internet environment. Reuse the existing immutable application artifact, delivery pipeline and homelab lessons. Do not build a parallel demo stack or add platform layers without a stated requirement.",
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
                body: "The Cloud Engineer milestone proves that Steward can move from a learner-managed homelab to a deliberately designed internet-hosted and enterprise-platform environment without losing the engineering discipline established in Delivery Engineer.",
                blocks: [
                    { type: "heading", id: "goal", text: "What this milestone proves", level: 2 },
                    { type: "paragraph", text: "The goal is not to collect cloud products. The goal is to show that you can choose a hosting model, provision infrastructure, expose the right network path through Kong, encode infrastructure with OpenTofu, operate a Kubernetes/OpenShift runtime, reconcile declared environment state with Argo CD, reason about failure and recovery, and explain the cost and responsibility of the resulting system." },
                    { type: "list", items: ["One real Steward release candidate is reused; no environment rebuilds source by hand.", "Internet exposure is explicit: DNS, TLS, Kong ingress and administrative access are separate concerns.", "Infrastructure is reproducible through OpenTofu while Terraform concepts remain transferable.", "Kubernetes/OpenShift runtime state is versioned and GitOps reconciliation has one authoritative owner.", "GitLab CI/CD remains the build/test/package/publish system; Argo CD reconciles environment state rather than replacing CI.", "Managed services or enterprise platform layers remain only where a driver justifies their cost and responsibility shift.", "Backup and recovery are demonstrated, not assumed.", "The final architecture includes an explicit monthly cost model and accepted risks."] },
                    { type: "heading", id: "evidence-chain", text: "The evidence chain", level: 2 },
                    { type: "code", language: "text", caption: "Milestone evidence flow", code: "Steward source revision\n        ↓\nGitLab CI/CD build/test/package\n        ↓\nimmutable artifact in Nexus\n        ↓\nOpenTofu-defined infrastructure\n        ↓\nOpenShift/Kubernetes + environment Git\n        ↓\nArgo CD reconciliation\n        ↓\nKong + DNS + TLS public edge\n        ↓\nrunning Steward image digest\n        ↓\nexternal verification + recovery evidence\n        ↓\narchitecture + cost handoff" },
                    { type: "callout", tone: "steward", title: "Cloud boundary", body: "Cloud Engineer establishes the infrastructure, orchestration, gateway and GitOps platform. It does not yet replace Quality, Security or Reliability with shallow checklists. Preserve clear handoffs into those schools." },
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
        "Record the chosen region, hosting model, compute, storage, database, virtual-network, Kong edge, Kubernetes/OpenShift, GitOps, identity, secret and backup decisions.",
        "For every managed service or platform layer, state the operational responsibility transferred or added, plus the new dependency or cost introduced.",
        "Compare the target with Steward Homelab v1 and the single-VPS baseline; state which problems justify keeping Kubernetes/OpenShift and which simpler designs would still be valid alternatives.",
        "List accepted risks and explicitly deferred improvements.",
    ],
    ["Target architecture diagram", "Responsibility matrix", "Decision and accepted-risk register"],
    ["Every component has a stated driver.", "The design is explainable without relying only on product names.", "The architecture remains proportionate to Steward's current requirements."],
);

const gate2 = practicalLesson(
    "gate-2-iac-provisioning",
    "Gate 2: Reproducible Infrastructure",
    "Provision the remote Steward environment from reviewed OpenTofu configuration rather than console-only state.",
    [
        "Run formatting and validation for the OpenTofu configuration and record the provider/version constraints.",
        "Generate a fresh plan and review create, update, replace and destroy actions before apply.",
        "Apply the exact reviewed plan using the intended provider identity and record the resulting infrastructure identifiers and outputs.",
        "Re-run plan after apply and prove the configuration converges to no unintended changes.",
        "Verify that state is protected according to the remote-state design, concurrent writes are locked or otherwise safely serialized, and secrets are not committed or printed as ordinary outputs.",
        "Prove one lifecycle edge case from the IaC module: safe import/adoption, address-preserving refactor, replacement review or recovery from a partial apply.",
        "State which responsibilities remain outside OpenTofu: host configuration, artifact build, cluster workload reconciliation and application/domain configuration.",
    ],
    ["Reviewed OpenTofu plan", "Apply evidence", "Post-apply convergence evidence", "State protection note", "IaC responsibility boundary"],
    ["Infrastructure exists because of versioned configuration.", "A second plan has no unexplained drift.", "State and provider credentials are treated as control-plane assets."],
);

const gate3 = practicalLesson(
    "gate-3-network-identity",
    "Gate 3: Network, Gateway, Identity and Secrets Boundaries",
    "Prove that Steward's public request path and administrative/control-plane paths are deliberately separated.",
    [
        "Trace the external HTTPS path from DNS resolution through provider routing/firewall, Kong TLS termination/routing and the Steward service endpoint.",
        "Confirm that direct Django, PostgreSQL, Redis, RabbitMQ, GitLab CI/CD, Nexus and cluster-management endpoints are not public user services.",
        "Demonstrate the intended SSH/VPN or cluster administrative path and show how it differs from public user ingress.",
        "Record the cloud, Kubernetes/OpenShift and GitOps identities used by a human operator, infrastructure automation, Argo CD and the running workload.",
        "Trace one runtime secret from its managed source to the workload without exposing its value in source, image, logs, environment Git or IaC output.",
        "Prove the public certificate lifecycle, not only current TLS success: identify the certificate actually served by Kong, show automated renewal scheduling and reload/deployment behavior, and show independent expiry/renewal-health evidence.",
        "Prove that domain authorization remains in Steward rather than being moved into Kong policy.",
    ],
    ["End-to-end network path", "Exposure matrix", "Identity responsibility map", "Secret-delivery evidence", "Served-certificate and renewal-lifecycle evidence", "Gateway/domain authorization boundary"],
    ["Public and administrative entry paths are distinct.", "No database, platform-admin or unnecessary backend port is public.", "Human, automation, GitOps and workload identities are not one shared administrator identity.", "TLS evidence proves both the currently served certificate and a tested renewal/expiry-detection path."],
);

const gate4 = practicalLesson(
    "gate-4-release-verification",
    "Gate 4: Reconcile and Verify the Steward Release",
    "Deploy the same immutable Steward artifact through the established GitLab CI/CD/Nexus and GitOps chain and verify it from outside the environment.",
    [
        "Choose one existing release candidate and record its source revision, application version and immutable image digest in Nexus.",
        "Keep GitLab CI/CD responsible for build/test/package/publish; update or approve environment Git so Argo CD reconciles that exact artifact into Kubernetes/OpenShift.",
        "Verify that direct GitLab CI/CD push deployment is not simultaneously authoritative for the same GitOps-managed environment.",
        "Record API, outbox-publisher and lifecycle-consumer role commands, PostgreSQL/Redis/RabbitMQ placement, configuration and migration assumptions separately from artifact identity.",
        "Prove scheduler placement/failure-domain intent for replicated roles, the required Service/DNS path, and at least one enforced network-policy allow/deny boundary.",
        "Prove graceful termination for one synchronous or asynchronous role and record the disruption/rollout-capacity behavior expected during node drain or release replacement.",
        "Verify DNS resolution, certificate validity, Kong routing, HTTPS response and a representative authenticated Steward API request from an external client.",
        "Capture the running image identity for API, outbox-publisher and lifecycle-consumer pods and prove all three match the same environment-Git-selected Nexus digest.", "Execute a lifecycle mutation through the public API and prove its committed outbox intent is published through RabbitMQ and completed by the consumer in the reconciled environment.",
    ],
    ["Release identity record", "Environment Git change", "Argo CD reconciliation evidence", "External API and asynchronous-flow verification", "Three-role running image-digest proof"],
    ["The deployed bytes are traceable source → GitLab CI/CD → Nexus → environment Git → Argo CD → all three Steward application roles.", "Success is demonstrated from a real external client rather than inferred from pipeline or sync success.", "There is one authoritative deployment model for the environment."],
);

const gate5 = practicalLesson(
    "gate-5-recovery-failure",
    "Gate 5: Failure and Recovery Drill",
    "Demonstrate that one important cloud or orchestration failure can be detected, diagnosed and recovered using documented evidence rather than memory.",
    [
        "Choose one safe failure scenario such as compute replacement, firewall misconfiguration, failed application rollout, pod/node loss, Argo CD drift or restore into an isolated target.",
        "Before creating the failure, predict which signal should detect it and which evidence should distinguish infrastructure, cluster, gateway and application causes.",
        "Introduce the failure in a controlled manner and capture the first trustworthy symptom.",
        "Recover through the authoritative mechanism: OpenTofu for infrastructure intent, Kubernetes/OpenShift reconciliation for workload state, Argo CD for GitOps-managed environment drift, or the documented backup/recovery path for persistent data.",
        "If GitOps participates in the scenario, prove which controller owns the changed field and show how an emergency live intervention returns to declared state without creating a reconciliation fight.",
        "Verify recovery from the client perspective and record actual recovery time and any data-loss implication.",
        "Re-prove the selected Steward S3-compatible object workflow: the application can persist/retrieve through its bounded runtime identity, committed objects survive the exercised service lifecycle, and retention/recovery responsibility remains explicit.",
    ],
    ["Failure hypothesis", "Detection evidence", "Recovery execution record", "Post-recovery client proof", "Observed recovery time", "Object-storage workflow/recovery evidence"],
    ["The drill is safe and reversible.", "Recovery does not depend on rebuilding an old release or undocumented manual cluster state.", "The final verification proves service recovery, not merely resource or pod recreation.", "The S3-compatible workflow remains a real bounded application dependency with explicit lifecycle/recovery behavior rather than an isolated storage demo."],
);

const gate6 = practicalLesson(
    "gate-6-cost-operability",
    "Gate 6: Cost and Operability Review",
    "Prove that the remote and enterprise-platform environment is financially explainable and operationally proportionate.",
    [
        "List all billable resources and classify fixed/allocated versus usage-dependent cost drivers.",
        "Include the capacity cost of Kubernetes/OpenShift nodes, public addresses, storage, backups, load-balancing/gateway dependencies and retained logs where applicable.",
        "Produce the expected monthly baseline using current provider pricing assumptions and record the date/source of those assumptions in your project notes.",
        "Compare actual or forecast spend with the budget threshold defined earlier in Cloud Engineer.",
        "Identify idle, oversized or redundant resources and either remove/right-size them or justify their retention.",
        "Allocate at least one shared platform cost using a documented rule and report one normalized cost indicator such as environment-hour, request volume or completed lifecycle operation.",
        "Document which provider, cluster, Kong and Argo CD health signals an operator should review before later Reliability work begins.",
    ],
    ["Monthly cost model", "Budget threshold and response", "Right-sizing decision", "Minimal cloud/platform operations checklist"],
    ["Every persistent paid resource has an owner and reason to exist.", "Kubernetes/OpenShift cost is justified by a capability requirement rather than assumed as mandatory production architecture.", "The review does not prematurely duplicate Reliability Engineer's deeper observability work."],
);

const gateCanary = practicalLesson(
    "gate-progressive-delivery",
    "Gate 7: Progressive Delivery Safety",
    "Prove that one Steward release can progress from limited exposure to stable release using evidence rather than pod health alone.",
    [
        "Select a release compatible with stable database, queue, cache and public-contract state during coexistence.",
        "Use the versioned Argo Rollouts/GitOps path and prove the chosen routing mechanism's actual stable-versus-candidate request distribution.",
        "Define a contemporaneous stable baseline, observation window, minimum request/event evidence and explicit low-traffic behavior before promotion.",
        "Run one healthy candidate through promotion and one safe defective candidate through automated pause/abort.",
        "Prove that loss of analysis evidence fails safe and that rollback restores traffic/application authority without pretending to roll back irreversible persistent-state changes.",
    ],
    ["Canary routing evidence", "Baseline and evidence-volume record", "Healthy promotion evidence", "Bad-candidate abort evidence", "Analysis-unavailable behavior"],
    ["Traffic exposure is measured rather than inferred only from replica counts.", "Promotion requires sufficient evidence.", "A readiness-passing bad release can still be rejected.", "Insufficient analysis evidence does not silently promote."],
);

const gate7 = practicalLesson(
    "gate-7-handoff",
    "Gate 8: Cloud Platform Handoff",
    "Produce a concise handoff that another engineer could use to understand, reproduce and safely operate the Steward internet and application-platform environment.",
    [
        "Document the authoritative architecture and the public request path through Kong.",
        "Reference the OpenTofu root, state backend assumptions, provider identity boundaries and destructive-change rules.",
        "Reference the Kubernetes/OpenShift manifests for API, outbox publisher and lifecycle consumer, the PostgreSQL/Redis/RabbitMQ placement contract, environment Git repository, Argo CD Application and deployment-authority rules.",
        "Reference the GitLab CI/CD/Nexus release path and immutable artifact source.",
        "Document DNS/TLS ownership, backup/recovery method, cost baseline and current failure domains.",
        "Separate completed Cloud Engineer concerns from work intentionally deferred to Quality Steward, Security Steward and Reliability Engineer.",
        "Record the most important known limitation that the next school should inherit rather than silently solving it here.",
    ],
    ["Cloud/platform handoff document", "Architecture and dependency references", "Deployment-authority map", "Deferred-work register"],
    ["Another engineer can locate infrastructure, environment Git, release and recovery sources without personal memory.", "Deferred work is assigned to the correct later school.", "The handoff preserves technical, platform and cost assumptions."],
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
                prompt: "Can another engineer recreate the Steward environment from versioned infrastructure, artifact and environment-state sources without relying on your laptop, cloud-console memory or undocumented manual steps? Explain the full path from source revision to GitLab CI/CD/Nexus artifact, OpenTofu infrastructure, Kubernetes/OpenShift workload, environment Git and Argo CD reconciliation, Kong/DNS/TLS exposure and external verification. Identify the current single points of failure, the accepted monthly cost, the recovery evidence you actually proved, one reason a simpler VPS architecture could still be preferable, and which remaining concerns now belong specifically to Quality Steward, Security Steward and Reliability Engineer rather than Cloud Engineer.",
                minimumCharacters: 450,
            },
        },
    ],
};

export const cloudEngineerMilestoneDeepLessons: Lesson[] = [brief, gate1, gate2, gate3, gate4, gate5, gate6, gateCanary, gate7, review];
