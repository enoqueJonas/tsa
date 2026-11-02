import type {LearningResource} from "../activities/content";
type SoapBridgeSection={title:string;paragraphs:string[];code?:{language:string;caption:string;code:string}};
// This OBS-01 example does not establish an operating CMDB/Steward adapter or approved ownership policy.
export const soapAuthorityBridge:Record<string,SoapBridgeSection[]> = {
  "soap-wsdl-contract": [
    {
      "title": "OBS-01 — decode an owner record without silently approving it",
      "paragraphs": [
        "The earlier file integration treated an owner suggestion as a proposed change, not authorization. Now the legacy enterprise CMDB offers `GetServiceRecord` over SOAP. Its WSDL documents the structure of request and response; it cannot settle organizational policy D-01 simply by returning an `OwnerTeam` element. An adapter may translate a CMDB reply into a candidate recorded-owner observation, then compare that observation with Steward's authoritative registry and record a discrepancy for review.",
        "Contract-first reasoning proceeds from the contract's declared operation and types to the boundary's business meaning. Inspect the target namespace, operation name, request key, response schema, possible Faults, provider identity and version. Do not allow a generated SOAP client to return a 'successful owner transfer' merely because a correctly shaped response was parsed; the Steward use case must still authorize and commit any mutation."
      ],
      "code": {
        "language": "text",
        "caption": "SOAP protocol evidence versus Steward domain authorization",
        "code": "CMDB GetServiceRecord(SVC-123) -> SOAP 1.1 response with OwnerTeam=TEAM-B\nXML/XSD valid?    yes, if schema and namespace match\nCMDB record known?  yes, from this authenticated endpoint\nSteward owner?     independently read authoritative PostgreSQL record\nMay transfer?      UNKNOWN until approved policy D-01 and caller Team rule\nAdmissible result: discrepancy/proposal; NO automatic Service.owner_team_id write"
      }
    },
    {
      "title": "An endpoint move differs from a contract meaning change",
      "paragraphs": [
        "Changing only the URL of a SOAP endpoint can preserve the same WSDL operations and types if the same provider/trust agreement applies and the client has verified the new host. Changing an `OwnerTeam` field from 'accountable Team' to 'notification queue' is a semantic contract break even when its XSD remains `xs:string` and a generated client deserializes it without error.",
        "Independent probe: propose one additive optional XSD field, one prefix-only XML alias change, one namespace-URI change and one meaning change with unchanged XML shape. Classify each as likely compatible, structurally breaking or semantically breaking, then specify which actual consumer check can detect it. Avoid declaring an additive field universally safe without running the real generated client."
      ]
    }
  ],
  "soap-steward-consumer": [
    {
      "title": "Make the SOAP adapter a boundary translator, not the owner policy",
      "paragraphs": [
        "A SOAP client library transports an operation using XML envelopes and a binding; an integration adapter translates the external type to a narrow Steward application representation. The ownership use case decides whether the imported observation can become a recorded mutation. It must not take a trust shortcut through a SOAP response's `RequestedBy`, `OwnerTeam`, or arbitrary free-text audit field; those are data from an external provider, not verified privileges for the current caller.",
        "Separate errors in the adapter contract: transport unreachable, binding/protocol mismatch, schema parsing problem, valid SOAP Fault, valid but unexpected business meaning, and unauthorized proposed mutation. These outcomes need distinct log/evidence codes and different retry policies. A schema error is usually not fixed by blindly retrying; a temporary connection refusal might merit bounded retries if operation semantics are safe."
      ],
      "code": {
        "language": "text",
        "caption": "Proposed adapter signature and rejection map; not evidence of deployed code",
        "code": "CMDB SOAP -> [WSDL-aware client] -> [CMDB anti-corruption adapter]\n             -> candidate_owner_observation(service_id, external_team, as_of)\n             -> [Steward ownership use case] -> policy D-01 + Team permission + DB\nFault layers: CONNECT_REFUSED / SOAP_FAULT / SCHEMA_MISMATCH /\n              SEMANTIC_DISCREPANCY / DOMAIN_NOT_AUTHORIZED\nExternal record != verified caller principal; candidate != committed owner"
      }
    },
    {
      "title": "Prove rejected proposals preserve the database invariant",
      "paragraphs": [
        "A positive SOAP operation shows only that client and provider agree on one contract. For the real integration gate, use a caller from Team B to request an unauthorized transfer of Team A's Service while the provider returns a syntactically valid owner record. The expected application result is denial and unchanged PostgreSQL ownership, with no notification published as a successful transfer. This must use the real Steward authorization source before claiming enterprise integration is complete.",
        "Negative case: an adapter catches every SOAP Fault and returns an empty candidate list. This converts provider unavailability or explicit rejection into misleading 'not found' business data. The independent review must show what each exception becomes at the API/application boundary, what is safe to retry, and how to correlate provider logs without exposing secrets."
      ]
    }
  ],
  "soap-contract-testing-failure": [
    {
      "title": "Create tests that a schema-only suite cannot pass",
      "paragraphs": [
        "A generated client may accept a new WSDL and parse the XML while still misinterpreting a changed business meaning. Keep a matrix with transport/binding, XML schema, operation semantics, and domain authorization as separate assertions. For example: valid SOAP success but stale ownership must not silently overwrite PostgreSQL; valid SOAP Fault must not become an empty successful record; wrong namespace URI must fail contract parsing; unauthorized owner-change request must not mutate state.",
        "Capture the *exact* WSDL version or digest, XSD version, client generation configuration, endpoint/trust context and a bounded correlation ID for each test. A screenshot of a 200 response is not sufficient evidence; require the observed raw/typed response plus the Steward-domain before/after state or explicit 'not integrated' status."
      ]
    },
    {
      "title": "Design one provider recovery drill and one semantic rejection drill",
      "paragraphs": [
        "Start with a valid GetServiceRecord call, stop the provider and record a connection-level refusal. Restart it and verify the same contract still works; this exercises transport recovery. Separately, have the provider return a valid record whose Team conflicts with Steward's current owner and show that the boundary flags a discrepancy rather than mutating the authoritative registry. The second exercise is a semantic/policy gate, not a network recovery gate.",
        "Do not claim either test has passed in the deployed Steward application from an isolated Python SOAP simulator. The existing Zeep training-client job establishes wire compatibility for its training WSDL; real provider identity, actual Steward adapter, policy D-01 and end-to-end denial remain UNVERIFIED."
      ]
    }
  ],
  "soap-rest-reassessment": [
    {
      "title": "The architecture decision is who owns the boundary",
      "paragraphs": [
        "Changing the REST client to SOAP would not solve uncertain owner authority. Compare three current options against actual constraints: preserve REST inside Steward with a SOAP adapter to the enterprise CMDB; expose SOAP throughout Steward; or do not integrate the CMDB until the authoritative ownership agreement is approved. An adapter adds maintenance cost but can prevent SOAP-generated models from leaking into domain services; postponement may be the most defensible choice when D-01 is unresolved.",
        "Independent defence: identify whose contract may evolve, who approves owner transfers, which team operates the adapter, how a provider outage affects permitted reads, and the measurable condition for revisiting the decision. Reject 'SOAP is legacy' and 'REST is modern' as sufficient drivers. No option can be marked as production-approved without the actual stakeholders' authority decisions."
      ]
    }
  ]
};
export const soapAuthoritySources:Record<string,LearningResource[]> = {
  "soap-wsdl-contract": [
    {
      "title": "W3C WSDL 1.1 — abstract contract and binding layers",
      "url": "https://www.w3.org/TR/2001/NOTE-wsdl-20010315",
      "kind": "reference"
    }
  ],
  "soap-steward-consumer": [
    {
      "title": "Zeep — WSDL-aware Python SOAP client",
      "url": "https://docs.python-zeep.org/en/latest/",
      "kind": "reference"
    }
  ],
  "soap-contract-testing-failure": [
    {
      "title": "OWASP — external-entity handling and untrusted XML parser boundaries",
      "url": "https://cheatsheetseries.owasp.org/cheatsheets/XML_External_Entity_Prevention_Cheat_Sheet.html",
      "kind": "reference"
    }
  ],
  "soap-rest-reassessment": [
    {
      "title": "RFC 9110 — HTTP response semantics distinct from application permission",
      "url": "https://www.rfc-editor.org/rfc/rfc9110",
      "kind": "reference"
    }
  ]
};
