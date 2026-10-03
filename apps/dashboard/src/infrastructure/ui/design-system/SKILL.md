---
name: design-system
description: Usage directives for the Nexus design system. Enforces consistency by requiring the use of theme tokens over hardcoded values.
---

# Design System Directives

This application follows a strict design system to ensure visual consistency and maintainability.

## 1. Source of Truth
- **Design Tokens**: The source of truth for all values (colors, spacing, radius) is `apps/dashboard/src/infrastructure/ui/design-system/tokens.ts`.
- **CSS Variables**: These tokens are mapped to CSS variables in `apps/dashboard/src/styles.css`.

## 2. Usage Rules (Mandatory)
- **Shadcn UI**: All UI components MUST use shadcn/ui if available. Custom components should only be created when no shadcn alternative exists.
- **NO Hardcoding**: Never use hex codes, RGB values, or arbitrary pixel values in components.
- **Tailwind Theme**: Always use Tailwind semantic classes that refer to the theme (e.g., `text-primary`, `bg-background`, `border-border`).
- **Standardized Spacing**: Use Tailwind's spacing scale (e.g., `p-4`, `gap-6`) to maintain vertical and horizontal rhythm.
- **Component Consistency**: Before creating a new UI element, check if it should be a shared component in `infrastructure/ui/common/`.

## 3. Visual Language
- **Hierarchy**: Use `text-primary` for main content and `text-muted` for secondary information.
- **Feedback**: Use semantic colors (`success`, `error`, `warning`) only for their respective meanings (e.g., green for revenue, red for debt/spending).
- **Interactive States**: Always include hover and active states using theme-consistent transitions.

## 4. Typography
- Use `font-sans` for all text.
- Use semibold/bold weights only for emphasis or headings to keep the interface light.

If you find yourself needing a value not defined in the tokens, request an update to the `tokens.ts` file instead of bypassing the system.
