---
name: dashboard-screens
description: >-
  Splits every screen into a form file, a view file, and a page file, and
  requires extracting any component that can be extracted. Use when creating or
  editing a screen, a page, a view, a layout, or a repeated list item.
---

# UI Views and Pages (Infrastructure/UI)

## Three files per screen (minimum)

Every screen is split into at least three distinct files, however small the screen is.

1. **Form** — the form and its validation schema, in their own files colocated with the screen. Rules: skill `dashboard-forms`.
2. **View** (`*.tsx`) — the JSX layout and nothing else.
   *   Receives everything by props: data, callbacks, controllers, presenters.
   *   Expects data to be present and valid (Happy Path). No loading spinner, no fetch error message.
   *   No hook that fetches, no instantiation, no formatting decision.
   *   Easily testable in isolation or via Storybook.
3. **Page** (`*Page.tsx`) — the entry point declared in the router.
   *   Calls the hooks that fetch the data it needs, then renders the view.
   *   MUST handle **Loading**, **Error**, and **Empty** states, and pass only Happy Path data to the view.
   *   No layout markup of its own: the JSX belongs to the view.

Controllers and presenters arrive as props from the composition root — skill `dashboard-composition`.

## Split every component that can be split

- A container and its repeated element are two components, in two files.
- A view that renders a collection renders one child component per item. It never inlines the item markup.
- Extract as soon as a block is repeatable, reusable, or nameable on its own. Do not wait for it to grow.
