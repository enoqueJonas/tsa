// PED-005: concept-first CI teaching additions bound to real existing readings.
// Values and scenarios are explicitly illustrative, not observed CI infrastructure.
export type CISection = { heading:string; body:string; items?:string[]; code?:{language:string;code:string;output?:string} };
export const ciOperationalDepthById: Record<string, CISection[]> = {
  "architecture": [
    {
      "heading": "What integration actually means",
      "body": "Integration is the frequent combination of independently authored changes into a shared releasable line, with an automated check of the combined revision. A developer running tests locally exercises a workstation state; CI should check the exact Git commit in a declared environment and make its result visible to reviewers. Its output is evidence about a candidate, not a guarantee of correctness. A pipeline has an event (push/merge request), revision (commit SHA), executor (runner), job graph (dependencies and isolation), declared inputs, outputs (logs/test reports/artifacts) and enforced policy (which failures block integration). Explain every one before writing YAML."
    },
    {
      "heading": "Worked trace and fail-closed boundary",
      "body": "A Steward authorization change is proposed at commit C. CI checks out C, installs pinned dependencies, runs unit and authorization tests and builds candidate D if mandatory checks pass. If the authorization test shows a cross-team write incorrectly returns 200 instead of 403, the pipeline must fail before artifact publication. Even after checks pass, a deployment requires separate promotion authorization and client-visible post-deployment verification. Failure case: a job uses 'pytest ... || true', logs the failing assertion but returns status zero; the pipeline shows green because the shell hid the exit code. Repair the job and confirm failure propagation instead of adding a dashboard-only warning.",
      "items": [
        "Independent practice: define the pass/fail evidence for one proposed change, then identify which decisions belong to CI, release approval and runtime verification.",
        "Alternative: pre-merge checks verify proposed changes; post-merge main builds the integration commit. A successful check on the old head SHA does not certify the new merge SHA."
      ]
    }
  ],
  "runners": [
    {
      "heading": "Follow a job from scheduling to an isolated workspace",
      "body": "GitLab schedules a job, while a registered GitLab Runner polls for eligible work and executes it through a chosen executor (for example shell or Docker). The runner is an agent with its own credentials, filesystems, network access and quotas. A shell executor may expose the host more directly; a container executor can improve process/workspace separation but does not automatically eliminate privileged host access. Runner tags and project association determine job selection and allowed scope, not application authorization. A pipeline can pass on one runner and fail on another if the execution image, CPU architecture or required tools are not declared."
    },
    {
      "heading": "Worked trust boundary and recovery",
      "body": "Suppose an untrusted merge-request change includes a script that tries to read a deployment secret. If the same unprotected runner processes both untrusted checks and privileged publication with secret variables available, the runner has bridged a trust boundary. Keep untrusted validation on a constrained executor without production credentials; reserve publication for protected branches/tags and restricted runners, with independently enforced permissions. If a runner is compromised, investigate exposed tokens and host resources, revoke credentials and rebuild the runner from clean configuration; deleting a workspace alone is insufficient proof of recovery.",
      "items": [
        "Run a job once on a clean executor to detect undeclared workspace state.",
        "Record host/kernel, executor, Docker socket policy, secret scope, network routes and cleanup owner before admitting a runner to publication work."
      ]
    }
  ],
  "github-gitlab": [
    {
      "heading": "Map semantics rather than translate indentation",
      "body": "In GitLab, jobs, stages, needs, artifacts, rules and runner configuration jointly define pipeline behavior. In GitHub Actions, workflows, jobs, steps, needs, artifacts and runners serve analogous but not identical roles. A one-to-one rewrite of YAML keys cannot preserve all behavior automatically: default shell failure behavior, fork secret exposure, triggering rules, artifact retention and environment approvals may differ. GitLab CI/CD remains Steward's single authoritative delivery system; the comparison exists so a learner can reason about migration without installing a second production pipeline."
    },
    {
      "heading": "Worked semantic migration check",
      "body": "Legacy pipeline: checkout C, run tests, publish image D only on an approved branch. During translation, a GitHub workflow action named 'build' is moved to a GitLab job that runs for every merge request and inherits registry publish rights. Even if both YAML files parse and test jobs pass, the trust boundary has changed. Compare four observable behaviors: which revisions trigger jobs, which steps block publication when they fail, which credentials each job receives, and whether the exact artifact D is carried forward. Reject migration until both positive and intentionally failing branches produce equivalent authorization and artifact outcomes.",
      "items": [
        "Independent practice: take a failing unit-test run, a forked contribution and a protected main-branch release. Predict which jobs should run and which must not have registry credentials.",
        "Do not claim YAML parity implies operational equivalence."
      ]
    }
  ],
  "self-hosted": [
    {
      "heading": "Runner installation is an operational decision",
      "body": "A self-hosted runner needs a trusted host or VM, a deliberately chosen executor, a service identity, network reachability to the CI server and permitted registries, declared build toolchains, enough disk for caches/images and a cleanup/replacement procedure. Running CI on the same VM as production databases increases blast radius. A runner that can mount the Docker socket or run arbitrary privileged containers may have host-root-equivalent power; treat it as an administrative trust boundary. Distinguish registering a runner (enrolling execution capacity) from approving arbitrary jobs to use it."
    },
    {
      "heading": "Recover from a leaked build credential",
      "body": "Assume a malicious branch wrote the Nexus token into a job artifact. Redacting future logs is not sufficient: the existing token may already be exposed. Stop affected publication access, revoke and rotate the token, purge or restrict exposed artifacts according to retention policy, review registry activity and isolate or rebuild the runner if compromise is plausible. Then split validation and publish execution by job privileges, protected refs and dedicated runners. An independent transfer assessment should identify which evidence would prove that an ordinary pull request cannot publish to Nexus."
    }
  ],
  "secrets": [
    {
      "heading": "Secrets are a runtime capability, not a harmless string",
      "body": "A secret injected into a CI job lets that process exercise the permission represented by the credential. Masking in GitLab job logs limits ordinary accidental display; it is not a sandbox, encryption scheme or guarantee against exfiltration by hostile commands. Variable precedence and protected environment/ref settings determine exposure. Separate public configuration (base URL, job flags), sensitive build input (private dependency token) and high-impact deployment credentials (production publication/administration). The normal validation job should need none of the latter."
    },
    {
      "heading": "Worked trust failure and safer design",
      "body": "A merge-request script runs 'env' to debug missing variables, then uploads the output as a troubleshooting artifact. Even if the UI masks some values, the artifact may contain secret values or derived tokens. Stop the upload, revoke potentially exposed credentials, retain only safe variable names and non-secret state in diagnostics, and scope sensitive variables to protected publish jobs. Prefer short-lived job identity federation when available rather than a permanent broad token. Audit the job for indirect disclosure through traces, error reports and cached files as well as console output.",
      "items": [
        "Negative test: run an untrusted-branch pipeline in a disposable project and verify the publication credential is absent by checking its presence/absence only, never printing its value.",
        "Independent question: why is a masked secret exposed to an untrusted script still a security failure?"
      ]
    }
  ],
  "parallelism": [
    {
      "heading": "A faster graph needs dependencies and capacity",
      "body": "Parallel execution is worthwhile when jobs do not consume each other's outputs or compete over shared mutable state. Model elapsed time as queue time plus execution time on each critical dependency path, not the sum of durations of all independent jobs. Example: lint 2 minutes, type-check 3, tests 7 run in parallel on three idle runners; before an image build of 5 minutes, the gate waits for the 7-minute test, so the critical path is approximately 12 minutes plus checkout/queue overhead. On one small runner that serializes all three, total time may be 17+ minutes and a CPU-heavy concurrent execution could be slower still. Values are illustrative; measure actual results before tuning."
    },
    {
      "heading": "Counterexample: unsafe parallelization",
      "body": "Two integration jobs use the same database schema and delete each other's fixtures. Both can be correct in isolation but flaky when run simultaneously. Fix independent databases/schema names or serialize access; don't re-run failed tests until green and call that proof. Independent practice: draw a DAG with two parallel unit-test shards, one sequential database migration check and one image build. Specify which checks must finish before publish and what output a failing shard blocks."
    }
  ],
  "automated-checks": [
    {
      "heading": "A check is only useful with an oracle",
      "body": "A check asks a testable question and supplies an oracle: an expected result against which the observation is judged. Lint checks syntax/style constraints, static typing checks compatible type use, unit tests assess local behavior, integration tests assess real dependency interactions, and build checks packaging. None alone verifies that a running Steward instance rejects unauthorized ownership changes. State the risk and failure message before deciding whether the check blocks the merge. Avoid inflated check counts when every job exercises the same superficial happy path."
    },
    {
      "heading": "Worked false-green pipeline",
      "body": "Suppose unit tests pass and the build produces an image, but the intended cross-team authorization regression was not included in test discovery. CI will report green even though the critical risk was never checked. Add a named regression that sends the forbidden request, assert 403 and absence of outbox publication, and verify the CI job actually collects it. Force the assertion to fail deliberately on a disposable branch: if the pipeline still publishes, either the test wasn't selected, a nonzero result was swallowed or the publish gate is incomplete. Those are distinct defects requiring evidence."
    }
  ],
  "test-stages": [
    {
      "heading": "Order tests by cost and the property they defend",
      "body": "A unit test controls inputs to one function; a component test exercises a service boundary with chosen substitutes; an integration test exercises actual dependencies such as PostgreSQL or RabbitMQ; an end-to-end test follows a real user or API path through the deployed topology. Tests are not interchangeable merely because they all produce green checkmarks. Faster isolated checks usually run early, while expensive network/database tests need service startup and controlled data. The trust model may require a high-risk integration check to gate the image even if it is slow."
    },
    {
      "heading": "Worked failed-stage diagnosis",
      "body": "The Steward unit test suite passes but the PostgreSQL-backed outbox integration test fails because a transaction commits the domain row without storing publication intent. This is not a reason to demote the integration test to optional: it catches a correctness property that the isolated unit test could not observe. Capture test stdout, relevant service logs and transaction state as CI artifacts, but do not capture credentials or full production data. Repair the write transaction and rerun the exact failing test and whole dependent gate before allowing publication.",
      "items": [
        "For each test stage, record input/setup, observed output, fail signal and the downstream job blocked.",
        "Independent transfer: identify which stage can detect a Docker image starts but lacks the database driver, and which must demonstrate an unauthorized request returns 403 in a deployed environment."
      ]
    }
  ]
};
