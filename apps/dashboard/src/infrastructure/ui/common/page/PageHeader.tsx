import { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface PageHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  /** `page`: 28/36 list title. `form`: 24/32 title of a form or a detail. */
  size?: 'page' | 'form';
  className?: string;
}

export function PageHeader({
  title,
  description,
  actions,
  size = 'page',
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('flex items-end justify-between gap-4', className)}>
      <div
        className={cn(
          'flex min-w-0 flex-col',
          size === 'page' ? 'gap-1.5' : 'gap-1',
        )}
      >
        <h1
          className={cn(
            'font-bold text-heading',
            size === 'page' ? 'text-28 leading-9' : 'text-24 leading-8',
          )}
        >
          {title}
        </h1>
        {description && (
          <div className="flex items-center gap-1.5 text-14 text-muted-foreground">
            {description}
          </div>
        )}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}
