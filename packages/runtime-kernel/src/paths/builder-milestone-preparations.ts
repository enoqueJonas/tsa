import type { Lesson } from "./lesson";

/** Forward-only Builder milestone support. Each reading has its own executable/real-app transfer and check. */
export const stewardMilestonePreparations: Lesson[] = [
  {
    "id": "steward-api-v1-contract-invariants",
    "title": "Milestone Foundations: Invariants and Ownership",
    "activities": [
      {
        "id": "steward-api-v1-contract-invariants-reading",
        "title": "Milestone Foundations: Invariants and Ownership",
        "estimatedMinutes": 35,
        "content": {
          "type": "reading",
          "body": "Before shipping a registry, separate what an entity means from how HTTP represents it. A Team owns a Service; the authenticated User acts through a Membership in that Team. Request-body ownership hints do not authorize writes. Service.lifecycle is a product stage; Environment.kind is a registered deployment. A production-stage Service without a production Environment is noncompliant, even if a tutorial seed once used that inconsistency deliberately.",
          "blocks": [
            {
              "type": "paragraph",
              "text": "Before shipping a registry, separate what an entity means from how HTTP represents it. A Team owns a Service; the authenticated User acts through a Membership in that Team. Request-body ownership hints do not authorize writes. Service.lifecycle is a product stage; Environment.kind is a registered deployment. A production-stage Service without a production Environment is noncompliant, even if a tutorial seed once used that inconsistency deliberately."
            },
            {
              "type": "heading",
              "id": "section-1",
              "text": "Define the rule before the endpoint",
              "level": 2
            },
            {
              "type": "paragraph",
              "text": "An invariant is a property required to remain true across valid state changes. A read-only report can detect an invalid state but cannot prevent it. State which rules are database-local, which span rows and which require identity context."
            },
            {
              "type": "paragraph",
              "text": "Map `ownerTeam` (API naming) to `owning_team_id` (persistence foreign key) explicitly. Do not invent a second source of ownership. For a PATCH, read the persisted resource owner before evaluating Team Membership; never accept `team_id` from the caller as authorization evidence."
            },
            {
              "type": "heading",
              "id": "section-2",
              "text": "Read the four visible outcomes",
              "level": 2
            },
            {
              "type": "paragraph",
              "text": "A missing bearer token is 401; an authenticated outsider's existing resource write is typically 403, or 404 where concealment is a consistent documented policy; an authorized write succeeds; an absent resource is 404. These are not interchangeable. Record the actual policy and use it uniformly on top-level and nested routes."
            },
            {
              "type": "heading",
              "id": "section-3",
              "text": "False success to reject",
              "level": 2
            },
            {
              "type": "paragraph",
              "text": "An implementation that checks only `request.user.is_authenticated` can pass a happy-path test and still allow Team B to modify Team A. The local policy oracle below exposes the counterexample but cannot prove Django/DRF enforcement."
            },
            {
              "type": "heading",
              "id": "executable-proof",
              "text": "Executable proof and expected outcome",
              "level": 2
            },
            {
              "type": "code",
              "language": "python",
              "caption": "Steward milestone policy oracle — independent state, owner and denial examples",
              "code": "\"\"\"Local policy oracle, not a Django/DRF integration test.\"\"\"\nfrom dataclasses import dataclass\n\n@dataclass(frozen=True)\nclass Service:\n    id: int\n    team_id: int\n    lifecycle: str\n    environment_kinds: frozenset[str]\n\n@dataclass(frozen=True)\nclass Membership:\n    user_id: int\n    team_id: int\n    role: str\n\ndef can_release(service: Service) -> bool:\n    return (service.lifecycle != \"production\"\n            or \"production\" in service.environment_kinds)\n\ndef write_status(user_id: int | None, service: Service | None,\n                 memberships: tuple[Membership, ...]) -> int:\n    if user_id is None:\n        return 401\n    if service is None:\n        return 404\n    # Never trust a team_id supplied in the PATCH body.\n    allowed = any(m.user_id == user_id and m.team_id == service.team_id\n                  and m.role in {\"maintainer\", \"owner\"} for m in memberships)\n    return 200 if allowed else 403\n\npayroll = Service(10, 1, \"production\", frozenset({\"uat\"}))\npayments = Service(11, 1, \"production\", frozenset({\"uat\", \"production\"}))\nmembers = (Membership(7, 1, \"maintainer\"), Membership(8, 2, \"owner\"))\nassert not can_release(payroll)\nassert can_release(payments)\nassert write_status(None, payments, members) == 401\nassert write_status(7, payments, members) == 200\nassert write_status(8, payments, members) == 403\nassert write_status(7, None, members) == 404\nprint(\"MILESTONE_POLICY_STATE_AND_401_403_404_PASS\")\n\n# Deliberately wrong: this ignores ownership and roles.\ndef unsafe_write_status(user_id: int | None, service: Service | None) -> int:\n    if user_id is None:\n        return 401\n    return 200 if service is not None else 404\nassert unsafe_write_status(8, payments) != 403\nprint(\"MILESTONE_AUTHORIZATION_MUTANT_EXPOSED\")"
            },
            {
              "type": "paragraph",
              "text": "Expected stdout: MILESTONE_POLICY_STATE_AND_401_403_404_PASS and MILESTONE_AUTHORIZATION_MUTANT_EXPOSED. The second marker demonstrates a BAD policy model that would grant a foreign Team write; it is a diagnostic exposure, not a security pass."
            },
            {
              "type": "callout",
              "tone": "steward",
              "title": "Evidence boundary",
              "body": "A passing local model or shell script only proves the stated boundary. Record what has not been checked in the running Steward application."
            }
          ]
        }
      },
      {
        "id": "steward-api-v1-contract-invariants-practice",
        "title": "Practice: Milestone Foundations: Invariants and Ownership",
        "estimatedMinutes": 90,
        "content": {
          "type": "practical",
          "objective": "Construct an ownership and lifecycle decision table for two Teams, two Users and two Services in the existing Steward implementation.",
          "scenario": "Continue the same Steward API repository and use disposable data. Keep a PASS / FAIL / NOT TESTED evidence table with exact commands, outputs and git commit.",
          "instructions": [
            "Run the published oracle with `python3 milestone_policy.py`; explain each expected outcome and why the deliberately unsafe helper fails the same-Team policy.",
            "Inspect one actual DRF PATCH method and identify where it obtains Service ownership and Membership; compare its decision order to your table.",
            "Add a negative automated test for a signed Team B user against a Team A Service; then prove removing object-level policy makes that test fail for the intended reason.",
            "Record how you plan to reject or remediate production-lifecycle records that lack production Environment rows; do not relabel lifecycle values to hide a data gap."
          ],
          "deliverables": [
            "Commands and observed outputs, with token values redacted",
            "A failed negative case that fails for the intended reason",
            "A minimal code or document diff in the continuing Steward repository",
            "Limitations and unresolved risks recorded as NOT TESTED"
          ],
          "completionCriteria": [
            "The positive path and a deliberately invalid path have independently observed outcomes.",
            "The record distinguishes local policy proof from real Django, HTTP and PostgreSQL behavior.",
            "The learner can defend the mechanism and diagnose a changed/failed result without copying the sample answer."
          ]
        }
      },
      {
        "id": "steward-api-v1-contract-invariants-check",
        "title": "Independent check: Milestone Foundations: Invariants and Ownership",
        "estimatedMinutes": 15,
        "content": {
          "type": "reflection",
          "prompt": "1. Why is owner identity from a submitted PATCH body untrustworthy?\n2. Does a read-only SQL query enforce the production Environment rule? Why not?\n3. How can 404 concealment differ from an accidentally missing permission check?"
        }
      }
    ]
  },
  {
    "id": "steward-api-v1-postgres-constraints",
    "title": "Milestone Foundations: PostgreSQL Constraint Proof",
    "activities": [
      {
        "id": "steward-api-v1-postgres-constraints-reading",
        "title": "Milestone Foundations: PostgreSQL Constraint Proof",
        "estimatedMinutes": 35,
        "content": {
          "type": "reading",
          "body": "PostgreSQL foreign keys, uniqueness and CHECK constraints are independent of the Django serializer that happens to be used. They defend against alternate API routes, scripts and concurrent sessions. A cross-row rule such as 'production lifecycle requires a production Environment' cannot be expressed as a simple per-row CHECK. Detecting it with SELECT is a diagnostic; enforcing it consistently requires a designed transactional boundary and possibly a database trigger with concurrency analysis.",
          "blocks": [
            {
              "type": "paragraph",
              "text": "PostgreSQL foreign keys, uniqueness and CHECK constraints are independent of the Django serializer that happens to be used. They defend against alternate API routes, scripts and concurrent sessions. A cross-row rule such as 'production lifecycle requires a production Environment' cannot be expressed as a simple per-row CHECK. Detecting it with SELECT is a diagnostic; enforcing it consistently requires a designed transactional boundary and possibly a database trigger with concurrency analysis."
            },
            {
              "type": "heading",
              "id": "section-1",
              "text": "Why duplicate and self edges are different failures",
              "level": 2
            },
            {
              "type": "paragraph",
              "text": "For a directed ServiceDependency, `(source_service_id,target_service_id)` is an ordered pair. `A→B` and `B→A` are different, while two `A→B` rows are duplicates. `A→A` violates a separate self-reference invariant. Each requires an independent negative fixture."
            },
            {
              "type": "heading",
              "id": "section-2",
              "text": "Scratch PostgreSQL transaction",
              "level": 2
            },
            {
              "type": "paragraph",
              "text": "Run this exact `psql` program in a disposable PostgreSQL database: `psql -X -v ON_ERROR_STOP=1 -d tsa_steward_lab -f milestone_constraints.sql`. The script creates TEMP tables inside a transaction, triggers two distinct constraint violations, catches only the expected SQLSTATE classes, reports a deliberate production-stage gap, and rolls back. Never run schema-reset commands on a shared database."
            },
            {
              "type": "heading",
              "id": "section-3",
              "text": "Data integrity under migration",
              "level": 2
            },
            {
              "type": "paragraph",
              "text": "A migration to introduce uniqueness on populated data must first identify duplicates, choose an explicit reconciliation rule, preserve foreign keys and prove the current data can satisfy the new constraint. A clean migration on empty tables is insufficient. Demonstrate one safe populated-data change and then rerun the negative fixture."
            },
            {
              "type": "heading",
              "id": "executable-proof",
              "text": "Executable proof and expected outcome",
              "level": 2
            },
            {
              "type": "code",
              "language": "sql",
              "caption": "Steward milestone PostgreSQL scratch constraints — deliberate SQLSTATE negatives",
              "code": "\\set ON_ERROR_STOP on\nBEGIN;\nCREATE TEMP TABLE team (id integer PRIMARY KEY);\nCREATE TEMP TABLE service (\n  id integer PRIMARY KEY,\n  owning_team_id integer NOT NULL REFERENCES team(id),\n  lifecycle text NOT NULL CHECK\n    (lifecycle IN ('development','uat','production','retired'))\n);\nCREATE TEMP TABLE environment (\n  id integer PRIMARY KEY,\n  service_id integer NOT NULL REFERENCES service(id),\n  kind text NOT NULL CHECK\n    (kind IN ('development','uat','staging','production'))\n);\nCREATE TEMP TABLE service_dependency (\n  source_service_id integer NOT NULL REFERENCES service(id),\n  target_service_id integer NOT NULL REFERENCES service(id),\n  CONSTRAINT no_self_dependency CHECK (source_service_id <> target_service_id),\n  CONSTRAINT unique_directed_dependency UNIQUE (source_service_id, target_service_id)\n);\nINSERT INTO team VALUES (1),(2);\nINSERT INTO service VALUES (10,1,'production'),(11,1,'uat');\nINSERT INTO environment VALUES (1,10,'uat');\nINSERT INTO service_dependency VALUES (10,11);\nDO $proof$\nDECLARE missing integer;\nBEGIN\n  BEGIN\n    INSERT INTO service_dependency VALUES (10,11);\n    RAISE EXCEPTION 'UNSAFE: duplicate relationship was accepted';\n  EXCEPTION WHEN unique_violation THEN\n    RAISE NOTICE 'MILESTONE_DUPLICATE_REJECTED';\n  END;\n  BEGIN\n    INSERT INTO service_dependency VALUES (11,11);\n    RAISE EXCEPTION 'UNSAFE: self-dependency was accepted';\n  EXCEPTION WHEN check_violation THEN\n    RAISE NOTICE 'MILESTONE_SELF_DEPENDENCY_REJECTED';\n  END;\n  SELECT count(*) INTO missing\n  FROM service s\n  WHERE s.lifecycle='production'\n    AND NOT EXISTS (\n      SELECT 1 FROM environment e\n      WHERE e.service_id=s.id AND e.kind='production'\n    );\n  IF missing <> 1 THEN\n    RAISE EXCEPTION 'Expected one deliberately noncompliant production service, got %', missing;\n  END IF;\n  RAISE NOTICE 'MILESTONE_PRODUCTION_GAP_DETECTED';\nEND $proof$;\nROLLBACK;\n\\echo MILESTONE_SCRATCH_TRANSACTION_ROLLED_BACK"
            },
            {
              "type": "paragraph",
              "text": "Expected PostgreSQL NOTICE markers: MILESTONE_DUPLICATE_REJECTED, MILESTONE_SELF_DEPENDENCY_REJECTED, MILESTONE_PRODUCTION_GAP_DETECTED; final psql line MILESTONE_SCRATCH_TRANSACTION_ROLLED_BACK. No persistent schema or rows should remain."
            },
            {
              "type": "callout",
              "tone": "steward",
              "title": "Evidence boundary",
              "body": "This script proves concrete PostgreSQL constraints in a scratch transaction. It does not prove the learner's Django models, permission layer or race safety."
            }
          ]
        }
      },
      {
        "id": "steward-api-v1-postgres-constraints-practice",
        "title": "Practice: Milestone Foundations: PostgreSQL Constraint Proof",
        "estimatedMinutes": 90,
        "content": {
          "type": "practical",
          "objective": "Run the exact PostgreSQL scratch script on PostgreSQL 17 and retain full NOTICE output and successful rollback.",
          "scenario": "Continue the same Steward API repository and use disposable data. Keep a PASS / FAIL / NOT TESTED evidence table with exact commands, outputs and git commit.",
          "instructions": [
            "Compare the scratch DDL with real Django `sqlmigrate` and PostgreSQL catalogs; identify which constraints actually exist in the learner's database.",
            "Write two failing tests against the real Django persistence boundary for duplicate edges and self-edges, not merely serializer validation.",
            "With a deliberately noncompliant production-stage fixture, show `NOT EXISTS (production Environment)` returns the record; then correct it in the same disposable registry.",
            "Plan and execute one safe populated-data migration. Document backup/reversal approach, transactional limits and which rows were preserved."
          ],
          "deliverables": [
            "Commands and observed outputs, with token values redacted",
            "A failed negative case that fails for the intended reason",
            "A minimal code or document diff in the continuing Steward repository",
            "Limitations and unresolved risks recorded as NOT TESTED"
          ],
          "completionCriteria": [
            "The positive path and a deliberately invalid path have independently observed outcomes.",
            "The record distinguishes local policy proof from real Django, HTTP and PostgreSQL behavior.",
            "The learner can defend the mechanism and diagnose a changed/failed result without copying the sample answer."
          ]
        }
      },
      {
        "id": "steward-api-v1-postgres-constraints-check",
        "title": "Independent check: Milestone Foundations: PostgreSQL Constraint Proof",
        "estimatedMinutes": 15,
        "content": {
          "type": "reflection",
          "prompt": "1. Why can a serializer-only uniqueness check race under two concurrent requests?\n2. Which SQLSTATE should the duplicate edge produce, and how do you know the test did not fail for a different reason?\n3. Why is a simple CHECK insufficient for a production Environment relationship?"
        }
      }
    ]
  },
  {
    "id": "steward-api-v1-http-boundaries",
    "title": "Milestone Foundations: Real Signed HTTP Boundary Test",
    "activities": [
      {
        "id": "steward-api-v1-http-boundaries-reading",
        "title": "Milestone Foundations: Real Signed HTTP Boundary Test",
        "estimatedMinutes": 35,
        "content": {
          "type": "reading",
          "body": "A mock policy function does not prove what the running API returns. HTTP acceptance must send actual requests through URL routing, JWT validation, DRF permission checking, serializers, ORM and PostgreSQL. Use disposable Team A/Team B fixtures, real signed access tokens and paths copied from your generated OpenAPI. A denial caused by a malformed request (400) is not evidence of object-level authorization.",
          "blocks": [
            {
              "type": "paragraph",
              "text": "A mock policy function does not prove what the running API returns. HTTP acceptance must send actual requests through URL routing, JWT validation, DRF permission checking, serializers, ORM and PostgreSQL. Use disposable Team A/Team B fixtures, real signed access tokens and paths copied from your generated OpenAPI. A denial caused by a malformed request (400) is not evidence of object-level authorization."
            },
            {
              "type": "heading",
              "id": "section-1",
              "text": "Separate credentials from permissions",
              "level": 2
            },
            {
              "type": "paragraph",
              "text": "A signed, unexpired Team B token is valid authentication; it must not grant Team A write rights. Authenticate first, load the persisted target, then evaluate Membership and role for its owning Team. On nested Environment and dependency writes, derive the parent Service from the URL/database, never from untrusted JSON."
            },
            {
              "type": "heading",
              "id": "section-2",
              "text": "Reproduce a four-request matrix",
              "level": 2
            },
            {
              "type": "paragraph",
              "text": "The script checks anonymous GET (401), signed same-Team PATCH (2xx), signed foreign-Team PATCH (403 or consistently concealed 404) and signed nested foreign-Team POST (403/404). Fill required path variables from the actual schema; create a valid nested request body so a serializer 400 cannot masquerade as permission denial."
            },
            {
              "type": "paragraph",
              "text": "Run only against the local/disposable Steward environment, not production. The script avoids printing tokens or response bodies and intentionally does not assert that refresh-token replay protection was proven."
            },
            {
              "type": "heading",
              "id": "section-3",
              "text": "Failure modes beyond the four requests",
              "level": 2
            },
            {
              "type": "paragraph",
              "text": "Next run explicit JWT expiry, malformed signature, rotation, replay and logout/revocation scenarios using real token routes and the documented configured lifetime. Check request and exception logs for raw token, Authorization header, SQL details or traceback leakage. A pure HTTP status matrix cannot substitute for these tests."
            },
            {
              "type": "heading",
              "id": "executable-proof",
              "text": "Executable proof and expected outcome",
              "level": 2
            },
            {
              "type": "code",
              "language": "bash",
              "caption": "Steward milestone real HTTP team and nested permission proof — run against disposable API",
              "code": "#!/usr/bin/env bash\n# REAL HTTP proof: run ONLY against an isolated Steward test deployment\n# after creating Team A, Team B and valid member/foreign credentials.\nset -euo pipefail\n: \"${STEWARD_BASE_URL:?Set loopback or isolated test base URL}\"\n: \"${TEAM_A_ACCESS_TOKEN:?Set real Team A token in a private shell}\"\n: \"${TEAM_B_ACCESS_TOKEN:?Set real Team B token in a private shell}\"\n: \"${TEAM_A_SERVICE_PATH:?Set actual path from generated OpenAPI}\"\n: \"${TEAM_A_NESTED_PATH:?Set actual nested mutation path from OpenAPI}\"\n: \"${NESTED_VALID_JSON:?Set well-formed request body for this route}\"\n# Only nonsecret, controlled patch data. Never alter ownership here.\nPATCH_JSON='{\"description\":\"Milestone isolated acceptance fixture\"}'\nstatus() {\n  local method=\"$1\" path=\"$2\" token=\"$3\" data=\"$4\"\n  local args=(-sS -o /dev/null -w '%{http_code}' -X \"$method\"\n              -H 'Content-Type: application/json')\n  if [[ -n \"$token\" ]]; then\n    args+=(-H \"Authorization: Bearer $token\")\n  fi\n  if [[ -n \"$data\" ]]; then\n    args+=(--data \"$data\")\n  fi\n  curl \"${args[@]}\" \"${STEWARD_BASE_URL%/}$path\"\n}\nunauth=$(status GET \"$TEAM_A_SERVICE_PATH\" \"\" \"\")\nown=$(status PATCH \"$TEAM_A_SERVICE_PATH\" \"$TEAM_A_ACCESS_TOKEN\" \"$PATCH_JSON\")\nforeign=$(status PATCH \"$TEAM_A_SERVICE_PATH\" \"$TEAM_B_ACCESS_TOKEN\" \"$PATCH_JSON\")\nnested=$(status POST \"$TEAM_A_NESTED_PATH\" \"$TEAM_B_ACCESS_TOKEN\" \"$NESTED_VALID_JSON\")\n[[ \"$unauth\" == 401 ]] || { echo \"FAIL anonymous status $unauth, expected 401\"; exit 1; }\n[[ \"$own\" == 200 || \"$own\" == 204 ]] || { echo \"FAIL own-team status $own\"; exit 1; }\n[[ \"$foreign\" == 403 || \"$foreign\" == 404 ]] || { echo \"FAIL cross-team status $foreign\"; exit 1; }\n[[ \"$nested\" == 403 || \"$nested\" == 404 ]] || { echo \"FAIL nested bypass status $nested\"; exit 1; }\necho 'MILESTONE_REAL_HTTP_TEAM_BOUNDARIES_PASS'\n# Separate follow-up: prove old refresh token rejection after rotation,\n# and check responses/logs for leaked secrets. Do not claim these here."
            },
            {
              "type": "paragraph",
              "text": "Expected stdout: MILESTONE_REAL_HTTP_TEAM_BOUNDARIES_PASS ONLY after all four real requests pass. This does not claim that token rotation, revocation, exception leakage or SQL constraints are proven."
            },
            {
              "type": "callout",
              "tone": "steward",
              "title": "Evidence boundary",
              "body": "A passing local model or shell script only proves the stated boundary. Record what has not been checked in the running Steward application."
            }
          ]
        }
      },
      {
        "id": "steward-api-v1-http-boundaries-practice",
        "title": "Practice: Milestone Foundations: Real Signed HTTP Boundary Test",
        "estimatedMinutes": 90,
        "content": {
          "type": "practical",
          "objective": "Create named disposable fixtures: Team A Service, Team A maintainer, Team B owner, valid dependency target and nested route input.",
          "scenario": "Continue the same Steward API repository and use disposable data. Keep a PASS / FAIL / NOT TESTED evidence table with exact commands, outputs and git commit.",
          "instructions": [
            "Set STEWARD_BASE_URL, TEAM_A_SERVICE_PATH, TEAM_A_NESTED_PATH, TEAM_A_ACCESS_TOKEN, TEAM_B_ACCESS_TOKEN and NESTED_VALID_JSON in a private shell; run the published script exactly, then `unset` the tokens.",
            "Capture a signed Team B 403/404 denial both on PATCH and nested POST; change only one permission function in a scratch branch to show a negative test detects a bypass.",
            "With real JWT endpoints, record issue, use, refresh rotation, old-token replay denial, expiration and logout/revocation behavior. State which are not implemented rather than writing PASS.",
            "Check that OpenAPI, response body, status and server log correspond, and inspect failure responses for SQL, exception classes or credential leakage."
          ],
          "deliverables": [
            "Commands and observed outputs, with token values redacted",
            "A failed negative case that fails for the intended reason",
            "A minimal code or document diff in the continuing Steward repository",
            "Limitations and unresolved risks recorded as NOT TESTED"
          ],
          "completionCriteria": [
            "The positive path and a deliberately invalid path have independently observed outcomes.",
            "The record distinguishes local policy proof from real Django, HTTP and PostgreSQL behavior.",
            "The learner can defend the mechanism and diagnose a changed/failed result without copying the sample answer."
          ]
        }
      },
      {
        "id": "steward-api-v1-http-boundaries-check",
        "title": "Independent check: Milestone Foundations: Real Signed HTTP Boundary Test",
        "estimatedMinutes": 15,
        "content": {
          "type": "reflection",
          "prompt": "1. How can the same 403 result conceal different implementation bugs?\n2. Why must nested operations authorize the persisted parent owner?\n3. Which exact HTTP exchange proves refresh token reuse is rejected after rotation?"
        }
      }
    ]
  },
  {
    "id": "steward-api-v1-handoff-proof",
    "title": "Milestone Foundations: Reproducible Release Evidence",
    "activities": [
      {
        "id": "steward-api-v1-handoff-proof-reading",
        "title": "Milestone Foundations: Reproducible Release Evidence",
        "estimatedMinutes": 35,
        "content": {
          "type": "reading",
          "body": "A service is not ready for the next TSA school because the author can run it on their laptop. It is ready when an engineer unfamiliar with local state can recreate a safe environment, apply migrations, obtain a disposable token, call real endpoints and reproduce a forbidden mutation from written instructions. A screenshot, test count or Swagger page alone is weaker evidence.",
          "blocks": [
            {
              "type": "paragraph",
              "text": "A service is not ready for the next TSA school because the author can run it on their laptop. It is ready when an engineer unfamiliar with local state can recreate a safe environment, apply migrations, obtain a disposable token, call real endpoints and reproduce a forbidden mutation from written instructions. A screenshot, test count or Swagger page alone is weaker evidence."
            },
            {
              "type": "heading",
              "id": "section-1",
              "text": "Three separate acceptance layers",
              "level": 2
            },
            {
              "type": "paragraph",
              "text": "Source-remediated means the written sequence and examples are complete. Technically verified means exact published exercises and a matching-source CI run passed on supported environments. Learner-validated means a separate novice completed an unseen variant and explained the failure paths. Report these independently."
            },
            {
              "type": "heading",
              "id": "section-2",
              "text": "Evidence chain and limits",
              "level": 2
            },
            {
              "type": "paragraph",
              "text": "Record commit SHA, Python and PostgreSQL versions, env var names (not secrets), migration status, schema URL, exact positive/negative command and redacted output, test suite report, observed trace/SQL evidence and known limitations. Link the generated OpenAPI rather than maintaining a second undocumented contract."
            },
            {
              "type": "paragraph",
              "text": "The future System Thinker handoff should ask what boundaries and failure modes deserve modeling. Do not introduce microservices, queues, deployment infrastructure or internal libraries solely for the milestone."
            },
            {
              "type": "heading",
              "id": "section-3",
              "text": "Exit without fabricated completion",
              "level": 2
            },
            {
              "type": "paragraph",
              "text": "Produce an evidence matrix with PASS, FAIL or NOT TESTED for domain invariants, real persistence, signed same/cross-Team auth, nested auth, token replay, public error safety, and reproducible setup. Attach the independent review rubric and an unseen transfer case; if no independent learner participated, mark LEARNER VALIDATION NOT COMPLETED."
            },
            {
              "type": "heading",
              "id": "executable-proof",
              "text": "Executable proof and expected outcome",
              "level": 2
            },
            {
              "type": "code",
              "language": "bash",
              "caption": "Steward milestone handoff commands — inspect actual framework and database",
              "code": "# Run from the existing disposable Steward Django checkout.\npython3 -m pip --version\npython3 manage.py check\npython3 manage.py showmigrations --plan\n# Use a migrated PostgreSQL connection, not an implicit SQLite fallback.\npython3 manage.py shell -c \"from django.db import connection; print(connection.vendor)\"\n# Expect \"postgresql\"; investigate any other result.\n# Then run the repository's own test command and signed HTTP proof.\n# Do not paste actual credentials into documentation or CI logs."
            },
            {
              "type": "paragraph",
              "text": "Expected: `connection.vendor` prints `postgresql`; commands must complete in the actual documented environment. This reading deliberately cannot claim successful HTTP/auth checks from these commands alone."
            },
            {
              "type": "callout",
              "tone": "steward",
              "title": "Evidence boundary",
              "body": "A passing local model or shell script only proves the stated boundary. Record what has not been checked in the running Steward application."
            }
          ]
        }
      },
      {
        "id": "steward-api-v1-handoff-proof-practice",
        "title": "Practice: Milestone Foundations: Reproducible Release Evidence",
        "estimatedMinutes": 90,
        "content": {
          "type": "practical",
          "objective": "From a fresh clone, follow only the README to install dependencies, set required values, migrate PostgreSQL and use the documented API. Record every missing instruction.",
          "scenario": "Continue the same Steward API repository and use disposable data. Keep a PASS / FAIL / NOT TESTED evidence table with exact commands, outputs and git commit.",
          "instructions": [
            "Run framework checks and real PostgreSQL connection evidence, then execute the project's tests and capture its exact commit SHA.",
            "Reproduce a permitted operation and a signed forbidden operation solely from README and generated OpenAPI without asking the author for a missing route.",
            "Provide a seven-row PASS/FAIL/NOT TESTED evidence ledger with reproducible sources; mark unavailable independent reviewer evidence explicitly NOT VALIDATED.",
            "Write the System Thinker handoff with evidence-based coupling/consistency/failure questions and no speculative architecture work."
          ],
          "deliverables": [
            "Commands and observed outputs, with token values redacted",
            "A failed negative case that fails for the intended reason",
            "A minimal code or document diff in the continuing Steward repository",
            "Limitations and unresolved risks recorded as NOT TESTED"
          ],
          "completionCriteria": [
            "The positive path and a deliberately invalid path have independently observed outcomes.",
            "The record distinguishes local policy proof from real Django, HTTP and PostgreSQL behavior.",
            "The learner can defend the mechanism and diagnose a changed/failed result without copying the sample answer."
          ]
        }
      },
      {
        "id": "steward-api-v1-handoff-proof-check",
        "title": "Independent check: Milestone Foundations: Reproducible Release Evidence",
        "estimatedMinutes": 15,
        "content": {
          "type": "reflection",
          "prompt": "1. Why is a successful `manage.py check` insufficient to approve an HTTP release?\n2. What is the difference between API contract accuracy and permissions being enforced at runtime?\n3. If a novice cannot set up PostgreSQL from the README, what status does handoff receive?"
        }
      }
    ]
  }
];
