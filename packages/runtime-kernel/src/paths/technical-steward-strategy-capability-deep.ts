import type { LearningResource, LessonBlock } from "../activities/content";
import type { Lesson } from "./lesson";

const isoGovernance: LearningResource = { title: "ISO/IEC 38500 — Governance of IT overview", url: "https://www.iso.org/standard/62816.html", kind: "reference" };
const cobit: LearningResource = { title: "ISACA — COBIT", url: "https://www.isaca.org/resources/cobit", kind: "reference" };
const techRadar: LearningResource = { title: "Thoughtworks Technology Radar", url: "https://www.thoughtworks.com/radar", kind: "reference" };
const teamTopologies: LearningResource = { title: "Team Topologies — Key Concepts", url: "https://teamtopologies.com/key-concepts", kind: "reference" };

type Spec={id:string;title:string;body:string;practice:string[];resources:LearningResource[]};

// These worked cases make each strategic choice inspectable, rather than asking
// the learner to apply abstract governance vocabulary with no model to follow.
const workedCases: Record<string, { question: string; example: string; challenge: string }> = {
  "outcomes-horizons": {
    question: "How does an organizational outcome become a time-bounded technology choice?",
    example: "Illustrative Steward scenario: the next 90-day outcome is to make service ownership reliable enough for incident routing. Current evidence shows several services have no accountable team; the exact percentage has not yet been measured. Commit now to measure missing ownership and define an ownership correction workflow. Treat directory federation as a later option, conditional on validated identity-sync needs. Do not label a speculative three-year integration as a funded delivery promise.",
    challenge: "Distinguish the observable outcome, first measurement, near-term commitment, later conditional option and trigger for reconsideration."
  },
  "strategic-choices": {
    question: "What must be excluded for a plan to become a strategy?",
    example: "Illustrative choice: improve Steward's owner accuracy and restore procedure before introducing another message broker. The broker could be useful later, but there is no current evidence of an event-throughput problem. Fund ownership verification and recovery drills; explicitly defer event-platform expansion. The opportunity cost is reduced near-term feature velocity, while the accepted risk is continued synchronous integration for now.",
    challenge: "Name the chosen investment, a credible rejected investment, evidence that could reverse the exclusion and the cost of the choice."
  },
  "capability-map": {
    question: "How can capability gaps be separated from product names?",
    example: "Illustrative map: business capability 'route service incidents to accountable owners' depends on data quality (verified ownership), process (handoff rules), people (named responders) and tools (Steward registry). Buying a directory product cannot repair missing accountability by itself. Rate each component's current evidence and its effect on incident routing before proposing technology.",
    challenge: "Identify which gap is behavioral, organizational, informational or technical; explain what happens if only software changes."
  },
  "investment-prioritization": {
    question: "What makes a small investment more defensible than a fashionable large one?",
    example: "Illustrative decision: compare a two-week ownership cleanup, a six-week log correlation improvement and a three-month platform rewrite. Score each against incident impact, confidence in evidence, delivery capacity, reversibility and operating cost. Mark all initial scores as assumptions until measured. A rewrite may offer substantial flexibility but has low near-term evidence and high migration risk; the cleanup may win because it directly addresses a confirmed pain with a short feedback loop.",
    challenge: "State one weighting that could change the ranking, one unverified assumption and a measurable post-investment review."
  },
  "capability-building": {
    question: "When should a capability be built, bought, learned or retired?",
    example: "Illustrative options: Steward's service-ownership rule is domain-specific and should remain understandable in the product. TLS certificate operations can use established tooling instead of custom cryptography. The engineering team needs to learn how to verify certificate renewal even when automation is purchased. A duplicated internal registry export can be retired only after consumers and retention requirements are inventoried.",
    challenge: "Classify the four choices and identify the responsibility that remains with the organization after buying or outsourcing."
  },
  "roadmaps-options": {
    question: "How does a roadmap communicate uncertainty without becoming vague?",
    example: "Illustrative horizon: Now — inventory unowned services and agree an escalation owner; Next — trial ownership reminders with one team and measure correction time; Later — consider directory sync only if repeated manual updates remain a measured bottleneck. Explicit dependencies: reliable team identifiers, access approval and a data owner. Stop the experiment if false assignments rise; expand only if correction time decreases without unauthorized changes.",
    challenge: "Identify entry criteria, dependency, observable success, abort trigger and a deliberately uncommitted later option."
  }
};
// Disconfirming cases and transfer probes belong to specific strategic decisions.
const strategyChecks: Record<string,{failure:string;transfer:string;acceptance:string}> = {
  "outcomes-horizons": {
    "failure": "A slide promises an identity-directory migration in month six, while nobody has measured whether missing ownership or approval delay causes incidents. The roadmap cannot assert a solution before a baseline.",
    "transfer": "A sponsor wants to improve supplier outage recovery over twelve months. Separate an immediate verified obligation, a near-term experiment, a later option and a condition that cancels that option.",
    "acceptance": "The learner distinguishes observed baseline, committed result and speculative option, with a source and date for each decision gate."
  },
  "strategic-choices": {
    "failure": "A portfolio calls every desirable initiative 'priority one'; no capacity is released, nothing is deferred and every risk is described as critical. This is not a choice.",
    "transfer": "With capacity for one sprint, decide between a missing unauthorized-write regression check, a cloud migration and a feature enhancement. Write the rejected options and which evidence could change your choice.",
    "acceptance": "The choice rejects a credible alternative, describes opportunity cost and names a falsifiable reconsideration signal."
  },
  "capability-map": {
    "failure": "The capability map equates 'reliable incident routing' with installing a new alerting vendor, but team ownership data remains wrong and no one responds to alerts.",
    "transfer": "Map 'restore customer service after supplier failure' into people, process, information and technology dependencies and identify the weakest point without recommending a tool first.",
    "acceptance": "The map separates business ability from the product that might supply it and shows one nontechnology bottleneck."
  },
  "investment-prioritization": {
    "failure": "A spreadsheet multiplies unsupported 1–5 optimism scores and calls the result financial ROI, then picks the fashionable infrastructure rewrite over a verified critical service gap.",
    "transfer": "Use a proposed contract-testing initiative, a backup validation project and an identity platform rewrite. Compare time horizon, consequence, confidence, lifecycle cost, learning option and risk. Defend the top choice and an explicit deferment.",
    "acceptance": "The ranking identifies which assumptions are uncertain and demonstrates how one change in evidence would alter priority."
  },
  "capability-building": {
    "failure": "A team buys an access-management service and assumes the vendor now owns the organization's policy, role approval and incident recovery decisions.",
    "transfer": "Choose build, buy, learn or retire for an internal certificate issuance process. Show the continuing organizational responsibility after an outsourced or automated solution.",
    "acceptance": "The chosen operating model includes remaining owner, skills, failure recovery and exit, not procurement cost alone."
  },
  "roadmaps-options": {
    "failure": "A roadmap promises exact calendar dates for unknown integrations four years out, keeping a costly cloud migration alive even after the original performance driver disappeared.",
    "transfer": "An API latency improvement may eliminate the need for a new cache. Define the measurement and stop threshold that retires the cache option before implementation, and explain who signs off.",
    "acceptance": "At least one later option has an abort trigger and an expiry/review point, and near-term commitments have attributable owners."
  }
};
function make(s:Spec):Lesson {
  const worked = workedCases[s.id];
  const checks = strategyChecks[s.id];
  if (!worked || !checks) throw new Error(`Missing strategy decision evidence for ${s.id}`);
  const blocks:LessonBlock[]=[
    {type:"paragraph",text:s.body},
    {type:"heading",id:"worked-strategy-case",text:worked.question,level:2},
    {type:"paragraph",text:worked.example},
    {type:"callout",tone:"warning",title:"Plausible but wrong strategic choice",body:checks.failure},
    {type:"heading",id:"unseen-strategy-transfer",text:"Apply the strategy to a different decision",level:2},
    {type:"paragraph",text:checks.transfer},
    {type:"callout",tone:"note",title:"Reason from the case",body:worked.challenge},
    {type:"callout",tone:"steward",title:"Strategy is a coherent set of choices",body:"A technology strategy is not a wishlist, tool catalogue or multi-year prediction. It connects organizational outcomes to a small set of technology choices, capability investments, deliberate non-investments, sequencing and evidence that would cause the strategy to change."},
    {type:"resources",title:"Continue learning",resources:s.resources},
  ];
  return {id:`technical-strategy-${s.id}`,title:s.title,activities:[
    {id:`technical-strategy-${s.id}-reading`,title:s.title,estimatedMinutes:55,content:{type:"reading",body:[s.body, worked.example].join("\n\n"),blocks}},
    {id:`technical-strategy-${s.id}-practice`,title:`Practice: ${s.title}`,estimatedMinutes:75,content:{type:"practical",objective:`Apply ${s.title} to Steward's next planning horizon.`,scenario:`Fictional Steward strategy case with organizational facts explicitly supplied or marked unknown. Do not invent business approval.\n\nINDEPENDENT CASE: ${checks.transfer}`,instructions:[...s.practice, "For the new case, produce a comparison of at least two feasible actions plus the maintain-current-state option, with explicit non-choice, owner, evidence and trigger for reversal.", "State what observation would make the recommended investment the wrong choice; show how the decision responds."],deliverables:["Strategy/capability decision artifact","Evidence and trade-offs","Owner, horizon and review trigger"],completionCriteria:[checks.acceptance,"The submitted new-case artifact distinguishes supplied facts, observed evidence, cost/risk assumptions and missing organizational approval.",`Reject a recommendation if it reproduces the failure: ${checks.failure}`,"At least one alternative is excluded with specific opportunity cost, and the decision is revisited on a measurable evidence threshold."]}},
  ]};
}
const specs:Spec[]=[
{id:"outcomes-horizons",title:"Technology Strategy: Outcomes and Horizons",body:"Technology strategy translates organizational direction into a coherent set of technical choices over a useful horizon. Start from outcomes, constraints and material risks, then identify which technology capabilities matter. Separate committed near-term decisions from directional medium-term bets and conditional longer-term options. Avoid roadmaps that imply certainty where evidence does not exist.",practice:["Define Steward's supplied organizational outcomes and planning horizon.","Identify technology capabilities that materially enable or constrain those outcomes.","Separate committed, directional and conditional choices.","State assumptions and review triggers for each horizon."],resources:[isoGovernance,cobit]},
{id:"strategic-choices",title:"Strategic Choices and Non-choices",body:"Strategy requires choosing what not to do. A list containing cloud migration, microservices, AI, zero trust, observability, developer platform work and modernization is not a strategy unless priorities and exclusions are explicit. Technical Stewardship uses evidence to concentrate scarce attention and accepts that some technically attractive work should be deferred or rejected.",practice:["Build a candidate initiative set from real Steward risks, debt, architecture and service evidence.","Select a small coherent set of priorities.","Explicitly defer, stop or reject at least two credible initiatives.","Explain the opportunity cost and trade-offs."],resources:[cobit,techRadar]},
{id:"capability-map",title:"Technology Capability Mapping",body:"A capability describes an ability the organization needs, not a product it owns. Examples include reliable software delivery, identity lifecycle management, recoverable data, internal artifact distribution, observability and architecture decision-making. Mapping capabilities prevents strategy from becoming vendor-shaped and exposes dependencies among people, process, information and technology.",practice:["Create a Steward technology-capability map.","For each material capability, assess current evidence, ownership and dependency.","Separate capability gaps from product-feature gaps.","Identify capabilities whose weakness blocks multiple outcomes."],resources:[cobit,teamTopologies]},
{id:"investment-prioritization",title:"Technology Investment and Prioritization",body:"Technology investment includes engineering time, operational burden, training, migration risk, licenses/infrastructure and opportunity cost. Prioritization should compare expected value, risk reduction, urgency, reversibility, dependency and evidence confidence without pretending uncertain benefits can be reduced to a perfectly precise score.",practice:["Compare at least five candidate Steward investments or remediation initiatives.","Estimate benefit/risk reduction, cost, dependency and confidence qualitatively or with transparent ranges.","Identify sequencing constraints.","Recommend a portfolio for the current horizon and defend excluded work."],resources:[cobit,isoGovernance]},
{id:"capability-building",title:"Build, Buy, Learn and Retire Capabilities",body:"A gap can be addressed by building software, adopting a service/product, developing people/process capability, simplifying the need or retiring the dependent technology. Sustainable stewardship asks whether the organization can operate and evolve the chosen solution, not only whether it can procure or implement it.",practice:["Select two capability gaps.","Compare build, buy/adopt, learn/process and simplify/retire options.","Include skills, support, exit, security, reliability and lifecycle consequences.","Choose the smallest sustainable response."],resources:[teamTopologies,techRadar]},
{id:"roadmaps-options",title:"Roadmaps, Options and Reconsideration",body:"A technical roadmap should communicate sequence, dependency and decision points without pretending the future is fixed. Commitment should decrease as uncertainty and distance increase: near-term work may have concrete sequencing and ownership, medium-term items should be conditional on evidence, and longer-term items are options rather than promised delivery dates. Record the assumptions that keep an option alive, the evidence gate that permits commitment, and the review or expiry point at which an unsupported option is dropped. Preserve options when uncertainty is high; commit when delay is more costly than uncertainty.",practice:["Create a 12–24 month illustrative Steward technology roadmap from supplied assumptions.","Separate near-term committed work, medium-term conditional decisions and longer-term options/experiments; do not assign false-precision delivery dates to conditional work.","For each conditional item, state the assumption keeping it relevant, evidence needed to commit, decision owner and review/expiry point.","Add dependency and reconsideration triggers, including conditions that stop work rather than only conditions that start it.","Show at least one initiative that disappears if a simplifying assumption holds."],resources:[techRadar,isoGovernance]},
];
export const technicalStrategyCapabilityDeepLessons:Lesson[]=specs.map(make);
