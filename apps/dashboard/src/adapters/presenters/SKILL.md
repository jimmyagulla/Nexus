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
- **One presenter per view model (mandatory)**: every view model — the screen model, each sub-model (a row, a card, a filter panel, a sort header) and each formatted value shared by several presenters (a file size, a count label) — has its own file `<model>.presenter.ts`, declaring the model and the class that presents it. A presenter has one responsibility and stays short: a file of several hundred lines, or formatting several models, is a defect.
- **Parent presenter**: `<screen>.presenter.ts` declares `<Screen>ViewModel` and the class `<Screen>Presenter` whose `present(): <Screen>ViewModel` assembles the output of its child presenters. It builds its children itself (they are parts of it, from the same folder, not injected services), keeps none of their formatting, and re-exports their model types so that views import from one place. It may expose a one-line delegating method for a child model the view needs at render time (`presentFile` → `UploadedFilePresenter`).
- Constants shared by the presenters of one domain (icons, display orders, tones) live in `<domain>/<domain>-display.ts`.
- A sub-model shared by several screens is declared in one presenter file and imported by the others. Views and fixtures import view-model types from the presenter files; they never declare them.
- Types that only the UI uses (static lists built by a view, legend tones…) stay in their component.
- The display vocabulary shared by all view models (status tones, flow tones, progress steps, navigation targets) lives in `display.types.ts`. View models never import UI types.

## No constructor input
- A presenter has no constructor parameters: everything it formats is passed to `present(…)`, e.g. `present(goal: Goal, asOf: Date)`.
- Until a screen's use case exists, its query hook passes a fixture of `infrastructure/ui/fixtures/` (already shaped as the view model) to `present`, which returns it as is. When the use case lands, `present` takes the use-case output and maps it; the view does not change.

Presenters are instantiated and handed to components by the composition root — skill `dashboard-composition`.
