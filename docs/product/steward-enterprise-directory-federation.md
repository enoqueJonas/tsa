# Steward — Enterprise Directory Federation

## Purpose

This document defines Steward's enterprise workforce identity boundary. Steward must be able to participate in an organization that already has a corporate directory without duplicating workforce credentials or outsourcing Steward's business authorization model.

The canonical identity chain is:

```text
LDAP / corporate directory
        │
        ▼
     Keycloak
   federation / SSO
        │ OIDC
        ▼
      Steward
```

## Capability ownership

### LDAP / corporate directory

The directory is authoritative for workforce identity facts such as employee identity, selected user attributes, group membership and account lifecycle according to the organization's directory model.

TSA implements a real learner-owned LDAP service in the homelab to make this boundary operationally concrete.

### Keycloak

Keycloak is Steward's authentication and federation boundary. It connects to the workforce directory, exposes standard OIDC behavior to Steward, owns token/session issuance and keeps Steward insulated from directory-specific bind/search/schema details.

### Steward

Steward consumes authenticated identity context from Keycloak but remains authoritative for domain authorization such as Team membership semantics, Service ownership, governance actions and other business permissions that require Steward state.

A valid directory account or Keycloak token does not automatically authorize every Steward action.

## Required implementation

The learner must:

- operate the LDAP directory created in the TSA homelab;
- configure Keycloak LDAP user federation against that real directory;
- use a least-privilege federation bind/service identity rather than the directory administrator;
- protect directory transport and configure trust correctly;
- federate synthetic users and groups;
- map only justified directory attributes/groups into coarse Keycloak claims/roles;
- authenticate an LDAP-originated user through Keycloak and present an OIDC access token to Steward;
- prove Steward still rejects a domain-forbidden action;
- test user disablement, group change, bind credential rotation, LDAP outage and TLS/trust failure;
- recover the identity chain and verify both allowed and denied behavior.

## Lifecycle and freshness

Directory changes do not automatically imply instantaneous invalidation of every downstream session or token. The curriculum must make the learner determine and document:

- when Keycloak queries or synchronizes directory data;
- how user disablement affects new authentication;
- what happens to already-issued tokens/sessions;
- when group/attribute changes become visible;
- how revocation/session invalidation is handled where stronger immediacy is required.

This is part of the identity architecture, not an implementation detail to hide.

## Active Directory scope

TSA does not become a Windows Server administration curriculum. It must nevertheless teach the essential enterprise context required to work with Active Directory integrations:

- domains and domain controllers;
- users and groups;
- organizational units;
- LDAP directory access;
- Kerberos authentication at an architectural level;
- DNS and time/trust dependencies;
- how AD differs from a generic standalone LDAP service;
- how Keycloak federation would be reassessed against AD schema/group behavior while Steward's OIDC boundary remains stable.

Full Group Policy administration, Windows fleet management, advanced forest/domain topology and complete AD operations remain outside scope unless a later learning scenario explicitly requires them.

## Failure model

The implementation must distinguish at least these failures:

- directory unavailable;
- invalid/expired federation bind credential;
- incorrect base DN or search filter;
- user disabled or removed;
- group membership changed;
- directory TLS certificate/trust failure;
- Keycloak unavailable;
- valid authentication but Steward domain authorization denied.

The learner must be able to identify which layer failed rather than classifying every symptom as "login broken".

## Product evolution

A later Architect/Technical Steward review may replace the homelab LDAP implementation with an enterprise directory such as Active Directory or another identity source. That migration should preserve the application-facing OIDC contract where possible, which is one of the architectural reasons Keycloak exists between Steward and the directory.
