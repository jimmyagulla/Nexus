import { i18n } from '../../i18n/i18n';

interface SortButtonProps {
  /** Current ordering, e.g. "date, récent d'abord". */
  label: string;
}

export function SortButton({ label }: SortButtonProps) {
  return (
    <button
      type="button"
      className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap text-14 font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:shadow-focus"
    >
      <i aria-hidden className="ri-arrow-up-down-line text-14" />
      {`${i18n.messages.common.sortBy} ${label}`}
    </button>
  );
}
