import { useQuery } from '@tanstack/react-query';
import { useStore } from 'zustand';
import { countUnseen } from '@hexagonal-monorepo-template/domain';
import { EVERY_PAYSLIP } from '../../../../adapters/controllers/payslips.controller';
import type { PayslipsPageComposition } from '../../../composition/payslip/payslips-page.composition';
import { getPayslipsQueryKey, PAYSLIPS_STALE_TIME_MS } from './useGetPayslips';

/**
 * How many payslips the employee has neither opened nor downloaded on this
 * device; it drops as soon as one is, without asking the API again.
 */
export function useGetUnseenPayslipCount({
  controller,
  seenPayslips,
}: Pick<PayslipsPageComposition, 'controller' | 'seenPayslips'>) {
  const seenIds = useStore(seenPayslips, (state) => state.seenIds);

  return useQuery({
    queryKey: getPayslipsQueryKey(EVERY_PAYSLIP),
    queryFn: () => controller.listPayslips(EVERY_PAYSLIP),
    select: (list) => countUnseen(list.items, seenIds),
    staleTime: PAYSLIPS_STALE_TIME_MS,
  });
}
