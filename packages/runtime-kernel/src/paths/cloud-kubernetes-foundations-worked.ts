// PED-005 Cloud Engineer: first-principles authored additions for the first
// Kubernetes lessons. No claim that kind, OpenShift, or a remote cluster ran.
export type K8sSection = { heading:string; paragraphs:string[]; list?:string[]; code?:{language:string;caption?:string;code:string} };
export const kubernetesFoundationsById: Record<string,K8sSection[]> = {
  "why-orchestration": [
    {
      "heading": "Build the mental model from a failure, not a product diagram",
      "paragraphs": [
        "A container image packages application code and its runtime dependencies. Docker starts containers on a particular host, while Compose describes a group of containers and their dependencies on that host. Neither inherently supplies a multi-node scheduler, a cluster-wide desired-state API or continuous reconciliation if a worker disappears. Kubernetes is an orchestration control plane: users declare desired objects, controllers compare desired and observed state and node agents execute workloads. Running a Pod is therefore different from promising one manually started container will remain alive. The extra capability has costs: a distributed control plane, cluster networking, privileges, storage integration and operational expertise.",
        "Example: Steward requires two API replicas and one node becomes unavailable. With a manually configured single-node Docker host, an operator may need to recover the VM and manually restart the API. In a correctly provisioned multi-node Kubernetes cluster with spare capacity and compatible storage, controllers can create replacements on eligible nodes. That is not a guarantee of continuous availability: if every replica shared the failed node, no spare nodes exist or the database is unavailable, reconciliation cannot conjure missing capacity or recover data. This first lesson explains the new operational claim before introducing object names."
      ],
      "list": [
        "Source and image: delivery pipeline owns the selected bytes; Kubernetes does not build or approve them.",
        "Desired state: API objects describe replicas, labels and pod templates.",
        "Observed state: nodes and controllers report actual scheduling, health and endpoints.",
        "Reconciliation: controllers repeatedly work toward desired state, subject to real-world capacity and permissions.",
        "Evidence: running is not ready; a valid image is not the same as a reachable application."
      ]
    },
    {
      "heading": "Local lab prerequisites and the first safe observation",
      "paragraphs": [
        "For the next Kubernetes lessons, use a disposable local kind cluster, not a live enterprise or OpenShift cluster. Prerequisites: a Linux/macOS development machine with Docker running, kind and kubectl installed, permission to use Docker, network access to pull images, and adequate free CPU/RAM (a few GB). These are requirements, not supplied by the lesson. The first command checks tooling; do not create a cluster if the machine cannot sustain it. The cluster name and context are deliberately unique to TSA. All later destructive examples are confined to the dedicated namespace; cleanup removes only this named local cluster. The commands have NOT been executed against a live cluster as part of this source audit."
      ],
      "code": {
        "language": "bash",
        "caption": "Inspect tooling and create only the named disposable kind cluster",
        "code": "kind version\nkubectl version --client\ndocker info --format '{{.ServerVersion}}'\nkind create cluster --name tsa-ped005\nkubectl --context kind-tsa-ped005 get nodes -o wide\n# Expected: a kind control-plane node eventually reports Ready.\n# Keep this cluster for the next lessons.\n# Final cleanup, after all dedicated labs: kind delete cluster --name tsa-ped005"
      }
    },
    {
      "heading": "Contrast three operating choices",
      "paragraphs": [
        "Single-host Compose remains simpler for a small Steward homelab where a VM recovery procedure meets the actual objective. A local kind cluster is useful for learning reconciliation but is not production high availability. A managed Kubernetes/OpenShift environment delegates some control-plane lifecycle responsibility to an operator/vendor but retains application, data, RBAC and network-design obligations. Choose Kubernetes only when the operating requirement justifies its added failure and security surfaces."
      ],
      "list": [
        "Independent transfer: distinguish (a) Docker restart policy on one VM, (b) a Deployment on a single-node kind cluster, and (c) a multi-node cluster with spare capacity during node loss.",
        "For each, state exactly which failure it can recover automatically, which it cannot, and what test would prove the claim."
      ]
    }
  ],
  "cluster-control-plane": [
    {
      "heading": "Trace one write request all the way to a process",
      "paragraphs": [
        "kubectl is an API client. Applying a Deployment manifest sends a request to the Kubernetes API server, which authenticates, authorizes, validates and persists the object in etcd. The Deployment controller observes the desired replica count, manages a ReplicaSet and that ReplicaSet creates Pod objects. The scheduler chooses a node for each unscheduled Pod based on eligible capacity and placement constraints. The node's kubelet asks the container runtime to create the sandbox and containers, observes their status and reports it back. A Service, introduced later, selects ready Pod endpoints; creating a Deployment alone does not publish the application to a laptop or the internet.",
        "Do not collapse those actors into 'Kubernetes starts the container'. A Deployment can exist while no Pod is schedulable. A scheduled Pod can remain in ImagePullBackOff; a running container can fail readiness. Each is a different observable boundary. etcd state, controllers, scheduler, kubelet, container runtime and the application's own dependencies have distinct recovery implications."
      ],
      "list": [
        "API server: entry point for object writes and reads, not the scheduler.",
        "etcd: control-plane store; data availability is not application-database backup.",
        "Deployment controller and ReplicaSet: translate replica intent into Pod objects.",
        "Scheduler: binds unscheduled Pods to eligible nodes; it does not fetch images.",
        "Kubelet/runtime: realize assigned Pod containers and report node-local status.",
        "Service/EndpointSlices: connect selected ready backends to stable discovery, taught after Pods."
      ]
    },
    {
      "heading": "Observe the control plane without a deployed application",
      "paragraphs": [
        "Use the kind context created in the preceding lesson. The read-only commands demonstrate distinct information surfaces. If the context does not exist, the last negative command should fail locally and must not affect your active cluster. A successful API-server readiness response and a Ready node do not prove any application endpoint, registry credential, or network policy has been configured. Never respond to a missing context by editing production kubeconfig automatically."
      ],
      "code": {
        "language": "bash",
        "caption": "Read-only control-plane and context-boundary inspection",
        "code": "kubectl --context kind-tsa-ped005 cluster-info\nkubectl --context kind-tsa-ped005 get nodes -o wide\nkubectl --context kind-tsa-ped005 get --raw='/readyz'\nkubectl --context not-a-real-tsa-context get nodes\n# Expected for the last command: a context-not-found error and nonzero exit status.\n# The first three are read-only; values depend on local kind version."
      }
    },
    {
      "heading": "Locate failures at their first reliable source",
      "paragraphs": [
        "Unschedulable Pod: inspect kubectl describe pod and its Events for a FailedScheduling reason, then compare node allocatable resources, selectors, taints and tolerations. ImagePullBackOff: inspect image reference, registry reachability and image-pull credentials after the scheduler has selected a node. CrashLoopBackOff: inspect container logs, exit status, startup command and dependency availability. Running-but-unready: inspect readiness-probe results separately from process status. Control-plane API unavailable: check context/server and control-plane health before diagnosing application code. Keep these hypotheses separate; a blind 'kubectl delete pod' can hide the original evidence without fixing configuration."
      ],
      "list": [
        "Independent transfer: a Deployment says 2 desired and 0 available while both Pods are Pending. Identify the likely failing layer and the first two commands for discriminating insufficient CPU from a nonexistent registry image.",
        "Do not infer which failure occurred without seeing Pod status and Events."
      ]
    }
  ],
  "pods-deployments": [
    {
      "heading": "What actually changes when you declare a Deployment",
      "paragraphs": [
        "A Pod groups one or more containers sharing a network namespace and compatible scheduling/storage context. It is a disposable execution unit, not an individual durable VM. A ReplicaSet maintains the target number of Pod objects matching its label selector. A Deployment manages ReplicaSets and controlled changes to the Pod template. It does not repair a broken database query or turn a Service into an internet endpoint. Labels and selectors are critical: the Deployment's selector must match its Pod template labels, otherwise the API rejects the definition or controllers cannot manage the intended instances.",
        "This fixture uses two nginx HTTP containers merely to make Pod lifecycle and readiness observable. It is not a Steward image or approved production artifact. The human-readable nginx tag is mutable and therefore does not meet the immutable digest rule established in Delivery Engineer; a real Steward deployment must use the exact approved registry digest. The local cluster from the previous lessons must exist, and no other training namespace should be reused."
      ],
      "code": {
        "language": "yaml",
        "caption": "Complete disposable Deployment manifest; save as tsa-web.yaml",
        "code": "apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: tsa-web\n  labels:\n    app: tsa-web\nspec:\n  replicas: 2\n  selector:\n    matchLabels:\n      app: tsa-web\n  template:\n    metadata:\n      labels:\n        app: tsa-web\n    spec:\n      containers:\n        - name: web\n          image: nginx:1.27-alpine\n          ports:\n            - containerPort: 80\n          resources:\n            requests:\n              cpu: 50m\n              memory: 64Mi\n            limits:\n              memory: 128Mi\n          readinessProbe:\n            httpGet:\n              path: /\n              port: 80\n            initialDelaySeconds: 2\n            periodSeconds: 5"
      }
    },
    {
      "heading": "Apply, observe and prove reconciliation",
      "paragraphs": [
        "Create an isolated namespace once, save the exact YAML above as tsa-web.yaml, then apply it through the named kind context. A success criterion is not just that kubectl apply returned zero: the Deployment reports two ready replicas, and the ReplicaSet and Pods carry the expected labels. Delete one disposable Pod and watch the ReplicaSet create a replacement. Do not confuse a newly generated Pod name with evidence that the application is reachable over a Service; Service discovery belongs to the next lesson."
      ],
      "code": {
        "language": "bash",
        "caption": "Use only the disposable kind context and tsa-ped005 namespace",
        "code": "kubectl --context kind-tsa-ped005 create namespace tsa-ped005\nkubectl --context kind-tsa-ped005 -n tsa-ped005 apply -f tsa-web.yaml\nkubectl --context kind-tsa-ped005 -n tsa-ped005 rollout status deployment/tsa-web --timeout=180s\nkubectl --context kind-tsa-ped005 -n tsa-ped005 get deployments,replicasets,pods -l app=tsa-web -o wide\nkubectl --context kind-tsa-ped005 -n tsa-ped005 delete pod \"$(kubectl --context kind-tsa-ped005 -n tsa-ped005 get pod -l app=tsa-web -o jsonpath='{.items[0].metadata.name}')\"\nkubectl --context kind-tsa-ped005 -n tsa-ped005 rollout status deployment/tsa-web --timeout=180s\nkubectl --context kind-tsa-ped005 -n tsa-ped005 get pods -l app=tsa-web\n# Expected: the ReplicaSet creates a replacement and desired replica count returns to two.\n# When finished with the multi-lesson exercise: kubectl --context kind-tsa-ped005 delete namespace tsa-ped005"
      }
    },
    {
      "heading": "A failed rollout needs a diagnosis, not endless restarts",
      "paragraphs": [
        "In a **separate disposable** namespace or after snapshotting the known-good test manifest, deliberately set a new image reference to a guaranteed nonexistent repository tag. The API may accept the Deployment but the Pods then fail to pull the image, often showing ErrImagePull/ImagePullBackOff. Inspect kubectl get pods, kubectl describe pod and its Events; identify that scheduling succeeded but runtime image retrieval did not. Restore the known-good manifest and verify readiness. Never force such a test into a shared Steward environment or use an arbitrary untrusted registry as a fallback."
      ],
      "list": [
        "Independent transfer: after replacing one Pod, the count returns to 2 but HTTP health fails. Explain why ReplicaSet reconciliation can be correct while readiness/application behavior remains incorrect.",
        "Evidence to retain: applied manifest revision, Pod ownerReferences/labels, describe Events, readiness results, controller recovery and exact namespace/context."
      ]
    }
  ]
};
