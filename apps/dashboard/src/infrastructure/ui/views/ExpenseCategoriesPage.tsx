import { ErrorPresenter } from '../../../adapters/presenters/error.presenter';
import { ExpenseCategoriesComposition } from '../../composition/expense-categories.composition';
import { useAddExpenseCategory } from '../hooks/useAddExpenseCategory';
import { useGetExpenseCategories } from '../hooks/useGetExpenseCategories';
import { i18n } from '../i18n/i18n';
import { ExpenseCategories } from './ExpenseCategories';

interface ExpenseCategoriesPageProps {
  deps: ExpenseCategoriesComposition;
}

export function ExpenseCategoriesPage({ deps }: ExpenseCategoriesPageProps) {
  const categories = useGetExpenseCategories(deps);
  const addCategory = useAddExpenseCategory(deps);

  if (categories.isPending) {
    return <p>{i18n.messages.loading}</p>;
  }

  if (categories.isError) {
    return <p>{deps.errorPresenter.present(categories.error)}</p>;
  }

  return (
    <ExpenseCategories
      categories={categories.data}
      errorPresenter={deps.errorPresenter}
      addError={refusalOf(deps.errorPresenter, addCategory)}
      onAdd={(values) => accepted(addCategory.mutateAsync(values.label))}
    />
  );
}

function refusalOf(
  presenter: ErrorPresenter,
  mutation: { isError: boolean; error: unknown },
): string | null {
  return mutation.isError ? presenter.present(mutation.error) : null;
}

function accepted(mutation: Promise<unknown>): Promise<boolean> {
  return mutation.then(
    () => true,
    () => false,
  );
}
