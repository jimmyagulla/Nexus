import { Badge } from '../../../shared/badge';
import { TableCell, TableRow } from '../../../shared/table';
import { cn } from '../../../lib/utils';
import type { ExpenseReportRowModel } from '../../../../../adapters/presenters/expense-reports/expense-report-row.presenter';

interface ExpenseReportRowProps {
  model: ExpenseReportRowModel;
  highlighted: boolean;
  onOpen: () => void;
}

/** A report of the list. Its name, like its chevron, opens its detail. */
export function ExpenseReportRow({ model, highlighted, onOpen }: ExpenseReportRowProps) {
  return (
    <TableRow
      className={cn(
        'gap-4 border-b px-5 last:border-b',
        highlighted ? 'bg-blue-50' : 'bg-card',
      )}
    >
      <TableCell className="flex items-center gap-3">
        <i aria-hidden className={`${model.icon} shrink-0 text-20 text-amber-800`} />
        <button
          type="button"
          onClick={onOpen}
          className="min-w-0 truncate text-left font-semibold text-foreground hover:text-link hover:underline focus-visible:outline-none focus-visible:shadow-focus"
        >
          <span>{model.name}</span>
        </button>
      </TableCell>
      <TableCell className="text-muted-foreground">{model.date}</TableCell>
      <TableCell className="truncate text-muted-foreground">{model.category}</TableCell>
      <TableCell className="truncate text-muted-foreground">{model.project}</TableCell>
      <TableCell className="font-bold">{model.amount}</TableCell>
      <TableCell>
        <Badge tone={model.status.tone}>{model.status.label}</Badge>
      </TableCell>
      <TableCell>
        <i
          role="img"
          aria-label={model.proof.label}
          title={model.proof.label}
          className={cn(
            'text-16',
            model.proof.attached ? 'ri-attachment-2 text-link' : 'ri-subtract-line text-disabled',
          )}
        />
      </TableCell>
      <button
        type="button"
        aria-label={model.name}
        onClick={onOpen}
        className="flex text-disabled hover:text-primary focus-visible:outline-none focus-visible:shadow-focus"
      >
        <i aria-hidden className="ri-arrow-right-s-line text-18" />
      </button>
    </TableRow>
  );
}
