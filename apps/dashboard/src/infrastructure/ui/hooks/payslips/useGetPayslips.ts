import { skipToken, useQuery, useQueryClient } from '@tanstack/react-query';
import { useStore } from 'zustand';
import {
  PayslipList,
  PayslipListCriteria,
  payslipListOfYear,
} from '@hexagonal-monorepo-template/domain';
import {
  EVERY_PAYSLIP,
  type PayslipYearCriteria,
} from '../../../../adapters/controllers/payslips.controller';
import type { PayslipListSummaryModel } from '../../../../adapters/presenters/payslips/payslip-list-summary.presenter';
import type { PayslipRowModel } from '../../../../adapters/presenters/payslips/payslip-row.presenter';
import type { PayslipYearModel } from '../../../../adapters/presenters/payslips/payslip-year.presenter';
import type { PayslipsPageComposition } from '../../../composition/payslip/payslips-page.composition';

/** What the payslips list shows: the output of each of its presenters. */
export interface PayslipsListModels {
  summary: PayslipListSummaryModel;
  year: PayslipYearModel;
  rows: PayslipRowModel[];
}

/**
 * Without criteria: every payslips list, whatever its year (prefix used to
 * invalidate them all). `null` stands for a year not known yet.
 */
export const getPayslipsQueryKey = (criteria?: PayslipListCriteria | null) =>
  criteria === undefined ? ['payslips'] : ['payslips', 'list', criteria];

/** Every staleTime of the payslips lists: they only change on an employer upload. */
export const PAYSLIPS_STALE_TIME_MS = 30_000;

/**
 * One cache entry per year; waits while `criteria` is null. Until the year
 * arrives, it shows that year read from the list of every year when it is
 * already cached (the shell loads it), else the previous year.
 */
export function useGetPayslips(
  { controller, listPresenters, seenPayslips }: PayslipsPageComposition,
  criteria: PayslipYearCriteria | null,
) {
  const queryClient = useQueryClient();
  const seenIds = useStore(seenPayslips, (state) => state.seenIds);

  return useQuery({
    queryKey: getPayslipsQueryKey(criteria),
    queryFn: criteria === null ? skipToken : () => controller.listPayslips(criteria),
    select: (list): PayslipsListModels => ({
      summary: listPresenters.summary.present(list),
      year: listPresenters.year.present(list, criteria?.year ?? Math.max(...list.years)),
      rows: list.items.map((item) => listPresenters.row.present(item, seenIds.has(item.id))),
    }),
    placeholderData: (previous) => {
      const everyYear = queryClient.getQueryData<PayslipList>(getPayslipsQueryKey(EVERY_PAYSLIP));
      return everyYear !== undefined && criteria !== null
        ? payslipListOfYear(everyYear, criteria.year)
        : previous;
    },
    staleTime: PAYSLIPS_STALE_TIME_MS,
  });
}
