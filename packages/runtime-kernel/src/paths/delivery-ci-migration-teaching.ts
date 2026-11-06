// Module 10 source remediation, original three activity IDs unchanged.
// Three focused readings separate contract discovery, runnable gates, and cutover authority.
export type CiMigrationFocusedSection={heading:string;paragraphs:string[];embedProof?:boolean};
export type CiMigrationFocusedReading={id:string;title:string;estimatedMinutes:number;body:string;sections:CiMigrationFocusedSection[]};
export const ciMigrationFocusedReadings:CiMigrationFocusedReading[]=[
  {
    "id": "delivery-platform-migration-exercise-contract",
    "title": "CI migration contracts: inventory the inherited guarantees",
    "estimatedMinutes": 50,
    "body": "Treat migration as preserving behavior, authority and evidence, not translating stage names.",
    "sections": [
      {
        "heading": "Define a pipeline as a contract, not a sequence of YAML keywords",
        "paragraphs": [
          "A CI pipeline is an execution contract: it chooses source revisions and triggering events, allocates an authorized runner, resolves dependencies, executes tests, makes artifacts available, and enforces which principal may publish or deploy. Jenkins Declarative Pipeline uses agent, stages, steps, post and when constructs; GitLab CI/CD uses jobs, stages, needs, rules, artifacts, cache, protected variables and runner selection. Similar-looking vocabulary is not sufficient evidence that the same stages will run under the same conditions.",
          "Inventory the inherited Jenkinsfile in a matrix with one row for trigger, checkout SHA, agent/container image, test commands, failure propagation, retry/timeouts, required secrets, caching, artifact paths, retention, source trust, publishing authority and post-failure recovery. If there is no actual Jenkins installation, label the inherited Jenkinsfile as a fictional fixture and do not claim a real enterprise cutover. The canonical TSA delivery platform remains GitLab CI/CD; Jenkins is not added as a permanent dependency."
        ]
      },
      {
        "heading": "Translate stage dependencies and approval authority explicitly",
        "paragraphs": [
          "Suppose the inherited workflow runs checkout, unit tests, a cross-team authorization integration test, image build and publish. The migration must preserve the exact failure dependency: a failed unit or authorization test must prevent artifact promotion, not simply produce a red job beside an independently green publish job. In GitLab, declarative stage order and explicit needs dependencies interact; allow_failure, when: always, retry and rules can silently permit downstream behavior that violates the original contract.",
          "Before changing code, define the release subject (source commit and immutable artifact digest) and its authorized publisher. A Jenkins credential scope does not become safe merely because it is copied to a GitLab variable. Validate protected-branch/ref rules, fork/MR exposure, role permissions and runner trust. A green build with broader credentials or a different image is not semantically equivalent."
        ]
      },
      {
        "heading": "Show where source, cache and artifact portability can break",
        "paragraphs": [
          "Jenkins workspaces, shared caches and archived artifacts may encode local path assumptions that GitLab runners cannot reproduce. Conversely, a GitLab job may pass because it accidentally reuses a workspace or cached dependency while the real clean runner fails. Track which stage produces the package/image, how the next stage retrieves it, and whether an artifact checksum survives the boundary. Recreating an image for the target pipeline does not necessarily yield identical bytes.",
          "Do not use a container tag or generic success flag as identity evidence. Compare actual source SHA, dependency lockfiles, build inputs, published OCI manifest digest where applicable and independent consumer behavior. If pipelines cannot produce byte-for-byte equal artifacts due to timestamps/build environments, explicitly state what reproducibility guarantee remains and which differences must be investigated."
        ]
      }
    ]
  },
  {
    "id": "delivery-platform-migration-exercise-gates",
    "title": "Fail-closed migration: local proof versus real CI evidence",
    "estimatedMinutes": 75,
    "body": "Execute a minimal GitLab YAML and real unit-test failure rehearsal, then plan real paired runs.",
    "sections": [
      {
        "heading": "Dissect the inherited and target fixtures without pretending to execute Jenkins",
        "paragraphs": [
          "The published Python example contains a small *illustrative* Jenkins Declarative Pipeline string with Test and Publish stages and a target GitLab CI YAML string. It uses PyYAML to parse the real YAML syntax and checks that publish_fixture requires unit_tests, both disallow tolerated failure, and the publish rule restricts release to a protected default branch. The Jenkinsfile is read as text only; no Groovy interpreter, Jenkins server, GitLab runner or remote CI service is invoked.",
          "The precise guarantee is a local structural contract, not platform semantic equivalence. A real GitLab project may apply inherited includes, runner-level configuration, variable scopes, skipped-job semantics, and resource policies the fixture cannot observe. The next evidence level is linting on the actual GitLab instance and matching success, failure, fork/MR and protected-ref runs. Do not claim that PyYAML understands GitLab's job scheduler."
        ]
      },
      {
        "heading": "Run real local tests and observe failure propagation before publishing",
        "paragraphs": [
          "The exact executable Python program creates a disposable unittest module and actually executes it twice using the local Python interpreter: once successfully, then with a deliberately injected failing assertion. A local admission model only permits a training publication when tests pass, the ref is trusted and GitLab is authoritative. It also denies an untrusted branch and shadow Jenkins publisher; these are observable local decisions, but no package/image is published to any registry.",
          "Execute with python3 after installing PyYAML in a disposable environment. Expected markers: MIGRATION_REAL_YAML_PARSED_AND_DEPENDENCY_GATE_PRESENT, MIGRATION_REAL_TEST_FAILURE_BLOCKS_LOCAL_PUBLISH_ADMISSION, MIGRATION_UNTRUSTED_REF_AND_SHADOW_PUBLISH_DENIED, MIGRATION_SINGLE_AUTHORITATIVE_RELEASE_PATH and MIGRATION_LOCAL_PROOF_NOT_LIVE_JENKINS_OR_GITLAB. To reveal unsafe shortcuts, remove needs, turn allow_failure on, admit failed tests or permit a second primary publisher; the CI source-mutant test must reject these."
        ],
        "embedProof": true
      },
      {
        "heading": "Escalate from the model to actual Jenkins/GitLab paired evidence",
        "paragraphs": [
          "When real platforms are available, run the same committed source revision through both pipelines and compare triggered jobs, environment identity, test counts/assertions, artifact checksums/digests, pipeline permissions and cached versus clean results. Trigger one intentionally failing unit test and one forbidden cross-team write; neither platform may create an accepted artifact or deploy. Record which system is allowed to publish during coexistence and verify the other is shadow-only.",
          "If no inherited Jenkins server or target GitLab project is accessible, mark the live-migration controls NOT_TESTED and preserve the local fixture as teaching evidence only. Do not create a fake 'completed' migration or claim a reversible cutover from a YAML parser. An unexplained change in artifact bytes, runner trust or secret exposure is a cutover blocker."
        ]
      }
    ]
  },
  {
    "id": "delivery-platform-migration-exercise-cutover",
    "title": "Shadow mode, single release authority and bounded rollback",
    "estimatedMinutes": 50,
    "body": "Close the migration only when both failure guarantees and publication authority are proven.",
    "sections": [
      {
        "heading": "Use shadow mode to compare, not duplicate release authority",
        "paragraphs": [
          "During a bounded coexistence window, the inherited Jenkins path may test or build for observation while GitLab becomes the intended primary platform. Only one path should have live release approval and publish credentials at a time. Two independently successful pipelines can otherwise publish conflicting versions or retarget the same mutable tag. This is a governance failure even when each YAML and test run is individually valid.",
          "The local executable model explicitly assigns Jenkins the shadow role and GitLab the primary role and refuses two simultaneous primaries. That proves the policy rule behaves as intended in a small program, not that either real platform has had credentials revoked. On actual platforms, validate protected variables, service accounts, registry permissions and disabled scheduled/triggered release jobs to demonstrate the old path cannot publish."
        ]
      },
      {
        "heading": "Define cutover, rollback and decommission as observable decisions",
        "paragraphs": [
          "Before cutover, require equivalent positive and negative test behavior, a trustworthy source-to-artifact chain, approved target runner and deployment rights, recorded last-known-good release and a time-bounded rollback plan. Choose an authority change window and document who can approve reverting the target CI platform. A migration rollback may restore legacy orchestration, but must not silently change the candidate's source SHA, published digest or underlying database assumptions.",
          "After cutover, explicitly disable or remove the legacy Jenkins publishing credentials and release triggers, then prove a manual/automated old release attempt is denied. If the migration fails its criteria, keep release authority with the last approved system and record the blocker instead of running both live publishers indefinitely. Permanent parallel pipelines are not the intended TSA architecture."
        ]
      },
      {
        "heading": "Handoff a migration evidence ledger rather than an 'all green' claim",
        "paragraphs": [
          "Preserve a stage-equivalence table (Jenkins guarantee → GitLab implementation → observed test), source SHA, runner identities, protected-ref test, injected failure, allowed/denied release identity, artifact digest, authorizer, cutover time, rollback checkpoint and final decommission proof. Mark each observation PASS, FAIL, DEFERRED or NOT_TESTED. A student should be able to identify whether the new platform reproduces the original safety contract without trusting the word 'success' in a dashboard.",
          "An uncoached reviewer should challenge the design with a scheduled legacy job that still has a publish token, a GitLab job with allow_failure=true, a forked merge request inheriting protected secrets and a build whose OCI digest differs. The learner must choose a stop condition and justify whether to roll back orchestration or fix target policy. These are different threats, not four names for a failed test."
        ]
      }
    ]
  }
];
export const ciMigrationAdditionalPracticalSteps:string[]=[
  "Run the exact local migration Python source from reading 'Fail-closed migration' and preserve all expected MIGRATION_* markers, a real passing/failing unittest result, and parsed GitLab job dependencies. Do not claim this executed Jenkins or GitLab.",
  "Mutate the target YAML to remove publish_fixture.needs, mark unit_tests allow_failure=true or broaden the publish rule. Prove local source safety assertions fail, then describe what must be checked using actual GitLab CI Lint and a protected branch job.",
  "For an actual inherited system, make a one-row-per-guarantee Jenkins-to-GitLab matrix covering triggers, agents, tests, dependency graph, artifacts, caches, protected credentials, source revision, immutable image identity and rollback.",
  "During cutover, enforce ONE registry publisher, perform a controlled failed test in both actual pipelines when available, prove the non-authoritative release identity is denied and explicitly decommission the old release path. Otherwise mark those live observations NOT_TESTED."
];
