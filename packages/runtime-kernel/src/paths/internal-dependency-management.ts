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
            estimatedMinutes: 35,
            content: {
                type: "reading",
                body: "Organizations often own libraries used by multiple internal products. A reusable package needs a deliberate public API, versioning and ownership boundaries; extracting code merely because two files look similar can create worse coupling. Builder introduces the producer side of this problem before Delivery Engineer introduces private repository infrastructure.",
                blocks: [
                          {
                                    "type": "paragraph",
                                    "text": "A Python module is one importable file, a Python package is a set of importable modules, and a distribution is a versioned installable artifact that can expose those imports to other applications. Those are three distinct boundaries. Moving two functions into a folder does not by itself create a useful reusable library. An internal package becomes a long-lived product with public imports, consumer compatibility, releases, testing, vulnerability and license responsibilities. The benefit must exceed the coupling and upgrade cost. This reading distinguishes a real shared capability from speculative reuse before any build/publish instructions."
                          },
                          {
                                    "type": "heading",
                                    "id": "find-consumers",
                                    "text": "1. Identify actual consumers and the shared problem",
                                    "level": 2
                          },
                          {
                                    "type": "paragraph",
                                    "text": "Start with an evidence table: consumer repository/service, operation that duplicates behavior, existing tests, release cadence and whether the behavior needs Steward-specific models. The Steward API calling its own helper function is not a second independent consumer. Two code paths inside one service do not automatically justify publishing a distribution. Suppose a separate CLI and an independent reporting service both need a stable, domain-neutral identifier codec and currently have incompatible copies; then a shared versioned API might be justified. If only Steward needs it today, keep it local and record what observation would reopen the decision."
                          },
                          {
                                    "type": "heading",
                                    "id": "coupling",
                                    "text": "2. A package boundary has costs that source-copying hides",
                                    "level": 2
                          },
                          {
                                    "type": "paragraph",
                                    "text": "When a consumer imports steward_common.identifiers.normalize, that name, parameter behavior, returned type, exception contract and side effects become an interface. The library must not silently depend on Django settings, the current database, an authenticated request, or internal Team model instances if those consumers cannot supply such context. Shared business policy can be particularly dangerous: two products may have similar method names but different authorization or lifecycle rules. Use input/output contracts and ownership to decide whether reuse is genuine, not the number of duplicated lines."
                          },
                          {
                                    "type": "heading",
                                    "id": "executable-incompatibility",
                                    "text": "3. Reproduce an API-breaking change before discussing SemVer",
                                    "level": 2
                          },
                          {
                                    "type": "paragraph",
                                    "text": "This executable example represents a consumer that expects a colon-delimited string. A proposed new version returns a dictionary. Both implementations are valid Python, but the old consumer cannot use the new return type. The test makes the break observable without building or publishing an internal package. It demonstrates the meaning of an interface compatibility commitment; it does not prove either representation is universally superior."
                          },
                          {
                                    "type": "code",
                                    "language": "python",
                                    "caption": "Internal package contract — executable incompatible consumer case",
                                    "code": "def public_api_v1(team, service):\n    return f'{team}:{service}'\n\ndef public_api_v2(team, service):\n    return {'team': team, 'service': service}\n\ndef existing_consumer(key):\n    return key.split(':')[0]\n\nassert existing_consumer(public_api_v1('Payments', 'Payroll')) == 'Payments'\ntry:\n    existing_consumer(public_api_v2('Payments', 'Payroll'))\nexcept AttributeError:\n    print('BREAKING CHANGE: existing consumer expects a string')\nelse:\n    raise AssertionError('incompatibility was not observed')",
                                    "output": "BREAKING CHANGE: existing consumer expects a string"
                          },
                          {
                                    "type": "heading",
                                    "id": "distribution",
                                    "text": "4. Modules, distribution metadata and publication are separate steps",
                                    "level": 2
                          },
                          {
                                    "type": "paragraph",
                                    "text": "If extraction is justified, use a real Python package layout with tests, pyproject.toml metadata, a declared build backend, distribution name, version and supported Python versions. The import name (e.g., steward_common) and distribution name (e.g., steward-common) serve different purposes. A private registry such as Nexus distributes built wheels and controls dependency resolution; it does not establish whether the public API is worth sharing. The following TOML is an illustrative metadata sketch, not a full buildable repository. A real wheel also needs package source files and backend configuration. Use an isolated environment and build/test before publishing."
                          },
                          {
                                    "type": "code",
                                    "language": "toml",
                                    "caption": "Illustrative pyproject.toml for an extracted package — not a complete repository",
                                    "code": "[build-system]\nrequires = [\"hatchling>=1.26\"]\nbuild-backend = \"hatchling.build\"\n\n[project]\nname = \"steward-common\"\nversion = \"0.1.0\"\nrequires-python = \">=3.12\"\ndependencies = []"
                          },
                          {
                                    "type": "heading",
                                    "id": "release-compatibility",
                                    "text": "5. Versions, consumers and upgrade ownership",
                                    "level": 2
                          },
                          {
                                    "type": "paragraph",
                                    "text": "Under a SemVer-style policy, incompatible public API changes normally require a major version bump, backward-compatible features a minor bump, and backward-compatible bug fixes a patch bump. Python distribution version comparison follows PEP 440, so distinguish how version strings are parsed from what a team's compatibility promise means; especially in a 0.x project, promises should be documented rather than assumed. For each release, test the published wheel in at least two real consumer builds and record exact dependency resolution. Pinning a version improves reproducibility but creates maintenance obligations; staying pinned forever also misses security fixes."
                          },
                          {
                                    "type": "heading",
                                    "id": "decision",
                                    "text": "6. Make the extract-versus-defer decision falsifiable",
                                    "level": 2
                          },
                          {
                                    "type": "list",
                                    "ordered": true,
                                    "items": [
                                              "Name at least two real independent consumers, not two modules of the same Steward API.",
                                              "Demonstrate duplicated stable behavior with equivalent test cases and no hidden framework/database dependencies.",
                                              "Define the minimal public function/class contract, exceptions, security boundary and supported Python versions.",
                                              "Explain release ownership, compatibility tests, dependency upgrade policy and how consumers adopt fixes.",
                                              "Only then create a buildable distribution and private-registry plan. Otherwise document DEFERRED with a revisit trigger."
                                    ]
                          },
                          {
                                    "type": "callout",
                                    "tone": "warning",
                                    "title": "Do not manufacture a library to satisfy a lesson",
                                    "body": "The immediately following Steward practical accepts a justified non-extraction as full completion. Publishing a private wheel without a stable, independently consumed public API creates maintenance cost and may spread a flawed policy. Delivery Engineer later teaches artifact repositories and provenance after there is a genuine distribution to deliver."
                          },
                          {
                                    "type": "resources",
                                    "title": "Primary and deeper references",
                                    "resources": [
                                              {
                                                        "title": "Python Packaging User Guide — Packaging Python Projects",
                                                        "url": "https://packaging.python.org/en/latest/tutorials/packaging-projects/",
                                                        "kind": "documentation",
                                                        "read": "Package layout, pyproject.toml, build artifacts, local installation",
                                                        "purpose": "Shows how a versioned distribution actually gets built rather than only being a shared folder."
                                              },
                                              {
                                                        "title": "Python Packaging User Guide — Writing pyproject.toml",
                                                        "url": "https://packaging.python.org/en/latest/guides/writing-pyproject-toml/",
                                                        "kind": "documentation",
                                                        "read": "Build-system and project metadata; name, version, dependencies, requires-python",
                                                        "purpose": "Authoritative distinction between source package structure and distribution metadata."
                                              },
                                              {
                                                        "title": "Python Packaging User Guide — Versioning",
                                                        "url": "https://packaging.python.org/en/latest/discussions/versioning/",
                                                        "kind": "article",
                                                        "read": "Semantic versioning vs. calendar versioning; compatibility promises",
                                                        "purpose": "Explains why a version number does not automatically prove old-consumer compatibility."
                                              }
                                    ]
                          }
                ],
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
