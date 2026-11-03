import type { LessonBlock } from "../activities/content";

// Authored, topic-specific extensions to the ORIGINAL Test Analysis readings.
// These are not generated wrappers and do not introduce new activity IDs.
export const qualityTestDesignDepth: Record<string, LessonBlock[]> = {
  "exploratory-testing": [
    {
      "type": "heading",
      "id": "exploratory-mechanism",
      "text": "How investigation, test design and execution happen together",
      "level": 2
    },
    {
      "type": "paragraph",
      "text": "An exploratory session starts with an investigable question, not a random list of buttons. The tester builds a working model of the product, chooses an experiment based on that model, observes the result, and revises the model. This feedback loop distinguishes exploration from running predefined checks. A charter limits attention to one risk; timeboxing controls cost; a session log makes what happened reproducible. The objective is learning about behavior and unknowns, not maximizing click count."
    },
    {
      "type": "heading",
      "id": "exploratory-worked-session",
      "text": "Worked 30-minute session: ownership changes with stale sessions",
      "level": 2
    },
    {
      "type": "paragraph",
      "text": "Assume, purely for this exercise, that a current team owner may transfer a service and a former owner may not. Start with two independent identities, owner A and non-owner B. In minutes 0–5 record the rule and baseline owner via an authorized read. In minutes 5–12 transfer once as A and inspect both response and persisted owner. In minutes 12–20 deliberately keep A's previously authenticated browser tab open while a different authorized actor changes the owner; try A's stale transfer. In minutes 20–25 try the same request directly through the API to separate UI hiding from server enforcement. Spend the last five minutes writing observations, possible risks and follow-up tests. No outcome may be invented from this planned session."
    },
    {
      "type": "paragraph",
      "text": "The first experiment may reveal that the button stays enabled although the server returns 403; that is a frontend feedback question. A more serious observation would be a 403 with the owner actually changed; that becomes a backend invariant defect requiring a read-after-denial oracle. A third possibility is that A remains authorized under a documented grace period: that is a clarification question, not necessarily a defect. These alternatives demonstrate why the observed outcome must guide the next experiment."
    },
    {
      "type": "heading",
      "id": "exploratory-heuristics",
      "text": "Use explicit heuristics to choose the next probe",
      "level": 2
    },
    {
      "type": "list",
      "items": [
        "State changes: create, retire, transfer, reopen; investigate each transition and invalid reversal.",
        "Actors and permissions: compare owner, unrelated member, privileged operator and unauthenticated caller without sharing identities.",
        "Time and interruption: retry after timeout, use stale browser state, interleave two authorized operations.",
        "Data and boundaries: zero, empty, oversized and duplicate values; check for unintended persistence.",
        "Observability: record correlation ID, before/after state, request method, response and release/environment rather than relying on a screenshot alone."
      ]
    },
    {
      "type": "heading",
      "id": "exploratory-notes",
      "text": "What a useful session note contains",
      "level": 2
    },
    {
      "type": "paragraph",
      "text": "A defensible log contains charter, candidate version, exact environment, participant identity/role (not credential), time window, test data, experiment order, observed outputs, coverage/areas not reached, questions, defects and next hypotheses. Mark each statement as OBSERVED, INFERRED or TO VERIFY. If no product is available, produce a simulation plan but do not call it executed testing. A scripted regression is a repeatable future probe for a known rule; exploratory testing remains useful to discover the next unknown."
    },
    {
      "type": "heading",
      "id": "exploratory-counterexample",
      "text": "Failure: a long session with little evidence",
      "level": 2
    },
    {
      "type": "paragraph",
      "text": "Suppose a tester clicks through 40 pages, records 'seems fine' and reports 100% exploratory coverage. There is no defined risk, observable oracle, event history or repeatable finding. The number of actions cannot support that conclusion. The repair is a narrower charter and at least one disconfirming experiment, followed by explicit residual unknowns."
    },
    {
      "type": "heading",
      "id": "exploratory-transfer",
      "text": "Independent transfer: retry after a payment timeout",
      "level": 2
    },
    {
      "type": "paragraph",
      "text": "Design a 25-minute charter for a payment request that times out after the server may have committed it. Name the first observation, two alternative hypotheses, a safe read-only way to distinguish them, and the evidence needed to decide whether a retry risks duplication. Do not reuse the ownership example or assume the payment failed simply because the client timed out."
    }
  ],
  "negative-testing": [
    {
      "type": "heading",
      "id": "negative-taxonomy",
      "text": "Separate invalid input from forbidden action and unavailable dependency",
      "level": 2
    },
    {
      "type": "paragraph",
      "text": "Negative testing is not simply sending bad data. A validation negative probes a malformed or out-of-range input; an authorization negative probes a valid operation by an ineligible actor; a state negative attempts an action from a forbidden lifecycle state; a dependency negative exercises controlled failure of an external service; a concurrency negative probes competing operations. Each has its own expected contract, protected invariant and diagnostic evidence. The absence of an exception in the test runner does not prove safe rejection."
    },
    {
      "type": "heading",
      "id": "negative-worked-oracle",
      "text": "Worked denial: prove both the error and absence of mutation",
      "level": 2
    },
    {
      "type": "paragraph",
      "text": "For an illustrative service with owner team 7, first read its authoritative owner/version through an authorized account. Next send a transfer POST as a member of unrelated team 9. If the documented policy denies it, expect the appropriate denial status and error shape, then read the owner/version again using a separately authorized identity. The owner must still be team 7, with no forbidden dependency, event or audit mutation. A front-end disabled button is not a server authorization test. A 403 response by itself is insufficient if state changed before rejection."
    },
    {
      "type": "paragraph",
      "text": "Model the competing implementations explicitly. Correct implementation: check policy, then write only when authorized. Defective implementation: write owner=9, then check policy, then respond 403. Both implementations emit the same 403; only the independent postcondition distinguishes them. This is a concrete example of an oracle stronger than a status-only test."
    },
    {
      "type": "heading",
      "id": "negative-layers",
      "text": "Write an observable failure contract at the right layer",
      "level": 2
    },
    {
      "type": "list",
      "items": [
        "400/422 invalid field: specify actual API contract, field location and validation rule; verify no partial record created.",
        "401 unauthenticated: omit or invalidate credentials; verify protected data is not exposed and state is not altered.",
        "403 forbidden: use a valid but unauthorized identity; compare state before and after by an independent caller.",
        "409 conflict: create a known resource-state or concurrency conflict; verify the documented winner and transactional consistency.",
        "503 dependency outage: use a disposable authorized failure injection, bounded retry window and recovery check; never sabotage shared production infrastructure."
      ]
    },
    {
      "type": "heading",
      "id": "negative-retry",
      "text": "Why an error may still have a committed side effect",
      "level": 2
    },
    {
      "type": "paragraph",
      "text": "Distributed operations can fail after a commit or after the response is lost. A timeout therefore means the client lacks an answer, not that the server necessarily rolled back. If the endpoint supports an idempotency key, repeat with the same key and verify the same intended effect; otherwise inspect state through an independent read before reissuing a mutation. Document whether the contract requires no mutation, at-most-one mutation or eventual compensation; those are different acceptance criteria."
    },
    {
      "type": "heading",
      "id": "negative-oracle-discipline",
      "text": "Do not derive expected results from the implementation",
      "level": 2
    },
    {
      "type": "paragraph",
      "text": "Obtain expected outcomes from the approved rule, protocol contract or an explicit clarification, not from whichever status the current backend returns. A test that copies code's behavior into the expected value will pass the same defect. Preserve a known-good before snapshot, use the smallest credible boundary for state-after checks, and log the claim, actor, request, observed result and unchanged invariant."
    },
    {
      "type": "heading",
      "id": "negative-transfer",
      "text": "Independent transfer: stale inventory reservation",
      "level": 2
    },
    {
      "type": "paragraph",
      "text": "For a stock reservation API, devise four negatives: missing quantity, expired authorization, insufficient stock and a request timed out after a possible commit. State the independent oracle and what must remain unchanged for each. One case should deliberately produce a failure after mutation; explain how your test would catch it."
    }
  ],
  "traceability": [
    {
      "type": "heading",
      "id": "trace-model",
      "text": "Treat traceability as a versioned evidence graph",
      "level": 2
    },
    {
      "type": "paragraph",
      "text": "Traceability is a set of links between claims, not merely a table filled with green labels. A requirement can motivate several test conditions, one test can cover several related conditions, and one execution result is evidence only for a specific build, environment, dataset and time. Distinguish immutable IDs for risk, requirement, test condition, test case, execution and defect. Keep link types explicit so a reviewer knows whether a test is planned, implemented, executed or passed."
    },
    {
      "type": "heading",
      "id": "trace-worked-chain",
      "text": "Worked chain: forbidden service-ownership transfer",
      "level": 2
    },
    {
      "type": "list",
      "items": [
        "Risk R-17: an unauthorized owner change corrupts service governance.",
        "Requirement REQ-14, version 2: only the currently authorized owner may transfer a service; clarify what 'current' means during an in-flight ownership update.",
        "Conditions C-14a owner permitted, C-14b non-owner rejected, C-14c stale ownership rejected, C-14d denial causes no mutation.",
        "Tests T-21 through T-24: unit authorization combinations, authenticated HTTP 403 plus read-after-denial, concurrency/transaction check on real PostgreSQL, and real browser error feedback only if a product UI exists.",
        "Execution E-233: test T-22 on commit abc123 in QA against a documented release and fixtures; captured 403 but owner changed. Defect BUG-48 links to this execution and violated C-14d. This result is FAIL, not 'covered and therefore passed'."
      ]
    },
    {
      "type": "paragraph",
      "text": "The letters and IDs are illustrative. The worked trace is deliberately many-to-many: requirement REQ-14 has four distinct conditions; test T-22 can investigate both rejection and non-mutation, while another test may address the concurrency clause. The trace records evidence quality rather than treating the existence of T-22 as proof that every condition passed."
    },
    {
      "type": "heading",
      "id": "trace-completeness",
      "text": "Three different completeness questions",
      "level": 2
    },
    {
      "type": "paragraph",
      "text": "Coverage completeness asks whether every high-risk condition has a planned or implemented evidence source. Execution completeness asks whether each mandatory selected test actually ran against the candidate. Outcome completeness asks whether those results and the protected business invariants justify the decision. A matrix with links in every cell can be 100% 'covered' while all tests are skipped, outdated or asserting only HTTP status. Therefore report each dimension separately."
    },
    {
      "type": "heading",
      "id": "trace-change-impact",
      "text": "Traceability must survive requirement changes",
      "level": 2
    },
    {
      "type": "paragraph",
      "text": "Suppose REQ-14 v3 permits delegated owners during a defined grace interval. Search backwards from tests that encode the old role rule and forwards from the revised requirement to conditions without executed evidence. Mark existing execution records with their original requirement version rather than rewriting history as if they validated v3. Update only tests whose oracle changed and explain residual risk for unchanged cross-cutting checks."
    },
    {
      "type": "heading",
      "id": "trace-reverse-check",
      "text": "Backward links reveal dead or misleading tests",
      "level": 2
    },
    {
      "type": "paragraph",
      "text": "A test named 'homepageLoads' may run on every release yet map to no business risk in the current API-only service. That is a candidate for removal or reframing, not automatic proof of quality. Conversely, a high-risk condition with no current execution is a release-evidence gap even if hundreds of other tests pass. Use link review to identify both."
    },
    {
      "type": "heading",
      "id": "trace-transfer",
      "text": "Independent transfer: reconcile a changed OTP rule",
      "level": 2
    },
    {
      "type": "paragraph",
      "text": "An OTP service changes from one active code to several simultaneously valid codes. Sketch requirement versions, high-risk conditions, selected tests and recent executions to revisit. Identify one test that now asserts an obsolete rule and one risk that is not covered at all. Include a defect link and explain how the release decision should handle the missing execution evidence."
    }
  ]
};
