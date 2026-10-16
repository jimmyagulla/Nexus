import { ReactNode } from 'react';
import { TableHead } from '../../../shared/table';

interface SortableHeadProps {
  /** The list is ordered by this column (always descending). */
  sorted: boolean;
  children: ReactNode;
}

/** Column title carrying the descending arrow while the list is ordered by it. */
export function SortableHead({ sorted, children }: SortableHeadProps) {
  return (
    <TableHead aria-sort={sorted ? 'descending' : undefined}>
      {children}
      {sorted && <i aria-hidden className="ri-arrow-down-s-line text-heading" />}
    </TableHead>
  );
}
