# Steering: Presenters (Adapters)

## Rules
- **Format data for the View.** Take output from Use Cases and transform it into simple types/strings for the UI.
- **Humble Objects support**: Keep logic out of React components by moving formatting here.
- **Folder**: A presenter lives in a domain subfolder. No presenter file at the root of `presenters/`.
- **Shape**: A presenter is a class. The public method is `present`. It accepts domain or application output and returns a view model or a display string. Extra formatting is a private method on that class. Do not export a formatting function in place of the class.
- May depend on `application` (for output data structures) and `domain`.
- **Forbidden**: NO React imports, NO side effects (API calls, storage), NO business logic.
