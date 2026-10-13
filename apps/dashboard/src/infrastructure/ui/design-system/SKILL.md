---
name: design-system
description: Usage directives for the dashboard design system (My Docs). Enforces consistency by requiring the use of theme tokens over hardcoded values, and maps every colour, shadow, radius and size of the mockups to its Tailwind class.
---

# Design System Directives — My Docs

The reference design lives in `Nexus maquettes/` (Claude Design export, v3 is the current version).

## 1. Source of Truth
- **Design Tokens**: `apps/dashboard/src/infrastructure/ui/design-system/tokens.ts`.
- **CSS Variables**: mirrored in the `@theme` block of `apps/dashboard/src/styles.css` (Tailwind v4).
- The default Tailwind palette is **removed** (`--color-*: initial`): only the colours below exist.
- `tailwind-merge` is extended in `lib/utils.ts` with the custom scales. Add any new scale there too, or `cn()` will drop classes.

## 2. Usage Rules (Mandatory)
- **Shadcn UI**: All UI components MUST use the shadcn/ui components of `infrastructure/ui/shared/` when one fits. Custom components only when no shadcn alternative exists; shared ones go in `infrastructure/ui/common/`.
- **NO Hardcoding**: Never use hex codes, RGB values, or arbitrary pixel values (`p-[7px]`) in components. Every value of the mockups has a class (see §5). The only tolerated arbitrary values are structural: `grid-cols-[…]` templates and `calc()` bounds.
- **Tailwind Theme**: Prefer semantic classes (`text-heading`, `bg-primary`, `border-border`) over palette classes when the meaning matches.
- **Icons**: Remix Icon **webfont** (`remixicon/fonts/remixicon.css`, loaded in `main.tsx`), exactly like the mockups: `<i aria-hidden className="ri-file-paper-2-line text-20 text-primary" />`. Size with `text-N`, colour with a text colour. An icon without size inherits its parent font-size. Do not use SVG icon components: the font's line box (~1.1 × size) is what the layouts are measured with.
- **Interactive States**: Always include hover and focus states (`focus-visible:shadow-focus`).

## 3. Typography
- `font-sans` (Inter) for all text; `font-display` (Poppins) for the product name only.
- The page line-height is `normal`, like the mockups. Only add `leading-*` when the mockup sets a `line-height` (`line-height: 18px` → `leading-4.5`).
- Font sizes: `text-10` … `text-32` (the number is the size in px).

## 4. Spacing & sizes
Tailwind v4 spacing is `n × 4px`, fractions allowed: `7px` → `1.75`, `10px` → `2.5`, `18px` → `4.5`, `38px` → `9.5`, `300px` → `75`, `520px` → `130`.

## 5. Mockup → class mapping

### Colours (`bg-*`, `text-*`, `border-*`)
| Hex | Palette | Semantic |
| :-- | :-- | :-- |
| `#FFFFFF` | `white` | `card`, `popover` |
| `#F5F7F9` | `grey-50` | `background`, `muted` |
| `#EEF0F4` | `grey-100` | |
| `#DDE2EB` | `grey-200` | `border` |
| `#C5CDDD` | `grey-300` | |
| `#AEB9CF` | `grey-400` | `input` (field borders) |
| `#96A4C1` | `grey-500` | `disabled` |
| `#7E8FB3` | `grey-600` | `placeholder` |
| `#6A7896` | `grey-700` | `subtle` |
| `#57617A` | `grey-800` | `muted-foreground` |
| `#434B5D` | `grey-900` | `body` |
| `#303441` | `grey-950` | `foreground` |
| `#FAFCFF` | `blue-25` | |
| `#F7F9FF` | `blue-50` | |
| `#EEF4FF` | `blue-100` | `accent`, `secondary` |
| `#DCE4FD` | `blue-200` | |
| `#B9C7FB` | `blue-300` | |
| `#96ACF9` | `blue-400` | |
| `#3D64ED` | `blue-500` | `link`, `ring` |
| `#324CAB` | `blue-600` | `link-hover` |
| `#304287` | `blue-700` | `primary` |
| `#2E3862` | `blue-900` | `heading` |
| `#FFF2ED` `#FFBEA8` `#FA420F` `#C62E08` `#7E2210` | `orange-50/200/500/700/900` | `brand` = 500 |
| `#FFF4D5` `#FED173` `#FB9814` `#9B4911` | `amber-50/300/500/800` | |
| `#F2FBF9` `#D2F5EE` `#A6E9DE` `#64D3C5` `#2BA198` `#1D6864` `#1B4644` | `green-25/100/200/300/500/700/900` | |
| `#FFE2E4` `#ED1136` `#C8082D` | `red-50/500/700` | `destructive` = 700 |
| `#F4F0FF` `#E8E2FE` `#E0D5FF` `#C8B4FE` `#691FC1` `#4D198A` | `purple-25/50/100/200/600/800` | |
| `#1F2129` `#191E25` | `ink-800/900` | |
| `#1C1D24` at 32 % | | `overlay/32` |
| `rgba(255,255,255,.14)` | `white/14` | |

### Shadows
| Mockup | Class |
| :-- | :-- |
| `0 8px 24px rgba(25,30,37,.08 / .12 / .14 / .16)` | `shadow-popover-soft` / `shadow-popover` / `shadow-popover-md` / `shadow-popover-strong` |
| `0 12px 32px rgba(25,30,37,.18)` | `shadow-panel` |
| `inset 3px 0 0 #FA420F` | `shadow-active-left` |
| `inset 0 -3px 0 #FA420F` | `shadow-tab-active` |
| `0 0 0 4px #DCE4FD` | `shadow-focus` |

### Radius
`2px` `rounded-xs` · `3px` `rounded-3` · `4px` `rounded-sm` · `6px` `rounded-md` · `8px` `rounded-lg` · `10px` `rounded-10` · `12px` `rounded-xl` · `14px` `rounded-14` · `50%`, `999px` or half the height → `rounded-full`.

## 6. Building blocks
- `shared/`: shadcn components restyled to the design (button, badge, card, dialog, sheet, table, input, textarea, select, checkbox, radio-group, toggle-group, tabs, popover, dropdown-menu, avatar, separator, input-otp, progress, toast).
- `Badge` `tone` = status meaning: `info` new · `submitted` sent/received · `neutral` seen · `draft` draft/cancelled · `warning` pending · `success` accepted · `done` processed/refunded · `danger` refused · `alert` to complete. `size`: `default` 24px, `sm` 22px, `xs` 20px.
- `common/`: app shell (`layout/`), `PageContent`, `PageHeader`, `IconTile` (flow colour code), list toolbar pieces (`SearchField`, `FilterButton`, `SortButton`, `FilterChip`, `ActiveFilters`, `RowAction`), form pieces (`FormField`, `AdornedInput`, `FileDropzone`, `UploadedFile`), feedback (`InfoNote`, `ConfirmationCard`, `SummaryList`, `SummaryRow`, `StepProgress`).

If you find yourself needing a value not defined in the tokens, add it to `tokens.ts` and `styles.css` (and `lib/utils.ts` for a new scale) instead of bypassing the system.
