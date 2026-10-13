import { ReactNode } from 'react';

interface RowActionProps {
  label: string;
  icon: ReactNode;
}

/** 32px icon button of a table "Actions" cell (eye, download, more). */
export function RowAction({ label, icon }: RowActionProps) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex size-8 items-center justify-center rounded-lg text-primary transition-colors hover:bg-accent focus-visible:outline-none focus-visible:shadow-focus [&_i]:text-18"
    >
      {icon}
    </button>
  );
}
