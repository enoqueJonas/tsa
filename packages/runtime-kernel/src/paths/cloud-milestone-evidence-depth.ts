// Gate-indexed operational acceptance rubric; no original milestone IDs are modified.
export type CloudMilestoneGateAugmentation={instructions:string[];deliverables:string[];criteria:string[]};
export const cloudMilestoneGateAugmentations:Record<string,CloudMilestoneGateAugmentation> = {
  "gate-1-hosting-architecture": {
    "instructions": [
      "Record an architecture decision with explicit environment ID, user-facing operation, RPO/RTO proposal, chosen failure domain and named approver; a cloud-product inventory without a user-operation requirement is incomplete.",
      "Attach the source revision of the decision, the reviewed alternatives (single VPS, cluster and retained homelab only for training), a dated provider pricing source and a risk register; label any assumption about scaling, resilience or labor NOT_MEASURED.",
      "Obtain independent review of which complexity was actually earned; a local `kind` success or synthetic Cost Estimation figure cannot justify an internet-operational architecture."
    ],
    "deliverables": [
      "Reviewed architecture source and human sign-off",
      "Accepted-risk and alternative-decision evidence tied to a concrete environment"
    ],
    "criteria": [
      "A named independent reviewer and the precise public user operation are traceable to the decision; choosing a product alone is not proof.",
      "Unmeasured capacity, uptime, costs and recovery remain explicitly labeled UNVERIFIED until real evidence is collected."
    ]
  },
  "gate-2-iac-provisioning": {
    "instructions": [
      "Capture the exact remote provider environment and workspace, reviewed OpenTofu plan hash, identity used to apply, actual provider resource identifiers, and post-apply no-diff plan; providerless local terraform_data laboratory does NOT satisfy this gate.",
      "Demonstrate the real state-backend access boundary, concurrency locking or explicit writer serialization, history/recovery, and a rejected unapproved replace/destroy action; review partial failure and protected secrets without displaying values.",
      "Require independently reviewable remote evidence before marking provider provisioning complete. An accepted CLI exit code on a local disposable state is insufficient if no target resources exist."
    ],
    "deliverables": [
      "Actual cloud resource IDs and redacted provider-backed apply/diff evidence",
      "Provider state/locking and unauthorized-destructive-change denial records"
    ],
    "criteria": [
      "Real named remote infrastructure exists and a new provider-backed plan converges, with no unexplained resources outside the IaC inventory.",
      "A reviewer confirms backend state, credentials and destructive-change protections; local OpenTofu tests count as prerequisites only."
    ]
  },
  "gate-3-network-identity": {
    "instructions": [
      "From a genuinely external client capture public DNS result, served Kong certificate SAN/issuer/expiry, HTTPS/TLS validation and a representative allowed request, including client timestamp and target hostname; loopback TLS and `kind` Service port-forward are separate prior labs.",
      "Demonstrate refusal of at least one direct public backend/admin/database port and denial of cross-tenant access through the deployed API. A ServiceAccount `kubectl auth can-i` result is not a substitute for public network denial or app authorization.",
      "Present served certificate before/after an actually executed renewal/reload or a documented independent staged validation plus renewal-monitor signal. If no real renewal has occurred, report RENEWAL_NOT_TESTED; include secret delivery evidence without revealing its value."
    ],
    "deliverables": [
      "External HTTPS/DNS/Kong and direct-backend denial captures",
      "Runtime-secret and real served-certificate lifecycle evidence"
    ],
    "criteria": [
      "Public ingress, private backend, admin identities and tenant authorization are independently tested at their actual deployment boundaries.",
      "Real served certificate/renewal and user-token allow/deny conditions have distinguishable dated evidence; synthetic self-signed TLS exercises alone cannot close this gate."
    ]
  },
  "gate-4-release-verification": {
    "instructions": [
      "Trace one immutable Nexus image digest from source SHA and GitLab CI/CD publish result to an approved environment-Git commit, Argo CD Application Sync/Health and *observed* API, publisher and consumer Pod image IDs. Reject tags without running digest evidence.",
      "Execute a public externally authenticated and forbidden team request through Kong and one real lifecycle transition through persisted outbox → RabbitMQ publication → consumer completion; capture redacted correlation IDs and the same source/release identity.",
      "Test actual CNI-enforced NetworkPolicy packet denial plus permitted path; `kubectl apply networkpolicy` alone is not enforcement. Prove safe restart/termination, identify any OpenShift SCC/Route admissions and Argo Rollouts overlap and report skipped controller integrations as NOT_TESTED."
    ],
    "deliverables": [
      "Real source→Nexus→Git→Argo→three-role immutable-digest and sync evidence",
      "External tenant/request plus asynchronous end-to-end correlation traces",
      "Actual policy allow/deny and termination results"
    ],
    "criteria": [
      "Exactly one approved release digest can be traced to all three running Steward roles and real public/business behavior; Argo Sync without user verification is insufficient.",
      "Real Argo CD reconciliation, network-policy enforcement, outbox/consumer completion and intended gateway path have separately observed proof; local Kubernetes API tests cannot substitute."
    ]
  },
  "gate-5-recovery-failure": {
    "instructions": [
      "Write a safe failure hypothesis with the actual environment, injection permissions, expected customer symptoms, observability sources, abort point and measured recovery clock before touching a real service.",
      "Introduce one approved reversible fault and capture external user-path failure and subsequent recovery timestamps; Pod Running or a recreated ReplicaSet alone is not verified user restoration. Record data-loss implication/RPO for that scenario and explicitly distinguish it from a *separate* PostgreSQL restore drill if none was performed.",
      "Revalidate application S3-compatible object write/read and persistence after restart under its actual scoped runtime identity, verify approved backup/retention responsibility and capture safe teardown. The previous stand-alone MinIO training test is NOT a Steward deployment restore."
    ],
    "deliverables": [
      "Fault hypothesis, external recovery timeline, recovered business operation and data-loss classification",
      "Deployed object workflow and operational backup/retention evidence"
    ],
    "criteria": [
      "The measured exercise has a real failure injection, before/after client outcome and time to recover in the SAME environment.",
      "No lab-only pod repair or MinIO container restart is misreported as actual production backup restore/RPO/RTO."
    ]
  },
  "gate-6-cost-operability": {
    "instructions": [
      "Enumerate real provider resources and active billing dimensions, units, quantities, billing region and date/currency with reproducible provider calculator or actual bill links; synthetic $131.40/$168.76/$213.60 values must be clearly marked classroom scenarios.",
      "Compare latest approved resource inventory against the provider-backed cost model: always-on nodes, load balancer, public IPv4, gateway, managed DB, volume/snapshot/backup, egress, logs and Argo/Kong capacity. Document unknown usage or tax/discount terms.",
      "Record a named budget owner, an explicit approval trigger when actual/forecast cost crosses the budget, an alert test status and a measured business-meaningful denominator for cost per successful operation; do not assume budget notifications stop resource creation."
    ],
    "deliverables": [
      "Dated region-specific provider price/rate source, complete inventory and spend forecast",
      "Approved budget/ownership matrix, idle-resource report and real-denominator qualification"
    ],
    "criteria": [
      "All currently provisioned chargeable resources have owner, cost drivers and retained-or-teardown decision, with assumptions marked independently of measured billing.",
      "No fictional unit prices or unmeasured success counts are presented as an observed invoice or production unit economics."
    ]
  },
  "gate-progressive-delivery": {
    "instructions": [
      "Install and verify the actual Argo Rollouts controller, the Argo CD application/repository relationship and a *real* traffic-routing mechanism. Capture stable/canary target image digests, routing resources and request-attributed telemetry. The 127.0.0.1 four-HTTP-server exercise is a teaching prerequisite only.",
      "Execute one healthy progression with contemporaneous stable baseline and sufficient real sample volume, then a distinct readiness-passing defective candidate that automatically ABORTS before full exposure and returns new requests to stable. Capture AnalysisRuns/controller status and the running image identity.",
      "Introduce a safe genuine analysis dependency failure and prove missing/stale telemetry cannot silently promote; separately verify stable/candidate PostgreSQL schema, outbox/queue and cache compatibility, because traffic rollback does not undo persisted writes."
    ],
    "deliverables": [
      "Real controller, router and traffic sample/AnalysisRun evidence",
      "Bad-release abort, unavailable-analysis denial and stable-state compatibility observations"
    ],
    "criteria": [
      "All real canary outcomes are observed in an authorized cluster, not inferred from a local proxy or synthetic counters.",
      "Automatic abort/fail-safe and actual persistent-state compatibility are verified independently of healthy Kubernetes Pod status."
    ]
  },
  "gate-7-handoff": {
    "instructions": [
      "Give an independent reviewer an ordered, versioned reconstruction path: GitLab CI revision and Nexus digest, OpenTofu root/state, runtime Kubernetes/OpenShift manifests, environment Git and Argo CD, Kong/DNS/TLS, data migration and retained artifact IDs.",
      "Link a reproducible operator runbook containing read-only diagnosis, rollout/rollback authority, secret rotation owner, backup/restore process, provider inventory and costs. Add an explicit deferred register for Reliability/Quality/Security with owner and trigger, not a vague 'future improvements' list.",
      "Separate confirmed external/platform evidence from untested or synthetic prerequisites. Require independent human review rather than selecting Accepted in the browser as proof that the runbook works."
    ],
    "deliverables": [
      "Independently reviewed reconstruction index, source commit references and operational ownership matrix",
      "Unresolved risk/deferred-school evidence with concrete scope and reviewer"
    ],
    "criteria": [
      "A reviewer other than the operator can locate every actual released component and the boundary of each unverified dependency.",
      "The handoff states which Cloud responsibilities remain OPEN and does not treat a browser checkbox or synthetic fixture as real operational acceptance."
    ]
  }
};
