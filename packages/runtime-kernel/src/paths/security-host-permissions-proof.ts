import type { LessonBlock } from "../activities/content";

// Disposable Unix permission semantics, not an actual SSH key or system hardening.
export const hostPermissionsPython = "import os\nimport stat\nfrom pathlib import Path\nfrom tempfile import TemporaryDirectory\n\nwith TemporaryDirectory(prefix=\"tsa-security-permissions-\") as directory:\n    fake_key = Path(directory) / \"FAKE_NOT_A_CREDENTIAL\"\n    fake_key.write_text(\"synthetic placeholder, not a private key\", encoding=\"utf8\")\n    os.chmod(fake_key, 0o600)\n    secure_mode = stat.S_IMODE(fake_key.stat().st_mode)\n    assert secure_mode == 0o600\n    os.chmod(fake_key, 0o644)\n    exposed_mode = stat.S_IMODE(fake_key.stat().st_mode)\n    assert exposed_mode & 0o077, \"Group/other unexpectedly have no access\"\n    print(\"private_file_0600=true group_or_world_readable_0644_rejected=true\")";

export const linuxSecurityDepthById: Record<string, LessonBlock[]> = {
 "file-secret-permissions":[
  {type:"heading",id:"file-mode-boundary",text:"A secret file's permission bits are a trust boundary",level:2},
  {type:"paragraph",text:"On Unix-like systems, owner/group/other read bits determine which principals can inspect the file, subject to filesystem ACLs, root authority and other mandatory access controls. File mode 0600 restricts ordinary access to the owner, while 0644 permits group/other reads. This does not secure a secret if a compromised root account, backup copy, logs or container mount also exposes it."},
  {type:"heading",id:"file-mode-negative-lab",text:"Prove private permissions and detect world-readable exposure",level:2},
  {type:"paragraph",text:"Run this local Python fixture against a temporary FAKE noncredential file, not an SSH private key or enterprise certificate. It verifies 0600, deliberately changes only the disposable file to 0644 and flags the new group/other read permission. The temporary workspace is cleaned automatically. This is not a proof of SSH login hardening or ACL correctness."},
  {type:"code",language:"python",caption:"Safe Unix file-mode positive and negative experiment",code:hostPermissionsPython},
  {type:"paragraph",text:"Transfer: distinguish owner identity, filesystem ACL and process execution identity. In a real deployment, check who runs the service and which file stores/mounts are readable; remove group/world access only under an approved plan that leaves the service able to read its own secret."}
 ],
 "ssh-hardening":[
  {type:"heading",id:"ssh-recoverable-policy",text:"SSH hardening must preserve one tested recovery path",level:2},
  {type:"paragraph",text:"An SSH daemon authenticates a user and may authorize access using a public key plus account and policy configuration. A password login disabled before key-only login and an out-of-band rescue console are tested can lock an operator out. Before any change, identify the actual OS, provider rescue access, active sshd configuration, firewall zone, selected user and key authorization. Test the candidate server config with sshd -t/sshd -T on an authorized host and establish a SECOND working session before ending the first; do not automatically restart sshd or change ports on shared infrastructure."},
  {type:"heading",id:"ssh-denial-recovery",text:"Failure and transfer: policy closed the wrong door",level:2},
  {type:"paragraph",text:"A correct denial for an unauthorized SSH account is useful only while authorized administration still works. Demonstrate one positive key-only login and one denied unauthorized account on an isolated VM; verify console recovery and audit logs. The local fake-file permission exercise does not prove OpenSSH behavior."}
 ],
 "host-firewalls":[
  {type:"heading",id:"firewall-layer-ownership",text:"A firewall rule is only one enforcement point",level:2},
  {type:"paragraph",text:"A provider security-group policy may reject traffic before it reaches the host; firewalld/nftables on the host applies a separate rule set; container networking and application listeners create further exposure. Document source IP, destination interface and port, rule owner, time window and observable allow/deny outcome. A service bound to 0.0.0.0 can still be unreachable due to outer controls; a localhost-only service is not externally accessible simply because a firewall port is allowed."},
  {type:"heading",id:"firewall-admin-safety",text:"Failure and transfer: do not make the host unreachable",level:2},
  {type:"paragraph",text:"On a disposable machine, compare the actual provider/network policy with host zone membership, active listeners and observed connectivity from a separate authorized client. Record a known-good SSH administrative path and provider console before altering rules; stage rollback and verify it after a deliberately blocked test port. Avoid blanket firewall disablement or a guessed SSH port rule as the fix."}
 ]
};
