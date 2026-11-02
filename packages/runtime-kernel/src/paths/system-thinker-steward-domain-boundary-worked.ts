import type {LearningResource} from "../activities/content";
// The executable source runs against the real published Builder v1 teaching
// models and domain service, reconstructed in a disposable PostgreSQL CI job.
// This does NOT prove production Steward authentication or a deployed adapter.
export const stewardDomainBoundarySections = [
  {
    "title": "Use the real Builder domain invariants rather than rewriting them in a diagram",
    "paragraphs": [
      "Earlier, Builder created actual Django Team, Service and Environment models in PostgreSQL and a `promote_to_production` service that locks the Service row and verifies a production Environment exists. A System Thinker must trace **who may ask**, **which domain rule evaluates the request** and **what data is committed**, without replacing the domain service with an arrow labelled 'business logic'. This lesson uses those *exact published Builder v1 files* in a disposable copy rather than inventing a different lifecycle model.",
      "Before the example, distinguish identity proof from local team authorization. The test uses real Django `User` and `Group` records to model two actors, but the Group-to-Team relationship is **test scaffolding**, not a claim that Builder already deployed a secure enterprise identity provider or team-membership service. Actual Steward authorization must follow its approved membership model. The two checks must remain separate in the design: an authenticated actor might still have no authority over the target Service.",
      "The domain invariant is not 'a status field accepts production'. The service may enter production only when the current configured deployment set includes a production Environment. The lifecycle and Environment.kind are different concepts. A denial must leave persisted lifecycle unchanged, and the last supporting production Environment must not be deleted while the Service remains production."
    ]
  },
  {
    "title": "Execute an authorized and rejected state transition against real Django and PostgreSQL",
    "paragraphs": [
      "Prerequisites: your **disposable** Builder v1 Django project and its real `registry/models.py` and `registry/services.py` from the Builder lesson, Django and PostgreSQL migrations applied, and the default Django auth migrations. Use a separate test database, never a work/production environment. Save the entire program as `steward_boundary.py`, then run it from the project root using `python3 manage.py shell < steward_boundary.py`.",
      "First a different-Team User attempts promotion: authorization must reject without changing the Service. Next an allowed User attempts promotion without a production Environment: Builder's *actual* service must raise ReadinessConflict. After creating a production Environment, the script enters an outer transaction, performs the valid promotion and deliberately raises an exception before commit; PostgreSQL must roll back the lifecycle to UAT. Only the final call with no forced exception may persist production. Deleting the last production Environment must be rejected by the existing domain service.",
      "Expected output: `cross-team lifecycle promotion: denied, state still uat`; `authorized promotion without production deployment: rejected`; `forced outer rollback preserves lifecycle uat: True`; `authorized promotion committed: production`; `cannot delete final production deployment: True`; `actual Builder ORM Service rows: 1`. The CI job constructs a temporary Django project from the **actual published Builder source**, applies migrations against disposable PostgreSQL 17 and runs this exact example. That verifies a domain integration in a teaching sandbox; it is not a signed-in HTTP API, real IdP integration or deployed Steward app.",
      "Follow the SQL boundary: the authorization decision occurs before the domain mutation, `select_for_update` locks the authoritative Service during promotion, and the nested transaction cannot make the outer forced failure commit. A sequence diagram that shows PostgreSQL committing before the authorization decision would be wrong even if the happy-path response were 200."
    ],
    "code": {
      "language": "python",
      "caption": "Real Django Steward model: denied team, readiness conflict, rollback and final production guard",
      "code": "# Run inside the disposable Builder v1 Django project:\n# python3 manage.py shell -c \"$(cat steward_boundary.py)\"\n# Requires Builder's actual registry/models.py and registry/services.py\n# already migrated in a non-production PostgreSQL database.\nfrom django.contrib.auth.models import Group, User\nfrom django.db import transaction\nfrom registry.models import Environment, Service, Team\nfrom registry.services import (\n    ReadinessConflict,\n    promote_to_production,\n    remove_environment,\n)\n\npayments = Team.objects.create(name=\"Payments\")\nother = Team.objects.create(name=\"Other\")\nservice = Service.objects.create(\n    name=\"Synthetic Payments Status\",\n    owning_team=payments,\n    endpoint=\"https://payments.example.invalid/api\",\n    lifecycle=Service.Lifecycle.UAT,\n)\nallowed = User.objects.create_user(username=\"tsa-allowed\", password=\"local-test-only\")\noutsider = User.objects.create_user(username=\"tsa-outsider\", password=\"local-test-only\")\n\n# TEST FIXTURE: Group membership is deliberately substituted for the real\n# enterprise IdP + approved Steward membership contract. The Builder v1\n# model does not claim that Django Group is its production authorization.\npayments_group = Group.objects.create(name=f\"steward-team-{payments.pk}\")\nallowed.groups.add(payments_group)\n\ndef authorized_promotion(actor, service_id):\n    with transaction.atomic():\n        target = Service.objects.select_for_update().get(pk=service_id)\n        required_group = f\"steward-team-{target.owning_team_id}\"\n        if not actor.is_authenticated or not actor.groups.filter(\n            name=required_group\n        ).exists():\n            raise PermissionError(\"Actor cannot promote another team's Service\")\n        # Actual Builder v1 domain service, not a rewritten teaching fake.\n        return promote_to_production(service_id)\n\ntry:\n    authorized_promotion(outsider, service.pk)\nexcept PermissionError:\n    service.refresh_from_db()\n    assert service.lifecycle == Service.Lifecycle.UAT\n    print(\"cross-team lifecycle promotion: denied, state still uat\")\nelse:\n    raise AssertionError(\"Cross-team update must not succeed\")\n\ntry:\n    authorized_promotion(allowed, service.pk)\nexcept ReadinessConflict as error:\n    assert \"production environment required\" in str(error)\n    service.refresh_from_db()\n    assert service.lifecycle == Service.Lifecycle.UAT\n    print(\"authorized promotion without production deployment: rejected\")\nelse:\n    raise AssertionError(\"Readiness invariant was bypassed\")\n\ndeployment = Environment.objects.create(\n    service=service, name=\"Primary\", kind=Environment.Kind.PRODUCTION\n)\ntry:\n    with transaction.atomic():\n        authorized_promotion(allowed, service.pk)\n        raise RuntimeError(\"inject failure before outer transaction commits\")\nexcept RuntimeError:\n    service.refresh_from_db()\n    assert service.lifecycle == Service.Lifecycle.UAT\n    print(\"forced outer rollback preserves lifecycle uat: True\")\n\nauthorized_promotion(allowed, service.pk)\nservice.refresh_from_db()\nassert service.lifecycle == Service.Lifecycle.PRODUCTION\nprint(\"authorized promotion committed: production\")\n\ntry:\n    remove_environment(deployment.pk)\nexcept ReadinessConflict as error:\n    assert \"final production environment\" in str(error)\n    assert Environment.objects.filter(pk=deployment.pk).exists()\n    print(\"cannot delete final production deployment: True\")\nelse:\n    raise AssertionError(\"Final production deployment was removed\")\n\nassert Team.objects.filter(name=\"Other\").count() == 1\nassert Service.objects.filter(pk=service.pk).count() == 1\nprint(\"actual Builder ORM Service rows: 1\")"
    }
  },
  {
    "title": "Diagnose an implementation boundary—not just a flowchart",
    "paragraphs": [
      "Independent experiment: in a throwaway database copy, remove the call to Builder's `promote_to_production` and directly save `lifecycle='production'` before creating a production Environment. Observe why a generic ORM save can pass while the domain contract is violated; restore the original implementation. The correct fix is not to hide this in the serializer or assume the database alone knows the policy.",
      "Compare three alternatives: enforce the invariant in application service, enforce a narrower structural check in SQL, or involve an external identity provider. Explain what each can and cannot authoritatively decide. In particular, the IdP may establish subject identity, but cannot infer Service ownership or the presence of a production Environment without a defined Steward-specific authorization/domain contract.",
      "Limitations are mandatory: this test does not expose an HTTP route, use enterprise tokens, model all Builder v1 membership/role fields, test multi-process authorization races, or include actual SOAP/SFTP/RabbitMQ side effects. Those follow in later focused System Thinker integration labs. An independent learner must now draw a failure-oriented sequence diagram with the exact first rejected/committed transaction point and defend it without copying the example."
    ]
  }
];
export const stewardDomainBoundaryResources: LearningResource[] = [
  {
    "title": "Django database transactions and atomic nesting",
    "url": "https://docs.djangoproject.com/en/5.2/topics/db/transactions/",
    "kind": "reference"
  },
  {
    "title": "Django select_for_update row locking",
    "url": "https://docs.djangoproject.com/en/5.2/ref/models/querysets/#select-for-update",
    "kind": "reference"
  },
  {
    "title": "Django authentication, groups and permissions",
    "url": "https://docs.djangoproject.com/en/5.2/topics/auth/default/",
    "kind": "reference"
  },
  {
    "title": "PostgreSQL row locking and transaction isolation",
    "url": "https://www.postgresql.org/docs/current/explicit-locking.html",
    "kind": "reference"
  }
];
