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
