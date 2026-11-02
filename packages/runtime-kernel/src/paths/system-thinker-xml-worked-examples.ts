// Executable System Thinker SOAP/XML foundations.
// The code blocks below are learner-visible and are exercised by
// scripts/check-system-thinker-xml-teaching-examples.mjs.
// Research: Python ElementTree namespace docs, lxml XMLSchema validation,
// W3C XML Namespaces and OWASP XXE; videos supplement, not replace, teaching.
type TeachingSection = {
    title: string;
    paragraphs: string[];
    code?: { language: string; code: string; caption?: string };
};

export const xmlNamespaceWorkedSections: TeachingSection[] = [
    {
        "title": "Run a namespace-aware parser before designing the integration",
        "paragraphs": [
            "Start from the smallest XML problem: the CMDB provides a Service element and its Name child. The XML parser checks syntax, then expands a prefixed element name into the pair {namespace URI}local name. The prefix is not the identity. The consumer then checks the expected root and looks up Name by its expanded name. Only after these checks would Steward translate it into its own domain representation.",
            "Run the complete Python 3 example as a single file, for example python xml_namespaces.py. It needs no third-party packages, network service or database. The two successfully parsed documents deliberately use different prefixes for the same URI; their output must match. A different URI is well-formed XML but is the wrong contract. Badly nested tags fail earlier, during parsing. Do not catch every exception and silently return an empty Service.",
            "Expected output in order: original: payments-api; alias: payments-api; wrong URI: ValueError; malformed: ParseError. Predict these four results before running. Then change only the prefix, only the namespace URI and finally the child element name; identify whether syntax, namespace identity or application-required-field validation fails.",
            "This example illustrates namespace semantics on local, trusted teaching strings. It is not a hardened untrusted-XML ingestion pipeline: for real external XML, apply resource/size limits and parser hardening, as covered by the Python XML security and OWASP references."
        ],
        "code": {
            "language": "python",
            "caption": "Executable namespace identity, contract mismatch and malformed-XML failure",
            "code": "from xml.etree import ElementTree as ET\n\nNS = \"urn:example:cmdb:v1\"\n\ndef read_service(document):\n    root = ET.fromstring(document)  # syntax check; can raise ParseError\n    if root.tag != f\"{{{NS}}}Service\":\n        raise ValueError(\"Unexpected service namespace\")\n    name = root.findtext(f\"{{{NS}}}Name\")\n    if not name:\n        raise ValueError(\"Missing service name\")\n    return name\n\ncases = [\n    (\"original\", '<cmdb:Service xmlns:cmdb=\"urn:example:cmdb:v1\"><cmdb:Name>payments-api</cmdb:Name></cmdb:Service>'),\n    (\"alias\", '<x:Service xmlns:x=\"urn:example:cmdb:v1\"><x:Name>payments-api</x:Name></x:Service>'),\n    (\"wrong URI\", '<x:Service xmlns:x=\"urn:example:cmdb:v2\"><x:Name>payments-api</x:Name></x:Service>'),\n    (\"malformed\", '<x:Service xmlns:x=\"urn:example:cmdb:v1\"><x:Name>bad</x:Service>'),\n]\nfor label, document in cases:\n    try:\n        print(f\"{label}: {read_service(document)}\")\n    except (ET.ParseError, ValueError) as error:\n        print(f\"{label}: {type(error).__name__}\")"
        }
    }
];
export const xsdWorkedSections: TeachingSection[] = [
    {
        "title": "First execute a minimal XSD contract and four validation outcomes",
        "paragraphs": [
            "An XSD is not just a visual outline. Here its targetNamespace binds the schema's global Service element to a specific namespace URI; elementFormDefault='qualified' requires local Name and Port elements in that namespace too. xs:sequence fixes their order. xs:positiveInteger accepts 443 but rejects abc and zero. Missing Port fails because minOccurs defaults to 1. These are representation-level constraints, not Steward ownership or authorization.",
            "Create a fresh Python 3 environment, install lxml there with python -m pip install lxml, save this entire example as validate_service.py, and execute python validate_service.py. The XML parser first verifies well-formedness; XMLSchema.validate then checks the schema. The script intentionally prevents network/entity resolution for these teaching documents, but production external-input limits and parser policy still require separate review.",
            "Expected Boolean results: valid: True, wrong type: False, missing Port: False, wrong URI: False. Read each printed validator reason instead of merely asserting that the request failed. Messages vary by lxml/libxml2 version. Test a fifth case where Port is 0 and explain why it fails; then add an optional Owner field to the schema and test an old document against the evolved contract.",
            "An XSD-valid payload can still mention a non-existent team or ask for a forbidden ownership change; domain validation must run after schema validation. The independent exercise is to explain each validation stage, not to copy the schema unchanged."
        ],
        "code": {
            "language": "python",
            "caption": "Runnable XSD validation: valid document, wrong type, missing field and namespace mismatch",
            "code": "# In a disposable Python 3 virtual environment, install lxml:\n# python -m pip install lxml\nfrom lxml import etree\n\nXSD = \"\"\"<xs:schema xmlns:xs=\"http://www.w3.org/2001/XMLSchema\"\n  targetNamespace=\"urn:example:cmdb:v1\"\n  xmlns:cmdb=\"urn:example:cmdb:v1\" elementFormDefault=\"qualified\">\n  <xs:element name=\"Service\">\n    <xs:complexType><xs:sequence>\n      <xs:element name=\"Name\" type=\"xs:string\"/>\n      <xs:element name=\"Port\" type=\"xs:positiveInteger\"/>\n    </xs:sequence></xs:complexType>\n  </xs:element>\n</xs:schema>\"\"\"\n\nschema = etree.XMLSchema(etree.XML(XSD.encode()))\ncases = [\n    (\"valid\", '<s:Service xmlns:s=\"urn:example:cmdb:v1\"><s:Name>payments-api</s:Name><s:Port>443</s:Port></s:Service>'),\n    (\"wrong type\", '<s:Service xmlns:s=\"urn:example:cmdb:v1\"><s:Name>payments-api</s:Name><s:Port>abc</s:Port></s:Service>'),\n    (\"missing Port\", '<s:Service xmlns:s=\"urn:example:cmdb:v1\"><s:Name>payments-api</s:Name></s:Service>'),\n    (\"wrong URI\", '<s:Service xmlns:s=\"urn:example:cmdb:v2\"><s:Name>payments-api</s:Name><s:Port>443</s:Port></s:Service>'),\n]\nfor label, document in cases:\n    parser = etree.XMLParser(resolve_entities=False, no_network=True)\n    tree = etree.fromstring(document.encode(), parser=parser)\n    valid = schema.validate(tree)\n    print(f\"{label}: {valid}\")\n    if not valid:\n        print(\"  reason:\", schema.error_log.last_error.message)"
        }
    }
];
