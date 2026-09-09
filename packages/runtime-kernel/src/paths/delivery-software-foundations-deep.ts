import type { LearningResource, LessonBlock } from "../activities/content";
import type { Lesson } from "./lesson";

const git: LearningResource = { title: "Git documentation", url: "https://git-scm.com/docs" };
const semver: LearningResource = { title: "Semantic Versioning", url: "https://semver.org/" };
const conventional: LearningResource = { title: "Conventional Commits", url: "https://www.conventionalcommits.org/" };
const keepChangelog: LearningResource = { title: "Keep a Changelog", url: "https://keepachangelog.com/" };
const twelveFactor: LearningResource = { title: "The Twelve-Factor App", url: "https://12factor.net/" };

function lesson(id: string, title: string, intro: string, sections: Array<{ heading: string; body: string; items?: string[]; code?: string }>, resources: LearningResource[]): Lesson {
    const blocks: LessonBlock[] = [{ type: "paragraph", text: intro }];
    for (const section of sections) {
        const anchor = section.heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        blocks.push({ type: "heading", id: anchor, text: section.heading, level: 2 }, { type: "paragraph", text: section.body });
        if (section.items) blocks.push({ type: "list", items: section.items });
        if (section.code) blocks.push({ type: "code", language: "text", code: section.code });
    }
    blocks.push({ type: "callout", tone: "steward", title: "Steward delivery checkpoint", body: "Apply this concept to the current Steward repository and homelab. Preserve evidence that another engineer could use to identify exactly what source became what release and where it was promoted." });
    blocks.push({ type: "resources", title: "Continue learning", resources });
    return { id: `software-delivery-foundations-${id}`, title, activities: [{ id: `software-delivery-foundations-${id}-001`, title, estimatedMinutes: 35, content: { type: "reading", body: intro, blocks } }] };
}

export const softwareDeliveryFoundationsDeepLessons: Lesson[] = [
    lesson("lifecycle", "The Source-to-Production Lifecycle", "Delivery engineering makes the transformation from source code to running software explicit, repeatable and reviewable. A commit is not a release, a build is not a deployment, and a deployment is not proof that the service is healthy.", [
        { heading: "Name the states", body: "A useful lifecycle distinguishes source revision, validated source, build artifact, release candidate, approved release, deployed version and observed runtime. Each transition should have an owner and evidence.", items: ["Source: immutable commit identity", "Build: reproducible artifact from that source", "Release: selected/versioned artifact plus metadata", "Deployment: placing a release into an environment", "Verification: evidence that the deployed release behaves as intended"] },
        { heading: "Trace Steward end to end", body: "For Steward, begin with a merged commit and ask how you would prove which exact code is running in the homelab. Manual copying breaks traceability because the runtime may no longer correspond to a known artifact." },
    ], [git, twelveFactor]),
    lesson("git-workflows", "Git Workflows", "A Git workflow is a collaboration and integration policy, not a competition over branch diagrams. The right workflow reduces integration risk while preserving a clear path from reviewed change to releasable source.", [
        { heading: "Keep integration frequent", body: "Long-lived branches accumulate divergence and make integration a separate project. Short-lived feature branches with frequent synchronization keep review scope and merge risk smaller." },
        { heading: "Protect the releasable line", body: "Treat the main branch as a known integration point. Require the checks and reviews that matter, but avoid branch ceremony that adds delay without reducing risk.", code: "feature/change\n  ↓ review + checks\nmain (releasable source)\n  ↓ build once\nversioned artifact" },
    ], [git]),
    lesson("reviews", "Pull Requests and Reviews", "A pull request is a change-control boundary where code, intent and evidence meet. Good review is risk-based: it asks whether the change is understandable, correct enough, testable and safe to integrate.", [
        { heading: "Make the change reviewable", body: "A reviewer needs context, scope, testing evidence and known risks. Smaller coherent changes are easier to reason about than mixed refactors, features and infrastructure edits." },
        { heading: "Review the delivery effect", body: "Changes to dependencies, migrations, configuration, Dockerfiles or deployment scripts can carry more release risk than their line count suggests. Review impact, not just syntax." },
    ], [git]),
    lesson("semver", "Semantic Versioning", "Versions are communication. Semantic Versioning gives consumers a convention for expressing compatibility changes as MAJOR.MINOR.PATCH, but it only works when the public contract is understood.", [
        { heading: "Version the contract", body: "PATCH represents backward-compatible fixes, MINOR backward-compatible functionality and MAJOR incompatible public-contract change. A version number cannot compensate for an undefined API contract." },
        { heading: "Application versus dependency versions", body: "Steward releases can use semantic versions for human release identity, while internal libraries need especially careful compatibility promises because other projects may consume them." },
    ], [semver]),
    lesson("commits", "Conventional Commits", "Structured commit messages can turn repository history into machine-readable release input, but they should describe meaningful change rather than force every keystroke into bureaucracy.", [
        { heading: "Express intent", body: "Conventional Commits uses a type, optional scope, description and explicit breaking-change notation. Types such as feat and fix can support automated changelog/version workflows.", code: "feat(registry): add service criticality\nfix(authz): reject cross-team service mutation\nfeat(api)!: replace lifecycle field contract" },
        { heading: "Do not confuse commit format with quality", body: "A perfectly formatted message does not make an incoherent commit safe. Keep commits logically understandable first; use the convention to expose intent consistently." },
    ], [conventional]),
    lesson("release-notes", "Release Notes and Changelogs", "Git history records implementation events; release communication explains what changed for consumers and operators. These audiences need different levels of abstraction.", [
        { heading: "Maintain an accumulated history", body: "A changelog provides a curated history across releases. Release notes describe one release and should highlight behavior changes, migration needs, operational considerations and known issues." },
        { heading: "Write from impact", body: "For Steward, 'refactored serializer' is weak release communication. Explain whether an API field changed, whether clients must adapt, whether a migration runs and whether rollback has constraints." },
    ], [keepChangelog, semver]),
    lesson("artifacts", "Build Artifacts", "A build artifact is the immutable output selected for distribution or deployment. Delivery becomes safer when the same artifact is promoted rather than rebuilt differently for every environment.", [
        { heading: "Build once, identify forever", body: "An artifact should carry or be associated with source revision, version, build metadata and integrity information. If two files share a version but contain different bytes, the release identity is ambiguous." },
        { heading: "Environment belongs outside the artifact", body: "Do not bake UAT database credentials or production URLs into separate application builds. Promote one artifact and supply environment-specific configuration at runtime where possible." },
    ], [twelveFactor, semver]),
    lesson("promotion", "Environment Promotion", "Promotion is the controlled movement of a known release through environments and gates. The object being promoted should remain stable while configuration and approval context change.", [
        { heading: "Separate artifact from environment", body: "Development, test and production-like environments can differ in data, credentials, scale and external endpoints, but the release artifact should remain identifiable as the same build." },
        { heading: "Define evidence-based gates", body: "A gate should answer a risk question: did automated checks pass, was a migration rehearsed, was the release approved, did deployment verification succeed? A manual click with no decision criterion is ceremony." },
        { heading: "Prepare the Steward delivery map", body: "Document Steward's current source-to-homelab path and mark every manual, mutable or untraceable transition. This becomes the backlog for the next Delivery Engineer modules.", code: "commit → checks → artifact → candidate → approval → deploy → verify\n             same immutable release ────────────────→" },
    ], [twelveFactor, semver]),
];
