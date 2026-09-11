import type { PracticalContent } from "../activities/content";
import type { Lesson } from "./lesson";
import { containersAndDockerDeepLessons } from "./delivery-containers-docker-deep";

const practices: Record<string, PracticalContent> = {
    "Containers versus Virtual Machines": {
        type: "practical",
        objective: "Decide which Steward responsibilities belong in the Rocky Linux VM and which belong in a container, then defend the boundary from failure and lifecycle evidence.",
        scenario: "Steward already runs on a learner-managed Rocky Linux VM. Containerization must solve packaging and runtime-repeatability problems without pretending the VM is obsolete.",
        instructions: ["Draw the current host -> VM -> process stack.", "Add the proposed container layer and mark which kernel, network, storage and failure dependencies remain shared.", "List three responsibilities that stay with Rocky Linux and three that move into the image/container contract.", "Name one failure a container isolates and one it cannot isolate.", "Write a short adopt/defer decision for containerizing Steward."],
        deliverables: ["VM/container boundary diagram", "Responsibility split", "Containerization decision"],
        completionCriteria: ["VM and container isolation are not conflated.", "The decision is tied to Steward's packaging/runtime needs.", "Shared host dependencies are explicit."],
    },
    "Namespaces and cgroups Concepts": {
        type: "practical",
        objective: "Observe container isolation and resource control instead of treating namespaces and cgroups as invisible Docker internals.",
        scenario: "A containerized Steward process appears isolated, but another workload can still starve the host. Determine what isolation exists and what capacity remains shared.",
        instructions: ["Run a simple container and inspect its PID/network view from inside and from the host.", "Record one namespace difference you can observe.", "Apply a conservative memory or CPU limit to a disposable workload.", "Observe what happens when the workload approaches or exceeds that limit.", "Explain which resource pressure can still affect the Rocky Linux host."],
        deliverables: ["Namespace observation", "Resource-limit evidence", "Shared-capacity note"],
        completionCriteria: ["Isolation and resource accounting are demonstrated separately.", "A limit is verified through behavior or inspection.", "The host remains part of the capacity model."],
    },
    "Docker Architecture": {
        type: "practical",
        objective: "Trace a Docker command from client to daemon to running container and identify the privilege boundary involved.",
        scenario: "An engineer requests Docker access on the Steward host. Before granting it, determine what that access can actually control.",
        instructions: ["Record the Docker client and daemon versions/endpoints.", "Inspect the daemon service on Rocky Linux.", "Trace one harmless docker command through the client/daemon mental model.", "Demonstrate why docker-group membership is privileged by listing one host-impacting capability it enables.", "Define who should receive Docker administration rights in the homelab and why."],
        deliverables: ["Docker control-path note", "Daemon/service evidence", "Privilege decision"],
        completionCriteria: ["The daemon is recognized as a privileged host control plane.", "Docker access is not treated as ordinary application access.", "The access decision follows least privilege."],
    },
    "Images and Layers": {
        type: "practical",
        objective: "Use image history and rebuild behavior to prove how Dockerfile ordering affects cache reuse and artifact identity.",
        scenario: "Small Steward source changes are causing unexpectedly expensive rebuilds. Determine which layers are invalidated and why.",
        instructions: ["Build the current Steward image twice and compare cache behavior.", "Inspect image history/layers.", "Change only application source and rebuild.", "Identify which layers were invalidated.", "Propose one Dockerfile ordering improvement without changing runtime behavior."],
        deliverables: ["Image-history evidence", "Before/after cache observation", "Layer-order decision"],
        completionCriteria: ["Image and container state are distinguished.", "Cache invalidation is explained from build inputs.", "Optimization preserves reproducibility."],
    },
    "Writing Dockerfiles": {
        type: "practical",
        objective: "Turn Steward's host-installed runtime into an explicit, non-root, environment-independent image build contract.",
        scenario: "Another engineer must build the same Steward runtime without reproducing your Rocky Linux host setup manually.",
        instructions: ["Write or refine the Steward Dockerfile with an explicit base and dependency-install step.", "Run the application as a non-root user where practical.", "Keep runtime configuration and secrets out of image layers.", "Build the image from a clean checkout/context.", "Inspect the running process identity and command to prove the intended runtime contract."],
        deliverables: ["Dockerfile", "Clean-build evidence", "Runtime identity/configuration evidence"],
        completionCriteria: ["The image builds from versioned inputs.", "No environment secret is baked into the image.", "The runtime process does not require root without justification."],
    },
    "Build Context": {
        type: "practical",
        objective: "Reduce Steward's Docker build context to declared build inputs and prove that local secrets and generated state are excluded.",
        scenario: "A developer accidentally has credentials, logs and a local database in the repository directory. The build must not depend on or transmit them as context.",
        instructions: ["Inventory large, generated and sensitive files beneath the build root.", "Create or refine .dockerignore.", "Compare build-context size before and after where tooling exposes it.", "Prove representative secret/generated paths are excluded.", "Verify the image still builds from the reduced context."],
        deliverables: [".dockerignore", "Context inventory", "Exclusion and successful-build evidence"],
        completionCriteria: ["Build inputs are intentional.", "Sensitive/local-only files are excluded.", "Reducing context does not create hidden developer-machine dependencies."],
    },
    "Multi-stage Builds": {
        type: "practical",
        objective: "Decide from evidence whether Steward benefits from a multi-stage image and implement it only if it removes meaningful build-only contents.",
        scenario: "The team proposes multi-stage builds because they are considered best practice, but complexity must earn its place.",
        instructions: ["Inspect the current image for build-only tools or generated artifacts.", "Estimate or measure what a separate build stage would remove.", "If justified, implement a minimal multi-stage variant and compare image contents/size.", "If not justified, record the defer decision and trigger that would change it.", "Verify runtime behavior remains equivalent."],
        deliverables: ["Build/runtime dependency inventory", "Adopt-or-defer decision", "Comparison evidence when implemented"],
        completionCriteria: ["Multi-stage construction is justified by a concrete benefit.", "Runtime behavior is preserved.", "Complexity is not added merely for convention."],
    },
    "Volumes": {
        type: "practical",
        objective: "Classify Steward state and prove that container replacement does not destroy data that is meant to persist.",
        scenario: "Application containers should be disposable, while PostgreSQL and any genuine persistent state must survive recreation and remain recoverable.",
        instructions: ["Classify current Steward data as image content, ephemeral runtime state or persistent state.", "Identify the volume/bind-mount strategy for each persistent item.", "Create test data through Steward.", "Destroy and recreate the application container and verify persistence.", "Explain why the volume still requires a separate backup strategy."],
        deliverables: ["State classification", "Mount/volume map", "Recreation persistence evidence"],
        completionCriteria: ["Persistent state is outside the disposable application layer.", "Data survival is tested, not assumed.", "Volume persistence is not confused with backup."],
    },
    "Container Networking": {
        type: "practical",
        objective: "Trace Steward traffic across container, host and homelab network boundaries while keeping backend services non-public.",
        scenario: "Steward works inside its container network but is unreachable from the intended client, while PostgreSQL must remain private.",
        instructions: ["Record the container network and service addresses/names.", "Inspect which ports are listening inside the application container.", "Inspect which ports are published on the Rocky Linux host.", "Prove the intended Steward client path from another host.", "Prove PostgreSQL is reachable from the application network but not published to ordinary LAN/public clients."],
        deliverables: ["Container-to-host network map", "Published-port evidence", "Positive API and negative backend reachability proof"],
        completionCriteria: ["Container listening and host publication are distinguished.", "Backend exposure remains minimal.", "The path reuses Platform Builder networking concepts rather than Docker-specific guesswork."],
    },
    "Docker Compose": {
        type: "practical",
        objective: "Declare Steward and PostgreSQL as a reproducible local/homelab application topology and test startup readiness rather than startup order alone.",
        scenario: "Manual docker run commands are drifting across engineers and the API sometimes starts before PostgreSQL is usable.",
        instructions: ["Create or refine Compose services for Steward and PostgreSQL.", "Declare network, persistent storage and runtime configuration explicitly.", "Use service naming instead of container IPs.", "Add a meaningful PostgreSQL health check and application startup/retry behavior.", "Bring the stack down and recreate it from the versioned definition."],
        deliverables: ["Compose definition", "Health/readiness evidence", "Clean recreation evidence"],
        completionCriteria: ["The topology is recoverable from versioned configuration.", "Readiness is not equated with process start.", "No transient container IP is part of the application contract."],
    },
    "Health Checks": {
        type: "practical",
        objective: "Define and test a narrow Steward health contract that distinguishes process health from dependency readiness.",
        scenario: "A health endpoint always returns 200 even when the API cannot serve meaningful requests, creating false confidence.",
        instructions: ["Define what the chosen health check claims.", "Test it during normal operation.", "Stop or disrupt PostgreSQL safely and observe the check.", "Decide whether that behavior matches liveness or readiness intent.", "Adjust the check or document the distinction, then retest."],
        deliverables: ["Health-contract statement", "Healthy/degraded evidence", "Liveness/readiness decision"],
        completionCriteria: ["The check answers a specific operational question.", "Dependency failure behavior is understood.", "The check remains cheap enough for repeated use."],
    },
    "Container Registries": {
        type: "practical",
        objective: "Define the registry contract that will later be implemented with Nexus, without installing Nexus prematurely.",
        scenario: "Steward images currently exist only in a local Docker cache, so another machine cannot deploy the exact release independently.",
        instructions: ["Record the current image name, version, source commit and local image ID/digest.", "Define the future repository naming convention for Steward images.", "List authentication, immutability, retention and provenance requirements for the shared registry.", "Describe the exact handoff from CI build to registry to deployment.", "Mark Nexus implementation as a later artifact-platform step rather than adding it now."],
        deliverables: ["Registry contract", "Image naming/versioning convention", "CI -> registry -> deploy handoff"],
        completionCriteria: ["The problem with laptop-only images is explicit.", "Nexus has a concrete requirement to satisfy later.", "Registry concerns extend beyond simple file storage."],
    },
    "Image Tags and Versioning": {
        type: "practical",
        objective: "Create a Steward image identity scheme that maps a human release version to exact image content and source revision.",
        scenario: "A deployment says it runs v1.4.0, but the tag has been overwritten and nobody can prove which bytes or commit are running.",
        instructions: ["Tag one Steward image with a release-style version.", "Associate the source commit with the image through metadata/tagging/documentation.", "Record the image digest or immutable image identifier.", "Demonstrate why latest alone cannot prove release identity.", "Write the rule that forbids silently replacing an existing release tag with different content."],
        deliverables: ["Release-to-commit-to-digest mapping", "Tagging convention", "Immutability rule"],
        completionCriteria: ["A release can be traced to exact image content.", "Mutable convenience tags are not treated as immutable identity.", "The convention prepares later promotion through Nexus."],
    },
    "Image Optimization": {
        type: "practical",
        objective: "Optimize Steward's image from measured waste rather than from a goal of producing the smallest possible image.",
        scenario: "The image is slow to transfer and contains tooling that may not belong at runtime, but aggressive minimization could harm operability.",
        instructions: ["Record current image size and inspect image history.", "Identify the largest or clearly unnecessary runtime contents.", "Make one low-risk optimization such as excluding cache/build residue or improving layer order.", "Rebuild and compare size/history.", "Verify Steward still starts and remains diagnosable."],
        deliverables: ["Before/after image evidence", "Optimization rationale", "Runtime verification"],
        completionCriteria: ["Optimization targets measured waste.", "The result preserves runtime behavior.", "Debuggability and compatibility are considered alongside size."],
    },
    "Container Debugging": {
        type: "practical",
        objective: "Diagnose a controlled Steward container failure by localizing the failing boundary before entering or mutating the container.",
        scenario: "A newly recreated Steward container is unhealthy. The repair must end in versioned configuration, not an undocumented interactive fix.",
        instructions: ["Capture a healthy baseline.", "Introduce one safe failure in configuration, dependency reachability or port mapping.", "Inspect status, logs, health state, configuration and network publication before using an interactive shell.", "Identify the last confirmed-good and first confirmed-bad boundary.", "Fix the root cause in Dockerfile, Compose or runtime configuration.", "Recreate the container from versioned state and prove recovery."],
        deliverables: ["Failure hypothesis", "Diagnostic evidence", "Versioned fix", "Clean recreation proof"],
        completionCriteria: ["Diagnosis precedes mutation.", "The fix survives container recreation.", "No manual in-container edit is required for the recovered state."],
    },
};

function enrichLesson(lesson: Lesson): Lesson {
    const practice = practices[lesson.title];
    if (!practice) return lesson;
    return {
        ...lesson,
        activities: [
            ...lesson.activities,
            {
                id: `${lesson.id}-practice`,
                title: `${lesson.title}: Steward Investigation`,
                estimatedMinutes: 60,
                content: practice,
            },
        ],
    };
}

export const containersAndDockerQualityLessons: Lesson[] = containersAndDockerDeepLessons.map(enrichLesson);
