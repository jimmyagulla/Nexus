import { i18n } from '../../../i18n/i18n';
import { cn } from '../../../lib/utils';
import { TableCell, TableRow } from '../../../shared/table';
import type { ExpenseRowModel } from '../../../../../adapters/presenters/expense-reports/expense-report.presenter';

export function ExpenseRow({ expense }: { expense: ExpenseRowModel }) {
  return (
    <TableRow className="gap-3.5 border-b px-5 last:border-b">
      <TableCell className="text-muted-foreground">{expense.date}</TableCell>
      <TableCell className="flex items-center gap-2 font-semibold">
        <i
          aria-hidden
          className={cn(expense.categoryIcon, 'text-18 text-amber-800')}
        />
        <span>{expense.category}</span>
      </TableCell>
      <TableCell className="text-body">{expense.description}</TableCell>
      <TableCell className="text-13 text-muted-foreground">
        {expense.paymentMethod}
      </TableCell>
      <TableCell className="text-right text-muted-foreground">
        {expense.vat}
      </TableCell>
      <TableCell className="text-right font-bold">{expense.amount}</TableCell>
      <i
        role="img"
        aria-label={i18n.messages.expenseReports.report.proof}
        className="ri-attachment-2 text-16 text-link"
      />
    </TableRow>
  );
}
