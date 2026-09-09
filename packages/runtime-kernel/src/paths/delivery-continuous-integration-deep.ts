import type { LearningResource, LessonBlock } from "../activities/content";
import type { Lesson } from "./lesson";

const gha: LearningResource = { title: "GitHub Actions documentation", url: "https://docs.github.com/actions" };
const jenkins: LearningResource = { title: "Jenkins documentation", url: "https://www.jenkins.io/doc/" };
const docker: LearningResource = { title: "Docker documentation", url: "https://docs.docker.com/" };

function rich(id: string, title: string, intro: string, sections: Array<{ heading: string; body: string; items?: string[]; code?: { language: string; code: string } }>, resources: LearningResource[] = [gha]): Lesson {
    const blocks: LessonBlock[] = [{ type: "paragraph", text: intro }];
    for (const section of sections) {
        const anchor = section.heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        blocks.push({ type: "heading", id: anchor, text: section.heading, level: 2 }, { type: "paragraph", text: section.body });
        if (section.items) blocks.push({ type: "list", items: section.items });
        if (section.code) blocks.push({ type: "code", language: section.code.language, code: section.code.code });
    }
    blocks.push({ type: "callout", tone: "steward", title: "Steward CI checkpoint", body: "Apply this concept to Steward's current source-to-image path. Ask what evidence the pipeline should produce, what failure should stop promotion, and whether another engineer could understand the result without rerunning the job manually." });
    blocks.push({ type: "resources", title: "Continue learning", resources });
    return { id: `continuous-integration-${id}`, title, activities: [{ id: `continuous-integration-${id}-001`, title, estimatedMinutes: 35, content: { type: "reading", body: intro, blocks } }] };
}

export const continuousIntegrationDeepLessons: Lesson[] = [
    rich("architecture", "CI Pipeline Architecture", "Continuous Integration is a feedback system around change integration. Its purpose is not to accumulate YAML; it is to turn each proposed change into fast, repeatable evidence about whether that change can safely join the main line.", [
        { heading: "Design around feedback", body: "Model the pipeline as trigger → checkout → dependency restore → checks → build → publish evidence. Each stage should answer a risk question and fail visibly when that question cannot be answered." },
        { heading: "Separate validation from deployment", body: "CI should produce confidence and artifacts. Deployment belongs to later delivery stages. Keeping these boundaries clear prevents a failed test from becoming an accidental infrastructure change." },
    ]),
    rich("jobs-stages", "Jobs, Stages and Dependencies", "Jobs define isolated units of work; dependencies define when they may run and what evidence they consume. A good graph maximizes useful parallel feedback without hiding ordering constraints.", [
        { heading: "Build the dependency graph", body: "Linting, type checks and unit tests may run in parallel. Image build should depend on the checks that protect it. Avoid serializing independent work simply because it is easier to read." },
        { heading: "Fail where the fault is", body: "Do not create a final generic job that discovers every problem late. Keep failure close to the check that detected it so the diagnostic signal remains strong." },
    ]),
    rich("runners", "Runners and Agents", "A CI runner is execution infrastructure. It checks out untrusted or semi-trusted source, receives credentials, consumes CPU/storage/network and therefore belongs in the threat and capacity model.", [
        { heading: "Hosted versus self-hosted", body: "Hosted runners reduce administration burden; self-hosted runners offer local network access and control but transfer patching, isolation, cleanup and capacity responsibility to you." },
        { heading: "Treat runners as disposable where possible", body: "Jobs should not depend on undocumented files left by previous executions. Persistent runner state is a source of false success, secret leakage and irreproducibility." },
    ], [gha, jenkins]),
    rich("github-jenkins", "GitHub Actions and Jenkins", "GitHub Actions and Jenkins solve overlapping orchestration problems with different operating models. The important skill is understanding workflow semantics, not memorizing one vendor's syntax.", [
        { heading: "Compare responsibility models", body: "GitHub Actions tightly integrates repository events and hosted execution. Jenkins gives deep control over controller/agent infrastructure and plugins but requires more platform ownership." },
        { heading: "Use both deliberately", body: "In TSA, GitHub Actions can teach repository-native CI while Jenkins demonstrates self-hosted pipeline infrastructure in the homelab. Do not duplicate every workflow just to use two tools." },
    ], [gha, jenkins]),
    rich("self-hosted", "Self-hosted Runners", "A self-hosted runner connects SaaS orchestration to learner-owned infrastructure. That bridge is powerful because it can reach homelab registries and services—but it also creates a privileged trust path.", [
        { heading: "Minimize runner privilege", body: "Run the agent under a dedicated account, constrain filesystem and network access, and avoid using the homelab's general administrative identity. If Docker access is granted, recognize that it can approximate host-level privilege." },
        { heading: "Define maintenance ownership", body: "Patch the runner host, rotate registration tokens where relevant, monitor disk use and remove stale workspaces. Self-hosting means you own the operational lifecycle." },
    ], [gha, jenkins]),
    rich("caching", "Caching", "Caches trade storage complexity for speed. They are performance hints, not sources of truth, and a pipeline must still be correct when the cache is empty.", [
        { heading: "Cache immutable inputs", body: "Dependency package caches are usually safer than caching arbitrary build outputs. Key caches using lockfile or dependency state so stale inputs are less likely to masquerade as valid ones." },
        { heading: "Prove cold-path correctness", body: "Periodically execute without cache or invalidate the cache deliberately. A build that only succeeds with yesterday's workspace is not reproducible." },
    ]),
    rich("artifacts", "Pipeline Artifacts", "Pipeline artifacts preserve outputs or evidence from a job so later jobs or reviewers can consume them without rebuilding the same state.", [
        { heading: "Distinguish artifact from cache", body: "Caches accelerate future work and may be discarded. Artifacts are intentional outputs: test reports, packaged builds, SBOMs later in the journey, or other evidence tied to one run." },
        { heading: "Keep identity attached", body: "Associate artifacts with commit SHA, workflow run and version. Retention should match their purpose rather than defaulting to permanent storage." },
    ]),
    rich("secrets", "Secrets and Variables", "CI configuration mixes ordinary settings with sensitive credentials. Treating every value as an environment variable without classification makes leakage and privilege mistakes more likely.", [
        { heading: "Classify configuration", body: "Repository variables can hold non-sensitive settings. Secrets should live in the CI platform's protected secret store and only be exposed to jobs that actually need them." },
        { heading: "Reduce secret reach", body: "Avoid echoing secrets, passing them through artifacts or making privileged credentials available to pull requests from untrusted contexts. Prefer short-lived or narrowly scoped credentials when the platform supports them." },
    ], [gha]),
    rich("parallelism", "Parallelism", "Parallel jobs reduce feedback time only when they are truly independent and the runner pool has enough capacity. Unlimited concurrency on a tiny homelab can make every build slower.", [
        { heading: "Parallelize by dependency, not optimism", body: "Run lint, type checks and independent test groups concurrently when they share no mutable state. Serialize steps that must consume the same produced artifact or scarce environment." },
        { heading: "Measure queue and execution time", body: "Runner saturation is a capacity signal. Faster pipelines can come from better dependency graphs, not just adding agents." },
    ]),
    rich("automated-checks", "Automated Checks", "A CI check should defend a known property of the codebase. More checks are not automatically better; the pipeline should balance signal, speed and maintenance cost.", [
        { heading: "Choose checks from risks", body: "For Steward, useful early checks include formatting/linting, static typing, unit tests and build validation. Later schools add deeper security, quality and reliability gates when the learner has learned to interpret them." },
        { heading: "Make failures actionable", body: "A check that produces thousands of unactionable warnings becomes background noise. Define thresholds and ownership before treating a tool as a gate." },
    ]),
    rich("test-stages", "Test Stages", "Tests can be arranged by speed, isolation and dependency cost so developers receive cheap feedback early and expensive evidence only when appropriate.", [
        { heading: "Layer the feedback", body: "Fast isolated tests should run before tests that need databases, networks or full container stacks. The exact taxonomy matters less than making dependency and cost explicit." },
        { heading: "Preserve failure evidence", body: "Capture relevant logs and reports from failed integration stages. Do not force an engineer to reproduce every CI-only failure locally before they can understand it." },
    ]),
    rich("quality-gates", "Quality Gates", "A quality gate is a policy decision backed by evidence: a change may not proceed because a defined risk threshold was not met. Gates should be intentional, reviewable and proportional.", [
        { heading: "Gate only what you can defend", body: "Examples include all required tests passing, no lint errors, successful image build or mandatory review. Arbitrary percentage thresholds without context can create compliance theater." },
        { heading: "Keep exceptions visible", body: "When an emergency or justified exception bypasses a gate, preserve who approved it, why, and what follow-up remains. Invisible bypasses destroy trust in the pipeline." },
    ]),
    rich("container-build", "Building Containers in CI", "Container builds turn validated source into a deployable artifact. CI is where image identity, reproducibility and source traceability become much stronger than laptop-local builds.", [
        { heading: "Build from known source", body: "Tag images with a release candidate or commit-derived identity, and capture the resulting image digest. Do not rely on mutable latest tags as release evidence." },
        { heading: "Separate build credentials", body: "If the build must authenticate to registries or package repositories, scope those credentials to the minimum operation and avoid embedding them in image layers." },
        { heading: "Example pipeline shape", body: "The exact syntax will vary, but the sequence should preserve one artifact identity from build to later promotion.", code: { language: "yaml", code: "jobs:\n  checks:\n    runs-on: self-hosted\n    steps:\n      - uses: actions/checkout@v4\n      - run: ./scripts/check.sh\n\n  image:\n    needs: checks\n    runs-on: self-hosted\n    steps:\n      - uses: actions/checkout@v4\n      - run: docker build -t steward:${{ github.sha }} .\n      - run: docker image inspect steward:${{ github.sha }}" } },
    ], [gha, docker]),
    {
        id: "continuous-integration-lab",
        title: "Lab: Run Steward CI from the Homelab",
        activities: [
            { id: "continuous-integration-lab-001", title: "CI Design Brief", estimatedMinutes: 25, content: { type: "reading", body: "Design the smallest CI pipeline that proves Steward can move from checked-out source to a reviewable container artifact without manual workstation steps.", blocks: [
                { type: "paragraph", text: "Use a self-hosted runner or agent in the homelab. The goal is not to install every CI product; the goal is to create a trustworthy source-to-artifact feedback path." },
                { type: "heading", id: "required-path", text: "Required path", level: 2 },
                { type: "list", ordered: true, items: ["Trigger from a repository change or explicit workflow dispatch.", "Checkout a known commit.", "Restore/install dependencies without relying on undocumented runner state.", "Run source checks and tests.", "Build the Steward container image only after required checks pass.", "Preserve test/build evidence and record commit plus image identity.", "Demonstrate one failing change that correctly blocks the image stage."] },
                { type: "callout", tone: "warning", title: "Do not deploy yet", body: "This lab ends with a trustworthy artifact and evidence. Automated environment deployment belongs to Continuous Delivery and Deployment." },
                { type: "resources", title: "References", resources: [gha, jenkins, docker] },
            ] } },
            { id: "continuous-integration-lab-002", title: "Build the Steward CI Pipeline", estimatedMinutes: 180, content: { type: "practical", objective: "Run a multi-stage Steward CI pipeline on learner-managed runner infrastructure and prove success and failure behavior.", scenario: "Use GitHub Actions, Jenkins, or a deliberate combination. Prefer one clear primary workflow over duplicate pipelines.", instructions: ["Provision/register a dedicated runner or agent and document its host, account, network access and maintenance responsibility.", "Create a pipeline with separate source-check/test and container-build responsibilities.", "Ensure the image stage depends on required checks rather than running regardless of their result.", "Record commit SHA, workflow/build identity and built image tag/digest or equivalent immutable identifier.", "Preserve useful test/build evidence as pipeline artifacts where appropriate.", "Run the pipeline from a clean or cold-cache path to prove it does not require accidental runner state.", "Introduce a controlled failing test/check and prove the build stage is blocked with an understandable failure signal.", "Restore the source, rerun successfully and document the entire execution path."], deliverables: ["Versioned CI workflow/pipeline definition", "Runner/agent inventory and privilege notes", "Successful pipeline evidence", "Blocked-pipeline failure evidence", "Commit-to-image traceability record", "Remaining manual steps handed to CD"], completionCriteria: ["A repository change can trigger repeatable CI without manual build commands on the development workstation.", "Required checks fail closed and prevent artifact production when they fail.", "The built Steward image can be tied to an exact source revision.", "The pipeline does not depend on undocumented runner residue.", "The learner can explain which remaining steps are CI responsibilities and which belong to Continuous Delivery/Deployment."] } },
            { id: "continuous-integration-lab-003", title: "CI Exit Review", estimatedMinutes: 20, content: { type: "reflection", prompt: "Which remaining human step between the successful Steward image and the running homelab service creates the greatest release risk, and what evidence will the next module need before automating it?" } },
        ],
    },
];
