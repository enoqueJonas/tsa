import type { Lesson } from "./lesson";
import { plannedPath } from "./planned-path";

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
    title: "Lab: Extract steward-common",
    activities: [
        {
            id: "software-craft-extract-steward-common-001",
            title: "Extract and Consume an Internal Python Package",
            estimatedMinutes: 60,
            content: {
                type: "practical",
                objective: "Create a small reusable Python package from genuinely shared Steward behavior and consume it without copying its source into the application.",
                scenario: "A second internal Steward component is expected to need behavior currently owned by Steward API. Treat this as a package-design problem now; private repository distribution will be solved during Delivery Engineer.",
                instructions: [
                    "Identify behavior that is genuinely reusable and explain why it belongs outside the API application boundary.",
                    "Define the package public API and keep framework-specific coupling out unless it is intentional.",
                    "Create a buildable Python distribution provisionally named steward-common.",
                    "Assign an initial semantic version and document its compatibility expectations.",
                    "Consume the package locally from Steward API without duplicating its source code.",
                    "Demonstrate what happens when the consumer depends on a version or API that is incompatible.",
                    "Record the distribution problem that remains: another repository should not need filesystem access or copied source to install the package.",
                ],
                deliverables: [
                    "steward-common package source",
                    "Package metadata and version",
                    "Steward API consuming the package",
                    "Short package-boundary and compatibility note",
                ],
                completionCriteria: [
                    "The extracted code has a credible reuse case rather than existing only to satisfy the lab.",
                    "The package can be built and installed independently.",
                    "Steward API consumes the package through its package interface.",
                    "The learner can explain why an internal package repository becomes necessary as consumers move to separate repositories and CI environments.",
                ],
            },
        },
    ],
};

export const artifactDependencySupplyChainManagement = plannedPath(
    "artifact-and-supply-chain",
    "Artifact, Dependency and Supply-Chain Management",
    [
        "Why Organizations Use Internal Artifact Repositories",
        "Package Registries versus Artifact Repositories",
        "Public and Private Dependencies",
        "Repository Manager Architecture",
        "Hosted, Proxy and Group Repositories",
        "Python and PyPI Package Distribution",
        "npm Package Distribution",
        "Container Registries",
        "Deploying Nexus Repository in the Homelab",
        "Repository Authentication and Permissions",
        "Publishing Internal Python Packages",
        "Consuming Internal Packages with pip",
        "Publishing Internal npm Packages",
        "Consuming Internal Packages with npm and pnpm",
        "Publishing Steward Container Images Internally",
        "Proxying and Caching Public Dependencies",
        "Internal Package Versioning",
        "Prerelease, Snapshot and Release Concepts",
        "Artifact Retention and Cleanup",
        "Dependency Provenance",
        "SBOM Fundamentals",
        "Signing and Provenance Concepts",
        "Dependency, Package and Image Scanning",
        "Lab: Build the Steward Internal Artifact Repository",
        "Lab: Publish and Consume steward-common through CI",
    ]
);
