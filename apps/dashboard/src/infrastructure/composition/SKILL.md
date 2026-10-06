---
name: dashboard-composition
description: >-
  Composition root of the dashboard: wires controllers, presenters, and
  technical dependencies. Use when creating or editing a composition file or the
  DI entry point, when a component needs a controller or a presenter, or when
  deciding whether a configuration value is passed by the composition or
  resolved by the dependency itself.
---

# Composition Root (Infrastructure)

## Rules

- **Centralization**: All dependency instantiations MUST be centralized in `.composition.ts` files.
- **DI Container**: The `di.ts` file acts as the main entry point for all compositions.
- **No Direct Instantiation**: FORBIDDEN to use `new` in UI components or Adapters for services that should be injected. Use the composition root to wire everything.
- **Consistency**: Export compositions, controllers, and presenters from `di.ts` to be used in routes or pages.
- **Every implementation**: Choosing which implementation of a port is injected is settled here, in-memory implementations included — skill `no-test-doubles`.

## Presenters are wired here, never built by the view

- Presenters are passed to the component as props, exactly like the controller.
- A page or a view never instantiates a presenter and never reaches into the DI entry point to fetch one.

## Canonical configuration values stay inside the dependency

Assembling configuration is normally the composition root's job. One narrow case is the exception: a configuration value that has **a single canonical value for the whole app** is resolved by the dependency that needs it, not passed by the composition.

The archetype is a client that targets a single endpoint: knowing which base location it talks to belongs to the client itself.

- Reason: single source of truth. If every composition file supplied the value, it would be restated once per composition.
- Such a dependency exposes a constructor that does not take that value at all, so no composition can disagree about it.

### How to decide

- The value is the same for every composition of the app → the dependency resolves it itself.
- The value varies per app, per entry point, or per execution context → the composition root injects it.

The second case stays the default: secrets, app-specific environment values, and options that legitimately differ between entry points are assembled and injected by the composition root, as usual.

