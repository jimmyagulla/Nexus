import { useQuery } from '@tanstack/react-query';
import type { ProfessionalExpensesComposition } from '../../composition/professional-expenses.composition';
import { professionalExpensesFixture } from '../fixtures/professional-expenses.fixture';

export const getProfessionalExpensesQueryKey = () => ['professional-expenses'];

/** Placeholder data until the use case exists: the fixture goes through the presenter. */
export function useGetProfessionalExpenses({ presenter }: ProfessionalExpensesComposition) {
  return useQuery({
    queryKey: getProfessionalExpensesQueryKey(),
    queryFn: async () => presenter.present(professionalExpensesFixture),
  });
}
