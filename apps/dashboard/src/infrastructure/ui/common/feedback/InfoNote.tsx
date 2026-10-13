import { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface InfoNoteProps {
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
}

/** Grey information block: icon + 13/18 text. */
export function InfoNote({ children, icon, className }: InfoNoteProps) {
  return (
    <div className={cn('flex gap-2.5 rounded-lg bg-grey-50 p-3', className)}>
      {icon ?? (
        <i aria-hidden className="ri-information-line text-18 shrink-0 text-muted-foreground" />
      )}
      <span className="text-13 leading-4.5 text-body">{children}</span>
    </div>
  );
}
