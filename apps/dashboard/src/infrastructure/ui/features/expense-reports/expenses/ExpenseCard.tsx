import type { ExpenseViewModel } from '../../../../../adapters/presenters/expense-report.presenter';
import { Button } from '../../../shared/button';
import { i18n } from '../../../i18n/i18n';
import { EditExpenseDialog } from './EditExpenseDialog';
import type { ExpenseActions } from './expense-actions';

interface ExpenseCardProps {
  expense: ExpenseViewModel;
  actions?: ExpenseActions;
}

export function ExpenseCard({ expense, actions }: ExpenseCardProps) {
  return (
    <li className="flex flex-wrap items-center gap-4 py-2">
      <span>{expense.date}</span>
      <span>{expense.category}</span>
      <span className="font-semibold">{expense.amount}</span>
      <span>{expense.description}</span>
      <span className="text-muted-foreground">{expense.assignment}</span>
      {actions === undefined ? null : (
        <>
          <EditExpenseDialog
            fields={expense.fields}
            categories={actions.categories}
            errorPresenter={actions.errorPresenter}
            submissionError={actions.editError}
            onSubmit={(values) => actions.onEdit(expense.id, values)}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => actions.onRemove(expense.id)}
          >
            {i18n.messages.expenseReports.removeExpense}
          </Button>
        </>
      )}
    </li>
  );
}
