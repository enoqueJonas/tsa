// PED-005: topic-specific source teaching for all original non-functional
// readings. Real deployment, k6, WCAG/manual assessment and enterprise
// performance evidence remain separate from the illustrative cases here.
export type QualityNfCase = {heading:string;mechanism:string;failure:string;transfer:string};
export const qualityNfCases: Record<string,QualityNfCase> = {
  "performance-measurement-model": {
    "heading": "Interpret a synthetic window before choosing a gate",
    "mechanism": "One ten-second classroom fixture contains 100 completed responses: ten 200 successes at 100 ms and ninety 503 failures at 2 ms. Reporting the mean over all responses produces a reassuring 11.8 ms, while the successful completion rate is only one per second and the error rate is 90%. The source-published Python exercise asserts that a latency-only gate would be unsafe. The population, observation clock and denominator are part of the result.",
    "failure": "If there are no successful responses, p95 success latency is UNKNOWN, not zero. A different rank estimator can also move p95 for small populations. Record sampled quantity, request class, sample count, wall-clock and percentile method before drawing a capacity conclusion.",
    "transfer": "Given 20 seconds, 80 completed responses, 12 errors and missing latency samples, calculate total and successful response rates and error fraction. Explain which percentile claims cannot be made."
  },
  "k6-execution-model": {
    "heading": "Trace virtual users against a target arrival process",
    "mechanism": "In a closed model, five users each waiting for a request to complete may deliver about five iterations per second if each takes one second, but only about one per second if each stretches to five seconds. The workload itself slows as the server slows. A constant-arrival-rate scenario instead schedules iterations toward a configured target independent of individual response time, so enough VUs and generator capacity are necessary. Name planned arrival rate, achieved starts and dropped iterations separately.",
    "failure": "A target of five iterations/sec does not mean five were actually sent. If the generator runs out of VUs and drops iterations, a green response-time chart from only completed samples does not validate the target load. Per-VU session state and write-data collision also matter.",
    "transfer": "Choose a closed-user model for a known fixed pool of staff issuing successive actions and an open model for independent incoming client events. Explain the decision and the observable generator shortfall for each."
  },
  "k6-checks-thresholds": {
    "heading": "Checks inspect responses; thresholds enforce a performance decision",
    "mechanism": "A k6 check evaluates a predicate on an individual result, such as status 200 or a JSON field. A threshold defines a policy on aggregated metrics, such as http_req_failed rate below an accepted bound and duration percentile under a target. A script can print failed checks without producing a failing process decision unless appropriate threshold rules are configured and evaluated. Explain the distinction before choosing any CLI syntax.",
    "failure": "A service that returns 503 for 30% of requests can still have excellent p95 for the successful requests. If the only threshold is response time, the run may appear acceptable despite high error incidence. Record actual metric sample population and the threshold expression.",
    "transfer": "Draft a two-metric acceptance policy for a nonproduction lookup case. Introduce ten controlled failures in 100 attempts; predict which decision fails and what the process exit status should indicate."
  },
  "performance-environment-validity": {
    "heading": "Baseline comparison requires controlled variables",
    "mechanism": "A comparative performance result is meaningful only when workload, request mix, seed volume, indexes, runtime versions, network path, resource limits and observation window are comparable. If version A uses a warmed cache and version B a cold cache, their p95 difference cannot be attributed to code. Build a small experiment ledger with commit, DB schema, load generator identity, rates and warmup interval.",
    "failure": "A batch importer competes for database connections in one run but not the other; declaring a regression from p95 alone confuses environment interference with product behavior. Re-run under controlled preconditions and preserve the original observation as a legitimate signal of a possible contention risk.",
    "transfer": "Given two runs with matching commit but different PostgreSQL indexes and cache temperature, identify which variables invalidate a causal code comparison and which hypotheses remain testable."
  },
  "accessibility-automation": {
    "heading": "Distinguish machine-checkable issues from human interaction",
    "mechanism": "Automated accessibility scanners can detect certain missing labels, obvious contrast failures or element semantics, but cannot independently establish that a task makes sense, keyboard focus moves logically or an error message helps a learner recover. A real browser test should include semantic locators, keyboard-only navigation, visible focus and error discovery. Treat assistive-technology evaluation as a distinct evidence source.",
    "failure": "A form with a programmatic label can pass an automated rule while the validation message appears off-screen or focus never returns to the invalid input. A click-based happy path also misses keyboard traps in dialogs. Manual inspection with defined tasks is necessary.",
    "transfer": "Create two assertions for a transfer denial: one automation-detectable semantic name and one keyboard/focus outcome requiring browser exploration. State how each can fail and what evidence is retained."
  },
  "compatibility-matrix-engineering": {
    "heading": "Risk-based selection instead of Cartesian-product theatre",
    "mechanism": "Suppose browser family, viewport and input type have four, three and two options. Full coverage needs 24 combinations, but pairwise selection covers each relevant pair with fewer cases; it is a heuristic, not a proof of all three-way bugs. Begin with supported user populations, known high-risk combinations and production incidents. Force any critical triple into the matrix even if a pairwise optimizer omits it.",
    "failure": "A modal bug that occurs only on Safari + narrow viewport + keyboard input may evade pairwise coverage if no selected row contains all three together. Platform support agreements and accessibility needs outweigh maximizing arbitrary pair counts.",
    "transfer": "Design a five-case reduced matrix from two browsers, two viewports and keyboard/pointer inputs. Identify a critical triple that must appear, then state the residual uncovered combinations."
  },
  "controlled-failure-testing": {
    "heading": "Fault injection needs a bounded blast radius and recovery oracle",
    "mechanism": "A meaningful resilience experiment identifies the dependency, the injected failure mode, intended degraded response, timeout budget, expected user-facing result and recovery condition. In a disposable Steward lab, denying a dependent service for a short window can test whether the API returns a bounded error without corrupting already committed ownership data. Restore the dependency and inspect state after recovery.",
    "failure": "Killing a shared UAT database can harm colleagues and still fail to show whether the product respected invariants. A 503 alone cannot prove no partial mutation occurred. Define isolation, rollback, authorized scope and post-failure state checks before touching infrastructure.",
    "transfer": "Design one local-only failure of a downstream lookup with positive/negative/recovery observations, a firm stop condition and a clearly named authorization boundary."
  },
  "performance": {
    "heading": "Choose the behavior, not just a throughput target",
    "mechanism": "Performance testing connects a business journey to measurable latency, completion rate and resource consumption under a load model. A search endpoint may meet a 250 ms successful p95 at low traffic while a batch import exhausts its DB connection pool. A credible investigation compares the same request population across defined load steps, notes generator limits and correlates saturation only as a hypothesis.",
    "failure": "Fail-fast 503 responses can improve aggregate latency even as user success collapses; conversely a high average can be driven by warmup or a tiny slow tail. Keep errors and successful percentile distributions separate and avoid inferring production capacity from a laptop run.",
    "transfer": "Given two runs with identical p95 but different errors and CPU pressure, explain which evidence supports a release decision and which additional observation would resolve ambiguity."
  },
  "load-models": {
    "heading": "Load, stress, spike and endurance ask different questions",
    "mechanism": "A load experiment tests a proposed normal arrival volume; stress increases offered demand until service objectives fail or saturation emerges; spike tests abrupt changes and recovery; endurance looks for time-dependent leaks or degradation under sustained demand. These are experiment designs, not tool checkboxes. For each define initial state, time window, load curve, failure signal and recovery stop criterion.",
    "failure": "A three-minute smoke run cannot prove an overnight memory-leak absence, and a stress experiment that damages a shared stateful system is unacceptable. Declaring 'supports 100 users' without user behavior, arrival rate and think time is also ambiguous.",
    "transfer": "Choose a spike experiment for a morning login surge and a separate endurance experiment for a queue worker. Name what each could reveal that the other cannot."
  },
  "accessibility": {
    "heading": "Build a keyboard and error-recovery contract",
    "mechanism": "Accessible software exposes meaningful semantics, predictable focus and alternative input paths. A user should locate a field by its label, enter information without a pointer, submit it, understand any validation failure and recover. Screen reader, keyboard and zoom interactions have different observable boundaries; passing a single automated scan cannot substitute for task completion.",
    "failure": "A field can be visually labelled but have no accessible name; a dialog can display correctly but trap focus outside itself; a red-only error can exclude users who do not distinguish that color. These are functionally different failures and require precise test oracles.",
    "transfer": "For a hypothetical service edit form, write one keyboard-only completion path, one error message check and one assistive label check without presuming a real Steward web UI exists."
  },
  "compatibility": {
    "heading": "Test supported behavior instead of pixel equality",
    "mechanism": "Compatibility means a documented product contract remains usable on supported browsers, operating systems and environments. In a real browser product, test critical navigation, form feedback, storage and responsive behavior before comparing visual snapshots. A baseline screenshot is useful for visual regressions but cannot prove data persistence or authorization.",
    "failure": "A flexible layout may legitimately wrap differently on two browser engines while remaining functionally correct. A test that asserts identical pixels is brittle, but a menu hidden behind the viewport and unreachable by keyboard is a real failure.",
    "transfer": "Choose one supported browser/viewport matrix for a genuine owner console. Explain which cross-engine difference is acceptable and which blocks a critical action."
  },
  "reliability-oriented": {
    "heading": "Challenge degraded operation without claiming a production SLO",
    "mechanism": "Quality tests can challenge defined fallback, timeout and recovery behavior even before Reliability Engineer owns system-wide SLOs. A local failure experiment should preserve the state and request trace across normal, degraded and recovered periods. A queue-backed operation may accept a request before processing completes; therefore check the documented eventual outcome, not merely the initial status.",
    "failure": "A green health endpoint during a dependent service outage does not prove users can complete critical workflows. A test that retries forever can conceal stalled recovery, and a missing event should become a bounded failure rather than an implicit pass.",
    "transfer": "Design a bounded two-phase normal/recovery test for a dependency timeout and identify the evidence needed to distinguish application outage from delayed downstream work."
  },
  "integrity-concurrency": {
    "heading": "Make race conditions observable with independent connections",
    "mechanism": "Data integrity concerns invariants that must hold when operations overlap, not just when requests run one after another. For a unique service slug, two independently connected workers can simultaneously check absence before inserting; only a real database constraint/transaction model can reliably guard the invariant. Tests should schedule overlap, observe both responses and query durable final state.",
    "failure": "A sequential pair of inserts does not reproduce the absent-row race. A single mock repository may serialize operations and hide the defect entirely. Conversely, catching a database exception without checking final state can leave a partial write unnoticed.",
    "transfer": "Specify two concurrent attempted registrations of the same identifier, the expected outcomes, exception handling and proof that exactly one committed record remains. Document which isolation level and schema are under test."
  }
};
