import { useQuery } from '@tanstack/react-query';
import type { ProfessionalExpenseRequestComposition } from '../../composition/professional-expense-request.composition';
import { professionalExpenseRequestFixture } from '../fixtures/professional-expenses.fixture';

export const getProfessionalExpenseRequestQueryKey = () => ['professional-expense-request'];

/** Placeholder data until the use case exists: the fixture goes through the presenter. */
export function useGetProfessionalExpenseRequest({ presenter }: ProfessionalExpenseRequestComposition) {
  return useQuery({
    queryKey: getProfessionalExpenseRequestQueryKey(),
    queryFn: async () => presenter.present(professionalExpenseRequestFixture),
  });
}
