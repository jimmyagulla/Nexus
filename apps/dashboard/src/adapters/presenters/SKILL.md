# Steering: Presenters (Adapters)

## Rules
- **Format data for the View.** Take output from Use Cases and transform it into simple types/strings for the UI.
- **Humble Objects support**: Keep logic out of React components by moving formatting here.
- May depend on `application` (for output data structures) and `domain`.
- **Forbidden**: NO React imports, NO side effects (API calls, storage), NO business logic.
