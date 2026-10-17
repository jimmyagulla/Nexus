---
name: dashboard-ui
description: >-
  UI layer rules for the dashboard: humble components, controllers and
  presenters by props, screens split into form/view/page. Use when creating or
  editing anything under the UI folder — a route, a page, a view, a component,
  or a hook.
---

# Steering: UI Components (Infrastructure)

## Where a component lives
- `shared/`: the shadcn/ui primitives and the components built the shadcn way on top of them (`calendar.tsx`, `date-picker.tsx`), kebab-case file names.
- `common/<kind>/`: app components shared by several screens or features (`common/forms/FormField.tsx`, `common/errors/FieldError.tsx`). Before creating one, look for an existing one in `common/` and `shared/`.
- `features/<domain>/`: the forms of a domain and the pieces only those forms use.
- `views/<domain>/components/`: the pieces of the screens of a domain that are not part of a form.
- A component used by two domains, or by no domain in particular, never stays in `features/<domain>/` or `views/<domain>/`: it moves to `common/`.

## Rules
- **Humble Objects**: Components must be as simple as possible. No business logic, no complex data transformation.
- **Purely Declarative**: Components should only handle display and routing events.
- **Screens**: every screen is split into at least three files — form, view, page — and every splittable component is split. (See [views/SKILL.md](views/SKILL.md))
- **Dependency**:
    - Use **Controllers** to handle user actions (clicks, submits).
    - Use **Presenters** (or ViewModels prepared by them) for data display.
    - Receive controllers and presenters as props from the composition root; never build them here.
    - May use **Hooks of Liaison** to bridge React with the Application layer.
- **Forbidden**:
    - NO direct calls to Use Cases or API Gateways.
    - NO business logic calculation inside JSX or `useEffect`.
    - NO complex state management that should be in the Domain/Application layer.
