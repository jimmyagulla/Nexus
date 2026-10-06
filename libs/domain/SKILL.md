---
name: domain-boundaries
description: >-
  Domain layer isolation and ownership of validation rules for the shared
  domain. Use when defining an entity, a value object, a business constant, or
  any validation pattern (regular expression, bounds, allowed values) consumed
  by an API validator or a form schema.
---

# Domain

## Allowed

- Define entities, value objects, and stateless domain services.
- Define business constants (e.g., `DEFAULT_CATEGORIES`, tax rates).
- Implement business behaviors and invariants.
- **Business Logic Placement**: For tasks not requiring external calls, implement them here.

## Validation rules

A validation pattern is a business rule. It lives here and nowhere else.

- Export every validation regular expression as a named constant: one rule, one constant, one place.
- Request validators on the API side and form schemas on the frontend side reference that constant. They never restate the pattern.
- An inline regular expression, or the same pattern written twice, is a defect. Move it here and import it.

## Forbidden

- Import any other layer (ports, application, adapters, infrastructure).
- Use frameworks, HTTP, DB/ORM, or configuration/environment loaders.
- Declare a port here — skill `ports-location`.

## Dependencies

- Import: Other domain modules, language standard library.
- Never import: Any external hexagonal layer or technical package.
