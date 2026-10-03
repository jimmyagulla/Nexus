---
name: app-interfaces
description: >-
  Interaction rules for dashboard UI: action buttons open forms in a
  shadcn Dialog. Use when adding or changing buttons, forms, modals, views, or
  layouts under apps/dashboard/src/infrastructure/ui.
---

# App interfaces

Lorsque je clique sur un bouton d'action, comme "Ajouter une transaction" ou "Ajouter un compte", le formulaire doit apparaître dans une modal.

## Create / add actions

- Action buttons that start a create/add flow MUST open the related form inside a shadcn `Dialog` from `infrastructure/ui/shared/dialog.tsx`.
- Do not toggle the form inline on the page.
- Compose with `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, and `DialogTitle`. Place the feature form in `DialogContent`.
- Close the modal after a successful submit.
- Submit buttons on a form that is already visible (for example contributing to a goal) stay on the form. They are not action buttons.

## Review

Fail review if a create/add action button reveals a form outside a `Dialog`.
