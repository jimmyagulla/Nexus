import { useQuery } from '@tanstack/react-query';
import { EVERY_PAYSLIP } from '../../../../adapters/controllers/payslips.controller';
import type { PayslipsPageComposition } from '../../../composition/payslip/payslips-page.composition';
import { getPayslipsQueryKey, PAYSLIPS_STALE_TIME_MS } from './useGetPayslips';

/**
 * Years the employee has a payslip in, oldest first, read from the list of
 * every payslip: the cache entry the shell badge also reads.
 */
export function useGetPayslipYears({ controller }: Pick<PayslipsPageComposition, 'controller'>) {
  return useQuery({
    queryKey: getPayslipsQueryKey(EVERY_PAYSLIP),
    queryFn: () => controller.listPayslips(EVERY_PAYSLIP),
    select: (list) => list.years,
    staleTime: PAYSLIPS_STALE_TIME_MS,
  });
}
