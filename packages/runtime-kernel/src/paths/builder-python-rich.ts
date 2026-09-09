import type { LearningResource, LessonBlock } from "../activities";
import type { Lesson } from "./lesson";

const pythonTutorial: LearningResource = { title: "Python Tutorial", url: "https://docs.python.org/3/tutorial/" };
const pythonReference: LearningResource = { title: "Python Language Reference", url: "https://docs.python.org/3/reference/" };
const stdlib: LearningResource = { title: "Python Standard Library", url: "https://docs.python.org/3/library/" };
const venvDocs: LearningResource = { title: "venv — Creation of virtual environments", url: "https://docs.python.org/3/library/venv.html" };
const packagingGuide: LearningResource = { title: "Python Packaging User Guide", url: "https://packaging.python.org/en/latest/" };
const typingDocs: LearningResource = { title: "typing — Support for type hints", url: "https://docs.python.org/3/library/typing.html" };
const mypyDocs: LearningResource = { title: "mypy documentation", url: "https://mypy.readthedocs.io/en/stable/" };
const pdbDocs: LearningResource = { title: "pdb — The Python Debugger", url: "https://docs.python.org/3/library/pdb.html" };

function slug(value: string) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function lesson(
    title: string,
    estimatedMinutes: number,
    blocks: LessonBlock[],
    objective: string,
    instructions: string[],
    knowledgeCheck: string,
    resources: LearningResource[] = [pythonTutorial]
): Lesson {
    const id = `programming-with-python-${slug(title)}`;
    return {
        id,
        title,
        activities: [
            {
                id: `${id}-concepts`,
                title: `${title}: Concepts and Mental Model`,
                estimatedMinutes,
                content: {
                    type: "reading",
                    body: `Deep TSA lesson for ${title}.`,
                    resources,
                    blocks,
                },
            },
            {
                id: `${id}-practice`,
                title: `${title}: Engineering Practice`,
                estimatedMinutes: 45,
                content: {
                    type: "practical",
                    objective,
                    scenario: "Work in the framework-free Steward Python workspace. Every useful artifact should be preserved because later lessons and the Django/DRF modules will build on this service-registry domain rather than restart from a toy project.",
                    instructions,
                    deliverables: ["Runnable Python evidence", "Short engineering note with at least one failure, edge case or trade-off"],
                    completionCriteria: ["The result runs and can be demonstrated.", "The learner can explain the Python behavior used.", "The work uses the locked Steward service-registry domain when a domain example is appropriate."],
                },
            },
            {
                id: `${id}-check`,
                title: `${title}: Knowledge Check`,
                estimatedMinutes: 10,
                content: { type: "reflection", prompt: knowledgeCheck },
            },
        ],
    };
}

const environment = lesson(
    "Setting Up a Python Engineering Environment",
    35,
    [
        { type: "heading", id: "introduction", text: "Introduction" },
        { type: "paragraph", text: "A Python project is influenced by several layers that beginners often collapse into one idea: the Python installation, the interpreter executable chosen by the shell, the virtual environment, installed distributions, and the dependency declaration used by the project. Reliable engineering starts by being able to prove which layer you are using." },
        { type: "heading", id: "outcomes", text: "Learning outcomes" },
        { type: "list", items: ["Explain the difference between a Python installation, interpreter and virtual environment.", "Inspect which executable your shell resolves.", "Create and activate a project-local virtual environment.", "Use python -m pip to keep installer/interpreter association explicit.", "Explain why environment isolation is not the same as dependency reproducibility."] },
        { type: "heading", id: "interpreter", text: "The interpreter is an executable" },
        { type: "paragraph", text: "When you type python or python3, your shell searches PATH and selects an executable. On a development machine there may be several Python installations. Before debugging a mysterious package problem, first prove which interpreter is actually running." },
        { type: "code", language: "bash", caption: "Inspect the interpreter", code: "which python3\npython3 --version\npython3 -c 'import sys; print(sys.executable)'" },
        { type: "callout", tone: "warning", title: "Do not debug the wrong environment", body: "A package can be installed successfully and still be unavailable to your program if pip and python refer to different installations. Prefer python -m pip when you want the relationship to be explicit." },
        { type: "heading", id: "venv", text: "Virtual environments create isolation" },
        { type: "code", language: "bash", caption: "Create a local environment", code: "python3 -m venv .venv\nsource .venv/bin/activate\npython -c 'import sys; print(sys.executable)'\npython -m pip --version" },
        { type: "paragraph", text: "Activation changes shell behavior so python and related commands resolve inside the environment. It does not make the project reproducible by itself. Another engineer still needs a declaration of what should be installed." },
        { type: "heading", id: "reproducibility", text: "Isolation vs reproducibility" },
        { type: "callout", tone: "steward", title: "Steward connection", body: "The same discipline will later matter in CI, Docker images and production. If the Steward API only works because your laptop happens to contain the right package versions, the environment is not an engineering artifact yet." },
        { type: "resources", title: "Required and supporting reading", resources: [venvDocs, packagingGuide] },
    ],
    "Create a clean Steward Python workspace and prove exactly which interpreter and package location it uses.",
    ["Inspect your system Python executable and version.", "Create .venv and activate it.", "Prove that python now resolves inside .venv.", "Install one small dependency with python -m pip.", "Deactivate the environment and prove the dependency is isolated.", "Write a five-command setup note another engineer could follow."],
    "Explain why these are different: installing Python, choosing an interpreter, activating a virtual environment, installing a package, and declaring project dependencies.",
    [venvDocs, packagingGuide]
);

const valuesTypes = lesson(
    "Python Syntax, Values and Types",
    45,
    [
        { type: "heading", id: "introduction", text: "Introduction" },
        { type: "paragraph", text: "Steward will catalogue technical services, teams, environments and dependencies. Before those concepts reach Django or PostgreSQL, Python needs to represent their values correctly. Names refer to objects, objects have types, mutable state can be shared accidentally, and external representations must be parsed before they become trusted domain data." },
        { type: "callout", tone: "steward", title: "Steward connection", body: "A future service-registration request may contain a service slug, criticality, lifecycle and technical-owner identifier. JSON can carry those values, but JSON does not decide whether they are valid Steward domain values." },
        { type: "heading", id: "outcomes", text: "Learning outcomes" },
        { type: "list", items: ["Explain names, objects, values and types.", "Use core scalar types deliberately.", "Distinguish equality from identity.", "Explain mutability and aliasing.", "Parse external text deliberately.", "Recognize technically valid Python values that should still be constrained by the domain."] },
        { type: "heading", id: "names", text: "Names reference objects" },
        { type: "code", language: "python", caption: "Representing a Steward service", code: "service_name = \"Payments API\"\nservice_slug = \"payments-api\"\ncriticality = \"high\"\nproduction = True\ntechnical_owner_id = None\n\nprint(type(service_name))\nprint(type(production))\nprint(type(technical_owner_id))" },
        { type: "paragraph", text: "The type tells us what operations an object supports. It does not tell us whether a value is valid for the Steward domain. The string 'extremely-important' is a valid str even if Steward permits only low, medium, high and critical." },
        { type: "heading", id: "mutability", text: "Mutability and aliasing" },
        { type: "code", language: "python", caption: "Two names, one list", code: "dependencies = [\"authentication-service\"]\nservice_dependencies = dependencies\nservice_dependencies.append(\"notification-service\")\nprint(dependencies)" },
        { type: "callout", tone: "warning", title: "Assignment is not copying", body: "If two names refer to one mutable object, a mutation through either name changes that object. Shared mutable state is a source of subtle defects when ownership is unclear." },
        { type: "heading", id: "types", text: "Strings, numbers, booleans and None" },
        { type: "code", language: "python", caption: "Different kinds of Steward state", code: "review_interval_days = 90\navailability_target = 99.9\nproduction = False\nopen_risk_count = 0\ntechnical_owner_id = None" },
        { type: "paragraph", text: "False, zero, an empty string and None are not interchangeable. A service can be non-production, have zero open risks and have no technical owner assigned; each communicates a different state." },
        { type: "heading", id: "equality", text: "Equality is not identity" },
        { type: "code", language: "python", caption: "Value equality and object identity", code: "first = [\"auth-service\"]\nsecond = [\"auth-service\"]\nalias = first\n\nprint(first == second)\nprint(first is second)\nprint(first is alias)\n\nif technical_owner_id is None:\n    print(\"Owner still needs to be assigned\")" },
        { type: "heading", id: "boundaries", text: "External representations and conversion" },
        { type: "code", language: "python", caption: "Parsing external text", code: "raw_review_interval = \"90\"\nreview_interval_days = int(raw_review_interval)\n\ntry:\n    technical_owner_id = int(\"not-a-number\")\nexcept ValueError as error:\n    print(f\"Invalid owner id: {error}\")" },
        { type: "resources", title: "Required and supporting reading", resources: [pythonTutorial, pythonReference] },
    ],
    "Model representative Steward service-registry values and prove how type, equality, identity, conversion and mutability affect them.",
    ["Create representative service, team, environment and dependency values.", "Inspect them with type() and repr().", "Demonstrate aliasing with a dependency list.", "Compare == and is.", "Convert two external strings and preserve one conversion failure.", "Define a constrained lifecycle or criticality set and reject an invalid option."],
    "Explain names vs objects, dynamic typing, equality vs identity, aliasing and boundary conversion using Steward examples.",
    [pythonTutorial, pythonReference]
);

const controlFlow = lesson(
    "Control Flow",
    40,
    [
        { type: "heading", id: "introduction", text: "Control flow turns rules into behavior" },
        { type: "paragraph", text: "A program becomes useful when it makes decisions and repeats work. if/elif/else, loops, break, continue and early return are not merely syntax; they shape how clearly domain rules are expressed and how many behavioral paths future tests must cover." },
        { type: "heading", id: "conditions", text: "Condition ordering matters" },
        { type: "code", language: "python", caption: "Validate before changing lifecycle", code: "def can_promote_to_production(service):\n    if service[\"lifecycle\"] == \"retired\":\n        return False\n    if not service[\"technical_owner_id\"]:\n        return False\n    if \"production\" not in service[\"environments\"]:\n        return False\n    return True" },
        { type: "paragraph", text: "Each branch represents a meaningful behavioral path. Ordering can improve readability when rejection conditions are handled first and the successful path remains obvious." },
        { type: "heading", id: "loops", text: "Loops express repeated work" },
        { type: "code", language: "python", caption: "Find unowned critical services", code: "for service in services:\n    if service[\"criticality\"] not in {\"high\", \"critical\"}:\n        continue\n    if service[\"technical_owner_id\"] is None:\n        print(service[\"slug\"])" },
        { type: "callout", tone: "warning", title: "Nested logic hides decisions", body: "Deep nesting often indicates that several independent rules have been compressed into one block. Make rejection rules and state transitions explicit so failures can later be tested independently." },
        { type: "heading", id: "truthiness", text: "Truthiness can be convenient—and ambiguous" },
        { type: "paragraph", text: "Python treats empty collections, zero, None and False as falsey. That is useful, but use explicit comparisons when the domain distinguishes those states. 'No owner assigned' is clearer as owner_id is None than as not owner_id if zero could ever be a valid identifier." },
        { type: "resources", title: "Required reading", resources: [pythonTutorial] },
    ],
    "Implement a Steward lifecycle or eligibility rule with explicit happy, rejected and boundary paths.",
    ["Write the rule first in plain language.", "Implement it with if/elif/else or early returns.", "Exercise each meaningful path.", "Create a deliberately over-nested version and refactor it.", "List the test cases the branching structure implies."],
    "How do branch order, early return and truthiness affect readability and correctness? Describe the behavioral paths in your implementation."
);

const functions = lesson(
    "Functions and Scope",
    45,
    [
        { type: "heading", id: "introduction", text: "Functions create behavioral boundaries" },
        { type: "paragraph", text: "A function is more than reusable syntax. It establishes an interface: inputs, outputs, side effects and failure behavior. Good functions give a name to one coherent responsibility and reduce the number of assumptions a caller must understand." },
        { type: "heading", id: "contracts", text: "Inputs, outputs and contracts" },
        { type: "code", language: "python", caption: "A small domain function", code: "ALLOWED_LIFECYCLES = {\"development\", \"uat\", \"production\", \"retired\"}\n\ndef normalize_lifecycle(raw_value: str) -> str:\n    value = raw_value.strip().lower()\n    if value not in ALLOWED_LIFECYCLES:\n        raise ValueError(f\"unsupported lifecycle: {raw_value}\")\n    return value" },
        { type: "paragraph", text: "The caller can now reason about one operation: text enters, a normalized valid lifecycle returns, or an explicit failure occurs. The function hides implementation detail while preserving a meaningful contract." },
        { type: "heading", id: "scope", text: "Scope and LEGB" },
        { type: "paragraph", text: "Python resolves names through local, enclosing, global and built-in scopes. Global constants can be useful; mutable global state usually creates hidden coupling because callers cannot see all the data a function depends on." },
        { type: "heading", id: "defaults", text: "Mutable default arguments" },
        { type: "code", language: "python", caption: "A classic shared-state bug", code: "def register_dependency(service, dependencies=[]):\n    dependencies.append(service)\n    return dependencies\n\nprint(register_dependency(\"auth\"))\nprint(register_dependency(\"notifications\"))" },
        { type: "callout", tone: "warning", title: "Defaults are evaluated once", body: "The list above is created when the function is defined, not for each call. Use None and create a fresh collection inside when that is the intended ownership model." },
        { type: "code", language: "python", caption: "Explicit ownership", code: "def register_dependency(service, dependencies=None):\n    if dependencies is None:\n        dependencies = []\n    dependencies.append(service)\n    return dependencies" },
        { type: "resources", title: "Required reading", resources: [pythonTutorial, pythonReference] },
    ],
    "Refactor mixed Steward script logic into functions with explicit contracts and controlled state.",
    ["Start with a script performing at least three responsibilities.", "Extract coherent functions.", "Remove unnecessary mutable global state.", "Reproduce a scope or mutable-default bug.", "Fix it and explain the ownership model.", "Document one function in terms of inputs, output, side effects and failures."],
    "Explain LEGB, function contracts, side effects and the mutable-default-argument problem. Which hidden dependency in your original script was most dangerous?",
    [pythonTutorial, pythonReference]
);

const collections = lesson(
    "Collections and Data Structures",
    50,
    [
        { type: "heading", id: "introduction", text: "Data structures encode guarantees" },
        { type: "paragraph", text: "Lists, tuples, dictionaries and sets all hold multiple values, but choosing among them communicates expectations about ordering, lookup, uniqueness and mutation. The right structure should make invalid states harder to express and common operations easy to understand." },
        { type: "heading", id: "list-tuple", text: "Lists and tuples" },
        { type: "code", language: "python", caption: "Ordered service history", code: "lifecycle_history = [\"development\", \"uat\", \"production\"]\nservice_coordinates = (\"payments-api\", \"production\")" },
        { type: "paragraph", text: "A list is appropriate for an ordered collection that may grow or change. A tuple communicates a fixed grouping, though immutability of the tuple does not recursively freeze mutable objects inside it." },
        { type: "heading", id: "dict", text: "Dictionaries" },
        { type: "code", language: "python", caption: "Keyed service record", code: "service = {\n    \"slug\": \"payments-api\",\n    \"criticality\": \"high\",\n    \"owner_team\": \"payments\",\n}" },
        { type: "paragraph", text: "Dictionaries make keyed lookup explicit but do not automatically enforce a schema. As Steward grows, unrestricted dictionaries eventually become too weak for core domain concepts; later lessons will show when classes and database models provide stronger structure." },
        { type: "heading", id: "sets", text: "Sets and uniqueness" },
        { type: "code", language: "python", caption: "Unique dependency slugs", code: "dependencies = {\"auth-service\", \"notification-service\"}\ndependencies.add(\"auth-service\")\nprint(dependencies)" },
        { type: "callout", tone: "steward", title: "Domain choice", body: "If duplicate dependencies are invalid, a set can help in memory—but later PostgreSQL must enforce the rule too. An in-memory structure is not a substitute for a persistence constraint." },
        { type: "heading", id: "complexity", text: "Think about access patterns" },
        { type: "paragraph", text: "You do not need formal algorithm analysis to notice that scanning a list for every lookup differs from keyed dictionary/set membership. Choose structures based on operations and guarantees rather than habit." },
        { type: "resources", title: "Required reading", resources: [pythonTutorial, stdlib] },
    ],
    "Model several Steward concerns using different built-in collections and justify each choice from its required guarantees.",
    ["Represent ordered lifecycle history with a list.", "Represent unique service tags or dependencies with a set.", "Represent a keyed service record with a dictionary.", "Use a tuple for one deliberately fixed grouping.", "Demonstrate aliasing with one mutable collection.", "Compare one lookup-oriented operation across two possible structures."],
    "For each of list, tuple, set and dict, name one Steward use case and the guarantee that makes the structure suitable."
);

const modules = lesson(
    "Modules and Packages",
    45,
    [
        { type: "heading", id: "introduction", text: "Files become dependency boundaries" },
        { type: "paragraph", text: "Splitting code into modules can improve clarity, but more files do not automatically mean better architecture. A useful module groups concepts that change for related reasons and exposes a small, deliberate surface to the rest of the system." },
        { type: "heading", id: "imports", text: "Imports create dependencies" },
        { type: "code", language: "text", caption: "A small Steward core", code: "steward_core/\n├── __init__.py\n├── services.py\n├── teams.py\n├── lifecycle.py\n└── errors.py" },
        { type: "code", language: "python", caption: "Import a public operation", code: "from steward_core.lifecycle import normalize_lifecycle\n\nlifecycle = normalize_lifecycle(\" Production \")" },
        { type: "paragraph", text: "Every import points from one module toward another. When imports become circular, the code is often revealing a confused responsibility or a dependency direction that needs redesign rather than another import trick." },
        { type: "heading", id: "entrypoints", text: "Importable modules vs executable modules" },
        { type: "code", language: "python", caption: "Keep demo execution explicit", code: "def main():\n    print(\"Steward core experiment\")\n\nif __name__ == \"__main__\":\n    main()" },
        { type: "callout", tone: "warning", title: "Avoid import side effects", body: "Importing a module should not unexpectedly start services, mutate global state or execute expensive work. Hidden import-time behavior makes tests and later framework integration harder to reason about." },
        { type: "heading", id: "packages", text: "Packages are not automatically reusable libraries" },
        { type: "paragraph", text: "A Python package organizes importable code. Publishing a reusable internal distribution is a separate decision with versioning, ownership and compatibility consequences. We will not extract steward-common until a real reuse boundary exists." },
        { type: "resources", title: "Required reading", resources: [pythonTutorial, packagingGuide] },
    ],
    "Split the evolving Steward core into coherent Python modules while keeping dependency direction understandable.",
    ["Identify at least three responsibilities in the current code.", "Create a package and move responsibilities into coherent modules.", "Expose only the imports callers actually need.", "Use __name__ == '__main__' for a demo entry point if needed.", "Sketch module dependency arrows.", "Try one circular design on paper and explain how you would remove it."],
    "How can splitting code into more modules make architecture worse? What evidence would justify extracting a reusable internal package later?",
    [pythonTutorial, packagingGuide]
);

const errors = lesson(
    "Errors, Exceptions and Defensive Programming",
    50,
    [
        { type: "heading", id: "introduction", text: "Failure behavior is part of the contract" },
        { type: "paragraph", text: "A function is not fully understood until you know how it fails. Exceptions allow failure to travel up the call stack with context, but careless catching can destroy evidence or make corrupted state look successful." },
        { type: "heading", id: "raise", text: "Reject invalid state deliberately" },
        { type: "code", language: "python", caption: "Domain rejection", code: "class InvalidDependencyError(ValueError):\n    pass\n\ndef add_dependency(service_slug: str, dependency_slug: str) -> tuple[str, str]:\n    if service_slug == dependency_slug:\n        raise InvalidDependencyError(\"a service cannot depend on itself\")\n    return service_slug, dependency_slug" },
        { type: "paragraph", text: "The exception makes the rejected condition observable to the caller. The caller can decide whether to propagate it, translate it at an abstraction boundary or present it to an API client later." },
        { type: "heading", id: "catching", text: "Catch only what you can handle" },
        { type: "code", language: "python", caption: "Too broad", code: "try:\n    result = load_service_config()\nexcept Exception:\n    result = {}" },
        { type: "callout", tone: "warning", title: "This hides evidence", body: "The code above turns every bug—file errors, parsing errors, programmer mistakes—into an empty configuration. The program may continue in a misleading state. Catch specific failures when you have a deliberate recovery or translation strategy." },
        { type: "heading", id: "chaining", text: "Preserve causal context" },
        { type: "code", language: "python", caption: "Translate without erasing the cause", code: "try:\n    owner_id = int(raw_owner_id)\nexcept ValueError as error:\n    raise ValueError(\"technical owner id must be numeric\") from error" },
        { type: "heading", id: "defensive", text: "Defensive programming is not paranoia" },
        { type: "paragraph", text: "Validate assumptions at boundaries and invariants where state changes. Avoid duplicating the same validation everywhere; defensive code is most useful when each layer owns a clear responsibility." },
        { type: "resources", title: "Required reading", resources: [pythonTutorial, pythonReference] },
    ],
    "Design explicit failure behavior for Steward domain operations and preserve useful evidence.",
    ["Choose two invalid domain conditions such as self-dependency or unsupported lifecycle.", "Raise deliberate exceptions.", "Demonstrate a broad catch that hides a defect, then replace it with a specific strategy.", "Translate one exception while preserving its cause.", "Document what callers should do with each failure."],
    "When should an exception propagate, be translated or become an ordinary return value? Why is catching Exception often dangerous?"
);

const oop = lesson(
    "Object-Oriented Programming",
    55,
    [
        { type: "heading", id: "introduction", text: "Objects combine state and behavior" },
        { type: "paragraph", text: "Object-oriented design is useful when a concept owns state, invariants and behavior that belong together. It becomes harmful when every noun turns into a class hierarchy or when inheritance is used merely to reuse a few lines of code." },
        { type: "heading", id: "class", text: "Model an invariant" },
        { type: "code", language: "python", caption: "A service with lifecycle rules", code: "class Service:\n    ALLOWED_LIFECYCLES = {\"development\", \"uat\", \"production\", \"retired\"}\n\n    def __init__(self, slug: str, lifecycle: str = \"development\"):\n        self.slug = slug\n        self.change_lifecycle(lifecycle)\n\n    def change_lifecycle(self, lifecycle: str) -> None:\n        if lifecycle not in self.ALLOWED_LIFECYCLES:\n            raise ValueError(\"unsupported lifecycle\")\n        self.lifecycle = lifecycle" },
        { type: "paragraph", text: "The class owns a rule: a Service should not exist with an unsupported lifecycle. That is stronger than a passive dictionary passed through many unrelated functions." },
        { type: "heading", id: "composition", text: "Prefer composition when relationships are not identities" },
        { type: "paragraph", text: "A Service has an owning Team; it is not a kind of Team. Composition models this relationship directly. Inheritance is appropriate only when subtype substitution and shared behavior genuinely fit the domain." },
        { type: "heading", id: "dataclasses", text: "Use simpler structures when behavior is light" },
        { type: "code", language: "python", caption: "A small immutable value", code: "from dataclasses import dataclass\n\n@dataclass(frozen=True)\nclass ServiceCoordinate:\n    service_slug: str\n    environment: str" },
        { type: "callout", tone: "note", title: "Classes are not a maturity badge", body: "A clear function and dictionary can be better than a class when there is little behavior or lifecycle to protect. Use objects where they clarify ownership and invariants." },
        { type: "resources", title: "Required reading", resources: [pythonTutorial, stdlib] },
    ],
    "Model one Steward concept as an object, protect at least one invariant, and compare it with a simpler representation.",
    ["Choose Service, Team or Environment.", "Implement state plus meaningful behavior.", "Protect one invariant in the object API.", "Use composition for one relationship.", "Build a functional/dictionary alternative.", "Write a comparison explaining which version you would keep today."],
    "When does a class improve the design? When is it unnecessary? Why can inheritance increase coupling?"
);

const comprehensions = lesson(
    "Comprehensions, Iterators and Pythonic Tools",
    45,
    [
        { type: "heading", id: "introduction", text: "Pythonic should still mean readable" },
        { type: "paragraph", text: "Comprehensions, generator expressions, iterators and built-ins such as any, all, sorted, enumerate and zip can express common data operations clearly. Their value is not brevity alone; they should make intent easier to see." },
        { type: "heading", id: "comprehensions", text: "Comprehensions for simple transformations" },
        { type: "code", language: "python", caption: "Critical production services", code: "critical_slugs = [\n    service[\"slug\"]\n    for service in services\n    if service[\"criticality\"] == \"critical\"\n    and service[\"lifecycle\"] == \"production\"\n]" },
        { type: "paragraph", text: "The expression is compact because the transformation and filter are simple. If it accumulates nested conditions, exceptions or side effects, an explicit loop is usually easier to debug." },
        { type: "heading", id: "generators", text: "Generators defer work" },
        { type: "code", language: "python", caption: "Lazy iteration", code: "production_services = (\n    service for service in services\n    if service[\"lifecycle\"] == \"production\"\n)\n\nfirst = next(production_services)" },
        { type: "paragraph", text: "An iterator is consumed as you advance through it. This enables streaming-like behavior but can surprise code that expects to iterate repeatedly." },
        { type: "heading", id: "builtins", text: "Built-ins communicate intent" },
        { type: "code", language: "python", caption: "Use any/all deliberately", code: "has_unowned_critical = any(\n    s[\"criticality\"] == \"critical\" and s[\"technical_owner_id\"] is None\n    for s in services\n)" },
        { type: "callout", tone: "warning", title: "Do not golf production code", body: "A one-line expression that requires rereading is not more Pythonic than a clear five-line loop. Optimize for the next engineer's understanding." },
        { type: "resources", title: "Required reading", resources: [pythonTutorial, stdlib] },
    ],
    "Transform and inspect Steward data using comprehensions, generators and built-ins without sacrificing clarity.",
    ["Write an explicit loop that filters services.", "Rewrite it as a comprehension and compare readability.", "Create a generator expression and demonstrate that it is consumed.", "Use any() or all() for a meaningful rule.", "Use sorted() with a key to order services.", "Identify one expression you deliberately leave as a loop."],
    "When is a comprehension clearer than a loop? What changes when you use a generator expression instead of a list comprehension?"
);

const typeHints = lesson(
    "Type Hints and Static Feedback",
    50,
    [
        { type: "heading", id: "introduction", text: "Type hints expose expectations" },
        { type: "paragraph", text: "Python remains dynamically typed at runtime when you add annotations. Type hints instead provide machine-readable design information that editors, reviewers and static checkers can use before a path is executed." },
        { type: "heading", id: "functions", text: "Annotate public boundaries" },
        { type: "code", language: "python", caption: "Typed service operation", code: "from collections.abc import Iterable\n\ndef critical_service_slugs(services: Iterable[dict[str, object]]) -> list[str]:\n    return [\n        str(service[\"slug\"])\n        for service in services\n        if service.get(\"criticality\") == \"critical\"\n    ]" },
        { type: "paragraph", text: "Annotations help but the example also reveals a weakness: dict[str, object] says little about the required keys. Later we can use dataclasses, TypedDict, domain objects and Django models when stronger structure is justified." },
        { type: "heading", id: "optional", text: "Model absence explicitly" },
        { type: "code", language: "python", caption: "Optional ownership", code: "def owner_label(owner_id: int | None) -> str:\n    if owner_id is None:\n        return \"unassigned\"\n    return f\"owner:{owner_id}\"" },
        { type: "heading", id: "checker", text: "Static tools catch mismatches before execution" },
        { type: "code", language: "python", caption: "A mismatch a checker can flag", code: "def review_interval(days: int) -> str:\n    return f\"{days} days\"\n\nreview_interval(\"ninety\")" },
        { type: "callout", tone: "note", title: "Types are evidence, not proof", body: "A type checker can tell you that a value is a str, but it cannot prove that 'productionnn' is a valid lifecycle unless the type model encodes that constraint. Business rules still need domain validation and tests." },
        { type: "resources", title: "Required and supporting reading", resources: [typingDocs, mypyDocs] },
    ],
    "Add useful type annotations to the Steward core and use a static checker to expose a real mismatch.",
    ["Annotate public functions and return values.", "Represent at least one optional value explicitly.", "Run mypy or another checker.", "Introduce a mismatch deliberately and capture the diagnostic.", "Fix it.", "Document one important domain rule that the type checker still cannot prove."],
    "What does static typing add to a dynamically typed language? What can a checker prove, and what important Steward constraints remain outside its reach?",
    [typingDocs, mypyDocs]
);

const dependencies = lesson(
    "Virtual Environments and Dependency Management",
    50,
    [
        { type: "heading", id: "introduction", text: "Isolation and dependency declaration solve different problems" },
        { type: "paragraph", text: "A virtual environment answers 'where are packages installed for this project?' A dependency declaration answers 'what does this project require?' Reproducible engineering needs both, plus a deliberate versioning strategy." },
        { type: "heading", id: "direct-transitive", text: "Direct vs transitive dependencies" },
        { type: "paragraph", text: "If Steward imports package A and A internally requires B, A is your direct dependency while B is transitive. Your project should express the dependencies it intentionally uses rather than copying the entire state of one laptop without understanding it." },
        { type: "heading", id: "constraints", text: "Version constraints are policy" },
        { type: "code", language: "toml", caption: "Illustrative project metadata", code: "[project]\nname = \"steward-core\"\nversion = \"0.1.0\"\nrequires-python = \">=3.12\"\ndependencies = [\n  \"rich>=13,<15\",\n]" },
        { type: "paragraph", text: "An unbounded dependency maximizes update freedom but also allows unexpected change. An exact pin maximizes repeatability for one environment but increases update maintenance. Later Delivery Engineer work will deepen lockfiles, internal repositories, SBOMs and provenance." },
        { type: "heading", id: "clean-room", text: "The clean-environment test" },
        { type: "code", language: "bash", caption: "Recreate instead of trusting your machine", code: "deactivate 2>/dev/null || true\nrm -rf .venv\npython3 -m venv .venv\nsource .venv/bin/activate\npython -m pip install -e .\npython -m steward_core.demo" },
        { type: "callout", tone: "steward", title: "Future internal distribution", body: "Later, genuinely reusable packages such as steward-common will be versioned and published through the internal Nexus/PyPI path. Do not manufacture that package now; first build enough real code to discover a reuse boundary." },
        { type: "resources", title: "Required reading", resources: [packagingGuide, venvDocs] },
    ],
    "Make the Steward Python core reproducible from a clean environment and explain its dependency constraints.",
    ["Declare direct dependencies in project metadata.", "Identify at least one transitive dependency.", "Delete and recreate .venv.", "Install the project from its declaration.", "Experiment with one version constraint.", "Record why you chose the constraint and what still prevents perfect reproducibility."],
    "Why is a virtual environment not a dependency specification? Compare a broad version range, a narrow range and an exact pin as engineering trade-offs.",
    [packagingGuide, venvDocs]
);

const debugging = lesson(
    "Debugging Python Programs",
    55,
    [
        { type: "heading", id: "introduction", text: "Debugging is evidence-driven investigation" },
        { type: "paragraph", text: "Engineering Apprentice established the debugging mindset. Python now gives us concrete evidence sources: tracebacks, repr(), assertions, logging, breakpoints and the debugger. The goal is not to change code until the symptom disappears; it is to find the explanation that best fits the evidence." },
        { type: "heading", id: "traceback", text: "Read the traceback as a call path" },
        { type: "code", language: "text", caption: "Simplified traceback", code: "Traceback (most recent call last):\n  File \"demo.py\", line 20, in <module>\n    promote(service)\n  File \"lifecycle.py\", line 14, in promote\n    owner_id = int(service[\"technical_owner_id\"])\nValueError: invalid literal for int() with base 10: 'unassigned'" },
        { type: "paragraph", text: "The last line shows where the exception surfaced, not necessarily where the invalid state originated. Walk upward through the call chain and ask where 'unassigned' first entered the system and which layer should have prevented it." },
        { type: "heading", id: "hypotheses", text: "Create competing hypotheses" },
        { type: "list", items: ["The caller passed the wrong representation.", "A normalization function converted None into 'unassigned'.", "Test data does not match the actual service schema."] },
        { type: "heading", id: "debugger", text: "Inspect state deliberately" },
        { type: "code", language: "python", caption: "Breakpoint-driven inspection", code: "def promote(service):\n    breakpoint()\n    owner_id = int(service[\"technical_owner_id\"])\n    return owner_id" },
        { type: "callout", tone: "warning", title: "Do not shotgun-debug", body: "Changing several lines, adding retries and swallowing exceptions at once destroys your ability to know which hypothesis was correct. Prefer the smallest experiment that distinguishes explanations." },
        { type: "heading", id: "evidence-log", text: "Keep a chronological evidence log" },
        { type: "paragraph", text: "Record symptom, timestamp/order, hypothesis, experiment, observation and conclusion. This prevents circular investigation and creates evidence you can later use in incident work." },
        { type: "resources", title: "Required and supporting reading", resources: [pdbDocs, pythonTutorial] },
    ],
    "Diagnose a non-trivial Steward Python defect using a traceback, competing hypotheses and debugger/inspection evidence.",
    ["Introduce or select a defect crossing at least two function calls.", "Capture the traceback before editing.", "Write at least two hypotheses.", "Use breakpoint(), pdb, logging or targeted prints to falsify one.", "Fix the root cause rather than suppressing the symptom.", "Rerun the original reproduction and record the evidence chain."],
    "Why can the final traceback frame differ from the true origin of invalid state? Describe how one experiment falsified a hypothesis in your investigation.",
    [pdbDocs, pythonTutorial]
);

const lab: Lesson = {
    id: "programming-with-python-lab-build-a-small-python-service-core",
    title: "Lab: Build a Small Python Service Core",
    activities: [
        {
            id: "programming-with-python-lab-build-a-small-python-service-core-brief",
            title: "Service Core Design Brief",
            estimatedMinutes: 30,
            content: {
                type: "reading",
                body: "Build the framework-independent beginning of Steward.",
                blocks: [
                    { type: "heading", id: "purpose", text: "Purpose" },
                    { type: "paragraph", text: "You now have enough Python to build something coherent without Django. The objective is not to predict the final architecture. It is to create a small service-registry core with real rules so the next modules have meaningful behavior to expose through HTTP and persist in PostgreSQL." },
                    { type: "heading", id: "scope", text: "Choose a deliberately narrow slice" },
                    { type: "list", items: ["A Service has a slug, name, lifecycle and criticality.", "A Service can reference an owning Team identifier.", "A Service cannot depend on itself.", "Duplicate dependencies are rejected.", "Unsupported lifecycle and criticality values are rejected."] },
                    { type: "callout", tone: "steward", title: "Do not build Django yet", body: "This lab is about Python domain behavior and package boundaries. Django/DRF arrives later as a framework around the appropriate parts of this core, not as the source of every business rule." },
                    { type: "heading", id: "quality", text: "What good looks like" },
                    { type: "paragraph", text: "A reviewer should be able to run the package, create valid service data, observe rejected invalid states, inspect type annotations, understand module boundaries and reproduce the environment from project metadata." },
                    { type: "resources", title: "Supporting reading", resources: [pythonTutorial, packagingGuide, typingDocs] },
                ],
            },
        },
        {
            id: "programming-with-python-lab-build-a-small-python-service-core-build",
            title: "Build the Service Core",
            estimatedMinutes: 180,
            content: {
                type: "practical",
                objective: "Build a credible framework-free Python core for Steward's service registry that later Builder modules can evolve rather than replace.",
                scenario: "Steward will later become a Django/DRF + PostgreSQL system. For now, implement the smallest domain/service core that proves real rules and clean Python boundaries.",
                instructions: ["Create a package structure with deliberate modules.", "Model Service and at least one related concept using classes, dataclasses or simpler structures where justified.", "Enforce allowed lifecycle and criticality values.", "Reject self-dependencies and duplicate dependencies.", "Use explicit exceptions for invalid operations.", "Add type annotations to public functions/methods.", "Provide a small executable demo that exercises happy, boundary and failure paths.", "Declare project metadata/dependencies and prove a clean-environment install.", "Introduce one deliberate bug, investigate it with an evidence log and fix it.", "Write a short architecture note identifying what should remain framework-independent when Django arrives and what you expect the framework to own."],
                deliverables: ["Runnable steward-core package", "Domain rules and examples", "Project dependency metadata", "Type-check evidence", "Failure demonstrations", "Debugging evidence log", "Framework-boundary note"],
                completionCriteria: ["The package demonstrates real Steward domain behavior rather than generic syntax exercises.", "Invalid state is deliberately rejected.", "The environment can be recreated.", "Module dependencies can be explained.", "At least one design is intentionally simple rather than over-engineered.", "The learner can identify which future concerns belong to Django/DRF or PostgreSQL rather than this core."],
                resources: [packagingGuide, typingDocs, pdbDocs],
            },
        },
        {
            id: "programming-with-python-lab-build-a-small-python-service-core-review",
            title: "Python Module Review",
            estimatedMinutes: 25,
            content: {
                type: "reflection",
                prompt: "Defend the current design of your Steward Python core. Which rule is best protected? Which part is over-engineered or still too weak? Which data representation do you expect Django/PostgreSQL to replace? What would you deliberately refuse to redesign until later evidence exists? Which Python capability from this module was hardest to apply without copying an example?",
            },
        },
    ],
};

export const programmingWithPythonRichLessons: Lesson[] = [
    environment,
    valuesTypes,
    controlFlow,
    functions,
    collections,
    modules,
    errors,
    oop,
    comprehensions,
    typeHints,
    dependencies,
    debugging,
    lab,
];
