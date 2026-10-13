import type { ExpenseViewModel } from '../../../../../adapters/presenters/expense-report.presenter';
import { i18n } from '../../../i18n/i18n';
import { ExpenseCard } from './ExpenseCard';

interface ExpenseListProps {
  expenses: ExpenseViewModel[];
}

export function ExpenseList({ expenses }: ExpenseListProps) {
  if (expenses.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        {i18n.messages.expenseReports.noExpenses}
      </p>
    );
  }

  return (
    <ul>
      {expenses.map((expense) => (
        <ExpenseCard key={expense.id} expense={expense} />
      ))}
    </ul>
  );
}
