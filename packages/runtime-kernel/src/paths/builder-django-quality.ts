import type { PracticalContent } from "../activities";
import type { Lesson } from "./lesson";
import { djangoAndApiRichLessons } from "./builder-django-rich";
import { djangoDependentPostgresqlQualityLessons } from "./builder-postgresql-quality";

type PracticeSpec = Omit<PracticalContent, "type">;

const practices: Record<string, PracticeSpec> = {
  "django-and-api-engineering-persist-a-book-through-a-real-drf-api": {
    objective: "Build and test a genuinely persistent DRF Book API before integrating the real Steward registry.",
    scenario: "The previous APIView lesson intentionally returned a teaching 201 without saving rows. Reuse the migrated tsa-django-intro catalogue with its required unique shelf_code, and prove the difference between response serialization and actual persistence.",
    instructions: [
      "Confirm catalogue migration 0006 is applied, identify the database and inspect the Book model fields. Do not delete existing rows to make the exercise easier.",
      "Save catalogue/stored_serializers.py and catalogue/stored_api.py exactly as taught, and append the two routes without replacing the earlier URLs.",
      "Explain the POST operation in order: HTTP JSON parsing, serializer field validation, serializer.save(), database insertion, response rendering.",
      "Run catalogue/stored_request_lab.py and prove create=201, stored row, fresh request=200, patch=200 and unchanged title, year and code.",
      "Show two 400 cases and unchanged database count, a missing detail 404 and an unsupported method 405.",
      "Open a second Python shell after the test run and retrieve the new row from the database to prove it outlived a particular request or Python object.",
      "Remove serializer.save() in a disposable experiment, predict what fails, restore it, and justify why the original in-memory 201 lesson was not a real create endpoint.",
      "List the actual ownership, permission, concurrency and domain invariants this deliberately open local API does not enforce."
    ],
    deliverables: ["Complete model serializer", "Real collection/detail APIView source", "Preserved URL wiring", "Source-published HTTP and database assertions", "Fresh-shell persistence proof", "Security/domain limitations note"],
    completionCriteria: ["A valid POST commits exactly one new Book.", "PATCH persists only requested changes.", "Negative requests do not add rows.", "The learner explicitly distinguishes HTTP status, validated representation, persistence and authorization."]
  },
  "django-and-api-engineering-production-readiness-commands-and-atomic-updates": {
    objective: "Prove the production-readiness rule through real transactional Django operations.",
    scenario: "The canonical Service model and Environment relationship are already established. A service must not become production-stage without a production deployment, and its last production deployment must not be removed while active in that stage.",
    instructions: [
      "Save registry/services.py exactly as shown in the reading and identify how both commands lock the same Service row inside transaction.atomic().",
      "With a new UAT Service, attempt promotion without a production Environment and verify the exception leaves lifecycle unchanged.",
      "Add a production Environment, promote successfully and read the saved lifecycle again; then attempt deletion of the only production Environment and prove the row remains.",
      "Map the explicit ReadinessConflict to a stable API 409 without swallowing programming errors; explain which Team authorization the API must check separately.",
      "Plan a real two-session race test and distinguish an unexecuted concurrency plan from proven transactional behavior."
    ],
    deliverables: ["Executable command implementation", "Three positive/negative database transcripts", "Domain error contract", "Authorization and concurrency limitations"],
    completionCriteria: ["Database state is checked after each outcome.", "The implementation coordinates both mutation paths.", "No untested concurrency claim is presented as validated."]
  },
  "django-and-api-engineering-add-a-field-without-losing-existing-django-rows": {
    objective: "Add a nullable field to a populated Book table without replacing or losing existing records.",
    scenario: "Your independent tsa-django-intro catalogue already has two applied migrations, four Books and related ReadingList entries. Use its own disposable database, never the Steward or manually seeded PostgreSQL databases.",
    instructions: [
      "Confirm the current database and the applied 0001/0002 catalogue migrations. Capture Book IDs and reading-list membership pairs before making any change.",
      "Replace only the original Book class with the complete edition_note version from the lesson; retain the existing related models.",
      "Generate migration 0003, review the generated AddField and sqlmigrate SQL, and record the [ ] state in showmigrations before migrate.",
      "Before applying migration 0003 in the disposable lab, attempt a query selecting edition_note and document the actual missing-column error. Do not fake migration history or drop the Book table.",
      "Apply migration 0003, verify [X], run catalogue/optional_migration_check.py, and prove the old row IDs remain unchanged while one note is saved.",
      "Explain which steps touched source files, the migration graph, the actual database schema and stored data."
    ],
    deliverables: ["Reviewed nullable AddField migration", "Before/after applied migration status", "Missing-column failure", "Stable Book identity evidence", "Optional field read/write proof"],
    completionCriteria: ["The changes run from one real scratch Django project.", "No unexplained state loss or database switch occurs.", "The learner distinguishes generating, inspecting and applying migrations."]
  },
  "django-and-api-engineering-backfill-a-unique-field-without-losing-data": {
    objective: "Execute a three-migration schema/data change with a genuine collision, repair and final UNIQUE/NOT NULL proof.",
    scenario: "The Book catalogue is now populated and contains edition_note. A new shelf_code must become mandatory and unique without inventing a default or deleting existing books.",
    instructions: [
      "Add nullable shelf_code to Book, generate and inspect 0004, then migrate only that schema stage.",
      "Run the collision/baseline script: capture Book IDs and ReadingListEntry references, insert the deliberate distinct title river-guide and record its primary key.",
      "Create the empty 0005 migration, replace it with the exact historical-apps RunPython file, and confirm its dependency on 0004.",
      "Run migrate and record a real ValueError. Verify 0005 remains unapplied and all prior slug writes rolled back; explain why a nonzero exit alone is insufficient evidence.",
      "Repair only the intentionally conflicting training title while preserving its PK. Re-run migrate and inspect all generated slugs.",
      "Replace Book with the final required unique definition, author complete 0006 AlterField, inspect sqlmigrate, apply and check makemigrations --check --dry-run.",
      "Run catalogue/verify_shelf_migration.py and prove unchanged Book IDs, unchanged relation pairs, distinct slugs, and rejected duplicate/NULL SQL writes.",
      "Write a rollback/forward plan for a successfully applied irreversible RunPython migration and a separate plan for a live writer inserting new rows during backfill."
    ],
    deliverables: ["Three complete migration files", "Actual failed and successful backfill runs", "Unique-slug collision resolution", "Before/after ID/FK snapshot", "IntegrityError negative evidence", "Deployment/reversal decision note"],
    completionCriteria: ["The failed backfill is transactional and remains unapplied.", "The successful backfill preserves relationships and enforces constraints.", "Irreversibility and concurrent-writer risk are explicit."]
  },
  "django-and-api-engineering-schema-evolution-with-django-migrations": {
    objective: "Transfer the verified populated-table method to the real PostgreSQL-backed Steward Service schema with explicit deployment constraints.",
    scenario: "Use only the separate tsa_steward_django_lab with existing Team/Service/Environment data. The Book lab already taught first principles; this is a domain integration exercise, not an abbreviated second introduction.",
    instructions: [
      "Record Service IDs/owning_team_id and applied registry migration history before modifying a model.",
      "Add nullable slug to the real Service model without changing lifecycle, ownership or existing foreign keys. Save the complete registry 0002 AddField source and inspect sqlmigrate before applying.",
      "Create two UAT Services whose distinct names generate the same slug. Do not violate the production Environment prerequisite to manufacture fixture rows.",
      "Save the complete historical-model 0003 backfill migration. Prove it fails on the deliberate duplicate, leaves every slug NULL and is not marked applied.",
      "Rename only the fictional conflicting Service, keeping its PK and owner. Retry the backfill, inspect every slug and confirm IDs/ownership remain stable.",
      "Change the model field to non-null unique, save the complete 0004 AlterField migration, inspect SQL and apply it. Verify database duplicate rejection, showmigrations and makemigrations --check --dry-run.",
      "Explain why a real rolling deployment needs a plan for concurrent writers, lock budget, old/new application versions and public slug stability. Mark any unrun production or parallel-client scenario UNVERIFIED."
    ],
    deliverables: ["Source-published registry 0002/0003/0004 migration files", "Collision and repair transcript", "Before/after Service identity/ownership proof", "Real uniqueness constraint failure", "Deployment-compatibility and recovery decision"],
    completionCriteria: ["No manually seeded PostgreSQL table is fake-migrated or overwritten.", "All source code examples are executable on the owned training database.", "A green local migration is not falsely labeled production-safe."]
  },
  "django-and-api-engineering-build-and-execute-your-first-queryset": {
    objective: "Construct an actual QuerySet, trace when database work happens and inspect its returned rows.",
    scenario: "Continue the independent tsa-django-intro catalogue and its migrated Book, ReadingList and ReadingListEntry models. Do not introduce Steward or Docker before mastering the ORM basics.",
    instructions: [
      "Save catalogue/query_seed.py from the reading, run it from the directory containing manage.py and verify four books, three lists and three entries. If the scratch dataset differs, inspect it before taking cleanup action.",
      "Save catalogue/queryset_first.py and execute it using the published manage.py shell command.",
      "Record zero queries during queryset construction, one during iteration, and zero when reusing the evaluated QuerySet. Inspect the generated WHERE/ORDER BY without asserting a backend-independent raw SQL string.",
      "Change the year filter to 2023; predict the result from actual catalogue data before executing.",
      "Explain the difference between an empty valid queryset and an unmigrated-table/database connection error."
    ],
    deliverables: ["Actual fixture transcript", "Captured SQL count and filtered results", "SQL-to-ORM explanation", "Negative diagnosis"],
    completionCriteria: ["The example runs using only the established catalogue project.", "Query execution and result reuse are measured rather than guessed.", "No database or schema is silently replaced."]
  },
  "django-and-api-engineering-choose-django-query-methods-and-reuse-results": {
    objective: "Match query methods to their return contracts and prove QuerySet cache boundaries.",
    scenario: "Use the four Book rows from the preceding learner-created fixture rather than assuming services, tokens or permissions.",
    instructions: [
      "Save and run catalogue/queryset_methods.py exactly as printed.",
      "Explain the different outputs and failures of get, first, exists, count and a fully evaluated list, including zero, one and multiple matching rows.",
      "Compare SQL counts from reusing one evaluated QuerySet, creating two fresh QuerySets and indexing an unevaluated QuerySet twice.",
      "Deliberately make a naive benchmark with an already-evaluated QuerySet; explain why the second iteration reports zero queries.",
      "Choose between a count-only endpoint and an endpoint that will immediately render full results, and defend the number of SQL operations."
    ],
    deliverables: ["Actual query-count transcript", "Return-contract table", "Two get() failure explanations", "Cache measurement pitfall"],
    completionCriteria: ["The two get() failures are observed, not hypothetical.", "The learner distinguishes already-cached from newly constructed QuerySets.", "Method choice follows the caller's real data requirement."]
  },
  "django-and-api-engineering-load-related-django-rows-without-repeating-queries": {
    objective: "Prove N+1 as real repeated SQL and choose relation loading based on direction and cardinality.",
    scenario: "Use the same three ReadingList-to-entry memberships and model definitions already developed in the scratch catalogue.",
    instructions: [
      "Run catalogue/queryset_relations.py and record 4→2 for reverse entries and 4→1 for forward book references.",
      "For each CaptureQueriesContext scope, identify the main SELECT and the per-row SELECTs, and show the result dataset has not changed.",
      "Add one more list and relationship. Predict which counts grow and which should remain bounded, then verify with a new run.",
      "Change select_related('book') to select_related('reading_list') while still accessing entry.book and explain the wrong-target failure.",
      "Before applying the technique to Steward, confirm the actual ForeignKey and related_name paths from models.py. Do not guess an environments field; inspect the model.",
      "Distinguish query-count reduction from a demonstrated API latency improvement."
    ],
    deliverables: ["Four real query-count measurements", "Identical before/after result proof", "Cardinality and relation-direction explanation", "Expanded-fixture transfer evidence"],
    completionCriteria: ["No unrelated process or external database is required.", "Both loading strategies are selected for the correct relationship direction.", "A smaller number of queries is not misrepresented as a measured latency gain."]
  },
  "django-and-api-engineering-orm-query-behavior-and-performance": {
    objective: "Observe QuerySet evaluation and eliminate a real N+1 query pattern.",
    scenario: "Use the isolated Django-managed Steward registry created earlier; apply the SQL understanding already learned in PostgreSQL before evaluating ORM abstractions.",
    instructions: [
      "Seed multiple Service records with known Team ownership in tsa_steward_django_lab; verify database and model identity before running queries.",
      "Build a filtered QuerySet and inspect its SQL without evaluating it. Use a fresh QuerySet and query-capture tooling to record when iteration executes SQL.",
      "Access owning_team for N objects without eager loading and record the actual SQL count. Repeat on fresh data with select_related and compare identical result rows and query counts.",
      "Explain why a many-valued reverse Environment collection calls for prefetch_related, and name a case where raw parameterized SQL is clearer.",
      "Document one failure caused by measuring an already evaluated/cached QuerySet; distinguish statement counts from measured latency."
    ],
    deliverables: ["Generated SQL and evaluation transcript", "N+1 before/after counts with identical results", "Relationship-loading decision"],
    completionCriteria: ["The measured SQL statements are real, not estimated.", "No unexplained fixture or absent Django model is assumed.", "Single-valued and many-valued relationships are distinguished."]
  },
  "django-and-api-engineering-define-your-first-django-model": {
    objective: "Define and inspect a complete Book model in the previously built catalogue scratch project.",
    scenario: "The PostgreSQL module already established tables and columns. Use the independent Django catalogue before mapping the Steward domain; no new Docker or Steward dependency.",
    instructions: [
      "Open the existing tsa-django-intro project, verify the catalogue application is registered and identify its models.py.",
      "Replace the starter catalogue/models.py with the Book class from the reading. Explain Model, CharField, PositiveIntegerField, unique=True and the implicit id.",
      "Run python manage.py check and distinguish the source model from a database table. Do not assume the table exists until a migration runs.",
      "Write down the expected SQL columns, constraints and primary key; identify which aspects depend on the database backend.",
      "Predict what an ORM query will do before any catalogue migrations are applied, and document the observed error without deleting files or tables."
    ],
    deliverables: ["Complete catalogue/models.py", "Model-to-table explanation", "Django system-check output", "Unmigrated-table diagnosis"],
    completionCriteria: ["The model definition is runnable and novice-readable.", "A class declaration is not confused with table creation.", "No application-domain deployment prerequisites are assumed."]
  },
  "django-and-api-engineering-turn-a-model-into-a-database-table": {
    objective: "Apply and inspect the first Django migration, then differentiate Python field validation from database uniqueness.",
    scenario: "Use the same tsa-django-intro project and its disposable SQLite database; do not connect the migration to tsa_library or the Steward PostgreSQL dataset.",
    instructions: [
      "Run makemigrations catalogue, inspect 0001_initial.py and run sqlmigrate catalogue 0001 without falsely claiming SQL was executed.",
      "Run showmigrations catalogue before and after migrate; identify the applied [X] state.",
      "Create catalogue/books_lab.py exactly as in the lesson and execute it once through manage.py shell.",
      "Explain the stored Book instance and separately reproduce BLANK_TITLE_REJECTED through full_clean and DUPLICATE_TITLE_REJECTED from the database.",
      "If the database table is missing, diagnose with showmigrations and DATABASES before attempting a repair."
    ],
    deliverables: ["First migration and SQL review", "Before/after migration evidence", "Saved Book row", "Two different rejection outcomes", "Database-target note"],
    completionCriteria: ["The model and table now agree.", "The learner understands why full_clean and save have different validation behavior.", "The database rejected a duplicate title rather than a mocked branch."]
  },
  "django-and-api-engineering-create-relationships-between-django-models": {
    objective: "Build two connected models and prove two deletion policies plus a composite uniqueness rule.",
    scenario: "Continue the same catalogue and Book row. This is the prerequisite for applying multiple relations to the Steward schema.",
    instructions: [
      "Append ReadingList and ReadingListEntry below Book, retaining the existing model and import.",
      "Generate and inspect migration 0002 before migrate, checking the foreign keys and compound uniqueness rule.",
      "Run the source-published relations_lab.py and capture list_items=1, duplicate rejection, protected Book delete, list cascade and preserved Book.",
      "Add a second distinct Book and explain the pair uniqueness behavior before executing the write.",
      "Identify which deletions are enforced by Django's ORM collector and what would require a separate raw-SQL verification."
    ],
    deliverables: ["Related model classes", "Reviewed migration 0002", "Actual membership/deletion/constraint evidence", "ORM versus raw SQL deletion distinction"],
    completionCriteria: ["The same Book data survives cascade list deletion.", "Composite uniqueness and PROTECT are observed, not merely described.", "The learner can explain one-to-many, through models and relation direction."]
  },
  "django-and-api-engineering-steward-sql-to-django-orm-one-canonical-domain": {
    objective: "Map the previously learned PostgreSQL relational facts into a new Django-managed training database.",
    scenario: "After the scratch Django/DRF introduction, create an isolated Steward Django project. Do not run migrations over the manually seeded tsa_steward_lab or assume the book catalogue is the Steward registry.",
    instructions: [
      "Select and verify a NEW empty tsa_steward_django_lab database; explicitly distinguish it from the manually managed tsa_steward_lab and the scratch catalogue project.",
      "Create the registry app and enter the reading's Team, Service and Environment model definitions, including owning_team, lifecycle choices and Environment.kind.",
      "Run makemigrations, inspect sqlmigrate and apply migrate to the new Django-managed database only. Record generated tables and Django migration ownership.",
      "Create one Team, Service and production Environment, then query ownership and lifecycle to compare them with SQL facts.",
      "Explain why production lifecycle does not imply a production Environment and why a ModelSerializer belongs in the later serializers lesson."
    ],
    deliverables: ["Database target and migration history proof", "Model-to-SQL mapping", "One working relationship query", "Lifecycle versus deployment explanation"],
    completionCriteria: ["No manually seeded database is overwritten.", "The reading's explicit fields and table names are used.", "No serializer is required before the serializer prerequisite."]
  },
  "django-and-api-engineering-django-from-zero-a-running-http-endpoint": {
    objective: "Run the first Django HTTP endpoint without requiring a Steward project, database or DRF.",
    scenario: "In an empty scratch directory, build a disposable Django project and observe one real HTTP response. The next lesson will introduce reusable applications and routing.",
    instructions: [
      "Create tsa-django-intro in a new empty directory, activate an isolated Python virtual environment and install Django exactly as the reading specifies.",
      "Generate config and manage.py, inspect the new files and explain which program starts the HTTP listener.",
      "Create the complete URL/view example from the reading, run the development server in terminal A and send a real curl request in terminal B.",
      "Capture status, content type and response body; then stop the server and distinguish an unreachable listener from a Django HTTP 404.",
      "Keep this scratch project for the following Django Foundations and DRF lessons. Do not create a Steward service or PostgreSQL schema here."
    ],
    deliverables: ["New project file tree and active interpreter", "HTTP request/response evidence", "Server-off connection failure and explanation"],
    completionCriteria: ["A novice can reproduce the endpoint from an empty directory.", "No unintroduced app, database model or Steward repository is necessary.", "Both successful and failed network behavior are correctly identified."]
  },
  "django-and-api-engineering-django-foundations": {
    objective: "Create and understand a Django application within the already-running scratch project.",
    scenario: "Continue tsa-django-intro from the previous lesson. The project exists, but the learner has not yet created the catalogue app, included app URLs or traced Django's request path.",
    instructions: [
      "Reuse the activated environment and existing config project. Run startapp catalogue once; inspect its generated files before editing anything.",
      "Register catalogue in INSTALLED_APPS, create catalogue/views.py and catalogue/urls.py and include catalogue.urls under /catalogue/ exactly as shown in the reading.",
      "Send GET /catalogue/books/, GET /books/ and POST /catalogue/books/ and record 200, 404 and 405 respectively. Explain which layer caused each outcome.",
      "Execute the published Django test-client assertions and contrast an in-process client with a real listening network server.",
      "Draw the path from the HTTP listener through middleware, project URLs, app URLs, view and response. Keep the scratch project for the next DRF lesson."
    ],
    deliverables: ["Catalogue app and exact route files", "Three HTTP response transcripts", "Test-client proof", "Project/app/request-flow diagram"],
    completionCriteria: ["Every path and file used is taught in this or the preceding lesson.", "The plain Django app works without Steward or DRF.", "The learner explains an HTTP 404 versus 405 without guessing."]
  },
  "django-and-api-engineering-django-rest-framework": {
    objective: "Prove what Django REST Framework adds to a working plain Django endpoint.",
    scenario: "Continue the same tsa-django-intro catalogue app. Compare the earlier JsonResponse endpoint with a second DRF endpoint rather than silently switching projects or using unexplained ORM models.",
    instructions: [
      "Install DRF in the existing virtual environment and add rest_framework to INSTALLED_APPS; retain catalogue and the plain /catalogue/books/ route.",
      "Create catalogue/api_views.py with the published @api_view greet implementation and add /catalogue/greet/ without removing the existing route.",
      "Send the successful POST with JSON Content-Type and Accept headers, then reproduce all four published negative requests (400, 405, 415, 406).",
      "For each response, identify whether routing, method dispatch, parsing, field checking or content negotiation explains it.",
      "Explain why the endpoint does not require a database, serializer, ViewSet or Steward application. Save this project for the later standalone serializer lesson."
    ],
    deliverables: ["One working Django endpoint and one DRF endpoint", "Five actual request/response captures", "Explanation of Content-Type versus Accept and failure layers"],
    completionCriteria: ["All requests target the explicitly created catalogue app.", "The learner can explain DRF Request and Response without models or ViewSets.", "The 400/405/415/406 outcomes are reproduced rather than asserted."]
  },
  "django-and-api-engineering-projects-applications-and-boundaries": {
    objective: "Understand Django project/application boundaries using an app the learner has already created.",
    scenario: "The catalogue app and DRF greet route now exist. Examine that actual codebase first, then compare two possible designs for a future Steward registry; the registry app is created in the following ORM bridge, not assumed here.",
    instructions: [
      "In tsa-django-intro, sketch configuration, catalogue.urls, catalogue.views and catalogue.api_views; identify what imports what and how one request reaches a response.",
      "Run python manage.py check and import catalogue.views using the existing virtual environment; verify GET /catalogue/books/ still works.",
      "Describe where catalogue models and database persistence would live if this app gained stored books, without creating unnecessary model code.",
      "Compare a hypothetical one-app-per-table Steward structure with a cohesive registry app; show how circular imports could appear.",
      "Draw a proposed future registry.views → registry.services → registry.models dependency without claiming those files exist yet. Explain which coupling or ownership change would justify splitting the app."
    ],
    deliverables: ["Actual catalogue file/import diagram", "Django check and route result", "Two compared Steward designs clearly labeled hypothetical", "Rule for when to separate an app"],
    completionCriteria: ["Every executable instruction uses files created in earlier lessons.", "The learner distinguishes concrete catalogue evidence from proposed registry design.", "The first Steward registry project remains a later, explicit build step."]
  },
  "django-and-api-engineering-models-and-domain-data": {
    objective: "Complete Steward's Django persistence model by mapping the relational design already built in PostgreSQL rather than inventing a new framework-shaped domain.",
    scenario: "The Django foundation checkpoint mapped enough Service data to prove the stack. PostgreSQL work already established Team, Service, Environment, ServiceDependency and ServiceReview relationships. Now bring those established facts into Django while deciding which invariants belong in database constraints and which remain operation-level behavior.",
    instructions: [
      "Place the PostgreSQL schema from the previous school beside the current Django models and create a field/relationship mapping.",
      "Implement or refine Team, Service, Environment and ServiceDependency using domain-language names. Explain null versus blank on one field, on_delete on each ForeignKey and whether any relationship needs an explicit through model.",
      "Generate and inspect migrations before applying them. Identify any SQL/schema effect that differs materially from the earlier relational design.",
      "Preserve at least one database-enforced invariant such as uniqueness and demonstrate a rejected invalid write.",
      "Keep one state/operation rule in application/domain behavior where a field constraint alone cannot express it correctly.",
      "Query the resulting model through Django and directly through PostgreSQL to verify that both views describe the same persisted facts.",
      "Record any intentional divergence from the earlier schema as a design decision rather than accidental framework drift."
    ],
    deliverables: ["SQL-to-Django mapping table", "Completed core models", "Reviewed migrations", "Database-rejection evidence", "Application-rule example", "Cross-check query evidence"],
    completionCriteria: ["Django models trace back to the relational model the learner actually built.", "Core relationships are not silently redesigned by framework convenience.", "At least one invariant is protected below the HTTP layer.", "Operation-level behavior is not forced into an inappropriate field constraint.", "Intentional schema changes are documented."]
  },
  "django-and-api-engineering-serializers-and-representation": {
    objective: "Learn representation validation with an independent book example before applying ModelSerializer to the Steward model.",
    scenario: "An HTTP client submits untrusted JSON. The learner must first prove which fields a plain DRF Serializer accepts and rejects, without assuming that validation writes to a database.",
    instructions: [
      "In the existing tsa-django-intro catalogue app, create BookSerializer exactly as taught; do not start with ModelSerializer.",
      "Execute serializer_lab.py, serializer_negatives.py and serializer_patch.py. Record initial_data, validated_data, errors and outgoing .data.",
      "Prove that an incoming read-only book_id is excluded, a malformed year and missing digital URL are rejected, and partial=True does not erase unchanged fields.",
      "Explain why is_valid() did not persist a row. Compare field-level validation with cross-field validation and distinguish both from domain authorization.",
      "Only after the book experiment, apply a ModelSerializer to the separately created Steward Service model with deliberately read-only id and owning_team. Do not infer that the serializer enforces Team authorization or deployment-readiness rules."
    ],
    deliverables: ["Three executable book-serializer scripts and results", "Input/output field contract", "One controlled Steward ModelSerializer application after prerequisites"],
    completionCriteria: ["The first serializer experiment works without database models.", "The learner proves read-only and partial-field behavior.", "Steward ModelSerializer is clearly a later application, not an assumed prerequisite."]
  },
  "django-and-api-engineering-views-viewsets-and-routing": {
    objective: "Keep HTTP orchestration thin and choose view abstractions that make Steward behavior easier, not harder, to understand.",
    scenario: "The /services endpoint has started accumulating queries, validation, domain rules and response shaping in one method. Refactor it while comparing explicit views with generic/ViewSet abstractions.",
    instructions: ["Implement or inspect list/create and detail operations using at least two levels of the DRF view abstraction ladder (for example APIView and a generic/ViewSet) before choosing one.", "Mark every line that belongs to HTTP orchestration, persistence, authorization, domain behavior or representation.", "Move at least one non-HTTP responsibility out of the view.", "Inspect router-generated routes/actions if using a ViewSet and map list/create/retrieve/update/partial_update/destroy to HTTP methods and collection/detail URLs.", "Add a custom action only if it represents a genuine domain operation, then justify why ordinary CRUD was insufficient."],
    deliverables: ["Responsibility-marked view review", "Refactored endpoint", "Route inventory", "View abstraction decision"],
    completionCriteria: ["Views coordinate rather than own business behavior.", "Generated routes can be explained.", "Any custom action has a domain reason rather than framework convenience."]
  },
  "django-and-api-engineering-validation-and-business-rules": {
    objective: "Place Steward rules where every caller can rely on them and reinforce critical invariants at appropriate lower layers.",
    scenario: "Self-dependency is rejected in one REST endpoint, but a management command can still create it. Treat this as a rule-placement defect rather than another serializer patch.",
    instructions: ["Reproduce self-dependency through two different entry paths and verify which validation hooks actually run; explicitly demonstrate that model save() does not automatically imply full_clean().", "Move or implement the rule in a reusable application/domain boundary.", "Add duplicate-dependency protection and decide whether a database constraint should reinforce it.", "Exercise one valid and two invalid operations outside a single view.", "Document how each rejection becomes an API error without making HTTP the owner of the rule."],
    deliverables: ["Multi-entry-point reproduction", "Reusable rule implementation", "Constraint decision", "Rule-to-API translation evidence"],
    completionCriteria: ["The same rule holds across more than one caller.", "Critical invariants are reinforced where justified.", "HTTP error translation is separated from domain-rule ownership."]
  },
  "django-and-api-engineering-see-how-drf-turns-exceptions-into-http-responses": {
    objective: "Trace raised DRF exceptions through a real configured handler to HTTP responses without silently changing stored Book rows.",
    scenario: "Reuse the already migrated tsa-django-intro catalogue and its working persistent Book API. This lesson does not need a production Service, Docker, tokens, Identity or an external API gateway.",
    instructions: [
      "Create catalogue/error_handlers.py and catalogue/error_views.py exactly as in the reading. Explain what exception_handler may return and why unhandled failures must remain 500.",
      "Append only the two new URLs to catalogue/urls.py, retaining every earlier route, and configure REST_FRAMEWORK.EXCEPTION_HANDLER in config/settings.py without wiping other settings.",
      "Run python manage.py check. Save catalogue/error_contract_lab.py and execute it from manage.py shell. Record actual 200, 400, 404, 405, 406, 415 and the Book count before and after.",
      "Save catalogue/error_test_urls.py as a deliberately isolated URLConf, NOT in the deployed urlpatterns. Trigger RuntimeError with DEBUG=False and Client(raise_request_exception=False); verify status 500 and no exposed internal text.",
      "Change one handler mapping in a disposable copy and verify which HTTP status/header remains unchanged while your public code changes; restore the original.",
      "Explain why a returned Response(status=400) bypasses custom exception handling and why a regular Django 404 outside APIView may have a different body."
    ],
    deliverables: ["Source files and configuration", "HTTP failure and no-write transcript", "Unexpected 500 leak test", "Exception-vs-direct-Response explanation"],
    completionCriteria: ["The expected HTTP errors are actual framework responses, not mock status dictionaries.", "The handler does not relabel unexpected exceptions as 400.", "The deliberately broken route is test-only and never added to public urlpatterns."]
  },
  "django-and-api-engineering-api-error-handling": {
    objective: "Map the existing transaction-safe Steward readiness command to real HTTP 409 and verify that a rejected request makes no database change.",
    scenario: "The Book catalogue already taught real DRF exception handling, and registry/services.py already owns the atomic cross-table readiness rule. Now join them in a strictly isolated training URLConf. Actual authentication and Team authorization belong to the next Builder module.",
    instructions: [
      "In the separate migrated tsa_steward_django_lab, create registry/api_errors.py, registry/readiness_api.py and registry/training_urls.py from the reading. Do not add training_urls to production config/urls.py.",
      "Read registry/services.py and identify the database transaction, Service row lock and ReadinessConflict boundary. The view must call this existing command, not duplicate its business decision.",
      "Run registry/error_contract_lab.py inside manage.py shell. Verify real 409 with unchanged lifecycle and Environment count, a successful 200 after adding a production Environment, and missing 404/unsupported method 405.",
      "Explain why a random exception should not be converted into 400 or 409, and why the public message is intentionally less detailed than private diagnostic evidence.",
      "Write the separate future authorization requirements for cross-Team 403/404 and object-scoped mutations; do not claim this unsecured demonstration is ready for external clients."
    ],
    deliverables: ["Working domain-to-HTTP handler", "Isolated test-only URLConf", "Reproducible 409/200/404/405 results", "Database nonmutation evidence", "Explicit unimplemented authorization contract"],
    completionCriteria: ["ReadinessConflict is translated to 409 by the configured DRF handler.", "A failed promotion leaves persisted state unchanged.", "The normal application URLConf has no training promotion route.", "No production authorization or concurrency guarantee is inferred from the local exercise."]
  },
  "django-and-api-engineering-filter-search-and-order-a-real-book-api": {
    objective: "Implement an actual bounded GET query contract over the already migrated Book model and prove its SQL and negative HTTP behavior.",
    scenario: "Continue the existing tsa-django-intro catalogue and its persisted Book API. No Steward domain data, Docker, authenticated users or permission system is presumed.",
    instructions: [
      "Review the actual Book model and completed migration 0006, then create catalogue/query_books.py from the complete lesson code.",
      "Append the query-books URL to existing catalogue/urls.py. Preserve every earlier working route. Explain the function of request.query_params and QueryDict.getlist.",
      "Run python manage.py check and execute catalogue/query_request_lab.py via manage.py shell. Record exact search, year filtering and descending year+PK tie-break output from six known books.",
      "Inspect the actual captured SQL and identify the WHERE and ORDER BY clauses. Do not report fabricated SQL strings as executed database statements.",
      "Submit unlisted ordering paths, invalid year, blank or too-long search, unknown parameters and duplicate year. Record 400 with the existing error-handler envelope and unchanged Book count.",
      "Add a seventh training Book and predict its effect on each positive query. Explain how an authorized Service base queryset differs from this open tutorial catalogue."
    ],
    deliverables: ["Source and appended route", "Actual GET and SQL trace", "Six rejected input cases", "Seventh-book transfer explanation"],
    completionCriteria: ["Filtering, searching and ordering are independently explained.", "The tested endpoint executes real QuerySets, not a synthetic parser.", "Unsupported ORM paths cannot reach order_by.", "No fictional authorization guarantees are claimed."]
  },
  "django-and-api-engineering-paginate-real-book-records-across-requests": {
    objective: "Observe real DRF page numbers and cursor continuation while the underlying ordered Book table changes between HTTP requests.",
    scenario: "The same catalogue now supports validated query_books and persisted Book rows. Use only invented Page Lab titles and shelf codes in its disposable database.",
    instructions: [
      "Create catalogue/page_books.py and append page-books/ and cursor-books/ to the existing catalogue URLs exactly as shown.",
      "Run python manage.py check, then execute catalogue/pagination_request_lab.py once from the managed Django shell. Preserve the expected one-time Aardvark insertion.",
      "Capture the first page count 5 and two rows, then the second page count 6. Explain exactly why the new earlier-sorting Book produces a duplicate Cedar across the numbered pages.",
      "Continue from the opaque cursor obtained BEFORE the insertion and verify it returns Delta and Elm without repeating the preceding rows, under the specific immutable shelf_code order.",
      "Request page_size=100 and prove the response is capped at 3, not 100. Prove malformed, unsupported and duplicate parameters yield 400, while missing numbered page yields 404.",
      "Explain why the cursor response has no total count or frozen snapshot, and why Team authorization must later precede all count/filter/page logic."
    ],
    deliverables: ["Two real DRF pagination routes", "Captured page counts and links", "Offset-shift and cursor-continue transcript", "Bounded/invalid page responses", "Consistency and access-control explanation"],
    completionCriteria: ["Queryset order is explicit before any slicing.", "The moving-page duplicate is observed via two separate database-backed requests.", "Cursor evidence is not misrepresented as transactional snapshot isolation.", "The demo is not presented as multi-tenant secured."]
  },
  "django-and-api-engineering-filtering-searching-and-ordering": {
    objective: "Expose query capabilities that answer real Steward questions without accidentally publishing an unbounded query language.",
    scenario: "A generic filter backend makes every field searchable and orderable. It is convenient, but nobody has decided whether those capabilities belong to the public contract or what they cost.",
    instructions: ["List the actual collection questions Steward clients need to ask.", "Implement explicit lifecycle, criticality and owner-team filters using an allowlisted FilterSet/backend contract rather than passing arbitrary query parameters into ORM lookups.", "Add bounded name search and deliberate ordering_fields. Include slug search only after the dedicated slug migration exists; inspect the public query-parameter contract and generated SQL.", "Attempt one unsupported query and confirm it is rejected or ignored predictably.", "Inspect at least one generated SQL query and identify a future performance concern."],
    deliverables: ["Supported-query matrix", "Implemented filters/search/order", "Unsupported-query evidence", "SQL observation note"],
    completionCriteria: ["Every exposed query capability maps to a known use case.", "Search, filtering and ordering are distinguished.", "The public surface is intentionally bounded."]
  },
  "django-and-api-engineering-pagination": {
    objective: "Make collection pagination deterministic, bounded and understandable under changing data.",
    scenario: "A client reports seeing duplicate services while paging through /services. The API uses framework-default pagination but never defined ordering or maximum size.",
    instructions: ["Create enough services to require multiple pages.", "Demonstrate the current ordering behavior and identify whether it is deterministic.", "Set explicit ordering, a sensible default page size and a maximum. Implement/compare page-number or limit-offset behavior with cursor pagination on the same changing collection.", "Test empty, one-page and multi-page collections.", "Insert or modify data between page requests and document what consistency guarantee the chosen pagination style does and does not provide."],
    deliverables: ["Pagination configuration", "Multi-page evidence", "Ordering/consistency experiment", "Client-contract note"],
    completionCriteria: ["Pagination uses deterministic ordering.", "Response size is bounded.", "You can explain the consistency limitations of the chosen approach."]
  },
  "django-and-api-engineering-api-versioning": {
    objective: "Classify API changes by compatibility impact before reaching for a new version.",
    scenario: "Product asks for several changes and the immediate proposal is '/v2'. Review the changes first: some may be additive, some breaking, and some redesignable without parallel API versions.",
    instructions: ["Classify at least ten hypothetical Steward changes as additive, compatible behavior change or breaking.", "For three breaking candidates, explore whether the contract can evolve without a new major version.", "Compare URI and header/media-type versioning for Steward.", "Choose a versioning strategy and define when it should actually be invoked.", "Write a deprecation notice for one unavoidable breaking change."],
    deliverables: ["Compatibility classification table", "Alternative evolution analysis", "Versioning decision record", "Deprecation notice"],
    completionCriteria: ["Versioning follows compatibility analysis rather than habit.", "At least one apparent breaking change is reconsidered.", "Support/deprecation obligations are acknowledged."]
  },
  "django-and-api-engineering-openapi-and-swagger-documentation": {
    objective: "Use OpenAPI as contract evidence and detect drift between generated documentation and real runtime behavior.",
    scenario: "Swagger UI looks complete, but it documents only success responses and one field is writable in the schema even though runtime rejects it. Treat generated documentation as something to verify, not trust automatically.",
    instructions: ["Generate the Steward OpenAPI schema and identify its paths, operations, parameters/requestBody, responses, components/schemas and securitySchemes where applicable.", "Inspect /services request and response schemas field by field.", "Document at least two non-2xx responses with stable error shapes.", "Compare one documented request/response with a real curl exchange.", "Find and fix at least one meaningful schema/runtime mismatch."],
    deliverables: ["Generated OpenAPI schema", "Contract review notes", "Documented failure responses", "Before/after drift evidence"],
    completionCriteria: ["Documentation includes important failures, not only happy paths.", "At least one runtime comparison is performed.", "Generated output is reviewed as contract evidence rather than accepted blindly."]
  },
  "django-and-api-engineering-configuration-and-environments": {
    objective: "Turn environment-specific assumptions into an explicit configuration contract with safe defaults and fail-fast production behavior.",
    scenario: "The development setup works because DEBUG, hosts and service URLs are embedded in settings.py. A production deployment using the same defaults would be unsafe. Make environment ownership visible before Delivery school.",
    instructions: ["Inventory settings that genuinely vary by environment.", "Move environment-specific values out of source literals.", "Separate secret from non-secret configuration.", "Make one production-critical value mandatory and demonstrate startup failure when it is missing.", "Verify logs and repository history do not expose the secret value.", "Write a concise configuration contract for local and production-like environments."],
    deliverables: ["Configuration inventory", "Environment-driven settings", "Fail-fast evidence", "Secret-handling check", "Configuration contract"],
    completionCriteria: ["Unsafe production behavior is not enabled silently by development defaults.", "Critical missing configuration fails visibly.", "Secrets are neither committed nor logged."]
  },
  "django-and-api-engineering-application-logging": {
    objective: "Design application logs around diagnostic questions while keeping expected domain rejection distinct from unexpected failure.",
    scenario: "Current logs say 'request received' and 'something went wrong'. During an incident, neither line answers what operation failed, for which service, or whether the event was expected. Replace narration with useful operational evidence.",
    instructions: ["Choose one successful and one rejected Steward operation.", "Define the diagnostic question each log event should answer before adding logging.", "Add contextual fields such as service identifier, operation and reason without logging credentials or tokens.", "Exercise multiple log levels and justify them. Inspect logger/handler hierarchy and propagation so you can explain where each record is emitted and avoid duplicate output.", "Add or propagate a request/correlation identifier where practical.", "Trigger an unexpected exception and compare its log evidence with an expected domain rejection."],
    deliverables: ["Logging event design", "Captured success/rejection/failure logs", "Sensitive-data review", "Log-level rationale"],
    completionCriteria: ["Logs answer concrete diagnostic questions.", "Expected rejection is not automatically treated as an application error.", "Sensitive authentication material is absent.", "Unexpected failure remains operationally distinguishable."]
  }
};

const djangoCoreQualityLessons: Lesson[] = djangoAndApiRichLessons.map((lesson) => ({
  ...lesson,
  activities: lesson.activities.map((activity) => {
    if (activity.content.type !== "practical") return activity;
    const practice = practices[lesson.id];
    return practice ? { ...activity, content: { type: "practical", ...practice } } : activity;
  }),
}));

// These data lessons require the Django project created above. They were authored
// with PostgreSQL material but belong here in learner-facing order.
export const djangoAndApiQualityLessons: Lesson[] = [
  ...djangoCoreQualityLessons,
  ...djangoDependentPostgresqlQualityLessons,
];
