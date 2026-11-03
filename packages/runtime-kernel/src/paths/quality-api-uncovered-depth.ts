// Focused original-source cases for previously brief API readings. Distinguish
// local simulations from real Steward/IdP/remote-provider integrations.
export const qualityApiUncoveredDepth = {
  "rest-assured-model": [
    {
      "heading": "Trace HTTP request construction to the response oracle",
      "body": "REST Assured is a Java DSL over HTTP. given() constructs request configuration: target base URI, path/query parameters, authentication identity and content negotiation. when() performs the exchange. then() evaluates transport claims; extract() gives back representation data for independent domain assertions. The same test should record the accepted API contract, not derive truth from its implementation. Treat a path variable as a distinct URI component rather than string-concatenating untrusted names. An HTTP 200 is an observation, not proof of a correct owner, collection or forbidden mutation."
    },
    {
      "heading": "Worked example: response is 403, state must remain unchanged",
      "body": "For a hypothetical Steward owner-transfer API, first issue GET as an authorized observer to capture owner=team-7. Then POST as an actor with no transfer permission. Assert the documented denial code 403 and error envelope, and independently GET again to verify owner still team-7. The initial request specification and observed HTTP status belong to protocol assertions; the before/after state comparison is the business oracle. The earlier original localhost HttpClient lab runs this pattern without depending on a real identity provider. REST Assured should implement the identical contract only after its Maven dependencies are installed."
    },
    {
      "heading": "Negative and alternative design",
      "body": "If a faulty server returns 403 but already changed owner to team-9, a status-only REST Assured check passes. A response-body schema check alone can pass too. Only the independent read-after-denial or a justified database assertion detects the side effect. An API-only test is enough for authorization when rendering adds no evidence; do not build a browser duplicate solely for coverage count."
    },
    {
      "heading": "Unseen application",
      "body": "Write a REST Assured-style test for a rejected duplicate service registration. Name request parameters, status and error-envelope checks, independent durable uniqueness verification, and how the test will avoid reusing mutable global request specification state."
    }
  ],
  "schema-contract": [
    {
      "heading": "Structure, semantics and compatibility are separate claims",
      "body": "JSON Schema can express object shape, required properties, scalar types, enums and sometimes field constraints. It cannot decide whether an owner belongs to the logged-in team or whether a denied operation changed persisted data. An OpenAPI document can describe transport, schemas and operations, but compatibility must be judged against supported consumers. A schema-valid JSON payload can still be a business defect."
    },
    {
      "heading": "Worked contract: accepted owner representation",
      "body": "Suppose a documented successful GET returns an object with required serviceId:string, ownerTeamId:string and revision:integer. This example deliberately requires ownerTeamId, not an optional fallback. A body omitting ownerTeamId must fail structural validation even if HTTP 200 and other fields match. The same endpoint's 403 response may require code=FORBIDDEN and an opaque correlationId, without revealing secret credentials or internal service names."
    },
    {
      "heading": "Negative and versioning implications",
      "body": "Adding an optional field is often nonbreaking for tolerant consumers, but changing ownerTeamId from string to an integer or removing it can break a strictly typed client. A provider may pass its own current contract while a deployed consumer still expects the old one. Keep a versioned consumer fixture and test a deliberately removed required field. Validate presence and scalar type, then separately verify authorization and state invariants."
    },
    {
      "heading": "Unseen application",
      "body": "You support two mobile-client versions: one requires pagination.nextCursor to be string or null; another assumes an absent field means end of list. Design a contract compatibility matrix, identify an incompatible omission and explain how consumer-driven evidence complements a schema check."
    }
  ],
  "mocking-virtualization": [
    {
      "heading": "Model the boundary and make the fake's limitations explicit",
      "body": "A service virtualizer replaces a remote dependency with an executable, controllable protocol substitute. It can reproduce a known response, delay or transport failure, allowing a test to force rare conditions without damaging a shared identity, notification or registry service. The subject under test is then the application behavior at that boundary, not the actual remote provider's correctness. Name what is real, what is simulated, and which provider contract version the simulation implements."
    },
    {
      "heading": "Worked adverse-response matrix",
      "body": "For a notification dependency, a fixture can return 202 accepted, 400 invalid destination, 429 rate-limited, 503 unavailable, delayed response or malformed payload. For each specify expected application decision: retry only when safe, respect bounded timeout, avoid duplicate sends and preserve an actionable failure. Configure the fake deterministically; capture exact request and side-effect count rather than trusting a single status code."
    },
    {
      "heading": "Negative: a perfectly compliant mock can hide a broken integration",
      "body": "If the fake always accepts a missing authorization header or returns fields absent from the actual provider, a green application integration test establishes only behavior against the fake. A new provider revision might change its error envelope. Keep separate tests that verify real provider compatibility when access is authorized, plus a drift review against versioned provider documentation/approved sanitized captures. Never claim live provider behavior from synthetic fixture results."
    },
    {
      "heading": "Unseen application",
      "body": "A payment-notification service sometimes times out after persisting a message. Design a safe virtualization experiment that exposes the unknown-commit ambiguity without automatically retrying a state-changing request. Name a correlation/idempotency key and the independent postcondition needed before declaring success."
    }
  ]
} as const;
