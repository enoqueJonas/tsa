import type { LearningResource } from "../activities/content";

/** A single hypothetical non-Steward fixture (community tool lending), not observed user research. */
export interface ProposalLens {
  sections: { title: string; paragraphs: string[] }[];
  practice: string[];
  acceptance: string[];
  resource: LearningResource;
}
export const proposalLenses: Record<string, ProposalLens> = {
  "system-context-and-boundaries": {
    "sections": [
      {
        "title": "Define the system boundary before choosing software components",
        "paragraphs": [
          "System context describes the responsibility of the proposed product from the outside. An actor is a human or system with a meaningful interaction; an external system is independently operated, even when it happens to run in the same cloud account. A trust boundary is a place where identity, authority, validation or security assumptions change. The diagram does not need a framework, database or container until those are justified.",
          "In a fictional community tool-lending cooperative, members request a loan, a desk worker releases an item, and a finance team maintains the membership eligibility record in a separate authoritative ledger. The proposed borrowing application owns loan records and item availability; it does not own the financial ledger. Treat the cooperative and volumes as a scenario fixture, not observed research."
        ]
      },
      {
        "title": "Trace one interaction end to end",
        "paragraphs": [
          "Member requests tool X → borrowing system verifies member eligibility through a documented interface → system checks availability → persists a reservation → member receives an outcome. At the eligibility response, state who owns the data and how long the result is trusted. At reservation creation, identify who owns the decision and how concurrent requests are handled. Add an alternate path for an unavailable eligibility service: refuse reservation, queue for staff review, or allow bounded offline work—each is a product decision needing stakeholder evidence."
        ]
      },
      {
        "title": "Compare candidate boundaries and reject false simplicity",
        "paragraphs": [
          "Putting eligibility into the borrowing database makes the first version appear easy, but silently creates a second authority and synchronization problem. Keeping it external adds dependency and failure handling. Both can be defensible; decide using source of truth, privacy, integration guarantees and recovery needs. A drawing that labels ‘API’ everywhere without actors, ownership and concrete data exchange is not a usable context model."
        ]
      },
      {
        "title": "Prove understanding independently",
        "paragraphs": [
          "Create a context view with 3–5 named actors/systems, directions of information flow, explicit owner for each datum and a failure branch. Remove one proposed integration and defend whether the product boundary still satisfies the discovery objective. Do not treat the fictional case as a capstone requirement."
        ]
      }
    ],
    "practice": [
      "Produce a boundary table that lists each context arrow, data owner, trust decision and fallback behavior.",
      "Add one negative scenario where an external dependency returns stale/absent data, and state the consequence of each proposed response."
    ],
    "acceptance": [
      "A reviewer can walk one request across every relevant authority without inventing an unseen database owner.",
      "The explicit non-goals prevent duplicating another system's authoritative data."
    ],
    "resource": {
      "title": "C4 model system context",
      "url": "https://c4model.com/diagrams/system-context",
      "purpose": "Model actors and system boundaries, not software decomposition.",
      "kind": "reference"
    }
  },
  "domain-and-data-model-proposal": {
    "sections": [
      {
        "title": "Separate domain concepts, persistence tables and identifiers",
        "paragraphs": [
          "A domain model represents terms with business meaning. In a tool library, Item describes one physical asset (identified by an immutable asset code), Reservation expresses a member's request, and Loan records custody after an actual handoff. A ‘reserved’ flag on Item may be an unsafe shortcut if several time-windowed reservations are allowed. Whether items can be reserved, checked out or transferred independently requires discovery evidence.",
          "Give each entity an identity and lifecycle: Reservation requested → confirmed → cancelled/expired; Loan issued → returned/lost. State which transitions are allowed, who authorizes them, and which historical events should remain after an item is returned. Do not choose SQL columns until the identity and relationships have an explicit explanation."
        ]
      },
      {
        "title": "Write invariants and define their enforcement boundary",
        "paragraphs": [
          "Candidate invariant: one physical item cannot have two simultaneous active loans. A Python predicate can detect an overlap in a single in-memory snapshot, but simultaneous transactions can still race if the database lacks an appropriate uniqueness/locking or exclusion design. Separate application validation, transactional concurrency control and lasting relational constraints.",
          "Other possible rules include member eligibility at issue time, mandatory human override evidence, referential integrity between a loan and an item, and retention limits on personally identifying data. Model which are domain policies versus implementation choices; a foreign key is not a substitute for role-based permission."
        ]
      },
      {
        "title": "Worked counterexample and trade-off",
        "paragraphs": [
          "A prototype stores only `item.is_available`. Two staff clients both read True before either writes False, and both issue loans. The logical error is read-then-write without an atomic exclusivity guarantee. Compare a database-backed active-loan exclusivity design to pessimistic row locking: both require transaction boundaries, and neither establishes correct authorization by itself.",
          "Do not generalize the example to all inventory domains: reservations, preemption and shared equipment may change the invariant. Test your chosen model against an unseen ‘lost item returned after account deactivation’ scenario."
        ]
      }
    ],
    "practice": [
      "Draw a lifecycle diagram with forbidden transitions and ownership for state changes.",
      "Write one negative persistence fixture that attempts concurrent double issuance, and explain what must be shown at the actual database boundary."
    ],
    "acceptance": [
      "Each critical invariant names the layer responsible for preventing invalid concurrent state.",
      "The glossary distinguishes conceptual identities from API response names and SQL storage fields."
    ],
    "resource": {
      "title": "PostgreSQL Constraints",
      "url": "https://www.postgresql.org/docs/current/ddl-constraints.html",
      "purpose": "Use after defining the domain invariant; inspect what one-row constraints cannot express.",
      "kind": "reference"
    }
  },
  "architecture-proposal": {
    "sections": [
      {
        "title": "Architecture is a bet about constraints, not a technology inventory",
        "paragraphs": [
          "Architecture fixes expensive-to-change boundaries: who can alter state, which computations occur together, how failures propagate and what operational responsibilities are created. Begin with the discovery brief's measurable drivers—e.g., two staff need safe concurrent issuance, local internet is intermittent, the project is operated by one part-time engineer—and label these as hypothetical until validated.",
          "The simplest candidate might be one modular web application and one transactional database. This choice is not universally superior; it is a baseline for comparison. Draw a request path to test whether a single deployable process can meet the key integrity and maintenance requirements."
        ]
      },
      {
        "title": "Compare two viable designs against the same evidence",
        "paragraphs": [
          "Option A: modular single-process application, one PostgreSQL database, clearly separated loan and membership modules. Advantages: a transaction can protect item issuance, fewer network failure points, one deployment and traceable logs. Risks: tighter deployment coupling and limited independent scaling.",
          "Option B: separate reservation and membership services with asynchronous messages. Possible advantage: distinct operational ownership when teams and load justify it. Costs: eventual consistency, duplicate delivery, reconciliation, service identity, monitoring and infrastructure work. If the capstone has no independently operated teams or high throughput, splitting is a claim requiring new evidence, not an achievement badge."
        ]
      },
      {
        "title": "Failure experiment and reversal trigger",
        "paragraphs": [
          "Inject a lost eligibility response during an item-issue attempt. Can A and B express the same product decision without a phantom valid loan? Define an experiment and precise expected state. Revisit the deployment boundary only if measured independent scaling needs, service ownership or availability constraints change. State what observation would falsify the chosen architecture."
        ]
      },
      {
        "title": "Reject decorative complexity",
        "paragraphs": [
          "A message broker, cache or service mesh is not a valid output by itself. Each extra component must solve a named failure/capacity/ownership problem and bring an operations burden you can actually carry. If no discovered requirement needs it, explicitly defer it."
        ]
      }
    ],
    "practice": [
      "Create a two-column decision record comparing the modular baseline against one genuinely viable alternative for at least three measured constraints.",
      "Run a thought experiment for a mid-operation crash and identify where each design can leave inconsistent state."
    ],
    "acceptance": [
      "The recommendation can be challenged with a measurable reversal threshold.",
      "The new design is not copied from Steward and no component exists solely as a curriculum showcase."
    ],
    "resource": {
      "title": "Martin Fowler — Monolith First",
      "url": "https://martinfowler.com/bliki/MonolithFirst.html",
      "purpose": "Use as an argument to evaluate, not a universal rule.",
      "kind": "reference"
    }
  },
  "infrastructure-and-hosting-proposal": {
    "sections": [
      {
        "title": "Map the workloads before choosing a provider",
        "paragraphs": [
          "Inventory request/worker processes, database persistence, object storage if needed, secrets, DNS, TLS, backups, identity and operator access. State minimum viable environments and what isolation they require. A platform diagram missing database restore and access revocation is not a hosting plan.",
          "For the fictional lending system, a budget VM with managed backups may be cheaper in administration than a cluster. If connectivity is intermittent, decide whether staff are allowed offline issuance: that is a domain-consistency issue first, not a promise that Kubernetes can solve it."
        ]
      },
      {
        "title": "Define the trust and failure surfaces",
        "paragraphs": [
          "An internet-facing reverse proxy, application runtime and private database each have different exposure. Show ingress and egress paths, admin access, certificate ownership, who holds database credentials, and storage encryption/backup responsibilities. The cloud provider's physical redundancy does not guarantee an application transaction can be replayed after data corruption.",
          "Enumerate a host crash, full disk, database corruption, backup credential exposure and DNS/TLS outage. For each, assign a diagnostic and a recovery test. A snapshot that has never been restored does not meet an RTO claim."
        ]
      },
      {
        "title": "Compare a small VM, managed application and orchestrated cluster",
        "paragraphs": [
          "VM: most control, more OS patch and backup responsibility. Managed app/DB: potentially less routine operation, dependency on provider capabilities and cost model. Cluster: scheduling and rolling-deployment controls but additional identity, networking and configuration complexity. Pick the smallest option that meets documented deployment, observability, durability and recovery requirements.",
          "Compare monthly cost and human operational hours, not only a provider calculator headline. Record the evidence source, currency, region, assumptions and date for actual quotations; hypothetical examples must never be presented as live prices."
        ]
      }
    ],
    "practice": [
      "Draw the deployment topology with entrypoints, trust segments, secret locations and restore owner.",
      "Prepare a cost/operations comparison and one disposable failure/recovery drill for each viable hosting candidate."
    ],
    "acceptance": [
      "Each durable store has a verified or explicitly NOT TESTED backup and recovery plan.",
      "Every claimed failure mode has an identified operator and safe diagnostic boundary."
    ],
    "resource": {
      "title": "NIST SP 800-34 Rev. 1 Contingency Planning Guide",
      "url": "https://csrc.nist.gov/pubs/sp/800/34/r1/upd1/final",
      "purpose": "Use recovery thinking; tailor to the capstone rather than claiming organizational compliance.",
      "kind": "reference"
    }
  },
  "delivery-plan": {
    "sections": [
      {
        "title": "Translate commits into reproducible, verified releases",
        "paragraphs": [
          "A delivery pipeline is a state machine: submitted source → validated commit → immutable artifact → installed into controlled environment → verified runtime → promoted or blocked. These are different states. A pipeline passing tests cannot by itself prove that the deployment is secure, the database migration is safe or the user-visible service is healthy.",
          "Define which gates are automated (tests, dependency scanning, signed artifact digest, migration rehearsal) and which require explicit human risk decisions. The gate should fail closed on missing evidence, not treat an absent report as a pass."
        ]
      },
      {
        "title": "Follow one dangerous change",
        "paragraphs": [
          "Suppose a loan-status migration changes the representation of active loans. A CI build tests the new code but the production database contains historical statuses. A deploy without a populated-data migration rehearsal may corrupt a running workflow. The delivery plan must order compatibility checks, migration, deployment, smoke validation and forward/rollback recovery.",
          "Record the exact source revision and artifact digest. Rebuilding from the same tag does not guarantee bitwise equality without a reproducibility mechanism. Ensure a production promotion references the already-tested artifact, not a newly built artifact of unknown identity."
        ]
      },
      {
        "title": "What happens when a gate is missing",
        "paragraphs": [
          "If backup verification is NOT_TESTED or a migration rehearsal failed, the technical release recommendation should be blocked, unless a separately authorized and documented exception exists without falsifying the underlying evidence. Re-running CI is not remediation for a failed restore. A manually clicked approval without evidence is not a technical proof."
        ]
      },
      {
        "title": "Use the learner's actual repository",
        "paragraphs": [
          "Plan command-level checks for a disposable environment: identify the artifact, run database migration rehearsal, verify the service post-deploy, observe an authorization negative case, and rehearse a safe recovery path. The deployment plan must say who can stop promotion and how an operator confirms the stopped state."
        ]
      }
    ],
    "practice": [
      "Write the source-to-release state diagram and map every transition to a producing command and reviewable artifact.",
      "Deliberately remove a required migration or security result in a disposable pipeline and demonstrate that promotion cannot happen."
    ],
    "acceptance": [
      "Missing/failed evidence is distinguishable from a passing gate.",
      "The plan documents how a release is identified, verified and recovered with no untracked rebuild."
    ],
    "resource": {
      "title": "The Twelve-Factor App — Build, release, run",
      "url": "https://12factor.net/build-release-run",
      "purpose": "Distinguish a build artifact, environment-specific release and running process.",
      "kind": "reference"
    }
  },
  "quality-strategy": {
    "sections": [
      {
        "title": "Define the property to protect before picking a test level",
        "paragraphs": [
          "A quality strategy begins with risk: what incorrect behavior could harm the user's work, what component can cause it and what evidence detects it at tolerable cost. In the tool-lending case, double issuance is a business-integrity risk. A pure unit test can show a policy predicate, but only a real transaction/concurrency test can establish the database exclusivity guarantee.",
          "Write an oracle—the observable correct result—before implementation. ‘API returns 200’ is not an adequate oracle if two loans were created. Include response, database state, audit log and side-effect absence as appropriate."
        ]
      },
      {
        "title": "Design complementary layers with credible ownership",
        "paragraphs": [
          "Domain unit tests cover transitions and calculations quickly. API integration tests exercise routing, authentication, persistence and errors. A small number of UI journey tests verify that staff can actually issue/return items. Exploratory sessions investigate ambiguous recovery, offline state and accessibility. Non-functional tests examine throughput, latency, resilience and backup integrity when justified by observed consequences.",
          "Don't run every case through the browser: that makes failures slower and less diagnosable. But do not remove the browser from a behavior whose contract includes focus, error presentation or keyboard operation."
        ]
      },
      {
        "title": "Choose data, negative cases and maintenance model",
        "paragraphs": [
          "Use intentionally isolated staff/member credentials, separate physical item fixtures, reset/cleanup ownership and concurrency harnesses. Test a signed outsider's issuance attempt; check that no loan row or notification is created. Separate test coverage and execution counts from proof of a correct oracle.",
          "Define who maintains fixtures, who reviews flaky tests, what blocks promotion, and how to distinguish a product regression from an unavailable environment. The test strategy includes verification of the tests themselves by source mutation or demonstrably bad data."
        ]
      },
      {
        "title": "Expose what cannot yet be claimed",
        "paragraphs": [
          "A passing fixture may demonstrate one concurrency schedule, not the absence of every race. An accessible automated check does not prove usable instructions. Record untested risk, evidence quality and review cadence instead of inflating a percentage."
        ]
      }
    ],
    "practice": [
      "Build a risk-to-oracle matrix with at least one positive and two independent negative cases.",
      "For one serious rule, show a deliberately incorrect implementation that your chosen test boundary catches; justify why a broader or narrower test would be misleading."
    ],
    "acceptance": [
      "Each major risk maps to a specific observation beyond status code or coverage percentage.",
      "The review distinguishes automated evidence from human/external-system validation."
    ],
    "resource": {
      "title": "OWASP Web Security Testing Guide",
      "url": "https://owasp.org/www-project-web-security-testing-guide/",
      "purpose": "Select relevant API/auth security-negative cases rather than copying an undifferentiated checklist.",
      "kind": "reference"
    }
  },
  "security-strategy": {
    "sections": [
      {
        "title": "Begin with assets, actors and trust boundaries",
        "paragraphs": [
          "Assets include member identity, loan history, administrative privileges, inventory location and service availability. Threat modeling asks who may try to do what across which boundary, how harm would occur and what control reduces likelihood or impact. Naming ‘JWT’ or ‘TLS’ is not a threat assessment.",
          "For a loan issue action, separate authentication (‘this token belongs to a signed-in staff member’) from authorization (‘this staff member may release this item under the owning cooperative’). A valid token from a different location must not grant permission by default. The persisted item owner, not a client-supplied owner ID, is the authorization reference."
        ]
      },
      {
        "title": "Trace a broken object-level authorization path",
        "paragraphs": [
          "An attacker signs in as Staff B and sends `POST /locations/A/items/42/loans/` with a valid token. A vulnerable handler checks only `is_authenticated`, then creates the loan. Correct behavior verifies Staff B's role for Location A before any write; the rejected request must not mutate the database or enqueue a notification.",
          "Protect nested paths and bulk imports as carefully as the top-level route. A 400 caused by malformed JSON is not evidence of authorization enforcement. Use a valid request body and capture explicit 403 or consistently concealed 404 with zero prohibited side effects."
        ]
      },
      {
        "title": "Choose controls, response and evidence",
        "paragraphs": [
          "Map threats to controls: credential storage/expiry, object permissions, input validation, least-privilege DB role, secret rotation, encrypted transport, logs without raw tokens and incident response. Add a negative test for each high-consequence control. Do not log Authorization headers while diagnosing why a token failed.",
          "Escalate unknown regulatory and privacy requirements; this fictional case does not establish any jurisdiction-specific obligation. Release claims must clearly distinguish implemented technical controls, documented design intentions and independent verification."
        ]
      }
    ],
    "practice": [
      "Draw one misuse-case flow including valid cross-location credentials and a nested-write bypass.",
      "Define the test that shows no unauthorized persistent or external side effect, and name the log fields allowed for diagnosis."
    ],
    "acceptance": [
      "The threat model is new-domain-specific rather than copied from Steward.",
      "Each proposed high-risk control has a verifiable failure observation and an identified owner."
    ],
    "resource": {
      "title": "OWASP API Security Top 10 — 2023",
      "url": "https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization/",
      "purpose": "Understand broken object-level authorization through an actual resource-scoped request.",
      "kind": "reference"
    }
  },
  "reliability-strategy": {
    "sections": [
      {
        "title": "Define reliability from a user workflow",
        "paragraphs": [
          "Availability is not equivalent to a process being alive. For the fictional tool-lending case, a valid checkout either commits exactly one active loan or returns an explicit failure with no ambiguous duplicate. Measure the success rate from user-visible requests, and separately track latency tails, dependency failures and recovery where those affect the discovered use case.",
          "An SLO is a chosen performance objective, not an observed fact. Example calculation: a hypothetical 99.5% monthly success objective allows 0.5% unsuccessful operations in the measurement window; define exclusions carefully, and never say the system achieved it without real event data."
        ]
      },
      {
        "title": "Work failure and retry semantics",
        "paragraphs": [
          "Suppose the client times out after the database commits a loan. Blind retry can issue it twice unless a request identity/idempotency design or invariant prevents duplicate effects. The API must distinguish a rejected request from an uncertain outcome and give the caller a safe way to discover the final state.",
          "Choose evidence for a crash between commit and response, a database outage and an eligibility API timeout. For each, describe the observable user effect, detection mechanism, on-call owner, retry/backoff limits and repair strategy. A graceful error response is not a substitute for reconciling ambiguous commits."
        ]
      },
      {
        "title": "Backups, restore and operating constraints",
        "paragraphs": [
          "Define RPO as the maximum acceptable data-loss interval and RTO as the recovery-time objective, then connect both to business impact and actual recovery tests. A nightly database dump is not proof of either value; test restoration and integrity of item/loan records in a disposable environment.",
          "Load tests should model representative work and shared-resource limits. A synthetic 100-requests/second benchmark on an empty database cannot establish a real staff workflow's capacity."
        ]
      }
    ],
    "practice": [
      "Define a user-facing SLI with numerator, denominator, period, exclusion policy and owner.",
      "Design a reproducible ambiguous-commit experiment and describe expected no-duplicate state under retry; define recovery evidence."
    ],
    "acceptance": [
      "The plan separates objectives from measurements and labels simulated results.",
      "Every important retry and restore promise identifies actual test evidence or NOT TESTED."
    ],
    "resource": {
      "title": "Google SRE Workbook — Implementing SLOs",
      "url": "https://sre.google/workbook/implementing-slos/",
      "purpose": "Translate user-important outcomes into measurable SLOs and error budget policies.",
      "kind": "reference"
    }
  },
  "operational-model": {
    "sections": [
      {
        "title": "Show what happens after the author leaves",
        "paragraphs": [
          "An operational model identifies a primary owner, alternate, escalation path, runbook, credentials, monitoring, maintenance windows and what constitutes an incident. A system without an operator and recovery process is a prototype, even when it deploys successfully. Avoid assigning work to an imaginary ‘DevOps team’.",
          "For the fictional tool library, specify who can investigate a missing checkout, how a desk worker reports it, which logs are available, who can restore the database and who approves a corrective data change."
        ]
      },
      {
        "title": "Write a bounded diagnostic path",
        "paragraphs": [
          "Trigger: member reports two charges/loans for one physical item. Read-only steps: verify request ID, loan IDs, status transitions, log correlation and DB constraints. Expected observations include either one committed loan, duplicate records or missing evidence. Stop before editing production data if the cause is unknown or credentials are insufficient.",
          "An operational runbook is not a list of arbitrary `DELETE`/`UPDATE` commands. It should state escalation and rollback evidence. Restrict personal data and bearer tokens in screenshots and log exports."
        ]
      },
      {
        "title": "Practice normal maintenance, not just emergencies",
        "paragraphs": [
          "Define backup verification cadence, dependency patch reviews, certificate renewal ownership, key expiry, privileged access review and documentation updates. Operational cost includes human time. When an external API changes, record who owns compatibility checks and how consumers learn that the old interface will be retired."
        ]
      },
      {
        "title": "Define decision and incident communication",
        "paragraphs": [
          "Who decides to disable borrowing temporarily? Who communicates expected impact? Which evidence makes the service safe to re-enable? Explicitly distinguish an engineering recommendation, authorized business decision and observed recovery state."
        ]
      }
    ],
    "practice": [
      "Create an on-call and runbook matrix mapping one incident to specific diagnostics, stop conditions and owners.",
      "Rehearse a read-only diagnosis from a disposable fixture, redact sensitive fields, and document what would require specialist escalation."
    ],
    "acceptance": [
      "No role or recovery step depends on undocumented personal knowledge.",
      "The operational model includes normal recurring maintenance as well as exceptional incidents."
    ],
    "resource": {
      "title": "Google SRE Book — Being On-Call",
      "url": "https://sre.google/sre-book/being-on-call/",
      "purpose": "Use ownership/escalation principles; adapt to a small capstone team.",
      "kind": "reference"
    }
  },
  "cost-model": {
    "sections": [
      {
        "title": "Separate fixed commitments, variable usage and human work",
        "paragraphs": [
          "Cost is a model of assumptions, not a price list. Fixed monthly amounts might include hosting and a database tier; per-transaction amounts might include notifications or storage requests; people cost includes deployment, maintenance and incident time. Classify each term, give units and identify where a step change occurs.",
          "For a *hypothetical* community tool library, assume USD 50 fixed monthly, USD 0.05 per loan for notification and usage, and a USD 85 monthly software operating envelope, excluding labor. These are exercise figures, not a supplier quote or actual Mozambique price."
        ]
      },
      {
        "title": "Do the arithmetic and examine thresholds",
        "paragraphs": [
          "At 120 loans the illustrative service cost is 50 + (0.05 × 120) = USD 56.00. At 600 loans it is USD 80.00. A useful decision is not merely ‘cost is low’, but what happens if volumes or unit costs double, the budget falls, or the managed service moves to a new pricing tier.",
          "Compute a budget crossing using explicit units and Decimal arithmetic. Observe that human support hours and backup/restore cost are not in these values. Label the omission rather than making a confident total-cost claim."
        ]
      },
      {
        "title": "Compare alternatives honestly",
        "paragraphs": [
          "Self-managed infrastructure may lower a provider invoice and raise maintenance burden. Managed DB may cost more per month and make backups/operator recovery simpler, but only if the provider contract includes the required features. Price by region and date, include taxes/egress/license where applicable, and provide a sensitivity range rather than false precision."
        ]
      },
      {
        "title": "Set a revisit trigger",
        "paragraphs": [
          "Choose a measurable trigger: if predicted cost at the forecast upper-volume range exceeds the funded envelope, re-evaluate quotas, unit costs and hosting. Do not treat the least expensive scenario as a substitute for total expected exposure."
        ]
      }
    ],
    "practice": [
      "Run the published Decimal model, then double volume and unit price separately; record when the budget is exceeded.",
      "Compare a fixed-cost and a usage-tier alternative with explicit missing labor and recovery assumptions."
    ],
    "acceptance": [
      "Every number is labeled hypothetical or tied to a dated source and unit.",
      "The model shows a meaningful break-even or budget crossing and one falsifying sensitivity."
    ],
    "resource": {
      "title": "AWS Pricing Calculator",
      "url": "https://calculator.aws/",
      "purpose": "Use only for scoped current quotes; the lesson's Python figures are fictional.",
      "kind": "reference"
    }
  },
  "governance-approach": {
    "sections": [
      {
        "title": "Governance is a decision system, not a committee count",
        "paragraphs": [
          "Governance answers who may decide, what information is needed, which actions are prohibited without review and what happens when evidence is incomplete. A small capstone can express this as a short decision-rights matrix, a risk register and a handful of signed acceptance records.",
          "Separate proposer, reviewer, authorized approver and operator for consequential changes. One individual may hold multiple roles in a small project, but that does not remove conflict-of-interest exposure. Document when an independent second pair of eyes is necessary."
        ]
      },
      {
        "title": "Map a real conflict to the decision boundary",
        "paragraphs": [
          "Scenario: the designer wants to ship a feature while a database restore rehearsal has failed. Technical truth: recovery is not demonstrated. A product stakeholder can choose to defer delivery; a risk authority may accept certain residual risk under policy, but cannot convert a failed test into a pass. An engineer must refuse to falsify results.",
          "Record alternatives, costs, harms, owner, review deadline, expiry/revisit trigger and the conditions that would make acceptance invalid. A generic ‘risk accepted’ checkbox without scope and consequence is not accountable."
        ]
      },
      {
        "title": "Keep the control proportional",
        "paragraphs": [
          "Low-risk wording changes may go through peer review and automated checks. Data deletion, access model changes and irreversible schema migrations deserve stronger evidence. Overly burdensome reviews incentivize bypasses; a blanket absence of review removes protection. Choose risk tiers and justify their thresholds from actual consequences."
        ]
      },
      {
        "title": "Retain dissent and exception evidence",
        "paragraphs": [
          "Document the concern and decision without turning a review into blame. Track unresolved issues, variance from policy, expiry date and next verification. Under organizational or legal constraints, confirm who has the authority to approve exceptions rather than inventing it."
        ]
      }
    ],
    "practice": [
      "Produce a concrete decision-rights matrix for release, data deletion, permission changes and restore operations.",
      "Challenge one proposed exception with a failed test and demonstrate the review record leaves it visible as FAIL."
    ],
    "acceptance": [
      "Every material decision has an accountable owner and falsifiable re-evaluation condition.",
      "Risk acceptance does not relabel failed evidence as successful."
    ],
    "resource": {
      "title": "ACM Code of Ethics",
      "url": "https://www.acm.org/code-of-ethics",
      "purpose": "Use professional duties as a lens when governance pressure contradicts technical evidence.",
      "kind": "reference"
    }
  },
  "dependency-and-internal-platform-decisions": {
    "sections": [
      {
        "title": "A dependency is a contract with an owner and a failure mode",
        "paragraphs": [
          "List runtime dependencies, build tools, external APIs, shared packages and hosted services. For each, record version/API contract, security update owner, license/notice obligations, availability/exit plan, and the dependency's effect on your system if unavailable. A list of libraries without their authority and failure behavior is not a risk analysis.",
          "For the fictional loan app, a third-party messaging API could support notifications. Decide whether message delivery is part of a committed loan, a best-effort side effect or an auditable queued task. A synchronous call inside a DB transaction may make checkout availability depend on a messaging outage."
        ]
      },
      {
        "title": "Reuse is earned by actual contracts, not by TSA vocabulary",
        "paragraphs": [
          "Steward's engineering artifacts are not permission to reuse its domain or assume a common package exists. Nexus may have been built in earlier work but its live availability in the capstone environment still requires proof. `steward-common` can be reused only if its real-consumer gate was earned and the public API fits. `tsa-test-core` remains a hypothesis until the new capstone develops its own tests and identifies genuine two-consumer reusable behavior.",
          "Compare use an existing package, implement a small local function, or defer extraction. Count API stability, dependencies, upgrade path, ownership and security exposure. Don't create a shared library merely because it demonstrates packaging."
        ]
      },
      {
        "title": "License, provenance and supply chain checks",
        "paragraphs": [
          "Before adopting a package, inspect its license, dependency graph, maintainer/update history, integrity/provenance evidence and restrictions in the relevant delivery context. A valid checksum proves the bytes match an identifier, not that the publisher is trusted or license terms allow redistribution. Unknown terms are a decision blocker or require legal/policy review, not an invitation to guess.",
          "Require a safe replacement or degradation plan for critical external providers, and test what happens when the package or service is temporarily unavailable."
        ]
      },
      {
        "title": "Concrete transfer decision",
        "paragraphs": [
          "Write a dependency decision record for the new capstone choosing local implementation or external reuse; include one alternative, an exit plan and the smallest runnable consumer test that would detect an incompatible upgrade."
        ]
      }
    ],
    "practice": [
      "Build a dependency register with consumer path, contract, owner, version, provenance/license and degraded-mode impact.",
      "Use a deliberately absent tsa-test-core as a false dependency premise; show why the correct proposal defers it instead of pretending it is published."
    ],
    "acceptance": [
      "No unearned internal package is presented as installed, supported or required.",
      "A critical dependency has a reproducible failure/upgrade/exit strategy."
    ],
    "resource": {
      "title": "OpenSSF Scorecard",
      "url": "https://scorecard.dev/",
      "purpose": "Treat project signals as inputs, not certification that a dependency is safe.",
      "kind": "reference"
    }
  },
  "implementation-milestones": {
    "sections": [
      {
        "title": "Sequence by evidence and risk, not by layers",
        "paragraphs": [
          "A milestone should prove a user-visible outcome with observable acceptance evidence. ‘Set up database’, ‘create API’ and ‘build frontend’ can take weeks without verifying the main risk: correct checkout under concurrent staff use. Instead choose thin vertical increments that include request, domain rule, persistence and confirmation.",
          "The fictional loan workflow might begin with: one staff member issues and returns one item in a disposable environment; then concurrent issuance rejects the second request; then cross-location authorization denies a signed outsider; then recovery from a failed deployment is demonstrated. Each increment produces a fresh question and a durable artifact."
        ]
      },
      {
        "title": "Define a milestone as a contract",
        "paragraphs": [
          "For each, state the outcome, scope boundary, prerequisites, acceptance oracle, estimated effort range, owner, evidence artifact, negative case and reason the milestone is earlier than alternatives. Treat estimates as assumptions to refine using actual work, not commitments proven by a spreadsheet.",
          "A milestone with no falsifiable failure condition can be ‘done’ while the system remains wrong. A milestone that requires a future component before its first end-to-end proof hides integration risk."
        ]
      },
      {
        "title": "Schedule reversibility and a stop rule",
        "paragraphs": [
          "Prefer small changes that can be reviewed and reverted. If the initial vertical slice reveals that the domain rule conflicts with real stakeholder practice, revise the discovery brief and proposal before adding more modules. Identify exit criteria for deferred nice-to-haves and budget cut scenarios."
        ]
      },
      {
        "title": "Prepare for independent inspection",
        "paragraphs": [
          "The next engineer should reproduce an increment from a commit, command, fixture and observed result. A video tour without a runnable command is weak evidence. Mark unavailable external environments NOT TESTED rather than substituting screenshots."
        ]
      }
    ],
    "practice": [
      "Replace a layer-first plan with three end-to-end risk-reduction milestones and one intentionally deferred feature.",
      "For each milestone, write a pass/fail oracle and at least one new negative case, then have another engineer challenge the sequencing."
    ],
    "acceptance": [
      "Every proposed milestone is independently demonstrable using a named source version and verification boundary.",
      "The plan allows discovery evidence to invalidate scope without pretending sunk effort is justification."
    ],
    "resource": {
      "title": "Martin Fowler — Feature Toggles",
      "url": "https://martinfowler.com/articles/feature-toggles.html",
      "purpose": "Evaluate when staged behavior can be isolated; do not add toggles without a need.",
      "kind": "reference"
    }
  },
  "architecture-and-risk-review": {
    "sections": [
      {
        "title": "Review claims by tracing them backward to evidence",
        "paragraphs": [
          "A proposal review is an adversarial search for unsupported or inconsistent promises. Choose each material claim, identify the originating discovery requirement, proposed implementation, failure scenario, verification experiment, operational owner and open assumption. A diagram without a traceable boundary is not a complete answer.",
          "Example: 'Concurrent issuance is impossible.' The reviewer asks what SQL constraint or transaction enforces that property, how two clients will race, what the losing user sees, whether a notification is sent twice and which person will diagnose a conflict. If the answer is only 'we will test it', the claim is NOT PROVEN."
        ]
      },
      {
        "title": "Compare alternatives with an explicit counterfactual",
        "paragraphs": [
          "Counterfactual: the managed database budget rises by 60%, the cooperative loses internet for one working day, or staff move from one desk to three independent sites. Would the chosen architecture still meet its primary constraints? If not, name a reversal condition and a bounded experiment rather than an immediate redesign.",
          "Review plausible failure combinations rather than isolated happy paths. A temporary eligibility outage plus simultaneous return is a different risk than either alone."
        ]
      },
      {
        "title": "Choose review outcomes with conditions",
        "paragraphs": [
          "GO requires material assumptions to be evidenced and high-consequence controls demonstrably feasible. CONDITIONAL GO permits bounded experiments or limited development with explicit gate owners and deadlines; it is not production approval. REDESIGN is appropriate when the proposed boundary cannot meet a critical invariant or foreseeable operational budget. State what evidence would change each outcome.",
          "Refuse to mark a scenario as 'passed' because the author argued persuasively. A persuasive explanation is only one artifact; product behavior, data integrity and release evidence require execution."
        ]
      },
      {
        "title": "Simulate a dissenting reviewer",
        "paragraphs": [
          "Assign one challenger to question data authority, one to challenge negative authorization, one to challenge cost/recovery and one to challenge a conflict in constraints. Where no second reviewer is available, record SELF-REVIEW and NOT INDEPENDENTLY VALIDATED; do not invent peer sign-off."
        ]
      },
      {
        "title": "Define the handoff to Independent Build",
        "paragraphs": [
          "The artifact should show the discovery-to-decision trace, architecture, trade-offs, critical experiments, bounded build milestones, unknowns and risk owner. Do not copy Steward's deployment model or fabricate user interviews. Independent Build must discover whether the proposal survives real implementation."
        ]
      }
    ],
    "practice": [
      "Run a structured review on two deliberately unsupported proposal claims and record an explicit FAIL/NOT TESTED finding.",
      "Provide a counterfactual that reverses the chosen architecture; identify the smallest experiment that would discriminate alternatives."
    ],
    "acceptance": [
      "A claim cannot be declared verified merely because an artifact mentions it.",
      "The exit record distinguishes permission to investigate/build from permission to release to real users."
    ],
    "resource": {
      "title": "Architecture Decision Records",
      "url": "https://adr.github.io/",
      "purpose": "Use a decision record with context, options, evidence, consequences and a revisit condition.",
      "kind": "reference"
    }
  }
};
