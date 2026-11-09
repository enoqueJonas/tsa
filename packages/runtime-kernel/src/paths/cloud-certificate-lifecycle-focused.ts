// Cloud Engineer module 4: preserve the original six activities; split distinct
// ACME issuance, observed TLS reload, and expiry/incident concepts into focused readings.
export type CertFocusSection={heading:string;paragraphs:string[]};
export type CertFocusReading={id:string;title:string;estimatedMinutes:number;body:string;sections:CertFocusSection[]};
export const certificateLifecycleFocusedReadings:CertFocusReading[]=[
  {
    "id": "cloud-certificate-lifecycle-operations-007",
    "title": "ACME issuance: challenges, identities and issuer trust",
    "estimatedMinutes": 60,
    "body": "Understand what an ACME client proves to a public CA, how the certificate is scoped to names, and why issuance is not deployment.",
    "sections": [
      {
        "heading": "ACME separates account identity, hostname control and the final certificate",
        "paragraphs": [
          "An ACME client communicates with a certificate authority using an ACME account key, requests an authorization for one or more DNS identifiers and satisfies a challenge proving control of those identifiers. The CA then issues a certificate for the approved names and public key. The challenge proves domain control according to the selected validation method; it does not audit Steward's application logic, decide who should read private keys or guarantee future certificate reloads. The ACME account key, certificate private key and provider DNS API token are different credentials with different blast radii.",
          "For HTTP-01 the validation server must be able to retrieve the expected token on the public hostname over the supported HTTP challenge path; with DNS-01 the CA checks a special TXT record published through authoritative DNS, often requiring narrowly scoped DNS automation rights. Different certificates and wildcard needs alter suitable challenge choice. A successful request can fail at authorization, challenge presentation, issuance, disk storage, permissions, or deployment; inspect the stage's actual log rather than deleting an active certificate to force success."
        ]
      },
      {
        "heading": "Follow HTTP-01 and DNS-01 failure paths independently",
        "paragraphs": [
          "Suppose a renewal worked until the provider firewall disabled inbound port 80 and the deployment relies on HTTP-01. The currently presented TLS certificate can remain valid for days, but the next challenge fails. Opening port 443 does not necessarily repair HTTP-01 validation. Conversely DNS-01 can fail because the TXT record is absent, stale, delegated incorrectly or because the DNS API credential lacks permission. Switching methods without understanding the credential and trust boundary may introduce a worse failure.",
          "In a controlled environment, record the name, challenge type, expected lookup/reachability, authoritative server or HTTP responder, client account and where the validation failed. Query DNS TXT from an independent resolver when using DNS-01; for HTTP-01 verify the correctly scoped well-known path using a public owned endpoint or CA staging. If no such endpoint is available, label real challenge verification NOT_TESTED rather than treating an openssl self-signed localhost fixture as public ACME validation."
        ]
      },
      {
        "heading": "Identify where the public certificate must actually be served",
        "paragraphs": [
          "After successful issuance, files normally contain a private key, a leaf certificate and an intermediate chain; their paths and permissions are part of the deployment contract. Kong or the current public gateway must load the renewed key/chain into its serving configuration and present them for the intended TLS hostname. An ACME client reporting 'success' while the gateway still serves the old certificate is a failed lifecycle even if the renewed files are correct.",
          "The relevant verification source is an independent client connection that supplies the real SNI name, validates the chain and hostname, then records the served certificate serial or SHA-256 fingerprint and expiry. Record old and new identities before/after the gateway's reload. If the fingerprint is unchanged when rotation was expected, the release gate must remain closed; do not infer the installed certificate from one filesystem timestamp."
        ]
      }
    ]
  },
  {
    "id": "cloud-certificate-lifecycle-operations-008",
    "title": "Run real local certificate rotation and validate the served identity",
    "estimatedMinutes": 80,
    "body": "Observe a real TCP/TLS listener retaining its old certificate after issuance and changing only after explicit reload.",
    "sections": [
      {
        "heading": "Define the difference between staged material and a live listener",
        "paragraphs": [
          "A TLS server keeps usable key and certificate material in a runtime context. Writing another PEM file does not necessarily cause that context to change; a gateway might need a safe configuration reload or API update. Clients validate the certificate presented during their own handshake, not the newest file name that an operator can find on disk. A test that only inspects certificate files misses this failure mode completely.",
          "The runnable experiment uses two real OpenSSL-generated certificates for the same fictional training hostname, api.steward.test, and a Python SSLContext served on an ephemeral 127.0.0.1 port. An explicit test-only trust bundle permits local verification. It deliberately generates a fresh certificate while leaving the server context unchanged, verifies that clients still see the old SHA-256 fingerprint, then performs an explicit context reload and checks that a new handshake presents the new fingerprint and expiry. It uses no public network, ACME account, CA or Kong installation."
        ]
      },
      {
        "heading": "Execute old → staged but stale → reloaded through actual handshakes",
        "paragraphs": [
          "Run the exact Python source below with Python 3 and the openssl executable in PATH. It first observes the old served certificate and its near-expiry alert condition. It then stages a new longer-lived certificate without reloading and confirms the public analogue remains unchanged. A false healthy renewal scheduler does not silence the independent endpoint expiry signal. After a deliberate SSLContext reload, the independent client sees the new fingerprint and a longer validity window.",
          "Expected markers are CERT_OLD_ENDPOINT_FINGERPRINT_AND_EXPIRY_OBSERVED, CERT_ISSUED_FILE_DID_NOT_CHANGE_SERVED_CERTIFICATE, CERT_FAILED_RENEWAL_ALERTS_BEFORE_PUBLIC_TLS_FAILURE, CERT_RELOAD_VERIFIED_FROM_INDEPENDENT_TLS_CLIENT and CERT_LOOPBACK_ONLY_NOT_LIVE_ACME_KONG_OR_PUBLIC_MONITORING. The embedded Python uses a synthetic 7-day alert threshold and a 2-day/30-day pair of disposable local certificates. It does not measure public availability, CA behavior, Kong plugin capabilities or a real monitoring/alerting stack."
        ]
      },
      {
        "heading": "Reject a non-reload and a misidentified replacement",
        "paragraphs": [
          "An unsafe implementation may mark renewal successful when only the new PEM file exists and fail to tell Kong to reload. In the exercise, removing the explicit server.load_cert_chain call must cause the post-renewal fingerprint assertion to fail, not produce a green lifecycle status. Equally, pointing a reload at the old certificate/key pair may appear to execute successfully but still leave users with an expiring certificate. Compare expected new identity with the actual served identity after each operation.",
          "The test demonstrates a live local TLS connection and service behavior, not process reload semantics for Kong specifically. A real operation must use the installed gateway's supported mechanism, protect its private-key material, preserve ongoing requests, check SNI and chain for the owned hostname, verify user-facing HTTPS and record rollback. Never overwrite live certificate files purely to stage a classroom failure."
        ]
      }
    ]
  },
  {
    "id": "cloud-certificate-lifecycle-operations-009",
    "title": "Expiry observability, failed renewal and incident recovery",
    "estimatedMinutes": 65,
    "body": "Distinguish scheduler health from certificate validity, define alert thresholds, and verify recovery at the public edge.",
    "sections": [
      {
        "heading": "Build two separate monitoring signals with different authority",
        "paragraphs": [
          "A certificate lifecycle needs at least two observations: the expiry and identity of the certificate actually served to clients, and the execution state of the scheduled renewal/deploy job. An apparently successful cron/systemd job does not prove that a gateway reloaded. Conversely a currently valid public certificate can mask weeks of failed renewals until expiry. End-to-end probes must connect to the same hostname and SNI that users use, while job metrics track last success, error reason and missing scheduler executions.",
          "Choose warning and critical thresholds based on actual renewal cadence, CA policies and the time operators need to recover; 7 days is only a synthetic teaching threshold. Distinguish expiring soon, already expired, DNS/TCP unreachable and wrong hostname/issuer. If probes cannot establish a trustworthy TLS session, they must alert rather than invent a parsed expiry from a different file. Monitoring the disk file and the network endpoint are separate, neither substitutes for the other."
        ]
      },
      {
        "heading": "Model an incident while the site still works",
        "paragraphs": [
          "A safe incident drill can disable one renewal dependency in a controlled test context while leaving the currently serving certificate untouched. The expected sequence is renewal job failure, evidence identifying challenge/DNS/credential/network/certificate deployment stage, independent confirmation that user traffic still validates, alert delivery within the configured threshold and reattempt after repair. If the certificate expires during the incident, stop presenting the service as healthy even if a local -k/--insecure request succeeds.",
          "Use this exact timeline in the operational runbook: time of last successful renewal, current served certificate fingerprint/notAfter, expected next challenge, observed job failure, known protected secrets, owner and safe recovery action. A check of a future expiry date without scheduler evidence is not enough. Avoid causing a real public outage to demonstrate a lesson when staging ACME or a disposable copy can establish the same failure mechanism."
        ]
      },
      {
        "heading": "Close recovery only after the new certificate is publicly observed",
        "paragraphs": [
          "After repairing renewal, verify actual public DNS and SNI, issuer trust chain, certificate identity, service operation and alert reset from an external authorized client. If the renewal script says success but the independent endpoint fingerprint remains old, the incident is still open. If the TLS certificate changed but the application authorization or worker path is broken, that is a separate service incident and should not be marked resolved by the certificate dashboard.",
          "Preserve a concise evidence ledger including old/new serial or SHA-256, expiry, renewal run, gateway reload action, independent request, error/negative test, monitoring/alert and any limits. Label local TLS-only experiments LOCAL_PROOF; real ACME/gateway/alert operations NOT_TESTED until observed. A learner should be able to predict whether 'file renewed, no reload' or 'no job, still valid leaf' requires an operational warning and justify the difference."
        ]
      }
    ]
  }
];
export const certificateLifecycleExtraPractices:Record<string,string[]>={
  "cloud-certificate-lifecycle-operations-002": [
    "Record SAN/issuer/validity/fingerprint separately for a real owned public HTTPS endpoint. Distinguish the chain the server presents from the roots already trusted by the client; unknown issuer or wrong hostname must fail validation.",
    "For an inaccessible real gateway mark external SAN and public-trust verification NOT_TESTED; no amount of local OpenSSL fixture output constitutes a publicly trusted CA chain."
  ],
  "cloud-certificate-lifecycle-operations-003": [
    "Execute the exact local rotation proof in focused reading -008 and capture all five CERT_* markers. Prove that new certificate files exist while the actual TLS listener still presents the old fingerprint until reloading.",
    "On a real authorized gateway, record the ACME challenge mode, scheduler job, post-issuance deployment hook and before/after SNI/served fingerprint. Do not assert a real Kong reload from the Python local-context experiment."
  ],
  "cloud-certificate-lifecycle-operations-004": [
    "Define two independent alerts: served-certificate expiry and renewal/deployment job failure. Include a not-running-scheduler failure and explicit NOT_TESTED if the live alert transport has not been exercised.",
    "Provide threshold, probe vantage point, last success, expected hostname and recovery owner, and demonstrate a controlled unhealthy status even while a currently valid certificate still serves HTTPS."
  ],
  "cloud-certificate-lifecycle-operations-005": [
    "Introduce one controlled staging dependency failure at the correct ACME stage, keeping the live public certificate untouched. Capture the challenge error and failed-job alert before repair, with explicit authorized rollback.",
    "Close an incident only after independent client TLS validation confirms the correct new fingerprint, chain and notAfter. A green issuance command or renewed file alone is insufficient."
  ]
};
