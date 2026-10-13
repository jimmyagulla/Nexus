import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import type { StatusTone } from "../../../adapters/presenters/display.types"
import { cn } from "../lib/utils"

const tones = {
  info: "bg-blue-200 text-blue-900",
  submitted: "bg-blue-200 text-blue-700",
  neutral: "bg-grey-100 text-grey-800",
  draft: "bg-grey-100 text-grey-900",
  warning: "bg-amber-50 text-amber-800",
  success: "bg-green-100 text-green-700",
  done: "bg-green-200 text-green-900",
  danger: "bg-red-50 text-red-700",
  alert: "bg-orange-50 text-orange-700",
  purple: "bg-purple-50 text-purple-600",
  brand: "bg-orange-500 text-white",
  dark: "bg-grey-950 text-white",
} satisfies Record<StatusTone, string>

/**
 * Status pill of the design system. One tone per meaning:
 * info (new), neutral (seen / draft), warning (pending), success (accepted),
 * done (processed / refunded), danger (refused), alert (to complete),
 * submitted (sent / received).
 */
const badgeVariants = cva(
  "inline-flex shrink-0 items-center whitespace-nowrap rounded-full font-semibold",
  {
    variants: {
      tone: tones,
      size: {
        default: "h-6 px-2.5 text-12",
        sm: "h-5.5 px-2 text-11",
        xs: "h-5 px-2 text-11",
      },
    },
    defaultVariants: {
      tone: "neutral",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, tone, size, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ tone, size }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
