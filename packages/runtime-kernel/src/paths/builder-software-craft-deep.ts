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
  "Managing Dependencies": { outcomes: ["Justify a dependency from real consumer needs.", "Review version compatibility and update risks.", "Recognize when a new shared package is premature."], practical: "Review an external or internal dependency" },
  "Configuration": { outcomes: ["Separate code from environment-owned settings.", "Validate types and fail visibly when required configuration is absent.", "Avoid exposing credentials through defaults or logs."], practical: "Prove configuration fails safely" },
  "Static Analysis and Automated Feedback": { outcomes: ["Distinguish formatting, linting, type checking and behavioral tests.", "Run the appropriate tool before committing.", "Treat warnings according to a documented policy rather than hiding them."], practical: "Make static checks actionable" },
  "Code Review and Technical Debt": { outcomes: ["Review risk, correctness and tests before style.", "Classify blocking defects versus optional improvements.", "Describe technical debt as an explicit cost rather than any imperfect code."], practical: "Review a change and classify findings" },
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
): Lesson {
    const id = `software-craft-${slug(title)}`;
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
        "Readable code minimizes the amount of hidden reconstruction a maintainer must perform. Names, structure and explicit domain language should help a reviewer understand what the code means before they have to simulate every line mentally.",
        [
            { title: "Name the domain", paragraphs: ["Prefer names such as owning_team, dependency_service and can_manage_service over generic names such as data, obj or check. Comments should explain non-obvious constraints or reasons, not translate syntax into English.", "Readable code is contextual. A clever one-liner can be shorter while making policy harder to review."] },
            { title: "Make policy visible", paragraphs: ["Steward authorization is easier to reason about when the policy reads like the domain instead of being scattered through nested boolean expressions."], code: { language: "python", code: "def can_manage_service(user, service) -> bool:\n    return Membership.objects.filter(\n        user=user,\n        team=service.owning_team,\n        role__in={\"maintainer\", \"owner\"},\n    ).exists()", caption: "Domain language makes an authorization rule reviewable." } },
            { title: "Cohesion asks whether code belongs together", paragraphs: ["A cohesive module/class/function groups behavior around one meaningful responsibility. A file that handles HTTP parsing, ownership policy, email delivery and report formatting has weak cohesion because unrelated reasons to change accumulate together. Splitting purely by line count does not improve cohesion." ] },
            { title: "Coupling asks what must move together", paragraphs: ["Coupling is dependency between parts. Some coupling is necessary: a Service policy must know relevant domain concepts. Accidental coupling appears when unrelated modules know framework internals, global mutable state or each other's private representation. Prefer narrow explicit contracts and dependency direction that keeps volatile infrastructure from contaminating stable domain rules." ] },
            { title: "Complexity should buy domain value", paragraphs: ["Deep nesting, long parameter lists, boolean flags that switch unrelated modes, duplicated conditionals and distant side effects are useful code-smell signals. A smell is evidence to investigate, not automatic proof that a class/extraction is required. Refactor when the structure creates real comprehension/change risk." ] },
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
            { title: "See the problem in one request path", paragraphs: ["Imagine one DRF serializer method that parses the request, checks whether the caller belongs to the owning Team, decides whether a lifecycle transition is valid, writes several models and formats an audit log. It may work today, but five different kinds of change now require editing the same unit.", "Separation of concerns starts by identifying those different reasons to change: HTTP/representation, authentication and authorization, domain policy, persistence and operational evidence are related parts of one request but they are not the same responsibility. Boundaries are useful when they make those responsibilities easier to change and verify independently; extra indirection without a distinct responsibility merely moves complexity around."] },
            { title: "A practical Steward boundary", paragraphs: ["A DRF view can coordinate request concerns, a permission can answer access policy, and domain/application code can enforce service-registration invariants. Database constraints remain the final integrity backstop where appropriate."] },
            { title: "Dependency direction matters", paragraphs: ["If core domain policy imports DRF request classes, ORM query details and logging configuration directly, changing infrastructure forces domain code to change. Prefer orchestration/infrastructure depending on stable application/domain contracts where practical. Dependency inversion means policy can depend on an abstraction/capability supplied from outside; it does not mean creating an interface for every function." ] },
            { title: "SOLID is a diagnostic vocabulary, not five mandatory patterns", paragraphs: ["Single Responsibility asks whether a unit has one coherent reason to change. Open/Closed encourages extension without repeatedly editing fragile condition chains when genuine variation exists. Liskov asks whether subtype substitution preserves caller expectations. Interface Segregation avoids forcing consumers to depend on operations they do not need. Dependency Inversion keeps high-level policy from being controlled by low-level details. Use these questions to diagnose pressure; do not manufacture inheritance/interfaces to claim compliance." ] },
            { title: "Composition often keeps variation explicit", paragraphs: ["When behavior can be supplied as a collaborator/policy, composition can avoid rigid inheritance trees and make dependencies visible. Inheritance is appropriate when there is a genuine substitutable is-a relationship and the base contract remains valid for subtypes—not merely to reuse a few methods." ] },
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
            { title: "Use named transformations instead of rewrite impulses", paragraphs: ["Common small refactorings include Rename, Extract Function, Extract Variable, Inline, Move Function, Introduce Parameter Object and Replace Conditional with Polymorphism when variation genuinely warrants it. Knowing the transformation helps keep each step behavior-preserving and reviewable rather than turning 'refactor' into an unbounded rewrite." ] },
            { title: "Characterization tests can protect unfamiliar legacy behavior", paragraphs: ["When existing behavior is poorly documented, first write tests that capture what the system currently does at the boundary you must change. These tests do not claim every existing behavior is desirable; they create a baseline so deliberate behavior changes can be separated from accidental ones." ] },
            { title: "Refactoring and feature changes should be separable in the diff", paragraphs: ["A preparatory refactor may make a feature safer, but reviewers should be able to identify structural changes versus changed behavior. Small commits or clearly separated patches reduce the number of hypotheses when a regression appears." ] },
            {"title":"Execute a before-and-after contract rather than trusting a prettier diff","paragraphs":["This pure-Python example intentionally changes the implementation while retaining behavior. We first state the domain contract: only matching Team identity grants update permission. A display name is not identity; two Teams could share a label in other models. The old expression and the extracted named predicate must produce exactly the same result for both authorized and unauthorized inputs. Run the assertions BEFORE and AFTER the structural change. When the tests change expected outcomes, that is a feature or policy change, not mere refactoring.","Characterization tests are narrow: these two cases do not prove every role or scope permutation in Steward. Later Quality Steward adds systematic test design; here the lesson is to prove the unchanged boundary of a refactor."],"code":{"language":"python","caption":"Refactoring — executable behavior-preservation check","code":"def old_policy(actor_team_id, owner_team_id):\n    return actor_team_id == owner_team_id\n\ndef is_same_team(actor_team_id, owner_team_id):\n    return actor_team_id == owner_team_id\n\ndef new_policy(actor_team_id, owner_team_id):\n    return is_same_team(actor_team_id, owner_team_id)\n\ncases = [(4, 4, True), (4, 7, False), (0, 7, False)]\nfor actor, owner, expected in cases:\n    assert old_policy(actor, owner) == expected\n    assert new_policy(actor, owner) == expected\nprint('refactor contracts preserved:', len(cases))"}},
        ],
        "Refactor one Steward hotspot while proving behavior remains stable.",
        ["Choose a concrete maintainability problem.", "Capture current happy and failure behavior with tests or reproducible requests.", "Perform the smallest structural improvement.", "Rerun the evidence after each meaningful step.", "Document the problem removed and any remaining debt."],
        ["How is refactoring different from adding a feature?", "Why should behavior checks exist first?", "When should a refactor stop?"],
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
        "Managing Dependencies",
        "Every dependency is code you choose to trust, update, distribute and support. Dependency management is therefore an engineering ownership decision, not just a package-install command.",
        [
            { title: "Know why a dependency exists", paragraphs: ["Prefer a dependency when it provides substantial, maintained capability that would be risky or wasteful to recreate. Avoid adding packages for trivial helpers or speculative future reuse. Distinguish direct dependencies from transitive ones and understand which public APIs your code actually relies on.", "Version constraints express compatibility policy. Locking and reproducible environments reduce accidental drift, but upgrades still require deliberate testing."] },
            { title: "Internal packages need real consumers", paragraphs: ["Do not extract steward-common merely to demonstrate modularity. A reusable package earns its boundary when multiple consumers need a stable capability with little domain coupling. Later TSA work will publish real internal artifacts through Nexus; Builder should avoid manufacturing fake reuse."], code: { language: "text", code: "application need → evaluate library → add direct dependency → lock/record version → test → maintain/upgrade\n\nreal repeated capability + multiple consumers → candidate internal package\none consumer + speculative reuse → keep local", caption: "Dependencies create continuing ownership." } },
            { title: "Evaluate more than package popularity", paragraphs: ["Before adopting a dependency, check maintenance activity, release/support expectations, license compatibility, security history/advisories, transitive footprint, platform/runtime compatibility and how difficult replacement would be. A dependency that owns a critical boundary deserves more scrutiny than a development-only formatter." ] },
            { title: "Pinning and upgrading solve different risks", paragraphs: ["Reproducible resolution protects builds from surprise drift; staying permanently pinned protects you from fixes as well. Define how dependency updates are proposed, tested and rolled out. Read release notes for important libraries instead of treating every version bump as equivalent." ] },
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
        "Code Review and Technical Debt",
        "Code review is risk analysis and shared understanding, not a style contest. Technical debt is a future change cost created by a current design or delivery choice; managing it means making that cost visible enough to decide when repayment is worthwhile.",
        [
            { title: "Review from behavior and risk inward", paragraphs: ["Start with the change's purpose and contract: what behavior changes, which invariants/security boundaries are touched, what data/migration/configuration consequences exist, and what evidence proves it. Then inspect implementation structure. A beautifully named function can still implement the wrong authorization rule." ] },
            { title: "Classify review feedback", paragraphs: ["Separate correctness/security blockers from maintainability concerns, questions and optional suggestions. Explain the consequence behind a requested change. 'I prefer this shape' is weaker than 'this duplicates ownership policy, so the two endpoints can diverge'." ] },
            { title: "Debt is not a synonym for defect or imperfection", paragraphs: ["A correctness or security defect that violates the required behavior should normally be treated as a defect, not relabeled as technical debt to make it optional. Likewise, code is not debt merely because a cleaner design exists. Technical debt is most useful as a concept when a current design or delivery choice creates a known future cost or risk that the team consciously carries.", "'This code is ugly' is therefore not a useful debt record. State the shortcut or constraint, evidence, expected future cost/risk, affected area and trigger for revisiting it. Some debt is rational when delivery value exceeds current repayment cost; accidental permanent ambiguity is not." ] },
            { title: "Repay debt when it intersects real work or risk", paragraphs: ["Prioritize debt that repeatedly slows changes, creates incidents/security risk, blocks required architecture or has increasing carrying cost. Avoid large cleanup projects whose benefit cannot be connected to actual work. The Boy Scout instinct is useful only when the nearby improvement is safe, scoped and owned." ] },
        ],
        "Review one real Steward diff and turn its findings into actionable engineering decisions.",
        ["Read the change goal and validation evidence before reviewing implementation.", "Inspect behavior/API, authorization/data integrity, migrations/configuration, tests, observability and maintainability in that order or another explicit risk order.", "Write at least one blocker-level finding if one genuinely exists, one question and one optional suggestion; do not manufacture severity.", "Identify one piece of technical debt in Steward and record consequence, evidence, affected area and revisit trigger.", "Decide whether to repay that debt now or defer it and defend the choice.", "Re-read the final diff after fixes as a complete change rather than only reviewing the edited lines."],
        ["What should a reviewer understand before debating implementation style?", "What makes review feedback actionable?", "When is technical debt rational?", "Why should a debt item include a revisit trigger?"],
        [refactoringGuru],
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
