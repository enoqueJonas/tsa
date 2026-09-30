import type { LearningResource, LessonBlock } from "../activities/content";
import type { Lesson } from "./lesson";

const nfsDocs: LearningResource = { title: "Red Hat — Deploying an NFS server", url: "https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/html/managing_file_systems/deploying-an-nfs-server_managing-file-systems" };
const sambaDocs: LearningResource = { title: "Samba documentation", url: "https://www.samba.org/samba/docs/" };
const openLdapAdmin: LearningResource = { title: "OpenLDAP Administrator's Guide", url: "https://www.openldap.org/doc/admin26/" };
const keycloakFederation: LearningResource = { title: "Keycloak — User storage federation", url: "https://www.keycloak.org/docs/latest/server_admin/#_user-storage-federation" };

function practicalLesson(id: string, title: string, intro: string, objective: string, scenario: string, instructions: string[], deliverables: string[], completionCriteria: string[], resources: LearningResource[]): Lesson {
    const blocks: LessonBlock[] = [
        { type: "paragraph", text: intro },
        { type: "callout", tone: "steward", title: "Enterprise homelab rule", body: "This is infrastructure for a Steward requirement, not an isolated product demo. Preserve ownership, network, security, failure and recovery evidence so later schools can evolve the same capability." },
        { type: "resources", title: "Continue learning", resources },
    ];
    return {
        id,
        title,
        activities: [
            { id: `${id}-001`, title, estimatedMinutes: 45, content: { type: "reading", body: intro, blocks } },
            { id: `${id}-002`, title: `Implement: ${title}`, estimatedMinutes: 180, content: { type: "practical", objective, scenario, instructions, deliverables, completionCriteria } },
        ],
    };
}

const fileServices = practicalLesson(
    "platform-enterprise-file-services",
    "Enterprise File Services: NFS and SMB",
    "Enterprise platforms frequently exchange or share files across hosts. A mounted network filesystem has different authority, permission, consistency and failure semantics from PostgreSQL, Nexus, object storage or a local application directory.",
    "Add real network file services to the TSA homelab and prove that Steward workloads can use them safely.",
    "A legacy governance/reporting integration needs a shared exchange area that survives application restarts and is reachable from more than one host. Build NFS as the primary Linux shared-filesystem implementation, then run a bounded Samba/SMB interoperability exercise rather than permanently duplicating every share.",
    [
        "Provision a dedicated learner-owned file-service host or VM and record its network/storage boundary.",
        "Create an NFS export for a bounded Steward exchange use case and mount it from at least two appropriate homelab clients.",
        "Configure ownership, UID/GID behavior, read/write boundaries and persistent mounting deliberately; prove both allowed and denied operations.",
        "Exercise a safe producer/consumer handoff using a temporary filename followed by atomic rename so consumers do not process a partially written file.",
        "Stop or isolate the NFS server while a client depends on it. Observe mount/application behavior, recover the service and document what the client must do safely.",
        "Inspect capacity and inode usage and define retention/cleanup expectations for the exchange area.",
        "Configure one bounded Samba/SMB share, authenticate from a separate client, prove read/write restrictions and compare identity/permission semantics with NFS.",
        "Decide which protocol remains the primary Steward homelab file service and remove or clearly bound the comparison share when the exercise ends.",
    ],
    ["NFS server/export configuration", "Client mount and permission evidence", "Atomic handoff evidence", "File-service outage/recovery record", "Samba/SMB interoperability evidence", "NFS-versus-SMB decision note"],
    ["NFS is actually served and consumed across the network.", "Permissions and identity behavior are demonstrated rather than assumed.", "A partial-file hazard and a server-unavailable condition are exercised.", "SMB is implemented as a bounded interoperability exercise rather than unexplained permanent duplication.", "The learner can distinguish shared file storage from Nexus, PostgreSQL and later object storage."],
    [nfsDocs, sambaDocs],
);

const directoryFoundations = practicalLesson(
    "platform-enterprise-directory-services",
    "Enterprise Directory Services: LDAP",
    "LDAP is both a protocol and a directory-oriented way of organizing/querying identity data. Enterprise identity integration requires understanding distinguished names, entries, attributes, object classes, groups, bind/search behavior and trust boundaries rather than treating a directory as a flat user table.",
    "Operate LDAP as a directory-protocol interoperability boundary and prepare a directory source for later Keycloak federation without creating two competing permanent workforce authorities.",
    "The preceding Windows path already established a synthetic AD DS domain, which exposes LDAP-compatible directory semantics alongside Kerberos and AD-integrated DNS. Use that environment to understand enterprise directory integration, and run a bounded OpenLDAP implementation only where it adds protocol/schema/administration contrast. For each federation scenario, name exactly one authoritative workforce directory; Steward retains its own application authorization model.",
    [
        "Inspect the existing synthetic AD directory through LDAP-aware tooling, then deploy a bounded OpenLDAP service only as the Linux/open-standard comparison implementation with a documented DNS name, persistence boundary and administrative recovery path; do not present both as simultaneous authoritative workforce sources.",
        "Design a small directory information tree with people, groups and service/bind-account areas; explain DN and RDN choices.",
        "Populate synthetic users and engineering groups through LDIF or equivalent repeatable administration and inspect the object classes/attributes used.",
        "Perform authenticated binds and searches using explicit base DN, scope and filters. Capture successful and failed examples without exposing credentials.",
        "Create a least-privilege bind/service account intended for federation reads instead of using the directory administrator.",
        "Protect directory traffic with TLS/StartTLS or the supported secure mechanism for the chosen implementation and validate certificate/trust behavior.",
        "Deliberately test an invalid bind credential, wrong base DN/filter, unavailable directory and broken certificate/trust condition; record diagnosis and recovery.",
        "Compare the already-operated AD DS boundary with OpenLDAP: directory tree/schema, LDAP bind/search, groups, authentication integration, DNS/time dependencies and operational ownership. State which directory is authoritative in each exercise and which one is deliberately only the comparison/interoperability target."
    ],
    ["LDAP homelab topology", "Repeatable directory bootstrap/LDIF", "Synthetic people/groups evidence", "Least-privilege bind account evidence", "Secure LDAP evidence", "Failure investigation record", "AD/LDAP/Kerberos concept map"],
    ["A real directory service is running and queryable from another homelab component.", "The learner can explain DN/RDN, attributes, object classes, groups, bind and search filters from the implemented directory.", "Federation access does not require the directory administrator identity.", "Directory transport and trust are protected and tested.", "At least three distinct directory failure modes are reproduced and diagnosed.", "The existing AD DS and bounded OpenLDAP environments have explicit non-competing roles, and the learner can explain which directory is authoritative for a given federation scenario."],
    [openLdapAdmin, keycloakFederation],
);

export const enterpriseFileAndDirectoryServicesDeepLessons: Lesson[] = [fileServices, directoryFoundations];
