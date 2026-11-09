// PED-005: original Supply Chain readings 4,7-10, no fabricated activities.
// Local proofs are bounded training fixtures, NOT a Nexus server or OCI registry.
export type OperationalExample={language:string;caption:string;code:string;expected:string};
export type OperationalSection={heading:string;paragraphs:string[];code?:{language:string;caption:string;code:string}};
export const supplyChainOperationalExamples: Record<string, OperationalExample> = {
  "npm-distribution": {
    "language": "javascript",
    "caption": "Execute actual offline npm pack --dry-run and verify the allowed file list",
    "code": "import assert from 'node:assert/strict';\nimport {mkdtempSync, mkdirSync, writeFileSync, rmSync} from 'node:fs';\nimport {tmpdir} from 'node:os';\nimport {join} from 'node:path';\nimport {execFileSync} from 'node:child_process';\n// Actual npm pack --dry-run; no external registry, publication or real secret.\nconst work=mkdtempSync(join(tmpdir(),'tsa-npm-pack-'));\ntry {\n  mkdirSync(join(work,'dist'));\n  writeFileSync(join(work,'dist','index.js'),'export const answer = 42;\\n');\n  writeFileSync(join(work,'internal-secrets.txt'),'NOT_A_REAL_CREDENTIAL\\n');\n  writeFileSync(join(work,'README.md'),'A disposable npm packaging lesson.\\n');\n  writeFileSync(join(work,'package.json'),JSON.stringify({name:'@tsa/registry-fixture',version:'0.1.0',type:'module',main:'dist/index.js',files:['dist']},null,2));\n  const raw=execFileSync('npm',['pack','--dry-run','--json','--ignore-scripts'],{cwd:work,encoding:'utf8',timeout:30000,env:{...process.env,npm_config_offline:'true',npm_config_audit:'false',npm_config_fund:'false',npm_config_update_notifier:'false'}});\n  const info=JSON.parse(raw)[0];\n  const paths=new Set(info.files.map(f=>f.path));\n  assert(paths.has('dist/index.js'));\n  assert(paths.has('package.json'));\n  assert(!paths.has('internal-secrets.txt'));\n  console.log('NPM_DRY_RUN_SELECTED_DIST_NOT_SECRET');\n  console.log('NPM_PACKAGE_IDENTITY_'+info.name+'@'+info.version);\n} finally {rmSync(work,{recursive:true,force:true});}\n",
    "expected": "node lesson.mjs: NPM_DRY_RUN_SELECTED_DIST_NOT_SECRET; NPM_PACKAGE_IDENTITY_@tsa/registry-fixture@0.1.0. Does not publish."
  },
  "container-registries": {
    "language": "bash",
    "caption": "Local Docker retag experiment (image ID only, not Nexus registry digest)",
    "code": "#!/usr/bin/env bash\n# Actual local Docker image IDs, NOT registry OCI manifest digests.\nset -euo pipefail\nROOT=\"$(mktemp -d)\"\nLAB=\"tsa-oci-lab-$RANDOM-$$\"\ncleanup() {\n  docker image rm \"$LAB:a\" \"$LAB:b\" \"$LAB:approved\" >/dev/null 2>&1 || true\n  rm -rf \"$ROOT\"\n}\ntrap cleanup EXIT\nmkdir -p \"$ROOT/a\" \"$ROOT/b\"\ncat > \"$ROOT/a/Dockerfile\" <<'DOCKERFILE'\nFROM busybox:1.36\nLABEL tsa.source=\"fictional-a\"\nDOCKERFILE\ncat > \"$ROOT/b/Dockerfile\" <<'DOCKERFILE'\nFROM busybox:1.36\nLABEL tsa.source=\"fictional-b\"\nDOCKERFILE\ndocker build -q -t \"$LAB:a\" \"$ROOT/a\" >/dev/null\ndocker build -q -t \"$LAB:b\" \"$ROOT/b\" >/dev/null\nfirst=\"$(docker image inspect \"$LAB:a\" --format '{{.Id}}')\"\nsecond=\"$(docker image inspect \"$LAB:b\" --format '{{.Id}}')\"\ntest \"$first\" != \"$second\"\ndocker tag \"$LAB:a\" \"$LAB:approved\"\nexpected=\"$(docker image inspect \"$LAB:approved\" --format '{{.Id}}')\"\ntest \"$expected\" = \"$first\"\ndocker tag \"$LAB:b\" \"$LAB:approved\"\nobserved=\"$(docker image inspect \"$LAB:approved\" --format '{{.Id}}')\"\ntest \"$observed\" = \"$second\"\necho 'LOCAL_MUTABLE_TAG_RETARGETED_TO_DIFFERENT_IMAGE_ID'\nif [[ \"$observed\" == \"$expected\" ]]; then\n  echo \"LOCAL_UNSAFE_APPROVAL\" >&2\n  exit 23\nfi\necho 'LOCAL_APPROVED_IMAGE_ID_MISMATCH_BLOCKS'\n# .RepoDigests on a local-only tag is not a proof of a registry manifest.\ndocker image inspect \"$LAB:approved\" --format '{{json .RepoDigests}}' >/dev/null\necho 'REGISTRY_MANIFEST_DIGEST_STILL_NOT_PROVED'\n",
    "expected": "With Docker Engine and busybox:1.36: LOCAL_MUTABLE_TAG_RETARGETED_TO_DIFFERENT_IMAGE_ID, LOCAL_APPROVED_IMAGE_ID_MISMATCH_BLOCKS, REGISTRY_MANIFEST_DIGEST_STILL_NOT_PROVED."
  },
  "repository-manager-architecture": {
    "language": "python",
    "caption": "Execute a disposable consistency and role-authorization model, not Nexus itself",
    "code": "\"\"\"Executable database/blob consistency *model*, NOT a Nexus backup command.\"\"\"\nfrom hashlib import sha256\nfrom pathlib import Path\nfrom tempfile import TemporaryDirectory\nimport json\nimport shutil\n\ndef verify(db_file, blobs_dir):\n    records = json.loads(db_file.read_text())\n    for item in records:\n        payload = blobs_dir / item['digest']\n        if not payload.is_file():\n            return False\n        if sha256(payload.read_bytes()).hexdigest() != item['digest']:\n            return False\n    return True\n\nwith TemporaryDirectory(prefix='tsa-nexus-model-') as folder:\n    home = Path(folder)\n    live = home / 'live'\n    (live / 'blobs').mkdir(parents=True)\n    payload = b'disposable-package-v1\\n'\n    digest = sha256(payload).hexdigest()\n    (live / 'blobs' / digest).write_bytes(payload)\n    (live / 'metadata.json').write_text(json.dumps([{'name': '@tsa/fixture', 'digest': digest}]))\n    snapshot = home / 'snapshot'\n    shutil.copytree(live, snapshot)\n    assert verify(snapshot / 'metadata.json', snapshot / 'blobs')\n    print('NEXUS_MODEL_PAIRED_SNAPSHOT_VALID')\n    incomplete = home / 'missing-blob'\n    incomplete.mkdir()\n    shutil.copy2(snapshot / 'metadata.json', incomplete / 'metadata.json')\n    (incomplete / 'blobs').mkdir()\n    assert not verify(incomplete / 'metadata.json', incomplete / 'blobs')\n    print('NEXUS_MODEL_METADATA_WITHOUT_BLOB_BLOCKED')\n    (snapshot / 'blobs' / digest).write_bytes(b'corrupted')\n    assert not verify(snapshot / 'metadata.json', snapshot / 'blobs')\n    print('NEXUS_MODEL_BLOB_CORRUPTION_BLOCKED')\n    access = {\n        'consumer': {'read'},\n        'publisher': {'read', 'add'},\n        'admin': {'read', 'add', 'edit', 'delete', 'configure'},\n    }\n    assert 'read' in access['consumer']\n    assert 'add' in access['publisher']\n    assert 'add' not in access['consumer']\n    assert 'delete' not in access['publisher']\n    print('NEXUS_MODEL_CONSUMER_ADD_AND_PUBLISHER_DELETE_DENIED')\n",
    "expected": "python3 lesson.py: NEXUS_MODEL_PAIRED_SNAPSHOT_VALID, NEXUS_MODEL_METADATA_WITHOUT_BLOB_BLOCKED, NEXUS_MODEL_BLOB_CORRUPTION_BLOCKED, NEXUS_MODEL_CONSUMER_ADD_AND_PUBLISHER_DELETE_DENIED."
  }
};
export const supplyChainOperationalSections: Record<string, OperationalSection[]> = {
  "repository-manager-architecture": [
    {
      "heading": "Trace the full repository-manager state, not just its URL",
      "paragraphs": [
        "A repository manager is a service that coordinates format-specific client endpoints, repository definitions, authorization, metadata, and artifact bytes. Follow a concrete upload: CI authenticates to an authorized hosted endpoint; the manager checks the caller's permitted action; it writes content to a blob store and corresponding metadata to the database; a clean consumer later requests the package by format-specific name/version and retrieves bytes referenced by that metadata. The machine serving the UI, its database and its blobs are different failure surfaces even if initially deployed in one container.",
        "A Git commit in Steward identifies source, not the location or bytes of a published wheel or OCI manifest. A persistent volume alone is also not a complete recovery guarantee: volume permissions, database records, blob objects, repository configuration and restored node identity all matter. You may choose a modest single-node homelab now; do not present that choice as equivalent to high availability."
      ]
    },
    {
      "heading": "Model a paired database-and-blob restore with a failing counterexample",
      "paragraphs": [
        "In this minimal disposable Python model, metadata maps an artifact name to its SHA-256-named blob. A complete snapshot verifies successfully; copying metadata without the referenced blob is rejected; corrupting blob bytes is also rejected. This reflects the reason Nexus documentation requires approximately synchronized database and blob-store backups. It is deliberately not a dump of PostgreSQL/H2, a Nexus storage layout, an online-consistency guarantee, or evidence that a real Nexus installation can be restored.",
        "Execute the program before moving to deployment. Record its four expected markers and explain precisely which invariants a real recovery test would additionally need: create/publish an actual test component, back up the correct live database and matching blob store under a controlled consistency procedure, restore on a fresh isolated instance, authenticate, and retrieve identical bytes from an independent client. Backups with no restore drill are NOT_TESTED."
      ],
      "code": {
        "language": "python",
        "caption": "Execute a disposable consistency and role-authorization model, not Nexus itself",
        "code": "\"\"\"Executable database/blob consistency *model*, NOT a Nexus backup command.\"\"\"\nfrom hashlib import sha256\nfrom pathlib import Path\nfrom tempfile import TemporaryDirectory\nimport json\nimport shutil\n\ndef verify(db_file, blobs_dir):\n    records = json.loads(db_file.read_text())\n    for item in records:\n        payload = blobs_dir / item['digest']\n        if not payload.is_file():\n            return False\n        if sha256(payload.read_bytes()).hexdigest() != item['digest']:\n            return False\n    return True\n\nwith TemporaryDirectory(prefix='tsa-nexus-model-') as folder:\n    home = Path(folder)\n    live = home / 'live'\n    (live / 'blobs').mkdir(parents=True)\n    payload = b'disposable-package-v1\\n'\n    digest = sha256(payload).hexdigest()\n    (live / 'blobs' / digest).write_bytes(payload)\n    (live / 'metadata.json').write_text(json.dumps([{'name': '@tsa/fixture', 'digest': digest}]))\n    snapshot = home / 'snapshot'\n    shutil.copytree(live, snapshot)\n    assert verify(snapshot / 'metadata.json', snapshot / 'blobs')\n    print('NEXUS_MODEL_PAIRED_SNAPSHOT_VALID')\n    incomplete = home / 'missing-blob'\n    incomplete.mkdir()\n    shutil.copy2(snapshot / 'metadata.json', incomplete / 'metadata.json')\n    (incomplete / 'blobs').mkdir()\n    assert not verify(incomplete / 'metadata.json', incomplete / 'blobs')\n    print('NEXUS_MODEL_METADATA_WITHOUT_BLOB_BLOCKED')\n    (snapshot / 'blobs' / digest).write_bytes(b'corrupted')\n    assert not verify(snapshot / 'metadata.json', snapshot / 'blobs')\n    print('NEXUS_MODEL_BLOB_CORRUPTION_BLOCKED')\n    access = {\n        'consumer': {'read'},\n        'publisher': {'read', 'add'},\n        'admin': {'read', 'add', 'edit', 'delete', 'configure'},\n    }\n    assert 'read' in access['consumer']\n    assert 'add' in access['publisher']\n    assert 'add' not in access['consumer']\n    assert 'delete' not in access['publisher']\n    print('NEXUS_MODEL_CONSUMER_ADD_AND_PUBLISHER_DELETE_DENIED')\n"
      }
    },
    {
      "heading": "Select the failure domain and authority boundaries deliberately",
      "paragraphs": [
        "For a first homelab topology, mark the VM/container host, persistent data path, metadata database, blob store, reverse proxy/DNS, trusted certificate path, admin entry point, CI publisher endpoint and consumer endpoints. Show which elements may be recreated from configuration and which need retained state or separately verified authoritative re-publication. A new empty Nexus instance is not equivalent to restoring the previous approved artifacts.",
        "Failure scenario: the service restarts successfully and the web login works, but its blob store is missing. Health-checking only the UI would be a false pass. The practical must read a known digest through the independent package/OCI client after restart and after a controlled restore. Stop promotion if any required artifact is absent; a repository manager cannot invent the original bytes."
      ]
    }
  ],
  "npm-distribution": [
    {
      "heading": "Understand a package's source files versus its published tarball",
      "paragraphs": [
        "A Node package starts with package.json metadata such as name, version, main/exports, dependencies and optional files inclusion rules. npm/pnpm consumers install a tarball containing the files that survived packaging, not necessarily the complete Git repository. A package named @tsa/registry-fixture is an explicitly fictional lab fixture; an internal scope is a naming convention, not proof that a registry or namespace is trustworthy. Publishing a new Steward shared client is conditional on genuine independent consumers.",
        "Before publication, inspect both the entry point and the actual package contents. npm's files field is an allowlist for pack inclusion (subject to special files included automatically), while .npmignore and defaults can affect the result. Accidentally packaging sample credentials, developer notes or source maps may be a leak; omitting required dist files breaks imports despite a successful release."
      ]
    },
    {
      "heading": "Run an actual npm pack dry-run, then break the safety rule",
      "paragraphs": [
        "The runnable Node script creates a disposable package with a real dist/index.js, a deliberately fake secret-like notes file, a README and a files allowlist. It invokes the installed npm pack --dry-run --json --ignore-scripts in offline mode and inspects npm's actual file inventory, rather than guessing from the repository tree. It verifies the intended module and package.json are present and the fake secret file is excluded. It does not publish, access a registry, or claim any real credential was at risk.",
        "Expected stdout: NPM_DRY_RUN_SELECTED_DIST_NOT_SECRET and NPM_PACKAGE_IDENTITY_@tsa/registry-fixture@0.1.0. Change files:['dist'] to files:['*'] in a disposable copy: the published assertion must fail because internal-secrets.txt would enter the package. On a genuine package, apply the same review before pnpm/npm publish and verify the tarball in a clean consumer. A green dry-run is not a successful publication or import proof."
      ],
      "code": {
        "language": "javascript",
        "caption": "Execute actual offline npm pack --dry-run and verify the allowed file list",
        "code": "import assert from 'node:assert/strict';\nimport {mkdtempSync, mkdirSync, writeFileSync, rmSync} from 'node:fs';\nimport {tmpdir} from 'node:os';\nimport {join} from 'node:path';\nimport {execFileSync} from 'node:child_process';\n// Actual npm pack --dry-run; no external registry, publication or real secret.\nconst work=mkdtempSync(join(tmpdir(),'tsa-npm-pack-'));\ntry {\n  mkdirSync(join(work,'dist'));\n  writeFileSync(join(work,'dist','index.js'),'export const answer = 42;\\n');\n  writeFileSync(join(work,'internal-secrets.txt'),'NOT_A_REAL_CREDENTIAL\\n');\n  writeFileSync(join(work,'README.md'),'A disposable npm packaging lesson.\\n');\n  writeFileSync(join(work,'package.json'),JSON.stringify({name:'@tsa/registry-fixture',version:'0.1.0',type:'module',main:'dist/index.js',files:['dist']},null,2));\n  const raw=execFileSync('npm',['pack','--dry-run','--json','--ignore-scripts'],{cwd:work,encoding:'utf8',timeout:30000,env:{...process.env,npm_config_offline:'true',npm_config_audit:'false',npm_config_fund:'false',npm_config_update_notifier:'false'}});\n  const info=JSON.parse(raw)[0];\n  const paths=new Set(info.files.map(f=>f.path));\n  assert(paths.has('dist/index.js'));\n  assert(paths.has('package.json'));\n  assert(!paths.has('internal-secrets.txt'));\n  console.log('NPM_DRY_RUN_SELECTED_DIST_NOT_SECRET');\n  console.log('NPM_PACKAGE_IDENTITY_'+info.name+'@'+info.version);\n} finally {rmSync(work,{recursive:true,force:true});}\n"
      }
    },
    {
      "heading": "Distinguish pack, publish, install, and integrity evidence",
      "paragraphs": [
        "Pack selects bytes and produces a tarball. Publish uploads those bytes to a registry according to authenticated permissions. Install resolves selected versions and retrieves distribution bytes using a lockfile and registry configuration; a clean consumer should prove package origin and integrity, not rely on a monorepo workspace link. Test a denied publish and a missing approved registry separately. A successful local npm pack proves only the first boundary.",
        "Before writing a private .npmrc, verify how your particular npm/pnpm version and Nexus format handle scoped registry configuration, authorization and lockfile integrity. Avoid committing credentials. An arbitrary public scoped name does not create ownership or authorization on a private Nexus server, and npm pack --dry-run cannot verify Nexus role permissions."
      ]
    }
  ],
  "container-registries": [
    {
      "heading": "Follow OCI references through tag, manifest and layers",
      "paragraphs": [
        "An OCI registry stores manifests and layer blobs. A repository:tag reference is a mutable lookup name; a repository@sha256:digest reference identifies a specific registry manifest (or multi-platform index). A Docker local image ID normally identifies the local image configuration object, not necessarily the same bytes and hash as the registry manifest. An image may also use a multi-platform index that chooses different platform-specific manifests during pull. Do not copy the local .Id and call it a Nexus RepoDigest.",
        "Trace the release chain: CI builds image → registry accepts push → CI records the returned manifest digest → clean deployment host pulls repository@sha256:... from the intended registry → running container identity and behavior are verified. A moving tag does not violate Docker syntax, but is too weak for an approved immutable release identity. Digest pinning prevents unobserved tag retarget, not compromised publisher, unsafe code or missing runtime readiness."
      ]
    },
    {
      "heading": "Observe local retagging without inventing a registry digest",
      "paragraphs": [
        "The bash exercise builds two disposable BusyBox-based Docker images with different LABEL values, assigns the same local approved tag first to A then B, and compares observed local image IDs. Reassigned tag now resolves to a different image while the human-facing label stays the same. Both identities are local; the program intentionally ends by saying a registry manifest digest is STILL NOT PROVED. Requires local Docker daemon and access to the small BusyBox base image; it cleans its own images/workspace.",
        "Expected markers: LOCAL_MUTABLE_TAG_RETARGETED_TO_DIFFERENT_IMAGE_ID, LOCAL_APPROVED_IMAGE_ID_MISMATCH_BLOCKS, REGISTRY_MANIFEST_DIGEST_STILL_NOT_PROVED. If the exact image-ID mismatch guard is inverted, the test should fail. After this local proof, require a separately verified actual Nexus push/pull, emitted immutable registry digest, clean host pull and running-service check before claiming real OCI promotion."
      ],
      "code": {
        "language": "bash",
        "caption": "Local Docker retag experiment (image ID only, not Nexus registry digest)",
        "code": "#!/usr/bin/env bash\n# Actual local Docker image IDs, NOT registry OCI manifest digests.\nset -euo pipefail\nROOT=\"$(mktemp -d)\"\nLAB=\"tsa-oci-lab-$RANDOM-$$\"\ncleanup() {\n  docker image rm \"$LAB:a\" \"$LAB:b\" \"$LAB:approved\" >/dev/null 2>&1 || true\n  rm -rf \"$ROOT\"\n}\ntrap cleanup EXIT\nmkdir -p \"$ROOT/a\" \"$ROOT/b\"\ncat > \"$ROOT/a/Dockerfile\" <<'DOCKERFILE'\nFROM busybox:1.36\nLABEL tsa.source=\"fictional-a\"\nDOCKERFILE\ncat > \"$ROOT/b/Dockerfile\" <<'DOCKERFILE'\nFROM busybox:1.36\nLABEL tsa.source=\"fictional-b\"\nDOCKERFILE\ndocker build -q -t \"$LAB:a\" \"$ROOT/a\" >/dev/null\ndocker build -q -t \"$LAB:b\" \"$ROOT/b\" >/dev/null\nfirst=\"$(docker image inspect \"$LAB:a\" --format '{{.Id}}')\"\nsecond=\"$(docker image inspect \"$LAB:b\" --format '{{.Id}}')\"\ntest \"$first\" != \"$second\"\ndocker tag \"$LAB:a\" \"$LAB:approved\"\nexpected=\"$(docker image inspect \"$LAB:approved\" --format '{{.Id}}')\"\ntest \"$expected\" = \"$first\"\ndocker tag \"$LAB:b\" \"$LAB:approved\"\nobserved=\"$(docker image inspect \"$LAB:approved\" --format '{{.Id}}')\"\ntest \"$observed\" = \"$second\"\necho 'LOCAL_MUTABLE_TAG_RETARGETED_TO_DIFFERENT_IMAGE_ID'\nif [[ \"$observed\" == \"$expected\" ]]; then\n  echo \"LOCAL_UNSAFE_APPROVAL\" >&2\n  exit 23\nfi\necho 'LOCAL_APPROVED_IMAGE_ID_MISMATCH_BLOCKS'\n# .RepoDigests on a local-only tag is not a proof of a registry manifest.\ndocker image inspect \"$LAB:approved\" --format '{{json .RepoDigests}}' >/dev/null\necho 'REGISTRY_MANIFEST_DIGEST_STILL_NOT_PROVED'\n"
      }
    },
    {
      "heading": "Prove a real registry pull only when one exists",
      "paragraphs": [
        "Before testing a Nexus Docker hosted endpoint, identify the format-specific host/port and TLS path, publishing service identity, read-only consumer credentials, registry name and approved digest. Configure the exact approved endpoint and perform an authorized push in a disposable namespace. Independently pull by the returned repo@sha256 digest from a new host; inspect running container identity and response, not only Docker's successful exit code.",
        "Failure cases worth exercising in an authorized homelab: retag after approval, wrong endpoint, consumer without read permission, or an image lacking the required architecture. A local docker image inspect that returns [] for RepoDigests after an unpushed build is expected; it is evidence of the absence of a known repository digest, not evidence that the image is safe."
      ]
    }
  ],
  "deploy-nexus-homelab": [
    {
      "heading": "Choose deployment topology by actual resource and recovery constraints",
      "paragraphs": [
        "First establish whether there is an authorized VM, sufficient memory/CPU/storage, permitted persistent path and recoverable backup location. Select a small single-node Nexus deployment for the lab when those constraints support it, record the exact product/image version and database mode, and expose administrative access only through the trusted homelab network. A broad docker run with 0.0.0.0:8081 or unknown image tag is not a secure default. Configure a stable hostname/TLS path before asking clients to store registry URLs.",
        "Nexus is stateful. Its application process may be replaced, but blob storage, database metadata, configuration and relevant node identity need an explicit retention and restore plan. Modern Nexus database configuration and H2 versus PostgreSQL procedures differ; follow the documentation matching the actual version and storage backend. A Docker volume attached to a running service does not by itself constitute a backup."
      ]
    },
    {
      "heading": "Rehearse restart, loss and recovery with separate evidence",
      "paragraphs": [
        "After configuring a persistent data directory, upload one invented disposable component through an authorized publisher, retrieve it with a consumer-only account and record the repository URL, content hash and timestamp. Restart the Nexus process/container without deleting its state, then repeat the independent download. That proves persistence across process recreation only. Next perform a separately authorized same-site restoration of a matched database-plus-blob snapshot to an isolated environment and compare the same artifact hash.",
        "Failure example: metadata recovered but underlying blob missing. The earlier Python model rejects this, but actual Nexus might show UI success or different errors until a real download is attempted. Capture both successful and intentionally failed real-client evidence. Never delete an existing production repository or work account just to prove restoration. Treat actual restart and restore as UNVERIFIED until performed."
      ]
    },
    {
      "heading": "Operational preflight before CI depends on Nexus",
      "paragraphs": [
        "Record DNS resolution, TLS trust, admin availability, read-only retrieval, publisher permission and a negative denied upload, persistence across restart, recoverable backups, available disk space and lifecycle ownership. Only after those checks should a CI job depend on Nexus as its authoritative package/image source. The test should explicitly stop before publication if endpoint, identity or storage is unknown.",
        "Use a runbook with exact observation slots rather than vague 'Nexus works': version, VM name, endpoint, storage/data path, database type, blob store, snapshot pair ID, published test-artifact digest, independent retrieve result, denied action and recovery owner. A work-in-progress homelab without these records is not release-ready."
      ]
    }
  ],
  "auth-permissions": [
    {
      "heading": "Authentication establishes identity; authorization selects an action",
      "paragraphs": [
        "Nexus authentication answers which principal made the request. Authorization evaluates format/repository-scoped privileges such as browse, read, add, edit and delete; repository-admin privileges govern repository configuration separately. A publisher that can upload a specific hosted PyPI repository need not delete existing releases or administer repositories. A consumer may require read without add/edit/delete. The actual required privileges vary by protocol and upload method, so test permitted and denied requests for your exact version.",
        "Privileges from multiple roles are additive; assigning a more restrictive second role does not negate an administrative privilege granted elsewhere. That means a shared admin token cannot be made safe by attaching a 'consumer' role. Separate principals, narrow repositories and short-lived credentials are the appropriate boundaries."
      ]
    },
    {
      "heading": "Rehearse the matrix and preserve actual denied calls",
      "paragraphs": [
        "The state-model program in Repository Manager Architecture uses a small fictional role-to-action matrix, then checks consumer read allowed, publisher add allowed, consumer add denied and publisher delete denied. This demonstrates a deny-by-absence expectation in a simple program, NOT an actual Nexus authorization engine. Use it to prepare a real test plan: actor → exact endpoint → HTTP operation → expected authorization result → actual returned status and unchanged artifact bytes.",
        "For live Nexus, create least-privilege service accounts under authorized administration, use a disposable hosted test repository, try a controlled upload by publisher (authorized) and by consumer (denied), and confirm consumers cannot edit/delete. Do not log tokens or embed credentials in source; a 401 authentication failure and a 403 insufficient-privilege response are different diagnoses depending on endpoint behavior."
      ]
    },
    {
      "heading": "Test credential lifecycle and delivery authority separately",
      "paragraphs": [
        "The consumer's build should fail if approved Nexus access is removed; it must not silently fall back to public or producer-local artifacts. A revoked publisher must not be able to upload again. Keep permission changes and incident rollback in a controlled administrative runbook, and record which identities can authorize releases versus merely publish build outputs.",
        "Least-privilege evidence cannot be inferred from a successful UI login, a passing local policy simulator, or a successful install. An actual denial test is required at the real endpoint. Deep secret rotation and trust governance can be expanded in Security Steward, but the basic failure behavior must already be correct here."
      ]
    }
  ]
};
export const supplyChainOperationalPractices: Record<string, string[]> = {
  "repository-manager-architecture": [
    "Run the lesson's disposable metadata/blob consistency program; capture all four markers, then remove the blob existence guard from a copy and explain why the negative test must fail.",
    "Draw live Nexus boundaries for database, blob storage, service process, read/write clients, protected admin path and eventual recovery, marking all still-unknown setup facts."
  ],
  "npm-distribution": [
    "Run the provided real npm pack --dry-run demo with Node and npm installed; show the two expected lines.",
    "Change files:['dist'] to files:['*'] in an isolated copy and demonstrate that the secret-file exclusion assertion fails; specify how a real package would be inspected prior to publication."
  ],
  "container-registries": [
    "Run the source Docker local-tag proof if Docker Engine and BusyBox base image are available; capture the three expected markers and explain why none proves a registry manifest digest.",
    "Prepare a separate actual Nexus OCI push/pull acceptance matrix with a recorded registry manifest digest, clean host, denied consumer upload and missing-architecture failure. Mark it NOT_TESTED until performed."
  ],
  "deploy-nexus-homelab": [
    "Record product version, database mode, blob store path, storage capacity, restricted admin endpoint and actual documented backup procedure before deploying.",
    "After an authorized disposable artifact publish, prove same-hash retrieval after restart; design an isolated pair-consistent restore drill and mark NOT_TESTED until executed."
  ],
  "auth-permissions": [
    "Prepare a role/action matrix for real hosted and group endpoints, specifying actor, operation, expected success/denial and artifact-digest invariants.",
    "Use the local model only as the prerequisite; subsequently capture permitted publisher upload and denied consumer upload from real Nexus accounts without recording secrets."
  ]
};
