---
name: no-app-local-domain
description: >-
  Marks this app-local domain folder as a forbidden home: domain classes and
  port contracts belong to the shared libs. Use before adding or editing any
  file in this folder.
---

# Domain is not app-local

Entities, value objects, domain services, and business constants live in the shared libs, so that every app relies on the same source of truth. Nothing new belongs here.

## Forbidden

- Add a domain class, a value object, a domain service, or a business constant to this app.
- Declare a port here, under any name or suffix — skill `ports-location`.

Move what is still here to the shared libs and import it. Placement rules: skill `hexagonal-monorepo`. Domain content rules: skill `domain-boundaries`.
