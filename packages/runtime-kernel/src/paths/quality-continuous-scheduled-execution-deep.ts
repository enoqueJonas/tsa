import type { LearningResource, LessonBlock } from "../activities/content";
import type { Lesson } from "./lesson";

const jenkins: LearningResource = { title: "Jenkins Pipeline documentation", url: "https://www.jenkins.io/doc/book/pipeline/" };
const jenkinsTriggers: LearningResource = { title: "Jenkins Pipeline Syntax — triggers", url: "https://www.jenkins.io/doc/book/pipeline/syntax/#triggers" };
const pytest: LearningResource = { title: "pytest documentation", url: "https://docs.pytest.org/" };

const readingBlocks: LessonBlock[] = [
    { type: "paragraph", text: "A production test-automation system does not wait for a tester to remember to run it. It connects execution cadence to engineering decisions: change-triggered checks provide fast feedback on pushes and pull requests, while scheduled regression searches more broadly for integration, environment and accumulated-regression failures." },
    { type: "heading", id: "quality-trigger-separation", text: "Different triggers answer different questions", level: 2 },
    { type: "list", items: [
        "SCM-triggered execution should prioritize deterministic, high-signal checks that can influence the change quickly.",
        "Scheduled execution may run broader API, browser and integration regression whose cost is not justified on every push.",
        "A trigger must never silently change what evidence means: the report records trigger, release/commit, environment and selected suite.",
        "Manual execution remains useful for investigation, but it is not a substitute for automated change and schedule triggers."
    ] },
    { type: "heading", id: "quality-failure-loop", text: "Close the failure loop", level: 2 },
    { type: "paragraph", text: "A red build hidden inside Jenkins is incomplete feedback. The pipeline must publish durable reports and useful failure diagnostics, then notify an appropriate learner-owned channel so a failed automated run becomes an actionable event." },
    { type: "callout", tone: "warning", title: "Do not create notification noise", body: "Notify on actionable failed or unstable runs with enough identity to triage them. Do not send success spam or hide repeated failures behind automatic reruns." },
    { type: "callout", tone: "steward", title: "Mandatory operational proof", body: "Quality Steward is complete only after the learner proves both an SCM-triggered run and a Jenkins cron-triggered run, publishes reports/artifacts, deliberately causes a test failure and receives the configured failure notification." },
    { type: "resources", title: "Continue learning", resources: [jenkins, jenkinsTriggers, pytest] },
];

export const continuousAndScheduledQualityExecutionDeepLessons: Lesson[] = [
    {
        id: "quality-continuous-scheduled-execution",
        title: "Continuous and Scheduled Quality Execution",
        activities: [
            {
                id: "quality-continuous-scheduled-execution-001",
                title: "Design Triggered Quality Feedback",
                estimatedMinutes: 45,
                content: { type: "reading", body: "Connect Steward's automated quality portfolio to real engineering events and operational feedback.", blocks: readingBlocks },
            },
            {
                id: "quality-continuous-scheduled-execution-002",
                title: "Implement SCM-triggered Automated Testing",
                estimatedMinutes: 120,
                content: {
                    type: "practical",
                    objective: "Make Steward automated tests execute automatically when source changes require fast quality feedback.",
                    scenario: "Developers are merging Steward changes frequently. Waiting for a tester to start regression manually allows obvious failures to survive too long, but running the entire portfolio on every commit would make feedback unnecessarily slow.",
                    instructions: [
                        "Configure the existing Jenkins quality pipeline to start from the repository SCM integration for the agreed push and/or pull-request event; do not prove this by clicking Build Now.",
                        "Define a fast change-triggered portfolio using the existing markers/stages, including the mandatory unit/component and API/integration evidence plus only justified browser smoke coverage.",
                        "Record commit/release identity, environment, trigger type and selected suite in the run evidence.",
                        "Publish machine-readable test results and a useful human-readable report or equivalent Jenkins test view.",
                        "Preserve failure diagnostics such as logs, request context, screenshots or traces only where they improve triage.",
                        "Push a controlled change and capture evidence that Jenkins started without manual intervention."
                    ],
                    deliverables: ["SCM trigger configuration", "Automatically triggered Jenkins run", "Change-triggered suite policy", "Published test report", "Run identity evidence"],
                    completionCriteria: ["A real repository event starts the quality pipeline automatically.", "The change-triggered portfolio is intentionally smaller/faster than broad scheduled regression where justified.", "Reports identify exactly what ran and against which commit/release and environment.", "Manual Build Now is not used as proof of trigger automation."],
                },
            },
            {
                id: "quality-continuous-scheduled-execution-003",
                title: "Implement Jenkins CRON Regression",
                estimatedMinutes: 120,
                content: {
                    type: "practical",
                    objective: "Run broader Steward regression automatically on a defined Jenkins schedule.",
                    scenario: "Some integration, browser and environment risks are too expensive or too broad to infer reliably from each code change. Steward therefore needs scheduled regression that runs even when nobody remembers to start it.",
                    instructions: [
                        "Choose and justify a regression cadence, then configure a Jenkins cron trigger in source-controlled pipeline configuration where practical.",
                        "Define the scheduled portfolio explicitly and explain which broader API, integration, browser or other stable checks are added compared with change-triggered execution.",
                        "Prevent overlapping scheduled runs or shared-state collisions where they would corrupt evidence.",
                        "Publish the same minimum run identity and report contract used by change-triggered execution, including trigger type.",
                        "Allow the schedule to start at least one real run without manual intervention and capture the Jenkins trigger/run evidence.",
                        "Document what happens when the target environment is unavailable at schedule time; infrastructure failure must not become a green product result."
                    ],
                    deliverables: ["Jenkins cron configuration", "Scheduled regression policy", "Automatically scheduled run evidence", "Scheduled regression report", "Environment-unavailable behavior note"],
                    completionCriteria: ["Jenkins starts a real regression run from its schedule.", "Scheduled coverage is broader for stated risk reasons rather than merely duplicating the push suite.", "Concurrent/shared-state hazards are addressed.", "Environment or infrastructure failure remains distinguishable from product-test failure."],
                },
            },
            {
                id: "quality-continuous-scheduled-execution-004",
                title: "Implement Failure Alerts and Reports",
                estimatedMinutes: 120,
                content: {
                    type: "practical",
                    objective: "Turn failed automated runs into actionable quality feedback rather than passive red Jenkins jobs.",
                    scenario: "An unattended scheduled regression detects a Steward regression. The evidence is useful only if the failure survives the run and reaches the responsible engineer with enough context to begin triage.",
                    instructions: [
                        "Configure one real learner-owned notification channel supported by the homelab/Jenkins environment, such as email or an incoming webhook integration.",
                        "Include pipeline/job identity, trigger type, commit/release, environment, result and a safe route to the report/build in the notification; never include secrets.",
                        "Introduce a controlled deterministic test failure and prove the pipeline becomes failed or unstable according to policy instead of swallowing the exit code.",
                        "Verify test reports and relevant failure artifacts are retained even though the stage failed.",
                        "Capture the received notification and use its context to locate the failing test evidence.",
                        "Restore the controlled failure and rerun to prove recovery without deleting the historical failure evidence.",
                        "Define notification-noise rules for repeated failures, flaky/quarantined tests and successful recovery."
                    ],
                    deliverables: ["Failure notification configuration", "Controlled failing run", "Received alert evidence", "Failure report/artifacts", "Recovery run", "Notification-noise policy"],
                    completionCriteria: ["A deterministic failing test makes the pipeline visibly non-green.", "The configured channel actually receives a failure notification.", "The notification identifies the run without exposing credentials or sensitive test data.", "Reports and diagnostics remain available after failure.", "Recovery is demonstrated while historical failure evidence remains auditable."],
                },
            },
            {
                id: "quality-continuous-scheduled-execution-005",
                title: "Defend the Quality Execution Policy",
                estimatedMinutes: 20,
                content: { type: "reflection", prompt: "Explain why Steward runs different evidence on SCM events and scheduled regression, which failures should block or alert, how reports and notifications preserve triage context, and how you would prevent flaky tests, reruns or notification noise from creating misleading confidence.", minimumCharacters: 350 },
            },
        ],
    },
];
