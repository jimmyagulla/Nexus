import type { ExpenseCategoryViewModel } from '../../../../../adapters/presenters/expense-category.presenter';
import type { ExpenseViewModel } from '../../../../../adapters/presenters/expense-report.presenter';
import { ErrorPresenter } from '../../../../../adapters/presenters/error.presenter';
import { i18n } from '../../../i18n/i18n';
import { ExpenseCard } from './ExpenseCard';
import type { ExpenseValues } from './expense.schema';

interface ExpenseListProps {
  expenses: ExpenseViewModel[];
  editable: boolean;
  categories: ExpenseCategoryViewModel[];
  errorPresenter: ErrorPresenter;
  editError: string | null;
  onEdit: (expenseId: string, values: ExpenseValues) => Promise<boolean>;
  onRemove: (expenseId: string) => void;
}

export function ExpenseList({
  expenses,
  editable,
  categories,
  errorPresenter,
  editError,
  onEdit,
  onRemove,
}: ExpenseListProps) {
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
        <ExpenseCard
          key={expense.id}
          expense={expense}
          editable={editable}
          categories={categories}
          errorPresenter={errorPresenter}
          editError={editError}
          onEdit={onEdit}
          onRemove={onRemove}
        />
      ))}
    </ul>
  );
}
