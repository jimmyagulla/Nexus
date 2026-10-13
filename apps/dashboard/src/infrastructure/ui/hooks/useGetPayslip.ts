import { useQuery } from '@tanstack/react-query';
import type { PayslipComposition } from '../../composition/payslip.composition';
import { payslipFixture } from '../fixtures/payslips.fixture';

export const getPayslipQueryKey = () => ['payslip'];

/** Placeholder data until the use case exists: the fixture goes through the presenter. */
export function useGetPayslip({ presenter }: PayslipComposition) {
  return useQuery({
    queryKey: getPayslipQueryKey(),
    queryFn: async () => presenter.present(payslipFixture),
  });
}
