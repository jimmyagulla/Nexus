import type { ExpenseCategoryViewModel } from '../../../adapters/presenters/expense-category.presenter';
import { ErrorPresenter } from '../../../adapters/presenters/error.presenter';
import { AddExpenseCategoryDialog } from '../features/expense-categories/AddExpenseCategoryDialog';
import { ExpenseCategoryList } from '../features/expense-categories/ExpenseCategoryList';
import type { ExpenseCategoryValues } from '../features/expense-categories/expense-category.schema';
import { i18n } from '../i18n/i18n';

interface ExpenseCategoriesProps {
  categories: ExpenseCategoryViewModel[];
  errorPresenter: ErrorPresenter;
  addError: string | null;
  onAdd: (values: ExpenseCategoryValues) => Promise<boolean>;
}

export function ExpenseCategories({
  categories,
  errorPresenter,
  addError,
  onAdd,
}: ExpenseCategoriesProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">
        {i18n.messages.expenseCategories.title}
      </h2>
      <ExpenseCategoryList categories={categories} />
      <AddExpenseCategoryDialog
        errorPresenter={errorPresenter}
        submissionError={addError}
        onSubmit={onAdd}
      />
    </section>
  );
}
