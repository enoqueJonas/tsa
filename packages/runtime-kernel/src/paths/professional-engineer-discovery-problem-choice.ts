import type { LessonBlock } from "../activities/content";

// A focused expansion of the FIRST ORIGINAL Capstone Problem Discovery reading.
// The next readings retain their original IDs and await their own subject-specific audit.
// Fictional records are teaching fixtures, not stakeholder evidence.
export const problemSelectionProofPython = "from dataclasses import dataclass\n\n@dataclass(frozen=True)\nclass Candidate:\n    name: str\n    harm_observed: bool\n    stakeholder_access_claimed: bool\n    stakeholder_access_verified: bool\n    evidence_collection_authorized: bool\n    scope_bounded: bool\n\ndef disposition(candidate: Candidate) -> str:\n    # This is a discovery gate, NOT a scoring formula for project value.\n    if not candidate.harm_observed:\n        return \"PROBLEM_UNVERIFIED\"\n    if not candidate.stakeholder_access_verified:\n        return \"ACCESS_UNVERIFIED\"\n    if not candidate.evidence_collection_authorized:\n        return \"CONSENT_OR_AUTHORITY_MISSING\"\n    if not candidate.scope_bounded:\n        return \"SCOPE_UNBOUNDED\"\n    return \"ELIGIBLE_FOR_FURTHER_DISCOVERY\"\n\n# Fictional records, not real fieldwork or proof of business viability.\nclaimed_access = Candidate(\"Tool-loan disputes\", True, True, False, True, True)\nno_consent = Candidate(\"Warranty backlog\", True, True, True, False, True)\nunbounded = Candidate(\"All municipal services\", True, True, True, True, False)\nbounded = Candidate(\"Warranty handoff in one branch\", True, True, True, True, True)\nno_problem = Candidate(\"Blockchain showcase\", False, True, True, True, True)\n\nassert disposition(claimed_access) == \"ACCESS_UNVERIFIED\"\nassert disposition(no_consent) == \"CONSENT_OR_AUTHORITY_MISSING\"\nassert disposition(unbounded) == \"SCOPE_UNBOUNDED\"\nassert disposition(no_problem) == \"PROBLEM_UNVERIFIED\"\nassert disposition(bounded) == \"ELIGIBLE_FOR_FURTHER_DISCOVERY\"\n\nfor candidate in (claimed_access, no_consent, unbounded, no_problem, bounded):\n    print(f\"{candidate.name}: {disposition(candidate)}\")\nprint(\"DISCOVERY_SELECTION_GATES_PASS\")\n";

export const problemChoiceBlocks: LessonBlock[] = [
  {
    "type": "heading",
    "level": 2,
    "id": "candidate-0",
    "text": "A problem is not a feature request"
  },
  {
    "type": "paragraph",
    "text": "Start with the situation experienced by people, not the feature or stack you want to demonstrate. A problem statement should identify an affected actor, the triggering workflow, what currently goes wrong, its consequences and the evidence that supports those claims. “Build a blockchain lending app” is a proposed intervention. “Staff cannot reliably determine which item is on loan when a shift changes” is a candidate problem, but it remains a hypothesis until observations or records support it. A technology can be justified only after the mechanism of the failure and constraints are understood."
  },
  {
    "type": "paragraph",
    "text": "Distinguish symptoms, causal explanations and interventions. A queue of unresolved warranties is observable if you can inspect a real authorized queue. “Staff are inefficient” is a causal accusation not established by that observation. The cause might instead be missing documents, an approval rule, a supplier delay or software downtime. A digitized workflow could speed up a bad process. In discovery, write what would change your mind about the underlying cause before drawing an architecture."
  },
  {
    "type": "heading",
    "level": 2,
    "id": "candidate-3",
    "text": "Evidence has a type, source and permission boundary"
  },
  {
    "type": "paragraph",
    "text": "A reported complaint, a personally observed workflow, an existing timestamped record and an engineer's inference are different kinds of evidence. A stakeholder claiming access is not proof that you can interview, observe or safely use data. Make a simple evidence register with claim, evidence kind, who provided it, when it was obtained, permission to use it, independent corroboration and remaining contradiction. Do not silently convert a hypothetical scenario into empirical research."
  },
  {
    "type": "paragraph",
    "text": "Test access and safety early: can an authorized person show the workflow, can you collect the minimum data without exposing third parties, and can a representative reviewer challenge your interpretation? If access is unverified, record ACCESS_UNVERIFIED rather than claiming a capstone has stakeholders. If records contain private information, document a consent/minimization approach and use synthetic teaching data until lawful access is established. A socially important problem can still be an unsuitable capstone if its claims cannot be investigated ethically."
  },
  {
    "type": "heading",
    "level": 2,
    "id": "candidate-6",
    "text": "Compare two imperfect candidates, not two technologies"
  },
  {
    "type": "paragraph",
    "text": "Consider two FICTIONAL options. A tool-lending group reports missing items and one friend says interviews should be easy. That is a plausible outcome problem with unverified access. A warranty desk has a bounded handoff delay, independently observed in an authorized sample, and a supervisor allows sanitized workflow investigation. The second option currently has stronger discovery feasibility even if the first seems more exciting. Neither option is automatically a justified product: the candidate could still be rejected if delay is not material, causes are outside scope or the affected people do not want an intervention."
  },
  {
    "type": "paragraph",
    "text": "Use non-compensatory gates before preference scoring: a defined user harm, an ethically accessible evidence route, a bounded first workflow and a plausible way to measure improvement. A high novelty score cannot compensate for missing permission or nonexistent users. When multiple candidates survive, compare impact, technical decision depth, operational complexity and realistic time budget. Record assumptions and uncertainties alongside any rankings; manufactured numerical weights only disguise weak evidence."
  },
  {
    "type": "heading",
    "level": 2,
    "id": "candidate-9",
    "text": "A safe decision has more than one outcome"
  },
  {
    "type": "paragraph",
    "text": "The selection result should be one of: investigate further, narrow the boundary, obtain access/permission, or reject/defer. “Eligible for further discovery” is deliberately weaker than “approved to build.” Suppose an authorized warranty workflow is available but the backlog only reflects a temporary supplier outage: the intervention may be operational rather than software. Conversely, a real problem with inaccessible data may warrant interviewing different authorized roles, using public documents, or choosing another capstone; fabricating interviews is never a valid alternative."
  },
  {
    "type": "paragraph",
    "text": "Define a falsification question for each candidate: what observation would show there is no meaningful problem, no achievable scope, or no right to process the data? Draft a measurable baseline only after establishing the denominator and capture method, such as the proportion of completed warranty handoffs requiring rework per week. State sampling limitations. The final discovery decision should cite evidence, missing evidence, exclusions, the next test and the condition under which you would reverse course."
  },
  {
    "type": "heading",
    "level": 2,
    "id": "candidate-12",
    "text": "Execute the fail-closed decision gate"
  },
  {
    "type": "paragraph",
    "text": "The following Python 3 standard-library fixture makes five independent missing-evidence conditions visible. It is a teaching example using FICTIONAL booleans, not a substitute for fieldwork or a valid domain score. The gate asks whether a candidate is eligible for MORE discovery, not whether it merits deployment. Enter a true value only when the evidence register justifies it. The deliberately contradictory case has access CLAIMED but not VERIFIED, so it must remain blocked."
  },
  {
    "type": "code",
    "language": "python",
    "caption": "Exact Python 3 classroom decision gate; not fieldwork or automatic project approval",
    "code": "from dataclasses import dataclass\n\n@dataclass(frozen=True)\nclass Candidate:\n    name: str\n    harm_observed: bool\n    stakeholder_access_claimed: bool\n    stakeholder_access_verified: bool\n    evidence_collection_authorized: bool\n    scope_bounded: bool\n\ndef disposition(candidate: Candidate) -> str:\n    # This is a discovery gate, NOT a scoring formula for project value.\n    if not candidate.harm_observed:\n        return \"PROBLEM_UNVERIFIED\"\n    if not candidate.stakeholder_access_verified:\n        return \"ACCESS_UNVERIFIED\"\n    if not candidate.evidence_collection_authorized:\n        return \"CONSENT_OR_AUTHORITY_MISSING\"\n    if not candidate.scope_bounded:\n        return \"SCOPE_UNBOUNDED\"\n    return \"ELIGIBLE_FOR_FURTHER_DISCOVERY\"\n\n# Fictional records, not real fieldwork or proof of business viability.\nclaimed_access = Candidate(\"Tool-loan disputes\", True, True, False, True, True)\nno_consent = Candidate(\"Warranty backlog\", True, True, True, False, True)\nunbounded = Candidate(\"All municipal services\", True, True, True, True, False)\nbounded = Candidate(\"Warranty handoff in one branch\", True, True, True, True, True)\nno_problem = Candidate(\"Blockchain showcase\", False, True, True, True, True)\n\nassert disposition(claimed_access) == \"ACCESS_UNVERIFIED\"\nassert disposition(no_consent) == \"CONSENT_OR_AUTHORITY_MISSING\"\nassert disposition(unbounded) == \"SCOPE_UNBOUNDED\"\nassert disposition(no_problem) == \"PROBLEM_UNVERIFIED\"\nassert disposition(bounded) == \"ELIGIBLE_FOR_FURTHER_DISCOVERY\"\n\nfor candidate in (claimed_access, no_consent, unbounded, no_problem, bounded):\n    print(f\"{candidate.name}: {disposition(candidate)}\")\nprint(\"DISCOVERY_SELECTION_GATES_PASS\")\n"
  },
  {
    "type": "heading",
    "level": 2,
    "id": "candidate-15",
    "text": "Break the rule before trusting it"
  },
  {
    "type": "paragraph",
    "text": "Copy the program into a fresh file and run `python3 discovery_selection.py`. Expect four non-ready outcomes and one `ELIGIBLE_FOR_FURTHER_DISCOVERY`, followed by `DISCOVERY_SELECTION_GATES_PASS`. In a disposable copy, change `stakeholder_access_verified` to `stakeholder_access_claimed` only in the access condition; the first assertion must fail because a promise is not verified access. Then remove the permission gate; the unauthorized case must fail. The point is not to optimize a toy rubric, but to see how one invalid inference silently promotes a real project decision."
  },
  {
    "type": "paragraph",
    "text": "Independent transfer: write two NEW problem statements in a domain other than the fictional tool/warranty examples. For each, show one observed or properly sourced harm, one alternative causal explanation, a permission/access plan, a bounded first workflow, a measurable outcome and one piece of disconfirming evidence that would cause rejection. Use NOT_VERIFIED where appropriate. Do not choose a stack, product name or deployment architecture until the evidence supports the problem boundary."
  },
  {
    "type": "resources",
    "title": "Primary discovery practice",
    "resources": [
      {
        "title": "GOV.UK Service Manual — User research",
        "url": "https://www.gov.uk/service-manual/user-research"
      }
    ]
  }
];
