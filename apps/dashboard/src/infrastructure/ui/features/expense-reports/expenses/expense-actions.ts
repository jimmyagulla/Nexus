import type { ExpenseCategoryViewModel } from '../../../../../adapters/presenters/expense-category.presenter';
import { ErrorPresenter } from '../../../../../adapters/presenters/error.presenter';
import type { ExpenseValues } from './expense.schema';

export interface ExpenseActions {
  categories: ExpenseCategoryViewModel[];
  errorPresenter: ErrorPresenter;
  editError: string | null;
  onEdit: (expenseId: string, values: ExpenseValues) => Promise<boolean>;
  onRemove: (expenseId: string) => void;
}
