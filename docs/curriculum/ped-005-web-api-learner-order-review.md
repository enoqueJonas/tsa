# PED-005: Web/API learner-order review and prerequisite bridge

Date: 2026-11-01. Baseline: `345ebd875202ed5f3297ee857c4b3ffd1713a413`.
Issues: #318, #319, #320; acceptance ledger: #315.

This is a partial remediation pass, not school acceptance. RICH describes source
sufficiency in this review; it does not mean VALIDATED. No independent novice
teach-back was performed. The user's earlier successful build did not establish
that tests had run. The tests and build reported below were executed in this pass.

## Actual ownership and prerequisites

`engineering-foundations.ts` now composes nine conceptual lessons from
`engineering-apprentice-rich.ts`, then four lessons from
`engineering-apprentice-workbench-deep.ts`, then the rich investigation capstone.
The older deep-audit document incorrectly placed the capstone before the workbench.
`engineering-apprentice-lessons.ts` is not the active teaching composition.

| Capability needed by Web/API | Actual preceding source | Evidence and limits |
| --- | --- | --- |
| Paths, quoting, streams and exit status | Apprentice workbench: Terminal, Shell and Filesystem | Source bridge present; full novice/runtime pass still outstanding. |
| Foreground server, process versus listener, stopping one's own process | Apprentice workbench: Developer Inspection | Source reviewed for this dependency. Confirmed and fixed a published stream example that printed literal backslash-n instead of the promised line breaks; regression executes that exact snippet in a disposable directory. |
| curl request/status/header/body, HTTP versus connection failure | Apprentice workbench: HTTP from the Command Line | Source provides guided practice, check and separate lab. Full Apprentice lab execution remains UNVERIFIED. |
| Variables, conditionals, functions, dictionaries, classes and imports | Builder: Programming with Python, before Web/API via builder.ts | Named lessons exist in builder-python-rich.ts, with practical overrides in builder-python-quality.ts. Existing Python teaching-example regression passed. This is not a new full Python novice-depth acceptance. |
| HTTP handler and two-process exchange | Web/API Client–Server Boundaries; HTTP Requests and Responses | Existing mini-Steward sample regression passed: 200 JSON, 404, ignored Accept preference, stopped-server refusal. |
| JSON, PostgreSQL, Django and authentication implementation | Later lessons/modules | New method lab deliberately uses plain text and volatile Python state. Proposed authentication/status/ETag contracts are explicitly illustrative. No database or framework is implied to exist. |

The first eight Apprentice conceptual lessons and the investigation capstone are
inventoried below but remain UNVERIFIED for the new novice-depth gate. Do not infer
their classification from the earlier structural audit. Completing that full read,
all workbench examples/labs, rendered review and novice transfer remains #319 work.

## Web/API findings in displayed order

Teaching source for every reading below is `builder-web-api-deep.ts`; practical
overrides are in `builder-web-api-quality.ts`. `builder.ts` registers the quality
array directly. Each ordinary lesson has concepts → practice → check; the final
lab has brief → investigation → module review.

| Order / lesson | Source classification | Finding / next gate |
| --- | --- | --- |
| 1. How the Web Works | REMEDIATED source; learner verification pending | Rebuilt from first principles with explicit web/internet/client distinctions, stepwise DNS–transport–TLS–HTTP trace, an HTTP/3 limitation, and offline local 200/404/refused-connection experiment. Public HTTPS inspection is optional and never recorded as performed without evidence. |
| 2. URLs and Query Encoding | REMEDIATED new lesson; learner verification pending | Split out URL anatomy, origins, path/query/fragment, percent/form encoding, repeated keys and security limits. The exact `url_parser.py` code was executed independently with the expected output; regression is committed but latest suite/build and rendered UX remain unverified. |
| 3. Client–Server Architecture | RICH calibration source; learner acceptance pending | Defines roles, authority and alternatives rather than starting with consequences. Existing rewrite retained. No new independent teach-back. |
| 4. Client–Server Boundaries and Failure Modes | RICH calibration source; learner acceptance pending | Complete local synthetic server and separate client, serialization and uncertain-outcome reasoning; sample executed by existing regression. |
| 5. HTTP Requests and Responses | RICH source; learner acceptance pending | Previous rewrite teaches message anatomy, actual Python server behavior, bodyless results and Accept limits. Existing server regression covers only part of the promised curl exploration. |
| 6. Methods, Headers and Status Codes | THIN → REMEDIATED source | Replaced compressed survey with intent/contract definitions, replacement versus patch reasoning, status/client-action decisions, complete plain-text method server, eight requests and explained failure diagnosis. Existing lesson/activity IDs retained. |
| 7. Retries, Idempotency and Conditional Requests | New REMEDIATED source | Split from overloaded methods survey, registered before JSON through the actual lesson array and supplied a specific practical override. Teaches effect versus response, duplicate intent, stale-write prevention, cache validators and bounded retries. Executable sequential model; real HTTP conditional/deduplication implementation explicitly absent. |
| 8. JSON and Content Types | RICH source; learner acceptance pending | Previous rewrite separates syntax, shape, domain and missing/null/zero. Both source-extracted Python examples passed. Not rewritten in this pass. |
| 9. REST Principles and Trade-offs | REMEDIATED source; learner verification pending | REST constraints, two ownership-transfer alternatives, offset/cursor pagination failure trace and independently executable model added; see REST continuation below. |
| 10. Modeling Resources and API Contracts | REMEDIATED source; learner verification pending | Derives a public contract from actual Builder core, shows create/read failures and consumer-compatibility break; see contract modeling continuation. |
| 11. Errors and Status Design | REMEDIATED source; learner verification pending | Seven-case exception-to-client error model, stable public codes and correlated diagnostics added; see error-design continuation. |
| 12. Lab: Explore APIs with curl and Postman | REMEDIATED source; learner verification pending | Complete loopback-only lab server and fourteen curl experiments added and executed in prior commit; Postman and learner acceptance remain unverified. |

## Executed evidence

- Installed locked dependencies with `pnpm install --frozen-lockfile`.
- `pnpm test`: **12 tests passed, 0 failed**, including runtime TypeScript,
  curriculum wiring, resolved practical contracts, JSON, Python, Java and
  client/server regressions. Local socket permissions were needed; the initial
  restricted attempt could not bind loopback.
- `scripts/check-method-retry-teaching-examples.mjs` extracts the actual published
  samples. It observes the method sequence 200/201/200/415/400/405/204/404,
  Location and Allow, no content or Content-Length for 204, unsupported PATCH 501,
  missing path 404, and two distinct identities from repeated POST. Tests substitute
  only an available loopback port; HTTP requests use fetch, not the printed curl
  commands. Manual execution of every curl command remains a separate learner task.
- Retry model output: Ledger assignment; revision 3 after two increments; same-key
  identities 1/1 with count 1; changed-payload rejection; new key identity 2/count 2;
  editor A changes, editor B receives modeled 412; final name Owner A. These are
  sequential Python decision rules, not real HTTP statuses or concurrency proof.
- Apprentice stream sample: exit=7, stdout lines=1, stderr lines=1 on separate lines;
  the two files contain the expected newline-terminated text. Whitespace from wc is
  normalized for macOS/Linux output consistency.
- `pnpm build`: **2 tasks successful**. Initial attempt failed fetching Google
  Fonts; rerun with network access compiled and exported production pages.

## Rendered review and its limits

Served `apps/web/out` using `python3 -m http.server 3010 --bind 127.0.0.1
--directory apps/web/out`. The repository uses static export: `next start` cannot
serve that output. In the in-app browser, the methods deep link correctly respected
progression locks and initially returned to the first available activity. Advanced
through the first four lessons using explicitly synthetic reflection text solely
for navigation inspection; completion marks from this session are not learning
evidence.

Reviewed rendered methods reading and practical, and the new retry reading:
headings, source code blocks, stated outputs, practice instructions and split lesson
order appeared. Reload retained the methods and retry reading positions. Exact routes:

- `/?view=curriculum&school=builder&path=web-and-api-foundations&activity=web-and-api-foundations-methods-headers-and-status-codes-concepts`
- `/?view=curriculum&school=builder&path=web-and-api-foundations&activity=web-and-api-foundations-retries-idempotency-and-conditional-requests-concepts`

This was a bounded DOM/render spot review and one viewport screenshot, not a complete
responsive/accessibility audit. At the inspected narrow viewport the curriculum list
precedes the teaching body and is long; review this reading burden separately.
No independent learner was tested, no genuine learner practical was marked complete,
and no module/school is promoted to VALIDATED.

## Current next work

1. Finish #319's full Apprentice novice source pass and workbench runtime checks in actual learner order, retaining capstone-after-workbench.
2. Run the current complete suite and production build at the new branch head, including the committed URL-regression check. Do not inherit earlier successful runs as validation of new commits.
3. Reopen rendered Web/API pages in learner order, including the newly inserted URL lesson; verify progress locks, long code display, mobile reading layout and re-entry.
4. Perform and score real novice teach-back on the local web diagnosis, URL encoding negative case and final API lab. Keep #318/#319/#320 open until independent transfer evidence exists.

## Complete assembled activity inventory

The following inventory includes practices, reflections and labs, rather than
counting only authored reading wrappers. It records assembled source registration,
not a claim that all these pages were rendered or pedagogically accepted.

### engineering-apprentice / engineering-foundations

1. **Thinking Like an Engineer** — `engineering-foundations-thinking-like-an-engineer`
   - reading: `engineering-foundations-thinking-like-an-engineer-lesson`
   - practical: `engineering-foundations-thinking-like-an-engineer-practice`
   - reflection: `engineering-foundations-thinking-like-an-engineer-check`
2. **Systems Thinking** — `engineering-foundations-systems-thinking`
   - reading: `engineering-foundations-systems-thinking-lesson`
   - practical: `engineering-foundations-systems-thinking-practice`
   - reflection: `engineering-foundations-systems-thinking-check`
3. **Feedback Loops and Failure Propagation** — `engineering-foundations-feedback-loops-and-failure-propagation`
   - reading: `engineering-foundations-feedback-loops-and-failure-propagation-lesson`
   - practical: `engineering-foundations-feedback-loops-and-failure-propagation-practice`
   - reflection: `engineering-foundations-feedback-loops-and-failure-propagation-check`
4. **Trade-offs** — `engineering-foundations-trade-offs`
   - reading: `engineering-foundations-trade-offs-lesson`
   - practical: `engineering-foundations-trade-offs-practice`
   - reflection: `engineering-foundations-trade-offs-check`
5. **Debugging Mindset** — `engineering-foundations-debugging-mindset`
   - reading: `engineering-foundations-debugging-mindset-lesson`
   - practical: `engineering-foundations-debugging-mindset-practice`
   - reflection: `engineering-foundations-debugging-mindset-check`
6. **Engineering Decisions** — `engineering-foundations-engineering-decisions`
   - reading: `engineering-foundations-engineering-decisions-lesson`
   - practical: `engineering-foundations-engineering-decisions-practice`
   - reflection: `engineering-foundations-engineering-decisions-check`
7. **Evidence and Technical Reasoning** — `engineering-foundations-evidence-and-technical-reasoning`
   - reading: `engineering-foundations-evidence-and-technical-reasoning-lesson`
   - practical: `engineering-foundations-evidence-and-technical-reasoning-practice`
   - reflection: `engineering-foundations-evidence-and-technical-reasoning-check`
8. **Learning as an Engineering Skill** — `engineering-foundations-learning-as-an-engineering-skill`
   - reading: `engineering-foundations-learning-as-an-engineering-skill-lesson`
   - practical: `engineering-foundations-learning-as-an-engineering-skill-practice`
   - reflection: `engineering-foundations-learning-as-an-engineering-skill-check`
9. **Communicating Technical Work** — `engineering-foundations-communicating-technical-work`
   - reading: `engineering-foundations-communicating-technical-work-lesson`
   - practical: `engineering-foundations-communicating-technical-work-practice`
   - reflection: `engineering-foundations-communicating-technical-work-check`
10. **Terminal, Shell and Filesystem** — `engineering-workbench-shell-filesystem`
   - reading: `engineering-workbench-shell-filesystem-reading`
   - practical: `engineering-workbench-shell-filesystem-guided`
   - reflection: `engineering-workbench-shell-filesystem-check`
   - practical: `engineering-workbench-shell-filesystem-lab`
11. **Git and Version-Control Workflow** — `engineering-workbench-git-version-control`
   - reading: `engineering-workbench-git-version-control-reading`
   - practical: `engineering-workbench-git-version-control-guided`
   - reflection: `engineering-workbench-git-version-control-check`
   - practical: `engineering-workbench-git-version-control-lab`
12. **Developer Inspection: Processes, Ports and Text** — `engineering-workbench-developer-inspection`
   - reading: `engineering-workbench-developer-inspection-reading`
   - practical: `engineering-workbench-developer-inspection-guided`
   - reflection: `engineering-workbench-developer-inspection-check`
   - practical: `engineering-workbench-developer-inspection-lab`
13. **HTTP from the Command Line** — `engineering-workbench-http-command-line`
   - reading: `engineering-workbench-http-command-line-reading`
   - practical: `engineering-workbench-http-command-line-guided`
   - reflection: `engineering-workbench-http-command-line-check`
   - practical: `engineering-workbench-http-command-line-lab`
14. **Milestone: Engineering Investigation** — `engineering-foundations-engineering-investigation`
   - reading: `engineering-foundations-engineering-investigation-brief`
   - practical: `engineering-foundations-engineering-investigation-build`
   - reflection: `engineering-foundations-engineering-investigation-defence`

### builder / web-and-api-foundations

1. **How the Web Works** — `web-and-api-foundations-how-the-web-works`
   - reading: `web-and-api-foundations-how-the-web-works-concepts`
   - practical: `web-and-api-foundations-how-the-web-works-practice`
   - reflection: `web-and-api-foundations-how-the-web-works-check`
2. **URLs and Query Encoding** — `web-and-api-foundations-urls-and-query-encoding`
   - reading: `web-and-api-foundations-urls-and-query-encoding-concepts`
   - practical: `web-and-api-foundations-urls-and-query-encoding-practice`
   - reflection: `web-and-api-foundations-urls-and-query-encoding-check`
3. **Client-Server Architecture** — `web-and-api-foundations-client-server-architecture`
   - reading: `web-and-api-foundations-client-server-architecture-concepts`
   - practical: `web-and-api-foundations-client-server-architecture-practice`
   - reflection: `web-and-api-foundations-client-server-architecture-check`
4. **Client-Server Boundaries and Failure Modes** — `web-and-api-foundations-client-server-boundaries-and-failure-modes`
   - reading: `web-and-api-foundations-client-server-boundaries-and-failure-modes-concepts`
   - practical: `web-and-api-foundations-client-server-boundaries-and-failure-modes-practice`
   - reflection: `web-and-api-foundations-client-server-boundaries-and-failure-modes-check`
5. **HTTP Requests and Responses** — `web-and-api-foundations-http-requests-and-responses`
   - reading: `web-and-api-foundations-http-requests-and-responses-concepts`
   - practical: `web-and-api-foundations-http-requests-and-responses-practice`
   - reflection: `web-and-api-foundations-http-requests-and-responses-check`
6. **Methods, Headers and Status Codes** — `web-and-api-foundations-methods-headers-and-status-codes`
   - reading: `web-and-api-foundations-methods-headers-and-status-codes-concepts`
   - practical: `web-and-api-foundations-methods-headers-and-status-codes-practice`
   - reflection: `web-and-api-foundations-methods-headers-and-status-codes-check`
7. **Retries, Idempotency and Conditional Requests** — `web-and-api-foundations-retries-idempotency-and-conditional-requests`
   - reading: `web-and-api-foundations-retries-idempotency-and-conditional-requests-concepts`
   - practical: `web-and-api-foundations-retries-idempotency-and-conditional-requests-practice`
   - reflection: `web-and-api-foundations-retries-idempotency-and-conditional-requests-check`
8. **JSON and Content Types** — `web-and-api-foundations-json-and-content-types`
   - reading: `web-and-api-foundations-json-and-content-types-concepts`
   - practical: `web-and-api-foundations-json-and-content-types-practice`
   - reflection: `web-and-api-foundations-json-and-content-types-check`
9. **REST Principles and Trade-offs** — `web-and-api-foundations-rest-principles-and-trade-offs`
   - reading: `web-and-api-foundations-rest-principles-and-trade-offs-concepts`
   - practical: `web-and-api-foundations-rest-principles-and-trade-offs-practice`
   - reflection: `web-and-api-foundations-rest-principles-and-trade-offs-check`
10. **Modeling Resources and API Contracts** — `web-and-api-foundations-modeling-resources-and-api-contracts`
   - reading: `web-and-api-foundations-modeling-resources-and-api-contracts-concepts`
   - practical: `web-and-api-foundations-modeling-resources-and-api-contracts-practice`
   - reflection: `web-and-api-foundations-modeling-resources-and-api-contracts-check`
11. **Errors and Status Design** — `web-and-api-foundations-errors-and-status-design`
   - reading: `web-and-api-foundations-errors-and-status-design-concepts`
   - practical: `web-and-api-foundations-errors-and-status-design-practice`
   - reflection: `web-and-api-foundations-errors-and-status-design-check`
12. **Lab: Explore APIs with curl and Postman** — `web-and-api-foundations-lab-explore-apis-with-curl-and-postman`
   - reading: `web-and-api-foundations-lab-explore-apis-with-curl-and-postman-brief`
   - practical: `web-and-api-foundations-lab-explore-apis-with-curl-and-postman-build`
   - reflection: `web-and-api-foundations-lab-explore-apis-with-curl-and-postman-review`


## REST continuation — 2026-11-01

REST Principles and Trade-offs received targeted source remediation: mechanisms for stateless interaction, uniform interface, cacheability and layering; two worked ownership-transfer designs; executable offset/cursor insertion and deletion failures with explicit snapshot limits; independent transfer rubric. The original practical remains a design exercise. New pagination sample is extracted and executed by the Web/API regression. Rendered review of this increment and independent learner transfer remain UNVERIFIED; no VALIDATED promotion. Earlier THIN classification is superseded only for these addressed source gaps. Full #319 and remaining #320 contract/error/final-lab work stay open.


## Contract modeling continuation — 2026-11-01

Modeling Resources and API Contracts rewritten at source with a matching practical: traced name/endpoint/active/age_days to the actual preceding Python practicals; deferred unverified lifecycle/ownership fields; defined request/output asymmetry, nullability and server-controlled fields; supplied an executable boundary and consumer-compatibility example, complete proposed create/read/list semantics, and migration reasoning. Existing lesson IDs preserved. Source is REMEDIATED; rendered review and independent five-criterion learner transfer remain UNVERIFIED. The standalone adapter is not an HTTP server or proof of the learner-specific core integration. Full Apprentice review, error design and final lab remain open.

Verification for this increment: `pnpm test` 12/12 passed; `pnpm build` 2 successful tasks. Source-extracted `contract_boundary.py` verified selected JSON output, boolean/null/extra-field rejection, a tolerant consumer accepting an added field and a renamed field breaking that consumer. No live HTTP or learner-core integration is claimed.


## Error-design continuation — 2026-11-01

Errors and Status Design rewritten with a matching practical: exception-to-public-contract mechanisms, seven executable success/failure cases, stable codes and client actions, separate diagnostic events, identity-status design, aggregate-validation trade-offs and uncertain mutation outcomes. Published Python is a standalone tuple-returning model with synthetic failures; no HTTP/authentication/database implementation or rollback proof is claimed. The exercise explicitly improves the model's coarse object/age classification. Source REMEDIATED; rendered review and independent five-part transfer remain UNVERIFIED. Full #319 review, introductory Web scaffolding and final lab remain open.

Verification: `pnpm test` 12/12 passed; `pnpm build` 2 tasks successful. Source-extracted error_boundary.py checks seven modeled statuses/codes, Retry-After on synthetic 503, private-text exclusion and matching public/internal request identifiers. No rendered or independent learner validation performed for this increment.


## Final Web/API lab continuation — 2026-11-01

Replaced the external-target/templates brief with complete learner-visible lab_api.py and fourteen ordered curl commands. Actual target supports GET collection/item, validated JSON POST, boolean-only PATCH, DELETE, explicit PUT 405/Allow, malformed JSON 400, domain/type 400, media-type 415, lab-specific duplicate-name 409 and a labeled 503/Retry-After fixture. Teaches dispatch, parsing/validation before mutation, response serialization, state inspection, reset behavior and diagnosis. Existing lab/activity IDs retained. Postman GET/POST/PATCH setup is explained; unavailable Postman must be recorded UNVERIFIED instead of blocking the curl experiment or fabricating evidence.

Verification: `pnpm test` **13/13 passed** and `pnpm build` **2 tasks successful**. `scripts/check-final-api-lab.mjs` extracts the published server and curl commands, substitutes only an available loopback port, and executes all fourteen commands. Observed statuses: 200/201/200/200/400/400/415/200/409/405/503/204/404/200. Checks Location, JSON despite Accept:text/plain, Allow, Retry-After, bodyless 204 without Content-Length, preserved resource state after rejected writes, empty final collection and non-HTTP connection failure after shutdown.

Source lab is REMEDIATED. The independent second-service/extra-negative-case exercises, Postman reproduction, rendered review and five-part learner transfer remain UNVERIFIED. Server is synthetic, volatile, single-threaded, loopback-only; no persistence, TLS, authentication, pagination or production-hardening claim. Identity failure contracts are design exercises, not executed authentication evidence. Full #319 novice review and How the Web Works scaffolding remain open; no module/school VALIDATED promotion.


## Introductory web / URL split continuation — 2026-11-01

At branch commits `74f554a` (source), `88b365e` (practicals), `87184e4` (regression), the original overloaded **How the Web Works** was replaced with two separately registered lessons: the web request journey and **URLs and Query Encoding**. The original activity ID is retained for the first chapter, with new stable IDs for the second. Web/API now has **12 lessons / 36 activities**; together with 13 Apprentice lessons / 43 activities, the assembled two-school inventory has **79 activities**. Earlier 11-lesson / 76-activity references describe the previous snapshot.

Source mechanisms: define web versus internet and client/server roles, distinguish browser rendering from HTTP representation, trace DNS/address → transport → TLS → HTTP (with correct HTTP/3/QUIC exception), and show how an HTTP responder may be a proxy. The offline Python static-server experiment gives a bounded 200, 404 and post-shutdown connection-failure path. Public HTTPS observation is explicitly optional and **not verified** by the offline experiment. No database, deployed Steward API, certificate-bypass or external network is assumed.

The URL chapter uses the runnable Python standard library (`urlencode`, `urlsplit`, `parse_qs`, `quote`) to demonstrate encoded `payments & ops`, repeated `tag` keys, origin, request target without fragment, encoded path slash and the negative outcome from manually concatenating an unescaped ampersand. I independently executed the exact Python example before committing and observed the published eight output lines. The source-based regression was added to `scripts/check-web-api-teaching-examples.mjs`; **the updated full test suite, TypeScript build, browser rendering and novice teach-back have not been run in this increment**. This is `REMEDIATED`, not `VALIDATED`.


## Engineering Apprentice Systems Thinking continuation — 2026-11-01

At commit `11f456d`, the actual live `engineering-apprentice-rich.ts` **Systems Thinking** reading was found to introduce identity-provider, PostgreSQL, monitoring and deployment-pipeline architecture before those prerequisites exist. The text named 'emergent behavior' but did not demonstrate how to trace state or quantitative accumulation. It also had a broken 'Future the project connection' callout. These are not merely editorial complaints: they undermine the beginner reasoning prerequisite for Builder.

Replaced that source lesson with a bounded first-principles café/queue model: explicit system definition, boundary, labeled flows, waiting/completed state, a worked arrival-six/completion-four queue trace and independently justified alternative representations. Added a separately registered **Feedback Loops and Failure Propagation** lesson rather than squeezing delay, reinforcing/balancing loops, cross-component causes and intervention trade-offs into the initial lesson. It includes a second quantitative queue trace, a hypothetical checkout failure chain, explicit competing hypotheses and an independent print-desk transfer rubric. No coding, identity provider, database or framework knowledge is assumed. These numerical examples are hypothetical, not observations.

The assembled Apprentice path now contains **14 lessons / 46 activities** (nine concepts + four Workbench + one capstone). The total assembled Apprentice + Web/API inventory is **82 activities**; earlier recorded totals of 76 and 79 describe older source snapshots. Source is REMEDIATED only in these two lessons; new head build/smoke, rendered review and independent novice transfer still require fresh evidence. Other Apprentice lessons remain under #319 full learner-order audit.
