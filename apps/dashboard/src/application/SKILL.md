---
name: no-app-local-use-cases
description: >-
  Marks this app-local application folder as a forbidden home: use cases belong
  to the shared libs. Use before adding or editing any file in this folder.
---

# Use cases are not app-local

Use cases live in the shared libs, so that backend and frontend run the same orchestration. Nothing new belongs here.

## Forbidden

- Add a use case, or any orchestration over domain and ports, to this app.
- Wrap a shared use case in a local class or function that re-exposes it.

Move what is still here to the shared libs and import it. Placement rules: skill `hexagonal-monorepo`. Use-case rules: skill `application-boundaries`.
