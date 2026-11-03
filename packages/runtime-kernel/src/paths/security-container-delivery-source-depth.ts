import type { LessonBlock } from "../activities/content";
type TopicDepth = { mechanism: string; caseStudy: string; failure: string };
// PED-005: original topic-specific mechanics; no repeatable orientation padding.
export const securityContainerDepthByTopic: Record<string, TopicDepth> = {
  "Container Attack Surface": {
    "mechanism": "A container runs processes using host-kernel isolation: namespaces separate views of processes, mounts and networks; cgroups limit resource use; Linux capabilities, seccomp and mount flags restrict particular operations. None creates a separate kernel. A writable Docker socket grants highly privileged host-control capability even when the process otherwise looks isolated.",
    "caseStudy": "Start with the Steward API container, not a generic container diagram. Record its runtime UID, capability set, network bindings, persistent mounts, writable paths and whether any host socket is mounted. Map each to a plausible consequence: reading a workload secret, modifying API code, or reaching a database. A non-root UID and read-only filesystem each reduce one class of impact but do not replace network and image trust.",
    "failure": "Negative: a supposedly restricted container still mounts the host Docker socket or retains privileged mode. That single exception can invalidate most other restrictions. Prove the dangerous mount/capability is absent through runtime inspection, then show required API behavior remains functional; a passing vulnerability scan would not detect all runtime privileges."
  },
  "Minimal and Trusted Base Images": {
    "mechanism": "A Dockerfile FROM line selects a filesystem and executable dependency baseline. Image tags are mutable names; an immutable digest fixes the selected bytes. A small or distroless image may reduce available packages and tools, but cannot establish who published it or whether its kernel-facing runtime configuration is safe. Update strategy must account for base-layer CVEs and debugging needs.",
    "caseStudy": "For one Steward build, identify the base image publisher, immutable digest, supported patch lifecycle and runtime dependencies. Compare a full development image with a minimal runtime image using the same application test. Keep a documented ephemeral debugging method instead of baking a shell into every production artifact.",
    "failure": "Negative: an image remains pinned to a vulnerable old digest while the team claims it is safe because it is small. A moving latest tag can silently change bytes across identical deployments. Verify the chosen digest and approved update cadence; show how a changed base digest triggers rebuild and regression rather than passive trust."
  },
  "Image Scanning": {
    "mechanism": "An image scanner enumerates operating-system packages, language dependencies and sometimes exposed secrets or configuration, then matches data to vulnerability advisories. An advisory match is evidence of a potentially affected version, not proof that the vulnerable code is reachable. Conversely, zero matches do not prove absence of unknown vulnerabilities or logic flaws.",
    "caseStudy": "Capture the exact scanned Steward image digest, scanner/database timestamp, package, vulnerable version, fix availability and likely call-path reachability. Compare one fixable dependency with one unfixable or not-reachable finding and document why each is fixed, accepted temporarily or escalated.",
    "failure": "Negative: scanning a different tag/digest than the one actually deployed yields an irrelevant green result. Another failure is suppressing a critical finding indefinitely without owner or expiry. Require artifact identity match and a signed-off time-bounded exception with regression proof."
  },
  "Container Runtime Permissions": {
    "mechanism": "Process UID/GID, filesystem mount options, allowed Linux capabilities, seccomp filter, security context and privileged flag define different runtime powers. A container process may run as UID 0 without full host root rights, but that does not make it safe: capabilities and mounts can still expose sensitive functions. Running as an unprivileged UID alone does not prevent unsafe outbound network access.",
    "caseStudy": "Inspect a disposable Steward worker's effective UID, writable mounts and Linux capability list. Remove an unneeded capability, switch its writable working directory to an explicit mounted scratch path and run the same startup, file-write and API readiness checks. If an operation fails, trace the missing required permission rather than blindly restoring privileged mode.",
    "failure": "Negative: a process previously relied on root to write a cache under the image filesystem. After making the root filesystem read-only it cannot start. The correct repair is a scoped writable mount with narrow ownership, not blanket privilege escalation or disabling restrictions."
  },
  "Secrets in Delivery": {
    "mechanism": "Build-time ARG and environment variables, intermediate layers, CI console output, caches, debugging snapshots and published artifacts can retain secret material. Deleting a credential in a later Docker layer does not remove it from earlier layers. Prefer ephemeral, purpose-scoped workload credentials and secret mounts that do not become part of the image; prohibit credentials in generated evidence.",
    "caseStudy": "Trace one Steward registry read token from issue to CI job, credential injection, image build, publish and job teardown. Map which task truly needs the token and whether that identity can write elsewhere. Use synthetic sentinel values to test logs and archive contents; real tokens must never appear in screenshots or committed examples.",
    "failure": "Negative: a masked CI variable was echoed by a shell error or copied into an image layer. A masked setting is not a safe storage guarantee. Rebuild from clean context after rotating the credential and check prior caches/artifacts and audit logs for exposure; do not count a one-line redaction as incident recovery."
  },
  "CI/CD Identities and Least Privilege": {
    "mechanism": "Each pipeline job is a non-human actor, often issued a short-lived job/OIDC token scoped to repository, branch, environment and audience. Dependency download, package publish and production deploy require different grants. A single all-powerful pipeline identity increases the impact of a compromised low-trust build job.",
    "caseStudy": "Build a matrix for Steward test, package build, Nexus publish, environment promotion and deployment. Grant test jobs read-only access to needed packages, publishers write access only to approved hosted repositories, and deploy jobs authority only to their target. Verify job identity/claims at the recipient rather than treating a CI job name as a security fact.",
    "failure": "Negative: a test job can publish a malicious internal package or access production deployment credentials. Prove a publish attempt using its bounded test identity is denied, then confirm intended test reads still work; do not disable the whole pipeline to demonstrate least privilege."
  },
  "Protected Environments and Approval Boundaries": {
    "mechanism": "Branch protection, protected environment rules, code review and deployment approvals are authorization gates that control when privileged credentials or publish/deploy actions become reachable. They do not prove that the resulting image is safe; signing, artifact identity and runtime controls remain distinct. An approval must protect a specific transition with a named approver and auditable decision.",
    "caseStudy": "For Steward, compare a harmless unit-test job to a production deployment requiring privileged environment access. Document who can create a release tag, approve deployment, obtain a deploy token and invoke emergency rollback. Make the developer/reviewer/approver separation explicit without inventing a bureaucracy for disposable labs.",
    "failure": "Negative: a forked merge request or unprotected branch obtains production variables despite an apparent manual approval step. Test the actual token availability and protected-environment rejection on a synthetic pipeline; adjust the permission boundary, not merely the UI appearance of an approval button."
  },
  "Dependency Scanning": {
    "mechanism": "Dependencies form a directed tree of direct and transitive packages. Vulnerability databases map versions and affected ranges, but package reachability, exploit prerequisites and available patches determine response priority. A package lockfile records selected versions; resolution from an untrusted source is a separate supply-chain risk.",
    "caseStudy": "Compare a direct Steward HTTP client package with one transitive parser dependency. Record dependency tree, patch candidate, supported API compatibility and regression coverage. Verify the same dependency resolution occurs in CI and in the container build before claiming a fix.",
    "failure": "Negative: an automated update clears a CVE but breaks runtime protocol compatibility or pulls an unexpected artifact source. Validate tests and lockfile provenance under the exact new version; if mitigation is deferred, retain an owner, expiry and observable compensating control."
  },
  "SAST and DAST Concepts": {
    "mechanism": "Static analysis inspects code paths without requiring a running service; dynamic analysis sends controlled requests to a deployed app and observes responses. SAST may catch unsafe string concatenation, while DAST may find exploitable behavior at a reachable HTTP endpoint; neither inherently understands business ownership or all environment-specific trust boundaries.",
    "caseStudy": "In a learner-owned Steward environment, evaluate a synthetic vulnerable input handler in code and with an HTTP request. Record which technique discovers the suspicious code and which produces actual 400/403/500 effects. Use a manual cross-owner read test for an authorization failure likely to evade both generic scanners.",
    "failure": "Negative: a DAST scan gets 403 due to missing login and is reported as proof that the application is secure. Or SAST marks a sanitized path unsafe without checking actual parameter binding. Record scanner coverage, auth context, false-positive/negative analysis and a reproducible human test."
  },
  "Software Supply-chain Security": {
    "mechanism": "A trusted release is a chain of distinct assertions: who controlled source, what builder executed, which dependencies were resolved, what artifact bytes were produced, which registry stored them and which identity promoted/deployed them. An SBOM inventories components; provenance describes build process and subjects; a signature binds selected evidence to an identity. These claims are complementary.",
    "caseStudy": "Trace Steward commit SHA → protected GitLab runner identity → build digest → Nexus location → verification policy → environment deployment digest. Record how each handoff prevents swapping an artifact between build and deploy. Distinguish a tag, mutable name and immutable digest.",
    "failure": "Negative: the deploy stage references a mutable tag and runs a different image digest than the signed candidate. Reconstruct from registry and cluster digests, reject the mismatch and require a new approval; a green code review cannot validate a substituted binary."
  },
  "Dependency Confusion": {
    "mechanism": "A package resolver chooses from configured registries according to name, version, repository order and resolver policy. If a private name can also resolve from a public registry, an unintended public package may be selected. Namespace, explicit internal routing and lockfile identity reduce this risk; an internal package is not safe simply because it has an uncommon name.",
    "caseStudy": "Inventory which Steward internal packages ACTUALLY exist and where they are published. For one private package, document registry URL, namespace, expected version and digest, and demonstrate a disposable resolver configuration chooses the intended local/internal fixture over a conflicting public-name candidate without fetching malware.",
    "failure": "Negative: the same lockfile resolves to a public similarly named package after cache cleanup or runner change. Reject unexpected publisher/source before execution and verify the fixed resolver configuration; adding a higher version number to the internal package is not a durable namespace control."
  },
  "Typosquatting and Malicious Packages": {
    "mechanism": "An attacker can publish a similarly named package or compromise an existing maintainer/release pipeline. Dependency review must examine identity, signatures/provenance when available, new installation scripts, repository history, package content and why the dependency is necessary. A clean known-CVE scan does not identify every malicious post-install script.",
    "caseStudy": "For a proposed Steward dependency, compare exact spelling, scope, publisher history and requested permissions with the intended package. Evaluate whether the functionality is already supplied by the standard library or existing dependencies. Record why the new dependency is worth its update and exposure burden.",
    "failure": "Negative: a misspelled package installs successfully and passes ordinary unit tests while running an unexpected build script. Reject source/publisher mismatch and inspect the package's executed scripts in an isolated build; never demonstrate by fetching a suspicious live package onto a work machine."
  },
  "Internal Repository Trust Boundaries": {
    "mechanism": "A hosted package repository accepts trusted publishing; a proxy repository caches or forwards requests to an upstream source; a group repository combines sources. These roles create different publisher, read, promote, delete and administer permissions. Repository networking being internal does not make its content trustworthy.",
    "caseStudy": "Map the learner-owned Nexus hosted and proxy endpoints and CI identities. Separate readers, package publishers, release promoters and administrators. For one artifact, record source identity, digest, approval and retention so an audit can distinguish a trusted release from a cached upstream component.",
    "failure": "Negative: a CI test token can delete or overwrite a hosted release, or a proxy route substitutes an uncontrolled public component for an internal name. Validate denied actions with synthetic roles and a disposable artifact, then verify ordinary consumption still succeeds."
  },
  "Package Provenance and Integrity": {
    "mechanism": "A digest says which bytes were observed, not who produced them. Provenance metadata identifies the source revision, builder identity, invocation inputs and output subject digest under a policy-defined trust model. A third-party provenance statement should not be accepted merely because its JSON is well formed.",
    "caseStudy": "For one Steward release artifact, compare its hash to the provenance subject and SBOM artifact identity; check the expected GitLab builder identity and protected source revision against deployment policy. Keep the statement attached to that immutable subject across promotion, not to a replaceable latest tag.",
    "failure": "Negative: the provenance statement names a different digest, branch or builder. Reject the candidate before deploy and obtain the correct signed statement; changing the JSON text manually would destroy provenance integrity and is not a remedy."
  },
  "SBOMs as Security Evidence": {
    "mechanism": "A Software Bill of Materials lists included components, versions, identifiers and dependency relationships using formats such as SPDX or CycloneDX. It can support vulnerability response and license inventory, but it is not a vulnerability scan, signature or guarantee that every runtime-loaded module was captured. Generate it for the exact built artifact digest.",
    "caseStudy": "Compare Steward's container package inventory with a CycloneDX/SPDX SBOM and one known transitive dependency. Link the SBOM's subject to the image digest and track how an upgraded dependency changes the component/version record. Distinguish source-level SBOM from final image-level contents.",
    "failure": "Negative: a green SBOM check refers to an earlier image or omits runtime-installed dependencies. Preserve the mismatch as a coverage gap, regenerate evidence from the actual release and never use a component list alone as permission to deploy."
  },
  "Signing and Verification Concepts": {
    "mechanism": "Digital signatures let an approved private-key/workload identity create a verifiable statement over exact artifact bytes or digest. Verification has TWO gates: cryptographic validity and signer/subject policy. In keyless signing, identity-provider claims and short-lived certificates add additional trust checks; transparency logging may provide auditability but does not authorize a signer by itself.",
    "caseStudy": "Use the Security Steward Artifact Signing source module's exact local RSA signature exercise first: approved key+subject passes, changed bytes fail and a cryptographically valid unapproved signer is denied. Then plan the real Cosign exercise for an immutable Steward OCI digest and trusted GitLab identity.",
    "failure": "Negative: signature verification succeeds against an arbitrary public key supplied alongside the image, so the deploy pipeline accepts attacker-signed bytes. Pin the allowed identity/issuer and digest in the verifier policy; never use a bypass flag to make CI green."
  },
  "Security Gates and Exceptions": {
    "mechanism": "A delivery gate turns a risk rule into a deterministic permit/deny decision using inspected artifact identity, validated evidence and a policy version. A warning signals review; a blocking gate prevents a defined high-impact transition. Exceptions require an owner, rationale, expiry, scope and compensating control so they do not quietly become permanent overrides.",
    "caseStudy": "Define one Steward release gate for trusted signer+image digest and another threshold policy for a high-severity reachable dependency finding. Test both accepted and rejected synthetic releases, then record whether the failure is a code defect, incomplete evidence or reviewer exception.",
    "failure": "Negative: a policy exception without expiry is copied into every new pipeline, making a critical gate effectively inert. Verify automatic expiry or escalation, and require a new signed approval for changed scope rather than a global disable-security variable."
  },
  "Protecting Internal Publishing Credentials": {
    "mechanism": "Publishing credentials can alter artifacts consumed by many downstream builds. Keep them separate from read-only restore/test credentials, bind them to protected jobs/environments and prefer short-lived OIDC workload identity. Rotate after compromise and inspect registry audit events; masking alone does not remove a token from prior logs or caches.",
    "caseStudy": "Map the Nexus publish identity, its allowed repositories and GitLab job/environment constraints. Compare with a normal test job that must only read packages. Attempt a controlled publish with the read-only test identity and require a denied response, then run a permitted test publish to a disposable namespace.",
    "failure": "Negative: an untrusted merge-request job receives publishing authority and overwrites a package later consumed by production. Deny the credential at the CI boundary, investigate published artifact digests, rotate affected secrets and rebuild from known-good source with verified provenance."
  },
  "Securing Earned Internal-Package Consumption": {
    "mechanism": "A consumer should resolve only approved internal packages that genuinely exist, at versions/digests tied to source and release evidence. Lockfiles, private namespace, registry allowlists and verified package integrity work together; a package referenced in a future plan is not an installed dependency. Dependency integrity and runtime behavior remain independent verification needs.",
    "caseStudy": "Identify one Steward package extracted through the prior Builder gate (if any) and record its producer revision, Nexus host, version/digest and dependent API commit. Exercise a clean-install in an isolated runner with cache disabled, then compare the selected package to the approved artifact. If no shared package was extracted, document that absence instead of inventing one.",
    "failure": "Negative: a consumer silently pulls an unexpected public source or newer incompatible version after a registry change. Fail closed on source/digest mismatch, restore the approved lockfile/repository mapping and rerun the actual consumer contract tests."
  }
};
export function containerTopicBlocks(topic: string, sectionId: string): LessonBlock[] {
  const data = securityContainerDepthByTopic[topic];
  if (!data) throw new Error("Missing source-depth teaching for container topic: " + topic);
  return [
    { type:"heading",id:sectionId+"-mechanism",text:"Mechanism and trust boundary",level:2 },
    { type:"paragraph",text:data.mechanism },
    { type:"heading",id:sectionId+"-steward-proof",text:"Worked Steward scenario",level:2 },
    { type:"paragraph",text:data.caseStudy },
    { type:"heading",id:sectionId+"-failure-transfer",text:"Failure, diagnosis and transfer",level:2 },
    { type:"paragraph",text:data.failure },
  ];
}
