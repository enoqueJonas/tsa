import type { LearningResource, LessonBlock } from "../activities/content";
import type { Lesson } from "./lesson";

const nexusDocs: LearningResource = { title: "Sonatype Nexus Repository documentation", url: "https://help.sonatype.com/en/sonatype-nexus-repository.html" };
const packaging: LearningResource = { title: "Python Packaging User Guide", url: "https://packaging.python.org/" };
const npmDocs: LearningResource = { title: "npm package publishing", url: "https://docs.npmjs.com/creating-and-publishing-unscoped-public-packages" };
const dockerRegistry: LearningResource = { title: "Docker registry documentation", url: "https://docs.docker.com/docker-hub/repos/" };
const cyclonedx: LearningResource = { title: "CycloneDX specification", url: "https://cyclonedx.org/" };
const spdx: LearningResource = { title: "SPDX", url: "https://spdx.dev/" };
const slsa: LearningResource = { title: "SLSA", url: "https://slsa.dev/" };

interface LessonSpec {
    id: string;
    title: string;
    intro: string;
    sections: Array<{ heading: string; paragraphs: string[]; code?: { language: string; code: string; caption?: string } }>;
    practice: string[];
    questions: string[];
    resources: LearningResource[];
}

function richLesson(spec: LessonSpec): Lesson {
    const blocks: LessonBlock[] = [{ type: "paragraph", text: spec.intro }];
    for (const section of spec.sections) {
        blocks.push({ type: "heading", id: section.heading.toLowerCase().replace(/[^a-z0-9]+/g, "-"), text: section.heading, level: 2 });
        for (const paragraph of section.paragraphs) blocks.push({ type: "paragraph", text: paragraph });
        if (section.code) blocks.push({ type: "code", language: section.code.language, code: section.code.code, caption: section.code.caption });
    }
    blocks.push({ type: "callout", tone: "steward", title: "Steward supply-chain checkpoint", body: "Connect this lesson to Steward's actual path from source to dependency, package, image and deployed release. Prefer evidence about origin, identity, ownership and promotion over assumptions." });
    blocks.push({ type: "resources", title: "Continue learning", resources: spec.resources });

    return {
        id: `artifact-and-supply-chain-${spec.id}`,
        title: spec.title,
        activities: [
            {
                id: `artifact-and-supply-chain-${spec.id}-001`,
                title: spec.title,
                estimatedMinutes: 40,
                content: { type: "reading", body: spec.intro, blocks },
            },
            {
                id: `artifact-and-supply-chain-${spec.id}-002`,
                title: `Apply: ${spec.title}`,
                estimatedMinutes: 45,
                content: {
                    type: "practical",
                    objective: `Apply ${spec.title} to the Steward delivery platform.`,
                    scenario: "Use the existing Steward API, homelab, CI pipeline and internal-package work. Keep the exercise inside the Delivery Engineer boundary rather than prematurely solving later security or reliability work.",
                    instructions: spec.practice,
                    deliverables: ["Versioned configuration or artifact evidence", "Short engineering note explaining the decision", "Proof of successful and relevant failure behavior"],
                    completionCriteria: ["The work is reproducible by another engineer.", "Artifact or dependency identity is explicit.", "The learner can explain where trust enters the workflow."],
                },
            },
            {
                id: `artifact-and-supply-chain-${spec.id}-003`,
                title: `Knowledge Check: ${spec.title}`,
                estimatedMinutes: 10,
                content: { type: "reflection", prompt: spec.questions.join("\n\n"), minimumCharacters: 180 },
            },
        ],
    };
}

const specs: LessonSpec[] = [
    {
        id: "why-internal-repositories",
        title: "Why Organizations Use Internal Artifact Repositories",
        intro: "An internal repository is a control point between producers and consumers of software artifacts. It gives an engineering organization a stable place to publish what it owns and a governed path for retrieving what it depends on.",
        sections: [
            { heading: "The distribution problem", paragraphs: ["Local filesystem installs and copied binaries work only while producer and consumer share a machine or repository. Once CI runners, separate services and multiple teams need the same package, distribution becomes an engineering system of its own.", "A repository separates artifact production from artifact consumption. Producers publish a versioned result once; consumers retrieve it later without needing producer source code or build tooling."] },
            { heading: "What the repository adds", paragraphs: ["Useful repository capabilities include stable naming, version retention, authentication, metadata, proxy caching, policy boundaries and an audit trail of what was published and consumed.", "For Steward, this solves the exact gap left by the earlier steward-common package exercise: a second repository or CI job should be able to install the package without reaching into another checkout."] },
        ],
        practice: ["Draw Steward's current producer-to-consumer path for steward-common and the Steward container image.", "Mark every place that currently relies on local files, mutable tags or public-registry availability.", "Write the repository responsibilities that remove those assumptions."],
        questions: ["What problem does an internal repository solve that version control does not?", "Why is copying a wheel or tarball into another repository a weak long-term distribution mechanism?"],
        resources: [nexusDocs],
    },
    {
        id: "registries-vs-repositories",
        title: "Package Registries versus Artifact Repositories",
        intro: "Registry, repository and repository manager are related terms, but they describe different levels of the distribution system.",
        sections: [
            { heading: "Format-specific registries", paragraphs: ["A package registry usually speaks the protocol expected by an ecosystem such as PyPI, npm or OCI. Package managers can resolve names and versions because the registry exposes ecosystem-specific metadata and download endpoints."] },
            { heading: "Repository managers", paragraphs: ["A repository manager such as Nexus can host several repository formats behind one administrative system. That lets an organization manage Python packages, npm packages and container images with shared authentication, storage and policy concepts while still preserving format-specific clients.", "Do not reduce the architecture to 'one big folder'. Each format has different metadata, client behavior and publication semantics."] },
        ],
        practice: ["Classify Steward's Python package, npm dependencies and OCI image by repository format.", "Identify which clients consume each format and what protocol they expect.", "Explain why one generic HTTP directory would be a poor replacement."],
        questions: ["Why can Nexus expose several repository formats without making them the same protocol?", "What would break if pip, pnpm and Docker were pointed at an arbitrary file server?"],
        resources: [nexusDocs, packaging, npmDocs],
    },
    {
        id: "public-private-dependencies",
        title: "Public and Private Dependencies",
        intro: "Modern software almost always combines organization-owned packages with third-party dependencies. Delivery engineering must make the distinction visible because ownership, publication and trust differ.",
        sections: [
            { heading: "Ownership changes responsibility", paragraphs: ["A private dependency is not automatically safer than a public one; it is simply under different ownership. The organization controls release, compatibility and retention for steward-common, while it consumes Django, PostgreSQL drivers and other public packages under external release processes."] },
            { heading: "One resolution path, different trust", paragraphs: ["Repository groups can give clients one URL that resolves internal and proxied public content. The convenience is valuable, but the architecture must still preserve which artifacts were produced internally and which came from upstream."] },
        ],
        practice: ["Inventory ten Steward dependencies and classify each as internal, public direct or public transitive.", "Record the owner and source of each.", "Identify one dependency whose disappearance upstream would currently break a clean build."],
        questions: ["Why does putting public and private packages behind one URL not make their trust equivalent?", "What new responsibility appears when your organization publishes an internal package?"],
        resources: [nexusDocs],
    },
    {
        id: "repository-manager-architecture",
        title: "Repository Manager Architecture",
        intro: "A repository manager sits on the delivery path and therefore becomes infrastructure that must be intentionally placed, named, secured and recovered.",
        sections: [
            { heading: "Core components", paragraphs: ["At minimum, reason about the repository service, durable blob storage, metadata/database state, network endpoints, authentication, repository definitions and backup boundary. If the service is disposable but its metadata or blob store is not recoverable, the repository is not reproducible infrastructure."] },
            { heading: "Clients and trust boundaries", paragraphs: ["CI runners publish artifacts, developers and build jobs consume them, and deployment systems may pull images. These are separate clients and should not automatically share the same credentials or permissions."] },
        ],
        practice: ["Add Nexus to the Steward homelab topology without yet installing it.", "Show publisher, consumer and administrator paths separately.", "Mark storage that must survive service recreation."],
        questions: ["Which Nexus state is disposable and which state must survive recreation?", "Why should CI publishing credentials differ from ordinary developer read credentials?"],
        resources: [nexusDocs],
    },
    {
        id: "hosted-proxy-group",
        title: "Hosted, Proxy and Group Repositories",
        intro: "Hosted, proxy and group repositories solve different problems and are most useful when their responsibilities remain distinct.",
        sections: [
            { heading: "Hosted", paragraphs: ["A hosted repository stores artifacts your organization publishes, such as steward-common or a Steward container image. It is the authoritative internal distribution location for those releases."] },
            { heading: "Proxy and group", paragraphs: ["A proxy repository fetches from an upstream source and caches what clients request. A group repository gives clients a single resolution endpoint spanning multiple hosted and proxy repositories.", "A clean design often gives publishers a hosted endpoint and consumers a group endpoint. That prevents ordinary consumers from accidentally publishing into the path they use for installs."] },
        ],
        practice: ["Design hosted, proxy and group repositories for Python, npm and container use.", "Document which URL publishers use and which URL consumers use.", "Explain how the group repository reduces client configuration without hiding ownership."],
        questions: ["Why should publishing target hosted rather than group repositories?", "What benefit does a proxy provide even when the upstream public repository is highly available?"],
        resources: [nexusDocs],
    },
    {
        id: "python-pypi-distribution",
        title: "Python and PyPI Package Distribution",
        intro: "Python package distribution is based on built distributions and metadata, not on copying source folders between applications.",
        sections: [
            { heading: "Buildable distributions", paragraphs: ["A modern Python project declares package metadata in pyproject.toml and can produce artifacts such as wheels and source distributions. A wheel is generally the preferred install artifact because the consumer does not need to rebuild the package from raw source when a compatible wheel exists."] , code: { language: "bash", caption: "Build a Python distribution", code: "python -m build\nls dist/" } },
            { heading: "Index-based consumption", paragraphs: ["pip resolves package names and versions from an index. Internal distribution therefore means publishing steward-common to a private PyPI-format repository and configuring clients to resolve it through an approved index rather than a filesystem path."] },
        ],
        practice: ["Build steward-common as a wheel and source distribution.", "Inspect the resulting filenames and metadata.", "Explain which metadata links the artifact to name and version."],
        questions: ["What does a wheel give a consumer that a copied source directory does not?", "Why is an index protocol more useful than a shared folder for CI?"],
        resources: [packaging],
    },
    {
        id: "npm-distribution",
        title: "npm Package Distribution",
        intro: "npm-compatible registries provide package metadata and tarballs that npm and pnpm can resolve using names, versions and dependency graphs.",
        sections: [
            { heading: "Package identity", paragraphs: ["package.json defines package name, version, entry points and dependencies. Internal packages should use a naming strategy that avoids accidental collision with public packages; organization scopes are a common choice."] , code: { language: "json", caption: "Internal package identity", code: "{\n  \"name\": \"@tsa/steward-client\",\n  \"version\": \"1.0.0\",\n  \"private\": false\n}" } },
            { heading: "Registry resolution", paragraphs: ["pnpm can use a Nexus npm group as its normal registry while publishing internal packages to a hosted npm repository. This mirrors the producer/consumer separation used for Python."] },
        ],
        practice: ["Define a plausible internal npm package for Steward without manufacturing a package that has no reuse case.", "Write the package identity and intended consumers.", "Document hosted publish and group consume endpoints."],
        questions: ["Why are scoped package names useful internally?", "What is the difference between package metadata and the package tarball itself?"],
        resources: [npmDocs, nexusDocs],
    },
    {
        id: "container-registries",
        title: "Container Registries",
        intro: "OCI container registries distribute immutable image content and metadata rather than application source code.",
        sections: [
            { heading: "Tags and manifests", paragraphs: ["An image tag is a convenient mutable reference. The digest identifies specific image content. A registry stores manifests and layers so multiple environments can pull the exact image that CI produced."] , code: { language: "bash", caption: "Inspect immutable image identity", code: "docker image inspect steward-api:1.4.0 --format '{{index .RepoDigests 0}}'" } },
            { heading: "Internal distribution", paragraphs: ["Publishing Steward images to Nexus removes the assumption that deployment pulls from a developer workstation. The deployment host can retrieve a versioned image from infrastructure designed for distribution."] },
        ],
        practice: ["Record Steward's current image tag and digest.", "Design the internal image naming convention.", "Explain why production evidence should include digest in addition to tag."],
        questions: ["Why is a digest stronger deployment evidence than a tag?", "What changes when the deployment host pulls from a registry rather than receiving a locally exported image?"],
        resources: [dockerRegistry, nexusDocs],
    },
    {
        id: "deploy-nexus-homelab",
        title: "Deploying Nexus Repository in the Homelab",
        intro: "Nexus becomes a real dependency of the delivery platform, so its deployment should reuse the Platform Builder and Configuration Management discipline already established.",
        sections: [
            { heading: "Placement and persistence", paragraphs: ["Choose whether Nexus runs in its own VM or a deliberately shared host based on current homelab capacity and failure-domain goals. Regardless of placement, repository storage must persist independently of a disposable container or process."] },
            { heading: "Operational baseline", paragraphs: ["Define DNS or stable address, service ownership, storage path, backup boundary and administrative access before publishing anything important. Do not install monitoring or advanced HA just to make the lab look enterprise-grade; those belong to later reliability work."] },
        ],
        practice: ["Deploy Nexus on learner-managed infrastructure.", "Persist its data outside the disposable service instance.", "Record service endpoint, storage location, administrator recovery path and current resource usage.", "Prove the UI/API is reachable only through the intended network path."],
        questions: ["Which Nexus data must survive service recreation?", "What homelab capacity constraint would make Nexus placement a poor choice?"],
        resources: [nexusDocs],
    },
    {
        id: "auth-permissions",
        title: "Repository Authentication and Permissions",
        intro: "Repository credentials should reflect what a client is allowed to do, not simply whether the client can log in.",
        sections: [
            { heading: "Separate roles", paragraphs: ["Typical roles include administrator, publisher and read-only consumer. CI may need publish rights to selected hosted repositories, while developers and deployment hosts may need only read access."] },
            { heading: "Credential boundaries", paragraphs: ["Do not commit tokens in project files. Treat credentials as runtime inputs supplied to CI or local package managers through protected configuration. Deep secret-management and rotation controls are deferred to Security Steward, but plaintext secrets are already unacceptable here."] },
        ],
        practice: ["Create separate Nexus roles for publish and read access.", "Use a non-admin credential to prove publishing works only where intended.", "Use a read-only credential to prove an upload attempt is rejected."],
        questions: ["Why is a single shared Nexus administrator account dangerous even in a small team?", "What failure evidence proves least privilege is actually enforced?"],
        resources: [nexusDocs],
    },
    {
        id: "publish-python",
        title: "Publishing Internal Python Packages",
        intro: "Publishing converts a local build result into a versioned organization-consumable artifact.",
        sections: [
            { heading: "Build, verify, publish", paragraphs: ["The producer should build the package, inspect or test the distribution, then upload it to the hosted PyPI repository. Publication should fail rather than silently replace a release when immutable release semantics are expected."] , code: { language: "bash", caption: "Build before publish", code: "python -m build\npython -m twine check dist/*\npython -m twine upload --repository-url \"$NEXUS_PYPI_UPLOAD_URL\" dist/*" } },
            { heading: "Release identity", paragraphs: ["Package name plus version is part of the contract. Publishing 1.2.0 and later changing the bytes behind the same version destroys reproducibility because consumers can no longer know what 1.2.0 meant historically."] },
        ],
        practice: ["Publish a steward-common test release to the hosted PyPI repository.", "Verify package name, version and files through Nexus.", "Attempt an invalid or duplicate publication and record the behavior."],
        questions: ["Why should released package bytes normally be immutable?", "What evidence links a published wheel to its source revision?"],
        resources: [packaging, nexusDocs],
    },
    {
        id: "consume-pip",
        title: "Consuming Internal Packages with pip",
        intro: "A package repository is useful only when consumers can reproduce installation without producer-local paths.",
        sections: [
            { heading: "Configure the index", paragraphs: ["Configure pip to use the approved Nexus group or index endpoint. Avoid solutions that require every consumer to remember multiple ad-hoc URLs or manually download wheel files."] , code: { language: "bash", caption: "Install through the internal index", code: "python -m pip install --index-url \"$NEXUS_PYPI_GROUP/simple\" steward-common==1.2.0" } },
            { heading: "Pin what must be repeatable", paragraphs: ["A consumer should express compatible versions deliberately. Exact pins maximize repeatability but increase update work; ranges increase flexibility but can admit new versions. The choice should be conscious and visible in dependency metadata or lock files."] },
        ],
        practice: ["Install steward-common into a clean virtual environment using only the Nexus endpoint.", "Prove the install works with the producer repository unavailable locally.", "Record the resolved version and source repository."],
        questions: ["What proves you have eliminated the local-filesystem dependency?", "When would a compatible version range be preferable to an exact pin?"],
        resources: [packaging, nexusDocs],
    },
    {
        id: "publish-npm",
        title: "Publishing Internal npm Packages",
        intro: "Publishing an npm package should create the same producer/consumer separation already established for Python.",
        sections: [
            { heading: "Package preparation", paragraphs: ["Inspect which files enter the package, ensure the version is intentional and avoid accidentally shipping local secrets, test fixtures or build output that consumers do not need."] , code: { language: "bash", caption: "Inspect before publish", code: "pnpm pack --dry-run\npnpm publish --registry \"$NEXUS_NPM_HOSTED\"" } },
            { heading: "Release contract", paragraphs: ["The published package becomes an independent artifact. Consumers should not need the monorepo layout or unpublished source tree to use it."] },
        ],
        practice: ["Prepare and publish one credible internal npm package if the Steward system genuinely has a reusable client or shared package.", "If no credible package exists, document the decision not to manufacture one and perform the publication flow with a deliberately minimal training package.", "Inspect the published metadata in Nexus."],
        questions: ["What should pnpm pack --dry-run help you catch?", "Why is refusing to manufacture a fake shared library an acceptable engineering outcome?"],
        resources: [npmDocs, nexusDocs],
    },
    {
        id: "consume-npm-pnpm",
        title: "Consuming Internal Packages with npm and pnpm",
        intro: "Consumer configuration should make the internal registry path predictable and reviewable.",
        sections: [
            { heading: "Registry configuration", paragraphs: ["A project can route all npm resolution through a Nexus group or route only an internal scope through Nexus. Scope-specific routing can preserve a clear internal namespace while still allowing a controlled public proxy."] , code: { language: "ini", caption: "Scope-specific registry", code: "@tsa:registry=https://nexus.example/repository/npm-group/\n//nexus.example/repository/npm-group/:_authToken=${NEXUS_TOKEN}" } },
            { heading: "Lockfiles and provenance", paragraphs: ["pnpm-lock.yaml records resolved package information and is part of repeatable dependency resolution. The lockfile does not by itself prove a package is trustworthy, but it makes the selected graph visible and reviewable."] },
        ],
        practice: ["Configure a clean test project to consume the internal package through Nexus.", "Install with pnpm and inspect the lockfile.", "Prove the internal package resolves without a local workspace link."],
        questions: ["What does the lockfile prove and what does it not prove?", "When is scope-specific registry routing clearer than replacing the default registry globally?"],
        resources: [npmDocs, nexusDocs],
    },
    {
        id: "publish-steward-images",
        title: "Publishing Steward Container Images Internally",
        intro: "The Steward container image should become a first-class release artifact that CI can publish and deployment automation can retrieve by stable identity.",
        sections: [
            { heading: "Naming and identity", paragraphs: ["Use a repository path and tag convention that relates the image to an application release. Also capture the digest after push because tags remain mutable references."] , code: { language: "bash", caption: "Tag and publish", code: "docker tag steward-api:1.4.0 nexus.local/steward/steward-api:1.4.0\ndocker push nexus.local/steward/steward-api:1.4.0" } },
            { heading: "Build once, deploy many", paragraphs: ["CI should publish the built image once. Later environments should pull and promote that same content rather than rebuilding source separately for each environment."] },
        ],
        practice: ["Publish a versioned Steward image to the internal registry.", "Record source SHA, release version, tag and digest together.", "Pull it on a different host and prove the digest matches."],
        questions: ["Why does rebuilding for UAT and production weaken release evidence?", "What combination of identifiers gives the strongest trace from source to image?"],
        resources: [dockerRegistry, nexusDocs],
    },
    {
        id: "proxy-cache-public",
        title: "Proxying and Caching Public Dependencies",
        intro: "A proxy repository creates a controlled and cached path to public ecosystems without pretending the organization owns upstream artifacts.",
        sections: [
            { heading: "Why proxy", paragraphs: ["Benefits include reduced repeated downloads, resilience against short upstream interruptions, centralized visibility and one client configuration path. A cache is not a permanent guarantee: eviction, cleanup or missing metadata can still require upstream access."] },
            { heading: "Dependency confusion awareness", paragraphs: ["When internal and public namespaces overlap, resolution order can create serious ambiguity. Delivery engineering should use explicit internal naming and repository layout so later security controls have a clear policy surface."] },
        ],
        practice: ["Configure one public proxy repository and a consumer group.", "Install a known public dependency through Nexus and verify it is cached.", "Repeat the install while observing the proxy behavior."],
        questions: ["What operational benefit does caching give during a short upstream outage?", "Why is namespace design relevant to dependency-confusion risk?"],
        resources: [nexusDocs],
    },
    {
        id: "internal-versioning",
        title: "Internal Package Versioning",
        intro: "Internal does not mean versionless. A consumer still needs to know whether an update is compatible, risky or intentionally breaking.",
        sections: [
            { heading: "Version as communication", paragraphs: ["Use semantic versioning where the package has a meaningful public contract. A breaking API change should not masquerade as a patch release simply because every consumer belongs to the same organization."] },
            { heading: "Consumer independence", paragraphs: ["Good versioning lets producers and consumers release on different schedules. Without versions, every change becomes an implicit lockstep deployment requirement."] },
        ],
        practice: ["Define the public contract of steward-common.", "Classify three hypothetical changes as patch, minor or major and justify each.", "Show how Steward API declares its compatibility requirement."],
        questions: ["Why does internal ownership not remove the need for compatibility contracts?", "What architectural smell appears when every package change forces every consumer to deploy immediately?"],
        resources: [packaging],
    },
    {
        id: "prerelease-release",
        title: "Prerelease, Snapshot and Release Concepts",
        intro: "Not every artifact produced during engineering should be treated as a final release.",
        sections: [
            { heading: "Different maturity states", paragraphs: ["Prerelease identifiers such as alpha, beta or release candidate communicate that an artifact may be evaluated before it becomes the stable version. Some ecosystems also use snapshot terminology for continuously changing development builds."] },
            { heading: "Promotion rather than mutation", paragraphs: ["A release candidate should become trusted because evidence increases, not because engineers silently replace its contents. Where the tooling supports it, promote immutable content or preserve a traceable relationship between candidate and release."] },
        ],
        practice: ["Define a versioning policy for steward-common prereleases and stable releases.", "Describe how CI distinguishes branch/test artifacts from approved releases.", "Identify which artifacts deserve long-term retention."],
        questions: ["Why is overwriting a release candidate dangerous to auditability?", "What should change between a candidate and an approved release: evidence, bytes, or both?"],
        resources: [packaging, nexusDocs],
    },
    {
        id: "retention-cleanup",
        title: "Artifact Retention and Cleanup",
        intro: "Artifact repositories accumulate data quickly, so retention must balance reproducibility, rollback needs, compliance and finite storage.",
        sections: [
            { heading: "Not all artifacts have equal value", paragraphs: ["Stable releases, currently deployed versions and recent rollback candidates usually deserve stronger retention than ephemeral branch builds. Cleanup rules should be based on lifecycle meaning rather than arbitrary age alone."] },
            { heading: "Deletion has consequences", paragraphs: ["Deleting an image that is still referenced by an environment or a package required for an old supported release can make recovery impossible. Retention therefore belongs to release engineering, not merely disk housekeeping."] },
        ],
        practice: ["Classify Steward artifacts into stable release, candidate and ephemeral categories.", "Write a first retention policy for each.", "Check current homelab storage capacity against projected artifact growth."],
        questions: ["Which artifacts must remain available to support rollback?", "Why can a simple 'delete everything older than 30 days' rule be unsafe?"],
        resources: [nexusDocs],
    },
    {
        id: "provenance",
        title: "Dependency Provenance",
        intro: "Provenance answers where an artifact came from, how it was produced and which source or upstream material contributed to it.",
        sections: [
            { heading: "Traceability chain", paragraphs: ["For Steward, useful provenance connects source commit, CI run, package or image version, repository location and immutable digest or checksum. For third-party dependencies, provenance includes upstream registry and resolved version."] },
            { heading: "Evidence before enforcement", paragraphs: ["Delivery Engineer establishes the evidence model. Security Steward later strengthens verification, signatures and policy. This sequencing keeps the curriculum honest: first make identity visible, then enforce trust more deeply."] },
        ],
        practice: ["Create a provenance record for one Steward image and one steward-common release.", "Include source revision, CI run, repository path, version and digest/checksum.", "Identify one provenance fact you still cannot prove automatically."],
        questions: ["How is provenance different from a version number?", "What missing provenance fact would most weaken a rollback investigation?"],
        resources: [slsa],
    },
    {
        id: "sbom",
        title: "SBOM Fundamentals",
        intro: "A Software Bill of Materials records the components contained in or associated with a software artifact so dependency composition is inspectable after build time.",
        sections: [
            { heading: "What an SBOM is", paragraphs: ["An SBOM is structured inventory, not a vulnerability verdict. It can list package names, versions, identifiers, relationships and other metadata using formats such as CycloneDX or SPDX."] },
            { heading: "Why delivery owns generation", paragraphs: ["The build pipeline is a natural place to generate an SBOM because it already knows the artifact and resolved dependency graph. Security tools can later analyze that inventory without requiring the application team to reconstruct dependencies manually."] },
        ],
        practice: ["Generate an SBOM for one Steward container image or application build using an available tool.", "Store it as pipeline evidence alongside the artifact identity.", "Inspect five components and verify their versions against the actual build."],
        questions: ["Why is an SBOM not the same thing as a vulnerability scan?", "At what point in the pipeline is SBOM generation most reproducible?"],
        resources: [cyclonedx, spdx],
    },
    {
        id: "signing-provenance",
        title: "Signing and Provenance Concepts",
        intro: "Signing can let consumers verify that an artifact or attestation was produced by a trusted identity and has not been modified since signing.",
        sections: [
            { heading: "Identity plus integrity", paragraphs: ["A cryptographic signature can bind content to a signer, but trust still depends on how signing keys or identities are protected and how consumers decide which signers are acceptable."] },
            { heading: "Delivery boundary", paragraphs: ["At this stage, understand where signing fits in the source-to-release chain and preserve immutable artifact identity. Key management, mandatory verification and policy enforcement belong to the later Security Steward deep pass."] },
        ],
        practice: ["Mark where a signature or attestation would attach to the Steward image and steward-common package.", "Describe who or what should sign: developer workstation, CI identity or release system.", "Explain why CI-based signing generally gives stronger build provenance than manual workstation signing."],
        questions: ["What does a valid signature prove and what does it not prove?", "Why is signer identity management as important as the signature algorithm?"],
        resources: [slsa],
    },
    {
        id: "scanning",
        title: "Dependency, Package and Image Scanning",
        intro: "Scanning turns software composition and artifact contents into findings that can inform release decisions, but a scanner is not a substitute for engineering judgment.",
        sections: [
            { heading: "Different scan surfaces", paragraphs: ["Dependency scans inspect declared or resolved software packages. Container scans inspect operating-system and application components inside images. Package scans may inspect published distributions or their dependency metadata."] },
            { heading: "Findings need policy", paragraphs: ["A list of CVEs is only input. Teams still need severity thresholds, exploitability context, ownership, exception handling and update strategy. Those policy decisions deepen later in Security Steward."] },
        ],
        practice: ["Run one available dependency or image scanner against Steward.", "Preserve the scan output as evidence tied to a specific version or digest.", "Classify at least one finding as actionable, accepted temporarily or not applicable and explain why."],
        questions: ["Why should scan output be tied to immutable artifact identity?", "Why can severity score alone be insufficient for release decisions?"],
        resources: [cyclonedx, slsa],
    },
    {
        id: "lab-nexus-platform",
        title: "Lab: Build the Steward Internal Artifact Repository",
        intro: "This lab turns Nexus from an architectural concept into an operating part of the Steward homelab delivery platform.",
        sections: [
            { heading: "Required platform", paragraphs: ["Deploy Nexus with persistent storage, define hosted/proxy/group repositories for the formats Steward actually needs, create separate administrative, publisher and consumer access, and prove clients can resolve through the intended endpoints."] },
            { heading: "Evidence over screenshots", paragraphs: ["Keep concise topology, repository definitions, configuration, command evidence and failure proofs. Screenshots may supplement evidence but should not be the only proof that publication, access control or caching works."] },
        ],
        practice: ["Deploy Nexus on the homelab with persistent state.", "Create PyPI hosted/proxy/group repositories and a container hosted repository; add npm only if a real current consumer exists.", "Create read and publish identities with distinct privileges.", "Publish one test artifact and consume it from a clean client.", "Proxy one public dependency and prove cache behavior.", "Record storage, backup boundary and capacity impact.", "Attempt one unauthorized publish and preserve the rejection evidence."],
        questions: ["Which part of the repository platform would currently prevent reconstruction on a replacement host?", "Which repository format did you deliberately omit, if any, and why?"],
        resources: [nexusDocs],
    },
    {
        id: "lab-steward-common-ci",
        title: "Lab: Publish and Consume steward-common through CI",
        intro: "The final lab closes the distribution gap introduced in Builder by moving steward-common through a real producer → repository → consumer pipeline.",
        sections: [
            { heading: "Producer pipeline", paragraphs: ["CI should verify the package, build it, assign an intentional version, publish it with non-admin credentials and preserve source-to-artifact evidence. A failed verification stage must block publication."] },
            { heading: "Consumer proof", paragraphs: ["A clean Steward API build should install steward-common only through the approved repository endpoint. No editable install, workspace link, copied source directory or developer-local wheel may be required."] },
        ],
        practice: ["Add CI stages that verify and build steward-common.", "Publish a prerelease or release version to Nexus using a dedicated publisher credential.", "Preserve commit SHA, CI run, package version and distribution checksum as evidence.", "Update Steward API to consume the package from the Nexus PyPI group.", "Run the consumer build in a clean environment without access to the producer checkout.", "Introduce one controlled package failure and prove publication is blocked.", "Demonstrate one compatible upgrade and explain one intentionally breaking version change.", "Write the handoff describing what Release Engineering still needs to formalize around candidates, promotion, release evidence and recovery."],
        questions: ["Can a brand-new CI runner rebuild Steward API without filesystem access to steward-common source? Prove the answer.", "Which remaining manual decision between successful package build and trusted release should Release Engineering address next?"],
        resources: [packaging, nexusDocs, slsa],
    },
];

export const artifactDependencySupplyChainDeepLessons: Lesson[] = specs.map(richLesson);
