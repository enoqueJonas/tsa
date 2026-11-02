import assert from "node:assert/strict";
import fs from "node:fs";
const source=fs.readFileSync("packages/runtime-kernel/src/paths/platform-builder-enterprise-file-directory-services-deep.ts","utf8");
for(const id of [
"platform-enterprise-file-services",
"platform-enterprise-smb-interoperability",
"platform-enterprise-directory-services",
"platform-enterprise-openldap-ad-interoperability",
])assert.ok(source.includes('"'+id+'"'),"Missing separate concept lab: "+id);
assert.ok(source.includes("const nfsFirst = narrowFirstProtocolLesson(fileServices"),"Existing NFS learner ID not preserved");
assert.ok(source.includes("const ldapFirst = narrowFirstProtocolLesson(directoryFoundations"),"Existing LDAP learner ID not preserved");
assert.ok(source.includes("fileServices, smbInterop, ldapFirst")===false,"Old full file/NFS sequence accidentally retained");
assert.ok(source.includes("[nfsFirst, smbInterop, ldapFirst, ldapCompare]"),"Concepts not staged NFS-SMB / LDAP-OpenLDAP");
for(const key of [
"Share ACL, session identity and backing filesystem permissions",
"Group and disabled-user semantics",
"TLS trust is distinct from invalid credentials",
"Network filesystems extend filesystem semantics across a failure boundary",
])assert.ok(source.includes(key),"Missing boundary teaching: "+key);
assert.ok(source.includes("activity.content.instructions.filter"),"NFS and LDAP original practicals not narrowed");
console.log("Platform Builder enterprise files and directory lesson split passed: NFS, SMB, LDAP and OpenLDAP/AD remain individually teachable.");