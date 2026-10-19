import { ReactNode } from 'react';

interface FilterGroupProps {
  title: string;
  children: ReactNode;
}

/** Titled section of the filters sheet. */
export function FilterGroup({ title, children }: FilterGroupProps) {
  return (
    <div className="flex flex-col gap-1 border-b border-border px-5 py-2">
      <span className="text-13 font-bold text-foreground">{title}</span>
      {children}
    </div>
  );
}
