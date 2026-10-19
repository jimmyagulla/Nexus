import {
  EXPENSE_REPORT_SORTS,
  ExpenseReportSort,
  ExpenseReportSortDirection,
} from '@hexagonal-monorepo-template/domain';
import {
  i18n as appI18n,
  type I18n,
} from '../../../infrastructure/ui/i18n/i18n';
import type { ExpenseReportsListState } from '../../controllers/expense-reports.controller';
import type { SortColumnModel } from '../documents/document-sort.presenter';

/** Sort control of each orderable column. */
export type ExpenseReportSortModel = Record<ExpenseReportSort, SortColumnModel>;

/** Presents the sort icons of the column headers. */
export class ExpenseReportSortPresenter {
  constructor(private readonly i18n: I18n = appI18n) {}

  present(state: Pick<ExpenseReportsListState, 'sort' | 'direction'>): ExpenseReportSortModel {
    return Object.fromEntries(
      EXPENSE_REPORT_SORTS.map((sort) => [sort, this.presentColumn(sort, state)]),
    ) as ExpenseReportSortModel;
  }

  private presentColumn(
    sort: ExpenseReportSort,
    state: Pick<ExpenseReportsListState, 'sort' | 'direction'>,
  ): SortColumnModel {
    const labels = this.i18n.messages.expenseReports.list.sort;
    const sorted = state.sort === sort;
    const ascending = state.direction === ExpenseReportSortDirection.ASC;
    return {
      state: !sorted ? 'neutral' : ascending ? 'asc' : 'desc',
      label: labels.label
        .replace('{column}', this.columnLabel(sort))
        .replace('{state}', labels[!sorted ? 'NONE' : ascending ? 'ASC' : 'DESC']),
    };
  }

  private columnLabel(sort: ExpenseReportSort): string {
    const columns = this.i18n.messages.expenseReports.list.columns;
    const labels: Record<ExpenseReportSort, string> = {
      DATE: columns.date,
      CATEGORY: columns.category,
      PROJECT: columns.project,
      AMOUNT: columns.amount,
      STATUS: this.i18n.messages.common.status,
      PROOF: columns.proof,
    };
    return labels[sort];
  }
}
