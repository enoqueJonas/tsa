import type {LearningResource} from "../activities/content";
type BoundarySection={title:string;paragraphs:string[];code?:{language:string;caption:string;code:string}};
// Extends the Requirements OBS-01 synthetic case, not production incident data.
// All source references are explanatory aids; TSA teaches the model in the text.
export const boundariesRunningCase:Record<string,BoundarySection[]> = {
  "System Context": [
    {
      "title": "Carry the approved problem forward without importing implementation detail",
      "paragraphs": [
        "The Requirements running case ended with an unresolved ownership-escalation problem, FR-OWNER-01/02, and the open decision D-01 about transfer authority. A **system context** view answers who needs Steward's business capability and which *other software systems* currently exchange information with it. It does not list all runtime processes or databases. This is the first C4 zoom, not a physical network or threat model.",
        "Draw Steward as one software system. Place responder and maintainer outside it and label their business interactions. Do **not** add a new central ownership authority or an enterprise identity provider as though implemented merely because the requirements mention it. Those can be added as explicitly proposed integrations after evidence of the interface and control owner is obtained. Treat today's Django and PostgreSQL as inside the engineering implementation zoom, not separate business systems in the context view."
      ],
      "code": {
        "language": "text",
        "caption": "C4 context from OBS-01 with actual versus proposed interactions explicitly distinguished",
        "code": "[Incident Responder] --- requests current recorded owner ---> [STEWARD]\n[Service Maintainer] --- proposes authorized Team change -> [STEWARD]\n[STEWARD] --- responds with recorded owner -----------> [Incident Responder]\n\nPOSSIBLE FUTURE [Approved Ownership Directory?]\n  [STEWARD] -- reconcile ownership? --> [Directory?]\n  Status: PROPOSED/UNCONFIRMED; decision D-01 outstanding.\n\nNOT AT THIS ZOOM: Django app, PostgreSQL table, Redis, RabbitMQ\nSYSTEM PURPOSE: steward records/controls engineering Service ownership"
      }
    },
    {
      "title": "Force a reviewer to name what the diagram cannot prove",
      "paragraphs": [
        "A diagram arrow labelled 'gets ownership' hides direction, assurance and source of truth. Use 'requests the recorded owning Team' instead. A node called 'Admin' hides a role's objective, and a node 'Kafka' introduced only because the team likes it hides missing requirements. An external integration requires evidence of a real actor/system relationship or an explicit planned label.",
        "Review challenge: could a stakeholder who has never read the code explain which organization is accountable for the record, who uses it and what remains unresolved? If yes, it may serve as a valid context view; if they instead ask which Django app owns the table, you have slipped into a lower zoom. Independent test: remove all internal technology boxes, then identify one missing *business relationship* without adding gratuitous plumbing."
      ]
    }
  ],
  "Actors and External Systems": [
    {
      "title": "Classify participants by their interaction with the chosen system",
      "paragraphs": [
        "Return to OBS-01. The incident responder uses Steward to find the registered owner; the maintainer uses it to request a change; a governance reviewer may only receive an audit report and thus can be a stakeholder without a direct session. A scheduled reporting client that really calls Steward is an external-system actor in that interaction, if controlled outside Steward's responsibility boundary. A PostgreSQL instance that Steward uses internally is a **container** in a lower C4 zoom, not a user-facing external software system.",
        "An enterprise identity provider could be a neighboring system if Steward calls it to establish identity, but you must verify how real Builder authentication is configured. A shared corporate operator, same cloud tenant or common repository does not automatically decide the system boundary. The system's responsibility and independently governed interface matter more than who pays the bill."
      ],
      "code": {
        "language": "text",
        "caption": "Role versus stakeholder versus neighboring system — with evidence status",
        "code": "Responder: actor (current/proposed according to real route evidence)\nMaintainer: actor (owner change request; D-01 still unresolved)\nGovernance reviewer: indirect stakeholder unless interacting directly\nReporting service: neighboring system ONLY when an actual exchange exists\nIdP: external identity-proving system ONLY if authentication calls it\nPostgreSQL: internal deployment/container concern, not context actor\nOwner directory: unconfirmed proposed neighbor; DO NOT invent runtime"
      }
    },
    {
      "title": "An external system may not have the decision authority you wish it had",
      "paragraphs": [
        "If a company directory knows the employee's manager, it does not necessarily know who may transfer ownership of Service `svc-billing`. Authentication, organizational reporting lines and Steward-specific Team authorization can be controlled by different owners. Asking a neighboring system for information is not permission to delegate domain authority to it.",
        "Counterexample: a reviewer draws a direct arrow from a governance committee to the Steward database because governance approves policy. That committee is a stakeholder or possibly an actor of an approval workflow, not a database client by default. Retain its concern in the stakeholder matrix and leave the proposed approval workflow tagged OPEN until the decision owner approves a contract."
      ]
    }
  ],
  "Defining System Boundaries": [
    {
      "title": "Four boundary definitions answer four independent questions",
      "paragraphs": [
        "Use the same registration change at four zooms. **Responsibility boundary:** Steward owns the rule for which team is recorded and whether a transfer can occur. **Runtime/deployment boundary:** Django application and PostgreSQL process are separately deployed components. **Organizational ownership boundary:** an identity team operates the IdP, while the Steward team operates its own domain authorization. **Trust boundary:** the API cannot assume a browser's identity or requested Team field is trustworthy. One arrow can cross multiple boundary types; these terms are not synonyms.",
        "Do not classify PostgreSQL as outside the *Steward product* merely because it runs as a separate process, nor claim the external IdP is inside Steward's product because both belong to one corporation. Operational ownership can differ even when logical product responsibility is the same. Write an overlay or adjacent table so a reader does not mistake deployment components for external business systems."
      ],
      "code": {
        "language": "text",
        "caption": "Boundary matrix: one scenario with four different responsibilities",
        "code": "ELEMENT       | PRODUCT RESPONSIBILITY | RUNTIME | OWNER       | TRUST\nSteward API   | inside domain boundary | process | Steward team| authenticates input\nPostgreSQL    | internal persistence   | process | DBA/platform| DB credential boundary\nCorporate IdP | external identity proof| service | Identity    | verify identity claims\nBrowser input | outside Steward        | client  | caller      | untrusted team/id fields\nOwner source? | UNCONFIRMED external?  | TBD     | D-01 OPEN   | never assume authority"
      }
    },
    {
      "title": "Detect a boundary leak by writing the wrong design first",
      "paragraphs": [
        "Wrong design A: 'Because PostgreSQL persists Team IDs, it must decide who may transfer ownership.' Databases enforce transactions and configured access/constraints, but application-level Team policy is not automatically present. Wrong design B: 'The identity provider issued a valid token, so it may select any Team.' Authentication can be valid while authorization is denied. Wrong design C: 'The frontend hides the transfer button from outsiders, so the rule is secure.' A direct API request could bypass the UI.",
        "Corrected flow: client supplies intent → Steward verifies caller identity through its approved adapter → Steward decides object-level authorization using trusted membership evidence → the domain service enforces the transition invariant → persistence commits. This is a logical explanation; the exact real Builder authentication/membership implementation still needs direct evidence. The System Thinker Django-domain test validates a bounded Group-based substitute, **not** the enterprise IdP."
      ]
    }
  ],
  "Trust and Ownership Boundaries": [
    {
      "title": "Walk an unauthorized owner change across each assurance boundary",
      "paragraphs": [
        "Suppose a Team B maintainer is legitimately authenticated but attempts to transfer Team A's Service using a crafted request with `owner_team=Team B`. An identity provider could correctly verify the caller while the request remains unauthorized. The browser-provided Team field is data, not a grant of authority. Steward must check the requested operation against trusted Team membership/approval policy before changing the authoritative owner, and must not leak a previous cached success result to another principal.",
        "Threat analysis begins by distinguishing who makes the claim from what proof has been checked: identity (subject), authorization (action, target object, owning Team), integrity (record wasn't silently altered), and auditability (who approved an ownership transfer). These checks occur at different boundaries. A simple 'SSL enabled' check does not prove any of these domain rules."
      ],
      "code": {
        "language": "text",
        "caption": "Trust-boundary attack hypothesis — expected denial not proof of production policy",
        "code": "Actor B [authenticated] -- PATCH svc-billing owner=Team B --> Steward API\n  1. Verify token issuer/audience/signature/expiry -> identity B\n  2. Resolve service owner from trusted current domain state -> Team A\n  3. Check B has approved transfer right over Team A Service\n  4. If not: DENY, preserve Team A and audit denied attempt\n  5. If yes: domain rule + atomic persistence + audit successful transfer\nNEVER: trust request owner_team or a browser-hidden button as authority\nEVIDENCE: denied HTTP/domain result AND unchanged persisted owner"
      }
    },
    {
      "title": "Challenge the drawing with contradictory evidence",
      "paragraphs": [
        "Adversarial review: a system-context diagram lists a planned approval directory as already authoritative, or a threat model shows a browser header as trusted team membership. Both are **model errors**, even if all diagram edges connect. Confirm the actual authentication interface, authorization source and business owner from runtime code and approved policy. If not confirmed, the boundary must be labelled unresolved in the diagram and risk register.",
        "Independent transfer: a machine-to-machine reporting caller may be allowed to read aggregate ownership counts but not individual confidential ownership details or transfer ownership. Model three distinct permissions rather than a single 'API access' arrow. Record the evidence needed to justify each. This prepares the Modeling Software Systems module to create container/component views *without assuming* the trust decisions have already been solved."
      ]
    }
  ]
};
export const boundariesRunningReferences:Record<string,LearningResource[]> = {
  "System Context": [
    {
      "title": "Official C4 — System context",
      "url": "https://c4model.com/diagrams/system-context",
      "kind": "reference"
    }
  ],
  "Actors and External Systems": [
    {
      "title": "arc42 — Business and technical context distinction",
      "url": "https://docs.arc42.org/section-3/",
      "kind": "reference"
    }
  ],
  "Defining System Boundaries": [
    {
      "title": "C4 — Different diagram zoom levels",
      "url": "https://c4model.com/diagrams",
      "kind": "reference"
    }
  ],
  "Trust and Ownership Boundaries": [
    {
      "title": "OWASP — Threat Modeling Cheat Sheet",
      "url": "https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html",
      "kind": "reference"
    }
  ]
};
