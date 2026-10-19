import { useQuery } from '@tanstack/react-query';
import type { ProfessionalExpenseRequestPageComposition } from '../../../composition/professional-expense/professional-expense-request-page.composition';
import { professionalExpenseRequestFixture } from '../../fixtures/professional-expenses.fixture';

export const getProfessionalExpenseRequestQueryKey = () => ['professional-expense-request'];

/** Placeholder data until the use case exists: the fixture goes through the presenter. */
export function useGetProfessionalExpenseRequest({ presenter }: ProfessionalExpenseRequestPageComposition) {
  return useQuery({
    queryKey: getProfessionalExpenseRequestQueryKey(),
    queryFn: async () => presenter.present(professionalExpenseRequestFixture),
  });
}
