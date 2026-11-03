import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const root = "packages/runtime-kernel/src/paths/";
function exactProgram(path, name) {
  const source = readFileSync(root + path, "utf8");
  const prefix = "export const " + name + " = ";
  const line = source.split("\n").find(s => s.startsWith(prefix));
  assert.ok(line?.endsWith(";"), "Missing exact original-source program: " + name);
  return JSON.parse(line.slice(prefix.length, -1));
}
const identity = readFileSync(root + "security-identity-secrets-deep.ts", "utf8");
const vault = readFileSync(root + "security-vault-implementation-deep.ts", "utf8");
const school = readFileSync(root + "security-steward.ts", "utf8");
assert.ok(identity.includes("...(oidcSourceBlocksById[spec.id] ?? [])"), "Signed token proof must render in original OIDC lessons");
assert.ok(vault.includes("...vaultLifecycleBlocks"), "Vault lifecycle must render in original secrets lesson");
assert.ok(!school.includes("-security-orientation") && !school.includes("Prepare securely:"), "Generic Security wrappers remain");
assert.equal((school.match(/= path\(/g) ?? []).length, 14, "Security should retain 14 actual learning paths");
const jwt = exactProgram("security-oidc-source-proof.ts", "oidcProofJavaScript");
assert.ok(jwt.includes("RS256") && jwt.includes("generateKeyPairSync"), "Teaching must use real signature verification");
const signed = spawnSync("node", ["-e", jwt], {encoding:"utf8",timeout:15000});
assert.ifError(signed.error);
assert.equal(signed.status, 0, "OIDC program failed: " + signed.stderr);
assert.match(signed.stdout,/valid_token_and_object=true issuer_audience_expiry_nbf_alg_signature_scope_owner_denied=true/);
const lease = exactProgram("security-vault-lifecycle-proof.ts", "vaultLifecyclePython");
const result = spawnSync("python3", ["-c", lease], {encoding:"utf8",timeout:10000});
assert.ifError(result.error);
assert.equal(result.status, 0, "Vault classroom lease program failed: " + result.stderr);
assert.match(result.stdout,/scoped_policy_denial=true lease_renewed=true revoked_old_denied=true expired_new_denied=true/);
console.log("PASS Security original OIDC RS256/claim/object denials and Vault local scope/lease lifecycle; real Keycloak/Vault UNVERIFIED.");

const directory = readFileSync(root + "security-enterprise-directory-federation-deep.ts", "utf8");
const webThreats = readFileSync(root + "security-web-api-threats-deep.ts", "utf8");
const application = readFileSync(root + "security-application-deep.ts", "utf8");
assert.ok(directory.includes("...(federationDepthById[spec.id] ?? [])"), "Directory federation mechanism must live in original reading");
assert.ok(webThreats.includes("webAuthorizationDepthById[spec.id]"), "Web/API access-denial experiment must live in original lesson");
assert.ok(application.includes("applicationAuthorizationDepthById[spec.id]"), "Object authorization must be taught in original app security");
const federate = exactProgram("security-federation-source-proof.ts", "federationModelPython");
const fedRun = spawnSync("python3", ["-c", federate], {encoding:"utf8",timeout:10000});
assert.ifError(fedRun.error);
assert.equal(fedRun.status,0,"Directory model failed: "+fedRun.stderr);
assert.match(fedRun.stdout,/mapped_owner_allow=true unmapped_disabled_cross_owner_and_unprivileged_bind_denied=true/);
const http = exactProgram("security-http-object-auth-proof.ts", "objectPermissionLoopbackPython");
assert.ok(http.includes('127.0.0.1') && !http.includes('0.0.0.0'), "HTTP access lab must be loopback only");
const httpRun = spawnSync("python3",["-c",http],{encoding:"utf8",timeout:15000});
assert.ifError(httpRun.error);
assert.equal(httpRun.status,0,"HTTP security lab failed: "+httpRun.stderr);
assert.match(httpRun.stdout,/owner_200=true missing_identity_401=true cross_owner_403_no_leak=true/);
console.log("PASS exact directory mapping negative proof and actual local HTTP object-authorization 200/401/403; live Keycloak, LDAP and Steward UNVERIFIED.");

const signingLesson = readFileSync(root + "security-artifact-signing-verification-deep.ts", "utf8");
assert.ok(signingLesson.includes("...artifactTrustBlocks"), "Real trusted-signer negative proof missing from signing source");
const artifactProof = exactProgram("security-artifact-trust-proof.ts", "artifactTrustJavaScript");
const signedArtifact = spawnSync("node", ["-e", artifactProof], {encoding:"utf8",timeout:15000});
assert.ifError(signedArtifact.error);
assert.equal(signedArtifact.status, 0, "Artifact signing classroom proof failed: "+signedArtifact.stderr);
assert.match(signedArtifact.stdout,/trusted_artifact_verified=true tampered_digest_denied=true untrusted_valid_signer_denied=true/);
console.log("PASS exact source RSA artifact subject, digest and signer-denial checks; real Cosign/registry UNVERIFIED.");

const host = readFileSync(root + "security-linux-network-deep.ts", "utf8");
assert.ok(host.includes("linuxSecurityDepthById[spec.id]"), "Host security negative proof must be source-authored");
const permissions = exactProgram("security-host-permissions-proof.ts", "hostPermissionsPython");
const permissionsRun = spawnSync("python3", ["-c", permissions], {encoding:"utf8",timeout:10000});
assert.ifError(permissionsRun.error);
assert.equal(permissionsRun.status,0,"Unix permission proof failed: "+permissionsRun.stderr);
assert.match(permissionsRun.stdout,/private_file_0600=true group_or_world_readable_0644_rejected=true/);
console.log("PASS original Linux secret-file mode and world-readable negative proof; real SSH/firewall unverified.");
