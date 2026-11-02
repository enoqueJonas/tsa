// Published beginner CI simulation: deterministic job graph, no remote runner,
// Docker daemon, registry access or production change.
export const ciDependencyPython = "import sys\n\n# Disposable model of a CI dependency graph; NOT a GitLab pipeline run.\nfailed = \"--fail-unit\" in sys.argv\njobs = {\n    \"lint\": \"PASSED\",\n    \"typecheck\": \"PASSED\",\n    \"unit_test\": \"FAILED\" if failed else \"PASSED\",\n}\nrequired = (\"lint\", \"typecheck\", \"unit_test\")\nbuild_allowed = all(jobs[name] == \"PASSED\" for name in required)\njobs[\"image_build\"] = \"PASSED\" if build_allowed else \"BLOCKED\"\n# Publication consumes the one already-produced artifact; no rebuild.\njobs[\"publish\"] = \"PASSED\" if jobs[\"image_build\"] == \"PASSED\" else \"BLOCKED\"\nfor name in (*required, \"image_build\", \"publish\"):\n    print(f\"{name}: {jobs[name]}\")\nprint(\"candidate:\", \"ELIGIBLE\" if build_allowed else \"REJECTED\")\nsys.exit(0 if build_allowed else 17)";
export type CIDeepSection = {
  heading: string;
  body: string;
  items?: string[];
  code?: { language: string; code: string; output?: string };
};
export const ciDependencyWorked: CIDeepSection[] = [
  {
    heading: "Executable dependency graph before GitLab YAML",
    body: "A CI job is a named unit of execution, a stage is a coarse scheduling grouping, and a dependency edge states whose successful result another job requires. Jobs that do not depend on one another may run at the same time; a later build or publish step must explicitly require each safety-critical check. Save the following source as ci_gate.py. Run python3 ci_gate.py, then python3 ci_gate.py --fail-unit. In the second run the simulated unit test fails, the image build and publish become BLOCKED, the candidate is REJECTED and the process returns exit status 17. This is a pure local decision-model demonstration, NOT a real GitLab Runner, Docker build, job scheduler or artifact registry. A real GitLab needs verified job rules, dependencies, permissions and a negative branch run.",
    code: { language: "python", code: ciDependencyPython,
      output: "$ python3 ci_gate.py\nlint: PASSED\ntypecheck: PASSED\nunit_test: PASSED\nimage_build: PASSED\npublish: PASSED\ncandidate: ELIGIBLE\n$ python3 ci_gate.py --fail-unit\nlint: PASSED\ntypecheck: PASSED\nunit_test: FAILED\nimage_build: BLOCKED\npublish: BLOCKED\ncandidate: REJECTED\n# Negative process exit status: 17." }
  },
  {
    heading: "Map the model to real orchestration and a withheld artifact",
    body: "In GitLab the authoritative .gitlab-ci.yml declares the required checks, scheduling graph and permissions. A failing check must be a failing job rather than a script that swallows nonzero exit status. Confirm the publish job is not eligible when unit_test fails, not merely that a dashboard badge turns red. The real pipeline must also prove that build-image consumes the tested source revision and publish uses that exact built artifact. A successful local simulation provides the reasoning model; only a real pipeline trace can demonstrate runner, artifact and publish behavior.",
    items: [
      "Trace exact source revision -> lint, typecheck, unit test -> image build -> approved registry publication.",
      "Verify the negative unit-test job has nonzero status and neither build nor publish ran.",
      "Distinguish a job dependency (requires success), an artifact transfer (requires output), and a cache (optional performance input).",
      "Independent transfer: add a security-check job. Explain why merely placing it in a stage is not sufficient if a publish job can bypass it through an incomplete needs graph."
    ]
  }
];