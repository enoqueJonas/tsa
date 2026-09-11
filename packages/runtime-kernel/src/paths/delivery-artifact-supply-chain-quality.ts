import type { PracticalContent } from "../activities/content";
import type { Lesson } from "./lesson";
import { artifactDependencySupplyChainDeepLessons } from "./delivery-artifact-supply-chain-deep";

type PracticeProfile = Pick<PracticalContent, "objective" | "scenario" | "deliverables" | "completionCriteria">;

const profiles: Record<string, PracticeProfile> = {
    "Why Organizations Use Internal Artifact Repositories": {
        objective: "Prove that Steward has a real distribution problem that source control and developer-local files do not solve.",
        scenario: "steward-common and Steward images can be built, but another repository or clean CI worker still depends on producer-local state. Decide what an internal repository must remove from that path.",
        deliverables: ["Producer-to-consumer dependency map", "Local-state failure points", "Repository capability decision"],
        completionCriteria: ["The repository is justified by an actual cross-machine or cross-repository need.", "Version control and artifact distribution are not conflated.", "At least one current local-only dependency is identified for removal."],
    },
    "Package Registries versus Artifact Repositories": {
        objective: "Map Steward artifacts to the protocols and repository formats their real clients require.",
        scenario: "The team proposes putting wheels, npm tarballs and container layers in one generic shared directory. Determine what each client actually expects before selecting repository formats.",
        deliverables: ["Artifact-format/client matrix", "Protocol boundary notes", "Repository-manager rationale"],
        completionCriteria: ["pip, pnpm and OCI clients are mapped to their real protocol needs.", "Nexus is treated as a multi-format repository manager, not a generic file share.", "Unnecessary repository formats are explicitly omitted."],
    },
    "Public and Private Dependencies": {
        objective: "Make ownership and trust visible across Steward's direct and transitive dependency graph.",
        scenario: "A clean Steward build mixes organization-owned packages with public dependencies behind one future Nexus endpoint. Determine which responsibilities remain different despite one resolution path.",
        deliverables: ["Dependency ownership inventory", "Upstream-risk observation", "Internal-vs-public responsibility note"],
        completionCriteria: ["Internal ownership is not treated as automatic trust.", "At least one transitive dependency is traced to its source.", "An upstream availability or ownership risk is connected to the repository design."],
    },
    "Repository Manager Architecture": {
        objective: "Design Nexus as real homelab infrastructure with explicit clients, persistence and trust boundaries.",
        scenario: "Jenkins must publish, deployment hosts must pull, developers may consume packages and administrators must operate Nexus. A single shared credential and disposable data directory would make the platform fragile.",
        deliverables: ["Nexus topology", "Client/permission boundary map", "Persistent-state and recovery boundary"],
        completionCriteria: ["Publisher, consumer and administrator paths are separate.", "Disposable service state is distinguished from durable repository state.", "The topology fits the existing Rocky Linux, WireGuard and backend-network model."],
    },
    "Hosted, Proxy and Group Repositories": {
        objective: "Design hosted, proxy and group repositories around producer and consumer responsibilities rather than convenience alone.",
        scenario: "Steward needs private publication plus controlled public dependency resolution. Configure the repository model so ordinary consumers cannot accidentally become publishers.",
        deliverables: ["Hosted/proxy/group layout", "Publish-vs-consume endpoint map", "Ownership-preserving resolution decision"],
        completionCriteria: ["Publishing targets hosted repositories.", "Consumers use an intentional group/proxy path.", "Repository grouping simplifies clients without obscuring artifact origin."],
    },
    "Python and PyPI Package Distribution": {
        objective: "Turn steward-common into an independently buildable Python distribution whose identity can survive outside the source tree.",
        scenario: "A clean CI worker must install steward-common without editable installs, copied source or filesystem links.",
        deliverables: ["Wheel and source distribution", "Package metadata inspection", "Name/version-to-artifact evidence"],
        completionCriteria: ["The package builds from versioned source.", "The artifact exposes intentional name and version metadata.", "No consumer-local source path is required to understand the distribution contract."],
    },
    "npm Package Distribution": {
        objective: "Define an internal npm package only where Steward has a credible reuse boundary and give it an unambiguous registry identity.",
        scenario: "The enterprise platform supports npm, but TSA must not manufacture a fake package merely to exercise Nexus. Decide whether a real Steward client/shared package exists yet.",
        deliverables: ["Adopt-or-defer package decision", "Package identity when justified", "Intended consumer and registry contract"],
        completionCriteria: ["A package is created only for a credible reuse case.", "Internal naming avoids accidental public collision.", "The consumer boundary is explicit rather than inferred from monorepo layout."],
    },
    "Container Registries": {
        objective: "Define how the exact Steward image produced by Jenkins becomes retrievable from infrastructure rather than a developer-local Docker cache.",
        scenario: "The deployment host must retrieve the same bytes CI produced, even if the CI worker disappears.",
        deliverables: ["Image naming convention", "Tag-to-digest traceability", "Registry handoff diagram"],
        completionCriteria: ["Image digest is treated as immutable identity.", "The deployment path no longer depends on a workstation-local image.", "Build-once/promote-many remains intact."],
    },
    "Deploying Nexus Repository in the Homelab": {
        objective: "Deploy Nexus as a persistent, privately administered service on the Rocky Linux homelab and prove its operational boundary.",
        scenario: "Nexus is now required by Jenkins and deployment workflows. Install it without exposing administration publicly or losing repository state when the service instance is recreated.",
        deliverables: ["Running Nexus service", "Persistent-storage evidence", "Network-access proof", "Resource and recovery notes"],
        completionCriteria: ["Nexus is reachable through the intended private-management/client paths only.", "Repository data survives service recreation.", "Placement is justified against current homelab capacity.", "The service does not require undocumented manual host preparation outside the established Ansible boundary."],
    },
    "Repository Authentication and Permissions": {
        objective: "Prove least privilege in Nexus with separate administrator, publisher and consumer capabilities.",
        scenario: "Jenkins needs publish rights while developers and deployment hosts usually need read access. A shared administrator credential would make every client unnecessarily privileged.",
        deliverables: ["Role/permission matrix", "Successful authorized-operation evidence", "Denied-operation evidence"],
        completionCriteria: ["Jenkins can publish without administrative rights.", "A read-only identity cannot upload or mutate artifacts.", "Secrets are not stored in repository source or plaintext inventory."],
    },
    "Publishing Internal Python Packages": {
        objective: "Publish an immutable steward-common version from a verified build and preserve source-to-artifact evidence.",
        scenario: "A package that passes locally should not become an internal release unless Jenkins can verify, build and publish it reproducibly with a non-admin identity.",
        deliverables: ["Published steward-common version", "Source/build/publication trace", "Rejected invalid or duplicate publication evidence"],
        completionCriteria: ["Verification precedes publication.", "Published bytes map to one source revision and version.", "A failed verification or disallowed overwrite fails closed."],
    },
    "Consuming Internal Packages with pip": {
        objective: "Prove Steward API can install steward-common from the approved Nexus index on a clean consumer with no producer-local state.",
        scenario: "The consumer must behave as if the steward-common source repository is unavailable and only Nexus remains.",
        deliverables: ["Consumer index configuration", "Clean-install evidence", "Version-resolution decision"],
        completionCriteria: ["No workspace link, copied wheel or editable install is required.", "The selected version policy is explicit.", "Failure of the approved repository path is visible rather than silently bypassed by a local artifact."],
    },
    "Publishing Internal npm Packages": {
        objective: "Publish a justified internal npm package with controlled contents and immutable release meaning.",
        scenario: "A reusable Steward frontend/client package exists and must move from monorepo-local consumption to independent distribution.",
        deliverables: ["Package-content inspection", "Published internal version", "Source-to-package trace"],
        completionCriteria: ["The packed contents contain only intended consumer files.", "The package version is deliberate and independently consumable.", "No secrets or developer-local state enter the published tarball."],
    },
    "Consuming Internal Packages with npm and pnpm": {
        objective: "Make pnpm resolve internal Steward packages through the approved Nexus path while preserving repeatable dependency selection.",
        scenario: "A clean consumer should resolve the internal package without depending on the producer monorepo and without ambiguous public fallback.",
        deliverables: ["Registry/scope configuration", "Lockfile resolution evidence", "Clean-consumer proof"],
        completionCriteria: ["Internal package resolution follows the intended namespace and registry path.", "The lockfile records the selected dependency graph.", "The learner can distinguish repeatability evidence from trust evidence."],
    },
    "Publishing Steward Container Images Internally": {
        objective: "Make Jenkins publish the validated Steward image to Nexus and make deployment consume that exact artifact by stable identity.",
        scenario: "CI currently builds a usable image, but the release path is incomplete until the image is stored outside the agent and can be pulled independently.",
        deliverables: ["Published Steward image", "Commit-build-tag-digest chain", "Independent pull evidence"],
        completionCriteria: ["The image is built once and pushed after required checks.", "Deployment can pull it without the original CI workspace.", "The recorded digest matches the published content used for release evidence."],
    },
    "Proxying and Caching Public Dependencies": {
        objective: "Prove the value and limits of Nexus proxy caching using a controlled dependency-resolution experiment.",
        scenario: "Steward depends on public ecosystems, but repeated builds should use a governed path and tolerate a short upstream interruption where cached content already exists.",
        deliverables: ["Proxy resolution evidence", "Warm-cache behavior observation", "Namespace/confusion risk note"],
        completionCriteria: ["A dependency is resolved through the proxy rather than directly by accident.", "Cached and uncached behavior are distinguished.", "The design does not imply that cached public artifacts become internally owned."],
    },
    "Internal Package Versioning": {
        objective: "Use a real steward-common change to decide whether its next version is patch, minor or major and prove the consumer impact.",
        scenario: "Producer and consumer should be able to release independently; a breaking package change disguised as a patch would destroy that contract.",
        deliverables: ["Compatibility-impact analysis", "Version decision", "Consumer verification evidence"],
        completionCriteria: ["Version choice follows the package's public contract.", "A consumer impact is tested rather than guessed.", "The decision avoids implicit lockstep deployment."],
    },
    "Prerelease, Snapshot and Release Concepts": {
        objective: "Model a release candidate lifecycle without changing artifact bytes after evidence has been collected.",
        scenario: "A Steward artifact is ready for evaluation but not yet approved as stable. Promotion must increase confidence without silently replacing what reviewers tested.",
        deliverables: ["Candidate-to-release lifecycle", "Immutable identity evidence", "Promotion decision"],
        completionCriteria: ["Candidate and stable-release meaning are distinct.", "Promotion preserves traceability to evaluated content.", "Mutable overwrite is rejected as a release strategy."],
    },
    "Artifact Retention and Cleanup": {
        objective: "Create a retention policy that saves homelab storage without deleting evidence or artifacts required for rollback.",
        scenario: "Nexus storage is finite, but deleting by age alone could remove the image or package needed to reconstruct a supported Steward release.",
        deliverables: ["Artifact lifecycle classification", "Retention/cleanup rule", "Protected rollback set"],
        completionCriteria: ["Currently deployed and known-good rollback artifacts are protected.", "Ephemeral artifacts have a justified cleanup rule.", "The policy is tied to lifecycle meaning rather than arbitrary age alone."],
    },
    "Dependency Provenance": {
        objective: "Construct a traceable Steward provenance chain from source and upstream inputs to the artifact stored in Nexus.",
        scenario: "An operator investigating a release must be able to answer where its image/package came from without rebuilding it or trusting a human label.",
        deliverables: ["Source-to-CI-to-Nexus provenance record", "Third-party origin sample", "Missing-evidence assessment"],
        completionCriteria: ["Version, source revision, CI run and immutable artifact identity are connected.", "At least one public dependency is traced to its upstream source.", "A missing provenance fact is identified as an explicit risk rather than silently assumed."],
    },
    "SBOM Fundamentals": {
        objective: "Generate an SBOM for a specific Steward artifact and prove that it is inventory evidence, not a vulnerability verdict.",
        scenario: "Security work later needs a reproducible component inventory tied to the same image/package that Delivery Engineer publishes today.",
        deliverables: ["CycloneDX or SPDX SBOM", "Artifact-to-SBOM identity link", "Composition observation"],
        completionCriteria: ["The SBOM is generated from a known artifact/build.", "Its identity is tied to that artifact.", "The learner can explain what the SBOM does not prove."],
    },
    "Signing and Provenance Concepts": {
        objective: "Place signing correctly in Steward's trust chain without pretending key-management and enforcement are already solved.",
        scenario: "The team wants signed artifacts, but Delivery Engineer must first identify what would be signed, by whom and what a verifier could actually conclude.",
        deliverables: ["Signing trust-boundary diagram", "Signer/verifier responsibilities", "Security-Steward handoff"],
        completionCriteria: ["Signature integrity is distinguished from signer trust.", "No unmanaged production signing key is introduced merely for the exercise.", "Later verification/policy work has a clear handoff."],
    },
    "Dependency, Package and Image Scanning": {
        objective: "Run or model scanning against a known Steward artifact and turn findings into evidence without prematurely inventing Security Steward policy.",
        scenario: "A scanner reports findings, but release decisions require artifact identity, context and ownership rather than a raw severity list.",
        deliverables: ["Scan output tied to artifact identity", "Finding triage sample", "Deferred policy questions"],
        completionCriteria: ["Scan results map to exact package/image content.", "At least one finding is interpreted beyond severity score alone.", "Policy enforcement that belongs to Security Steward remains explicitly deferred."],
    },
};

function enrichLesson(lesson: Lesson): Lesson {
    if (lesson.title.startsWith("Lab:")) return lesson;
    const profile = profiles[lesson.title];
    if (!profile) return lesson;

    return {
        ...lesson,
        activities: lesson.activities.map((activity) => {
            if (activity.content.type !== "practical") return activity;
            return {
                ...activity,
                title: `${lesson.title}: Steward Engineering Practice`,
                estimatedMinutes: Math.max(activity.estimatedMinutes, 60),
                content: {
                    ...activity.content,
                    ...profile,
                },
            };
        }),
    };
}

export const artifactDependencySupplyChainQualityLessons: Lesson[] = artifactDependencySupplyChainDeepLessons.map(enrichLesson);
