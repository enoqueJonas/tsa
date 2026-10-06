import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const pathsDir = path.join(root, "packages/runtime-kernel/src/paths");
const docsDir = path.join(root, "docs/curriculum");
const files = fs.readdirSync(pathsDir).filter((name) => name.endsWith(".ts"));
const sources = new Map(files.map((name) => [name, fs.readFileSync(path.join(pathsDir, name), "utf8")]));
const allRuntime = [...sources.values()].join("\n");
const failures = [];

for (const [file, source] of sources) {
  for (const match of source.matchAll(/export const\s+(\w+(?:DeepLessons|QualityLessons|RichLessons))\b/g)) {
    const symbol = match[1];
    const uses = (allRuntime.match(new RegExp("\\b" + symbol + "\\b", "g")) || []).length;
    if (uses < 2) failures.push(`orphan exported lesson array: ${file} -> ${symbol}`);
  }

  for (const match of source.matchAll(/(?:const|export const)\s+(\w*[Mm]ilestone\w*)\s*(?::\s*(?:AuthoredLesson|Lesson))?\s*=/g)) {
    const symbol = match[1];
    const uses = (allRuntime.match(new RegExp("\\b" + symbol + "\\b", "g")) || []).length;
    if (uses < 2 && !/DeepLessons$/.test(symbol)) failures.push(`declared milestone not composed/exported: ${file} -> ${symbol}`);
  }
}

const academy = sources.get("academy-journey.ts") ?? "";
const schoolAggregators = [
  "systemThinkerPaths","platformBuilderPaths","deliveryEngineerPaths","cloudEngineerPaths",
  "qualityStewardPaths","securityStewardPaths","reliabilityEngineerPaths","architectPaths",
  "technicalStewardPaths","professionalEngineerPaths"
];
for (const symbol of schoolAggregators) {
  if (!academy.includes(symbol)) failures.push(`school runtime path array not wired in academy-journey.ts: ${symbol}`);
}

// Jenkins is intentionally retained only in the bounded legacy-to-GitLab migration exercise.
// Historical curriculum audit documents may also describe the migration and are not active runtime architecture.
const jenkinsRuntimeAllowlist = new Set(["delivery-migration-exercises-deep.ts"]);
for (const [file, source] of sources) {
  if (/\bJenkins(?:file)?\b/i.test(source) && !jenkinsRuntimeAllowlist.has(file)) {
    failures.push(`non-canonical Jenkins runtime reference: ${file}`);
  }
}

const migrationExercise = sources.get("delivery-migration-exercises-deep.ts") ?? "";
if (!/GitLab CI\/CD/.test(migrationExercise) || !/Jenkins/.test(migrationExercise)) {
  failures.push("legacy CI migration exercise must explicitly preserve Jenkins-to-GitLab migration semantics");
}

// Preserve the evidence-gated steward-common lifecycle across Builder and Delivery.
const builderSoftwareCraft = sources.get("builder-software-craft-quality.ts") ?? "";
const deliveryArtifacts = sources.get("delivery-artifact-supply-chain-deep.ts") ?? "";
for (const required of ["more than one real consumer", "Internal-package boundary assessment"]) {
  if (!builderSoftwareCraft.includes(required)) failures.push(`Builder steward-common gate is missing required evidence: ${required}`);
}
for (const required of ["If steward-common has independently earned extraction", "otherwise use an explicitly labeled minimal training package", "If extraction was deferred, use an explicit fixture"]) {
  if (!deliveryArtifacts.includes(required)) failures.push(`Delivery steward-common lifecycle must preserve conditional distribution semantics: ${required}`);
}

// Later schools must preserve the actual steward-common state rather than assuming extraction occurred.
const reliabilityMetrics = sources.get("reliability-metrics-prometheus-grafana-deep.ts") ?? "";
const architectGovernance = sources.get("architect-evaluation-governance-deep.ts") ?? "";
const architectMilestone = sources.get("architect-milestone-deep.ts") ?? "";
const technicalGovernance = sources.get("technical-steward-technology-governance-deep.ts") ?? "";
for (const [file, source, required] of [
  ["reliability-metrics-prometheus-grafana-deep.ts", reliabilityMetrics, "internal packages whose extraction gates were earned"],
  ["architect-evaluation-governance-deep.ts", architectGovernance, "steward-common exists only if its earlier real-consumer gate earned extraction"],
  ["architect-milestone-deep.ts", architectMilestone, "steward-common is present only if its evidence gate earned extraction"],
  ["technical-steward-technology-governance-deep.ts", technicalGovernance, "steward-common is governed only if it actually exists"],
]) {
  if (!source.includes(required)) failures.push(`Later-school steward-common lifecycle drift: ${file} is missing: ${required}`);
}

// Preserve the deferred shared-test-library architecture across executable schools.
const qualityRuntimeFiles = [...sources.entries()].filter(([file]) => file.startsWith("quality-"));
const professionalBuild = sources.get("professional-engineer-independent-build-deep.ts") ?? "";
const prematureTestCorePatterns = [
  /(?:extract|create|publish|deploy)\\s+(?:the\\s+)?`?tsa-test-core`?/i,
  /com\\.tsa:tsa-test-core/i,
  /(?:consume|resolve|import)\\s+(?:the\\s+)?`?tsa-test-core`?/i,
];
for (const [file, source] of qualityRuntimeFiles) {
  if (prematureTestCorePatterns.some((pattern) => pattern.test(source)) && !/do not (?:extract|create|publish)|must not exist yet|does not exist yet|before tsa-test-core can exist|candidate|future/i.test(source)) {
    failures.push(`Quality Steward must not materialize tsa-test-core before a genuine second consumer exists: ${file}`);
  }
}
const qualityReuseBoundary = sources.get("quality-reuse-internal-library-deep.ts") ?? "";
const qualityMilestone = sources.get("quality-steward-milestone-deep.ts") ?? "";
for (const required of ["tsa-test-core does not exist yet.", "before tsa-test-core can exist"]) {
  if (!qualityReuseBoundary.includes(required)) failures.push(`Quality reuse boundary must explicitly preserve deferred tsa-test-core state: ${required}`);
}
for (const required of ["tsa-test-core must not exist yet.", "do not publish a library yet."]) {
  if (!qualityMilestone.includes(required)) failures.push(`Quality milestone must explicitly preserve deferred tsa-test-core state: ${required}`);
}
for (const required of ["Earn and Publish tsa-test-core from Two Real Products", "pre-extraction capstone test baseline", "Versioned Nexus artifact"]) {
  if (!professionalBuild.includes(required)) {
    failures.push(`Professional Engineer tsa-test-core two-consumer gate is missing required evidence: ${required}`);
  }
}

// Security Steward may secure internal packages only when earlier evidence says they exist.
const securitySupplyChain = sources.get("security-container-delivery-deep.ts") ?? "";
for (const forbidden of [
  "downloads tsa-test-core",
  "Steward's chain includes source control, CI, Nexus, steward-common, tsa-test-core",
  "Credentials that publish steward-common or tsa-test-core",
  "resolve steward-common and tsa-test-core from approved internal sources",
  "Verify steward-common and tsa-test-core resolve from intended repositories and versions",
]) {
  if (securitySupplyChain.includes(forbidden)) failures.push(`Security Steward must not assume deferred shared packages exist: ${forbidden}`);
}
for (const required of ["only the internal packages whose earlier extraction gates were actually earned", "only internal packages that actually exist", "only when they exist in the release/dependency evidence"]) {
  if (!securitySupplyChain.includes(required)) failures.push(`Security Steward package lifecycle guard is missing conditional evidence: ${required}`);
}

// Durable S3-compatible application blobs require state recovery; recreating object-store infrastructure is insufficient.
const drObjectRecovery = sources.get("reliability-data-protection-disaster-recovery-deep.ts") ?? "";
for (const required of ["object store holds the authoritative blob copies", "recreating the bucket/service does not restore those committed objects", "recreating an empty bucket is not recovery"]) {
  if (!drObjectRecovery.includes(required)) failures.push(`Object-storage recovery invariant is missing: ${required}`);
}

// Reliability broker exercises follow the active inherited broker state rather than resurrecting RabbitMQ after explicit retirement.
const reliabilityResilience = sources.get("reliability-resilience-distributed-failure-deep.ts") ?? "";
for (const required of ["If RabbitMQ remains active in the inherited Reliability baseline", "if explicit migration/retirement evidence replaced it", "RabbitMQ when retained, otherwise the explicitly migrated replacement"]) {
  if (!reliabilityResilience.includes(required)) failures.push(`Reliability broker-lifecycle invariant is missing: ${required}`);
}

// Reliability must not consume the future Professional Engineer tsa-test-core artifact.
const reliabilityPerformance = sources.get("reliability-performance-capacity-deep.ts") ?? "";
const reliabilityFaultInjection = sources.get("reliability-fault-injection-deep.ts") ?? "";
for (const [name, source] of [["performance/capacity", reliabilityPerformance], ["fault injection", reliabilityFaultInjection]]) {
  if (!source.includes("`tsa-test-core` does not exist")) failures.push(`Reliability ${name} must preserve the future tsa-test-core gate.`);
}

// Reliability observability instruments the inherited active topology instead of recreating retired dependencies.
const observabilityIntegration = sources.get("reliability-observability-stack-integration-deep.ts") ?? "";
for (const required of ["supporting dependencies still active in the inherited reliability baseline", "observe those components when they remain active", "explicit retirement/migration evidence rather than recreating them for this lab"]) {
  if (!observabilityIntegration.includes(required)) failures.push(`Reliability active-topology observability invariant is missing: ${required}`);
}

// Vault is required once its evidence gate is earned, while remaining reassessable by Architect later.
const enterpriseProgressionForVault = await readFile(join(curriculumDocsDir, "enterprise-capability-progression.md"), "utf8");
for (const required of ["implements the self-hosted Vault path with real leased/dynamic credentials", "This is a required hands-on checkpoint", "Architect may later reassess whether Vault remains the appropriate active implementation"]) {
  if (!enterpriseProgressionForVault.includes(required)) failures.push(`Vault implementation-history invariant is missing: ${required}`);
}

// Required hands-on technology checkpoints establish implementation history, not immutable post-Architect topology.
const enterpriseProgression = await readFile(join(curriculumDocsDir, "enterprise-capability-progression.md"), "utf8");
for (const required of ["At the Kong implementation checkpoint", "not a permanent architecture mandate", "Architect may later retain, simplify, replace or retire the gateway"]) {
  if (!enterpriseProgression.includes(required)) failures.push(`Kong implementation-history invariant is missing: ${required}`);
}

// Canonical dependency guidance must match the required Professional tsa-test-core completion gate.
const dependencyManagement = await readFile(join(curriculumDocsDir, "internal-dependency-management.md"), "utf8");
for (const required of ["extraction/publication of `tsa-test-core` is required", "do not distort it merely to force reuse", "separate real Java test-consumer increment"]) {
  if (!dependencyManagement.includes(required)) failures.push(`Canonical tsa-test-core completion invariant is missing: ${required}`);
}

// Professional Engineer must earn tsa-test-core from genuine independent two-consumer evidence without distorting the capstone.
const capstoneProposal = sources.get("professional-engineer-capstone-engineering-proposal-deep.ts") ?? "";
const independentBuild = sources.get("professional-engineer-independent-build-deep.ts") ?? "";
for (const required of ["steward-common is available only if its earlier real-consumer extraction gate was earned", "tsa-test-core is different: it does not exist yet"]) {
  if (!capstoneProposal.includes(required)) failures.push(`Professional reuse-boundary invariant is missing: ${required}`);
}
for (const required of ["passing independent capstone test baseline with no tsa-test-core dependency", "do not rewrite the capstone merely to manufacture a second Maven consumer", "A dummy consumer whose only purpose is importing the library does not satisfy the gate.", "Both consumers resolve the same published tsa-test-core version from Nexus"]) {
  if (!independentBuild.includes(required)) failures.push(`Professional tsa-test-core extraction invariant is missing: ${required}`);
}

// Technical Steward governs Architect's resulting actual estate; governance must not resurrect retired or never-earned technologies.
const technicalArchitectureGovernance = sources.get("technical-steward-architecture-governance-deep.ts") ?? "";
const technicalTechnologyGovernance = sources.get("technical-steward-technology-governance-deep.ts") ?? "";
for (const required of ["any internal packages that actually exist", "the infrastructure and hosting model retained by Architect"]) {
  if (!technicalArchitectureGovernance.includes(required)) failures.push(`Architect-to-Technical-Steward estate handoff is missing: ${required}`);
}
for (const required of ["final Architect actual-stack inventory", "Map only current or explicitly transitional technology domains", "steward-common only if its extraction gate was earned"]) {
  if (!technicalTechnologyGovernance.includes(required)) failures.push(`Technical Steward actual-stack governance invariant is missing: ${required}`);
}

// Infrastructure/configuration recreation is not a substitute for persistent-state backup and restore.
const drRecovery = sources.get("reliability-data-protection-disaster-recovery-deep.ts") ?? "";
for (const required of ["Treat this as environment reconstruction, not as restoration of persistent application/platform data.", "Restore PostgreSQL from the selected recovery point.", "Why does having Infrastructure as Code not automatically mean the whole Steward environment is recoverable?"]) {
  if (!drRecovery.includes(required)) failures.push(`Recovery/recreation boundary invariant is missing: ${required}`);
}

// Pre-Reliability schools may define/test telemetry needs, but production observability and SLO ownership remain with Reliability Engineer.
const qualityNonFunctional = sources.get("quality-non-functional-deep.ts") ?? "";
const deliveryReleaseEngineering = sources.get("delivery-release-engineering-deep.ts") ?? "";
for (const required of ["deep production capacity/SLO engineering remains for Reliability Engineer", "production observability, SLOs, incident engineering and resilience architecture to the later Reliability Engineer school"]) {
  if (!qualityNonFunctional.includes(required)) failures.push(`Quality-to-Reliability observability handoff is missing: ${required}`);
}
if (!deliveryReleaseEngineering.includes("narrower than the full observability discipline taught later in Reliability Engineer")) failures.push("Delivery release observability must remain narrower than Reliability Engineer observability.");

// Cloud progressive delivery may use bounded release-analysis telemetry but must not assume the later Reliability observability stack already exists.
const progressiveCanary = sources.get("cloud-progressive-delivery-canary-deep.ts") ?? "";
for (const required of ["does not pre-empt the later Reliability Engineer observability stack", "Treat it as release-analysis telemetry, not as the later Reliability Engineer production observability implementation.", "Argo CD remains responsible for reconciling desired deployment configuration from Git"]) {
  if (!progressiveCanary.includes(required)) failures.push(`Cloud progressive-delivery chronology/authority invariant is missing: ${required}`);
}
if (progressiveCanary.includes("Prometheus metrics already owned by the Steward observability environment")) failures.push("Cloud progressive delivery must not assume Reliability-owned observability exists before Reliability Engineer.");

// Preserve immutable release identity from Delivery through Security and Reliability evidence.
const artifactSupplyChain = sources.get("delivery-artifact-supply-chain-deep.ts") ?? "";
const artifactSigning = sources.get("security-artifact-signing-verification-deep.ts") ?? "";
const incidentManagement = sources.get("reliability-incident-management-deep.ts") ?? "";
for (const required of ["Record source SHA, release version, tag and digest together.", "Build once, deploy many"]) {
  if (!artifactSupplyChain.includes(required)) failures.push(`Delivery release-identity invariant is missing: ${required}`);
}
for (const required of ["The signed subject is an immutable artifact identity such as an OCI digest", "SBOM/provenance evidence should remain bound to the same release identity."]) {
  if (!artifactSigning.includes(required)) failures.push(`Security artifact-identity invariant is missing: ${required}`);
}
if (!incidentManagement.includes("source revision, release version and deployed OCI digest")) failures.push("Reliability incident triage must resolve deployments to immutable release identity.");

// Preserve the cross-school network exposure model: public application edge, private backends and restricted administration.
const exposureProgression = await readFile(join(curriculumDocsDir, "network-access-and-exposure-progression.md"), "utf8");
for (const required of ["the public edge exposes only the HTTPS application path", "administrative access remains separate from public ingress", "PostgreSQL | Backend/private only", "Keycloak | Public only for the identity endpoints required by the chosen authentication flow; administration remains restricted"]) {
  if (!exposureProgression.includes(required)) failures.push(`Network exposure invariant is missing: ${required}`);
}

// Canonical increment contract must keep conditional shared artifacts distinct from required implementation history.
const incrementContract = await readFile(join(curriculumDocsDir, "steward-increment-contract.md"), "utf8");
for (const required of ["steward-common is conditional", "earned extraction history or the evidence-backed defer decision", "tsa-test-core is different"]) {
  if (!incrementContract.includes(required)) failures.push(`Canonical shared-artifact lifecycle invariant is missing: ${required}`);
}

// Preserve schema-evolution and recovery semantics across Delivery, Reliability and Architecture.
const schemaEvolution = sources.get("delivery-production-schema-evolution-deep.ts") ?? "";
const databaseStewardship = sources.get("reliability-database-stewardship-deep.ts") ?? "";
const disasterRecovery = sources.get("reliability-data-protection-disaster-recovery-deep.ts") ?? "";
for (const required of ["Expand: add backward-compatible schema/state", "Switch: make the new application behavior authoritative only after compatibility and data conditions are proven.", "Contract: remove obsolete schema only after old application versions and rollback paths no longer depend on it.", "Rolling back application bytes is not the same as rolling back persistent data."]) {
  if (!schemaEvolution.includes(required)) failures.push(`Schema-evolution invariant is missing: ${required}`);
}
for (const required of ["Separate application runtime privileges from migration/administration privileges.", "Recovery is demonstrated through restore, not inferred from backup success."]) {
  if (!databaseStewardship.includes(required)) failures.push(`Database stewardship invariant is missing: ${required}`);
}
for (const required of ["any internal packages whose earlier extraction gates were actually earned", "include an internal package only if its extraction gate was actually earned"]) {
  if (!disasterRecovery.includes(required)) failures.push(`Disaster-recovery artifact lifecycle invariant is missing: ${required}`);
}

// Preserve distinct observability signal ownership while allowing evidence-driven backend evolution.
const reliabilityTracing = sources.get("reliability-distributed-tracing-implementation-deep.ts") ?? "";
const reliabilityObservability = sources.get("reliability-observability-stack-integration-deep.ts") ?? "";
for (const required of ["OpenTelemetry is the instrumentation and telemetry propagation standard used by Steward.", "Grafana Tempo is TSA's primary tracing backend for the implementation exercise.", "Prometheus/Grafana remain the primary metrics and dashboard path; Graylog remains the primary centralized log-management path."]) {
  if (!reliabilityTracing.includes(required)) failures.push(`Tracing ownership invariant is missing: ${required}`);
}
for (const required of ["Graylog owns centralized log ingestion/search/retention; Prometheus owns metric time series and PromQL evaluation; Grafana owns metrics-oriented dashboards/exploration.", "without turning Graylog into a second metrics backend or Grafana into the authoritative log-management system", "rather than duplicating the same capability"]) {
  if (!reliabilityObservability.includes(required)) failures.push(`Observability ownership invariant is missing: ${required}`);
}

// Preserve evidence-earned distributed-state semantics without freezing later technology choices.
const distributedState = sources.get("system-thinker-distributed-state-messaging-deep.ts") ?? "";
for (const required of ["technologies are required outcomes of earned pressure, not badges of architectural maturity", "PostgreSQL remains authoritative.", "Authorization/domain correctness remains synchronous.", "authoritative domain update and outbox insert commit in the same PostgreSQL transaction", "outbox does not claim distributed exactly-once semantics"]) {
  if (!distributedState.includes(required)) failures.push(`Distributed-state lifecycle invariant is missing: ${required}`);
}
const architectMessaging = sources.get("architect-integration-and-messaging-deep.ts") ?? "";
for (const required of ["Do not add one to make architecture appear advanced", "Record a no-broker decision when evidence is insufficient.", "No unnecessary broker is introduced."]) {
  if (!architectMessaging.includes(required)) failures.push(`Architect messaging reassessment invariant is missing: ${required}`);
}

// Preserve workforce identity authority through directory federation.
const directoryFederation = sources.get("security-enterprise-directory-federation-deep.ts") ?? "";
for (const required of ["two competing workforce authorities", "Steward is not designed to authenticate directly against LDAP.", "only the selected authority is active for this scenario"]) {
  if (!directoryFederation.includes(required)) failures.push(`Directory federation authority invariant is missing: ${required}`);
}

// Preserve public-TLS and internal workload-PKI ownership boundaries.
const internalPki = sources.get("security-internal-pki-machine-trust-deep.ts") ?? "";
for (const required of ["Public ACME remains responsible for the internet-facing Kong certificate", "one authoritative internal workload-PKI design, not two permanent issuers"]) {
  if (!internalPki.includes(required)) failures.push(`Internal PKI authority invariant is missing: ${required}`);
}

// Preserve the Cloud -> Security secrets handoff and evidence-earned Vault implementation.
const cloudSecretsBoundary = sources.get("cloud-orchestration-gitops-deep.ts") ?? "";
const securityIdentitySecrets = sources.get("security-identity-secrets-deep.ts") ?? "";
const securityVault = sources.get("security-vault-implementation-deep.ts") ?? "";
for (const required of ["Kubernetes Secret is not equivalent to Vault-style secret management.", "Git is desired state, not a secret vault", "Secrets are not moved into Git for convenience."]) {
  if (!cloudSecretsBoundary.includes(required)) failures.push(`Cloud secrets handoff is missing: ${required}`);
}
for (const required of ["Vault Requirement Gate: Prove the Dynamic-Credential Need", "measured lifecycle problem becomes the prerequisite", "secret zero"]) {
  if (!securityIdentitySecrets.includes(required)) failures.push(`Security Vault requirement gate is missing: ${required}`);
}
for (const required of ["Steward uses a real Vault-issued PostgreSQL credential.", "leased/dynamic rather than a static value merely stored in Vault KV", "does not silently fall back to an unmanaged permanent credential"]) {
  if (!securityVault.includes(required)) failures.push(`Vault implementation evidence contract is missing: ${required}`);
}

// Preserve infrastructure/configuration/workload ownership across Delivery and Cloud.
const deliveryConfiguration = sources.get("delivery-configuration-management-deep.ts") ?? "";
const cloudInfrastructure = sources.get("cloud-infrastructure-as-code-deep.ts") ?? "";
const cloudOrchestration = sources.get("cloud-orchestration-gitops-deep.ts") ?? "";
for (const required of ["host-level assumptions", "Ansible"]) {
  if (!deliveryConfiguration.includes(required)) failures.push(`Delivery configuration-management ownership is missing: ${required}`);
}
for (const required of ["One state needs one writer", "A real object should be managed by one resource address"]) {
  if (!cloudInfrastructure.includes(required)) failures.push(`OpenTofu ownership invariant is missing: ${required}`);
}
for (const required of ["OpenTofu creates infrastructure, Ansible manages host state, GitLab CI/CD builds and publishes artifacts, and Kubernetes reconciles application workload state.", "No responsibility has two accidental authorities.", "One field should have one deliberate owner"]) {
  if (!cloudOrchestration.includes(required)) failures.push(`Cloud responsibility-boundary invariant is missing: ${required}`);
}

// Preserve the simple reverse-proxy -> Kong edge migration without permanent dual ingress.
const cloudInternetNetworking = sources.get("cloud-internet-networking-deep.ts") ?? "";
const cloudInternetQuality = sources.get("cloud-internet-networking-quality.ts") ?? "";
for (const required of ["migrates that public boundary to Kong", "initial reverse proxy", "Kong API edge"]) {
  if (!cloudInternetNetworking.includes(required)) failures.push(`Cloud public-edge progression is missing: ${required}`);
}
for (const required of ["Kong has not been earned yet at this point.", "Migrate rather than operate two competing public edges.", "Retire the old public proxy path after Kong passes equivalent routing/TLS checks", "Only one authoritative public reverse-proxy/gateway implementation is operated."]) {
  if (!cloudInternetQuality.includes(required)) failures.push(`Cloud Kong migration lifecycle is missing: ${required}`);
}

// Preserve the GitLab -> Argo CD deployment-authority migration without dual control.
const cloudGitOps = sources.get("cloud-orchestration-gitops-deep.ts") ?? "";
const cloudMilestone = sources.get("cloud-engineer-milestone-deep.ts") ?? "";
const progressiveDelivery = sources.get("cloud-progressive-delivery-canary-deep.ts") ?? "";
for (const required of ["GitLab CI/CD remains responsible for build/test/package/publish.", "Argo CD becomes the only reconciler for the chosen environment after migration.", "does not make both systems authoritative at once"]) {
  if (!cloudGitOps.includes(required)) failures.push(`Cloud GitOps deployment-authority contract is missing: ${required}`);
}
for (const required of ["direct GitLab CI/CD push deployment is not simultaneously authoritative", "There is one authoritative deployment model for the environment."]) {
  if (!cloudMilestone.includes(required)) failures.push(`Cloud milestone deployment-authority proof is missing: ${required}`);
}
for (const required of ["Argo Rollouts is introduced for one concrete canary requirement, not as a second GitOps controller replacing Argo CD.", "Argo CD remains responsible for reconciling desired deployment configuration from Git"]) {
  if (!progressiveDelivery.includes(required)) failures.push(`Progressive delivery must preserve Argo CD authority: ${required}`);
}

// Preserve the legacy FTP -> secure SFTP migration as a real cross-school evolution.
const systemFileIntegrationMigration = sources.get("system-thinker-enterprise-file-integration-deep.ts") ?? "";
const securityFileMigration = sources.get("security-secure-file-transfer-migration-deep.ts") ?? "";
for (const required of ["Implement a Controlled Legacy FTP Exchange", "Prepare the FTP-to-SFTP Migration Contract", "Temporary coexistence has an explicit end state"]) {
  if (!systemFileIntegrationMigration.includes(required)) failures.push(`System Thinker secure-transfer handoff is missing: ${required}`);
}
for (const required of ["SFTP becomes the authoritative transfer path", "Run Bounded FTP and SFTP Coexistence", "Decommission FTP and Prove the Security End State", "FTP is no longer an available production-compatible transfer path."]) {
  if (!securityFileMigration.includes(required)) failures.push(`Security Steward FTP-to-SFTP migration lifecycle is missing: ${required}`);
}

// Preserve the System Thinker -> Platform Builder file-integration ownership boundary.
// System Thinker may model shared-filesystem semantics, but must not require the later NFS implementation.
const systemFileIntegration = sources.get("system-thinker-enterprise-file-integration-deep.ts") ?? "";
const platformFileServices = sources.get("platform-builder-enterprise-file-directory-services-deep.ts") ?? "";
for (const required of ["do not deploy NFS yet", "Platform Builder implementation handoff note"]) {
  if (!systemFileIntegration.includes(required)) failures.push(`System Thinker file integration must preserve pre-NFS handoff evidence: ${required}`);
}
for (const required of ["NFS is actually served and consumed across the network.", "Enterprise File Services: NFS and SMB"]) {
  if (!platformFileServices.includes(required)) failures.push(`Platform Builder must own implemented network file services: ${required}`);
}

// Compare reconciled school path IDs and order against executable registries.
const planned = sources.get("technical-stewardship-journey.ts") ?? "";

// The first two schools are wired directly rather than replaced in academy-journey.ts.
if (!planned.includes('{ id: "engineering-apprentice", title: "Engineering Apprentice", paths: [engineeringFoundations] }')) {
  failures.push("Engineering Apprentice must remain wired to engineeringFoundations in the canonical journey");
}
if (!planned.includes('{ id: "builder", title: "Builder", paths: builderPaths }')) {
  failures.push("Builder must remain wired to builderPaths in the canonical journey");
}
const schoolRegistries = {
  builder: ["builder.ts", "builderPaths"],
  "platform-builder": ["platform-builder.ts", "platformBuilderPaths"],
  "system-thinker": ["system-thinker.ts", "systemThinkerPaths"],
  "delivery-engineer": ["delivery-engineer.ts", "deliveryEngineerPaths"],
  "cloud-engineer": ["cloud-engineer.ts", "cloudEngineerPaths"],
  "quality-steward": ["quality-steward.ts", "qualityStewardPaths"],
  "security-steward": ["security-steward.ts", "securityStewardPaths"],
  "reliability-engineer": ["reliability-engineer.ts", "reliabilityEngineerPaths"],
  architect: ["architect.ts", "architectPaths"],
  "technical-steward": ["technical-steward.ts", "technicalStewardPaths"],
  "professional-engineer": ["professional-engineer.ts", "professionalEngineerPaths"],
};
for (const [schoolId, [file, arrayName]] of Object.entries(schoolRegistries)) {
  const section = planned.split(`{ id: "${schoolId}", title:`)[1]?.split("]},")[0] ?? "";
  const expected = [...section.matchAll(/module\("([^"]+)"/g)].map((m) => m[1]);
  const registry = sources.get(file) ?? "";
  const tail = registry.split(`export const ${arrayName}:`)[1] ?? "";
  const symbols = tail.match(/=\s*\[([^\]]+)\]/)?.[1]?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];
  const actual = symbols.map((symbol) => {
    const definition = registry.split(`export const ${symbol}`)[1] ?? "";
    const direct = definition.match(/\bid:\s*"([^"]+)"/)?.[1];
    const viaPath = definition.match(/=\s*path\("([^"]+)"/)?.[1];
    if (direct || viaPath) return direct ?? viaPath;
    // Some milestones are imported as already-authored paths.
    const importSource = registry.match(new RegExp(`import\\s*\\{[^}]*\\b${symbol}\\b[^}]*\\}\\s*from\\s*"([^"]+)"`))?.[1];
    const imported = importSource ? sources.get(importSource.replace("./", "") + ".ts") ?? "" : "";
    return imported.match(new RegExp(`(?:export const )?${symbol}[^=]*=\\s*\\{\\s*id:\\s*"([^"]+)"`))?.[1] ?? null;
  });
  if (!expected.length || !actual.length || actual.includes(null) || JSON.stringify(expected) !== JSON.stringify(actual)) {
    failures.push(`planned/runtime path drift in ${schoolId}: planned=${expected.join(",")} runtime=${actual.join(",")}`);
  }
}

if (failures.length) {
  console.error("Curriculum integrity audit failed:\n- " + failures.join("\n- "));
  process.exit(1);
}
console.log(`Curriculum integrity audit passed: ${files.length} runtime path files checked; school wiring, planned/runtime path parity, lesson-array reachability, milestone composition, canonical CI architecture, evidence-gated shared-library lifecycles across Builder, Delivery, Quality and Security, plus cross-school file-integration ownership, are clean.`);
