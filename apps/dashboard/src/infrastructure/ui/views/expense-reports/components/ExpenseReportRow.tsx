import { Badge } from '../../../shared/badge';
import { TableCell, TableRow } from '../../../shared/table';
import { cn } from '../../../lib/utils';
import type { ExpenseReportRowModel } from '../../../../../adapters/presenters/expense-reports/expense-reports.presenter';

export function ExpenseReportRow({ report }: { report: ExpenseReportRowModel }) {
  return (
    <TableRow
      className={cn(
        'gap-4 border-b px-5 last:border-b',
        report.highlighted ? 'bg-blue-50' : 'bg-card',
      )}
    >
      <TableCell className="flex items-center gap-3 font-semibold text-foreground">
        <i aria-hidden className="ri-receipt-line text-20 text-amber-800" />
        <span>{report.title}</span>
      </TableCell>
      <TableCell className="text-muted-foreground">{report.period}</TableCell>
      <TableCell className="text-muted-foreground">{report.expenseCount}</TableCell>
      <TableCell className="text-right font-bold">{report.total}</TableCell>
      <TableCell>
        <Badge tone={report.status.tone}>{report.status.label}</Badge>
      </TableCell>
      <i aria-hidden className="ri-arrow-right-s-line text-18 text-disabled" />
    </TableRow>
  );
}
