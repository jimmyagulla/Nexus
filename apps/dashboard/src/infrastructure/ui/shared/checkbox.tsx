"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"

import { cn } from "../lib/utils"

/** Renders the Remix checkbox glyphs of the design (font icons, 18px by default). */
const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "group peer flex shrink-0 rounded-xs text-18 text-disabled focus-visible:outline-none focus-visible:shadow-focus disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:text-primary",
      className
    )}
    {...props}
  >
    <i aria-hidden className="ri-checkbox-blank-line group-data-[state=checked]:hidden" />
    <i aria-hidden className="ri-checkbox-fill hidden group-data-[state=checked]:block" />
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
