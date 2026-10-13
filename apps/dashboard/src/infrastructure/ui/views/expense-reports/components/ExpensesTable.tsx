import { type ExpenseFormModel } from '../../../features/expense-reports/ExpenseForm';
import { i18n } from '../../../i18n/i18n';
import { Table, TableHead, TableHeader } from '../../../shared/table';
import { AddExpenseSheet } from './AddExpenseSheet';
import { ExpenseRow, type ExpenseRowModel } from './ExpenseRow';

const COLUMNS = '96px 130px minmax(0,1fr) 140px 80px 90px 32px';

interface ExpensesTableProps {
  expenses: ExpenseRowModel[];
  /** "dont TVA 12,27 €" */
  vatTotal: string;
  newExpense: ExpenseFormModel;
}

/** Expenses of a note, with the "Ajouter une dépense" panel trigger. */
export function ExpensesTable({
  expenses,
  vatTotal,
  newExpense,
}: ExpensesTableProps) {
  const labels = i18n.messages.expenseReports.report.columns;

  return (
    <Table columns={COLUMNS}>
      <TableHeader className="gap-3.5 px-5">
        <TableHead>{labels.date}</TableHead>
        <TableHead>{labels.category}</TableHead>
        <TableHead>{labels.description}</TableHead>
        <TableHead>{labels.payment}</TableHead>
        <TableHead className="justify-end">{labels.vat}</TableHead>
        <TableHead className="justify-end">{labels.amount}</TableHead>
        <span />
      </TableHeader>
      {expenses.map((expense) => (
        <ExpenseRow key={expense.id} expense={expense} />
      ))}
      <div className="flex items-center justify-between px-5 py-3">
        <AddExpenseSheet expense={newExpense} />
        <span className="text-13 text-muted-foreground">{vatTotal}</span>
      </div>
    </Table>
  );
}
