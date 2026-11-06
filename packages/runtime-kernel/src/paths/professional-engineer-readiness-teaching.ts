import type { LearningResource } from "../activities/content";
/** Evidence-first operational readiness: fictional cooperative case, never an actual release claim. */
export interface ReadinessLens { title:string; sections:{heading:string; paragraphs:string[]}[]; practice:string[];acceptance:string[];resource:LearningResource; }
export const readinessLenses: Record<string, ReadinessLens> = {
  "deployment-readiness": {
    "title": "A release is an identifiable set of bytes, configuration and database state",
    "sections": [
      {
        "heading": "Separate a deployable artifact from a running release",
        "paragraphs": [
          "An artifact is built from source and has an immutable identity, such as a digest. A release binds that artifact to configuration, secrets, database compatibility and a target environment; a deployment changes the running system. A green compile check proves none of the latter occurred. Keep the source revision, dependency lock and digest together.",
          "In a fictional community tool-lending system, version 1.2 includes a new nullable `returned_at` field. The release plan must say which old records exist, how old and new application processes interpret them, and how a failed deployment can recover without erasing valid loans. The scenario is fictional, not a real operating system or approved release."
        ]
      },
      {
        "heading": "Work the compatibility window and a deliberately unsafe path",
        "paragraphs": [
          "Deploying code that requires a non-null field before old records are backfilled creates an outage despite a passing build. A safer expand–migrate–verify–contract sequence ensures old readers can survive the transition and uses a populated-data rehearsal; whether rollback or forward fix is possible depends on DDL, migration and consumer versions.",
          "Simulate a lost deployment verification report. The release recommendation should be NOT_PROVEN, not PASS. A human release authority may document a scoped exception where policy allows, but cannot change the failed technical evidence into a success. Identify the exact observation and stop command rather than promising generic rollback."
        ]
      },
      {
        "heading": "Independent readiness decision",
        "paragraphs": [
          "Write a two-column release ledger: claim, producing command and immutable evidence identity on one side; source, environment and owner on the other. Include a deliberately stale artifact digest, an unsafe migration and a correctly deployed version to show the gates can distinguish them.",
          "For the learner's actual capstone, provide a real tagged build, target-environment smoke check, and data-compatibility rehearsal. If the target is absent, mark deployment NOT_TESTED; never transfer the fictional example's pass markers into the capstone's evidence index."
        ]
      }
    ],
    "practice": [
      "Compare the tested artifact's digest with deployed bytes and record one deliberately mismatched candidate.",
      "Rehearse migration on populated disposable data; show both stop condition and recovery choice."
    ],
    "acceptance": [
      "Missing artifact identity cannot be converted into a PASS by a successful build.",
      "Actual data compatibility and target-environment verification are independently evidenced."
    ],
    "resource": {
      "title": "Build, release, run",
      "url": "https://12factor.net/build-release-run",
      "purpose": "Use the relevant mechanism as a reference; not proof of real implementation.",
      "kind": "reference"
    }
  },
  "observability": {
    "title": "Observability is the ability to answer operational questions from observable state",
    "sections": [
      {
        "heading": "Choose signals from the user journey",
        "paragraphs": [
          "Logs record individual events, metrics aggregate rates or distributions, and traces link related work. A green health endpoint may coexist with a broken checkout workflow. Define a user-facing SLI such as correctly completed checkouts divided by valid attempts, plus latency and downstream failure signals when needed.",
          "For the hypothetical lending workflow, a timeout after database commit should generate a correlation ID and distinguish an accepted state change from a response not delivered. An operator needs a path to determine whether a retry would duplicate effects without leaking member names, bearer tokens or sensitive loan details."
        ]
      },
      {
        "heading": "Design actionable alerting and safe diagnostics",
        "paragraphs": [
          "An alert needs a threshold, measurement window, owner, diagnostic route, expected action and silence/escalation criteria. Alerting on every one-off 404 or transient timeout creates fatigue; paging only when the process crashes misses data-integrity failures. Compare alert noise and detection delay using the same user impact.",
          "Use a synthetic sequence of events where a duplicate-loan alert triggers even though process liveness remains true. Reject logging an Authorization header for correlation. A high-cardinality per-user metric label can also create runaway cost and privacy exposure."
        ]
      },
      {
        "heading": "Validate telemetry by deliberately injecting trouble",
        "paragraphs": [
          "Record a reproducible failure: request ID, expected user behavior, emitted log/metric/trace, query used and operator finding. An empty dashboard is not evidence that a signal exists, and a saved screenshot without source timestamps may be stale.",
          "On the actual capstone, make a real invalid ownership request and capture the trace through denial before write. If logs lack correlation or the metric has no owner, record the gap as NOT_TESTED or FAIL and revise the monitoring contract."
        ]
      }
    ],
    "practice": [
      "Inject a controlled failed user journey; capture correlation, actionable metric and real operator diagnostic.",
      "Contrast a healthy process with a broken business transaction and show which alert detects it."
    ],
    "acceptance": [
      "A real user-impacting failure is visible and diagnosable with a named operator.",
      "No raw bearer token or uncontrolled high-cardinality user ID is required for diagnosis."
    ],
    "resource": {
      "title": "OpenTelemetry signal fundamentals",
      "url": "https://opentelemetry.io/docs/concepts/signals/",
      "purpose": "Use the relevant mechanism as a reference; not proof of real implementation.",
      "kind": "reference"
    }
  },
  "security-assessment": {
    "title": "A security claim requires an attack path, a control and an observed blocked effect",
    "sections": [
      {
        "heading": "Assess the deployed attack surface, not a framework label",
        "paragraphs": [
          "Authentication identifies a principal, authorization grants a resource-specific action, and domain validation enforces workflow rules. Production readiness must check how those properties survive nested routes, actual deployment configuration, service-to-service identities, secret storage and new dependencies.",
          "In a fictional tool-lending API, a valid token for Cooperative B must not permit `POST /cooperatives/A/items/42/loans`. The correct denial is a syntactically valid request, a 403 or consistently concealed 404, and no prohibited loan row or downstream notification. A malformed request returning 400 never reached the authorization boundary."
        ]
      },
      {
        "heading": "Rank findings by consequence and exploitability",
        "paragraphs": [
          "A scanner finding is a hypothesis to triage, not proof of exploitation or clearance. Reproduce with a controlled request, identify reachable data, privileges and likely impact, then assign owner and treatment. A critical exposed token or bypassed object ownership can block release even if routine tests are green.",
          "Separate technical acceptance from policy or legal authority. A product owner cannot silently waive a legal privacy requirement, and a security reviewer cannot declare code secure from one green scan. Record uncertainty and specialist escalation when obligations are unknown."
        ]
      },
      {
        "heading": "Test changes that might invalidate protection",
        "paragraphs": [
          "Exercise allowed and denied actor/resource combinations after the final deployment configuration. Check logs for tokens, ensure least-privilege database credentials and compare an upstream package's provenance and supported release. Any untested public write path remains explicitly unassessed.",
          "An independent reviewer should introduce a third cooperative or bulk-import endpoint and ask whether the ownership predicate is still enforced. Require evidence of no persistent side effect, not just a comforting diagram."
        ]
      }
    ],
    "practice": [
      "Test a signed cross-owner mutation with valid input and inspect zero database/external effects.",
      "Triages one intentionally seeded finding with impact, reachability, owner and blocking status."
    ],
    "acceptance": [
      "The negative reaches authorization logic rather than returning a malformed-body error.",
      "Security readiness remains unproven where final deployment configuration is untested."
    ],
    "resource": {
      "title": "OWASP object-level authorization",
      "url": "https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization/",
      "purpose": "Use the relevant mechanism as a reference; not proof of real implementation.",
      "kind": "reference"
    }
  },
  "performance-evidence": {
    "title": "A performance result is a measured workload with an explicit oracle",
    "sections": [
      {
        "heading": "Define realistic load and acceptance thresholds",
        "paragraphs": [
          "Throughput is work completed per time; latency measures each request's response; percentiles summarize distribution tails; saturation describes a resource approaching its capacity. A 99th percentile of 800 ms is a statement about the measured sample, not a universal production guarantee.",
          "For an illustrative cooperative, a test workload may consist of 20 concurrent staff clients issuing and returning different items with realistic historical loan counts. Those are invented exercise assumptions, not measured demand. State the fixture size, read/write mix, concurrency, tool version, runtime and network path before choosing a threshold."
        ]
      },
      {
        "heading": "Expose the misleading average and health-only benchmark",
        "paragraphs": [
          "Consider samples 80, 90, 100, 110 and 900 milliseconds. The average hides a single slow request; computing a nearest-rank p95 on five samples returns 900 milliseconds, but the estimate is statistically fragile. A 1,000 requests/s empty health endpoint does not prove inventory integrity at 20 concurrent loan writes.",
          "Observe errors and correctness alongside latency. Throughput that rises because the service drops writes or returns 200 before a transaction commits is not improved capacity. Recheck actual completed-loan invariants and queue depth while increasing load."
        ]
      },
      {
        "heading": "Find a saturation point and translate it into an action",
        "paragraphs": [
          "Record response-time distribution, success rate, CPU/memory/database connection pressure, query time and any queue growth at successive load steps. Identify a sustained limit with repeated runs rather than presenting a single best-case number.",
          "Compare optimization, a bigger database tier and a stricter service objective against cost and reliability. If no stakeholder can justify the threshold, label it a provisional hypothesis and state the evidence needed before release."
        ]
      }
    ],
    "practice": [
      "Record workload, dataset, concurrency, latency distribution, errors and invariant check for a real local run.",
      "Compare a health-only benchmark to a domain-write workload and justify a provisional capacity bound."
    ],
    "acceptance": [
      "The report distinguishes sample estimate from future production capacity.",
      "Speed improvements cannot be credited if domain writes were dropped."
    ],
    "resource": {
      "title": "SRE Workbook on user-level indicators",
      "url": "https://sre.google/workbook/implementing-slos/",
      "purpose": "Use the relevant mechanism as a reference; not proof of real implementation.",
      "kind": "reference"
    }
  },
  "reliability-and-failure-testing": {
    "title": "Reliability evidence tests the system after controlled faults, not only its happy path",
    "sections": [
      {
        "heading": "Select failures with a credible chain to user harm",
        "paragraphs": [
          "Failure testing deliberately changes one dependency or resource under authorized, isolated conditions and observes the user and durable state. A test should name its inject point, scope, rollback, expected outcome, measurement and stop threshold.",
          "For the fictional loan service, break the membership eligibility API while a checkout is being created. Options include fail closed, queue for manual review, or bounded offline issuance; they have different fraud and availability trade-offs. An automatic retry is not inherently correct."
        ]
      },
      {
        "heading": "Treat ambiguous commits and retries as a domain problem",
        "paragraphs": [
          "A client may time out after its loan transaction commits. The client cannot infer failure from the missing response, and blindly resending a new request ID risks a second loan. An idempotency key with a scoped uniqueness contract or a read-back query can let callers discover the prior result.",
          "Test a simulated server crash between commit and response plus a replay with the SAME request identity. Verify one resulting loan and one external notification, or record FAIL. Do not claim exactly-once delivery merely because the queue has an ACK."
        ]
      },
      {
        "heading": "Practice safe bounded recovery",
        "paragraphs": [
          "Start with a disposable fault and a read-only observation. Roll back the injection, verify service health and inspect any duplicate/delayed side effects. Record the residual risk if the environment or vendor prevents the planned fault test.",
          "Do not chaos-test shared production without authorization and a stop plan. A controlled failure in a local model tests a local rule; the capstone still needs targeted runtime evidence with its actual data boundary."
        ]
      }
    ],
    "practice": [
      "Inject a disposable eligibility failure and record operator/user outcomes and stop criteria.",
      "Replay one ambiguous committed request with the same identity; verify no duplicate side effects."
    ],
    "acceptance": [
      "Fault is reversible and authorized in an isolated environment.",
      "A time-out is not falsely classified as an uncommitted transaction."
    ],
    "resource": {
      "title": "SRE cascading failure handling",
      "url": "https://sre.google/sre-book/addressing-cascading-failures/",
      "purpose": "Use the relevant mechanism as a reference; not proof of real implementation.",
      "kind": "reference"
    }
  },
  "backup-and-recovery": {
    "title": "Recoverable data means restored, consistent, usable state",
    "sections": [
      {
        "heading": "Define RPO and RTO using business consequences",
        "paragraphs": [
          "Recovery Point Objective is the maximum acceptable amount of lost work expressed as time; Recovery Time Objective is the acceptable elapsed interval to restore useful service. A nightly backup alone does not prove either target. Restore time includes access, provision, decryption, data recovery, consistency checking and application verification.",
          "For a fictional tool cooperative, losing one hour of active loan issues may require manual reconciliation. Decide who can authorize corrections and which authoritative transaction log survives an outage. A recovery plan that restores stale availability can create unsafe double loans."
        ]
      },
      {
        "heading": "Differentiate backup, copied corruption and verified restore",
        "paragraphs": [
          "A backup file exists; a verified restore creates a new store, replays data and checks business invariants. If a backup was captured AFTER corruption, recovery can faithfully reproduce invalid state. Use point-in-time or independent immutable copies only when required and demonstrably configured.",
          "An in-memory SQLite fixture can show a pre-fault backup restored to a new datastore with the expected loan count, while a late snapshot does not. That is a teaching illustration, not a verified PostgreSQL/cloud backup policy, encryption standard or production restore drill."
        ]
      },
      {
        "heading": "Defend the operator and continuity boundaries",
        "paragraphs": [
          "Document credential/key custody, protected storage, rotation, retention, access revocation, data minimization and recovery ownership. Test a missing key or denied backup-storage read and ensure the operator gets a clear failure without bypassing policy.",
          "At the actual capstone boundary, use an authorized disposable instance, time the full rehearsal, inspect the restored user path and mark RPO/RTO NOT_PROVEN if the measured drill does not support those objectives."
        ]
      }
    ],
    "practice": [
      "Restore a pre-fault backup into a fresh disposable data store and test critical invariants.",
      "Simulate a corrupt/latest backup and show why a file's existence does not prove recovery."
    ],
    "acceptance": [
      "Restore outcome and time are measured, not inferred from backup configuration.",
      "RPO and RTO are not represented as achieved without actual matching evidence."
    ],
    "resource": {
      "title": "NIST SP 800-34 contingency planning",
      "url": "https://csrc.nist.gov/pubs/sp/800/34/r1/upd1/final",
      "purpose": "Use the relevant mechanism as a reference; not proof of real implementation.",
      "kind": "reference"
    }
  },
  "runbooks": {
    "title": "A runbook is a safe diagnostic and recovery contract for another operator",
    "sections": [
      {
        "heading": "Write prerequisites, observations and explicit stop conditions",
        "paragraphs": [
          "A runbook must identify trigger, blast radius, access permissions, verified starting state, read-only diagnostic commands, expected result, escalation and recovery/rollback. The command `DELETE FROM loans WHERE ...` is not a diagnostic, and production mutation must never be guessed from a screenshot.",
          "For the fictional lending system, a ‘duplicate active loan’ alert should start with item ID, correlation IDs, two competing request identities and read-only queries scoped to the affected organization. Identify when to stop issuance and the person empowered to make that decision."
        ]
      },
      {
        "heading": "Rehearse an unfamiliar operator's path",
        "paragraphs": [
          "One engineer who wrote the runbook can perform steps from memory while missing critical prerequisites in the document. Have another engineer start in a disposable environment with ordinary operator access, not the author's privileged shell history.",
          "Give the reviewer a deliberately missing credential and a conflicting loan record. They should reach a safe STOP/ESCALATE outcome, not run an undocumented repair. Capture unknown commands and revise the runbook in the same change set."
        ]
      },
      {
        "heading": "Distinguish observation from intervention",
        "paragraphs": [
          "After a permitted fix, verify restored behavior, expected row counts, user-visible outcome and absence of lingering side effects. A green health endpoint alone is insufficient if loan custody state is contradictory.",
          "Include owner, versioned runbook reference, last exercised date, result, and an expiry or rerun trigger. If nobody independent rehearsed it, label it SELF_TESTED / NOT INDEPENDENTLY VALIDATED."
        ]
      }
    ],
    "practice": [
      "Have a second operator execute read-only diagnostic steps in an isolated environment and capture ambiguity.",
      "Insert a missing secret or unknown item owner; verify the runbook stops safely and escalates."
    ],
    "acceptance": [
      "Operator actions include prerequisites, observables and explicit stop conditions.",
      "Unreviewed runbooks are not misclassified as independently rehearsed."
    ],
    "resource": {
      "title": "SRE on-call practice",
      "url": "https://sre.google/sre-book/being-on-call/",
      "purpose": "Use the relevant mechanism as a reference; not proof of real implementation.",
      "kind": "reference"
    }
  },
  "operational-ownership": {
    "title": "Ownership means accountable decisions at a stated time and failure severity",
    "sections": [
      {
        "heading": "Assign specific responsibilities, not an imaginary support team",
        "paragraphs": [
          "Service ownership includes alert response, incident coordination, stakeholder communication, privileged access, dependency updates, schema changes, backups, cost and capacity review. A capstone operated by one learner cannot pretend an around-the-clock team exists.",
          "Create a named role matrix for business owner, engineering operator, security/risk reviewer and release authority. Roles may overlap, but the risk of self-approval should be explicit. If there is no authorized production operator, the release cannot be called operationally ready."
        ]
      },
      {
        "heading": "Practice escalation and handover",
        "paragraphs": [
          "A duty roster without coverage or reachable contacts is decorative. During a simulated outage, record who notices first, who can halt checkout, who is allowed to query sensitive data, who approves a data correction and who tells users about impact.",
          "An alert routed to a private phone that is unavailable at night is not a reliable escalation plan. State actual coverage windows, supported response channels and what the service does when no operator is available."
        ]
      },
      {
        "heading": "Make routine maintenance visible",
        "paragraphs": [
          "Schedule credential rotation, dependency patching, certificate renewal, backup verification, cost review and access reauthorization, with owner and evidence. Normal operational burden must be priced, not assumed free.",
          "Challenge the plan with owner absence, expired secret or vendor outage. If the real team cannot respond within an intended objective, change the SLO/scope or fund coverage rather than writing an invented on-call rota."
        ]
      }
    ],
    "practice": [
      "Build an actual role, coverage and escalation table for the capstone environment.",
      "Simulate one failed paging channel or missing authorized operator and record the response."
    ],
    "acceptance": [
      "Every critical activity has a reachable owner or a stated release blocker.",
      "The plan does not invent 24-hour support or unavailable business authorities."
    ],
    "resource": {
      "title": "SRE operator ownership",
      "url": "https://sre.google/sre-book/being-on-call/",
      "purpose": "Use the relevant mechanism as a reference; not proof of real implementation.",
      "kind": "reference"
    }
  },
  "risk-and-control-evidence": {
    "title": "A documented control is not evidence it operated",
    "sections": [
      {
        "heading": "Separate risk, safeguard and evidence",
        "paragraphs": [
          "A risk is an uncertain event and consequence; a control is a preventive/detective/recovery measure; a test produces evidence about that control in a stated scope. The words ‘backups enabled’ are an implementation claim; a restored database plus verified invariants is stronger operating evidence.",
          "Use a trace table: risk of duplicate loan → transactional uniqueness and denial → two-client race experiment and persisted-state oracle → actual result PASS/FAIL/NOT_TESTED. Record test owner, source revision, environment and timestamp."
        ]
      },
      {
        "heading": "Preserve unknown and failed states",
        "paragraphs": [
          "Treat evidence as PASS, FAIL, or NOT_TESTED; a missing result is not implicitly green. A failed restore rehearsal cannot be waived by changing the test label. Management may accept scoped residual exposure only where it has documented authority and applicable obligations allow it.",
          "Classify a security defect separately from a speculative availability risk, and compare both using impact, likelihood, exposure duration and reversibility. A large spreadsheet of ‘closed’ checkboxes without links to current evidence may create false confidence."
        ]
      },
      {
        "heading": "Counterexample: false readiness aggregation",
        "paragraphs": [
          "A naive rule that approves release because at least one gate is PASS will accept a build with failed restore and untested security. Use a fail-closed aggregation that returns BLOCKED for any critical FAIL, NOT_PROVEN when required evidence is missing, and TECHNICALLY_SUPPORTED only when all required technical gates are PASS.",
          "This still does not grant business/legal release authority. Record exception ownership and conditional scope without rewriting the raw technical results. Ask an independent reviewer to remove one report and verify that the approval cannot remain TECHNICALLY_SUPPORTED."
        ]
      }
    ],
    "practice": [
      "Execute the published fail-closed evidence aggregator with one FAIL and one missing report.",
      "Trace one control to a real test result, affected risk and authorized decision."
    ],
    "acceptance": [
      "A failed or absent critical gate cannot yield TECHNICALLY_SUPPORTED.",
      "Control implementation and actual operating proof are shown separately."
    ],
    "resource": {
      "title": "NIST Cybersecurity Framework",
      "url": "https://www.nist.gov/cyberframework",
      "purpose": "Use the relevant mechanism as a reference; not proof of real implementation.",
      "kind": "reference"
    }
  },
  "dependency-and-supply-chain-readiness": {
    "title": "Package identity, supply-chain trust and legal permission are different questions",
    "sections": [
      {
        "heading": "Inventory what the release really contains",
        "paragraphs": [
          "A dependency register identifies each application package, build tool, base image, external API and internal shared library, the exact version/digest, source, supported status, owner and consumer path. A list of package names without why they are deployed cannot guide upgrades or incident response.",
          "An SBOM records component composition, not proof of no vulnerabilities or a right to redistribute. A SHA-256 digest establishes byte identity only; the producer's identity and trusted build provenance need separate evidence and review."
        ]
      },
      {
        "heading": "License decisions and vulnerabilities are independent gates",
        "paragraphs": [
          "Consider an imaginary reporting library with an unknown redistribution license and a current critical vulnerability. Fixing its vulnerability does not supply legal permission; obtaining a license does not patch a reachable exploit. Each has its own owner and clearance evidence.",
          "Use a policy triage table with distinct states: license VERIFIED/UNKNOWN/INCOMPATIBLE, vulnerability MITIGATED/OPEN/NOT_ASSESSED and provenance VERIFIED/UNKNOWN. Treat high-consequence unknowns as blockers or explicit specialist review, not a generic developer waiver."
        ]
      },
      {
        "heading": "Plan continuity before dependency failure",
        "paragraphs": [
          "For critical payment, messaging or authentication dependencies, specify outage effects, permitted degraded behavior, alternative support contacts, planned update cadence and an exit or replacement strategy. A same-name package is not necessarily API-compatible.",
          "Reused TSA components are only eligible when actually published, versioned, licensed and evidenced by real consumers. Do not treat the proposed tsa-test-core as available merely because its extraction lab exists."
        ]
      }
    ],
    "practice": [
      "Assess a package with verified digest but unknown license and explain why permission remains open.",
      "Trace one critical dependency to owner, supported version, trust/provenance, remediation and exit."
    ],
    "acceptance": [
      "License, security and byte identity are separate readiness decisions.",
      "No unearned internal TSA package is declared released or supported."
    ],
    "resource": {
      "title": "SLSA provenance model",
      "url": "https://slsa.dev/spec/v1.0/",
      "purpose": "Use the relevant mechanism as a reference; not proof of real implementation.",
      "kind": "reference"
    }
  },
  "cost-and-capacity-review": {
    "title": "Capacity and cost require quantities, units, and reversal thresholds",
    "sections": [
      {
        "heading": "Estimate what the implemented system consumes",
        "paragraphs": [
          "Include fixed infrastructure, per-request storage/traffic, backup retention, security tools, notifications, licenses and human operator hours. Give units, region, currency, pricing date and forecast ranges; a vendor price sheet alone does not describe the actual deployment.",
          "Illustrative only: USD 60 fixed monthly and USD 0.08 per fulfilled loan, with an illustrative USD 100 monthly operating envelope before labor. At 100 fulfilled loans cost is USD 68; at 600 it is USD 108 and exceeds the provisional envelope. These are teaching numbers, not current Mozambique vendor prices or an approved budget."
        ]
      },
      {
        "heading": "Sensitivity exposes hidden capacity bets",
        "paragraphs": [
          "Separate forecast volume from tested throughput. If the service sustained only 5 concurrent transactions during a small local test, a proposed 50-concurrent-client launch is unproven even when the cost calculator looks affordable.",
          "Model variation in fixed tier, unit cost, transaction mix and human support. A cost optimization that removes backup retention or monitoring may violate reliability goals. Show what decision becomes invalid as volume grows."
        ]
      },
      {
        "heading": "Choose the trigger for a reversible decision",
        "paragraphs": [
          "Set a measurable revisit rule, such as costs exceeding the financed limit or queue time exceeding an agreed threshold for repeated intervals. State who can approve scale-up and what workload/restore safety evidence must accompany it.",
          "Run a scenario with a doubled unit cost and an unexpected second operating region; if pricing or thresholds are unknown, report a range instead of inventing certainty."
        ]
      }
    ],
    "practice": [
      "Run the published fictional Decimal cost sensitivity then double unit cost.",
      "Compare current resource usage with the actual tested concurrency and a realistic forecast."
    ],
    "acceptance": [
      "Cost values use dates and units or are explicitly hypothetical.",
      "No production capacity promise is inferred from a tiny local sample."
    ],
    "resource": {
      "title": "Provider estimation example, not a price source",
      "url": "https://calculator.aws/",
      "purpose": "Use the relevant mechanism as a reference; not proof of real implementation.",
      "kind": "reference"
    }
  },
  "release-decision": {
    "title": "Release readiness is a scoped judgment, not a universal green badge",
    "sections": [
      {
        "heading": "Separate technical recommendation, decision authority and actual launch",
        "paragraphs": [
          "The technical report summarizes evidence and residual exposure; authorized business/risk governance decides within its powers; a deployment performs the change. These are separate events. ‘CI passed’ does not mean release approved, nor does an engineer's own checklist authorize real users and data.",
          "Use four precise outcomes: RELEASE (all required gates with authorized sign-off), CONDITIONAL (only within bounded and explicitly approved residual risk), DEFER (material missing/failed evidence), or REDESIGN (architecture fundamentally cannot satisfy critical need). A decision can be valid even when it blocks delivery."
        ]
      },
      {
        "heading": "Challenge a misleading success case",
        "paragraphs": [
          "Suppose the original capstone passes builds and automated unit tests but the restore drill failed, the security owner is unknown and the primary runbook was never rehearsed. The proper technical outcome is BLOCKED/NOT_PROVEN. Calling the overall release READY would falsify evidence and conceal who must remedy it.",
          "A human authority may formally accept certain limited residual risk, but no approval can transform a failed test into a pass, override mandatory legal constraints, or manufacture an absent independent assessor."
        ]
      },
      {
        "heading": "Produce a falsifiable decision record",
        "paragraphs": [
          "Record version/digest, stakeholder scope, release window, individual gate results with artifacts and dates, blockers, accepted exceptions and who explicitly approved them. Give one next measurement and a trigger to stop or roll back. A reviewer must be able to reproduce the decision without asking what the author meant.",
          "Transfer challenge: remove a critical signed authorization test or change the restore result to FAIL. The recommendation must change predictably. If your rule still prints RELEASE, the decision logic is unsafe."
        ]
      }
    ],
    "practice": [
      "Run the exact decision program with a PASS set, one FAIL, one missing result, and a forbidden legal constraint.",
      "Document one release/conditional/defer/redesign argument with real authority and evidence."
    ],
    "acceptance": [
      "A blocker or unknown critical obligation can stop the technical release recommendation.",
      "Human sign-off is not forged by a script result."
    ],
    "resource": {
      "title": "ACM accountability and public interest",
      "url": "https://www.acm.org/code-of-ethics",
      "purpose": "Use the relevant mechanism as a reference; not proof of real implementation.",
      "kind": "reference"
    }
  },
  "accessibility-and-human-workflow-readiness": {
    "title": "Accessibility must be verified through real interactions, not a generic scan",
    "sections": [
      {
        "heading": "Define the user, task and barriers before selecting tools",
        "paragraphs": [
          "Accessibility concerns whether people with different perceptual, motor and cognitive capabilities can carry out a task. A WCAG checklist can guide implementation; it does not prove that an actual member can check out a tool with a keyboard or screen reader.",
          "For an invented lending UI, a desk worker must locate an item, identify a borrower, submit a loan and understand validation errors without relying on color or pointer precision. State which user constraints are observed in real discovery versus assumptions; do not claim to have performed user interviews."
        ]
      },
      {
        "heading": "Run a keyboard and assistive-technology path",
        "paragraphs": [
          "Test visible focus, consistent tab order, actionable form labels, useful error text, logical heading structure, and announcements for critical status changes. A test that checks alt text on images does not prove a keyboard user can recover from an invalid submission.",
          "Deliberately remove the submit button's accessible name or hide error text behind a color change and verify a real or scripted check fails. Record the actual browser, device, assistive technology and test limitations rather than treating one automation result as universal."
        ]
      },
      {
        "heading": "Give usability findings an owner and release impact",
        "paragraphs": [
          "Classify an inability to complete the core borrowing flow as potentially release-blocking, while low-impact refinements may be time-bounded. Determine severity from user impact and reachable workaround, not cosmetic preference.",
          "On the real capstone, exercise at least one primary user journey with keyboard and a screen reader when available. Separate automated DOM assertions, hands-on reviewer observations and untested devices or users; mark missing human evidence NOT VALIDATED."
        ]
      }
    ],
    "practice": [
      "Trace the actual keyboard-only critical workflow and verify focus/error feedback.",
      "Identify one automated and one human accessibility question; mark the latter unvalidated if not reviewed."
    ],
    "acceptance": [
      "A scan result never stands in for human completion of the task.",
      "Blocking accessibility failures receive scope, owner and evidence."
    ],
    "resource": {
      "title": "W3C WCAG 2.2 quick reference",
      "url": "https://www.w3.org/WAI/WCAG22/quickref/",
      "purpose": "Use the relevant mechanism as a reference; not proof of real implementation.",
      "kind": "reference"
    }
  }
};
