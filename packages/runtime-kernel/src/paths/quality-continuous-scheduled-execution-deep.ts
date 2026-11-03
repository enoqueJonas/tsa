import type { LearningResource, LessonBlock } from "../activities/content";
import type { Lesson } from "./lesson";

const gitlabCi: LearningResource = { title: "GitLab CI/CD documentation", url: "https://docs.gitlab.com/ci/" };
const gitlabSchedules: LearningResource = { title: "GitLab — Scheduled pipelines", url: "https://docs.gitlab.com/ci/pipelines/schedules/" };
const junit: LearningResource = { title: "JUnit 5 User Guide", url: "https://docs.junit.org/current/user-guide/" };

const gitlabPipelineTeachingYaml = "# Teaching example; adapt project tests, pinned image and report paths.\nworkflow:\n  rules:\n    - if: '$CI_PIPELINE_SOURCE == \"merge_request_event\"'\n    - if: '$CI_PIPELINE_SOURCE == \"schedule\"'\n    - if: '$CI_PIPELINE_SOURCE == \"push\" && $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH'\n    - when: never\nstages: [test]\nquality-fast:\n  stage: test\n  image: maven:3.9.9-eclipse-temurin-17\n  script:\n    - mvn -B test\n  rules:\n    - if: '$CI_PIPELINE_SOURCE == \"merge_request_event\"'\n    - if: '$CI_PIPELINE_SOURCE == \"push\" && $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH'\n  artifacts:\n    when: always\n    reports:\n      junit: target/surefire-reports/TEST-*.xml\n    paths: [target/surefire-reports/]\nquality-scheduled:\n  stage: test\n  image: maven:3.9.9-eclipse-temurin-17\n  script:\n    - mvn -B verify\n  rules:\n    - if: '$CI_PIPELINE_SOURCE == \"schedule\"'\n  artifacts:\n    when: always\n    reports:\n      junit: target/surefire-reports/TEST-*.xml\n    paths: [target/surefire-reports/]";

const readingBlocks: LessonBlock[] = [
    { type: "paragraph", text: "A production test-automation system does not wait for a tester to remember to run it. It connects execution cadence to engineering decisions: change-triggered checks provide fast feedback on pushes and merge requests, while scheduled regression searches more broadly for integration, environment and accumulated-regression failures." },
    { type: "heading", id: "quality-trigger-separation", text: "Different triggers answer different questions", level: 2 },
    { type: "list", items: [
        "SCM-triggered execution should prioritize deterministic, high-signal checks that can influence the change quickly.",
        "Scheduled execution may run broader API, browser and integration regression whose cost is not justified on every push.",
        "A trigger must never silently change what evidence means: the report records trigger, release/commit, environment and selected suite.",
        "Manual execution remains useful for investigation, but it is not a substitute for automated change and schedule triggers."
    ] },
    { type: "heading", id: "quality-failure-loop", text: "Close the failure loop", level: 2 },
    { type: "paragraph", text: "A red build hidden inside GitLab CI/CD is incomplete feedback. The pipeline must publish durable reports and useful failure diagnostics, then notify an appropriate learner-owned channel so a failed automated run becomes an actionable event." },
    { type: "callout", tone: "warning", title: "Do not create notification noise", body: "Notify on actionable failed or unstable runs with enough identity to triage them. Do not send success spam or hide repeated failures behind automatic reruns." },
    { type: "callout", tone: "steward", title: "Mandatory operational proof", body: "Quality Steward is complete only after the learner proves both an SCM-triggered run and a GitLab scheduled-pipeline run, publishes reports/artifacts, deliberately causes a test failure and receives the configured failure notification." },
    { type: "resources", title: "Continue learning", resources: [gitlabCi, gitlabSchedules, junit] },
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
                id: "quality-continuous-scheduled-execution-pipeline-contract",
                title: "Model GitLab Pipeline Sources and Fail-closed Reports",
                estimatedMinutes: 45,
                content: {
                    type: "reading",
                    body: "A GitLab pipeline and a GitLab job are different decisions. workflow: rules controls whether a pipeline is created; job rules decide which job enters that pipeline. Test evidence must survive an assertion failure.",
                    blocks: [
                        {type:"heading",id:"quality-ci-trigger-roles",text:"Pipeline creation versus job selection",level:2},
                        {type:"paragraph",text:"A repository push, a merge request and a time schedule have distinct CI_PIPELINE_SOURCE values: push, merge_request_event and schedule. GitLab evaluates workflow rules before creating jobs; rules are evaluated in order until a match. A final unconditional when: always can accidentally allow duplicate push and merge-request pipelines. Branch pushes and merge requests can be triggered by the same source-code update, so choose an explicit policy."},
                        {type:"heading",id:"quality-ci-trigger-example",text:"Work through a concrete YAML configuration",level:2},
                        {type:"paragraph",text:"The example below allows merge-request, scheduled and default-branch push pipelines, with two different jobs. quality-fast runs tests for merge requests and approved default-branch pushes; quality-scheduled runs a broader Maven verify step when a real schedule triggers the pipeline. For this illustrative Maven project, target/surefire-reports contains JUnit-style XML; a real project must verify its build plugin, actual report paths and selected suites. Neither presence of the YAML nor a manually started pipeline proves that a schedule exists."},
                        {type:"code",language:"yaml",code:gitlabPipelineTeachingYaml},
                        {type:"heading",id:"quality-ci-report-outcomes",text:"Preserve failures and missing evidence",level:2},
                        {type:"paragraph",text:"A failed test must exit nonzero rather than being hidden by '|| true' or allow_failure: true on mandatory checks. GitLab artifacts:reports:junit can publish XML even on failed jobs; artifacts:when:always can retain additional troubleshooting files except for some failure modes such as job timeouts. Check actual report existence and commit identity: uploading nothing is not a trustworthy gate."},
                        {type:"heading",id:"quality-ci-negative-control",text:"What breaks the gate?",level:2},
                        {type:"paragraph",text:"Negative 1: remove the schedule rule from workflow; even if a job has its own schedule rule, no matching scheduled pipeline can be created. Negative 2: set allow_failure: true on quality-fast or append '|| true' to mvn; the gate may turn green despite failing tests. Negative 3: return 0 without producing expected XML; job success now lacks sufficient test evidence. In the lab, show both GitLab UI job inclusion and an actual non-green failing run."},
                        {type:"heading",id:"quality-ci-transfer",text:"Independent source-selection exercise",level:2},
                        {type:"paragraph",text:"For a feature-branch push with no open merge request, determine whether this policy creates a pipeline and explain why. Then determine which job executes for a scheduled pipeline and what changes if a rule is misplaced. Revise the policy if the team explicitly needs branch-only fast feedback; justify duplicate-pipeline avoidance."},
                        {type:"resources",title:"GitLab reference",resources:[gitlabCi,gitlabSchedules]},
                    ],
                },
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
                        "Configure the existing GitLab CI/CD quality pipeline to start from the repository SCM integration for the agreed push and/or merge-request pipeline source; do not prove this by clicking Build Now.",
                        "Define a fast change-triggered portfolio using the existing markers/stages, including the mandatory unit/component and API/integration evidence plus only justified browser smoke coverage.",
                        "Record commit/release identity, environment, trigger type and selected suite in the run evidence.",
                        "Publish machine-readable test results and a useful human-readable report or equivalent GitLab CI/CD test view.",
                        "Preserve failure diagnostics such as logs, request context, screenshots or traces only where they improve triage.",
                        "Push a controlled change and capture evidence that GitLab CI/CD started without manual intervention."
                    ],
                    deliverables: ["GitLab rules/workflow configuration", "Automatically triggered GitLab CI/CD run", "Change-triggered suite policy", "Published test report", "Run identity evidence"],
                    completionCriteria: ["A real repository event starts the quality pipeline automatically.", "The change-triggered portfolio is intentionally smaller/faster than broad scheduled regression where justified.", "Reports identify exactly what ran and against which commit/release and environment.", "Manual Build Now is not used as proof of trigger automation."],
                },
            },
            {
                id: "quality-continuous-scheduled-execution-schedule-guide",
                title: "Schedule Ownership, Failure Classification and Notification Delivery",
                estimatedMinutes: 40,
                content: {
                    type: "reading",
                    body: "Pipeline schedule configuration, job selection and failure delivery are three distinct mechanisms. A green job without a real schedule or missing test evidence does not prove unattended quality assurance.",
                    blocks: [
                        {type:"heading",id:"schedule-creation-boundary",text:"The YAML does not create the schedule",level:2},
                        {type:"paragraph",text:"Create a pipeline schedule in GitLab's CI/CD schedules UI or approved GitLab API with the target branch, interval and authorized schedule owner. A rules condition such as CI_PIPELINE_SOURCE == schedule only selects jobs when a scheduled pipeline already exists. Confirm the actual event source in GitLab's pipeline details. An operator clicking Run does not replace evidence that the configured schedule fired unattended."},
                        {type:"heading",id:"schedule-data-isolation",text:"Control who can start and what can be mutated",level:2},
                        {type:"paragraph",text:"Scheduled regression often runs with broader, slower or state-changing checks. Use a dedicated non-production target, isolated test identities, bounded data setup and cleanup, and explicit handling of overlapping schedules. A shared database or active browser session from a previous run can manufacture flaky results; the job's exact commit and environment must be recorded."},
                        {type:"heading",id:"schedule-failure-taxonomy",text:"Diagnose three non-green outcomes separately",level:2},
                        {type:"list",items:[
                            "Product regression: an assertion observes a contractual mismatch; retain the expected/actual response and exact request identity.",
                            "Environment or runner failure: dependency unavailable, container engine missing or DNS failure; preserve job logs and classify the result as unavailable evidence, not a passed product check.",
                            "Test automation defect: fixture, selector, report parser or retry mechanism fails; preserve first-attempt evidence and attach an owner without silently quarantining all coverage."
                        ]},
                        {type:"heading",id:"schedule-alert-contract",text:"An alert must lead to a responsible action",level:2},
                        {type:"paragraph",text:"The notification should contain a safe CI pipeline/job URL, source trigger, exact commit/release, target environment, failure classification and owner. It must not include raw credentials, authorization headers, tokens or sensitive screenshots. Test receipt through a real learner-owned email/webhook; a successful code-path log claiming 'sent' is not proof of delivery."},
                        {type:"heading",id:"schedule-repair",text:"Practice: negative and recovery",level:2},
                        {type:"paragraph",text:"Cause an isolated deterministic assertion failure and confirm that the real scheduled run is non-green, artifacts remain available and the alert reaches its intended recipient. Revert the defect, observe a later success, then verify the failed record remains retrievable. If schedule, runner or notifier is inaccessible, record UNVERIFIED rather than claiming acceptance."},
                    ],
                },
            },
            {
                id: "quality-continuous-scheduled-execution-003",
                title: "Implement GitLab Scheduled Regression",
                estimatedMinutes: 120,
                content: {
                    type: "practical",
                    objective: "Run broader Steward regression automatically on a defined GitLab CI/CD schedule.",
                    scenario: "Some integration, browser and environment risks are too expensive or too broad to infer reliably from each code change. Steward therefore needs scheduled regression that runs even when nobody remembers to start it.",
                    instructions: [
                        "Choose and justify a regression cadence, then configure a GitLab pipeline schedule in GitLab and use `rules`/`CI_PIPELINE_SOURCE == \"schedule\"` in `.gitlab-ci.yml` to select the scheduled portfolio.",
                        "Define the scheduled portfolio explicitly and explain which broader API, integration, browser or other stable checks are added compared with change-triggered execution.",
                        "Prevent overlapping scheduled runs or shared-state collisions where they would corrupt evidence.",
                        "Publish the same minimum run identity and report contract used by change-triggered execution, including trigger type.",
                        "Allow the schedule to start at least one real run without manual intervention and capture the GitLab CI/CD trigger/run evidence.",
                        "Document what happens when the target environment is unavailable at schedule time; infrastructure failure must not become a green product result."
                    ],
                    deliverables: ["GitLab pipeline schedule and schedule-specific rules", "Scheduled regression policy", "Automatically scheduled run evidence", "Scheduled regression report", "Environment-unavailable behavior note"],
                    completionCriteria: ["A GitLab pipeline schedule starts a real regression run and `.gitlab-ci.yml` selects the intended scheduled jobs.", "Scheduled coverage is broader for stated risk reasons rather than merely duplicating the push suite.", "Concurrent/shared-state hazards are addressed.", "Environment or infrastructure failure remains distinguishable from product-test failure."],
                },
            },
            {
                id: "quality-continuous-scheduled-execution-004",
                title: "Implement Failure Alerts and Reports",
                estimatedMinutes: 120,
                content: {
                    type: "practical",
                    objective: "Turn failed automated runs into actionable quality feedback rather than passive red GitLab CI/CD jobs.",
                    scenario: "An unattended scheduled regression detects a Steward regression. The evidence is useful only if the failure survives the run and reaches the responsible engineer with enough context to begin triage.",
                    instructions: [
                        "Configure one real learner-owned notification channel supported by the homelab/GitLab CI/CD environment, such as email or an incoming webhook integration.",
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
