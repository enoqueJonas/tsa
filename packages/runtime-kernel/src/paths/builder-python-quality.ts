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
        objective: "Replace ambiguous registry failures with explicit Steward validation and exception contracts.",
        scenario: "The current registry can create, activate, deactivate, find and filter Services, but invalid data is still easy to introduce and an unknown lookup simply returns None. Now that those behaviors exist, make failure deliberate without hiding programmer defects.",
        instructions: [
            "Continue from the refactored steward package from the previous checkpoint.",
            "Add validation to create_service(): name and endpoint must be non-empty strings and age_days must be an integer greater than or equal to zero.",
            "Create a ServiceValidationError exception for invalid Service input and raise it with a useful message.",
            "Change find_service_by_name() so an unknown Service raises a ServiceNotFoundError instead of returning None.",
            "In main.py, demonstrate one invalid create_service() call and one missing lookup. Catch only the expected domain exception at the boundary where you can print a useful message.",
            "Deliberately introduce a programmer defect inside a temporary copy of the demo and prove that catch-all Exception handling would hide it. Remove the broad catch and restore the working code.",
            "Write down what callers should do for ServiceValidationError, ServiceNotFoundError and an unexpected exception."
        ],
        deliverables: ["Explicit Steward exception types", "Validated create_service()", "Missing-Service failure behavior", "Expected-failure demo", "Short caller-response table"],
        completionCriteria: ["Invalid Service data is rejected at creation.", "Unknown lookup no longer silently returns None.", "Expected domain failures are handled specifically.", "Unexpected programmer defects are not swallowed.", "Existing valid Service and registry behavior still works."]
    },
    "programming-with-python-object-oriented-programming": {
        objective: "Evolve the existing dictionary-based Service into an object only after the accumulated behavior gives the object a reason to exist.",
        scenario: "Service now has data, validation, eligibility rules and state transitions spread across functions. This is enough evidence to test whether Service should own some of that behavior. Refactor the implementation you already built rather than creating an unrelated OOP example.",
        instructions: [
            "List the Service fields and behaviors currently distributed across create_service(), activate_service(), deactivate_service(), is_service_eligible() and service_summary().",
            "Implement a Service class that owns name, endpoint, active and age_days. Keep the validation rules from the previous checkpoint.",
            "Move activate(), deactivate(), is_eligible() and summary() onto Service where doing so improves cohesion.",
            "Update registry functions to work with Service instances without changing their externally observable lookup/filter behavior.",
            "Create a small Team class with a name, then give Service an optional owner_team through composition. Do not use inheritance between Team and Service.",
            "Update main.py to reproduce the same Payments API lifecycle demonstrated before the refactor.",
            "Record one reason the class is now justified and one reason you would reject creating a class for a concept that has only passive data."
        ],
        deliverables: ["Service class", "Small Team composition example", "Updated registry integration", "Before/after behavior comparison", "Design rationale"],
        completionCriteria: ["Service protects the validation rules already established.", "Activation/deactivation and eligibility behavior is preserved.", "Registry lookup/filtering works with Service objects.", "Team is composed with Service rather than forced into inheritance.", "The refactor changes structure without silently changing established behavior."]
    },
    "programming-with-python-comprehensions-iterators-and-pythonic-tools": {
        objective: "Improve real registry queries with Python iteration tools while keeping the existing behavior readable.",
        scenario: "The registry now contains Service objects. Several operations use explicit loops, which gives you real code to evaluate rather than synthetic comprehension drills. Refactor only the operations that become clearer.",
        instructions: [
            "Create at least five Service instances with mixed active states, ages and owner teams.",
            "Implement or rewrite active_services() using a list comprehension and compare it with the explicit-loop version.",
            "Add service_names() as a simple transformation and use a comprehension where it remains readable.",
            "Add has_inactive_services() using any() and all_services_owned() using all().",
            "Add services_by_age() using sorted() with an explicit key.",
            "Create iter_active_services() as a generator and demonstrate that it yields Services on demand rather than building a list immediately.",
            "Choose one non-trivial registry operation and deliberately keep the explicit loop if a comprehension would obscure the business rule. Record the reason."
        ],
        deliverables: ["Registry query refactor", "any()/all() examples", "Sorted Service query", "Generator demonstration", "Readability decision"],
        completionCriteria: ["Existing active filtering behavior is preserved.", "Each Pythonic construct has a concrete registry purpose.", "The generator can be iterated without changing Service state.", "At least one loop is retained deliberately when compression would reduce clarity."]
    },
    "programming-with-python-type-hints-and-static-feedback": {
        objective: "Add static contracts to the Steward core and use the checker to expose a real mismatch before runtime.",
        scenario: "Service and registry behavior now spans several modules. The code works, but function contracts still live mostly in the reader's head. Add type information to the implementation you already own, then prove what static analysis can and cannot guarantee.",
        instructions: [
            "Add type hints to the Service and Team constructors and to the public registry functions.",
            "Represent owner_team explicitly as Team | None (or Optional[Team] if required by your supported Python version).",
            "Type the Service collections used by active_services(), find_service_by_name() and iter_active_services().",
            "Add mypy as a development dependency for this checkpoint and run it against steward and main.py. Preserve the first clean result.",
            "Deliberately pass a string where a list of Service objects is expected and capture the mypy diagnostic before fixing it.",
            "Do not weaken the contract to Any to silence the checker.",
            "Write down one existing Steward rule, such as non-empty endpoint or non-negative age_days, that type hints alone cannot prove."
        ],
        deliverables: ["Typed Steward public boundaries", "Clean mypy run", "Captured deliberate type error and fix", "Static-analysis limitation note"],
        completionCriteria: ["mypy checks the current Steward code successfully after the fix.", "The deliberate mismatch is detected before runtime.", "Optional ownership is represented explicitly.", "Useful types are preserved rather than replaced with Any.", "You can distinguish static type guarantees from domain validation."]
    },
    "programming-with-python-virtual-environments-and-dependency-management": {
        objective: "Convert the accumulated Steward workspace into an installable Python project whose dependencies are declared in repository metadata.",
        scenario: "The first lesson created .venv manually and later work introduced mypy. Recreating the project still depends partly on remembered commands. Turn that history into explicit project metadata and prove the repository can bootstrap a clean environment.",
        instructions: [
            "Create pyproject.toml at the steward-core repository root and declare the project metadata intentionally.",
            "Declare runtime dependencies separately from development-only tooling. If the current Steward core has no third-party runtime dependency, keep that list empty rather than adding a package merely to populate it.",
            "Declare mypy as development tooling using the dependency mechanism selected for the project.",
            "Configure the package so the steward module can be installed from the repository.",
            "Delete .venv, create a new one and install the project using only commands justified by repository metadata.",
            "Run main.py and the mypy check from the clean environment.",
            "Inspect the resolved environment and explain what is reproducible now and what would still require a lock strategy for stronger reproducibility."
        ],
        deliverables: ["pyproject.toml", "Installable steward package", "Clean-environment installation transcript", "Successful demo and type-check evidence", "Reproducibility note"],
        completionCriteria: ["A new developer does not need chat history to discover the project's declared dependencies.", "Steward installs from repository metadata.", "The existing demo still runs in a recreated environment.", "Static checking still passes.", "No unnecessary runtime dependency was invented."]
    },
    "programming-with-python-debugging-python-programs": {
        objective: "Diagnose a defect in the Steward implementation through evidence and competing hypotheses rather than edit-and-retry guessing.",
        scenario: "A new import path supplies age_days as text. Creating a Service now fails during validation. The visible exception tells you where the value was rejected, not necessarily where it first became wrong. Use the existing Steward codebase as the debugging target.",
        instructions: [
            "Add a temporary import_service(payload) boundary that receives a dictionary shaped like external data and calls the existing Service creation path.",
            "Use a payload where age_days is the string \"184\" and reproduce the failure. Capture the original traceback before changing code.",
            "Write at least two hypotheses: for example, the Service validator is wrong, or the import boundary failed to convert external text.",
            "Use breakpoint(), pdb, targeted logging or temporary inspection to observe the value and type immediately before Service construction.",
            "Fix the earliest responsible boundary by converting and validating external age_days before constructing Service. Do not weaken the Service invariant to accept arbitrary strings.",
            "Add one invalid payload such as age_days \"unknown\" and preserve the useful failure behavior.",
            "Rerun the original valid-text payload and the rest of the Steward demo, then record the evidence chain from symptom to root cause."
        ],
        deliverables: ["Original traceback", "Competing hypotheses", "Diagnostic observation", "Boundary-level fix", "Invalid-payload evidence", "Chronological debugging log"],
        completionCriteria: ["At least one hypothesis is falsified by observation.", "The fix occurs at the external-data boundary rather than weakening the Service model.", "The string \"184\" can be imported as integer age 184.", "The string \"unknown\" still fails deliberately.", "Previously established Steward behavior continues to run."]
    },

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
