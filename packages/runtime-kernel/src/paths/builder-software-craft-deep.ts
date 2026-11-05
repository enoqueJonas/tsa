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

const craftTeaching: Record<string, { outcomes: string[]; practical: string }> = {
  "Git as an Engineering Tool": { outcomes: ["Distinguish working-directory changes, staged content and committed history.", "Create and inspect two local commits without staging unrelated files.", "Safely restore a deliberate scratch edit without rewriting history."], practical: "Build and inspect two local commits" },
  "Investigate Bugs with Git History": { outcomes: ["Define a repeatable pass/fail condition for a regression.", "Find its first bad commit with a real Git bisect session.", "Restore the original branch and explain when bisect evidence is unreliable."], practical: "Find the first bad Git commit" },
  "Branching and Collaboration": { outcomes: ["Explain what a local branch points to and how commits diverge.", "Create, compare, merge and delete a small focused branch with evidence.", "Compare merge, squash and rebase without rewriting shared history."], practical: "Create and merge a focused branch" },
  "Resolve a Merge Conflict": { outcomes: ["Reproduce a real same-line merge conflict in a scratch repository.", "Decide a correct combined result from the stated requirement rather than marker position.", "Commit and verify the resolution while recognizing semantic conflicts Git may miss."], practical: "Resolve and verify a real Git conflict" },
  "Readable Code": { outcomes: ["Recognize names that hide domain rules.", "Explain cohesion and coupling using a concrete function.", "Make one behavior-preserving readability change and reject unnecessary abstraction."], practical: "Make a domain function easier to understand" },
  "Separation of Concerns": { outcomes: ["Identify HTTP, domain, persistence and policy responsibilities.", "Draw a dependency direction that avoids cycles.", "Compare a minimal separation with unnecessary layers."], practical: "Separate responsibilities in one request path" },
  "Refactoring": { outcomes: ["Distinguish restructuring from changing externally observed behavior.", "Use a characterization test before editing unfamiliar code.", "Apply a small, named refactoring and know when to stop."], practical: "Refactor with a verified safety net" },
  "Write Your First Automated Tests": { outcomes: ["Create a real unittest suite with positive and negative assertions.", "Run the tests independently of Django and explain arrange, act and assert.", "Mutate an authorization rule and prove the negative test fails."], practical: "Run and deliberately break three unit tests" },
  "Testing as a Change Safety Net": { outcomes: ["Define observable behavior to protect with tests.", "Prove a negative test fails for the intended defect.", "Choose the narrowest honest test boundary and record remaining risks."], practical: "Prove a refactor preserves behavior" },
  "Understand Python Packages and Dependencies": { outcomes: ["Distinguish a module, import package, installed distribution and project dependency.", "Inspect the interpreter and pip that own an environment.", "Read declared direct requirements without confusing them with all installed distributions."], practical: "Inspect a Python environment and requirements" },
  "Managing Dependencies": { outcomes: ["Justify a dependency using actual project consumers and alternatives.", "Separate version ranges, installed resolutions and safe upgrade checks.", "Avoid premature internal packages without real reuse."], practical: "Review an external or internal dependency" },
  "Read Environment Variables in Python": { outcomes: ["Explain how process environment variables are inherited by Python.", "Run missing, accepted and rejected settings without third-party libraries.", "Distinguish a shell export from a .env file and validate string inputs."], practical: "Read and validate environment variables" },
  "Configuration": { outcomes: ["Separate code from environment-owned settings.", "Validate types and fail visibly when required configuration is absent.", "Avoid exposing credentials through defaults or logs."], practical: "Prove configuration fails safely" },
  "Check Python Code Before Running It": { outcomes: ["Compile real files to recognize syntax failures without running application logic.", "Explain what py_compile can and cannot prove.", "Distinguish a syntax check from a negative behavior test."], practical: "Check Python syntax and a wrong-result case" },
  "Static Analysis and Automated Feedback": { outcomes: ["Distinguish formatting, linting, type checking, framework checks and behavior tests.", "Run only configured tools with reproducible evidence.", "Use a negative authorization test to expose a rule static checks cannot prove."], practical: "Build a credible local feedback sequence" },
  "Review a Code Change": { outcomes: ["Review intended behavior and access rules before style.", "Detect a cross-customer leak with a negative test and verify the fix.", "Classify blockers, requirement questions and optional suggestions by consequence."], practical: "Review and retest an unsafe patch" },
  "Managing Technical Debt": { outcomes: ["Separate a current defect from future maintenance cost.", "Record concrete evidence, affected change, owner and revisit trigger.", "Choose repayment or deliberate deferral based on real risk."], practical: "Make an evidence-based debt decision" },
  "Python Logging from First Principles": { outcomes: ["Trace a logging call through a named logger, effective level, handler and formatter without equating logger names to files.","Demonstrate why DEBUG may be discarded despite logger.setLevel(DEBUG), and why propagation can duplicate events.","Capture INFO and WARNING deterministically using only Python standard-library logging; diagnose configuration rather than guessing."], practical: "Build, inspect and break a Python logger pipeline" },
  "Failure Boundaries and Public Error Contracts": { outcomes: ["Separate invalid requests, unauthenticated requests, forbidden actions, concealed resources, conflicts and unexpected exceptions.","Write stable public error fields and show a deliberate raw-exception leakage mutant is rejected.","Distinguish an executable pure-Python response-policy unit from actual DRF HTTP behavior and plan real HTTP assertions."], practical: "Test public failures and reject a leaking error mapper" },
  "Useful Logging": { outcomes: ["Select events that answer operational questions.", "Capture stable context without leaking credentials.", "Test expected, rejected and unexpected outcomes with useful log levels."], practical: "Capture safe, diagnostic events" },
  "Write a README Someone Can Follow": { outcomes: ["Explain what a new engineer needs before running a command.", "Execute a documented successful and rejected command in a controlled environment.", "Recognize what simple documentation verification cannot prove."], practical: "Write and test runnable README commands" },
  "Technical Documentation": { outcomes: ["Choose README, API docs, ADR and runbook for the correct readers.", "Verify actual setup, API and database claims before promising a handoff.", "Document consequential decisions and safe diagnostic stopping points."], practical: "Document and verify the Steward handoff" },
  "Designing Errors": { outcomes: ["Distinguish expected domain rejections from programming failures.", "Map errors to stable API contracts.", "Avoid logging or returning sensitive implementation details."], practical: "Design and test meaningful errors" },
  "Performance Awareness": { outcomes: ["State a measurable performance hypothesis and baseline.", "Separate SQL execution, HTTP latency and tail behavior.", "Recommend a change only when evidence supports it."], practical: "Measure before optimizing" },
};

function lesson(
    title: string,
    introduction: string,
    sections: { title: string; paragraphs: string[]; code?: { language: string; code: string; caption?: string } }[],
    objective: string,
    instructions: string[],
    questions: string[],
    resources: LearningResource[],
    stableId?: string,
): Lesson {
    const id = stableId ?? `software-craft-${slug(title)}`;
    const blocks: LessonBlock[] = [
        { type: "paragraph", text: introduction },
        { type: "heading", id: "learning-outcomes", text: "Learning outcomes", level: 2 },
        { type: "list", items: craftTeaching[title]?.outcomes ?? ["Explain the concept and demonstrate it with evidence."] },
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

    blocks.push({ type: "resources", title: "Required and supporting reading", resources });

    return {
        id,
        title,
        activities: [
            { id: `${id}-reading`, title, estimatedMinutes: 30, content: { type: "reading", body: blocks.filter((block) => block.type === "paragraph").map((block) => block.text).join("\n\n") || introduction, blocks } },
            {
                id: `${id}-practice`, title: craftTeaching[title]?.practical ?? `Practise ${title}`, estimatedMinutes: 40,
                content: {
                    type: "practical",
                    objective,
                    scenario: "Work against the current Steward API. Preserve behavior while improving how another engineer can understand, review, configure, diagnose or change the system.",
                    instructions,
                    deliverables: ["Working Steward change or focused repository experiment", "Before/after evidence and a short trade-off note"],
                    completionCriteria: ["Behavior is demonstrated, not merely described.", "The change has a clear engineering reason.", "The learner can identify what deliberately remains unchanged."],
                },
            },
            { id: `${id}-check`, title: `Check: ${title}`, estimatedMinutes: 10, content: { type: "reflection", prompt: questions.map((q, i) => `${i + 1}. ${q}`).join("\n") } },
        ],
    };
}

export const softwareCraftDeepLessons: Lesson[] = [
    lesson(
        "Git as an Engineering Tool",
        "Git records snapshots of a project over time. This lesson is about understanding what you are changing, what you are committing and what another engineer can inspect. Work first in a disposable local repository so a misplaced command cannot damage an existing Steward project. The next lesson teaches how to locate a regression through history.",
        [
        {
                "title": "What Git tracks: working directory, staging area and commits",
                "paragraphs": [
                        "The working directory contains the files you are editing. The staging area (also called the index) holds the exact version of each file that the next commit would record. A commit records a snapshot plus its parent, author and message; the branch name points to the latest commit in that line of history. A remote repository is a separate copy you can exchange commits with, not a requirement for local commits.",
                        "Changing a file does not update the staging area. Staging a file does not create a commit. Committing does not push anything to GitHub. Read git status to learn which of these states your current files occupy. For example, a modified but unstaged README can differ from the staged copy of that same README."
                ]
        },
        {
                "title": "Create a real repository without touching your project",
                "paragraphs": [
                        "Use an empty scratch directory. The commands configure a name and email only inside this repository, initialize its main branch, create two small text files and make the first commit. The address uses the reserved .invalid domain and is not a real recipient. If your Git does not support git init -b main, run git init followed by git branch -M main.",
                        "The terminal should report a new root commit and git status should show a clean working tree. There is no remote or Steward application in this exercise. Do not copy prompts or explanatory output as part of the commands."
                ],
                "code": {
                        "language": "bash",
                        "caption": "Git lab — create a disposable repository and first commit",
                        "code": "mkdir tsa-git-review-lab && cd tsa-git-review-lab\ngit init -b main\ngit config user.name \"TSA Learner\"\ngit config user.email \"learner@example.invalid\"\nprintf 'threshold=24\\n' > rules.txt\nprintf 'Dispatch threshold is 24 hours.\\n' > README.md\ngit add rules.txt README.md\ngit commit -m \"add dispatch threshold and explanation\"\ngit status --short\ngit log --oneline -1"
                }
        },
        {
                "title": "See the difference between an edit and a staged edit",
                "paragraphs": [
                        "Add one documentation sentence and an unrelated local note. Before staging, git diff -- README.md shows the changed tracked file but not the new untracked note. git status --short uses M for modified tracked files and ?? for untracked files. This is the point to decide what belongs in the next commit, not merely to run git add -A.",
                        "Stage only README.md. git diff --cached now shows the contents proposed for the next commit. Commit it with a message describing the change. Inspect git show --name-only HEAD: it should name README.md, not personal-notes.txt. The unrelated note remains untracked. Do not use any real passwords or private customer data in your scratch note."
                ],
                "code": {
                        "language": "bash",
                        "caption": "Git lab — stage one change but leave unrelated work out",
                        "code": "printf 'Check the threshold before dispatch.\\n' >> README.md\nprintf 'local example, not a secret\\n' > personal-notes.txt\ngit status --short\ngit diff -- README.md\ngit add README.md\ngit diff --cached -- README.md\ngit commit -m \"explain when dispatch threshold is checked\"\ngit show --name-only --format=oneline HEAD\ngit status --short"
                }
        },
        {
                "title": "Inspect exactly what a commit changed",
                "paragraphs": [
                        "git log --oneline lists commits from newest to older. HEAD names the current commit and HEAD~1 its first parent. git show HEAD displays one commit and patch; git diff HEAD~1 HEAD compares two snapshots, so you can explain exactly what the second commit changed. The output is evidence, not an invitation to blame a teammate.",
                        "Use Git's built-in git help show, git help diff and git help status when you do not remember options. The later regression-investigation lesson covers blame and bisect with a complete known-good/known-bad experiment; do not start a bisect session simply because it looks advanced."
                ],
                "code": {
                        "language": "bash",
                        "caption": "Git lab — inspect a real pair of commits",
                        "code": "git log --oneline --decorate -3\ngit show --stat HEAD\ngit diff HEAD~1 HEAD -- README.md\ngit status --short"
                }
        },
        {
                "title": "Restore, revert and reset are not interchangeable",
                "paragraphs": [
                        "git restore restores selected working-tree content (or, with --staged, removes selected changes from the index). git revert records a new commit that reverses a chosen earlier commit, which keeps a shared history readable. git reset moves a branch reference and may discard local work depending on its mode; beginners should not run reset --hard in a real repository to solve an unfamiliar status message.",
                        "For a safe demonstration, edit README.md in this disposable repository without staging, inspect git diff and use git restore README.md to discard that one deliberate scratch edit. Verify git diff is empty afterward. Do not execute restore on a real file until you have verified it contains nothing you need to keep."
                ],
                "code": {
                        "language": "bash",
                        "caption": "Git lab — restore one deliberately disposable edit",
                        "code": "printf 'SCRATCH EDIT TO DISCARD\\n' >> README.md\ngit diff -- README.md\ngit restore README.md\ngit diff -- README.md\ngit status --short"
                }
        }
],
        "Create two reviewable local commits, distinguish working/staged/committed content, and prove unrelated files were excluded.",
        [
        "Run the first command block in an empty directory and identify the working tree, index, HEAD and branch.",
        "Execute the second block, inspect unstaged and staged diffs, and explain why the local note is not in the latest commit.",
        "Run the history commands and identify what changed from HEAD~1 to HEAD.",
        "Use restore only on the deliberately disposable edit and verify the staged diff and committed history remain intact.",
        "Show git status --short and git show --name-only HEAD to another learner; describe what remains intentionally untracked.",
        "Only after the scratch exercise, apply the same review process to a small real Steward change without adding unrelated/generated files."
],
        [
        "What is the difference between an edited file, a staged file and a committed file?",
        "Does git commit publish your change to GitHub? What is missing?",
        "Why can git status show an untracked file even after a successful commit?",
        "When is git revert safer than resetting shared history?"
],
        [gitBook],
    ),
    lesson(
        "Investigate Bugs with Git History",
        "When a defect appears after several commits, guessing which recent change caused it wastes time. Git can answer a precise question: between a known-good revision and a known-bad revision, which commit first produced the failure? Learn how to investigate evidence and use git bisect without risking an existing working tree.",
        [
        {
                "title": "Begin with a reproducible failure",
                "paragraphs": [
                        "A regression is behavior that worked in an earlier version but fails in a later one. Before blaming a commit, define a test that returns success for the behavior you want and failure for the behavior you do not. The test must be repeatable and free of unrelated dependencies, otherwise the search can identify the wrong revision.",
                        "git log, git show and git diff help when the candidate interval is small. git blame identifies the commit that last touched particular lines, but the most recent editor is not necessarily the cause of the defect. git bisect uses test results across a known interval to narrow the search, normally in logarithmic rather than linear steps."
                ]
        },
        {
                "title": "Build four real commits, including one deliberate defect",
                "paragraphs": [
                        "Use a second disposable directory so the first Git lab and any real Steward work remain untouched. This script creates two good commits, one commit that changes limit=10 to limit=0 (the defect), and a later documentation-only commit. It tags the known-good and known-bad commits as teaching-good and teaching-bad. Unlike temporary shell variables, these tags remain available in later terminal sessions. All commits are local and use a fake identity configured only for this repository.",
                        "The domain here is a simple configuration threshold, not the Steward application. The goal is to learn the history mechanism independently of a framework or database. Do not include real credentials or production files in a bisect demonstration."
                ],
                "code": {
                        "language": "bash",
                        "caption": "Git bisect lab — create a known good and known bad history",
                        "code": "mkdir tsa-git-bisect-lab && cd tsa-git-bisect-lab\ngit init -b main\ngit config user.name \"TSA Learner\"\ngit config user.email \"learner@example.invalid\"\nprintf 'limit=10\\n' > config.txt\ngit add config.txt\ngit commit -m \"set initial safe limit\"\ngit tag teaching-good\nprintf 'A safe limit is 10.\\n' > README.md\ngit add README.md\ngit commit -m \"document safe limit\"\nprintf 'limit=0\\n' > config.txt\ngit add config.txt\ngit commit -m \"accidentally set zero limit\"\nprintf 'Deployment notes.\\n' >> README.md\ngit add README.md\ngit commit -m \"add deployment notes\"\ngit tag teaching-bad\ngit log --oneline --decorate -4"
                }
        },
        {
                "title": "Run a test against each candidate revision",
                "paragraphs": [
                        "The test checks whether config.txt still contains exactly limit=10. The sh command exits 0 when the condition passes (good), and 1 when it fails (bad). git bisect start teaching-bad teaching-good establishes the interval. git bisect run executes the same test at selected revisions and prints the first bad commit. This is not the author of the change being judged; it is the source revision that first made our specific condition false.",
                        "Run this block from the same tsa-git-bisect-lab directory after the preceding block; it may be a new terminal because the good/bad revisions were saved as Git tags. On completion git bisect reset returns to the original branch/working state. Inspect the found commit after reset using git show HEAD~1 for this known four-commit example. If the tags are missing, verify you are in the correct disposable repository instead of guessing commit hashes."
                ],
                "code": {
                        "language": "bash",
                        "caption": "Git bisect lab — run a real good-bad test and restore the branch",
                        "code": "git bisect start teaching-bad teaching-good\ngit bisect run sh -c 'grep -q \"^limit=10$\" config.txt'\ngit bisect log\ngit bisect reset\ngit show HEAD~1 -- config.txt\ngit status --short"
                }
        },
        {
                "title": "When automated bisect is not appropriate",
                "paragraphs": [
                        "A test might require data that is not available in an older revision or may be flaky. git bisect skip can mark an untestable commit, but repeated skips may leave multiple possible first-bad commits. A failure that depends on an external service or changing environment can make a clean source-history answer impossible. Do not misreport those cases as a proven culprit.",
                        "Running a test against historical commits may execute untrusted scripts or destructive database operations. Use isolated test data and review the test command first. Never run an integration script that modifies production while bisect changes the source."
                ]
        },
        {
                "title": "Transfer the method to a real project",
                "paragraphs": [
                        "When Steward has a regression, first record a failing unit/API/database contract, the earliest known passing revision and the current failing revision. Inspect the relevant files and commits with git log -- path and git show. Use bisect only if each candidate can be built and tested in an isolated environment. Stop after identifying a candidate change; then explain the causal behavior rather than assuming the commit message proves why it failed.",
                        "Write down the test, its observed outputs and the final revision. This evidence should be reproducible by another engineer who has never seen your chat history."
                ]
        }
],
        "Identify the exact commit that introduces a controlled regression using a repeatable Git test and restore the repository state.",
        [
        "Create the four-commit disposable repository and mark the known GOOD and BAD commits.",
        "Before running bisect, predict which of the four commit messages should be identified as the first bad revision.",
        "Run the actual bisect command using a deterministic grep test; capture the printed first bad commit and inspect its patch.",
        "Run git bisect reset and verify you are back on the original main branch with a clean working tree.",
        "Explain one case where a flaky or destructive test would invalidate the investigation.",
        "On a separate real Steward change, describe the smallest safe test you would use before trusting bisect."
],
        [
        "What does git bisect need in addition to a list of commits?",
        "Why is the most recent line editor not necessarily the source of a regression?",
        "What does exit code zero mean to git bisect run?",
        "Why must you run git bisect reset and keep the test isolated?"
],
        [gitBook],
    ),
    lesson(
        "Branching and Collaboration",
        "A Git branch is a movable name pointing to a commit. It lets you develop and review a focused change without changing the main line of work. Learn creating, comparing, merging and retiring a local branch before adding pull requests, remote synchronization or rebasing to the story.",
        [
        {
                "title": "What a branch actually is",
                "paragraphs": [
                        "A commit identifies a snapshot and parent history. A branch name such as main or feature/add-note points to the latest commit on one line of work. git switch changes which branch is checked out; git switch -c creates a new branch at the current commit and switches to it. Creating a branch does not copy a whole project into another server or publish it on GitHub.",
                        "Two branches may have a common ancestor, then accumulate different commits. Merging combines those lines, potentially creating a merge commit with two parents. It is a history and content operation, not proof the resulting application works. You still have to run tests and inspect the final behavior."
                ]
        },
        {
                "title": "Create a local feature branch in a fresh repository",
                "paragraphs": [
                        "Use this entire block in an empty directory, not inside an existing Steward repository. The example is deliberately about a small review note and a configuration file. It creates one initial commit on main, switches to a feature branch and commits README.md there. No GitHub remote or review account is required.",
                        "After git switch -c, verify git branch --show-current reports feature/add-note. The feature branch contains the new README commit; main still points to the original configuration commit. Both branches refer to the same underlying Git object database."
                ],
                "code": {
                        "language": "bash",
                        "caption": "Branch lab — create an isolated feature branch",
                        "code": "mkdir tsa-git-branch-lab && cd tsa-git-branch-lab\ngit init -b main\ngit config user.name \"TSA Learner\"\ngit config user.email \"learner@example.invalid\"\nprintf 'mode=development\\n' > config.txt\ngit add config.txt\ngit commit -m \"start development configuration\"\ngit switch -c feature/add-note\nprintf 'Change reviewed before release.\\n' > README.md\ngit add README.md\ngit commit -m \"document review checkpoint\"\ngit branch --show-current\ngit status --short\ngit log --oneline --decorate -3"
                }
        },
        {
                "title": "Compare a branch before merging it",
                "paragraphs": [
                        "First return to main. git diff main...feature/add-note compares the feature tip against their common ancestor and shows the patch proposed for review. A pull request on a hosting service performs a similar comparison and adds conversation, approvals and automation. The three-dot comparison is useful before merging; after merging into main, that same comparison may become empty.",
                        "Before review, ask what problem the branch solves, which files are part of the change, how it was checked and what remains intentionally deferred. A correct-looking diff does not prove the code works; tests and domain behavior must still be checked. This example only modifies a README, so the observable evidence is the resulting file and history."
                ],
                "code": {
                        "language": "bash",
                        "caption": "Branch lab — compare and merge the focused change",
                        "code": "git switch main\ngit diff --stat main...feature/add-note\ngit merge --no-ff -m \"merge reviewed documentation\" feature/add-note\ngit log --graph --oneline --decorate --all -5\ngit status --short\ngrep -q 'Change reviewed before release.' README.md"
                }
        },
        {
                "title": "Choose a merge strategy deliberately",
                "paragraphs": [
                        "A normal merge preserves both branch commits and can create a two-parent merge commit. A squash merge creates one combined commit on the target branch and does not preserve the feature-branch topology there. Rebase replays commits onto a different base and gives them new identities; it can simplify a private branch but must be coordinated before rewriting shared history. These are distinct operations with trade-offs, not style rankings.",
                        "For the scratch example we used --no-ff to make the integration commit visible even though Git could have fast-forwarded. On a real team, follow the repository's agreed review/merge policy. Do not force-push a branch other people depend on merely to make the graph attractive. Never treat a successful textual merge as proof an API contract or database migration is compatible."
                ]
        },
        {
                "title": "Remove a local branch only after confirming integration",
                "paragraphs": [
                        "After the feature change is merged, git branch --merged main lists locally merged branches. git branch -d feature/add-note refuses to delete a branch that Git still considers unmerged; that safety check is useful. Deleting the local branch name does not remove the integrated commit history. A remote branch, if one exists later, is a separate object with separate cleanup steps.",
                        "Run the following only in the disposable repository. A real project may require pull-request approval, release evidence and branch-protection checks before deleting a remote branch. The next lesson demonstrates why branches sometimes need a real conflict resolution rather than this clean merge."
                ],
                "code": {
                        "language": "bash",
                        "caption": "Branch lab — delete only the merged local feature branch",
                        "code": "git branch --merged main\ngit branch -d feature/add-note\ngit branch --list\ngit status --short"
                }
        }
],
        "Create, review, merge and safely retire a feature branch in an actual local Git repository.",
        [
        "Run the source-published setup block in an empty directory, verifying which branch holds the initial and feature commits.",
        "Before merging, predict what git diff main...feature/add-note should show.",
        "Run the compare/merge block and confirm that README.md appears on main and the merge commit connects both lines of history.",
        "Run the merged-branch cleanup block and explain why git branch -d was safe here.",
        "Draft a pull-request summary for this exact change: problem, content, validation and deferred work. Explain whether squash or preserve-merge is preferable and why.",
        "Only after this disposable exercise, describe how you would create a focused Steward branch without mixing unrelated files."
],
        [
        "Does a local branch create a separate repository or server?",
        "What is the difference between a feature-branch commit and a merge commit?",
        "Why inspect the three-dot diff before integration?",
        "When is rebase appropriate, and why is forcing a shared history risky?",
        "What has git branch -d checked before deleting a branch?"
],
        [gitBook],
    ),
    lesson(
        "Resolve a Merge Conflict",
        "Git can combine most changes automatically, but two branches may edit the same line differently. A merge conflict is not a reason to pick a side blindly. You need to inspect both intended changes, decide the correct final behavior and then record a tested resolution. This exercise creates a conflict on purpose in a separate local repository.",
        [
        {
                "title": "Why Git sometimes stops a merge",
                "paragraphs": [
                        "A merge compares changes made since the branches' common ancestor. If the same line is changed incompatibly in two branches, Git cannot know the correct product decision. It leaves markers such as <<<<<<< HEAD, ======= and >>>>>>> feature/name inside the affected file. HEAD is the currently checked-out branch, not automatically the morally correct choice. A file that still contains those markers is not a resolved configuration.",
                        "Not all integration defects produce textual conflicts. Two branches can change different files and merge cleanly while violating the same database or API contract. A conflict is an explicit request for human judgment, while a clean merge is only a claim that Git could combine the text."
                ]
        },
        {
                "title": "Create two incompatible edits from the same starting point",
                "paragraphs": [
                        "The scratch requirement is: a default Portuguese greeting plus a French fallback. We intentionally begin with a single greeting field, then make feature and main branches edit it differently. No service or external data is involved. After the merge attempt, expect Git to stop and report a conflict in greeting.txt; the shell block treats that as the successful negative case instead of pretending the command passed.",
                        "Run in a new empty directory. The two branches share the initial greeting=hello commit. One changes greeting to ola and the other changes it to bonjour. The feature branch cannot be merged cleanly because both touched the same original line."
                ],
                "code": {
                        "language": "bash",
                        "caption": "Merge-conflict lab — reproduce two incompatible changes",
                        "code": "mkdir tsa-git-conflict-lab && cd tsa-git-conflict-lab\ngit init -b main\ngit config user.name \"TSA Learner\"\ngit config user.email \"learner@example.invalid\"\nprintf 'greeting=hello\\n' > greeting.txt\ngit add greeting.txt\ngit commit -m \"add initial greeting\"\ngit switch -c feature/portuguese-greeting\nprintf 'greeting=ola\\n' > greeting.txt\ngit add greeting.txt\ngit commit -m \"translate greeting to Portuguese\"\ngit switch main\nprintf 'greeting=bonjour\\n' > greeting.txt\ngit add greeting.txt\ngit commit -m \"translate greeting to French\"\nif git merge feature/portuguese-greeting; then echo 'UNEXPECTED_CLEAN_MERGE'; exit 1; else echo 'EXPECTED_CONFLICT'; fi\ngit status --short\ncat greeting.txt"
                }
        },
        {
                "title": "Decide the correct combined result, then resolve it",
                "paragraphs": [
                        "The product requirement is not 'choose HEAD' or 'choose the incoming branch'. It is to keep Portuguese as the default and French as a fallback. Inspect the conflict markers, then replace them with the two explicit keys shown below. This is a product decision expressed in text; neither Git nor the conflict marker itself can invent it for you.",
                        "Stage the corrected file and commit the merge resolution. Verify the result contains no conflict markers, the merge history includes the two parent lines, and git status is clean. In an actual application, run a parser/test against both greetings rather than checking only that the markers disappeared."
                ],
                "code": {
                        "language": "bash",
                        "caption": "Merge-conflict lab — resolve the requirements and commit the merge",
                        "code": "printf 'greeting=ola\\nfallback=bonjour\\n' > greeting.txt\ngit add greeting.txt\ngit commit -m \"resolve greeting with Portuguese default and French fallback\"\ngrep -q '^greeting=ola$' greeting.txt\ngrep -q '^fallback=bonjour$' greeting.txt\nif grep -q '^<<<<<<<' greeting.txt; then echo 'UNRESOLVED_MARKER'; exit 1; fi\ngit log --graph --oneline --decorate --all -5\ngit status --short"
                }
        },
        {
                "title": "Textual resolution and semantic compatibility are different",
                "paragraphs": [
                        "Conflict markers are a syntactic warning. Even when the file contains no markers, the resulting configuration or code might still be wrong. An application could require one greeting key instead of two. The correct response would be to revisit the requirement and update the implementation/tests, not to preserve both keys just because it satisfies Git.",
                        "In Steward, independent branches might change lifecycle choices in one file and a migration in another. Git could merge both automatically, but the combination could still be invalid. Check domain constraints, migration history, API responses and tests after any integration, whether or not Git reported a conflict."
                ]
        },
        {
                "title": "When to stop and request review",
                "paragraphs": [
                        "If you cannot explain the intended final behavior, do not resolve a conflict by guessing. Ask for the requirement or design decision, record it and then implement the tested combined state. Avoid deleting one side's work or force-pushing merely to silence the conflict. A commit that passes a text merge but fails domain tests is not integrated successfully.",
                        "On a shared repository, also confirm whose branch history you may rewrite. The scratch lab is intentionally local so a learner can practise conflict markers without putting colleagues' work at risk."
                ]
        }
],
        "Reproduce a real Git conflict, explain both changes, implement the intended combined content and verify a clean merge.",
        [
        "Execute the conflict setup block in a disposable repository and record EXPECTED_CONFLICT and the unmerged-file status.",
        "Read the actual conflict markers and explain which branch authored each conflicting greeting.",
        "Follow the published requirements to produce Portuguese greeting and French fallback, rather than discarding either change blindly.",
        "Run the resolution block and verify both values, a merge commit, no marker text and a clean status.",
        "Write one example of a semantic conflict in Steward that Git would not necessarily detect.",
        "Explain what you would do if the product owner had not specified the intended combined behavior."
],
        [
        "What do HEAD and incoming branch labels mean in a conflict?",
        "Why might a textual conflict require a product decision rather than an arbitrary merge choice?",
        "How can a clean Git merge still break an API or database?",
        "What evidence is needed beyond deleting conflict markers?"
],
        [gitBook],
    ),
    lesson(
        "Readable Code",
        "Readable code lets a future engineer identify the rule without mentally running every line. It is not the same as short code: names, explicit conditions and one coherent responsibility often matter more than line count. We will first make a tiny authorization predicate readable with ordinary Python, then apply the same rule to the Django Membership model built earlier. The result must behave exactly as before.",
        [
        {
                "title": "Start with the question the code must answer",
                "paragraphs": [
                        "Suppose a service belongs to Team 10. Only a user with a maintainer membership for Team 10 may manage it. A viewer cannot write, and a maintainer from another team cannot write. That one sentence is the contract. A function that returns True merely because the user has any membership is wrong, no matter how elegant it looks.",
                        "Write the rule in plain language before naming functions: Who is acting? Which resource is affected? Which team owns it? Which role is required? Are there other gates, such as an inactive account? Once those facts are explicit, naming and structure have a purpose."
                ]
        },
        {
                "title": "Short code can hide a correct rule",
                "paragraphs": [
                        "The original one-line expression in the example below is logically correct for the given data, but variables u, t and m make a reviewer translate each symbol back into domain meaning. The longer version names the actor, owner team and membership. It extracts has_maintainer_membership because that phrase describes one coherent question, not simply to reduce the length of the function.",
                        "Run this example with python3 in a scratch file. Its three cases deliberately separate authorized maintainer, viewer on the same Team, and a viewer on another Team. The assertions prove that the readable version preserved each expected result. There is no Django import or hidden database fixture in this first experiment."
                ],
                "code": {
                        "language": "python",
                        "caption": "Readable Code — equivalent pure-Python policy and negative cases",
                        "code": "memberships = [\n    {\"user_id\": 1, \"team_id\": 10, \"role\": \"maintainer\"},\n    {\"user_id\": 2, \"team_id\": 10, \"role\": \"viewer\"},\n    {\"user_id\": 1, \"team_id\": 20, \"role\": \"viewer\"},\n]\n\ndef old_check(u, t, rows):\n    return any(m[\"user_id\"] == u and m[\"team_id\"] == t and m[\"role\"] == \"maintainer\" for m in rows)\n\ndef has_maintainer_membership(actor_id, owning_team_id, memberships):\n    return any(\n        membership[\"user_id\"] == actor_id\n        and membership[\"team_id\"] == owning_team_id\n        and membership[\"role\"] == \"maintainer\"\n        for membership in memberships\n    )\n\ndef can_manage_service(actor_id, owning_team_id, memberships):\n    return has_maintainer_membership(actor_id, owning_team_id, memberships)\n\ncases = [(1, 10, True), (2, 10, False), (1, 20, False)]\nfor actor_id, team_id, expected in cases:\n    assert old_check(actor_id, team_id, memberships) is expected\n    assert can_manage_service(actor_id, team_id, memberships) is expected\nprint(\"readable policy: three cases preserved\")"
                }
        },
        {
                "title": "Cohesion: one function should answer one kind of question",
                "paragraphs": [
                        "Cohesion asks whether a unit's responsibilities belong together. A function that loads HTTP input, sends an email, checks Team membership and updates a Service combines unrelated reasons to change. A focused membership query, by contrast, answers a single policy question. That can make independent tests and review easier.",
                        "Do not split every line into a helper or wrap a simple expression in a hierarchy of classes. Extraction is useful when the new name and boundary remove real ambiguity. A function named process_data or do_check is not an improvement merely because it is short."
                ]
        },
        {
                "title": "Coupling: know which parts depend on one another",
                "paragraphs": [
                        "Coupling is the degree to which a module depends on other parts of the system. Some coupling is necessary: authorization must inspect the authenticated user, the target Service and stored Membership. Accidental coupling appears when the domain policy imports HTTP request objects, reads arbitrary environment variables or rewrites a token itself.",
                        "Keep the policy's inputs explicit and move HTTP response formatting to the API boundary. Django's ORM query is an implementation detail of the persistence model; callers should not infer access merely from the existence of a serializer or a UI button. The previous Identity lesson defines the actual roles before this code refers to them."
                ]
        },
        {
                "title": "Use the exact roles and fields your Django model defines",
                "paragraphs": [
                        "In the earlier Identity module we defined Membership.Role.VIEWER and Membership.Role.MAINTAINER. There is no owner membership role in that model. A previous example allowed a string owner anyway, which taught a nonexistent permission. The correct policy below requires an active account, a membership for the resource's owning Team and the MAINTAINER role. It uses the real user and Team references rather than trusting mutable names.",
                        "Run the script in the existing tsa-steward-django-app project after completing the Identity membership seed. It creates only an artificial TSA Report API record in the dedicated lab. The tests prove allowed, cross-Team denied, viewer denied and inactive denied independently. A finally block restores the users' activity and role states even if a test fails. This script tests the policy query, not full HTTP authorization."
                ],
                "code": {
                        "language": "python",
                        "caption": "Readable Code — Django Membership policy with four real decisions",
                        "code": "from django.contrib.auth import get_user_model\nfrom registry.models import Team, Service, Membership\n\ndef can_manage_service(user, service):\n    if not user.is_active:\n        return False\n    return Membership.objects.filter(\n        user=user,\n        team_id=service.owning_team_id,\n        role=Membership.Role.MAINTAINER,\n    ).exists()\n\nUser = get_user_model()\nana = User.objects.get(username=\"tsa_ana\")\nbo = User.objects.get(username=\"tsa_bo\")\nplatform = Team.objects.get(name=\"Platform\")\nservice, _ = Service.objects.get_or_create(\n    name=\"TSA Report API\",\n    defaults={\n        \"owning_team\": platform,\n        \"endpoint\": \"https://reports.example.invalid/api\",\n        \"lifecycle\": Service.Lifecycle.UAT,\n    },\n)\nmembership = Membership.objects.get(user=ana, team=platform)\noriginal_role = membership.role\noriginal_ana_active = ana.is_active\noriginal_bo_active = bo.is_active\n\ntry:\n    ana.is_active = True\n    ana.save(update_fields=[\"is_active\"])\n    bo.is_active = True\n    bo.save(update_fields=[\"is_active\"])\n    membership.role = Membership.Role.MAINTAINER\n    membership.save(update_fields=[\"role\"])\n    assert can_manage_service(ana, service)\n    assert not can_manage_service(bo, service)  # no Platform membership\n    membership.role = Membership.Role.VIEWER\n    membership.save(update_fields=[\"role\"])\n    assert not can_manage_service(ana, service)  # same Team, insufficient role\n    membership.role = Membership.Role.MAINTAINER\n    membership.save(update_fields=[\"role\"])\n    ana.is_active = False\n    ana.save(update_fields=[\"is_active\"])\n    assert not can_manage_service(ana, service)  # disabled account\nfinally:\n    membership.role = original_role\n    membership.save(update_fields=[\"role\"])\n    ana.is_active = original_ana_active\n    ana.save(update_fields=[\"is_active\"])\n    bo.is_active = original_bo_active\n    bo.save(update_fields=[\"is_active\"])\nprint(\"Django readable policy: maintainer allowed; viewer, cross-team and inactive denied\")"
                }
        },
        {
                "title": "Make the behavior readable and verifiable",
                "paragraphs": [
                        "A readable function must still be correct. Compare the pure Python and Django examples: both require a Team match and maintainer role. The Django version also checks active-account state, which is a distinct additional precondition. Call that difference out instead of claiming the two snippets have identical scopes.",
                        "When reviewing a change, write what stays the same and what changes. If you add a new owner role later, define it in the Membership model, migrate the database if necessary and write permission tests first. Do not introduce a role string just to make an example look realistic. Use comments for reasons and surprising constraints, not line-by-line narration of straightforward Python syntax."
                ]
        }
],
        "Make one authorization predicate understandable without introducing invented roles or changing its observed behavior.",
        [
        "State the policy in one sentence and identify actor, Team owner, membership and required role.",
        "Run the independent Python script from the reading and explain each of its three expected decisions.",
        "Compare the old and readable implementations, identify the renamed facts and explain why the extracted helper has a real responsibility.",
        "In the dedicated Django Steward lab with the seeded users, execute the published Membership policy script and record one allow plus three independent denials.",
        "Verify that the Django Membership model defines only viewer and maintainer; describe why a made-up owner role would be a correctness defect.",
        "Review an unrelated Steward function, propose one readability change and preserve its positive and negative contract."
],
        [
        "How can code with more lines be easier to maintain?",
        "What responsibility does has_maintainer_membership own?",
        "Why must a role string agree with the actual Membership model?",
        "How does the Django policy differ from the pure Python predicate?",
        "What evidence proves a readability refactor did not accidentally broaden permissions?"
],
        [refactoringGuru],
    ),
    lesson(
        "Separation of Concerns",
        "Separation of concerns is the practice of giving different responsibilities distinct, understandable places. It is not a rule to create a class or microservice for every function. Begin with a tiny library checkout operation, identify which changes belong to request parsing, membership permission, book state and response formatting, and then compare two implementations against the same five inputs. The Steward application comes only after this mechanism is understood.",
        [
        {
                "title": "What is a concern, and why separate it?",
                "paragraphs": [
                        "A concern is an aspect of the program that changes for a particular reason. Parsing an incoming request changes when the external data format changes. Permission policy changes when the membership rule changes. Borrowing a book changes when library lending policy changes. Response formatting changes when the API contract changes. These concerns cooperate to deliver one request, but they are not the same decision.",
                        "Putting all four decisions in one function is not automatically wrong: short local code can be clear. Separation becomes useful when the functions are difficult to review or the same policy must be used from a web endpoint and another caller. Judge the boundary by its responsibility, not by a target number of classes or files."
                ]
        },
        {
                "title": "First see a request that actually works",
                "paragraphs": [
                        "Our simplified community library has two books: bk1 can be borrowed and bk2 is already unavailable. Member 42 may borrow; member 7 is not registered. The old_checkout function takes a Python request dictionary, a dictionary representing stored book state and an allowed-member set. It returns a status/code dictionary. This is a plain Python simulation of an API action, not a running HTTP server and not a database transaction.",
                        "Before editing structure, predict five outcomes: authorized success, wrong input type, unauthorized member, unknown book and already-borrowed book. Notice that the unauthorized request should not modify the catalogue. The exact statuses and error codes are a small explicit contract."
                ]
        },
        {
                "title": "Split responsibilities without changing the contract",
                "paragraphs": [
                        "The new implementation separates parse_request (input validation), member_can_borrow (permission), borrow_book (state-changing domain action), response (output shape), and new_checkout (orchestration). It uses small exceptions to report missing or unavailable books without making borrow_book return HTTP status codes. This is one design, not a required architecture: explicit result objects are a legitimate alternative when a team uses them consistently.",
                        "The ordering of checks matters. We validate the request first, check authorization before looking up the book, and only then mutate state. Moving authorization after the mutation would be a serious defect even if all helper names looked elegant. A separation refactor succeeds only if allowed/denied outcomes and state changes remain correct."
                ],
                "code": {
                        "language": "python",
                        "caption": "Separation of Concerns — five executable before-and-after cases",
                        "code": "from copy import deepcopy\n\ndef old_checkout(payload, catalogue, members):\n    member_id = payload.get(\"member_id\")\n    book_id = payload.get(\"book_id\")\n    if type(member_id) is not int or not isinstance(book_id, str) or not book_id.strip():\n        return {\"status\": 400, \"code\": \"invalid_input\"}\n    if member_id not in members:\n        return {\"status\": 403, \"code\": \"not_a_member\"}\n    if book_id not in catalogue:\n        return {\"status\": 404, \"code\": \"book_missing\"}\n    if not catalogue[book_id][\"available\"]:\n        return {\"status\": 409, \"code\": \"already_borrowed\"}\n    catalogue[book_id][\"available\"] = False\n    return {\"status\": 200, \"code\": \"borrowed\"}\n\nclass BookMissing(Exception):\n    pass\n\nclass AlreadyBorrowed(Exception):\n    pass\n\ndef parse_request(payload):\n    member_id = payload.get(\"member_id\")\n    book_id = payload.get(\"book_id\")\n    if type(member_id) is not int or not isinstance(book_id, str) or not book_id.strip():\n        raise ValueError(\"invalid_input\")\n    return member_id, book_id\n\ndef member_can_borrow(member_id, members):\n    return member_id in members\n\ndef borrow_book(book_id, catalogue):\n    if book_id not in catalogue:\n        raise BookMissing\n    if not catalogue[book_id][\"available\"]:\n        raise AlreadyBorrowed\n    catalogue[book_id][\"available\"] = False\n\ndef response(status, code):\n    return {\"status\": status, \"code\": code}\n\ndef new_checkout(payload, catalogue, members):\n    try:\n        member_id, book_id = parse_request(payload)\n    except ValueError:\n        return response(400, \"invalid_input\")\n    if not member_can_borrow(member_id, members):\n        return response(403, \"not_a_member\")\n    try:\n        borrow_book(book_id, catalogue)\n    except BookMissing:\n        return response(404, \"book_missing\")\n    except AlreadyBorrowed:\n        return response(409, \"already_borrowed\")\n    return response(200, \"borrowed\")\n\ncases = [\n    ({\"member_id\": 42, \"book_id\": \"bk1\"}, 200),\n    ({\"member_id\": \"42\", \"book_id\": \"bk1\"}, 400),\n    ({\"member_id\": 7, \"book_id\": \"bk1\"}, 403),\n    ({\"member_id\": 42, \"book_id\": \"missing\"}, 404),\n    ({\"member_id\": 42, \"book_id\": \"bk2\"}, 409),\n]\nfor payload, expected in cases:\n    before = {\"bk1\": {\"available\": True}, \"bk2\": {\"available\": False}}\n    after = deepcopy(before)\n    original_result = old_checkout(payload, before, {42})\n    extracted_result = new_checkout(payload, after, {42})\n    assert original_result == extracted_result\n    assert extracted_result[\"status\"] == expected\n    assert before == after\n    print(expected, extracted_result[\"code\"])\nassert not member_can_borrow(7, {42})\nassert bool({42}) is True  # Flawed shortcut: SOME member exists, not THIS member.\nprint(\"Separation lab: 5 responses and stored state agree\")"
                }
        },
        {
                "title": "Read the results, including what did not change",
                "paragraphs": [
                        "Save the complete script as separation_lab.py and run python3 separation_lab.py in a clean scratch directory. It prints `200 borrowed`, `400 invalid_input`, `403 not_a_member`, `404 book_missing`, `409 already_borrowed`, then `Separation lab: 5 responses and stored state agree`. The assertions check that both implementations return the same result and leave identical book data for every case. They also prove that member 7 is denied even when the member set is not empty.",
                        "That last case matters: a tempting but broken policy would test only bool(members), which answers whether any member exists rather than whether this caller is a member. A refactor that accidentally substituted the shortcut would pass a happy-path test and fail the independent denied case. The actual state dictionary is copied for each run so one test does not consume a book and contaminate the next."
                ]
        },
        {
                "title": "Follow the dependency direction",
                "paragraphs": [
                        "The orchestration function knows the steps needed to process a checkout. Input parsing should not import HTTP response classes; borrow_book does not need to know whether a browser or command-line client initiated the request. This helps when a second entry point calls the same borrowing rule without copying permission checks or error mapping.",
                        "In a Django application, a view might accept an HTTP request, an authorization function inspect trusted Membership, and an application command enforce a Service transition with an atomic database operation. Database constraints remain important; our dictionary exercise does not prove concurrency safety, transaction rollback, security against alternate write paths or actual DRF enforcement."
                ]
        },
        {
                "title": "When not to add another layer",
                "paragraphs": [
                        "Do not create an AbstractCheckoutManagerFactory just because you can. A new wrapper with no distinct responsibility adds navigation cost without reducing coupling. The helper functions here are justified because each has a specific question and a testable boundary. If a single cohesive function were equally clear and changed for one reason, retaining it would be acceptable.",
                        "SOLID and dependency inversion are useful design vocabulary, but this lesson does not need five principles or a dependency-injection framework at once. Later lessons on testing and dependencies examine when substituting real collaborators improves safety. For now, the independent test is whether you can identify what each function owns and whether behavior is preserved."
                ]
        }
],
        "Separate request parsing, authorization, state change and response formatting in a working example without changing the observable contract.",
        [
        "Run the exact five-case Python script before editing it; explain each status code and which cases must leave book availability unchanged.",
        "Annotate old_checkout to distinguish input validation, membership permission, book-state rules, mutation and response construction.",
        "Inspect the extracted functions. For each one, state its single responsibility and why a caller needs it.",
        "Change member_can_borrow deliberately to return bool(members), run the tests and capture which negative check fails; restore the correct function and prove the suite passes again.",
        "Explain what the dictionary example does not verify: HTTP routing, database transactions, concurrency and real permission enforcement.",
        "Only then select a real Steward write endpoint, label the four concerns in its actual implementation, move at most one misplaced responsibility and rerun its existing positive/negative tests. Do not invent a request path or migration that is not present."
],
        [
        "Which responsibility changes if a request field is renamed, and which changes if membership policy changes?",
        "Why must authorization happen before borrow_book changes stored state?",
        "What makes the bool(members) shortcut a security defect despite sounding related to membership?",
        "Why is an extra class not automatically a better separation?",
        "What additional testing would be needed before claiming the same result in a real Django/PostgreSQL endpoint?"
],
        [refactoringGuru],
    ),
    lesson(
        "Refactoring",
        "Refactoring is changing how code is organized without changing what the code does for its callers. That is a stricter goal than making code shorter. Work through a complete refund example: first run a baseline with allowed, denied and boundary cases; then extract a named policy function, run the same tests again, and deliberately introduce a defect to prove those tests are capable of catching one. No Steward application or test framework is required for the first exercise.",
        [
        {
                "title": "What counts as refactoring?",
                "paragraphs": [
                        "An online shop accepts a refund only when an order is paid, not already refunded and no more than 30 days old. The result is a two-item tuple containing an outcome and a reason code. An approved request sets the order's refunded flag; a denied request must leave it unchanged. Those observable results and state effects form the contract.",
                        "Renaming a helper, extracting a function or moving code without altering those observations is refactoring. Increasing the refund window to 45 days, changing denial priority, or approving pending payments is a feature or policy change, not refactoring. Keeping these changes separate makes failures and reviews easier to diagnose."
                ]
        },
        {
                "title": "First establish a baseline you can actually run",
                "paragraphs": [
                        "Save the complete example as refund_before.py and run python3 refund_before.py from your terminal. You do not need Django, a database or external packages. The original request_refund function handles eligibility checks and mutation together. Its nested structure is not catastrophic, but the eligibility rules may later need to be reused by an administrative preview without mutating the order.",
                        "The six tests include an eligible order, an already-refunded order, an unpaid order, an expired order, exactly 30 days, and a case with more than one reason to deny. That final case locks down rejection priority: already_refunded must win before payment_required or window_expired. Each test uses a fresh copy so state changes do not leak into the next example. Notice that a denied request must not create a refund flag."
                ],
                "code": {
                        "language": "python",
                        "caption": "Refactoring — run six contracts against the original function",
                        "code": "def request_refund(order, days_since_purchase):\n    if order[\"refunded\"]:\n        return (\"denied\", \"already_refunded\")\n    if order[\"state\"] != \"paid\":\n        return (\"denied\", \"payment_required\")\n    if days_since_purchase > 30:\n        return (\"denied\", \"window_expired\")\n    order[\"refunded\"] = True\n    return (\"approved\", \"refund_created\")\n\nfrom copy import deepcopy\n\n# (order, elapsed days, expected result, expected refunded flag)\ncases = [\n    ({\"state\": \"paid\", \"refunded\": False}, 12, (\"approved\", \"refund_created\"), True),\n    ({\"state\": \"paid\", \"refunded\": True}, 12, (\"denied\", \"already_refunded\"), True),\n    ({\"state\": \"pending\", \"refunded\": False}, 12, (\"denied\", \"payment_required\"), False),\n    ({\"state\": \"paid\", \"refunded\": False}, 31, (\"denied\", \"window_expired\"), False),\n    ({\"state\": \"paid\", \"refunded\": False}, 30, (\"approved\", \"refund_created\"), True),\n    ({\"state\": \"pending\", \"refunded\": True}, 40, (\"denied\", \"already_refunded\"), True),\n]\nfor original, days, expected_result, expected_refunded in cases:\n    order = deepcopy(original)\n    outcome = request_refund(order, days)\n    assert outcome == expected_result, (original, days, outcome)\n    assert order[\"refunded\"] is expected_refunded\n    print(f\"{outcome[0]}: {outcome[1]}\")\n\nprint(\"Before refactoring: 6 contracts passed\")"
                }
        },
        {
                "title": "Extract one responsibility, not a framework",
                "paragraphs": [
                        "Our concrete reason to change is that eligibility rules and the operation that mutates the order are intermixed. Extract Function (sometimes called Extract Method) moves the checks into refund_rejection_reason. This helper answers one question: if this order cannot be refunded, what is the first reason? The request_refund entry point keeps the same arguments, returns the same tuple and performs the same state mutation.",
                        "Save the next complete example as refund_after.py and run python3 refund_after.py. The test cases are identical, not conveniently weakened to match the refactor. All six results and refunded flags must remain unchanged. This shows a named, reviewable change that can be made in one commit without inventing a RefundManager interface, extra layer or network service."
                ],
                "code": {
                        "language": "python",
                        "caption": "Refactoring — extract eligibility and rerun the same six contracts",
                        "code": "def refund_rejection_reason(order, days_since_purchase):\n    if order[\"refunded\"]:\n        return \"already_refunded\"\n    if order[\"state\"] != \"paid\":\n        return \"payment_required\"\n    if days_since_purchase > 30:\n        return \"window_expired\"\n    return None\n\ndef request_refund(order, days_since_purchase):\n    reason = refund_rejection_reason(order, days_since_purchase)\n    if reason is not None:\n        return (\"denied\", reason)\n    order[\"refunded\"] = True\n    return (\"approved\", \"refund_created\")\n\nfrom copy import deepcopy\n\n# (order, elapsed days, expected result, expected refunded flag)\ncases = [\n    ({\"state\": \"paid\", \"refunded\": False}, 12, (\"approved\", \"refund_created\"), True),\n    ({\"state\": \"paid\", \"refunded\": True}, 12, (\"denied\", \"already_refunded\"), True),\n    ({\"state\": \"pending\", \"refunded\": False}, 12, (\"denied\", \"payment_required\"), False),\n    ({\"state\": \"paid\", \"refunded\": False}, 31, (\"denied\", \"window_expired\"), False),\n    ({\"state\": \"paid\", \"refunded\": False}, 30, (\"approved\", \"refund_created\"), True),\n    ({\"state\": \"pending\", \"refunded\": True}, 40, (\"denied\", \"already_refunded\"), True),\n]\nfor original, days, expected_result, expected_refunded in cases:\n    order = deepcopy(original)\n    outcome = request_refund(order, days)\n    assert outcome == expected_result, (original, days, outcome)\n    assert order[\"refunded\"] is expected_refunded\n    print(f\"{outcome[0]}: {outcome[1]}\")\n\nprint(\"After refactoring: 6 contracts passed\")"
                }
        },
        {
                "title": "Make the test fail deliberately",
                "paragraphs": [
                        "Passing tests only demonstrate that the cases you wrote pass. To check whether the test can catch an important regression, change exactly one operator in refund_after.py: replace days_since_purchase > 30 with days_since_purchase >= 30. Now a refund at precisely 30 days becomes incorrectly denied. Run python3 refund_after.py again: the assertion must fail on the boundary case. Restore the > operator and confirm all six tests pass again.",
                        "A meaningful regression test has to fail for a credible defect, not just execute without crashing. This deliberate mutation also illustrates why a single happy-path test would not have protected the refund-window boundary. You do not need mutation-testing software to learn the idea."
                ]
        },
        {
                "title": "Refactor in small steps and inspect the diff",
                "paragraphs": [
                        "In a real repository, first commit or otherwise preserve a passing baseline. Make one named transformation at a time: Rename, Extract Function, Move Function or Extract Variable. After each step, run focused tests and inspect git diff. If the behavior changes, undo or isolate that change before continuing. Use tests of public behavior, not assertions that freeze the private helper's name or line count.",
                        "Characterization tests are especially useful when existing behavior is not documented: they record what a program currently does, including awkward edge cases, so structural changes do not alter it accidentally. They are a temporary map of current behavior, not a claim that all legacy behavior is desirable."
                ]
        },
        {
                "title": "When to stop—and when not to refactor",
                "paragraphs": [
                        "The named policy helper now makes eligibility easier to review and reuse, and the entry point's mutation is visible. Stop here unless a real change calls for more. A generalized rule engine or class hierarchy would add more reading and maintenance cost than this small example needs.",
                        "A refactor is justified by reduced change risk, duplication or ambiguity, not age or aesthetic preference. If the business asks to accept refunds for 45 days, add a separate policy-change task and tests. The later Steward practical transfers the method to one actual hotspot with its own database and HTTP contracts; this scratch exercise does not prove those paths."
                ]
        }
],
        "Perform one named Extract Function refactor from a known-good baseline, preserve six contracts, and show a deliberately introduced defect is caught.",
        [
        "Copy the first complete block to refund_before.py and run it from a new scratch directory. Record the six results and explain why the denied cases must not mutate state.",
        "Copy the second complete block to refund_after.py and run it separately. Identify what moved into refund_rejection_reason and what remained in the request entry point.",
        "Compare the two scripts. Confirm the public function name, arguments, result tuple, denial priority and refunded flags did not change.",
        "In refund_after.py, deliberately change > 30 to >= 30, rerun and record the failing 30-day boundary assertion. Restore the original condition and show the green rerun.",
        "Explain why this is a bounded refactor rather than a new business rule or a new architecture.",
        "Only after the scratch proof, identify a real Steward method whose structure creates change risk, establish its positive and negative behavior, make one named transformation, and rerun those same tests. Do not add fictional project files."
],
        [
        "What observable behavior must remain unchanged during a refactor?",
        "Why is exactly 30 days a stronger regression test than only 12 days?",
        "What would change if a business request increased the allowed refund window to 45 days?",
        "Why should a test preserve the public request_refund contract instead of locking down the new helper?",
        "When is creating a new abstraction more expensive than keeping the current function?"
],
        [refactoringGuru],
    ),
    lesson(
        "Write Your First Automated Tests",
        "A test is code that checks whether another piece of code behaves as expected. Before Django tests, API fixtures, test doubles or coverage reports, learn what a test does by writing and running a small standard-library Python test suite. A passing test is evidence for the behavior it actually checks, not proof that every input is safe.",
        [
        {
                "title": "Start with one claim you can verify",
                "paragraphs": [
                        "Our library rule is simple: a registered member may borrow an available book; someone not in the membership set may not borrow, and an unavailable book may not be borrowed. The function receives a member ID, the registered member IDs and a book-availability flag. It returns a boolean, not an HTTP response or a database write.",
                        "The first test's claim is that member 42 is allowed when the book is available. The second guards against a dangerous shortcut: asking whether any registered member exists rather than whether the caller is a member. The third denies an unavailable book. These are distinct outcomes, not three repetitions of the same happy path."
                ]
        },
        {
                "title": "Read a test: arrange, act, assert",
                "paragraphs": [
                        "Arrange establishes inputs: members = {42}. Act calls can_borrow(42, members, True). Assert compares the returned result with the expected True. unittest.TestCase groups related tests; methods whose names start with test_ are collected and run. self.assertTrue and self.assertFalse raise an AssertionError on a mismatch.",
                        "The Python interpreter is the test runner here. Save the complete example below as test_borrowing.py and run python3 -m unittest -v test_borrowing.py. You should see three test names followed by OK. You do not need pip, pytest, Django or a Steward repository."
                ],
                "code": {
                        "language": "python",
                        "caption": "Testing fundamentals — runnable three-case unittest suite",
                        "code": "import unittest\n\ndef can_borrow(member_id, allowed_members, book_available):\n    return member_id in allowed_members and book_available\n\nclass BorrowTests(unittest.TestCase):\n    def test_registered_member_can_borrow_available_book(self):\n        members = {42}\n        actual = can_borrow(42, members, True)\n        self.assertTrue(actual)\n\n    def test_unregistered_member_is_denied_even_when_someone_is_registered(self):\n        members = {42}\n        actual = can_borrow(7, members, True)\n        self.assertFalse(actual)\n\n    def test_unavailable_book_is_denied(self):\n        self.assertFalse(can_borrow(42, {42}, False))\n\nif __name__ == \"__main__\":\n    unittest.main(verbosity=2)"
                }
        },
        {
                "title": "Prove the negative test catches a real mistake",
                "paragraphs": [
                        "After all three tests pass, change the return line to: return bool(allowed_members) and book_available. That version checks whether any member exists, not whether the particular caller is registered. Run the same tests again; test_unregistered_member_is_denied_even_when_someone_is_registered must fail. Restore member_id in allowed_members and confirm all three pass.",
                        "This is a controlled fail-before-fix exercise. If the test still passes after the mutation, your assertion is not protecting the intended boundary. Do not change the expected False to True to make a broken implementation green."
                ]
        },
        {
                "title": "Choose test inputs that challenge assumptions",
                "paragraphs": [
                        "A positive and a negative case protect different rules. Boundary values can reveal mistakes hidden by ordinary cases, such as exactly 30 days versus 31 days in a refund policy. Tests should isolate their inputs so one test does not alter the next; here the membership set is local and no database state is changed.",
                        "A test that calls a function and only checks that it did not crash cannot detect an incorrect True. The assertion must state the expected behavior. A small precise suite is more useful than a large set of assertions that never examine meaningful results."
                ]
        },
        {
                "title": "Know what these tests do not prove",
                "paragraphs": [
                        "This three-case suite does not prove the real Django user was authenticated, that database permissions were enforced, that HTTP status codes are correct, or that concurrent borrowing is safe. Each claim needs a boundary that can observe it. The next lesson shows how to decide which kind of test to use and how to test a collaborator without depending on a live external service.",
                        "Coverage reports show which lines executed, but executing a line does not prove that its behavior was asserted. Here the important evidence is that an unauthorized caller is explicitly denied and the test fails when that denial is weakened."
                ]
        }
],
        "Write and run three real Python unit tests and demonstrate that a permission regression makes the expected test fail.",
        [
        "Save and run the complete published test_borrowing.py with python3 -m unittest -v test_borrowing.py; capture three passing tests.",
        "Explain the arrange, act and assert parts of test_registered_member_can_borrow_available_book in your own words.",
        "Mutate the member-specific check into bool(allowed_members), rerun the same suite and record exactly which test fails and why.",
        "Restore the correct function and show the same three tests passing, without weakening any assertion.",
        "Describe one missing test relevant to a later API/database integration and explain why this pure function cannot prove it."
],
        [
        "How does unittest discover tests?",
        "Why is a negative test different from checking that a function runs without error?",
        "Which assertion detects a mistaken any-member authorization rule?",
        "What does a green pure-function suite not prove about an actual HTTP endpoint?"
],
        [refactoringGuru],
    ),
    lesson(
        "Testing as a Change Safety Net",
        "Now that you can run and deliberately break a test, use tests to protect a change involving side effects and collaborators. An order-completion operation should change a paid order once and notify another system once. We will inject a simple fake notifier to inspect those effects without sending a real message. Then we will distinguish unit, database and HTTP evidence.",
        [
        {
                "title": "What is the right test boundary?",
                "paragraphs": [
                        "A pure function test checks a rule without a network or database. A database test is needed to prove a UNIQUE constraint or transaction rollback, because a Python list cannot enforce PostgreSQL concurrency. An HTTP/API test is needed to prove authentication middleware, routes, response codes and persisted state together. Choose the narrowest test that can honestly observe the claim you are making.",
                        "A wrong cross-Team mutation must be rejected and leave the database unchanged. A boolean policy test alone cannot prove that an actual PATCH endpoint calls the policy. Keep such integration tests for the running Django exercise, after the foundational unit test is understood."
                ]
        },
        {
                "title": "Make a side effect observable without sending anything",
                "paragraphs": [
                        "A collaborator is another component called by the function under test. Here complete_order receives notify as an argument: in production it might send a real email; in the lesson a FakeNotifier records calls in a list. That lightweight working substitute is a fake. It avoids an external service and gives the test observable evidence of a call and its argument.",
                        "The complete example below contains the application function, the fake and three tests. Save it as test_order_completion.py and run python3 -m unittest -v test_order_completion.py. The tests cover success, denial without state changes and a repeat request without a second notification. Note that a real system would also need an atomic durable outbox or equivalent mechanism to avoid losing a notification if the process crashes between writes and sends; this exercise does not provide those guarantees."
                ],
                "code": {
                        "language": "python",
                        "caption": "Testing safety net — runnable fake notifier and side-effect assertions",
                        "code": "import unittest\n\nclass NotificationError(Exception):\n    pass\n\ndef complete_order(order, notify):\n    if order[\"status\"] != \"paid\":\n        return \"not_paid\"\n    if order[\"completed\"]:\n        return \"already_completed\"\n    order[\"completed\"] = True\n    notify(order[\"id\"])\n    return \"completed\"\n\nclass FakeNotifier:\n    def __init__(self):\n        self.delivered_ids = []\n    def __call__(self, order_id):\n        self.delivered_ids.append(order_id)\n\nclass OrderTests(unittest.TestCase):\n    def setUp(self):\n        self.order = {\"id\": 24, \"status\": \"paid\", \"completed\": False}\n        self.notifier = FakeNotifier()\n\n    def test_success_has_result_state_and_one_notification(self):\n        self.assertEqual(complete_order(self.order, self.notifier), \"completed\")\n        self.assertTrue(self.order[\"completed\"])\n        self.assertEqual(self.notifier.delivered_ids, [24])\n\n    def test_unpaid_has_no_mutation_or_notification(self):\n        self.order[\"status\"] = \"pending\"\n        self.assertEqual(complete_order(self.order, self.notifier), \"not_paid\")\n        self.assertFalse(self.order[\"completed\"])\n        self.assertEqual(self.notifier.delivered_ids, [])\n\n    def test_repeat_has_no_second_notification(self):\n        complete_order(self.order, self.notifier)\n        self.assertEqual(complete_order(self.order, self.notifier), \"already_completed\")\n        self.assertEqual(self.notifier.delivered_ids, [24])\n\nif __name__ == \"__main__\":\n    unittest.main(verbosity=2)"
                }
        },
        {
                "title": "Fail a test for the right reason",
                "paragraphs": [
                        "Deliberately remove the line if order[\"completed\"]: return \"already_completed\" and run the suite. The repeat test must fail because the notifier records [24, 24] instead of [24]. Restore the guard and verify all three tests pass. This is strong evidence that the suite would catch duplicate notifications caused by that specific change.",
                        "Make a separate small refactor, such as renaming the local completed check or extracting a helper, without changing results or call count. Run the same tests before and after. If the expected behavior changes, call it a feature or defect fix rather than disguising it as refactoring."
                ]
        },
        {
                "title": "Stub, fake, spy and mock are not synonyms",
                "paragraphs": [
                        "A stub returns predetermined values. A fake provides a small working implementation, like FakeNotifier. A spy records interactions so a test can inspect them; the fake in this example also acts as a spy because it records delivered_ids. A mock generally supplies programmed expectations about interactions. Use the simplest substitute that answers the test's question.",
                        "Do not mock the function being tested or preprogram your fake to claim that the result passed. If notification contents and delivery guarantees are the requirement, a real integration test against the provider boundary is eventually necessary. This fake proves only what this local function attempted to send."
                ]
        },
        {
                "title": "Take the evidence to the actual API",
                "paragraphs": [
                        "A proper Steward test for cross-Team modification must authenticate a specific actor, send a request to an actual supported route, assert its response and refresh the affected database record to prove no mutation occurred. If a route, fixture or permission setup is not yet built, do not copy an isolated DRF test snippet that invents api_client, user_a or service_b without showing how they are created.",
                        "Separately state and test success for a maintainer, failure for a viewer, failure across Teams, and failure for inactive users. Positive and negative API tests complement, but do not replace, the domain-level unit tests. They are a later transfer exercise, not hidden prerequisites for running the source-published examples."
                ]
        },
        {
                "title": "Measure what tests protect, not how many exist",
                "paragraphs": [
                        "Code coverage may help locate unexercised branches, but a high percentage is not proof that important assertions are correct. Mutation exercises and test names tied to observable behavior give more meaningful evidence. Keep tests deterministic and independently repeatable; avoid using a changing live service for a small unit policy.",
                        "Builder's goal is to create a dependable developer safety net. Later Quality Steward work deepens automation frameworks, test design across large systems and organization-level quality strategy."
                ]
        }
],
        "Use executable tests to protect a state change and an external call, prove duplicate-notification detection, then select appropriate future database/API tests.",
        [
        "Run the source-published test_order_completion.py in a scratch directory and capture all three passing tests.",
        "Explain what FakeNotifier records, why injection helps, and why the test cannot claim real email delivery.",
        "Delete the duplicate-completion guard temporarily; observe the repeated-call assertion fail, then restore it and pass all three tests.",
        "Perform one small behavior-preserving refactor and rerun the exact same assertions.",
        "Explain which claim requires an actual PostgreSQL constraint/transaction test and which requires a real authenticated DRF request with post-request database inspection.",
        "Only then transfer the method to one actual Steward behavior with known fixtures and routes; do not invent missing URLs or client objects."
],
        [
        "Why test the side effect and returned value separately?",
        "What is a fake compared with a stub?",
        "Why does a domain test not prove HTTP or database authorization?",
        "How can high coverage coexist with weak assertions?"
],
        [refactoringGuru],
    ),
    lesson(
        "Understand Python Packages and Dependencies",
        "Before choosing a library, understand what Python imports, what pip installs, and which interpreter owns the installation. A module, a Python import package, an installable distribution and a dependency are related but not interchangeable. This lesson uses only the Python standard library and a local interpreter; it does not install Django, connect to Steward or require network access.",
        [
        {
                "title": "A module, package and distribution are different things",
                "paragraphs": [
                        "A Python module is code you can import, commonly one .py file. An import package is an organized namespace that can contain submodules. A distribution is what a packaging tool installs and tracks; it may expose one import package, many modules, or an import name different from its distribution name. For example, the distribution `djangorestframework` exposes imports under `rest_framework`. Do not assume the name written after `pip install` is always the name used after `import`.",
                        "The standard-library module `json` imports without installing anything from PyPI. A missing import can mean no distribution is installed, but it can also mean the active interpreter differs from the one where a package was installed, or a package uses a different import name. Diagnosis starts by identifying the interpreter, not by guessing an administrator password or installing arbitrary packages."
                ]
        },
        {
                "title": "Which Python interpreter is actually running?",
                "paragraphs": [
                        "The terminal command `python -m pip` runs pip with that Python interpreter, instead of hoping a standalone `pip` executable points to the same environment. `python -m pip --version` shows its path; `python -m pip list` lists distributions installed in the active environment. A virtual environment has its own interpreter path and installed-package view. It isolates typical Python installations, not the operating system or database server.",
                        "Run `python3 -m venv tsa-package-lab` in an empty directory and activate it (POSIX: `source tsa-package-lab/bin/activate`; Windows PowerShell: `tsa-package-lab\\\\Scripts\\\\Activate.ps1`). Run `python -c \"import sys; print(sys.executable)\"` to confirm the path ends inside the environment, then `python -m pip --version`. If pip was not bootstrapped, `python -m ensurepip --upgrade` may be available. Use `deactivate` when finished. Do not assume a Python installation or virtual environment has internet connectivity."
                ]
        },
        {
                "title": "Inspect imports and installed distributions without installing anything",
                "paragraphs": [
                        "Save this as `inspect_packages.py` and run `python inspect_packages.py` in your activated local environment. The script identifies the interpreter, proves that standard-library `json` imports, inspects whether a `pip` distribution is installed, and demonstrates a module that is not importable. It does not hardcode a pip version and does not change any environment.",
                        "The result distinguishes 'import is possible' from 'an installed distribution is present'. It does not claim that every import corresponds to one distribution. An application can also contain its own locally authored importable modules."
                ],
                "code": {
                        "language": "python",
                        "caption": "Python dependency foundations — inspect active interpreter and module availability",
                        "code": "import importlib.util\nimport importlib.metadata as metadata\nimport sys\n\nprint(\"interpreter:\", sys.executable)\nassert importlib.util.find_spec(\"json\") is not None\nprint(\"standard-library json: importable\")\ntry:\n    pip_version = metadata.version(\"pip\")\nexcept metadata.PackageNotFoundError:\n    print(\"pip distribution: not installed in this interpreter\")\nelse:\n    print(\"pip distribution: installed, version\", pip_version)\nassert importlib.util.find_spec(\"tsa_package_that_does_not_exist_927\") is None\nprint(\"invented package: not importable\")\nprint(\"An importable module is not automatically a separately installed distribution.\")"
                }
        },
        {
                "title": "Direct dependencies and transitive dependencies",
                "paragraphs": [
                        "A direct dependency is a distribution your application explicitly declares because its own code requires its capability. A transitive dependency is installed because another declared distribution requires it. For example, a web framework may itself depend on a lower-level package. Your code should not silently import that lower-level package and assume it will always be present; if your application needs it directly, declare it directly.",
                        "`python -m pip list` shows the installed environment, NOT which items the application intentionally declared. `python -m pip show <distribution>` shows installed metadata and reported requirements; `python -m pip check` checks installed distribution requirements for conflicts. Neither establishes that your declared application requirements are correct or that no security advisory exists. Consult the project manifest and the environment together."
                ]
        },
        {
                "title": "A manifest describes what a project needs",
                "paragraphs": [
                        "Python projects commonly declare distributions and supported version ranges in `pyproject.toml`; older projects may use `requirements.txt`. The manifest is a statement of intended dependencies, not proof of which exact versions happened to be installed. A lockfile or resolved, pinned installation record may be needed for reproducible environments, depending on the packaging workflow. A range such as `>=5.2,<6` allows multiple versions and is not equivalent to an exact pin.",
                        "This example reads a small `pyproject.toml` manifest using Python's `tomllib` (Python 3.11+). It does not install anything. Notice that runtime dependencies and optional development tools are separately declared. Record the distinction before adopting a new package."
                ],
                "code": {
                        "language": "python",
                        "caption": "Python dependencies — parse a real project manifest without installing packages",
                        "code": "from pathlib import Path\nimport tempfile\nimport tomllib\n\nproject = \"\"\"\n[project]\nname = \"library-checkout\"\nversion = \"0.1.0\"\ndependencies = [\"Django>=5.2,<6\", \"djangorestframework>=3.16,<4\"]\n[project.optional-dependencies]\ndev = [\"pytest>=8,<10\"]\n\"\"\"\n\nwith tempfile.TemporaryDirectory() as location:\n    manifest = Path(location) / \"pyproject.toml\"\n    manifest.write_text(project, encoding=\"utf-8\")\n    parsed = tomllib.loads(manifest.read_text(encoding=\"utf-8\"))\n    direct = parsed[\"project\"][\"dependencies\"]\n    development = parsed[\"project\"][\"optional-dependencies\"][\"dev\"]\n    assert len(direct) == 2\n    assert len(development) == 1\n    assert any(value.startswith(\"Django\") for value in direct)\n    print(\"declared runtime:\", len(direct))\n    print(\"declared optional development:\", len(development))\n    print(\"installed versions: NOT established by this manifest\")\n\nprint(\"A version range expresses an allowed set, not an exact resolved installation.\")"
                }
        },
        {
                "title": "Diagnose a missing import without random installation",
                "paragraphs": [
                        "First print `sys.executable`. Second inspect the actual import name and check `importlib.util.find_spec`, then inspect installed distribution metadata with `python -m pip show` using the distribution name. Third read `pyproject.toml` and confirm the dependency is intended; only then install using the project's prescribed, isolated procedure. Do not run `sudo pip install` into a managed operating-system Python or copy unfamiliar commands into production.",
                        "If the module still cannot import, check the error traceback, environment activation, import spelling and compatibility. Record what happened rather than treating repeated installation attempts as troubleshooting."
                ]
        }
],
        "Distinguish imports, distributions, environment ownership and direct versus transitive requirements with runnable evidence.",
        [
        "Create and activate a disposable Python virtual environment and confirm the interpreter path before using pip.",
        "Run the source-published `inspect_packages.py` script. Explain what it proves about `json`, `pip` and the invented module.",
        "Run `python -m pip --version`, `python -m pip list` and `python -m pip check` in that same environment, and distinguish installed state from declared application requirements.",
        "Run the complete `pyproject.toml` reader script; explain which dependencies are runtime versus optional and why a version range is not a lockfile.",
        "Write a troubleshooting sequence for a missing import without assuming a network connection or mutating a real Steward project.",
        "Only after the independent example, identify one import from the existing Steward project and determine its owning distribution."
],
        [
        "Why can `pip install some-name` and `import other_name` both be correct?",
        "Why does `python -m pip` help with environment confusion?",
        "Does `pip list` prove which packages the application directly requires?",
        "Does a permitted version range describe the exact software installed?"
],
        [twelveFactor],
    ),
    lesson(
        "Managing Dependencies",
        "Now that you can identify the interpreter, installed distributions and declared requirements, choose dependencies deliberately. Every external package introduces compatibility, licensing, maintenance, upgrade and security responsibilities. This lesson is about deciding whether to depend on a package and how to keep that decision safe—not about inventing a package-sharing platform for Steward.",
        [
        {
                "title": "When should you add a package?",
                "paragraphs": [
                        "Begin with the needed capability, not a list of popular packages. Decide whether Python's standard library or an already installed, directly declared framework provides the capability. If a new distribution would save significant implementation and maintenance risk, evaluate it; a two-line helper seldom justifies a new transitive graph.",
                        "Write down what application code will import, where it will be used and what happens if the package stops receiving updates. A development-only formatter creates a different operational obligation from a runtime authentication library."
                ]
        },
        {
                "title": "Direct requirements versus an installed dependency tree",
                "paragraphs": [
                        "Read the actual project's `pyproject.toml` and dependency groups or requirements files to identify declared direct dependencies. Compare them with `python -m pip list` only in the intended virtual environment. A transitive distribution can be present today and disappear after a parent library changes; if application code imports it directly, record it as an explicit dependency instead of relying on chance.",
                        "Inspect `python -m pip show django` or another distribution actually installed in your environment. Its Requires field is informative, but not a substitute for your project's manifest. `python -m pip check` reports some installed dependency incompatibilities; a clean result does not prove your application behavior or package security."
                ]
        },
        {
                "title": "Decide using evidence, not package popularity",
                "paragraphs": [
                        "For a candidate dependency, record maintained releases, compatibility with the supported Python/Django version, license obligations, published security advisories, transitive footprint and replacement cost. Security advisories and compatibility change over time, so recheck current first-party release notes and security sources before adopting or upgrading. Do not guess an advisory from the package name.",
                        "A package is not automatically unsafe because it has dependencies, and a small package is not automatically safe. Classify critical runtime dependencies separately from test-only helpers, then make a decision whose criteria another engineer can reproduce."
                ]
        },
        {
                "title": "Version ranges, repeatability and upgrades",
                "paragraphs": [
                        "An allowed range sets compatibility expectations; a lock or pinned environment establishes a reproducible resolution. Neither eliminates the need to test an upgrade. Permanent pins can avoid surprise changes but leave known defects unpatched. A safe upgrade process proposes a version change, reviews release notes, resolves a fresh environment, runs focused tests and records whether observed behavior changed.",
                        "If a dependency upgrade requires a database migration or API contract change, assess those separately. Do not present `pip freeze` of an arbitrary developer laptop as the canonical project manifest, because unrelated tools can appear in it."
                ]
        },
        {
                "title": "Internal packages are earned by real reuse",
                "paragraphs": [
                        "Keep a capability local while only one application owns it. If two independent consumers genuinely need the same stable behavior, a shared internal package may become useful. Before extracting, identify consumers, change cadence, version compatibility and who reviews breaking changes.",
                        "Creating `steward-common` as an architecture ornament introduces publication, upgrades and consumer coordination without proving a benefit. Artifact repositories and release automation belong to later TSA studies; here, write a boundary decision and explain why."
                ]
        },
        {
                "title": "Document one keep/remove decision",
                "paragraphs": [
                        "Choose an actual declared distribution and write its name, purpose, runtime/development category, direct imports, alternatives, upgrade strategy and validation. Then test a proposed removal only in a disposable branch or environment. A decision is stronger when it has evidence of a real consumer than when it merely says 'modern', 'well maintained', or 'best practice'.",
                        "For the first independent case, compare the built-in `json` module with installing a third-party JSON helper merely to encode a tiny dictionary. If the standard library already meets the requirement, defer the new dependency. This example is a judgment exercise, not a claim that specialized JSON packages can never be justified."
                ]
        }
],
        "Justify one real project dependency and an upgrade or removal path, using declared requirements and reproducible evidence.",
        [
        "Inventory direct runtime and development requirements from the Steward manifest or requirements files, not only `pip list`.",
        "Choose one installed transitive package and check whether Steward imports it directly; if so, propose an explicit declaration rather than silently relying on it.",
        "Evaluate one candidate against existing standard-library/framework functionality, supported versions, maintenance/security signals, license and replacement risk.",
        "In a disposable environment or branch, test one keep/remove/version-change hypothesis and record the exact affected checks. Do not mutate production or unreviewed shared lockfiles.",
        "Evaluate an internal-package proposal against at least two real consumers and an explicit version contract; reject extraction if those facts are missing.",
        "Write an evidence-backed decision with owner, alternative, validation and a future upgrade/revisit trigger."
],
        [
        "Why is a transitive distribution not a reliable undeclared direct API?",
        "How do version ranges differ from an exact resolved environment?",
        "Why does a successful import not settle security or license concerns?",
        "What concrete evidence would justify an internal shared package?"
],
        [twelveFactor],
    ),
    lesson(
        "Read Environment Variables in Python",
        "An environment variable is a named string supplied to a running process by its parent process or operating environment. It is not the same as a Python variable, a database column or a .env file. Before configuring Django, learn how a terminal supplies environment variables, how Python reads them and why missing values and text-to-boolean conversion require explicit decisions.",
        [
        {
                "title": "Where an environment variable comes from",
                "paragraphs": [
                        "When a shell launches Python, Python inherits an environment mapping. In a POSIX shell, `export TSA_EXAMPLE_MODE=training` makes that name available to commands launched afterward from that shell. A variable assigned only as `TSA_EXAMPLE_MODE=training` without export is usually a shell variable, not automatically inherited by a separately launched Python process. A one-command prefix such as `TSA_EXAMPLE_MODE=production python3 example.py` supplies a value to that command without changing subsequent commands.",
                        "This is configuration of a process, not an authenticated secret store. A `.env` file is merely a text convention consumed by a tool or library that reads it; Python does not magically load every `.env` file. Later deployment tooling may provide variables through another mechanism, but the process still receives string values."
                ]
        },
        {
                "title": "Run Python with and without a value",
                "paragraphs": [
                        "Save the complete script as environment_lab.py. Run the terminal commands in the same directory. First, without the variable, it prints `Process setting: not set`. Then pass a temporary value and it prints `Process setting: training`. The invalid value must raise ValueError, so it is a deliberate negative demonstration, not a successful invocation.",
                        "The example avoids credentials, network access and project-specific files. If you already have TSA_EXAMPLE_MODE defined in your shell, run `unset TSA_EXAMPLE_MODE` before the first example, but only after checking that it is not needed by unrelated work. Do not unset real application secrets as part of this lab."
                ],
                "code": {
                        "language": "python",
                        "caption": "Environment variables — runnable Python reader and validation",
                        "code": "import os\n\nprint(\"Process setting:\", os.environ.get(\"TSA_EXAMPLE_MODE\", \"not set\"))\nprint(\"Missing optional setting:\", os.environ.get(\"TSA_OPTIONAL\", \"default\"))\n\nvalue = os.environ.get(\"TSA_EXAMPLE_MODE\")\nif value not in (None, \"training\", \"production\"):\n    raise ValueError(\"TSA_EXAMPLE_MODE must be training or production\")\n\nprint(\"Mode validation passed\")"
                }
        },
        {
                "title": "What the shell actually passes",
                "paragraphs": [
                        "Use your terminal to run `python3 environment_lab.py`, then `TSA_EXAMPLE_MODE=training python3 environment_lab.py`, and finally `TSA_EXAMPLE_MODE=unexpected python3 environment_lab.py`. The third run should exit nonzero with `TSA_EXAMPLE_MODE must be training or production`. This demonstrates both a useful default and deliberate validation.",
                        "On Windows PowerShell, the equivalent process environment value is set with `$env:TSA_EXAMPLE_MODE = 'training'` before launching Python. The portable core is the Python script; shell syntax depends on the host. For this academy's Linux/macOS learning path, the POSIX commands are the primary runnable sequence."
                ]
        },
        {
                "title": "Why strings must be parsed",
                "paragraphs": [
                        "os.environ returns strings: the characters `false` are not the Python boolean False. In Python, `bool('false')` evaluates to True because the string is not empty. Likewise `int('abc')` fails, and a URL might be syntactically invalid or point to the wrong server. Parse and validate types at the boundary rather than scattering magic conversions throughout business logic.",
                        "Required and optional settings differ. If a database URL is essential for the application to function, missing it should stop startup with an actionable error; a harmless optional display preference may have an explicit default. Never print real passwords or access tokens to explain a missing setting."
                ]
        },
        {
                "title": "Configuration can be external without becoming public",
                "paragraphs": [
                        "Environment variables can contain sensitive values, but they can still leak through logs, process diagnostics, child processes and improperly configured debugging endpoints. Treat them as one input mechanism, not as a complete secret-management solution. Use artificial test values in this lesson; production secret distribution belongs in later platform/security material.",
                        "A deployment can vary a database host without changing application code. It should not freely change core authorization or service-lifecycle rules just by setting an arbitrary environment flag. The next lesson distinguishes deployment configuration from product policy and validates several settings together."
                ]
        }
],
        "Explain and run the complete terminal-to-Python environment variable path, including missing/default/invalid values, without introducing Django or third-party parsers.",
        [
        "Create environment_lab.py from the complete published script in an empty scratch directory.",
        "Run python3 environment_lab.py with TSA_EXAMPLE_MODE not set, then with a one-command `TSA_EXAMPLE_MODE=training` prefix; record the differing outputs.",
        "Run with `TSA_EXAMPLE_MODE=unexpected`, confirm the error and nonzero exit code, then repeat the accepted training case.",
        "Explain what `export` changes, what Python inherits, and why a `.env` file is not automatically loaded by Python.",
        "Show why `bool('false')` is True and identify one required setting versus one safe optional setting without disclosing a real secret."
],
        [
        "How does a shell environment variable reach Python?",
        "Why is a `.env` file not the same thing as an environment variable?",
        "Why is `bool('false')` unsafe for a DEBUG flag?",
        "What should happen when a required deployment value is absent?"
],
        [twelveFactor],
    ),
    lesson(
        "Configuration",
        "Configuration lets the same code run safely in different environments. The important boundary is between deploy-specific values and application behavior—not between 'things in a .env file' and everything else.",
        [
            { title: "Separate config from code", paragraphs: ["Database addresses, secrets, allowed hosts and log levels vary by deployment. Lifecycle rules such as which criticality values Steward accepts are domain behavior and should not become arbitrary environment variables merely because configuration is convenient.", "Validate required configuration at startup. Silent fallback to insecure or incorrect defaults turns deployment mistakes into runtime surprises."] },
            { title: "Secrets are configuration with stricter handling", paragraphs: ["Do not commit secrets, print them in diagnostics or expose them through API errors. Local .env files can be useful developer ergonomics, but production secret distribution is an operational concern that later TSA schools will deepen. The following Python snippet uses standard-library os.environ, not an unexplained third-party env object. It is a configuration fragment for an application already supplied with DATABASE_URL: a bare execution with no value is expected to fail rather than silently connect to an arbitrary database."], code: { language: "python", code: "import os\n\n# This displays the supported boundary, not real secrets.\ndatabase_url = os.environ.get(\"DATABASE_URL\")\nif not database_url:\n    raise RuntimeError(\"DATABASE_URL is required\")\n\nraw_debug = os.environ.get(\"DJANGO_DEBUG\", \"false\").lower()\nif raw_debug not in (\"true\", \"false\"):\n    raise RuntimeError(\"DJANGO_DEBUG must be true or false\")\nDEBUG = raw_debug == \"true\"", caption: "Deployment-specific values are external; safe defaults remain deliberate." } },
            { title: "Parse configuration into typed validated values once", paragraphs: ["Environment variables arrive as strings. Convert booleans, integers, URLs and enumerated values deliberately at startup, validate cross-setting requirements, and expose the rest of the application to a coherent configuration object/settings boundary. Scattered os.environ reads make defaults and failure behavior difficult to review." ] },
            { title: "Precedence must be understandable", paragraphs: ["If settings can come from defaults, environment, local files or command-line/deployment overrides, document which source wins. Hidden precedence creates incidents where an engineer changes one value but another source silently overrides it." ] },
            {"title":"Parse and reject invalid settings with no third-party dependency","paragraphs":["Environment variables are strings, not native Python booleans. bool('false') is True, so naïve conversion can silently turn DEBUG on. Make the permitted values explicit and fail on a missing required database URL. This code uses a passed mapping rather than the real process environment, so the negative cases are deterministic and no secret is read or printed. Production deployment would load credentials through an approved secret manager and validate startup before accepting traffic."],"code":{"language":"python","caption":"Configuration — executable fail-closed environment parser","code":"def settings(env):\n    database = env.get('DATABASE_URL')\n    if not database:\n        raise ValueError('DATABASE_URL is required')\n    raw = env.get('DJANGO_DEBUG', 'false').lower()\n    if raw not in ('true', 'false'):\n        raise ValueError('DJANGO_DEBUG must be true or false')\n    return {'debug': raw == 'true', 'database_configured': True}\n\nfor label, value in [('missing', {}), ('invalid', {'DATABASE_URL':'local','DJANGO_DEBUG':'maybe'}), ('valid', {'DATABASE_URL':'local','DJANGO_DEBUG':'false'})]:\n    try:\n        print(label, settings(value)['debug'])\n    except ValueError as exc:\n        print(label, str(exc))"}},
        ],
        "Define and validate Steward's local configuration contract.",
        ["Inventory current environment-specific values.", "Separate secrets, deployment config and domain policy.", "Remove one unsafe hard-coded value if present.", "Document required variables and safe local defaults.", "Demonstrate startup failure for one missing required value without leaking its secret."],
        ["What belongs in configuration?", "Why should domain policy not automatically become environment variables?", "What should happen when required configuration is missing?"],
        [twelveFactor, djangoSettings],
    ),
    lesson(
        "Check Python Code Before Running It",
        "Before learning linters and type checkers, practise one basic distinction: Python can reject malformed source without executing your program, but that cannot tell you whether your program follows business rules. This lesson creates two disposable files and uses the same interpreter that is running the exercise. It needs only Python, no installed analyzer, database or Steward application.",
        [
        {
                "title": "What is a syntax error?",
                "paragraphs": [
                        "Python source must follow the language's grammar. A line such as `def twice(:` is not a valid function definition, so the interpreter cannot construct the function. This differs from a valid function that returns the wrong answer: the latter can run and produce incorrect results.",
                        "The `py_compile` module compiles a specified Python file without running its business logic. Its command-line exit status is zero for a successfully compiled file and nonzero when compilation fails. `python -m compileall` can check files under a directory, but it can also create bytecode caches; use a scratch directory rather than compiling an arbitrary production tree."
                ]
        },
        {
                "title": "Use the interpreter that owns the environment",
                "paragraphs": [
                        "Run `python -m py_compile filename.py` with the active virtual environment's Python. The `-m` flag means 'run this module with this interpreter'. This is the same interpreter-selection principle used in the Python packages lesson. The syntax checker does not fetch packages or connect to a server.",
                        "If you see an error, read its filename, line and description. A syntax error in the demonstration is intentional; do not fix a different file or silence output just to make the check green."
                ]
        },
        {
                "title": "Run a complete pass/fail compilation experiment",
                "paragraphs": [
                        "Save the following as `syntax_check_lab.py` in a disposable directory and run `python syntax_check_lab.py`. It creates two temporary files, invokes `py_compile` on each and asserts the expected exit statuses. The broken file must report a SyntaxError; the valid file must compile. Since the program uses `sys.executable`, it checks with the interpreter that actually runs the experiment.",
                        "After those checks, the script executes an intentionally incorrect authorization function that permits every caller. Its Python syntax is fine, but a separate expected-denial assertion detects the defect. The exact last three lines of output distinguish syntax validity from domain correctness."
                ],
                "code": {
                        "language": "python",
                        "caption": "Python checks — source-executed syntax success, failure and business negative",
                        "code": "from pathlib import Path\nfrom tempfile import TemporaryDirectory\nimport subprocess\nimport sys\n\nwith TemporaryDirectory() as folder:\n    good = Path(folder) / \"good.py\"\n    bad = Path(folder) / \"broken.py\"\n    good.write_text(\"def twice(number):\\n    return number * 2\\n\", encoding=\"utf-8\")\n    bad.write_text(\"def twice(:\\n    pass\\n\", encoding=\"utf-8\")\n    def check(path):\n        return subprocess.run(\n            [sys.executable, \"-m\", \"py_compile\", str(path)],\n            capture_output=True,\n            text=True,\n            check=False,\n        )\n    good_result = check(good)\n    bad_result = check(bad)\n    assert good_result.returncode == 0\n    assert bad_result.returncode != 0\n    assert \"SyntaxError\" in bad_result.stderr\n    print(\"valid source: compiled\")\n    print(\"invalid source: rejected with SyntaxError\")\n\ncorrect_syntax_bad_policy = \"def may_edit(actor_team, owner_team):\\n    return True\\n\"\nnamespace = {}\nexec(correct_syntax_bad_policy, namespace)\nassert namespace[\"may_edit\"](11, 99) is True  # A syntactically valid, insecure result.\ntry:\n    assert namespace[\"may_edit\"](11, 99) is False\nexcept AssertionError:\n    print(\"business rule: independent negative test detects wrong permission\")\nelse:\n    raise AssertionError(\"negative authorization check should fail\")"
                }
        },
        {
                "title": "What this test does and does not establish",
                "paragraphs": [
                        "The source checker proves the file can be compiled, not that its functions return expected values, that imports succeed in a deployed environment, or that an API endpoint is secure. A valid function body can still be logically wrong or raise exceptions when run. No warning-free status can establish all possible program behavior.",
                        "Later in this module, linters detect configured suspicious patterns, formatters normalize layout, static type checkers reason about type contracts, and actual tests run behavior. Learn what each signal proves instead of treating 'static analysis' as one magical pass/fail button."
                ]
        }
],
        "Run Python's built-in source compilation and distinguish syntax feedback from actual behavioral tests.",
        [
        "Save the exact published syntax_check_lab.py example and run it with the active interpreter.",
        "Observe a zero exit from valid.py and a nonzero SyntaxError from broken.py; explain why the program checks both.",
        "Read the intentionally incorrect may_edit function and explain why compilation alone cannot reject cross-team access.",
        "Change its body to return `actor_team == owner_team`, rerun the file and observe the first equality assertion now fails; explain why expected results and source changes must be considered together, then restore the original demonstration.",
        "Write one syntax defect and one business-rule defect of your own; say which check detects each.",
        "Only after the independent example, consider where a syntax check belongs in the real Steward project's local feedback flow."
],
        [
        "What is the difference between syntax failure and a wrong result?",
        "Why use sys.executable or `python -m` rather than an arbitrary global executable?",
        "What does a passing py_compile check actually establish?",
        "What extra evidence would you require before trusting a permission rule?"
],
        [{ title: "Python py_compile documentation", url: "https://docs.python.org/3/library/py_compile.html" }, { title: "Ruff configuration", url: "https://docs.astral.sh/ruff/configuration/" }],
    ),
    lesson(
        "Static Analysis and Automated Feedback",
        "Once you can run a basic Python source check, learn the other automated quality checks without conflating their purposes. Formatting checks layout, linting checks configured patterns, type checking reasons about types, framework checks inspect application configuration, and tests exercise behavior. Useful automation produces fast, explainable feedback; it does not replace understanding or application-specific assertions.",
        [
        {
                "title": "Formatting, linting and types answer different questions",
                "paragraphs": [
                        "A formatter normalizes whitespace, quotes and line wrapping so reviewers can focus on logic. A linter finds configured suspicious patterns such as unused imports or risky constructs. A static type checker reasons about annotated value types and call signatures without running each application path. Python's `py_compile` checks grammar; it is not a full linter or type checker.",
                        "For example, code can contain an unused import (a possible lint issue) and still execute. A valid function can return a string where the calling contract expects an integer (a type issue a configured checker might catch). A syntactically valid `return True` in a security predicate can pass all these checks while incorrectly authorizing a caller. A negative test is needed to encode the intended domain rule."
                ]
        },
        {
                "title": "First inspect which tools are actually installed",
                "paragraphs": [
                        "Do not assume a Steward environment already has Ruff, mypy, Black or another analyzer. In the project's disposable virtual environment, use `python -m pip list` and read the project's declared development requirements before running a named tool. A missing command means that tool is not installed in the active environment, not that the application has been checked.",
                        "A developer can use Ruff as a formatter and linter. If the project has explicitly installed it, `ruff check .` performs linting and `ruff format --check .` checks formatting without rewriting files. Consult the project's versioned configuration and use the same supported commands locally and in CI. Do not silently install every possible tool or mutate unrelated files."
                ],
                "code": {
                        "language": "bash",
                        "caption": "Static checks — inspect project tools before running them",
                        "code": "python -m pip --version\npython -m pip list\npython -m py_compile your_file.py\n# Only if Ruff is declared and installed in this environment:\nruff check your_file.py\nruff format --check your_file.py"
                }
        },
        {
                "title": "Use a small versioned rule set before widening it",
                "paragraphs": [
                        "Tool behavior depends on its version and configuration. A project can start with a narrow set of useful lint rules and expand when reviewers understand and own the results. Store that configuration in the repository so local runs and CI use the same policy, not personal IDE settings.",
                        "For example, Ruff can read a `[tool.ruff]` and `[tool.ruff.lint]` section in `pyproject.toml`. The following illustrative configuration selects common errors and unused-import rules while using an 88-character formatter width. This is not a claim the current Steward Python project has Ruff installed or that copying this into an unrelated project is required."
                ],
                "code": {
                        "language": "toml",
                        "caption": "Static checks — illustrative version-controlled Ruff configuration",
                        "code": "[tool.ruff]\nline-length = 88\n\n[tool.ruff.lint]\nselect = [\"E4\", \"E7\", \"E9\", \"F\"]"
                }
        },
        {
                "title": "Prove that syntax validity does not prove authorization",
                "paragraphs": [
                        "Python's `ast` parser can reject malformed code without executing it; the malformed example below must raise SyntaxError. The second program parses and compiles but its authorization predicate always returns True. This is a deliberate mistake, not an example to copy into production. The goal is to make the boundary visible: syntax validity says nothing about who should be allowed to edit a Team-owned resource.",
                        "After running the script, write an expected-denial test for a cross-Team actor. It must fail against the wrong policy. Then replace the wrong policy with an actor/owner comparison and prove the denial passes. Static checks and behavior checks answer distinct questions."
                ],
                "code": {
                        "language": "python",
                        "caption": "Static analysis — parse error versus valid but wrong authorization",
                        "code": "import ast\n\ntry:\n    ast.parse('def check(:\\n  pass')\nexcept SyntaxError:\n    print('syntax defect detected')\nelse:\n    raise AssertionError('invalid source parsed')\n\nsource = 'def can_update(actor_team, owner_team):\\n    return True'\nmodule = ast.parse(source)\nassert isinstance(module, ast.Module)\nnamespace = {}\nexec(compile(module, '<demo>', 'exec'), namespace)\nassert namespace['can_update'](5, 8) is True\nprint('syntax valid; authorization policy still wrong')"
                }
        },
        {
                "title": "Build a local feedback sequence without false assurances",
                "paragraphs": [
                        "A reasonable workflow is: identify your project environment, run the formatter in check mode, run the configured linter, run the configured type checker if present, run Django system checks when the project uses Django, and finally run focused behavior tests. Record actual commands from the repository rather than guessing their presence. A formatter does not replace tests, a Django system check does not prove response contracts, and `pip check` does not perform a security audit.",
                        "When a tool reports a diagnostic, read the rule and the affected code before suppressing it. Warnings are actionable work or deliberately documented exceptions; broad ignore lists can hide regressions. Automated feedback should be fast enough to run before review and reproducible enough for CI, while remaining honest about untested domain behavior."
                ]
        }
],
        "Distinguish code-quality signals and create one reproducible project-sized feedback sequence with an observed failure.",
        [
        "Run the first syntax-check lab before this lesson, then classify the outputs as source compilation versus behavior evidence.",
        "Check the actual Steward project manifest and environment for a declared formatter, linter, type checker and Django system-check command; do not invent tools.",
        "Use the actual supported tool (or create a separate disposable Python tool environment if internet/package access is available) to demonstrate one safe unused-import or formatting diagnostic and its corrected rerun.",
        "Execute the exact source-published AST example and explain why the wrong permission rule is still accepted by syntax checking.",
        "Write a negative authorization test that catches that rule; make the one-line correction and prove the test now passes.",
        "Document a short local check sequence matching the tool versions/configuration the real project uses, and explain what each signal cannot establish."
],
        [
        "Which tool checks syntax, which checks style, and which actually executes application behavior?",
        "What is the risk of running tools you did not install or declare in the current environment?",
        "Why should local and CI checks share configuration?",
        "Why can a syntactically valid policy still allow a cross-Team write?"
],
        [{ title: "Python py_compile documentation", url: "https://docs.python.org/3/library/py_compile.html" }, { title: "Ruff configuration", url: "https://docs.astral.sh/ruff/configuration/" }],
    ),
    lesson(
        "Review a Code Change",
        "Code review is about checking whether a proposed change is correct, safe and understandable. It is not a style contest. Start with the requested behavior, look for an existing guarantee the patch might remove, and verify the risk with a small test. This exercise provides a complete, deliberately unsafe invoice-export change before any Steward pull request is required.",
        [
        {
                "title": "Know the required behavior before inspecting code",
                "paragraphs": [
                        "An invoice export currently returns only invoices belonging to the signed-in customer. A new requirement says archived invoices must also be omitted. Both rules must hold: exclude archived records AND preserve customer isolation. The new requirement does not cancel the old permission boundary.",
                        "Write down the actor, the resource, the expected result and where identity comes from. In a real application the customer identity must come from a trusted authenticated principal, not a number a caller can freely choose. In this pure Python example we assume the caller supplied a trusted customer ID; HTTP authentication is beyond the exercise."
                ]
        },
        {
                "title": "A diff can be valid Git and still be wrong software",
                "paragraphs": [
                        "The proposed patch replaces the customer filter with an archived-record filter. It looks like a direct implementation of the request, but it forgets the existing rule. Tests containing only one customer's invoices could pass while a different customer's invoices become visible.",
                        "Read the conceptual diff below. The removed condition is not merely an implementation detail: it is an access-control guarantee. The next runnable example adds a second customer's invoice to reveal the defect."
                ],
                "code": {
                        "language": "diff",
                        "caption": "Review patch — the new archive filter accidentally drops ownership",
                        "code": " def export_visible_invoices(customer_id, records):\n-    return [row for row in records if row['customer_id'] == customer_id]\n+    return [row for row in records if row['state'] != 'archived']"
                }
        },
        {
                "title": "Reproduce a blocking defect",
                "paragraphs": [
                        "Save the complete code as invoice_review_candidate.py and run python3 invoice_review_candidate.py. An AssertionError is expected, mentioning INV-200. Customer 11 received a record belonging to customer 22. The failure is the point of the exercise, not a broken Python setup.",
                        "This is a blocker because it violates a current permission requirement. The fact that the code is concise and runs without a syntax error is irrelevant to the data leak. Never use real customer invoices in this scratch example."
                ],
                "code": {
                        "language": "python",
                        "caption": "Code review — intentionally unsafe candidate must fail the cross-customer test",
                        "code": "invoices = [\n    {\"id\": \"INV-100\", \"customer_id\": 11, \"state\": \"open\"},\n    {\"id\": \"INV-101\", \"customer_id\": 11, \"state\": \"archived\"},\n    {\"id\": \"INV-200\", \"customer_id\": 22, \"state\": \"open\"},\n]\n\ndef export_visible_invoices(customer_id, records):\n    # Deliberately unsafe: filters by archive status, not ownership.\n    return [row for row in records if row[\"state\"] != \"archived\"]\n\nactual = [row[\"id\"] for row in export_visible_invoices(11, invoices)]\nassert actual == [\"INV-100\"], f\"Cross-customer exposure: {actual}\"\nprint(\"UNEXPECTED: unsafe review candidate passed\")"
                }
        },
        {
                "title": "Write review feedback that can be acted on",
                "paragraphs": [
                        "A useful blocker comment identifies evidence, consequence and the requested proof: 'The new filter removes customer isolation; requesting as customer 11 also returns INV-200, owned by customer 22. Keep the ownership rule alongside the archive filter and add a cross-customer negative test before merge.' This is more useful than 'this looks wrong' or a formatting suggestion.",
                        "Separately, you might ask whether archived invoices remain accessible through an audit endpoint. That is a requirement question, not a proven defect. A naming improvement can be optional. Do not invent a blocker simply to fill a review template."
                ]
        },
        {
                "title": "Verify the corrected behavior and review the final diff",
                "paragraphs": [
                        "Save the second program as invoice_review_fixed.py and run python3 invoice_review_fixed.py. It checks customer 11, customer 22 and a customer with no invoices. The expected message is 'Code review: 3 scoped exports, no cross-customer rows'. The implementation applies both the ownership and archive filters.",
                        "Before approving a real patch, re-read the whole final diff and verify the trusted identity source, negative HTTP access cases, related endpoints, migrations and logs in proportion to the change. These three local Python checks do not establish that a deployed API enforces permissions."
                ],
                "code": {
                        "language": "python",
                        "caption": "Code review — corrected export with three independent customer checks",
                        "code": "invoices = [\n    {\"id\": \"INV-100\", \"customer_id\": 11, \"state\": \"open\"},\n    {\"id\": \"INV-101\", \"customer_id\": 11, \"state\": \"archived\"},\n    {\"id\": \"INV-200\", \"customer_id\": 22, \"state\": \"open\"},\n]\n\ndef export_visible_invoices(trusted_customer_id, records):\n    return [\n        row for row in records\n        if row[\"customer_id\"] == trusted_customer_id\n        and row[\"state\"] != \"archived\"\n    ]\n\ncases = [(11, [\"INV-100\"]), (22, [\"INV-200\"]), (99, [])]\nfor actor, expected in cases:\n    visible = export_visible_invoices(actor, invoices)\n    assert [row[\"id\"] for row in visible] == expected\n    assert all(row[\"customer_id\"] == actor for row in visible)\nprint(\"Code review: 3 scoped exports, no cross-customer rows\")"
                }
        }
],
        "Review a risky patch against its contract, prove a negative failure and verify the corrected behavior.",
        [
        "Write both requirements (same-customer records only, no archived records) before inspecting the patch.",
        "Run invoice_review_candidate.py; capture the expected failure and explain how INV-200 proves cross-customer exposure.",
        "Draft one blocker comment including evidence, consequence and the test required before merge.",
        "Run invoice_review_fixed.py; verify all three results and that no record crosses customer boundaries.",
        "Record one legitimate question and one optional improvement, explicitly separate from the blocker; then explain the trusted-identity limitation.",
        "Only after the scratch exercise, review one real Steward diff if available, using the actual requirement and final tested revision."
],
        [
        "Why can a clean Git diff still violate security policy?",
        "What exactly does the cross-customer negative case prove?",
        "What belongs in an actionable blocker comment?",
        "How is a requirement question different from a confirmed defect?",
        "What must be rechecked after the author changes the patch?"
],
        [{"title":"Pro Git","url":"https://git-scm.com/book/en/v2"}],
        "software-craft-code-review-and-technical-debt",
    ),
    lesson(
        "Managing Technical Debt",
        "Technical debt is a future change cost created by a design or delivery decision. It is not a label for code that looks unattractive, and it cannot turn a present correctness or security defect into optional work. This lesson uses a hypothetical CSV-import shortcut to show how to document a real trade-off without inventing costs or committing to endless cleanup.",
        [
        {
                "title": "Distinguish an existing defect from a future cost",
                "paragraphs": [
                        "The cross-customer invoice leak in the preceding lesson violates today's contract and is a defect. It needs correction before that change can be approved. Calling it 'technical debt' would conceal its immediate impact.",
                        "Now imagine two CSV importers: orders and refunds. Each currently parses its supported dates correctly, but each has a separate copy of similar parsing logic. Future format changes require coordinated edits and tests in both places. That is a plausible maintenance-cost debt item, even when both importers work today."
                ]
        },
        {
                "title": "Identify evidence and the actual shortcut",
                "paragraphs": [
                        "In this fictional case the first importer shipped quickly, and the second copied a simple date parser because their requirements were not yet stable. Reviews have since involved changing both parser copies for a shared format rule. A third importer is being considered. The known facts are duplication and repeated dual maintenance; the financial cost and risk of divergence have not been measured.",
                        "Record the code paths involved, what changes have actually required duplicate work, which tests exist and what could go wrong. If there is no evidence of added cost or risk, state uncertainty rather than manufacture a performance estimate."
                ]
        },
        {
                "title": "Repay now or defer deliberately",
                "paragraphs": [
                        "Option A is to consolidate the parser now and add shared positive/negative tests for both callers. It may make the next change easier, but can couple two workflows that are still evolving differently. Option B is to retain two small parsers with explicit ownership and return to the decision when a third importer is approved or a second divergence occurs.",
                        "Neither answer is universally correct. Evaluate upcoming work, incident risk, ease of regression testing and the likely carrying cost. Deferring needs a named owner and a trigger. A vague 'clean up eventually' ticket cannot guide a future maintainer."
                ]
        },
        {
                "title": "Write a useful technical-debt record",
                "paragraphs": [
                        "An actionable record says what the shortcut is, how it affects future changes, what evidence supports that judgment, the alternatives, the current decision, the owner, a review trigger and the tests needed for safe repayment. The example below is a decision record, not a terminal command.",
                        "If the importer already accepts the wrong date today, reclassify that observed incorrect behavior as a defect and fix it. The presence of duplication does not lower the severity of a real data-integrity failure."
                ],
                "code": {
                        "language": "text",
                        "caption": "Example technical-debt decision record with a concrete revisit trigger",
                        "code": "Title: Duplicate CSV date parsing\nCurrent contract: Both order and refund importers handle supported dates correctly\nShortcut: Two independently maintained parsers\nEvidence: Recent format changes needed edits in both modules\nRisk: Future changes may diverge; current cost is not quantified\nOptions: Consolidate with shared tests now, or defer with monitoring\nDecision: Defer while the two import formats are still evolving\nOwner: Import feature maintainer\nRevisit: Third importer approved, or a repeated divergent date change\nRepayment proof: Positive and negative cases for each importer remain green\nImportant: A wrong date already imported is a defect, not optional debt"
                }
        },
        {
                "title": "Prioritize what the team can actually justify",
                "paragraphs": [
                        "Debt that blocks an imminent feature or repeatedly causes risky updates deserves more attention than an abstract desire to tidy every helper. A small consolidation with a real second consumer may be worthwhile; a speculative shared framework with no stable contract may make things worse.",
                        "Use the same evidence standard when transferring to Steward: if the cost/risk cannot be explained, do not create a debt item solely to show activity. A rational decision can be to make no change and revisit when the stated condition occurs."
                ]
        }
],
        "Recognize real technical debt, separate it from a correctness defect, and make an evidence-backed repayment decision.",
        [
        "Classify the previous invoice leak and the two working CSV parsers. Explain which one is a defect and why.",
        "Use the fictional scenario to fill out the debt record without inventing measured hours or incidents.",
        "Compare consolidation now versus deferral; identify the tests and change risks in both alternatives.",
        "Choose a decision, an owner and an observable revisit trigger. State what would change your decision.",
        "Reclassify the situation if you discover that the current CSV importer already produces incorrect dates.",
        "Only then inspect an actual Steward design choice for documented future cost; if evidence is absent, record that rather than fabricating debt."
],
        [
        "Why must the invoice leak be treated as a current defect?",
        "What evidence would show that duplicated parsing creates real debt?",
        "What makes a revisit trigger actionable?",
        "Why might premature shared abstraction increase costs?",
        "What changes if a current data-integrity problem is discovered?"
],
        [{"title":"Martin Fowler — Technical Debt","url":"https://martinfowler.com/bliki/TechnicalDebt.html"}],
    ),
    lesson(
        "Python Logging from First Principles",
        "Before discussing secure operational events, understand where a Python log entry goes. Calling logger.info does not write to a file by itself. The logging system decides whether a record survives a logger threshold, whether handlers emit it, and how each handler renders it. The exercise uses an isolated in-memory stream so you can observe each stage without modifying Steward or deploying log infrastructure.",
        [{"title":"A log record travels through a pipeline","paragraphs":["A logger is a named object obtained with logging.getLogger(name). Code creates a record by calling logger.debug/info/warning/error/critical, but whether that record reaches an observer depends on configuration. Think of two separate decisions: the logger's effective level first, followed by every selected handler's level. Each emitted handler formats a LogRecord and sends it to a stream, file, socket or collector. A logger is not a destination; a handler owns the output.","A record contains standard attributes such as levelname, name, created and message; extra adds application fields that a formatter can reference. If the formatter expects request_id but a call does not provide it, formatting can fail. Therefore configure a stable event schema and tests before assuming a new field will always appear."]},{"title":"Logger level, handler level and propagation are different","paragraphs":["With a logger set to DEBUG and its StreamHandler set to INFO, DEBUG records are created but ignored by that handler. Changing only the logger level to DEBUG cannot make that handler print DEBUG. A child logger may also propagate records to ancestor handlers, producing duplicate lines if both child and root write the same record. In a training scratch logger you can set propagate=False; in a real application inspect the effective hierarchy and existing framework configuration instead of clearing unrelated handlers.","Use INFO for normal consequential state changes, WARNING for degraded but handled conditions and ERROR for failed operations requiring investigation. DEBUG can help development, but its fields must still respect security rules: lower severity does not make credentials safe to print."]},{"title":"Execute a logger with two thresholds and one negative control","paragraphs":["Run the complete script below using python3 in a disposable directory. It constructs its own named logger and in-memory output handler. First, INFO and WARNING appear exactly once while DEBUG does not. Next, moving the handler threshold to ERROR hides INFO even though the logger itself still accepts it. Both assertions must pass. If the first fails, inspect logger.propagate, handler.level and formatter before touching application code.","This example proves routing and formatting of a local Python log record, not central collection, log retention, redaction, distributed correlation, or absence of secrets in upstream proxies. The following lesson adds explicit event-field allowlisting and a deliberate leaking implementation to test against."],"code":{"language":"python","caption":"Logging pipeline — executable logger, handler, formatter and rejected INFO control","code":"import io\nimport logging\n\n# Logger name is a logical namespace; not a filename.\nstream = io.StringIO()\nlogger = logging.getLogger(\"tsa.steward.pipeline\")\nlogger.handlers.clear()  # isolated scratch program; never clear shared app handlers\nlogger.propagate = False  # prevent root handlers duplicating our example\nlogger.setLevel(logging.DEBUG)\n\nhandler = logging.StreamHandler(stream)\nhandler.setLevel(logging.INFO)\nhandler.setFormatter(logging.Formatter(\"%(levelname)s %(name)s %(message)s\"))\nlogger.addHandler(handler)\n\nlogger.debug(\"debug not emitted by INFO handler\")\nlogger.info(\"service created\")\nlogger.warning(\"service retry required\")\nobserved = stream.getvalue()\nassert \"debug not emitted\" not in observed\nassert observed.count(\"service created\") == 1\nassert observed.count(\"service retry required\") == 1\nassert \"INFO tsa.steward.pipeline service created\" in observed\nprint(\"LOGGER_PIPELINE_INFO_WARNING_NO_DEBUG\")\n\n# Demonstrate a negative case: the wrong handler threshold hides INFO.\nhandler.setLevel(logging.ERROR)\nstream.seek(0)\nstream.truncate(0)\nlogger.info(\"service created\")\nassert stream.getvalue() == \"\", \"Handler at ERROR must discard INFO\"\nprint(\"LOGGER_PIPELINE_HANDLER_THRESHOLD_NEGATIVE\")\nlogger.removeHandler(handler)\nhandler.close()"}}],
        "Predict and verify where log records actually go before adding production telemetry.",
        ["In a scratch Python file run the complete program and capture the two evidence labels.","Set the handler threshold to DEBUG and predict how many records appear; execute and explain the change.","Toggle propagate only after adding a root handler inside your scratch process; observe the duplicate and restore isolation.","Explain why adding actor, service and request IDs requires a consistent record schema, not an arbitrary string concatenation."],
        ["What is the difference between logger name, effective logger level, handler level and formatter?","Why can a logger set to DEBUG still produce no DEBUG output?","How might a valid record be duplicated, and why is clearing global handlers dangerous?","What is not established by this local in-memory logging experiment?"],
        [pythonLogging],
    ),
    lesson(
        "Useful Logging",
        "Logs are operational evidence. A useful log helps an engineer reconstruct what the system did without exposing secrets or forcing them to read source code for every incident.",
        [
            { title: "Log events, not noise", paragraphs: ["Choose events that matter: authentication failure categories, denied service mutations, important lifecycle changes, dependency updates and unexpected exceptions. Include stable identifiers and context needed for correlation. Avoid logging every function entry or duplicating framework access logs without purpose.", "Levels communicate expected operational meaning. ERROR is not 'something happened'; DEBUG is not a dumping ground for sensitive request bodies."] },
            { title: "Structured context improves investigation", paragraphs: ["A consistent event name plus service_id, actor_id and request correlation data is easier to search than prose assembled differently in every call site. Never log passwords, raw tokens or secrets."], code: { language: "python", code: "logger.info(\n    \"service.lifecycle_changed\",\n    extra={\"service_id\": service.id, \"actor_id\": request.user.id, \"from_state\": old, \"to_state\": new},\n)", caption: "Capture operationally useful context without secrets." } },
            {"title":"Prove logs capture context but not credentials","paragraphs":["A log record needs an event name, a stable entity identifier and a request correlation value; it must not contain authentication material or full request bodies. The following Python standard-library example captures a log message to an in-memory stream so the learner can assert both positive and negative claims. It demonstrates a logging contract, not a full distributed tracing system. Access controls, retention, ingestion and cross-service correlation are later operational topics."],"code":{"language":"python","caption":"Logging — executable structured-context and secret absence test","code":"import io\nimport logging\n\nstream = io.StringIO()\nlogger = logging.getLogger(\"tsa.steward.safe-events\")\nlogger.handlers.clear()  # scratch-only logger\nlogger.propagate = False\nlogger.setLevel(logging.INFO)\nhandler = logging.StreamHandler(stream)\nhandler.setFormatter(logging.Formatter(\n    \"%(levelname)s %(message)s service=%(service_id)s request=%(request_id)s actor=%(actor_id)s\"\n))\nlogger.addHandler(handler)\nsecret = \"demo-access-token-NEVER-LOG\"\n\ndef record_service_change(event, context):\n    # This is an explicit ALLOWLIST, not arbitrary request.data logging.\n    # IDs are validated upstream and the correlation ID is server-issued.\n    allowed = (\"service_id\", \"actor_id\", \"request_id\")\n    if any(key not in context for key in allowed):\n        raise ValueError(\"required diagnostic field absent\")\n    logger.info(event, extra={name: context[name] for name in allowed})\n\ncontext = {\n    \"service_id\": 42,\n    \"actor_id\": 7,\n    \"request_id\": \"req-demo-7\",\n    \"authorization\": \"Bearer \" + secret,\n}\nrecord_service_change(\"service.lifecycle_changed\", context)\nsafe_text = stream.getvalue()\nassert \"service.lifecycle_changed\" in safe_text\nassert \"service=42\" in safe_text and \"actor=7\" in safe_text\nassert \"request=req-demo-7\" in safe_text\nassert secret not in safe_text and \"Authorization\" not in safe_text\nprint(safe_text.strip())\nprint(\"LOG_ALLOWLIST_PRESERVED_EVENT_AND_DROPPED_SECRET\")\n\n# A deliberately WRONG implementation proves this test can detect leakage.\nmutant = \"service.lifecycle_changed \" + repr(context)\nassert secret in mutant, \"Mutant must actually include sensitive input\"\nassert secret not in safe_text, \"Our safe output may never match the mutant\"\nprint(\"LOG_MUTANT_LEAK_DETECTED\")\nlogger.removeHandler(handler)\nhandler.close()"}},
        ],
        "Improve Steward logging around one important operation and one failure path.",
        ["Choose an operation an on-call engineer would need to reconstruct.", "Define the event and minimum useful context.", "Add logs at appropriate levels.", "Exercise success and failure paths and inspect output.", "Check explicitly that tokens, passwords and secrets are absent."],
        ["What makes a log operationally useful?", "Why are stable identifiers preferable to display names in logs?", "Which values must not be logged?"],
        [pythonLogging],
    ),
    lesson(
        "Write a README Someone Can Follow",
        "A good README lets another engineer start from an unfamiliar repository and accomplish a real task without guessing. Before documenting a Django server, learn to write and verify instructions for a tiny Python program. This exercise creates all its own files in a temporary folder, including a README, and executes the commands it documents. No external service, database or Steward project is needed.",
        [
        {
                "title": "A README has a reader and a job",
                "paragraphs": [
                        "A new engineer asks different questions from an API client or reviewer. A README for a small application should explain what the project does, prerequisites, how to create an environment, how to run it, one working example and what a normal failure looks like. If a step requires credentials, data or a running server, say so explicitly; never invent those details.",
                        "Words such as 'configure normally' hide prerequisites. A usable instruction tells the reader where to run the command, which tool version it expects, which output confirms success and what to inspect if it fails. The following example deliberately uses no installation step or network access because its Python program requires only the standard library."
                ]
        },
        {
                "title": "Commands in documentation are claims you can test",
                "paragraphs": [
                        "A code fence containing `python app.py --check` claims that a file named app.py exists, that Python can run it, and that it produces a meaningful result. Check the actual exit status and output. A negative command such as `python app.py --unknown` also deserves an expected failure, rather than being treated as a broken setup.",
                        "A test that merely looks for the words 'python', 'database', 'migrate' and 'curl' can pass when no command is executable. It is a vocabulary check, not a setup test. The first documented example below contains two real runnable commands and verifies their results with subprocess."
                ]
        },
        {
                "title": "Execute the README instead of searching for keywords",
                "paragraphs": [
                        "Save the following as verify_readme.py and run `python verify_readme.py`. It writes app.py and README.md into a temporary scratch folder, extracts the two documented Bash command lines, runs them with the current Python interpreter and checks exact expected outcomes. The first command must succeed and print READY. The second must reject an unknown flag with exit code 2.",
                        "The harness deliberately accepts only the trusted, locally authored tutorial command pattern before it runs anything. In a real repository, do not blindly execute arbitrary Markdown from a pull request or external documentation. Review which commands are safe, isolate databases and secrets, and run only the intended test setup."
                ],
                "code": {
                        "language": "python",
                        "caption": "Documentation — executable setup instructions completeness gate",
                        "code": "from pathlib import Path\nfrom tempfile import TemporaryDirectory\nimport re\nimport shlex\nimport subprocess\nimport sys\n\napp_source = \"\"\"import argparse\nparser = argparse.ArgumentParser()\nparser.add_argument(\"--check\", action=\"store_true\")\nargs = parser.parse_args()\nif args.check:\n    print(\"READY\")\n\"\"\"\n\nfence = chr(96) * 3\nwith TemporaryDirectory() as temp:\n    root = Path(temp)\n    (root / \"app.py\").write_text(app_source, encoding=\"utf-8\")\n    readme = (\n        \"# Small Python CLI\\n\"\n        \"Requirement: Python 3.11 or newer. Work in this scratch folder.\\n\\n\"\n        \"Check that the command runs:\\n\"\n        + fence + \"bash\\npython app.py --check\\n\" + fence + \"\\n\\n\"\n        \"Expected output: READY and exit status 0.\\n\\n\"\n        \"Try an invalid option:\\n\"\n        + fence + \"bash\\npython app.py --unknown\\n\" + fence + \"\\n\\n\"\n        \"Expected: exit status 2 with an unrecognized-arguments error.\\n\"\n    )\n    (root / \"README.md\").write_text(readme, encoding=\"utf-8\")\n    fenced = re.findall(re.escape(fence) + r\"bash\\n(.*?)\\n\" + re.escape(fence), readme, re.S)\n    commands = [line.strip() for block in fenced for line in block.splitlines() if line.strip()]\n    assert len(commands) == 2\n    for command, expected_exit in zip(commands, (0, 2)):\n        tokens = shlex.split(command)\n        assert tokens[0] == \"python\"  # Only this trusted local tutorial command.\n        result = subprocess.run(\n            [sys.executable, *tokens[1:]],\n            cwd=root,\n            capture_output=True,\n            text=True,\n            check=False,\n        )\n        assert result.returncode == expected_exit, (command, result.stderr)\n        if expected_exit == 0:\n            assert result.stdout.strip() == \"READY\"\n        else:\n            assert \"unrecognized arguments\" in result.stderr.lower()\n\n    vague = \"Install dependencies and run the application as usual.\"\n    assert not re.findall(re.escape(fence) + r\"bash\\n(.*?)\\n\" + re.escape(fence), vague, re.S)\n    print(\"documented commands executed: 2 (success and expected failure)\")\n    print(\"documentation checklist passed; vague instructions rejected\")"
                }
        },
        {
                "title": "Recognize what the experiment has not proved",
                "paragraphs": [
                        "The experiment verifies that the included toy commands work in the controlled scratch environment. It does not prove another person's operating system has Python installed, that PostgreSQL is accessible, that a Django migration has been applied or that a real API has appropriate authentication. Those claims require a separate integration environment and evidence.",
                        "For an actual Steward README, test prerequisites, database name, migrations, server startup, a working HTTP request and a rejected request in a clean, disposable setup. If an instruction cannot be safely automated, record that limitation and have another engineer follow it manually."
                ]
        }
],
        "Write and execute two documented setup commands, including a deliberate negative case, rather than treating a list of keywords as working documentation.",
        [
        "Write down the reader, prerequisite interpreter and expected success and failure before drafting the README.",
        "Run the full source-published verify_readme.py example and inspect the expected outputs and exit statuses.",
        "Deliberately change the documented successful command from `--check` to `--missing`; rerun and prove the documentation verification fails. Restore the correct command.",
        "Explain why the harness restricts its executed commands instead of blindly running all Markdown code fences.",
        "State what the small scratch test cannot establish about Django, PostgreSQL, authentication or deployed environments.",
        "Choose one actual Steward README claim and describe a safe, clean way to test it without relying on undocumented local data."
],
        [
        "Why is the presence of setup keywords not proof of reproducibility?",
        "What should a reader learn from both a successful and a failed command?",
        "Why is a clean scratch environment stronger evidence than commands run only on the author's machine?",
        "Which documentation commands must not be executed automatically without review?"
],
        [twelveFactor],
    ),
    lesson(
        "Technical Documentation",
        "Once you can write setup instructions someone can actually follow, decide what kind of documentation each reader needs. A README, API reference, architecture decision record and operational runbook answer different questions; combining everything into one long page makes facts easy to duplicate and forget. Use actual Steward files and verified behavior only after the independent README exercise.",
        [
        {
                "title": "Choose the document for the job",
                "paragraphs": [
                        "A README or getting-started guide explains what the project is and how to run it. API documentation explains endpoints, request/response shapes and authentication for consumers. A design document explains a system's structure; an Architecture Decision Record (ADR) preserves the context and trade-offs behind a consequential choice. A runbook gives an operator a tested, ordered diagnosis or recovery procedure. None is a synonym for the others.",
                        "A new contributor should not need to read an incident runbook to learn where the application starts. An API consumer should not search a development README for the current JSON contract. Link to a canonical, maintained source where possible instead of copying the same mutable settings across multiple files."
                ]
        },
        {
                "title": "Document the actual setup rather than an imagined one",
                "paragraphs": [
                        "For Steward, identify the real Python and PostgreSQL prerequisites, environment variables, Django project path, database migration command and verified first request. Keep the manually created SQL teaching database separate from the Django-managed training database. An unverified health route or a guessed password is worse than marking a missing instruction as unresolved.",
                        "List any setup steps that require externally provided access or data; explain how a clean local substitute can be created if the project supports one. Do not claim a command is executable merely because it appears in a Markdown code fence. Re-run the setup against the actual target as part of a controlled handoff."
                ]
        },
        {
                "title": "Preserve decisions without narrating every edit",
                "paragraphs": [
                        "A concise ADR records the problem, relevant context, actual decision, plausible alternatives, consequences and how the decision may be revisited. An ADR for separate teaching databases might explain why raw SQL fixtures cannot share the same migration-managed database. It should not include internal assistant notes or speculative architectural work that was never approved.",
                        "Treat documentation changes as part of feature work. If the authentication or API contract changes, update the canonical reference and dependent setup examples in the same review; stale documentation is a behavior defect for its reader."
                ]
        },
        {
                "title": "Write useful runbooks with safe stopping points",
                "paragraphs": [
                        "A runbook includes what symptom triggers it, the non-destructive evidence to collect, preconditions, exact checks, expected outcomes, recovery steps if authorized, and escalation/rollback conditions. It should not casually prescribe deleting data or changing production credentials to make an example pass.",
                        "Builder needs a concise local diagnostic handoff, not a fully operated monitoring platform. Later Reliability and Delivery material can extend incident response and release automation using real operational requirements."
                ]
        },
        {
                "title": "Review documentation as an engineering contract",
                "paragraphs": [
                        "Ask another engineer to use the documented steps starting from a clean environment, record every place they need to guess, then update the relevant source. Automated verification should exercise safe commands where possible, and manual checks should be explicitly labelled rather than silently assumed.",
                        "The earlier README exercise intentionally tested its own claims with an isolated executable harness. The same principle extends to production documentation, but additional controls are necessary when commands can mutate a database, deploy a release or access private data."
                ]
        }
],
        "Create a usable Steward handoff with verified setup, reader-specific documentation and one evidence-backed decision record.",
        [
        "Complete the independent Write a README Someone Can Follow exercise before modifying actual project documentation.",
        "Review the current Steward setup and list unverified assumptions, missing prerequisites and commands that rely on a local-only environment.",
        "Verify a clean local setup path from project checkout through the actual database migration and one permitted and one rejected request, using an isolated database.",
        "Document core Steward relationships (Team, Service, Environment and relevant membership), link to canonical API schema and record known limitations.",
        "Write one concise ADR with context, decision, alternative and consequence. Keep it separate from operator troubleshooting instructions.",
        "Have another engineer reproduce the safe setup or record which steps still require credentials, approvals or manual verification; fix all falsified claims.",
        "Draft one small runbook for an observed, non-destructive diagnostic and specify when to stop/escalate."
],
        [
        "Which kind of document should explain an API payload, a setup command, a design decision and a recovery procedure?",
        "What evidence distinguishes documented commands from verified commands?",
        "Why is a guessed local database password an unacceptable handoff instruction?",
        "When should documentation be updated alongside code?"
],
        [twelveFactor],
    ),
    lesson(
        "Failure Boundaries and Public Error Contracts",
        "A failure is not just an exception text or a numeric HTTP status. It is an agreement with an API client about what happened and what it may safely do next. Before attaching custom exception handlers to Steward, build one small, explicit contract that cannot accidentally expose SQL internals and that preserves the distinction between credentials, permission, resource visibility and conflicting state.",
        [{"title":"A failure crosses several boundaries","paragraphs":["Input parsing decides whether a request is structurally valid. Authentication establishes who is calling, authorization checks whether the caller may perform this specific action on current data, and domain invariants reject conflicting operations. Database drivers and third-party libraries can also raise internal errors. The exception class you catch is not automatically the response you should publish: map it at a controlled boundary.","A client-facing result needs a stable status code and machine-readable application code. A short human message should be useful but must not expose a SQL statement, stack trace, raw token, infrastructure hostname or internal table name. Server-side diagnostic logs can record a server-issued correlation ID and useful metadata with restricted access; they have a different trust audience from the public body."]},{"title":"Distinguish six outcomes before writing a handler","paragraphs":["400 means that the client supplied an invalid request shape or value; 401 means valid authentication is missing or unusable; 403 means an authenticated caller lacks permission. 404 indicates the route or resource is not available to the caller, and may intentionally conceal a resource in another Team. 409 means the submitted operation conflicts with current state, for example a stale expected owner during a transfer. 500 is a failure the service did not anticipate or classify as a client rejection.","Never use 403 for an unknown authenticated user simply to hide a programming bug; the distinction between expected domain denial and unexpected failure comes from verified application behavior. An attacker may compare timing, counts or data in responses, so matching 404 bodies is necessary but is not a complete side-channel analysis. For an absent Service and a foreign-Team Service, the public 404 shape should be indistinguishable."]},{"title":"Create and break a public response-policy oracle","paragraphs":["Run the following complete standalone Python program. It checks all six status families and a stable code/message/request_id response shape, then constructs a deliberately wrong mapper that copies a database exception to a client. The positive assertion checks that the bad implementation really leaks the secret, while the safe implementation must not. It also checks that absent and unauthorized-to-view resources get one public 404 shape.","The program is deliberately pure: its return value models an HTTP response but does not send packets or exercise DRF middleware. After this checkpoint, the Designing Errors lesson must compare the same contract against REAL response.status_code and response.json() using DRF and the earlier signed Steward URLConf. Do not report this pure-Python test as proof that an actual API is secure."],"code":{"language":"python","caption":"Public error contracts — six outcomes, concealed 404 and an exception-leak mutant","code":"# Pure Python contract first. The NEXT lesson connects it to DRF HTTP.\nSTATUS = {\n    \"invalid\": (400, \"invalid_input\"),\n    \"unauthenticated\": (401, \"authentication_required\"),\n    \"forbidden\": (403, \"permission_denied\"),\n    \"missing\": (404, \"resource_not_found\"),\n    \"conflict\": (409, \"state_conflict\"),\n}\n\ndef public_problem(kind, request_id):\n    # Never serialize raw exceptions or client-controlled request bodies.\n    status, code = STATUS.get(kind, (500, \"internal_error\"))\n    return {\n        \"status\": status,\n        \"body\": {\n            \"code\": code,\n            \"message\": \"Request could not be completed.\",\n            \"request_id\": request_id,\n        },\n    }\n\ncases = {\n    \"invalid\": 400,\n    \"unauthenticated\": 401,\n    \"forbidden\": 403,\n    \"missing\": 404,\n    \"conflict\": 409,\n    \"unexpected\": 500,\n}\nfor kind, expected in cases.items():\n    response = public_problem(kind, \"req-42\")\n    assert response[\"status\"] == expected, kind\n    assert set(response[\"body\"]) == {\"code\", \"message\", \"request_id\"}\n    assert response[\"body\"][\"request_id\"] == \"req-42\"\nprint(\"PUBLIC_FAILURE_SIX_OUTCOMES_AND_STABLE_SHAPE\")\n\n# Mutant: reflecting raw DB exceptions into a client is information leakage.\nsql_error = \"FATAL password=demo-db-secret internal_table=membership\"\nunsafe = {\"message\": str(sql_error)}\nassert \"demo-db-secret\" in unsafe[\"message\"]\nsafe = public_problem(\"unexpected\", \"req-42\")\nassert \"demo-db-secret\" not in repr(safe)\nassert \"membership\" not in repr(safe)\nassert safe[\"status\"] == 500\nprint(\"PUBLIC_FAILURE_MUTANT_REJECTED_NO_DB_SECRET\")\n\n# Concealed 404 must use the same public response as absent resources.\nabsent = public_problem(\"missing\", \"req-42\")\noutside_scope = public_problem(\"missing\", \"req-42\")\nassert absent == outside_scope\nprint(\"PUBLIC_FAILURE_CONCEALED_RESOURCE_UNIFORM\")"}},{"title":"Choose retry and disclosure behavior explicitly","paragraphs":["A 400 usually needs corrected input; a 401 needs authentication; a 403 is not cured by automatically retrying with the same caller; a 409 often requires the caller to re-read state and decide whether to submit an updated operation. A 500 should trigger investigation and safe, bounded retry logic only when the operation's idempotency and duplicate effects have been understood. Never promise that every 500 is safe to retry.","Record one audit event for denied or failed state-changing requests with correlation ID, actor and resource identifiers when available, but omit credentials and request bodies. A public request_id must be server-generated and cannot itself reveal a private identifier. These operational guarantees require tests at the actual HTTP and logging boundaries, not merely a pretty JSON example."]}],
        "Distinguish public failure classes and reject SQL/secret leakage before wiring DRF handlers.",
        ["Run the source-exact Python example and capture all three evidence labels, without editing the assertions.","Delete the safe mapper and replace its message with repr(sql_error); confirm the leak assertion now fails for the intended reason.","Write one decision table with each failure family, expected client action and server-only diagnostic evidence.","On a disposable Steward project, identify one real 401, one 403, one concealed 404 and one stale-state 409 to verify in the next lesson."],
        ["Why can a failed permission check return 404 instead of 403, and what else could still leak resource existence?","When should a client re-read state after 409 rather than blindly retry?","Why is successful execution of public_problem not proof of a DRF HTTP status?","What information belongs in a public error body versus restricted structured logs?"],
        [twelveFactor],
    ),
    lesson(
        "Designing Errors",
        "Errors are part of a system's interface. They should distinguish invalid input, forbidden operations, missing resources, conflicts and unexpected failures without leaking implementation details.",
        [
            { title: "Make failures actionable", paragraphs: ["A client should be able to tell whether it must change input, authenticate, request different permission, retry later or report a server failure. Stable error codes can preserve machine-readable meaning while human messages remain clear.", "Do not expose SQL errors, stack traces or token internals to API consumers. Preserve detailed evidence in controlled logs instead."] },
            { title: "Map domain failures deliberately", paragraphs: ["A duplicate service slug may be a conflict, unsupported lifecycle input is validation failure, cross-team modification is forbidden, and a missing service is not found. Framework defaults are useful, but the public contract still belongs to the application."], code: { language: "json", code: "{\n  \"code\": \"service_dependency_conflict\",\n  \"message\": \"This dependency already exists.\",\n  \"details\": {\"dependency_service_id\": 17}\n}", caption: "Expose stable meaning, not internal exception text." } },
            {"title":"Separate authorization denial from invalid data and conflicts","paragraphs":["HTTP clients must be able to distinguish a malformed request (400), missing or invalid credentials (401), insufficient permission (403), unknown resource (404), conflicting state (409), and unexpected server failure (500). Those meanings are not interchangeable. The function below is a deliberately small pure mapping from known domain outcomes to a status and stable error code; it does not pretend to be a full Django/DRF exception handler. In the API module, the handler must also exclude database internals and log unexpected errors privately with a correlation ID."],"code":{"language":"python","caption":"Errors — executable stable public error mapping","code":"def public_error(kind):\n    table = {\n        'invalid': (400, 'invalid_input'),\n        'unauthenticated': (401, 'authentication_required'),\n        'forbidden': (403, 'permission_denied'),\n        'missing': (404, 'service_not_found'),\n        'duplicate': (409, 'service_conflict'),\n    }\n    return table.get(kind, (500, 'internal_error'))\n\nassert public_error('forbidden') == (403, 'permission_denied')\nassert public_error('duplicate') == (409, 'service_conflict')\nassert public_error('unexpected_sql_error') == (500, 'internal_error')\nprint('public error mappings:', 6)"}},
        ],
        "Audit and improve Steward's public failure contract.",
        ["Choose validation, authorization, conflict, not-found and unexpected failure cases.", "Record current status and response shape.", "Make one inconsistent case conform to a deliberate contract.", "Verify internal exception details remain out of the response.", "Document which failures clients may safely act on."],
        ["Why are errors part of an API contract?", "What should differ between client responses and server logs?", "When is 409 more meaningful than a generic 400?"],
        [twelveFactor],
    ),
    lesson(
        "Performance Awareness",
        "Performance awareness starts with a measurable request and an explicit definition of success. It joins the earlier SQL/ORM lessons to Software Craft by asking whether a change improves a user-visible outcome enough to justify its added complexity, without compromising the Steward authorization or production-readiness rules.",
        [
                {
                        "title": "A performance claim needs a request, population and threshold",
                        "paragraphs": [
                                "'The API feels slow' is not a requirement. Write one testable objective: e.g., GET /services for 100 authorized Services should meet a specified p95 response latency and return a bounded response size under a declared request rate. Name the dataset, concurrency, authorization scope, response fields, hardware and network. A database query plan measures server execution; a user-visible HTTP request also includes network, queueing, authentication, serializers and rendering. Do not confuse these timing boundaries.",
                                "Latency samples vary. The median (p50) describes a typical request; p95 highlights slower requests. A 1ms improvement in an isolated local query is not automatically valuable if authentication or remote network dominates the real response. Record enough observations to compare distributions and avoid overstating the precision of small samples."
                        ]
                },
                {
                        "title": "Run a deterministic percentile calculation, then interpret its limits",
                        "paragraphs": [
                                "This code teaches the nearest-rank percentile definition with a deliberately synthetic sample. Its output is predictable and can be executed without an API, but it is NOT evidence that Steward has a 400ms p95. A real performance study must collect latency from actual requests under controlled load. Different tools can use interpolated percentile definitions, so document the calculation and sample size when comparing reports."
                        ],
                        "code": {
                                "language": "python",
                                "caption": "Performance Awareness — executable p50/p95 with a slow-tail negative case",
                                "code": "import math\n\ndef percentile_nearest_rank(values, fraction):\n    if not values or not (0 < fraction <= 1):\n        raise ValueError(\"nonempty samples and fraction in (0,1] required\")\n    ordered = sorted(values)\n    return ordered[math.ceil(len(ordered) * fraction) - 1]\n\nnormal = [80, 85, 90, 90, 92, 95, 95, 97, 98, 100,\n          100, 101, 102, 103, 105, 107, 109, 111, 115, 120]\nslow_tail = normal[:-2] + [320, 400]\nassert percentile_nearest_rank(normal, 0.50) == 100\nassert percentile_nearest_rank(normal, 0.95) == 115\nassert percentile_nearest_rank(slow_tail, 0.50) == 100\nassert percentile_nearest_rank(slow_tail, 0.95) == 320\nprint(\"synthetic p50 unchanged at 100ms; p95 grows from 115ms to 320ms\")"
                        }
                },
                {
                        "title": "Trace where the request actually spends work",
                        "paragraphs": [
                                "For a Steward Service list, mark sequential boundaries: HTTP connection and authentication, scoped queryset construction, database server work/round trips, Python model materialization, serializer representation and network output. An N+1 relationship access can dominate round trips, while unbounded fields can dominate payload size. A caching layer could reduce one workload but introduce stale authorization or lifecycle data. Measure before proposing Redis or indexes. The earlier ORM N+1 lab proved 5 versus 1 database statements: that result is a query-count observation, not itself an HTTP latency claim.",
                                "A robust assessment includes negative path measurements as well: cross-Team filtering must happen before pagination and caching. An apparently fast endpoint that leaks unauthorized records is not a performance success. A cache keyed only by page number instead of authenticated Team may be a critical access-control bug. Security and correctness remain invariants, never optimization knobs."
                        ]
                },
                {
                        "title": "Choose one intervention and preserve a controlled baseline",
                        "paragraphs": [
                                "First reproduce the symptom with stable data shape and load. If the trace shows N+1, try select_related for a single FK or prefetch_related for a collection; if the plan shows a costly scan over a selective field, evaluate a justified index; if serialization emits huge unused values, constrain output. Change one factor at a time, remeasure warm and cold behavior where relevant and record variance, query counts, row counts and payload size. An index may improve reads but slow writes and consume storage. A faster local implementation might be a worse operational choice after maintenance cost is included.",
                                "When measurements are inconclusive, do not force an optimization to complete an exercise. A correct **no-change** decision should state the observed data, expected impact of the proposed fix and the trigger for revisiting. An engineering review can reward restraint."
                        ]
                },
                {
                        "title": "An independent test requires a different dataset",
                        "paragraphs": [
                                "Build a small performance note for GET /services on a real Django/PostgreSQL lab: seed 5 and 150 authorized Services, measure query count and HTTP response sizes for a fixed page limit, then explain which metric should remain bounded. Use Django CaptureQueriesContext to identify relation-loading work, and a separate HTTP client for full response time. Show why pagination cannot be replaced with one huge prefetch. Retest with a different Team identity to ensure the measured endpoint did not skip authorization checks.",
                                "Submit a table with workload, baseline, change/no-change, observed result, limitations and revisit trigger. The deeper System Thinker school will introduce distributed performance effects; Builder must first be able to explain the cost of its own application/database boundaries."
                        ]
                }
        ],
        "Investigate one Steward endpoint for performance risk without speculative optimization.",
        [
                "Choose a realistic authorized Steward endpoint, dataset sizes, request rate and explicit metric/threshold.",
                "Run the published synthetic percentile example; explain why it is not evidence of a real API p95.",
                "Capture baseline query counts and response timing on an actual disposable Django/PostgreSQL endpoint; distinguish database and HTTP timing.",
                "Identify the measured dominant work and make one bounded change only if evidence supports it.",
                "Run a positive and cross-Team negative request after the change; verify authorization and pagination remain correct.",
                "Compare before/after results with sample size, variance and complexity cost; record a justified no-change decision when appropriate."
        ],
        [
                "How do database EXPLAIN timings differ from end-to-end API latency?",
                "Why can the median stay stable while p95 deteriorates?",
                "Why might a cache or extra index damage correctness or write throughput?",
                "Which evidence would support a decision not to optimize?"
        ],
        [
            { title: "Django QuerySet API", url: "https://docs.djangoproject.com/en/5.2/ref/models/querysets/", kind: "documentation", purpose: "Learn relationship loading and query evaluation, not guess SQL counts." },
            { title: "PostgreSQL EXPLAIN", url: "https://www.postgresql.org/docs/current/using-explain.html", kind: "reference", purpose: "Interpret actual-versus-estimated database execution time." },
            twelveFactor,
        ],
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
