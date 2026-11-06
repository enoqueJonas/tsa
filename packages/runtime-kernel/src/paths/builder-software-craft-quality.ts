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
    "software-craft-write-your-first-automated-tests": {
        objective: "Write real automated tests, run them and prove that a membership regression fails.",
        scenario: "You have just learned the idea of a test, but not Django fixtures or mocking. Use the published ordinary-Python borrowing function and unittest suite before opening the Steward project.",
        instructions: [
            "Save the complete reading example as test_borrowing.py and execute python3 -m unittest -v test_borrowing.py.",
            "Identify the arrange, act and assert stages of each test and state the behavior each protects.",
            "Change the original member-specific condition to bool(allowed_members); rerun without changing assertions and record the failed unauthorized-member case.",
            "Restore member_id in allowed_members and rerun to show all three tests pass.",
            "Identify a database or HTTP claim that these isolated function tests cannot prove; explain which new boundary you would need."
        ],
        deliverables: ["Three passing tests from a clean local script", "One deliberate red test with explanation", "Restored green test run", "Boundary limitation note"],
        completionCriteria: ["No Steward repository, Django fixture or external dependency is assumed.", "The unauthorized member test actually fails on the deliberately weakened policy.", "Assertions are not changed to make an incorrect implementation pass.", "The learner explains the difference between evidence for a pure function and evidence for a real API."]
    },
    "software-craft-testing-as-a-change-safety-net": {
        objective: "Protect a side-effecting operation with real tests, then explain what database and HTTP evidence must add.",
        scenario: "An order-completion function sends a notification once. Before making Steward-specific tests, use a fake notifier to verify success, denied/no-mutation and repeated-request behavior locally.",
        instructions: [
            "Save the published test_order_completion.py and execute python3 -m unittest -v test_order_completion.py.",
            "Explain what FakeNotifier observes and why no real network or email provider is contacted.",
            "Remove the already_completed guard, rerun and capture the duplicate-notification assertion failure; restore the guard and rerun all tests.",
            "Make one small readability refactor while keeping the same result/state/notification assertions green.",
            "Distinguish what a pure test, a PostgreSQL transaction/constraint test and an authenticated DRF HTTP test can independently establish.",
            "Transfer to one actual Steward path only after its real route, fixture and model relationships exist; verify negative HTTP response plus unchanged database state."
        ],
        deliverables: ["Three-case notification test output", "Fail-before-fix repeated-call proof", "Behavior-preserving refactor evidence", "Test boundary decision", "Optional Steward transfer"],
        completionCriteria: ["The published code is executable without undefined api_client, user_a or service_b.", "A repeated request is shown not to send a duplicate notification.", "Mutation of the guard fails a test; the corrected script passes.", "The example does not claim to guarantee atomic notification delivery or real HTTP authorization."]
    },
    "software-craft-understand-python-packages-and-dependencies": {
        objective: "Inspect one Python interpreter and its installed distributions without confusing imports with declared application dependencies.",
        scenario: "An engineer can import a standard-library module but gets ModuleNotFoundError for an unfamiliar package. Before installing anything into Steward, diagnose the active interpreter, installed distributions and project's declarations in a scratch virtual environment.",
        instructions: [
            "Create a disposable virtual environment, activate it, and print sys.executable before using pip.",
            "Save the complete source-published inspect_packages.py example and run it. Explain json, the optional pip distribution metadata and the deliberately missing import.",
            "Run python -m pip --version, python -m pip list and python -m pip check; write down what each output proves and does not prove.",
            "Save and run the source-published pyproject.toml reader using tomllib in Python 3.11+. Distinguish runtime and optional development dependencies and explain why version ranges are not installed versions.",
            "Write a no-guesswork diagnosis for a missing third-party import that checks interpreter, import/distribution names and project manifest before any installation.",
            "Find one import in the real Steward project and identify its supplying distribution without altering the application environment."
        ],
        deliverables: ["Scratch interpreter/pip evidence", "Executed module/distribution inspection", "Runtime versus optional declaration evidence", "Missing-import troubleshooting steps"],
        completionCriteria: ["No network, Docker, Steward database or global sudo installation is required.", "The learner can distinguish a module, import package and installable distribution.", "Installed-package listings are not misrepresented as direct requirements.", "A version range is not confused with a resolved version."]
    },
    "software-craft-managing-dependencies": {
        objective: "Make an evidence-backed keep, remove or upgrade decision for one declared Steward dependency.",
        scenario: "After learning how Python imports and distribution metadata work, inspect the project's actual declared dependencies. Do not invent installed versions or a speculative internal shared package merely to fulfil the curriculum.",
        instructions: [
            "Run the source-exact Python 3.11+ AST/tomllib example offline and capture the undeclared rich detection, manifest repair, and rejected PyYAML removal labels; explain why import yaml and distribution PyYAML are different strings.",
            "Change the toy manifest to remove the declared httpx dependency, rerun and prove the checker reports httpx as a missing direct declaration without actually importing or installing it.",
            "Identify direct runtime and development requirements from the current manifest, not just the output of pip list.",
            "Trace one actual transitive distribution and state whether application code imports it directly. If it does, propose declaring it explicitly.",
            "For one candidate library, compare the standard library/framework alternatives, supported versions, license, maintenance, advisories, transitive footprint and replacement costs.",
            "Define permitted version range versus exact reproducible environment; assess a proposed upgrade in a disposable installation or branch and rerun the affected tests.",
            "Check whether any proposed internal package has more than one real consumer and an agreed contract. If not, document a decision to keep that behavior local.",
            "Record your final keep/remove/upgrade decision with validation evidence, owner and a future revisit trigger."
        ],
        deliverables: ["Offline three-outcome source/manifest experiment and removal negative", "Direct versus transitive dependency table", "One candidate and alternatives evaluation", "Safe upgrade/removal validation", "Internal-package boundary assessment"],
        completionCriteria: ["The source-derived manifest gap and intentional removal regression execute with the expected outcomes, without contacting a package registry.", "Decisions are grounded in actually declared project requirements and consumers.", "One fresh/resolved installation path and test outcome are distinguished from an arbitrary pip freeze.", "A green dependency check is not misrepresented as a security audit.", "No publication or package-sharing infrastructure is invented as a prerequisite."]
    },
    "software-craft-read-environment-variables-in-python": {
        objective: "Observe how a terminal supplies string environment values to Python, including missing, accepted and rejected settings.",
        scenario: "Before Django configuration is taught, work in a scratch folder with ordinary Python and the shell. Do not use a mystery env object, a .env loader, actual database credentials or a running Steward application.",
        instructions: [
            "Save environment_lab.py from the reading and run it without TSA_EXAMPLE_MODE; expect Process setting: not set.",
            "Run TSA_EXAMPLE_MODE=training python3 environment_lab.py and confirm the accepted value.",
            "Run TSA_EXAMPLE_MODE=unexpected python3 environment_lab.py; record the expected nonzero exit and specific ValueError, then restore a successful run.",
            "Explain the difference between a shell assignment, export, a one-command prefix and a .env file, and state which syntax is POSIX-specific.",
            "Show why bool('false') evaluates to True; classify a required secret/configuration value versus an optional setting without printing real credentials."
        ],
        deliverables: ["Three terminal runs with expected outputs", "Shell-to-Python explanation", "String parsing negative case", "No-secret-handling note"],
        completionCriteria: ["No Django, third-party parser or preexisting Steward file is required.", "The invalid case fails for the intended reason.", "The learner distinguishes a .env file from inherited process environment.", "Real secret values are never published."]
    },
    "software-craft-configuration": {
        objective: "Validate application configuration without hiding errors or confusing deployment values with domain rules.",
        scenario: "The learner now understands environment variables. The existing Steward application's configuration must reject a missing database URL and invalid DEBUG text while preserving safe defaults and never logging secrets.",
        instructions: [
            "First rerun the preceding environment_lab.py; confirm Python receives string values from the process.",
            "Run the published Configuration fail-closed parser example with simulated mappings; verify missing, invalid and valid cases.",
            "Explain which configuration values are deployment-owned and why core Service lifecycle/authorization rules are not arbitrary environment switches.",
            "Identify one actual configuration boundary in the training Django project, verify it checks required values and converts flags explicitly, and record the chosen precedence.",
            "Trigger one missing required value only in an isolated lab and prove the application refuses startup without printing the actual secret or connecting to the wrong database.",
            "Document the expected setup and diagnostic action another learner can follow."
        ],
        deliverables: ["Three-case parser evidence", "Deployment/domain setting classification", "Required and optional setting policy", "Safe negative startup behavior in a disposable project"],
        completionCriteria: ["The independent parser runs without an undefined env dependency.", "A missing database setting does not silently fall back.", "Text false is parsed as False rather than bool('false').", "No real secret appears in logs or diagnostics.", "Steward transfer follows the self-contained fundamentals rather than replacing them."]
    },
    "software-craft-check-python-code-before-running-it": {
        objective: "Prove the difference between a Python source compilation error and a correct-syntax, wrong-behavior function.",
        scenario: "A novice must inspect what Python can reject before installing linters, formatters or type-checking tools. Use a disposable syntax example, not a live Steward project.",
        instructions: [
            "Save the reading's complete syntax_check_lab.py example and execute it with the current Python interpreter.",
            "Observe valid source compilation and the intentionally rejected SyntaxError, identifying the nonzero result and filename.",
            "Explain why the third expected line reports a business-rule defect even though the source compiles.",
            "Modify the example deliberately so its cross-team permission becomes correct; demonstrate how the original expected-unsafe assertion needs to change as well, then restore the published example.",
            "Create one new tiny invalid Python file and use python -m py_compile to reproduce the syntax diagnostic without running its business logic.",
            "Record what syntax checks cannot prove about imports, runtime behavior or protected API operations."
        ],
        deliverables: ["Source-extracted compilation transcript", "Observed SyntaxError and valid-result distinction", "Written source-versus-business verification limits"],
        completionCriteria: ["The exercise runs with Python standard library alone.", "No external linter, network access, Django fixture or Steward credentials is assumed.", "The learner can state why passing py_compile is not evidence of authorization correctness."]
    },
    "software-craft-static-analysis-and-automated-feedback": {
        objective: "Build a reproducible, bounded set of quality checks and demonstrate their different detection limits.",
        scenario: "The learner already knows how to compile source and write a failing behavioral test. Now inspect which formatter, linter, type checker and Django checks the current project has actually declared before invoking them.",
        instructions: [
            "Inventory the active interpreter and the actual project's versioned development tools; do not claim Ruff, mypy or Black is installed without evidence.",
            "Classify concrete examples as formatting differences, lint diagnostics, type errors, Django configuration issues or failing behavior tests.",
            "In a disposable environment, run the existing configured linter/formatter or deliberately install an approved tool. Produce one safe unused-import/formatting failure followed by a corrected rerun.",
            "Execute the source-published AST demonstration and explain why a syntactically valid authorization function remains unsafe.",
            "Write a denied cross-Team behavior test, prove it fails against the intentionally wrong function, then make a small correction and rerun.",
            "Record an exact local check sequence using the team's actual tool configuration and explain what each check does not prove.",
            "Document any warnings and justify narrow suppressions instead of broadly ignoring them."
        ],
        deliverables: ["Tool inventory and responsibilities", "Observed static diagnostic and corrected rerun", "Negative behavior test", "Reproducible local checks with limitations"],
        completionCriteria: ["Source compilation, linting, formatting, type analysis, framework checks and behavior tests are not conflated.", "At least one actual diagnostic is shown with its owning tool.", "No undocumented checker installation or nonexistent project command is assumed.", "The learner can show a concrete wrong policy that static syntax checks cannot reject."]
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
    "software-craft-python-logging-from-first-principles": {
        objective: "Trace the actual Python logger → handler → formatter pipeline and fail an incorrect threshold prediction.",
        scenario: "Before logging a Steward state change, a new teammate sees logger.info calls produce no visible output and assumes logging is broken. Use a scratch Python process to determine which stage discards the record rather than changing application-wide logging settings.",
        instructions: [
            "Save and run the exact logger/handler/formatter program from the reading using python3; keep unrelated application loggers untouched.",
            "Capture both expected evidence labels and the output record with its named logger.",
            "Switch the handler threshold from INFO to DEBUG, predict the additional emitted record, and verify the change.",
            "Move the handler threshold to ERROR, prove the INFO record disappears and identify exactly which gate caused that result.",
            "In the isolated scratch script add a root handler, enable propagation and observe the duplicate; remove the root handler and restore propagation behavior.",
            "Explain which parts are local Python behavior and which production log-management properties remain untested."
        ],
        deliverables: ["Runnable scratch Python logger source", "Three captured threshold cases and propagation observation", "Logger/handler/formatter reasoning note"],
        completionCriteria: ["The learner can predict INFO/DEBUG/WARNING filtering without trial-and-error config edits.", "A deliberate handler-threshold negative is asserted.", "No global application handler is cleared or modified.", "Operational limitations are stated without claiming central logging."]
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
    "software-craft-write-a-readme-someone-can-follow": {
        objective: "Prove README setup commands actually execute and report their expected success or failure.",
        scenario: "A new engineer has never seen the project. Before assuming a complete Django setup or live database, rehearse reliable README writing with one tiny Python application and a safe, reproducible command executor.",
        instructions: [
            "Run the source-published verify_readme.py program; inspect its generated scratch README and simple app.py file.",
            "Verify that the documented python app.py --check command exits zero and prints READY, and that the --unknown command fails with the expected error and exit 2.",
            "Deliberately change the documented successful command to --missing; observe the assertion fail because the README is now false, then restore the original command.",
            "Explain why checking for words such as Python, database or curl cannot establish that a command actually works.",
            "Explain why automatically executing arbitrary external Markdown is unsafe, and which commands require deliberate isolation or manual review.",
            "Identify one claim in the real Steward README that could be tested with a disposable local environment; do not assume undocumented access or secrets."
        ],
        deliverables: ["Executed README success and expected-failure evidence", "Failing stale-command mutation", "Notes on safe command execution and limits", "One proposed real-project verification"],
        completionCriteria: ["A beginner can run the example with the standard library alone.", "The README commands are executed from the documented context, not merely scanned for keywords.", "A stale documented command causes a real test failure.", "No database, remote account or production credentials are required."]
    },
    "software-craft-technical-documentation": {
        objective: "Verify the actual Steward setup and select the right documentation form for each reader.",
        scenario: "After completing the independent README example, prepare a real project handoff. A new contributor needs accurate environment and migration steps, an API consumer needs a maintained contract, and future maintainers need reasons behind important decisions.",
        instructions: [
            "Read the current Steward README and classify statements as actually verified, clearly conditional, or still assumed.",
            "Using a clean, isolated training environment, verify actual Python, PostgreSQL, migration and first HTTP request instructions; include a permitted and a rejected request.",
            "Do not guess a password, health route, database name or migration output. Record any external access prerequisites and safe alternatives.",
            "Write a concise domain orientation and link to the canonical API schema rather than duplicating mutable request/response details.",
            "Write one ADR that captures a real decision, alternatives, consequences and a revisit trigger; keep it separate from a runbook.",
            "Draft one safe, non-destructive diagnostic runbook with symptom, preconditions, checks, expected outputs and escalation boundary.",
            "Ask another engineer to follow the safe steps or record explicit manual gates; correct failed instructions before claiming a reproducible handoff."
        ],
        deliverables: ["Verified Steward setup evidence", "Reader-specific documentation links", "Evidence-backed decision record", "Safe diagnostic runbook", "Unverified-gates list"],
        completionCriteria: ["At least one real setup claim is executed against the actual documented environment.", "The project documentation does not invent credentials or deployed endpoints.", "README, API reference, ADR and runbook serve distinct reader needs.", "Unverified setup claims remain explicitly open, not labelled ready."]
    },
    "software-craft-architecture-decision-records": {
        objective: "Create, challenge and verify a consequential Steward decision record with a defensible alternative.",
        scenario: "A future contributor finds two PostgreSQL training databases and cannot tell whether the separation is intentional or incidental. Write an ADR they can use to decide how to change the boundary safely.",
        instructions: [
            "Read the full worked SQL-versus-Django ADR and mark its status, scope, alternatives, trade-offs and revisit trigger.",
            "Verify the current database identity and migration status only against disposable training environments; label unexecuted claims unverified.",
            "Propose a second consequential decision for Steward with at least two plausible alternatives and independent reasons not to choose one.",
            "Have a reviewer challenge one assumption and record an evidence-based response without inventing a past approval.",
            "Specify how the decision could later be superseded while preserving its original rationale."
        ],
        deliverables: ["Completed or explicitly proposed ADR", "Read-only verification evidence or honest unverified labels", "Reviewer challenge and response"],
        completionCriteria: ["The alternatives are credible and materially different.", "Claims requiring execution are distinguished from a written example.", "Scope, owner and revisit trigger are explicit.", "No production decision or approval is fabricated."]
    },
    "software-craft-operational-runbooks-and-safe-diagnostic-handoffs": {
        objective: "Rehearse a read-only Steward diagnostic runbook with explicit stop and escalation conditions.",
        scenario: "A signed Service request starts failing after a training change. A new engineer needs to classify the status and inspect safe evidence without blindly resetting migrations, repeating a transfer or exposing bearer credentials.",
        instructions: [
            "Inspect the worked runbook and identify its trigger, audience, preconditions, safe checks and forbidden actions.",
            "Against a disposable Steward environment only, run python manage.py check and showmigrations registry/token_blacklist; capture statuses and observed results.",
            "Create a 401/403/404/409/5xx branch table with evidence, interpretation, safe next step and no-secret logging constraints.",
            "Simulate a missing migration and a stale ownership conflict; demonstrate when the operator must stop rather than issue a corrective command.",
            "Ask another person to follow the read-only steps and revise one ambiguous instruction or state clearly that independent rehearsal is pending."
        ],
        deliverables: ["Bounded Steward runbook", "Read-only observation evidence", "Failure-status diagnostic matrix", "Stop/escalation review"],
        completionCriteria: ["No unapproved state-changing operations are prescribed.", "Each diagnostic step states expected versus abnormal observation.", "Secrets are not copied into diagnostics.", "The read-only training scope is explicit and independent rehearsal is not invented."]
    },
    "software-craft-failure-boundaries-and-public-error-contracts": {
        objective: "Model six public failure outcomes, then prove that leaking a database exception fails an explicit negative control.",
        scenario: "A Steward endpoint currently returns raw database exception text to clients. Before introducing custom DRF handlers, agree which failures clients can act on and what information must remain private.",
        instructions: [
            "Execute the exact pure-Python public error program from the reading and capture the three evidence labels.",
            "Write a decision table for 400, 401, 403, concealed 404, 409 and 500 with trigger, client action and server diagnostic evidence.",
            "Deliberately mutate the mapper to echo a demo SQL password in the response and prove the no-secret assertion fails.",
            "Restore the safe mapper and confirm absent and foreign-Team Service scenarios share a public 404 shape.",
            "Name the exact next test to perform against actual DRF Client responses and identify why the pure function is insufficient HTTP proof."
        ],
        deliverables: ["Executed six-case public policy test", "Leak-mutant failure evidence", "Failure decision table and DRF follow-up tests"],
        completionCriteria: ["All six response families are explicitly distinguished.", "The negative mutant really leaks and is detected.", "The public contract omits raw database details and has a stable shape.", "Pure-Python evidence is not misrepresented as real HTTP evidence."]
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
