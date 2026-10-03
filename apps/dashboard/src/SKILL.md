---
name: nexus-dashboard
description: Enforces Clean Architecture for the Nexus dashboard.
---

# Nexus dashboard

This application follows Clean Architecture. Pure TypeScript use cases, ports, domain, and pure TypeScript adapters live in `libs/`. This app keeps only what is specific to it.

## Stays in this app

- Controllers
- Presenters
- View models
- Routing
- HTTP-specific code
- UI-specific code
- Configuration and wiring
- Gateways specific to this application

## Layers in this app

1. **Adapters**: presenters, gateways, and controllers.
2. **Infrastructure**: UI (React), composition, and framework config.

## Principles

- Dependencies point inwards: UI → adapters → application (`libs`) → domain (`libs`).
- UI components are humble objects.
- Inject ports for external concerns.

For detailed rules, see the `SKILL.md` file in each layer directory.
