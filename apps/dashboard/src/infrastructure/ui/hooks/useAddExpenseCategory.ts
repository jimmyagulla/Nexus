import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ExpenseCategoriesComposition } from '../../composition/expense-categories.composition';
import { getExpenseCategoriesQueryKey } from './useGetExpenseCategories';

export function useAddExpenseCategory({
  controller,
}: ExpenseCategoriesComposition) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (label: string) => {
      await controller.addCategory(label);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: getExpenseCategoriesQueryKey(),
      });
    },
  });
}
