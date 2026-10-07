---
name: ports-location
description: >-
  Imposes a single home for ports: the dedicated ports folder of the shared
  libs. Use when creating, moving, or naming a port, an interface for an
  external dependency, or a repository/gateway contract, and whenever a file
  inside an app is about to declare such an interface.
---

# Port location

Every port lives in the dedicated `ports` folder of the shared libs. There is no second location.

## Invariant

- A port is a contract owned by the shared core, never by a delivery shell.
- An app may **implement** a port and **inject** it. An app may never **declare** one.
- Backend and frontend consume the same port object. One contract, one definition.

## Forbidden

- Declare a port inside an app, at any depth, under any name or suffix.
- Declare a port in a `domain` folder. Domain holds entities, value objects, and domain services.
- Keep a port next to the adapter that implements it, or next to the use case that consumes it.
- Duplicate a port per app so that each app owns "its" variant of the contract.

## When an app needs a new outside dependency

1. Create or extend the port in the shared `ports` folder.
2. Implement it in an adapter: in the shared libs when the adapter is app-agnostic, in the app when it is app-specific.
3. Bind the implementation to the port in that app's composition root, and only there.

Contract shape, method surface, and naming: skill `ports-boundaries`.
Which code belongs to the shared libs: skill `hexagonal-monorepo`.
