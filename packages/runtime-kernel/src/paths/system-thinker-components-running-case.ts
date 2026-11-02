import type {LearningResource} from "../activities/content";
type ComponentSection = {title:string;paragraphs:string[];code?:{language:string;caption:string;code:string}};
// OBS-01 is fictional; all proposed ownership/identity boundaries remain unverified.
export const componentsRunningCase:Record<string,ComponentSection[]> = {
  "Components and Responsibilities": [
    {
      "title": "OBS-01: derive one responsibility map from a user need",
      "paragraphs": [
        "Return to the fictional OBS-01 incident-response delay, where a responder needs to find a recorded Service owner. The requirement FR-OWNER-01 is a read; the proposed transfer FR-OWNER-02 is a protected mutation. The same screen may offer both, but it does not make both one architectural responsibility. Separate request adaptation, caller/Team authorization, ownership domain rules and persistence, then check actual Builder v1 code before claiming that each responsibility already exists as a named class or package.",
        "Draw the responsibility contract before class names. A request adapter translates HTTP parameters and status codes; an application use case coordinates a requested operation; an authorization policy decides whether trusted caller context permits it; a registry rule protects Service/Team invariants; a repository makes durable state changes. The approved D-01 owner authority is unresolved, so neither an invented corporate directory nor a hidden browser Team field can confer permission."
      ],
      "code": {
        "language": "text",
        "caption": "A conceptual responsibility map; arrows describe use, not separate deployed services",
        "code": "Responder -> HTTP adapter -> ownership use case\n                          -> Team authorization decision\n                          -> domain invariants -> repository -> PostgreSQL\nKNOWN at Builder checkpoint: Django/DRF + PostgreSQL domain implementation\nPROPOSED responsibility decomposition: verify against actual source\nD-01: authoritative permission to transfer recorded owner is UNRESOLVED"
      }
    },
    {
      "title": "A change request reveals where boundaries help",
      "paragraphs": [
        "Suppose the business asks that transfers require an additional approver, while recorded-owner lookup remains unchanged. The approval-policy change should primarily affect the application authorization boundary, not the public read contract or the persistence representation. If it forces unrelated lookup serializers and database tables to change, investigate coupling instead of assuming the current package boundaries are correct.",
        "Counterexample: label serializers.py, models.py, views.py and services.py as four independent C4 components solely because four files exist. That drawing conceals the actual ownership rule and wrongly implies the four concerns are separately deployable. The independent probe is to label which responsibility rejects a Team B transfer of Team A's Service and what persisted state must remain unchanged; cite the actual implementation or mark the rule proposed."
      ]
    }
  ],
  "Coupling and Cohesion Foundations": [
    {
      "title": "Separate three coupling mechanisms in one ownership change",
      "paragraphs": [
        "Coupling is the cost imposed on one part when another changes, fails or must be coordinated. Interface coupling arises when an adapter relies on a specific request/response shape. Data coupling arises when two modules read or write the same ownership tables. Temporal coupling arises when an approval must be obtained synchronously before the caller can continue. Cohesion asks whether one component's responsibilities change together for the same business reason, rather than bundling unrelated tasks in a generic utility.",
        "For OBS-01, the proposed ownership directory is not established as a current dependency. If later introduced, require a clear contract describing whether it provides advisory facts or authoritative approved membership. Merely drawing an integration arrow does not answer the coupling question. To reduce failure propagation, inspect which call must happen synchronously and which decision must be made from durable local policy; record a fallback only when its authorization implications are approved."
      ],
      "code": {
        "language": "text",
        "caption": "Different coupling observations have different remedies",
        "code": "CHANGE: directory response adds field -> interface coupling; adapter contract test\nCHANGE: directory and Steward share owner table -> data coupling; ownership boundary review\nFAILURE: transfer waits on directory response -> temporal coupling; timeout policy review\nCODE: registry rule imports HTTP view -> source dependency; test/change impact\nNOT PROVEN: a new microservice would automatically remove any of these"
      }
    },
    {
      "title": "Execute a tiny dependency-cycle experiment",
      "paragraphs": [
        "A cycle means A depends on B while B can eventually depend on A. It may be a code-import cycle, a logical policy cycle or a runtime call cycle; the consequences differ, so label which one you found. Copy this Python 3 standard-library example to see why an apparently small reverse import breaks acyclic dependency direction. It models static dependencies, not actual Steward imports.",
        "Expected stdout is `baseline cycle: False` followed by `policy imports transport: True`. A negative case is built into the second run. Explain why splitting HTTP and policy into separately deployed processes would not resolve the *logical* cycle without changing contract ownership. The independent challenge is to draw a three-node dependency graph with a deliberate cycle and propose the smallest justified direction change."
      ],
      "code": {
        "language": "python",
        "caption": "Executable static dependency graph; requires only Python 3",
        "code": "deps = {'http_adapter': ['ownership_use_case'], 'ownership_use_case': ['registry_policy'], 'registry_policy': []}\ndef has_cycle(graph):\n    visiting, finished = set(), set()\n    def visit(node):\n        if node in visiting: return True\n        if node in finished: return False\n        visiting.add(node)\n        for peer in graph.get(node, []):\n            if visit(peer): return True\n        visiting.remove(node)\n        finished.add(node)\n        return False\n    return any(visit(node) for node in graph)\nprint('baseline cycle:', has_cycle(deps))\ndeps['registry_policy'] = ['http_adapter']\nprint('policy imports transport:', has_cycle(deps))"
      }
    }
  ],
  "Dependency Direction": [
    {
      "title": "Distinguish runtime call direction from source dependency direction",
      "paragraphs": [
        "At runtime an HTTP request enters the adapter and can invoke a use case that invokes a persistence adapter. Source dependencies need not point the same way. When the core rule defines a narrow repository protocol and the database adapter implements it, the outer adapter depends on the inner contract even though requests still execute from the caller toward the database. This is dependency inversion, not a rule that every function needs an interface.",
        "For OBS-01, the boundary worth insulating is the domain rule deciding whether a recorded-owner transfer is permitted. A rule that imports DRF's `Request` or trusts a client-supplied Team identifier is harder to test and can leak transport identity into authorization. An application adapter should translate a verified caller context into explicit domain inputs. Verify how Builder v1 currently enforces Team scope before documenting this as implemented."
      ],
      "code": {
        "language": "text",
        "caption": "Two different arrow meanings for an illustrative owner-transfer use case",
        "code": "RUNTIME: HTTP adapter -> transfer use case -> PostgreSQL adapter\nSOURCE:  HTTP adapter -> transfer use case -> owner policy + repository port\n         PostgreSQL adapter -------------> repository port\nBAD:     owner policy -> DRF Request -> browser-provided Team header\nPROOF:   denied cross-Team transfer preserves old owner (test, not box drawing)"
      }
    },
    {
      "title": "Use a change test before adding an abstraction",
      "paragraphs": [
        "Alternative A: call the Django ORM directly from a small application service. This can be acceptable when persistence is stable, behavior is simple and transaction boundaries are visible. Alternative B: isolate a repository protocol when domain tests, multiple adapters or independent replacement justify it. Alternative C: let the HTTP view update owner rows directly; this obscures invariants and should be challenged. Evaluate the evidence and maintenance cost rather than awarding every extra interface a higher architecture score.",
        "Counterexample: a generic `Repository<T>` that hides PostgreSQL transaction/locking behavior can weaken reasoning about atomic authorization, while claiming a cleaner architecture. The independent probe asks what happens if the storage adapter changes but the Team policy stays fixed, and which tests distinguish an acceptable direct ORM dependency from a hazardous domain-to-HTTP dependency."
      ]
    }
  ],
  "Internal and External Dependencies": [
    {
      "title": "Build a dependency inventory with ownership and evidence tiers",
      "paragraphs": [
        "Inventory the actual Builder v1 Steward runtime, not a future systems poster. PostgreSQL is an authoritative persistence dependency at this teaching checkpoint; Django/DRF is code/framework infrastructure. A proposed corporate owner directory, enterprise identity provider or queue remains `PROPOSED` or `UNVERIFIED` until code, configuration and runtime demonstrate integration. Each inventory row must identify its owner, contract, change cadence, failure outcome and the evidence that supports the classification.",
        "A useful dependency record answers two different questions: who maintains the technical service, and who decides the business truth it supplies. A directory might be operated by an IAM team but still not approve cross-Team owner transfer. Technical connectivity never substitutes for a verified authorization decision."
      ],
      "code": {
        "language": "text",
        "caption": "Evidence-based dependency inventory for OBS-01",
        "code": "Name | Current? | Contract | Failure consequence | Authority\nPostgreSQL | verified Builder v1 | local SQL transaction | owner write cannot commit | Steward registry\nDjango/DRF | verified Builder v1 | application APIs | application cannot serve | Steward team\nOwner directory | proposed D-01 | undefined | cannot assume fallback | unresolved\nRabbitMQ | later teaching lab only | AMQP model | not on current lookup path | not deployed\nFor each line attach code/config/run evidence or explicitly UNVERIFIED"
      }
    },
    {
      "title": "Failure choices must follow responsibility, not convenience",
      "paragraphs": [
        "If PostgreSQL is unavailable during an authorized transfer, the system should not claim the owner was changed; return a failure and verify that durable state remains unchanged. If an optional enrichment source times out during a recorded-owner read, a degraded response may be acceptable only if the response clearly distinguishes verified record from missing enrichment and policy permits it. If the *authority for transfer* is unresolved, there is no basis for silently granting a mutation.",
        "Independent probe: a colleague suggests caching the last known owner and accepting transfers while the authority source is down. Argue for or against it with one concrete invariant, expected HTTP/domain result, audit evidence and recovery path. A cache can improve read availability but does not manufacture authorization. Carry the resulting dependency-failure assumption into the next Data Flow module."
      ]
    }
  ]
};
export const componentsRunningReferences:Record<string,LearningResource[]> = {
  "Components and Responsibilities": [
    {
      "title": "C4 — Component abstraction and responsibility",
      "url": "https://c4model.com/abstractions/component",
      "kind": "reference"
    }
  ],
  "Coupling and Cohesion Foundations": [
    {
      "title": "Martin Fowler — Coupling",
      "url": "https://martinfowler.com/ieeeSoftware/coupling.pdf",
      "kind": "reference"
    }
  ],
  "Dependency Direction": [
    {
      "title": "Microsoft — Architectural principles and dependency inversion",
      "url": "https://learn.microsoft.com/en-us/dotnet/architecture/modern-web-apps-azure/architectural-principles",
      "kind": "reference"
    }
  ],
  "Internal and External Dependencies": [
    {
      "title": "C4 — Component diagram boundary",
      "url": "https://c4model.com/diagrams/component",
      "kind": "reference"
    }
  ]
};
