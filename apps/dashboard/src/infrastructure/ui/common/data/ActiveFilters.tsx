import { ReactNode } from 'react';
import { i18n } from '../../i18n/i18n';

interface ActiveFiltersProps {
  /** e.g. "2 résultats sur 7 ·" */
  summary: string;
  /** The applied filters, as FilterChip elements. */
  children: ReactNode;
}

/** Line under a list toolbar: result count, applied filters, "Effacer les filtres". */
export function ActiveFilters({ summary, children }: ActiveFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-13 text-muted-foreground">{summary}</span>
      {children}
      <button
        type="button"
        className="ml-1 text-13 font-semibold text-link hover:text-link-hover hover:underline"
      >
        {i18n.messages.common.clearFilters}
      </button>
    </div>
  );
}
