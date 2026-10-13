import { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface SummaryListProps {
  children: ReactNode;
  className?: string;
}

/** Grey recap block of the confirmation cards; holds SummaryRow items. */
export function SummaryList({ children, className }: SummaryListProps) {
  return (
    <dl
      className={cn(
        'flex flex-col gap-2.5 rounded-lg bg-grey-50 p-4 text-14',
        className,
      )}
    >
      {children}
    </dl>
  );
}
