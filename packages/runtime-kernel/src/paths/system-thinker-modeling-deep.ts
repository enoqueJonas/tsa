import type { Lesson } from "./lesson";
import type { LearningResource, LessonBlock } from "../activities/content";

const c4Model: LearningResource = { title: "C4 model", url: "https://c4model.com/" };
const umlState: LearningResource = { title: "UML State Machine Diagrams", url: "https://www.uml-diagrams.org/state-machine-diagrams.html" };
const arc42: LearningResource = { title: "arc42 Documentation Template", url: "https://arc42.org/overview" };
const mermaid: LearningResource = { title: "Mermaid documentation", url: "https://mermaid.js.org/" };

function slug(value: string) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function richLesson(
    title: string,
    introduction: string,
    outcomes: string[],
    sections: { title: string; paragraphs: string[]; code?: { language: string; code: string; caption?: string } }[],
    objective: string,
    instructions: string[],
    questions: string[],
    resources: LearningResource[],
): Lesson {
    const id = `modeling-software-systems-${slug(title)}`;
    const blocks: LessonBlock[] = [
        { type: "paragraph", text: introduction },
        { type: "heading", id: "learning-outcomes", text: "Learning outcomes", level: 2 },
        { type: "list", items: outcomes },
    ];

    for (const section of sections) {
        blocks.push({ type: "heading", id: slug(section.title), text: section.title, level: 2 });
        for (const text of section.paragraphs) blocks.push({ type: "paragraph", text });
        if (section.code) {
            blocks.push(section.code.caption
                ? { type: "code", language: section.code.language, code: section.code.code, caption: section.code.caption }
                : { type: "code", language: section.code.language, code: section.code.code });
        }
    }

    blocks.push({
        type: "callout",
        tone: "steward",
        title: "Steward connection",
        body: "The model must answer a real engineering question about Steward. Do not draw database tables, Django classes or infrastructure unless that level of detail is necessary for the question being asked.",
    });
    blocks.push({ type: "resources", title: "Required and supporting reading", resources });

    return {
        id,
        title,
        activities: [
            { id: `${id}-reading`, title, estimatedMinutes: 32, content: { type: "reading", body: introduction, blocks } },
            {
                id: `${id}-practice`,
                title: `${title}: Engineering Practice`,
                estimatedMinutes: 45,
                content: {
                    type: "practical",
                    objective,
                    scenario: "Use Steward API v1 and the requirements/context artifacts from earlier System Thinker modules as evidence. Create models for reasoning, not decoration.",
                    instructions,
                    deliverables: ["Reviewable model or diagram", "Short note explaining the question, abstraction level, assumptions and omissions"],
                    completionCriteria: ["The model answers a stated engineering question.", "The abstraction level is deliberate.", "Important relationships are labeled with meaning rather than shown as unexplained arrows."],
                },
            },
            { id: `${id}-check`, title: `${title}: Knowledge Check`, estimatedMinutes: 10, content: { type: "reflection", prompt: questions.map((q, i) => `${i + 1}. ${q}`).join("\n") } },
        ],
    };
}

export const modelingSoftwareSystemsDeepLessons: Lesson[] = [
    richLesson(
        "Why We Model Systems",
        "A software model is a deliberate simplification. It excludes detail so that a specific question becomes easier to reason about. The value of a model comes from the decisions it supports, not from how many boxes it contains.",
        ["Explain why every useful model has a purpose and audience.", "Distinguish a model from a complete description of reality.", "Choose an abstraction level that matches an engineering question.", "Recognize stale or decorative diagrams as engineering risk."],
        [
            { title: "Models are selective", paragraphs: ["A source tree is not automatically an architecture model. A database schema is useful for data questions but poor for explaining who uses the system. A context diagram is useful for system boundaries but intentionally says almost nothing about internal code.", "Before drawing, write the question. Examples: Which external systems does Steward depend on? Which responsibilities belong to the API versus PostgreSQL? What states can a Service move through? The question determines what belongs in the model."] },
            { title: "Accuracy includes useful omission", paragraphs: ["A model that includes every class, endpoint and field may technically mirror code while failing to communicate architecture. Omitting irrelevant detail is not inaccuracy when the scope is explicit. The risk comes from silently omitting something that changes the conclusion."], code: { language: "text", code: "Question: Who interacts with Steward and why?\nUseful level: people + external systems + Steward boundary\nNoise at this level: serializers, ORM models, SQL indexes, container ports", caption: "Choose detail based on the question." } },
        ],
        "Compare two possible Steward models and justify which is useful for a stated question.",
        ["Choose one stakeholder question from the previous module.", "List the minimum concepts needed to answer it.", "List details that should be intentionally omitted.", "Sketch the model.", "Ask what wrong decision could result if one omitted assumption were false."],
        ["Why is a complete model usually impossible or undesirable?", "What should be written before drawing?", "When does omission become misleading?"],
        [c4Model, arc42],
    ),
    richLesson(
        "C4-Style Thinking",
        "C4 provides a hierarchy of views for communicating software architecture: system context, containers, components and code. Its most important lesson is not the notation; it is choosing a level of abstraction and avoiding accidental mixing of levels.",
        ["Describe the purpose of C4 context, container and component views.", "Avoid mixing implementation classes into system-level diagrams.", "Use relationships with explicit direction and purpose.", "Select only the views that answer useful questions."],
        [
            { title: "Zoom deliberately", paragraphs: ["The context view asks where Steward sits in the world. A container view asks which major runtime/data units make up Steward. A component view can zoom into one container and show meaningful internal responsibilities. A code-level view is rarely needed for broad architecture communication.", "C4 does not require four diagrams for every system. If a view adds no useful reasoning, do not manufacture it."] },
            { title: "Relationships need semantics", paragraphs: ["An unlabeled arrow is ambiguous. Record who initiates the relationship, what capability is used, and the important protocol or data where useful. This turns a drawing into a reviewable claim."], code: { language: "text", code: "Engineer → Steward Web/API: search service ownership\nSteward API → PostgreSQL: persist service registry state\nSteward API → Identity Provider: validate/obtain identity claims (future externalized auth scenario)", caption: "Relationships should communicate purpose, not just connectivity." } },
        ],
        "Create a C4-style zoom plan for Steward before drawing detailed views.",
        ["Reuse the approved Steward context from the previous module.", "Define what counts as a container for the current Steward deployment model.", "Pick one container worth zooming into and justify why.", "Write relationship labels before drawing arrows.", "Explicitly state which C4 level you are not producing and why."],
        ["What question does a container diagram answer?", "Why is mixing classes into a context diagram harmful?", "Does C4 require all four levels?"],
        [c4Model],
    ),
    richLesson(
        "Containers and Components as Models",
        "Containers and components are responsibility models, not synonyms for Docker containers or source-code folders. A good model shows where major behavior lives and how responsibilities collaborate at a useful level of detail.",
        ["Distinguish C4 containers from deployment containers.", "Identify components by responsibility rather than file structure.", "Model data stores and interfaces as architectural collaborators.", "Avoid inventing components merely because modules exist in code."],
        [
            { title: "Container means a major executable or data unit", paragraphs: ["In C4, a container is something like a web application, API application, database or background worker that runs or stores data as part of the system. It can be deployed in Docker, but Docker is not what makes it a C4 container.", "For Steward today, a reasonable container view might include a client interface, Django API and PostgreSQL database. Later schools may introduce infrastructure that changes the deployment view without necessarily changing the conceptual system responsibility." ] },
            { title: "Components are meaningful responsibilities", paragraphs: ["Inside the API, components should reflect cohesive responsibilities such as service registry operations, identity/access policy, review workflow or dependency management if those responsibilities are genuinely distinct. A serializers folder is an implementation grouping, not automatically an architectural component.", "Component boundaries should make review easier by exposing responsibility and dependency direction."], code: { language: "text", code: "Steward API\n  ├─ Service Registry\n  ├─ Access Policy\n  ├─ Dependency Management\n  └─ Service Review\n\nThese labels describe responsibilities, not Django folders.", caption: "Architectural components should express meaningful responsibility." } },
        ],
        "Produce a first Steward container model and one responsibility-based component model.",
        ["List candidate Steward containers and define why each qualifies.", "Choose the API as the component-level zoom target.", "Group behavior by responsibility, not directory name.", "Draw dependencies between components and label their purpose.", "Compare the model against the code and record one mismatch that deserves investigation rather than immediate refactoring."],
        ["Why is a Docker container not automatically a C4 container?", "What makes a component architecturally meaningful?", "Should every source folder appear in a component diagram?"],
        [c4Model, arc42],
    ),
    richLesson(
        "State and Lifecycle Modeling",
        "Static structure cannot explain every important system rule. State and lifecycle models make valid transitions, forbidden transitions, triggers and invariants visible—especially when domain behavior changes over time.",
        ["Identify when state modeling is more useful than structural diagrams.", "Distinguish state from events and transitions.", "Express guards and forbidden transitions.", "Use lifecycle models to uncover missing domain rules."],
        [
            { title: "State is not just a status field", paragraphs: ["A status column becomes meaningful only when the allowed transitions and consequences are known. For Steward, Service lifecycle might include proposed, active, deprecated and retired. The real model asks: who may transition, from which state, under what conditions, and what changes when the transition occurs?", "A lifecycle diagram is especially useful when business rules depend on current state, such as requiring stronger metadata before a service becomes active or preventing edits after retirement except through a controlled path."] },
            { title: "Transitions encode policy", paragraphs: ["Name transition triggers and guards. If a transition is impossible, show that through the absence of a path or an explicit rule. This often reveals that a supposedly simple enum hides workflow semantics."], code: { language: "text", code: "PROPOSED --activate [owner assigned + production metadata valid]--> ACTIVE\nACTIVE --deprecate [maintainer permission]--> DEPRECATED\nDEPRECATED --retire [no blocking dependency rule]--> RETIRED\nRETIRED --activate--> forbidden", caption: "A lifecycle model exposes rules that a field definition cannot." } },
        ],
        "Model one Steward lifecycle and identify domain rules revealed by the model.",
        ["Choose Service lifecycle or ServiceReview lifecycle.", "List states with precise meanings.", "List transition triggers, actors and guards.", "Mark invalid transitions.", "Compare the model with current implementation and record missing or inconsistent enforcement."],
        ["What is the difference between a state and a transition?", "Why can an enum hide important behavior?", "What should a transition guard express?"],
        [umlState],
    ),
    richLesson(
        "Communicating Architecture Visually",
        "Architecture diagrams are communication interfaces. They need scope, labels, consistent notation and enough context that a reviewer can interpret them without the author narrating every arrow.",
        ["Design diagrams for a specific audience and question.", "Use titles, legends and relationship labels consistently.", "Separate views rather than collapsing every concern into one diagram.", "Keep diagrams maintainable and reviewable alongside system change."],
        [
            { title: "A diagram should stand on its own", paragraphs: ["Include a title that states scope and level. Name elements consistently with the system vocabulary. Label important relationships. Add a legend when visual conventions are not obvious. Record assumptions beside the diagram or in linked documentation.", "Avoid color-only semantics, unexplained acronyms and giant 'everything diagrams'. Multiple small views are usually easier to review than one universal architecture picture."] },
            { title: "Diagram-as-code can improve maintainability", paragraphs: ["Text-based formats such as Mermaid or Structurizr DSL can make diagrams diffable and versionable, though they do not automatically make the architecture correct. Choose a tool that supports the review workflow rather than optimizing for visual novelty."], code: { language: "mermaid", code: "flowchart LR\n  Engineer[Engineer] -->|searches ownership| Steward[Steward]\n  Steward -->|reads/writes registry state| DB[(PostgreSQL)]", caption: "Even a small diagram benefits from explicit relationship labels." } },
        ],
        "Review an existing Steward architecture diagram as a communication artifact and improve it.",
        ["Choose one previously produced diagram.", "State its intended audience and question.", "Check title, abstraction level, labels, legend and naming consistency.", "Remove detail that belongs to another view.", "Version the improved diagram and write one maintenance rule for future changes."],
        ["Why are unlabeled arrows weak?", "When are several small diagrams better than one large diagram?", "What advantage can diagram-as-code provide?"],
        [c4Model, mermaid, arc42],
    ),
    {
        id: "modeling-software-systems-lab-model-steward-api-at-multiple-levels",
        title: "Lab: Model Steward API at Multiple Levels",
        activities: [
            {
                id: "modeling-software-systems-lab-model-steward-api-at-multiple-levels-brief",
                title: "Model for questions, not for decoration",
                estimatedMinutes: 25,
                content: {
                    type: "reading",
                    body: "This lab consolidates the module into a small architecture model set for Steward. The goal is not to produce every possible diagram. Produce only complementary views that answer different questions and can be defended against real Steward evidence.",
                    blocks: [
                        { type: "heading", id: "required-views", text: "Required views", level: 2 },
                        { type: "list", items: ["System context view carried forward and refined from the previous module", "Container view for Steward's major runtime/data units", "One component view for a chosen container, normally the API", "One state/lifecycle model for Service or ServiceReview"] },
                        { type: "heading", id: "review-rule", text: "Review rule", level: 2 },
                        { type: "paragraph", text: "Every view must begin with an engineering question and end with an omissions note. If two diagrams answer the same question at the same level, consolidate them rather than creating documentation volume." },
                        { type: "callout", tone: "warning", title: "Do not model the repository tree", body: "Directories, models.py files and serializers are implementation evidence. They are not automatically architecture elements. Promote them into the model only when they represent a meaningful responsibility at the chosen level." },
                        { type: "resources", title: "Core references", resources: [c4Model, mermaid] },
                    ],
                },
            },
            {
                id: "modeling-software-systems-lab-model-steward-api-at-multiple-levels-practice",
                title: "Build the Steward model set",
                estimatedMinutes: 180,
                content: {
                    type: "practical",
                    objective: "Produce a coherent multi-level model set for Steward API v1 and prove that each view serves a different engineering purpose.",
                    scenario: "A technical review group needs to understand where Steward sits, what major runtime/data units make it up, how one internal responsibility area is structured, and how one important domain object changes state over time.",
                    instructions: ["Start from the requirements and context artifacts already produced.", "Refine the system context view without introducing implementation-level detail.", "Create a container view and justify each container as a major executable or data responsibility.", "Choose one container and create a component model based on responsibilities rather than folders.", "Create a Service or ServiceReview lifecycle model with states, transitions, guards and forbidden transitions.", "Label relationship direction and purpose on all structural views.", "For each view, write: audience, question answered, assumptions, deliberate omissions and evidence source.", "Compare models with the current Steward implementation and record mismatches as findings rather than silently changing diagrams or code.", "Identify one architecture question that should be investigated in Components and Dependencies, the next module."],
                    deliverables: ["Refined context diagram", "Container diagram", "One component diagram", "One state/lifecycle model", "Model rationale and omissions notes", "Mismatch/findings register"],
                    completionCriteria: ["Each view has a distinct purpose and abstraction level.", "Internal code structure is not confused with architecture by default.", "Relationships have meaningful labels.", "The lifecycle model exposes valid and invalid transitions.", "Mismatches between model and implementation are visible.", "The model set can be reviewed without oral explanation from the author."],
                },
            },
            { id: "modeling-software-systems-lab-model-steward-api-at-multiple-levels-check", title: "Model Review", estimatedMinutes: 20, content: { type: "reflection", prompt: "1. Which view changed your understanding of Steward most, and why?\n2. Which implementation detail did you deliberately omit from an architecture view?\n3. Where did the current code and your intended responsibility model disagree?\n4. What new domain rule did the lifecycle model expose?\n5. Which dependency or responsibility question should the next module investigate?" } },
        ],
    },
];
