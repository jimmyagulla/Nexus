import { forwardRef, ButtonHTMLAttributes } from 'react';
import { i18n } from '../../i18n/i18n';

interface SortButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Current ordering, e.g. "date, récent d'abord". */
  label: string;
}

/** "Trier : …" toggle of the list toolbars. Usable as a menu trigger child. */
export const SortButton = forwardRef<HTMLButtonElement, SortButtonProps>(
  ({ label, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap text-14 font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:shadow-focus"
      {...props}
    >
      <i aria-hidden className="ri-arrow-up-down-line text-14" />
      {`${i18n.messages.common.sortBy} ${label}`}
    </button>
  ),
);
SortButton.displayName = 'SortButton';
