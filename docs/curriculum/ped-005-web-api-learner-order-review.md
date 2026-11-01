# PED-005: Web/API learner-order review and prerequisite bridge

Date: 2026-11-01. Baseline: `345ebd875202ed5f3297ee857c4b3ffd1713a413`.
Issues: #318, #319, #320; acceptance ledger: #315.

This is a partial remediation pass, not school acceptance. RICH describes source
sufficiency in this review; it does not mean VALIDATED. No independent novice
teach-back was performed. The user's earlier successful build did not establish
that tests had run. The tests and build reported below were executed in this pass.

## Actual ownership and prerequisites

`engineering-foundations.ts` composes eight conceptual lessons from
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
| 1. How the Web Works | THIN in prerequisite scaffolding | Layer distinctions are useful, but URL/encoding and public HTTPS observation are compressed; no bounded local walkthrough of every promised layer. Review external-network assumptions and label the simplified TCP/TLS path's version scope. Not remediated in this pass. |
| 2. Client–Server Architecture | RICH calibration source; learner acceptance pending | Defines roles, authority and alternatives rather than starting with consequences. Existing rewrite retained. No new independent teach-back. |
| 3. Client–Server Boundaries and Failure Modes | RICH calibration source; learner acceptance pending | Complete local synthetic server and separate client, serialization and uncertain-outcome reasoning; sample executed by existing regression. |
| 4. HTTP Requests and Responses | RICH source; learner acceptance pending | Previous rewrite teaches message anatomy, actual Python server behavior, bodyless results and Accept limits. Existing server regression covers only part of the promised curl exploration. |
| 5. Methods, Headers and Status Codes | THIN → REMEDIATED source | Replaced compressed survey with intent/contract definitions, replacement versus patch reasoning, status/client-action decisions, complete plain-text method server, eight requests and explained failure diagnosis. Existing lesson/activity IDs retained. |
| 6. Retries, Idempotency and Conditional Requests | New REMEDIATED source | Split from overloaded methods survey, registered before JSON through the actual lesson array and supplied a specific practical override. Teaches effect versus response, duplicate intent, stale-write prevention, cache validators and bounded retries. Executable sequential model; real HTTP conditional/deduplication implementation explicitly absent. |
| 7. JSON and Content Types | RICH source; learner acceptance pending | Previous rewrite separates syntax, shape, domain and missing/null/zero. Both source-extracted Python examples passed. Not rewritten in this pass. |
| 8. REST Principles and Trade-offs | THIN | Resource definitions are present but statelessness/cacheability/uniform-interface mechanisms, worked competing workflow designs and pagination failure traces are too compressed for the requested independent design exercise. Rewrite next. |
| 9. Modeling Resources and API Contracts | THIN | Starts with a mature ownerTeam/lifecycle/criticality representation before showing a current-core-to-public-contract derivation; practical says future fields must be labeled but reading does not consistently do so. Needs worked create/read/failure contract and consumer compatibility exercise. |
| 10. Errors and Status Design | THIN | Useful taxonomy and envelope, but six-case practice lacks a worked translation from actual exception to public status/code, client action and controlled diagnostic evidence. |
| 11. Lab: Explore APIs with curl and Postman | THIN / environment-dependent UNVERIFIED | Requires POST, PATCH/PUT, DELETE and malformed JSON but previous GET-only server cannot supply them; the new plain-text server still does not implement JSON/PATCH. Provide a complete bounded lab target or explicit alternatives before claiming lab readiness. No public API write experiments performed. |

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

## Next work

1. Finish #319's full novice source pass and workbench runtime checks, retaining
   the real capstone-after-workbench order.
2. Repair How the Web Works scaffolding, then rewrite REST, contract modeling and
   error design in the inventory order above.
3. Supply a complete bounded final-lab target and execute the promised method/JSON
   variations; do not use the GET-only or plain-text experiment as evidence for
   unimplemented behavior.
4. Review all affected readings/practicals at normal desktop/mobile sizes and score
   independent transfer using the explicit lesson rubrics. Keep #318/#319/#320 open.

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
3. **Trade-offs** — `engineering-foundations-trade-offs`
   - reading: `engineering-foundations-trade-offs-lesson`
   - practical: `engineering-foundations-trade-offs-practice`
   - reflection: `engineering-foundations-trade-offs-check`
4. **Debugging Mindset** — `engineering-foundations-debugging-mindset`
   - reading: `engineering-foundations-debugging-mindset-lesson`
   - practical: `engineering-foundations-debugging-mindset-practice`
   - reflection: `engineering-foundations-debugging-mindset-check`
5. **Engineering Decisions** — `engineering-foundations-engineering-decisions`
   - reading: `engineering-foundations-engineering-decisions-lesson`
   - practical: `engineering-foundations-engineering-decisions-practice`
   - reflection: `engineering-foundations-engineering-decisions-check`
6. **Evidence and Technical Reasoning** — `engineering-foundations-evidence-and-technical-reasoning`
   - reading: `engineering-foundations-evidence-and-technical-reasoning-lesson`
   - practical: `engineering-foundations-evidence-and-technical-reasoning-practice`
   - reflection: `engineering-foundations-evidence-and-technical-reasoning-check`
7. **Learning as an Engineering Skill** — `engineering-foundations-learning-as-an-engineering-skill`
   - reading: `engineering-foundations-learning-as-an-engineering-skill-lesson`
   - practical: `engineering-foundations-learning-as-an-engineering-skill-practice`
   - reflection: `engineering-foundations-learning-as-an-engineering-skill-check`
8. **Communicating Technical Work** — `engineering-foundations-communicating-technical-work`
   - reading: `engineering-foundations-communicating-technical-work-lesson`
   - practical: `engineering-foundations-communicating-technical-work-practice`
   - reflection: `engineering-foundations-communicating-technical-work-check`
9. **Terminal, Shell and Filesystem** — `engineering-workbench-shell-filesystem`
   - reading: `engineering-workbench-shell-filesystem-reading`
   - practical: `engineering-workbench-shell-filesystem-guided`
   - reflection: `engineering-workbench-shell-filesystem-check`
   - practical: `engineering-workbench-shell-filesystem-lab`
10. **Git and Version-Control Workflow** — `engineering-workbench-git-version-control`
   - reading: `engineering-workbench-git-version-control-reading`
   - practical: `engineering-workbench-git-version-control-guided`
   - reflection: `engineering-workbench-git-version-control-check`
   - practical: `engineering-workbench-git-version-control-lab`
11. **Developer Inspection: Processes, Ports and Text** — `engineering-workbench-developer-inspection`
   - reading: `engineering-workbench-developer-inspection-reading`
   - practical: `engineering-workbench-developer-inspection-guided`
   - reflection: `engineering-workbench-developer-inspection-check`
   - practical: `engineering-workbench-developer-inspection-lab`
12. **HTTP from the Command Line** — `engineering-workbench-http-command-line`
   - reading: `engineering-workbench-http-command-line-reading`
   - practical: `engineering-workbench-http-command-line-guided`
   - reflection: `engineering-workbench-http-command-line-check`
   - practical: `engineering-workbench-http-command-line-lab`
13. **Milestone: Engineering Investigation** — `engineering-foundations-engineering-investigation`
   - reading: `engineering-foundations-engineering-investigation-brief`
   - practical: `engineering-foundations-engineering-investigation-build`
   - reflection: `engineering-foundations-engineering-investigation-defence`

### builder / web-and-api-foundations

1. **How the Web Works** — `web-and-api-foundations-how-the-web-works`
   - reading: `web-and-api-foundations-how-the-web-works-concepts`
   - practical: `web-and-api-foundations-how-the-web-works-practice`
   - reflection: `web-and-api-foundations-how-the-web-works-check`
2. **Client-Server Architecture** — `web-and-api-foundations-client-server-architecture`
   - reading: `web-and-api-foundations-client-server-architecture-concepts`
   - practical: `web-and-api-foundations-client-server-architecture-practice`
   - reflection: `web-and-api-foundations-client-server-architecture-check`
3. **Client-Server Boundaries and Failure Modes** — `web-and-api-foundations-client-server-boundaries-and-failure-modes`
   - reading: `web-and-api-foundations-client-server-boundaries-and-failure-modes-concepts`
   - practical: `web-and-api-foundations-client-server-boundaries-and-failure-modes-practice`
   - reflection: `web-and-api-foundations-client-server-boundaries-and-failure-modes-check`
4. **HTTP Requests and Responses** — `web-and-api-foundations-http-requests-and-responses`
   - reading: `web-and-api-foundations-http-requests-and-responses-concepts`
   - practical: `web-and-api-foundations-http-requests-and-responses-practice`
   - reflection: `web-and-api-foundations-http-requests-and-responses-check`
5. **Methods, Headers and Status Codes** — `web-and-api-foundations-methods-headers-and-status-codes`
   - reading: `web-and-api-foundations-methods-headers-and-status-codes-concepts`
   - practical: `web-and-api-foundations-methods-headers-and-status-codes-practice`
   - reflection: `web-and-api-foundations-methods-headers-and-status-codes-check`
6. **Retries, Idempotency and Conditional Requests** — `web-and-api-foundations-retries-idempotency-and-conditional-requests`
   - reading: `web-and-api-foundations-retries-idempotency-and-conditional-requests-concepts`
   - practical: `web-and-api-foundations-retries-idempotency-and-conditional-requests-practice`
   - reflection: `web-and-api-foundations-retries-idempotency-and-conditional-requests-check`
7. **JSON and Content Types** — `web-and-api-foundations-json-and-content-types`
   - reading: `web-and-api-foundations-json-and-content-types-concepts`
   - practical: `web-and-api-foundations-json-and-content-types-practice`
   - reflection: `web-and-api-foundations-json-and-content-types-check`
8. **REST Principles and Trade-offs** — `web-and-api-foundations-rest-principles-and-trade-offs`
   - reading: `web-and-api-foundations-rest-principles-and-trade-offs-concepts`
   - practical: `web-and-api-foundations-rest-principles-and-trade-offs-practice`
   - reflection: `web-and-api-foundations-rest-principles-and-trade-offs-check`
9. **Modeling Resources and API Contracts** — `web-and-api-foundations-modeling-resources-and-api-contracts`
   - reading: `web-and-api-foundations-modeling-resources-and-api-contracts-concepts`
   - practical: `web-and-api-foundations-modeling-resources-and-api-contracts-practice`
   - reflection: `web-and-api-foundations-modeling-resources-and-api-contracts-check`
10. **Errors and Status Design** — `web-and-api-foundations-errors-and-status-design`
   - reading: `web-and-api-foundations-errors-and-status-design-concepts`
   - practical: `web-and-api-foundations-errors-and-status-design-practice`
   - reflection: `web-and-api-foundations-errors-and-status-design-check`
11. **Lab: Explore APIs with curl and Postman** — `web-and-api-foundations-lab-explore-apis-with-curl-and-postman`
   - reading: `web-and-api-foundations-lab-explore-apis-with-curl-and-postman-brief`
   - practical: `web-and-api-foundations-lab-explore-apis-with-curl-and-postman-build`
   - reflection: `web-and-api-foundations-lab-explore-apis-with-curl-and-postman-review`
