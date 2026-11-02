import type {LearningResource} from "../activities/content";
type FlowSection = {title:string;paragraphs:string[];code?:{language:string;caption:string;code:string}};
// Fictional OBS-01 continuity; proposed directory/transfer capabilities are not deployed facts.
export const flowRunningCase:Record<string,FlowSection[]> = {
  "Following Data Through a System": [
    {
      "title": "OBS-01: distinguish a query from a transfer",
      "paragraphs": [
        "The previous component inventory located Steward's recorded owner in PostgreSQL and left business approval D-01 unresolved. Now trace the actual information contract. The responder's FR-OWNER-01 lookup starts with a service identifier, not an implementation method: request validation identifies the Service, authorized read access is evaluated, the registered Team is loaded from authoritative Steward state, and the response explicitly labels it as the **recorded** owner rather than independently verified current organizational truth.",
        "FR-OWNER-02 would instead request a Team transfer. Treat it as a proposed capability until its policy and implementation are verified. Authentication tells Steward who called; server-side Team authorization asks whether this caller may move this Service; domain rules decide whether the transition is admissible; one transaction persists authorized state. If the owner directory is future work, its absence must be visible rather than replaced by a fictional green check."
      ],
      "code": {
        "language": "text",
        "caption": "Two different flows; current implementation requires code-level verification",
        "code": "READ [FR-OWNER-01, illustrative]\nResponder intent -> service identifier validation -> read authorization -> registry read\n  -> HTTP response: recorded owner + verification state + source timestamp (if implemented)\nTRANSFER [FR-OWNER-02, PROPOSED until policy D-01 approved]\nTrusted caller -> requested Service + destination Team -> Team authorization -> domain invariant\n  -> PostgreSQL transaction COMMIT -> response with durable outcome\nDENIED: no COMMIT and prior Team remains unchanged\nNever claim a browser-supplied Team header itself proves permission"
      }
    },
    {
      "title": "Mark ownership, transformations and evidence at each hop",
      "paragraphs": [
        "A sequence diagram is insufficient if every arrow says `data`. Annotate whether a field is untrusted input, verified caller context, domain identifier, authorized ownership claim, committed state, or response presentation. A `team_id` entered in a form is a claim from the client, not proof of membership. A PostgreSQL row is durable evidence of the *recorded* owner but not automatically proof that the business directory agrees.",
        "Negative probe: a model labels the response `actual owner` immediately after a database read, with no freshness or authority check. Identify the semantic leap, the source of truth, how staleness would be detected, and what the response may safely promise. Transfer the unresolved failure question to the later Integration Contracts lesson."
      ]
    }
  ],
  "Synchronous and Asynchronous Boundaries": [
    {
      "title": "Draw the waiting chain before selecting a queue",
      "paragraphs": [
        "A synchronous operation is one where the caller waits for a result before proceeding. For the proposed Team transfer, authorization and a durable domain decision are on the critical path: answering 'success' before the record is committed would be misleading. An optional downstream notification can be asynchronous if the business contract explicitly allows the owner change to succeed while delivery remains pending. This does not justify treating approval itself as eventually consistent.",
        "Compute a small hypothetical latency budget: 40 ms request handling + 35 ms domain/SQL + 480 ms external notification = 555 ms on the synchronous path. If notification moves to a durable outbox, the immediate path can be about 75 ms plus the extra local outbox write; the provider delay moves out of band, but failure monitoring, retries and duplicate-safe effects become required. These numbers are teaching assumptions, not measured Steward behavior."
      ],
      "code": {
        "language": "text",
        "caption": "Illustrative timing and meaning — not measured production latency",
        "code": "SYNCHRONOUS: authorize -> SQL COMMIT -> provider call -> reply\n  40 + 35 + 480 = 555 ms (example, not benchmark)\nASYNC OPTION: authorize -> SQL state+outbox COMMIT -> accepted durable result (~75 ms + outbox write)\n  worker later -> provider (may fail / retry / duplicate)\nREQUIRED CONTRACT: domain state committed != notification delivered\nREJECTED DESIGN: 202 Accepted before safe durable handoff"
      }
    },
    {
      "title": "Asynchrony adds a state machine, not just speed",
      "paragraphs": [
        "A queued notification has at least pending, dispatched and failed/retry-exhausted states, and those labels need specific owner, retry policy and observable status. A broker acknowledgement confirms only a protocol boundary appropriate to that step; it cannot prove a human read an email or that a remote provider accepted a unique business operation. The later distributed messaging module tests these boundaries with real services.",
        "Negative case: the handler commits a Team change, publishes an event, crashes before acknowledging; the consumer receives the same event twice. A safe design identifies stable event identity and an idempotent *consumer-side* effect, not a promise that the broker never redelivers. The independent question is whether synchronous execution would actually avoid this crash window, and what it costs in availability."
      ]
    }
  ],
  "Integration Contracts": [
    {
      "title": "Derive the contract from meaning and authority",
      "paragraphs": [
        "Suppose a future ownership directory is proposed as an integration for OBS-01. Before choosing HTTP, SOAP, an event or a CSV, specify the semantics: what identifier identifies the same Service, which Team is authoritative, who can approve a transfer, how freshness is expressed, what a missing record means, and what failures should preserve the current state. The directory could be advisory for reads but still insufficient as authorization for a write.",
        "Separate three version dimensions: transport/schema shape, business meaning and authorization policy. A syntactically valid `ownerTeam` field might change from an owning Team to a contact queue in a vendor upgrade. That is a semantic break even if every JSON test and HTTP status remains green. Record contract examples with both accepted and rejected business cases."
      ],
      "code": {
        "language": "text",
        "caption": "Proposed external owner lookup contract; no endpoint is asserted deployed",
        "code": "OPERATION: getRecordedOwnership(service_key)\nINPUT: stable service_key; trusted machine identity as defined in approved integration plan\nOUTPUT: owner_team_id, source_as_of, authority_level (verified/advisory)\nUNKNOWN: authorizer for transfer D-01; retention/caching policy\nERRORS: 404 unknown Service; 503 unavailable; stale-data flag; invalid trust -> deny\nNOT ALLOWED: silently convert advisory owner into transfer authorization\nVERSION CHECK: same field name with changed meaning must fail semantic contract review"
      }
    },
    {
      "title": "A status code is not a domain guarantee",
      "paragraphs": [
        "HTTP 200 says the request was handled successfully under a particular HTTP contract, not that the organization approved an owner change. HTTP 202 means accepted for processing, not necessarily completed. HTTP 409 may represent a version or intent conflict. Document the exact state each response guarantees. A retry after a timeout is safe only if the operation is idempotent under a stable key, has replay authorization and rejects changed intent.",
        "Counterexample: the caller times out after the directory commits a request. It retries with the same operation key but a new destination Team; accepting the changed parameters would make one key authorize two intentions. AWS's retry guidance treats changing intent with the same identifier as a mismatch. Independently specify response contracts for success, missing record, invalid permission, changed-intent replay and outage."
      ]
    }
  ],
  "Failure Across Integrations": [
    {
      "title": "Trace five distinct outcomes of one handoff",
      "paragraphs": [
        "An external operation can fail before being sent, fail during transport, execute then lose its response, return an explicit application rejection, or succeed locally while a downstream notification fails. Only the explicit application rejection has known negative business semantics. The timeout-after-commit case is *ambiguous* from the caller's viewpoint; never infer a database rollback from a network exception.",
        "The adjacent source-executed ambiguous HTTP/SQLite lesson demonstrates post-commit response loss, a restarted process and a stable idempotency key. Use this conceptual map to predict its observations first. The domain effect and transport receipt must be recorded as separate facts, with independent evidence for each boundary."
      ],
      "code": {
        "language": "text",
        "caption": "Failure classification for a proposed owner transfer, with observable evidence",
        "code": "A. Request rejected before authorization -> no domain mutation\nB. Timeout before sending -> remote state unknown unless sender proves no request left\nC. Remote SQL COMMIT, TCP response dropped -> caller sees timeout; state IS committed\nD. Remote validation responds 409 -> domain contract rejects changed intent\nE. SQL COMMIT + notification failure -> owner changed; notification pending/failed\nRETRY: same trusted actor/scope + same key + same intent; verify durable outcome\nRECONCILE: compare authoritative state, do not infer success from packet delivery"
      }
    },
    {
      "title": "Design the negative test before approving recovery",
      "paragraphs": [
        "A useful integration recovery plan states which operation key is stable, where it is stored, which database transaction contains it, whether the caller remains authorized on replay, and which downstream side effect might repeat. Local SQL atomicity does not make an external provider and the local database one transaction. A compensating action is a new business operation and should not be confused with rollback across systems.",
        "Independent challenge: the first transfer times out, then a different authorized person transfers the Service again. An old retry arrives later. Should the old result be replayed, rejected due to current version, or compensated? No universal answer exists without specifying semantics, retention and version rules. Write two reasonable policies, show what each sacrifices, and identify what domain authority must approve before implementation."
      ]
    }
  ]
};
export const flowRunningReferences:Record<string,LearningResource[]> = {
  "Following Data Through a System": [
    {
      "title": "C4 — Dynamic interactions at a chosen zoom",
      "url": "https://c4model.com/diagrams",
      "kind": "reference"
    }
  ],
  "Synchronous and Asynchronous Boundaries": [
    {
      "title": "AWS Builders' Library — safe retry semantics",
      "url": "https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/",
      "kind": "reference"
    }
  ],
  "Integration Contracts": [
    {
      "title": "RFC 9110 — HTTP semantics",
      "url": "https://www.rfc-editor.org/rfc/rfc9110",
      "kind": "reference"
    }
  ],
  "Failure Across Integrations": [
    {
      "title": "AWS Builders' Library — retries, client request identity and late arrival",
      "url": "https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/",
      "kind": "reference"
    }
  ]
};
