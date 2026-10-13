import * as React from "react"

import { cn } from "../lib/utils"

/**
 * The design lays tables out as CSS grids: every row of a table shares the
 * same `grid-template-columns`, passed once to `Table` through `columns`.
 */
const Table = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { columns: string }
>(({ className, columns, style, ...props }, ref) => (
  <div
    ref={ref}
    role="table"
    className={cn("rounded-lg border border-border bg-card", className)}
    style={{ ...style, "--table-columns": columns } as React.CSSProperties}
    {...props}
  />
))
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    role="row"
    className={cn(
      "grid grid-cols-(--table-columns) gap-3 border-b border-border px-4 py-3 text-13 font-semibold text-muted-foreground",
      className
    )}
    {...props}
  />
))
TableHeader.displayName = "TableHeader"

const TableRow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    role="row"
    className={cn(
      "grid grid-cols-(--table-columns) items-center gap-3 border-b border-border px-4 py-3 text-14 last:border-b-0",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    role="columnheader"
    className={cn("flex items-center gap-1", className)}
    {...props}
  />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    role="cell"
    className={cn("min-w-0", className)}
    {...props}
  />
))
TableCell.displayName = "TableCell"

export { Table, TableHeader, TableRow, TableHead, TableCell }
