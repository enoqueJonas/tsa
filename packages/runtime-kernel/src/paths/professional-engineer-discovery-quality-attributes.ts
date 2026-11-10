import type { LessonBlock } from "../activities/content";
// PED-005: ORIGINAL Quality Attributes, separately teach scenarios, evidence measurement and trade-off decisions.
// All data/thresholds are FICTIONAL and cannot certify real safety, reliability or SLA compliance.
export const qualityEvidencePython = "from dataclasses import dataclass, replace\nfrom math import ceil\n\n# All records, thresholds and permissions here are invented teaching inputs.\n@dataclass(frozen=True)\nclass Request:\n    duration_ms: int\n    complete: bool\n    outcome: str\n\n@dataclass(frozen=True)\nclass Access:\n    authorized: bool\n    exposed_record: bool\n    changed_record: bool\n\n@dataclass(frozen=True)\nclass Restore:\n    backup_minute: int\n    failure_minute: int\n    restored_minute: int | None\n    data_verified: bool\n\ndef p95_ms(records: list[Request]) -> int | None:\n    samples = sorted(r.duration_ms for r in records if r.complete and r.outcome == \"OK\")\n    if len(samples) < 20:\n        return None\n    return samples[ceil(len(samples) * 95 / 100) - 1]\n\ndef review_gate(records: list[Request], access: list[Access], restore: Restore) -> str:\n    if any(not r.complete for r in records):\n        return \"INCOMPLETE_OBSERVATION_WINDOW\"\n    if any(not a.authorized and (a.exposed_record or a.changed_record) for a in access):\n        return \"UNAUTHORIZED_DISCLOSURE_OR_MUTATION\"\n    if not restore.data_verified or restore.restored_minute is None:\n        return \"RESTORE_NOT_VERIFIED\"\n    rto = restore.restored_minute - restore.failure_minute\n    rpo = restore.failure_minute - restore.backup_minute\n    if rto > 45:\n        return \"RECOVERY_TIME_BREACH\"\n    if rpo > 15:\n        return \"RECOVERY_POINT_BREACH\"\n    latency = p95_ms(records)\n    if latency is None:\n        return \"UNMEASURED_SMALL_COHORT\"\n    if latency > 300:\n        return \"LATENCY_TAIL_BREACH\"\n    return \"REVIEWABLE_NOT_APPROVED\"\n\nbase = [Request(100, True, \"OK\") for _ in range(16)] + [\n    Request(v, True, \"OK\") for v in (180, 220, 250, 780)\n]\nsafe_access = [Access(True, False, False), Access(False, False, False)]\ngood_restore = Restore(12, 20, 50, True)\nexpected = \"REVIEWABLE_NOT_APPROVED\"\nassert p95_ms(base) == 250\nassert max(r.duration_ms for r in base) == 780\nassert p95_ms(base[:8]) is None\nassert review_gate(base, safe_access, good_restore) == expected\nassert review_gate(base + [Request(0, False, \"UNKNOWN\")], safe_access, good_restore) == \"INCOMPLETE_OBSERVATION_WINDOW\"\nassert review_gate(base, [Access(False, True, False)], good_restore) == \"UNAUTHORIZED_DISCLOSURE_OR_MUTATION\"\nassert review_gate(base, safe_access, replace(good_restore, data_verified=False)) == \"RESTORE_NOT_VERIFIED\"\nassert review_gate(base, safe_access, replace(good_restore, restored_minute=70)) == \"RECOVERY_TIME_BREACH\"\nassert review_gate(base, safe_access, replace(good_restore, backup_minute=0)) == \"RECOVERY_POINT_BREACH\"\nassert review_gate(base[:8], safe_access, good_restore) == \"UNMEASURED_SMALL_COHORT\"\nassert review_gate(base + [Request(800, True, \"OK\")], safe_access, good_restore) == \"LATENCY_TAIL_BREACH\"\nprint(\"LATENCY eligible=20 p95_ms=250 maximum_ms=780 threshold_ms=300\")\nprint(\"REJECTED incomplete, unauthorized, unverified_restore, rto, rpo, small_cohort, tail_breach\")\nprint(\"RECOVERY fictional_RTO_minutes=30 fictional_RPO_minutes=8\")\nprint(\"REVIEWABLE_NOT_APPROVED; NO_EMPIRICAL_SLO_OR_SECURITY_ASSURANCE\")\nprint(\"QUALITY_ATTRIBUTE_EVIDENCE_GATE_PASS\")\n";
export const qualityScenarioBlocks: LessonBlock[] = [
  {
    "type": "paragraph",
    "text": "A quality attribute describes a property of behavior that matters when a system is under specific conditions: how quickly it responds, how it fails, whom it protects, what it preserves, how it can be repaired, and how it behaves for people who cannot use the happy path. Unlike 'the service should be fast and secure', a useful quality scenario identifies a concerned stakeholder, trigger, environment, system response, measurable response criterion and the source/authority behind that criterion. The warranty-return case here is FICTIONAL; its illustrative targets are not user-approved SLAs, risk tolerances or measurements."
  },
  {
    "type": "heading",
    "id": "qa-definition",
    "level": 2,
    "text": "Understand quality attributes through observable consequences"
  },
  {
    "type": "paragraph",
    "text": "A functional requirement describes a capability: an authorized operator can check a case's verified status. A quality attribute specifies how the capability should work under particular stimuli: a status lookup should not reveal another customer's record; under an agreed test load it should return a fresh, authorized response within a defensible latency bound; after an outage, the status should not claim a completed return if its evidence was not recovered. Quality attributes constrain ALL viable implementations. They are not a shopping list of technologies or vendor features."
  },
  {
    "type": "paragraph",
    "text": "Distinguish availability (can users get useful service during an agreed observation window), reliability (does it perform correct outcomes over time and failure conditions), resilience (can it continue or degrade when dependencies fail), recoverability (can service and data be restored within tolerated loss), performance (what delay and throughput under specified load), security/privacy (which actions and exposures are permitted), usability/accessibility (can intended people complete the task) and maintainability/operability (can a real team safely diagnose and change it). These qualities overlap but their measurements are not interchangeable."
  },
  {
    "type": "heading",
    "id": "qa-scenario-model",
    "level": 2,
    "text": "Write one scenario with a trigger, environment and measurable response"
  },
  {
    "type": "paragraph",
    "text": "Use this template: ID and affected actor; protected asset or affected workflow; stimulus (event); environment (normal peak, partial supplier outage, compromised session, restore); system response; response-measure including eligible population and observation window; owner/source/permission and current status; planned test or observation; unacceptable side effect. Example QA-01: GIVEN an unauthorized operator attempts to open a different customer's warranty case during normal operation, WHEN they issue a status or document request, THEN no record fields are returned and no authoritative record is changed; test the denial and persisted state. This says much more than 'secure'."
  },
  {
    "type": "paragraph",
    "text": "Example QA-02, still provisional: for a permitted case-status lookup under a specified but YET-UNVALIDATED concurrent workload, a hypothetical p95 under 300 ms might be explored in a synthetic benchmark. Which path? Application boundary versus full browser journey? Which device/network? How many requests, warm-up, case volume and operation types? Who benefits and who signs off on 300? These fields make it a scenario; 300 ms remains a teaching placeholder, not a defensible service objective until actual evidence and capacity tests exist."
  },
  {
    "type": "heading",
    "id": "qa-sources",
    "level": 2,
    "text": "Derive quality priorities from harm, not architecture fashion"
  },
  {
    "type": "paragraph",
    "text": "Trace every quality scenario backward to the bounded problem, stakeholder consequence, verified source or explicit absence of evidence, and decision owner. If a customer may lose a warranty claim after a corrupted recovery, data integrity and correct communication may dominate dashboard speed. If users are denied access because they lack a smartphone or need assistive technology, a visually polished interface may still fail the service. Stakeholders who do not actively use the system can bear its largest privacy and accessibility consequences. Failure impact is not identical to the sponsor's preferred metric."
  },
  {
    "type": "paragraph",
    "text": "A draft quality register should contain unique ID, workflow and stakeholder, attribute category, stimulus/environment, response, metric and threshold status, source and authority, test fixture/procedure, consequence if missed, relevant constraint, trade-off, re-evaluation trigger and current state. Mark SOURCE_UNVERIFIED, THRESHOLD_PENDING or NOT_TESTED when necessary. Never use a passing synthetic classroom example as the source for a real privacy requirement, service-level promise, an incident budget or a contract."
  },
  {
    "type": "heading",
    "id": "qa-anti-patterns",
    "level": 2,
    "text": "Avoid five recurring mistakes in quality specifications"
  },
  {
    "type": "paragraph",
    "text": "First, adjectives replace behavior: 'highly secure' has no forbidden action or oracle. Second, a global number is claimed without a boundary: '99.99% uptime' ignores planned exclusions, partial functionality and unknown user demand. Third, happy-path averages hide tail latency and denied users. Fourth, restore capability is asserted without proving recovered data consistency; a database starting is not the same as a customer's record being correct. Fifth, a new stack is treated as a quality attribute: 'must run on Kubernetes' is at most a separately justified design constraint, not proof of availability, scaling or recoverability."
  },
  {
    "type": "paragraph",
    "text": "Before selecting a database, cloud or caching system, write three independent quality scenarios: one unauthorized access, one degraded dependency and one safe recovery. For each, identify what would count as a violation and who can approve the acceptable consequence. If you lack real workloads, permission or failure evidence, say NOT_TESTED. The next reading will turn carefully defined conditions into executable proof without claiming that a toy passing fixture proves deployed performance."
  },
  {
    "type": "resources",
    "title": "Authoritative service-quality guidance",
    "resources": [
      {
        "title": "Google SRE — Service Level Objectives",
        "url": "https://sre.google/sre-book/service-level-objectives/"
      },
      {
        "title": "OWASP ASVS — Application Security Verification Standard",
        "url": "https://owasp.org/www-project-application-security-verification-standard/"
      }
    ]
  }
];
export const qualityMeasurementBlocks: LessonBlock[] = [
  {
    "type": "paragraph",
    "text": "Good quality requirements are measurable, but a number without a denominator or verification context is worse than an explicit unknown. This focused reading uses synthetic latency records, permission attempts and restore timestamps to show why a green average, a health-check endpoint or an untested backup cannot certify user outcomes. The runnable Python 3 program is the exact code shown to the learner; it requires no package installs, credentials or production access."
  },
  {
    "type": "heading",
    "id": "qa-latency-percentiles",
    "level": 2,
    "text": "Measure the correct population, percentile and end-to-end boundary"
  },
  {
    "type": "paragraph",
    "text": "Latency is elapsed time for an operation as observed at a stated boundary. An average can hide serious delays for the tail of users, so a percentile often helps describe a distribution: nearest-rank p95 of N completed eligible requests is the value at sorted rank ceil(0.95 × N). In the classroom cohort of 20 fully observed successful case lookups, 16 take 100 ms and four take 180, 220, 250 and 780 ms. Thus the nearest-rank p95 is 250 ms, while the maximum is 780 ms; both facts matter. A hypothetical 300 ms p95 threshold can pass while a single user still suffers 780 ms."
  },
  {
    "type": "paragraph",
    "text": "Choosing the metric does not justify its target. The count N=20 is too small for a defensible operational SLO and is deliberately a coding fixture. Define whether errors, denied calls and timeouts are included in an availability/error-rate measure rather than quietly excluding them from the user-impact denominator. A success-only latency distribution is conditional on success; it cannot establish that all attempts completed. A partial/unknown measurement window must remain INCOMPLETE_OBSERVATION_WINDOW and must not be normalized into a false green score."
  },
  {
    "type": "heading",
    "id": "qa-recovery-window",
    "level": 2,
    "text": "Separate restoration time from possible data loss"
  },
  {
    "type": "paragraph",
    "text": "Recovery Time Objective (RTO) describes an agreed tolerated duration to restore a useful service after an incident. Recovery Point Objective (RPO) describes the maximum tolerated age of data the restored state may lack. In a *fictional* minute timeline, last verified backup=12, failure=20, verified restore=50. Observed RTO=30 minutes; potential RPO exposure=8 minutes. A hypothetical RTO ≤45 and RPO ≤15 is satisfied in this sample, but does NOT show actual restore testing, point-in-time correctness, integrity of a customer's record or approval of those tolerances."
  },
  {
    "type": "paragraph",
    "text": "A backup file existing is not a restore test. Require a reproducible authorized drill, verified restored state, complete events, review of corruption and retention rules, and evidence that the organization can actually perform the procedure. Fail a missing or unverified restore explicitly. A shortened RTO obtained by serving stale or improperly authorized records can make the recovery less safe than waiting. An RTO or RPO target comes from actual business impact and data-loss tolerance, not a default generated by this course."
  },
  {
    "type": "heading",
    "id": "qa-negative-access",
    "level": 2,
    "text": "Quality failures can be forbidden side effects, not slow responses"
  },
  {
    "type": "paragraph",
    "text": "Security and confidentiality cannot be established by finding an HTTP 403. The real verification would examine response data, caching, logs, changes to the authoritative record and role/ownership assignments. Our toy Access events represent authorized versus unauthorized callers, whether any protected field was exposed, and whether a record changed. An unauthorized request that either discloses a record or mutates state is rejected; it is not offset by low latency. This is a noncompensatory example to illustrate a quality gate, not proof that a production authentication or authorization subsystem works."
  },
  {
    "type": "paragraph",
    "text": "The toy program handles a deliberately incomplete request and a disallowed record exposure, but it does not test cache poisoning, concurrency, session expiration, encryption, operational audit access or real policy. For each actual application, choose system-appropriate independent negative checks, minimal safe test data, and an owner who can confirm the permission rule. State what cannot be learned from a single synthetic unit test instead of describing it as a penetration test."
  },
  {
    "type": "heading",
    "id": "qa-source-exact",
    "level": 2,
    "text": "Run the complete source and inspect every refusal"
  },
  {
    "type": "paragraph",
    "text": "Save the entire displayed source as quality_evidence.py and run `python3 quality_evidence.py`. The program uses immutable dataclasses for synthetic Request, Access and Restore evidence. It checks exact p95=250 and max=780, rejects a cohort containing an incomplete request, forbidden disclosure/mutation, absent restore proof, RTO/RPO breaches, a too-small latency sample and an actual tail breach in the 21-case variant. Its strongest normal result is REVIEWABLE_NOT_APPROVED. Expected final marker: QUALITY_ATTRIBUTE_EVIDENCE_GATE_PASS."
  },
  {
    "type": "code",
    "language": "python",
    "caption": "Exact Python 3: conditional p95, incomplete observation, forbidden data access, verified recovery and synthetic thresholds",
    "code": "from dataclasses import dataclass, replace\nfrom math import ceil\n\n# All records, thresholds and permissions here are invented teaching inputs.\n@dataclass(frozen=True)\nclass Request:\n    duration_ms: int\n    complete: bool\n    outcome: str\n\n@dataclass(frozen=True)\nclass Access:\n    authorized: bool\n    exposed_record: bool\n    changed_record: bool\n\n@dataclass(frozen=True)\nclass Restore:\n    backup_minute: int\n    failure_minute: int\n    restored_minute: int | None\n    data_verified: bool\n\ndef p95_ms(records: list[Request]) -> int | None:\n    samples = sorted(r.duration_ms for r in records if r.complete and r.outcome == \"OK\")\n    if len(samples) < 20:\n        return None\n    return samples[ceil(len(samples) * 95 / 100) - 1]\n\ndef review_gate(records: list[Request], access: list[Access], restore: Restore) -> str:\n    if any(not r.complete for r in records):\n        return \"INCOMPLETE_OBSERVATION_WINDOW\"\n    if any(not a.authorized and (a.exposed_record or a.changed_record) for a in access):\n        return \"UNAUTHORIZED_DISCLOSURE_OR_MUTATION\"\n    if not restore.data_verified or restore.restored_minute is None:\n        return \"RESTORE_NOT_VERIFIED\"\n    rto = restore.restored_minute - restore.failure_minute\n    rpo = restore.failure_minute - restore.backup_minute\n    if rto > 45:\n        return \"RECOVERY_TIME_BREACH\"\n    if rpo > 15:\n        return \"RECOVERY_POINT_BREACH\"\n    latency = p95_ms(records)\n    if latency is None:\n        return \"UNMEASURED_SMALL_COHORT\"\n    if latency > 300:\n        return \"LATENCY_TAIL_BREACH\"\n    return \"REVIEWABLE_NOT_APPROVED\"\n\nbase = [Request(100, True, \"OK\") for _ in range(16)] + [\n    Request(v, True, \"OK\") for v in (180, 220, 250, 780)\n]\nsafe_access = [Access(True, False, False), Access(False, False, False)]\ngood_restore = Restore(12, 20, 50, True)\nexpected = \"REVIEWABLE_NOT_APPROVED\"\nassert p95_ms(base) == 250\nassert max(r.duration_ms for r in base) == 780\nassert p95_ms(base[:8]) is None\nassert review_gate(base, safe_access, good_restore) == expected\nassert review_gate(base + [Request(0, False, \"UNKNOWN\")], safe_access, good_restore) == \"INCOMPLETE_OBSERVATION_WINDOW\"\nassert review_gate(base, [Access(False, True, False)], good_restore) == \"UNAUTHORIZED_DISCLOSURE_OR_MUTATION\"\nassert review_gate(base, safe_access, replace(good_restore, data_verified=False)) == \"RESTORE_NOT_VERIFIED\"\nassert review_gate(base, safe_access, replace(good_restore, restored_minute=70)) == \"RECOVERY_TIME_BREACH\"\nassert review_gate(base, safe_access, replace(good_restore, backup_minute=0)) == \"RECOVERY_POINT_BREACH\"\nassert review_gate(base[:8], safe_access, good_restore) == \"UNMEASURED_SMALL_COHORT\"\nassert review_gate(base + [Request(800, True, \"OK\")], safe_access, good_restore) == \"LATENCY_TAIL_BREACH\"\nprint(\"LATENCY eligible=20 p95_ms=250 maximum_ms=780 threshold_ms=300\")\nprint(\"REJECTED incomplete, unauthorized, unverified_restore, rto, rpo, small_cohort, tail_breach\")\nprint(\"RECOVERY fictional_RTO_minutes=30 fictional_RPO_minutes=8\")\nprint(\"REVIEWABLE_NOT_APPROVED; NO_EMPIRICAL_SLO_OR_SECURITY_ASSURANCE\")\nprint(\"QUALITY_ATTRIBUTE_EVIDENCE_GATE_PASS\")\n"
  },
  {
    "type": "paragraph",
    "text": "Run negative variations in throwaway copies while leaving all expected assertions unchanged. Replace the p95 rank with a median and observe the baseline value fail; treat eight samples as adequate and expose a false metric; ignore the incomplete window; allow data disclosure; accept an unverified restore; bypass RTO, RPO and tail-latency limits. Each wrong change must be caught by an AssertionError in the intact expected-result suite. Explain why the erroneous version would be dangerously reassuring. A passed fixture is teaching evidence only, not a production certification or true availability SLO."
  },
  {
    "type": "resources",
    "title": "Measurement references",
    "resources": [
      {
        "title": "Google SRE Workbook — Implementing SLOs",
        "url": "https://sre.google/workbook/implementing-slos/"
      },
      {
        "title": "GOV.UK Service Manual — Testing your service",
        "url": "https://www.gov.uk/service-manual/technology/testing-your-service"
      }
    ]
  }
];
export const qualityTradeoffBlocks: LessonBlock[] = [
  {
    "type": "paragraph",
    "text": "A quality attribute is not a free property of a technology. Improvements in one dimension can worsen another, and sometimes the claimed conflict is a false dichotomy. A professional engineer documents the stakeholder harm, quantifies the operating envelope, separates hard safety boundaries from negotiable budgets and tests the alternative before choosing architecture. This reading examines the trade-offs and the actual decision record that the capstone must produce."
  },
  {
    "type": "heading",
    "id": "qa-availability-reliability",
    "level": 2,
    "text": "Keep availability, correctness and useful service distinct"
  },
  {
    "type": "paragraph",
    "text": "A server answering HTTP 200 is not the same as a useful warranty service. If the handler returns CLOSED while the recovery process lost its verified outcome event, the endpoint is reachable but the service is incorrect. An availability indicator needs an eligible time or request population, a useful successful response definition, known exclusions, observation window and treatment for unknown measurements. A reliability indicator may focus on the correct completion of authorized state transitions, including side effects and retry/duplicate behavior. Combining these into 'uptime' without definitions can conceal harm."
  },
  {
    "type": "paragraph",
    "text": "Illustrative arithmetic: if 970 of 1,000 eligible recorded actions completed correctly, the observed success ratio is 97% for THAT known cohort, not necessarily a time-based availability figure, a contractual service level or an independent sample. If 100 additional actions lack complete outcome evidence, they cannot be silently omitted from a claim about all 1,100 attempts. The acceptance question is not only how the ratio was calculated but whether the denominator represents actual users and failure modes. An error budget presupposes an approved objective, not a convenient target chosen after seeing data."
  },
  {
    "type": "heading",
    "id": "qa-consistency-privacy",
    "level": 2,
    "text": "Trade-off claims require a concrete failure and boundary"
  },
  {
    "type": "paragraph",
    "text": "Availability-versus-consistency decisions need a named invariant and failure condition. During a supplier outage, showing the last verified handoff state with a CLEAR STALE indication may maintain limited useful access; displaying an unverified APPROVED status as if final can violate the customer's rights. A system might reject a new transition until the authoritative record is available while still serving read-only information. Do not claim that every architecture must simply choose one side of 'CAP'; identify network conditions, allowed degradation, authoritative source and what cannot be compromised."
  },
  {
    "type": "paragraph",
    "text": "Auditability can also conflict with privacy. Storing every request payload may ease forensic analysis but expose identifiers, credentials or medical/financial details. A safer audit event may record time, pseudonymous case token, actor role, decision type and controlled access to evidence without duplicating raw personal data. But pseudonymization does not guarantee anonymity or authorize data collection. Define permitted fields, retention, access, incident use and deletion before selecting a logging platform. The quality question is whether an authorized reviewer can reconstruct the decision WITHOUT unnecessary sensitive-data exposure."
  },
  {
    "type": "heading",
    "id": "qa-capacity-maintainability",
    "level": 2,
    "text": "Performance has a cost and operations has a human owner"
  },
  {
    "type": "paragraph",
    "text": "Lower tail latency can require caching, replicas, tighter data indexes, resource headroom or fewer external calls. Each introduces other obligations: staleness, invalidation, privacy boundaries, migration cost, operational visibility and recovery burden. A service capable of meeting an isolated 300-ms synthetic result at 20 requests may collapse under the actual workload or require more monthly maintenance than the team can provide. Scalability must specify the load shape and bottleneck, not merely 'support millions of users'."
  },
  {
    "type": "paragraph",
    "text": "Maintainability needs observable outcomes too: a permitted maintainer can identify a failed supplier integration, locate sanitized logs, deploy a tested fix and restore service within a justified operating window. A 'simple' microservice arrangement can increase incident ownership complexity; a monolith can be maintainable if its modules, tests, deployment and recovery are clear. Measure on a bounded realistic change or incident rehearsal rather than assuming any framework intrinsically has excellent maintainability."
  },
  {
    "type": "heading",
    "id": "qa-prioritize-decisions",
    "level": 2,
    "text": "Use a scenario matrix and acknowledge incompatible targets"
  },
  {
    "type": "paragraph",
    "text": "Draft a trade-off matrix with rows for unauthorized exposure, correct closure, p95 user latency, loss of recorded outcomes, recovery, accessibility and operator workload. Columns should include stakeholders/affected nonusers, failure consequence, environment, measurement evidence and maturity, hypothetical target/actual approval status, proposed mitigation, added costs and conflicts. Classify irreversible safety and lawful-data boundaries as hard gates, not scores. If targets are simultaneously infeasible under the verified budget and staffing capacity, present DEFER, REDUCE_SCOPE or NEGOTIATE rather than a fictitious green architecture."
  },
  {
    "type": "paragraph",
    "text": "Example decision: caching status locally may reduce p95 lookup latency but creates a risk of showing out-of-date approval. A defensible decision might cache only non-authoritative read-only stage details for 60 seconds WITH a visible freshness marker and invalidate on permitted transition. But 60 seconds is itself a synthetic proposal: the owner must decide if that staleness is tolerable and the team must test invalidation and restart behavior. A decision record should name opposing evidence, discarded alternatives, approval authority, consequences and the precise event that would cause reversal."
  },
  {
    "type": "heading",
    "id": "qa-transfer",
    "level": 2,
    "text": "Independent quality exercise in a genuinely different domain"
  },
  {
    "type": "paragraph",
    "text": "Select a new capstone domain and write at least six quality scenarios: authorization/privacy, a user-facing p95/throughput scenario, a degraded dependency case, restore/data-loss tolerance, accessible task completion and one maintenance/operability case. Each must name stimulus, environment, response, measure/eligible denominator, source/owner, permission and not-yet-verified threshold where necessary. Explicitly include one refused action, one unknown result and an abnormal state. No quality claim may use a real organization without authorized evidence."
  },
  {
    "type": "paragraph",
    "text": "Take one performance improvement and show at least two adverse effects (stale data, new data copies, operational burden or budget) and how you would falsify each. Then inject a change: the privacy owner prohibits a log field or the support team loses half its capacity. Show affected quality scenario IDs, acceptance tests, architecture alternatives and status in a traceability/decision register. A passing fictional benchmark is not release approval; a sensible outcome can be to postpone a design until a real owner validates consequences."
  },
  {
    "type": "resources",
    "title": "Quality trade-off and operational references",
    "resources": [
      {
        "title": "Google SRE — Service Level Objectives",
        "url": "https://sre.google/sre-book/service-level-objectives/"
      },
      {
        "title": "OWASP ASVS — Application Security Verification Standard",
        "url": "https://owasp.org/www-project-application-security-verification-standard/"
      }
    ]
  }
];
