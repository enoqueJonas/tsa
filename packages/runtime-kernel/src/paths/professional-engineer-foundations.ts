import type { Lesson } from "./lesson";

/** New independently navigable first-principles lessons, preserving old Professional Engineer activity IDs. */
export const professionalDecisionFoundations: Lesson[] = [
  {
    "id": "professional-practice-accountable-engineering-decisions",
    "title": "Accountable Decisions: Evidence, Authority, Harm and Dissent",
    "activities": [
      {
        "id": "professional-practice-accountable-engineering-decisions-reading",
        "title": "Accountable Decisions: Evidence, Authority, Harm and Dissent",
        "estimatedMinutes": 45,
        "content": {
          "type": "reading",
          "body": "Engineers can establish facts, estimate risk and recommend action; they cannot manufacture authority or pretend a manager's request converts failed evidence into a pass. Professional judgment begins by distinguishing the observed technical state, the predicted consequences, the policy or ethical constraint and the person authorized to decide. These are four different claims.",
          "blocks": [
            {
              "type": "paragraph",
              "text": "Engineers can establish facts, estimate risk and recommend action; they cannot manufacture authority or pretend a manager's request converts failed evidence into a pass. Professional judgment begins by distinguishing the observed technical state, the predicted consequences, the policy or ethical constraint and the person authorized to decide. These are four different claims."
            },
            {
              "type": "heading",
              "id": "what-you-will-learn",
              "text": "What you must be able to demonstrate",
              "level": 2
            },
            {
              "type": "list",
              "items": [
                "Create a defensible recommendation for a high-consequence decision and label it provisional until evidence and authorized escalation are recorded",
                "Run the exact example without dependencies, capture both output markers, then deliberately change the classification so a failed restore claims TECHNICALLY_SUPPORTED. Show an assertion rejects the change",
                "Document stakeholder benefit/harm, alternative actions, minimum verification, deadline, residual risk and the authority boundary; explicitly reject reclassifying FAIL to PASS"
              ]
            },
            {
              "type": "heading",
              "id": "part-1",
              "text": "Start with a decision you can actually falsify",
              "level": 2
            },
            {
              "type": "paragraph",
              "text": "Scenario: a scheduled deployment has passed functional checks, but a restore drill failed. The release owner demands a green sign-off because a contractual date is approaching. Record the actual failed restore output before proposing a solution. A deadline describes pressure; it is not counterevidence that recovery works."
            },
            {
              "type": "paragraph",
              "text": "Separate three possible actions: (A) ship normally and hide the failure, (B) block launch pending a verified recovery fix, (C) request documented, time-bounded risk acceptance by the authorized role after scope, exposure and contingency are understood. A is dishonest. B is a defensible provisional recommendation. C is a governance route, not automatic permission to misstate the technical result."
            },
            {
              "type": "heading",
              "id": "part-2",
              "text": "Walk the decision trace",
              "level": 2
            },
            {
              "type": "paragraph",
              "text": "Observation: the restore drill produced an error and no recovered data. Claim: recoverability has not been demonstrated. Consequence: if a destructive incident occurs, the proposed recovery objective is currently unsupported. Stakeholders: users, operators, service owner, incident response and affected third parties. Evidence to collect: failed drill ID, artifacts, impact assumptions, reversible workaround, next executable test, escalation record and named decision-maker."
            },
            {
              "type": "paragraph",
              "text": "State options and consequences explicitly: delay has scheduling cost; proceeding without verified recovery creates residual data-loss risk. Do not choose based on rhetorical certainty. Choose the next evidence-gathering action and a stop condition (e.g., production release remains blocked until recovered state and integrity are observed or an authorized exception is formally accepted without falsifying results)."
            },
            {
              "type": "heading",
              "id": "part-3",
              "text": "Approval is not the same as proof",
              "level": 2
            },
            {
              "type": "paragraph",
              "text": "Formal risk acceptance can document who knowingly owns a residual risk and under what constraints, but it does not change a failed test to PASS or waive professional obligations automatically. In a real organization, identify applicable obligations, escalation channels and specialist advice; do not invent universal authority or treat this lesson as legal advice."
            },
            {
              "type": "heading",
              "id": "part-4",
              "text": "Run a strict claim-evidence oracle",
              "level": 2
            },
            {
              "type": "paragraph",
              "text": "Save the exact Python program below as professional_claims.py and run `python3 professional_claims.py` with Python 3.11+. Change the failed restore to PASS and observe the technical status; then remove the restore evidence entirely and observe the NOT_PROVEN status. The final unsafe function is intentionally wrong: its presence-of-any-evidence rule claims success despite a failed drill. Explain which assertion would catch a mutation that treats NOT_TESTED as PASS."
            },
            {
              "type": "heading",
              "id": "executable-consistency-check",
              "text": "Reproduce a deliberately misleading claim",
              "level": 2
            },
            {
              "type": "code",
              "language": "python",
              "caption": "Professional decisions — exact Python claim/evidence states and unsafe approval contrast",
              "code": "\"\"\"Release evidence consistency check, not an ethical decision engine.\"\"\"\nREQUIRED = (\"cross_team_authorization\", \"restore_drill\")\n\ndef technical_evidence_state(evidence: dict[str, str]) -> str:\n    observed = [evidence.get(name, \"NOT_TESTED\") for name in REQUIRED]\n    if any(result == \"FAIL\" for result in observed):\n        return \"BLOCKED\"\n    if all(result == \"PASS\" for result in observed):\n        return \"TECHNICALLY_SUPPORTED\"\n    return \"NOT_PROVEN\"\n\nrelease = {\"cross_team_authorization\": \"PASS\", \"restore_drill\": \"FAIL\"}\nunknown = {\"cross_team_authorization\": \"PASS\"}\nverified = {\"cross_team_authorization\": \"PASS\", \"restore_drill\": \"PASS\"}\n\nassert technical_evidence_state(release) == \"BLOCKED\"\nassert technical_evidence_state(unknown) == \"NOT_PROVEN\"\nassert technical_evidence_state(verified) == \"TECHNICALLY_SUPPORTED\"\nprint(\"PROFESSIONAL_CLAIM_GATE_FAIL_UNKNOWN_PASS_DISTINCT\")\n\n# A common false positive: treating any existing test report as sufficient.\ndef unsafe_any_evidence(evidence: dict[str, str]) -> str:\n    return \"TECHNICALLY_SUPPORTED\" if evidence else \"NOT_PROVEN\"\n\nassert unsafe_any_evidence(release) == \"TECHNICALLY_SUPPORTED\"\nassert technical_evidence_state(release) != unsafe_any_evidence(release)\nprint(\"PROFESSIONAL_UNSAFE_APPROVAL_EXPOSED\")\n# No script can determine who may accept risk, whether a release is ethically\n# justified, or whether technical evidence covers the right system."
            },
            {
              "type": "paragraph",
              "text": "Expected output: PROFESSIONAL_CLAIM_GATE_FAIL_UNKNOWN_PASS_DISTINCT and PROFESSIONAL_UNSAFE_APPROVAL_EXPOSED. Changing the oracle to treat missing evidence as success must fail; the script itself does not assess moral acceptability."
            },
            {
              "type": "callout",
              "title": "What this does not prove",
              "tone": "steward",
              "body": "The example is a teaching oracle for consistency, not real stakeholder, safety, regulatory, runtime, or human-transfer evidence. A script passing is not professional authorization or an independent review."
            }
          ]
        }
      },
      {
        "id": "professional-practice-accountable-engineering-decisions-practice",
        "title": "Independent practice: Accountable Decisions: Evidence, Authority, Harm and Dissent",
        "estimatedMinutes": 70,
        "content": {
          "type": "practical",
          "objective": "Create a defensible recommendation for a high-consequence decision and label it provisional until evidence and authorized escalation are recorded.",
          "scenario": "Work from your NEW capstone domain and traceable evidence, not an invented Steward release claim. If authentic stakeholders are unavailable, use a clearly labeled scenario fixture and report that limitation.",
          "instructions": [
            "Run the exact example without dependencies, capture both output markers, then deliberately change the classification so a failed restore claims TECHNICALLY_SUPPORTED. Show an assertion rejects the change.",
            "Document stakeholder benefit/harm, alternative actions, minimum verification, deadline, residual risk and the authority boundary; explicitly reject reclassifying FAIL to PASS.",
            "On the independent capstone choose an unfamiliar deployment or privacy issue. Produce a different, not copied, decision record; invite a reviewer to introduce new evidence that changes the answer.",
            "Make the final decision record record real execution only when actually observed; otherwise mark it scenario-based/NOT TESTED."
          ],
          "deliverables": [
            "One inspectable decision/discovery artifact",
            "Provenance and explicit uncertainty",
            "A deliberately plausible wrong interpretation and its counterevidence",
            "Revisit trigger and independent transfer prompt"
          ],
          "completionCriteria": [
            "A reviewer can distinguish observed results from assumptions and decisions.",
            "The negative variation reveals why a superficially acceptable answer is insufficient.",
            "Decisions state scope, owner, residual uncertainty and when to reopen."
          ]
        }
      },
      {
        "id": "professional-practice-accountable-engineering-decisions-check",
        "title": "Check: Accountable Decisions: Evidence, Authority, Harm and Dissent",
        "estimatedMinutes": 15,
        "content": {
          "type": "reflection",
          "prompt": "1. What changes when a test is NOT TESTED rather than FAIL?\n2. What could a risk-accepting manager authorize without being able to change measured facts?\n3. When should a professional refuse to sign an unqualified technical assurance?\n4. What new evidence could reverse the provisional block recommendation?"
        }
      }
    ]
  }
];
export const capstoneDiscoveryFoundations: Lesson[] = [
  {
    "id": "capstone-problem-discovery-evidence-provenance",
    "title": "Discovery Evidence: Observation, Testimony, Assumption and Inference",
    "activities": [
      {
        "id": "capstone-problem-discovery-evidence-provenance-reading",
        "title": "Discovery Evidence: Observation, Testimony, Assumption and Inference",
        "estimatedMinutes": 45,
        "content": {
          "type": "reading",
          "body": "Problem discovery is not brainstorming a preferred technology until someone approves it. It is a disciplined attempt to learn whose current situation is harmful, how often it occurs, why existing workarounds are inadequate and what changed outcome would count as improvement. An interview statement is evidence that a person said something; it is not by itself proof of population-wide frequency or the cause of the problem.",
          "blocks": [
            {
              "type": "paragraph",
              "text": "Problem discovery is not brainstorming a preferred technology until someone approves it. It is a disciplined attempt to learn whose current situation is harmful, how often it occurs, why existing workarounds are inadequate and what changed outcome would count as improvement. An interview statement is evidence that a person said something; it is not by itself proof of population-wide frequency or the cause of the problem."
            },
            {
              "type": "heading",
              "id": "what-you-will-learn",
              "text": "What you must be able to demonstrate",
              "level": 2
            },
            {
              "type": "list",
              "items": [
                "Produce a provenance table with at least one actual or clearly simulated observation, interview statement, assumption and inference for a non-Steward domain",
                "Run the exact example, reproduce the two output markers, then weaken the supported_observation predicate so an unchecked assumption passes; demonstrate that the original assertion fails",
                "Write two alternative neutral problem statements for two distinct domain candidates; show what would falsify each and which evidence remains unavailable"
              ]
            },
            {
              "type": "heading",
              "id": "part-1",
              "text": "Four different evidence categories",
              "level": 2
            },
            {
              "type": "paragraph",
              "text": "Observation: a timestamped incident trace shows three failed retries. Testimony: one customer says a transfer took 20 minutes. Assumption: all customers require offline operation. Inference: the current backend may be causing delay. Each is useful, but each supports a different strength of claim. Store source, conditions and what would contradict it; do not silently upgrade testimony or assumption into a confirmed universal requirement."
            },
            {
              "type": "paragraph",
              "text": "Leading questions bias evidence: 'Wouldn't offline mode make this better?' embeds a desired solution. Instead ask, 'What happened the last time this workflow failed? What did you do next? How much time did it take?' Follow up with counterexamples. Obtain consent, minimize personal data, and label fictional interviews as simulated."
            },
            {
              "type": "heading",
              "id": "part-2",
              "text": "Build a falsifiable problem statement",
              "level": 2
            },
            {
              "type": "paragraph",
              "text": "Use the pattern: [specific actor] currently experiences [observable failure] during [workflow/context], resulting in [cost/harm], supported by [source+time window]. A candidate success measure is [observable outcome] within [bounded context]. A problem statement can be rejected if evidence contradicts its frequency, severity, actor or hypothesized cause."
            },
            {
              "type": "paragraph",
              "text": "Worked fixture: in three synthetic test traces, a filing request timed out; one user interview reports manual resubmission, but there is no population baseline. Sound conclusion: investigate retry outcome visibility and quantify frequency. Unsound conclusion: 'all users need Kafka'—this jumps to an implementation and claims unsupported generality."
            },
            {
              "type": "heading",
              "id": "part-3",
              "text": "Transfer to a new domain rather than Steward",
              "level": 2
            },
            {
              "type": "paragraph",
              "text": "Professional Engineer must prove an independently scoped second system. Steward is a reference for engineering habits, not an allowable capstone to copy. Evaluate at least two unrelated candidate domains and record why the stronger problem is researchable, consequential and bounded. Do not preselect Kubernetes, microservices, blockchain or another technology in the problem statement."
            },
            {
              "type": "heading",
              "id": "part-4",
              "text": "Execute the evidence-labeling proof",
              "level": 2
            },
            {
              "type": "paragraph",
              "text": "Copy the following code to discovery_provenance.py and run `python3 discovery_provenance.py`. The result distinguishes an independently checked observation from an assumption and a reported interview. The intentionally wrong source-presence oracle demonstrates how citing a document can still produce unsupported confidence."
            },
            {
              "type": "heading",
              "id": "executable-consistency-check",
              "text": "Reproduce a deliberately misleading claim",
              "level": 2
            },
            {
              "type": "code",
              "language": "python",
              "caption": "Capstone discovery — evidence provenance and source-presence false-confidence case",
              "code": "\"\"\"Evidence provenance illustration. This cannot replace real interviews.\"\"\"\nfrom dataclasses import dataclass\n\n@dataclass(frozen=True)\nclass Claim:\n    text: str\n    kind: str\n    source: str\n    independently_checked: bool\n\ndef supported_observation(claim: Claim) -> bool:\n    return (claim.kind == \"observation\" and\n            claim.independently_checked and\n            bool(claim.source.strip()))\n\nclaims = [\n    Claim(\"Three retries failed on the test trace\", \"observation\",\n          \"trace-fixture-001\", True),\n    Claim(\"All customers need offline mode\", \"assumption\",\n          \"product-team-hypothesis\", False),\n    Claim(\"A single customer reported a 20 minute delay\", \"interview\",\n          \"consented-interview-note-01\", False),\n]\nassert supported_observation(claims[0])\nassert not supported_observation(claims[1])\nassert not supported_observation(claims[2])\nprint(\"DISCOVERY_OBSERVED_ASSUMED_REPORTED_SEPARATED\")\n\n# An interview report is valid evidence THAT this person reported something.\n# It is not automatically a verified universal claim about all customers.\ndef unsafe_credible(claim: Claim) -> bool:\n    return bool(claim.source)\nassert unsafe_credible(claims[1]) and not supported_observation(claims[1])\nprint(\"DISCOVERY_SOURCE_PRESENCE_FALSE_CONFIDENCE_EXPOSED\")"
            },
            {
              "type": "paragraph",
              "text": "Expected output: DISCOVERY_OBSERVED_ASSUMED_REPORTED_SEPARATED and DISCOVERY_SOURCE_PRESENCE_FALSE_CONFIDENCE_EXPOSED. That detects a false-confidence mistake, not whether any person was actually interviewed."
            },
            {
              "type": "callout",
              "title": "What this does not prove",
              "tone": "steward",
              "body": "The example is a teaching oracle for consistency, not real stakeholder, safety, regulatory, runtime, or human-transfer evidence. A script passing is not professional authorization or an independent review."
            }
          ]
        }
      },
      {
        "id": "capstone-problem-discovery-evidence-provenance-practice",
        "title": "Independent practice: Discovery Evidence: Observation, Testimony, Assumption and Inference",
        "estimatedMinutes": 70,
        "content": {
          "type": "practical",
          "objective": "Produce a provenance table with at least one actual or clearly simulated observation, interview statement, assumption and inference for a non-Steward domain.",
          "scenario": "Work from your NEW capstone domain and traceable evidence, not an invented Steward release claim. If authentic stakeholders are unavailable, use a clearly labeled scenario fixture and report that limitation.",
          "instructions": [
            "Run the exact example, reproduce the two output markers, then weaken the supported_observation predicate so an unchecked assumption passes; demonstrate that the original assertion fails.",
            "Write two alternative neutral problem statements for two distinct domain candidates; show what would falsify each and which evidence remains unavailable.",
            "Rewrite three leading interview questions into open, behavioral questions. Explicitly separate unverified reports from independently checked outcomes.",
            "Prepare a discovery brief with affected actors, frequency/severity evidence, current workaround, baseline measurement plan, competing interpretations, ethical data handling and a decision on what to learn next.",
            "Ask another engineer to introduce an unseen counterexample that would reverse your candidate choice; document the revision or defensible refusal."
          ],
          "deliverables": [
            "One inspectable decision/discovery artifact",
            "Provenance and explicit uncertainty",
            "A deliberately plausible wrong interpretation and its counterevidence",
            "Revisit trigger and independent transfer prompt"
          ],
          "completionCriteria": [
            "A reviewer can distinguish observed results from assumptions and decisions.",
            "The negative variation reveals why a superficially acceptable answer is insufficient.",
            "Decisions state scope, owner, residual uncertainty and when to reopen."
          ]
        }
      },
      {
        "id": "capstone-problem-discovery-evidence-provenance-check",
        "title": "Check: Discovery Evidence: Observation, Testimony, Assumption and Inference",
        "estimatedMinutes": 15,
        "content": {
          "type": "reflection",
          "prompt": "1. Why does citing a source not automatically make a claim confirmed?\n2. What makes 'users need blockchain' a poor problem statement?\n3. How would you avoid drawing national conclusions from three convenience interviews?\n4. What new observation would invalidate your chosen problem frequency?"
        }
      }
    ]
  }
];
