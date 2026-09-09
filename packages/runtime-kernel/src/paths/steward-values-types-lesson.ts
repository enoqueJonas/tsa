import type { LearningResource, LessonBlock } from "../activities";
import type { Lesson } from "./lesson";

const pythonTutorial: LearningResource = { title: "Python Tutorial", url: "https://docs.python.org/3/tutorial/" };
const pythonReference: LearningResource = { title: "Python Language Reference", url: "https://docs.python.org/3/reference/" };

const blocks: LessonBlock[] = [
    { type: "heading", id: "introduction", text: "Introduction" },
    { type: "paragraph", text: "Steward will catalogue technical services, teams, environments and dependencies. Before any of that reaches Django or PostgreSQL, Python has to represent the data correctly. This lesson builds the mental model underneath those later frameworks: names refer to objects, objects have types, values can be mutable or immutable, and external representations must be parsed before they become trusted domain data." },
    { type: "callout", tone: "steward", title: "Steward connection", body: "A future request may contain a service slug, criticality, lifecycle state and technical-owner identifier. JSON can carry those values, but JSON does not decide whether they are valid Steward domain values. Parsing, representation and validation remain engineering responsibilities." },
    { type: "heading", id: "outcomes", text: "Learning outcomes" },
    { type: "list", items: ["Explain the relationship between Python names, objects, values and types.", "Use strings, integers, floating-point numbers, booleans and None deliberately.", "Distinguish equality from identity.", "Explain why mutability matters when multiple names reference one object.", "Convert external text deliberately and treat conversion failures as useful boundary evidence.", "Recognize when a technically valid Python representation is still a poor domain representation."] },
    { type: "heading", id: "names-objects", text: "Names reference objects" },
    { type: "paragraph", text: "A variable-as-a-box metaphor is convenient at first, but Python assignment is better understood as binding a name to an object. A name is not the object itself. Multiple names can refer to the same object, which matters immediately once mutation enters the picture." },
    { type: "code", language: "python", caption: "Representing Steward service data", code: "service_name = \"Payments API\"\nservice_slug = \"payments-api\"\ncriticality = \"high\"\nproduction = True\ntechnical_owner_id = None\n\nprint(type(service_name))        # str\nprint(type(production))          # bool\nprint(type(technical_owner_id))  # NoneType" },
    { type: "paragraph", text: "The type tells us what operations an object supports. It does not tell us whether the value is valid for the Steward domain. The string 'extremely-important' is a perfectly valid Python string even if Steward only permits low, medium, high and critical as criticality values." },
    { type: "heading", id: "mutability", text: "Mutability and aliasing" },
    { type: "paragraph", text: "Lists and dictionaries are mutable. If two names refer to the same mutable object, changing it through one name changes the object observed through the other name as well." },
    { type: "code", language: "python", caption: "Two names, one mutable object", code: "dependencies = [\"authentication-service\"]\nservice_dependencies = dependencies\n\nservice_dependencies.append(\"notification-service\")\n\nprint(dependencies)\n# ['authentication-service', 'notification-service']" },
    { type: "callout", tone: "warning", title: "Common mistake", body: "Assignment does not automatically copy a list or dictionary. Shared mutable state can create subtle bugs when ownership is unclear. Later, database relationships and API serializers change the mechanics, but not the need to reason carefully about state ownership." },
    { type: "heading", id: "core-types", text: "Core values and types" },
    { type: "heading", id: "strings", text: "Strings", level: 3 },
    { type: "paragraph", text: "Service names, slugs, lifecycle states and criticality labels are naturally represented as strings at some boundaries. But a string can carry many meanings, so domain validation must narrow the valid set." },
    { type: "code", language: "python", caption: "Strings need domain meaning", code: "service_slug = \"payments-api\"\nlifecycle = \"production\"\ncriticality = \"high\"\n\nallowed_lifecycles = {\"development\", \"uat\", \"production\", \"retired\"}\n\nif lifecycle not in allowed_lifecycles:\n    raise ValueError(\"unsupported lifecycle\")" },
    { type: "heading", id: "numbers", text: "Numbers", level: 3 },
    { type: "paragraph", text: "Steward can use numeric values for things such as review intervals, health scores, retry counts or target availability. Integers and floating-point numbers support different numeric behavior, and the domain determines which representation is appropriate." },
    { type: "code", language: "python", caption: "Numeric values in the service domain", code: "review_interval_days = 90\navailability_target = 99.9\nopen_risk_count = 3\n\nprint(review_interval_days + 30)\nprint(availability_target >= 99.5)" },
    { type: "callout", tone: "note", title: "Representation follows the domain", body: "Do not choose a type merely because Python permits it. Exact money, timestamps, identifiers and constrained states often deserve more deliberate representations than a raw float, integer or unrestricted string. Later lessons will introduce stronger models when they are justified." },
    { type: "heading", id: "booleans-none", text: "Booleans and None", level: 3 },
    { type: "paragraph", text: "True and False represent boolean state. None represents absence. These are not interchangeable. A service can be non-production, have zero open risks, and have no technical owner assigned yet; each state means something different." },
    { type: "code", language: "python", caption: "Different kinds of state", code: "production = False\nopen_risk_count = 0\ntechnical_owner_id = None\n\nprint(production is False)\nprint(open_risk_count == 0)\nprint(technical_owner_id is None)" },
    { type: "heading", id: "equality-identity", text: "Equality is not identity" },
    { type: "paragraph", text: "The == operator asks whether values compare equal. The is operator asks whether two references point to the same object. In application code, value comparisons normally use == while identity checks are especially useful for singleton values such as None." },
    { type: "code", language: "python", caption: "Value equality and object identity", code: "first = [\"auth-service\"]\nsecond = [\"auth-service\"]\nalias = first\n\nprint(first == second)  # True\nprint(first is second)  # False\nprint(first is alias)   # True\n\ntechnical_owner_id = None\nif technical_owner_id is None:\n    print(\"Owner still needs to be assigned\")" },
    { type: "heading", id: "boundaries", text: "External representations and conversion" },
    { type: "paragraph", text: "HTTP, environment variables, command-line arguments and CSV files frequently represent data as text. Treat that text as an external representation rather than already-trusted domain state. Conversion can fail, and that failure should remain visible enough to diagnose and return a deliberate response later." },
    { type: "code", language: "python", caption: "Parsing an external review interval", code: "raw_review_interval = \"90\"\nreview_interval_days = int(raw_review_interval)\n\nraw_owner_id = \"not-a-number\"\ntry:\n    technical_owner_id = int(raw_owner_id)\nexcept ValueError as error:\n    print(f\"Invalid technical owner id: {error}\")" },
    { type: "callout", tone: "steward", title: "Think ahead to the API", body: "Django REST Framework serializers will eventually provide a consistent boundary for parsing and validation. They do not replace this reasoning. They automate part of a responsibility you first need to understand." },
    { type: "heading", id: "assignment", text: "Assignment" },
    { type: "list", ordered: true, items: ["Open a Python REPL and model a Steward service using a name, slug, lifecycle, criticality, production flag and optional technical-owner ID. Inspect each with type() and repr().", "Create two equal dependency lists and prove the difference between == and is. Then create an alias and mutate the list through that alias.", "Parse the strings '90', '0090' and 'ninety' as integers. Record what succeeds and what fails.", "Create a set of valid lifecycle states and reject one invalid value deliberately.", "Write three cases where False, 0, an empty string and None would communicate materially different domain states in Steward."] },
    { type: "resources", title: "Required and supporting reading", resources: [pythonTutorial, pythonReference] },
    { type: "heading", id: "knowledge-check", text: "Knowledge check" },
    { type: "list", items: ["Why is a Python name not the same thing as an object?", "What does dynamic typing mean, and what does it not mean?", "When should is be used instead of ==?", "Why can aliasing a mutable object cause surprising behavior?", "Why is a valid Python string not automatically a valid lifecycle or criticality value?", "Why should external text be parsed before it becomes trusted Steward domain data?"] }
];

export const stewardValuesAndTypesLesson: Lesson = {
    id: "programming-with-python-python-syntax-values-and-types",
    title: "Python Syntax, Values and Types",
    activities: [
        {
            id: "programming-with-python-python-syntax-values-and-types-concepts",
            title: "Python Syntax, Values and Types: Concepts and Mental Model",
            estimatedMinutes: 45,
            content: {
                type: "reading",
                body: "Names reference objects, objects have types, and external representations need deliberate parsing and validation.",
                resources: [pythonTutorial],
                blocks
            }
        },
        {
            id: "programming-with-python-python-syntax-values-and-types-practice",
            title: "Python Syntax, Values and Types: Engineering Practice",
            estimatedMinutes: 45,
            content: {
                type: "practical",
                objective: "Model representative Steward service-registry values and prove how type, equality, identity, conversion and mutability affect them.",
                scenario: "Work in the framework-free Steward Python workspace. The goal is to understand the data representations that later Django models, serializers and PostgreSQL columns will formalize.",
                instructions: ["Create representative service, team, environment and dependency values.", "Inspect values with type() and repr().", "Demonstrate an aliasing mutation with a dependency collection.", "Compare == and is with equal-but-distinct objects.", "Convert at least two external string representations and capture one conversion failure.", "Define one constrained domain value such as lifecycle or criticality and reject an invalid option."],
                deliverables: ["Runnable Python evidence", "Short note distinguishing Python type validity from Steward domain validity"],
                completionCriteria: ["The examples use the locked Steward service-registry domain.", "Equality, identity and mutability are demonstrated rather than only described.", "At least one external-representation failure is preserved as evidence."]
            }
        },
        {
            id: "programming-with-python-python-syntax-values-and-types-check",
            title: "Python Syntax, Values and Types: Knowledge Check",
            estimatedMinutes: 10,
            content: {
                type: "reflection",
                prompt: "Explain names vs objects, equality vs identity, aliasing, dynamic typing and boundary conversion using Steward examples. Then identify one value that Python can represent easily but that Steward should constrain more strongly at the domain boundary."
            }
        }
    ]
};
