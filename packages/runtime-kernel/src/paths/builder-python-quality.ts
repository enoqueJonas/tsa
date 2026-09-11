import type { PracticalContent } from "../activities";
import type { Lesson } from "./lesson";
import { programmingWithPythonRichLessons } from "./builder-python-rich";

interface PracticeSpec extends Omit<PracticalContent, "type"> {}

const practices: Record<string, PracticeSpec> = {
    "programming-with-python-setting-up-a-python-engineering-environment": {
        objective: "Establish the first reproducible Python development environment for Steward and prove which interpreter and package location are actually in use.",
        scenario: "You have joined the Steward team. The repository exists, but the setup guidance is only: 'install Python and run pip install; it works on my machine.' Before feature work begins, you must turn that assumption into a reproducible engineering setup another developer can verify.",
        instructions: [
            "Before changing anything, capture which Python executable your shell resolves, its version, sys.executable and python -m pip --version.",
            "Create a project-local .venv, activate it and repeat the same observations. Explain exactly what changed.",
            "Install one small dependency with python -m pip and prove where it was installed.",
            "Deactivate the environment and attempt to import the dependency again. Preserve the result rather than merely stating that isolation works.",
            "Delete .venv and recreate it. Identify what information is still missing if another engineer wants the same dependency set.",
            "Write a concise setup procedure that starts from a machine with Python installed but no Steward environment."
        ],
        deliverables: ["Interpreter and pip evidence before/after activation", "Isolation failure evidence", "Reproducible Steward setup note", "Short note explaining the remaining dependency-reproducibility gap"],
        completionCriteria: ["You can prove which interpreter executes Steward code.", "The dependency is isolated from the system interpreter.", "The setup can be repeated from a deleted .venv.", "You can explain why a virtual environment alone is not a dependency specification."]
    },
    "programming-with-python-python-syntax-values-and-types": {
        objective: "Turn raw service-registration values into deliberate Python representations and expose where type-correct data can still violate Steward rules.",
        scenario: "A prototype sends Steward service data as loosely typed values. Your task is to inspect what Python actually represents, then separate language-level validity from domain validity before this data ever reaches an API framework.",
        instructions: ["Model one realistic Service record using scalar values and collections.", "Use type() and repr() to inspect the values rather than assuming their representation.", "Create two equal dependency collections and demonstrate the difference between equality and identity, then create an alias and mutate through it.", "Parse external text representing a review interval and owner identifier; preserve one successful conversion and one failure.", "Create one value that is valid Python but invalid Steward data and write the rule that should reject it."],
        deliverables: ["Runnable representation experiment", "Equality/identity and aliasing evidence", "Boundary-conversion evidence", "Domain-rule note"],
        completionCriteria: ["The experiment distinguishes value, type, identity and mutability.", "At least one conversion failure remains observable.", "You can explain why Python type correctness does not guarantee Steward domain correctness."]
    },
    "programming-with-python-control-flow": {
        objective: "Implement and review a production-eligibility rule whose branches correspond to explicit Steward business decisions.",
        scenario: "Operations reports that retired, unowned or incompletely configured services must never be promoted to production. You receive the rule in prose and must translate it into behavior that a reviewer can reason about path by path.",
        instructions: ["Write the eligibility rule in plain language before coding.", "Implement a deliberately nested first version and exercise every meaningful branch.", "Refactor it using guard clauses or clearer branch ordering without changing behavior.", "Add one boundary case where Python truthiness could hide an important distinction.", "List the future test cases implied by the final branch structure."],
        deliverables: ["Before/after implementations", "Behavior table covering allowed and rejected paths", "Boundary-case evidence", "Future test-case list"],
        completionCriteria: ["Every branch represents an explainable domain decision.", "The refactor preserves behavior.", "A truthiness ambiguity is identified and resolved deliberately.", "You can justify the final branch order."]
    },
    "programming-with-python-functions-and-scope": {
        objective: "Refactor a mixed Steward script into functions with visible contracts, controlled state and one reproducible scope-related defect.",
        scenario: "The first Steward experiment has grown into one script that parses input, normalizes lifecycle values, mutates dependency data and prints output. A teammate cannot tell which functions change state or fail. Refactor it for reviewability without inventing unnecessary architecture.",
        instructions: ["Start from a script containing at least three responsibilities and identify them in writing.", "Extract functions whose names communicate one coherent responsibility.", "For one public function, record inputs, output, side effects and failure behavior before implementation.", "Reproduce the mutable-default-argument bug or another scope/state bug and capture the surprising result.", "Fix the bug by making ownership explicit.", "Remove one unnecessary global dependency and explain why the new version is easier to reason about."],
        deliverables: ["Refactored script/module", "Function contract", "Bug reproduction and fix evidence", "Short state-ownership note"],
        completionCriteria: ["Responsibilities are visible from function boundaries.", "Hidden mutable global state is reduced.", "The reproduced bug has an explained cause, not only a fix.", "You can describe where each changed piece of state is owned."]
    },
    "programming-with-python-collections-and-data-structures": {
        objective: "Choose Python collection types from Steward's required guarantees instead of convenience or habit.",
        scenario: "A prototype represents every multi-value concern as a list. Reviewers have already found duplicate dependencies and slow, awkward lookups. Redesign only the in-memory structures that benefit from stronger guarantees.",
        instructions: ["Model lifecycle history, service coordinates, a keyed service record and unique dependencies using different built-in structures.", "For each choice, write the guarantee you are relying on: order, keyed lookup, uniqueness, fixed grouping or mutability.", "Demonstrate duplicate insertion behavior for both a list and a set.", "Demonstrate one lookup-oriented operation using two candidate structures and compare clarity.", "Identify one place where a built-in collection is becoming too weak and note what later abstraction may replace it."],
        deliverables: ["Runnable collection comparison", "Structure/guarantee decision table", "Duplicate-behavior evidence", "Future modeling note"],
        completionCriteria: ["Every structure has a stated reason for existing.", "At least one alternative is rejected with evidence.", "You distinguish an in-memory guarantee from a future database constraint."]
    },
    "programming-with-python-modules-and-packages": {
        objective: "Turn a growing Steward script into a small package with understandable dependency direction and no import-time surprises.",
        scenario: "The Steward core now has enough behavior that one file is slowing review. A teammate proposes creating one module per noun. Your task is to design boundaries from responsibilities instead and prove the resulting imports remain understandable.",
        instructions: ["Inventory the current responsibilities before creating files.", "Propose two package layouts and choose one based on cohesion and dependency direction.", "Move code into the chosen modules while keeping the public import surface small.", "Sketch dependency arrows and identify any cycle or near-cycle.", "Keep demo execution behind an explicit entry point and prove importing the package does not execute the demo.", "Record one boundary you deliberately refuse to extract into a reusable package yet."],
        deliverables: ["Working package structure", "Alternative-boundary sketch", "Dependency-direction diagram", "Import-side-effect evidence", "Deferred extraction decision"],
        completionCriteria: ["File boundaries follow responsibilities rather than nouns mechanically.", "Imports can be explained directionally.", "Importing the package has no surprising execution side effects.", "No reusable package is invented without a demonstrated consumer need."]
    },
    "programming-with-python-errors-exceptions-and-defensive-programming": {
        objective: "Design Steward failure behavior so invalid operations remain distinguishable and diagnostic evidence is not accidentally erased.",
        scenario: "A prototype catches every Exception and returns an empty result so the demo can keep running. Reviewers can no longer distinguish invalid service input from programmer defects. Replace this with deliberate failure contracts.",
        instructions: ["Implement two invalid Steward operations that should be rejected explicitly.", "Show the broad-catch version and capture how it hides at least one real defect.", "Replace it with specific handling or propagation and explain the decision.", "Translate one low-level failure at an abstraction boundary using exception chaining.", "For each failure, state what the caller should do: retry, correct input, propagate or stop."],
        deliverables: ["Failure-contract table", "Broad-catch failure evidence", "Corrected exception strategy", "Exception-chaining example"],
        completionCriteria: ["Domain rejection and unexpected defects remain distinguishable.", "No failure is swallowed merely to keep execution moving.", "Translated failures retain causal context.", "Caller behavior is explicit for each case."]
    },
    "programming-with-python-object-oriented-programming": {
        objective: "Decide whether a Steward concept deserves an object by comparing an invariant-owning class with a simpler functional representation.",
        scenario: "The team is split: one engineer wants classes for every domain noun; another wants dictionaries and functions everywhere. Build both approaches for one narrow Steward concept and make the decision from behavior and changeability rather than ideology.",
        instructions: ["Choose Service, Team or Environment and identify one invariant plus one meaningful behavior.", "Implement a class that owns that invariant.", "Represent one relationship through composition rather than inheritance.", "Build a simpler dictionary/function alternative that supports the same small use case.", "Exercise the same valid and invalid scenarios against both versions.", "Write a short decision explaining which version you would keep now and what future evidence could reverse the decision."],
        deliverables: ["Class-based implementation", "Simpler alternative", "Shared behavior comparison", "Design decision note"],
        completionCriteria: ["The class exists to protect behavior or invariants, not merely to wrap fields.", "Inheritance is not used without a true subtype relationship.", "The selected design is justified against a real alternative."]
    },
    "programming-with-python-comprehensions-iterators-and-pythonic-tools": {
        objective: "Improve a small Steward data-processing task with Python iteration tools while preserving readability and observable behavior.",
        scenario: "A service-audit script works but contains several repetitive loops. Refactor the parts where Python's iteration tools clarify intent, and deliberately leave alone any transformation that becomes harder to read when compressed.",
        instructions: ["Start with explicit loops for filtering and transforming service data.", "Convert one simple transformation into a comprehension and compare both versions.", "Use a generator for a sequence that does not need to exist fully in memory and demonstrate that it is consumed.", "Use any() or all() for one meaningful registry question.", "Sort services using an explicit key.", "Identify one loop you refuse to compress and explain why."],
        deliverables: ["Before/after iteration code", "Generator-consumption evidence", "Built-in function example", "Readability decision note"],
        completionCriteria: ["Refactoring preserves behavior.", "Concise syntax is used only where intent remains clear.", "You can explain the behavioral difference between a list comprehension and generator expression."]
    },
    "programming-with-python-type-hints-and-static-feedback": {
        objective: "Use type annotations as executable design feedback for the Steward core and demonstrate both their value and their limits.",
        scenario: "A teammate changes a function to accept an optional owner identifier, and another call site still assumes an integer. The code path is not exercised in the demo, so the mismatch reaches review. Introduce static feedback before runtime becomes the first detector.",
        instructions: ["Annotate the public boundary of two existing Steward operations.", "Represent at least one optional value explicitly.", "Run mypy or an equivalent checker and preserve a clean baseline.", "Introduce a real type mismatch deliberately and capture the diagnostic.", "Fix the mismatch without weakening the type to Any.", "Identify one important Steward rule the checker still cannot prove and explain what mechanism should cover it instead."],
        deliverables: ["Annotated code", "Static-check baseline", "Captured mismatch diagnostic and fix", "Type-system limit note"],
        completionCriteria: ["Annotations make a public contract clearer.", "The checker detects a mismatch before runtime.", "The fix preserves useful type information.", "You distinguish type guarantees from domain validation."]
    },
    "programming-with-python-virtual-environments-and-dependency-management": {
        objective: "Make the framework-free Steward core installable from declared project metadata and test that claim from a clean environment.",
        scenario: "The team can recreate .venv, but package installation still depends on remembering commands from chat history. Convert those private assumptions into project metadata and evaluate how much reproducibility you actually achieved.",
        instructions: ["List the packages Steward imports directly and distinguish them from transitive dependencies.", "Declare the direct requirements in project metadata with deliberate version constraints.", "Explain the trade-off behind at least one chosen constraint.", "Delete .venv, recreate it and install Steward only from repository metadata.", "Run the demo from the clean environment.", "Inspect the resolved dependency graph and record one source of variation that still exists without a lock strategy."],
        deliverables: ["Project dependency declaration", "Clean-room install transcript", "Direct/transitive dependency note", "Version-constraint rationale", "Remaining reproducibility gap"],
        completionCriteria: ["The project installs without relying on remembered manual package commands.", "Direct dependencies are intentionally declared.", "At least one versioning decision is justified.", "You do not claim perfect reproducibility when unresolved variation remains."]
    },
    "programming-with-python-debugging-python-programs": {
        objective: "Diagnose a Steward defect through competing hypotheses and chronological evidence instead of edit-and-retry guessing.",
        scenario: "A service promotion fails while converting an owner identifier. The traceback points at int(), but the invalid value may have entered the system much earlier. Treat the bug as an investigation and determine where the state first became wrong.",
        instructions: ["Reproduce the failure and capture the original traceback before editing code.", "Write at least two plausible hypotheses about where the invalid value originated.", "Choose the smallest observation that can distinguish the hypotheses.", "Use breakpoint(), pdb, logging or targeted inspection to falsify at least one hypothesis.", "Fix the earliest responsible cause rather than suppressing the final exception.", "Rerun the original reproduction and write a chronological evidence log from symptom to conclusion."],
        deliverables: ["Original traceback", "Hypothesis list", "Diagnostic observations", "Root-cause fix", "Chronological evidence log"],
        completionCriteria: ["At least one hypothesis is falsified with evidence.", "The fix addresses the cause rather than hiding the symptom.", "The original reproduction is rerun successfully.", "Another engineer can follow your evidence chain without guessing your thought process."]
    }
};

function firstTeachingParagraph(lesson: Lesson): string | undefined {
    const reading = lesson.activities.find((activity) => activity.content.type === "reading");
    if (!reading || reading.content.type !== "reading") return undefined;
    return reading.content.blocks?.find((block) => block.type === "paragraph")?.text;
}

export const programmingWithPythonQualityLessons: Lesson[] = programmingWithPythonRichLessons.map((lesson) => ({
    ...lesson,
    activities: lesson.activities.map((activity) => {
        if (activity.content.type === "reading") {
            const teachingBody = firstTeachingParagraph(lesson);
            return teachingBody ? { ...activity, content: { ...activity.content, body: teachingBody } } : activity;
        }
        if (activity.content.type === "practical") {
            const practice = practices[lesson.id];
            return practice ? { ...activity, content: { type: "practical", ...practice } } : activity;
        }
        return activity;
    }),
}));
