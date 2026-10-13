import { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface PageContentProps {
  children: ReactNode;
  className?: string;
}

/** Content column of a screen, right of the sidebar and under the top bar. */
export function PageContent({ children, className }: PageContentProps) {
  return (
    <div
      className={cn(
        'flex min-w-0 flex-1 flex-col gap-4 px-4 py-6 md:px-10 md:py-8',
        className,
      )}
    >
      {children}
    </div>
  );
}
