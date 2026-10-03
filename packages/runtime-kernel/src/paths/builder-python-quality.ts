import type { PracticalContent } from "../activities";
import type { Lesson } from "./lesson";
import { programmingWithPythonRichLessons } from "./builder-python-rich";

interface PracticeSpec extends Omit<PracticalContent, "type"> {}

const practices: Record<string, PracticeSpec> = {
    "programming-with-python-setting-up-a-python-engineering-environment": {
        objective: "Create the local Python workspace that every following Programming with Python Steward increment will use.",
        scenario: "You are starting Steward from zero. The long-term product will become an Engineering Service Registry, but today there is no application to refactor and no hidden starter code. Your first job is to create a small, reproducible Python workspace named steward-core so later exercises have a real artifact to extend.",
        instructions: [
            "Create a new directory named steward-core and initialize it as a Git repository.",
            "Inside it, create and activate a project-local .venv. Capture python --version, python -c \"import sys; print(sys.executable)\" and python -m pip --version.",
            "Create steward/ with an empty __init__.py and create steward/services.py. For now, services.py may contain only a short module docstring explaining that it will hold Steward service behavior.",
            "Create main.py that imports steward.services and prints \"Steward workspace ready\". Run it from the repository root.",
            "Deactivate the environment, reactivate it and run main.py again. The goal is to prove that you can return to the project deliberately.",
            "Add a .gitignore that excludes .venv, __pycache__ and other generated Python files, then commit this checkpoint."
        ],
        deliverables: ["steward-core repository with steward/services.py and main.py", "Interpreter and pip evidence from the active .venv", "Successful main.py output", "Initial Git commit"],
        completionCriteria: ["steward-core exists as a Git repository.", "steward/services.py is importable.", "Running main.py prints Steward workspace ready.", ".venv and generated Python files are not committed.", "This repository is the starting point for the next Steward increment."]
    },
    "programming-with-python-python-syntax-values-and-types": {
        objective: "Create Steward's first concrete Service representation using Python values you can inspect and explain.",
        scenario: "The Steward workspace now exists, but it stores nothing. The first useful capability is deliberately small: hold basic information about one engineering service. A service needs a name, an API endpoint, whether it is active, and its age in days.",
        instructions: [
            "Open steward/services.py from the previous checkpoint.",
            "Create a dictionary named payments_api with name \"Payments API\", endpoint \"https://payments.internal/api\", active True and age_days 184.",
            "Print each field from main.py, then use type() and repr() to inspect at least two values.",
            "Create a second service dictionary for \"Authentication API\" with different values.",
            "Create one deliberately invalid service whose age_days is the string \"old\". Observe that Python can still store it and write down why language-level validity is not the same as a Steward business rule.",
            "Commit the checkpoint without adding validation yet; validation belongs to a later increment."
        ],
        deliverables: ["Two valid-looking Service dictionaries in steward/services.py", "Runnable field/type inspection from main.py", "One deliberately invalid representation and a short observation"],
        completionCriteria: ["Running main.py shows the fields of Payments API.", "active is represented as a boolean and age_days as an integer in the valid examples.", "You can explain why Python accepts the invalid age_days value.", "No validation framework or class has been introduced prematurely."]
    },
    "programming-with-python-control-flow": {
        objective: "Add the first Steward business decision: determine whether a Service is eligible to be shown as active.",
        scenario: "Steward can now represent Services, but raw data alone does not express decisions. For this increment, a Service is operationally eligible only when it is marked active, has a non-empty endpoint, and has a non-negative age_days value. Implement that rule before introducing functions in the next lesson.",
        instructions: [
            "Continue from the Service dictionaries created in the previous checkpoint.",
            "In main.py, use if/elif/else to evaluate payments_api against the three eligibility conditions: active is True, endpoint is not empty, and age_days is an integer greater than or equal to zero.",
            "Print either \"Payments API is eligible\" or a specific rejection reason.",
            "Change one field at a time to exercise inactive, missing-endpoint and invalid-age paths. Record the observed output for each case.",
            "Restore the valid Payments API data before finishing.",
            "Write the rule as a small decision table in your notes. Do not extract a function yet; the next increment will make that refactor purposeful."
        ],
        deliverables: ["Working conditional eligibility logic", "Observed output for the valid path and three rejected paths", "Small eligibility decision table"],
        completionCriteria: ["Every stated rule has an observable branch.", "The valid Payments API is accepted.", "Each invalid variation is rejected for an understandable reason.", "The checkpoint still uses explicit control flow so the next refactor has real code to improve."]
    },
    "programming-with-python-functions-and-scope": {
        objective: "Turn the Service behavior you already built into named functions with explicit inputs, outputs and state changes.",
        scenario: "Your current main.py contains Service data plus eligibility logic. That was useful while learning control flow, but the next feature will need to reuse the behavior. Refactor code that actually exists, then add deliberate status-changing operations.",
        instructions: [
            "Start from your previous checkpoint. Do not invent a separate sample script.",
            "Move Service-related behavior into steward/services.py.",
            "Implement create_service(name, endpoint, age_days) so a newly created Service starts with active set to True.",
            "Extract is_service_eligible(service) from the eligibility logic you already wrote. It must return a boolean and must not modify the Service.",
            "Implement deactivate_service(service) and activate_service(service). These functions deliberately mutate the Service's active status.",
            "Implement service_summary(service) so it returns a readable string containing the Service name, endpoint and status without modifying the Service.",
            "In main.py, create Payments API, print its eligibility, deactivate it, print eligibility again, reactivate it and print service_summary().",
            "For is_service_eligible() and deactivate_service(), write down inputs, return value and whether the function changes caller-owned state."
        ],
        deliverables: ["Updated steward/services.py", "main.py demonstrating the complete status flow", "Two short function contracts"],
        completionCriteria: ["create_service() creates an active Service.", "is_service_eligible() returns True for the valid active Payments API and does not mutate it.", "deactivate_service() changes active from True to False.", "activate_service() changes active back to True.", "service_summary() reports the Service without changing it.", "Every function operates on artifacts created in this curriculum rather than a fictional prior script."]
    },
    "programming-with-python-collections-and-data-structures": {
        objective: "Grow Steward from one Service into an in-memory registry that can add, find and filter Services.",
        scenario: "Steward can create and update one Service. An engineering registry becomes useful only when it can manage several. Build the smallest registry needed to answer concrete questions without introducing a database or framework.",
        instructions: [
            "Continue using create_service() from the previous checkpoint to create Payments API, Authentication API and Notifications API.",
            "Store the Services in a list named services.",
            "Implement find_service_by_name(services, name). Return the matching Service or None when it does not exist.",
            "Implement active_services(services) to return only Services whose active field is True.",
            "Create a set of dependency names for Payments API and demonstrate that adding the same dependency twice does not create a duplicate.",
            "From main.py, deactivate Notifications API, then print the names returned by active_services().",
            "Attempt to find an unknown Service and preserve the observed None result. Do not turn it into an exception yet."
        ],
        deliverables: ["Three-Service in-memory registry", "find_service_by_name() and active_services()", "Dependency uniqueness experiment", "Runnable lookup/filter demonstration"],
        completionCriteria: ["The registry contains three Services.", "Finding Payments API returns the expected Service.", "Finding an unknown name returns None.", "After Notifications API is deactivated, it is absent from active_services().", "The dependency set demonstrates uniqueness without pretending that an in-memory set is a future database constraint."]
    },
    "programming-with-python-modules-and-packages": {
        objective: "Split the Steward code only now that the growing implementation has real responsibilities worth separating.",
        scenario: "steward/services.py now creates Services, changes status, evaluates eligibility, searches a registry and experiments with dependencies. The file has earned a refactor. Separate responsibilities while preserving every behavior from the previous checkpoints.",
        instructions: [
            "Before moving code, list the responsibilities currently present in steward/services.py.",
            "Create steward/registry.py and move registry-oriented behavior such as find_service_by_name() and active_services() into it.",
            "Keep Service creation, status changes, summaries and eligibility in steward/services.py.",
            "If dependency-specific code has become more than a tiny experiment, create steward/dependencies.py; otherwise leave it where it is and record why another module is not yet justified.",
            "Update main.py imports and rerun every behavior demonstrated in the previous checkpoint.",
            "Run python -c \"import steward.services; import steward.registry\" and verify that importing the modules does not print demo output.",
            "Sketch the import direction between main.py, services.py and registry.py and check that you have not created a circular import."
        ],
        deliverables: ["Refactored Steward package", "Responsibility inventory", "Successful regression run", "Import-side-effect evidence", "Small dependency-direction sketch"],
        completionCriteria: ["Existing Service creation, status, eligibility, lookup and filtering behavior still works.", "Registry behavior has a clear home.", "Importing Steward modules does not execute the demo.", "No circular import was introduced.", "A new module exists only where accumulated behavior justified it."]
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
