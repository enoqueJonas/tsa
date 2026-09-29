import type { LearningResource, LessonBlock } from "../activities/content";
import type { Lesson } from "./lesson";

const dockerDocs: LearningResource = { title: "Docker documentation", url: "https://docs.docker.com/" };
const dockerfileRef: LearningResource = { title: "Dockerfile reference", url: "https://docs.docker.com/reference/dockerfile/" };
const composeDocs: LearningResource = { title: "Docker Compose documentation", url: "https://docs.docker.com/compose/" };

function richLesson(id: string, title: string, intro: string, sections: Array<{ heading: string; body: string; items?: string[]; code?: { language: string; code: string } }>, resources: LearningResource[] = [dockerDocs]): Lesson {
    const blocks: LessonBlock[] = [{ type: "paragraph", text: intro }];
    for (const section of sections) {
        const anchor = section.heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        blocks.push({ type: "heading", id: anchor, text: section.heading, level: 2 }, { type: "paragraph", text: section.body });
        if (section.items) blocks.push({ type: "list", items: section.items });
        if (section.code) blocks.push({ type: "code", language: section.code.language, code: section.code.code });
    }
    blocks.push({ type: "callout", tone: "steward", title: "Steward checkpoint", body: "Apply this concept to Steward with the smallest configuration that proves the behavior. Prefer observable container boundaries, immutable image identity and documented runtime inputs over Docker commands used by habit." });
    blocks.push({ type: "resources", title: "Continue learning", resources });
    return { id: `containers-and-docker-${id}`, title, activities: [{ id: `containers-and-docker-${id}-001`, title, estimatedMinutes: 35, content: { type: "reading", body: intro, blocks } }] };
}

export const containersAndDockerDeepLessons: Lesson[] = [
    richLesson("containers-vms", "Containers versus Virtual Machines", "Containers and virtual machines isolate workloads at different boundaries. Understanding the difference matters more than memorizing that containers are 'lighter'.", [
        { heading: "Shared kernel versus virtual hardware", body: "A VM includes a guest operating system above virtualized hardware. A container is a process isolated by kernel mechanisms while sharing the host kernel. This changes startup cost, density and the set of failures that remain shared." },
        { heading: "Choose isolation for the requirement", body: "Containers improve packaging and repeatability; VMs give a stronger operating-system boundary. Steward can run inside a container hosted by the VM built in Platform Builder: the layers solve different problems rather than replacing one another." },
    ]),
    richLesson("namespaces-cgroups", "Namespaces and cgroups Concepts", "Docker builds on Linux primitives. Namespaces shape what a process can see; cgroups shape how much resource it may consume and how that usage is accounted for.", [
        { heading: "Isolation is selective", body: "PID, network, mount, user and other namespaces can give a process its own view of system resources. The process is still running on the host kernel." },
        { heading: "Resources need explicit thinking", body: "Without limits, a container can compete with other workloads for host CPU and memory. A container boundary is not a capacity guarantee." },
    ]),
    richLesson("architecture", "Docker Architecture", "Docker separates client commands from the daemon that manages images, networks, volumes and containers. This matters for security, troubleshooting and automation.", [
        { heading: "Follow the control path", body: "The CLI sends API requests to the Docker daemon. The daemon performs privileged host operations and delegates low-level container execution through the container runtime stack." },
        { heading: "The daemon is a trust boundary", body: "Membership in the docker group commonly grants power equivalent to root on the host. Treat Docker administration as privileged platform access, not as an ordinary developer convenience." },
    ]),
    richLesson("images-layers", "Images and Layers", "An image is an immutable content-addressed filesystem plus metadata. Layers make builds cacheable and distributable, but Dockerfile order affects both efficiency and invalidation.", [
        { heading: "Separate image from container", body: "The image is the packaged template. A container adds a writable runtime layer and process state. Recreating a container from the same image should not require preserving that writable layer." },
        { heading: "Think in cache boundaries", body: "Place stable dependency installation before frequently changing application source where practical so code edits do not invalidate expensive layers unnecessarily." },
    ]),
    richLesson("dockerfiles", "Writing Dockerfiles", "A Dockerfile is executable build documentation. Its quality determines how reproducibly and safely the application image can be created.", [
        { heading: "Make the runtime explicit", body: "Pin an appropriate base-image family/version strategy, set a working directory, install dependencies deliberately, copy only required files, run as a non-root user when possible and define the process contract clearly." },
        { heading: "Avoid environment-specific builds", body: "The Steward image should not contain homelab secrets or environment-specific database URLs. Those belong to runtime configuration.", code: { language: "dockerfile", code: "FROM python:3.12-slim\nWORKDIR /app\nCOPY requirements.txt .\nRUN pip install --no-cache-dir -r requirements.txt\nCOPY . .\nRUN useradd --system steward && chown -R steward:steward /app\nUSER steward\nCMD [\"gunicorn\", \"steward.wsgi:application\", \"--bind\", \"0.0.0.0:8000\"]" } },
    ], [dockerDocs, dockerfileRef]),
    richLesson("build-context", "Build Context", "Every Docker build receives a context: the set of files the builder is allowed to access. Oversized contexts slow builds and can accidentally expose sensitive material to build steps.", [
        { heading: "Control what enters the build", body: "Use .dockerignore to exclude virtual environments, Git metadata, logs, local databases, secrets and other irrelevant files." },
        { heading: "Context is part of reproducibility", body: "A Dockerfile that depends on undeclared files from a developer machine is not a reliable build. The build context should contain exactly the inputs required to create the image." },
    ], [dockerfileRef]),
    richLesson("multistage", "Multi-stage Builds", "Multi-stage builds separate build-time tooling from runtime contents. They are useful when compilation or asset generation requires dependencies that the final container does not need.", [
        { heading: "Separate build and runtime concerns", body: "One stage can compile dependencies or assets; the final stage copies only the required result. This can reduce image size and attack surface." },
        { heading: "Use only when it buys something", body: "Do not add stages as decoration. For Steward, justify a second stage if it removes compilers, package caches or frontend build tooling from the runtime image." },
    ], [dockerfileRef]),
    richLesson("volumes", "Volumes", "Containers are disposable; important state is not. Volumes and bind mounts move persistent or host-managed data outside the container writable layer.", [
        { heading: "Classify data before mounting", body: "Database files, uploaded assets and operational state have different persistence and backup needs. Source code bind mounts are convenient in development but usually inappropriate for immutable production-like deployment." },
        { heading: "Persistence still needs backup", body: "A named volume survives container replacement, but it can still be deleted, corrupted or lost with the host. Volume persistence is not a backup strategy." },
    ]),
    richLesson("networking", "Container Networking", "Containers normally communicate through virtual network interfaces, bridges, routing and NAT created by the container platform. The networking concepts from Platform Builder still apply.", [
        { heading: "Published ports are explicit exposure", body: "A service listening on port 8000 inside the container is not necessarily reachable from the host or LAN. Publishing creates a host-side path to that container port." },
        { heading: "Use service names internally", body: "In a Compose network, services can reach one another by service name. Do not hard-code transient container IP addresses." },
    ]),
    richLesson("compose", "Docker Compose", "Compose declares a small multi-container application: services, networks, volumes, configuration and dependency relationships. It is ideal for making Steward plus its database reproducible in the homelab.", [
        { heading: "Declare the topology", body: "Use Compose to express the application image, PostgreSQL dependency, persistent volume, network relationship and runtime configuration without turning a README into a sequence of manual docker run commands." },
        { heading: "Dependency order is not readiness", body: "A database container may have started before it is ready to accept connections. Add meaningful health checks or application retry behavior where startup ordering matters.", code: { language: "yaml", code: "services:\n  api:\n    build: .\n    depends_on:\n      db:\n        condition: service_healthy\n  db:\n    image: postgres:17\n    healthcheck:\n      test: [\"CMD-SHELL\", \"pg_isready -U steward\"]\n      interval: 5s\n      timeout: 3s\n      retries: 10" } },
    ], [composeDocs]),
    richLesson("health", "Health Checks", "A running process is not always a usable service. Health checks make one narrow operational claim testable, but poor checks can create false confidence.", [
        { heading: "Define what healthy means", body: "A liveness-style check asks whether the process is functioning enough to continue. A readiness-style check asks whether it can serve traffic. Do not make every dependency outage look like the process itself is dead." },
        { heading: "Keep checks cheap and specific", body: "For Steward, prefer a lightweight endpoint that verifies the application is responsive and only include database dependency if that matches the operational question being asked." },
    ]),
    richLesson("registries", "Container Registries", "A registry stores and distributes images by repository and reference. It becomes the handoff point between build systems and deployment systems.", [
        { heading: "Registry is not just storage", body: "Image identity, authentication, retention, immutability policy and provenance all matter. Later in Delivery Engineer, Nexus becomes the internal repository for container images and other dependency formats." },
        { heading: "Do not deploy from a laptop-only image cache", body: "A release pipeline needs a shared source of artifacts. If the image exists only on the machine that built it, deployment is not independently reproducible." },
    ]),
    richLesson("tags", "Image Tags and Versioning", "Tags are convenient names; digests identify exact image content. Treat mutable tags such as latest as pointers, not immutable release identity.", [
        { heading: "Use version plus digest awareness", body: "Tag Steward images with an application release version and, where useful, the source commit. Preserve the digest produced by the registry or build so a deployment can be traced to exact bytes." },
        { heading: "Do not overwrite release meaning", body: "Rebuilding and pushing different content under the same release tag destroys traceability. A released version should behave as an immutable artifact identity." },
    ]),
    richLesson("optimization", "Image Optimization", "Image optimization is primarily about removing unnecessary runtime contents and making builds efficient—not chasing the smallest possible byte count.", [
        { heading: "Optimize for risk and transfer cost", body: "Use appropriate slim bases, exclude build caches, remove unused tooling and reduce layer invalidation. Avoid exotic minimal images if they make debugging or dependency compatibility disproportionally difficult." },
        { heading: "Measure before optimizing", body: "Inspect image history and size. Identify the largest layers and determine whether they represent required runtime dependencies or accidental build residue." },
    ]),
    richLesson("debugging", "Container Debugging", "Container debugging starts by locating the failing boundary: build, image, process startup, configuration, filesystem, network, dependency or host resource.", [
        { heading: "Inspect before entering the container", body: "Start with container status, logs, inspect output, published ports, health status and resource state. An interactive shell can help, but it should not be the first reflex." },
        { heading: "Reproduce the failure from the artifact", body: "If a container works only after manual edits inside it, the image or configuration is incomplete. Capture the fix in Dockerfile, Compose or runtime configuration and recreate the container." },
    ]),
    {
        id: "containers-and-docker-lab",
        title: "Lab: Containerize Steward API",
        activities: [
            { id: "containers-and-docker-lab-001", title: "Containerization Brief", estimatedMinutes: 25, content: { type: "reading", body: "Convert Steward from a host-installed service into a reproducible containerized application without losing traceability, persistence or operational clarity.", blocks: [
                { type: "paragraph", text: "The goal is not simply to make `docker run` succeed. Produce an image that can be rebuilt from source, a Compose topology that expresses required dependencies and runtime configuration, and evidence that containers can be destroyed and recreated safely." },
                { type: "heading", id: "required-boundaries", text: "Required boundaries", level: 2 },
                { type: "list", items: ["Application image contains code and runtime dependencies, not secrets", "Database state lives outside the application container", "Runtime configuration is supplied explicitly", "Only intended host ports are published", "Health behavior is observable", "Image version maps back to source"] },
                { type: "callout", tone: "warning", title: "Do not hide host assumptions", body: "A container can still depend on the host kernel, Docker daemon, storage, network and available CPU/memory. Document those dependencies instead of claiming the image makes Steward infrastructure-independent." },
                { type: "resources", title: "Continue learning", resources: [dockerDocs, composeDocs] },
            ] } },
            { id: "containers-and-docker-lab-002", title: "Build, Run and Recreate Steward", estimatedMinutes: 180, content: { type: "practical", objective: "Build a production-oriented Steward container image and a reproducible Compose environment, then prove clean recreation and one controlled failure diagnosis.", scenario: "Use the learner-managed homelab. Preserve the existing Linux/VM substrate; containers are the next packaging and runtime layer on top of it.", instructions: ["Write a Dockerfile with an explicit base, deterministic dependency installation, non-root runtime where practical and a clear process command.", "Add .dockerignore and verify secrets, local databases and irrelevant development files are not in the build context.", "Create a Compose definition for Steward and PostgreSQL with named persistent storage and explicit runtime configuration.", "Add a meaningful health check and verify container, host and client reachability separately.", "Tag the image with a release-style version and record its image ID or digest plus source commit.", "Destroy and recreate the application container without losing persistent data.", "Rebuild from a clean state and prove the result does not depend on undocumented manual changes.", "Introduce one controlled failure such as invalid configuration, unavailable database or wrong port mapping; localize it using status, logs, inspect and network evidence; restore service."], deliverables: ["Dockerfile and .dockerignore", "Compose definition", "Versioned Steward image identity mapped to source", "Clean rebuild and recreation evidence", "Persistence evidence", "Health and client-reachability evidence", "Controlled container failure and diagnosis record"], completionCriteria: ["Steward can be built and run from versioned configuration rather than manual host installation steps.", "Application containers are disposable without losing required persistent state.", "The runtime image contains no environment secrets.", "The learner can explain host, image, container, volume and network boundaries.", "A container failure is diagnosed with evidence and the fix is captured in versioned configuration."] } },
            { id: "containers-and-docker-lab-003", title: "Container Handoff", estimatedMinutes: 20, content: { type: "reflection", prompt: "Which parts of the Steward container workflow are now reproducible locally but still depend on a human to execute them, and which of those steps should Continuous Integration automate next?" } },
        ],
    },
];
