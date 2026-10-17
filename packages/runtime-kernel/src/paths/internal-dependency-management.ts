import type { Lesson } from "./lesson";
import type { LearningPath } from "./learning-path";
import { artifactDependencySupplyChainQualityLessons } from "./delivery-artifact-supply-chain-quality";

export const reusableInternalPackageLesson: Lesson = {
    id: "software-craft-internal-package-design",
    title: "Designing Reusable Internal Packages",
    activities: [
        {
            id: "software-craft-internal-package-design-001",
            title: "Internal Package Boundaries",
            estimatedMinutes: 15,
            content: {
                type: "reading",
                body: "Organizations often own libraries used by multiple internal products. A reusable package needs a deliberate public API, versioning and ownership boundaries; extracting code merely because two files look similar can create worse coupling. Builder introduces the producer side of this problem before Delivery Engineer introduces private repository infrastructure.",
            },
        },
    ],
};

export const extractStewardCommonLesson: Lesson = {
    id: "software-craft-extract-steward-common",
    title: "Lab: Evaluate steward-common Extraction",
    activities: [
        {
            id: "software-craft-extract-steward-common-001",
            title: "Extract and Consume an Internal Python Package",
            estimatedMinutes: 60,
            content: {
                type: "practical",
                objective: "Evaluate whether Steward has genuinely earned a reusable Python package; extract it only when independently useful consumers already demonstrate stable shared behavior.",
                scenario: "Expected future reuse is not enough evidence for extraction. Inspect real consumers and duplication first; private repository distribution is a separate Delivery concern that Nexus can satisfy when a package actually exists.",
                instructions: [
                    "Inventory independently useful external Steward consumers and the capabilities each currently implements.",
                    "Identify concrete duplicated behavior, if any, and explain why it is stable and product-independent enough to share.",
                    "Do not count the Steward server consuming its own extracted code as evidence of an external reuse boundary.",
                    "If fewer than two real consumers demonstrate the same stable capability, record steward-common as deferred and stop without creating the package.",
                    "If the threshold is met, define the smallest public API and keep framework/domain coupling out unless explicitly justified.",
                    "Create a buildable Python distribution provisionally named steward-common, assign an initial semantic version and update the real consumers to use it.",
                    "Demonstrate an incompatible consumer/version case and record the remaining independent-distribution problem that Nexus must solve.",
                ],
                deliverables: [
                    "Consumer and duplication inventory",
                    "Extraction-or-defer decision",
                    "Short package-boundary and compatibility note",
                    "steward-common source/version and real-consumer evidence only if extraction is earned",
                ],
                completionCriteria: [
                    "The decision is based on observed consumers and duplication rather than predicted reuse.",
                    "Deferral is accepted as complete when the extraction threshold is not met.",
                    "If extracted, the package builds independently and both real consumers pass through its public interface.",
                    "The learner can explain when an internal package repository becomes necessary as consumers move to separate repositories and CI environments.",
                ],
            },
        },
    ],
};

export const artifactDependencySupplyChainManagement: LearningPath = {
    id: "artifact-and-supply-chain",
    title: "Artifact, Dependency and Supply-Chain Management",
    lessons: [{
        id: "artifact-and-supply-chain-fieldwork-orientation",
        title: "Worked delivery model: Artifact, Dependency and Supply-Chain Management",
        activities: [{
            id: "artifact-and-supply-chain-fieldwork-reading",
            title: "Model, worked example and failure diagnosis",
            estimatedMinutes: 30,
            content: {
                type: "reading",
                body: "A dependency is an input to a build; an artifact is its output. Lockfiles, versions, provenance and repository access govern which exact bits ship.",
                blocks: [
                    { type: "heading", id: "model", text: "Understand the boundary before using tools", level: 2 },
                    { type: "paragraph", text: "Internal libraries have versioned public interfaces; build artifacts have immutable identities such as digests. A mutable tag is not reliable proof of what ran." },
                    { type: "heading", id: "worked-case", text: "Worked Steward case", level: 2 },
                    { type: "paragraph", text: "Pin an internal Steward package version, build the consuming service and record package version, commit SHA, registry path and image digest. Compare the approved digest with what is deployed." },
                    { type: "heading", id: "verification", text: "Expected verification", level: 2 },
                    { type: "paragraph", text: "A second installation from the lockfile must resolve the same dependency version. Verify the deployed image by digest, not only by human-readable tag." },
                    { type: "heading", id: "failure-analysis", text: "Failure analysis", level: 2 },
                    { type: "paragraph", text: "If a dependency source is unavailable, builds should fail explicitly; silently falling back to a mutable or untrusted repository breaks chain-of-custody assumptions." },
                ],
            },
        }],
    }, ...artifactDependencySupplyChainQualityLessons.map((lesson) => ({
        ...lesson,
        activities: lesson.activities.flatMap((activity) => {
            if (activity.content.type !== "practical") return [activity];
            const task = activity.content;
            return [{
                id: `${activity.id}-preparation`,
                title: `Prepare the supply-chain experiment: ${activity.title}`,
                estimatedMinutes: 20,
                content: {
                    type: "reading" as const,
                    body: `Supply-chain scenario: ${task.scenario}. The experiment must preserve dependency version and published artifact identity while proving unauthorized changes fail closed.`,
                    blocks: [
                        { type: "heading" as const, id: "expected-evidence", text: "Expected evidence", level: 2 as const },
                        { type: "list" as const, items: task.completionCriteria },
                        { type: "heading" as const, id: "negative-path", text: "Negative path and recovery", level: 2 as const },
                        { type: "paragraph" as const, text: "Before using live registries, verify this lab runs with test-only credentials. Record a pinned dependency, reproduce the artifact digest, then test a forbidden/invalid version or untrusted source in a disposable build. Preserve the original known-good version and restore it; never log tokens or private registry credentials." },
                        { type: "paragraph" as const, text: task.objective },
                    ],
                },
            }, activity];
        }),
    }))],
};
