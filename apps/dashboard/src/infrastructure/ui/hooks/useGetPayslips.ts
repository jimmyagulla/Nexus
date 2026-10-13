import { useQuery } from '@tanstack/react-query';
import type { PayslipsComposition } from '../../composition/payslips.composition';
import { payslipsFixture } from '../fixtures/payslips.fixture';

export const getPayslipsQueryKey = () => ['payslips'];

/** Placeholder data until the use case exists: the fixture goes through the presenter. */
export function useGetPayslips({ presenter }: PayslipsComposition) {
  return useQuery({
    queryKey: getPayslipsQueryKey(),
    queryFn: async () => presenter.present(payslipsFixture),
  });
}
