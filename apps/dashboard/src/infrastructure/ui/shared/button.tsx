import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg text-14 font-bold transition-colors focus-visible:outline-none focus-visible:shadow-focus disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-blue-900",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-red-500",
        outline:
          "border border-primary bg-card text-primary hover:bg-accent",
        "outline-destructive":
          "border border-destructive bg-card text-destructive hover:bg-red-50",
        "outline-muted":
          "border border-input bg-card text-primary hover:bg-accent",
        secondary: "bg-accent text-primary hover:bg-blue-200",
        ghost: "text-primary hover:bg-accent",
        link: "h-auto rounded-none px-0 text-link font-semibold hover:text-link-hover hover:underline",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-9 px-3",
        xs: "h-8 px-3 text-13",
        lg: "h-11 px-5",
        xl: "h-12 px-5 text-15",
        icon: "size-8 rounded-none",
        "icon-lg": "size-10",
      },
    },
    compoundVariants: [
      { variant: "link", className: "h-auto px-0" },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
