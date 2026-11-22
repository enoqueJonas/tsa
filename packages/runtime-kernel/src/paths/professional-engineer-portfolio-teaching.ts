import type { LearningResource } from "../activities/content";
/** Seven evidence-centered original and new topics; fictional examples are not learner or employment evidence. */
export interface PortfolioLens {title:string;sections:{heading:string;paragraphs:string[]}[];practice:string[];criteria:string[];resource:LearningResource;}
export const portfolioLenses:Record<string,PortfolioLens> = {
  "evidence-portfolio": {
    "title": "Engineering Evidence Portfolio",
    "sections": [
      {
        "heading": "A capability claim is a proposition a reviewer can try to falsify",
        "paragraphs": [
          "State a capability narrowly enough that an outsider can reconstruct what you did: 'I enforced object-specific authorization in my independent lending prototype, verified by signed cross-owner request and unchanged DB state' is stronger than 'I know security'. The latter names a field; the former names the owned behavior, test boundary and proof. A source repository, CI log and diagram are artifacts, but artifacts do not automatically establish your role, the result or the quality of the oracle.",
          "A useful claim record has a stable ID, capability, project and domain, author contribution, source commit or version, environment, exact executed step, expected and observed result, negative case, limitation and permission to disclose. When a result was provided by the academy's curriculum example, classify it as GUIDED or SIMULATED. Do not label a published example independently implemented simply because you copied and ran it."
        ]
      },
      {
        "heading": "Build a chain from problem to correction, not a scrapbook",
        "paragraphs": [
          "For one fictional cooperative tool-loan feature, the arc is business problem → state rule → test that initially fails → implementation change → actual data outcome → discovered failure → revised decision. An architecture picture alone omits the hard parts: what was wrong, what would have made the test fail and how the decision was corrected. Compare that chain with a screenshot gallery; the gallery cannot prove causality or ownership.",
          "Select only a few complete artifacts with different engineering claims. A strong portfolio could use a model/invariant, a reproducible release, a recovery experiment, and an ethical decision under uncertainty. Each can link to several files but should culminate in one falsifiable conclusion. A reviewer should not need to trust the learner's narrative on faith."
        ]
      },
      {
        "heading": "Make honest gaps legible",
        "paragraphs": [
          "Distinguish EXECUTED_AND_VERIFIED, GUIDED_RUN, SIMULATED, NOT_TESTED and FAILED. A passing local SQLite recovery fixture cannot prove PostgreSQL RTO or production operations; a clean pipeline cannot prove a human signed off a release. The labels change what can be claimed, not the worth of the work.",
          "Practical transfer: use one claim from Steward and one from the genuinely new second system. Expose a negative test on each, compare what was shared in method versus newly chosen in architecture, and name the capstone decisions you cannot verify without outside review."
        ]
      }
    ],
    "practice": [
      "Build a 4-claim evidence register across different TSA schools with source revision, your actual contribution, observable negative and limitation.",
      "For the real second capstone, contrast one novel domain decision against the closest Steward practice; state what cannot be independently proven."
    ],
    "criteria": [
      "Each claim can be falsified against a concrete artifact and observed result.",
      "Guided and independently implemented evidence are visibly separated."
    ],
    "resource": {
      "title": "Write the Docs — Docs as Code",
      "url": "https://www.writethedocs.org/guide/docs-as-code/",
      "kind": "reference",
      "purpose": "Use for mechanism and ethical scope; reading the reference is not verification of competency."
    }
  },
  "portfolio-claim-calibration": {
    "title": "Claim Calibration, Provenance and Evidence Quality",
    "sections": [
      {
        "heading": "Evidence strength depends on provenance and the actual boundary",
        "paragraphs": [
          "An artifact link can point to a source file, but that only establishes that the file exists at a revision. To claim behavior, identify execution details: inputs and fixtures, environment, command, timestamps, observed output and independent observations where possible. To claim authorship, identify commits and contribution scope; Git commit authorship is a useful signal but is not proof of sole conceptual design.",
          "Use provenance questions before publishing: who generated the evidence, which system produced it, was data synthetic, what precisely was inspected and can another engineer run the check? A screenshot of green tests may be genuine while omitting that the test never checked a forbidden side effect. Provenance and validity must be evaluated separately."
        ]
      },
      {
        "heading": "Calibrate claims without a single magic score",
        "paragraphs": [
          "An observation may be authentic but too narrow for the proposed claim. A test executed on a local in-memory DB can support 'partial unique index rejected a second local active loan', not 'our enterprise database survives every race'. A direct peer observation can strengthen confidence in reproducibility but does not silently convert a test of the wrong property into proof.",
          "A classification model can distinguish UNVERIFIED_LINK, EXECUTED_LOCAL_ONLY, REVIEWED_TRANSFER and NOT_TESTED. This is a teaching model, not a substitute for actual engineering judgment; the audience should be able to inspect the underlying records and disagree with your classification."
        ]
      },
      {
        "heading": "Adversarial falsification of a chosen artifact",
        "paragraphs": [
          "Pick your strongest apparent claim and invent a plausible alternative explanation: the green run used prepared state; the failure was a missing service, not authorization; the second system copied the first; the contribution was assembled by teammates. Identify one new test or reviewer action that discriminates these possibilities.",
          "Produce a concise evidence ledger with a claim, real origin, one negative case, exact limitation and minimum additional proof. Label missing sources NOT_TESTED rather than linking to plausible but irrelevant CI runs."
        ]
      }
    ],
    "practice": [
      "For three claims, audit artifact provenance, authorship, environment, input, negative oracle and disclosure permission; mark weak claims NOT_TESTED.",
      "Run the published claim classifier, then use a missing negative test to demonstrate why link-only validation cannot establish competence."
    ],
    "criteria": [
      "Reviewer can tell artifact existence from verified behavior.",
      "A claim never expands beyond the environment or scenario that generated its evidence."
    ],
    "resource": {
      "title": "The Turing Way — Reproducible Research",
      "url": "https://book.the-turing-way.org/reproducible-research/reproducible-research",
      "kind": "reference",
      "purpose": "Use for mechanism and ethical scope; reading the reference is not verification of competency."
    }
  },
  "reflective-practice": {
    "title": "Reflective Engineering Practice",
    "sections": [
      {
        "heading": "A postmortem reconstructs a timeline without rewriting history",
        "paragraphs": [
          "Reflection is an attempt to learn why a decision was reasonable or unjustified *given what was known then*. Separate contemporaneous documents from later discoveries. An ADR written on 12 June that called for a shared library before any second consumer existed is not evidence that it was justified; editing it afterward to claim foresight destroys useful history.",
          "For an explicitly fictional tool library, imagine a designer added message queues on day one to support notifications. The actual problem later required one synchronous, auditable item custody record. Document the original assumption, the first contradicting test, the cost of complexity, who made the decision and the safer alternative; do not assign motives or causes without records."
        ]
      },
      {
        "heading": "A surprising successful outcome can conceal a weak decision",
        "paragraphs": [
          "A risky implementation can pass because no one triggered its failure. Conversely, a well-reasoned decision can fail due to missing information. Distinguish process quality from outcome quality: list available options, expected trade-offs, actual observables and what would have falsified your bet. This avoids both self-congratulation and hindsight blame.",
          "Work through one case where you were right for the wrong reason and one where you chose a defensible trade-off that produced a negative result. If these cannot be supported from actual records, use a clearly labeled hypothetical and do not claim personal experience."
        ]
      },
      {
        "heading": "Turn reflection into a changed future behavior",
        "paragraphs": [
          "Choose a concrete trigger and new action: 'Before extracting a shared test utility, require two actual consumers with passing independent baselines' is testable. 'Communicate better' is not. Specify how you will measure the new habit—e.g. review two ADRs in the next quarter and confirm they include dated assumptions and counterevidence.",
          "Use at least one domain design, one incident/recovery and one collaboration or ethical decision from separate sources. Where a project had no real incident, state NOT EXPERIENCED and identify a safe future rehearsal rather than inventing a heroic postmortem."
        ]
      }
    ],
    "practice": [
      "Reconstruct three actual decisions using contemporaneous facts and later observations without editing prior ADRs.",
      "Write one clear counterfactual and a new testable engineering habit; if the real event did not occur, mark hypothetical."
    ],
    "criteria": [
      "The reflection avoids hindsight and distinguishes causality from result.",
      "An action has a measurable trigger, owner and future verification."
    ],
    "resource": {
      "title": "ACM Code of Ethics",
      "url": "https://www.acm.org/code-of-ethics",
      "kind": "reference",
      "purpose": "Use for mechanism and ethical scope; reading the reference is not verification of competency."
    }
  },
  "engineering-decision-postmortems": {
    "title": "Engineering Decision Reconstruction and Causal Reasoning",
    "sections": [
      {
        "heading": "Reconstruct chronology before proposing root cause",
        "paragraphs": [
          "An event timeline orders what was observable when, separate from later inference. 'Job failed at 09:10', 'disk space warning was recorded at 09:12' and 'restore drill recovered at 10:40' are events; 'bad infrastructure caused it' is a hypothesis until discriminating evidence exists. Do not reverse chronology to make the explanation tidy.",
          "A useful record contains time, observed signal, source, unknowns, decision-maker, intervention, intended effect and later measured outcome. Timezones and clock skew matter when correlating systems; if timestamps are untrusted, state approximate order rather than fabricating precision."
        ]
      },
      {
        "heading": "Find a cause with a counterfactual test",
        "paragraphs": [
          "A service outage coinciding with deployment does not prove deployment caused it. Compare healthy and failing instances, trace a dependency or version diff, and ask what outcome would occur if the suspected factor were absent. The hypothesis becomes more credible when a bounded reproduction or log trace discriminates alternatives.",
          "In a fictional lending service, a failed checkout after a new migration could be a schema mismatch, a missing secret or an external eligibility timeout. A generic 500 response cannot tell these apart. Each alternative suggests a different safe diagnostic; untested alternatives remain open."
        ]
      },
      {
        "heading": "Avoid hindsight certainty and repair-by-story",
        "paragraphs": [
          "A legitimate postmortem has a trigger, scope, evidence archive, contributing mechanisms, user impact, what worked, what remains unknown, remediations and owner. Do not convert a temporal sequence into a single root cause because reviewers expect a neat story.",
          "Transfer challenge: use a real commit, an observed negative run and the subsequent decision update. State one alternative hypothesis that remains viable and a small future test that could refute your preferred explanation."
        ]
      }
    ],
    "practice": [
      "Assemble an evidence-timestamped decision timeline from one actual failure, including alternative causes and discriminating checks.",
      "Run the published chronology source and show how a post-incident observation must not be presented as contemporaneous knowledge."
    ],
    "criteria": [
      "Timeline is chronological and interpretation appears separately from direct observation.",
      "Cause is not asserted solely from sequence or correlation."
    ],
    "resource": {
      "title": "Google SRE Book — Postmortem Culture",
      "url": "https://sre.google/sre-book/postmortem-culture/",
      "kind": "reference",
      "purpose": "Use for mechanism and ethical scope; reading the reference is not verification of competency."
    }
  },
  "responsible-evidence-disclosure": {
    "title": "Confidentiality, Consent and Responsible Portfolio Publishing",
    "sections": [
      {
        "heading": "An engineering portfolio is not permission to publish workplace material",
        "paragraphs": [
          "Production logs, customer identifiers, internal architecture, credentials, third-party reports and private repositories may be restricted. A capability claim can be true while publishing its proof would violate confidentiality or security duties. First determine asset owner, contractual authorization, customer privacy, proprietary information and access rules; do not assume that removing a name makes a diagram safe to disclose.",
          "The strongest public portfolio can explain a *method* using newly created synthetic data and a permitted personal project. It can link to a private review under explicit permission, but cannot treat a private intranet link as globally inspectable. Share the least sensitive evidence necessary for each reviewer audience."
        ]
      },
      {
        "heading": "Separate sanitization from authorization",
        "paragraphs": [
          "Redaction removes or substitutes sensitive values; anonymization requires more than removing obvious names when context or unique IDs can re-identify someone. Even correctly redacted confidential content may still require employer approval to release. Test generated examples for secrets, internal domains, addresses, PII and sensitive metadata before sharing.",
          "A synthetic bearer token string can be safe in a demonstration when clearly marked invented; a real-looking screenshot with production identifiers is not automatically safe. The learner must create fictional fixtures with no copied proprietary schema or customer records. If publication permission is unknown, do not publish it."
        ]
      },
      {
        "heading": "Provide proof without exposing the system",
        "paragraphs": [
          "Offer a public explanation with a minimal recreated algorithm, inputs, negative test and decision rationale, plus an evidence manifest identifying withheld artifacts and who may grant access. A code snippet must not pretend to be the actual production source if it is a reconstruction.",
          "Run an audience-specific publication check: PUBLIC_RECONSTRUCTION, AUTHORIZED_PRIVATE_REVIEW or WITHHOLD. Record who granted access, expiration and allowed distribution. The exercise may be executed locally on synthetic text; it cannot grant legal permission or certify real-data anonymization."
        ]
      }
    ],
    "practice": [
      "Inventory one public-worthy technical artifact and the ownership/privacy controls needed before publication.",
      "Run the synthetic publication classifier and demonstrate that redaction alone does not grant third-party permission."
    ],
    "criteria": [
      "Sensitive or proprietary evidence is withheld absent express permission.",
      "A recreated example is labeled as reconstruction, not the production artifact."
    ],
    "resource": {
      "title": "OWASP Secrets Management Cheat Sheet",
      "url": "https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html",
      "kind": "reference",
      "purpose": "Use for mechanism and ethical scope; reading the reference is not verification of competency."
    }
  },
  "independent-peer-review": {
    "title": "Independent Review and Unseen Transfer Challenges",
    "sections": [
      {
        "heading": "Independent review requires an independent reviewer and a new test",
        "paragraphs": [
          "Passing curriculum-provided examples is guided execution; completing a genuinely new capstone demonstrates some transfer, but a real review must challenge the claims without the author's verbal rescue. A reviewer needs the repository revision, scope, reproducible setup, accepted risks, withheld data limitations and explicit assessment questions.",
          "Define independence carefully: two internal teammates are not necessarily neutral, and the learner scoring their own portfolio is SELF_REVIEW. A real second person may still be competent to challenge within the stated domain. Record reviewer identity, expertise, conflict and date rather than writing an invented endorsement."
        ]
      },
      {
        "heading": "Challenge mechanisms across domain boundaries",
        "paragraphs": [
          "Ask the reviewer to choose a domain variant the author did not rehearse: a new actor with different ownership scope, a failed external identity provider, a stale replica, inaccessible validation messages or a more expensive hosting region. The engineer should predict outcomes and demonstrate the system when feasible.",
          "The reviewer should seek the *same principle* applied differently, not another syntax copy. For example, preventing a double loan and preventing duplicate financial posting both involve state invariants, but their idempotency and audit rules differ. A successful explanation that ignores these differences is not independent transfer."
        ]
      },
      {
        "heading": "Use a transparent scoring model and negative outcomes",
        "paragraphs": [
          "Score evidence trace, mechanism correctness, novel transfer, failure interpretation and ethical scope on a 0–2 rubric. Require at least 8/10, and no zero on evidence trace or safety/ethics. An unexecuted claim, fabricated interview, or false independent sign-off makes the claim NOT_VALIDATED regardless of writing quality.",
          "An honest review may produce FAIL, CONDITIONAL or NOT_TESTED. Preserve reviewer objections verbatim where allowed, link changed artifacts and schedule a re-evaluation trigger. No reviewer available means no independent approval—use peer-review preparation as a self-test, not certification."
        ]
      }
    ],
    "practice": [
      "Provide a reviewer packet with original evidence links, claim boundaries, one deliberately adversarial new-domain problem and an explicit rubric.",
      "Record actual independent reviewer score and dissent, or correctly report NOT INDEPENDENTLY VALIDATED if unavailable."
    ],
    "criteria": [
      "Self-scoring cannot satisfy independent-review acceptance.",
      "A false/unsupported or ethically unsafe claim remains unvalidated regardless of score."
    ],
    "resource": {
      "title": "Architecture Decision Records",
      "url": "https://adr.github.io/",
      "kind": "reference",
      "purpose": "Use for mechanism and ethical scope; reading the reference is not verification of competency."
    }
  },
  "professional-development": {
    "title": "Continuing Professional Development",
    "sections": [
      {
        "heading": "Build a plan from demonstrated ability, not a stack wishlist",
        "paragraphs": [
          "A 12-month learning plan is a portfolio of targeted capability gaps. The fact that a course exists or a certification is popular does not establish the learner needs it. Compare the target role's actual tasks with existing evidence: independently built a domain model, can diagnose a live failed deployment, has performed a restore under authorized conditions, or has only watched a tutorial.",
          "For a software engineer seeking architecture responsibility, a priority may be defending trade-offs with measured consequences; for reliability roles, it may be instrumenting and recovering a service with a second operator. These are examples, not claims about the learner's job or existing skills."
        ]
      },
      {
        "heading": "Connect learning, execution, feedback and retention",
        "paragraphs": [
          "For each capability choose a source and limited study hours, an application in a real or disposable system, a meaningful negative case, review by another engineer, and a re-test after delay. A certificate cannot stand in for the performed task. Prefer three measurable objectives with dates over a plan containing 40 technology names.",
          "Use a staged progression: understand and explain the mechanism, perform a guided exercise, solve a new case without hints, then review error/production constraints. Record a baseline and define what evidence would justify raising the self-assessed ability level."
        ]
      },
      {
        "heading": "Test feasibility and revise under constraints",
        "paragraphs": [
          "Calculate time realistically around existing obligations, provide fallback study intervals and revisit objectives when technology or role requirements change. A plan that demands 20 hours/week without available hours is motivational fiction.",
          "Make success observable: one runnable independent exercise, one inspected negative/failure case, one real review and a post-review revision. Mark external review NOT_TESTED if it cannot occur, and do not inflate completion from reading alone."
        ]
      }
    ],
    "practice": [
      "Select three bounded gaps using actual portfolio evidence and specify learning source, independent action, negative oracle and review.",
      "Use the published plan checker to reject course-only objectives and unbudgeted weekly hours; schedule reevaluation after real evidence."
    ],
    "criteria": [
      "Objectives are verifiable in a novel task rather than measured by attendance.",
      "Time and third-party feedback assumptions are realistic and explicit."
    ],
    "resource": {
      "title": "ACM Code of Ethics",
      "url": "https://www.acm.org/code-of-ethics",
      "kind": "reference",
      "purpose": "Use for mechanism and ethical scope; reading the reference is not verification of competency."
    }
  }
};
