"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"

import { cn } from "../lib/utils"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-overlay/32 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-1/2 top-1/2 z-50 flex w-130 max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col rounded-lg bg-card shadow-popover-strong duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        className
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

/**
 * Field of a modal body that takes the focus on opening: the chosen option of
 * the first choice, else the first control.
 */
function firstBodyField(content: HTMLElement | null): HTMLElement | null {
  return (
    content?.querySelector<HTMLElement>(
      "[data-modal-body] [role='radio'][data-state='checked']:not([disabled])"
    ) ??
    content?.querySelector<HTMLElement>(
      "[data-modal-body] :is(input, textarea, select, button):not([disabled]):not([tabindex='-1'])"
    ) ??
    null
  )
}

/**
 * Modal window of the app: the page behind is dimmed and lightly blurred, the
 * first field takes the focus, and a click outside never closes it, so that
 * no input is lost by mistake. Escape and the explicit close actions do.
 * Compose it with DialogHeader, ModalBody and DialogFooter: only the header
 * and the body are padded, the footer divider runs edge to edge.
 */
const ModalContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, onInteractOutside, onOpenAutoFocus, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay className="backdrop-blur-xs" />
    <DialogPrimitive.Content
      ref={ref}
      onInteractOutside={(event) => {
        event.preventDefault()
        onInteractOutside?.(event)
      }}
      onOpenAutoFocus={(event) => {
        onOpenAutoFocus?.(event)
        const first = firstBodyField(event.target as HTMLElement | null)
        if (!event.defaultPrevented && first) {
          event.preventDefault()
          first.focus()
        }
      }}
      className={cn(
        "fixed left-1/2 top-1/2 z-50 flex max-h-[calc(100%-2rem)] max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-xl bg-card shadow-popover-strong duration-200 focus-visible:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        className
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPortal>
))
ModalContent.displayName = "ModalContent"

const DialogHeader = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex items-center justify-between gap-4 border-b border-border px-6 py-5",
      className
    )}
    {...props}
  >
    {children}
    <DialogPrimitive.Close className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:shadow-focus">
      <i aria-hidden className="ri-close-line text-20" />
      <span className="sr-only">Fermer</span>
    </DialogPrimitive.Close>
  </div>
)
DialogHeader.displayName = "DialogHeader"

const DialogBody = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col gap-3.5 px-6 py-5", className)}
    {...props}
  />
)
DialogBody.displayName = "DialogBody"

/** Scrolling middle part of a modal, between its header and its footer. */
const ModalBody = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    data-modal-body=""
    className={cn("min-h-0 flex-1 overflow-y-auto", className)}
    {...props}
  />
)
ModalBody.displayName = "ModalBody"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex justify-end gap-3 border-t border-border px-6 py-4",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-18 font-bold text-heading", className)}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-14 leading-5 text-body", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  ModalContent,
  ModalBody,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
