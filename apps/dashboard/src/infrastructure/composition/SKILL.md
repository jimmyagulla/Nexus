# Composition Root (Infrastructure)

## Rules

- **Centralization**: All dependency instantiations MUST be centralized in `.composition.ts` files.
- **DI Container**: The `di.ts` file acts as the main entry point for all compositions.
- **No Direct Instantiation**: FORBIDDEN to use `new` in UI components or Adapters for services that should be injected. Use the composition root to wire everything.
- **Consistency**: Export compositions, controllers, and presenters from `di.ts` to be used in routes or pages.
