// PED-005 Delivery Engineer: authored teaching additions to the original
// Software Delivery Foundations readings. Assignment wrappers do not substitute
// for these source-level mechanisms, cases, contrasts, and failure exercises.
export type FoundationSection = { heading: string; body: string; items?: string[]; code?: string; language?: string; caption?: string; output?: string };
export const foundationDeepeningById: Record<string, FoundationSection[]> = {
  "git-workflows": [
    {
      "heading": "Define the Git objects before choosing a workflow",
      "body": "A repository stores content and commit objects; a commit names a snapshot plus parent relationship(s). A branch is a movable name pointing to a commit, and HEAD identifies the revision currently checked out. A feature branch does not create an isolated copy of the whole repository: it advances another reference through the same history graph. Merging integrates histories; a fast-forward only advances a reference when the target already precedes the source. A merge commit records two parent histories. Rebasing rewrites commits with new parentage and new hashes, so avoid rebasing already shared history without an agreed policy. These mechanics explain why small, short-lived branches are easier to review: fewer independent changes accumulate between a proposed revision and the integration base."
    },
    {
      "heading": "Worked integration: a passing unit test is not the merge gate",
      "body": "Assume main points to C10 and the proposed authorization fix points to C11. Unit tests pass for C11, but an integration test run on C11 returns HTTP 200 for a Team B user attempting to change a Team A service. The expected outcome is HTTP 403. Merge must be blocked even though the CI stage compiling the application succeeded. After correcting the policy, commit C12 is a new candidate: re-run checks on C12, then merge C12 after review. A green check attached to C11 does not transfer to C12; the human review and required checks must reference the exact head SHA. If main advanced independently to C13, bring the branch up to date and review the new combined result before integration.",
      "items": [
        "Evidence to approve: proposed head SHA, review of authorization boundary, reproducible 200→403 correction, passing required tests on final head.",
        "Evidence to block: wrong status/authorization decision, missing reviewer for risk, failing required job or stale checks on a different revision.",
        "Trade-off: trunk-based short branches reduce divergence; longer release branches may isolate supported versions but add backport and reconciliation costs."
      ]
    },
    {
      "heading": "Transfer question",
      "body": "Without changing real project history, draw a graph with main at M2 and two branches at A3 and B3, both descended from M2. Can main fast-forward to A3? Can it subsequently fast-forward to B3 without a new integration commit or rebase? Defend the answer in terms of ancestry, not branch names."
    }
  ],
  "reviews": [
    {
      "heading": "A review is an evidence-based decision",
      "body": "A pull request (PR) proposes a specific change from a head revision into a target branch. Its diff shows what changed, not whether the change is correct. A reviewer reconstructs intent from the description, tests the public contract and considers what else the change can affect. Before requesting review, identify who is affected, why the change exists, how it was tested, what must stay compatible and how to detect a regression after release. Treat changing secrets, schema migrations and permissions as high-impact even when the diff has only a few lines."
    },
    {
      "heading": "Worked PR: reject a small migration with a large blast radius",
      "body": "Proposed change: a new NOT NULL column is added to the Steward service table and the API begins requiring it immediately. The author reports that the feature unit test passes. The reviewer notices that the older application version still writes rows without that column during a rolling release. In a mixed-version deployment, those writes will fail. The reviewer requests an expand/backfill/contract plan and a migration rehearsal against representative data before merge. A sensible incremental PR first adds a nullable compatible column, then adds dual-read/write logic and a backfill, and only removes old behavior after every supported consumer has moved. This is not a universal migration recipe: actual constraints and lock behavior must be tested later in the dedicated schema module."
    },
    {
      "heading": "Apply a minimal merge rubric",
      "body": "Ask four questions in order: Does the diff implement its stated user behavior? Are negative permissions and failure modes tested? Does the candidate preserve compatibility with deployed consumers and existing data? Can someone trace the approved SHA and rollback/stop condition? Record an explicit APPROVE, REQUEST CHANGES or BLOCK decision with the missing evidence, rather than accepting a generic 'LGTM'.",
      "items": [
        "Contrast: code review examines correctness and maintainability; CI independently runs automated checks; approval is a risk decision.",
        "Failure case: a CI job can be green because the required integration test was never selected. Inspect the actual job graph and test output, not just the badge.",
        "Independent check: review a hypothetical five-line env-var default change that silently directs UAT traffic to production; state the blocking evidence."
      ]
    }
  ],
  "steward-common-boundary": [
    {
      "heading": "Separate transport utility from Steward domain meaning",
      "body": "A release checker outside the Django process needs to send HTTP requests, parse status codes and compare the reported release identity to the expected digest. It must not implement Team ownership rules itself: the API remains authoritative for permission decisions, and the checker verifies a representative allowed/forbidden request against that API. A 'shared library' is not a source folder copied between projects. It is a stable, versioned boundary with consumers that can use it independently of the app implementation."
    },
    {
      "heading": "Concrete adopt-or-defer decision",
      "body": "Suppose steward-release-check uses a 15-line Python HTTP request wrapper. There is no second independent client using the same behavior. Extracting steward-common now would introduce package versioning, publishing and upgrade effort with no proven reuse. Decision: DEFER. Six months later, a separately valuable incident client independently needs the same stable base-URL configuration and public error decoding, but not the same domain-specific release assertions. Compare the two implementations; if the duplication is stable and product-independent, extract only the shared HTTP/error boundary, leave policy checks in each consumer and run both suites. Do not invent incident-client work merely to make the extraction threshold pass."
    },
    {
      "heading": "Failure and independent transfer",
      "body": "A bad extraction imports Django models or hard-codes Steward service states, forcing independent clients to depend on server internals. Reject it even if two callers import the package. Explain which files/functions remain in steward-release-check, which could enter a future steward-common and what evidence would justify publishing version 1.0 of that package."
    }
  ],
  "semver": [
    {
      "heading": "Define the public contract that versions protect",
      "body": "Semantic Versioning (SemVer) applies to a declared public API, not to the perceived size of a code change. For a version MAJOR.MINOR.PATCH after a stable 1.0.0 contract, PATCH is a backward-compatible bug fix, MINOR adds backward-compatible functionality, and MAJOR signals an incompatible public-contract change. The public contract may include HTTP paths, field meanings, authentication behavior and supported package symbols, but you must say which promises are actually public. Internal refactoring with identical observable behavior is not automatically a MAJOR release, and a one-line removal of an API field can require one. Versions before 1.0.0 signal unstable development in the SemVer specification; do not assume the same compatibility commitments as 1.x."
    },
    {
      "heading": "Work through one consumer before choosing numbers",
      "body": "Suppose the Steward GET /services contract at 1.4.2 promises id, owner_team and status. Fixing a typo in a server-side log without changing the response can be 1.4.3. Adding a new optional response field that existing clients can ignore, under an explicitly extensible schema, may be 1.5.0. Renaming owner_team to team_id with no compatible alias breaks existing clients and calls for 2.0.0. Even an apparently additive field can break strict clients if their documented contract rejects unknown fields; check the actual consumer contract instead of blindly classifying by syntax. A release number is communication, not runtime verification."
    },
    {
      "heading": "Classification challenge",
      "body": "Classify three changes against the stated contract: (a) fixing a negative authorization error that improperly returned success, (b) adding an optional search parameter with old behavior unchanged, and (c) replacing the pagination cursor format used by clients. For each, write a compatibility argument and one consumer test; if (a) changes a behavior that a consumer incorrectly relied on, explain why security correction and compatibility risk may require special communication rather than pretending every patch is harmless."
    }
  ],
  "commits": [
    {
      "heading": "Parse the notation rather than memorizing examples",
      "body": "A Conventional Commit has a header of the form type(optional-scope): description. The type describes intent (commonly feat, fix, docs, refactor, test), the optional scope names the affected area and the description states what changed. A trailing ! or a BREAKING CHANGE footer signals incompatibility. The convention is machine-readable metadata for release tooling; the actual public contract still decides compatibility. Do not equate every refactor with a patch or every feat with a safe minor version automatically."
    },
    {
      "heading": "Worked messages with release signals",
      "body": "Consider 'fix(authz): reject cross-team mutations'. It has type fix, scope authz and a human-readable behavior. 'feat(services): expose optional criticality field' is a candidate minor change when the response contract permits optional additions. 'feat(api)!: replace owner_team with team_id' explicitly signals a breaking change; add a body/footer explaining how consumers migrate, rather than hiding it behind the exclamation mark. If one commit simultaneously changes the API field, upgrades Docker base images and reworks logging, first split it into coherent changes where feasible. Formatting a mixed change does not reduce its blast radius."
    },
    {
      "heading": "Reverts and independent check",
      "body": "A revert message describes reversal of a specific prior change and should preserve traceability to the original hash; do not rewrite published history to conceal an incident. Draft a commit header and breaking-change explanation for removing an old API endpoint. Then identify the tests and consumer evidence that could disprove the proposed release category even though the message syntax is valid."
    }
  ],
  "release-notes": [
    {
      "heading": "Release notes answer a different question from Git history",
      "body": "The changelog records a curated sequence of released changes over time; release notes explain the impact and actions for one release. The reader is an operator or API consumer, not just the developer. An implementation log such as 'refactored serializer and bumped dependency' omits what the person running the service must change. A useful release note says what behavior changes, which consumers are affected, whether a configuration or migration step is mandatory, how success will be verified and whether immediate rollback remains safe."
    },
    {
      "heading": "Before and after: an actionable Steward release excerpt",
      "body": "Weak: 'Fixed services, changed database fields, cleaned CI'. Improved, fictional release: 'Steward 1.5.0 adds optional service criticality to GET /services. Existing clients can omit the new field. Operators: deploy the backward-compatible nullable-column expansion before enabling new writers; retain the previous app during backfill. Verification: GET /services returns 200 for an authorized owner, 403 for another team, and records no duplicate events on retry. Stop promotion if old-version write requests fail or the new field breaks strict consumers. Rollback before contraction: deploy the prior application artifact by approved digest; do not reverse a migration without a proven data-safe procedure.' This is an instructional scenario, not a real release announcement."
    },
    {
      "heading": "Diagnose an incomplete note",
      "body": "If a release note says 'database migration required' without when it runs, whether it is backward compatible or which failure blocks promotion, the operator cannot make a safe decision. Write a one-paragraph note for a breaking endpoint rename with a deprecation window, client migration instruction, monitoring check and decision owner. Identify at least one detail from the commit log that belongs only in engineering history."
    }
  ],
  "artifacts": [
    {
      "heading": "Distinguish a tag, artifact, checksum and provenance",
      "body": "An artifact is a distributable output such as a wheel, package archive or OCI image. A tag or version is a human-facing label; a cryptographic digest identifies exact bytes or, for OCI, a specific manifest and its referenced content. The source commit identifies code, but a build may also depend on base images, locked dependencies, compiler versions and non-hermetic inputs. Provenance attestation can link the output digest to a builder and declared inputs; an SBOM lists ingredients. None of these alone proves that the running service is healthy or that secrets were handled correctly."
    },
    {
      "heading": "Trace an immutable build-once promotion",
      "body": "CI for Steward commit C builds image D, tests it, records a registry digest, and publishes it to the approved registry. A release record connects C, the CI run, D, version 1.5.0 and required approvals. The staging deployment pulls D by digest, not mutable tag; the production-like deployment uses the same digest with different runtime secrets/URLs. If an operator accidentally rebuilds from C and gets digest E, E is a new candidate requiring verification, not 'the same release' because its tag or source commit matches. The disposable SHA-256 lab in the opening lifecycle lesson establishes the byte-identity principle; a real Docker registry digest must be observed later in Containers and Docker."
    },
    {
      "heading": "Failure and transfer",
      "body": "Predict the result when a Dockerfile uses an unpinned base tag and a package installer resolves newer transitive dependencies on its second build. Both outputs may truthfully claim source commit C, but the image digests can differ. Specify which inputs to lock, which provenance evidence to retain, which secret must not become an image layer and which runtime check still needs to run after digest verification."
    }
  ],
  "promotion": [
    {
      "heading": "Promotion gates protect decisions, not button clicks",
      "body": "Continuous integration tests an identified candidate; a promotion gate decides whether that candidate may cross a risk boundary into another environment. The gate must name who or what approves it, what evidence is required, and what failure halts movement. A successful copying or container-start command is a mechanical event, not user-level acceptance. The same digest may be promoted unchanged while secrets, endpoints, scale and risk approvals are environment-specific. Environment parity is about representative behavior and controlled differences, not copying production secrets into staging."
    },
    {
      "heading": "Worked failure decision after an apparently successful rollout",
      "body": "Staging verifies digest D with an authorized owner update returning 200 and a cross-team update returning 403. The approval records D, the migration status and a previously verified digest P. Deployment to the next environment reports that it started D, but the cross-team request unexpectedly returns 200. The stop condition has fired: hold promotion, record the endpoint, actor identity, timestamp, actual running digest and authorization trace, contain the unsafe change and follow the documented rollback/forward-fix decision. Merely restoring P is insufficient without rerunning the same forbidden and allowed requests, checking schema compatibility and verifying the running digest. A rollback is an observable recovery, not an invocation of a tool."
    },
    {
      "heading": "Independent transfer exercise",
      "body": "Design a three-column gate table for candidate → staging → production-like deployment: decision owner, evidence needed, explicit BLOCK outcome. Include a concrete failure in which the image is correct but database migration state is incompatible, and defend whether a rollback is safe without first examining dual-write and schema-contraction state."
    }
  ]
};
