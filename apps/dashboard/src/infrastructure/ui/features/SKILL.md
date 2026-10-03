# Steering: UI Features (Infrastructure)

## Rules
- **Form Management**: All forms MUST use `react-hook-form` for state management.
- **Validation**: All forms MUST use `zod` for schema definition and validation, integrated with `react-hook-form` via `@hookform/resolvers/zod`.
- **Consistency**: Use `FormControl`, `FormItem`, `FormLabel`, and `FormMessage` from shadcn/ui if available to ensure consistent styling and error messaging.
- **Domain Constraints**: Zod schemas MUST reflect domain constraints (e.g., `amount` must be positive, `date` must be valid).
- **Separation of Concerns**: Keep the schema definition in a dedicated file named `*.schema.ts` colocated with the component.
