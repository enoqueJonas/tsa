import type { LearningResource } from "../activities/content";
/** Twelve original capstone defence concepts, each with actual mechanism, negative countercase and transfer. */
export interface DefenceLens {sections:{heading:string;paragraphs:string[]}[];practice:string[];criteria:string[];resource:LearningResource;}
export const defenceLenses:Record<string,DefenceLens> = {
  "present-the-problem-and-outcomes": {
    "sections": [
      {
        "heading": "Explain whose decision changes and what measurable problem exists",
        "paragraphs": [
          "A problem statement describes a harmful present state, affected stakeholders, and the evidence that the state exists; a feature list describes a proposed intervention. These are different claims. In a fictional tool-lending cooperative, an item may appear available while it is physically held by another member. The relevant outcome is fewer contradictory handoffs, not merely that an API was built.",
          "Use a claim ladder: observation (two inventory records disagree), hypothesis (manual updating causes lag), design response (transactional custody history) and measured effect (observed conflicting-loan rate under a representative test). Do not present the fictional observation as a real interview or measured finding; the learner's independent capstone must supply its own original sources."
        ]
      },
      {
        "heading": "Defend scope and counterfactual outcomes",
        "paragraphs": [
          "A reviewer may ask whether training staff or improving an existing spreadsheet would be less costly than building software. Compare the least disruptive process alternative with the implemented system using user effort, failure consequences, maintenance and feasible measurement. A novel architecture is not proof the product creates value.",
          "If actual stakeholders have not verified the problem or changed their workflow, say IMPLEMENTED_NOT_USER_VALIDATED. Distinguish a test that enforces an invariant from a longitudinal claim that members benefited. State what evidence would justify continuing, reducing scope or abandoning the system."
        ]
      },
      {
        "heading": "Build a falsifiable outcome narrative",
        "paragraphs": [
          "Show the system performing one relevant user task, one failure path and one excluded requirement. Attach exact source revision, actor, input, persisted side effects and observed output; avoid treating a successful demo on preloaded data as representative performance.",
          "Unseen challenge: an independent reviewer announces that equipment is shared and can be jointly loaned. Explain which definition of ‘double loan’ is invalidated, which test needs changing and which discovery interview or inventory policy must be confirmed before redesign."
        ]
      }
    ],
    "practice": [
      "Produce a problem→hypothesis→implemented outcome→observed result trace from actual discovery evidence.",
      "Compare the delivered feature to one lower-tech alternative, and mark unvalidated stakeholder outcomes explicitly."
    ],
    "criteria": [
      "Every claimed user benefit has its own original observation or is NOT_TESTED.",
      "A changed stakeholder rule can falsify the defined invariant."
    ],
    "resource": {
      "title": "GOV.UK user research guide",
      "url": "https://www.gov.uk/service-manual/user-research",
      "kind": "reference",
      "purpose": "Conceptual reference, not evidence of completed user or production validation."
    }
  },
  "present-the-architecture": {
    "sections": [
      {
        "heading": "Distinguish domain boundaries, process boundaries and trust boundaries",
        "paragraphs": [
          "A domain boundary separates responsibility for an invariant; a process boundary separates independently deployed runtimes; a trust boundary identifies where authority assumptions change. A modular monolith can contain multiple domain modules inside one deployable and one transaction. Splitting those modules into services introduces message delivery, consistency and operator work.",
          "For fictional lending, the loan system owns custody, the external membership provider owns eligibility, and only an authorized staff identity can issue a physical item. Show each arrow's direction, datum owner and failure behavior; a diagram of rectangles labeled ‘API’ or ‘Kubernetes’ without these contracts is decorative."
        ]
      },
      {
        "heading": "Trace one request, one rejection and one crash",
        "paragraphs": [
          "Use the deployed source version to follow request authentication, object authorization, domain transition, transaction, response and notification. Under a signed cross-organization denial, there must be no unauthorized row or external effect; an HTTP 403 alone cannot establish that property.",
          "At a crash after commit but before response, distinguish what happened inside the durable boundary from what the client knows. Explain idempotency keys, lookup by request ID and notification replay; do not promise ‘exactly once’ without proving the actual effects."
        ]
      },
      {
        "heading": "Compare a simpler option and identify reversal conditions",
        "paragraphs": [
          "Challenge each component against a constraint: why a queue, cache, service mesh or separate service? Compare with a single process and transaction. Identify expected change frequency, throughput, fault isolation, ownership and operational budget.",
          "Your evidence must show both the proposed design's benefit and the cost it adds. A scaling claim is not established by a component diagram; a reviewer should be able to identify the exact load or team-ownership threshold at which the architecture decision would change."
        ]
      }
    ],
    "practice": [
      "Trace one authorized action and one valid signed forbidden action through ownership, transaction and response.",
      "Compare a modular single-process alternative with the deployed architecture and name a quantitative reversal condition."
    ],
    "criteria": [
      "Trust, domain and deployment boundaries are separately identified.",
      "One failure after durable commit has a safe unknown-outcome response."
    ],
    "resource": {
      "title": "C4 system context",
      "url": "https://c4model.com/diagrams/system-context",
      "kind": "reference",
      "purpose": "Conceptual reference, not evidence of completed user or production validation."
    }
  },
  "explain-trade-offs": {
    "sections": [
      {
        "heading": "An engineering trade-off prices the benefit and the sacrifice",
        "paragraphs": [
          "A decision record includes context, constraints, the options actually considered, observed versus predicted benefit, risk created, cost of reversing and a triggering observation. ‘Microservices are scalable’ is too vague to defend; ‘we chose one transactional deployable while write load stays below a measured bound’ is falsifiable.",
          "Imagine a cooperative with one site and one operator. A split membership service can isolate a distinct owner, but may also make checkout unavailable during API failure. A modular application may simplify transactions but requires coordinated deployments. Neither is a winner without the discovered operational conditions."
        ]
      },
      {
        "heading": "Avoid hindsight and false precision",
        "paragraphs": [
          "Record the evidence available at decision time separately from measurements collected during implementation. If a new constraint invalidated the original decision, preserve the old ADR and link a superseding one. An eventual good outcome does not retroactively make the original reasoning rigorous.",
          "Where costs or traffic volumes are fictional, label assumptions and ranges. Do not invent current provider prices, real error budgets or interviews. A reviewer should be able to replace your assumptions and recompute the recommendation."
        ]
      },
      {
        "heading": "Practice reversal under a new constraint",
        "paragraphs": [
          "Change one variable at a time: a tenfold increase in concurrent writes, an outage of external eligibility, new data-retention obligations or a lost operator. State which invariant is nonnegotiable, which component or deployment choice may change and the smallest experiment that decides between alternatives.",
          "Defending a choice does not mean refusing to reverse it. It means knowing what evidence originally supported it and what contrary evidence now matters. If the second domain has different transactional semantics than Steward, show exactly why the transferred principle takes a different implementation."
        ]
      }
    ],
    "practice": [
      "Select a dated consequential ADR, show actual options and rejected costs at decision time.",
      "Introduce a new outage, budget or concurrency constraint and recompute which option remains defensible."
    ],
    "criteria": [
      "Predicted benefits are not mislabeled as measurements.",
      "Reversal criteria reference falsifiable observations."
    ],
    "resource": {
      "title": "Architecture Decision Records",
      "url": "https://adr.github.io/",
      "kind": "reference",
      "purpose": "Conceptual reference, not evidence of completed user or production validation."
    }
  },
  "present-engineering-evidence": {
    "sections": [
      {
        "heading": "A claim-to-evidence index is a reproducibility contract",
        "paragraphs": [
          "A repository link proves that a file exists, not that a feature ran, that the tester inspected the right oracle or that the learner wrote it. A defensible claim specifies requirement, original contribution, source digest, environment, executable command, fixture, expected result, observed result, negative case and limitation.",
          "Use confidence states such as OBSERVED, FAILED, NOT_TESTED and GUIDED_OR_SIMULATED rather than conflating green CI with production proof. A local SQLite restore demonstrates one local data recovery, never a PostgreSQL production RTO or actual legal compliance."
        ]
      },
      {
        "heading": "Choose evidence that could disprove you",
        "paragraphs": [
          "A failing authorization request must be syntactically valid and authenticated to reach the ownership decision. Inspect the denied status, unchanged row count and absence of notifications. A 400 parse error is irrelevant to object-level permission; a screenshot of a green pipeline is irrelevant to a missing recovery drill.",
          "Attach a second interpretation to each strong claim: perhaps a test ran against an empty database, the validator short-circuited before the intended rule, or the browser only visited the page. Specify a test or peer reproduction that rejects those alternatives."
        ]
      },
      {
        "heading": "Demonstrate without manufacturing confidence",
        "paragraphs": [
          "Run one actual command on the frozen capstone commit in an authorized disposable environment, record stdout/stderr or trace IDs, and let the reviewer inspect the resulting state. If a real dependency is unavailable, mark NOT_TESTED and give a safe future test rather than displaying simulated output as actual operation.",
          "Present evidence in reverse order of consequence: first high-risk correctness and data/permission safety, then delivery and operations, then coverage breadth. Keep potentially private records behind authorized review rather than making the public portfolio a leak."
        ]
      }
    ],
    "practice": [
      "For three major claims capture real source revision, executed command, environment, negative result and limitation.",
      "Detect one authentic but irrelevant test that never reached the intended failure boundary."
    ],
    "criteria": [
      "An outsider can reproduce the scoped result without a prepared narrative.",
      "Synthetic and guided fixtures never appear as production proof."
    ],
    "resource": {
      "title": "The Turing Way reproducibility",
      "url": "https://book.the-turing-way.org/reproducible-research/reproducible-research",
      "kind": "reference",
      "purpose": "Conceptual reference, not evidence of completed user or production validation."
    }
  },
  "defend-quality-decisions": {
    "sections": [
      {
        "heading": "Choose test boundaries by risk and oracle",
        "paragraphs": [
          "Unit tests can prove a pure lifecycle transition; database integration tests can prove a specific constraint under transactions; signed HTTP tests prove routing and authorization integration; browser tests prove task interaction and error feedback. A test at the wrong layer may be green while the harmful side effect remains.",
          "For a fictional physical item, a local function can reject duplicate active loans, but two concurrent database transactions may both see an unused item unless an atomic uniqueness/locking strategy exists. The correct production claim needs a representative concurrent fixture, database boundary and observed committed rows."
        ]
      },
      {
        "heading": "Explain why quantity does not prove correctness",
        "paragraphs": [
          "Test count and statement coverage describe activity, not sound assertions. A suite that checks 403 status without inspecting the database may conceal a write-before-deny bug. Use mutation testing or a deliberately invalid implementation to demonstrate that the oracle rejects the harmful case.",
          "Include uncertainty about flaky integration environments, non-deterministic retries, accessibility automation and exploratory tester knowledge. A passing accessibility scanner does not prove a keyboard or screen-reader user can recover from validation errors in the main task."
        ]
      },
      {
        "heading": "Defend sampling, regression and dissent",
        "paragraphs": [
          "Show why the selected positive, negative, concurrency, boundary and recovery cases correspond to the most consequential stakeholder risks. Describe what is omitted, who can accept the gap, and what triggers a new test. A test plan with all boxes checked and no error interpretation is weak evidence.",
          "An unseen reviewer changes the item ownership model to a hierarchy. Predict which existing tests will falsely pass, write the minimal new signed cross-owner case and explain why it belongs in HTTP integration rather than only a pure policy unit test."
        ]
      }
    ],
    "practice": [
      "Select one high-harm invariant and present pure, database and signed HTTP oracles with real boundaries.",
      "Introduce a deliberately wrong write-before-deny or duplicate mutation and show the test that fails."
    ],
    "criteria": [
      "An HTTP error is checked alongside forbidden persistent/external effects.",
      "Untested accessibility and load contexts stay explicitly unknown."
    ],
    "resource": {
      "title": "OWASP testing guide",
      "url": "https://owasp.org/www-project-web-security-testing-guide/",
      "kind": "reference",
      "purpose": "Conceptual reference, not evidence of completed user or production validation."
    }
  },
  "defend-security-decisions": {
    "sections": [
      {
        "heading": "Start from an attack path and the asset it could compromise",
        "paragraphs": [
          "A threat model names assets, principals, access vectors, trust boundaries, potential harm and safeguards. ‘JWT’, ‘TLS’ and ‘RBAC’ are mechanisms, not proof that object-level authorization actually protects every endpoint.",
          "A signed account belonging to Cooperative B attempts to create a loan for Cooperative A. If the handler uses only token validity, it can return success or change data without permission. The defending evidence includes a valid forbidden request, scoped persisted-state checks and zero prohibited downstream effects."
        ]
      },
      {
        "heading": "Distinguish configuration, observation and remaining attack surface",
        "paragraphs": [
          "A configured security header may be correct but untested on a nested import endpoint. A scanner may report a vulnerability but cannot alone measure exploit reachability or determine legal obligations. Record which path was actually tested, what failed and who owns remediation.",
          "Credentials must not appear in logs, screenshots or example files. A clean source-code secret scan does not certify every proxy and exception handler; force an authorized failure and review the actual telemetry with synthetic tokens."
        ]
      },
      {
        "heading": "Respond to an unseen exploit and authority limits",
        "paragraphs": [
          "Suppose the panel presents a valid signed cross-tenant bulk request that bypasses one UI-only restriction. Identify the write boundary, potential blast radius, stop condition and first safe read-only diagnostic. Do not rerun a destructive probe against production without explicit permission.",
          "Separate technical findings, risk assessment and legal or organizational authorization. A release manager may decide scope within policy; neither a developer nor an automated test can waive mandatory obligations or relabel a failed negative case as PASS."
        ]
      }
    ],
    "practice": [
      "Provide a valid signed cross-owner mutation and inspect both HTTP result and no prohibited state.",
      "Use an unseen nested or bulk endpoint to challenge the completeness of authorization enforcement."
    ],
    "criteria": [
      "A scanner pass is not treated as a comprehensive security audit.",
      "Missing legal or high-risk review goes to the proper owner rather than a fabricated waiver."
    ],
    "resource": {
      "title": "OWASP object-level authorization",
      "url": "https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization/",
      "kind": "reference",
      "purpose": "Conceptual reference, not evidence of completed user or production validation."
    }
  },
  "defend-reliability-decisions": {
    "sections": [
      {
        "heading": "State reliability as a user-facing outcome, not a running process",
        "paragraphs": [
          "A server returning 200 to `/health` may be unable to issue valid loans. Define a service-level indicator using the actual transaction's success, correct durable state and latency. Recovery objectives must reflect stakeholder harm from lost or delayed transactions, not generic uptime targets copied from an SRE manual.",
          "For the fictional service, a network timeout after loan commit leaves the caller uncertain. A second request with a new identity may duplicate side effects. Design a safe lookup or idempotent replay, then test both committed and uncommitted branches."
        ]
      },
      {
        "heading": "Prove recovery rather than backup configuration",
        "paragraphs": [
          "A file labeled backup may contain already corrupted state, may be unreadable with the available key or may restore too slowly. A real disposable drill creates a restored database, checks critical invariants and resumes one representative user operation. RTO/RPO are not proven by an in-memory educational fixture.",
          "Link each failure mode to a detection signal, responsible operator, diagnosis and stop/recovery action. A process restart cannot resolve a contradictory custody ledger; a dashboard alone cannot reconcile an ambiguous commit."
        ]
      },
      {
        "heading": "Revise the design under new failure conditions",
        "paragraphs": [
          "Ask what happens if membership verification is unavailable for one business day. Compare fail-closed refusal, bounded queue and offline exception policy; each creates distinct availability, fraud and reconciliation obligations.",
          "An external reviewer should change expected data-loss tolerance or introduce simultaneous retries. Your response must preserve invariants, identify which measurements are absent, and recommend a scoped DEFER when evidence cannot support a confident release."
        ]
      }
    ],
    "practice": [
      "Rehearse an ambiguous commit or missing eligibility response with a stable request identity.",
      "Restore into a disposable instance and verify the actual domain operation, recording any absent RTO/RPO proof."
    ],
    "criteria": [
      "A running process does not substitute for user workflow SLI evidence.",
      "The retry and recovery claim identifies exactly what was or was not exercised."
    ],
    "resource": {
      "title": "Google SRE Workbook — SLOs",
      "url": "https://sre.google/workbook/implementing-slos/",
      "kind": "reference",
      "purpose": "Conceptual reference, not evidence of completed user or production validation."
    }
  },
  "defend-governance-decisions": {
    "sections": [
      {
        "heading": "Governance is about decision rights and trustworthy evidence",
        "paragraphs": [
          "A responsible technical plan names who proposes changes, verifies controls, approves risk and can stop deployment. A self-hosted project with no real operator cannot invent a security department. Explicit role overlap or lack of independent approval is preferable to a fictional sign-off.",
          "For a fictional tool library, high-consequence decisions include deleting loan history, granting cross-organization access and restoring a database. The person authorized to accept residual risk is not necessarily the developer who wrote the code."
        ]
      },
      {
        "heading": "License, dependency and compliance claims need separate proof",
        "paragraphs": [
          "A package's SHA-256 digest identifies its bytes; a dependency list identifies composition; neither establishes license compatibility, safe transitive vulnerabilities or organizational permission to use it. Capture license/notice obligations, supported versions, provenance, owner and exit path for each material dependency.",
          "An internal TSA package is not automatically approved simply because a module describes it. A proposed `tsa-test-core` cannot be claimed as a released, real-consumer shared library until independent consumer evidence and the actual published artifact exist."
        ]
      },
      {
        "heading": "Handle exceptions without falsifying failure evidence",
        "paragraphs": [
          "If a database restore test failed, engineering evidence is FAIL. A relevant authorized risk authority might approve a strictly scoped, time-bound exception if policy permits; that does not make the restore test pass or establish release readiness beyond the approved scope.",
          "Challenge the reviewer with an unknown license grant and a security control marked NOT_TESTED. Identify separate decision owners, the smallest review evidence needed and which outcome should block broader release regardless of presentation quality."
        ]
      }
    ],
    "practice": [
      "Map a failed restore, unapproved license or missing access-control test to separate decision authorities.",
      "Challenge an internal shared-package reuse claim with missing actual release/two-consumer evidence."
    ],
    "criteria": [
      "Residual-risk acceptance never relabels failed tests.",
      "Legal/disclosure permissions remain distinct from technical package identity."
    ],
    "resource": {
      "title": "ACM Code of Ethics",
      "url": "https://www.acm.org/code-of-ethics",
      "kind": "reference",
      "purpose": "Conceptual reference, not evidence of completed user or production validation."
    }
  },
  "respond-to-challenges": {
    "sections": [
      {
        "heading": "First classify what the reviewer is actually challenging",
        "paragraphs": [
          "An objection can dispute the underlying observation, the decision's assumptions, the interpretation, the risk tolerance or the author's authority. Answering a request for proof with an architecture diagram is a category error. Listen, restate the claim under challenge and identify the exact evidence that would resolve it.",
          "If the panel says 'your double-loan test ran without two concurrent clients', admit that the test does not establish concurrency. State what it does prove, which harmful schedules remain plausible, and how a new disposable PostgreSQL test would discriminate the weakness."
        ]
      },
      {
        "heading": "Use a structured response rather than improvising certainty",
        "paragraphs": [
          "A defensible reply follows: CLAIM → SCOPE → OBSERVATION → LIMIT → DECISION/EXPERIMENT. A gap that affects data corruption or cross-owner authorization may require DEFER; a harmless unproven optimization can remain a monitored hypothesis.",
          "A reviewer may intentionally give misleading new evidence. Verify source, timestamp, environment and conflict with actual observations before changing the design. Do not reject correction simply to preserve a confident public story."
        ]
      },
      {
        "heading": "Practice a surprise that changes the answer",
        "paragraphs": [
          "Introduce a new actor allowed to manage several cooperatives, a provider outage, a leaked API credential or a tenfold usage spike. Require a revised risk model, immediate safe action, revised acceptance gate and a new falsifiable test.",
          "Record both the answer and the follow-up evidence. If the challenge cannot be demonstrated live, write NOT_TESTED and assign an owner. Fabricated success under pressure is worse evidence than a precise limitation."
        ]
      }
    ],
    "practice": [
      "Use the published structured answer mechanism under one unexpected counterevidence scenario.",
      "Have a reviewer remove one critical observation, then record the new recommended action and safe next experiment."
    ],
    "criteria": [
      "The answer distinguishes observed facts, assumptions, counterarguments and decision authority.",
      "A material missing proof cannot end in the original unqualified READY state."
    ],
    "resource": {
      "title": "Decision records and challenges",
      "url": "https://adr.github.io/",
      "kind": "reference",
      "purpose": "Conceptual reference, not evidence of completed user or production validation."
    }
  },
  "state-limitations": {
    "sections": [
      {
        "heading": "Classify a limitation by cause and consequence",
        "paragraphs": [
          "A known bug is a tested contract violation; an unknown is unmeasured risk; a deferred feature is excluded scope; an accepted residual risk is an explicit decision by an authorized role. These labels lead to different next actions. Rebranding a failed authorization test as technical debt does not make it release-safe.",
          "Show the impact surface: users, data, availability, confidentiality, reversibility and cost. For a fictional loan system, offline issuance may be intentionally unsupported while simultaneous durable loans must remain prohibited. The first is scope; the second is an integrity invariant."
        ]
      },
      {
        "heading": "Make uncertainty inspectable",
        "paragraphs": [
          "Use a limitation register containing source claim, evidence state, consequence, accountable owner, next experiment, stop condition and expiration/revisit trigger. A general statement that 'the product is not perfect' cannot guide an operator or release authority.",
          "Distinguish test environment and data set. Local SQLite integrity evidence cannot be promoted to deployed PostgreSQL concurrency safety; a keyboard-only manual check on one browser does not certify universal accessibility."
        ]
      },
      {
        "heading": "Say what cannot be accepted",
        "paragraphs": [
          "A critical defect that violates privacy, financial correctness or safety may have no permissible engineering exception. The engineer must escalate to qualified authority and can recommend no release while uncertainty remains.",
          "An unseen reviewer asks for one condition under which the entire capstone should not proceed. Answer with a concrete harm and objective failed gate, not an aspirational promise to test more later."
        ]
      }
    ],
    "practice": [
      "Construct a live limitation register with bug, unknown, excluded scope and accepted risk distinctly classified.",
      "Give one release-blocking condition with a current source/test artifact and owner."
    ],
    "criteria": [
      "Not-tested and failed findings remain distinct and actionable.",
      "A known critical integrity or security flaw is not reclassified as optional tech debt."
    ],
    "resource": {
      "title": "SRE postmortem learning",
      "url": "https://sre.google/sre-book/postmortem-culture/",
      "kind": "reference",
      "purpose": "Conceptual reference, not evidence of completed user or production validation."
    }
  },
  "propose-future-evolution": {
    "sections": [
      {
        "heading": "Rank future work using evidence rather than novelty",
        "paragraphs": [
          "An evolution roadmap is a series of decisions tied to observed user need, incident cost, capacity limit or repeated engineering friction. A feature or technology is not justified merely because it appears elsewhere in the academy.",
          "For the hypothetical cooperative, installing Kafka before proving notification volume or ownership adds infrastructure cost. An operator may prefer reliable database transactions and a small retry queue until volume and team ownership justify another boundary."
        ]
      },
      {
        "heading": "Compare improve, defer and intentionally do nothing",
        "paragraphs": [
          "For each proposal, record the current limit, evidence, expected user or operator outcome, alternative, estimated effort/operating cost, risk of changing state and the signal that would trigger action. A no-change decision should explain what current evidence makes it acceptable.",
          "Give an explicit reversal threshold and a way to measure it. If operating hours are unknown, estimate a range and mark the uncertainty rather than claiming that a redesign saves money."
        ]
      },
      {
        "heading": "Defend a roadmap under budget loss",
        "paragraphs": [
          "The panel cuts the implementation budget by half and introduces an audit-retention requirement. Preserve the data-integrity, security and recovery minimums; drop cosmetic enhancements and optional platform complexity first, or recommend reduced scope/defer if requirements cannot be safely met.",
          "State what gets delivered, deferred, redesigned and measured next. A prioritized roadmap is only credible when it can survive new constraints without turning unsafe gaps into postponed features."
        ]
      }
    ],
    "practice": [
      "Compare a justified improvement, an intentionally deferred feature and a no-change decision.",
      "Cut the available budget, introduce a new compliance obligation and re-evaluate the roadmap with retained safety gates."
    ],
    "criteria": [
      "Priorities follow user-risk/operational evidence, not technology popularity.",
      "Every investment has a revisit trigger and measurable falsifier."
    ],
    "resource": {
      "title": "Fowler — Monolith first",
      "url": "https://martinfowler.com/bliki/MonolithFirst.html",
      "kind": "reference",
      "purpose": "Conceptual reference, not evidence of completed user or production validation."
    }
  },
  "reflect-on-the-tsa-journey": {
    "sections": [
      {
        "heading": "Separate learned principles from copied implementation",
        "paragraphs": [
          "Transfer means applying a justified mechanism to a genuinely different problem: for example, both a service dependency registry and a tool custody system need referential integrity, but their domain identities, authorization scopes and failure consequences differ. Copying Steward's entities, workflows and hosting choices is not evidence of transferable engineering judgment.",
          "Name one concept you can now explain without prompts, one you independently implemented and one you only observed in a guided lab. Do not convert simulated browser progress or source-level CI into professional mastery."
        ]
      },
      {
        "heading": "Reconstruct a changed belief through actual decisions",
        "paragraphs": [
          "Select a dated earlier choice, record what you knew, the falsifying event and the subsequent revised design. For example, choosing shared testing utilities before two real consumers exist may have created coupling; the transferable lesson is a consumer-driven extraction gate, not a blanket ban on reuse.",
          "Counterexample: a failed experiment can show improved judgment if the original hypothesis was clear, the negative was observable and the engineer revised the recommendation. A successful imitation with no independent reasoning is weaker."
        ]
      },
      {
        "heading": "Build an honest next skill assessment",
        "paragraphs": [
          "Review domain, data, APIs, operations, security, evidence communication and ethical judgment separately; give links to actual observed examples and identify missing third-party review. A twenty-course reading list cannot replace a live unknown problem and reviewable decision.",
          "Conclude with a bounded 90-day improvement plan: three capabilities, exercises in a new domain, negative oracles and a real reviewer when available. An unavailable panel remains NOT INDEPENDENTLY VALIDATED; do not issue the learner a fictitious graduation sign-off."
        ]
      }
    ],
    "practice": [
      "Compare one Steward mechanism with a legitimately new capstone decision: principle transferred, design correctly differed.",
      "Use one dated incorrect hypothesis and a real negative result to derive three independently testable next-skill objectives."
    ],
    "criteria": [
      "Guided lab execution is not reported as independent professional mastery.",
      "Actual peer scoring is documented or marked NOT INDEPENDENTLY VALIDATED."
    ],
    "resource": {
      "title": "Professional competence and responsibility",
      "url": "https://www.acm.org/code-of-ethics",
      "kind": "reference",
      "purpose": "Conceptual reference, not evidence of completed user or production validation."
    }
  }
};
