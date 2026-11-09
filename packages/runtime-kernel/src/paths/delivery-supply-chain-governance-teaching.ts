// Follow-up remediation of final 8 original Supply Chain topics and the two original labs.
// Text is separated by mechanism, failure/evidence and independent transfer.
// Runnable programs live in delivery-supply-chain-trust-proofs.ts.
export type SupplyChainGovernanceSection={heading:string;paragraphs:string[];code?:{language:string;caption?:string;code:string}};
export const supplyChainGovernanceTeaching: Record<string,SupplyChainGovernanceSection[]> = {
  "proxy-cache-public": [
    {
      "heading": "Describe the proxy's actual authority and cache path",
      "paragraphs": [
        "A proxy repository is not the publisher of a public dependency. The upstream registry defines and supplies the artifact; Nexus may cache its response and expose that cached copy through a controlled client endpoint. An internal hosted repository is different: your organization is the publisher and authoritative source. A group may aggregate hosted and proxy paths for convenience, but one URL does not make upstream provenance or internal publishing privileges equivalent.",
        "Trace one request end to end: fresh consumer → Nexus group → specific proxy → upstream metadata and distribution → durable cache → response to consumer. Record the upstream identity, expected package name/version, repository routing, HTTP response, artifact checksum and observable cache state. A cache hit is not a verification of origin, signature, vulnerability safety or indefinite retention."
      ]
    },
    {
      "heading": "Run a real local HTTP caching failure exercise",
      "paragraphs": [
        "The Python source in this lesson starts two actual localhost HTTP servers, an upstream and a simple policy-restricted proxy. It first fetches a disposable public package from upstream, then disables the upstream and proves that a warmed cache can still return approved bytes without a second upstream request. An uncached package is rejected during the outage. The proxy also forbids public resolution of an internal-only namespace and rejects changed cached bytes against its recorded digest.",
        "Expected markers: PROXY_FIRST_REQUEST_FETCHED_UPSTREAM, PROXY_WARM_CACHE_SURVIVED_UPSTREAM_OUTAGE, PROXY_COLD_CACHE_OFFLINE_FAILED_CLOSED, PROXY_PRIVATE_NAMESPACE_NOT_PROXIED and PROXY_CHANGED_CACHED_BYTES_REJECTED. This is a small executable HTTP model with a synthetic allowlist, not Nexus itself, a PyPI protocol-complete proxy or a claim that all cached dependencies remain available when upstream is down."
      ]
    },
    {
      "heading": "Differentiate clean-client resolution, cached bytes and approved identity",
      "paragraphs": [
        "Cache availability and trust are orthogonal: the proxy may still have stale, unapproved or corrupt bytes when upstream is offline. For a genuine Nexus exercise, configure one intentionally public dependency through a controlled proxy, record its expected checksum, resolve once from a clean client, observe the proxy cache, disconnect only the authorized disposable upstream route and repeat the same-version install. Then remove the cached entry in an isolated test and verify an uncached request fails visibly without public fallback.",
        "An internal-only name unexpectedly resolved through a public proxy is a dependency-confusion incident even if the file's SHA-256 is mathematically valid. Stop promotion, document repository grouping/namespace ownership, correct the admission policy and re-run the negative test. Do not infer Nexus's actual cache behavior from the localhost training model."
      ]
    }
  ],
  "internal-versioning": [
    {
      "heading": "Define version compatibility from a consumer-facing contract",
      "paragraphs": [
        "A package version is an assertion about how existing consumers will behave with new artifact bytes. For a published 1.2.0 Python fixture with classify_service(name) returning one normalized category, fixing an internal error while keeping output/exception behavior may justify 1.2.1. Adding an optional argument without breaking existing callers can justify 1.3.0. Removing or renaming a required argument or changing serialized output is breaking and normally requires 2.0.0 under semantic-versioning conventions.",
        "These are not magic rules enforced by Nexus: compatibility depends on the documented contract, including exception types, protocol fields, interpreter support, authentication needs, schema expectations and side effects. A version bump is meaningful only alongside contract tests, consumer tests and immutable published bytes. A repository with two filenames called 1.2.0 but different hashes cannot provide a reproducible version contract."
      ]
    },
    {
      "heading": "Observe producer/consumer version decisions separately",
      "paragraphs": [
        "A producer may verify its own unit tests and still publish a breaking package: downstream consumers need contract checks using actual package-manager resolution. On an earned Steward shared package, run existing consumers against old and new candidate versions in separate clean environments. Use exact hashes and report which version constraints admit the candidate and which contracts fail. If the package has no justified independent consumers, use a disposable fixture and keep shared library extraction explicitly deferred.",
        "A compatible range such as >=1.2,<2 may reduce coordination when 1.x actually remains compatible, whereas an exact pin narrows unexpected runtime drift but creates explicit upgrade work. Neither is inherently secure: both need artifact-origin policy, lockfile or hash evidence and deliberate update review. Decide based on consumer independence and failure cost, not fashion."
      ]
    },
    {
      "heading": "Challenge a misleading major/minor/patch classification",
      "paragraphs": [
        "For an API whose return type is a JSON object, 'adding an optional field' might still break strict schema validation in one consumer. A new optional Python parameter might break positional-only or signature-introspection behavior. Require test cases for the old consumer before calling a change backward compatible. When data or schema migrations are involved, versioning may need release coordination beyond package SemVer alone.",
        "Write three proposed changes and the exact assertions that could falsify your proposed patch/minor/major label. Include at least one consumer that uses a stable old contract. The independent acceptance criterion is that the old consumer continues to execute, not merely that the new package imports without error."
      ]
    }
  ],
  "prerelease-release": [
    {
      "heading": "Separate build identity, maturity state and approved release",
      "paragraphs": [
        "A prerelease such as 2.0.0rc1 is a distinct version identity signifying test maturity, not permission to replace its bytes silently. The same candidate may be tested in development and UAT before release admission; promotion should normally move the approved immutable artifact or preserve its exact checksum/digest across environments rather than rebuild it under an identical label. A branch build, release candidate and stable release differ in evidence and retention needs.",
        "Python PEP 440, npm SemVer prerelease comparison and OCI tags have different selector semantics. Do not assume pip and npm choose prereleases the same way by default, or treat a Docker rc tag as cryptographically immutable. Write expected resolver behavior for each ecosystem and pin exact candidates during validation."
      ]
    },
    {
      "heading": "Show an evidence-gated promotion rather than renaming a file",
      "paragraphs": [
        "Model a candidate record containing source SHA, CI run, package filename or image repository digest, expected checksum, completed test evidence, approver and target environment. Require those fields before the candidate may be promoted. If the underlying package tarball or image manifest changes after evidence was gathered, reject the promotion and rerun verification on the new identity instead of reusing an obsolete approval.",
        "For a repository that cannot atomically move a candidate namespace to release, the policy may publish a separate final artifact; document that an exact byte-for-byte identity check is required. If a changed versioned filename reflects a new build, treat it as a new release subject and test it. Never imply a name change magically preserves integrity."
      ]
    },
    {
      "heading": "Test the two dangerous failure modes before policy approval",
      "paragraphs": [
        "Case A: a developer overwrites 2.0.0rc1 after QA approved its digest; the admission record must reject it because the identity changed. Case B: a UAT environment deploys the stable tag without recording the digest; a retag between build and deploy can silently change selected bytes. Compare approved content and retrieved content, not only version labels.",
        "Record a table of candidate, source run, package/image digest, environment, observed checksum and approval status. A green CI job whose digest was never captured is incomplete release evidence. The actual code exercises in the prior Python publication and OCI retag lessons provide the two specific negative controls."
      ]
    }
  ],
  "retention-cleanup": [
    {
      "heading": "Define retention as reference protection rather than an age-only delete",
      "paragraphs": [
        "Artifact retention is a release-recovery decision. An image deployed at a supported site, a package pinned in a supported previous release and an approved rollback image may be older than a cleanup threshold but remain required. Model garbage collection with an explicit live reference graph: deployed digests, approved rollback digests, supported manifests and necessary dependent blobs are roots; only genuinely unreachable artifacts become deletion candidates.",
        "A tag is a mutable reference and not sufficient protection on its own. For example, 'keep latest' can discard the immutable manifest actually deployed last month. A cleanup job should dry-run, list planned deletions with reasons, require the appropriate approval and verify all protected digests remain independently pullable after the operation."
      ]
    },
    {
      "heading": "Run a retention, SBOM, advisory and signature admission model",
      "paragraphs": [
        "The actual JavaScript source uses three explicitly fictional content digests: an old deployed image, an old rollback image and an old disposable CI build. It runs an age-based cleanup filter guarded by protected digests and proves that only the disposable build is eligible. The same small model also records source/build links, a CycloneDX-shaped inventory for the selected digest, a fictional high-severity advisory and an Ed25519 trust check. This is a local policy demonstration, NOT a real Nexus cleanup call, generated image SBOM, live vulnerability scanner or issued CI attestation.",
        "Expected markers: RETENTION_PROTECTS_DEPLOYED_AND_ROLLBACK_DIGESTS, PROVENANCE_CLAIM_BINDS_SUBJECT_AND_BUILD_RUN, SBOM_INVENTORY_FOUND_FICTIONAL_ADVISORY_AND_BLOCKED_RELEASE and ED25519_TAMPER_AND_UNTRUSTED_SIGNER_REJECTED. A wrong cleanup predicate that deletes by age alone must cause the embedded protected-reference assertion to fail. Do not run a real repository deletion until a recoverable backup, deployment inventory and authorized dry run exist."
      ]
    },
    {
      "heading": "Work through growth, cleanup and rollback evidence",
      "paragraphs": [
        "A working policy separates ephemeral branch artifacts from promoted releases and retained rollback candidates. Calculate approximate storage growth from build frequency, median artifact size, layer deduplication assumptions and cleanup windows, then compare with the actual homelab disk capacity and backup destination. Explicitly mark assumptions you did not measure. Record package and image retention rules separately if their formats have different garbage-collection behavior.",
        "Before deleting a test artifact in Nexus, confirm repository-specific cleanup policy and blob-store compaction semantics for the deployed Nexus version; cleaning component metadata does not necessarily release disk space immediately. Preserve an export of candidate references, perform deletion only in authorized disposable scope and independently retrieve every protected digest afterward."
      ]
    }
  ],
  "provenance": [
    {
      "heading": "A provenance record is a claim linking source, builder, materials and output",
      "paragraphs": [
        "An attestation or provenance statement connects a specific built artifact digest to source revision, build process and material dependencies. For a Steward image, the chain is immutable source commit → CI run identity/environment → built image manifest digest → deployment record. A version label or one clean git log entry is insufficient: a malicious or accidentally misconfigured runner can build a different output from the same commit if materials or steps are unpinned.",
        "For a third-party dependency, distinguish an upstream publisher's origin from your own CI consumption path. Your proxy may cache the upstream artifact but cannot transform upstream bytes into an internally authored component just by changing its URL. Record selected version, checksum, source endpoint, policy decision and the exact output that incorporated it."
      ]
    },
    {
      "heading": "Inspect the executable subject-to-run link, then challenge missing data",
      "paragraphs": [
        "In the earlier Artifact Retention and Cleanup runnable program, claim.subject.digest matches the locally computed output digest, and the builder run and fictional material identifiers are recorded. This is an inspectable claim with stable identifiers, NOT cryptographically assured SLSA provenance. To exercise a missing-link failure, replace the claim's subject digest with an unrelated hash and require the subject equality guard to stop acceptance.",
        "An authentic SLSA provenance attestation requires an actual builder identity, trusted build parameters, source/material information according to the selected schema, correct serialization and a verifiable issuer. A simple object signed by a locally generated key is educational cryptography, not evidence that a real GitLab job attested to those inputs. Security Steward will strengthen issuer identity and verification policy."
      ]
    },
    {
      "heading": "Design a reproducible investigation backward from production",
      "paragraphs": [
        "Begin with a running digest from an independent deployment host. Find the registry manifest it references, the build run that published that digest, the exact source SHA and resolved dependency material. If any link is missing or mutable, mark it UNKNOWN rather than substitute the latest branch head or currently installed dependency versions.",
        "For an actual incident investigation, record authority and timestamps, then ask: could an independent auditor reproduce the exact source-to-output association without trusting a developer's verbal claim? If not, improving the record's completeness is the immediate task, not calling the provenance chain verified."
      ]
    }
  ],
  "sbom": [
    {
      "heading": "Inventory exact components without pretending they are a scan result",
      "paragraphs": [
        "A Software Bill of Materials is a structured inventory of components for one build output: names, versions, package URLs or other identifiers, relationships and often hashes. CycloneDX and SPDX are two ecosystems for expressing those relationships. An SBOM can be generated from source dependency resolution, image layers or built distributions; these vantage points may disagree. The generator and subject artifact digest must be explicit to know which components were actually observed.",
        "An SBOM is not a proof of safety. It may omit dynamically loaded dependencies, OS packages or unobserved transitive components depending on generation stage and tooling. A vulnerability is not even implied merely by an entry in an SBOM; an advisory database and applicability analysis are different inputs."
      ]
    },
    {
      "heading": "Tie an explicit inventory to a specific output hash",
      "paragraphs": [
        "The executable teaching model from Artifact Retention and Cleanup builds a CycloneDX-shaped object containing one fictional library with a package URL and a metadata component hash matching the modeled image digest. It also has a deliberately fictional advisory matching that package URL; this is enough to teach exact matching and release gating, but it is **not** an SBOM generated by Syft/Trivy from an image and does not validate full CycloneDX schema conformance.",
        "Inspect the subject hash guard before changing the inventory. If someone reuses an old BOM after rebuilding an image, the BOM may be structurally valid but describe a different artifact. For real Steward work, generate an SBOM for an actual source-built image, record tool/version/command, validate its schema where supported and independently cross-check at least five dependency identifiers against the produced image or resolved lock."
      ]
    },
    {
      "heading": "Explain how an SBOM helps when an advisory appears later",
      "paragraphs": [
        "When a new vulnerability advisory names a package identifier and version range, query stored BOMs to find which exact historical image digests contain it. Then map those digests to deployments and owners before prioritizing fixes. Preserve each historical SBOM instead of silently overwriting old inventory with the latest dependency graph.",
        "False positives and negatives remain possible due to identifier collisions, version-normalization mistakes, omitted packages and incomplete advisories. A release gate may require manual triage for missing or ambiguous identity rather than declaring 'no affected components'."
      ]
    }
  ],
  "signing-provenance": [
    {
      "heading": "Digital signatures bind bytes to a key, not trust to a purpose",
      "paragraphs": [
        "A signature operation uses a private signing key to sign a message or digest-bound statement. A verifier uses the corresponding public key to check that those exact bytes were signed. The cryptographic check does not itself establish that the public key is an authorized CI builder, that the claimed source is authentic, or that a safe build process was followed. Trust policy must bind a signer identity and the expected artifact/provenance subject to the intended release context.",
        "Using Ed25519, different valid keypairs can each sign the same bytes. A malicious actor's signature may be cryptographically valid under the malicious actor's own key but must fail verification against the trusted builder identity. Avoid the unsafe pattern of accepting whatever public key accompanies an untrusted artifact."
      ]
    },
    {
      "heading": "Run a real Ed25519 tamper and signer-trust negative proof",
      "paragraphs": [
        "The earlier retention lesson's JavaScript source creates two independent actual Ed25519 keypairs with Node's crypto API. A legitimate signature over its fictional source/build/output claim verifies with the approved public key. Changing the claim bytes fails verification; signing the unchanged claim with a different key also fails under the authorized key. This is a real cryptographic operation with disposable keys, but the trust anchor is a test fixture and the statement is NOT a genuine GitLab provenance attestation.",
        "Require the ED25519_TAMPER_AND_UNTRUSTED_SIGNER_REJECTED marker. In a disposable copy, replace the trusted key in the rogue signature check with the attacker's key: the independent guard must fail. In a real pipeline, record the trusted builder identity, actual image digest or package checksum, issuer, signed subject, verification result and rejection of an untrusted signer before approving deployment."
      ]
    },
    {
      "heading": "Separate a valid signature from an authorized release decision",
      "paragraphs": [
        "Even a signature from an approved CI identity may cover an image with a known unwaived critical vulnerability, a missing SBOM or the wrong environment target. The release policy must consider cryptographic proof, provenance subject, artifacts, assessment outcomes and human approvals independently. Correct bytes signed by the wrong authority are not an approved deployment.",
        "Security Steward will deepen key storage, transparency logs, identity-bound signing, rotations and mandatory policy, but Delivery Engineer must already reject altered bytes, arbitrary signers and unlinked artifact identity. Never publish test private keys or treat the education keypair as a secret-management solution."
      ]
    }
  ],
  "scanning": [
    {
      "heading": "Identify what a scanner actually observes",
      "paragraphs": [
        "A dependency scanner may inspect lockfiles or installed package metadata; a container scanner may inspect image layers and operating-system databases; a secret or static scanner examines different evidence entirely. Results depend on scanner version, vulnerability feed freshness, package mapping and configuration. A green scan might mean 'no matching known advisories under this policy' rather than 'no vulnerabilities exist'.",
        "Distinguish a scanner's finding from an exploitable release risk. A high-severity advisory may be mitigated by an unreachable code path or runtime isolation, while a moderate finding could be urgent if reachable in an externally exposed service. Require component identity, installed version, affected version range, exploit context, owner, remediation path and exception rationale."
      ]
    },
    {
      "heading": "Practice triage with a clearly fictional advisory and deny-by-default gate",
      "paragraphs": [
        "The executable JavaScript model in Artifact Retention and Cleanup matches a fictional advisory to a package URL in a CycloneDX-shaped inventory, then rejects promotion when severity is high and no reviewed exception is present. It teaches inventory-to-advisory linkage and an explicit release decision; it does **not** query a real CVE feed, execute a scanning binary, determine exploitability or prove a Steward image has been scanned.",
        "First verify that the SBOM belongs to the exact image digest before interpreting the finding. Modify the fictitious advisory version or component identifier and explain whether a finding should still match; an overbroad name-only match may produce false positives. A real scanner report needs the source tool, database timestamp, artifact digest and enough context to reproduce the observation."
      ]
    },
    {
      "heading": "Define a defensible release exception or block",
      "paragraphs": [
        "An actionable vulnerability finding should enter triage with owning team, severity, affected artifact digest, exposure assumptions, possible fix, target date and evidence for any mitigation. A false positive needs a documented reason and an expiry/review policy. Do not hide findings by permanently disabling scanners or broad ignore rules that silently apply to future releases.",
        "For the actual Steward service, run an available scanner on a built image or verified dependency graph, save its machine-readable output and check a sample of findings against installed versions. If no scanner is available, mark it NOT_TESTED; the educational model cannot substitute for real scan output."
      ]
    }
  ],
  "lab-nexus-platform": [
    {
      "heading": "Prerequisites and non-destructive environment boundary",
      "paragraphs": [
        "Before touching the homelab, verify that the learner controls a disposable Nexus target VM or host, can install a version explicitly chosen from vendor documentation, has available storage and knows the authorized administrative network route. Record actual OS/container engine, persistent path, database mode, backup destination, DNS/TLS arrangement and service restart mechanism. No commands in this reading assume an undocumented live Nexus address or invent credentials.",
        "Create a topology table for publisher, consumer, administrator, database, blob store, proxy upstream and trusted network. Separately record the expected endpoints for PyPI hosted, proxy and group, OCI hosted and optionally npm hosted/group where an actual consumer requires it. A repository name or localhost model is not proof the service exists; every live URL must be observed in the learner's own lab."
      ]
    },
    {
      "heading": "Progress through installation, persistence, endpoint and authority gates",
      "paragraphs": [
        "Gate 1: deploy Nexus with durable state, record exact version and demonstrate private administrative access. Gate 2: create only necessary repository formats and explicit group members; record whether unknown public fallbacks are disabled for internal-only names. Gate 3: establish separate non-admin publisher and read-only consumer identities and protect credentials. Gate 4: publish a disposable artifact and independently retrieve it using the actual ecosystem client and matching checksum.",
        "At each gate preserve expected result, observed result, command and redacted evidence. A UI screenshot that says 'Online' cannot prove database/blob consistency, endpoint format, or consumer rights. If a check fails, stop subsequent publication and record the unresolved blocker rather than fabricating success."
      ]
    },
    {
      "heading": "Force one failure in each important control plane",
      "paragraphs": [
        "Test read-only identity attempting to upload (must be denied), unavailable authorized index with no accidental public fallback, wrong package/version or digest (must fail), and restart with durable state (must preserve the artifact). For proxy caching, show an initially cold fetch, a warm hit and a controlled upstream outage with an uncached miss. Do not delete shared data or disable production upstream routing to stage these failures.",
        "For recovery, use an isolated copy of a matched database-and-blob backup and retrieve the same hash afterward; a process restart alone is not a restore test. The exact restoration procedure depends on the installed Nexus version and database/backend. Mark RESTORE NOT_TESTED if isolation or a consistent snapshot cannot be established."
      ]
    },
    {
      "heading": "Produce an auditable completion record instead of an installed-service claim",
      "paragraphs": [
        "Required evidence includes service version, private endpoint and TLS trust, persisted database/blob boundary, package and OCI repository names, who can publish/read, one artifact checksum and independent clean retrieval, denied publish, cache behavior, startup/restart result, disk use and isolated restore status. Every item must be marked PASS, FAIL or NOT_TESTED with an observable reason.",
        "Exit criteria: an authorized real publisher can publish a disposable package/image, a separate consumer can retrieve matching immutable bytes using only approved endpoints, unauthorized publication fails, and rollback-required bytes survive a tested lifecycle. This lab cannot be considered complete from the two local HTTP models alone."
      ]
    }
  ],
  "lab-steward-common-ci": [
    {
      "heading": "Begin by proving the shared package should exist",
      "paragraphs": [
        "Before the pipeline, require an explicit independent-consumer inventory: at least two real Steward consumers of a stable reusable Python contract, each with a concrete use case. If that evidence is missing, record that steward-common extraction was DEFERRED and run only an explicitly disposable package-fixture pipeline. A real package must not be manufactured so the academy can award a green badge.",
        "Decide package name, version contract, supported Python versions, built wheel/sdist metadata, CI project permissions, writeable hosted PyPI URL, consumer-facing group/index URL, scoped publisher account and read-only consumer identities. No direct file copy, editable install or workspace link counts as an independent package release."
      ]
    },
    {
      "heading": "Make verification a hard prerequisite of artifact publication",
      "paragraphs": [
        "CI must execute source tests and schema/contract checks before building, then inspect wheel metadata and file hashes, publish only after all required checks pass and collect the actual hosted repository response. A later consumer job must run on a fresh runner with no producer checkout and install only the approved package from its repository endpoint. Record output checksum, source SHA, CI run, version and effective index path.",
        "An insecure pipeline may run tests and publication in independent parallel jobs; publication could succeed even when tests fail. Express explicit needs/dependencies and failure behavior so a red test job prevents a publish job from starting. Never disguise a dry-run local wheel staging as an authorized Twine upload to Nexus."
      ]
    },
    {
      "heading": "Require three adversarial CI observations",
      "paragraphs": [
        "Failure 1: deliberately break a package unit or API contract test; confirm publish job is blocked and no new artifact appears on hosted. Failure 2: attempt a read-only upload or a changed same-version release; it must be refused by real server policy. Failure 3: remove the approved index on a clean consumer; installation must fail without falling back to producer-local files or public packages.",
        "Only after the negative cases pass should you attempt a compatible upgrade, pin consumers and rerun their actual business flows. If a genuine shared package was deferred, demonstrate the mechanics with a plainly named fixture and state that Steward runtime dependencies were not changed."
      ]
    },
    {
      "heading": "Close with an evidence ledger and Release Engineering handoff",
      "paragraphs": [
        "The final record must link CI pipeline run, tested source revision, full build logs, real published package checksum, repository URL, authenticated publisher, attempted denied identities, clean consumer provenance, run result and controlled failure cases. Check that package metadata and the checksum remain retrievable after the publisher workspace is gone.",
        "An accepted lab proves artifact publication and consumption boundaries only. Release Engineering still needs candidate approval, deployment target decisions, post-deploy health, rollback and incident response. Distinguish those follow-up requirements from this lab's narrower distribution scope."
      ]
    }
  ]
};
export const supplyChainGovernancePractices: Record<string,string[]> = {
  "proxy-cache-public": [
    "Execute the exact local upstream/proxy HTTP lab and capture its five markers. Explain why warm cache succeeds but a cold request fails while upstream is down.",
    "For actual Nexus, record one public dependency's upstream URL, original hash, first proxy fetch, warm hit, controlled offline behavior and blocked private namespace; mark all live checks NOT_TESTED unless observed."
  ],
  "internal-versioning": [
    "Write three changes to the explicit training fixture contract and test each against an unchanged old consumer. Make the SemVer classification falsifiable.",
    "Select exact pin or compatible range with a documented update process; demonstrate how the approved content hash and real consumer contract guard against same-version mutation."
  ],
  "prerelease-release": [
    "Build an explicit candidate approval table with package/manifest digest, source, CI run, test evidence, approver and target; reject changed bytes after approval.",
    "Compare Python prerelease selection, npm SemVer prerelease selection and mutable OCI tags without treating their syntax or resolution behavior as interchangeable."
  ],
  "retention-cleanup": [
    "Run the exact Node retention/provenance/SBOM/Ed25519 policy program, capture the five markers and change the protected-digest predicate in a disposable copy to prove it fails.",
    "Classify a deployed 400-day-old image, a retained rollback 90-day-old image and an ephemeral 40-day-old build; justify which may be deleted and how real Nexus cleanup would be proved safely."
  ],
  "provenance": [
    "Trace a fictional artifact digest to builder run, source revision and one dependency material in the earlier executable model; deliberately mismatch the subject digest and show admission rejects it.",
    "For a real Steward release, list concrete registry digest, CI run URL, source SHA and material file checksums, marking every missing actual link UNKNOWN instead of fabricating values."
  ],
  "sbom": [
    "Inspect the CycloneDX-shaped *fictional* inventory from the retention lesson; explain why it is not a generated or fully validated SBOM.",
    "Generate a real SBOM with an installed tool if available, store the tool version and subject digest, validate format where supported and cross-check five real image components before declaring the actual exercise complete."
  ],
  "signing-provenance": [
    "Run the real Ed25519 checks in the earlier policy program; change a signed claim and replace the trusted key with an attacker key, explaining why both must fail.",
    "Write a real CI attestation verification contract listing trusted issuer, artifact subject digest and release policy; mark real signing NOT_TESTED until exercised with an approved signing service."
  ],
  "scanning": [
    "Use the fictitious advisory model to identify the exact vulnerable package URL and demonstrate that a high-severity finding without review blocks its modeled release.",
    "For actual Steward, attach a real scanner's timestamped database/tool version, image digest and finding details, then justify one disposition without claiming the fictional advisory exists in a vulnerability database."
  ],
  "lab-nexus-platform": [
    "Complete installation and network preflight with observed Nexus version, durable DB/blob locations, restricted administration and repository endpoint configuration; treat missing infrastructure as BLOCKED.",
    "Provide authorized publisher success, read-only denied upload, clean client hash match, proxy warm/cold failure, persistence after restart and an isolated consistent database+blob restore result; report PASS/FAIL/NOT_TESTED separately."
  ],
  "lab-steward-common-ci": [
    "Record independent real consumers and confirm whether steward-common is genuinely justified. If not, explicitly defer and use the disposable package fixture only.",
    "Build a verified CI job graph where publish depends on package tests; prove a failing test prevents server-side publication, a clean separate consumer imports approved bytes, and denied upload/changed version fail before any graduation claim.",
    "Handoff source/run/digest, artifact URL, package version, consumer tests, denied operations and remaining release-promotion decisions to Release Engineering."
  ]
};
