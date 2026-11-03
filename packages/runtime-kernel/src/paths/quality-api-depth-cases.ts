import type { LessonBlock } from "../activities/content";

// Focused mechanism/counterexample/transfer additions to the ORIGINAL API
// readings; unchanged authored lesson IDs and exact caller-state distinctions.
export const qualityApiDepth: Record<string, LessonBlock[]> = {
  "filters-observability": [
    {
      "type": "heading",
      "id": "api-filter-mechanism",
      "text": "How a REST Assured filter surrounds the HTTP exchange",
      "level": 2
    },
    {
      "type": "paragraph",
      "text": "A REST Assured Filter receives a mutable request specification, a response specification and a FilterContext. Its contract resembles middleware: it can inspect or transform the outbound request, call the next filter to send it, inspect the returned response, then return that response to the test. Because filters can change behavior, the test should give them narrow responsibilities such as correlation IDs, timing and safe diagnostics, not ownership decisions or product assertions. An instrumentation filter that fails to invoke the chain correctly may prevent the HTTP request entirely."
    },
    {
      "type": "heading",
      "id": "api-filter-worked",
      "text": "Worked trace: two distinct callers and one forbidden operation",
      "level": 2
    },
    {
      "type": "paragraph",
      "text": "Suppose a Steward test sends POST /services/42/transfer as non-owner B. Before dispatch, a filter records run ID, test ID, method/path, target release and a generated correlation ID; it explicitly omits Authorization header contents. After the HTTP call, it records response status, elapsed time, safe error code and correlation ID. The actual test still asserts the documented 403 and performs an independent authorized read of the owner. Without that final assertion, the filter can truthfully report '403' while the product silently mutates state."
    },
    {
      "type": "paragraph",
      "text": "A useful safe event might read 'run=R9 test=denied-transfer callerRole=nonOwner method=POST path=/services/42/transfer status=403 correlation=C22'. It must never include raw bearer tokens, cookies, passwords, full biometric payloads or customer records. If the service generates its own correlation ID, preserve both the request and response identity without assuming they are identical."
    },
    {
      "type": "heading",
      "id": "api-filter-failure",
      "text": "Counterexamples: logging everything and mutating requests invisibly",
      "level": 2
    },
    {
      "type": "list",
      "items": [
        "A generic request logger prints Authorization: Bearer ... before redaction; downstream CI artifacts now leak credentials even if test results pass.",
        "A filter rewrites POST data from team 9 to team 7 to simplify setup; tests no longer represent the caller's real request, masking authorization defects.",
        "A diagnostic filter catches an exception and returns an invented 200; the framework manufactures a green result. Preserve the original failure and report diagnostic loss separately.",
        "A request/response pair is captured without its environment or commit; the artifact cannot safely support a release verdict."
      ]
    },
    {
      "type": "heading",
      "id": "api-filter-independent",
      "text": "Independent transfer: failed reference payment",
      "level": 2
    },
    {
      "type": "paragraph",
      "text": "Design a filter for a service-payment call whose response includes a correlation header and a potentially sensitive reference number. Name the exact whitelisted metadata fields, truncation/redaction rules, and how a network timeout differs from a completed HTTP error. Identify which payment correctness assertions remain outside the filter."
    }
  ],
  "specifications": [
    {
      "type": "heading",
      "id": "api-spec-build",
      "text": "Separate a factory-built transport baseline from scenario identity",
      "level": 2
    },
    {
      "type": "paragraph",
      "text": "A RequestSpecification is a reusable description of transport defaults such as base URI, content type, safe filters and an immutable set of invariant headers. A factory can create a specification from run-scoped environment configuration; the caller's token, request body, target service and test-specific headers are applied for a particular request. Reusing a shared mutable object containing the last admin token creates invisible cross-test coupling, especially when JUnit executes tests concurrently."
    },
    {
      "type": "heading",
      "id": "api-spec-worked",
      "text": "Worked comparison: owner A and non-owner B",
      "level": 2
    },
    {
      "type": "paragraph",
      "text": "Start from two independent test cases that call /services/42/transfer. Both use the same configured base URI, JSON content negotiation, correlation filter and timeout policy. Test A supplies owner A's credential and expects the approved transfer behavior. Test B supplies non-owner B's credential and expects denial with unchanged state. If the request specification stores A's bearer token globally, B's request may accidentally be executed as A, falsely passing an owner-permitted scenario. Scope identity explicitly per test invocation, do not mutate a global default and compare actual request metadata without logging secrets."
    },
    {
      "type": "heading",
      "id": "api-spec-response",
      "text": "ResponseSpecification is not the product oracle",
      "level": 2
    },
    {
      "type": "paragraph",
      "text": "A shared response specification may check a truly universal envelope requirement only if it applies to all endpoints and failure modes. A global 'status 200' condition would break correct 201, 202, 204, 401, 403 and 409 responses and encourage weakening tests to make them green. Keep business status, body fields, error codes and state-after invariants local to the test that knows the requirement. JSON schema validation can be shared where the schema truly is common; it still cannot prove the data belongs to the right owner."
    },
    {
      "type": "heading",
      "id": "api-spec-failure",
      "text": "Counterexamples and an experiment",
      "level": 2
    },
    {
      "type": "list",
      "items": [
        "Mutating a static RequestSpecification between two parallel tests can leak credentials or endpoint paths.",
        "Overly broad logging filters attached to the shared specification can expose secrets across every test.",
        "Duplicating complete request setup in every test makes protocol settings drift; extract the genuinely stable pieces.",
        "A 403 branch correctly rejects transfer but a universal 2xx response spec fails the test for the wrong reason."
      ]
    },
    {
      "type": "heading",
      "id": "api-spec-independent",
      "text": "Independent transfer: three API identities",
      "level": 2
    },
    {
      "type": "paragraph",
      "text": "Design a factory policy for anonymous, normal-user and privileged-admin calls to an OTP-enabled endpoint. Show which settings can be immutable and reused, which credentials must be per-call, and one concurrent test that would expose a shared auth state leak. Explain why expected OTP error codes do not belong in a global ResponseSpecification."
    }
  ],
  "auth-testing": [
    {
      "type": "heading",
      "id": "api-authn-authz",
      "text": "Distinguish identity, permission, resource visibility and state",
      "level": 2
    },
    {
      "type": "paragraph",
      "text": "Authentication determines whether the request presents valid identity credentials. Authorization determines whether that authenticated identity may perform a particular operation on a particular resource in its current state. A role such as operator is not the whole policy: ownership, team membership, resource lifecycle, delegated privileges and expiry may also matter. Tests must use separate genuine identities and independent setup; relabelling an admin token as 'non-owner' does not challenge the backend."
    },
    {
      "type": "heading",
      "id": "api-status-difference",
      "text": "What 401 and 403 mean at the HTTP boundary",
      "level": 2
    },
    {
      "type": "paragraph",
      "text": "Under RFC 9110, 401 normally indicates missing or invalid credentials for the resource and is associated with an authentication challenge; 403 indicates the server understood the request but refuses it. Some APIs intentionally return 404 to avoid exposing existence of a forbidden resource. Consequently, test the approved product contract rather than assuming every hidden resource must return 403. Compare unauthenticated, authenticated but unauthorized and permitted identities and ensure error bodies disclose no excessive detail."
    },
    {
      "type": "heading",
      "id": "api-auth-matrix",
      "text": "Worked ownership and membership decision matrix",
      "level": 2
    },
    {
      "type": "list",
      "items": [
        "No credentials: expected authentication challenge/denial as specified; resource and sensitive data must not be exposed.",
        "Valid caller A belongs to owner team 7, service is active: permitted update according to the approved rule; verify resulting persisted owner and event semantics.",
        "Valid caller B belongs only to unrelated team 9: denied mutation with unchanged owner/status, checked by a separately authorized read.",
        "Former team member whose membership was removed before the operation: the current membership/authorization source controls the decision; stale token claims must not bypass revoked server-side rights unless a documented policy explicitly permits a limited window.",
        "Privileged operator: test the exact administrative scope and auditing rule; do not assume superuser access is identical to ordinary ownership."
      ]
    },
    {
      "type": "heading",
      "id": "api-auth-negative",
      "text": "A failure that a status-only test misses",
      "level": 2
    },
    {
      "type": "paragraph",
      "text": "Consider a handler that writes owner=9 and only afterward detects that B lacks permission, returning 403. A test asserting status 403 passes while the protected business invariant fails. Verify the authoritative state after denial. For asynchronous actions, also inspect that no forbidden event or queued side effect was committed. If a request is deliberately hidden with 404, the non-mutation invariant still applies."
    },
    {
      "type": "heading",
      "id": "api-auth-broken-identity",
      "text": "Authentication expiry, wrong audience and credential leakage",
      "level": 2
    },
    {
      "type": "paragraph",
      "text": "A bearer token may be expired, signed by an untrusted issuer, issued for another audience or lack current permissions. Build precise negatives using an authorized test identity service; never forge privileged production tokens. Avoid printing raw token values in reports, and verify response cache behavior does not expose an authorized user's representation to an unrelated user. These tests belong at real middleware/API boundaries rather than a mocked pure rule alone."
    },
    {
      "type": "heading",
      "id": "api-auth-transfer",
      "text": "Independent transfer: a delegated financial approval",
      "level": 2
    },
    {
      "type": "paragraph",
      "text": "A payment approval may require two distinct signers and an unexpired delegation. Define at least six matrix rows across missing identity, wrong signer, expired delegation, owner signer, second signer and revoked delegation. For each write the authorized action, expected observable response and invariant after denial. Specify which rules remain unclear and must be confirmed with business."
    }
  ]
};
