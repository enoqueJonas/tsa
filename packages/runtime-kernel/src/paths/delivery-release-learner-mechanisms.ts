/** Original Release Engineering author-source deepening. Teaching fixtures are NOT deployed release evidence. */
export const releaseLearnerMechanisms:Record<string,{sections:{heading:string;paragraphs:string[]}[];resource:{title:string;url:string}}> = {
  "release-candidates": {
    "sections": [
      {
        "heading": "A candidate is a nominated set of immutable bytes and execution assumptions",
        "paragraphs": [
          "A release candidate is a particular, retrievable build proposed for verification and eventual promotion. A semantic version communicates an intended compatibility contract, a Git tag names a source revision if tag immutability is enforced, and a CI job ID identifies a build invocation. None of those alone establishes the exact package bytes. For OCI images, the registry manifest digest can identify the actual manifest that is pulled; a local Docker image ID is a separate local object identifier. Capture all identities with their owners rather than writing `steward:latest` in a release record.",
          "Treat source revision C, build invocation B, package checksum P, OCI manifest digest D, target platform, migration prerequisites and configuration contract as distinct fields. The candidate may consist of several artifacts such as API image, worker image, database migration set and internally published Java library; every actual component needs its own observed identity. Do not list `steward-common` as released unless a real consumer-backed extraction and published artifact were established in earlier modules."
        ]
      },
      {
        "heading": "Why a digest alone does not prove a trustworthy build",
        "paragraphs": [
          "A SHA-256 hash binds bytes once those bytes are obtained, but it does not tell who built them, which source commit they used or whether they had an authorized build environment. Supply-chain provenance can describe source, builder and input dependencies; meaningful verification needs a trustworthy attestation source and subject digest match, not a self-typed JSON field. A `sha256:` prefix plus arbitrary text is not a valid digest, and a correctly formatted digest alone still is not an attestation.",
          "In the local manifest exercise, generate two different payload files, compute their SHA-256 checksums and record one approved subject digest in a disposable candidate ledger. Change the contents behind a mutable label. The gate must reject the changed bytes even if the human version and label remain equal. This proves hashing and comparison in a fixture, not a Nexus registry push, SLSA conformance or trusted builder."
        ]
      },
      {
        "heading": "Release identity must survive another engineer's reproduction",
        "paragraphs": [
          "Give a reviewer a source revision, build logs, dependency lock, complete artifact/digest list and the exact commands used to verify the bytes; do not give only a screenshot of a green pipeline. A reproducible source build is a related but separate property: two runs may produce different bytes because timestamps or dependency inputs differ. For promotion, test and deploy the already built candidate rather than silently creating a replacement during approval.",
          "A new-domain reviewer asks: an API image and a lifecycle worker share version 1.4.0, but only the API was rebuilt with a patched dependency. Which release record fields must change, and why does the existing approval not automatically cover the new combined candidate? Propose a multi-artifact identity check and declare any missing actual registry evidence NOT_TESTED."
        ]
      }
    ],
    "resource": {
      "title": "SLSA provenance v1.2 — distinguish digest from trustworthy build evidence",
      "url": "https://slsa.dev/spec/v1.2/provenance"
    }
  },
  "promotion-and-gates": {
    "sections": [
      {
        "heading": "Draw a promotion state machine with guards rather than a slide",
        "paragraphs": [
          "Promotion changes a candidate's authorized release status or destination without changing the previously tested artifact. Built, verified, UAT accepted, approved, deployed and runtime-verified are different states; some require automated evidence, some require genuinely authorized human decisions, and some require observations made only after deployment. A transition is valid only when its required evidence is present, still applies to the same digest/target and has not been revoked or superseded.",
          "In an example, ownership authorization tests PASS on digest D and an operator approves deployment of D to staging. The registry tag is subsequently reassigned to digest E. No transition that depends on the earlier approval may proceed using E, even if it is called the same version. A UI badge showing approved status is insufficient if the specific bytes and deployment environment were not bound to that decision."
        ]
      },
      {
        "heading": "Missing, rejected and waived are not interchangeable",
        "paragraphs": [
          "A failing security test is a FAIL observation. A test that did not run is NOT_TESTED; a requested human approval with no real approver is NOT_AUTHORIZED. None should become PASS because another stage is green. A time-limited risk exception, when policy permits, is a separate authorized decision describing what failure remains unresolved and how it is contained. It does not rewrite the underlying test result or grant blanket permission for unrelated environments.",
          "Current GitLab protected-environment deployment approvals are tier-dependent (Premium/Ultimate) and also require actual configuration and authorized approvers. Do not claim automatic GitLab enforcement when using a self-managed Free homelab. If the feature is unavailable, a manually recorded approval tied to exact digest, target and risk evidence may be appropriate, but it must still be shown as an out-of-band control rather than a verified GitLab approval."
        ]
      },
      {
        "heading": "Prove fail-closed promotion with the actual transition predicate",
        "paragraphs": [
          "The published gate example includes a candidate with exact digest, a required verification state, an approval for a specific environment, and a deployed digest. It rejects both a failed test and swapped tag even when the approver remains authorized. Run the correct and deliberately wrong transition implementations, and inspect the state of the candidate after rejection; failed gate means no unauthorized deployment event was recorded.",
          "Independent transfer: the reviewer introduces a third environment and an approval that expires before execution. Explain why checking only 'approved once' is insufficient, then specify the smallest new guard and counterexample required. If the real GitLab instance has no protected deployment rule, label the configured policy NOT_TESTED instead of claiming enforcement."
        ]
      }
    ],
    "resource": {
      "title": "GitLab protected-environment deployment approvals and tier constraints",
      "url": "https://docs.gitlab.com/ci/environments/deployment_approvals/"
    }
  },
  "deployment-evidence": {
    "sections": [
      {
        "heading": "Pipeline, runtime and client observations prove different claims",
        "paragraphs": [
          "A deployment job exit code shows its scripted commands completed; a running container means a process was started; a health endpoint shows some readiness function responded. None alone proves an approved artifact reached all runtime roles or that users can complete a meaningful transaction. For a system with API, outbox publisher and lifecycle consumer, a release is mixed if only one of the three runs the approved image or if a worker has an incompatible event contract.",
          "Inspect the approved subject digest separately from runtime identities and note what the inspection really returns. `docker inspect .Image` is a local image identifier, and `RepoDigests` may be absent or list more than one repository identity. For strong registry provenance evidence, compare an actual verified manifest digest from the registry and deployment system with the intended one. A locally simulated manifest hash is a different evidence class."
        ]
      },
      {
        "heading": "Trace one user-visible and one failure-visible operation",
        "paragraphs": [
          "A representative verified operation should include caller identity, input, expected domain effect, observed persisted outcome and relevant worker/queue effect, scoped to an authorized disposable environment. A 200 on `/health` cannot establish that an ownership update was accepted correctly, and a 403 alone cannot prove a forbidden write did not happen before the response. Preserve the positive and negative observation with time, target and exact release identity.",
          "An application may be healthy while a consumer processes events from a previous version. The published ledger example checks that all three role identities match the approved candidate, that migrations were observed and that the authenticated client behavior and forbidden-side-effect oracle both succeeded. If any role lacks evidence, it returns NOT_VERIFIED instead of silently filling in the missing result."
        ]
      },
      {
        "heading": "Write an evidence record that can be audited after the operator leaves",
        "paragraphs": [
          "Store candidate source SHA, CI build reference, registry subject digest, target, approved scope, deployment run, intended/runtime identity for each role, migration result, behavioral smoke command, observed output and negative-case evidence. Mark actual values observed from authorized infrastructure distinctly from generated training fixtures. Exclude tokens and private user records from screenshots, terminal logs and release notes.",
          "A reviewer sees a green deployment log and a running API but no worker identity; they must withhold the claim of a complete release. Require the reviewer to propose exactly what to inspect, which failure path would invalidate readiness, and what decision remains unverified. Real release evidence is NOT ESTABLISHED by the classroom program."
        ]
      }
    ],
    "resource": {
      "title": "SLSA: distribute provenance against artifact identities",
      "url": "https://slsa.dev/spec/v1.2/distributing-provenance"
    }
  },
  "release-observability": {
    "sections": [
      {
        "heading": "A release marker is not a service-level indicator",
        "paragraphs": [
          "Release observability starts with an event: what release identity changed, at what time and in which target. The operator then compares observed behavior before and after that event using a relevant client journey, dependency result and failure signal. This is a narrower obligation than operating a complete future SRE tracing/metrics stack. A dashboard without a traceable change marker can falsely attribute a long-standing fault to the last deployment.",
          "A process health check is cheap and useful, but a customer outcome may fail while every process remains healthy. Choose at least one behavior metric directly related to the changed capability, such as correct custody updates and denied cross-owner writes. State the observation window and how the baseline population compares to the post-release sample."
        ]
      },
      {
        "heading": "Avoid misleading release-before/after comparisons",
        "paragraphs": [
          "If the number of requests or composition of users changes sharply, raw error counts can rise even when the error rate improves. Conversely, a tiny sample may show zero failures despite a harmful regression. Calculate rates with denominators and keep integrity violations separate from ordinary HTTP errors. Never average two unrelated endpoints into a single signal that conceals an unauthorized data change.",
          "In the published Python example, before and after windows include comparable total request counts, failed operations and domain-integrity violations. The rule rejects a critical violation even if the new error rate is lower, and withholds a 'safe' verdict from insufficient observations. The floor and tolerances are illustrative teaching values, not a statistically calibrated SLO or an actual real-user experiment."
        ]
      },
      {
        "heading": "Choose stop, investigate or continue from observed evidence",
        "paragraphs": [
          "A release decision may be STOP for a confirmed invariant violation, INVESTIGATE for insufficient or noncomparable data, and ELIGIBLE_FOR_REVIEW when bounded signals look acceptable. An ELIGIBLE result is not approval to deploy without the required owner and risk gates. When dashboards are unavailable, a timestamped command, raw logs and a small table can be enough to justify a lab-level investigation without pretending production monitoring exists.",
          "An unseen condition changes the traffic mix toward a costly asynchronous path while request latency improves. Explain why before/after latency alone is not a sufficient release decision; propose a matching control group or a behavior-specific probe and make the first safe diagnostic read-only."
        ]
      }
    ],
    "resource": {
      "title": "Google SRE: release engineering",
      "url": "https://sre.google/sre-book/release-engineering/"
    }
  },
  "release-failure-handling": {
    "sections": [
      {
        "heading": "Classify a failure by the first unsafe boundary reached",
        "paragraphs": [
          "An unsuccessful release may fail before artifact selection, during target preparation, during migration, while starting processes, during application verification or after users already performed operations. Those stages change the safe response: before persistent state changes, stopping the pipeline is often enough; after a committed schema change or external notification, reverting executable code cannot undo history.",
          "Record the first observed failure, current deployment/worker digests, whether writes were committed, whether schema remains compatible and which external effects were acknowledged. For an ambiguous timeout after a commit, a blind retry can duplicate work. Read existing transaction or idempotency state before deciding to retry; unknown commit state is not permission to overwrite."
        ]
      },
      {
        "heading": "A safe recovery plan has more than a green prior tag",
        "paragraphs": [
          "Known-good code A is a candidate for reversion only if its bytes are retrievable and the current persistent database, events and configuration remain compatible with A. All affected roles must be addressed. A successful rollback command with unverified API behavior and unverified lifecycle consumption is an incomplete recovery, not a success.",
          "The failure decision program distinguishes PRE_MUTATION_STOP, SAFE_APP_REVERT_CANDIDATE, CONTAIN_AND_FORWARD_REPAIR, and NOT_PROVEN. It rejects a mutant that chooses application rollback merely because the prior image digest is known. It cannot establish measured RPO/RTO or a real disaster-recovery plan from synthetic booleans."
        ]
      },
      {
        "heading": "Escalate with time, ownership and auditable stop evidence",
        "paragraphs": [
          "A clear release halt identifies the accountable operator, affected users/data, candidate digest, exact failed control, mitigation, next safe diagnostic, owner and time of reassessment. Do not turn a failed integrity test into a 'known issue' that can automatically be deferred. Where policy prohibits an exception, the technical recommendation must remain no release.",
          "Give the reviewer a scenario where a migration completed, one worker published a new-version event and the API responds 200. Ask whether rollback is safe. The answer should identify specific missing event/schema evidence and a containment or forward-repair path, not a claim that changing a container tag restores the previous state."
        ]
      }
    ],
    "resource": {
      "title": "Google SRE: release engineering and safe change",
      "url": "https://sre.google/sre-book/release-engineering/"
    }
  },
  "release-runbooks": {
    "sections": [
      {
        "heading": "A runbook has a state-dependent branch at each dangerous command",
        "paragraphs": [
          "A runbook is useful when another authorized engineer can decide which action is appropriate without inventing missing context. The preflight includes target, authorization, exact approved digest, CI evidence, dependency and schema compatibility, last-known-good identity, any blocked gates and the required observability/probe commands. Each consequential step describes expected state before execution, command, independent verification and STOP/ESCALATE if it diverges.",
          "A pasted `docker compose up -d` is not a full release procedure: it could operate against the wrong host, wrong project or latest tag, and it does not prove the running image, migrations or client behavior. In a learning homelab, use dry-run/config validation and a permissioned, disposable environment before issuing any state-changing commands."
        ]
      },
      {
        "heading": "Runbooks need a real abort branch and a different operator",
        "paragraphs": [
          "A simple runbook path is PRECHECK → AUTHORIZE → DEPLOY → VERIFY → RECORD. A failed precheck must terminate before any mutation. A failed post-deploy check must STOP, preserve evidence and choose rollback/forward repair based on current data compatibility, not use a hidden `|| true` that erases exit status. For example, a missing approval for production cannot be bypassed by retargeting the same image to a different environment.",
          "The published source program models each preflight decision and checks that no deployment side effect occurs when the candidate is unapproved, the digest mismatches or an old schema is incompatible. It deliberately demonstrates a fail-open runner that records a deployment even when authorization fails. These are synthetic record transitions, not commands that control real infrastructure."
        ]
      },
      {
        "heading": "Maintain, rehearse and own the recovery document",
        "paragraphs": [
          "Version the runbook with the delivery configuration and identify its owner, last rehearsal, environment, expected role privileges, incident/escalation contact and state-restoration limits. An independent engineer should run the procedure or a scoped dry-run on a genuinely clean authorized target, note assumptions and revise ambiguous steps. A self-generated simulation cannot be labeled independent operator validation.",
          "Under a new constraint—release A cannot be retrieved from the registry—explain which step must halt before deploying B, which artifact retention assumption has failed and what alternative evidence or recovery path is acceptable. The quality of the answer is measured by safe decision and reproducibility, not by the number of checklist items checked."
        ]
      }
    ],
    "resource": {
      "title": "Google SRE: incident response and operational process",
      "url": "https://sre.google/sre-book/managing-incidents/"
    }
  }
};
