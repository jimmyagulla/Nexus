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

## Shared concepts

A concept that several entities will use is declared once, under a name that belongs to none of them: `OwnerScope` (what one person owns in one company) and `requireOwnerScope`, not a `DocumentOwnerScope`.

A business rule that a repository must also apply in its query (e.g. the instants a period of calendar days covers, `documentPeriodBounds`) is a domain function the repository calls; the adapter only translates its result into its query language.

## Validation rules

A validation pattern is a business rule. It lives here and nowhere else.

- Export every validation regular expression as a named constant: one rule, one constant, one place.
- Request validators on the API side and form schemas on the frontend side reference that constant. They never restate the pattern.
- An inline regular expression, or the same pattern written twice, is a defect. Move it here and import it.
- The rule holds for every regular expression of the domain, not only validation ones: a parsing or formatting pattern (e.g. `SOCIAL_SECURITY_NUMBER_PARTS_PATTERN` used to mask a number) is a named constant too, in a `*.patterns.ts` file of `value-objects/`, with a comment saying what it matches.

## Shared rules

A check that several entities, value objects or services repeat is a domain function written once, never a private helper copied per file: `requireText` (filled, trimmed, else `REQUIRED_INFORMATION`) and `requireValid` (else `INVALID_INFORMATION`) in `services/text-rules.ts`. Before writing a check, look there; a new generic one joins that file. A check tied to one concept only stays private to it.

## Forbidden

- Import any other layer (ports, application, adapters, infrastructure).
- Use frameworks, HTTP, DB/ORM, or configuration/environment loaders.
- Declare a port here — skill `ports-location`.

## Dependencies

- Import: Other domain modules, language standard library.
- Never import: Any external hexagonal layer or technical package.
