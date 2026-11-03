import type { LessonBlock } from "../activities/content";

// Distinct worked mechanisms for the ORIGINAL Quality browser readings.
// Each topic keeps its existing activity IDs; the overloaded event lesson is
// separately split into focused source-authored topics in its own path file.
export const qualityBrowserDepth: Record<string, LessonBlock[]> = {
  "navigation-network": [
    {
      "type": "heading",
      "id": "browser-nav-lifecycle",
      "text": "Navigation, DOM construction and application readiness are different events",
      "level": 2
    },
    {
      "type": "paragraph",
      "text": "A browser can parse HTML and fire DOMContentLoaded before a single critical API response has completed. The load event concerns document resources, not a guaranteed business state. A client-side router can update the visible route without creating a new document navigation, and a polling application might never become network-idle. Consequently the intended oracle must be tied to what the user can actually do: a named heading appears, a form is enabled, a record with a known ID becomes visible, or an error is presented after a failed request."
    },
    {
      "type": "heading",
      "id": "browser-nav-example",
      "text": "Worked owner-console sequence with two independent observations",
      "level": 2
    },
    {
      "type": "paragraph",
      "text": "Assume the product really exposes an owner console. Starting with service S-42, the test clicks a named 'Details' link and waits for an accessible heading 'Service S-42'. That proves the expected view is present, not that the requested backend owner state is current. When the user clicks 'Transfer', wait for the action's result alert or a specific response associated with the transfer request, then inspect the displayed owner. For a forbidden transfer, a visible denial message and unchanged owner in an authorized API read are distinct oracles. A pass that merely waits for the browser's load event could occur before either."
    },
    {
      "type": "paragraph",
      "text": "In Playwright, locator assertions and actionability-aware operations usually avoid arbitrary sleeps; the test must still choose the right observable state. A network response wait, if needed, should be registered around the action that triggers it to avoid losing a fast event. Do not wait on generic request URLs when multiple background requests may match; correlate method and resource identity."
    },
    {
      "type": "heading",
      "id": "browser-nav-failures",
      "text": "Diagnose failed readiness without treating every timeout as a product bug",
      "level": 2
    },
    {
      "type": "list",
      "items": [
        "Document navigation succeeded but authorization request returned 401: classify identity/authorization and inspect the actual response and UI recovery.",
        "The API returns 200 but a component never renders data: collect console exceptions and rendered DOM state; it may be a frontend defect.",
        "UI reports success after a POST returns 403: the status-only network check and click-only UI check are both weak; assert contradiction explicitly.",
        "Networkidle hangs because polling continues: remove the heuristic and target a stable user-facing condition instead."
      ]
    },
    {
      "type": "heading",
      "id": "browser-nav-transfer",
      "text": "Independent transfer: a delayed search result",
      "level": 2
    },
    {
      "type": "paragraph",
      "text": "A search field sends requests after a debounce and displays cached results while waiting. Design a test that types a query, ensures the response belongs to the latest query and verifies the rendered result without fixed sleeping. Explain what would distinguish an intentionally cached result from a stale-response race and which claim belongs in an API test."
    }
  ],
  "ui-test-selection": [
    {
      "type": "heading",
      "id": "browser-selection-model",
      "text": "Choose a test surface by what can fail there",
      "level": 2
    },
    {
      "type": "paragraph",
      "text": "A test level corresponds to an evidence boundary. API automation can validate permissions, status, schema and persistence but does not prove keyboard focus, readable errors, navigation or responsive rendering. Browser automation can prove those user-visible properties but a browser-only click cannot establish database transaction consistency. The cost of browser tests arises from runtime, asynchronous UI state, external dependencies and diagnostic ambiguity, not because 'UI is bad'."
    },
    {
      "type": "heading",
      "id": "browser-selection-worked",
      "text": "Classify one ownership feature into distinct test claims",
      "level": 2
    },
    {
      "type": "list",
      "items": [
        "Pure authorization rule: unit decision table for owner/non-owner and state; no browser needed.",
        "HTTP enforcement: non-owner POST returns the contractually expected denial and owner remains unchanged through authorized read; API/integration test.",
        "User-facing denial: when a real owner console exists, failed transfer shows an understandable error, retains entered information and does not falsely display success; browser test.",
        "Keyboard workflow: ownership edit dialog can be opened, focused, submitted and corrected without a mouse; browser/manual accessibility evidence.",
        "Visual layout: supported narrow viewport keeps action and feedback readable; browser-level responsive check.",
        "No client UI exists: deliberately record 'no browser coverage needed' for these specific API-only claims, not a fabricated frontend test."
      ]
    },
    {
      "type": "heading",
      "id": "browser-selection-budget",
      "text": "Use a small portfolio rather than duplicating everything",
      "level": 2
    },
    {
      "type": "paragraph",
      "text": "Start with a risk inventory and select one or two end-user journeys demonstrating a cross-boundary feature. Use API or fixture setup for irrelevant prerequisites, leaving UI steps only when the setup itself is under test. Track browser/environment combinations explicitly. If the same product invariant already has a reliable unit/API oracle, adding ten browser duplicates may only multiply flakiness; a single browser error-feedback test adds genuinely new information."
    },
    {
      "type": "heading",
      "id": "browser-selection-failure",
      "text": "Counterexample: all-green browser smoke but broken authorization",
      "level": 2
    },
    {
      "type": "paragraph",
      "text": "Suppose the user-facing button is hidden for non-owners, so the UI smoke test passes, but a crafted HTTP POST still changes ownership. The browser suite was checking presentation, not server authorization. Conversely, a strong 403 API suite can pass while the UI traps keyboard focus after denial. Defend both boundaries without treating them as interchangeable."
    },
    {
      "type": "heading",
      "id": "browser-selection-transfer",
      "text": "Independent transfer: PDF export",
      "level": 2
    },
    {
      "type": "paragraph",
      "text": "Given a service exporting a report, assign validation of CSV/PDF bytes, access control, download filename, save-dialog behavior and screen-reader feedback to API, browser, both or manual checks. For each selected browser check, state what unique failure it would reveal and what evidence would make it unnecessary."
    }
  ],
  "advanced-browser-interactions": [
    {
      "type": "heading",
      "id": "browser-events-first",
      "text": "An action can create a new event, resource or context",
      "level": 2
    },
    {
      "type": "paragraph",
      "text": "Uploads, downloads, popups, frames and dialogs are related because a user action crosses a browser event or resource boundary, but they are not the same API and should not be crammed into one unexamined script. A download is emitted by the browser and needs an event wait; an upload supplies a controlled file to an input; a popup creates a new Page; a frame adds a separate DOM context; a JavaScript dialog blocks until accepted or dismissed. The next two focused lessons split these mechanisms so each can be exercised independently."
    },
    {
      "type": "heading",
      "id": "browser-events-order",
      "text": "Register the observer before the triggering action",
      "level": 2
    },
    {
      "type": "paragraph",
      "text": "For event-driven flows, the safe conceptual pattern is: register an event wait, perform the action within that wait, obtain the event object, then inspect its payload and clean it up. If the script clicks before registering the wait, a fast popup or download can happen before the listener exists. Arbitrary Thread.sleep does not repair the race, and successful waiting does not prove file contents or security."
    },
    {
      "type": "heading",
      "id": "browser-events-hazards",
      "text": "Failure models differ by boundary",
      "level": 2
    },
    {
      "type": "list",
      "items": [
        "Download event observed but file is empty or belongs to the wrong record; inspect content and expected identity.",
        "Popup appears but remains unauthenticated, or the original page is incorrectly asserted as if it were the popup.",
        "Frame renders data in another origin; locator strategy and security restrictions must account for its owning context.",
        "JavaScript confirm dialog is accidentally dismissed, changing user intent; record what was accepted and the resulting state."
      ]
    },
    {
      "type": "heading",
      "id": "browser-events-transfer",
      "text": "Independent transfer: an invoice portal",
      "level": 2
    },
    {
      "type": "paragraph",
      "text": "An invoice page exports PDF, opens an external authentication popup and embeds a payment frame. Assign separate event owners, assertions and cleanup responsibilities. Explain which tests should be skipped if the real Steward product has none of these interfaces; do not invent features merely to exercise a library."
    }
  ],
  "browser-diagnostics": [
    {
      "type": "heading",
      "id": "browser-diagnostic-stack",
      "text": "Reconstruct one failure across four evidence layers",
      "level": 2
    },
    {
      "type": "paragraph",
      "text": "Consider a test that clicks 'Transfer' and times out while waiting for a success banner. A screenshot captures one visual moment; a trace records actions and DOM snapshots over time; console errors reveal frontend exceptions; network events can show the actual POST status and correlation ID. These layers answer different questions. None by itself proves whether a forbidden backend mutation was committed, which still needs an independent state read."
    },
    {
      "type": "heading",
      "id": "browser-diagnostic-investigation",
      "text": "Worked triage of a misleading success UI",
      "level": 2
    },
    {
      "type": "paragraph",
      "text": "Suppose a screenshot shows 'Transfer successful', but a network trace reveals POST /services/42/transfer returned 403. The console includes a handler exception and the UI left the success banner from the previous operation. First establish the exact candidate and test identity, then align the click timestamp with response method/path/status, inspect the DOM state after that response, and finally use a separately authorized read to verify the actual owner. Classify the frontend false-success independently from any backend invariant failure. Avoid filing a generic 'UI broken' bug without reproducible evidence."
    },
    {
      "type": "heading",
      "id": "browser-diagnostic-policy",
      "text": "Capture useful artifacts without collecting secrets indefinitely",
      "level": 2
    },
    {
      "type": "list",
      "items": [
        "Always retain: test ID, commit/release, target environment, browser engine/version, viewport and observed assertion failure.",
        "On controlled failure: sanitized trace and targeted screenshot; include correlation IDs and relevant request/response metadata.",
        "Never attach unredacted cookies, authorization headers, full customer records or browser storage snapshots to ordinary CI artifacts.",
        "Set size and retention limits, private access policy and deletion schedule; repeatable machine reports remain the primary source of test status.",
        "When artifact capture itself fails, keep the original test failure as the primary outcome and report missing diagnostics separately."
      ]
    },
    {
      "type": "heading",
      "id": "browser-diagnostic-negative",
      "text": "Counterexample: more logs, less truth",
      "level": 2
    },
    {
      "type": "paragraph",
      "text": "Collecting every request body from every passing test increases cost and leakage risk. A trace may also expose only frontend observations and miss a database race. Diagnostics should establish event chronology and narrow the likely cause; they must not silently change assertion results or become the only oracle."
    },
    {
      "type": "heading",
      "id": "browser-diagnostic-transfer",
      "text": "Independent transfer: intermittent blank search results",
      "level": 2
    },
    {
      "type": "paragraph",
      "text": "A query sometimes renders no results even though the API returns matching items. Choose one minimal always-on signal and three failure-only artifacts, identify their sensitive fields, and define what each would establish. State the next observation required to distinguish stale cache, wrong query and dropped render update."
    }
  ],
  "browser-parallelism": [
    {
      "type": "heading",
      "id": "browser-parallel-ownership",
      "text": "Separate process, session, page, identity and backend data",
      "level": 2
    },
    {
      "type": "paragraph",
      "text": "Playwright Browser is an automation connection to a browser process. BrowserContext is an isolated browser session with its own cookies and local storage; Page is one tab in that context. Two different contexts do not imply two different backend users, database records or permissions. Isolation of the automation object graph and isolation of product state are independent requirements. Sharing a static mutable Page across JUnit workers can mix navigation and locators; a unique Page in each context still cannot prevent two workers editing the same service."
    },
    {
      "type": "heading",
      "id": "browser-parallel-worked",
      "text": "Two workers racing over one service slug",
      "level": 2
    },
    {
      "type": "paragraph",
      "text": "Worker A creates a service with slug qa-run-42; worker B creates the same slug at the same time. Each has a separate BrowserContext, but the database's UNIQUE constraint applies globally. One write may fail, or both UI tests may try to operate on whichever record wins. The failure is a test-data ownership collision unless the scenario deliberately tests simultaneous conflict handling. A safe isolation strategy gives each worker an explicit run ID, worker ID and record suffix, with predictable cleanup. Keep a separate intentional shared-resource concurrency test to challenge real product consistency."
    },
    {
      "type": "heading",
      "id": "browser-parallel-classes",
      "text": "Decide which resources can be shared",
      "level": 2
    },
    {
      "type": "list",
      "items": [
        "Immutable configuration and a managed Browser launcher may be shared only if their library thread-safety and lifecycle contracts permit it.",
        "Each test owns its BrowserContext, Page, identity and mutable fixtures; close them even when a test assertion throws.",
        "Authentication storage-state files are credentials and must not be casually shared or committed; a snapshot is not a unique account.",
        "Backend test data requires unique identifiers or isolated schemas; browser contexts do not provide this automatically.",
        "External systems may impose rate limits or global locks; reducing concurrency can be a correct engineering decision."
      ]
    },
    {
      "type": "heading",
      "id": "browser-parallel-negative",
      "text": "Failure: green only when serial",
      "level": 2
    },
    {
      "type": "paragraph",
      "text": "A suite passes 30 serial runs and fails intermittently when two workers use a common static currentUser token. Retrying the suite until it turns green does not prove the product is healthy; capture first-pass rates and remove the shared state. Do not label the incident a product race until the fixture, identity and database overlap have been ruled out."
    },
    {
      "type": "heading",
      "id": "browser-parallel-transfer",
      "text": "Independent transfer: simultaneous checkout",
      "level": 2
    },
    {
      "type": "paragraph",
      "text": "Design two browser tests that book different tickets and a separate concurrency test that attempts to book the same last ticket. Specify context/identity, backend data boundaries, the expected winner/loser oracle and whether the test must run serial or parallel. Explain how the last-ticket test adds product evidence instead of test pollution."
    }
  ],
  "page-components": [
    {
      "type": "heading",
      "id": "page-object-repetition",
      "text": "Extract behavior after two direct flows reveal the same interaction",
      "level": 2
    },
    {
      "type": "paragraph",
      "text": "Start with two straightforward tests using accessible locators directly. Suppose both open the service registry, search by a service name and open one result, but one asserts an owner badge while the other checks a description. After observing this stable repetition, a small RegistryPage could expose search(name) and openResult(name). Its purpose is to express user capabilities while leaving each test's business assertion visible. Do not begin with a class that exposes every CSS selector as a public field."
    },
    {
      "type": "heading",
      "id": "page-object-before-after",
      "text": "Worked comparison: why a god page object weakens the suite",
      "level": 2
    },
    {
      "type": "paragraph",
      "text": "Before extraction, the tests each contain the same three navigation/search steps and their own assertion. A good after-state removes those three repeated steps into a narrow page method while leaving the caller explicit: test A checks the owner badge, test B checks the description. A bad after-state creates RegistryPage.verifyEverythingAndTransferAndAssertSuccess(), hiding identity setup, backend state changes, and assertion intent behind one boolean. A failure now points to the helper rather than the violated product rule."
    },
    {
      "type": "heading",
      "id": "page-object-components",
      "text": "What should become a component object?",
      "level": 2
    },
    {
      "type": "list",
      "items": [
        "A modal repeated across multiple pages can expose open, fill and submit operations with stable semantics.",
        "A pagination component can offer nextPage and currentPage, without owning service-specific validation.",
        "A one-off static heading is not automatically worth a class.",
        "Use accessible names/roles as locator intent where possible; CSS structural selectors are a fallback when the product lacks suitable semantics.",
        "Keep navigation and lifecycle ownership clear: a page object does not decide when BrowserContext should be shared across tests."
      ]
    },
    {
      "type": "heading",
      "id": "page-object-negative",
      "text": "Counterexample: abstraction causes stale locators",
      "level": 2
    },
    {
      "type": "paragraph",
      "text": "A helper caches a locator result from an old page state and the UI rerenders after a search. A later test clicks the obsolete element, failing only under load. Keep locators evaluated against the current context, use web-first assertions and avoid long-lived element snapshots. A page object's existence is not evidence of synchronization correctness."
    },
    {
      "type": "heading",
      "id": "page-object-transfer",
      "text": "Independent transfer: reusable date filter",
      "level": 2
    },
    {
      "type": "paragraph",
      "text": "Two reports share a date-filter widget and differ in the results they assert. Propose the smallest component API, show which assertion remains in each test, and define a counterexample where extraction would increase coupling. If the second report uses different semantics, explain why not reusing the widget may be the safer choice."
    }
  ]
};
