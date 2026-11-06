// PED-005 Delivery Engineer: concept-specific mechanisms inserted into the five original
// CI lessons that remained under-explained after the earlier source pass.
// Source-level instruction, not a claim of a real GitLab/Steward deployment.
export interface CILearnerSection {heading:string;body:string;items?:string[];code?:{language:string;code:string;output?:string}}
export const ciLearnerMechanisms: Record<string,CILearnerSection[]> = {
  "jobs-stages": [
    {
      "heading": "A job graph is a contract for eligibility, not only ordering",
      "body": "A stage is a coarse group of jobs; by default a later GitLab stage waits for jobs in prior stages to succeed. A `needs` edge is different: it allows an eligible job to start as soon as the explicitly named prerequisites succeed, without waiting for unrelated jobs in its stage. If a safety-critical `unit_test` runs in a verify stage but is omitted from an image job's `needs`, a failed unit test may no longer gate the image job. That is why the graph must be derived from required checks rather than copied from a stage diagram. Use an explicit mandatory-dependency matrix, then deliberately fail a prerequisite to prove both the status and absence of an image candidate."
    },
    {
      "heading": "Separate dependency, artifact availability, and authority",
      "body": "The `needs` keyword controls a job's prerequisites. An artifact declares files to retain or transfer; `needs:artifacts: true` controls retrieval from that named dependency. Neither setting grants authority to publish a candidate or a deployed release. A registry credential, protected branch and authorized approval must be controlled separately. GitLab can fail to create a pipeline if a required `needs` job is excluded by `rules`; `optional: true` only solves that scheduling case if absence truly is acceptable. Making a security gate optional to silence a YAML validation error is a dangerous functional change."
    },
    {
      "heading": "Read the result of a real dependency graph locally",
      "body": "The GitLab YAML example below uses short, bounded Python jobs to create a text manifest tied to a synthetic commit SHA. The manifest is deliberately NOT a Docker image or a registry upload; it illustrates why the consumer must receive the exact output of the producer. First predict what runs after a failed unit test, then execute the source-derived local graph check. Finally inspect which control a missing `needs` edge bypasses. Local simulation cannot prove that your actual GitLab instance, protected variables or Runner honor this policy; the learner must run a negative merge-request pipeline later."
    }
  ],
  "caching": [
    {
      "heading": "Cache keys represent dependency assumptions; a cache is never an authority",
      "body": "A cache is reusable storage intended to reduce repeated work, such as a Python wheel download directory or npm package tarball. A cache key should incorporate relevant dependency declarations or lockfile state and the trust scope of the runner; an arbitrary branch name may enable different dependency sets to overwrite the same cache. GitLab's `cache` may be restored on a later job or runner, but cache presence is opportunistic: an empty cache must not make the build invalid. An artifact is different: it is evidence or output of a specific job/pipeline, not an optimization hint."
    },
    {
      "heading": "Trace a cold-cache and poison-cache thought experiment",
      "body": "Suppose a Steward check passes on a reused runner with a preinstalled `myclient` wheel, yet the declared lockfile omits that package. The warm-run pass does not prove reproducibility: a clean runner will fail. Correct the declarations, pin versions and rerun from an empty cache. A second risk is poisoning: an untrusted branch can populate a shared key, and a privileged job could consume it if trust boundaries are not separated. Cache keys, protected scopes and independent verification must align; relying on a cached executable as a trusted artifact is invalid."
    },
    {
      "heading": "Make a cache claim testable",
      "body": "For a bounded local exercise, create and delete only a disposable dependency-cache directory. Run the same deterministic checksum calculation both times, record that the output remains identical and inspect the elapsed time separately. This does not prove a real GitLab cache backend, which depends on runner topology and key scoping. If the cold-cache run fails, the experiment has exposed undeclared build input. If the checksum changes with identical declared source and dependencies, investigate provenance before celebrating the speedup. The evidence deliverable is command, cache state, source digest, result and explicit limit."
    }
  ],
  "artifacts": [
    {
      "heading": "An artifact is the produced state of one execution",
      "body": "A job artifact is a file or report retained from a particular pipeline execution. It may be a JUnit report, test log, compiled package or a small manifest that another job downloads. It differs from a cache because consumers should rely on the particular producer job's output rather than an arbitrary older directory. It also differs from a published versioned release: job artifacts commonly expire and are scoped to pipeline retention rules. GitLab uses `artifacts:paths` to declare retained files and `needs` with artifact transfer to fetch a named producer's files."
    },
    {
      "heading": "Prove identity across workspaces",
      "body": "Suppose `image_build` produces candidate manifest `M` containing commit C and the next job claims to audit C. A valid handoff requires receiving the original M, verifying its contents or digest, and checking that it matches the checked-out source SHA. Rebuilding M from current branch state in the consumer discards the evidence that the exact earlier candidate was tested. The local GitLab YAML classroom model recreates each job in a separate temporary workspace and transfers only declared artifacts, then checks C against the manifest. If artifact retrieval is disabled, the candidate audit must not pass based on a stale file left on a shared runner."
    },
    {
      "heading": "Failure reports may need to survive a failing job",
      "body": "A test failure can remove exactly the diagnostic evidence needed for repair. Use `artifacts:when: always` for appropriate nonsecret logs and test reports; it means upload these artifacts even when the job failed, not 'ignore this job's failure'. Keep job status nonzero and avoid `allow_failure: true` for mandatory correctness or security gates. If an artifact contains a secret, exporting it because the job failed creates a second incident. The learner should distinguish report retention from permission to proceed and show a failed-check report that is available without the candidate-build step running."
    }
  ],
  "quality-gates": [
    {
      "heading": "A gate ties a named risk to a blocking observation",
      "body": "A quality gate is an enforcement decision: the candidate advances only if a stated property is supported by a trusted check. Examples include an object-ownership negative test that checks HTTP response AND unchanged durable state, a required compiler pass, or a signed manifest identity check. A pipeline with 100 green lint checks but a failed ownership test is not ready for promotion. Test count, code coverage and a configured threshold alone do not prove the risk was checked. Define an oracle, the environment in which it ran and what failure should prevent."
    },
    {
      "heading": "Different outcomes need different decisions",
      "body": "Distinguish PASS with observed evidence, FAIL with observed contract violation, BLOCKED because the prerequisite failed, and NOT_RUN because the test did not execute. A job marked `allow_failure: true` may report an error but allow downstream work, so it cannot be counted as a mandatory release gate. `when: always` on a publication job may likewise bypass intended stage-failure semantics. Test the configuration's effect by deliberately triggering the required negative case and proving not only that a dashboard becomes red, but also that no candidate was published."
    },
    {
      "heading": "Handle an exception without rewriting history",
      "body": "A responsible exception names an actual authorized decision maker, the exact observed failure, its impact, limited scope and expiry. It never changes a FAIL to PASS. If the failing gate protects cross-tenant confidentiality or durable accounting, release may be blocked under applicable policy rather than made optional. In the classroom graph, remove `unit_test` from the build's `needs` and observe the unwanted build under a failed unit test; that is the misuse this gate must catch. Repeat the reasoning for an untested security job excluded by `rules`."
    }
  ],
  "container-build": [
    {
      "heading": "Commit, tag, local image ID, manifest digest and deployment are different records",
      "body": "A checked-out commit SHA identifies source history, not the bytes of a container image. An image tag such as `steward:abc123` is a mutable local or registry name. A Docker image ID identifies image content in a particular context; a registry digest identifies an OCI manifest (or multi-platform index), potentially differing by selected architecture. An approved release must record commit C, builder/environment, resulting registry manifest digest D and expected target platform. Merely writing `docker build -t ...` does not establish a published immutable D or the running version."
    },
    {
      "heading": "A realistic fail-open image-building defect",
      "body": "Imagine `checks` runs on a merge-request branch while `image_build` is permitted by incomplete `needs` and the build host has registry credentials. Even if the image tag incorporates the commit, the build may occur despite a failed ownership test, and an unintended push could expose an artifact. Prevent that by requiring every mandatory check, using protected publication permissions and separating candidate build from release promotion. An actual Docker build needs Dockerfile, Docker daemon/build engine, base image provenance and network or cached dependencies; the Python manifest in the adjacent job-graph reading is NOT a substitute for those."
    },
    {
      "heading": "Prove the exact artifact, not the intended artifact",
      "body": "A defensible source-to-runtime trace includes the versioned Dockerfile, pinned dependencies, commit C, CI job and runner environment, immutable pushed manifest D and deployment observation that D is the running artifact. Cache reuse or local image inspection cannot prove a push happened. For the independent exercise, change one source input and predict which image layers invalidate; compare with an unchanged rebuild and distinguish reproducibility of output from reproducibility of the process. If the registry, credentials or runtime is unavailable, label those gates NOT_TESTED instead of inventing a successful digest."
    }
  ]
};
