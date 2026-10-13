import * as React from "react"

import { cn } from "../lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-18 w-full resize-none rounded-sm border border-input bg-card px-3 py-2.5 text-14 text-foreground placeholder:text-placeholder focus-visible:border-2 focus-visible:border-ring focus-visible:px-2.75 focus-visible:py-2.25 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
