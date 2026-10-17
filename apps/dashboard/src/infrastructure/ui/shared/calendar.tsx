"use client"

import * as React from "react"
import { DayPicker, getDefaultClassNames } from "react-day-picker"
import { fr } from "react-day-picker/locale"

import { cn } from "../lib/utils"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

/** shadcn/ui calendar (react-day-picker 9), restyled to the design system. */
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const defaults = getDefaultClassNames()

  return (
    <DayPicker
      locale={fr}
      showOutsideDays={showOutsideDays}
      className={cn("p-3 text-14 text-foreground", className)}
      classNames={{
        root: cn("w-fit", defaults.root),
        months: "relative flex flex-col gap-4",
        month: "flex flex-col gap-3",
        nav: "absolute inset-x-0 top-0 flex items-center justify-between",
        button_previous:
          "flex size-8 cursor-pointer items-center justify-center rounded-lg text-primary transition-colors hover:bg-accent focus-visible:outline-none focus-visible:shadow-focus disabled:cursor-default disabled:opacity-50",
        button_next:
          "flex size-8 cursor-pointer items-center justify-center rounded-lg text-primary transition-colors hover:bg-accent focus-visible:outline-none focus-visible:shadow-focus disabled:cursor-default disabled:opacity-50",
        month_caption: "flex h-8 items-center justify-center",
        caption_label: "text-14 font-bold capitalize text-heading",
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday: "w-9 text-12 font-semibold capitalize text-subtle",
        week: "mt-1 flex w-full",
        day: "relative size-9 p-0 text-center",
        day_button:
          "flex size-9 cursor-pointer items-center justify-center rounded-lg text-14 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:shadow-focus",
        selected:
          "[&>button]:bg-primary [&>button]:font-semibold [&>button]:text-white [&>button]:hover:bg-primary",
        today: "[&>button]:font-bold [&>button]:text-link",
        outside: "text-disabled",
        disabled: "text-disabled opacity-50",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) => (
          <i
            aria-hidden
            className={cn(
              "text-18",
              orientation === "left" ? "ri-arrow-left-s-line" : "ri-arrow-right-s-line"
            )}
          />
        ),
      }}
      {...props}
    />
  )
}

export { Calendar }
