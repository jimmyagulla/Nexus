import { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react';

interface RowActionProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  icon: ReactNode;
}

/** 32px icon button of a table "Actions" cell. Usable as a menu trigger child. */
export const RowAction = forwardRef<HTMLButtonElement, RowActionProps>(
  ({ label, icon, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      className="flex size-8 items-center justify-center rounded-lg text-primary transition-colors hover:bg-accent focus-visible:outline-none focus-visible:shadow-focus data-[state=open]:bg-accent [&_i]:text-18"
      {...props}
    >
      {icon}
    </button>
  ),
);
RowAction.displayName = 'RowAction';
