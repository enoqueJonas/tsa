// PED-005 supply-chain source additions: preserve original lesson IDs and
// distinguish real Steward package identity from explicitly disposable fixtures.
export type SupplySection = { heading:string; paragraphs:string[]; code?:{language:string;code:string;caption?:string} };
export const supplyChainDepthById: Record<string, SupplySection[]> = {
  "public-private-dependencies": [
    {
      "heading": "Resolution policy is not the same thing as package ownership",
      "paragraphs": [
        "A dependency name is an identifier given to the package manager; the registry/index URL controls where candidates may be found. If a private distribution name is also published on a public index, a consumer configured with multiple indexes may select unexpected bytes under the same name. An internal grouping URL can simplify configuration but does not prove internal precedence or authenticity. For each Steward dependency, record normalized name, resolved version, origin repository, distribution hash and trust decision. Include transitive dependencies: the application may not directly declare the malicious or outdated package.",
        "Worked decision: steward-common was legitimately deferred, so a training fixture named tsa-lab-private-codec is installed from a private hosted repository. A public package happens to use the same normalized name with a higher version. If a clean consumer resolves the public one, stop. Use approved internal namespaces and explicit repository/group routing rather than assuming a cache hit means authorization. Do not copy a public artifact into hosted to disguise its source; that would break provenance."
      ]
    },
    {
      "heading": "Deliberate negative control",
      "paragraphs": [
        "In an isolated package manager environment with no product credentials, attempt to resolve a deliberately nonexistent internal package using only the approved group endpoint. Record the resolved source or a clear 'not found'. An unexpected successful public fallback is a policy defect. For independent practice, explain why locking the version improves repeatability yet does not by itself make the package trustworthy if the resolved origin or checksum changes."
      ]
    }
  ],
  "hosted-proxy-group": [
    {
      "heading": "Work the write path and read path separately",
      "paragraphs": [
        "Hosted repository: an authorized CI publisher uploads a named immutable Steward image or earned internal package. Proxy repository: Nexus requests a public artifact from an upstream index and may retain it for later reads. Group repository: a consumer-facing logical endpoint that routes resolution across selected hosted and proxy members according to configured rules. The group normally does not become an independent publishing authority. Publication identity, internal namespace policy and credential scope must be explicit even if client configuration exposes a single hostname.",
        "A simple diagram is CI publisher → hosted internal repo → Nexus-managed persistent storage; release checker/deployer → approved group/registry endpoint → manifest/download, while an upstream proxy may serve only authorized external dependencies. The consumer should not have Nexus administrator permissions; the publisher should not have the ability to alter repository security configuration."
      ]
    },
    {
      "heading": "Failure boundary and trade-off",
      "paragraphs": [
        "Suppose pip works when Nexus can reach upstream but a new clean runner fails during an upstream outage. A warm proxy cache cannot satisfy an artifact that has never been fetched or was evicted. Diagnose upstream outage versus missing retention versus group misrouting before disabling package trust checks. A proxy improves availability; it is not a complete offline mirror or permanent archival policy.",
        "Independent exercise: choose where to send (a) a signed/approved internally produced wheel, (b) a public PyPI dependency and (c) a runtime pull of Steward digest D, and identify read versus write permissions and what evidence distinguishes internal authority from public cache."
      ]
    }
  ],
  "deploy-nexus-homelab": [
    {
      "heading": "Persist both bytes and repository metadata",
      "paragraphs": [
        "A repository manager may depend on blob storage plus application metadata/configuration. Backing up only one side risks an apparently healthy service that cannot resolve artifacts or has dangling records. Before installing Nexus, identify its storage location, service identity, internal DNS/TLS entry, supported repository formats, administrative recovery, capacity limit, backup procedure and restore test. The deployment process should be reproducible via the previously learned Ansible/Compose host contract; a one-time web UI wizard is not a substitute for recorded configuration.",
        "A container replacement that preserves the Nexus data directory tests only a narrow persistence property. A backup must also be restorable from an independent copy when storage is lost; a snapshot on the same disk may fail with the disk. Do not run a destructive restore against live image storage. Use an isolated disposable instance to rehearse recovery, then compare known published artifact hashes before and after."
      ]
    },
    {
      "heading": "Operational failure and acceptance",
      "paragraphs": [
        "A Nexus endpoint responds HTTP 200 but its blob storage volume is unavailable, so a clean client cannot pull an approved OCI digest. The UI being reachable is not a sufficient platform acceptance criterion: test a separate read-only consumer retrieving an exact known digest after service restart, and verify a read-only identity cannot publish. In a constrained homelab, prefer a single clearly recoverable Nexus service over unsupported high-availability configurations installed only for appearance."
      ]
    }
  ],
  "auth-permissions": [
    {
      "heading": "Separate identities by operation and destination",
      "paragraphs": [
        "An administrator configures repositories and role policies. A publisher CI identity should upload approved artifacts only into specific hosted repositories. A consumer identity should read assigned package/image paths without upload or repository administration. Test both allowed and denied operations, not only successful login. A release checker retrieving a manifest does not need authority to delete blobs or create users. Tokens in plaintext shell history, screenshots and CI artifacts remain an exposure even if the role itself is limited.",
        "An authorization matrix could require: CI publisher → upload to hosted/steward-images ALLOW, admin changes DENY; staging puller → fetch digest D ALLOW, upload/overwrite DENY; unknown user → private manifest DENY. These are expected decisions, not observed Nexus output; reproduce in the real homelab and record HTTP status/role without logging bearer tokens."
      ]
    },
    {
      "heading": "Revocation and independence challenge",
      "paragraphs": [
        "If a supposedly read-only service credential can push a new image tag, the repository's role policy has failed. Revoke or constrain it and audit whether any unexpected artifact was published. If a former publisher's token still works after role removal, investigate token lifecycle and cached sessions rather than assuming access was removed. For independent transfer, design a CI process that tests publication privileges without giving untrusted merge requests the upload credential."
      ]
    }
  ],
  "prerelease-release": [
    {
      "heading": "Version precedence does not change artifact bytes",
      "paragraphs": [
        "A SemVer prerelease such as 1.5.0-rc.2 signals candidate status; 1.5.0 is a stable release label with different precedence. A snapshot-style moving version, common in some ecosystems, explicitly permits changing development state and should never be silently treated as an immutable production rollback target. The audit identity must still resolve to a particular artifact hash or OCI digest. An approval can promote confidence in exact bytes; assigning a new human label may require a new published metadata object, but do not claim two rebuilt outputs with the same source have identical digests without verification.",
        "Worked case: UAT accepted 1.5.0-rc.2 digest D. Production release metadata now says 1.5.0 but a fresh CI build produced E. Approval of D does not cover E. Either promote the exact approved artifact through a supported immutable release mechanism with traceable metadata or rerun the needed validation for E. The correct strategy depends on ecosystem publication semantics."
      ]
    },
    {
      "heading": "Independent transfer",
      "paragraphs": [
        "Classify an untrusted branch artifact, accepted release candidate, stable production artifact and emergency rollback candidate. Specify immutable identity, retention window and who can change promotion state. What would a consumer observe if a snapshot repository returns different bytes under one version a day later? Why is that unacceptable for a rollback record?"
      ]
    }
  ]
};
