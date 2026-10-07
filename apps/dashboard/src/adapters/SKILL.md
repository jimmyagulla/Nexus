---
name: dashboard-adapters
description: >-
  Adapter boundaries for the dashboard: out adapters, presenters, controllers.
  Use when creating or editing an out adapter, a presenter, or a controller in
  this app.
---

# Steering: Interface Adapters

## Rules
- **Out adapters**: data access implementations, one per domain entity. (See [gateways/SKILL.md](gateways/SKILL.md))
- **Presenters**: classes that format data for the View. (See [presenters/SKILL.md](presenters/SKILL.md))
- **Controllers**: Thin mapping of UI events to Use Cases. (See [controllers/SKILL.md](controllers/SKILL.md))
- May depend on the shared `application` and `domain` layers.
- Adapters here are app-specific by definition. An adapter that does not depend on this app's delivery model belongs to the shared libs — skill `hexagonal-monorepo`.
- **Forbidden**: Direct dependencies on specific UI components or framework-heavy `infrastructure`.
- **Forbidden**: Declare a port here — skill `ports-location`.
