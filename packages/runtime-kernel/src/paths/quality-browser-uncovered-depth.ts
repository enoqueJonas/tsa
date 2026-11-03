// Source-authored continuation for the three shortest environment/browser readings.
// Local fixture evidence is not a Steward authentication or remote provider claim.
export const qualityBrowserUncoveredDepth = {
  "browser-state": [
    [
      "Storage scope versus authentication behavior",
      "Cookies carry domain/path/SameSite/Secure/HttpOnly attributes and may be sent on network requests. localStorage is scoped by web origin and persists across page reloads; sessionStorage is scoped to an origin within a top-level browsing context and ordinarily lives through reloads but not across independently opened tabs. A BrowserContext in Playwright creates an isolated storage/cookie environment. None of these containers proves an authenticated login was correct: the server must still validate identity, authorization and session lifetime."
    ],
    [
      "Execute the local origin-and-tab isolation laboratory",
      "The isolated teaching fixture at /labs/quality-browser-events.html exposes Save isolated sample state, Read sample state and Clear sample state controls. Save writes localStorage quality_lab_origin=sample-42 and sessionStorage quality_lab_session=tab-42. Reload the page and verify both remain. Open an independently created Page within the same BrowserContext and verify origin=sample-42 but tab=absent. Open a new BrowserContext at the same URL and both should be absent. These are deliberately non-sensitive demo values, not bearer tokens."
    ],
    [
      "Why the wrong test can appear green",
      "If two authorization tests reuse a saved authenticated storage-state file, one may unknowingly run with the other's identity and never exercise login or permission denial. Conversely, fresh BrowserContexts can isolate browser storage but not a shared backend database or test user. A fresh context with copied cookies can still be authenticated if valid server sessions remain; use real server-side revocation checks to prove logout semantics."
    ],
    [
      "Actual verification boundary and independent transfer",
      "The repository executes the fixture through scripts/check-quality-browser-event-lab.py inside the Quality Chromium CI job after building the learner app. It observes origin and tab state after reload and across contexts, including cleanup; it does not prove Steward auth. Independent challenge: an API returns 401 after logout but localStorage still retains a UI theme preference. Determine what should be erased, what can remain, and which browser/API checks establish real logout."
    ]
  ],
  "local-remote": [
    [
      "One test claim, several network topologies",
      "Local Playwright, CI runner browser and remote browser service execute in different filesystem/network contexts. localhost in a browser container refers to that container, not automatically to the developer laptop or a remote app. A base URL that resolves on a developer VPN may fail from a cloud runner. Record source process, DNS result, TLS trust, routing and proxy boundary before assigning an endpoint timeout to the product."
    ],
    [
      "Worked relocation: the same login invariant",
      "Suppose the claim is that a non-owner cannot transfer a service and the client displays a denial without changing the owner. In local execution the browser reaches http://127.0.0.1:4173 for a disposable fixture; in CI it reaches a service container over mapped networking; a remote browser service needs an explicitly authorized tunnel or a reachable test host. Only setup and transport differ. The assertion (denied transfer and unchanged state) must not change to 'page loaded' merely to make remote runs green."
    ],
    [
      "Failure evidence: connection errors are not product assertions",
      "An observed connection refused means no process accepted TCP at the target, not that the API rejected a forbidden transfer. A TLS certificate failure occurs before application HTTP semantics. If remote execution changes the scenario data, credentials or feature flags, comparison of test outcomes is invalid. Capture runner/browser version, network endpoint, exact release digest and relevant redacted request trace."
    ],
    [
      "Independent transfer and safe boundaries",
      "Design a pipeline that runs local Chromium against a containerized test host and a cloud-hosted browser against an authorized staging URL. Explain how DNS, cookies, secure origins and test-data cleanup differ and which values belong in environment configuration. Do not introduce a public tunnel for private UAT systems without security approval."
    ]
  ],
  "browserstack": [
    [
      "Remote browsers expand environment coverage, not correctness criteria",
      "Playwright local Chromium/Firefox/WebKit engines can support many browser-engine questions without an external provider. A managed remote browser platform may additionally provide physical OS/browser combinations, real mobile devices and recordings. Its hosted WebDriver/Playwright connection, provider capabilities and network tunnel are execution infrastructure; the tested user/business assertions should remain unchanged."
    ],
    [
      "Worked decision: narrow client-support matrix",
      "Suppose the product officially supports desktop Chrome, desktop Safari and a specific iOS Safari version. Local Chromium and WebKit give a fast first signal, but WebKit on Linux is not by itself proof of the exact supported macOS/iOS release. A remote real-device test may be justified for an observed iOS-only form focus defect. First reproduce the defect with a supported device configuration, record its OS/browser version and attach an exact-session link. Avoid purchasing or configuring a provider just because it appears in the curriculum."
    ],
    [
      "Counterexample: a green remote test against the wrong route",
      "A remote provider may tunnel to a developer build with different proxy, IdP, CSP or feature flags than the release candidate. A green result proves that remote browser could execute one test against that target, not that production-equivalent routing was verified. Provider outages, quota exhaustion and lost session artifacts are infrastructure errors: preserve test evidence and keep the quality gate incomplete."
    ],
    [
      "Independent provider selection",
      "Given a small team supporting only desktop Chromium and Firefox on managed Windows laptops, decide whether local engines plus one Windows CI runner are enough. Then alter the requirement to include physical iOS Safari and explain the new coverage evidence, cost, credential boundary, session artifact policy and how provider outage is reported."
    ]
  ]
} as const;
