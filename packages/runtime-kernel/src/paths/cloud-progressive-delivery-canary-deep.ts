import type { LearningResource, LessonBlock } from "../activities/content";
import type { Lesson } from "./lesson";

const k8sDeployment: LearningResource = { title: "Kubernetes Deployments", url: "https://kubernetes.io/docs/concepts/workloads/controllers/deployment/" };
const argoRollouts: LearningResource = { title: "Argo Rollouts documentation", url: "https://argo-rollouts.readthedocs.io/" };
const prometheus: LearningResource = { title: "Prometheus documentation", url: "https://prometheus.io/docs/" };

const blocks: LessonBlock[] = [
    { type: "paragraph", text: "A rolling update limits replacement pace but does not by itself make release risk evidence-driven. Steward now needs one bounded progressive-delivery implementation where a candidate receives limited traffic, is evaluated against explicit health criteria and is either promoted or aborted." },
    { type: "heading", id: "strategy", text: "Canary is the primary learning strategy", level: 2 },
    { type: "list", items: [
        "Kubernetes Deployment rolling updates remain the baseline rollout mechanism.",
        "Argo Rollouts is introduced for one concrete canary requirement, not as a second GitOps controller replacing Argo CD.",
        "Argo CD remains responsible for reconciling desired deployment configuration from Git; Argo Rollouts controls the progressive rollout state machine.",
        "Prometheus supplies automated analysis signals when the environment can support them; manual promotion alone does not satisfy the final exercise.",
        "Blue/green is compared as an alternative but is not permanently implemented beside canary merely for exposure."
    ] },
    { type: "callout", tone: "steward", title: "State compatibility comes first", body: "A canary is unsafe if candidate and stable versions cannot share the current schema, queues, caches or contracts. Reuse the production schema-evolution discipline before exposing two application versions to live traffic." },
    { type: "resources", title: "Continue learning", resources: [k8sDeployment, argoRollouts, prometheus] },
];

export const progressiveDeliveryCanaryDeepLessons: Lesson[] = [
    {
        id: "cloud-progressive-delivery-canary",
        title: "Progressive Delivery with Canary Releases",
        activities: [
            { id: "cloud-progressive-delivery-canary-001", title: "From Rolling Updates to Progressive Delivery", estimatedMinutes: 45, content: { type: "reading", body: "Progressive delivery changes the release question from 'did the new pods start?' to 'does limited real traffic provide enough evidence to expand exposure?'.", blocks } },
            {
                id: "cloud-progressive-delivery-canary-002",
                title: "Design Steward's Canary Contract",
                estimatedMinutes: 120,
                content: { type: "practical", objective: "Define a bounded canary strategy whose promotion and abort decisions are tied to measurable release risk.", scenario: "A Steward release contains a meaningful behavior change. A normal rolling update would expose the candidate broadly before operators have enough evidence to compare it with the stable version.", instructions: [
                    "Select one Steward release change worth progressive exposure and explain why a normal rolling update provides insufficient risk control.",
                    "Prove stable and candidate versions are compatible with the current PostgreSQL schema, RabbitMQ contracts, Redis usage and public API contract during coexistence.",
                    "Compare canary and blue/green for this scenario, then select canary as the primary implementation unless a documented technical constraint makes it infeasible.",
                    "Define an exposure sequence such as 5% -> 20% -> 50% -> 100%, or an equivalent bounded progression justified by the environment.",
                    "Define minimum observation windows and promotion/abort criteria using release-relevant indicators such as HTTP error ratio, latency, readiness and one meaningful Steward business/functional check.",
                    "Define what happens to the candidate on abort, what stable version remains authoritative, and which database/data changes cannot be undone by traffic rollback."
                ], deliverables: ["Progressive-delivery justification", "Stable/candidate compatibility proof", "Canary-vs-blue-green comparison", "Exposure plan", "Promotion/abort criteria", "State-aware rollback contract"], completionCriteria: ["Canary is justified by a concrete release risk.", "Stable and candidate coexistence is proven safe before traffic splitting.", "Promotion criteria are measurable rather than 'looks healthy'.", "Abort behavior distinguishes traffic/application rollback from persistent-state rollback." ] },
            },
            {
                id: "cloud-progressive-delivery-canary-003",
                title: "Implement Argo Rollouts Canary Delivery",
                estimatedMinutes: 240,
                content: { type: "practical", objective: "Replace one Steward Deployment rollout with a controlled Argo Rollouts canary while preserving Argo CD as the GitOps source-of-truth reconciler.", scenario: "The platform needs repeatable progressive exposure without introducing a second independent deployment authority.", instructions: [
                    "Install/configure Argo Rollouts in the learner-owned Kubernetes/OpenShift environment and document the controller/RBAC footprint it adds.",
                    "Convert only the selected Steward workload from Deployment rollout behavior to an Argo Rollout; do not migrate unrelated workloads merely for tool exposure.",
                    "Keep the desired Rollout/service configuration versioned in Git and reconciled through the existing Argo CD workflow.",
                    "Configure stable and canary service/traffic behavior using the simplest mechanism the current cluster can support reliably. If weighted ingress/service-mesh routing is unavailable, use replica-weighted basic canary and document its limitations.",
                    "Configure multiple canary steps with bounded pauses/analysis rather than an immediate 0-to-100 replacement.",
                    "Expose release identity in evidence so requests/results can be attributed to stable versus candidate versions.",
                    "Run a healthy candidate through the complete progression and prove the approved immutable image becomes the stable version without rebuilding it."
                ], deliverables: ["Versioned Rollout configuration", "Argo CD reconciliation evidence", "Stable/canary routing model", "Progression evidence", "Release identity evidence", "Successful promotion record"], completionCriteria: ["Argo Rollouts is actually operating the selected Steward rollout.", "Argo CD remains the desired-state/GitOps authority rather than being replaced by imperative rollout edits.", "Traffic/exposure increases through multiple bounded stages.", "The exact approved image identity is promoted without rebuild.", "The routing method and its limitations are understood." ] },
            },
            {
                id: "cloud-progressive-delivery-canary-004",
                title: "Automate Analysis and Abort a Bad Canary",
                estimatedMinutes: 210,
                content: { type: "practical", objective: "Prove that a bad Steward candidate can be detected and stopped before full exposure using real telemetry.", scenario: "A candidate is technically ready and healthy enough to receive traffic but produces elevated errors or latency under the canary path. The rollout must stop on evidence rather than operator intuition.", instructions: [
                    "Connect the canary analysis to Prometheus metrics already owned by the Steward observability environment, using an Argo Rollouts AnalysisTemplate/AnalysisRun or equivalent automated gate.",
                    "Include at least one service indicator such as error ratio or latency and one release-specific functional/business check where technically reasonable.",
                    "Deploy a deliberately defective but safe candidate that passes startup/readiness yet violates one configured analysis criterion.",
                    "Send representative traffic and prove the rollout pauses/fails/aborts before reaching 100% exposure.",
                    "Verify stable traffic remains available and capture the exact telemetry and rollout evidence that caused the decision.",
                    "Fix the defect, publish a new immutable candidate through the normal Jenkins/Nexus release chain, and prove the new candidate can progress successfully.",
                    "Document alert/notification handoff for an aborted progressive rollout without creating a duplicate alerting stack."
                ], deliverables: ["Automated analysis configuration", "Defective candidate", "Prometheus failure evidence", "Automatic pause/abort evidence", "Stable-service evidence", "Fixed-candidate promotion", "Notification handoff"], completionCriteria: ["A candidate that passes readiness can still be rejected by release analysis.", "At least one promotion/abort decision is driven automatically by real telemetry.", "The bad candidate does not reach full exposure.", "Stable service remains available during abort.", "The recovery uses a newly built fixed candidate or known-good immutable artifact, not an ad-hoc in-cluster patch." ] },
            },
            {
                id: "cloud-progressive-delivery-canary-005",
                title: "Break the Progressive Delivery Control Plane",
                estimatedMinutes: 120,
                content: { type: "practical", objective: "Understand failure of the rollout/analysis mechanism itself and define safe operator behavior.", scenario: "Prometheus analysis becomes unavailable or the rollout controller cannot complete its next decision. Lack of evidence must not silently become permission to promote.", instructions: [
                    "During a canary step, make the selected analysis dependency unavailable or otherwise create a safe inconclusive-analysis condition.",
                    "Observe the rollout state and prove the configured policy fails safe: pause/inconclusive/fail according to the documented decision rather than automatically promoting without evidence.",
                    "Restore the dependency and demonstrate controlled continuation or restart of the rollout.",
                    "Record emergency/manual promotion permissions and the evidence/approval required to use them; routine releases must not depend on bypassing analysis.",
                    "Define monitoring for the progressive-delivery controller and analysis path themselves."
                ], deliverables: ["Analysis/control-plane failure experiment", "Fail-safe behavior evidence", "Recovery evidence", "Manual override policy", "Control-plane monitoring requirements"], completionCriteria: ["Loss of analysis evidence does not silently promote the candidate.", "The rollout recovers predictably after analysis/control-plane restoration.", "Manual override is bounded and auditable.", "The learner identifies operational signals for the rollout machinery itself." ] },
            },
            { id: "cloud-progressive-delivery-canary-006", title: "Reassess Progressive Delivery", estimatedMinutes: 20, content: { type: "reflection", prompt: "Defend Steward's canary implementation. Explain what risk it controls beyond Kubernetes rolling updates, why Argo Rollouts does not replace Argo CD, how Prometheus influences promotion, what happens when analysis is unavailable, how database compatibility constrains rollback, and what evidence would justify simplifying back to ordinary rolling releases or adopting blue/green later.", minimumCharacters: 350 } },
        ],
    },
];
