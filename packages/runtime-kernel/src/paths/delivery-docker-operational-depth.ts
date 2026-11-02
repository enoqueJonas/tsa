// PED-005 Delivery Engineer: focused mechanisms and safe diagnostic lab paths
// added to the actual authored Docker readings, not generic readiness wrappers.
export type DockerDeepSection = {
  heading: string; body: string; items?: string[];
  code?: { language: string; code: string; output?: string };
};
export const dockerOperationalDeepeningById: Record<string, DockerDeepSection[]> = {
  "namespaces-cgroups": [
    {
      "heading": "Process identity is namespaced; kernel authority is not",
      "body": "Docker does not boot a second Linux kernel. An ordinary container process makes system calls into the same kernel as other processes on its host, but Linux namespaces alter which PIDs, hostnames, interfaces, mounts and other resources it can see. For example, PID 1 in a container may be PID 23147 on the host. Those are two names for one running task, not two copies. A container PID namespace is not automatically a user namespace, and neither guarantees a workload cannot exhaust host memory. Cgroups enforce/account resource consumption such as CPU and memory separately from namespaces. If an operator says 'it has its own OS', ask whether the kernel or only the process's view was isolated."
    },
    {
      "heading": "Guided observable inspection with a disposable container",
      "body": "On a disposable Linux host with Docker installed and permission to use its daemon, start with 'docker info' and check that the daemon is reachable. The commands below use a small published BusyBox image and therefore require network access the first time; image availability and Docker privileges are prerequisites. Inside the container, show PID 1 and the memory cgroup limit. On cgroup v2, memory.max should reflect approximately 67108864 bytes for a 64 MiB limit; cgroup v1 layouts differ, so if that file is absent use docker inspect on the container instead of claiming the limit is missing. Compare this to the host PID reported by docker inspect. Never run an uncontrolled memory-exhaustion stressor on a shared host.",
      "code": {
        "language": "bash",
        "code": "docker info --format '{{.ServerVersion}}'\ndocker run --rm --name tsa-isolation-lab --memory=64m busybox:1.36 sh -c \\\n  'printf \"container PID=%s\\\\n\" \"$$\"; cat /proc/self/cgroup; if [ -f /sys/fs/cgroup/memory.max ]; then cat /sys/fs/cgroup/memory.max; fi'\n# Use a separate long-lived disposable container to compare its host PID:\ndocker run -d --name tsa-pid-lab busybox:1.36 sleep 120\ndocker inspect --format '{{.State.Pid}}' tsa-pid-lab\ndocker rm -f tsa-pid-lab",
        "output": "# Environment-specific version and host PID values are expected.\n# In a cgroup-v2 container with --memory=64m, memory.max is ~67108864.\n# The final command removes only the disposable tsa-pid-lab container."
      }
    },
    {
      "heading": "Failure boundaries and counterexample",
      "body": "If the process is killed because of its memory limit, that is not automatically a host-wide out-of-memory event; inspect the container exit status, OOM-killed indicator and host logs before attributing cause. A host kernel crash affects all containers using that kernel. As a novel exercise, predict whether a misconfigured container with no memory limit can destabilize a VM that hosts three workloads, and distinguish namespace isolation, cgroup limit, VM boundary and Proxmox host boundary in the answer."
    }
  ],
  "architecture": [
    {
      "heading": "Trace the Docker control plane explicitly",
      "body": "The docker CLI is a client, not the process that creates containers. It sends requests to the Docker Engine API, usually through a Unix socket on the local host; the daemon manages image pulls/builds, networks and volumes, then coordinates containerd and an OCI runtime such as runc to start container processes. The application process runs inside its configured namespaces/cgroups on the host kernel. The control plane (requests to the daemon) and data plane (packets to the running application) are different paths. A working docker ps proves CLI-to-daemon access, not that the Steward HTTP API is listening or reachable."
    },
    {
      "heading": "Read-only diagnosis before any privilege changes",
      "body": "Run docker context show, docker version and docker info on a host where you are already authorized to inspect Docker. If docker version reports a Client section but cannot connect to Server, the CLI exists but its configured endpoint/daemon may be absent, stopped or inaccessible. Inspect the selected context and the daemon service through the host's normal service management; do not reflexively run sudo chmod 666 on the socket. Docker socket access often provides host-admin-equivalent power because the daemon can mount host paths and start privileged containers. The secure repair is to restore the intended service/account permissions and least-privilege access policy, not to make the socket world-writable.",
      "code": {
        "language": "bash",
        "code": "docker context show\ndocker version\ndocker info --format 'server={{.ServerVersion}} root={{.DockerRootDir}}'\n# These commands observe the daemon; they do not change containers."
      }
    },
    {
      "heading": "Two different failures, two different investigation paths",
      "body": "Case A: docker ps cannot contact the daemon. Look at Docker context, host daemon state and the caller's authorized socket access. Case B: docker ps works, a Steward container says Up, but curl to the API fails. Inspect docker ps port mappings, docker logs, docker inspect health status, application bind address, host firewall and client route. Starting with 'reinstall Docker' in Case B misses the failing boundary. Independent task: draw the control path and request path and place an 'access denied to daemon socket' error and an 'HTTP 503' at the correct edges."
    }
  ],
  "registries": [
    {
      "heading": "A registry reference has multiple layers of identity",
      "body": "An OCI image registry exposes repositories containing manifests and blobs. A reference such as registry.example.org/academy/steward:1.5.0 names a registry, repository and tag. The tag can be moved unless policy forbids it. A digest reference such as registry.example.org/academy/steward@sha256:... identifies manifest content. An image manifest references configuration and filesystem layer descriptors; multi-platform indices can select different platform manifests, so the exact digest recorded at approval must match the artifact and target platform contract. A local Docker image ID, a registry manifest digest, a Git commit and a tag are different identifiers and must not be silently substituted."
    },
    {
      "heading": "Walk the publish-to-deploy evidence boundary",
      "body": "CI builds a candidate from commit C. An authorized publish step pushes it to the registry and captures the registry-reported digest D. Approval names D and the target environment. A deployment using tag 1.5.0 without checking its current digest could accidentally select E if someone retagged it. Use the immutable approved digest and confirm which manifest/platform the runtime actually pulled. If a registry returns unauthorized, not found or rate limited, determine whether the image is absent or access failed; do not fall back to an unapproved external mirror. Nexus will later be the internal registry authority in the Steward flow."
    },
    {
      "heading": "Counterfactual exercise",
      "body": "Suppose the same tag resolves to digest D on Monday and digest E on Tuesday. Describe the minimum evidence required to demonstrate which bytes staging tested, which bytes were deployed and whether rollback can still pull the previous manifest. The test is not complete if you only compare strings printed by docker images; a real registry push/pull and runtime inspection remains UNVERIFIED until performed."
    }
  ],
  "optimization": [
    {
      "heading": "Optimize a measured bottleneck rather than a slogan",
      "body": "Image size, build time, network transfer, cold start and patching surface are different metrics. Removing build tools from a runtime image can reduce bytes and unnecessary packages, but a microscopic image that lacks required native libraries or cannot be diagnosed may worsen reliability. Measure the unmodified baseline first: record image size, build duration with cold and warm cache, layer history and startup behavior. A correct comparison uses the same application revision, pinned inputs and equivalent runtime tests. Otherwise a faster build may merely be using an old cache or skipping a dependency."
    },
    {
      "heading": "Worked comparison and a failure path",
      "body": "Suppose Steward's Dockerfile copies the whole repository before pip install. Even an unrelated documentation change changes an early layer and can force dependency installation again. Refactor to copy dependency manifests before the application source, then install pinned dependencies, then copy code. Build once cold and twice warm; inspect which layers are reused. If a new dependency imports an OS library unavailable in the slim runtime, the smaller image is not a success: the application must start and serve the same authorized and forbidden API requests. Avoid reporting an invented speed-up percentage until real build timings are captured."
    },
    {
      "heading": "Independent decision",
      "body": "Given two images, A is 240 MiB and boots in two seconds, B is 80 MiB and boots in eight seconds because it downloads runtime assets. Choose based on documented network, security, deployment and startup constraints. Propose one decisive measurement and a rollback trigger; do not claim smallest always wins."
    }
  ],
  "debugging": [
    {
      "heading": "Diagnose from the first failed boundary",
      "body": "Start by stating the observation precisely: image build fails, container fails to start, container exits after start, container stays running but health is unhealthy, or the client cannot reach an otherwise healthy API. Each points to different evidence. Build errors need the Dockerfile/build logs and input set. Exit after start needs process exit code, logs and entrypoint. Running-but-unreachable needs application listener, port publication, DNS/routing and host firewall. Dependency failures need a service-specific probe and configuration check. Never treat a green docker ps listing as proof of a valid HTTP response."
    },
    {
      "heading": "Read-only investigation sequence",
      "body": "On a disposable homelab container, list containers and statuses, inspect the chosen container's main process exit code and health, read recent logs with a bounded tail and inspect configured ports. Collect what the command actually reports before deciding to restart. If logs say database connection refused, test the database service DNS and readiness path from the relevant container network; localhost inside the API container refers to that container, not the database container. If only the host client fails, inspect published host address and firewall before changing Compose. Do not use docker exec to make undocumented fixes in the container's writable layer: recreate it from versioned configuration after identifying the cause.",
      "code": {
        "language": "bash",
        "code": "docker ps -a --format 'table {{.Names}}\\t{{.Status}}\\t{{.Ports}}'\ndocker inspect --format 'exit={{.State.ExitCode}} oom={{.State.OOMKilled}}' tsa-steward-api\ndocker logs --tail 40 tsa-steward-api\ndocker port tsa-steward-api\n# Replace tsa-steward-api with the disposable test container name; output varies."
      }
    },
    {
      "heading": "A complete failure-to-recovery record",
      "body": "Scenario: Docker reports the Steward API as running, but a laptop's GET /health times out. Evidence shows the API process listening on 127.0.0.1 inside the container. Publishing a port cannot forward to a listener bound only to that container loopback. The source-level repair is to bind the service to the intended container interface (for example, 0.0.0.0:8000 within the isolated container), keep the host publication restricted to the required address and retest from the intended client. Then run an authorized and forbidden request, not only /health. If the original failure remains, reopen the diagnosis rather than claiming a fix because the container restarted."
    }
  ]
};
