import type { LessonBlock } from "../activities/content";

// PED-005: three distinct, navigable source lessons in the ORIGINAL
// Capstone Problem Discovery Stakeholder Discovery topic.
// These fictional examples never establish real field research.
export const stakeholderCoveragePython = "from dataclasses import dataclass\n\nREQUIRED = {\"frontline_user\", \"operator\", \"affected_nonuser\", \"decision_owner\"}\n\n@dataclass(frozen=True)\nclass Evidence:\n    role: str\n    collected: bool\n    consent: bool\n    prompt: str          # open, leading\n    kind: str            # testimony, observation\n\ndef assessment(records: list[Evidence]) -> str:\n    # Synthetic teaching records only. Consent is not sufficient legal authority.\n    if any(r.collected and not r.consent for r in records):\n        return \"UNAUTHORIZED_RECORD\"\n    if any(r.collected and r.prompt == \"leading\" for r in records):\n        return \"LEADING_QUESTION_BIAS\"\n    represented = {r.role for r in records if r.collected and r.consent}\n    if not REQUIRED.issubset(represented):\n        return \"MISSING_STAKEHOLDER_VOICE\"\n    if not any(r.collected and r.kind == \"observation\" for r in records):\n        return \"TESTIMONY_ONLY_CAUSE_UNVERIFIED\"\n    return \"READY_TO_CHALLENGE_CAUSAL_HYPOTHESIS\"\n\nmanager = Evidence(\"decision_owner\", True, True, \"open\", \"testimony\")\nfrontline = Evidence(\"frontline_user\", True, True, \"open\", \"observation\")\noperator = Evidence(\"operator\", True, True, \"open\", \"testimony\")\nnonuser = Evidence(\"affected_nonuser\", True, True, \"open\", \"testimony\")\n\n# Illustrative scenarios: no real interviews or access have happened.\ncases = {\n    \"manager_only\": ([manager], \"MISSING_STAKEHOLDER_VOICE\"),\n    \"unconsented\": ([manager, Evidence(\"frontline_user\", True, False, \"open\", \"testimony\")], \"UNAUTHORIZED_RECORD\"),\n    \"leading_prompt\": ([manager, Evidence(\"frontline_user\", True, True, \"leading\", \"testimony\")], \"LEADING_QUESTION_BIAS\"),\n    \"only_testimony\": ([manager, Evidence(\"frontline_user\", True, True, \"open\", \"testimony\"), operator, nonuser], \"TESTIMONY_ONLY_CAUSE_UNVERIFIED\"),\n    \"broader_sample\": ([manager, frontline, operator, nonuser], \"READY_TO_CHALLENGE_CAUSAL_HYPOTHESIS\"),\n}\nfor name, (records, expected) in cases.items():\n    actual = assessment(records)\n    assert actual == expected, f\"{name}: {actual} != {expected}\"\n    print(f\"{name}: {actual}\")\nprint(\"STAKEHOLDER_COVERAGE_BIAS_GATE_PASS\")\n";
export const stakeholderMappingBlocks: LessonBlock[] = [
  {
    "type": "paragraph",
    "text": "This is the first original Stakeholder Discovery reading, not a replacement for speaking with authorized people. The example is a FICTIONAL warranty-repair handoff: a manager wants a dashboard, a counter clerk wants fewer repeated forms, an operator must fix data mismatches, and people who never use the proposed software can still bear the consequence of mistaken decisions. We will map those voices before claiming requirements or choosing technology."
  },
  {
    "type": "heading",
    "id": "stakeholders-not-buyers",
    "text": "Who counts as a stakeholder, and what is the unit of analysis?",
    "level": 2
  },
  {
    "type": "paragraph",
    "text": "A stakeholder is a person or group whose interests, activities, rights, decisions or responsibilities can be affected by the workflow or a proposed intervention. A stakeholder is not necessarily a purchaser, login account or the loudest requester. In a warranty handoff the direct user files or checks a request, a downstream operator reconciles incomplete records, a decision owner can approve a changed policy, and an affected non-user may lose access to an item without ever interacting with the system. Distinguish people from interfaces: an external supplier API is a dependency, while the supplier team that changes its contract is a stakeholder."
  },
  {
    "type": "paragraph",
    "text": "Start at the workflow, not an organization chart. Trace a single triggering event—customer returns an item—through identity and proof of purchase, triage, decisions, waiting, repair outcome and notification. At each handoff ask: who supplies information, who can alter it, who must act on errors, who authorizes exceptions, who can challenge the result, and who experiences harm if it fails? A funding sponsor may have high decision authority but very little knowledge of the daily process. A counter clerk may have little formal power yet be the only person who sees repeated form failures. Both are important for different questions."
  },
  {
    "type": "heading",
    "id": "stakeholder-map",
    "text": "Build a map that exposes missing voices",
    "level": 2
  },
  {
    "type": "paragraph",
    "text": "Create a matrix with columns: role or affected group; actual job or consequence; decision authority (yes/no and over what); access/contact route; evidence permission; claim to test; contradictory perspectives; and confidence. Do not put fictional names, invented interviews or a completed contact field in a real evidence register. Choose purposeful coverage by workflow role rather than assuming the first three available contacts represent everyone. For a bounded first pass, ensure you have considered the frontline user, the operator, a person affected outside the interface, and a decision owner. Not every project requires exactly four interviews; the four labels are an illustrative coverage heuristic, not a statistically representative sample."
  },
  {
    "type": "paragraph",
    "text": "Here is the failure chain. A sponsor says 'our staff delay approvals'; the engineer asks only two managers, then builds an approval-speed dashboard. That is convenience sampling from one authority tier. It cannot establish that clerks are slow: the records might arrive without proof of purchase, or the supplier might be unreachable. The missing operator and affected customer perspectives could reverse the intervention. Good discovery deliberately looks for missing groups, opposing incentives and unobservable harm instead of optimizing the feature list requested by the sponsor."
  },
  {
    "type": "heading",
    "id": "sampling-not-statistics",
    "text": "Sampling, access and ethical authority are separate questions",
    "level": 2
  },
  {
    "type": "paragraph",
    "text": "Purposive sampling chooses participants because they have relevant exposure to a particular part of the workflow; snowball sampling asks one participant to refer others. Both can help discover roles, but both can miss isolated or marginalized people. A stakeholder map is a coverage instrument, not a population survey, and four accounts cannot justify a numeric prevalence estimate. If a question is about rate or prevalence, agree on an authorized records sample, eligible population, timeframe and selection bias before estimating it. Distinguish available contacts, invited participants, consenting participants and observations actually collected."
  },
  {
    "type": "paragraph",
    "text": "Before any conversation, document the purpose, recruitment route, who has the right to grant access, what data will be collected, how it will be minimized, and how someone can decline. A participant's consent may be necessary but not sufficient for lawful organizational data access; consult applicable policy and qualified oversight. A manager's approval does not make all workers free to disclose colleagues' sensitive records. If a group is inaccessible, mark MISSING_VOICE and seek an authorized alternative; do not invent testimony or treat managerial speculation as a proxy."
  },
  {
    "type": "heading",
    "id": "sampling-code",
    "text": "Execute a bounded coverage and bias check",
    "level": 2
  },
  {
    "type": "paragraph",
    "text": "The following exact Python 3 standard-library exercise is a diagnostic model of five fictional sampling cases, not real interview research or a substitute for qualitative analysis. It refuses to call a manager-only sample complete, flags collected records without participant consent, flags a leading question, and refuses to turn purely reported stories into a verified causal claim. Even the broadest example produces READY_TO_CHALLENGE_CAUSAL_HYPOTHESIS, deliberately not 'problem proven'. The printed results make the failure modes falsifiable."
  },
  {
    "type": "code",
    "language": "python",
    "caption": "Exact Python 3 stakeholder-coverage classroom gate; fictional records, not collected research",
    "code": "from dataclasses import dataclass\n\nREQUIRED = {\"frontline_user\", \"operator\", \"affected_nonuser\", \"decision_owner\"}\n\n@dataclass(frozen=True)\nclass Evidence:\n    role: str\n    collected: bool\n    consent: bool\n    prompt: str          # open, leading\n    kind: str            # testimony, observation\n\ndef assessment(records: list[Evidence]) -> str:\n    # Synthetic teaching records only. Consent is not sufficient legal authority.\n    if any(r.collected and not r.consent for r in records):\n        return \"UNAUTHORIZED_RECORD\"\n    if any(r.collected and r.prompt == \"leading\" for r in records):\n        return \"LEADING_QUESTION_BIAS\"\n    represented = {r.role for r in records if r.collected and r.consent}\n    if not REQUIRED.issubset(represented):\n        return \"MISSING_STAKEHOLDER_VOICE\"\n    if not any(r.collected and r.kind == \"observation\" for r in records):\n        return \"TESTIMONY_ONLY_CAUSE_UNVERIFIED\"\n    return \"READY_TO_CHALLENGE_CAUSAL_HYPOTHESIS\"\n\nmanager = Evidence(\"decision_owner\", True, True, \"open\", \"testimony\")\nfrontline = Evidence(\"frontline_user\", True, True, \"open\", \"observation\")\noperator = Evidence(\"operator\", True, True, \"open\", \"testimony\")\nnonuser = Evidence(\"affected_nonuser\", True, True, \"open\", \"testimony\")\n\n# Illustrative scenarios: no real interviews or access have happened.\ncases = {\n    \"manager_only\": ([manager], \"MISSING_STAKEHOLDER_VOICE\"),\n    \"unconsented\": ([manager, Evidence(\"frontline_user\", True, False, \"open\", \"testimony\")], \"UNAUTHORIZED_RECORD\"),\n    \"leading_prompt\": ([manager, Evidence(\"frontline_user\", True, True, \"leading\", \"testimony\")], \"LEADING_QUESTION_BIAS\"),\n    \"only_testimony\": ([manager, Evidence(\"frontline_user\", True, True, \"open\", \"testimony\"), operator, nonuser], \"TESTIMONY_ONLY_CAUSE_UNVERIFIED\"),\n    \"broader_sample\": ([manager, frontline, operator, nonuser], \"READY_TO_CHALLENGE_CAUSAL_HYPOTHESIS\"),\n}\nfor name, (records, expected) in cases.items():\n    actual = assessment(records)\n    assert actual == expected, f\"{name}: {actual} != {expected}\"\n    print(f\"{name}: {actual}\")\nprint(\"STAKEHOLDER_COVERAGE_BIAS_GATE_PASS\")\n"
  },
  {
    "type": "heading",
    "id": "sampling-negative",
    "text": "Try to trick the sampler",
    "level": 2
  },
  {
    "type": "paragraph",
    "text": "Run the full script using `python3 stakeholder_coverage.py`; preserve its five classifications and final pass marker. In a disposable copy change the consent rejection condition to `if False:`: the unconsented record must now violate its assertion. Remove the `REQUIRED.issubset(represented)` rejection: the manager-only sample must wrongly pass. Remove the `prompt == \"leading\"` rejection: the leading-question sample must pass the wrong gate. A green CI run only says these toy claims are checked; the real research still needs actual authorized participants and contrary observations."
  },
  {
    "type": "paragraph",
    "text": "Write an independent role map for a DIFFERENT capstone domain with at least one person harmed without logging into the system. Identify an authority role that cannot reliably report operational friction, a frontline role with lived workflow exposure and an access boundary that could block interviews. A missing or denied voice must produce a real limitation and next authorized recruitment step, never a fictitious quote. Carry these gaps into the next two focused readings."
  },
  {
    "type": "resources",
    "title": "Primary user-research references",
    "resources": [
      {
        "title": "GOV.UK Service Manual — Plan user research",
        "url": "https://www.gov.uk/service-manual/user-research/plan-user-research"
      },
      {
        "title": "GOV.UK Service Manual — Find user research participants",
        "url": "https://www.gov.uk/service-manual/user-research/find-user-research-participants"
      }
    ]
  }
];
export const stakeholderInterviewBlocks: LessonBlock[] = [
  {
    "type": "paragraph",
    "text": "This focused reading follows the original stakeholder-map reading. It teaches interview mechanics before the original practical: how to ask neutral questions, observe actual handoffs, avoid coercion, and preserve what was said versus what was directly observed. A scripted classroom transcript illustrates bias; it is NOT a completed interview or evidence from a real workplace."
  },
  {
    "type": "heading",
    "id": "interview-protocol",
    "text": "Separate a research question from an interview question",
    "level": 2
  },
  {
    "type": "paragraph",
    "text": "A research question identifies something uncertain and consequential, such as 'Where are repair handoffs delayed, and under which circumstances?' An interview question must elicit a participant's experience without supplying the answer: 'Think about the last handoff that took longer than expected. What happened from the moment you received it?' Follow with 'What did you do next?', 'What information was missing?' and 'Can you show a permitted redacted example?' Open, concrete, recent-event questions usually produce richer, less speculative evidence than 'Would you use our new app?'. An interview is not a vote on a feature backlog."
  },
  {
    "type": "paragraph",
    "text": "Write a guide with opening/context, current workflow, recent incident, variations/exceptions, consequences, workarounds, disconfirming prompts and close. Probe for the difference between the official process and actual practice. Ask every role the SAME core workflow questions for comparability, then add role-specific probes. Avoid assuming participants remember exact frequencies: if someone says 'this always happens', write that as reported testimony and look for a suitable authorized record sample before making a percentage claim."
  },
  {
    "type": "heading",
    "id": "interview-ethics",
    "text": "Ask permission and limit what you record",
    "level": 2
  },
  {
    "type": "paragraph",
    "text": "Before an interview: explain who you are, why you are asking, voluntary participation, expected duration, how notes or recordings will be used, any access restrictions, and how to decline a question. Record whether recording permission was given independently of general participation. Use minimal notes and remove unnecessary names, account identifiers and secrets. Do not quietly record audio because the interviewer finds it convenient. Do not treat a supervisor's invitation as an employee's own consent."
  },
  {
    "type": "paragraph",
    "text": "For observation, ask permission to watch a normal task, describe the scope and avoid production data copying or an unauthorized transaction. Record timestamps of handoffs where permitted; write 'participant said the supplier was offline' separately from 'observer saw HTTP timeout' or an approved supplier incident record. Never test or change a live system during exploratory research without authorization. Sensitive groups may need alternate, safer methods or no direct recruitment."
  },
  {
    "type": "heading",
    "id": "interview-leading",
    "text": "Compare a leading exchange with a neutral one",
    "level": 2
  },
  {
    "type": "paragraph",
    "text": "FICTIONAL leading exchange: Interviewer: 'The approval screen is slow and causes mistakes, right?' Clerk: 'Yes, it is frustrating.' The clerk may be agreeing with a suggested cause, and neither statement proves screen latency. Revised: 'Walk me through the most recent delayed approval. What happened first?' Clerk: 'I waited for a purchase number from the supplier.' Follow-up: 'At which handoff did the wait begin, and do you have an approved redacted example?' The revised answer suggests an external-data delay, but it is still testimony until checked. Neither exchange can be reported as real fieldwork."
  },
  {
    "type": "paragraph",
    "text": "Use silence and neutral follow-ups rather than offering candidate solutions. Ask for a counterexample: 'Tell me about a case that went smoothly', or 'When does this problem not happen?' If a participant contradicts a manager, do not declare one party dishonest. Different roles can observe different states of the same handoff. Preserve speaker role, claim, time/reference where permitted and confidence without claiming interviewers can mechanically extract objective truth."
  },
  {
    "type": "heading",
    "id": "interview-synthesis",
    "text": "Make notes auditable and separate claims from decisions",
    "level": 2
  },
  {
    "type": "paragraph",
    "text": "After a permitted session, store role-level, anonymized notes under access control; tag each entry as OBSERVATION, REPORTED, DOCUMENTED or INFERENCE. Link claims to lawful source references and capture what could falsify them. Compare answers within roles and across roles. Use the evidence to generate follow-up questions, not instant acceptance criteria. A repeatable note might read: 'Clerk, reported: three recent cases lacked purchase numbers; corroboration NOT_TESTED; next: authorized sanitized ticket sample'. It must not be rewritten as '33% of all repairs blocked' without a denominator."
  },
  {
    "type": "paragraph",
    "text": "The original practical must include two revised questions, one avoided leading question, a recruitment/consent plan, a worked case-vs-claim distinction, and at least one meaningful contradiction. If actual interviews are not feasible, draft a guide and carry actual interview evidence as NOT_TESTED. The sample transcript above remains FICTIONAL; do not fill missing research cells with it."
  },
  {
    "type": "resources",
    "title": "Interview research guidance",
    "resources": [
      {
        "title": "GOV.UK Service Manual — Conduct user research",
        "url": "https://www.gov.uk/service-manual/user-research/conduct-user-research"
      }
    ]
  }
];
export const stakeholderTriangulationBlocks: LessonBlock[] = [
  {
    "type": "paragraph",
    "text": "This focused reading follows interview technique and precedes the original stakeholder practical. It covers what to do when stakeholder claims disagree, permissions limit observation, or all sources share the same bias. A disagreement is a research task, not an excuse to choose the most senior person's answer."
  },
  {
    "type": "heading",
    "id": "triangulation-meaning",
    "text": "What triangulation does and does not prove",
    "level": 2
  },
  {
    "type": "paragraph",
    "text": "Triangulation compares evidence obtained through different people, methods, times or artifacts against one specific question. It can expose contradictions and narrow interpretations; it does not automatically prove causality or make correlated sources independent. Three managers repeating the same circulated spreadsheet are not three independent measurements. A clerk's recollection, an authorized redacted handoff log and a direct observation have different error mechanisms. Record the method, source dependency, measurement period and scope before using them to corroborate a claim."
  },
  {
    "type": "paragraph",
    "text": "The question 'why is this slow?' is too broad to answer with a vote. Decompose it into observable claims: request entered at T0, proof received at T1, supplier answered at T2, decision recorded at T3. The interval T2−T1 describes one wait; it does not by itself prove an IT change would reduce it. An approved comparison sample could show whether delay correlates with missing fields, vendor queue time, staff load or other causes. If records cannot be accessed, preserve UNKNOWN instead of drawing a precise diagram with imaginary timestamps."
  },
  {
    "type": "heading",
    "id": "triangulation-conflict",
    "text": "Trace a disagreement without manufacturing agreement",
    "level": 2
  },
  {
    "type": "paragraph",
    "text": "FICTIONAL evidence table: manager REPORTED 'approvals are delayed because the application is slow'; clerk REPORTED 'cases wait for supplier purchase numbers'; support operator DOCUMENTED 'most visible errors are missing identifiers, not page errors' in a fabricated teaching-only note. These statements conflict about cause and may refer to different periods. A defensible next action is to obtain authorized redacted handoff timestamps and a narrow, time-aligned sample, while checking whether users without access experience different outcomes. Do not rewrite the result as a proven vendor failure or a disproven manager."
  },
  {
    "type": "paragraph",
    "text": "A decision log should contain: assertion, evidence type/source, alternative explanation, level of confidence, affected roles omitted, authorization status, next test, owner and deadline or trigger. The strongest response can be DEFER or NARROW_SCOPE. A rejected hypothesis is progress; the capstone should be selected because evidence survives counterexamples, not because the first participant approved the idea."
  },
  {
    "type": "heading",
    "id": "triangulation-closure",
    "text": "Move from stakeholder claims to valid engineering requirements",
    "level": 2
  },
  {
    "type": "paragraph",
    "text": "A requirement is justified by an outcome and verified constraint, not merely a quotation. Convert the handoff uncertainty into a testable requirement only after the relevant actors and process owners agree on boundaries: e.g., 'For an authorized approved handoff, the operator can identify the current evidence status and missing documents without accessing unrelated customer details'. Its verification must test both the authorized workflow and the forbidden cross-owner lookup. Whether the interface uses a dashboard, email or API is a subsequent design choice."
  },
  {
    "type": "paragraph",
    "text": "Where authorization, evidence or representation is missing, write a research limitation, an owner and an ethical validation action. Invite a different role or opposing viewpoint to challenge the conclusion before writing code. Independent transfer: present your new capstone's two conflicting stakeholder claims and propose a discriminating observation that could make either side revise its claim. No actual interviews? Label both examples hypothetical and the real results NOT_TESTED."
  },
  {
    "type": "resources",
    "title": "Government research guidance",
    "resources": [
      {
        "title": "GOV.UK Service Manual — Analyse user research",
        "url": "https://www.gov.uk/service-manual/user-research/analyse-user-research"
      }
    ]
  }
];
