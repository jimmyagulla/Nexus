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

## Layout
- One folder per domain: `adapters/presenters/<domain>/`.
- **One presenter per view model**: `<screen>.presenter.ts` declares the screen's `<Screen>ViewModel`, the sub-models it is made of (rows, items, cards), and the class `<Screen>Presenter` whose `present(): <Screen>ViewModel` produces it.
- A sub-model shared by several screens is declared in one presenter file and imported by the others. Views and fixtures import view-model types from the presenter files; they never declare them.
- Types that only the UI uses (static lists built by a view, legend tones…) stay in their component.
- The display vocabulary shared by all view models (status tones, flow tones, progress steps, navigation targets) lives in `display.types.ts`. View models never import UI types.

## Placeholder presenters
Until a screen's use case exists, its presenter receives a placeholder view model through its constructor (a fixture of `infrastructure/ui/fixtures/`, wired by the composition root) and returns it as is. When the use case lands, `present` takes its output and maps it; the view and the page do not change.

Presenters are instantiated and handed to components by the composition root — skill `dashboard-composition`.
