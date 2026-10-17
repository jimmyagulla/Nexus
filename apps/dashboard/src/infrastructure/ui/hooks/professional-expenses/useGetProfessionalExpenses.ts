import { useQuery } from '@tanstack/react-query';
import type { ProfessionalExpensesPageComposition } from '../../../composition/professional-expense/professional-expenses-page.composition';
import { professionalExpensesFixture } from '../../fixtures/professional-expenses.fixture';

export const getProfessionalExpensesQueryKey = () => ['professional-expenses'];

/** Placeholder data until the use case exists: the fixture goes through the presenter. */
export function useGetProfessionalExpenses({ presenter }: ProfessionalExpensesPageComposition) {
  return useQuery({
    queryKey: getProfessionalExpensesQueryKey(),
    queryFn: async () => presenter.present(professionalExpensesFixture),
  });
}
