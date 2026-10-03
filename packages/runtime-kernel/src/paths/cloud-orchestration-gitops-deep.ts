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
    blocks.push({ type: "callout", tone: "steward", title: "Steward orchestration checkpoint", body: "TSA deliberately evolves Steward from a single-host container runtime to a reconciled multi-workload platform exercise. The learner must first document the operational requirement and costs, then implement the orchestration checkpoint using the existing immutable release. Preserve only edge and dependency components actually earned earlier; do not add unrelated products to make the topology look cloud-native." });
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
                    scenario: "Steward already runs as an immutable containerized release. Preserve its actual public-edge and dependency model. Move only runtime responsibility that orchestration can justify; do not add Kong, Redis, RabbitMQ or other components merely to make the diagram look cloud-native.",
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
            { heading: "Do not confuse layers", paragraphs: ["OpenTofu creates infrastructure, Ansible manages host state, GitLab CI/CD builds and publishes artifacts, and Kubernetes reconciles application workload state. Overlap should be deliberate, not accidental."] },
        ],
        practiceTitle: "Orchestration Requirement Gate: Prove What Kubernetes Must Solve",
        practice: ["List the current Steward runtime responsibilities handled by Docker/Compose or host services.", "Introduce the TSA orchestration requirement: run the immutable Steward release in a declarative reconciled environment where workload replacement and controlled rollout are platform responsibilities.", "Identify which responsibilities Kubernetes will own and which remain outside the cluster.", "Name two concrete benefits and at least three new operational costs.", "Define success evidence for reconciliation, rollout and failure recovery before creating the cluster."],
        deliverables: ["Runtime responsibility map", "Orchestration requirement and acceptance evidence", "New failure-boundary list"],
        criteria: ["The implementation is preceded by an explicit operating requirement.", "Kubernetes is not presented as a replacement for CI, IaC or the database.", "The learner can explain what reconciliation must prove operationally before proceeding."],
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
        practiceTitle: "Workload Migration: Run Every Steward Application Role",
        practice: ["Create a namespace for the Steward learning environment.", "Define separate Deployments for the API, outbox publisher and lifecycle-event consumer using the same existing immutable Steward image digest from Nexus with role-specific commands.", "Set resource requests/limits and non-secret runtime configuration deliberately for each role.", "Keep PostgreSQL, Redis and RabbitMQ placement explicit: they may remain external or move only through a separate justified stateful-service decision.", "Delete one pod from each application role and prove the controller restores desired state.", "Update the declared application digest and observe rollout behavior across all three roles."],
        deliverables: ["Versioned API/publisher/consumer Deployment manifests", "Three-role pod-replacement evidence", "Release rollout evidence", "Dependency-placement decision"],
        criteria: ["All three application roles reuse the same image digest from the existing release chain rather than rebuilding in-cluster.", "Pod loss is recovered by the controller for every role.", "PostgreSQL, Redis and RabbitMQ are not silently dropped or moved merely because Kubernetes exists.", "The learner can distinguish pod identity, process role and application release identity."],
        questions: ["Why should application data not depend on pod filesystem lifetime?", "What does a Deployment add beyond directly creating a Pod?"]
    },
    {
        id: "services-discovery",
        title: "Services and Cluster Networking",
        intro: "Pods are ephemeral and their addresses change. Kubernetes Services provide stable discovery and traffic distribution to selected pods without turning every workload into a public endpoint.",
        sections: [
            { heading: "Stable name, replaceable endpoints", paragraphs: ["A Service selects pods by labels and exposes a stable virtual address and DNS name. Internal consumers depend on the service contract rather than pod IPs."] },
            { heading: "Public exposure remains a separate decision", paragraphs: ["ClusterIP is internal by default. NodePort, LoadBalancer, Ingress and gateways change reachability and should not be chosen casually. The public API edge remains whichever implementation the earlier Cloud edge checkpoint actually established; in the canonical required path this is Kong after its earned migration."] },
        ],
        practiceTitle: "Service Discovery Drill: Keep Steward Backends Private",
        practice: ["Create a ClusterIP Service for the Steward API.", "Verify discovery from an allowed in-cluster client.", "Prove the pod IP can change without changing the service name.", "Confirm PostgreSQL and other backend-only services are not made public merely because they are represented in Kubernetes."],
        deliverables: ["Service manifest", "DNS/discovery evidence", "Public/private reachability matrix"],
        criteria: ["Service discovery survives pod replacement.", "The public path remains narrower than the internal service graph.", "No backend port is exposed simply for convenience."],
        questions: ["Why is a Service needed when pod IPs already exist?", "Why is ClusterIP usually a safer default for backend services?"]
    },
    {
        id: "scheduling-placement",
        title: "Scheduling, Placement and Failure Domains",
        intro: "The scheduler does not simply find a node with spare CPU. It filters and scores eligible nodes using resource requests, taints and tolerations, affinity rules, topology constraints and other scheduling requirements. Replica count alone therefore says little about failure-domain resilience.",
        sections: [
            { heading: "Schedulable is a set of constraints", paragraphs: ["A pod can remain Pending even while the cluster has free aggregate capacity if no individual node satisfies its requests and placement constraints. Taints repel pods unless tolerated; node affinity constrains eligible placement; pod anti-affinity and topology spread can reduce correlated placement." ] },
            { heading: "Replicas on one failure domain are not redundancy", paragraphs: ["Three replicas placed on one node or one zone can disappear together. Availability claims must inspect where replicas actually landed and what happens when a node or zone becomes unavailable.", "Hard placement rules can themselves reduce availability when the cluster cannot satisfy them. Prefer the weakest rule that meets the real resilience requirement." ] },
        ],
        practiceTitle: "Scheduler Drill: Prove Steward Replica Placement",
        practice: ["Inspect node labels, taints, allocatable resources and current Steward pod placement.", "Create one safe scheduling constraint and predict which nodes remain eligible before applying it.", "Demonstrate a Pending pod caused by an unsatisfied scheduling constraint and diagnose the scheduler event rather than changing random settings.", "Define a topology-spread or anti-affinity policy for a replicated Steward role and prove the actual placement matches the intended failure-domain assumption."],
        deliverables: ["Scheduling eligibility analysis", "Pending-pod diagnostic evidence", "Replica placement evidence"],
        criteria: ["The learner distinguishes aggregate cluster capacity from per-node schedulability.", "Placement evidence supports the stated resilience claim.", "Tolerations are not treated as commands that force a pod onto a node."],
        questions: ["Why can a pod remain Pending when the cluster appears to have spare capacity?", "Why does three replicas not necessarily mean three independent failure domains?"]
    },
    {
        id: "dns-network-policy",
        title: "Cluster DNS, Service Routing and NetworkPolicy",
        intro: "Kubernetes DNS, Services and NetworkPolicy solve different problems. DNS resolves names, a Service provides a stable traffic abstraction over changing endpoints, and NetworkPolicy can restrict allowed pod traffic when the cluster network plugin actually enforces it.",
        sections: [
            { heading: "DNS does not make a backend reachable", paragraphs: ["CoreDNS normally gives Services predictable names such as service.namespace.svc.cluster.local. Successful name resolution proves only that the name resolved; it does not prove endpoints exist, the application is listening or network policy allows the connection.", "A Service with no ready matching endpoints can resolve perfectly while requests still fail." ] },
            { heading: "NetworkPolicy is allow-list behavior only after isolation applies", paragraphs: ["By default, pods are generally non-isolated for ingress and egress. Once a policy selects a pod for a direction, allowed traffic is the union of applicable policies for that direction; policies are additive rather than ordered firewall rules.", "NetworkPolicy behavior also depends on a network plugin that implements it. A manifest existing in Git is not proof that packets are being filtered." ] },
        ],
        practiceTitle: "Network Path Drill: Resolve, Route and Restrict Steward Traffic",
        practice: ["Resolve the Steward API Service from a client pod and separately inspect the Service endpoints.", "Create a controlled case where DNS succeeds but the application path fails, then identify whether the failure is endpoint selection, listening, readiness or policy.", "Apply a default-deny policy in the learning namespace and add only the minimum required allow paths for a chosen Steward flow.", "Prove both an allowed connection and a denied connection, and identify the cluster network implementation responsible for enforcement."],
        deliverables: ["DNS and endpoint evidence", "NetworkPolicy manifests", "Allowed/denied traffic evidence", "CNI enforcement note"],
        criteria: ["DNS success is not treated as service-health proof.", "Policies express required communication rather than broad namespace-wide convenience.", "Enforcement is tested rather than inferred from YAML."],
        questions: ["What can DNS resolution prove that a successful TCP connection proves more strongly?", "Why can two NetworkPolicies not be interpreted as first-match firewall rules?"]
    },
    {
        id: "persistent-storage",
        title: "Persistent Volumes, Claims and Storage Lifecycle",
        intro: "A container filesystem is ephemeral, but attaching a PersistentVolume does not automatically make an application durable. Kubernetes storage separates a workload's claim from the underlying storage implementation, while application consistency, backup and recovery remain separate responsibilities.",
        sections: [
            { heading: "PVC is a claim, not a backup", paragraphs: ["A PersistentVolumeClaim requests storage with properties such as capacity and access mode. A StorageClass can dynamically provision a matching volume. The reclaim policy determines what may happen to the backing volume after the claim is released.", "Deleting a pod should not delete data held on an appropriately persistent volume, but deleting claims, changing StatefulSet storage or relying on a Delete reclaim policy can have very different consequences." ] },
            { heading: "Stateful workload identity is more than a mounted disk", paragraphs: ["StatefulSets can provide stable ordinal identity and per-pod volume claims, but they do not make arbitrary databases safely clustered. Replication, quorum, backup, restore and upgrade semantics still belong to the database or stateful system." ] },
        ],
        practiceTitle: "Storage Lifecycle Drill: Prove What Survives Steward Workload Replacement",
        practice: ["Inspect the available StorageClasses and document provisioner, binding behavior and reclaim policy.", "Create a disposable PVC-backed workload, write test data, replace the pod and prove what persists.", "Delete only resources that are safe to delete and observe the PVC/PV lifecycle without risking real data.", "For PostgreSQL, Redis or RabbitMQ, state whether Kubernetes storage would solve persistence, high availability, backup, all three or only part of the problem."],
        deliverables: ["StorageClass/PVC/PV lifecycle evidence", "Pod-replacement persistence evidence", "Stateful-service responsibility note"],
        criteria: ["Persistent storage is not described as backup or database HA.", "Reclaim behavior is understood before destructive testing.", "The learner can distinguish pod identity, volume identity and application-level data safety."],
        questions: ["Why does a PVC not prove that a database is recoverable?", "What operational consequence can a volume reclaim policy have after a claim is deleted?"]
    },
    {
        id: "termination-disruption",
        title: "Graceful Termination and Workload Disruption",
        intro: "Kubernetes replacement is not instantaneous disappearance. During normal termination the platform removes a pod from service, invokes lifecycle handling where configured, sends termination signals and eventually force-kills processes that exceed the grace period. Applications must cooperate with that lifecycle.",
        sections: [
            { heading: "SIGTERM is part of the application contract", paragraphs: ["A worker that stops accepting new work but fails to finish or safely return an in-flight message can still lose correctness during an otherwise healthy rollout. HTTP servers, queue consumers and publishers need role-specific shutdown behavior.", "preStop hooks and terminationGracePeriodSeconds can provide time, but arbitrary sleeps are not a substitute for the application handling shutdown correctly." ] },
            { heading: "Voluntary disruption needs capacity", paragraphs: ["PodDisruptionBudgets limit how many matching pods may be unavailable during voluntary disruptions such as node drain. They do not protect against every involuntary failure and they do not create spare capacity.", "A strict PDB can block maintenance when replica count or cluster capacity cannot satisfy it." ] },
        ],
        practiceTitle: "Termination Drill: Drain Steward Without Losing Correctness",
        practice: ["Define expected SIGTERM behavior separately for the Steward API, publisher and consumer roles.", "Terminate one pod normally and capture the sequence from readiness withdrawal through process exit.", "Run or simulate a node drain with a realistic PodDisruptionBudget and observe whether eviction proceeds or blocks.", "Identify one in-flight request or message failure mode that graceful shutdown must prevent."],
        deliverables: ["Role-specific shutdown contract", "Termination evidence", "PDB/drain evidence", "In-flight work risk note"],
        criteria: ["Shutdown behavior is application-aware rather than a generic sleep.", "The learner distinguishes voluntary eviction from involuntary pod/node failure.", "A PDB is not described as a guarantee that replicas remain available under every outage."],
        questions: ["Why can a successful rolling update still lose in-flight work?", "What does a PodDisruptionBudget constrain, and what does it not provide?"]
    },
    {
        id: "pressure-eviction-rollout",
        title: "Node Pressure, Eviction and Rollout Capacity",
        intro: "A cluster can be healthy enough to run while still lacking the capacity to complete a rollout. Memory pressure, disk pressure, pod limits, scheduling constraints and rollout surge can turn a routine release into Pending pods or evictions.",
        sections: [
            { heading: "Requests influence both placement and eviction risk", paragraphs: ["Kubernetes derives pod QoS classes from requests and limits. Under node pressure, eviction decisions consider resource pressure, priority and usage relative to requests; an OOM kill inside a container is a different failure from kubelet eviction.", "Diagnose status, events, node conditions and container termination reasons before calling every disappearance a crash." ] },
            { heading: "RollingUpdate temporarily changes capacity demand", paragraphs: ["maxSurge permits extra pods above the desired replica count during rollout; maxUnavailable controls how many desired replicas may be unavailable. A rollout can stall when the cluster cannot schedule the surge or when new pods never become Ready.", "Deployment progress and application correctness are separate. A rollout controller can complete while a release still violates business or SLO expectations." ] },
        ],
        practiceTitle: "Capacity Failure Drill: Diagnose a Stalled Steward Rollout",
        practice: ["Record node allocatable capacity, current requests and the Deployment rollout strategy before changing the release.", "Create a safe lab condition where a rollout cannot schedule or cannot become Ready.", "Use pod status, events, node conditions and rollout status to identify the actual bottleneck.", "Explain whether changing maxSurge, maxUnavailable, resource requests or cluster capacity is the correct fix and what trade-off each introduces.", "Differentiate an OOMKilled container from a pod evicted under node pressure using evidence."],
        deliverables: ["Pre-rollout capacity evidence", "Stalled-rollout diagnosis", "Recovery decision", "OOM-versus-eviction evidence"],
        criteria: ["The diagnosis uses scheduler/node/runtime evidence rather than generic restart advice.", "Rollout settings are related to available capacity and availability requirements.", "Deployment completion is not treated as proof of release success."],
        questions: ["How can maxSurge make a rollout fail in a cluster that can run the old replica count?", "Why are OOMKilled and Evicted different diagnoses?"]
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
        practiceTitle: "Cluster Least-Privilege Review: Separate Human, GitLab CI/CD, Argo and Workload Identity",
        practice: ["List the Kubernetes actions required by an operator, GitLab CI/CD, Argo CD and the Steward workload.", "Create or design distinct service accounts and RBAC roles for those responsibilities.", "Attempt one action that should be denied to a restricted identity.", "Record why namespace separation alone would not protect an exposed service."],
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
            { heading: "Pull changes the deployment authority", paragraphs: ["In a push pipeline, GitLab CI/CD connects to the target and performs deployment. In GitOps, GitLab CI/CD can build, test and publish the artifact, then update or propose the environment declaration while Argo CD performs reconciliation inside the platform boundary."] },
            { heading: "Git is desired state, not a secret vault", paragraphs: ["Environment manifests and release references are excellent Git material; raw production secrets are not. Secret delivery requires a separate secure mechanism."] },
        ],
        practiceTitle: "Deployment Model Comparison: GitLab CI/CD Push vs Argo CD Reconciliation",
        practice: ["Diagram the current GitLab-CI/CD-driven deployment flow and the proposed Argo CD flow.", "Identify exactly where artifact build ends and environment reconciliation begins.", "Define the Git repository path that will own Steward environment state.", "List the credentials removed from GitLab CI/CD and the new permissions required by Argo CD.", "Choose a migration boundary that does not make both systems authoritative at once."],
        deliverables: ["Push-vs-pull comparison", "Environment Git ownership contract", "Authority migration decision"],
        criteria: ["GitLab CI/CD remains responsible for build/test/package/publish.", "Argo CD becomes the only reconciler for the chosen environment after migration.", "Secrets are not moved into Git for convenience."],
        questions: ["What changes when deployment authority moves from GitLab CI/CD push to Argo CD pull?", "Why is running both as independent deployment authorities dangerous?"]
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
                scenario: "The migration is a platform evolution, not a rewrite. Preserve source, artifact, database ownership, the actual edge policy and release traceability unless a documented requirement says otherwise.",
                instructions: ["Create a responsibility matrix covering OpenTofu, Ansible, GitLab CI/CD, Nexus, Kubernetes/OpenShift, Kong and Argo CD.", "Choose the target cluster/environment and explain its cost and capacity assumptions.", "Define namespace/project, workload, service, routing and RBAC boundaries.", "Define the exact source commit → GitLab CI/CD → Nexus image digest → environment Git → Argo CD → running `pod` evidence chain."],
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
                instructions: ["Create the `project`/`namespace` and least-privilege identities.", "Deploy API, outbox publisher and lifecycle-event consumer through versioned manifests or the chosen packaging boundary, all referencing the same approved image digest with role-specific commands.", "Reconcile PostgreSQL, Redis and RabbitMQ endpoints/placement from the incoming release contract and record any justified placement change.", "Run database/outbox migrations through an explicit versioned mechanism before dependent roles become authoritative.", "Configure a ClusterIP Service for the API and the deliberate Kong/platform routing path; do not expose publisher/consumer as public services.", "Verify readiness/liveness/resources/rollout behavior appropriate to each application role.", "Execute a representative authenticated lifecycle mutation externally and prove outbox → publisher → RabbitMQ → consumer completion while capturing the running image digest for all three roles."],
                deliverables: ["Versioned three-role environment manifests", "Migration/dependency-placement evidence", "OpenShift/Kubernetes runtime evidence", "External synchronous and asynchronous verification", "Three-role image-digest traceability"],
                completionCriteria: ["The workload runs under platform security constraints.", "The backend is not directly public.", "The externally verified release matches the approved artifact."],
            },
        },
        {
            id: "cloud-orchestration-gitops-milestone-003",
            title: "Transfer Deployment Authority to Argo CD",
            estimatedMinutes: 120,
            content: {
                type: "practical",
                objective: "Make environment Git and Argo CD the authoritative deployment path while keeping GitLab CI/CD responsible for producing releasable artifacts.",
                scenario: "Avoid a split-brain deployment model. Once GitOps owns the environment, direct GitLab CI/CD deployment to that environment is retired or reduced to updating/proposing desired state.",
                instructions: ["Create the Argo CD `Application` and repository boundary.", "Publish a new approved Steward image through GitLab CI/CD/Nexus.", "Update the environment declaration to the new immutable image identity.", "Observe reconciliation and verify the rollout.", "Perform a safe drift experiment and recover through GitOps.", "Document rollback by reverting desired state to a retained known-good artifact."],
                deliverables: ["Argo CD application", "Git-driven promotion evidence", "Drift recovery evidence", "Rollback evidence"],
                completionCriteria: ["GitLab CI/CD and Argo CD have non-overlapping authoritative responsibilities.", "A release is traceable from source to live pod.", "Drift and rollback use declared state rather than ad-hoc cluster mutation."],
            },
        },
        {
            id: "cloud-orchestration-gitops-milestone-004",
            title: "Orchestration and GitOps Review",
            estimatedMinutes: 40,
            content: {
                type: "reflection",
                prompt: "Explain which problems Kubernetes/OpenShift and Argo CD now solve for Steward, which new failure and security boundaries they created, and why the final system still keeps GitLab CI/CD, Nexus, OpenTofu, Kong and Steward domain logic as separate responsibilities. Identify one case where simpler VPS hosting would still be the stronger architecture choice and one trigger that would justify keeping the enterprise platform.",
                minimumCharacters: 350,
            },
        },
    ],
};

export const cloudOrchestrationGitOpsDeepLessons: Lesson[] = [...specs.map(richLesson), milestone];
