// Published beginner CI simulation: deterministic job graph, no remote runner,
// Docker daemon, registry access or production change.
export const ciDependencyPython = "import sys\n\n# Disposable model of a CI dependency graph; NOT a GitLab pipeline run.\nfailed = \"--fail-unit\" in sys.argv\njobs = {\n    \"lint\": \"PASSED\",\n    \"typecheck\": \"PASSED\",\n    \"unit_test\": \"FAILED\" if failed else \"PASSED\",\n}\nrequired = (\"lint\", \"typecheck\", \"unit_test\")\nbuild_allowed = all(jobs[name] == \"PASSED\" for name in required)\njobs[\"image_build\"] = \"PASSED\" if build_allowed else \"BLOCKED\"\n# Publication consumes the one already-produced artifact; no rebuild.\njobs[\"publish\"] = \"PASSED\" if jobs[\"image_build\"] == \"PASSED\" else \"BLOCKED\"\nfor name in (*required, \"image_build\", \"publish\"):\n    print(f\"{name}: {jobs[name]}\")\nprint(\"candidate:\", \"ELIGIBLE\" if build_allowed else \"REJECTED\")\nsys.exit(0 if build_allowed else 17)";

// GitLab syntax as published to the learner. CI verifies exact YAML source and
// executes the actual shell commands under a deliberately LOCAL simulator only.
export const ciGitlabCandidateYaml = "# Illustrative, LOCAL source-derived pipeline classroom fixture.\n# This creates a small text candidate, NOT a container image or registry release.\n# Requires an authorized GitLab Docker executor; the local test does NOT run GitLab.\ndefault:\n  image: python:3.12-slim\n\nstages:\n  - verify\n  - build\n  - inspect\n\nfixture_check:\n  stage: verify\n  script: |\n    python3 -c 'assert 2 + 2 == 4; print(\"fixture_check: PASS\")'\n\nunit_test:\n  stage: verify\n  script: |\n    python3 -c 'import os; assert os.getenv(\"TSA_FAIL_UNIT\") != \"1\", \"injected unit failure\"; print(\"unit_test: PASS\")'\n\ncandidate_manifest:\n  stage: build\n  needs: [fixture_check, unit_test]\n  script: |\n    python3 -c 'import os,pathlib;pathlib.Path(\"candidate.txt\").write_text(os.environ[\"CI_COMMIT_SHA\"])'\n  artifacts:\n    paths:\n      - candidate.txt\n    expire_in: 1 day\n\ncandidate_audit:\n  stage: inspect\n  needs:\n    - job: candidate_manifest\n      artifacts: true\n  script: |\n    python3 -c 'import os,pathlib;assert pathlib.Path(\"candidate.txt\").read_text() == os.environ[\"CI_COMMIT_SHA\"];print(\"candidate identity verified\")'";

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
    heading: "Worked GitLab YAML: four jobs, explicit prerequisites, an exact candidate manifest",
    body: "This small source is a real syntactic GitLab CI/CD job configuration. It declares a Python container image for a GitLab Docker executor (the classroom tag is not an immutable release pin); a shell executor instead needs the interpreter installed. It intentionally operates on synthetic Python checks and a tiny commit manifest, not an application, registry or real GitLab Runner. fixture_check and unit_test are independent: either can run first. candidate_manifest is only eligible after BOTH succeed because its needs list contains both. candidate_audit consumes the actual candidate.txt artifact from candidate_manifest, then verifies that it matches the simulated CI_COMMIT_SHA. If unit_test fails, the build must remain blocked; if a needs edge is removed, the build would be wrongly eligible. Cache, artifacts, stages and job identity are separate mechanisms. Save this as a learning example, not a drop-in secure production .gitlab-ci.yml.",
    code: {language:"yaml",code:ciGitlabCandidateYaml}
  },
  {
    heading: "Predict before executing: fail the test, remove an edge, remove the artifact",
    body: "Execute the exact-source local check from the repository in a disposable environment: python3 scripts/check-delivery-ci-yaml.py. It parses the authored YAML, executes each job's actual shell script in separated temporary workspaces, copies only declared artifacts, and asserts that both checks pass, the manifest is bound to the exact synthetic commit, and the final consumer verifies the transferred bytes. Then the checker injects a unit_test failure and requires candidate_manifest and candidate_audit to be BLOCKED. A separate wrong graph deletes only the unit_test needs edge: despite the failed unit test, the candidate becomes eligible, exposing a concrete fail-open path. A missing artifact dependency likewise prevents the audit from reading the manifest. This simulator is deliberately not GitLab; live GitLab rules/needs/protection still require a learner-run negative pipeline. A syntax parser alone cannot prove that a real Runner or secret policy behaved as intended.",
    items: [
      "Explain the difference between allowed job scheduling and transfer of one exact artifact.",
      "Explain why GitLab needs can bypass the stage-waiting behavior when explicit edges are incomplete.",
      "Run a real negative branch in an authorized GitLab homelab only after Runner and protected-variable policy are configured."
    ]
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