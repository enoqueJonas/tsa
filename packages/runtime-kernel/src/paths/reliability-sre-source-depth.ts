import type {LessonBlock} from "../activities/content";
export const sreSourceDepthById: Record<string, Array<{heading:string;paragraphs:string[];code?:{language:string;code:string;caption?:string}}>> = {
  "reliability-quality-attribute": [
    {
      "heading": "What the user observes versus what the machine reports",
      "paragraphs": [
        "Reliability describes whether intended service is delivered correctly over time, not whether a VM, Kubernetes Pod or TCP port is alive. Steward users need an authorized registration to persist and produce its intended result; a 200 from /health cannot prove the database path, authorization or asynchronous side effect worked. Define one user-visible operation, its expected correctness conditions and the way to repeat it safely in the test environment before selecting an infrastructure dashboard.",
        "The local example shows a process probe succeeding on every attempt while the useful operation fails half of the time. This is illustrative arithmetic, not observed Steward reliability. The difference is why reliability needs client-side success indicators and dependency evidence. In a real incident, record the attempted operation and failure, not only server status."
      ],
      "code": {
        "language": "python",
        "caption": "Executable green-probe versus failed-user-operation contrast",
        "code": "# Local model: a healthy process is not always a usable service.\nprobe=[200,200,200,200]\nuser_operation=[200,503,503,200]\ndef success_ratio(values):\n    return sum(200 <= code < 300 for code in values)/len(values)\nprint(f\"process_probe_success={success_ratio(probe):.2f}\")\nprint(f\"user_operation_success={success_ratio(user_operation):.2f}\")\nassert success_ratio(probe)==1.0\nassert success_ratio(user_operation)==0.5\n# For the explicitly authorized operation, 403 is NOT a successful user outcome.\nassert success_ratio([403])==0.0\nprint('authorized_operation_denied_success=0.00')\n# Real acceptance needs a named operation, population and time window.\n"
      }
    },
    {
      "heading": "Run a real local service: green health, false success, and durable recovery",
      "paragraphs": [
        "A synthetic list of 200/503 values illustrates a ratio, but it does not demonstrate how a real server can mislead an operator. This Python 3 standard-library lab binds a disposable HTTP service to 127.0.0.1 on an automatically assigned port, makes actual client requests, then closes the server. No cloud account, database or external network is used. Run it as one complete Python file; do not reuse the demonstration bearer string as a credential.",
        "Trace four separate observations in order: GET /health says the process responds (200) even when POST /register fails (503); a deliberately faulty handler returns 200 but creates no record; an unauthenticated registration is denied (403); only after restoring the dependency does a 201 registration create the record verified by a separate GET /record. A successful HTTP status is a necessary but insufficient oracle for this specific operation. The record check is possible because the lab uses one immediate in-memory store; real systems need an independently justified consistency/read boundary and event/worker confirmation where required.",
        "Expected output: `health=200 outage_write=503 false_ack=200 false_ack_durable=False` followed by `unauthorized_write=403 recovered_write=201 recovered_durable=True`. Distinguish the process probe, status, authorization and durable postcondition; do not average unrelated signals. This proves only localhost handler behavior, not PostgreSQL persistence, actual Steward registration or production service-level reliability."
      ],
      "code": {
        "language": "python",
        "caption": "Run with python3: actual localhost HTTP requests, false 200, denial and verified restore",
        "code": "# Python 3, standard library. This creates only a local disposable HTTP service.\nimport json\nimport threading\nfrom http.server import BaseHTTPRequestHandler, ThreadingHTTPServer\nfrom urllib.request import Request, urlopen\nfrom urllib.error import HTTPError\n\nstate = {\"mode\": \"dependency_down\", \"records\": set()}\n\nclass Handler(BaseHTTPRequestHandler):\n    def log_message(self, *args):\n        pass\n\n    def reply(self, status, value):\n        data = json.dumps(value).encode()\n        self.send_response(status)\n        self.send_header(\"Content-Type\", \"application/json\")\n        self.send_header(\"Content-Length\", str(len(data)))\n        self.end_headers()\n        self.wfile.write(data)\n\n    def do_GET(self):\n        if self.path == \"/health\":\n            self.reply(200, {\"process\": \"alive\"})\n        elif self.path == \"/record\":\n            self.reply(200, {\"exists\": \"r-17\" in state[\"records\"]})\n        else:\n            self.reply(404, {\"error\": \"unknown_path\"})\n\n    def do_POST(self):\n        if self.path != \"/register\":\n            self.reply(404, {\"error\": \"unknown_path\"})\n        elif self.headers.get(\"Authorization\") != \"Bearer demo-allowed\":\n            self.reply(403, {\"error\": \"denied\"})\n        elif state[\"mode\"] == \"dependency_down\":\n            self.reply(503, {\"error\": \"db_unavailable\"})\n        elif state[\"mode\"] == \"ack_without_commit\":\n            self.reply(200, {\"accepted\": True})  # unsafe false success\n        else:\n            state[\"records\"].add(\"r-17\")\n            self.reply(201, {\"accepted\": True})\n\nserver = ThreadingHTTPServer((\"127.0.0.1\", 0), Handler)\nthread = threading.Thread(target=server.serve_forever, daemon=True)\nthread.start()\nbase = \"http://127.0.0.1:\" + str(server.server_port)\n\ndef call(path, method=\"GET\", authorized=True):\n    headers = {\"Authorization\": \"Bearer demo-allowed\"} if authorized else {}\n    request = Request(base + path, data=b\"{}\" if method == \"POST\" else None,\n                      method=method, headers=headers)\n    try:\n        with urlopen(request, timeout=2) as response:\n            return response.status, json.load(response)\n    except HTTPError as error:\n        with error:\n            return error.code, json.load(error)\n\ndef operation_success(status, exists):\n    # The example's contract requires a durable record, not just HTTP 2xx.\n    return 200 <= status < 300 and exists\n\ntry:\n    health, _ = call(\"/health\")\n    outage, _ = call(\"/register\", method=\"POST\")\n    assert health == 200 and outage == 503\n    state[\"mode\"] = \"ack_without_commit\"\n    false_ack, _ = call(\"/register\", method=\"POST\")\n    false_durable = call(\"/record\")[1][\"exists\"]\n    assert false_ack == 200 and not operation_success(false_ack, false_durable)\n    state[\"mode\"] = \"healthy\"\n    denied, _ = call(\"/register\", method=\"POST\", authorized=False)\n    assert denied == 403\n    restored, _ = call(\"/register\", method=\"POST\")\n    restored_durable = call(\"/record\")[1][\"exists\"]\n    assert restored == 201 and operation_success(restored, restored_durable)\n    print(f\"health={health} outage_write={outage} false_ack={false_ack} false_ack_durable={false_durable}\")\n    print(f\"unauthorized_write={denied} recovered_write={restored} recovered_durable={restored_durable}\")\nfinally:\n    server.shutdown()\n    server.server_close()\n    thread.join(timeout=3)"
      }
    },
    {
      "heading": "Independent diagnosis and limit of the model",
      "paragraphs": [
        "Case: two API replicas and a healthy load balancer report green, but registrations return 503 while PostgreSQL connection pools are exhausted. Identify the observed symptom, the missing operational SLI, the dependency evidence required, and the exact recovery check. Distinguish availability, correctness and recovery: a success response with a missing durable record is still a failed business operation."
      ]
    }
  ],
  "availability": [
    {
      "heading": "The denominator must name the requested service",
      "paragraphs": [
        "An availability percentage is a ratio of qualifying successful interactions to all eligible interactions during a chosen interval. A probe-only measure can be useful for readiness but is not the same user transaction SLI. If a user retries one failed registration three times, decide whether counting each HTTP attempt or counting the final logical operation better represents the service promise; both are possible, but mixing them changes the denominator and makes comparisons misleading.",
        "Worked case: 100 eligible attempts, 97 correct successes and 3 qualifying failures means 97% observed success for that small interval; it does not establish a monthly target or long-term confidence. A dashboard that drops missing or timed-out requests from its denominator may report a misleadingly high percentage. State explicit outcome, window, population and missing-data handling before charts."
      ]
    },
    {
      "heading": "Failure and independent transfer",
      "paragraphs": [
        "A synthetic /health probe reports 100% uptime while the registration API returns 80% correct user outcomes. Explain why averaging these two ratios is not meaningful. Select the user operation, a useful measurement point, a separate infra signal and the verification required after repair."
      ]
    }
  ],
  "failure-recovery": [
    {
      "heading": "Failure detection, containment and recovery are different clocks",
      "paragraphs": [
        "Failure start is when useful service first deviates; detection is when telemetry or a user reveals it; mitigation limits immediate impact; recovery is the first verified restoration of intended service. Mean time to detect (MTTD) and mean time to restore (MTTR) are aggregates across specified incidents, not properties proven by one exercise. A temporary restart can clear one symptom without repairing corrupt data or missing outbox messages.",
        "In a dependency outage, choose between failing promptly with an accurate error, degraded operation with bounded semantics and retrying safely after recovery. The correct action depends on correctness: a credit/debit or identity write cannot silently return success when the database commit failed. A resilient outbox may allow deferred publication after a durable commit, but replay requires idempotent consumers and explicit lag monitoring."
      ]
    },
    {
      "heading": "Recovery failure and independent challenge",
      "paragraphs": [
        "Suppose the API returns 200 again after restarting a database, but a synthetic registration committed just before the outage is absent. Distinguish process availability restoration from data correctness recovery. Name the known-good probe, the record query and the outbox/worker observation needed before closing the incident."
      ]
    }
  ],
  "sre-principles": [
    {
      "heading": "Reliability engineering is a feedback loop",
      "paragraphs": [
        "SRE translates user-relevant reliability into objectives, error budgets, automation decisions and learning after incidents. The goal is not to eliminate every possible failure or require five nines from a prototype; the goal is an explicit contract that balances feature delivery, operational complexity and service risk. A decision to freeze a release should follow evidence that it threatens the agreed error budget, not a generic fear of deployment.",
        "Steward's reliability program should connect user-visible SLIs to an owner, tested monitoring query, runbook and recovery path. If no production traffic or genuine measurement exists, use a clearly labeled test gate and preserve the unknown instead of inventing a historical SLO."
      ]
    },
    {
      "heading": "Failure and transfer",
      "paragraphs": [
        "A stakeholder requests 99.99% availability for a single-node low-budget VPS without redundancy or recovery capacity. Explain the achievable failure domains and cost implications, identify the unowned risks, and propose a measurable interim objective rather than signing an impossible commitment."
      ]
    }
  ],
  "toil": [
    {
      "heading": "Distinguish recurring manual work from engineering",
      "paragraphs": [
        "Toil is repetitive, operational work that tends to scale with service growth and can often be automated; not every manual task is toil. Reviewing an unfamiliar outage and designing an experiment can be valuable engineering. Manually restarting the same failed exporter every morning without diagnosis is a toil symptom and potentially a hidden reliability defect. Automating restarts without validating root cause may disguise it rather than fix it.",
        "Measure toil using frequency, time spent, interrupt cost and error risk. Prioritize automation only when it preserves safety, observability and a way to override it. A GitOps controller repeatedly undoing emergency configuration is an ownership conflict, not successful toil reduction."
      ]
    },
    {
      "heading": "Failure and transfer",
      "paragraphs": [
        "An operator spends 30 minutes every Friday cleaning Graylog indexes after disk exhaustion. Decide what to measure before automating deletion, what retention/data-loss boundaries must be preserved and how to detect that the automation itself is failing."
      ]
    }
  ],
  "risk-tradeoffs": [
    {
      "heading": "Reliability is an explicit trade between impact, probability and cost",
      "paragraphs": [
        "Redundancy, backups, managed infrastructure and complex orchestration each cost money and create new failure modes. A low-cost VPS and tested restore may be the rational next step when the requirement tolerates recovery time; enterprise multi-zone orchestration may be justified for stricter outcomes, provided the application and database actually survive failure. Do not equate the number of deployed products with resilience.",
        "Build a decision record for one Steward risk: state the user impact, failure domain, current detection and recovery, cost of mitigation, residual risk and next experiment. If the probability is unknown, mark it unknown; a five-minute simulation cannot infer production annual failure probability."
      ]
    },
    {
      "heading": "Independent transfer",
      "paragraphs": [
        "You can fund either a second application replica or an off-site tested database recovery this quarter. For a system with a single authoritative PostgreSQL instance and a 24-hour recovery requirement, defend your choice and state which risks it leaves uncovered."
      ]
    }
  ],
  "reliability-ownership": [
    {
      "heading": "Service boundaries need accountable failure and recovery ownership",
      "paragraphs": [
        "A service includes the dependencies necessary to fulfill user actions: API process, identity check, database, network, DNS and any required event delivery. The infrastructure team owning a VM does not mean it owns application schema migrations or correct worker acknowledgements. Assign an operator for detection, an accountable owner for recovery and escalation boundaries for vendor-managed platforms.",
        "For each critical Steward capability, write a compact failure map: first externally visible symptom, subsystem evidence, first responder, rollback or restore authority, time limit and independent post-recovery verification. Running a new monitoring stack without alert ownership is just storing more signals."
      ]
    },
    {
      "heading": "Failure and independent transfer",
      "paragraphs": [
        "A Graylog input silently stops accepting worker logs during a user-visible timeout incident. Name who owns shipper health, Graylog journal capacity, index/search availability and application recovery; identify which missing log data cannot safely be interpreted as absence of errors."
      ]
    }
  ]
};
export function extraSreBlocks(id:string):LessonBlock[]{
 return (sreSourceDepthById[id]??[]).flatMap(section=>{
   const blocks:LessonBlock[]=[{type:"heading",level:2,id:`sre-${id}-${section.heading.toLowerCase().replace(/[^a-z0-9]+/g,"-")}`,text:section.heading},
     ...section.paragraphs.map(text=>({type:"paragraph" as const,text}))];
   if(section.code)blocks.push({type:"code",...section.code});
   return blocks;
 });
}
