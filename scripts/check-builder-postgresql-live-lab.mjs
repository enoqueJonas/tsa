import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";

// This is an *actual PostgreSQL execution test*, unlike the source-only smoke guard.
// It is intended only for a fresh, isolated database in GitHub Actions.
const source = fs.readFileSync("packages/runtime-kernel/src/paths/builder-postgresql-deep.ts", "utf8");
const requiredEnv = ["PGHOST", "PGPORT", "PGDATABASE", "PGUSER", "PGPASSWORD"];
for (const name of requiredEnv) assert.ok(process.env[name], `A disposable PostgreSQL lab needs ${name}`);
assert.equal(process.env.PGDATABASE, "tsa_steward_lab", "Never execute destructive learning setup against an arbitrary DB");

function codeFromLesson(caption) {
  const i = source.indexOf(`"caption": "${caption}"`);
  assert.ok(i > 0, `Missing published lesson block: ${caption}`);
  const m = source.slice(i).match(/"code":\s*("(?:\\.|[^"\\])*")/);
  assert.ok(m, `Malformed published lesson block: ${caption}`);
  return JSON.parse(m[1]);
}
const root = fs.mkdtempSync(path.join(os.tmpdir(), "tsa-pg-lesson-"));
const run = (args, expectedStatus = 0) => {
  const p = spawnSync("psql", ["-X", "-v", "ON_ERROR_STOP=1", "-At", "-F", "|", ...args], {
    encoding: "utf8", timeout: 20000, env: process.env
  });
  assert.ifError(p.error);
  assert.equal(p.status, expectedStatus, `psql status ${p.status} for ${args.join(" ")}\nSTDOUT:\n${p.stdout}\nSTDERR:\n${p.stderr}`);
  return { out: p.stdout.trim(), err: p.stderr.trim() };
};
const verify = (caption, expectedLines) => {
  const output = run(["-c", codeFromLesson(caption)]).out;
  assert.deepEqual(output ? output.split(/\r?\n/) : [], expectedLines, `Published SQL sample has incorrect result: ${caption}`);
};
try {
  const initial = run(["-c", "SELECT current_database(), current_user, 2+2"]).out;
  assert.equal(initial, "tsa_steward_lab|tsa_learner|4");

  // Execute the exact learner-facing database/schema/table examples in a separate
  // disposable database before the Steward dataset is populated.
  const runLibrary = (caption, expectedStatus = 0) =>
    run(["-d", "tsa_library", "-c", codeFromLesson(caption)], expectedStatus);
  const dbCreated = run(["-d", "postgres", "-c",
    codeFromLesson("SQL in the postgres database — create tsa_library")]).out;
  assert.equal(dbCreated, "CREATE DATABASE");
  assert.equal(run(["-d", "tsa_library", "-c", "SELECT current_database()"]).out, "tsa_library");
  const madeSchema = runLibrary("SQL in tsa_library — create and inspect the library schema").out;
  assert.deepEqual(madeSchema.split(/\r?\n/), ["CREATE SCHEMA", "library"]);
  assert.equal(runLibrary("SQL in tsa_library — create a persistent table").out, "CREATE TABLE");
  assert.equal(runLibrary("SQL — insert two example books").out, "INSERT 0 2");
  const orderedBooks = runLibrary("SQL — read persistent rows").out;
  assert.deepEqual(orderedBooks.split(/\r?\n/), [
    "1|The Hobbit|J. R. R. Tolkien|1937",
    "2|Things Fall Apart|Chinua Achebe|1958"
  ]);
  const bookMetadata = runLibrary("SQL — inspect your book table columns").out;
  assert.deepEqual(bookMetadata.split(/\r?\n/), [
    "book_id|bigint|NO", "title|text|NO", "author|text|NO", "published_year|integer|YES"
  ]);
  assert.equal(runLibrary("SQL — filter books by publication year").out, "Things Fall Apart|1958");
  const badBook = runLibrary("Expected failure — invalid title should not add a row", 1);
  assert.match(badBook.err, /null value in column "title".*violates not-null constraint/);
  assert.equal(run(["-d", "tsa_library", "-c", "SELECT count(*) FROM library.books"]).out, "2");
  const noUnqualifiedTable = run(["-d", "tsa_library", "-c", "SELECT * FROM books;"], 1);
  assert.match(noUnqualifiedTable.err, /relation "books" does not exist/);
  assert.equal(run(["-d", "tsa_library", "-c", "SELECT count(*) FROM library.books"]).out, "2",
    "Permanent books must remain visible from a new client process");
  // UPDATE and DELETE are taught as separate steps on one fictional library
  // record; keep the two historical book examples unchanged.
  assert.equal(runLibrary("SQL — insert one disposable book for updating").out, "INSERT 0 1");
  assert.equal(runLibrary("SQL — preview the exact record before UPDATE").out, "The Blue Compass|Unverified");
  const updatedBook = runLibrary("SQL — update the sample book and return its new value").out;
  assert.match(updatedBook, /The Blue Compass\|M\. Costa/);
  assert.match(updatedBook, /UPDATE 1/);
  assert.equal(runLibrary("SQL — verify the updated book").out, "The Blue Compass|M. Costa");
  assert.equal(runLibrary("SQL — preview the record before DELETE").out, "The Blue Compass|M. Costa");
  const deletedBook = runLibrary("SQL — delete only the disposable book").out;
  assert.match(deletedBook, /The Blue Compass\|M\. Costa/);
  assert.match(deletedBook, /DELETE 1/);
  assert.deepEqual(runLibrary("SQL — confirm the two original books remain").out.split(/\r?\n/), [
    "The Hobbit", "Things Fall Apart"
  ]);
  assert.equal(run(["-d", "tsa_library", "-c", "SELECT count(*) FROM library.books"]).out, "2",
    "UPDATE/DELETE lessons must not leave stray rows");

  // Generic filtering, NULL and ordering lessons run against the library
  // sample or isolated read-only VALUES rows before the Steward audit case.
  const verifyLibrary = (caption, expected) => {
    const actual = runLibrary(caption).out;
    assert.deepEqual(actual ? actual.split(/\r?\n/) : [], expected,
      "Published library SQL mismatch: " + caption);
  };
  verifyLibrary("where_and_not.sql — two simple predicates",
    ["Things Fall Apart", "The Hobbit"]);
  verifyLibrary("where_parentheses.sql — two different sets of books",
    ["The Hobbit", "Things Fall Apart", "Things Fall Apart"]);
  verifyLibrary("where_in.sql — match a list of authors",
    ["Things Fall Apart"]);
  verifyLibrary("where_like.sql — compare LIKE and ILIKE",
    ["The Hobbit", "The Hobbit"]);
  verifyLibrary("null_values.sql — inspect a read-only sample with a missing year",
    ["Known|1937", "Unknown|[missing]"]);
  verifyLibrary("null_equality.sql — compare = NULL with IS NULL",
    ["Unknown"]);
  verifyLibrary("null_truth_table.sql — inspect TRUE FALSE and UNKNOWN",
    ["Known new|true|false", "Known old|false|true", "Unknown|UNKNOWN|UNKNOWN"]);
  verifyLibrary("sort_all.sql — tie-breakers and missing years",
    ["Alpha|2000", "Beta|2000", "Old|1990", "Undated|"]);
  verifyLibrary("sort_limit.sql — return the top three ordered rows",
    ["Alpha", "Beta", "Old"]);
  verifyLibrary("sort_offset.sql — skip one row then take two",
    ["Beta", "Old"]);
  assert.equal(run(["-d", "tsa_library", "-c", "SELECT count(*) FROM library.books"]).out, "2",
    "Generic WHERE/NULL/ORDER lessons must not modify library books");

  // Subquery foundations: execute generic scalar, IN, EXISTS and NOT EXISTS
  // results (and deliberate failure) before the Steward-specific cases.
  verifyLibrary("subquery_library_average.sql — a computed scalar threshold",
    ["1947.5", "The Hobbit"]);
  const multirowScalar = runLibrary("subquery_library_scalar_fail.sql — expected multirow scalar error", 1);
  assert.match(multirowScalar.err, /more than one row returned by a subquery used as an expression/);
  verifyLibrary("subquery_library_in.sql — membership in computed authors",
    ["The Hobbit"]);
  verifyLibrary("exists_library_match.sql — one correlated existence check",
    ["Things Fall Apart"]);
  verifyLibrary("exists_library_missing.sql — find books outside a chosen author list",
    ["The Hobbit"]);
  verifyLibrary("exists_library_join_duplicates.sql — ordinary JOIN produces two matching pairs",
    ["Things Fall Apart", "Things Fall Apart"]);
  verifyLibrary("exists_library_not_in_null.sql — NOT IN returns none; NOT EXISTS returns two",
    ["2", "3"]);
  assert.equal(run(["-d", "tsa_library", "-c", "SELECT count(*) FROM library.books"]).out, "2",
    "Subquery reading must not alter persistent catalogue records");

  // Ordinary WITH and recursive SQL are verified independently of Steward.
  verifyLibrary("cte_library_one.sql — named recent books", ["Things Fall Apart"]);
  verifyLibrary("cte_library_two.sql — staged count and earliest year", ["2|1937"]);
  const missingCte = runLibrary("cte_library_scope_fail.sql — name unavailable after the statement", 1);
  assert.match(missingCte.err, /relation "recent_books" does not exist/);
  verifyLibrary("cte_recursion_numbers.sql — bounded counter", ["1", "2", "3", "4"]);
  verifyLibrary("cte_recursion_people.sql — a three-link chain",
    ["Ana|0", "Bia|1", "Ciro|2", "Dina|3"]);
  verifyLibrary("cte_recursion_cycle.sql — safe walk across A and B", ["A|1", "B|2"]);
  assert.equal(run(["-d", "tsa_library", "-c", "SELECT count(*) FROM library.books"]).out, "2",
    "WITH and recursive examples must not mutate the original book records");

  // Transaction fundamentals run on temporary fictional balances; the original
  // Steward transaction evidence remains later in this integration runner.
  // psql -c sends a multi-command string as one server request; PostgreSQL
  // can group pre-BEGIN statements into an implicit transaction. A later
  // ROLLBACK could then undo CREATE TEMP TABLE itself. The *published* lesson
  // explicitly tells the learner to use psql -f, which dispatches statements
  // separately and preserves the initial temporary table across ROLLBACK.
  const runWalletFile = (filename, caption, expectedLines) => {
    const filepath = path.join(root, filename);
    fs.writeFileSync(filepath, codeFromLesson(caption) + "\n");
    const result = run(["-d", "tsa_library", "-f", filepath]).out;
    assert.deepEqual(result ? result.split(/\r?\n/) : [], expectedLines,
      "Published multi-statement transaction example did not behave as taught: " + caption);
  };
  runWalletFile("wallet_rollback.sql", "wallet_rollback.sql — transfer and undo two writes", [
    "CREATE TABLE", "INSERT 0 2", "BEGIN", "UPDATE 1", "UPDATE 1",
    "Ana|70", "Bia|70", "ROLLBACK", "Ana|100", "Bia|40"
  ]);
  runWalletFile("wallet_commit.sql", "wallet_commit.sql — commit both transfer updates", [
    "CREATE TABLE", "INSERT 0 2", "BEGIN", "UPDATE 1", "UPDATE 1",
    "COMMIT", "Ana|70", "Bia|70"
  ]);
  const savepointFile = path.join(root, "stock_savepoint.sql");
  fs.writeFileSync(savepointFile,
    codeFromLesson("stock_savepoint.sql — recover after an expected CHECK error") + "\n");
  const recoveredStock = spawnSync("psql",
    ["-X", "-v", "ON_ERROR_STOP=0", "-At", "-F", "|", "-d", "tsa_library", "-f", savepointFile],
    {encoding: "utf8", timeout: 20000, env: process.env});
  assert.ifError(recoveredStock.error);
  assert.equal(recoveredStock.status, 0, recoveredStock.stderr);
  assert.match(recoveredStock.stderr, /violates check constraint/);
  assert.match(recoveredStock.stdout, /ROLLBACK/);
  assert.match(recoveredStock.stdout, /COMMIT/);
  assert.equal(recoveredStock.stdout.trim().split(/\r?\n/).at(-1), "Apples|4");
  assert.equal(run(["-d", "tsa_library", "-c", "SELECT count(*) FROM library.books"]).out, "2",
    "Transaction examples must not change persistent library rows");

  // Explain each integrity rule with independent temporary course tables
  // before applying constraints to the permanent Steward teaching schema.
  const validCourse = runLibrary("constraints_lab_valid.sql — create two constrained course tables").out;
  assert.equal(validCourse.split(/\r?\n/).at(-1), "DB101|1|30");
  const runErrorFile = (name, caption) => {
    const sourceFile = path.join(root, name);
    fs.writeFileSync(sourceFile, codeFromLesson(caption) + "\n");
    const p = spawnSync("psql",
      ["-X", "-v", "ON_ERROR_STOP=0", "-At", "-F", "|", "-d", "tsa_library", "-f", sourceFile],
      {encoding: "utf8", timeout: 20000, env: process.env});
    assert.ifError(p.error);
    assert.equal(p.status, 0, p.stderr);
    return {out:p.stdout.trim(),err:p.stderr};
  };
  const constraintFailures = runErrorFile("constraints_lab_failures.sql",
    "constraints_lab_failures.sql — four independent constraint errors");
  assert.match(constraintFailures.err, /duplicate key value violates unique constraint/);
  assert.match(constraintFailures.err, /violates foreign key constraint/);
  assert.match(constraintFailures.err, /violates check constraint/);
  assert.match(constraintFailures.err, /null value in column "title"/);
  assert.equal(constraintFailures.out.split(/\r?\n/).at(-1), "1",
    "Four rejected writes must leave exactly one valid course");
  const restrictive = runErrorFile("fk_delete_restrict.sql",
    "fk_delete_restrict.sql — referenced parent cannot be deleted");
  assert.match(restrictive.err, /violates foreign key constraint/);
  assert.equal(restrictive.out.split(/\r?\n/).at(-1), "1",
    "Failed delete must preserve the referenced advisor");
  const cascading = runLibrary("fk_delete_cascade.sql — child removed with deleted parent").out;
  assert.match(cascading, /DELETE 1/);
  assert.equal(cascading.split(/\r?\n/).at(-1), "0",
    "Explicit cascade must remove the dependent child");
  assert.equal(run(["-d", "tsa_library", "-c", "SELECT count(*) FROM library.books"]).out, "2",
    "Integrity teaching examples must not alter the stored library books");

  const wrongDatabase = run(["-d", "tsa_invalid_database_name", "-c", "SELECT 1"], 2);
  assert.match(wrongDatabase.err, /database "tsa_invalid_database_name" does not exist/);

  // The relational model reading must run from its own book/author example,
  // not from the later Steward fixture. Test a real foreign-key failure in
  // the SAME PostgreSQL session where the TEMP parent and child tables exist.
  const relationalFile = path.join(root, "relational_author_books.sql");
  fs.writeFileSync(relationalFile,
    codeFromLesson("relational_author_books.sql — two related temporary tables") +
    "\nINSERT INTO book_example (title, author_id) VALUES ('Unknown Author', 999);\n" +
    "SELECT count(*) FROM book_example;\n");
  const relationalRun = spawnSync("psql",
    ["-X", "-v", "ON_ERROR_STOP=0", "-At", "-F", "|", "-d", "tsa_library", "-f", relationalFile],
    {encoding:"utf8",timeout:20000,env:process.env});
  assert.ifError(relationalRun.error);
  assert.equal(relationalRun.status, 0, relationalRun.stderr);
  assert.match(relationalRun.stdout, /1\|Things Fall Apart\|1/);
  assert.match(relationalRun.stdout, /3\|Home\|2/);
  assert.match(relationalRun.stderr, /violates foreign key constraint/);
  assert.equal(relationalRun.stdout.trim().split(/\r?\n/).at(-1), "3");

  // Before the Steward lab, execute the introductory JOIN and GROUP BY lessons
  // as actual single-session psql files. Separate sessions prevent fixture leakage.
  const runTeachingSession = (filename, captions, expected) => {
    const sqlFile = path.join(root, filename);
    fs.writeFileSync(sqlFile, captions.map(codeFromLesson).join("\n") + "\n");
    const lines = run(["-d", "tsa_library", "-f", sqlFile]).out.split(/\r?\n/);
    assert.deepEqual(lines, expected, "Mismatch in published " + filename + " examples");
  };
  runTeachingSession("first_joins.sql", [
    "join_first_setup.sql — temporary writers and books",
    "join_first_inner.sql — three matched books",
    "join_first_left.sql — retain the writer with no book",
    "join_first_cross.sql — count the unwanted combinations"
  ], [
    "CREATE TABLE", "CREATE TABLE", "INSERT 0 3", "INSERT 0 3",
    "1|Ana", "2|Rui", "3|Fatima",
    "10|Ocean|1", "11|Hill|1", "12|Sky|2",
    "Ocean|Ana", "Hill|Ana", "Sky|Rui",
    "Ana|Ocean", "Ana|Hill", "Rui|Sky", "Fatima|", "9"
  ]);
  runTeachingSession("first_groups.sql", [
    "group_first_setup.sql — three writers, three books",
    "group_first_books.sql — count books in each populated group",
    "group_first_left_count.sql — compare correct and wrong counts"
  ], [
    "CREATE TABLE", "CREATE TABLE", "INSERT 0 3", "INSERT 0 3",
    "1|2", "2|1", "Ana|2|2", "Rui|1|1", "Fatima|0|1"
  ]);

  const firstFile = path.join(root, "first_session.sql");
  fs.writeFileSync(firstFile, codeFromLesson("first_session.sql — run only in a disposable PostgreSQL lab database"));
  const firstOutput = run(["-d", "tsa_library", "-f", firstFile]).out;
  assert.match(firstOutput, /The Hobbit/);
  assert.match(firstOutput, /Beloved/);
  assert.match(firstOutput, /\n2$/m);
  const missingTemp = run(["-d", "tsa_library", "-c", "SELECT * FROM tsa_session_probe;"], 1);
  assert.match(missingTemp.err, /relation "tsa_session_probe" does not exist/);

  const file = path.join(root, "steward_schema_seed.sql");
  fs.writeFileSync(file, codeFromLesson("steward_schema_seed.sql — complete one-time PostgreSQL teaching fixture"));
  run(["-1", "-f", file]);
  const names = run(["-c", "SELECT count(*) FROM service"]).out;
  assert.equal(names, "5");
  const sizes = run(["-c", "SELECT (SELECT count(*) FROM team),(SELECT count(*) FROM environment),(SELECT count(*) FROM service_dependency)"]).out;
  assert.equal(sizes, "3|4|2");

  const cases = [
    ["filter_boolean.sql — retired-record leak and its corrected predicate",
      ["Identity API", "Legacy Gateway", "Payroll API", "Identity API", "Payroll API"]],
    ["filter_null.sql — wrong equality, correct IS NULL and UNKNOWN",
      ["Catalogue API", "Identity API", "Payments API", "Payroll API", "UNKNOWN|UNKNOWN"]],
    ["filter_order.sql — deterministic top results with a unique tie-breaker",
      ["Catalogue API|medium", "Identity API|critical", "Payments API|high"]],
    ["join_owner.sql — reconstruct the authoritative owner",
      ["Catalogue API|Platform", "Identity API|Identity", "Legacy Gateway|Platform", "Payments API|Payments", "Payroll API|Payments"]],
    ["join_optional.sql — keep Payroll and expose two Payments environments",
      ["Payments API|production", "Payments API|staging", "Payroll API|"]],
    ["join_on_where.sql — two different results from one predicate",
      ["Payments API|production", "Payroll API|", "Payments API|production"]],
    ["join_right.sql — RIGHT JOIN rewritten as the equivalent LEFT JOIN",
      ["Payroll API|", "Payroll API|"]],
    ["join_dependencies.sql — decode both ends of a directed edge",
      ["Payments API|Identity API", "Payroll API|Payments API"]],
    ["aggregate_team.sql — group at Team identity with a valid Service count",
      ["Identity|1", "Payments|2", "Platform|2"]],
    ["aggregate_zero.sql — count joined rows versus real Service identities",
      ["Unassigned|1|0"]],
    ["aggregate_having.sql — filter active matches then threshold groups",
      ["Payments|2"]],
    ["aggregate_inflation.sql — observe overcount and correctly count Service identities",
      ["Identity|1|1", "Payments|3|2", "Platform|2|2"]],
    ["aggregate_nulls.sql — define two populations in one report", ["5|1|2"]],
    ["subquery_in.sql — derive a set of owning Team identities", ["Payments API", "Payroll API"]],
    ["subquery_exists.sql — correlate an existence test to one Service", ["Catalogue API", "Identity API", "Payments API"]],
    ["subquery_scalar.sql — one count per Team", ["Identity|1", "Payments|2", "Platform|2"]],
    ["subquery_not_in.sql — the NULL trap and a safe anti-existence test", ["2", "3"]],
    ["cte_priority.sql — inspectable two-stage priority dependency count", ["Identity API|0", "Payments API|1", "Payroll API|1"]],
    ["cte_recursive.sql — bounded dependency walk with visited-node guard", ["Payroll API|0", "Payments API|1", "Identity API|2"]],
    ["cte_cycle.sql — read-only cyclic graph and explicit termination", ["A|0", "B|1"]]
  ];
  for (const [caption, expected] of cases) verify(caption, expected);
  const rowCounts = run(["-c", "SELECT (SELECT count(*) FROM service), (SELECT count(*) FROM service s LEFT JOIN environment e ON e.service_id=s.id), (SELECT count(*) FROM service s INNER JOIN environment e ON e.service_id=s.id)"]).out;
  assert.equal(rowCounts, "5|6|4");

  const noTeam = run(["-c", "INSERT INTO service(name, owning_team_id, endpoint) VALUES('Orphan',-1,'https://orphan.example.invalid');"], 1);
  assert.match(noTeam.err, /violates foreign key constraint/);
  const repeat = run(["-c", "INSERT INTO service(name, owning_team_id, endpoint) SELECT 'Payments API', id, 'https://duplicate.example.invalid' FROM team WHERE name='Payments';"], 1);
  assert.match(repeat.err, /duplicate key value violates unique constraint/);
  assert.equal(run(["-c", "SELECT count(*) FROM service"]).out, "5");

  // Run the exact published transaction scripts, then verify their effects from new connections.
  const transactionSql = (filename, caption) => {
    const filepath = path.join(root, filename);
    fs.writeFileSync(filepath, codeFromLesson(caption));
    return filepath;
  };
  const rolledBack = run(["-f", transactionSql("txn_rollback.sql", "txn_rollback.sql — demonstrate a deliberate rollback of a Service insert")]).out;
  assert.match(rolledBack, /inside\|1/);
  assert.match(rolledBack, /after\|0/);
  assert.equal(run(["-c", "SELECT count(*) FROM service WHERE name='Txn Rollback Demo'"]).out, "0");
  run(["-f", transactionSql("txn_commit.sql", "txn_commit.sql — commit Service plus initial Environment together")]);
  assert.equal(run(["-c", "SELECT s.name, e.kind FROM service s JOIN environment e ON e.service_id=s.id WHERE s.name='Txn Commit Demo'"]).out, "Txn Commit Demo|production");
  const recovered = run(["-f", transactionSql("txn_savepoint.sql", "txn_savepoint.sql — recover from one expected SQL error")]);
  assert.match(recovered.err, /violates check constraint/);
  assert.match(recovered.out, /Txn Savepoint Demo\|production/);
  assert.equal(run(["-c", "SELECT count(*) FROM environment e JOIN service s ON s.id=e.service_id WHERE s.name='Txn Savepoint Demo'"]).out, "1");
  assert.equal(run(["-c", "SELECT count(*) FROM service WHERE name='Txn Rollback Demo'"]).out, "0");

  // One client cannot prove isolation: use two live, independently connected psql processes.
  const isolationSql = codeFromLesson("isolation_setup.sql — one isolated probe row for the two-session exercise");
  assert.equal(run(["-c", isolationSql]).out.split(/\r?\n/).at(-1), "10");
  const makeSession = (name) => {
    const child = spawn("psql", ["-X", "-A", "-t", "-F", "|", "-q", "-v", "ON_ERROR_STOP=1"], {
      env: process.env, stdio: ["pipe", "pipe", "pipe"]
    });
    const session = { name, child, out: "", err: "", ended: false };
    child.stdout.on("data", buf => { session.out += buf.toString(); });
    child.stderr.on("data", buf => { session.err += buf.toString(); });
    child.on("exit", () => { session.ended = true; });
    return session;
  };
  const sessions = [makeSession("A"), makeSession("B")];
  const stage = async (session, label, statements, expected) => {
    const marker = `__TSA_${label}`;
    session.child.stdin.write(statements.trim() + "\n" + `SELECT '${marker}', value FROM tsa_isolation_probe WHERE id=1;\n`);
    const target = `${marker}|${expected}`;
    for (let i = 0; i < 200; i++) {
      if (session.out.split(/\r?\n/).includes(target)) return;
      if (session.ended) throw new Error(`Session ${session.name} closed: ${session.err}\n${session.out}`);
      if (session.err.includes("ERROR:")) throw new Error(`Session ${session.name}: ${session.err}`);
      await new Promise(resolve => setTimeout(resolve, 30));
    }
    throw new Error(`No observation ${target} in session ${session.name}: ${session.out}\n${session.err}`);
  };
  try {
    const A = sessions[0], B = sessions[1];
    await stage(A, "rc_first", "BEGIN ISOLATION LEVEL READ COMMITTED;", 10);
    await stage(B, "rc_uncommitted_b", "BEGIN; UPDATE tsa_isolation_probe SET value=20 WHERE id=1;", 20);
    await stage(A, "rc_pending", "SELECT 1;", 10);
    await stage(B, "rc_committed_b", "COMMIT;", 20);
    await stage(A, "rc_after", "SELECT 1;", 20);
    await stage(A, "rc_end", "COMMIT;", 20);
    await stage(B, "rr_reset", "UPDATE tsa_isolation_probe SET value=10 WHERE id=1;", 10);
    await stage(A, "rr_first", "BEGIN ISOLATION LEVEL REPEATABLE READ;", 10);
    await stage(B, "rr_changed", "BEGIN; UPDATE tsa_isolation_probe SET value=20 WHERE id=1; COMMIT;", 20);
    await stage(A, "rr_same_snapshot", "SELECT 1;", 10);
    await stage(A, "rr_after_end", "COMMIT;", 20);
    // Two *live* sessions, each with a precheck, must not both commit
    // the same unique Service.name. The second INSERT blocks while A is open.
    const duplicate = "Concurrent Guard Demo";
    const sqlInsert = endpoint =>
      "INSERT INTO service (name, owning_team_id, endpoint) " +
      "SELECT '" + duplicate + "', id, 'https://guard.example.invalid/" + endpoint +
      "' FROM team WHERE name='Payments';";
    await stage(A, "unique_start_a",
      "BEGIN; SELECT count(*) FROM service WHERE name='" + duplicate + "';", 20);
    await stage(B, "unique_start_b",
      "BEGIN; SELECT count(*) FROM service WHERE name='" + duplicate + "';", 20);
    assert.ok(A.out.split(/\r?\n/).includes("0"), "A must see no original demo Service");
    assert.ok(B.out.split(/\r?\n/).includes("0"), "B must see no original demo Service");
    await stage(A, "unique_insert_a", sqlInsert("a"), 20);
    B.child.stdin.write("\\set VERBOSITY verbose\n" + sqlInsert("b") + "\n");
    let sawBlockedWriter = false;
    for (let i = 0; i < 150; i++) {
      const waiting = run(["-c",
        "SELECT count(*) FROM pg_stat_activity " +
        "WHERE query LIKE '%Concurrent Guard Demo%' AND wait_event_type='Lock'"]).out;
      if (waiting === "1") { sawBlockedWriter = true; break; }
      await new Promise(resolve => setTimeout(resolve, 35));
    }
    assert.ok(sawBlockedWriter,
      "Second unique-name writer was not observed waiting on the uncommitted first writer");
    await stage(A, "unique_commit_a", "COMMIT;", 20);
    for (let i = 0; i < 150 && !B.ended; i++) {
      await new Promise(resolve => setTimeout(resolve, 35));
    }
    assert.ok(B.ended, "Second writer did not exit after A committed");
    assert.match(B.err, /23505/);
    assert.match(B.err, /duplicate key value violates unique constraint/);

  } finally {
    for (const session of sessions) {
      session.child.stdin.end("\\q\n");
      session.child.kill();
    }
  }
  assert.equal(run(["-c", "SELECT value FROM tsa_isolation_probe WHERE id=1"]).out, "20");
  assert.equal(run(["-c", "SELECT count(*) FROM service WHERE name='Concurrent Guard Demo'"]).out, "1");
  run(["-c", "DELETE FROM service WHERE name='Concurrent Guard Demo'"]);
  assert.equal(run(["-c", "SELECT count(*) FROM service WHERE name='Concurrent Guard Demo'"]).out, "0");
  run(["-c", "DROP TABLE tsa_isolation_probe;"]);
  run(["-c", "BEGIN; DELETE FROM environment WHERE service_id IN (SELECT id FROM service WHERE name IN ('Txn Commit Demo','Txn Savepoint Demo')); DELETE FROM service WHERE name IN ('Txn Commit Demo','Txn Savepoint Demo'); COMMIT;"]);
  assert.equal(run(["-c", "SELECT count(*) FROM service"]).out, "5");
  // Directly execute the cross-table product-invariant lesson, including its negative baseline and reversible repair.
  const missingBefore = run(["-c", codeFromLesson("readiness_missing.sql — detect production-stage Services without production deployment")]).out;
  assert.equal(missingBefore, "Payroll API");
  const readinessRepair = run(["-c", codeFromLesson("readiness_repair.sql — reversible cross-table invariant repair")]).out;
  assert.match(readinessRepair, /INSERT 0 1/);
  assert.ok(readinessRepair.split(/\r?\n/).includes("0"), "Readiness repair must report zero current violations");
  assert.equal(run(["-c", codeFromLesson("readiness_missing.sql — detect production-stage Services without production deployment")]).out, "Payroll API");
  assert.equal(run(["-c", "SELECT count(*) FROM environment WHERE service_id=(SELECT id FROM service WHERE name='Payroll API')"]).out, "0");
  // Complete the rest of the PostgreSQL path using the learner-visible examples.
  const constraints = run(["-c", codeFromLesson("constraints_inspect.sql — inspect actual deployed integrity rules")]).out;
  assert.match(constraints, /FOREIGN KEY/);
  assert.match(constraints, /UNIQUE/);
  const attempts = codeFromLesson("constraints_failures.sql — four isolated invalid inserts").split(";").map(x => x.trim()).filter(Boolean);
  assert.equal(attempts.length, 4);
  for (const sql of attempts) {
    const bad = run(["-c", sql+";"], 1);
    assert.match(bad.err, /violates (unique|foreign key|check) constraint|duplicate key value/);
  }
  assert.equal(run(["-c", "SELECT count(*) FROM service"]).out, "5");
  const slug = run(["-c", codeFromLesson("constraints_slug.sql — reversible uniqueness evolution")]).out;
  assert.match(slug, /payments-api/);
  assert.equal(run(["-c", "SELECT count(*) FROM information_schema.columns WHERE table_name='service' AND column_name='slug'"]).out, "0");
  // Learn schema-design and normal forms against unrelated university data.
  // Keep TEMP tables and the expected foreign-key failure in one psql session.
  const enrollmentFile = path.join(root, "enrollment_schema_demo.sql");
  fs.writeFileSync(enrollmentFile,
    codeFromLesson("enrollment_schema_demo.sql — three linked tables from university requirements") +
    "\nINSERT INTO tsa_enrollment (student_id,course_id,enrolled_on) VALUES (999,10,'2026-02-03');\n" +
    "SELECT count(*) FROM tsa_enrollment;\n");
  const enrollmentLab = spawnSync("psql",
    ["-X", "-v", "ON_ERROR_STOP=0", "-At", "-F", "|", "-d", "tsa_library", "-f", enrollmentFile],
    { encoding: "utf8", timeout: 20000, env: process.env });
  assert.ifError(enrollmentLab.error);
  assert.equal(enrollmentLab.status, 0, enrollmentLab.stderr);
  assert.match(enrollmentLab.stderr, /violates foreign key constraint/);
  const enrollmentLines = enrollmentLab.stdout.trim().split(/\r?\n/);
  assert.deepEqual(enrollmentLines.slice(-4), ["Ana|Linux", "Ana|SQL", "Beto|SQL", "3"]);

  const normalizedLab = run(["-d", "tsa_library", "-c",
    codeFromLesson("normal_forms_demo.sql — normalized university tables and one department rename")]).out;
  assert.deepEqual(normalizedLab.split(/\r?\n/).slice(-2),
    ["Ana|Linux|Computer Science", "Ana|SQL|Computer Science"]);
  const schema = run(["-c", codeFromLesson("schema_extension.sql — disposable memberships and historical reviews")]).out;
  assert.match(schema, /followup/);
  assert.match(schema, /pass/);
  const anomaly = run(["-c", codeFromLesson("normalization_anomaly.sql — two competing team names in one duplicated column")]).out;
  assert.match(anomaly, /Payments Division/);
  assert.match(anomaly, /Payroll API\|Payments/);
  const libraryPlanOnly = run(["-d", "tsa_library", "-c",
    codeFromLesson("library_explain_only.sql — estimate a book lookup without executing it")]).out;
  assert.match(libraryPlanOnly, /(Scan|scan)/);
  const libraryMeasuredPlan = run(["-d", "tsa_library", "-c",
    codeFromLesson("library_explain_analyze.sql — estimate, measure and verify a book query")]).out;
  assert.match(libraryMeasuredPlan, /Execution Time/);
  assert.equal(libraryMeasuredPlan.split(/\r?\n/).at(-1), "1",
    "The published library plan must still answer the learner's one-book question");
  const smallPlan = run(["-c", codeFromLesson("index_small.sql — inspect an already indexed unique Service name")]).out;
  assert.match(smallPlan, /(Scan|scan)/);
  const largePlan = run(["-c", codeFromLesson("index_lab.sql — compare actual physical plans on 15000 temporary rows")]).out;
  assert.match(largePlan, /Execution Time/);
  assert.match(largePlan, /CREATE INDEX/);
  const compositeIndex = run(["-d", "tsa_library", "-c",
    codeFromLesson("index_composite_lab.sql — compare leading and non-leading predicates on 4000 books")]).out;
  assert.match(compositeIndex, /CREATE INDEX/);
  assert.match(compositeIndex, /Execution Time/);
  assert.equal(compositeIndex.split(/\r?\n/).at(-1), "40|400|t",
    "Published multicolumn index exercise must prove exactly 40 combined and 400 second-column rows");
  const joinPlan = run(["-c", codeFromLesson("explain_join.sql — inspect query plan and correct grouped result")]).out;
  assert.match(joinPlan, /Execution Time/);
  const perfPlan = run(["-d", "tsa_library", "-c",
    codeFromLesson("performance_probe.sql — baseline and after-index plans with stable row counts")]).out;
  assert.match(perfPlan, /CREATE INDEX/, "Performance experiment must actually add its candidate index");
  assert.equal((perfPlan.match(/Execution Time/g) ?? []).length, 4,
    "Published performance experiment must compare both predicates before and after indexing");
  assert.deepEqual(perfPlan.split(/\r?\n/).filter(line => /^\d+$/.test(line)),
    ["1", "3750", "1", "3750"], "Baseline and post-index query results must be identical");
  const paginationResult = run(["-d", "tsa_library", "-c",
    codeFromLesson("paging_stability.sql — observe OFFSET overlap and keyset cursor")]).out;
  const paginationLines = paginationResult.split(/\r?\n/);
  assert.deepEqual(paginationLines.filter(line => /^\d+(?:,\d+)+$/.test(line)),
    ["1,2,3,4,5", "5,6,7,8,9", "6,7,8,9,10"],
    "Pagination must reproduce OFFSET overlap and stable keyset continuation");
  const metadata = run(["-c", codeFromLesson("postgresql_inspect.sql — verify connection and visible Service relation")]).out;
  for (const table of ["team","service","environment","service_dependency"]) assert.ok(metadata.split(/\r?\n/).includes(table), `Cannot see ${table}`);
  // Operational fundamentals from exact source-published SQL and shell exercises.
  const sessionProof = run(["-d", "tsa_library", "-c",
    codeFromLesson("postgresql_session.sql — inspect only your own backend")]).out;
  assert.deepEqual(sessionProof.split(/\r?\n/).map(x => x.split("|").at(-1)), ["t", "t"]);

  const rights = run(["-d", "tsa_library", "-c",
    codeFromLesson("postgresql_privileges.sql — inspect database, schema and table rights")]).out;
  assert.equal(rights, "tsa_learner|t|t|t");
  const readonlyRole = run(["-d", "tsa_library", "-c",
    codeFromLesson("postgresql_readonly_role.sql — optional local-only NOLOGIN role and privilege proof")]).out;
  assert.equal(readonlyRole.split(/\r?\n/).at(-1), "t|f",
    "Source-published role must have SELECT but not INSERT");

  // A grant-flag query alone is not an authorization test. Execute one
  // successful SELECT and one intentionally rejected INSERT as the restricted
  // NOLOGIN group role, then verify the table is unchanged.
  const readonlyScript = path.join(root, "readonly_denial.sql");
  fs.writeFileSync(readonlyScript,
    codeFromLesson("readonly_denial.sql — demonstrate allowed SELECT and rejected INSERT"));
  const deniedInsert = spawnSync("psql",
    ["-X", "-v", "ON_ERROR_STOP=0", "-At", "-F", "|", "-d", "tsa_library", "-f", readonlyScript],
    {encoding:"utf8",timeout:20000,env:process.env});
  assert.ifError(deniedInsert.error);
  assert.equal(deniedInsert.status, 0,
    `Unexpected client failure during intentionally rejected INSERT: ${deniedInsert.stderr}`);
  assert.match(deniedInsert.stderr, /permission denied for table books/);
  const denialOutputs = deniedInsert.stdout.trim().split(/\r?\n/);
  assert.ok(denialOutputs.includes("tsa_books_readonly|2"), "Restricted role must read two books");
  assert.equal(denialOutputs.at(-1), "2", "Denied INSERT must not modify the table");
  assert.equal(run(["-d", "tsa_library", "-c",
    "SELECT count(*) FROM library.books"]).out, "2", "No rejected row should be persisted");

  const backupScript = codeFromLesson("library_backup_restore.sh — restore a custom-format archive into a separate learning database");
  const backupRun = spawnSync("bash", ["-e", "-c", backupScript], {
    cwd: root, encoding: "utf8", timeout: 90000, env: process.env
  });
  assert.ifError(backupRun.error);
  assert.equal(backupRun.status, 0,
    `Published PostgreSQL logical backup and restore failed:\n${backupRun.stdout}\n${backupRun.stderr}`);
  assert.ok(fs.statSync(path.join(root, "tsa_library_backup.dump")).size > 0,
    "pg_dump archive must exist and contain bytes");
  assert.equal(backupRun.stdout.trim().split(/\r?\n/).at(-1), "2",
    "Published restore must independently recover the two original books");
  assert.equal(run(["-d", "tsa_library_restore", "-c",
    "SELECT string_agg(title, ',' ORDER BY title) FROM library.books"]).out,
    "The Hobbit,Things Fall Apart", "Restored data must match the expected titles");
  // A restore must preserve integrity rules as well as matching book titles.
  // This deliberately invalid statement must fail in the recovered copy.
  const restoredConstraint = run(["-d", "tsa_library_restore", "-c",
    "INSERT INTO library.books (title, author, published_year) VALUES (NULL, 'Invalid', 2001);"], 1);
  assert.match(restoredConstraint.err, /null value in column "title".*violates not-null constraint/,
    "Restored table must still enforce the original NOT NULL rule");
  assert.equal(run(["-d", "tsa_library_restore", "-c",
    "SELECT count(*) FROM library.books"]).out, "2",
    "Rejected insert must leave the restored copy unchanged");
  assert.equal(run(["-d", "tsa_library", "-c", "SELECT count(*) FROM library.books"]).out,
    "2", "Source library must remain unchanged by backup/restore");

  const migration = run(["-c",
    codeFromLesson("migration_expand_contract.sql — populated-data backfill with reversible DDL")]).out;
  const stageCounts = migration.split(/\r?\n/).filter(v => /^\d+$/.test(v));
  assert.deepEqual(stageCounts, ["5", "0", "5", "0"], "Backfill must retain five rows and leave no new column after rollback");
  assert.equal(run(["-c", "SELECT count(*) FROM information_schema.columns WHERE table_name='service' AND column_name='technical_owner'"]).out, "0");
  console.log(`Builder PostgreSQL live lab passed: CREATE DATABASE, CREATE SCHEMA, library tables, relational FK, introductory JOIN and GROUP BY, and temporary-session checks, 4 persisted tables, 20 published SQL examples, 5/6/4 join cardinalities, 2 rejected writes, 3 transaction scripts with savepoint failure, 2-session Read Committed/Repeatable Read, cross-table release-readiness detection and rollback proof, populated migration backfill and two-session unique-name race; database=${process.env.PGDATABASE}.`);

} finally {
  fs.rmSync(root, { recursive: true, force: true });
}
