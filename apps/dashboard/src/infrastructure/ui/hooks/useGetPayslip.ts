import { useQuery } from '@tanstack/react-query';
import type { PayslipPageComposition } from '../../composition/payslip/payslip-page.composition';
import { payslipFixture } from '../fixtures/payslips.fixture';

export const getPayslipQueryKey = () => ['payslip'];

/** Placeholder data until the use case exists: the fixture goes through the presenter. */
export function useGetPayslip({ presenter }: PayslipPageComposition) {
  return useQuery({
    queryKey: getPayslipQueryKey(),
    queryFn: async () => presenter.present(payslipFixture),
  });
}
