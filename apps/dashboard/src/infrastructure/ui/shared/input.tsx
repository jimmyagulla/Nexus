import * as React from "react"

import { cn } from "../lib/utils"

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const inputClassName =
  "flex h-10 w-full rounded-sm border border-input bg-card px-3 text-14 text-foreground placeholder:text-placeholder focus-visible:border-2 focus-visible:border-ring focus-visible:px-2.75 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-border disabled:bg-muted file:border-0 file:bg-transparent file:text-14 file:font-semibold"

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputClassName, className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input, inputClassName }
