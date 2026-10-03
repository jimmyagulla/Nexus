---
name: dashboard-steering
description: Enforces Clean Architecture for the dashboard application.
---

# Dashboard Architecture

This application follows the **Clean Architecture** principles as defined in the global `clean-architecture` skill.

## Layers

1. **Domain**: Pure business rules and entities.
2. **Application**: Use cases and orchestration.
3. **Adapters**: Presenters, Gateways, and Controllers.
4. **Infrastructure**: UI (React), Network (API clients), and Storage.

## Principles

- **Dependencies point inwards**: `UI -> Adapters -> Application -> Domain`.
- **Humble Objects**: UI components must be logic-free.
- **Dependency Injection**: Use ports (interfaces) for external concerns.

For detailed rules, see the `SKILL.md` file in each layer directory.
