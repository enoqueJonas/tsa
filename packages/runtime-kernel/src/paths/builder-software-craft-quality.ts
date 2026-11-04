import type { PracticalContent } from "../activities";
import type { Lesson } from "./lesson";
import { softwareCraftDeepLessons } from "./builder-software-craft-deep";

type PracticeSpec = Omit<PracticalContent, "type">;

const practices: Record<string, PracticeSpec> = {
    "software-craft-git-as-an-engineering-tool": {
        objective: "Make two reviewable local Git commits and explain working-tree, staged and committed content.",
        scenario: "You have not yet rehearsed Git's three local states. Use a disposable two-file repository first, so no Steward change or remote GitHub account is needed. Only transfer the workflow to the real project after the mechanics are understood.",
        instructions: [
            "Create tsa-git-review-lab from the exact commands in the reading. Confirm the first root commit, HEAD and a clean initial status.",
            "Make the documented README change and an unrelated personal-notes.txt file; inspect git status, git diff and git diff --cached before committing anything.",
            "Stage README.md alone and commit it; prove git show --name-only HEAD excludes the unrelated file.",
            "Use git log and git diff HEAD~1 HEAD to explain the two snapshots. Deliberately append a scratch line then safely restore only that line in the disposable repository.",
            "Document which commands alter the working tree, staging area or history, and distinguish local commits from pushing to a remote.",
            "Only after completing the scratch proof, apply the same staging/review discipline to one real Steward edit without mixing unrelated/generated work."
        ],
        deliverables: ["Two-commit disposable repository transcript", "Staged/unstaged/untracked classification", "Proof personal-notes.txt was excluded", "Safe restore evidence", "Optional Steward transfer review"],
        completionCriteria: ["A novice can reproduce every command in an empty local directory.", "The last commit contains README.md but not the untracked note.", "No unknown Steward file or remote is required to learn the Git mechanism.", "Restore was tested only on a deliberately disposable edit."]
    },
    "software-craft-investigate-bugs-with-git-history": {
        objective: "Use a deterministic test and git bisect to find the real first-bad commit in an isolated four-commit history.",
        scenario: "A small configuration was safe at limit=10, then a later commit accidentally changed it to limit=0. Construct the known-good and known-bad revisions rather than guessing commit hashes or running a bisect inside an active work repository.",
        instructions: [
            "Create tsa-git-bisect-lab from the reading's complete setup script and verify exactly four commits exist.",
            "Explain which commit should be the earliest failing revision before executing the regression test.",
            "Run the second source-published block in the same shell: bisect start with recorded GOOD/BAD revisions, bisect run with the deterministic grep predicate, bisect log and bisect reset.",
            "Capture the actual first-bad commit and show its config.txt change; explain why git blame alone would not prove that it caused a symptom.",
            "After git bisect reset, verify HEAD is back on main and the work tree contains the last documentation commit.",
            "Name one unsafe or flaky test case that should not be used to automate a bisect against real Steward data."
        ],
        deliverables: ["Four-commit local history and recorded good/bad revisions", "First-bad bisect output and inspected diff", "Restored branch state", "Unreliable/unsafe test warning"],
        completionCriteria: ["The actual defect commit, not the final documentation commit, is identified.", "The test returns zero for good and nonzero for bad revisions.", "The working tree and branch are restored after investigation.", "No production environment or unknown commit placeholder is required."]
    },
    "software-craft-branching-and-collaboration": {
        objective: "Build, compare, integrate and retire a local Git feature branch before assuming remote pull requests.",
        scenario: "You have already learned to commit locally. Now practise creating a focused feature branch and reviewing its changes in tsa-git-branch-lab, without touching the continuing Steward project or requiring a GitHub account.",
        instructions: [
            "Run the source-published Branch lab setup to create the initial main commit and one feature/add-note commit. Verify git branch --show-current.",
            "Before merging, inspect main...feature/add-note and state which file the change proposes to add.",
            "Run the merge block and show the new file on main, the two-parent merge commit and a clean Git status.",
            "List merged branches and delete only the integrated local feature branch using git branch -d.",
            "Write a concise PR-style summary of this exact change and compare an explicit merge, squash and rebase based on how they affect history.",
            "Explain how you would move the practice into a real Steward branch without force-pushing shared work or including generated files."
        ],
        deliverables: ["Two-branch local history transcript", "Pre-merge three-dot comparison", "Successful no-fast-forward merge and retained README", "Safe local branch deletion", "Review-summary and merge-strategy decision"],
        completionCriteria: ["Every command executes in a fresh local repository.", "The feature commit is preserved and main contains the merged change.", "A learner can explain the difference between local branches, commits and a remote PR.", "No unknown files, force pushes or external approvals are prerequisites."]
    },
    "software-craft-resolve-a-merge-conflict": {
        objective: "Reproduce an actual conflicting edit, resolve it against a stated requirement and verify Git and application-visible content.",
        scenario: "A greeting configuration is changed independently on main and a feature branch. The correct requirement is Portuguese by default with French fallback; Git cannot decide this from two competing edits.",
        instructions: [
            "Create tsa-git-conflict-lab with the published exact setup block. Confirm that Git reports EXPECTED_CONFLICT and that greeting.txt contains both branch versions with conflict markers.",
            "Identify the common ancestor, current main change and feature change, then explain why choosing HEAD or the other side mechanically is insufficient.",
            "Apply the published resolution with greeting=ola and fallback=bonjour. Stage and commit the merge.",
            "Verify both expected keys, zero conflict markers, a clean working tree and the actual merge history.",
            "Describe a Steward migration or API change that could merge cleanly at the text level while breaking product behavior, and specify the additional check you would run.",
            "State when a developer should stop and seek a product decision instead of guessing at conflict resolution."
        ],
        deliverables: ["Recorded intentional conflict and both contributions", "Requirement-grounded resolution", "Merge history and clean-status proof", "Semantic-compatibility check plan"],
        completionCriteria: ["The conflict is reproduced, not narrated.", "Both required greeting values exist in the resolved file.", "The merge is committed without markers or unintended file changes.", "The learner distinguishes textual conflict from semantic compatibility."]
    },
    "software-craft-readable-code": {
        objective: "Make a precise authorization rule easier to understand while preserving its existing allowed and denied cases.",
        scenario: "The learner knows what a Team and Membership are from Identity, but should first learn readability through an ordinary Python predicate. Only then translate the exact rule into the Django-backed Steward model. The actual roles are viewer and maintainer; a role named owner does not exist in the teaching model.",
        instructions: [
            "Write the rule before coding: a maintainer membership for the Service's owning Team is required to manage it.",
            "Save and run the source-published independent pure-Python example. Explain the approved maintainer, denied same-Team viewer and denied other-Team membership cases.",
            "Compare old_check with has_maintainer_membership and can_manage_service. Identify what the improved names clarify and which outputs remain unchanged.",
            "Run the published Django policy in the existing tsa_steward_django_lab after the Identity membership seed; verify an allowed maintainer and distinct denied viewer, cross-Team and inactive cases.",
            "Check the actual Membership.Role choices instead of inventing a role; prove the test script restores the originally assigned role and account state.",
            "Apply one small readability improvement to an unrelated Steward code path, rerun its existing positive/negative tests and state one unnecessary extraction you rejected."
        ],
        deliverables: ["Three-case standalone Python output", "Before/after readability rationale", "Four real Django membership decisions", "State-restoration evidence", "Optional focused Steward refactor"],
        completionCriteria: ["The beginner experiment is independently runnable without Django.", "Django authorization uses the real Membership.Role.MAINTAINER value.", "Viewer, cross-Team and inactive denials are distinct and proved against the database.", "No role is introduced in the example without a corresponding model change.", "A readability change is not mistaken for a permission-policy change."]
    },
    "software-craft-separation-of-concerns": {
        objective: "Prove why request parsing, permission, domain mutation and response formatting deserve distinct boundaries.",
        scenario: "A small library checkout currently handles four separate concerns in one function. Before refactoring a real Steward endpoint, learn the boundaries from a complete executable pure-Python example with five observable responses.",
        instructions: [
            "Save the source-published separation_lab.py code and run it with python3. Verify the 200, 400, 403, 404 and 409 cases, including identical before/after availability state.",
            "Identify input validation, current member authorization, book lookup/availability, state change and response formatting inside old_checkout.",
            "Inspect the extracted functions parse_request, member_can_borrow, borrow_book and response. Explain what each owns and how new_checkout orchestrates them.",
            "Deliberately replace member_can_borrow with bool(members), show that the unauthorized-member case fails, then restore the correct check and rerun all five cases.",
            "State why the sample is not a real network server, database, transaction or production-ready authorization solution.",
            "Only after the independent example, locate one actual Steward write request and separate one misplaced concern while preserving its real positive and negative behavior."
        ],
        deliverables: ["Five-case source-script output", "Before/after responsibility map", "Failing permission mutant and corrected rerun", "Limits of the Python simulation", "Optional focused Steward change with behavior evidence"],
        completionCriteria: ["All five cases execute without any assumed Steward files or Django setup.", "The authorization check uses the actual requesting member rather than membership-list existence.", "A refactor preserves response codes and state changes.", "No needless class, framework, transaction or remote dependency is introduced.", "Later Steward transfer is clearly distinguished from the mechanism exercise."]
    },
    "software-craft-refactoring": {
        objective: "Perform a controlled Extract Function refactor that demonstrably preserves public behavior and detects a deliberate regression.",
        scenario: "An online store refund rule is embedded in one function. Learn the refactoring mechanics on two complete stand-alone Python programs with six positive, negative, boundary and state-effect cases. Transfer the method to Steward only after the exercise runs without assumed infrastructure.",
        instructions: [
            "Save the source-published first script as refund_before.py and execute python3 refund_before.py; record all six baseline contract results and the original order state in each case.",
            "Save the second script as refund_after.py and run it independently. Identify the extracted refund_rejection_reason responsibility and unchanged request_refund entry point.",
            "Compare outcome codes, denial priority (already_refunded first), exact 30-day boundary and refunded state for every input.",
            "Change the after script's > 30 condition to >= 30 as a controlled defect; show the boundary assertion fails. Revert that one operator and confirm all six tests pass again.",
            "Explain why this extraction is a structural refactor, while extending the window to 45 days would be a separate product change.",
            "Only then find a concrete Steward hotspot, capture its existing positive and negative behavior, make one named transformation and rerun the same behavioral checks. Stop when the named maintainability problem is resolved."
        ],
        deliverables: ["Six-case before transcript", "Identical six-case after transcript", "Fail-then-fix boundary evidence", "Before/after responsibility map", "Optional narrow Steward transfer and stopping decision"],
        completionCriteria: ["Both programs run from an empty scratch directory without Django or Steward.", "The public function, responses and state changes are equivalent across all six cases.", "An intentional boundary defect is genuinely rejected, not merely described.", "A feature change is not concealed inside the refactoring diff.", "The learner can explain which abstraction was useful and why additional layers were rejected."]
    },
    "software-craft-testing-as-a-change-safety-net": {
        objective: "Build a small Steward safety net that proves a refactor preserves behavior and that a regression test can detect a real defect.",
        scenario: "A maintainability change is justified, but 'the endpoint still looks fine' is not sufficient evidence. Establish focused automated checks before changing structure, then use the same checks to prove the refactor did not alter the contract.",
        instructions: [
            "Choose one real Steward behavior and state the observable contract in domain language before writing assertions.",
            "Choose the narrowest honest test boundary: pure domain logic, database behavior or HTTP/API behavior; explain why a narrower boundary would not prove enough.",
            "Write one positive case and one meaningful negative case using clear arrange-act-assert structure.",
            "Run the tests against the current implementation and preserve the green baseline.",
            "Perform one small behavior-preserving refactor and rerun the same focused tests.",
            "Reproduce one known defect or create a disposable controlled defect; demonstrate that a regression test fails for the expected reason before the fix and passes after the fix.",
            "Review assertions and remove any that couple the test to private helper structure without protecting observable behavior.", "If the behavior crosses an external/slow collaborator, choose deliberately among real collaborator, stub, fake or mock/spy and explain why; inject the collaborator through the smallest useful boundary.",
            "Record which important behavior remains uncovered and why adding more tests is or is not justified now."
        ],
        deliverables: ["Behavior contract and boundary choice", "Positive/negative automated tests", "Pre/post-refactor test evidence", "Fail-before-fix regression evidence", "Coverage limitation note"],
        completionCriteria: ["The tests protect observable Steward behavior rather than private implementation trivia.", "The same safety net remains green across a structural refactor.", "At least one regression check is proven capable of failing.", "The learner can explain why each chosen test boundary is appropriate.", "Testing depth remains Builder-sized rather than becoming a premature automation framework."]
    },
    "software-craft-managing-dependencies": {
        objective: "Audit Steward's dependency ownership and make one evidence-based keep, remove or reuse decision.",
        scenario: "Steward has accumulated packages across Builder. Before later CI, artifact-repository and supply-chain work, the team needs to know which dependencies are intentional and whether any code truly deserves an internal-package boundary.",
        instructions: [
            "List direct runtime/development dependencies and record the concrete capability each provides.",
            "Choose one transitive dependency and prove whether Steward code imports or relies on it directly.",
            "Find one dependency that can plausibly be removed, replaced by the standard library/framework, or retained; test the decision rather than arguing from preference.",
            "Inspect current reusable-code candidates and identify whether there is more than one real consumer with a stable boundary.",
            "For one important dependency, inspect maintenance/release expectations, license/security/compatibility signals and transitive footprint, then define version/upgrade validation expectations.",
            "Write a short decision separating external dependency ownership, local application code and a genuinely justified future internal package."
        ],
        deliverables: ["Dependency ownership table", "Transitive-dependency evidence", "One keep/remove decision with validation", "Internal-package boundary assessment"],
        completionCriteria: ["Every examined direct dependency has a known reason to exist.", "No transitive package is treated as an accidental public API.", "The internal-package decision is based on real consumers rather than curriculum pressure.", "Upgrade ownership is explicit."]
    },
    "software-craft-configuration": {
        objective: "Define Steward's configuration contract and prove that configuration mistakes fail visibly and safely.",
        scenario: "Steward works on one developer machine because settings, secrets and domain choices have been mixed together. Before delivery automation begins, another engineer must be able to tell which values vary by deployment and which rules belong in code.",
        instructions: [
            "Inventory current settings and classify each as secret, deployment-specific configuration, safe default or domain behavior.",
            "Move one inappropriate hard-coded deployment value out of code if such a case exists.",
            "Choose one required variable and make startup fail clearly when it is missing.",
            "Demonstrate the failure and confirm the diagnostic does not print the secret value.",
            "Parse at least one non-string setting into a validated typed value at startup and demonstrate invalid input failure.", "Document local-development defaults separately from production requirements and state configuration-source precedence where multiple sources exist.",
            "Identify one tempting environment variable that should remain domain policy in code and explain why."
        ],
        deliverables: ["Configuration classification", "Validated configuration change", "Safe startup-failure evidence", "Configuration contract documentation"],
        completionCriteria: ["Deployment config and domain behavior are not conflated.", "Required configuration fails fast.", "Secret values do not leak through diagnostics.", "Another engineer can understand what must be supplied in each environment."]
    },
    "software-craft-static-analysis-and-automated-feedback": {
        objective: "Make Steward's repeatable code-quality rules executable and prove what each tool can and cannot detect.",
        scenario: "Reviewers are spending time on deterministic formatting/static issues while subtle business defects still require tests and judgment. Establish a small local feedback gate without pretending tooling proves correctness.",
        instructions: [
            "Inventory the repository's formatter, linter, type checker, Django system-check and test commands and state the question each answers.",
            "Add only a missing high-value tool/configuration if the current project has a concrete gap.",
            "Create one documented local quality command/sequence using repository-versioned configuration.",
            "Introduce one disposable formatting/lint/type/configuration defect and prove the appropriate tool catches it, then fix it.",
            "Inspect warnings/suppressions and justify or remove one rather than normalizing noise.",
            "List two important Steward defects that could still survive all static checks."
        ],
        deliverables: ["Tool-purpose map", "Reproducible local quality gate", "Catch-and-fix evidence", "Static-analysis limitation note"],
        completionCriteria: ["Tools have distinct understood responsibilities.", "The feedback gate is reproducible.", "Warnings are not ignored by habit.", "The learner does not confuse static cleanliness with behavioral correctness."]
    },
    "software-craft-code-review-and-technical-debt": {
        objective: "Review a concrete patch against its permissions contract, demonstrate the leak and verify the corrected version.",
        scenario: "A new requirement hides archived invoices, but the candidate patch accidentally removes the existing customer-ownership restriction. Practise identifying and proving this defect in complete, disposable Python scripts before assuming a Steward pull request is available.",
        instructions: [
            "Write the two required conditions: only invoices owned by the trusted customer and no archived invoices.",
            "Inspect the reading's diff. Identify the permission guarantee that disappears, not just the newly added archive filter.",
            "Run invoice_review_candidate.py from the source-published example. Observe the expected failing assertion that exposes customer 22's invoice INV-200 to customer 11.",
            "Write a blocker comment grounded in that concrete data exposure, with a requested ownership fix and cross-customer negative test. Distinguish one product clarification and one optional style suggestion.",
            "Run invoice_review_fixed.py; verify the three customers' expected results and the absence of cross-customer rows.",
            "Re-review the final change and explain what an actual authenticated endpoint would additionally need to prove; optionally transfer to a real Steward diff if one exists."
        ],
        deliverables: ["Requirements and patch-risk note", "Expected unsafe-candidate failure", "Actionable blocker plus nonblocker classifications", "Passing corrected-candidate evidence", "Final-review and trusted-identity limitations"],
        completionCriteria: ["The initial review uses runnable code rather than an unspecified Steward PR.", "The failure identifies the exact foreign invoice.", "The correction preserves both ownership and archive conditions across positive and negative cases.", "Review severity is tied to impact, not style.", "An authentic API-level security result is not inferred from a Python list."]
    },
    "software-craft-managing-technical-debt": {
        objective: "Distinguish an existing defect from a maintenance shortcut and record a rational debt decision with evidence and an observable trigger.",
        scenario: "Two working CSV importers duplicate date parsing. A third importer may be needed, but no current incorrect date result has been observed. Decide whether sharing a parser now reduces future cost or prematurely couples evolving formats.",
        instructions: [
            "Explain why the previous invoice leak is a must-fix defect and cannot become optional merely by recording it as debt.",
            "Inspect the fictional duplicate parser scenario and list only the evidence given: two working consumers, repeated coordinated edits, and potential new usage. Leave unknown costs unmeasured.",
            "Write a debt record with current contract, shortcut, evidence, future risk, affected module, options, decision, owner, trigger and tests required before repayment.",
            "Compare consolidating today with deferring until a third importer or repeated divergence; justify your chosen trade-off.",
            "Change the scenario so an importer already produces incorrect dates. Reclassify the issue as a defect and state the immediate validation needed.",
            "Optionally examine a real Steward trade-off after this standalone exercise; create no invented debt ticket if evidence is missing."
        ],
        deliverables: ["Defect-versus-debt classification", "Evidence-based debt record", "Repay/defer rationale", "Named owner and observable revisit trigger", "Reclassification when current behavior fails"],
        completionCriteria: ["Technical debt is not used to excuse a current correctness or security failure.", "The record distinguishes observed evidence from speculation.", "The decision can be reviewed without oral context.", "A trigger determines when to revisit; 'later' alone is not enough.", "No unverified Steward backlog item is invented."]
    },
    "software-craft-useful-logging": {
        objective: "Design logs that let an engineer reconstruct one important Steward operation without exposing sensitive data.",
        scenario: "A service ownership or lifecycle change is disputed after the fact. Existing logs either say too little to investigate or dump noisy request data. Create a small logging contract that provides evidence another engineer could actually use.",
        instructions: [
            "Choose one important domain operation and one denied/failure path.",
            "Define the questions an investigator should be able to answer from logs before writing log statements.",
            "Add stable event names and the minimum useful identifiers/context at appropriate levels.",
            "Exercise both paths and search the output using the identifiers you chose.",
            "Explicitly inspect output for passwords, JWTs, cookies, secrets, sensitive headers or unnecessary request bodies.",
            "Remove one noisy or duplicate log if it adds no investigative value."
        ],
        deliverables: ["Logging questions/contract", "Success and failure log evidence", "Secret-leakage check", "Noise-removal note"],
        completionCriteria: ["The operation can be reconstructed from stable context.", "Log levels match operational meaning.", "Sensitive values are absent.", "The logging change improves signal rather than just increasing volume."]
    },
    "software-craft-technical-documentation": {
        objective: "Make Steward runnable and understandable by an engineer who did not participate in its development.",
        scenario: "You hand the repository to a teammate who knows Django but has none of your TSA history. They have 30 minutes to understand the product, configure it, migrate the database and make one useful request without asking you for missing steps.",
        instructions: [
            "Start from the current documentation and list every piece of private knowledge you would currently need to supply verbally.",
            "Rewrite the setup path from clone to environment configuration, database migration and first useful request using concrete commands.",
            "Describe Steward's domain at the level needed to understand Team, Service, Environment, dependency and review relationships.",
            "Link to the generated OpenAPI/schema instead of manually duplicating the entire API contract.",
            "Add one ADR-style decision/rationale note (context, decision, alternatives/consequences) and one known limitation or next-stage concern.", "State which information belongs in README, generated API docs, decision record or future runbook so mutable facts are not duplicated blindly.",
            "Walk the instructions from a clean checkout or have another engineer simulate them; record every step that proved ambiguous or false and correct it."
        ],
        deliverables: ["Updated runnable setup documentation", "Domain orientation section", "Decision/limitation note", "Documentation verification evidence"],
        completionCriteria: ["The setup is executable rather than aspirational.", "The reader can understand the core Steward domain without chat history.", "Documentation does not duplicate generated contracts unnecessarily.", "At least one documentation claim has been tested against reality."]
    },
    "software-craft-designing-errors": {
        objective: "Turn inconsistent Steward failures into an API error contract that tells clients what action is possible without leaking internals.",
        scenario: "Different endpoints return unrelated shapes for invalid data, conflicts, forbidden actions and unexpected exceptions. A client team cannot reliably decide whether to correct input, request access, retry or escalate.",
        instructions: [
            "Create a failure matrix for validation, unauthenticated, forbidden, not found, conflict and unexpected server failure.",
            "Trigger each case and record current status, body shape and whether the response exposes implementation details.",
            "Choose one inconsistent case and map it to a stable error code/message/details structure compatible with the rest of Steward.",
            "Keep detailed exception evidence in controlled logs while removing SQL/stack/token internals from the public response.",
            "Write the client action expected for each failure category: fix input, authenticate, request permission, stop retrying, retry later or escalate.",
            "Re-run the negative cases and preserve before/after evidence."
        ],
        deliverables: ["Failure matrix", "One improved public error mapping", "Leakage check", "Client-action contract"],
        completionCriteria: ["Failure categories carry distinct actionable meaning.", "Public errors are stable enough for clients to reason about.", "Internal exception detail is not exposed.", "The changed case is demonstrated with negative evidence."]
    },
    "software-craft-performance-awareness": {
        objective: "Perform one restrained Steward performance review and decide whether optimization is justified at all.",
        scenario: "A teammate says the service list 'feels slow' and proposes adding caching and indexes everywhere. Before later System Thinker work introduces Redis, you must determine whether there is a measured application/database problem and choose the smallest useful response.",
        instructions: [
            "Choose one realistic endpoint and define a representative dataset plus one measurable baseline such as query count, latency or transferred rows.",
            "Capture the baseline and identify where work occurs: database queries, serialization, Python logic or external boundary.",
            "Form one hypothesis using evidence from query logs, EXPLAIN or request timing.",
            "Apply at most one change if the evidence justifies it; otherwise document why no optimization should be made.",
            "Re-measure under the same conditions and record both improvement and complexity cost.",
            "State explicitly whether this problem justifies a future cache. If not, preserve that decision so Redis is not introduced speculatively."
        ],
        deliverables: ["Performance baseline", "Evidence-backed hypothesis", "Before/after comparison or no-change decision", "Future-cache justification decision"],
        completionCriteria: ["The investigation starts from a measurable symptom.", "Optimization is not performed by intuition.", "The final decision includes maintenance/complexity cost.", "Redis or other infrastructure is not proposed without a demonstrated need."]
    }
};

export const softwareCraftQualityLessons: Lesson[] = softwareCraftDeepLessons.map((lesson) => {
    const practice = practices[lesson.id];
    if (!practice) return lesson;

    return {
        ...lesson,
        activities: lesson.activities.map((activity) => {
            if (activity.content.type !== "practical") return activity;
            return {
                ...activity,
                content: { type: "practical", ...practice },
            };
        }),
    };
});
