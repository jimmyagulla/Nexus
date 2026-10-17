import { useQuery } from '@tanstack/react-query';
import type { PayslipsPageComposition } from '../../../composition/payslip/payslips-page.composition';
import { payslipsFixture } from '../../fixtures/payslips.fixture';

export const getPayslipsQueryKey = () => ['payslips'];

/** Placeholder data until the use case exists: the fixture goes through the presenter. */
export function useGetPayslips({ presenter }: PayslipsPageComposition) {
  return useQuery({
    queryKey: getPayslipsQueryKey(),
    queryFn: async () => presenter.present(payslipsFixture),
  });
}
