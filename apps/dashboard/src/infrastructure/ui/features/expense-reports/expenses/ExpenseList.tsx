import type { ExpenseViewModel } from '../../../../../adapters/presenters/expense-report.presenter';
import { i18n } from '../../../i18n/i18n';
import { ExpenseCard } from './ExpenseCard';
import type { ExpenseActions } from './expense-actions';

interface ExpenseListProps {
  expenses: ExpenseViewModel[];
  actions?: ExpenseActions;
}

export function ExpenseList({ expenses, actions }: ExpenseListProps) {
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
        <ExpenseCard key={expense.id} expense={expense} actions={actions} />
      ))}
    </ul>
  );
}
