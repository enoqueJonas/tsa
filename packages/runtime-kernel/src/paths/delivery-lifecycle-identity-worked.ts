// PED-005 Delivery Engineer: source-published, independently executable local example.
// No network, Docker daemon, registry, real release or persistent files are touched.
export const lifecycleIdentityPython = "from hashlib import sha256\nfrom pathlib import Path\nfrom tempfile import TemporaryDirectory\nimport sys\n\n# Disposable stand-in for build bytes. This is NOT an OCI image digest.\nwith TemporaryDirectory(prefix=\"tsa-delivery-\") as directory:\n    artifact = Path(directory) / \"steward-release.txt\"\n    artifact.write_bytes(b\"Steward candidate v1\\n\")\n    approved = sha256(artifact.read_bytes()).hexdigest()\n\n    # Model a different byte sequence arriving at deployment.\n    if \"--tamper\" in sys.argv[1:]:\n        artifact.write_bytes(b\"Steward candidate v1\\nmodified after approval\\n\")\n\n    deployed = sha256(artifact.read_bytes()).hexdigest()\n    matches = approved == deployed\n    print(\"approved == deployed:\", matches)\n    print(\"decision:\", \"ALLOW\" if matches else \"BLOCK\")\n    # CI and deployment automation must propagate a blocked gate as nonzero.\n    sys.exit(0 if matches else 23)";

export const lifecycleIdentityExtraSections: Array<{
  heading: string;
  body: string;
  items?: string[];
  code?: string;
  language?: string;
  caption?: string;
  output?: string;
}> = [
  {
    heading: "Follow one change through evidence, not labels",
    body: "A source revision is a Git commit that identifies a snapshot of tracked source; a CI run is a specific attempt to validate and build that revision; a build artifact is the resulting distributable byte sequence; a release is an approved artifact plus version and operational metadata; a deployment installs or activates it in an environment; runtime verification probes the behavior actually reachable by a consumer. The arrows matter: a successful test on commit C cannot establish that production is running C, and a deployment command returning zero cannot establish that users can call its API. For one Steward ownership-authorization fix, the evidence chain is commit C → mandatory tests on C → produced image digest D → approved release record referring to D → deployment reports digest D → a real authorized request succeeds and an unauthorized request fails.",
    items: [
      "Before build: identify commit C, toolchain, resolved dependencies and input configuration; a commit alone does not freeze external build inputs.",
      "After build: record the immutable artifact identity D and the CI run that produced it; retain the artifact rather than rebuilding it for each environment.",
      "Before promotion: check approval and migration/runtime compatibility of that exact artifact.",
      "After deployment: inspect the running digest and execute consumer-level positive and negative behavior checks; record the result and the rollback target."
    ]
  },
  {
    heading: "Executable model: identical bytes versus a changed candidate",
    body: "Start with SHA-256: a cryptographic hash maps file bytes to a fixed-length fingerprint. If a file's bytes change, its hash will almost certainly change. This local standard-library Python exercise models a release gate: the expected hash is captured at approval time and the observed hash is recalculated at the deployment boundary. Save the code as artifact_gate.py and run 'python3 artifact_gate.py' followed by 'python3 artifact_gate.py --tamper'. The second command must exit with code 23 and print BLOCK. Everything happens inside a temporary directory, which is removed automatically. A local file SHA-256 is an analogy to artifact verification, not the same identifier as an OCI registry image manifest digest.",
    code: lifecycleIdentityPython,
    language: "python",
    caption: "A safe positive release gate and negative changed-bytes gate",
    output: "$ python3 artifact_gate.py\napproved == deployed: True\ndecision: ALLOW\n$ python3 artifact_gate.py --tamper\napproved == deployed: False\ndecision: BLOCK\n# The second process exits with status 23."
  },
  {
    heading: "What an artifact digest does not prove",
    body: "Matching hashes prove that the bytes observed match the bytes approved. They do not prove the code is secure, that it came from an authorized builder, that the manifest points to expected platform layers, or that the running service is healthy. A signed provenance/attestation can bind additional origin and build facts; a runtime health and authorization probe tests a different claim. Image tags such as 'latest' are mutable human-friendly references, while deployment should resolve an approved OCI digest. Two builds from the same commit can legitimately have different digests when dependency resolution, timestamps or toolchains vary. Never infer byte identity from the version label alone."
  },
  {
    heading: "Failure diagnosis and independent transfer",
    body: "Imagine CI validates Steward commit C, but a deployment script rebuilds after approval and selects digest E instead of approved D. The safe response is to stop or hold promotion, record C/D/E and the build inputs, restore the already verified artifact D where appropriate, and rerun the client-visible ownership and health checks. Do not simply force the tag to point at E and call it recovered. For independent practice, change the example so --tamper produces a second file rather than overwriting the first; demonstrate a blocked gate with the same exit code. Then explain separately what additional evidence would be needed to prove the active Docker container is running digest D and that Team B cannot update Team A's service."
  }
];
