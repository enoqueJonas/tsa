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
  "Testing as a Change Safety Net": { outcomes: ["Define observable behavior to protect with tests.", "Prove a negative test fails for the intended defect.", "Choose the narrowest honest test boundary and record remaining risks."], practical: "Prove a refactor preserves behavior" },
  "Inspect Python Packages": { outcomes: ["Explain how Python, pip and a virtual environment relate.", "Create and inspect an isolated environment without downloading packages.", "Distinguish installed distributions from imports and direct from transitive dependencies."], practical: "Create and inspect a Python environment" },
  "Managing Dependencies": { outcomes: ["Distinguish declared application dependencies from transitive packages.", "Explain compatibility ranges, reproducible resolution and safe update checks.", "Justify an external, local or internal-package choice from actual consumer need."], practical: "Decide which dependencies to keep or change" },
  "Configuration": { outcomes: ["Separate code from environment-owned settings.", "Validate types and fail visibly when required configuration is absent.", "Avoid exposing credentials through defaults or logs."], practical: "Prove configuration fails safely" },
  "Static Analysis and Automated Feedback": { outcomes: ["Distinguish formatting, linting, type checking and behavioral tests.", "Run the appropriate tool before committing.", "Treat warnings according to a documented policy rather than hiding them."], practical: "Make static checks actionable" },
  "Review a Code Change": { outcomes: ["Review intended behavior and access rules before style.", "Detect a cross-customer leak with a negative test and verify the fix.", "Classify blockers, requirement questions and optional suggestions by consequence."], practical: "Review and retest an unsafe patch" },
  "Managing Technical Debt": { outcomes: ["Separate a current defect from future maintenance cost.", "Record concrete evidence, affected change, owner and revisit trigger.", "Choose repayment or deliberate deferral based on real risk."], practical: "Make an evidence-based debt decision" },
  "Useful Logging": { outcomes: ["Select events that answer operational questions.", "Capture stable context without leaking credentials.", "Test expected, rejected and unexpected outcomes with useful log levels."], practical: "Capture safe, diagnostic events" },
  "Technical Documentation": { outcomes: ["Choose a document form suited to the reader's job.", "Write reproducible setup and verification instructions.", "Record decisions and check documentation for drift."], practical: "Write and verify developer documentation" },
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
        "Testing as a Change Safety Net",
        "Automated tests give software craft a feedback mechanism. At Builder level, the goal is not to construct a sophisticated test architecture; it is to capture important behavior at the smallest useful boundary so refactoring, bug fixes and review can distinguish intended change from regression.",
        [
            { title: "Test behavior, not implementation trivia", paragraphs: ["A useful test states a behavior the system must preserve: a maintainer can update its team's service, a cross-team user receives a denial, or a duplicate dependency is rejected. Tests that assert private helper call order or duplicate framework internals can make harmless refactoring unnecessarily expensive.", "Choose the narrowest boundary that can prove the behavior honestly. Pure domain logic can often be tested without HTTP or a database. Persistence constraints require database evidence. API contracts require requests and responses. One test style cannot prove every layer."] },
            { title: "Arrange, act, assert makes evidence readable", paragraphs: ["Arrange establishes the relevant state, act performs one meaningful operation, and assert checks the observable result. The labels are a reasoning model, not mandatory comments. Keep each test focused enough that a failure points toward one violated behavior."], code: { language: "python", code: "def test_maintainer_cannot_update_other_teams_service(api_client, user_a, service_b):\n    api_client.force_authenticate(user_a)\n\n    response = api_client.patch(\n        f\"/services/{service_b.id}/\",\n        {\"name\": \"forged change\"},\n        format=\"json\",\n    )\n\n    assert response.status_code == 403\n    service_b.refresh_from_db()\n    assert service_b.name != \"forged change\"", caption: "Prove both the public denial and the absence of the forbidden state change." } },
            { title: "A regression test turns a discovered defect into a permanent claim", paragraphs: ["When fixing a bug, first reproduce the failure with a focused test when practical. Observe it fail for the expected reason, apply the fix, then observe it pass. This red-to-green evidence is stronger than adding a test after the implementation and never proving that it could detect the defect.", "For refactoring, the starting state should already be green. Make a small structural change and rerun the relevant safety net. If behavior must change, separate that feature change from the structural cleanup."] },
            { title: "Fast feedback and realistic evidence serve different purposes", paragraphs: ["A small pure test is fast and localizes logic failures. A database/API test covers more integration behavior but has more setup and possible failure causes. Builder should maintain a useful mix driven by risk, not chase a test-count target. Quality Steward later develops systematic test design, automation architecture, advanced isolation and quality strategy in depth."] },
            { title: "Test doubles belong at controllable boundaries", paragraphs: ["A stub supplies predetermined data; a fake is a lightweight working implementation; a mock/spy can verify interactions. Use doubles when a real collaborator is slow, nondeterministic, destructive or outside the test's scope. Do not mock your own implementation so heavily that the test only proves the mocks were configured consistently." ] },
            { title: "Dependency injection improves controllability when there is a real collaborator", paragraphs: ["Passing a clock, notifier or external client into application code can make behavior deterministic and keep infrastructure replaceable in tests. Injection is not automatically a framework/container: ordinary constructor/function parameters are often sufficient." ] },
            { title: "Coverage is a clue, not a quality score", paragraphs: ["Coverage can reveal code that no test executes, but high percentage does not prove meaningful assertions, important boundaries or negative cases. Use risk and behavior to decide tests; use coverage to ask better questions rather than optimize for a number." ] },
            {"title":"Run two domain tests without inventing a running API","paragraphs":["Start with the narrowest honest boundary. An ownership predicate can be tested as ordinary Python without installing Django or creating a database. The built-in unittest runner provides executable arrange/act/assert behavior. The negative case matters because accidentally returning True to an external Team would create an authorization defect. After these tests pass, changing the predicate should make the negative test fail, then restoring it should return to green. This is local domain evidence only; the later API-level authorization test remains necessary to prove routing, identity and persistence."],"code":{"language":"python","caption":"Testing — executable unittest authorization boundary","code":"import unittest\n\ndef can_manage(actor_team_id, service_team_id):\n    return actor_team_id == service_team_id\n\nclass OwnershipTests(unittest.TestCase):\n    def test_same_team_allowed(self):\n        self.assertTrue(can_manage(2, 2))\n    def test_other_team_rejected(self):\n        self.assertFalse(can_manage(2, 9))\n\nif __name__ == '__main__':\n    unittest.main()"}},
        ],
        "Create a focused safety net around one Steward behavior before changing its implementation.",
        ["Choose one domain behavior that matters to the current refactor or review.", "State what observable result must remain stable.", "Choose the narrowest honest boundary: pure logic, database behavior or API contract.", "Write at least one positive and one relevant negative case.", "Run the tests before the refactor and record the baseline.", "Perform one small structural change and rerun the same tests.", "For one known or deliberately introduced defect, demonstrate a regression test failing before the fix and passing after it.", "Identify one implementation detail you deliberately did not assert."],
        ["Why can a test that asserts private implementation details make refactoring harder?", "When is a database/API test necessary instead of a pure unit-style test?", "What does observing a regression test fail before the fix prove?", "Why should Builder avoid optimizing for raw test count?"],
        [refactoringGuru],
    ),
    lesson(
        "Inspect Python Packages",
        "Before making architectural decisions about dependencies, learn what Python actually installs and where. Python is the interpreter; pip is a tool that installs Python distributions into a particular environment; a virtual environment gives one project an isolated installation location. First inspect an empty local environment, then inspect a real library and the packages it brings with it. No Docker, server or Steward application is needed for the first lab.",
        [
        {
                "title": "Interpreter, module, package and distribution are different things",
                "paragraphs": [
                        "An interpreter executes Python code. A module is importable code such as datetime; an import package can contain several modules. A distribution is an installable unit published through packaging tools. Distribution names and import names do not always match: the Django distribution is installed as Django and used in code as import django.",
                        "pip does not run the program; it installs and reports packages for the Python interpreter you invoke it with. Run python -m pip rather than trusting an unrelated pip command found on your PATH. This reduces the classic mistake of installing a package under one Python and running code under another."
                ]
        },
        {
                "title": "Create one isolated environment from scratch",
                "paragraphs": [
                        "Open a terminal in a safe scratch directory and run these commands as shown on macOS or Linux. They create tsa-deps-lab/.venv and use that exact interpreter; activation is optional. On Windows the interpreter path differs (such as .venv\\\\Scripts\\\\python.exe), but the concept is the same. A virtual environment is not a PostgreSQL server, container or new operating system.",
                        "pip --version names the pip installation and the Python version it targets. pip list shows installed distributions; pip show pip gives metadata and location. pip freeze prints version pins for installed non-bootstrap packages and can be empty in a fresh environment. pip check verifies that installed distributions' declared requirements are compatible; it does not prove an application works."
                ],
                "code": {
                        "language": "bash",
                        "caption": "Python dependencies — create and inspect an offline virtual environment",
                        "code": "mkdir tsa-deps-lab\ncd tsa-deps-lab\npython3 -m venv .venv\n./.venv/bin/python -m pip --version\n./.venv/bin/python -m pip list\n./.venv/bin/python -m pip show pip\n./.venv/bin/python -m pip freeze\n./.venv/bin/python -m pip check\n./.venv/bin/python -c \"import sys, importlib.metadata as m; print('Interpreter:', sys.executable); print('pip distribution:', m.version('pip'))\""
                }
        },
        {
                "title": "Why an import can fail even after you installed a package",
                "paragraphs": [
                        "If Python says ModuleNotFoundError, first check which interpreter is executing the program and which environment received the installation. Inspect sys.executable, python -m pip --version and the distribution's metadata before guessing a new username, running sudo or changing system paths.",
                        "Import and distribution naming may differ, and some distributions contain more than one importable package. The clean lab intentionally includes only the initial environment packages. It cannot import Django until Django has been installed into this particular environment; it does not inherit whatever is installed globally."
                ]
        },
        {
                "title": "Install a real library only after choosing the environment",
                "paragraphs": [
                        "The following is an optional online extension in the disposable lab. It installs a compatible Django release into the scratch environment and allows pip to resolve its dependencies. The quotes protect the version operators from your shell. This step needs access to your configured, trusted package index; skip it if you have no network rather than guessing credentials.",
                        "After installation, compare pip show Django with pip show asgiref. Django is a direct choice in this example, while asgiref is installed to satisfy Django's dependency metadata. You should not start importing asgiref directly from your own application just because it happens to be present. A future Django upgrade could change its transitive set."
                ],
                "code": {
                        "language": "bash",
                        "caption": "Python dependencies — optional online Django installation and metadata inspection",
                        "code": "# Only in the disposable tsa-deps-lab, with a trusted package source and network:\n./.venv/bin/python -m pip install \"Django>=5.2,<6\"\n./.venv/bin/python -m pip show Django\n./.venv/bin/python -m pip show asgiref\n./.venv/bin/python -c \"import django; print('Django import:', django.get_version())\"\n./.venv/bin/python -m pip check"
                }
        },
        {
                "title": "What the basic commands do and do not establish",
                "paragraphs": [
                        "pip list is a view of the current environment; pip show gives information about one installed distribution; pip freeze captures resolved versions; pip check checks installed requirement metadata. None of these alone expresses why the application needs each dependency, whether the chosen versions are supported or whether the code is correct.",
                        "Your application's direct requirements should be declared deliberately. A reproducible lock or resolved dependency artifact preserves the full tested set for installation. Do not treat a random pip freeze from a workstation as a considered dependency policy. The next lesson covers how to choose, constrain, review and upgrade packages."
                ]
        }
],
        "Learn to create a Python virtual environment and inspect pip, installed distributions and import resolution without requiring any external service.",
        [
        "Create an empty tsa-deps-lab outside Steward, execute the complete offline command block and confirm the interpreter path points inside .venv.",
        "Explain which command shows the pip environment, installed distributions, one distribution's metadata, resolved pins and requirement consistency.",
        "Predict why import django fails in a new offline environment and why a global Django installation should not be assumed available there.",
        "If a trusted package source and network are available, run the optional Django block; inspect Django and asgiref without altering any production or Steward environment.",
        "Write a sentence distinguishing direct Django dependency, its transitive asgiref dependency and the import statement import django.",
        "Explain why a successful pip check cannot substitute for code tests and why a frozen environment snapshot is not automatically a reviewed lock policy."
],
        [
        "How does python -m pip identify where to install a package?",
        "What is the difference between a distribution and an import name?",
        "What can pip freeze tell you that pip list does not?",
        "Why might a package work in one terminal but fail to import in another?",
        "What does a clean pip check not prove?"
],
        [{"title":"Python — venv","url":"https://docs.python.org/3/library/venv.html"},{"title":"Python Packaging User Guide — Installing Packages","url":"https://packaging.python.org/en/latest/tutorials/installing-packages/"}],
    ),
    lesson(
        "Managing Dependencies",
        "Once you can inspect an environment, decide which external packages your application should rely on and how the team will maintain them. Every dependency has a purpose, a version contract, an update risk and a long-term owner. This lesson moves from what pip installed to why a project declares it; do not invent a shared library or CI platform just to practise the vocabulary.",
        [
        {
                "title": "Direct and transitive dependencies in a real project",
                "paragraphs": [
                        "A direct dependency is a package your application intentionally declares because it uses its supported capability. In the earlier Django training project, Django and Django REST Framework are direct choices. Django may bring asgiref and sqlparse as transitive dependencies because its own metadata requires them. The transitive graph is resolved by the installer; it does not mean your application has promised to support those transitives as public APIs.",
                        "Inspect the actual training environment after activating it: python -m pip show Django, python -m pip show asgiref, python -m pip freeze and python -m pip check. Compare the Requires and Required-by fields where available. If this environment does not have Django installed, return to the preceding optional lab rather than inventing an installed package."
                ],
                "code": {
                        "language": "text",
                        "caption": "A conceptual dependency graph, not a command to run",
                        "code": "Application (declares Django, djangorestframework)\n  ├─ Django (direct)\n  │    ├─ asgiref (transitive through Django)\n  │    └─ sqlparse (transitive through Django)\n  └─ djangorestframework (direct)\n\nPackage names and exact resolved versions depend on the environment."
                }
        },
        {
                "title": "Decide whether a dependency is worth owning",
                "paragraphs": [
                        "Ask what capability is needed, what the standard library/framework already provides and what it would cost to implement, test and maintain yourself. A trusted, maintained library for difficult protocol or security behavior often reduces risk; a new package for a three-line formatting helper may increase it.",
                        "Review support and maintenance activity, releases, license compatibility, known advisories, runtime/platform compatibility and the cost of replacing it. Not every dependency has equal risk: application authentication and a local development formatter deserve different levels of scrutiny."
                ]
        },
        {
                "title": "Version constraints and reproducibility solve different problems",
                "paragraphs": [
                        "A requirement such as Django>=5.2,<6 expresses a compatibility range, not one installed build. A fully pinned resolved dependency set records exact versions selected in a tested environment, including transitives. Constraints do not guarantee the newest compatible version is safe for your application, and pinning permanently would prevent security and bug fixes.",
                        "Keep a clear distinction between the dependencies the application deliberately declares, the versions the installer resolved and the versions actually exercised by tests. Different Python versions or operating systems may select different wheels or conditional dependencies. Make environment and resolution assumptions explicit rather than treating pip freeze as a universal lockfile."
                ]
        },
        {
                "title": "Upgrade with evidence and a rollback path",
                "paragraphs": [
                        "Choose one important dependency. Read its release notes and documented compatibility requirements, update in an isolated environment, run pip check and then run the application's focused and integration tests. If a migration or API contract changes, verify that explicitly. A green pip check only says installed distribution metadata is consistent; it does not prove your Django views still work.",
                        "Record the previous version or resolution so you can reproduce the known-good environment if an update breaks behavior. Do not casually modify the shared/system Python or production dependency set while learning these steps."
                ]
        },
        {
                "title": "Do not make an internal package before it has a real consumer",
                "paragraphs": [
                        "An internal shared package creates a versioned contract and a release/upgrade obligation. One current module and a vague possibility of reuse do not justify creating steward-common or introducing an artifact repository. Keep a small capability local until multiple actual consumers need a stable interface and the coupling trade-off is understood.",
                        "Later TSA delivery work can teach publishing through an artifact repository when real reuse exists. Builder needs to recognize the engineering boundary and avoid prematurely adding infrastructure."
                ]
        },
        {
                "title": "Make one deliberate keep, replace or defer decision",
                "paragraphs": [
                        "Write down one actual direct package, why it exists, the tested version range, its criticality, which package APIs are imported and what check would detect a breaking upgrade. Then choose whether to keep it, replace it with already-supported capability or defer a speculative dependency. The decision should be grounded in an existing consumer, not a desire for an impressive dependency table.",
                        "If the dependency is not installed in your real project, do not list it as present. If no package is unjustified, a well-supported 'keep' decision is more useful than manufacturing unnecessary cleanup."
                ]
        }
],
        "Make a justified dependency decision using real installed metadata, declared requirements and testable upgrade expectations.",
        [
        "Identify one direct package in the earlier Django training project and inspect its purpose and actual imports.",
        "Using the active project environment, compare pip show Django and pip show asgiref; explain what is direct, what is transitive and which declaration controls each.",
        "Document one version constraint versus the exact resolved version from pip freeze, and explain their different responsibilities.",
        "Assess one real dependency for maintenance, license, advisories and compatibility. Make no claims about unsupported versions without checking the package's documented requirements.",
        "Choose keep, replace or defer and describe how to verify the decision with focused and integration tests after an update.",
        "Consider an internal reusable module only if there are multiple concrete consumers and a stable contract; do not create a package simply for the lesson."
],
        [
        "Why is a dependency an ongoing ownership decision?",
        "Why is it risky to rely directly on a transitive package without declaring it?",
        "What is the difference between version compatibility and a reproducible resolution?",
        "What does pip check miss about application behavior?",
        "When is internal-package extraction justified?"
],
        [{"title":"Python Packaging User Guide — Dependency specifiers","url":"https://packaging.python.org/en/latest/specifications/dependency-specifiers/"},{"title":"pip — User Guide","url":"https://pip.pypa.io/en/stable/user_guide/"}],
    ),
    lesson(
        "Configuration",
        "Configuration lets the same code run safely in different environments. The important boundary is between deploy-specific values and application behavior—not between 'things in a .env file' and everything else.",
        [
            { title: "Separate config from code", paragraphs: ["Database addresses, secrets, allowed hosts and log levels vary by deployment. Lifecycle rules such as which criticality values Steward accepts are domain behavior and should not become arbitrary environment variables merely because configuration is convenient.", "Validate required configuration at startup. Silent fallback to insecure or incorrect defaults turns deployment mistakes into runtime surprises."] },
            { title: "Secrets are configuration with stricter handling", paragraphs: ["Do not commit secrets, print them in diagnostics or expose them through API errors. Local .env files can be useful developer ergonomics, but production secret distribution is an operational concern that later TSA schools will deepen."], code: { language: "python", code: "SECRET_KEY = env.str(\"DJANGO_SECRET_KEY\")\nDEBUG = env.bool(\"DJANGO_DEBUG\", default=False)\nDATABASE_URL = env.str(\"DATABASE_URL\")", caption: "Deployment-specific values are external; safe defaults remain deliberate." } },
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
        "Static Analysis and Automated Feedback",
        "Formatting, linting, type checking and framework checks turn repeatable review rules into fast feedback. Their purpose is not to replace engineering judgment; it is to remove avoidable noise and catch classes of defects before a human reviewer spends attention on them.",
        [
            { title: "Different tools answer different questions", paragraphs: ["A formatter makes layout deterministic. A linter detects configured code patterns and possible defects. A static type checker reasons about declared types without executing ordinary runtime paths. Django's system checks validate framework configuration/model concerns. Tests execute behavior. One green tool does not imply the others are redundant." ] },
            { title: "Automate rules that are objective and repeatable", paragraphs: ["If every reviewer repeatedly comments on formatting/import order or a known unsafe pattern, encode that rule in tooling where practical. Keep configuration versioned with the repository so local and CI feedback agree. Avoid enabling hundreds of rules nobody understands and then suppressing them everywhere." ] },
            { title: "Warnings need an ownership policy", paragraphs: ["A warning baseline that only grows becomes background noise. New code should not casually add warnings; existing debt should be explicit and reduced deliberately. Suppress a diagnostic only when you can explain why it is false-positive or intentionally accepted, and keep the suppression as narrow as possible." ] },
            {"title":"Execute a syntax failure and prove what this static check cannot detect","paragraphs":["Python's ast parser can reject malformed code without running it; the deliberately malformed example below must fail at parse time. The second program parses successfully while its authorization predicate is wrong, demonstrating that syntax or type validity does not imply domain correctness. A linter might flag suspicious constructions; a static type checker with annotations would catch some type errors; neither can prove the app's Team ownership policy unless the rule is explicitly encoded in tests or a stronger analysis. Run this exact file to observe both outcomes.","For a real Steward repository, a useful local sequence is formatting check, linter, type checker if configured, `python manage.py check` and then tests. Version-pin tools and reproduce the same commands in CI. Record a negative example each tool actually catches rather than labeling every green output 'secure'."],"code":{"language":"python","caption":"Static analysis — parse error versus valid but wrong authorization","code":"import ast\n\ntry:\n    ast.parse('def check(:\\n  pass')\nexcept SyntaxError:\n    print('syntax defect detected')\nelse:\n    raise AssertionError('invalid source parsed')\n\nsource = 'def can_update(actor_team, owner_team):\\n    return True'\nmodule = ast.parse(source)\nassert isinstance(module, ast.Module)\nnamespace = {}\nexec(compile(module, '<demo>', 'exec'), namespace)\nassert namespace['can_update'](5, 8) is True\nprint('syntax valid; authorization policy still wrong')"}},
        ],
        "Create a fast, reproducible local quality-check command for Steward.",
        ["Inventory formatter, linter, type checker, Django checks and test commands already available.", "Add only missing high-value tooling that fits the current Python/Django project rather than collecting tools.", "Make one documented command or small sequence reproduce the expected local checks.", "Introduce one safe example defect and prove the appropriate tool catches it, then remove/fix it.", "Review any suppressions and justify one or remove it.", "Record which important defects these tools still cannot prove."],
        ["How does a linter differ from a formatter and type checker?", "Why should local and CI rules use the same configuration?", "Why can a completely green static-analysis run still contain business defects?"],
        [refactoringGuru],
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
        "Useful Logging",
        "Logs are operational evidence. A useful log helps an engineer reconstruct what the system did without exposing secrets or forcing them to read source code for every incident.",
        [
            { title: "Log events, not noise", paragraphs: ["Choose events that matter: authentication failure categories, denied service mutations, important lifecycle changes, dependency updates and unexpected exceptions. Include stable identifiers and context needed for correlation. Avoid logging every function entry or duplicating framework access logs without purpose.", "Levels communicate expected operational meaning. ERROR is not 'something happened'; DEBUG is not a dumping ground for sensitive request bodies."] },
            { title: "Structured context improves investigation", paragraphs: ["A consistent event name plus service_id, actor_id and request correlation data is easier to search than prose assembled differently in every call site. Never log passwords, raw tokens or secrets."], code: { language: "python", code: "logger.info(\n    \"service.lifecycle_changed\",\n    extra={\"service_id\": service.id, \"actor_id\": request.user.id, \"from_state\": old, \"to_state\": new},\n)", caption: "Capture operationally useful context without secrets." } },
            {"title":"Prove logs capture context but not credentials","paragraphs":["A log record needs an event name, a stable entity identifier and a request correlation value; it must not contain authentication material or full request bodies. The following Python standard-library example captures a log message to an in-memory stream so the learner can assert both positive and negative claims. It demonstrates a logging contract, not a full distributed tracing system. Access controls, retention, ingestion and cross-service correlation are later operational topics."],"code":{"language":"python","caption":"Logging — executable structured-context and secret absence test","code":"import io\nimport logging\n\nstream = io.StringIO()\nlogger = logging.getLogger('tsa.steward.demo')\nlogger.setLevel(logging.INFO)\nlogger.handlers.clear()\nhandler = logging.StreamHandler(stream)\nhandler.setFormatter(logging.Formatter('%(levelname)s %(message)s service=%(service_id)s request=%(request_id)s'))\nlogger.addHandler(handler)\nlogger.propagate = False\nsecret = 'demo-access-token-NEVER-LOG'\nlogger.info('service.lifecycle_changed', extra={'service_id': 42, 'request_id': 'req-demo-7'})\nrecord = stream.getvalue()\nassert 'service=42' in record and 'request=req-demo-7' in record\nassert secret not in record\nprint(record.strip())"}},
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
            { title: "Decision records preserve why", paragraphs: ["For a consequential architectural/engineering decision, a short ADR-style record can capture context, decision, alternatives/trade-offs and consequences. It should not document every trivial choice. The value is preserving why a future engineer encounters a constraint or dependency that otherwise looks arbitrary." ] },
            { title: "Runbooks and design docs serve different jobs", paragraphs: ["A README helps someone orient/run the repository; API/OpenAPI docs serve consumers; a decision record explains a durable choice; a runbook gives operators concrete diagnosis/recovery steps. Avoid duplicating the same mutable fact across all of them—link to a canonical source where possible." ] },
            {"title":"Turn documented setup into a verified precondition contract","paragraphs":["A useful README must name the interpreter, package installation command, required nonsecret variables, how the database is provisioned, migration state, the command to start the app, one working request and a negative request. A sentence 'install dependencies and start' is not operational documentation. The example below turns a small text checklist into an executable documentation-lint test. This does not actually provision PostgreSQL or execute the documented commands: those require a second integration test in a disposable environment.","For Steward specifically the README must link the canonical product spec, distinguish `tsa_steward_lab` (SQL teaching fixture) from `tsa_steward_django_lab` (Django-managed migrations), and warn that the Payroll fixture is intentionally not production-ready. An ADR should explain *why* the two DBs were separated rather than copying configuration literals across docs."],"code":{"language":"python","caption":"Documentation — executable setup instructions completeness gate","code":"required = {'python', 'postgresql', 'migrate', 'runserver', 'curl', 'authentication', 'authorization'}\nreadme = '''Python environment; PostgreSQL lab;\nrun python manage.py migrate, then python manage.py runserver;\ncurl GET /health/; authentication and authorization guide.'''\nmissing = sorted(item for item in required if item not in readme.lower())\nassert not missing, missing\nbroken = 'install and run as usual'\nassert any(item not in broken for item in required)\nprint('documentation checklist passed; vague instructions rejected')"}},
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
