import type { PracticalContent } from "../activities/content";
import type { Lesson } from "./lesson";
import { softwareDeliveryFoundationsDeepLessons } from "./delivery-software-foundations-deep";

const practices: Record<string, PracticalContent> = {
    "The Source-to-Production Lifecycle": {
        type: "practical",
        objective: "Map the current Steward path from an immutable commit to the Rocky Linux runtime and identify every mutable or untraceable transition.",
        scenario: "A teammate asks which exact source revision is running in the homelab. 'The latest one' is not acceptable evidence.",
        instructions: [
            "Choose one current Steward revision and record its commit SHA.",
            "Trace how that revision becomes something runnable in the Rocky Linux homelab today.",
            "Mark source, validation, artifact, release, deployment and verification states even where the current process skips one.",
            "Identify every manual copy, rebuild, mutable file or undocumented command that can break traceability.",
            "Define the minimum evidence needed to prove which source became which running release.",
        ],
        deliverables: ["Current source-to-runtime map", "Traceability-gap list", "Minimum release-evidence contract"],
        completionCriteria: ["Commit, artifact, release and deployment are treated as different states.", "At least one current weak transition is identified from evidence.", "The proposed evidence can identify the running source revision without relying on memory."],
    },
    "Git Workflows": {
        type: "practical",
        objective: "Define a low-ceremony Git integration policy that protects Steward's releasable line without recreating long-lived branch complexity.",
        scenario: "Delivery automation will soon consume the main branch, so branch policy must make integration frequent and the releasable source trustworthy.",
        instructions: [
            "Review the current Steward branch and merge pattern.",
            "Define which checks must pass before integration and which decisions still require human review.",
            "Model one short-lived change from branch creation through merge and artifact eligibility.",
            "Identify one branch rule that would add ceremony without reducing a real risk and explicitly reject it.",
            "Record how emergency fixes would preserve the same traceability expectations.",
        ],
        deliverables: ["Steward Git integration policy", "Change-to-main flow", "Rejected-ceremony rationale"],
        completionCriteria: ["The policy keeps main as a known integration point.", "Checks correspond to actual risks.", "The workflow avoids unnecessary long-lived branches."],
    },
    "Pull Requests and Reviews": {
        type: "practical",
        objective: "Turn a Steward pull request into a reviewable delivery decision with explicit scope, validation and release-impact evidence.",
        scenario: "A small-looking change touches configuration and a database migration. Review quality must follow risk rather than line count.",
        instructions: [
            "Select a recent or representative Steward change.",
            "Write the PR context, intended behavior, validation evidence and known risks another engineer would need.",
            "Classify delivery-impacting files such as dependencies, migrations, configuration, container definitions or deployment scripts.",
            "Write at least three review questions tied to failure or release risk.",
            "Define what evidence would block merge and what evidence would permit it.",
        ],
        deliverables: ["Risk-oriented PR brief", "Delivery-impact review checklist", "Merge/block evidence criteria"],
        completionCriteria: ["Review scope reflects delivery impact, not only code size.", "Evidence expectations are explicit.", "The change can be reviewed without verbal context from its author."],
    },
    "Semantic Versioning": {
        type: "practical",
        objective: "Version Steward and its internal packages from explicit compatibility contracts rather than arbitrary number increments.",
        scenario: "The application and shared packages will soon be published through delivery tooling. Consumers need to know whether an upgrade is safe.",
        instructions: [
            "Choose three representative changes: bug fix, backward-compatible feature and breaking contract change.",
            "Classify the semantic-version impact for Steward and, separately, for one internal package such as steward-common or tsa-test-core.",
            "State the public contract whose compatibility you are evaluating.",
            "Identify one ambiguous change where the version decision depends on an unstated contract and resolve that ambiguity.",
            "Define the version metadata that later pipelines must associate with an artifact.",
        ],
        deliverables: ["Version-classification table", "Explicit compatibility contract", "Artifact version-metadata requirements"],
        completionCriteria: ["Version decisions are tied to a defined public contract.", "Application and reusable-package compatibility are distinguished.", "Breaking changes are not hidden behind patch/minor numbers."],
    },
    "Conventional Commits": {
        type: "practical",
        objective: "Test whether structured commit metadata can support Steward release automation without allowing formatting rules to replace coherent history.",
        scenario: "Later pipelines may derive release notes or version signals from commit history, but automation is only useful if the history communicates real intent.",
        instructions: [
            "Inspect a small sample of existing Steward commit messages.",
            "Rewrite three representative messages into coherent Conventional Commit form without changing their meaning.",
            "Mark which messages should imply feature, fix or breaking-change release signals.",
            "Identify one commit that should be split or reorganized before formatting because its scope is incoherent.",
            "Define the minimum commit-message convention the repository should enforce, and what it should deliberately not enforce."],
        deliverables: ["Commit-history sample", "Release-signal mapping", "Minimal commit convention"],
        completionCriteria: ["Commit meaning remains more important than syntax.", "Breaking-change notation is explicit where applicable.", "The convention is small enough to support, not obstruct, delivery."],
    },
    "Release Notes and Changelogs": {
        type: "practical",
        objective: "Produce release communication that distinguishes implementation history from operator and consumer impact.",
        scenario: "A Steward release contains an API behavior change, a migration and an operational configuration adjustment. Git history alone is not a usable release brief.",
        instructions: [
            "Choose a representative set of changes and draft one release note from consumer/operator impact.",
            "Separate user-visible behavior, migration/configuration needs, operational considerations and known issues.",
            "Create or update a changelog entry that preserves longer-term release history.",
            "Identify one Git-level implementation detail that should not appear in release communication and one operational detail that must.",
            "Define the evidence a release note should link to once Jenkins/Nexus automation exists."],
        deliverables: ["Steward release note", "Changelog entry", "Release-evidence linkage plan"],
        completionCriteria: ["Release notes describe impact rather than raw commits.", "Migration or rollback constraints are explicit where relevant.", "Changelog and one-release notes serve different purposes."],
    },
    "Build Artifacts": {
        type: "practical",
        objective: "Define the immutable Steward artifact contract that later Jenkins and Nexus work will build and publish once, then promote unchanged.",
        scenario: "The current homelab can be updated manually, but the enterprise path requires a named artifact whose bytes and source identity do not change between environments.",
        instructions: [
            "Identify what currently gets copied or rebuilt when Steward is deployed.",
            "Define the deployable artifact boundary for the application at this stage without prematurely choosing later orchestration.",
            "Specify version, commit SHA, build timestamp or provenance and integrity metadata that must accompany it.",
            "Separate environment-specific configuration and secrets from the artifact.",
            "Describe how Nexus will later store and identify the artifact and why rebuilding for another environment would violate the contract."],
        deliverables: ["Steward artifact contract", "Artifact-vs-configuration boundary", "Future Nexus publication metadata"],
        completionCriteria: ["The artifact has one immutable identity.", "Environment credentials/URLs are not baked into separate builds.", "The contract is ready for later Jenkins/Nexus implementation."],
    },
    "Environment Promotion": {
        type: "practical",
        objective: "Design Steward's build-once promotion path from validated source to the Rocky homelab using evidence-based gates.",
        scenario: "The same release must move through delivery stages without being silently rebuilt or changed between them.",
        instructions: [
            "Start from the artifact contract created in the previous lesson.",
            "Define candidate, approval, deployment and verification transitions for Steward.",
            "For each gate, write the risk question it answers and the evidence required to pass.",
            "Mark which environment differences belong in runtime configuration rather than the artifact.",
            "Create a backlog of the current manual/untraceable steps that Automation, Containers, Jenkins, Ansible and Nexus must eliminate in later Delivery Engineer modules."],
        deliverables: ["Build-once promotion map", "Evidence-based gate table", "Delivery-automation backlog"],
        completionCriteria: ["The artifact remains unchanged across promotion stages.", "Every gate answers a specific risk question.", "The backlog hands concrete problems to later Delivery Engineer modules instead of installing tools without need."],
    },
};

export const softwareDeliveryFoundationsQualityLessons: Lesson[] = softwareDeliveryFoundationsDeepLessons.map((lesson) => {
    const practice = practices[lesson.title];
    if (!practice) return lesson;
    return {
        ...lesson,
        activities: [
            ...lesson.activities,
            {
                id: `${lesson.id}-practice`,
                title: `${lesson.title}: Steward Delivery Investigation`,
                estimatedMinutes: 60,
                content: practice,
            },
        ],
    };
});
