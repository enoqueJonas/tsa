import type { LearningResource, LessonBlock } from "../activities/content";
import type { Lesson } from "./lesson";

const letsEncrypt: LearningResource = { title: "Let's Encrypt documentation", url: "https://letsencrypt.org/docs/" };
const certbot: LearningResource = { title: "Certbot documentation", url: "https://eff-certbot.readthedocs.io/" };
const openssl: LearningResource = { title: "OpenSSL documentation", url: "https://docs.openssl.org/" };

const blocks: LessonBlock[] = [
    { type: "paragraph", text: "Cloud Engineer already establishes HTTPS for Steward. This path closes the operational gap between obtaining a certificate once and owning a certificate lifecycle: identity, trust chain, renewal, reload, expiry monitoring, failed-renewal diagnosis and recovery." },
    { type: "heading", id: "lifecycle", text: "Certificate lifecycle", level: 2 },
    { type: "list", items: [
        "Issue: prove control of the intended hostname and obtain the certificate from the chosen CA.",
        "Validate: verify hostname/SAN, chain, issuer, validity and the certificate actually served at the public edge.",
        "Protect: constrain private-key access and never commit key material to Git/evidence.",
        "Renew and reload: automate renewal and prove Kong actually serves the renewed certificate.",
        "Observe: monitor time-to-expiry and renewal failures before clients are affected.",
        "Recover: diagnose a deliberately broken renewal path, repair it and prove lifecycle health."
    ] },
    { type: "callout", tone: "steward", title: "Operational definition of done", body: "A successful ACME command is not enough. The public Steward endpoint must serve the expected renewed certificate, and operators must receive useful warning before expiry if automation stops working." },
    { type: "resources", title: "Continue learning", resources: [letsEncrypt, certbot, openssl] },
];

export const certificateLifecycleOperationsDeepLessons: Lesson[] = [
    {
        id: "cloud-certificate-lifecycle-operations",
        title: "Certificate Lifecycle Operations",
        activities: [
            { id: "cloud-certificate-lifecycle-operations-001", title: "Certificates Are Expiring Operational State", estimatedMinutes: 45, content: { type: "reading", body: "Treat TLS identity as renewable operational state rather than a one-time HTTPS setup task.", blocks } },
            {
                id: "cloud-certificate-lifecycle-operations-002",
                title: "Inspect Steward's TLS Identity and Trust Chain",
                estimatedMinutes: 120,
                content: { type: "practical", objective: "Prove exactly which certificate identity the public Steward endpoint presents and why a client trusts it.", scenario: "Steward is reachable through Kong over HTTPS, but operators need evidence that the certificate, chain, hostname and private-key boundary are correct rather than merely accepting a browser padlock.", instructions: [
                    "Inspect the certificate currently served by the public Steward hostname from an external client using OpenSSL or an equivalent protocol-level tool.",
                    "Record the leaf subject/SANs, issuer, serial/fingerprint, not-before/not-after dates and the chain presented by the gateway.",
                    "Explain the trust path from the leaf through intermediates to a client trust anchor and distinguish server certificate identity from CA trust.",
                    "Test hostname validation using the correct Steward name and one deliberately wrong hostname or equivalent negative validation.",
                    "Document where Kong obtains the certificate/private key and which OS/platform identities can read the private key; remove overly broad access if discovered.",
                    "Confirm no private key, ACME account secret or live sensitive material is committed to Git or copied into ordinary evidence."
                ], deliverables: ["External TLS inspection", "Certificate-chain explanation", "Hostname positive/negative evidence", "Private-key ownership/access model", "Secret-material hygiene check"], completionCriteria: ["The learner can identify the exact leaf certificate served publicly.", "SAN/hostname and trust-chain validation are understood separately.", "A hostname/trust negative case is demonstrated.", "Private-key access is intentionally narrower than general application access."] },
            },
            {
                id: "cloud-certificate-lifecycle-operations-003",
                title: "Automate Renewal and Gateway Reload",
                estimatedMinutes: 180,
                content: { type: "practical", objective: "Prove an automated ACME renewal lifecycle whose result is actually loaded by Kong.", scenario: "The current certificate works today, but a forgotten renewal or a renewed file that Kong never reloads would still cause a production outage at expiry.", instructions: [
                    "Use the existing ACME client or choose one compatible with the current DNS/Kong design; document whether HTTP-01 or DNS-01 is used and what reachability/credential dependency it creates.",
                    "Configure automated renewal through a systemd timer, platform mechanism or equivalent repeatable scheduler rather than a personal reminder.",
                    "Use the CA staging/dry-run mechanism where available to exercise renewal safely without production rate-limit abuse.",
                    "Implement the post-renewal deployment/reload step needed for Kong to consume renewed certificate material without an unnecessary full-platform restart.",
                    "Capture the certificate fingerprint/serial before the controlled renewal/reissue test and prove the public endpoint later serves the intended replacement certificate.",
                    "Verify representative HTTPS traffic remains valid after reload and document the expected interruption behavior, if any."
                ], deliverables: ["Versioned non-secret renewal automation", "ACME challenge decision", "Dry-run/staging evidence", "Kong reload/deployment mechanism", "Before/after served-certificate evidence", "Post-renewal HTTPS verification"], completionCriteria: ["Renewal is scheduled automatically.", "The renewal path is tested rather than assumed.", "The gateway actually serves replacement certificate material after deployment/reload.", "Renewal does not depend on committing CA/API/private-key secrets to source."] },
            },
            {
                id: "cloud-certificate-lifecycle-operations-004",
                title: "Monitor Expiry and Renewal Health",
                estimatedMinutes: 150,
                content: { type: "practical", objective: "Detect certificate-lifecycle failure with enough lead time to recover before clients see an expired certificate.", scenario: "A scheduler can exist while renewal silently fails for weeks. Operators need independent evidence of the certificate actually presented to clients and of renewal-job health.", instructions: [
                    "Expose or collect the remaining validity of the certificate actually served by the public Steward endpoint using the existing Prometheus-compatible monitoring environment or another justified probe/exporter.",
                    "Create a Grafana visualization or query showing expiry time/time-to-expiry for the public certificate.",
                    "Define warning and critical thresholds with enough operational lead time for the chosen CA/lifecycle; avoid alerting only after expiry.",
                    "Create an alert through the existing alerting/notification path for near-expiry or renewal failure; do not create a duplicate notification stack.",
                    "Record renewal scheduler/job success/failure evidence separately from endpoint expiry so a successful job cannot hide a stale certificate still served by Kong.",
                    "Prove the monitoring path can distinguish a healthy long-lived certificate from a controlled near-expiry/test condition or simulated threshold."
                ], deliverables: ["Served-certificate expiry metric/probe", "Grafana expiry evidence", "Warning/critical policy", "Alert evidence", "Renewal-job health signal", "Endpoint-vs-job distinction"], completionCriteria: ["The certificate served to clients is monitored independently of certificate files on disk.", "Operators receive warning before expiry.", "Renewal execution and served-certificate freshness are treated as separate evidence.", "Existing Prometheus/Grafana/alerting responsibilities are reused rather than duplicated."] },
            },
            {
                id: "cloud-certificate-lifecycle-operations-005",
                title: "Break and Recover Certificate Renewal",
                estimatedMinutes: 180,
                content: { type: "practical", objective: "Diagnose and recover a realistic certificate-renewal failure before the current certificate expires.", scenario: "ACME renewal fails because a challenge dependency, DNS record/credential, HTTP route, firewall rule or gateway behavior changed. The currently served certificate remains valid, creating a dangerous period where users see no immediate symptom.", instructions: [
                    "Choose one safe renewal dependency to break deliberately: challenge routing, required firewall reachability, DNS challenge permission/configuration, or another environment-appropriate dependency.",
                    "Run the renewal/dry-run path and capture the failure without changing application code or replacing the working certificate manually.",
                    "Use layered evidence to identify whether the failure belongs to DNS, network reachability, ACME challenge handling, CA interaction, filesystem permission or Kong deployment/reload.",
                    "Verify the existing public certificate remains valid during the controlled renewal failure and explain why this can hide lifecycle risk.",
                    "Restore the broken dependency, rerun the renewal validation and prove healthy lifecycle behavior.",
                    "Exercise the alert/notification path or controlled threshold so the failure would be actionable before expiry.",
                    "Write a concise certificate-renewal runbook containing diagnosis order, safe retry, escalation, manual emergency replacement boundaries and post-recovery public-endpoint verification."
                ], deliverables: ["Controlled renewal failure", "Layered diagnosis", "Existing-service evidence", "Recovered renewal proof", "Alert/notification evidence", "Certificate renewal runbook"], completionCriteria: ["A real renewal-path failure is reproduced without causing an avoidable public outage.", "The failed layer is identified before configuration is changed blindly.", "Recovery restores automated renewal health.", "Monitoring/alerting would surface the risk before certificate expiry.", "The runbook ends with verification of the certificate actually served publicly." ] },
            },
            { id: "cloud-certificate-lifecycle-operations-006", title: "Defend the Certificate Lifecycle", estimatedMinutes: 20, content: { type: "reflection", prompt: "Explain Steward's complete certificate lifecycle from ACME identity proof to Kong serving the certificate. Distinguish certificate issuance, trust, renewal, reload and expiry monitoring; explain why a successful renewal command does not prove the public endpoint is safe; and identify the recovery evidence you would require before closing a certificate incident.", minimumCharacters: 350 } },
        ],
    },
];
