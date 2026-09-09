import type { LearningResource, LessonBlock } from "../activities";
import type { Lesson } from "./lesson";

const pythonTutorial: LearningResource = { title: "Python Tutorial", url: "https://docs.python.org/3/tutorial/" };
const pythonReference: LearningResource = { title: "Python Language Reference", url: "https://docs.python.org/3/reference/" };
const typingDocs: LearningResource = { title: "Python typing documentation", url: "https://docs.python.org/3/library/typing.html" };
const venvDocs: LearningResource = { title: "Python venv documentation", url: "https://docs.python.org/3/library/venv.html" };
const packagingGuide: LearningResource = { title: "Python Packaging User Guide", url: "https://packaging.python.org/en/latest/" };

function slug(value: string) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function deepLesson(
    title: string,
    body: string,
    objective: string,
    instructions: string[],
    reflection: string,
    resources: LearningResource[] = [pythonTutorial],
    blocks?: LessonBlock[]
): Lesson {
    const id = `programming-with-python-${slug(title)}`;
    return {
        id,
        title,
        activities: [
            { id: `${id}-concepts`, title: `${title}: Concepts and Mental Model`, estimatedMinutes: 30, content: { type: "reading", body, resources, blocks } },
            { id: `${id}-practice`, title: `${title}: Engineering Practice`, estimatedMinutes: 45, content: { type: "practical", objective, scenario: "Work in a small Python workspace that gradually becomes the domain/service core for Steward API. Keep useful code, notes and experiments instead of treating each lesson as a disposable syntax puzzle.", instructions, deliverables: ["Working Python evidence", "Short engineering note explaining behavior and one edge case"], completionCriteria: ["The result runs and can be demonstrated.", "The learner can explain the language behavior used rather than only reproduce syntax.", "At least one failure, boundary or alternative is investigated."] } },
            { id: `${id}-check`, title: `${title}: Knowledge Check`, estimatedMinutes: 10, content: { type: "reflection", prompt: reflection } },
        ],
    };
}

const valuesAndTypesBlocks: LessonBlock[] = [
    { type: "heading", id: "introduction", text: "Introduction" },
    { type: "paragraph", text: "Programs receive external representations and turn them into values that carry meaning. Before Steward has HTTP endpoints, serializers or database models, you need a precise mental model of what Python is manipulating: objects, names that reference those objects, and operations allowed by their types." },
    { type: "callout", tone: "steward", title: "Steward connection", body: "A future service-registration request may arrive as JSON containing a service name, lifecycle state, criticality, owning team and optional technical owner. Those bytes do not become trustworthy domain data merely because Python can represent them. Parsing, type conversion and validation are different responsibilities." },

    { type: "heading", id: "outcomes", text: "Learning outcomes" },
    { type: "list", items: ["Explain the relationship between names, objects, values and types.", "Use Python's core scalar types deliberately: integers, floating-point numbers, strings, booleans and None.", "Distinguish equality from identity.", "Explain why mutability matters when multiple names reference an object.", "Convert external text deliberately and recognize conversion failure as a boundary concern.", "Identify representations that are technically valid Python but poor domain choices."] },

    { type: "heading", id: "names-objects", text: "Names reference objects" },
    { type: "paragraph", text: "A useful beginner shortcut is to imagine a variable as a box. It eventually becomes misleading. In Python, assignment binds a name to an object. The name is not the object, and assigning another name to the same object does not automatically create a copy." },
    { type: "code", language: "python", caption: "Names bound to service-registry values", code: "service_name = \"Payments API\"\ncriticality = \"high\"\nproduction = True\ntechnical_owner = None\n\nprint(type(service_name))      # <class 'str'>\nprint(type(criticality))       # <class 'str'>\nprint(type(production))        # <class 'bool'>\nprint(type(technical_owner))   # <class 'NoneType'>" },
    { type: "paragraph", text: "This distinction becomes important when objects are mutable. Two names can refer to the same list or dictionary, so a mutation observed through one name is visible through the other." },
    { type: "code", language: "python", caption: "Aliasing a mutable dependency list", code: "dependencies = [\"auth-service\"]\nservice_dependencies = dependencies\n\nservice_dependencies.append(\"notification-service\")\n\nprint(dependencies)\n# ['auth-service', 'notification-service']" },
    { type: "callout", tone: "warning", title: "Common mistake", body: "Do not assume assignment copies a list or dictionary. When shared mutable state would be dangerous, make the ownership and copying decision explicit." },

    { type: "heading", id: "core-types", text: "Core values and types" },
    { type: "paragraph", text: "Types describe the operations an object supports. Python is dynamically typed: a name is not permanently declared as one type, but each object still has a type. That flexibility does not remove the need for deliberate domain modeling." },
    { type: "heading", id: "numbers", text: "Numbers", level: 3 },
    { type: "code", language: "python", caption: "Numeric behavior", code: "review_interval_days = 90   # int\navailability_target = 99.9  # float\n\nprint(review_interval_days + 30)\nprint(availability_target / 100)" },
    { type: "callout", tone: "note", title: "A type is not a domain rule", body: "Python can represent many numeric values, but Steward still has to decide what values are valid. A review interval of -30 is a valid integer and still an invalid business value." },

    { type: "heading", id: "strings", text: "Strings", level: 3 },
    { type: "paragraph", text: "Strings represent text, but external systems also encode identifiers, dates, numbers and booleans as text. A string that looks like a number is still a string until you deliberately parse it." },
    { type: "code", language: "python", caption: "Text is not automatically domain data", code: "raw_review_interval = \"90\"\n\nprint(raw_review_interval + \"30\")  # '9030'\nreview_interval_days = int(raw_review_interval)\nprint(review_interval_days + 30)      # 120" },

    { type: "heading", id: "booleans-none", text: "Booleans and None", level: 3 },
    { type: "paragraph", text: "True and False represent boolean state. None represents the absence of a value, not an empty string, zero or False. Those distinctions matter in Steward: 'no technical owner assigned', 'zero open incidents', and 'not production-facing' are different facts." },
    { type: "code", language: "python", caption: "Absence is a domain decision", code: "technical_owner = None\nopen_incidents = 0\nproduction_facing = False\n\nprint(technical_owner is None)    # True\nprint(open_incidents == 0)        # True\nprint(production_facing is False) # True" },

    { type: "heading", id: "equality-identity", text: "Equality is not identity" },
    { type: "paragraph", text: "The == operator asks whether values compare equal. The is operator asks whether two references point to the same object. They answer different questions. In normal application code, use equality for value comparison and reserve identity primarily for singleton objects such as None." },
    { type: "code", language: "python", caption: "Two different questions", code: "first = [\"auth-service\"]\nsecond = [\"auth-service\"]\nalias = first\n\nprint(first == second)  # True: same value\nprint(first is second)  # False: different objects\nprint(first is alias)   # True: same object\n\ntechnical_owner = None\nif technical_owner is None:\n    print(\"No technical owner assigned\")" },

    { type: "heading", id: "boundaries", text: "Conversion at system boundaries" },
    { type: "paragraph", text: "External input should be treated as an untrusted representation. Conversion is an operation that can fail, and that failure is useful information. Swallowing it or silently inventing a default can turn invalid input into corrupted domain state." },
    { type: "code", language: "python", caption: "Make conversion failure visible", code: "raw_review_interval = \"90\"\nreview_interval_days = int(raw_review_interval)\n\ninvalid_interval = \"quarterly\"\ntry:\n    review_interval_days = int(invalid_interval)\nexcept ValueError as error:\n    print(f\"Invalid review interval: {error}\")" },
    { type: "callout", tone: "steward", title: "Think ahead to the API", body: "When Django REST Framework arrives, serializers will help parse and validate incoming service-registry representations. The framework does not replace this mental model. It gives us a boundary at which to apply it consistently." },

    { type: "heading", id: "assignment", text: "Assignment" },
    { type: "list", ordered: true, items: ["Open a Python REPL and create representative Steward values: service slug, display name, lifecycle, criticality, review interval, production flag and optional technical owner. Inspect each with type() and repr().", "Create two equal dependency lists and prove the difference between == and is. Then create an alias and mutate the list through the alias.", "Parse the strings '90', '090' and 'quarterly' as integers. Record what succeeds, what fails and what that implies for API validation.", "Write down three Steward examples where None, an empty string and zero would mean different things.", "Read the linked Python tutorial sections as reinforcement, not as a substitute for the experiments above."] },
    { type: "resources", title: "Required and supporting reading", resources: [pythonTutorial, pythonReference] },

    { type: "heading", id: "knowledge-check", text: "Knowledge check" },
    { type: "list", items: ["Why is a Python name not the same thing as an object?", "What does dynamic typing mean, and what does it not mean?", "When should you use is instead of ==?", "Why can aliasing a mutable dependency list create surprising behavior?", "Why should external service-registry input be parsed and validated before becoming trusted domain data?", "Why can a value have the correct Python type and still violate a Steward domain rule?"] },
];

export const programmingWithPythonDeepLessons: Lesson[] = [
    deepLesson("Setting Up a Python Engineering Environment", "A Python project begins with control over the interpreter and execution environment. Learn how the shell resolves python, how interpreter versions differ from project dependencies, why python -m pip removes ambiguity, and why isolated environments protect one project from another.", "Create and verify an isolated Python workspace whose interpreter and package installation location you can prove.", ["Inspect the Python executable, version and pip association.", "Create and activate a project-local virtual environment.", "Prove which interpreter is executing.", "Install one dependency and inspect where it lives.", "Record reproducible setup commands."], "Explain the difference between installing Python, selecting an interpreter, activating a virtual environment and installing a dependency.", [venvDocs, packagingGuide]),
    deepLesson("Python Syntax, Values and Types", "Names reference objects and types determine supported behavior.", "Model Steward service-registry values and prove how type, equality, identity, conversion and mutability affect them.", ["Create representative service identifiers, lifecycle values, criticality values, flags and optional ownership values.", "Inspect each value with type() and repr().", "Demonstrate safe conversion and a conversion failure.", "Compare == and is.", "Record values that require validation at the future API boundary."], "Explain names vs objects, equality vs identity, aliasing and boundary conversion in your own words.", [pythonTutorial], valuesAndTypesBlocks),
    deepLesson("Control Flow", "Control flow turns data into behavior. Conditions should express domain decisions clearly; loops should describe repeated work without hiding state changes.", "Implement a small Steward lifecycle or service-eligibility rule with explicit branches and boundary cases.", ["Define the rule in plain language.", "Implement clear condition ordering.", "Exercise happy, rejected and boundary inputs.", "Refactor a nested version.", "Identify paths future tests must cover."], "How do you determine meaningful behavioral paths? When does early return improve clarity?"),
    deepLesson("Functions and Scope", "Functions create behavioral boundaries with inputs, outputs, side effects and failure behavior.", "Refactor procedural Steward service-registry logic into functions with explicit contracts.", ["Start with a script containing three responsibilities.", "Extract coherent functions.", "Avoid shared global state.", "Demonstrate one scope bug.", "Document one function contract."], "Explain LEGB and why mutable default arguments are dangerous."),
    deepLesson("Collections and Data Structures", "Lists, tuples, dictionaries and sets encode different guarantees around ordering, uniqueness, keyed lookup and mutability.", "Represent Steward services, teams and dependencies with built-in collections and justify each choice.", ["Model ordered environments, unique dependency slugs and keyed service records.", "Perform lookup and iteration.", "Demonstrate mutation/aliasing.", "Compare two structures.", "Identify when a class or database model becomes appropriate."], "Choose between list, tuple, set and dict for different Steward requirements."),
    deepLesson("Modules and Packages", "As a program grows, file boundaries become dependency boundaries.", "Split the service core into coherent modules without circular dependencies.", ["Identify mixed responsibilities.", "Create a package with coherent modules.", "Use deliberate imports.", "Inspect __name__ behavior.", "Sketch dependency direction."], "How can moving code into more files make architecture worse?", [pythonTutorial, packagingGuide]),
    deepLesson("Errors, Exceptions and Defensive Programming", "Failures are part of a function contract; broad catching can destroy evidence.", "Design explicit failure behavior for a Steward service operation.", ["Choose two invalid conditions.", "Define rejection points.", "Translate exceptions only at abstraction boundaries.", "Demonstrate why broad catching harms diagnosis.", "Record caller-facing failure contracts."], "When should an exception propagate, be wrapped or become a normal domain result?"),
    deepLesson("Object-Oriented Programming", "Objects are useful when data and behavior share invariants and lifecycle; not every noun deserves a class.", "Model one Steward concept as an object and compare it with a simpler representation.", ["Identify state plus behavior.", "Protect invariants.", "Use composition.", "Build a functional alternative.", "Compare approaches."], "When is a class unnecessary? How can inheritance increase coupling?"),
    deepLesson("Comprehensions, Iterators and Pythonic Tools", "Python offers concise traversal tools, but concision is not automatically clarity.", "Transform Steward service-registry data using expressive iteration while preserving readability.", ["Start with an explicit loop.", "Compare a comprehension.", "Use a generator.", "Demonstrate iterator consumption.", "Use any/all or sorting clearly."], "When is a comprehension worse than a loop?"),
    deepLesson("Type Hints and Static Feedback", "Type annotations make interfaces visible to humans and static tools while Python remains dynamically typed at runtime.", "Add useful type information and expose one mismatch.", ["Annotate public functions.", "Represent optional values explicitly.", "Run a static checker.", "Introduce and fix a mismatch.", "Identify something types cannot prove."], "What does a type checker know, and what does it not know?", [typingDocs, { title: "mypy documentation", url: "https://mypy.readthedocs.io/en/stable/" }]),
    deepLesson("Virtual Environments and Dependency Management", "Environment isolation and dependency declaration solve different problems.", "Make the service core reproducible from a clean environment.", ["Declare direct dependencies.", "Distinguish transitive dependencies.", "Recreate the environment.", "Experiment with a version constraint.", "Document remaining reproducibility gaps."], "Why is a virtual environment not a dependency specification?", [venvDocs, packagingGuide]),
    deepLesson("Debugging Python Programs", "Apply evidence-first debugging to Python using tracebacks, state inspection and hypotheses.", "Diagnose a non-trivial Python defect from evidence.", ["Capture the traceback before editing.", "Form two hypotheses.", "Falsify one with inspection/debugger evidence.", "Fix the cause.", "Rerun and record evidence."], "Why might the traceback line not contain the root cause?", [{ title: "Python pdb documentation", url: "https://docs.python.org/3/library/pdb.html" }, pythonTutorial]),
    { id: "programming-with-python-lab-build-a-small-python-service-core", title: "Lab: Build a Small Python Service Core", activities: [
        { id: "programming-with-python-lab-build-a-small-python-service-core-brief", title: "Service Core Design Brief", estimatedMinutes: 20, content: { type: "reading", body: "Build a framework-free Python core around a narrow slice of Steward's service-registry domain: services, teams, ownership, lifecycle or dependencies. The goal is to expose decisions about validation, state, errors, modules and interfaces before Django arrives." } },
        { id: "programming-with-python-lab-build-a-small-python-service-core-build", title: "Build the Service Core", estimatedMinutes: 150, content: { type: "practical", objective: "Build a credible Python service-registry core that becomes the conceptual starting point for Steward API.", scenario: "Steward will later become a Django/DRF service. Model a small slice of service ownership, lifecycle or dependency behavior with plain Python first.", instructions: ["Define a narrow Steward domain problem and 3–5 rules.", "Design module boundaries.", "Implement domain behavior.", "Reject invalid state deliberately.", "Add type annotations.", "Demonstrate happy, boundary and failure paths.", "Recreate in a clean environment.", "Debug one deliberate defect.", "Record what should remain framework-independent."], deliverables: ["Runnable service-registry core package", "Domain rules", "Dependency declaration", "Failure evidence", "Debugging log", "Framework-independence note"], completionCriteria: ["Real Steward domain behavior is demonstrated.", "Boundaries can be explained.", "Failures are observable.", "A clean environment reproduces the project."] } },
        { id: "programming-with-python-lab-build-a-small-python-service-core-review", title: "Python Module Review", estimatedMinutes: 20, content: { type: "reflection", prompt: "Which part demonstrates Python understanding? Which is over-engineered? Which Steward assumption is dangerous? What would you refuse to redesign until later evidence exists?" } },
    ] },
];
