import type { LearningResource } from "../activities/content";
/** Independent Build mechanics. Tool lending is a fictional teaching fixture, never capstone research. */
export interface BuildLens { title: string; sections:{heading:string;paragraphs:string[]}[]; practice:string[];acceptance:string[];resource:LearningResource; }
export const buildLenses:Record<string,BuildLens> = {
  "start-from-a-blank-repository": {
    "title": "A new repository is an authorship boundary, not a folder-name change",
    "sections": [
      {
        "heading": "What a blank start actually proves",
        "paragraphs": [
          "A new capstone must begin from an empty version-control history and a problem statement independent of Steward. The learner may reuse general techniques—API contracts, continuous integration, migration discipline—but must re-derive boundaries and implementation choices from the discovered new domain. A fork, vendored Steward files or a mass copy followed by renames defeats the assessment even when the code runs.",
          "For a clearly fictitious tool-lending cooperative, the first acceptance target might be checking out a single physical item without issuing a duplicate active loan. Create a short README containing the assumed actor, observable action, unavailable real interview data and an explicit question about the source of truth for membership. These are teaching facts about the fixture, not claims about a real organization."
        ]
      },
      {
        "heading": "Rebuild the smallest inspectable project",
        "paragraphs": [
          "Initialize a new Git repository, add `.gitignore`, README, application entry point, a first failure-oriented test and the minimal supported dependency manifest for the chosen language. Record the commands, their expected working-directory and a clean-tree check. A meaningful initial commit is more important than a dozen precreated directories.",
          "A first passing test of `1 == 1` verifies only the test runner, not the domain. Follow with one test that checks a forbidden state or a stakeholder-facing outcome, and record which implementation commit makes that failing test pass."
        ]
      },
      {
        "heading": "Negative case and alternative",
        "paragraphs": [
          "Reject imported Steward models masquerading as new entities. A reusable, licensed third-party library can be appropriate if its contract fits; copying the old product's ownership model cannot be justified solely because the framework is familiar. Capture upstream attribution and license obligations for external templates, if used.",
          "Independent challenge: remove the scaffolding package or rename the framework and explain which domain semantics, safety requirements and tests remain unchanged. If the entire design collapses, the alleged independence is questionable."
        ]
      }
    ],
    "practice": [
      "Write an independent domain-specific README and trace the actual first two commits, including a real initially failing domain test.",
      "Review the repository tree for copied Steward domain files and justify every external template or licensed dependency."
    ],
    "acceptance": [
      "The first test rejects an actual domain violation rather than tautologically passing.",
      "A reviewer can reproduce setup from clean checkout without old TSA project state."
    ],
    "resource": {
      "title": "Git book — new repository and first commits",
      "url": "https://git-scm.com/book/en/v2/Git-Basics-Getting-a-Git-Repository",
      "kind": "reference",
      "purpose": "Specific mechanism and trade-off; reference, not evidence of completed learning."
    }
  },
  "establish-engineering-conventions": {
    "title": "Conventions make evidence reproducible across machines",
    "sections": [
      {
        "heading": "Pin the toolchain before writing tooling policies",
        "paragraphs": [
          "A convention is a team-owned, testable constraint on how work is built, reviewed and operated. First identify language/runtime, package manager, minimum versions and exact local run commands. A lockfile pins resolved dependencies only within its ecosystem's guarantees; it does not prove that an upstream artifact is trusted or that all operating-system dependencies match.",
          "Write a five-command bootstrap for a clean machine: install compatible runtime, resolve dependencies, initialize disposable data, execute tests and start service. Every step needs an expected result and a failure explanation. A Makefile or task runner can wrap the commands, but must not hide required environment variables."
        ]
      },
      {
        "heading": "Separate mechanical checks from engineering judgment",
        "paragraphs": [
          "Use formatters, lint checks and basic type validation to catch deterministic errors. A passing formatter says nothing about authorization, transaction atomicity or users' needs. Pull-request review should inspect risk, observable behavior, negative tests, data handling, migration impact and who can operate the change.",
          "Define an explicit secret boundary: commit an example configuration with placeholders, never credentials. A `.gitignore` entry is insufficient protection if a secret is already committed. Include a non-destructive scan and a rotation response for accidental disclosure."
        ]
      },
      {
        "heading": "Compare alternatives and failure response",
        "paragraphs": [
          "A shared formatter configuration improves consistency when several contributors exist but may create churn when imposed on a tiny single-author prototype. Prefer one simple lint/type/test command initially and expand when real repetition or risk justifies it.",
          "To challenge reproducibility, run from a clean checkout without prior caches, then deliberately remove a required environment setting. The resulting failure should name the missing prerequisite rather than silently defaulting to privileged or production services."
        ]
      }
    ],
    "practice": [
      "Document a clean-checkout bootstrap with version constraints, command inputs and expected output.",
      "Deliberately unset a required secret in disposable configuration and show startup fails safely without reaching production."
    ],
    "acceptance": [
      "A clean checkout can run the project's meaningful test command.",
      "No secret is committed or implicitly taken from a production target."
    ],
    "resource": {
      "title": "Twelve-Factor — Config",
      "url": "https://12factor.net/config",
      "kind": "reference",
      "purpose": "Specific mechanism and trade-off; reference, not evidence of completed learning."
    }
  },
  "model-the-domain": {
    "title": "Domain states and forbidden actions must be explicit",
    "sections": [
      {
        "heading": "Convert story language into invariants",
        "paragraphs": [
          "A domain entity has identity, rules and meaningful lifecycle, whereas an API payload is only one representation. In the fictional tool library, Item identifies a physical asset; Loan identifies a custody event; Member represents a borrower under a particular organization. Do not combine Item and Loan simply because an early UI shows one available/not-available flag.",
          "Define allowed transitions: loan issued → returned or marked lost; a returned loan cannot be issued again by changing the same historical row. Provide a named command for each transition and an expected rejection for forbidden transitions. Assign a role and scope responsible for authorizing the command."
        ]
      },
      {
        "heading": "Test the policy independent of transport",
        "paragraphs": [
          "Start with a tiny pure state-transition function that takes current state and command, returns next state or raises a typed domain error. A good test includes one valid transition, a rejected invalid transition and unchanged original state after rejection.",
          "A model can be locally correct and still insufficient in production. Two staff sessions can simultaneously inspect an item as available; application-level checks without database atomicity will not prevent double issuance. Keep in-memory and database guarantees separate."
        ]
      },
      {
        "heading": "Alternate model, cost and transfer",
        "paragraphs": [
          "An event-sourced model retains every custody transition and can support audit/rebuild, but introduces event-ordering, idempotency and operational complexity. A normal relational Loan history may be sufficient. Choose based on traceability, reprocessing and audit requirements, not fashion.",
          "For a different domain, invent a new lifecycle with at least two forbidden transitions. Show why one field or action cannot be renamed from Steward or the teaching fixture without violating discovered terminology."
        ]
      }
    ],
    "practice": [
      "Define one lifecycle as a transition table, with an authorized actor and two forbidden transitions.",
      "Implement a pure state transition and test one valid action, one forbidden action and no side effect."
    ],
    "acceptance": [
      "Original state is unchanged after rejected transition.",
      "A domain object is not a copied Steward model or an HTTP serialization class."
    ],
    "resource": {
      "title": "Fowler — Anemic Domain Model (trade-off lens)",
      "url": "https://martinfowler.com/bliki/AnemicDomainModel.html",
      "kind": "reference",
      "purpose": "Specific mechanism and trade-off; reference, not evidence of completed learning."
    }
  },
  "implement-the-system": {
    "title": "A vertical slice is a working outcome from request to persisted decision",
    "sections": [
      {
        "heading": "Define a slice by the observable user result",
        "paragraphs": [
          "An end-to-end increment crosses input, validation, authorization, domain rule, persistence and response. It is not a sequence of ‘complete all models’, ‘complete all controllers’ and ‘complete all UI’. For the imaginary tool library, issue one physical item to a permitted borrower in a disposable environment, then retrieve its custody state.",
          "Start with the smallest contract: who requests, what resource is affected, which request fields are trusted, which state transition occurs, and what response or event proves success. Do not require a queue, cache or microservice if one transaction is sufficient."
        ]
      },
      {
        "heading": "Follow a denied operation to absence of effects",
        "paragraphs": [
          "An unauthorized borrower attempts to issue another location's item with a syntactically valid request. A handler that checks only whether a bearer token exists is insufficient; it must check the principal's effective ownership/role relative to the persisted item. Denial must precede writes and external messages.",
          "Use an oracle that verifies response semantics and a zero delta in database rows, notifications and audit state where required. A status 400 caused by malformed JSON is not proof that cross-team authorization works."
        ]
      },
      {
        "heading": "Make failure interpretation part of the increment",
        "paragraphs": [
          "Consider database timeout after commit but before HTTP response. The client may see a failure although an operation succeeded; blind retry can cause duplicate side effects. Distinguish confirmed rejection from uncertain outcome, and choose idempotent request identity or a safe status lookup appropriate to the domain.",
          "Apply a new stakeholder constraint mid-iteration and explicitly record whether the current design must be revised. Do not mask it by accumulating abstraction layers."
        ]
      }
    ],
    "practice": [
      "Implement the smallest complete user-value path through authorization, domain rule, persistence and confirmation.",
      "Write a syntactically valid forbidden-operation test and inspect zero prohibited database/external side effects."
    ],
    "acceptance": [
      "A negative authorization result actually reaches the ownership decision.",
      "An ambiguous commit/retry story has an explicit observed or NOT TESTED outcome."
    ],
    "resource": {
      "title": "Fowler — difficult software change",
      "url": "https://martinfowler.com/bliki/TwoHardThings.html",
      "kind": "reference",
      "purpose": "Specific mechanism and trade-off; reference, not evidence of completed learning."
    }
  },
  "design-and-evolve-the-data": {
    "title": "Durable state, transaction boundaries and migration reversibility",
    "sections": [
      {
        "heading": "Move from domain invariant to concrete integrity mechanism",
        "paragraphs": [
          "A table primary key distinguishes records; a foreign key constrains reference identity; a uniqueness constraint can prevent a duplicate key; a CHECK validates one row's values. None of these automatically solves a cross-table membership rule or every possible concurrency schedule.",
          "For a fictional item/loan model, decide whether one active loan per physical asset is required. An example partial unique index on `item_id WHERE returned_at IS NULL` can enforce that local property, but only after modeling lost items and overlapping reservations correctly. Explain which state transitions make a loan active."
        ]
      },
      {
        "heading": "Run an actual isolated database negative",
        "paragraphs": [
          "The bundled SQLite example creates an in-memory `loan` table and a partial unique index, inserts one active loan, and demonstrates the second active loan is rejected while a returned historical loan is allowed. This proves the chosen SQLite constraint behaves as described, NOT PostgreSQL migration readiness or distributed concurrency.",
          "To prove a production PostgreSQL claim, run a separate disposable PostgreSQL fixture and two concurrent clients under a documented isolation level, inspect commit outcomes and stored rows, then test recovery. Do not replace that evidence with the local SQLite output."
        ]
      },
      {
        "heading": "Evolve real historical data safely",
        "paragraphs": [
          "A schema migration must handle records created before the new code existed. Use expand-and-contract where needed: add a compatible nullable column or new representation, backfill in bounded batches with idempotency, verify old/new consumers, enforce constraints once data is valid, and remove old fields only after safe promotion.",
          "Negative rehearsal: create an intentionally invalid historical row, run the migration, prove it fails with data intact or is repaired through an approved plan; do not delete conflicting production data to make migration green. Document recoverability when DDL cannot be rolled back easily."
        ]
      }
    ],
    "practice": [
      "Run the published disposable constraint test and capture PASS and deliberately rejected second active loan.",
      "Prepare representative historical rows and a reversible migration rehearsal; do not claim PostgreSQL concurrency without PostgreSQL testing."
    ],
    "acceptance": [
      "At least one invalid persisted state is rejected at the data boundary.",
      "An index/constraint claim identifies its database engine and concurrency scope."
    ],
    "resource": {
      "title": "PostgreSQL — Constraints",
      "url": "https://www.postgresql.org/docs/current/ddl-constraints.html",
      "kind": "reference",
      "purpose": "Specific mechanism and trade-off; reference, not evidence of completed learning."
    }
  },
  "build-infrastructure": {
    "title": "Recreate the environment and explain each privilege boundary",
    "sections": [
      {
        "heading": "Infrastructure is an executable set of dependencies",
        "paragraphs": [
          "Draw runtime processes, ingress, database, storage, secret delivery and backups, then name the responsible owner for each. Infrastructure-as-code is one implementation form; the real claim is that a new engineer can reproduce a disposable environment predictably without hidden laptop state.",
          "Explicitly separate development, staging and production-style environments. A local Docker Compose file can prove wiring in a disposable context, but does not establish cloud IAM or cluster network policy. Choose an infrastructure tool after the problem's hosting and operations requirements are known."
        ]
      },
      {
        "heading": "Prevent hidden and dangerous configuration assumptions",
        "paragraphs": [
          "Keep secret values out of source and images. A placeholder environment variable that silently defaults to the production database is unsafe. Require explicit connection target, minimum privilege, and a startup refusal for missing secrets. Record network exposure and who can revoke access.",
          "Expose one negative: with a missing database secret, startup fails without making a remote connection. With an unexpected public bind, a test or review catches it. Confirm destructive cleanup commands act only on isolated named resources."
        ]
      },
      {
        "heading": "Recovery is part of infrastructure ownership",
        "paragraphs": [
          "Preserving a snapshot is not equivalent to a restored and integrity-checked database. Define where backup files are stored, access required to restore them, who owns the key, RPO/RTO assumptions and one exact safe drill.",
          "Compare the operations cost and failure domain of a managed database to self-hosting. Prefer the smallest design that meets the discovered requirements while leaving a credible failure/recovery route."
        ]
      }
    ],
    "practice": [
      "Document a disposable environment's data stores, exposure, secret sources and least-privilege identities.",
      "Recreate it from a clean checkout, then remove an essential secret and document the fail-safe refusal."
    ],
    "acceptance": [
      "Environment creation can be reproduced from authorized commands.",
      "Destructive cleanup is scoped to named disposable resources."
    ],
    "resource": {
      "title": "Twelve-Factor — Backing services",
      "url": "https://12factor.net/backing-services",
      "kind": "reference",
      "purpose": "Specific mechanism and trade-off; reference, not evidence of completed learning."
    }
  },
  "automate-delivery": {
    "title": "A green pipeline is an evidence claim, not an approval token",
    "sections": [
      {
        "heading": "Trace one commit into an installed artifact",
        "paragraphs": [
          "Model delivery as commit → test selection → build → immutable artifact digest → deployed version → runtime verification. A Git tag names source history, not necessarily binary bytes. If a deployment rebuilds the image under the same tag, the newly installed bytes may differ because dependencies or build environment changed.",
          "Teach artifact identity using a local hashlib fixture: two byte sequences with the same human release label have different SHA-256 digests. Record both source revision and artifact digest; promotion should reuse the verified build artifact, not recompute it silently."
        ]
      },
      {
        "heading": "Define gates with explicit missing-state semantics",
        "paragraphs": [
          "Required gates include at least one behavior test, dependency provenance/scan where applicable, migration rehearsal, authorization negative case and post-deploy smoke verification. Distinguish PASS, FAIL and NOT TESTED. A missing gate cannot become PASS just because another test passed.",
          "Prove failure by deleting one expected report or supplying a broken migration in a disposable pipeline. The pipeline must refuse promotion while retaining diagnostics. An ignored exit code or masked pipeline error is a workflow defect."
        ]
      },
      {
        "heading": "Plan rollback and fail-forward",
        "paragraphs": [
          "An immutable artifact alone does not mean a deployed database can be rolled back. For irreversible changes, choose compatible schema windows and forward recovery. Document command prerequisites, identity/permissions, stop conditions and how the operator verifies the outcome.",
          "Write a final release decision as an evidence record. A technical gate may support promotion, but real production approval and residual-risk acceptance require authorized human decisions."
        ]
      }
    ],
    "practice": [
      "Run the exact published artifact-digest example, mutate the bytes, and observe why equal tags cannot prove identical artifacts.",
      "Write one fail-closed pipeline gate where a missing migration or authorization result stops promotion."
    ],
    "acceptance": [
      "A deployment identifies the already-tested artifact digest.",
      "A failed or missing required stage cannot be marked successful by another green stage."
    ],
    "resource": {
      "title": "Twelve-Factor — Build, release, run",
      "url": "https://12factor.net/build-release-run",
      "kind": "reference",
      "purpose": "Specific mechanism and trade-off; reference, not evidence of completed learning."
    }
  },
  "build-quality-evidence": {
    "title": "Test the observable rule and the trustworthiness of the test itself",
    "sections": [
      {
        "heading": "Start with risks and explicit oracles",
        "paragraphs": [
          "The quality strategy specifies what could go wrong and what evidence would catch it. For a physical item loan, an outsider must be unable to issue an item and an existing active loan must block duplicate issuance. An API 403 by itself is weaker evidence than 403 plus unchanged row count plus absence of external notification.",
          "Separate expected errors from execution faults. A 400 from invalid JSON does not prove authorization; a 500 from a missing test database does not prove domain rejection. Use fixtures that can reach the intended decision boundary."
        ]
      },
      {
        "heading": "Select economical layers",
        "paragraphs": [
          "Pure domain tests are fast and deterministic for transitions. Database integration tests protect durable constraints and migration behavior. Signed HTTP tests protect identity, nested resource scope and public error contracts. UI tests focus on real interaction, accessibility and error messaging. Use exploratory sessions for unknown failures and recovery behavior.",
          "A broad green suite with no negative cases may be worse than a smaller suite with strong oracles: coverage measures execution, not the correctness of assertions. Reject mutants that allow unauthorized writes or silently skip a required gate."
        ]
      },
      {
        "heading": "Protect the independent test baseline",
        "paragraphs": [
          "Before extracting any shared testing library, freeze a passing capstone test suite that does not depend on `tsa-test-core`. Record test commands, versions, failures and the baseline dependency tree. The library remains hypothetical until two real Java consumers demonstrate identical generic needs.",
          "If the capstone is not Java-based, do not rewrite it to qualify as a Maven consumer. The later extraction gate can use a separate genuine Java testing increment against an independently testable contract, but a dummy import-only project does not prove generality."
        ]
      }
    ],
    "practice": [
      "Map two major capstone risks to independent oracles at domain, database and signed HTTP boundaries.",
      "Supply an intentionally wrong implementation or an unauthorized effect and prove the test actually detects it."
    ],
    "acceptance": [
      "The test suite retains a passing independent baseline without tsa-test-core.",
      "An HTTP denial is paired with persisted-state/no-effect evidence where appropriate."
    ],
    "resource": {
      "title": "OWASP Web Security Testing Guide",
      "url": "https://owasp.org/www-project-web-security-testing-guide/",
      "kind": "reference",
      "purpose": "Specific mechanism and trade-off; reference, not evidence of completed learning."
    }
  },
  "secure-the-system": {
    "title": "Access control must follow object ownership through nested operations",
    "sections": [
      {
        "heading": "Separate identification, authority and domain validity",
        "paragraphs": [
          "Authentication proves who presents credentials; authorization determines whether that identity may perform an action on a specific persisted resource; domain validation determines whether the requested state transition is legitimate. These must not collapse into a single `if token` branch.",
          "A token for Location B must not issue a loan for a real item belonging to Location A. Use server-side ownership resolution and a denied cross-location write. A path parameter containing location A is not proof of caller authorization."
        ]
      },
      {
        "heading": "Trace the full abuse path",
        "paragraphs": [
          "An attacker submits a syntactically valid signed request to a nested loan endpoint. The handler checks only the outer `is_authenticated` permission, then inserts a Loan and queues notification. The response may be 403 due to a later check, but the system has already changed durable or external state.",
          "Put permission checks before changes; test status, database state, attempted external actions and leaked sensitive data. A valid negative test must reach authorization logic, not fail earlier on missing fields."
        ]
      },
      {
        "heading": "Secrets, provenance and revision",
        "paragraphs": [
          "Protect auth headers, tokens and personal identifiers in logs and traces; prefer correlation IDs and bounded metadata. Pin and review dependencies, apply least privilege to runtime/CI accounts and document which unresolved threats need human specialist review. A clean scanner does not certify security.",
          "If actual business obligations or privacy law are uncertain, record that uncertainty and obtain qualified review. The fictional tool-lending scenario implies no universal legal requirements."
        ]
      }
    ],
    "practice": [
      "Exercise one valid authorized operation and one equally well-formed signed cross-owner operation in an approved test environment.",
      "Inspect the database and side-effect queue for zero forbidden effects and verify token-safe diagnostic logs."
    ],
    "acceptance": [
      "Authorization is decided using persisted object scope, not only a valid token.",
      "A claimed security result identifies exact request, environment and remaining untested paths."
    ],
    "resource": {
      "title": "OWASP API — Broken Object-Level Authorization",
      "url": "https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization/",
      "kind": "reference",
      "purpose": "Specific mechanism and trade-off; reference, not evidence of completed learning."
    }
  },
  "instrument-the-system": {
    "title": "Telemetry answers a diagnostic question without leaking secrets",
    "sections": [
      {
        "heading": "Define signals from the real user journey",
        "paragraphs": [
          "A request can fail before persistence, after persistence or in a downstream notification. Emit a correlation ID, operation name, tenant-safe resource reference, outcome and elapsed time so operators can distinguish these stages without recording an Authorization header.",
          "Logs are discrete event records, metrics aggregate dimensions and traces link spans across operations. High-cardinality member IDs are often inappropriate metric labels, even when logs can contain controlled, minimized identity data."
        ]
      },
      {
        "heading": "Demonstrate fail-safe log field selection",
        "paragraphs": [
          "The published Python example builds structured events from an allowlist and explicitly rejects token/password inputs; it also shows how indiscriminate `dict(request.headers)` logging would leak a bearer token. Run it without credentials or external services and examine the expected redacted event.",
          "A successful local allowlist example does not prove that every real middleware, error handler or proxy stops sensitive logging. The capstone must inspect captured application and ingress logs under a signed failure."
        ]
      },
      {
        "heading": "Diagnose one intentionally triggered failure",
        "paragraphs": [
          "Inject a request denied by object ownership; follow the correlation ID through HTTP gateway, application decision and optional downstream attempts. Observe both the refusal and the absence of a sensitive secret. If traces are absent, label propagation NOT TESTED rather than drawing an invented span diagram.",
          "Compare log retention cost, privacy and incident utility. More telemetry is not automatically better when it exposes personal data or overwhelms operators."
        ]
      }
    ],
    "practice": [
      "Run the published structured-log allowlist and unsafe-header diagnostic example.",
      "Inject a safely rejected operation in the capstone, trace correlation and verify no raw credential appears in emitted logs."
    ],
    "acceptance": [
      "A diagnostic can distinguish rejected-before-write and failed-after-write cases.",
      "High-cardinality or personal fields are not blindly promoted to metrics dimensions."
    ],
    "resource": {
      "title": "OpenTelemetry — Signals",
      "url": "https://opentelemetry.io/docs/concepts/signals/",
      "kind": "reference",
      "purpose": "Specific mechanism and trade-off; reference, not evidence of completed learning."
    }
  },
  "build-reliability-evidence": {
    "title": "Exercise ambiguous commits, restore integrity and capacity hypotheses",
    "sections": [
      {
        "heading": "Choose failure modes from the workflow, not an architecture slide",
        "paragraphs": [
          "The decisive reliability problem for a loan issue is an ambiguous result: the database commits but the response never reaches the caller. The client may retry, and without idempotency keys or unique transaction identity this can create duplicate effects. A simple graceful error page cannot repair ambiguity.",
          "Give each operation a stable request identity and a lookup/reconciliation path appropriate to its domain. Define what is retried, which errors should stop immediately, backoff limits and a response telling the caller how to check the outcome."
        ]
      },
      {
        "heading": "Prove recoverability on an isolated fixture",
        "paragraphs": [
          "Back up a disposable datastore, mutate/destroy its local state, restore into a new clean store, and compare domain-relevant checksums, row counts and invariants. A file existing on disk is only a backup artifact; a restore plus integrity check is actual local recovery evidence.",
          "Record the measured recovery duration when a real drill runs, not a guessed RTO. RPO/RTO are stakeholder objectives that require actual business inputs; a synthetic SQLite restore cannot establish production PostgreSQL recoverability."
        ]
      },
      {
        "heading": "Capacity and graceful degradation",
        "paragraphs": [
          "Choose a workload whose requests resemble the real user workflow, state the load generator, concurrency, initial database size and success/latency oracle. Benchmarking one health endpoint on an empty database is not proof of issuing capacity.",
          "Test a failed membership API during a loan request. Choose block, queue or bounded offline handling through explicit domain policy; do not silently authorize risky actions during outage."
        ]
      }
    ],
    "practice": [
      "Demonstrate an ambiguous commit under retry, documenting idempotency scope and observed outcome.",
      "Run the local disposable restore exercise, corrupt one critical field and show the integrity check rejects it."
    ],
    "acceptance": [
      "Backup existence and successful restore are separately evidenced.",
      "Real RPO/RTO and production-DB claims remain NOT TESTED without an approved drill."
    ],
    "resource": {
      "title": "Google SRE Workbook — Implementing SLOs",
      "url": "https://sre.google/workbook/implementing-slos/",
      "kind": "reference",
      "purpose": "Specific mechanism and trade-off; reference, not evidence of completed learning."
    }
  },
  "operate-internal-dependencies-deliberately": {
    "title": "Shared packages have authority, consumers and lifecycle obligations",
    "sections": [
      {
        "heading": "Distinguish implemented, released and merely proposed dependencies",
        "paragraphs": [
          "A folder named `steward-common` is not evidence that the package was released, its API is stable or it is approved for a new product. Nexus may be available from earlier TSA work, but its actual configured service, trust root and package version need verification in the capstone environment.",
          "Every reuse decision needs the actual consumer use case, API contract, version, license, owner, security/update expectations, failure mode and migration/exit strategy. If those are unknown, use a local solution until the evidence exists."
        ]
      },
      {
        "heading": "Two consumers before extraction",
        "paragraphs": [
          "Do not create `tsa-test-core` merely because a previous lesson nominated it. A genuine second Java test consumer must have its own test risk, passing pre-extraction suite and a repeated product-independent capability already demonstrated in `steward-tests`.",
          "Only then compare the two implementations, design a smallest common API, publish to Nexus and rerun both consumers from clean dependency resolution. A project that merely imports the proposed package with no meaningful assertions is a circular demonstration."
        ]
      },
      {
        "heading": "Compatibility and blast radius",
        "paragraphs": [
          "Package extraction introduces versioning, build distribution, access, rollback and cross-consumer compatibility risks. If fixing one consumer requires a product-specific switch inside a shared library, the abstraction is too broad.",
          "For a non-Java capstone, keep its chosen test stack and use a separate authentic Java integration test for an unrelated service contract. Record why the extra consumer is real and not manufactured solely to satisfy a curriculum count."
        ]
      }
    ],
    "practice": [
      "Inventory real capstone dependencies and distinguish released, unearned and hypothetical internal APIs.",
      "For proposed tsa-test-core, compare two independent Java consumers' pre-extraction capability tests rather than creating a dummy import."
    ],
    "acceptance": [
      "A shared package is published only after actual two-consumer evidence.",
      "A non-Java capstone is not redesigned merely to satisfy Maven exercise prerequisites."
    ],
    "resource": {
      "title": "Semantic Versioning",
      "url": "https://semver.org/",
      "kind": "reference",
      "purpose": "Specific mechanism and trade-off; reference, not evidence of completed learning."
    }
  },
  "iterate-on-engineering-decisions": {
    "title": "Implementation evidence is allowed to overturn the proposal",
    "sections": [
      {
        "heading": "State the original hypothesis with a measurable trigger",
        "paragraphs": [
          "An architecture proposal is a record of what was reasonable under known evidence. A new production-like failure, measured latency or unexpected integration constraint may legitimately reverse the decision. For example, a design assuming eligibility can always be checked live may be invalidated by a documented offline service requirement.",
          "Record original context, observed test, sample size and environment, rejected options, revised decision and rollback/impact. A revised diagram without a dated record makes future reviewers unable to distinguish a deliberate change from silent drift."
        ]
      },
      {
        "heading": "A trade-off is not an absolute",
        "paragraphs": [
          "Switching to asynchronous membership verification might reduce blocking, but changes consistency, fraud risk, queue durability and staff workflows. Document who approves that trade and what new test must prove it. Do not assert improved availability from a queue drawn on a diagram.",
          "Compare a minimal improvement (cache and safe refusal), bounded queue and offline operation; set a revisit threshold. Reject technologies that cannot be operationally supported."
        ]
      },
      {
        "heading": "Challenge the decision independently",
        "paragraphs": [
          "Introduce an unseen constraint, such as a new legal requirement or a tenfold volume increase. Explain which part of the architecture would change first, which invariants must remain, and what evidence you need before redesigning.",
          "Preserve superseded decisions, their dated assumptions, linked observations and previously rejected alternatives rather than deleting them. Future engineers must be able to determine why the old design was defensible then, exactly which new evidence changed the decision, and whether the reversal condition still holds."
        ]
      }
    ],
    "practice": [
      "Find one implementation observation that strengthens or falsifies an original architecture assumption.",
      "Record the revision with a measured trigger, rejected alternative and test that would detect a regression."
    ],
    "acceptance": [
      "Changed architecture has a recorded consequence for data, security, operations and cost.",
      "A reviewer can reconstruct why the older assumption was invalidated."
    ],
    "resource": {
      "title": "Architecture Decision Records",
      "url": "https://adr.github.io/",
      "kind": "reference",
      "purpose": "Specific mechanism and trade-off; reference, not evidence of completed learning."
    }
  },
  "document-significant-decisions": {
    "title": "A decision record must be falsifiable and linked to real artifacts",
    "sections": [
      {
        "heading": "Why decisions deserve durable evidence",
        "paragraphs": [
          "An ADR or decision record captures context, options, selected trade-off, consequences and conditions that would make the decision wrong. It is not a weekly diary or justification written after every commit.",
          "Example: storing active loan status as a partial unique index may be appropriate today. Document whether the index covers ‘lost’ loans, expected concurrency and supported DB version, then link to an executable regression test and migration."
        ]
      },
      {
        "heading": "Record a challenged decision",
        "paragraphs": [
          "Include a status such as PROPOSED, ACCEPTED, SUPERSEDED, a date and actual owner. Keep rejected alternatives and what would have justified them. Connect specific commits, tests, docs and production-style observations, but do not copy full CI logs into an ADR.",
          "An architecture diagram showing a message broker without any supporting reliability or data-consistency assumption is not a defensible decision. Record the omission as NOT TESTED if the integration is unbuilt."
        ]
      },
      {
        "heading": "Distinguish record authenticity from polish",
        "paragraphs": [
          "A polished document cannot establish that commands ran, a restore succeeded or a reviewer participated. Provide access to inspectable source artifacts and mark simulated evidence clearly.",
          "Ask a reviewer to present a plausible contradictory trace, incompatible deployment constraint or new stakeholder requirement. The ADR must name the actual person authorized to revise the record, the measurable threshold that would reverse the choice, and the regression evidence required before changing the implementation."
        ]
      }
    ],
    "practice": [
      "Write one ADR covering a hard-to-reverse data or identity choice, and link the actual regression test.",
      "Challenge it with a new constraint and record whether it remains ACCEPTED or becomes SUPERSEDED."
    ],
    "acceptance": [
      "The ADR separates observed results from forecast benefits.",
      "The record has an owner, dated context and an actionable revisit trigger."
    ],
    "resource": {
      "title": "Architecture Decision Records",
      "url": "https://adr.github.io/",
      "kind": "reference",
      "purpose": "Specific mechanism and trade-off; reference, not evidence of completed learning."
    }
  },
  "manage-scope-and-technical-debt": {
    "title": "Protect stakeholder outcomes without hiding safety debt",
    "sections": [
      {
        "heading": "Differentiate feature requests, defects and deliberate debt",
        "paragraphs": [
          "A bug violates an agreed observable contract. Missing scope is functionality explicitly not yet promised. Technical debt is a conscious shortcut or implementation choice that creates a predictable future cost; every imperfect-looking line is not automatically debt.",
          "Example: manual entry of item condition may be an acceptable initial feature boundary. But a known broken cross-location authorization check is a security defect, not an optional refactor to defer casually."
        ]
      },
      {
        "heading": "Prioritize by consequence and reversibility",
        "paragraphs": [
          "For each backlog item, record affected user, likelihood and impact, implementation cost, dependencies, owner and trigger for revisiting. A low-risk UI polish task should not displace a known data-corruption or recovery defect solely because it is easier to demonstrate.",
          "Separate reversible experimentation from permanent schema or public contract changes. A deferred migration safety issue may block release even if the happy path works."
        ]
      },
      {
        "heading": "Reject scope inflation as a proxy for learning",
        "paragraphs": [
          "A capstone is judged by its ability to deliver a coherent, supportable outcome under constraints, not by number of stacks or cloud products. Avoid adding brokers, multiple services and advanced identity federation if the discovered problem does not justify them.",
          "Propose an explicit cut line: the minimum end-to-end vertical workflow and its safety gates must survive; enhancements beyond it need a demonstrated stakeholder outcome."
        ]
      }
    ],
    "practice": [
      "Separate two defects, two intentional non-goals and one real technical-debt item with consequence and owner.",
      "Remove an unjustified complex feature from the release and show how safety-critical invariants remain in scope."
    ],
    "acceptance": [
      "Authorization/data-integrity defects are not mislabeled as optional cleanup.",
      "A minimal releasable vertical slice retains explicit scope and verification boundaries."
    ],
    "resource": {
      "title": "Fowler — Technical Debt",
      "url": "https://martinfowler.com/bliki/TechnicalDebt.html",
      "kind": "reference",
      "purpose": "Specific mechanism and trade-off; reference, not evidence of completed learning."
    }
  }
};
