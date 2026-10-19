import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type {
  ExpenseReportList,
  ExpenseReportListCriteria,
} from '@hexagonal-monorepo-template/domain';
import type { ExpenseReportsListState } from '../../../../adapters/controllers/expense-reports.controller';
import type { ExpenseReportActiveFilterModel } from '../../../../adapters/presenters/expense-reports/expense-report-active-filters.presenter';
import type { ExpenseReportFiltersModel } from '../../../../adapters/presenters/expense-reports/expense-report-filters.presenter';
import type { ExpenseKpiModel } from '../../../../adapters/presenters/expense-reports/expense-report-kpis.presenter';
import type { ExpenseReportListSummaryModel } from '../../../../adapters/presenters/expense-reports/expense-report-list-summary.presenter';
import type { ExpenseReportRowModel } from '../../../../adapters/presenters/expense-reports/expense-report-row.presenter';
import type { ExpenseReportSortModel } from '../../../../adapters/presenters/expense-reports/expense-report-sort.presenter';
import type { ExpenseReportsPageComposition } from '../../../composition/expense-report/expense-reports-page.composition';

/** What the expense reports list shows: the output of each of its presenters, and the list itself. */
export interface ExpenseReportsListModels {
  kpis: ExpenseKpiModel[];
  summary: ExpenseReportListSummaryModel;
  activeFilters: ExpenseReportActiveFilterModel[];
  filters: ExpenseReportFiltersModel;
  sort: ExpenseReportSortModel;
  rows: ExpenseReportRowModel[];
  /** The reports as listed, for the detail and the form of one of them. */
  list: ExpenseReportList;
}

/**
 * Without criteria: every expense reports list, whatever its search, filters
 * and ordering (prefix used to invalidate them all).
 */
export const getExpenseReportsQueryKey = (criteria?: ExpenseReportListCriteria) =>
  criteria === undefined ? ['expense-reports'] : ['expense-reports', 'list', criteria];

/**
 * One cache entry per search, filters and ordering. While a new combination
 * loads, the previous list stays on screen instead of a loading state.
 */
export function useGetExpenseReports(
  { controller, listPresenters }: ExpenseReportsPageComposition,
  state: ExpenseReportsListState,
) {
  const criteria = controller.criteriaFor(state);

  return useQuery({
    queryKey: getExpenseReportsQueryKey(criteria),
    queryFn: () => controller.listExpenseReports(criteria),
    select: (list): ExpenseReportsListModels => ({
      kpis: listPresenters.kpis.present(list.stats),
      summary: listPresenters.summary.present(list, criteria),
      activeFilters: listPresenters.activeFilters.present(criteria),
      filters: listPresenters.filters.present(list, state, criteria),
      sort: listPresenters.sort.present(state),
      rows: list.items.map((item) => listPresenters.row.present(item)),
      list,
    }),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}
