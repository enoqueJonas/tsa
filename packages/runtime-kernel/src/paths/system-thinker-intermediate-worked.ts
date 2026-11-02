import type { LearningResource } from "../activities/content";
export type SystemThinkerWorkedSection = {title:string;paragraphs:string[];code?:{language:string;code:string;caption?:string}};
export const workedByModule: Record<string,Record<string,SystemThinkerWorkedSection[]>> = {
  "boundaries": {
    "System Context": [
      {
        "title": "Build a context view that a new stakeholder can actually interpret",
        "paragraphs": [
          "The scope of a context diagram is one software system, not its application processes. Start from the incident responder's goal: find the team that owns a production service. Draw Steward once, place Incident Responder and Service Maintainer around it, and add the enterprise Identity Provider only when identity proof is an actual external interaction. Label relationships with verb phrases and information direction. 'Uses' conceals more than it explains.",
          "Read the model left to right: responder → Steward requests ownership data; maintainer → Steward registers/updates metadata; Steward → IdP validates enterprise identity according to the implemented authentication integration. If an IdP is only a planned dependency, mark it planned rather than inventing a runtime hop. This view intentionally omits Django, PostgreSQL and Redis because it answers *who and what*, not *where data is stored*."
        ],
        "code": {
          "language": "text",
          "caption": "One bounded system, explicit roles and directional relationships",
          "code": "[Incident responder] --looks up owning team--> [Steward registry]\n[Service maintainer] --submits service metadata--> [Steward registry]\n[Steward registry] --verifies identity (only if implemented)--> [Enterprise IdP]\nScope: Steward registry; external actors/dependencies lie outside\nEvidence: Builder deployed API routes and actual IdP configuration"
        }
      },
      {
        "title": "Test the diagram with a wrong abstraction",
        "paragraphs": [
          "If the proposed context diagram has 'Django app → PostgreSQL table' as its only relationship, it is a container/data-flow view masquerading as context. If it shows a future CI platform as a current dependency without source evidence, it is factually wrong. Ask two reviewers to describe what the main system does and which team controls each external relationship without a spoken explanation; ambiguity is a diagram defect.",
          "Independent transfer: draw the context of a library borrowing system and classify a book-return terminal, librarian, central identity service and local catalog database. Defend which elements are external systems and which are internal storage."
        ]
      }
    ],
    "Actors and External Systems": [
      {
        "title": "Separate a goal-bearing role from a dependency",
        "paragraphs": [
          "An actor is not automatically a human. A reporting job that calls Steward to download ownership data is an external-system actor for that interaction; a PostgreSQL server called by Steward is an internal container/dependency rather than an external business actor when it belongs inside the defined system boundary. Whether an IdP is outside Steward depends on responsibility, not who pays for its hosting.",
          "Construct two columns, 'initiates goal' and 'provides supporting capability'. Maintainer initiates registration; the IdP supplies identity proof; a reporting consumer initiates export; the database stores authoritative state. This classification affects whether a context diagram should depict an arrow as a business goal or a technical call."
        ]
      },
      {
        "title": "Verify current, planned and assumed relationships",
        "paragraphs": [
          "For each drawn external service, find an implemented configuration value, actual API call or requirement approved by the owner. If no such evidence exists, label the line 'proposed' and add an open question. Example: a draft diagram might show a Kafka cluster although Builder never deployed one; remove it at this stage because the distributed learning increment appears later.",
          "Failure exercise: a diagram suggests 'any engineer can update any team'. Challenge that assertion with an authorized and cross-team denied API request. Actor descriptions cannot silently override the security boundary already taught in Builder."
        ]
      }
    ],
    "Defining System Boundaries": [
      {
        "title": "Work through responsibility, deployment, ownership and trust separately",
        "paragraphs": [
          "Begin with a practical question: who decides whether a Service may be promoted to production? Steward's application/domain owns the lifecycle rule; PostgreSQL persists its result; the IdP establishes the user's enterprise identity; team membership determines the Steward-specific authorization decision. The same request crosses deployment and trust boundaries without moving domain-rule ownership to the IdP or PostgreSQL.",
          "A system boundary groups the product responsibilities; a deployment boundary separates runtime units; an ownership boundary separates teams who can independently change interfaces; a trust boundary marks where evidence/assumptions must be checked. One diagram may need an annotation for each, but they do not collapse into a single line."
        ],
        "code": {
          "language": "text",
          "caption": "Four different boundaries in one registration request",
          "code": "External browser -> [Steward API]: authenticated request (trust)\n[Steward API] -> [IdP]: validate identity evidence (ownership/trust)\n[Steward API] -> [PostgreSQL]: transactional domain state (deployment)\n[Steward product boundary] owns: lifecycle invariant + team authorization\nIdP owns: identity proof; PostgreSQL does NOT define lifecycle policy"
        }
      },
      {
        "title": "Diagnose boundary leakage",
        "paragraphs": [
          "If the identity provider is configured to decide which Steward Team owns a Service, the design has leaked domain authority into an external identity system without a contract. If a mobile client changes lifecycle directly in SQL, it has bypassed Steward's application boundary and may violate production-readiness invariants. Propose one concrete authorization or domain test to expose each leak.",
          "Compare a monolith with three deployable services: both may represent the same user-visible software system. A change in deployment packaging alone does not necessarily create three business system boundaries."
        ]
      }
    ],
    "Trust and Ownership Boundaries": [
      {
        "title": "Trace an untrusted value to the authority that interprets it",
        "paragraphs": [
          "A signed access token can establish some identity claims when signature, issuer, audience, expiry and algorithm are correctly checked; it does not establish that the holder may update a particular Service. Treat subject identity and team authorization as separate decisions. A valid token on a forbidden cross-team resource is still a forbidden request.",
          "Worked negative case: an authenticated Team B engineer sends PATCH for a Team A Service with a valid identity token. The IdP has done its job and the request may reach Steward; Steward must deny the mutation based on its own team membership rules. The persisted state must remain unchanged. A 200 response would be a boundary failure even if TLS and token validation succeeded."
        ]
      },
      {
        "title": "Separate change coordination from trust",
        "paragraphs": [
          "An external CMDB team may own its SOAP schema, so breaking changes require release coordination. That does not imply its data is intrinsically trustworthy or should overwrite Steward domain state. Keep separate records: interface owner, negotiated contract/version and availability on one side; authentication, parsing, validation and authorization guarantees on the other.",
          "Independent transfer: analyze a payment-gateway webhook that is signed by a trusted provider yet contains a duplicate event ID. Explain why signature verification does not prevent duplicate business effects and who owns the idempotency rule."
        ]
      }
    ]
  },
  "modeling": {
    "Why We Model Systems": [
      {
        "title": "Prove usefulness by comparing two models of the same problem",
        "paragraphs": [
          "A model is a deliberate simplification for answering a question. The incident lead asks: 'Which external system can block ownership lookup?' A context diagram or dependency sketch naming the relevant provider is useful; a UML class diagram with 40 model attributes is precise about irrelevant details and therefore the wrong answer.",
          "Before drawing, record Audience, Question, Boundary, Included facts, Important omissions, Evidence source. Example: audience = incident responders; question = whether login and database availability are required for lookup; boundary = Steward request path; include request, authorization and database; omit internal serializer helper calls. Check the model by asking a reviewer to answer the question from the artifact alone."
        ]
      },
      {
        "title": "Detect misleading precision",
        "paragraphs": [
          "A line can be neat and still be untrue: showing an outbound Redis cache path before redis is introduced later gives a false account of the current system. Mark diagrams explicitly current-state, teaching-hypothesis or future-state. Attach source revision/date; when the implementation evolves, reconcile the model rather than presenting an old illustration as current.",
          "Transfer: choose a system you did not build and create the minimum two-box model that exposes its most consequential ownership boundary. Then explain why further boxes would make this question harder to answer."
        ]
      }
    ],
    "C4-Style Thinking": [
      {
        "title": "Zoom through one coherent story without changing the named system",
        "paragraphs": [
          "At system-context zoom, Steward is one software system with actors and neighboring systems. At container zoom, the same Steward system contains a Django API and PostgreSQL data store; 'container' means independently deployable/runnable application or data store, not necessarily a Docker image. At component zoom, select the Django API container and show internal responsibilities such as access policy, service registry and persistence adapter. The parent-child relationship must be consistent: an object should not mysteriously jump from external context system into an unrelated internal component.",
          "Use the same 'lookup owning team' interaction through the views. Context: incident responder → Steward. Containers: responder → API → PostgreSQL. Components: request handling → authorization → registry query → persistence. If the first diagram says only an IdP authenticates users, but the deeper view says the application mints its own users, resolve the contradiction before reviewing it."
        ],
        "code": {
          "language": "text",
          "caption": "Two zoom levels; do not draw containers as Docker products",
          "code": "CONTEXT: Incident responder --owner lookup--> STEWARD\nCONTAINERS INSIDE STEWARD:\n  [Django API] --SQL service/team lookup--> [PostgreSQL]\nCOMPONENTS INSIDE DJANGO API:\n  [HTTP entry] -> [Authorization] -> [Service Registry] -> [Persistence]\nOutside STEWARD (if in actual design): [Enterprise Identity Provider]"
        }
      },
      {
        "title": "Choose the few views that actually answer different questions",
        "paragraphs": [
          "A context diagram answers scope and collaboration; a container diagram answers major runtime responsibilities; a component diagram answers internal API decomposition; a dynamic/sequence view answers ordering and failure. Do not produce all four just because a checklist says C4. For many systems the first two suffice until a specific design dispute warrants deeper zoom.",
          "Bad example: a 'component diagram' with each database table and each utility function depicted as its own autonomous application. Rebuild from responsibilities and identify the change/failure question each box answers."
        ]
      }
    ],
    "Containers and Components as Models": [
      {
        "title": "Distinguish runtime units from modules and external services",
        "paragraphs": [
          "A PostgreSQL process with its own lifecycle and data is a C4 container even if physically on the same host as the Django API. A Python package imported into that API is normally a component/code boundary, not a container: it does not run independently. A separate notification worker would be a container only when actually deployed; before the later distributed lab it belongs in a proposed-state sketch.",
          "Worked decision table: Django API = container, because it is an executable application; PostgreSQL = container/data store, because it owns the persistence runtime; ServiceRegistry = component within API, because it groups application behavior but is not independently started; enterprise IdP = external software system, because identity proof is owned elsewhere. The classification is about responsibilities and runtime boundaries, not brand names."
        ]
      },
      {
        "title": "Keep abstraction honest under change",
        "paragraphs": [
          "If a team splits the registry logic into three Django apps, the container diagram need not change because the deployed service remains one process. If a notification consumer becomes a separate worker with its own restart/scaling behavior, add a container even if it shares code with the API. Show dependency and failure consequences before choosing that split.",
          "Transfer exercise: replace Django with a Go executable and PostgreSQL with an external managed database, and explain which elements/lines change at each zoom level."
        ]
      }
    ],
    "State and Lifecycle Modeling": [
      {
        "title": "Define states, events, guards and invariants before arrows",
        "paragraphs": [
          "A state is a meaningful business condition in which different operations are permitted. A transition is a named event with a guard (permission + preconditions) and a postcondition. For Steward, 'production' is not the same as 'active': lifecycle follows development → uat → production → retired by domain rules, while deployment Environments represent actual installations. Confirm permissible transition edges against the product contract rather than assuming every arrow shown here is allowed.",
          "Worked transition: if product policy permits promotion to production, guard = authorized maintainer AND at least one production Environment; effect = lifecycle becomes production atomically, otherwise it remains unchanged. This is not an instruction to invent transition permissions. Data persistence and role checks must enforce the same guard even on a direct API request."
        ],
        "code": {
          "language": "text",
          "caption": "Business-state transition as an explicit contract",
          "code": "transition: request promote service to production\npre-state: uat (verify permitted source state in product spec)\nguard: actor may edit owning team AND production environment exists\nsuccess: lifecycle=production, persisted in one accepted mutation\nfailure: reject; previous lifecycle and environments unchanged\ninvariant: every production-stage Service has a production Environment"
        }
      },
      {
        "title": "Find a missing concurrency edge",
        "paragraphs": [
          "A transition diagram showing a valid promotion may still omit a concurrent deletion of the last production Environment. Two requests that separately appear valid can leave an invalid combined state if there is no appropriate transactional protection. Mark this race on the model and require a real two-request database test before claiming the invariant.",
          "Counterexample: adding a generic 'failed' lifecycle state for any HTTP error confuses request failure with persistent domain state. A rejected promotion is not automatically a new lifecycle state."
        ]
      }
    ],
    "Communicating Architecture Visually": [
      {
        "title": "Give a reviewer a complete legend, not an unexplained box garden",
        "paragraphs": [
          "For every diagram label its purpose, perspective, current revision/date, legend, assumptions and omissions. Use arrows with verbs, not only 'depends on'. If color distinguishes external/current/proposed, provide a text legend so the meaning does not disappear in grayscale or assistive technologies. Include an explicit 'not shown' line when hiding details is deliberate.",
          "Worked critique: a diagram includes Redis, Keycloak, PostgreSQL, workers and endpoints as equal unlabeled boxes. It implies they already exist, makes no statement about authority and cannot explain user-visible flow. Replace it with context and container views appropriate to the current Builder version; put future Redis/RabbitMQ in a separately labeled proposed-state view only when their requirements are established."
        ]
      },
      {
        "title": "Treat diagram text as a testable artifact",
        "paragraphs": [
          "In a diagram-as-code file, review the source under version control alongside the implementation. A syntax check proves only that the diagram renders; a reviewer must verify that relationships correspond to real behavior. Modify the source after an endpoint ownership change and compare both render and runtime evidence.",
          "Independent test: give a teammate only the diagram and ask them to identify where authentication evidence is checked, where authoritative service state lives and which runtime can fail without invalidating domain state. Record misconceptions as defects in the diagram."
        ]
      }
    ]
  },
  "components": {
    "Components and Responsibilities": [
      {
        "title": "Test a boundary by asking what changes together",
        "paragraphs": [
          "Suppose a new service criticality category is introduced. The registry domain rules and persistence representation may change; team membership authorization should not change unless the permission policy itself changed. If the same multipurpose module owns both rules, a tiny domain addition can accidentally alter access behavior. That is a reason to separate responsibilities, not to manufacture a microservice.",
          "Walk the failed request: a user with valid identity but without Team A membership attempts to register a Team A Service. AccessPolicy denies before ServiceRegistry creates state. No successful save should exist. Conversely, a permitted actor with invalid lifecycle data must fail domain validation. Use both cases to test the responsibility model."
        ]
      },
      {
        "title": "Find the smallest enforceable boundary",
        "paragraphs": [
          "Interfaces are useful when they isolate a real reason for change or a resource the component does not own. They introduce indirection and maintenance cost too. Prefer a cohesive function/module for a small application; add an explicit adapter when an external SOAP type or database-specific API would otherwise leak into domain behavior.",
          "A 'clean architecture' diagram is not proof that the implementation follows dependency direction. Inspect imports and tests; an inward-facing domain component importing a Django view or generated SOAP proxy is evidence of inversion and fragility."
        ]
      }
    ],
    "Coupling and Cohesion Foundations": [
      {
        "title": "Predict the impact of a shared-schema change",
        "paragraphs": [
          "Two services are data-coupled if the consumer reads a producer's internal table columns directly. Renaming a column can break the consumer even if the public API contract is unchanged. Compare this with a versioned integration response that the producer can maintain while changing storage; the latter reduces schema coupling at the cost of a mapping layer.",
          "Temporal coupling differs: if Steward must call an identity service synchronously for every ownership lookup, an IdP outage or latency spike can affect lookup availability even without shared schema. Name each dimension separately instead of calling both 'tight coupling'."
        ]
      },
      {
        "title": "Diagnose cohesion using a change history",
        "paragraphs": [
          "Choose three realistic changes: new lifecycle rule, new team membership policy and new CSV export format. Mark files/components changed for each. A component that changes for all three unrelated reasons may lack cohesion, but this is a clue requiring code evidence. One large file is not necessarily poor cohesion if it owns one small consistent responsibility.",
          "Failure mode: adding an event broker only to 'decouple' two synchronous calls can introduce message redelivery and eventual consistency without removing data/semantic coupling. Compare the total failure cost, not only the arrows on a diagram."
        ]
      }
    ],
    "Dependency Direction": [
      {
        "title": "Trace imports and runtime calls separately",
        "paragraphs": [
          "At code level dependency direction asks which module knows another module's interface. At runtime it asks which process must be available to satisfy a request. The API can import a persistence interface without importing Django ORM-specific serializers in the domain layer, yet it may still need PostgreSQL to fulfill a lookup. Do not infer runtime availability from a static dependency diagram.",
          "Worked comparison: domain policy is a pure decision function, called by the API application service; the application service depends on a repository abstraction for state, and an adapter uses ORM to implement it. A dependency inversion may protect tests or replacement, but it costs extra types. For a small stable module, a direct but intentional dependency may be clearer."
        ]
      },
      {
        "title": "Expose one concrete cycle",
        "paragraphs": [
          "ServiceRegistry imports ReviewWorkflow to trigger review, while ReviewWorkflow imports ServiceRegistry to check ownership. A naive refactor can create a cyclic import and joint change pressure. Consider moving the cross-cutting orchestration to an application service, using explicit events after commit or moving shared policy into one responsible owner. Each option must be justified by observed collaboration—not adopted as a pattern badge.",
          "Exercise: draw the current import graph for two modules, show an actual source file and identify whether the cycle is at source level, runtime level or both."
        ]
      }
    ],
    "Internal and External Dependencies": [
      {
        "title": "Inventory dependencies by capability and failure contract",
        "paragraphs": [
          "A dependency ledger should record what function the dependency provides, owner, protocol/contract, data authority, latency requirement, failure signal, fallback and change coordination. 'Database', 'IdP', 'message broker' as bare nouns hides which behavior would fail and who can recover it.",
          "Worked ledger row: PostgreSQL | Steward authoritative persistence | owned by platform operations | SQL/schema/migrations | high state authority | refusal/slow query/migration error | no legitimate fallback to stale cache for writes. IdP | external identity proof | identity team | signed-token/verification contract | invalid token or unavailable issuer | deny unverified identity; existing validated sessions depend on policy. Do not claim an IdP request happens on every API call without inspecting the implementation."
        ]
      },
      {
        "title": "Distinguish graceful degradation from silent corruption",
        "paragraphs": [
          "A read-only UI might continue with clearly labeled stale data under an approved product policy. An ownership mutation must not continue through a cache because Redis is not authoritative. For each dependency outage, document which operations fail closed, which can degrade, which must be retried later, and what evidence operators need.",
          "Independent case: an external service responds HTTP 200 with semantically invalid data. Compare that with a network timeout. A dependency can be 'up' and still violate the integration contract."
        ]
      }
    ]
  },
  "flow": {
    "Following Data Through a System": [
      {
        "title": "Trace the semantic state of each value",
        "paragraphs": [
          "Track a new Service registration beyond a list of HTTP calls. Input arrives as untrusted JSON; parsing turns bytes into typed fields; authentication establishes identity; authorization checks membership for a target Team; domain validation enforces ownership/lifecycle; persistence commits an authoritative record; the HTTP representation then returns only allowed fields. Each step changes what can safely be assumed about the value.",
          "Write the trace as columns Boundary → Input → Check → Changed assurance/state → Failure evidence. If a client sends a Team ID, that ID is a claim, not proof of membership. If the database returns a Service row, persistence is authoritative for stored state but does not prove the requester may see it. Include a denied cross-team case and verify no row is written."
        ]
      },
      {
        "title": "Locate the point of no return",
        "paragraphs": [
          "A 400/403 can be returned before a mutation commits. A 500 may occur after a commit if response serialization fails. Retrying blindly can therefore create duplicates even when the client saw an error. The flow diagram must mark the database transaction commit and any later output generation; a client response code alone does not tell the entire state story.",
          "Apply the same reasoning to a payment service: the authorization flow and business effect are distinct and a timeout does not reveal whether the payment was accepted."
        ]
      }
    ],
    "Synchronous and Asynchronous Boundaries": [
      {
        "title": "Walk one request under a deadline",
        "paragraphs": [
          "Suppose the API has a 900 ms response budget. Parsing/authorization costs 70 ms, the database query costs 120 ms and a required external call costs 650 ms. Serial total = 840 ms before network overhead. If the external dependency instead takes 950 ms, no 900 ms deadline can be met. Timeouts must be allocated so the caller has time to handle failures; the downstream timeout should generally be shorter than the remaining request budget.",
          "A synchronous call is justified when the business operation cannot be completed without the result. An asynchronous task is appropriate when the business effect may complete later and the contract tells the user about that delay. Moving a critical ownership validation to a worker merely to make the API respond faster would silently change correctness."
        ],
        "code": {
          "language": "text",
          "caption": "Budget arithmetic and the wrong async solution",
          "code": "Budget: 900 ms\nparse/auth: 70 ms\nSQL: 120 ms\nrequired external: 650 ms\nminimum sequential time: 840 ms, only 60 ms left for overhead\nexternal takes 950 ms => budget exceeded\nQuestion: is the remote result REQUIRED before committing? If yes, do not just enqueue it."
        }
      },
      {
        "title": "Separate enqueue acceptance from finished work",
        "paragraphs": [
          "A queue may return 'accepted' while the consumer has not run. The API must specify whether the caller receives 202 Accepted plus a status/resource to follow, or whether the operation is a committed authoritative mutation whose optional side effect is pending. Both are valid patterns for different contracts.",
          "Test consumer-down behavior: can the job be durably stored? Does queue depth grow? What is observable after restart? Do not claim the user received a notification because the broker accepted a message."
        ]
      }
    ],
    "Integration Contracts": [
      {
        "title": "Define the boundary as a behavior contract, not only a JSON shape",
        "paragraphs": [
          "An integration contract includes identity, input/output schema, error semantics, timing/ordering, authentication, versioning, idempotency and authority. Two services can accept identical JSON documents and still be incompatible if one treats a timeout as safe to retry while the other applies the mutation twice.",
          "Worked ownership lookup contract: request includes stable service identifier and caller identity evidence; response contains authorized owner details or a documented not-found/forbidden outcome; retries of GET are safe against ordinary reads but can still carry load and stale consistency risks. Contrast this with POST change requests whose idempotency depends on the application contract, not the HTTP method name alone."
        ]
      },
      {
        "title": "Test an apparently harmless evolution",
        "paragraphs": [
          "A provider adds an optional field. A tolerant consumer may ignore it, while a generated strict client may reject unknown content. A provider changes the enum 'production' to 'prod': this can break even consumers that ignore unknown fields. Version and consumer compatibility must be tested with the actual deployed client.",
          "Independent variant: add a nullable ownership email address to a CSV batch and a SOAP response; predict where additive changes might fail and how to observe the failure in the real parser."
        ]
      }
    ],
    "Failure Across Integrations": [
      {
        "title": "Classify failure by how much is known",
        "paragraphs": [
          "A connection refusal means the network handshake to the dependency failed before an application response; it does not prove anything about earlier requests. HTTP 500 means an application answered with an error, but the authoritative state might already have changed. A timeout is explicitly ambiguous: the server may have committed and the response may be lost. An invalid payload means the transport succeeded but the contract failed.",
          "For a lifecycle change followed by an email notification: database commit succeeds, outbound email times out. Do not reverse the lifecycle or issue an unbounded duplicate notification merely because the side effect was slow. The later outbox lesson will introduce durable intent; here the first job is to identify the authoritative boundary and record what is uncertain."
        ]
      },
      {
        "title": "Turn a failure table into recoverable behavior",
        "paragraphs": [
          "Write one row each for failure before request arrival, during validation, during database transaction, after commit before response, and during downstream side effect. For every row name: evidence available, whether state may have changed, whether client retry is safe, required reconciliation step and operator signal. Where a claim depends on remote effects, mark it unverified until injected into the actual integration.",
          "A simplistic 'catch Exception and return success' makes failures invisible and data wrong. A simplistic 'retry every 500' can amplify load or duplicate effects. Both are testable design errors, not acceptable resilience patterns."
        ]
      }
    ]
  }
};
export const primaryResearchByModule: Record<string,LearningResource[]> = {
  "boundaries": [
    {
      "title": "C4 system context official guide",
      "url": "https://c4model.com/diagrams/system-context",
      "kind": "reference",
      "purpose": "Scope, roles, relationship labels and what to omit from the context zoom."
    },
    {
      "title": "Simon Brown — Visualising software architecture (2019 lecture)",
      "url": "https://www.youtube.com/watch?v=x2-rSnhpw0g",
      "kind": "video",
      "purpose": "Optional full talk from C4's creator on vocabulary, diagrams and audience; TSA models are standalone."
    }
  ],
  "modeling": [
    {
      "title": "C4 diagrams and abstractions",
      "url": "https://c4model.com/diagrams",
      "kind": "reference",
      "purpose": "Check the meaning and boundaries of context, container, component and supporting dynamic diagrams."
    },
    {
      "title": "Simon Brown — C4 model talk (Devoxx 2024)",
      "url": "https://www.youtube.com/watch?v=KvoBrUd1-5E",
      "kind": "video",
      "purpose": "Optional up-to-date lecture on diagram selection and readable notation."
    }
  ],
  "components": [
    {
      "title": "Martin Fowler — Bounded Context",
      "url": "https://martinfowler.com/bliki/BoundedContext.html",
      "kind": "reference",
      "purpose": "Distinguish domain ownership and vocabulary boundaries from mere source folders."
    },
    {
      "title": "C4 component diagram",
      "url": "https://c4model.com/diagrams/component",
      "kind": "reference",
      "purpose": "Define components in one selected container rather than turning every class into a service."
    }
  ],
  "flow": [
    {
      "title": "UML sequence diagram reference",
      "url": "https://www.drawio.com/docs/diagram-types/uml/sequence-diagrams/",
      "kind": "reference",
      "purpose": "Reading order, lifelines, return values and alternate paths for interaction traces."
    },
    {
      "title": "RFC 9110 HTTP semantics",
      "url": "https://www.rfc-editor.org/rfc/rfc9110",
      "kind": "reference",
      "purpose": "Separate message/status semantics from whether a durable effect was committed."
    }
  ]
};
