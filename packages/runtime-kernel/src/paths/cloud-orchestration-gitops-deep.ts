import type { LearningResource, LessonBlock } from "../activities/content";
import type { Lesson } from "./lesson";

const kubernetesDocs: LearningResource = { title: "Kubernetes Documentation", url: "https://kubernetes.io/docs/" };
const openshiftDocs: LearningResource = { title: "Red Hat OpenShift Documentation", url: "https://docs.redhat.com/en/documentation/openshift_container_platform" };
const argoDocs: LearningResource = { title: "Argo CD Documentation", url: "https://argo-cd.readthedocs.io/" };

interface LessonSpec {
    id: string;
    title: string;
    intro: string;
    sections: Array<{ heading: string; paragraphs: string[]; list?: string[]; code?: { language: string; code: string; caption?: string } }>;
    practiceTitle: string;
    practice: string[];
    deliverables: string[];
    criteria: string[];
    questions: string[];
    resources?: LearningResource[];
}

function richLesson(spec: LessonSpec): Lesson {
    const blocks: LessonBlock[] = [{ type: "paragraph", text: spec.intro }];
    for (const section of spec.sections) {
        blocks.push({ type: "heading", id: section.heading.toLowerCase().replace(/[^a-z0-9]+/g, "-"), text: section.heading, level: 2 });
        for (const paragraph of section.paragraphs) blocks.push({ type: "paragraph", text: paragraph });
        if (section.list) blocks.push({ type: "list", items: section.list });
        if (section.code) blocks.push({ type: "code", language: section.code.language, code: section.code.code, caption: section.code.caption });
    }
    blocks.push({ type: "callout", tone: "steward", title: "Steward orchestration checkpoint", body: "Orchestration is introduced because Steward now needs a declarative runtime that can reconcile workload state, not because Kubernetes is fashionable. Preserve the existing release identity, Kong edge, data ownership and infrastructure boundaries while learning what the platform actually changes." });
    blocks.push({ type: "resources", title: "Continue learning", resources: spec.resources ?? [kubernetesDocs, openshiftDocs, argoDocs] });

    return {
        id: `cloud-orchestration-gitops-${spec.id}`,
        title: spec.title,
        activities: [
            { id: `cloud-orchestration-gitops-${spec.id}-001`, title: spec.title, estimatedMinutes: 45, content: { type: "reading", body: spec.intro, blocks } },
            {
                id: `cloud-orchestration-gitops-${spec.id}-002`,
                title: spec.practiceTitle,
                estimatedMinutes: 75,
                content: {
                    type: "practical",
                    objective: spec.practiceTitle,
                    scenario: "Steward already runs as an immutable containerized release and is exposed through Kong. Move only the runtime responsibility that orchestration can justify; do not redesign the application or move PostgreSQL, Redis or RabbitMQ merely to make the diagram look cloud-native.",
                    instructions: spec.practice,
                    deliverables: spec.deliverables,
                    completionCriteria: spec.criteria,
                },
            },
            { id: `cloud-orchestration-gitops-${spec.id}-003`, title: `Knowledge Check: ${spec.title}`, estimatedMinutes: 10, content: { type: "reflection", prompt: spec.questions.join("\n\n"), minimumCharacters: 200 } },
        ],
    };
}

const specs: LessonSpec[] = [
    {
        id: "why-orchestration",
        title: "Why Container Orchestration",
        intro: "Docker solved packaging and a small Compose topology solved local multi-container execution. Orchestration adds a control plane that continually reconciles desired workload state when one host, one process or one deployment script is no longer an adequate operating model.",
        sections: [
            { heading: "Start from the problem", paragraphs: ["Kubernetes earns its place when the system benefits from declarative scheduling, health-based replacement, controlled rollout, service discovery and a stable workload API across nodes.", "For Steward, the first goal is not hyperscale. It is to understand a reconciled runtime and the new failure and security boundaries that come with it."] },
            { heading: "Do not confuse layers", paragraphs: ["OpenTofu creates infrastructure, Ansible manages host state, Jenkins builds and publishes artifacts, and Kubernetes reconciles application workload state. Overlap should be deliberate, not accidental."] },
        ],
        practiceTitle: "Orchestration Adoption Gate: Prove What Kubernetes Solves",
        practice: ["List the current Steward runtime responsibilities handled by Docker/Compose or host services.", "Identify which of them Kubernetes would own and which remain outside the cluster.", "Name two concrete benefits and three new operational costs.", "Write an adopt/defer decision tied to a real Steward requirement."],
        deliverables: ["Runtime responsibility map", "Kubernetes adopt/defer decision", "New failure-boundary list"],
        criteria: ["The decision is problem-driven.", "Kubernetes is not presented as a replacement for CI, IaC or the database.", "The learner can explain what reconciliation means operationally."],
        questions: ["What problem does a Kubernetes control loop solve that Docker packaging does not?", "Why can adding Kubernetes reduce some toil while increasing total system responsibility?"]
    },
    {
        id: "cluster-control-plane",
        title: "Kubernetes Cluster and Control Plane",
        intro: "A Kubernetes cluster separates control-plane responsibilities from worker execution. The API server, scheduler and controllers cooperate around declared state while kubelets and container runtimes execute workloads on nodes.",
        sections: [
            { heading: "The API is the platform boundary", paragraphs: ["Users and automation declare desired objects through the API. Controllers observe current state and take actions until the system converges. This API-driven model is what later enables GitOps."], list: ["API server: validated control-plane entry point.", "etcd: cluster state store.", "Scheduler: chooses eligible nodes.", "Controllers: reconcile desired and observed state.", "Kubelet: node agent that realizes pod state."] },
            { heading: "Failure is distributed", paragraphs: ["A healthy application process does not prove a healthy cluster. Control-plane reachability, node health, scheduling, networking and storage all become distinct investigation layers."] },
        ],
        practiceTitle: "Control-Plane Trace: Follow One Steward Deployment Decision",
        practice: ["Trace the path from an applied Deployment manifest to a running Steward container.", "Identify which component validates, schedules and realizes the pod.", "Simulate or reason through a worker-node loss and predict which controller actions should follow.", "Record which evidence distinguishes control-plane failure from application failure."],
        deliverables: ["Control-plane sequence", "Node-loss hypothesis", "Layered diagnostic evidence"],
        criteria: ["Each major control-plane responsibility is correctly separated.", "The recovery explanation relies on reconciliation rather than manual container restart.", "Application and cluster health are not conflated."],
        questions: ["Why is the API server more than a configuration endpoint?", "What does the scheduler decide, and what does it not decide?"]
    },
    {
        id: "pods-deployments",
        title: "Pods, Deployments and ReplicaSets",
        intro: "Pods are the smallest scheduled workload unit, while Deployments and ReplicaSets provide a higher-level desired state for replicated application processes and rolling replacement.",
        sections: [
            { heading: "Pods are replaceable", paragraphs: ["A pod should not be treated as a durable server. Stable identity belongs in services, persistent storage or application data stores, while the pod itself can be recreated."] },
            { heading: "Deployment owns rollout intent", paragraphs: ["A Deployment declares image identity, replica count, update strategy and pod template. The controller then creates ReplicaSets and converges toward the desired rollout."] },
        ],
        practiceTitle: "Workload Migration: Run Steward as a Kubernetes Deployment",
        practice: ["Create a namespace for the Steward learning environment.", "Define a Deployment using the existing immutable Steward image from Nexus.", "Set resource requests/limits and non-secret runtime configuration deliberately.", "Delete one pod and prove the controller restores desired state.", "Update to another approved image tag/digest and observe rollout behavior."],
        deliverables: ["Versioned Deployment manifest", "Pod-replacement evidence", "Release rollout evidence"],
        criteria: ["The image is reused from the existing release chain rather than rebuilt in-cluster.", "Pod loss is recovered by the controller.", "The learner can distinguish pod identity from application release identity."],
        questions: ["Why should application data not depend on pod filesystem lifetime?", "What does a Deployment add beyond directly creating a Pod?"]
    },
    {
        id: "services-discovery",
        title: "Services and Cluster Networking",
        intro: "Pods are ephemeral and their addresses change. Kubernetes Services provide stable discovery and traffic distribution to selected pods without turning every workload into a public endpoint.",
        sections: [
            { heading: "Stable name, replaceable endpoints", paragraphs: ["A Service selects pods by labels and exposes a stable virtual address and DNS name. Internal consumers depend on the service contract rather than pod IPs."] },
            { heading: "Public exposure remains a separate decision", paragraphs: ["ClusterIP is internal by default. NodePort, LoadBalancer, Ingress and gateways change reachability and should not be chosen casually. Kong remains the Steward public API edge in this curriculum."] },
        ],
        practiceTitle: "Service Discovery Drill: Keep Steward Backends Private",
        practice: ["Create a ClusterIP Service for the Steward API.", "Verify discovery from an allowed in-cluster client.", "Prove the pod IP can change without changing the service name.", "Confirm PostgreSQL and other backend-only services are not made public merely because they are represented in Kubernetes."],
        deliverables: ["Service manifest", "DNS/discovery evidence", "Public/private reachability matrix"],
        criteria: ["Service discovery survives pod replacement.", "The public path remains narrower than the internal service graph.", "No backend port is exposed simply for convenience."],
        questions: ["Why is a Service needed when pod IPs already exist?", "Why is ClusterIP usually a safer default for backend services?"]
    },
    {
        id: "config-secrets",
        title: "ConfigMaps, Secrets and Runtime Configuration",
        intro: "Kubernetes separates workload images from runtime configuration through objects such as ConfigMaps and Secrets, but a Secret object is not automatically a complete secrets-management strategy.",
        sections: [
            { heading: "Configuration is not application code", paragraphs: ["Environment-specific hostnames, feature switches and non-sensitive runtime values should not require rebuilding the image."] },
            { heading: "Secret objects still require protection", paragraphs: ["Base64 encoding is not encryption. RBAC, encryption at rest, external secret sources, rotation and workload identity remain important and will deepen in Security Steward."] },
        ],
        practiceTitle: "Configuration Boundary Review: Change Runtime State Without Rebuilding",
        practice: ["Move one non-secret Steward runtime value into a ConfigMap.", "Reference one placeholder secret through a Kubernetes Secret without committing real secret material.", "Rotate the placeholder value and observe how the workload receives the change.", "Document what Kubernetes Secret does not solve and hand that gap to Security Steward."],
        deliverables: ["ConfigMap/Secret manifests without real credentials", "Runtime-change evidence", "Security handoff note"],
        criteria: ["The image remains environment-independent.", "No real secret is committed to Git.", "The learner can explain why a Kubernetes Secret is not equivalent to Vault-style secret management."],
        questions: ["Why is a Kubernetes Secret not sufficient evidence of secure secret lifecycle?", "What configuration change should not force a new application image?"]
    },
    {
        id: "health-resources-rollouts",
        title: "Probes, Resources and Rollouts",
        intro: "Orchestration quality depends on accurate health semantics and realistic resource declarations. Bad probes and missing resource boundaries can cause the platform to amplify rather than reduce failure.",
        sections: [
            { heading: "Readiness and liveness answer different questions", paragraphs: ["Readiness decides whether traffic should reach a pod. Liveness decides whether the container should be restarted. Startup probes can protect slow initialization from premature liveness failure."] },
            { heading: "Requests affect scheduling; limits affect runtime", paragraphs: ["CPU and memory requests influence placement. Limits constrain consumption and can trigger throttling or OOM termination. Values should follow evidence rather than arbitrary defaults."] },
        ],
        practiceTitle: "Failure Experiment: Make Steward Health Semantics Earn Their Configuration",
        practice: ["Define readiness and liveness behavior for Steward and justify the endpoints used.", "Add measured resource requests and cautious limits.", "Create a safe readiness failure and prove traffic is withdrawn without unnecessary restart.", "Create a safe process failure and observe restart behavior.", "Review rollout status and rollback to a known-good image if the new release fails verification."],
        deliverables: ["Probe/resource configuration", "Readiness failure evidence", "Restart/rollback evidence"],
        criteria: ["Readiness and liveness are not identical by habit.", "Resource values are tied to evidence or an explicit provisional assumption.", "A bad rollout can be detected and recovered without rebuilding the old release."],
        questions: ["Why can an overly aggressive liveness probe create an outage?", "How do resource requests differ from limits?"]
    },
    {
        id: "rbac-namespaces",
        title: "Namespaces, Service Accounts and RBAC",
        intro: "Kubernetes introduces its own identity and authorization plane. Namespaces group resources, service accounts identify workloads or automation, and RBAC controls actions against the Kubernetes API.",
        sections: [
            { heading: "Cluster admin should be exceptional", paragraphs: ["CI, GitOps controllers and application workloads should not share a human cluster-admin identity. Permissions should reflect the object types and namespaces each actor must manage."] },
            { heading: "Namespace is not a hard security boundary by itself", paragraphs: ["Namespaces support organization and policy scope, but network policy, RBAC and platform security controls determine effective isolation."] },
        ],
        practiceTitle: "Cluster Least-Privilege Review: Separate Human, Jenkins, Argo and Workload Identity",
        practice: ["List the Kubernetes actions required by an operator, Jenkins, Argo CD and the Steward workload.", "Create or design distinct service accounts and RBAC roles for those responsibilities.", "Attempt one action that should be denied to a restricted identity.", "Record why namespace separation alone would not protect an exposed service."],
        deliverables: ["RBAC responsibility matrix", "Versioned role/binding manifests", "Denied-action evidence"],
        criteria: ["No routine actor depends on shared cluster-admin credentials.", "At least one least-privilege denial is proven.", "RBAC and network reachability are treated as different controls."],
        questions: ["Why should a deployment controller not use a human administrator token?", "What does a namespace provide, and what security property does it not guarantee?"]
    },
    {
        id: "openshift-platform",
        title: "OpenShift as an Enterprise Application Platform",
        intro: "OpenShift builds on Kubernetes and adds an opinionated enterprise application platform around distribution lifecycle, security defaults, developer workflows, integrated operators, routes and administrative conventions.",
        sections: [
            { heading: "Learn the delta, not Kubernetes twice", paragraphs: ["Pods, Deployments, Services, ConfigMaps, Secrets and RBAC remain Kubernetes concepts. OpenShift adds platform capabilities and policy choices around them."] },
            { heading: "Enterprise platform responsibility", paragraphs: ["OpenShift increases standardization and integrated capability while also increasing platform size, lifecycle responsibility and opinionated security constraints. That trade-off is part of the lesson."] },
        ],
        practiceTitle: "Platform Delta Review: Explain What OpenShift Adds to Steward",
        practice: ["Map the Steward Kubernetes objects that remain unchanged on OpenShift.", "Identify OpenShift-specific capabilities relevant to the environment: Projects, Routes, Operators/OLM, registry/build integration, SCC concepts and the oc workflow.", "Compare vanilla Kubernetes, managed Kubernetes and OpenShift for the current Steward constraints.", "Choose which OpenShift additions the migration will actually use and reject those with no current requirement."],
        deliverables: ["Kubernetes-to-OpenShift mapping", "Platform comparison", "Adopt/defer decisions"],
        criteria: ["OpenShift is not described as a different orchestrator.", "Added capabilities have explicit drivers.", "The learner can explain the operational cost of the enterprise platform."],
        questions: ["What remains standard Kubernetes when Steward moves to OpenShift?", "Why can stronger platform defaults create both safety and operational friction?"]
    },
    {
        id: "openshift-security-routing",
        title: "OpenShift Routes, SCC Concepts and Operators",
        intro: "OpenShift exposes enterprise-specific abstractions around application routing, workload security and lifecycle-managed platform components. They should be understood in relation to the Kubernetes primitives beneath them.",
        sections: [
            { heading: "Route is an OpenShift edge abstraction", paragraphs: ["Routes publish services through the OpenShift ingress stack, while Kong may still serve as the deliberate API-management edge depending on topology. Avoid layering Route, Ingress and Kong without a clear request path."] },
            { heading: "Security constraints influence workload design", paragraphs: ["OpenShift commonly runs workloads under restricted identities. Images that assume root privileges or arbitrary UID behavior may fail, revealing portability problems worth fixing."] },
            { heading: "Operators manage lifecycle", paragraphs: ["Operators encode application-specific reconciliation and lifecycle knowledge. OLM helps install and manage them, but an Operator should solve a real platform lifecycle problem rather than becoming another abstraction by default."] },
        ],
        practiceTitle: "OpenShift Compatibility Drill: Run Steward Under Platform Constraints",
        practice: ["Deploy the existing Steward image to an OpenShift-compatible environment or local distribution where practical.", "Use oc to inspect project, pod, service and route state.", "Verify the image can run without requiring unsafe root assumptions.", "Map the external request path and decide whether Kong remains the API edge in front of platform routing or whether a simpler lab topology is justified.", "Inspect one Operator/OLM example and state why Steward does or does not need it."],
        deliverables: ["OpenShift deployment evidence", "Security-compatibility findings", "Routing-path diagram", "Operator adopt/defer note"],
        criteria: ["The existing image is reused rather than rebuilt specifically for OpenShift without reason.", "Security constraints are respected rather than disabled as a shortcut.", "Routing layers are explicit and non-duplicative."],
        questions: ["Why can an image that works on Docker fail under OpenShift security defaults?", "When is an Operator more appropriate than plain manifests or Helm-style packaging?"]
    },
    {
        id: "gitops-model",
        title: "GitOps and Reconciliation",
        intro: "GitOps applies the reconciliation model to environment configuration: Git records the desired deployment state and a controller such as Argo CD continuously compares that desired state with the cluster.",
        sections: [
            { heading: "Pull changes the deployment authority", paragraphs: ["In a push pipeline, Jenkins connects to the target and performs deployment. In GitOps, Jenkins can build, test and publish the artifact, then update or propose the environment declaration while Argo CD performs reconciliation inside the platform boundary."] },
            { heading: "Git is desired state, not a secret vault", paragraphs: ["Environment manifests and release references are excellent Git material; raw production secrets are not. Secret delivery requires a separate secure mechanism."] },
        ],
        practiceTitle: "Deployment Model Comparison: Jenkins Push vs Argo CD Reconciliation",
        practice: ["Diagram the current Jenkins-driven deployment flow and the proposed Argo CD flow.", "Identify exactly where artifact build ends and environment reconciliation begins.", "Define the Git repository path that will own Steward environment state.", "List the credentials removed from Jenkins and the new permissions required by Argo CD.", "Choose a migration boundary that does not make both systems authoritative at once."],
        deliverables: ["Push-vs-pull comparison", "Environment Git ownership contract", "Authority migration decision"],
        criteria: ["Jenkins remains responsible for build/test/package/publish.", "Argo CD becomes the only reconciler for the chosen environment after migration.", "Secrets are not moved into Git for convenience."],
        questions: ["What changes when deployment authority moves from Jenkins push to Argo CD pull?", "Why is running both as independent deployment authorities dangerous?"]
    },
    {
        id: "argocd-operation",
        title: "Argo CD Applications, Sync and Drift",
        intro: "Argo CD represents deployable environments as Applications, compares Git with live cluster state and can synchronize changes manually or automatically according to policy.",
        sections: [
            { heading: "Sync status is evidence, not magic", paragraphs: ["OutOfSync means declared and live state differ; it does not automatically tell you which state is correct. Health status also depends on resource semantics and should be interpreted with application evidence."] },
            { heading: "Self-heal is powerful", paragraphs: ["Automatic pruning and self-healing can remove unauthorized drift, but they can also rapidly enforce a bad Git change. Review and promotion controls remain necessary."] },
        ],
        practiceTitle: "GitOps Failure Drill: Detect and Reconcile Steward Drift",
        practice: ["Create an Argo CD Application for the Steward environment declaration.", "Deploy one known release by changing the declared image identity in Git.", "Verify sync and application health from the platform and from an external client.", "Make one safe manual cluster change and observe OutOfSync/drift evidence.", "Reconcile to the intended state and record whether self-heal/prune should be automatic for this environment."],
        deliverables: ["Argo CD Application configuration", "Release reconciliation evidence", "Drift/recovery evidence", "Sync-policy decision"],
        criteria: ["The running release traces to Git and the existing Nexus artifact identity.", "Manual drift is visible and recoverable.", "Automation policy is chosen from risk rather than convenience."],
        questions: ["What does OutOfSync prove and what does it not prove?", "Why can automatic self-healing amplify a bad desired-state change?"]
    },
];

const milestone: Lesson = {
    id: "cloud-orchestration-gitops-milestone",
    title: "Lab: Migrate Steward to OpenShift with Argo CD",
    activities: [
        {
            id: "cloud-orchestration-gitops-milestone-001",
            title: "Define the Migration Contract",
            estimatedMinutes: 60,
            content: {
                type: "practical",
                objective: "Define exactly which Steward runtime responsibilities move to Kubernetes/OpenShift and which remain with the existing delivery and infrastructure systems.",
                scenario: "The migration is a platform evolution, not a rewrite. Preserve source, artifact, database ownership, Kong API policy and release traceability unless a documented requirement says otherwise.",
                instructions: ["Create a responsibility matrix covering OpenTofu, Ansible, Jenkins, Nexus, Kubernetes/OpenShift, Kong and Argo CD.", "Choose the target cluster/environment and explain its cost and capacity assumptions.", "Define namespace/project, workload, service, routing and RBAC boundaries.", "Define the exact source commit → Jenkins → Nexus image digest → environment Git → Argo CD → running pod evidence chain."],
                deliverables: ["Migration responsibility matrix", "Target topology", "End-to-end evidence chain"],
                completionCriteria: ["No responsibility has two accidental authorities.", "The design reuses the existing artifact and release chain.", "Public, management and backend boundaries remain explicit."],
            },
        },
        {
            id: "cloud-orchestration-gitops-milestone-002",
            title: "Deploy and Verify on OpenShift",
            estimatedMinutes: 180,
            content: {
                type: "practical",
                objective: "Run the approved Steward release on OpenShift-compatible Kubernetes and verify the application through the intended public API path.",
                scenario: "Use the existing image and external service dependencies. Do not manufacture in-cluster stateful migrations merely to use more Kubernetes objects.",
                instructions: ["Create the project/namespace and least-privilege identities.", "Deploy Steward through versioned manifests or the chosen packaging boundary.", "Configure services and the deliberate Kong/platform routing path.", "Verify readiness, liveness, resources and rollout behavior.", "Verify a representative authenticated Steward request externally and capture the running image digest."],
                deliverables: ["Versioned environment manifests", "OpenShift/Kubernetes runtime evidence", "External verification", "Image-digest traceability"],
                completionCriteria: ["The workload runs under platform security constraints.", "The backend is not directly public.", "The externally verified release matches the approved artifact."],
            },
        },
        {
            id: "cloud-orchestration-gitops-milestone-003",
            title: "Transfer Deployment Authority to Argo CD",
            estimatedMinutes: 120,
            content: {
                type: "practical",
                objective: "Make environment Git and Argo CD the authoritative deployment path while keeping Jenkins responsible for producing releasable artifacts.",
                scenario: "Avoid a split-brain deployment model. Once GitOps owns the environment, direct Jenkins deployment to that environment is retired or reduced to updating/proposing desired state.",
                instructions: ["Create the Argo CD Application and repository boundary.", "Publish a new approved Steward image through Jenkins/Nexus.", "Update the environment declaration to the new immutable image identity.", "Observe reconciliation and verify the rollout.", "Perform a safe drift experiment and recover through GitOps.", "Document rollback by reverting desired state to a retained known-good artifact."],
                deliverables: ["Argo CD application", "Git-driven promotion evidence", "Drift recovery evidence", "Rollback evidence"],
                completionCriteria: ["Jenkins and Argo CD have non-overlapping authoritative responsibilities.", "A release is traceable from source to live pod.", "Drift and rollback use declared state rather than ad-hoc cluster mutation."],
            },
        },
        {
            id: "cloud-orchestration-gitops-milestone-004",
            title: "Orchestration and GitOps Review",
            estimatedMinutes: 40,
            content: {
                type: "reflection",
                prompt: "Explain which problems Kubernetes/OpenShift and Argo CD now solve for Steward, which new failure and security boundaries they created, and why the final system still keeps Jenkins, Nexus, OpenTofu, Kong and Steward domain logic as separate responsibilities. Identify one case where simpler VPS hosting would still be the stronger architecture choice and one trigger that would justify keeping the enterprise platform.",
                minimumCharacters: 350,
            },
        },
    ],
};

export const cloudOrchestrationGitOpsDeepLessons: Lesson[] = [...specs.map(richLesson), milestone];
