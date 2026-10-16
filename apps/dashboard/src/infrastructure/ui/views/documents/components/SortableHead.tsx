import { ReactNode } from 'react';
import { cn } from '../../../lib/utils';
import { TableHead } from '../../../shared/table';
import type { SortColumnModel, SortState } from '../../../../../adapters/presenters/documents/documents.presenter';

interface SortableHeadProps {
  model: SortColumnModel;
  onSort: () => void;
  children: ReactNode;
}

const ICONS: Record<SortState, string> = {
  neutral: 'ri-arrow-up-down-line text-subtle',
  asc: 'ri-arrow-up-line text-heading',
  desc: 'ri-arrow-down-line text-heading',
};

const ARIA_SORT = { neutral: undefined, asc: 'ascending', desc: 'descending' } as const;

/** Column title preceded by its sort icon: neutral → ascending → descending. */
export function SortableHead({ model, onSort, children }: SortableHeadProps) {
  return (
    <TableHead aria-sort={ARIA_SORT[model.state]}>
      <button
        type="button"
        aria-label={model.label}
        title={model.label}
        onClick={onSort}
        className="flex size-5 shrink-0 items-center justify-center rounded-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:shadow-focus"
      >
        <i aria-hidden className={cn('text-14', ICONS[model.state])} />
      </button>
      {children}
    </TableHead>
  );
}
