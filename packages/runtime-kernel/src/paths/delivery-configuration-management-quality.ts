import type { PracticalContent } from "../activities/content";
import type { Lesson } from "./lesson";
import { configurationManagementDeepLessons } from "./delivery-configuration-management-deep";

const practices: Record<string, PracticalContent> = {
    "Configuration Drift": {
        type: "practical",
        objective: "Detect and explain real configuration drift on the Rocky Linux Steward host before trying to automate it away.",
        scenario: "The deployment pipeline works, but the host has accumulated manual package, permission, firewall and service changes that another engineer cannot reproduce confidently.",
        instructions: [
            "Inventory the host state that Steward depends on: packages, service accounts, groups, directories, ownership, firewalld rules, SELinux-relevant paths and Docker/runtime prerequisites.",
            "Choose one safe item and create a controlled drift condition manually.",
            "Capture evidence of the intended state and the drifted state before repair.",
            "Classify each dependency as host configuration, application deployment, persistent data, secret material or another boundary.",
            "Write the minimum declared-state contract Ansible would need to own without absorbing responsibilities from CI/CD or the application itself."
        ],
        deliverables: ["Host dependency inventory", "Controlled drift evidence", "Configuration-ownership boundary"],
        completionCriteria: ["Drift is demonstrated from observable state rather than described abstractly.", "The learner distinguishes desired state from command history.", "The Ansible boundary does not swallow deployment, data or secret-management responsibilities."],
    },
    "Desired State and Idempotency": {
        type: "practical",
        objective: "Prove idempotent desired-state behavior on Rocky Linux using Ansible rather than a repeated shell procedure.",
        scenario: "A manual setup script can run twice, but repeated success is not enough: the host should converge to one intended state without accumulating changes.",
        instructions: [
            "Select two real Rocky Linux prerequisites for Steward, such as a DNF-managed package and a directory or service account.",
            "Express them with state-aware Ansible modules.",
            "Run the playbook once and record changed tasks.",
            "Run it again without changing inputs and record the second result.",
            "Introduce a safe drift condition, rerun, and identify exactly which task repairs it.",
            "Explain one case where idempotent automation could still enforce the wrong state consistently."
        ],
        deliverables: ["Minimal desired-state play", "First/second-run comparison", "Drift-repair evidence"],
        completionCriteria: ["Rocky/RHEL package management uses DNF-aware Ansible behavior rather than Ubuntu apt assumptions.", "The unchanged second run converges without unnecessary mutation.", "The learner can separate idempotency from correctness."],
    },
    "Ansible Fundamentals": {
        type: "practical",
        objective: "Establish a least-privilege Ansible control path into the learner-owned Rocky Linux homelab and prove what the control node can and cannot do.",
        scenario: "Ansible needs SSH and sometimes privilege escalation, but using the general homelab administrator account would turn convenience into an oversized trust boundary.",
        instructions: [
            "Choose and document the Ansible control node and one Rocky Linux managed node.",
            "Use a dedicated automation identity or narrowly scoped account rather than a general personal administrator identity where practical.",
            "Verify SSH host-key trust and run ansible.builtin.ping and setup against the target.",
            "Run one task that does not require privilege escalation and one justified task that does.",
            "Record the exact privilege boundary and one operation the automation identity should not be able to perform unnecessarily.",
            "Compare a purpose-built module with an equivalent shell command and justify the module choice."
        ],
        deliverables: ["Control/managed-node map", "Connectivity and privilege evidence", "Module-vs-shell decision"],
        completionCriteria: ["The learner understands Ansible as SSH-driven control rather than magic agentless administration.", "Privilege escalation is explicit and justified.", "Purpose-built modules are preferred where they model the resource correctly."],
    },
    "Inventories": {
        type: "practical",
        objective: "Model the current Steward homelab as an operational inventory whose groups reflect responsibility rather than hostname accidents.",
        scenario: "The homelab now contains or anticipates Steward runtime, Jenkins agents and later artifact-platform hosts. Applying the same state to every machine would create hidden coupling and excess privilege.",
        instructions: [
            "List the currently managed hosts and their responsibilities.",
            "Create inventory groups for real roles such as steward_api and ci_runners; add future groups only when a host actually exists or the design needs a documented placeholder.",
            "Keep ordinary host/group variables separate from secret material.",
            "Use ansible-inventory to inspect the resolved inventory and verify one host receives only the variables intended for its groups.",
            "Identify one configuration that belongs in group_vars, one that belongs at host scope, and one value that must not live in plaintext inventory.",
            "Document how the WireGuard/private-management boundary affects which inventory addresses should be used."
        ],
        deliverables: ["Versioned inventory", "Resolved inventory evidence", "Variable/secret classification"],
        completionCriteria: ["Groups represent operational roles.", "Secrets are not committed as ordinary inventory variables.", "Management addresses follow the private network model established in Platform Builder."],
    },
    "Playbooks": {
        type: "practical",
        objective: "Build a readable Steward host playbook that changes only the resources required for one coherent responsibility and triggers service actions only on real change.",
        scenario: "A single giant playbook that mixes users, firewalls, Docker, deployment and unrelated tuning would be difficult to review and dangerous to rerun.",
        instructions: [
            "Choose one coherent host responsibility such as Steward runtime prerequisites.",
            "Create named tasks for the required account/group, directory, package or configuration state using appropriate modules.",
            "Use become only on tasks or plays that genuinely require it.",
            "Manage one configuration file or template and notify a handler only when that resource changes.",
            "Run once, run again unchanged, then modify the managed input and prove the handler fires only on the meaningful change.",
            "Review the playbook and remove any task that actually belongs to the Jenkins deployment pipeline or application release process."
        ],
        deliverables: ["Focused playbook", "Handler/change evidence", "Boundary review"],
        completionCriteria: ["Task names communicate intent.", "Handlers respond to real changes instead of restarting services on every run.", "Host configuration remains distinct from application deployment."],
    },
    "Roles Concepts": {
        type: "practical",
        objective: "Extract an Ansible role only when Steward host configuration has developed a real reusable responsibility boundary.",
        scenario: "The team wants roles because mature Ansible repositories use them, but premature abstraction would hide a tiny amount of configuration behind unnecessary structure.",
        instructions: [
            "Review the current playbook and count the tasks, templates, handlers, variables and possible consumers around one responsibility.",
            "Decide whether the responsibility is mature enough to become a role; record an explicit adopt/defer decision.",
            "If adopted, extract one focused role such as steward_host or container_host with explicit defaults/inputs and no embedded secrets.",
            "Apply the role to the intended group and prove the result is equivalent to the previous playbook behavior.",
            "Change one supported input and prove the role responds without requiring hostname-specific edits.",
            "Identify one assumption that would make the role falsely reusable and remove or document it."
        ],
        deliverables: ["Role adopt/defer decision", "Role or deferred-boundary design", "Reuse/equivalence evidence when adopted"],
        completionCriteria: ["Abstraction is justified by a real responsibility boundary.", "Inputs are explicit and secrets remain external.", "The role does not silently depend on one hostname or accidental topology."],
    },
};

function alignRockyLinux(lesson: Lesson): Lesson {
    if (lesson.title !== "Desired State and Idempotency") return lesson;
    return {
        ...lesson,
        activities: lesson.activities.map((activity) => {
            if (activity.content.type !== "reading" || !activity.content.blocks) return activity;
            return {
                ...activity,
                content: {
                    ...activity.content,
                    blocks: activity.content.blocks.map((block) => {
                        if (block.type === "paragraph" && block.text.includes("run apt install nginx every time")) {
                            return { ...block, text: block.text.replace("run apt install nginx every time", "run dnf install nginx every time") };
                        }
                        if (block.type === "code" && block.code.includes("ansible.builtin.apt")) {
                            return {
                                ...block,
                                code: "- name: Ensure required packages are installed\n  ansible.builtin.dnf:\n    name:\n      - podman\n      - python3\n    state: present\n    update_cache: true",
                            };
                        }
                        return block;
                    }),
                },
            };
        }),
    };
}

function enrichLesson(lesson: Lesson): Lesson {
    const aligned = alignRockyLinux(lesson);
    const practice = practices[aligned.title];
    if (!practice) return aligned;
    return {
        ...aligned,
        activities: [
            ...aligned.activities,
            {
                id: `${aligned.id}-practice`,
                title: `${aligned.title}: Steward Investigation`,
                estimatedMinutes: 60,
                content: practice,
            },
        ],
    };
}

export const configurationManagementQualityLessons: Lesson[] = configurationManagementDeepLessons.map(enrichLesson);
