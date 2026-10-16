import { i18n } from '../../i18n/i18n';

interface FilterChipProps {
  label: string;
  value: string;
  onRemove?: () => void;
}

/** Applied filter shown as a removable badge: "Catégorie : Avenants ×". */
export function FilterChip({ label, value, onRemove }: FilterChipProps) {
  return (
    <span className="inline-flex h-7 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-blue-300 bg-accent pl-2.5 pr-1.5 text-13 text-heading">
      <span className="text-muted-foreground">{`${label} :`}</span>
      <b className="font-bold">{value}</b>
      <button
        type="button"
        aria-label={`${i18n.messages.common.removeFilter} ${label}`}
        onClick={onRemove}
        className="text-primary focus-visible:outline-none focus-visible:shadow-focus"
      >
        <i aria-hidden className="ri-close-line text-16" />
      </button>
    </span>
  );
}
