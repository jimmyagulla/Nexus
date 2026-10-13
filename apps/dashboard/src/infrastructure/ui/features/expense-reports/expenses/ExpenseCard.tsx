import type { ExpenseCategoryViewModel } from '../../../../../adapters/presenters/expense-category.presenter';
import type { ExpenseViewModel } from '../../../../../adapters/presenters/expense-report.presenter';
import { ErrorPresenter } from '../../../../../adapters/presenters/error.presenter';
import { Button } from '../../../shared/button';
import { i18n } from '../../../i18n/i18n';
import { EditExpenseDialog } from './EditExpenseDialog';
import type { ExpenseValues } from './expense.schema';

interface ExpenseCardProps {
  expense: ExpenseViewModel;
  editable: boolean;
  categories: ExpenseCategoryViewModel[];
  errorPresenter: ErrorPresenter;
  editError: string | null;
  onEdit: (expenseId: string, values: ExpenseValues) => Promise<boolean>;
  onRemove: (expenseId: string) => void;
}

export function ExpenseCard({
  expense,
  editable,
  categories,
  errorPresenter,
  editError,
  onEdit,
  onRemove,
}: ExpenseCardProps) {
  return (
    <li className="flex flex-wrap items-center gap-4 py-2">
      <span>{expense.date}</span>
      <span>{expense.category}</span>
      <span className="font-semibold">{expense.amount}</span>
      <span>{expense.description}</span>
      <span className="text-muted-foreground">{expense.assignment}</span>
      {editable ? (
        <>
          <EditExpenseDialog
            fields={expense.fields}
            categories={categories}
            errorPresenter={errorPresenter}
            submissionError={editError}
            onSubmit={(values) => onEdit(expense.id, values)}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => onRemove(expense.id)}
          >
            {i18n.messages.expenseReports.removeExpense}
          </Button>
        </>
      ) : null}
    </li>
  );
}
