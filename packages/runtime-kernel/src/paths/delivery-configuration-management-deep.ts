import type { LearningResource, LessonBlock } from "../activities/content";
import type { Lesson } from "./lesson";

const ansibleDocs: LearningResource = { title: "Ansible documentation", url: "https://docs.ansible.com/" };
const ansibleInventory: LearningResource = { title: "Ansible inventory guide", url: "https://docs.ansible.com/ansible/latest/inventory_guide/intro_inventory.html" };
const ansiblePlaybook: LearningResource = { title: "Ansible playbook guide", url: "https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_intro.html" };
const ansibleRoles: LearningResource = { title: "Ansible roles", url: "https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_reuse_roles.html" };

function reading(id: string, title: string, intro: string, blocks: LessonBlock[], resources: LearningResource[]): Lesson {
    return {
        id: `configuration-management-${id}`,
        title,
        activities: [
            {
                id: `configuration-management-${id}-001`,
                title,
                estimatedMinutes: 40,
                content: {
                    type: "reading",
                    body: intro,
                    blocks: [
                        { type: "paragraph", text: intro },
                        ...blocks,
                        { type: "callout", tone: "steward", title: "Steward configuration checkpoint", body: "Relate the lesson back to the Steward homelab. The target is not merely to make a host work once, but to make its important state explainable, reviewable and reproducible from versioned configuration." },
                        { type: "resources", title: "Continue learning", resources },
                    ],
                },
            },
        ],
    };
}

export const configurationManagementDeepLessons: Lesson[] = [
    reading(
        "drift",
        "Configuration Drift",
        "Configuration drift appears when machines that are supposed to serve the same purpose gradually diverge because of undocumented manual changes, package updates, one-off fixes or forgotten defaults.",
        [
            { type: "heading", id: "what-drift-looks-like", text: "What drift looks like", level: 2 },
            { type: "paragraph", text: "Two Steward hosts may begin identical and later disagree about installed packages, users, firewall rules, service files, directories or Docker settings. The dangerous part is often not the difference itself but the absence of a trustworthy explanation for why it exists." },
            { type: "list", items: ["A package installed manually on only one host", "A systemd override changed directly in /etc", "A firewall rule added during troubleshooting and never documented", "A directory owner corrected with chown but never encoded anywhere", "A deployment dependency that exists only because one engineer remembers to install it"] },
            { type: "heading", id: "manual-repair-is-not-state", text: "Manual repair is not declared state", level: 2 },
            { type: "paragraph", text: "A command history can show what someone did, but it does not define what the machine should be. Configuration management turns desired host state into versioned intent that can be reviewed and reapplied." },
        ],
        [ansibleDocs],
    ),
    reading(
        "desired-state",
        "Desired State and Idempotency",
        "Desired-state automation describes the condition a system should reach rather than scripting every historical action that might have produced it.",
        [
            { type: "heading", id: "declare-the-outcome", text: "Declare the outcome", level: 2 },
            { type: "paragraph", text: "Instead of saying 'run dnf install python3 every time', configuration management expresses that Python and Git must be present at an approved package state, as the Rocky Linux DNF example below demonstrates. The tool compares current state to intent and changes only what is necessary." },
            { type: "paragraph", text: "The example declares package presence, not a claim that package versions are fixed or that the host has already been updated. Package metadata refresh can be an explicit prerequisite and may change observable task results. For a clean second-run convergence exercise, separate cache refresh from the presence check and inspect actual changed flags; do not infer idempotency merely from a successful exit code." },
            { type: "code", language: "yaml", caption: "Idempotent package intent", code: "- name: Ensure required packages are installed\n  ansible.builtin.dnf:\n    name:\n      - python3\n      - git\n    state: present\n    update_cache: true" },
            { type: "heading", id: "idempotency-is-a-behavior", text: "Idempotency is a behavior, not a slogan", level: 2 },
            { type: "paragraph", text: "An automation run is usefully idempotent when repeating it against an already-correct system produces no unnecessary mutation. This matters because operators must be able to rerun automation after partial failure without fearing duplicate users, repeated file edits or destructive side effects." },
            { type: "callout", tone: "warning", title: "A green run can still be wrong", body: "If the declared state itself is incorrect, an idempotent playbook will reproduce the wrong configuration consistently. Version control, review and testing remain necessary." },
        ],
        [ansibleDocs],
    ),
    reading(
        "ansible-fundamentals",
        "Ansible Fundamentals",
        "Ansible is useful here because it can manage the learner's Linux hosts over SSH without requiring a permanent agent on every target.",
        [
            { type: "heading", id: "control-node-and-managed-nodes", text: "Control node and managed nodes", level: 2 },
            { type: "paragraph", text: "The control node contains the inventory and playbooks. Managed nodes are reached using SSH and receive module operations. Authentication, privilege escalation and host-key trust therefore remain part of the system design rather than disappearing behind the tool." },
            { type: "heading", id: "first-local-control-node-check", text: "Start with a self-contained local inventory before naming remote hosts", level: 2 },
            { type: "paragraph", text: "A control node must have Ansible installed, a Python interpreter and a working inventory. An inventory is a file declaring target hosts and connection options; the next lesson teaches remote groups in detail, but first prove the control path locally without requiring an SSH server or a second VM. In a disposable directory, the following code creates an inventory for localhost using ansible_connection=local. The Ansible 'ping' module tests Ansible module execution and responds with pong; it is NOT an ICMP network ping. A successful localhost result does not prove Rocky Linux SSH access, privileges, package management or production reachability." },
            { type: "code", language: "bash", caption: "Executable once Ansible is installed on a Linux/macOS control node; localhost only", code: "ansible --version\nmkdir -p tsa-ansible-intro && cd tsa-ansible-intro\nprintf '[local_lab]\\nlocalhost ansible_connection=local\\n' > inventory.ini\nansible -i inventory.ini local_lab -m ansible.builtin.ping\n# Expected: localhost | SUCCESS and \"ping\": \"pong\"\nansible -i inventory.ini missing_group -m ansible.builtin.ping\n# Expected: warning/no matched hosts, NOT a successful remote connection" },
            { type: "paragraph", text: "Interpret both results. If the first command says ansible not found, install/configure Ansible on an authorized control node before continuing. If localhost fails because Python cannot execute, inspect the interpreter and Ansible diagnostic rather than changing firewall rules. If missing_group produces no matched hosts, that is an inventory targeting error, not a network outage. The local inventory writes only the disposable directory; do not copy real secrets into it." },
            { type: "heading", id: "remote-inventory-preview", text: "Remote hosts are a different verification boundary", level: 2 },
            { type: "paragraph", text: "The next two commands are a PREVIEW of the later 'Inventories' lesson and must not be executed until you have created and reviewed an inventory.ini containing an actual authorized steward_api host, its remote SSH identity and key-trust policy. setup collects host facts, which can include operational metadata; treat output as potentially sensitive. A real successful ping/pong from the remote host proves Ansible module execution with the configured identity, not the health of the Steward application." },
            { type: "code", language: "bash", caption: "Run only after the next lesson supplies a real authorized steward_api inventory", code: "ansible -i inventory.ini steward_api -m ansible.builtin.ping\nansible -i inventory.ini steward_api -m ansible.builtin.setup" },
            { type: "heading", id: "modules-before-shell", text: "Prefer modules over shell commands", level: 2 },
            { type: "paragraph", text: "Purpose-built modules understand resource state and often provide safer idempotency than arbitrary shell commands. Use shell or command only when there is no suitable module or when the command itself is genuinely the resource boundary." },
        ],
        [ansibleDocs],
    ),
    reading(
        "inventories",
        "Inventories",
        "An inventory models which machines automation may target and what operational groups those machines belong to.",
        [
            { type: "heading", id: "inventory-is-an-operational-model", text: "Inventory is an operational model", level: 2 },
            { type: "paragraph", text: "Group hosts by role or lifecycle meaning, not by whatever naming accident exists today. A Steward API host and a CI runner may share the same physical hypervisor but still belong to different automation groups and receive different state." },
            { type: "code", language: "ini", caption: "Small homelab inventory", code: "[steward_api]\nsteward-api-01 ansible_host=192.168.10.21\n\n[ci_runners]\nci-runner-01 ansible_host=192.168.10.31\n\n[homelab:children]\nsteward_api\nci_runners" },
            { type: "heading", id: "variables-and-secrets", text: "Variables and secrets", level: 2 },
            { type: "paragraph", text: "Inventory variables can express connection or role-specific data, but secret material should not be committed in plaintext. Separate ordinary configuration from credentials and keep the eventual secret-management boundary explicit." },
        ],
        [ansibleInventory],
    ),
    reading(
        "playbooks",
        "Playbooks",
        "A playbook connects a target group to a sequence of declarative tasks and handlers that move the system toward intended state.",
        [
            { type: "heading", id: "small-coherent-plays", text: "Build small coherent plays", level: 2 },
            { type: "paragraph", text: "A good playbook is readable enough that an engineer can predict what infrastructure it will touch before running it. Name tasks by intent, use privilege escalation deliberately, and avoid giant files that mix user management, firewall policy, application deployment and unrelated host tuning." },
            { type: "code", language: "yaml", caption: "Service configuration pattern", code: "- name: Configure Steward hosts\n  hosts: steward_api\n  become: true\n  tasks:\n    - name: Ensure steward group exists\n      ansible.builtin.group:\n        name: steward\n        state: present\n\n    - name: Ensure steward service account exists\n      ansible.builtin.user:\n        name: steward\n        group: steward\n        system: true\n        create_home: false" },
            { type: "heading", id: "handlers-for-real-changes", text: "Use handlers for change-triggered actions", level: 2 },
            { type: "paragraph", text: "Restarting a service on every run creates unnecessary disruption. Notify a handler only when a managed file or dependency actually changes." },
        ],
        [ansiblePlaybook],
    ),
    reading(
        "roles",
        "Roles Concepts",
        "Roles package related configuration into a reusable structure when the configuration has become substantial enough to justify an explicit boundary.",
        [
            { type: "heading", id: "extract-after-the-boundary-is-visible", text: "Extract after the boundary is visible", level: 2 },
            { type: "paragraph", text: "Do not create a role for every five-line playbook. Extract a role when a coherent responsibility has multiple tasks, templates, handlers, defaults or consumers. Examples could include a common Linux baseline, Docker host preparation or Steward runtime prerequisites." },
            { type: "code", language: "text", caption: "Typical role shape", code: "roles/\n  steward_host/\n    defaults/main.yml\n    tasks/main.yml\n    handlers/main.yml\n    templates/\n    files/" },
            { type: "heading", id: "reuse-without-hidden-coupling", text: "Reuse without hidden coupling", level: 2 },
            { type: "paragraph", text: "A reusable role needs explicit inputs and a narrow responsibility. If a role silently assumes a particular hostname, filesystem layout, database password or network topology, reuse becomes accidental rather than engineered." },
            { type: "heading", id: "create-and-reconcile-a-role", text: "Build a complete tiny role before reusing it", level: 2 },
            { type: "paragraph", text: "An Ansible role is a structured set of tasks, defaults, handlers, templates and optional metadata discoverable by the playbook. Tasks are the required work; defaults expose non-secret configurable inputs; handlers run notified operations when relevant tasks actually change state. Roles are not automatically idempotent: each module and handler must be chosen for its behavior. Before introducing remote SSH access, exercise a role on localhost in a disposable directory so that the learner can inspect exactly what a first run, a second unchanged run and a safe drift-repair run do." },
            { type: "code", language: "bash", caption: "Local role creation, first convergence, repeat and controlled drift; requires installed Ansible", code: "# Run on a machine with Ansible installed; creates only this disposable lab.\nmkdir -p tsa-ansible-role/roles/steward_baseline/tasks\ncd tsa-ansible-role\nprintf '[local_lab]\\nlocalhost ansible_connection=local\\n' > inventory.ini\ncat > roles/steward_baseline/tasks/main.yml <<'YAML'\n- name: Ensure local Steward lab directory exists\n  ansible.builtin.file:\n    path: \"{{ playbook_dir }}/lab-state\"\n    state: directory\n    mode: \"0755\"\nYAML\ncat > site.yml <<'YAML'\n- name: Check a small Steward host-preparation role\n  hosts: local_lab\n  gather_facts: false\n  roles:\n    - steward_baseline\nYAML\nansible-playbook -i inventory.ini site.yml\nansible-playbook -i inventory.ini site.yml\n# Safe negative/drift case: remove only the lab directory just created.\nrmdir lab-state\nansible-playbook -i inventory.ini site.yml\ntest -d lab-state\n# Optional cleanup while still in the disposable lab:\n# cd .. && rm -r tsa-ansible-role" },
            { type: "paragraph", text: "Expected evidence: the first play creates lab-state and reports changed=1; the second play, without changed inputs, reports changed=0; after the deliberately scoped rmdir, the third play reports the directory recreated. Actual recap text depends on Ansible version and execution environment. If playbook reports 'role not found', check that roles/steward_baseline exists beside site.yml and the current working directory. If the task cannot create a local directory, diagnose filesystem permissions rather than adding become: true to everything. This scenario does not prove a real Rocky host or a Docker service was configured." },
            { type: "heading", id: "when-to-extract-and-when-to-defer", text: "Role boundaries and an independent case", level: 2 },
            { type: "paragraph", text: "Suppose two Rocky VMs need a shared audited user/group baseline while the CI runner and Steward API require different firewall rules. A shared role may own the common user and directory invariant; separate roles should own their distinct service policies. Passing database passwords implicitly through the shared role would create hidden coupling. For independent practice, add a configurable directory name through defaults/main.yml and change it for only one host group. Predict the changed tasks, verify that the other group remains unchanged and identify when a handler is justified (a managed service file changed) rather than executed on every run." },

        ],
        [ansibleRoles],
    ),
    {
        id: "configuration-management-lab-automate-steward-servers-with-ansible",
        title: "Lab: Automate Steward Servers with Ansible",
        activities: [
            {
                id: "configuration-management-lab-automate-steward-servers-with-ansible-001",
                title: "Rebuild Steward host state from declared configuration",
                estimatedMinutes: 180,
                content: {
                    type: "practical",
                    objective: "Replace the important undocumented host-level assumptions in the current Steward deployment with versioned Ansible configuration and prove that the automation converges safely when rerun.",
                    scenario: "The Steward API is already containerized and deployable from CI/CD, but the target Linux host still depends on manually prepared users, packages, directories, Docker configuration and other host state. Another engineer should be able to prepare an equivalent target without following tribal knowledge.",
                    instructions: [
                        "Inventory the current Steward host and list every host-level prerequisite required before the deployment pipeline can succeed.",
                        "Create a minimal Ansible inventory with explicit host groups for the Steward runtime and any separate homelab roles you actually manage.",
                        "Encode the required packages, service account or groups, directories, ownership, permissions and Docker/runtime prerequisites using appropriate Ansible modules.",
                        "Manage at least one configuration file or template whose change triggers a handler only when necessary.",
                        "Keep credentials and secret values out of plaintext version control; document the boundary used for secret injection even if full secret-management tooling comes later.",
                        "Run the playbook against the target, record the changed tasks, then run it again without modifying inputs and prove that the second run converges with no unnecessary changes.",
                        "Introduce one safe drift condition manually, rerun the playbook, and prove that declared state repairs it.",
                        "Deploy a known Steward release using the existing delivery path after configuration management has prepared the host; verify API behavior, publisher and consumer readiness, and one outbox-to-consumer lifecycle event.",
                        "Produce a short handoff showing which machine assumptions are now declared and which remaining assumptions belong to later artifact/dependency, security or reliability work.",
                    ],
                    deliverables: [
                        "Versioned Ansible inventory and playbook/role structure",
                        "Current-state prerequisite inventory mapped to declared configuration",
                        "First-run and clean second-run evidence",
                        "Controlled drift-and-repair evidence",
                        "Successful Steward deployment on the Ansible-prepared host",
                        "Configuration-management handoff",
                    ],
                    completionCriteria: [
                        "A new equivalent Steward host can be prepared from documented inputs without relying on undocumented shell history.",
                        "The automation uses state-aware modules for important resources rather than arbitrary shell commands where suitable modules exist.",
                        "A second unchanged run is demonstrably convergent and does not create unnecessary mutation.",
                        "At least one safe drift condition is detected and repaired by the declared state.",
                        "Secret material is not committed in plaintext.",
                        "The learner can explain the boundary between host configuration management and application deployment automation.",
                    ],
                },
            },
            {
                id: "configuration-management-lab-automate-steward-servers-with-ansible-002",
                title: "Exit reflection",
                estimatedMinutes: 20,
                content: {
                    type: "reflection",
                    prompt: "If the current Steward VM were deleted and replaced with a fresh Linux VM at the same network boundary, which parts of the runtime could Ansible now reconstruct automatically, and which parts would still block a complete recovery? Classify each remaining gap as host configuration, application release, persistent data, dependency/artifact infrastructure, secret management or another explicit boundary.",
                },
            },
        ],
    },
];
