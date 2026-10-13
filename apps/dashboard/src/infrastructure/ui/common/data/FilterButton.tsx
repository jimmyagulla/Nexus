import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';
import { i18n } from '../../i18n/i18n';

interface FilterButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Number of applied filters; the button is highlighted when above zero. */
  count?: number;
}

/** "Filtres" toggle of the list toolbars. Usable as a SheetTrigger child. */
export const FilterButton = forwardRef<HTMLButtonElement, FilterButtonProps>(
  ({ count = 0, className, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cn(
        'inline-flex h-9 shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-3 text-14 font-bold text-primary transition-colors focus-visible:outline-none focus-visible:shadow-focus',
        count > 0
          ? 'border-2 border-ring bg-accent'
          : 'border border-input bg-card hover:bg-accent',
        className,
      )}
      {...props}
    >
      <i aria-hidden className="ri-filter-3-line text-18" />
      {i18n.messages.common.filters}
      {count > 0 && (
        <span className="inline-flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-primary px-1.25 text-11 font-bold text-white">
          {count}
        </span>
      )}
    </button>
  ),
);
FilterButton.displayName = 'FilterButton';
