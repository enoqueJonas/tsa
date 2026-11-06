// PED-005: directed conceptual and operational remediations in existing CD readings.
// Scenarios are instructional; no production deployment claimed.
export type DeliveryDeepSection = { heading:string; body:string; items?:string[]; code?:{language:string;value:string} };
export const cdOperationalDepthById: Record<string, DeliveryDeepSection[]> = {
  "ci-cd-cd": [
    {
      "heading": "Three different promises, three different exit criteria",
      "body": "Continuous Integration means proposed work is frequently reconciled with a shared codebase and required checks run on the exact integrated revision. Continuous Delivery means the verified output is assembled into a releasable candidate that an authorized operator could deploy on demand. Continuous Deployment is a policy that automatically promotes eligible candidates through the production transition without a discretionary manual release decision. A team can integrate every day but deploy monthly, or produce a deployable artifact after every merge while still requiring a manager's approval for production. None of the three labels alone guarantees zero defects or automatic database recovery."
    },
    {
      "heading": "Worked Steward release timeline",
      "body": "At 09:00, commit C enters main. CI tests C and builds OCI digest D; at 09:20 the same D is published to Nexus. That establishes a candidate ready for the next gate, not yet a deployed service. Under continuous delivery, an authorized approver can choose to promote D to the Rocky homelab, after reviewing compatibility and rollback assumptions. Under continuous deployment, predefined automated checks cause D to deploy automatically if all required gates pass. If a forbidden cross-team request returns 200 rather than 403 after launch, the deployment has failed client verification regardless of whether the process or image build was green; halt further promotion and follow the recovery decision. Name separately the CI, release-readiness and deployment-fitness evidence."
    },
    {
      "heading": "Contrast and transfer",
      "body": "A scheduled nightly script copying code to a server is not continuous integration merely because it runs automatically; it might not validate exact commits or enforce a gate. Conversely, a CI pipeline that always builds images but never retains immutable artifacts is not yet a reliable continuous delivery path. For practice, classify three pipelines: (a) test on PR only, (b) test and publish candidate digest after merge with manual release approval, and (c) full gated automatic production deployment. State what each does NOT prove."
    }
  ],
  "environment-management": [
    {
      "heading": "Environment means dependencies plus trust",
      "body": "An environment includes the release artifact, runtime configuration, networking, persistent database state, external dependencies, credentials, allowed users and operational policy. Staging and production can use the same container digest while depending on different data, database endpoints and secret managers. That is desirable for traceability, but they are not identical experiments: a staging database may not reproduce production volume, roles or constraints. Build a table for Steward with image digest, API DNS/port, PostgreSQL state and schema, RabbitMQ routing, Redis policy, network ACL and external provider stubs. Classify each input as versioned artifact, environment configuration, protected secret or independently managed persistent state."
    },
    {
      "heading": "Worked incorrect environment promotion",
      "body": "CI built digest D and staging validated it against database schema 0042. The production-like deployment pulls the same D but its database is still at schema 0041. Container startup might succeed while the first ownership update fails with a missing column. The correct diagnosis is a schema compatibility/precondition mismatch, not an artifact mismatch. Before deploying, inspect recorded migration state, apply the approved backward-compatible expansion or block promotion; then verify the same client behavior on the target. Never copy staging credentials or sample personal data to make the environments 'identical'."
    },
    {
      "heading": "Independent transfer",
      "body": "Imagine RabbitMQ is not running in staging but the API health check returns 200. List which assumptions a staging acceptance test can validate and which remain untested until an outbox-to-consumer exercise. Explain why the same image digest is necessary for build-once promotion but insufficient proof of behavioral equivalence."
    }
  ],
  "deployment-automation": [
    {
      "heading": "Deployment is an ordered state transition",
      "body": "A deploy pipeline needs an admission phase (approved immutable digest, target identity, authorized operator/runner), a precondition phase (service, database schema and compatible data), an execution phase (rollout of all affected process roles), a verification phase (client-observed request and asynchronous event), and a recovery decision. Treat each phase as a gate with an expected state and nonzero failure outcome. Running one SSH command that returns zero proves only that command finished, not that Steward API, outbox publisher and lifecycle consumer all serve the approved version."
    },
    {
      "heading": "Worked negative branch before any mutation",
      "body": "Suppose the approved digest is D but the deployment variable points to a mutable tag that now resolves to E. Before changing the running service, compare the resolved registry digest to the signed/approved release record and return nonzero on mismatch. Do not 'repair' the mismatch by altering the approval. If the digest matches but a database compatibility test fails, stop before updating containers. If a post-rollout authenticated ownership update fails, record the actual running digest, migration state, request and failure timestamp before deciding to revert. Rollback must include all affected roles; an API-only rollback can leave event consumers incompatible."
    },
    {
      "heading": "Alternative and independent exercise",
      "body": "Manual runbooks can be acceptable at low deployment frequency if decisions and rollback are explicit; a fully automated workflow reduces drift only after its preconditions and failure behavior are trustworthy. Draft a five-step deployment checklist that specifies observable success and BLOCK for every step. Identify which command failures are safe to retry and which persistent changes require manual recovery analysis."
    }
  ],
  "release-approvals": [
    {
      "heading": "Approval binds a decision to particular evidence",
      "body": "A release approval is an accountable judgment about a known candidate, risk window, target and rollback constraints. It does not create the artifact. A useful decision record names the image digest, source/CI run, the tests and UAT evidence reviewed, target production-like environment, migration state, known limitations, decision owner and expiry or window. An approval for digest D does not authorize E after a rebuild, even if the version label stayed 1.5.0. Changing the deployment target or migration plan may also invalidate the original decision."
    },
    {
      "heading": "Worked approval refusal and exception boundary",
      "body": "A release candidate passes CI and API smoke tests, but the deployment would contract an old database column used by the current RabbitMQ consumer. The approver should reject promotion until compatibility evidence exists; selecting a green badge is not approval. In a genuine emergency, an explicit risk exception may be recorded with a bounded scope and empowered decision maker, but it must not silently disable the pipeline's future failure gate. Explain why an operator who can self-approve and publish unrestricted artifacts is a separation-of-duties risk even when all tooling is configured correctly."
    },
    {
      "heading": "GitLab deployment approvals are not automatically available on every self-managed tier",
      "body": "GitLab protected-environment deployment approvals are a tiered feature (Premium/Ultimate under current GitLab documentation), not a capability the learner can assume in an arbitrary self-managed Free installation. Even when configured, approval and the manual action that starts the deployment are distinct; permission to deploy to a protected environment must be checked on the actual target. If the homelab tier lacks this mechanism, record a genuine authorized, out-of-band approval with immutable release identity and an access-restricted manual deployment job, rather than falsely claiming GitLab enforced an approval rule. A self-clicked Continue button does not demonstrate separation of duties or authorized production approval."
    },
    {
      "heading": "Independent exercise",
      "body": "Write a two-paragraph approval decision for a fictional Steward release with a passing build, an unverified outbox consumer and an urgent security fix. Specify which evidence supports approval, which gaps block it, and what narrowly scoped alternative (for example a constrained forward fix with immediate verification) could be defensible if the risk owner explicitly accepts it."
    }
  ],
  "rolling-deployments": [
    {
      "heading": "An algorithm only works if capacity and compatibility exist",
      "body": "A rolling deployment replaces one or a bounded number of replicas while the remaining replicas continue to serve requests. A load balancer must stop routing to an unhealthy new replica and each replica must pass readiness before old capacity is removed. This requires multiple replaceable instances, sufficient spare capacity, stable client routing and old/new binaries that can coexist with database and message schema. With only one Steward API container, removing it before starting the replacement is a sequential restart, not a genuinely availability-preserving rolling deployment."
    },
    {
      "heading": "Worked two-version failure",
      "body": "A and B are both connected to shared PostgreSQL while B is introduced as 1 of 3 API replicas. B writes a new mandatory event field that A's consumer cannot parse, even though HTTP health reports green. The rolling sequence has violated a shared message contract: stopping the rollout at 1 of 3 limits additional exposure but cannot undo already emitted messages. Reconcile producer/consumer event compatibility and schema plan before enabling mixed versions. After restoring a compatible artifact, replay or quarantine affected events using the established System Thinker authority/duplicate rules; don't declare the rollout safe from HTTP success alone."
    },
    {
      "heading": "Compare alternatives",
      "body": "Rolling reduces peak duplicate capacity relative to blue-green but creates a longer mixed-version window; blue-green permits pre-switch testing but needs parallel capacity and still shares data. For a single VM without a traffic distributor, defend deferring rolling deployment and choose a reproducible stopped-service upgrade with a documented maintenance window, known digest and rollback gate. Do not build fake replicas merely to tick off a technology name."
    }
  ]
};
