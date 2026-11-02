import type {LearningResource} from "../activities/content";
type ModelingSection={title:string;paragraphs:string[];code?:{language:string;caption:string;code:string}};
// One illustrative OBS-01 scenario from Requirements/Boundaries to C4 zooms,
// component responsibility, lifecycle guards and independent visual critique.
export const modelingRunningCase:Record<string,ModelingSection[]> = {
  "Why We Model Systems": [
    {
      "title": "Use the same OBS-01 question to choose a model",
      "paragraphs": [
        "The prior module explained why the caller can read a Service owner but cannot infer who may transfer that ownership. Do not begin by drawing everything known about Steward. Write three review questions: who interacts with Steward to solve OBS-01, where an owner-change request is authorized and persisted, and which lifecycle transitions are allowed. These require different models: context, container/component flow, and state machine. A model is useful because it suppresses details that distract from its precise question.",
        "To test whether a model is fit for purpose, hand it to a specific reviewer. An incident manager should identify the external roles and business exchange from a context drawing; a developer should find the mutation boundary from a component drawing; a QA engineer should derive positive and forbidden transitions from a state view. If the diagram cannot answer its named question without a spoken tour, revise it. Quantity of boxes is not evidence of architectural quality."
      ],
      "code": {
        "language": "text",
        "caption": "Three questions, three views — do not confuse zoom levels",
        "code": "Q1: Who reads or changes Service ownership? -> Context view\nQ2: Where does a change become authorized and durable? -> Container + component/dynamic view\nQ3: Which lifecycle transitions are allowed? -> State machine\nCONTEXT: no ORM methods or storage tables\nCONTAINER: applications/data stores, not every Python class\nSTATE: states, events, guards, effects (not network hop sequence)"
      }
    },
    {
      "title": "Show what changes when the question changes",
      "paragraphs": [
        "A good model can be revised without automatically rewriting every other view. If the team replaces PostgreSQL with a different persistence engine, the business context can remain unchanged while the container/deployment views change. If ownership approval D-01 moves to a new external authority, the context may acquire a genuine neighboring system and the trust diagram must show that interface.",
        "Counterexample: a team publishes a dense architecture poster with every Django serializer, database table, future Kafka topic and identity field on one page. Its apparent completeness prevents a responder from finding the service's responsibility. Ask what decision the poster supports; if no audience can answer, the diagram is decoration rather than an engineering tool."
      ]
    }
  ],
  "C4-Style Thinking": [
    {
      "title": "Zoom into one system without silently changing its boundary",
      "paragraphs": [
        "C4 zoom levels do not turn one Steward product into multiple business products. Level 1 (context) shows **one Steward system** surrounded by responder, maintainer and real neighboring systems. Level 2 (container) zooms into Steward to show a Django API and PostgreSQL data store at the Builder teaching checkpoint. Level 3 (component) zooms into the Django application to show responsibilities such as request validation, authorization and lifecycle domain logic. A 'container' is a separately running application or data store, not necessarily a Docker container.",
        "At each zoom, preserve the relationship labels and vocabulary. For example, the responder's request for recorded ownership in context becomes an HTTP query to the API in the container view, which becomes a read/authorization flow within the API in the component view. Do not infer a current Redis cache, RabbitMQ broker or enterprise identity adapter from later course labs."
      ],
      "code": {
        "language": "text",
        "caption": "Correspondence across the three C4 zooms for one recorded-owner lookup",
        "code": "CONTEXT\n  Responder -- requests recorded owner --> [STEWARD]\n\nCONTAINER [STEWARD responsibility boundary]\n  Responder -- lookup --> [Django REST API]\n  [Django REST API] -- owner query --> [PostgreSQL]\n\nCOMPONENT (inside Django API only; conceptual responsibilities)\n  [Request adapter] -> [Access policy] -> [Ownership read] -> [ORM]\n  These are logical responsibilities, NOT proof of four deployed services.\n\nUNCONFIRMED: enterprise IdP and D-01 approval source; not deployed"
      }
    },
    {
      "title": "Try to corrupt the model by moving a box to the wrong zoom",
      "paragraphs": [
        "Intentional mistake: show PostgreSQL as a user-facing external system beside Steward in the context diagram, or draw the incident responder as a component inside Django. Why wrong? Those boxes answer technology and actor questions at the wrong abstraction level. Another mistake: draw four components and claim they are four microservices merely because they are separated on the page. A C4 component can live inside one deployable API process.",
        "Review exercise: take the context, container and component texts above, then mark which edges change type when crossing zooms. A database SELECT is not a business actor's request. If no actual Builder endpoint supports the named lookup yet, label the interaction as required/proposed instead of turning a diagram into fabricated implementation evidence."
      ]
    }
  ],
  "Containers and Components as Models": [
    {
      "title": "Separate domain ownership from software packaging",
      "paragraphs": [
        "The Builder v1 teaching checkpoint uses Django models and PostgreSQL. A container view should show the application as the point where domain rules are applied and the database as the authoritative persistence store. A component view should allocate responsibilities within the Django application: receive a caller's intent, establish the trusted caller context, enforce Team authorization, enforce ownership/lifecycle invariant and commit via a transactional service. The drawing is a responsibility map; inspect actual code before asserting that a named component/class already exists.",
        "Use a change-impact test: if the authoritative owner source is later integrated externally, which component should translate the source's contract, and which should still decide whether an owner transfer is permitted? The integration adapter may supply verified evidence but must not bypass Steward's policy decision. This distinction prevents every cross-system import from becoming a second source of domain truth."
      ],
      "code": {
        "language": "text",
        "caption": "Steward API component responsibilities and deliberate dependency direction",
        "code": "[HTTP request adapter] -> [Application authorization/use case]\n                              -> [Lifecycle/ownership domain rules]\n                              -> [Persistence interface] -> PostgreSQL\n[Proposed Owner Directory Adapter] -> [Application use case]\n   supplies facts, NOT authorization by itself\nASSERTED IMPLEMENTATION: only methods found in actual Builder checkpoint\nREQUIRED/PROPOSED: remaining conceptual responsibilities\nANTI-PATTERN: HTTP adapter -> raw SQL mutation bypassing use case"
      }
    },
    {
      "title": "Find a cycle before it becomes infrastructure",
      "paragraphs": [
        "Bad dependency design: domain ownership rules import an HTTP client that can update Team policy, while that HTTP client imports the domain rules to parse errors. The cycle makes independent testing, failure handling and deployment changes harder. Prefer application coordination using a provider contract at the boundary; keep the core domain independent of a particular transport. This is a conceptual design recommendation, not proof that Builder already implements a formal ports-and-adapters architecture.",
        "Independent exercise: start with one proposed integration, mark who owns its contract and why. Draw the failure if it is unavailable during an approved ownership change. Defend whether the change should be blocked, deferred or recorded for reconciliation, using an approved policy or an explicit open decision. Do not choose 'asynchronous' merely because RabbitMQ appears later in the curriculum."
      ]
    }
  ],
  "State and Lifecycle Modeling": [
    {
      "title": "Use a state machine for lifecycle, not for owner identity",
      "paragraphs": [
        "A Service's lifecycle and its owning Team are different dimensions. The owner changes through a controlled transfer operation; the lifecycle changes through domain transitions with preconditions. A state diagram answers which states and events are allowed, not the sequence of HTTP calls. Start from the Builder v1 lifecycle vocabulary: development, UAT, production and retired. The example below is a proposed policy model for the teaching case; the *only* actually tested Builder domain service is promotion guarded by a production Environment. Do not imply every edge has already been implemented.",
        "A transition is not just an arrow. It needs an actor/event, a guard (authorization and readiness), an effect (persist lifecycle change), and a rejected-case result (old state preserved). `UAT -> Production` without a production Environment is forbidden. `Retired -> Production` must not be silently inferred. An ownership transfer has no reason to change the lifecycle by itself."
      ],
      "code": {
        "language": "mermaid",
        "caption": "Illustrative Mermaid stateDiagram-v2 (proposed edges; verify against Builder policy)",
        "code": "stateDiagram-v2\n    [*] --> Development\n    Development --> UAT: approve validation [policy TBD]\n    UAT --> Production: authorized promote [production Environment exists]\n    Production --> Retired: authorized retire [policy TBD]\n    Retired --> [*]\n    note right of Production\n        Authoritative persistence must commit;\n        runtime deployment and lifecycle differ.\n    end note"
      }
    },
    {
      "title": "Test an invalid edge instead of trusting the arrows",
      "paragraphs": [
        "Counterexample: a direct ORM update sets `lifecycle='production'` for a Service with no production Environment. The visual model may show a readiness guard, but the direct write can bypass it if the rule exists only in an application service. The actual Builder v1 `promote_to_production` demonstration in System Thinker separately injects readiness rejection and rollback against PostgreSQL. A diagram is a hypothesis about behavior until executable evidence supports it.",
        "Independent transfer: create a transition table with (from state, requested state, actor authority, required Environment, expected result) for at least four combinations, including missing production deployment and unauthorized actor. State whether a rejection must preserve lifecycle and any external notification state. Record an open question for each proposed edge not backed by a Builder implementation or approved domain rule."
      ]
    }
  ],
  "Communicating Architecture Visually": [
    {
      "title": "Make each diagram independently readable by a different audience",
      "paragraphs": [
        "Architecture communication fails when the author has to narrate every arrow. Give each diagram a title, system scope, audience, exact source baseline, legend and status (observed, required, proposed, unresolved). Use meaningful relationship labels: 'requests current recorded Team' is testable; 'uses' is not. Draw readable direction, avoid crossing lines where possible and retain the same Service and Team vocabulary across context, container and state views.",
        "For OBS-01, the incident responder should be able to explain what Steward is accountable for from the context view without knowing PostgreSQL. A developer should find the authoritative write and authorization boundary in the container/component view. A tester should identify a forbidden lifecycle transition from the state view. The level-of-detail difference is intentional, not inconsistency."
      ],
      "code": {
        "language": "text",
        "caption": "Diagram review note and legend — attach to each artifact",
        "code": "TITLE: Steward recorded-owner lookup — context (OBS-01)\nSCOPE: Steward business responsibility\nAUDIENCE: Incident responder and system stakeholder\nBASELINE: Builder v1 commit [learner supplies verified SHA]\nLEGEND: solid=current verified; dashed=proposed; '?'=unresolved\nINTERACTION: Responder -> Steward: query recorded owning Team\nASSUMPTION: approved external owner source (D-01 unresolved)\nEXCLUDED: Django packages, database tables, tentative RabbitMQ\nREVIEW: outsider explains purpose, missing interface, unresolved owner"
      }
    },
    {
      "title": "Publish the limitations, not a false sense of completeness",
      "paragraphs": [
        "Reviewers should be able to see both the design claim and its evidence tier. A diagram depicting planned identity federation as a production integration is not a harmless placeholder; it can lead to invalid security and ownership decisions. Label known and proposed elements on the diagram itself and link to the requirement or observed repository evidence. If the last review happened before a schema or contract change, state that it may be stale.",
        "Independent critique: exchange the three views with someone who did not write them. Ask the reviewer to describe a current actor, a technical responsibility and a forbidden domain action. If they cannot locate all three without coaching, revise the labels or split an overloaded diagram. Record before/after feedback rather than declaring the drawing 'clear' from personal preference."
      ]
    }
  ]
};
export const modelingRunningReferences:Record<string,LearningResource[]> = {
  "Why We Model Systems": [
    {
      "title": "C4 model — why zoom levels matter",
      "url": "https://c4model.com/introduction",
      "kind": "reference"
    }
  ],
  "C4-Style Thinking": [
    {
      "title": "C4 — Context, container and component diagrams",
      "url": "https://c4model.com/diagrams",
      "kind": "reference"
    }
  ],
  "Containers and Components as Models": [
    {
      "title": "C4 — Container and component scopes",
      "url": "https://c4model.com/diagrams/component",
      "kind": "reference"
    }
  ],
  "State and Lifecycle Modeling": [
    {
      "title": "Mermaid — stateDiagram-v2 semantics",
      "url": "https://mermaid.js.org/syntax/stateDiagram.html",
      "kind": "reference"
    }
  ],
  "Communicating Architecture Visually": [
    {
      "title": "C4 — Architecture communication and audience",
      "url": "https://c4model.com/introduction",
      "kind": "reference"
    }
  ]
};
