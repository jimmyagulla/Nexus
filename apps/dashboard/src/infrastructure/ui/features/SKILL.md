---
name: dashboard-forms
description: >-
  Form and validation rules for dashboard features: react-hook-form, zod
  schemas in a dedicated file, validation patterns imported from the domain. Use
  when creating or editing a form, a validation schema, or a field constraint.
---

# Steering: UI Features (Infrastructure)

## Rules
- **Form Management**: All forms MUST use `react-hook-form` for state management.
- **Validation**: All forms MUST use `zod` for schema definition and validation, integrated with `react-hook-form` via `@hookform/resolvers/zod`.
- **Consistency**: Use `FormControl`, `FormItem`, `FormLabel`, and `FormMessage` from shadcn/ui if available to ensure consistent styling and error messaging.
- **Domain Constraints**: Zod schemas MUST reflect domain constraints (e.g., `amount` must be positive, `date` must be valid).
- **Single source of truth**: A validation pattern (regular expression, bounds, allowed values) MUST be imported from the exported domain constant. Never restate, inline, or copy it here — skill `domain-boundaries`.
- **Separation of Concerns**: Keep the schema definition in a dedicated file named `*.schema.ts` colocated with the component. The form, the view, and the page are three separate files — skill `dashboard-screens`.
