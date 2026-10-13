import { useQuery } from '@tanstack/react-query';
import { ExpenseCategoriesComposition } from '../../composition/expense-categories.composition';

export const getExpenseCategoriesQueryKey = () => ['expense-categories'];

export function useGetExpenseCategories({
  controller,
  presenter,
}: ExpenseCategoriesComposition) {
  return useQuery({
    queryKey: getExpenseCategoriesQueryKey(),
    queryFn: async () => presenter.present(await controller.listCategories()),
  });
}
