import type { Lesson } from "./lesson";
import type { LearningResource, LessonBlock } from "../activities/content";

const gitBook: LearningResource = { title: "Pro Git", url: "https://git-scm.com/book/en/v2" };
const twelveFactor: LearningResource = { title: "The Twelve-Factor App", url: "https://12factor.net/" };
const pythonLogging: LearningResource = { title: "Python Logging HOWTO", url: "https://docs.python.org/3/howto/logging.html" };
const djangoSettings: LearningResource = { title: "Django settings", url: "https://docs.djangoproject.com/en/stable/topics/settings/" };
const refactoringGuru: LearningResource = { title: "Refactoring.Guru — Refactoring", url: "https://refactoring.guru/refactoring" };

function slug(value: string) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function lesson(
    title: string,
    introduction: string,
    sections: { title: string; paragraphs: string[]; code?: { language: string; code: string; caption?: string } }[],
    objective: string,
    instructions: string[],
    questions: string[],
    resources: LearningResource[],
): Lesson {
    const id = `software-craft-${slug(title)}`;
    const blocks: LessonBlock[] = [
        { type: "paragraph", text: introduction },
        { type: "heading", id: "learning-outcomes", text: "Learning outcomes", level: 2 },
        { type: "list", items: [
            `Explain the engineering purpose of ${title.toLowerCase()} rather than treating it as ceremony.`,
            "Apply the idea to the evolving Steward API with reviewable evidence.",
            "Recognize a common failure mode and make a deliberate trade-off.",
        ] },
    ];

    for (const section of sections) {
        blocks.push({ type: "heading", id: slug(section.title), text: section.title, level: 2 });
        for (const text of section.paragraphs) blocks.push({ type: "paragraph", text });
        if (section.code) {
            const codeBlock: LessonBlock = section.code.caption
                ? { type: "code", language: section.code.language, code: section.code.code, caption: section.code.caption }
                : { type: "code", language: section.code.language, code: section.code.code };
            blocks.push(codeBlock);
        }
    }

    blocks.push({ type: "callout", tone: "steward", title: "Steward connection", body: "Software craft is the work that makes Steward safe for another engineer to change. The goal is not aesthetic perfection; it is reducing ambiguity, accidental coupling, review cost and operational surprise while preserving useful delivery speed." });
    blocks.push({ type: "resources", title: "Required and supporting reading", resources });

    return {
        id,
        title,
        activities: [
            { id: `${id}-reading`, title, estimatedMinutes: 30, content: { type: "reading", body: introduction, blocks } },
            {
                id: `${id}-practice`, title: `${title}: Engineering Practice`, estimatedMinutes: 40,
                content: {
                    type: "practical",
                    objective,
                    scenario: "Work against the current Steward API. Preserve behavior while improving how another engineer can understand, review, configure, diagnose or change the system.",
                    instructions,
                    deliverables: ["Working Steward change or focused repository experiment", "Before/after evidence and a short trade-off note"],
                    completionCriteria: ["Behavior is demonstrated, not merely described.", "The change has a clear engineering reason.", "The learner can identify what deliberately remains unchanged."],
                },
            },
            { id: `${id}-check`, title: `${title}: Knowledge Check`, estimatedMinutes: 10, content: { type: "reflection", prompt: questions.map((q, i) => `${i + 1}. ${q}`).join("\n") } },
        ],
    };
}

export const softwareCraftDeepLessons: Lesson[] = [
    lesson(
        "Git as an Engineering Tool",
        "Git is more than a backup mechanism. A useful history explains how a system evolved, isolates coherent changes, supports review and gives engineers safe ways to inspect or reverse decisions.",
        [
            { title: "Commits are engineering evidence", paragraphs: ["A commit should represent a coherent reason for change. Huge mixed commits hide causality; tiny meaningless commits create noise. The useful unit is a reviewable decision: add service ownership validation, fix dependency uniqueness, or document a configuration contract.", "Before committing, inspect the diff. Stage intentionally. A good message explains the outcome or reason rather than narrating keystrokes."] },
            { title: "History supports investigation", paragraphs: ["log, show, diff, blame and bisect turn repository history into diagnostic evidence. Blame is not a people-ranking tool; it is a path to the context in which a line changed. Bisect is especially valuable when a regression has a known good and known bad revision."], code: { language: "bash", code: "git diff\ngit diff --staged\ngit log --oneline --decorate -10\ngit show <commit>\ngit bisect start", caption: "Use history to answer questions, not only to publish code." } },
        ],
        "Turn one Steward change into a coherent, reviewable Git history.",
        ["Choose a small real Steward change and inspect the working-tree diff before staging.", "Separate unrelated generated or local files from the intended change.", "Create a commit whose message communicates the engineering outcome.", "Use git show to review the final commit as a reviewer would.", "Write one example of when bisect would be more useful than reading code manually."],
        ["What makes a commit coherent?", "Why inspect staged changes before committing?", "When is git bisect useful?"],
        [gitBook],
    ),
    lesson(
        "Branching and Collaboration",
        "Branches are temporary collaboration boundaries. Their value comes from isolating a coherent change long enough to review and integrate it—not from creating elaborate branch taxonomies.",
        [
            { title: "Keep branches purposeful", paragraphs: ["A short-lived branch should have one understandable goal and stay close enough to its base that integration remains cheap. Mixing feature work, cleanup and generated artifacts makes review harder and increases conflict risk.", "The pull request is a communication artifact: explain what changed, why, how it was validated, and what was intentionally deferred."] },
            { title: "Integrate deliberately", paragraphs: ["Merge, squash and rebase shape history differently. Squashing is useful when intermediate branch commits are implementation noise; preserving commits is useful when each commit carries meaningful reviewable structure. There is no universal moral winner—choose a repository policy and understand its consequences."] },
        ],
        "Prepare a Steward change for collaboration without introducing unnecessary branching ceremony.",
        ["Define one coherent branch goal.", "Write a PR description containing problem, approach, validation and deferred work.", "Identify files that would make the PR noisy or unrelated.", "Explain whether squash or preserved commits better fit the example and why."],
        ["Why are long-lived feature branches costly?", "What information should a useful PR description preserve?", "When can squash merging improve history?"],
        [gitBook],
    ),
    lesson(
        "Readable Code",
        "Readable code minimizes the amount of hidden reconstruction a maintainer must perform. Names, structure and explicit domain language should help a reviewer understand what the code means before they have to simulate every line mentally.",
        [
            { title: "Name the domain", paragraphs: ["Prefer names such as owning_team, dependency_service and can_manage_service over generic names such as data, obj or check. Comments should explain non-obvious constraints or reasons, not translate syntax into English.", "Readable code is contextual. A clever one-liner can be shorter while making policy harder to review."] },
            { title: "Make policy visible", paragraphs: ["Steward authorization is easier to reason about when the policy reads like the domain instead of being scattered through nested boolean expressions."], code: { language: "python", code: "def can_manage_service(user, service) -> bool:\n    return Membership.objects.filter(\n        user=user,\n        team=service.owning_team,\n        role__in={\"maintainer\", \"owner\"},\n    ).exists()", caption: "Domain language makes an authorization rule reviewable." } },
        ],
        "Improve a difficult Steward code path without changing its behavior.",
        ["Find one function or request path that requires unnecessary mental reconstruction.", "Rename ambiguous domain concepts.", "Extract only a concept that has a meaningful name and boundary.", "Run the same behavior checks before and after.", "Explain one tempting cleanup you intentionally did not perform."],
        ["What should comments explain?", "Why can shorter code be less readable?", "How do domain names improve review?"],
        [refactoringGuru],
    ),
    lesson(
        "Separation of Concerns",
        "Separation of concerns means giving different kinds of change different homes. It does not mean creating a layer, service class or interface for every function.",
        [
            { title: "Separate reasons to change", paragraphs: ["HTTP representation, authentication, authorization, domain invariants and persistence are related but not identical concerns. If one serializer method validates payload shape, decides cross-team policy, writes several models and formats operational logs, future changes become entangled.", "Boundaries are justified when they clarify ownership of behavior. Extra indirection without a distinct responsibility merely moves complexity around."] },
            { title: "A practical Steward boundary", paragraphs: ["A DRF view can coordinate request concerns, a permission can answer access policy, and domain/application code can enforce service-registration invariants. Database constraints remain the final integrity backstop where appropriate."] },
        ],
        "Map and improve one mixed-responsibility Steward request path.",
        ["Trace one write endpoint from HTTP request to database.", "Label representation, access-policy, domain and persistence responsibilities.", "Identify one responsibility currently in the wrong place.", "Refactor only that boundary and preserve tests.", "Explain why you did not add more abstraction."],
        ["What is a reason to change?", "Why is a new class not automatically better separation?", "Which concerns exist in a typical Steward write request?"],
        [refactoringGuru],
    ),
    lesson(
        "Refactoring",
        "Refactoring changes internal structure while preserving observable behavior. That constraint is what separates refactoring from feature development and makes tests and small steps so important.",
        [
            { title: "Preserve behavior deliberately", paragraphs: ["Establish a safety net before structural change. A refactor that also changes lifecycle rules, response fields and authorization semantics is difficult to review because failures have too many possible causes.", "Use small transformations and rerun focused checks. If behavior must change, name that separately rather than hiding it inside cleanup."] },
            { title: "Refactor toward a problem", paragraphs: ["Do not refactor because code feels old. Refactor to reduce duplication that causes inconsistent policy, expose a domain concept, remove harmful coupling, or make a required change safer. Stop when the problem is solved."] },
        ],
        "Refactor one Steward hotspot while proving behavior remains stable.",
        ["Choose a concrete maintainability problem.", "Capture current happy and failure behavior with tests or reproducible requests.", "Perform the smallest structural improvement.", "Rerun the evidence after each meaningful step.", "Document the problem removed and any remaining debt."],
        ["How is refactoring different from adding a feature?", "Why should behavior checks exist first?", "When should a refactor stop?"],
        [refactoringGuru],
    ),
    lesson(
        "Managing Dependencies",
        "Every dependency is code you choose to trust, update, distribute and support. Dependency management is therefore an engineering ownership decision, not just a package-install command.",
        [
            { title: "Know why a dependency exists", paragraphs: ["Prefer a dependency when it provides substantial, maintained capability that would be risky or wasteful to recreate. Avoid adding packages for trivial helpers or speculative future reuse. Distinguish direct dependencies from transitive ones and understand which public APIs your code actually relies on.", "Version constraints express compatibility policy. Locking and reproducible environments reduce accidental drift, but upgrades still require deliberate testing."] },
            { title: "Internal packages need real consumers", paragraphs: ["Do not extract steward-common merely to demonstrate modularity. A reusable package earns its boundary when multiple consumers need a stable capability with little domain coupling. Later TSA work will publish real internal artifacts through Nexus; Builder should avoid manufacturing fake reuse."], code: { language: "text", code: "application need → evaluate library → add direct dependency → lock/record version → test → maintain/upgrade\n\nreal repeated capability + multiple consumers → candidate internal package\none consumer + speculative reuse → keep local", caption: "Dependencies create continuing ownership." } },
        ],
        "Audit Steward dependencies and justify what should remain external, local or potentially reusable later.",
        ["List direct application dependencies and their purpose.", "Identify one transitive dependency and explain why application code should avoid relying on it accidentally.", "Find one dependency that could be removed or replaced with standard-library/framework capability.", "Assess whether any current code truly qualifies for an internal shared package.", "Record upgrade and validation expectations for one important dependency."],
        ["Why is a dependency an ownership decision?", "What is the danger of relying directly on a transitive dependency?", "When should steward-common be extracted?"],
        [twelveFactor],
    ),
    lesson(
        "Configuration",
        "Configuration lets the same code run safely in different environments. The important boundary is between deploy-specific values and application behavior—not between 'things in a .env file' and everything else.",
        [
            { title: "Separate config from code", paragraphs: ["Database addresses, secrets, allowed hosts and log levels vary by deployment. Lifecycle rules such as which criticality values Steward accepts are domain behavior and should not become arbitrary environment variables merely because configuration is convenient.", "Validate required configuration at startup. Silent fallback to insecure or incorrect defaults turns deployment mistakes into runtime surprises."] },
            { title: "Secrets are configuration with stricter handling", paragraphs: ["Do not commit secrets, print them in diagnostics or expose them through API errors. Local .env files can be useful developer ergonomics, but production secret distribution is an operational concern that later TSA schools will deepen."], code: { language: "python", code: "SECRET_KEY = env.str(\"DJANGO_SECRET_KEY\")\nDEBUG = env.bool(\"DJANGO_DEBUG\", default=False)\nDATABASE_URL = env.str(\"DATABASE_URL\")", caption: "Deployment-specific values are external; safe defaults remain deliberate." } },
        ],
        "Define and validate Steward's local configuration contract.",
        ["Inventory current environment-specific values.", "Separate secrets, deployment config and domain policy.", "Remove one unsafe hard-coded value if present.", "Document required variables and safe local defaults.", "Demonstrate startup failure for one missing required value without leaking its secret."],
        ["What belongs in configuration?", "Why should domain policy not automatically become environment variables?", "What should happen when required configuration is missing?"],
        [twelveFactor, djangoSettings],
    ),
    lesson(
        "Useful Logging",
        "Logs are operational evidence. A useful log helps an engineer reconstruct what the system did without exposing secrets or forcing them to read source code for every incident.",
        [
            { title: "Log events, not noise", paragraphs: ["Choose events that matter: authentication failure categories, denied service mutations, important lifecycle changes, dependency updates and unexpected exceptions. Include stable identifiers and context needed for correlation. Avoid logging every function entry or duplicating framework access logs without purpose.", "Levels communicate expected operational meaning. ERROR is not 'something happened'; DEBUG is not a dumping ground for sensitive request bodies."] },
            { title: "Structured context improves investigation", paragraphs: ["A consistent event name plus service_id, actor_id and request correlation data is easier to search than prose assembled differently in every call site. Never log passwords, raw tokens or secrets."], code: { language: "python", code: "logger.info(\n    \"service.lifecycle_changed\",\n    extra={\"service_id\": service.id, \"actor_id\": request.user.id, \"from_state\": old, \"to_state\": new},\n)", caption: "Capture operationally useful context without secrets." } },
        ],
        "Improve Steward logging around one important operation and one failure path.",
        ["Choose an operation an on-call engineer would need to reconstruct.", "Define the event and minimum useful context.", "Add logs at appropriate levels.", "Exercise success and failure paths and inspect output.", "Check explicitly that tokens, passwords and secrets are absent."],
        ["What makes a log operationally useful?", "Why are stable identifiers preferable to display names in logs?", "Which values must not be logged?"],
        [pythonLogging],
    ),
    lesson(
        "Technical Documentation",
        "Documentation should reduce the amount of private knowledge required to operate or change a system. Good documentation is executable enough to be checked against reality and scoped enough that engineers can keep it current.",
        [
            { title: "Document for a reader with a job to do", paragraphs: ["A new engineer needs to know what Steward is, how to run it, how its major domain concepts relate, how authentication works, how to exercise the API and where important decisions live. A reviewer needs different detail than an API consumer, so avoid one giant document that serves nobody well.", "Prefer commands, examples and links to canonical sources over vague prose such as 'configure the database normally.'"] },
            { title: "Documentation can drift", paragraphs: ["Treat setup steps and API examples as claims that can become false. Where possible, generate API schemas from runtime definitions, execute documented commands in CI later, and review documentation in the same PR as behavior changes."] },
        ],
        "Make Steward understandable to an engineer who has not followed its development history.",
        ["Write or revise the project overview and domain summary.", "Document clean local setup from clone to first successful API request.", "Link to OpenAPI rather than duplicating the entire contract manually.", "Add one architecture or engineering decision that explains why, not just what.", "Have the documentation identify known limitations and the next TSA stage."],
        ["What private knowledge should project documentation eliminate?", "Why are concrete commands valuable?", "How can documentation drift be reduced?"],
        [twelveFactor],
    ),
    lesson(
        "Designing Errors",
        "Errors are part of a system's interface. They should distinguish invalid input, forbidden operations, missing resources, conflicts and unexpected failures without leaking implementation details.",
        [
            { title: "Make failures actionable", paragraphs: ["A client should be able to tell whether it must change input, authenticate, request different permission, retry later or report a server failure. Stable error codes can preserve machine-readable meaning while human messages remain clear.", "Do not expose SQL errors, stack traces or token internals to API consumers. Preserve detailed evidence in controlled logs instead."] },
            { title: "Map domain failures deliberately", paragraphs: ["A duplicate service slug may be a conflict, unsupported lifecycle input is validation failure, cross-team modification is forbidden, and a missing service is not found. Framework defaults are useful, but the public contract still belongs to the application."], code: { language: "json", code: "{\n  \"code\": \"service_dependency_conflict\",\n  \"message\": \"This dependency already exists.\",\n  \"details\": {\"dependency_service_id\": 17}\n}", caption: "Expose stable meaning, not internal exception text." } },
        ],
        "Audit and improve Steward's public failure contract.",
        ["Choose validation, authorization, conflict, not-found and unexpected failure cases.", "Record current status and response shape.", "Make one inconsistent case conform to a deliberate contract.", "Verify internal exception details remain out of the response.", "Document which failures clients may safely act on."],
        ["Why are errors part of an API contract?", "What should differ between client responses and server logs?", "When is 409 more meaningful than a generic 400?"],
        [twelveFactor],
    ),
    lesson(
        "Performance Awareness",
        "Performance awareness means understanding where work happens and measuring important paths before optimization. It is not premature micro-tuning or treating every millisecond as equally valuable.",
        [
            { title: "Start with workload and evidence", paragraphs: ["Ask what users do, how much data exists, which operations are frequent, and what latency is acceptable. Previous Builder work already introduced query plans and N+1 behavior; Software Craft connects that evidence to code-review decisions.", "Optimization creates complexity. A faster implementation that is harder to reason about may be a poor trade unless the measured bottleneck matters."] },
            { title: "Watch boundaries", paragraphs: ["Database round trips, unbounded list endpoints, serialization volume and repeated external calls often dominate application code. Measure request behavior, inspect queries, and keep pagination and indexes tied to actual access patterns."] },
        ],
        "Investigate one Steward endpoint for performance risk without speculative optimization.",
        ["Choose a realistic endpoint and dataset size.", "Record baseline query count and response timing or another relevant measure.", "Inspect the dominant work and form a hypothesis.", "Make one justified improvement only if evidence supports it.", "Compare before/after results and document the complexity cost."],
        ["What should happen before optimization?", "Why can optimization reduce maintainability?", "Which boundaries commonly dominate API performance?"],
        [twelveFactor],
    ),
    {
        id: "software-craft-lab-refine-steward-api-for-review",
        title: "Lab: Refine Steward API for Review",
        activities: [
            {
                id: "software-craft-lab-refine-steward-api-for-review-brief",
                title: "From working API to reviewable engineering system",
                estimatedMinutes: 30,
                content: {
                    type: "reading",
                    body: "The Builder modules have accumulated a functioning Steward API. This lab is a deliberate maintenance pass: improve the repository so another engineer can clone it, understand its domain, review its boundaries, configure it safely, diagnose important behavior and make a change without relying on undocumented history.",
                    blocks: [
                        { type: "heading", id: "review-target", text: "The review target", level: 2 },
                        { type: "paragraph", text: "Do not rewrite Steward. Preserve the product and prove targeted improvements. The strongest submission shows restraint: it identifies concrete friction, improves it with evidence and leaves architectural work that belongs to System Thinker for the next school." },
                        { type: "heading", id: "quality-gates", text: "Quality gates", level: 2 },
                        { type: "list", items: ["Coherent Git history and reviewable changes", "Readable domain language and clear responsibility boundaries", "Dependencies and configuration are explicit", "Important operations produce useful, secret-safe logs", "Setup and technical documentation work from a clean checkout", "Public errors are deliberate and consistent", "One performance-sensitive path has measured evidence rather than guesses"] },
                        { type: "callout", tone: "warning", title: "Do not pre-build System Thinker", body: "This is a software-craft review, not permission to introduce speculative architecture layers. Record structural questions that need deeper system modeling and carry them forward." },
                    ],
                },
            },
            {
                id: "software-craft-lab-refine-steward-api-for-review-practice",
                title: "Engineering Review Pass",
                estimatedMinutes: 180,
                content: {
                    type: "practical",
                    objective: "Refine Steward API into a repository another engineer can review, run and safely change.",
                    scenario: "You are handing Steward to a teammate who knows Django but has not followed the TSA lessons. They must be able to understand the service-registry domain and verify the system without asking for undocumented setup knowledge.",
                    instructions: ["Start from a clean-review mindset: inspect repository status and intended tracked files without deleting local work.", "Identify three concrete maintainability or review problems and rank them by impact.", "Refactor at least one code boundary while preserving behavior with tests or request evidence.", "Audit direct dependencies and document why important ones exist; do not extract speculative shared packages.", "Make configuration requirements explicit and verify missing required configuration fails safely.", "Add or improve useful logging for an important domain operation and a denied/failure path, checking for secret leakage.", "Make README/setup documentation sufficient from clone to database migration, user/token creation and first useful Steward request.", "Review API errors for validation, authorization, conflict, missing resource and unexpected failure behavior.", "Measure one meaningful endpoint for query count, plan or latency and record whether optimization is justified.", "Prepare the final diff and review it as if it came from another engineer; remove only changes you intentionally own and never clean unknown local files destructively.", "Write a handoff note listing what Builder now guarantees and which architectural questions should move to System Thinker."],
                    deliverables: ["Review-ready Steward API repository", "Working setup and technical documentation", "Maintainability/refactoring evidence", "Dependency and configuration notes", "Logging and error-contract evidence", "One measured performance investigation", "System Thinker handoff note"],
                    completionCriteria: ["A new engineer can run Steward from documentation.", "The repository exposes domain intent without unnecessary abstraction.", "Important configuration and dependencies are explicit.", "Logs aid investigation without leaking credentials or tokens.", "Failure responses are deliberate.", "Performance claims are backed by evidence.", "The learner can defend both changes made and refactors deliberately deferred."],
                },
            },
            { id: "software-craft-lab-refine-steward-api-for-review-check", title: "Review the review", estimatedMinutes: 20, content: { type: "reflection", prompt: "1. Which change most reduced the cost for the next engineer, and what evidence supports that?\n2. Which cleanup did you deliberately refuse because it lacked a concrete problem?\n3. What part of Steward now has the clearest ownership of behavior?\n4. Which structural concern belongs in System Thinker rather than Builder?\n5. Could another engineer reproduce your setup, failure cases and performance evidence without asking you for hidden context?" } },
        ],
    },
];
