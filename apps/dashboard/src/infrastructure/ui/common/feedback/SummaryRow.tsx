import { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface SummaryRowProps {
  label: ReactNode;
  value: ReactNode;
  className?: string;
}

/** "Label ........ value" line of a recap. */
export function SummaryRow({ label, value, className }: SummaryRowProps) {
  return (
    <div className={cn('flex items-center justify-between gap-4', className)}>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-semibold">{value}</dd>
    </div>
  );
}
