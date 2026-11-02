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
  ],
  "services-discovery": [
    {
      "heading": "Name stability and endpoint health are separate contracts",
      "paragraphs": [
        "A Deployment maintains an intended set of Pods, but their IP addresses are disposable and may change on replacement. A Kubernetes Service is a stable virtual networking/discovery abstraction that selects Pods by labels and directs traffic to ready endpoints. Its DNS name is normally discoverable to workloads within the cluster, not automatically from the internet. EndpointSlice resources reflect selected network endpoints; selectors or readiness can leave a Service with no usable backends even though the Service object itself exists.",
        "The networking path for this lesson is client inside cluster → Service DNS/ClusterIP → selected ready Pod IP:container port → web process. A Service maps service port to targetPort on the container; the actual Pod process must be listening. It does not by itself provide public TLS, Internet DNS or an OpenShift Route. Those are separate edge responsibilities."
      ],
      "list": [
        "Deployment/ReplicaSet: desired number of replaceable Pods, not a fixed destination address.",
        "Pod: current execution endpoint; names/IPs can change after reconciliation.",
        "Service: stable name and logical port, with a selector that identifies intended Pods.",
        "EndpointSlice: current endpoint data maintained by controllers; unready/mismatched Pods must not be assumed routable.",
        "Ingress controller or OpenShift Route: an additional external edge and TLS/routing decision, introduced later."
      ]
    },
    {
      "heading": "Runnable Service fixture on the existing disposable Deployment",
      "paragraphs": [
        "The preceding lesson must have a running, Ready tsa-web Deployment in namespace tsa-ped005 on the named kind cluster. Save this YAML as tsa-web-service.yaml and apply it only to that namespace. Inspect Service, matching Pods and EndpointSlices before testing HTTP. The port-forward is a temporary local tunnel through kubectl; it is not a production load balancer, ingress or public exposure. Keep it active in one terminal, then send an HTTP request from a second terminal. Expected: nginx's default HTTP response succeeds if the test image and readiness are healthy. If not, inspect selected labels, readiness, Pod listener and Service targetPort in that order."
      ],
      "code": {
        "language": "yaml",
        "caption": "Complete local ClusterIP Service, using the Deployment labels taught earlier",
        "code": "apiVersion: v1\nkind: Service\nmetadata:\n  name: tsa-web\nspec:\n  selector:\n    app: tsa-web\n  ports:\n    - name: http\n      port: 80\n      targetPort: 80"
      }
    },
    {
      "heading": "Observe the positive route and a deliberately empty selector",
      "paragraphs": [
        "These commands require the existing kind context. The first port-forward runs until interrupted and should be used in a separate terminal; use Ctrl-C after the curl. The negative Service selects no training Pods and should therefore have no ready endpoints. Its port-forward cannot supply a valid backend. This is a selector/endpoint failure, not evidence that DNS, TLS or cluster networking itself failed. It does not alter the healthy Service. Clean up only the negative fixture after recording evidence."
      ],
      "code": {
        "language": "bash",
        "caption": "Check Service-to-Pod routing; compare a selector that matches no Pods",
        "code": "kubectl --context kind-tsa-ped005 -n tsa-ped005 apply -f tsa-web-service.yaml\nkubectl --context kind-tsa-ped005 -n tsa-ped005 get svc tsa-web\nkubectl --context kind-tsa-ped005 -n tsa-ped005 get endpointslices -l kubernetes.io/service-name=tsa-web\nkubectl --context kind-tsa-ped005 -n tsa-ped005 port-forward service/tsa-web 18080:80\n# In a second terminal, while forwarding:\ncurl --fail --show-error http://127.0.0.1:18080/\n# Ctrl-C the port-forward after recording the response.\n# Apply the deliberately wrong-selector YAML in the next section, then:\nkubectl --context kind-tsa-ped005 -n tsa-ped005 get endpointslices -l kubernetes.io/service-name=tsa-web-empty\nkubectl --context kind-tsa-ped005 -n tsa-ped005 describe service tsa-web-empty\n# Expected: no usable backend endpoints (not a healthy 200 response).\nkubectl --context kind-tsa-ped005 -n tsa-ped005 delete service tsa-web-empty"
      }
    },
    {
      "heading": "Negative fixture: a valid Service object with no useful backend",
      "paragraphs": [
        "A syntactically valid Service can still be operationally wrong. Save the second manifest as tsa-web-empty.yaml, then apply it before running the preceding negative observations. The selector intentionally differs from the Deployment's app=tsa-web label. Kubernetes can successfully create the Service object while no Pod matches; the correct diagnosis starts by comparing selector and Pod labels, not restarting CoreDNS or changing firewall rules."
      ],
      "code": {
        "language": "yaml",
        "caption": "Deliberately empty selector; apply only as negative training fixture",
        "code": "apiVersion: v1\nkind: Service\nmetadata:\n  name: tsa-web-empty\nspec:\n  selector:\n    app: not-the-training-deployment\n  ports:\n    - name: http\n      port: 80\n      targetPort: 80"
      }
    },
    {
      "heading": "Transfer: service discovery is not internet exposure",
      "paragraphs": [
        "In a real Steward cluster, an API client outside the cluster needs an explicit ingress/route/network path and usually a valid TLS identity. The existence of a ClusterIP Service does not provide it. A worker inside the cluster could reach the Service while a laptop cannot; that difference is expected until the edge is configured.",
        "Independent case: a Service resolves by DNS and has two endpoints, but GET / returns connection refused. Give two possible explanations that are NOT DNS failure (wrong targetPort, process bound only to Pod loopback, or network policy) and state a command/observation to distinguish them. Then contrast Kubernetes Service with OpenShift Route without presenting a Route as a synonym."
      ]
    }
  ],
  "scheduling-placement": [
    {
      "heading": "The scheduler filters before it chooses",
      "paragraphs": [
        "A Kubernetes Pod is not assigned to an arbitrary worker. The scheduler first filters nodes that can satisfy hard constraints such as resource requests, node selectors, node affinity, taints/tolerations and volume topology; it then scores eligible nodes. CPU/memory requests reserve scheduling capacity, not physical cores or hard caps. Limits constrain runtime behavior but do not by themselves solve placement. A scheduler cannot ignore unsatisfied constraints because a Pod has been Pending for a long time.",
        "A Deployment's replicas cannot automatically survive a node failure when every Pod is bound to one unavailable node or available nodes lack capacity. Availability therefore requires capacity and placement evidence, not simply replicas: 2. Anti-affinity and topology spread can help distribute replicas, but may keep Pods Pending in an undersized learning cluster. Do not force production-like spread constraints onto a one-node kind lab and claim that cluster has two fault domains."
      ]
    },
    {
      "heading": "Observe a deterministic scheduling failure safely",
      "paragraphs": [
        "Use the named kind cluster and dedicated tsa-ped005 namespace from earlier lessons. This negative Pod requests a node label deliberately not present in the disposable cluster; scheduling should leave it Pending. It does not download or execute its image. Save as tsa-unschedulable.yaml and apply only in the training namespace. Check Pod Events rather than diagnosing image pulls, because the scheduler must choose a node before kubelet can attempt an image download. Delete only this named negative Pod when finished."
      ],
      "code": {
        "language": "yaml",
        "caption": "Deliberately unschedulable Pod: nonexistent node selector",
        "code": "apiVersion: v1\nkind: Pod\nmetadata:\n  name: tsa-unschedulable\nspec:\n  nodeSelector:\n    tsa.example/placement: missing\n  containers:\n    - name: sleeper\n      image: busybox:1.36\n      command: [\"sh\", \"-c\", \"sleep 3600\"]\n      resources:\n        requests:\n          cpu: 20m\n          memory: 32Mi"
      }
    },
    {
      "heading": "Distinguish Pending scheduling from failed container startup",
      "paragraphs": [
        "Execute these scoped read/cleanup operations after applying the negative YAML. Expected: Pod Pending and an event explaining node(s) did not match the node selector. Event phrasing varies with Kubernetes version; a momentarily empty Events list is not proof of success. A scheduling event tells you what constraint was not met, but it does not prove the rest of the application would be healthy if scheduled. An ImagePullBackOff case generally occurs after Pod assignment and must be inspected via container status and kubelet events."
      ],
      "code": {
        "language": "bash",
        "caption": "Inspect FailedScheduling and remove only the negative Pod",
        "code": "kubectl --context kind-tsa-ped005 -n tsa-ped005 apply -f tsa-unschedulable.yaml\nkubectl --context kind-tsa-ped005 -n tsa-ped005 get pod tsa-unschedulable -o wide\nkubectl --context kind-tsa-ped005 -n tsa-ped005 describe pod tsa-unschedulable\nkubectl --context kind-tsa-ped005 get nodes --show-labels\nkubectl --context kind-tsa-ped005 -n tsa-ped005 delete pod tsa-unschedulable\n# Expected: a scheduling failure tied to the intentionally impossible node label."
      }
    },
    {
      "heading": "Independent placement challenge",
      "paragraphs": [
        "A fictional production cluster has three nodes in one rack and two Steward replicas; both are Running on the same node. Explain which failures the replica count protects against, which rack/power failure it cannot survive and how topology spread or Pod anti-affinity plus spare nodes would change the guarantee. Then analyze a second case in which a rolling Deployment requires a third temporary Pod but the cluster cannot satisfy its CPU request. Identify why rollout stalls without blaming the image tag."
      ]
    }
  ],
  "dns-network-policy": [
    {
      "heading": "DNS answers a name; Service routing and policy answer different questions",
      "paragraphs": [
        "A Pod can resolve tsa-web.tsa-ped005.svc.cluster.local through cluster DNS while the Service has no ready endpoints, the application listens on the wrong port or policy blocks traffic. DNS success establishes only name-to-address resolution, not a TCP connection or HTTP authorization. Service discovery, EndpointSlice readiness, CNI packet forwarding and workload application status each add a separate boundary. Namespace-qualified Service names avoid ambiguity when clients and Services live in different namespaces.",
        "A NetworkPolicy object selects Pods and describes allowed ingress/egress flows, but its enforcement depends on the cluster networking implementation. kind's default kindnetd is a simple CNI and should not be treated as a verified NetworkPolicy enforcement system. A YAML policy being accepted by the API does NOT prove network traffic was denied. For a real negative policy lab, use a supported network-policy-capable CNI in a dedicated, explicitly configured cluster; retain a positive allowed connection and a negative blocked connection from separate Pod identities. Never test deny-all on a shared production namespace."
      ]
    },
    {
      "heading": "Inspect DNS and endpoints with a disposable debug process",
      "paragraphs": [
        "The positive Service and Deployment from the previous lessons must already be Ready. The following Pod runs BusyBox nslookup and exits. Inspect its logs and Service endpoint information before deleting it. Expected: a DNS answer for the namespace-qualified Service and ready EndpointSlices if the training Pods are available. The DNS answer may resolve a ClusterIP rather than individual Pod addresses. If the DNS query fails, inspect the CoreDNS Service and Pod state, names and the source Pod network before altering NetworkPolicy."
      ],
      "code": {
        "language": "bash",
        "caption": "Scoped DNS lookup, logs and cleanup; no NetworkPolicy enforcement claimed",
        "code": "kubectl --context kind-tsa-ped005 -n tsa-ped005 run tsa-dns-check --image=busybox:1.36 --restart=Never --command -- sh -c 'nslookup tsa-web.tsa-ped005.svc.cluster.local'\nkubectl --context kind-tsa-ped005 -n tsa-ped005 logs pod/tsa-dns-check\nkubectl --context kind-tsa-ped005 -n tsa-ped005 get svc tsa-web\nkubectl --context kind-tsa-ped005 -n tsa-ped005 get endpointslices -l kubernetes.io/service-name=tsa-web\nkubectl --context kind-tsa-ped005 -n tsa-ped005 delete pod tsa-dns-check\n# If logs are not ready immediately, wait for the short-lived Pod to reach completion."
      }
    },
    {
      "heading": "Diagnosis and policy transfer",
      "paragraphs": [
        "Case A: DNS resolves and EndpointSlices contain ready backends, but HTTP times out: investigate actual TCP routing, network policy enforcement, targetPort and listener, not the resolver. Case B: DNS resolves but Service has no ready backends: inspect the selector against labels and readiness probe; restarting DNS is not a fix. Case C: a restrictive NetworkPolicy resource was applied but client traffic still succeeds on a kind cluster: first verify the CNI actually enforces policies before claiming that Kubernetes ignored a valid deny rule.",
        "Independent transfer: explain why an OpenShift Route, a Kubernetes Service and a NetworkPolicy cannot substitute for one another in Steward's inbound request path. Write the expected observable evidence at DNS, Service endpoint, policy and application layers without assuming an external network exists."
      ]
    }
  ],
  "persistent-storage": [
    {
      "heading": "A claim is a request, not a durable backup",
      "paragraphs": [
        "Kubernetes separates the Pod that uses storage from storage provisioning and lifecycle. A PersistentVolume (PV) represents a cluster storage resource; a PersistentVolumeClaim (PVC) requests storage with access mode, size and possibly a StorageClass that chooses provisioning behavior. A Pod mounts a claim at a path. Deleting the Pod usually does not delete a bound PVC, but deleting the claim may trigger a reclaim policy and storage deletion depending on the StorageClass/PV. A running database on a PVC is not automatically recoverable: durability still depends on storage failure domain, consistency and independently tested backups.",
        "The OpenShift storage operator and CSI driver may add enterprise lifecycle capabilities, but the core PV/PVC/StorageClass contract remains Kubernetes. Do not use hostPath on a shared node to simulate resilient storage; host-local data does not survive a lost node without another recovery path. For Steward, authoritative PostgreSQL data and RabbitMQ critical state must be managed with proven persistence semantics, not merely because an application YAML contains a volumeMount."
      ]
    },
    {
      "heading": "Safe negative exercise: a PVC no provisioner can satisfy",
      "paragraphs": [
        "To expose the control-plane state without allocating disks, apply this PVC to the dedicated training namespace using a deliberately nonexistent StorageClass. The PVC should remain Pending because no matching dynamic provisioner or PV is available. The expected state is not a storage outage claim; it demonstrates that a valid storage request cannot be fulfilled by configuration alone. Do not use an existing shared production StorageClass name. Inspect StorageClass objects read-only, describe the PVC and then delete only the disposable claim."
      ],
      "code": {
        "language": "yaml",
        "caption": "Deliberately unbound disposable PVC; no real disk requested from a valid class",
        "code": "apiVersion: v1\nkind: PersistentVolumeClaim\nmetadata:\n  name: tsa-unbound-claim\nspec:\n  accessModes:\n    - ReadWriteOnce\n  resources:\n    requests:\n      storage: 64Mi\n  storageClassName: tsa-nonexistent-class"
      }
    },
    {
      "heading": "Observe the storage control plane without touching application data",
      "paragraphs": [
        "After saving as tsa-unbound-claim.yaml, use the named kind cluster context to inspect provisioning state and Events. The claim should report Pending with no suitable StorageClass or PV. Event text varies with storage controller. Delete the intentionally unbound claim; no real Steward database files are involved. This is a negative contract exercise only. A valid positive exercise would require a supported disposable StorageClass and a Pod writing a unique value, followed by Pod recreation and an independent backup/restore test; **none of that has been performed here**."
      ],
      "code": {
        "language": "bash",
        "caption": "Read StorageClass/PV information and confirm unbound PVC before scoped cleanup",
        "code": "kubectl --context kind-tsa-ped005 get storageclass\nkubectl --context kind-tsa-ped005 get persistentvolumes\nkubectl --context kind-tsa-ped005 -n tsa-ped005 apply -f tsa-unbound-claim.yaml\nkubectl --context kind-tsa-ped005 -n tsa-ped005 get pvc tsa-unbound-claim\nkubectl --context kind-tsa-ped005 -n tsa-ped005 describe pvc tsa-unbound-claim\nkubectl --context kind-tsa-ped005 -n tsa-ped005 delete pvc tsa-unbound-claim\n# Expected: Pending due to deliberately absent storage class; no data-loss experiment."
      }
    },
    {
      "heading": "Compare persistence and recovery decisions",
      "paragraphs": [
        "If a PVC remains bound after Pod replacement, the result says something about that storage class and node failure model, not that a backup exists. If an underlying volume is in the same physical failure domain as the worker, loss of that host may destroy data despite a green Kubernetes Deployment status. Distinguish in an independent diagram: Pod recreation, PV access mode, PVC identity, database consistency, off-cluster backups, RPO and RTO. Identify why OpenShift or a managed Kubernetes provider cannot infer the required restore objective from a PVC declaration."
      ]
    }
  ]
};
