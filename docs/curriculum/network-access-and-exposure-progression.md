# Network Access and Exposure Progression

## Purpose

This document makes the Steward access model explicit across TSA. The learner must not confuse "the application runs" with "the application is safely reachable," and public exposure must not imply that every operational component becomes internet-accessible.

The progression deliberately separates three traffic classes:

1. **Public application traffic** — traffic that legitimate Steward users may originate from the internet.
2. **Private service traffic** — database, cache, messaging and internal service-to-service paths that should not be exposed directly to the internet.
3. **Administrative/control-plane traffic** — SSH, Jenkins, Nexus, dashboards and other operator interfaces that should normally require a private/VPN path or another deliberately restricted management boundary.

## Platform Builder — local network, host policy and VPN

Platform Builder establishes the network model before any cloud or gateway product is introduced.

The learner must:

- run Steward on the Rocky Linux environment and make it reachable from another device on the learner-managed LAN;
- distinguish listening sockets, routing and host-firewall policy;
- use firewalld to expose only justified host services;
- understand private addressing, subnetting, routing, NAT and the difference between LAN reachability and internet reachability;
- understand home-router port forwarding and why inbound exposure may be impossible behind ISP CGNAT;
- implement a learner-owned VPN using **WireGuard** (or an equivalent standards-based VPN only when the environment makes WireGuard impractical);
- create an explicit management path where at least one administrative resource is reachable only through the VPN/private network;
- prove both positive and negative reachability: an allowed client can reach the resource while an untrusted/public path cannot;
- keep database and other backend-only ports private.

Suitable VPN-only resources include SSH administration, an internal diagnostic endpoint, a future Jenkins/Nexus interface, or another non-public control-plane service. The exercise is about access boundaries, not hiding insecure software behind a VPN.

## Delivery Engineer — reproducible homelab deployment

Delivery Engineer keeps the Platform Builder access boundaries while making deployment reproducible.

Steward should be deployed to the learner-managed Rocky Linux/homelab environment through the established delivery system rather than copied and started manually. Ansible, Jenkins and the artifact repository automate host/application state, but their administrative interfaces are not made public merely because Steward is deployable.

The learner should preserve a topology in which:

- Steward application ingress has a defined user-facing path;
- Jenkins, Nexus and SSH remain on the private/VPN management path unless a later exercise establishes a stronger justified control;
- PostgreSQL, Redis and RabbitMQ remain backend-only;
- deployment automation can reach the target through a deliberate trusted path.

## Cloud Engineer — public edge, gateway and local-to-public exposure

Cloud Engineer introduces the internet edge and **Kong** as TSA's primary API-gateway implementation.

At this stage the learner must build and compare two valid hosting patterns:

### Pattern A — remote internet environment

A low-cost VPS/cloud environment hosts the public Steward release. DNS and TLS terminate at the deliberately designed edge, Kong routes permitted application traffic, and administrative access remains separate from public ingress.

### Pattern B — learner-owned homelab behind a public edge

Steward continues to run on the learner-managed Rocky Linux environment while a controlled public edge makes the API reachable from the internet.

The implementation must account for the learner's actual ISP/network conditions:

- when inbound public addressing and router control are available, a tightly scoped NAT/port-forwarding design may be used;
- when the learner is behind CGNAT or cannot safely accept inbound traffic, use a small public VPS/edge node with a **WireGuard site-to-site/private tunnel** (or another explicitly justified outbound tunnel) back to the homelab;
- the public edge exposes only the HTTPS application path;
- Kong provides gateway routing/policy at the edge or justified internal boundary;
- the Rocky Linux host and internal services are not broadly exposed merely to support the public path.

This creates a realistic topology such as:

```text
Internet users
      |
   DNS/TLS
      |
 Public edge / Kong
      |
  private tunnel
      |
Rocky Linux homelab
      |
  Steward API
   /   |    \
PostgreSQL Redis RabbitMQ

Administrator
      |
 WireGuard VPN
      |
SSH / Jenkins / Nexus / private operations
```

The learner must prove the boundary with reachability evidence rather than only a diagram.

The **Cloud Engineer content-quality pass must add an explicit Public Edge and API Gateway learning path** if the currently published Cloud Engineer paths do not already contain it. That path is where Kong, local-to-public Steward exposure, DNS/TLS, CGNAT-aware designs and separation of public ingress from VPN-only administration become learner-facing implementation rather than remaining a curriculum note.

## Security Steward — enterprise identity on the public path

Security Steward evolves the public path toward:

```text
User -> Keycloak/OIDC -> Kong -> Steward
```

Keycloak owns identity-provider responsibilities. Kong may validate/enforce edge authentication policy where justified, while Steward retains domain authorization, ownership and business invariants.

VPN/private placement does not replace authentication, authorization, least privilege, patching or secure configuration.

## Reliability Engineer — operate both public and private paths

Reliability work must observe the complete request and control paths: public DNS/TLS/gateway behavior, VPN/private management reachability, Steward, PostgreSQL, Redis, RabbitMQ and the delivery components that support recovery.

Failure exercises should include at least one network-boundary incident, such as gateway failure, broken tunnel/VPN routing, incorrect firewall policy or DNS/TLS failure, and should distinguish public-user impact from administrative/control-plane impact.

## Exposure guardrails

The learner must never solve reachability by opening every port or disabling host/network security controls.

The default exposure model is:

| Component | Default exposure |
| --- | --- |
| Steward HTTPS API through the designed edge | Public when the exercise requires it |
| Kong public listener | Public when acting as the internet edge |
| SSH | VPN/private management path |
| Jenkins | VPN/private management path |
| Nexus | VPN/private management path |
| Grafana/operations UI | Private by default; deliberate authenticated exposure only when justified |
| PostgreSQL | Backend/private only |
| Redis | Backend/private only |
| RabbitMQ application ports | Backend/private only |
| RabbitMQ management UI | VPN/private management path |
| Keycloak | Public only for the identity endpoints required by the chosen authentication flow; administration remains restricted |

Every exception requires a stated user/system need, authentication/authorization model, network policy, TLS decision, evidence and rollback path.
