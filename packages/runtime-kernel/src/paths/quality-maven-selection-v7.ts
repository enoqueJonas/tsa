// PED-005: direct source-to-lesson bindings for *real*, disposable Maven/Jupiter tests.
// These examples verify execution mechanics, NOT a Steward/IdP/database integration.
export const qualityTaggedSelectionJava = "package org.tsa.quality;\n\nimport org.junit.jupiter.api.Tag;\nimport org.junit.jupiter.api.Test;\nimport static org.junit.jupiter.api.Assertions.assertEquals;\n\n// These tags label an isolated classroom fixture; no real API is called.\npublic class TagFilteringExampleTest {\n    @Tag(\"smoke\")\n    @Tag(\"fixture\")\n    @Test void fastDeterministicCheck() {\n        assertEquals(\"service\", \" service \".trim());\n    }\n\n    @Tag(\"regression\")\n    @Test void secondIndependentCheck() {\n        assertEquals(6, 2 * 3);\n    }\n}\n";
export const qualityLifecycleOwnershipJava = "package org.tsa.quality;\n\nimport org.junit.jupiter.api.AfterAll;\nimport org.junit.jupiter.api.AfterEach;\nimport org.junit.jupiter.api.BeforeEach;\nimport org.junit.jupiter.api.Test;\nimport java.util.concurrent.atomic.AtomicInteger;\nimport static org.junit.jupiter.api.Assertions.*;\n\n// PER_METHOD (the default) must construct a distinct test instance per test.\npublic class LifecycleOwnershipTest {\n    static final AtomicInteger constructed = new AtomicInteger();\n    static final AtomicInteger opened = new AtomicInteger();\n    static final AtomicInteger closed = new AtomicInteger();\n\n    private final int instanceNumber;\n    private boolean ownedResourceOpen = false;\n\n    public LifecycleOwnershipTest() {\n        instanceNumber = constructed.incrementAndGet();\n    }\n\n    @BeforeEach void openOwnedResource() {\n        assertFalse(ownedResourceOpen, \"new test instance must not inherit resources\");\n        ownedResourceOpen = true;\n        opened.incrementAndGet();\n    }\n\n    @AfterEach void closeOwnedResource() {\n        assertTrue(ownedResourceOpen, \"resource must exist even after test assertion failure\");\n        ownedResourceOpen = false;\n        closed.incrementAndGet();\n    }\n\n    @Test void firstIndependentExecution() {\n        assertTrue(ownedResourceOpen);\n        assertTrue(instanceNumber >= 1);\n    }\n\n    @Test void secondIndependentExecution() {\n        assertTrue(ownedResourceOpen);\n        assertTrue(instanceNumber >= 1);\n    }\n\n    @AfterAll static void verifyEveryInvocationOwnedAndClosedItsResource() {\n        assertEquals(2, constructed.get(), \"default PER_METHOD must construct two instances\");\n        assertEquals(2, opened.get(), \"two independent setups must run\");\n        assertEquals(2, closed.get(), \"cleanup must run for both test invocations\");\n    }\n}\n";
export const qualityMavenSelectionPom = "<project xmlns=\"http://maven.apache.org/POM/4.0.0\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:schemaLocation=\"http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd\">\n  <modelVersion>4.0.0</modelVersion>\n  <groupId>org.tsa.quality</groupId>\n  <artifactId>junit-execution-teaching-fixture</artifactId>\n  <version>1.0.0</version>\n  <properties><maven.compiler.release>17</maven.compiler.release><project.build.sourceEncoding>UTF-8</project.build.sourceEncoding></properties>\n  <dependencies>\n    <dependency><groupId>org.junit.jupiter</groupId><artifactId>junit-jupiter</artifactId><version>5.11.4</version><scope>test</scope></dependency>\n  </dependencies>\n  <build><plugins>\n    <plugin><groupId>org.apache.maven.plugins</groupId><artifactId>maven-compiler-plugin</artifactId><version>3.13.0</version><configuration><release>17</release></configuration></plugin>\n    <plugin><groupId>org.apache.maven.plugins</groupId><artifactId>maven-surefire-plugin</artifactId><version>3.5.2</version></plugin>\n    <plugin><groupId>org.apache.maven.plugins</groupId><artifactId>maven-dependency-plugin</artifactId><version>3.7.1</version></plugin>\n    <plugin><groupId>org.apache.maven.plugins</groupId><artifactId>maven-failsafe-plugin</artifactId><version>3.5.2</version><executions><execution><goals><goal>integration-test</goal><goal>verify</goal></goals></execution></executions></plugin>\n  </plugins></build>\n</project>\n";
export const qualityMavenSelectionCases = {
  "maven-lifecycle": [
    [
      "A phase executes bound goals; a goal can run directly",
      "Maven has multiple lifecycles. The default lifecycle includes validate, compile, test, package, integration-test and verify in a defined order, while clean is a different lifecycle. A phase is a coordinate in that ordered plan; goals belong to versioned plugins and can be bound to phases by packaging defaults or explicit plugin executions. 'mvn test' does not mean 'run a Java class named test': Surefire is a plugin running in the test phase. In this fixture, 'mvn verify' reaches the Failsafe integration-test and verify bindings after Surefire. The tool should report actual executed test counts, not only BUILD SUCCESS."
    ],
    [
      "Execute phase boundaries with real JUnit reports",
      "At the TSA repository root run: mvn -B -ntp -f labs/quality-junit-lifecycle/pom.xml clean test. Inspect target/surefire-reports: this runs PolicyTest (4 invocations), TagFilteringExampleTest (2), and LifecycleOwnershipTest (2); ProtocolIT should NOT appear there. Next run 'mvn -B -ntp -f labs/quality-junit-lifecycle/pom.xml verify' and inspect target/failsafe-reports: ProtocolIT should now have one in-process Jupiter result. Notice verify includes earlier phases and should not be confused with deploying or installing an artifact."
    ],
    [
      "Negative: a successful command is not an executed test",
      "A source file renamed without updating Surefire's selection pattern can compile but never execute; the build can misleadingly succeed with zero relevant tests. The CI checker inspects the exact named XML reports, counts and omissions. Skipping tests, silently ignoring failures or trusting a stale report changes the release claim, not merely build speed."
    ],
    [
      "Unseen transfer",
      "A team runs 'mvn package' during pre-merge, 'mvn verify' nightly and later 'mvn install' on a developer machine. For each, identify which phases precede it, whether any Failsafe IT runs, which artifacts are produced, and which command does NOT imply a remote Nexus deployment."
    ]
  ],
  "maven-dependencies": [
    [
      "Imports do not install libraries: Maven builds a versioned dependency graph",
      "Java imports resolve names already on the compile classpath; the POM supplies dependency coordinates. A direct test-scoped junit-jupiter dependency can transitively bring Jupiter API/engine and Platform components, while a compile-scoped dependency is part of a different classpath. dependencyManagement constrains versions but does not add a dependency. The local ~/.m2 cache stores artifacts; it is not an authoritative record of a controlled release. Internal Nexus coordinates remain UNVERIFIED until actual repository configuration and authorization are provided."
    ],
    [
      "Run the exact fixture POM through the Maven dependency tree",
      "Use the POM below. Execute 'mvn -B -ntp -f labs/quality-junit-lifecycle/pom.xml dependency:tree -DoutputFile=target/quality-deps.txt -DoutputType=text'. Inspect both the direct org.junit.jupiter:junit-jupiter and a transitive org.junit.jupiter:junit-jupiter-api/junit-jupiter-engine with test scope. The CI source checker runs this command and fails if these paths disappear. The Maven dependency plugin is version-pinned so the report does not drift silently between machines."
    ],
    [
      "Negative: cached success can hide a missing controlled coordinate",
      "Adding 'import org.junit.jupiter.api.Test;' to a source file does not install JUnit. Wrong test scope may remove dependencies from the runtime where needed, while unnecessary compile scope can leak testing libraries into production artifacts. A SNAPSHOT can resolve to different bytes over time; pin release versions and capture artifact checksums for controlled evidence. Do not 'fix' a dependency error by deleting ~/.m2 without investigating coordinates, repositories and effective POM."
    ],
    [
      "Independent transfer",
      "A REST Assured test compiles on a laptop but CI fails at runtime with NoSuchMethodError inside Jackson. Construct a dependency-tree diagnosis: which direct/transitive versions are resolved, how mediation chooses versions, what management could control, and which reproducibility evidence must be attached before changing an exclusion."
    ]
  ],
  "junit-tags": [
    [
      "JUnit tags select executable evidence, not product meaning",
      "@Tag metadata is interpreted by the Jupiter engine when the JUnit Platform receives a discovery request. Maven Surefire can supply a tag expression through -Dgroups. Tags are not separate suites, and a label 'api' on an in-process fixture does not make it an API integration. The exact classroom Java file below contains two independent methods: one tagged smoke+fixture, the other regression. Never infer test coverage from tag names alone."
    ],
    [
      "Run a real positive and deliberately missing selection",
      "At repository root execute 'mvn -B -ntp -f labs/quality-junit-lifecycle/pom.xml clean test -Dgroups=smoke'. Inspect TEST-org.tsa.quality.TagFilteringExampleTest.xml: exactly ONE smoke method executes, not both methods and not the untagged PolicyTest. Run again with -Dgroups=regression: exactly the other method executes. Run -Dgroups='smoke & regression': there are no methods with both tags. Maven may still finish successfully with no relevant tests; a required quality gate must fail on the missing report/zero test count. The accompanying CI script checks actual reports rather than only exit status."
    ],
    [
      "Negative: tag selection silently expands when labels drift",
      "Change @Tag(\"regression\") on the second method to @Tag(\"smoke\") and rerun smoke selection: it now picks TWO methods rather than one; the source-aware negative control must catch it. Conversely changing @Tag(\"smoke\") to @Tag(\"slow\") drops the intended smoke evidence. Tags are selection metadata, not a substitute for an independent assertion."
    ],
    [
      "Independent transfer",
      "Design a minimal tag vocabulary for unit, component, contract and browser evidence and decide which labels mean test purpose versus runtime cost. A production gate requests 'smoke & !quarantined' and reports BUILD SUCCESS with zero tests: provide a fail-closed mechanism, the expected named cases and a reason why quarantining all checks cannot authorize a release."
    ]
  ],
  "junit-lifecycle": [
    [
      "PER_METHOD ownership creates a fresh test object per invocation",
      "JUnit Jupiter normally creates a new test-class instance per test method; @BeforeEach and @AfterEach run around each invocation. A field declared on the test instance should therefore not hold data from an unrelated test method. @BeforeAll/@AfterAll run once for the container, while PER_CLASS changes the instance-sharing contract. Resources can still leak through static state, shared backend fixtures or ignored cleanup. A lifecycle callback is executed by the Jupiter engine, not when a Java annotation is parsed."
    ],
    [
      "Execute a real before/after resource lifecycle",
      "The complete runnable class below creates two test instances and checks the resource is opened before each test, closed after each, and that @AfterAll observes exactly 2 constructed/2 opened/2 closed lifecycles. Compile/run it through 'mvn -B -ntp -f labs/quality-junit-lifecycle/pom.xml clean test'. The CI checker reads TEST-org.tsa.quality.LifecycleOwnershipTest.xml to require two executed tests, zero skipped and zero errors. The boolean models a disposable resource; it is NOT an actual browser, database or external service."
    ],
    [
      "Negative: shared test instances change ownership semantics",
      "Add @TestInstance(TestInstance.Lifecycle.PER_CLASS) to the class without adjusting the resource design. The two tests now reuse one instance, and @AfterAll's expectation of two instances must fail. This is a classroom negative to expose lifetime changes, not a recommendation to assert static counters in a parallel production suite. In real suites, choose per-test owned context/DB schema and resilient afterEach cleanup, and keep global state out of test instances."
    ],
    [
      "Independent transfer",
      "A team wants to share one Playwright Page and one authenticated user across twenty concurrent JUnit methods to speed tests. Propose who owns Browser, BrowserContext, Page, backend account and cleanup, and explain how a deliberate assertion failure and multiple parallel workers affect those lifetimes."
    ]
  ]
} as const;
