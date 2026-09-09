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
            { type: "paragraph", text: "Instead of saying 'run apt install nginx every time', configuration management expresses that nginx must be present at an approved version or package state. The tool compares current state to intent and changes only what is necessary." },
            { type: "code", language: "yaml", caption: "Idempotent package intent", code: "- name: Ensure required packages are installed\n  ansible.builtin.apt:\n    name:\n      - docker.io\n      - python3\n    state: present\n    update_cache: true" },
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
            { type: "code", language: "bash", caption: "First connectivity proof", code: "ansible steward_hosts -m ansible.builtin.ping\nansible steward_hosts -m ansible.builtin.setup" },
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
                        "Deploy a known Steward release using the existing delivery path after configuration management has prepared the host and verify meaningful API behavior.",
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
