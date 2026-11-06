// Original-source-first continuation: Delivery Engineer module 7, not a synthetic lesson wrapper.
// PEP 503-like localhost fixture and real pip resolution; no live PyPI/Nexus interaction.
export type SupplyChainResolutionSection = { heading: string; paragraphs: string[]; code?: {language: string; caption?: string; code: string} };
export const supplyChainIndexResolutionPython = "\"\"\"Disposable localhost fixture: pip index order is not trust priority.\nNo public registry, Nexus server, or Steward package is contacted.\n\"\"\"\nfrom functools import partial\nfrom hashlib import sha256\nfrom http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer\nfrom pathlib import Path\nfrom tempfile import TemporaryDirectory\nfrom threading import Thread\nimport base64\nimport csv\nimport io\nimport subprocess\nimport sys\nimport zipfile\n\nPACKAGE = 'tsa-registry-fixture'\nMODULE = 'tsa_registry_fixture'\n\n\ndef wheel(directory, version, marker):\n    name = f'{MODULE}-{version}-py3-none-any.whl'\n    path = directory / name\n    metadata = f'{MODULE}-{version}.dist-info'\n    contents = {\n        f'{MODULE}/__init__.py': f'ORIGIN = {marker!r}\\n'.encode(),\n        f'{metadata}/METADATA': (f'Metadata-Version: 2.1\\nName: {PACKAGE}\\nVersion: {version}\\n').encode(),\n        f'{metadata}/WHEEL': b'Wheel-Version: 1.0\\nGenerator: tsa-lab\\nRoot-Is-Purelib: true\\nTag: py3-none-any\\n',\n    }\n    record = io.StringIO()\n    writer = csv.writer(record, lineterminator='\\n')\n    with zipfile.ZipFile(path, 'w') as archive:\n        for filename, data in contents.items():\n            archive.writestr(filename, data)\n            digest = base64.urlsafe_b64encode(sha256(data).digest()).rstrip(b'=').decode()\n            writer.writerow([filename, 'sha256=' + digest, len(data)])\n        writer.writerow([f'{metadata}/RECORD', '', ''])\n        archive.writestr(f'{metadata}/RECORD', record.getvalue())\n    return path\n\n\ndef run_pip(port, target, include_external):\n    command = [sys.executable, '-m', 'pip', '--isolated', 'download',\n               '--no-deps', '--no-cache-dir', '--disable-pip-version-check',\n               '--index-url', f'http://127.0.0.1:{port}/private/simple/',\n               '--dest', str(target), PACKAGE]\n    if include_external:\n        command += ['--extra-index-url', f'http://127.0.0.1:{port}/external/simple/']\n    result = subprocess.run(command, capture_output=True, text=True, timeout=45)\n    assert result.returncode == 0, result.stdout + '\\n' + result.stderr\n    chosen = list(target.glob('*.whl'))\n    assert len(chosen) == 1, chosen\n    return chosen[0]\n\n\ndef decision(candidate, approved_filename, approved_hash):\n    if candidate.name != approved_filename or sha256(candidate.read_bytes()).hexdigest() != approved_hash:\n        return 'BLOCK'\n    return 'ALLOW'\n\n\nclass QuietHandler(SimpleHTTPRequestHandler):\n    def log_message(self, *_args):\n        pass\n\n\nwith TemporaryDirectory(prefix='tsa-pip-index-') as tmp:\n    root = Path(tmp)\n    wheels = {}\n    for repo, version, marker in [('private', '1.0.0', 'approved-lab'),\n                                  ('external', '9.9.9', 'untrusted-lab')]:\n        directory = root / repo / 'files'\n        directory.mkdir(parents=True)\n        path = wheel(directory, version, marker)\n        index = root / repo / 'simple' / PACKAGE\n        index.mkdir(parents=True)\n        (index / 'index.html').write_text(f'<a href=\"../../files/{path.name}\">{path.name}</a>')\n        wheels[repo] = path\n    server = ThreadingHTTPServer(('127.0.0.1', 0), partial(QuietHandler, directory=str(root)))\n    thread = Thread(target=server.serve_forever, daemon=True)\n    thread.start()\n    try:\n        mixed_dir = root / 'download-mixed'\n        private_dir = root / 'download-private'\n        mixed_dir.mkdir()\n        private_dir.mkdir()\n        mixed = run_pip(server.server_port, mixed_dir, include_external=True)\n        private = run_pip(server.server_port, private_dir, include_external=False)\n        approved = wheels['private']\n        approved_hash = sha256(approved.read_bytes()).hexdigest()\n        assert mixed.name == wheels['external'].name, 'pip did not select higher-version external candidate'\n        assert private.name == approved.name, 'private-only index did not select approved candidate'\n        assert decision(private, approved.name, approved_hash) == 'ALLOW'\n        assert decision(mixed, approved.name, approved_hash) == 'BLOCK'\n        print('MIXED_INDEX_SELECTED_EXTERNAL_9_9_9')\n        print('PRIVATE_ONLY_SELECTED_APPROVED_1_0_0')\n        print('APPROVED_HASH_ALLOW_EXTERNAL_HASH_BLOCK')\n    finally:\n        server.shutdown()\n        server.server_close()\n        thread.join(timeout=5)\n";
export const supplyChainResolutionTeaching: Record<string, SupplyChainResolutionSection[]> = {
  "why-internal-repositories": [
    {
      "heading": "Follow an artifact across independent machines",
      "paragraphs": [
        "A repository exists because the producer and consumer do not share the same mutable filesystem or lifetime. A Git commit names source history; a wheel, npm tarball or OCI manifest names a built distribution with its own identity. A CI runner can disappear after publication, while a fresh deployment host must still retrieve the approved bytes. In the simplest trace, CI builds an image, computes a digest, publishes to a format-aware registry, and a separate host requests that digest. Copying a build directory to that host bypasses the distribution and identity boundary.",
        "Before deciding to deploy a repository manager, identify the actual cross-machine consumer. If the only reusable Python code is still inside one repository, there is no earned internal Python distribution yet. The current Steward OCI image is enough to justify a registry exercise; the hypothetical tsa-registry-fixture in the later Python experiment does not become a real Steward dependency."
      ]
    },
    {
      "heading": "Independent consumer failure test",
      "paragraphs": [
        "Test the claim by using a new directory or runner with no producer checkout, no writable shared path and an empty cache. Record the consumer's endpoint, exact artifact identifier and retrieved checksum. An install that succeeds only because the producer's local wheel or Docker tag remains on the same machine has not established a repository distribution contract.",
        "An artifact store can still fail or distribute wrong bytes: client authorization, immutability, provenance and storage restore are separate questions. For a safe failure experiment, disconnect only a disposable fixture index and require the clean consumer to stop instead of reaching for a developer-local file."
      ]
    }
  ],
  "registries-vs-repositories": [
    {
      "heading": "A registry is a protocol contract, not a directory nickname",
      "paragraphs": [
        "For Python, pip expects the Python Simple Repository API: a normalized project path returns index metadata linking compatible distribution files. npm uses package metadata and tarball URLs with registry-specific authentication and integrity fields. Docker and OCI clients fetch manifests and content-addressed layers through an OCI Distribution API. The fact that all three move bytes over HTTP does not make their paths, metadata or authorization interchangeable.",
        "Trace a request instead of memorizing the product names: package manager → normalized package identifier and version requirement → format-specific repository endpoint → candidate metadata → selected artifact → checksum or digest check → installation or pull. An arbitrary static file server might host bytes, but it does not automatically implement the metadata and publish operations these clients need."
      ]
    },
    {
      "heading": "Separate manager, format, endpoint, and artifact identity",
      "paragraphs": [
        "Nexus is a repository manager, not a new universal package format. One Nexus installation can host a PyPI repository, an npm repository and a Docker registry; each still speaks the protocol its own client understands. A hosted endpoint receives your authorized releases, a proxy endpoint mediates external dependencies, and a group endpoint can aggregate compatible repositories for clients.",
        "Given the same string '1.0.0', a PyPI wheel filename, an npm package version and a Docker tag are not the same kind of identity. A build can also contain more than one platform manifest. Record the native digest or package hash and the retrieval endpoint separately. If a CI log only says 'downloaded version 1.0.0', what additional evidence is needed to prove the consumer installed your approved artifact?"
      ]
    }
  ],
  "public-private-dependencies": [
    {
      "heading": "Why the first index is not necessarily trusted first",
      "paragraphs": [
        "pip can consider candidates across both --index-url and --extra-index-url; declaring a private index first does not give all its packages security precedence. For the same normalized project name, a compatible higher version found at the other index may be selected. This is a concrete dependency-confusion mechanism: a trusted-looking import name can resolve to bytes published by an unauthorized party. Neither an internal group URL nor a cached hit, by itself, proves acceptable origin.",
        "The following self-contained lab creates two *local* PyPI-style index pages and disposable wheels with identical project names: approved version 1.0.0 in the private fixture, untrusted version 9.9.9 in the external fixture. It calls the real installed pip command twice. Neither fixture contacts public PyPI, a live Nexus server or Steward. Run it with python3 in a temporary learning environment where pip is available; it creates and removes its own localhost server and workspace."
      ]
    },
    {
      "heading": "Run real pip candidate selection against two disposable index endpoints",
      "paragraphs": [
        "With both endpoints configured, pip selects 9.9.9 despite --index-url pointing at the private index; when only the private endpoint is configured, it selects 1.0.0. The final decision compares the selected filename *and actual SHA-256 bytes* with the preapproved local artifact. The expected output is MIXED_INDEX_SELECTED_EXTERNAL_9_9_9, PRIVATE_ONLY_SELECTED_APPROVED_1_0_0 and APPROVED_HASH_ALLOW_EXTERNAL_HASH_BLOCK on separate lines. If an assertion fails, investigate version, effective pip configuration, proxy access and HTTP fixture response rather than deleting the safety check.",
        "The wheel-construction and localhost HTTP code is a deliberately isolated teaching fixture, not the recommended method for publishing Python distributions; production projects build with modern packaging tools and publish through authorized repositories. This example proves one pip resolver behavior and a simple candidate gate, not identity attestation, Nexus routing priority, lockfile enforcement or malicious-package detection."
      ],
      "code": {
        "language": "python",
        "caption": "Real pip resolution on two isolated localhost package indexes",
        "code": supplyChainIndexResolutionPython
      }
    },
    {
      "heading": "Decide an actual safe consumption policy",
      "paragraphs": [
        "Safer distribution begins with a controlled resolution source for private package names, explicit pinning and hashes for approved artifacts, no unreviewed fallback indexes, and a verified source-to-publisher trail. Multiple indexes can be necessary in real organizations, but then resolution routing and publisher authority require testing per ecosystem. A hash protects the bytes selected against an approved record; it does not by itself establish who built those bytes or whether their code is safe.",
        "Counterfactual: the approved 1.0.0 wheel disappears during a production build while 9.9.9 remains on a reachable alternative index. The correct response is to fail the build or recover the approved artifact through an authorized path, not silently install the newer candidate. Explain how you would capture effective pip configuration, the selected distribution, the downloaded hash and an explicit denied-outside-index test in a fresh CI job."
      ]
    }
  ],
  "hosted-proxy-group": [
    {
      "heading": "Follow write authority separately from read resolution",
      "paragraphs": [
        "A hosted repository is a publication authority for selected organization-owned packages. A proxy repository retrieves and caches an explicitly identified upstream. A group is a client-facing aggregation of compatible member repositories; a group is normally for resolution, not for uploading. Draw two distinct arrows: authorized CI publisher → hosted write endpoint, and clean consumer → approved group/read endpoint → particular member/upstream.",
        "The group endpoint is not a cryptographic statement that all returned artifacts are internally approved. Member ordering, repository format, name normalization and upstream content interact with individual client rules. Record the repository member and final artifact checksum, not merely that a request to the group URL returned HTTP 200."
      ]
    },
    {
      "heading": "Test both stale-cache and namespace-collision failures",
      "paragraphs": [
        "For a disposable fixture package, publish an approved version to hosted, configure a second source with the same normalized name and an incompatible later version, and capture which bytes a fresh consumer actually chooses. Repeat with an empty cache; cached results may hide unsafe resolution. Use a different disposable package to test loss of upstream availability. Neither success nor failure establishes anything about production Nexus unless run against the real configured instance.",
        "When private resolution is ambiguous, the safe default is not 'the first repository wins.' Pin a known identity, constrain where private names can resolve, and fail closed if the approved member is unavailable. A real Nexus setup must additionally prove read-only consumer credentials, denied writes to hosted, and correct backup/recovery before the lab can be considered operational."
      ]
    }
  ],
  "python-pypi-distribution": [
    {
      "heading": "Walk from Python project to wheel and installation",
      "paragraphs": [
        "Start with an importable Python package directory and pyproject.toml containing a build-system requirement, project name and version. A build backend produces a wheel archive with executable module contents, metadata and a RECORD manifest; an sdist is a source archive that can require the consumer to run a build backend. The wheel filename also encodes compatibility tags; not every wheel is installable on every interpreter and operating system.",
        "A minimal project can use setuptools, but python -m build is an external packaging tool and must first be installed in the chosen virtual environment. Show the learner the prerequisite explicitly: python3 -m venv .venv, activate it, python -m pip install build, then python -m build in a project with pyproject.toml. This may access the configured package index; do not imply the command runs on a machine without network access, build dependencies or packaging metadata."
      ]
    },
    {
      "heading": "Prove clean consumption and what the checksum means",
      "paragraphs": [
        "Build success is only a producer check. Inspect wheel METADATA and WHEEL tags, publish the approved distribution to a PyPI-compatible repository, then create a new isolated consumer without the producer working tree and disable local caches. Record the index URL, resolved normalized project name, exact version, wheel hash and the import the consumer can execute.",
        "An index lookup that chooses the correct name but different bytes is a distribution failure. A pinned version without a hash is not necessarily sufficient if a repository is mutable or compromised. The preceding real pip localhost exercise demonstrates why an extra index is not a private-first fallback; it does not replace a later authorized Nexus publication and clean consumer install."
      ]
    }
  ]
};
export const supplyChainResolutionPractices: Record<string, string[]> = {
  "why-internal-repositories": [
    "Run a separate clean-consumer thought experiment: remove producer checkout and cache, then specify the exact digest/hash and retrieval endpoint required for a passing independent install."
  ],
  "registries-vs-repositories": [
    "For each of PyPI, npm and OCI, trace the client request, metadata object, artifact payload, native immutable identity and expected failure if pointed at a generic file directory."
  ],
  "public-private-dependencies": [
    "Copy and execute the lesson's local pip experiment with python3; capture all three expected output lines and confirm both downloaded candidate filenames differ.",
    "Make a deliberately incorrect copy of the disposable script that disables --extra-index-url; explain which assertion fails and why this is a real negative control, not a new production finding.",
    "Write an approved-index-only strategy for a real internal package and name the checks the local fixture cannot prove."
  ],
  "hosted-proxy-group": [
    "Draw separate authorized publication and clean-consumer paths through hosted, proxy and group repositories, including the effective upstream authority.",
    "Describe and, on a disposable Nexus lab only, test a same-name collision with an empty cache and a denied consumer upload."
  ],
  "python-pypi-distribution": [
    "In a new disposable project, identify pyproject.toml, the built wheel's .dist-info/METADATA and compatibility tags; distinguish this from a source distribution.",
    "Explain how an isolated consumer proves origin and hash and why a version-only green install is insufficient."
  ]
};
