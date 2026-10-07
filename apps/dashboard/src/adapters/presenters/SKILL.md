---
name: dashboard-presenters
description: >-
  Required shape of a presenter: a class exposing a public present method that
  returns an explicitly typed view model. Use when creating or editing a
  presenter, or when formatting use-case output for display.
---

# Steering: Presenters (Adapters)

## Shape (mandatory)

- A presenter is a **class**. It exposes at least one public method named `present`.
- `present` returns a view model whose type is declared explicitly, never left to inference.
- Formatting and display calculations live in **private** methods of that class.
- Never a free function, an object literal, or a hook.

## Rules
- **Format data for the View.** Take output from Use Cases and transform it into simple types/strings for the UI.
- **Humble Objects support**: Keep logic out of React components by moving formatting here.
- May depend on the shared `application` layer (for output data structures) and `domain`.
- **Forbidden**: NO React imports, NO side effects (API calls, storage), NO business logic.

Presenters are instantiated and handed to components by the composition root — skill `dashboard-composition`.
