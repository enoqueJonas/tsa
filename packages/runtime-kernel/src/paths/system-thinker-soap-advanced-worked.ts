// Mechanism-first SOAP integration guidance that extends, rather than replaces,
// the published WSDL/XSD/real-wire mini-examples.
export type SoapAdvancedSection={title:string;paragraphs:string[];code?:{language:string;code:string;caption?:string}};
export const soapAdvancedSections:Record<string,SoapAdvancedSection[]> = {
  "soap-service-implementation": [
    {
      "title": "Separate contract publication from provider implementation",
      "paragraphs": [
        "Start from the WSDL and valid/invalid XML messages executed in the previous two lessons. A contract-first provider publishes a versioned data and operation contract before the framework's method signatures become an accidental interface. The WSDL's XSD elements define interoperable fields; the SOAP binding decides wire conventions; the provider's handler converts the received document into a domain operation and maps a result or Fault back to that contract.",
        "Work through GetServiceRecord: GET ?wsdl provides the operation description; a generated client discovers CmdbService/CmdbPort; a SOAP 1.1 POST sends document/literal GetServiceRecordRequest; the provider checks the binding/namespace/schema and calls a service-record application function; the return value is serialized to GetServiceRecordResponse. If the record is unknown, send a deliberate SOAP Fault instead of returning an empty successful payload. This boundary keeps raw XML away from Steward's own domain rules.",
        "The previous local program hand-dispatches the operation to demonstrate the wire mechanism, not to satisfy the contract-first implementation lab. For a real provider, select a framework with documented WSDL/XSD tooling that works on the installed Python runtime; record exact dependency versions, supported SOAP version, generated WSDL and endpoint. Compare the generated contract with the authored WSDL before accepting it. Treat a mismatch as a failure rather than relaxing validation by default.",
        "Provider verification sequence: run the service in one process; from a separate process inspect its WSDL and generated operation signatures; invoke both a successful GetServiceRecord and an unknown ServiceId; stop/restart the provider and repeat the calls. Save the raw requests/responses, status, Fault and contract version. Test wrong namespace and wrong SOAPAction as separate failures. A Python XML parser alone is not a real WSDL-driven provider."
      ],
      "code": {
        "language": "text",
        "caption": "Independent provider evidence checklist",
        "code": "1. WSDL/XSD fixed version (schema + operation + binding + endpoint)\n2. Running provider reachable from independent client\n3. Client-discovered GetServiceRecord signature (actual tooling output)\n4. Good request -> SOAP success -> mapped domain Service\n5. Unknown ServiceId -> SOAP Fault -> no fabricated success\n6. Wrong namespace/action -> contract rejection\n7. Restart -> service reappears with same compatible contract\n8. Record exact commands, code/versions, payloads and observed results"
      }
    }
  ],
  "soap-steward-consumer": [
    {
      "title": "A SOAP adapter translates representations and failure semantics",
      "paragraphs": [
        "An adapter protects the registry domain from the legacy provider's protocol. Its input is a bounded application request such as lookup_external_service(stable_id). Internally it can use Zeep to read WSDL, serialize XML and invoke GetServiceRecord. Its output is a small domain-neutral result such as {external_service_id, external_owner_ref}; it must not expose Zeep objects, WSDL-generated classes, raw SOAP Faults or XML namespace syntax to Steward business logic.",
        "Setup for a local comparison, after the provider lab is running in a separate terminal: create a Python 3 virtual environment; install a recorded compatible Zeep version with python -m pip install zeep; run python -m zeep http://127.0.0.1:<port>/?wsdl (substitute the port your provider actually printed); inspect the listed services, ports and GetServiceRecord signature. This command uses real WSDL tooling; it does not mutate Steward. If the provider is not running or its WSDL is invalid, record the actual tool error rather than claiming the client works.",
        "Build the adapter in steps: (1) construct a Zeep Client for the known WSDL/binding and configure a finite transport timeout; (2) invoke the typed operation with a stable service identifier; (3) map only contractually known response fields to Steward's internal representation; (4) distinguish a SOAP Fault from connection refusal, timeout, XML/schema incompatibility and a domain-level 'not found'; (5) apply Steward authorization and source-of-truth decisions independently of what the CMDB returns.",
        "The client library can serialize and parse XML, but it cannot decide that a particular external owner may update a Team record in Steward. The Steward domain remains authoritative. For unit tests, substitute the adapter interface with a deterministic fake; for integration tests, run the real SOAP provider and Zeep client. Neither test level replaces the other."
      ],
      "code": {
        "language": "text",
        "caption": "Transport errors must not collapse into an empty successful domain object",
        "code": "Steward application -> CMDBAdapter.lookup(stable_id)\n  Zeep client -> WSDL binding -> SOAP HTTP request\n  success: map external ServiceId/OwnerRef -> bounded internal representation\n  SOAP Fault: return typed remote-business rejection\n  timeout/connection refused: return dependency unavailable/ambiguous\n  response violates XSD: return contract incompatibility\n  Steward authorization: still checked by Steward, never delegated to CMDB"
      }
    }
  ],
  "soap-contract-testing-failure": [
    {
      "title": "Reproduce compatible and incompatible schema changes using the actual consumer",
      "paragraphs": [
        "A producer can change the contract in ways that look similar on paper but affect consumers differently. An added optional element may be tolerated by a generic XML parser and rejected by a generated strict client. A renamed or re-namespaced required element changes identity. Changing a field's type or a SOAPAction changes either validation or dispatch. Do not call any change backward-compatible until the deployed consumer has been exercised against it.",
        "Construct a version matrix: baseline WSDL/XSD/client pair → valid response; add optional element → verify whether Zeep accepts it in strict mode; remove required Name → validator rejects; rename GetServiceRecord → operation lookup fails; change request namespace → provider returns contract fault; change response namespace → client parser rejects or reports incompatibility. For each case preserve the generated client version, contract diff, raw request/response and observed exception type. On failure restore the baseline contract and verify recovery.",
        "Run XSD validation from the earlier lxml lesson before involving the SOAP stack so syntax/schema errors are isolated. Then run the actual provider/client and make the same payload changes at the wire boundary. Use real client settings; disabling strict parsing, enabling huge-tree parsing or ignoring XML errors to make a failing case pass can hide data loss and security problems.",
        "Negative path: the provider sends an HTTP 200 SOAP response with an invalid Name element type or wrong namespace. An HTTP-only smoke test passes but the contract-aware client must reject or explicitly surface the incompatibility. This is why API status monitoring cannot stand in for contract testing."
      ]
    }
  ],
  "soap-xml-milestone": [
    {
      "title": "Define what the reviewer must observe end to end",
      "paragraphs": [
        "The milestone integrates earlier lessons rather than introducing a new SOAP vocabulary. A defensible demonstration has two independently running components: the CMDB provider with a published WSDL/XSD and the Steward consumer through its adapter. Start by identifying the exact contract version and runtime commands; then show a successful lookup whose mapped representation reaches the intended authorized Steward workflow.",
        "Failure evidence must be distinct: a valid SOAP Fault, a contract/namespace mismatch and provider unavailability are not three spellings of one exception. Capture raw messages and the point where each failure becomes a typed Steward integration outcome. Restart the provider, restore the contract and show that the workflow recovers without overwriting authoritative ownership.",
        "If the only program you have executed is the teaching loopback wire simulator, you have not met this milestone. A separate real framework/provider plus a WSDL-aware client is required; keep the milestone UNVERIFIED until those artifacts exist."
      ]
    }
  ],
  "soap-rest-reassessment": [
    {
      "title": "Compare interaction contracts and ownership instead of protocol age",
      "paragraphs": [
        "SOAP/WSDL can suit organizations with strongly published operation/schema contracts and existing generated-client ecosystems. REST with JSON can suit resource-oriented integration and existing web clients, but 'REST' alone does not guarantee good versioning, validation or evolvability. Both use network transport and can fail before or after a state change. Compare the implemented provider constraints rather than assuming one protocol is universally superior.",
        "In Steward, an external CMDB SOAP contract should terminate in the adapter while the registry's own HTTP API remains designed around its domain requirements. The adapter is valuable if it prevents enterprise XML types from leaking through every domain service; it is wasteful if it merely wraps an identical internal contract without meaningful translation. If the external CMDB later publishes a suitable REST API, reevaluate migration against contract coverage, security/identity, error semantics, operating cost and the number of existing consumers.",
        "The ADR must record the reason for coexistence and an explicit migration trigger. Do not build a middleware façade solely for architecture aesthetics; it becomes another process, data mapping surface, failure boundary and operator responsibility. A testable migration trigger could be a provider-supported REST endpoint with required fields/security and a verified zero-loss compatibility path."
      ]
    }
  ]
};