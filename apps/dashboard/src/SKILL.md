---
name: dashboard-steering
description: >-
  Clean Architecture for the dashboard application: which layers it owns and
  which it consumes from the shared libs. Use when creating a folder or a file
  anywhere under this app, or when deciding whether a piece of code belongs to
  this app or to the shared core.
---

# Dashboard Architecture

This application follows the **Clean Architecture** principles as defined in the global `clean-architecture` skill.

## What this app owns

| Layer                 | Home                                 |
| :-------------------- | :----------------------------------- |
| Domain                | Shared libs                          |
| Use cases             | Shared libs                          |
| Ports                 | Shared libs — skill `ports-location` |
| App-agnostic adapters | Shared libs                          |
| App-specific adapters | This app                             |
| Infrastructure        | This app                             |

This app consumes the shared core and never redefines it. It holds only its own adapters (presenters, controllers, out adapters) and its infrastructure (UI, router, technical clients, composition). Placement rules: skill `hexagonal-monorepo`.

## Principles

- **Dependencies point inwards**: `UI -> Adapters -> Application -> Domain`.
- **Humble Objects**: UI components must be logic-free.
- **Dependency Injection**: Use ports (interfaces) for external concerns.
- **One entity, one domain**: the frontend split follows the domain split — skill `domain-aligned-modules`.

For detailed rules, see the `SKILL.md` file in each layer directory.
