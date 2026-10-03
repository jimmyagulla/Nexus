---
name: domain-boundaries
description: Domain layer isolation for libs/domain.
---

# Domain

## Allowed

- Define entities, value objects, and stateless domain services.
- Implement business behaviors and invariants.

## Forbidden

- Import any other layer (ports, application, adapters, infrastructure).
- Use frameworks, HTTP, DB/ORM, or configuration/environment loaders.

## Dependencies

- Import: Other domain modules, language standard library.
- Never import: Any external hexagonal layer or technical package.
