import type { StatusViewModel } from '../display.types';

export interface ExpenseReportsViewModel {
  draftId: string;
  kpis: ExpenseKpiModel[];
  reports: ExpenseReportRowModel[];
}

export interface ExpenseKpiModel {
  label: string;
  value: string;
  /** Remix Icon class of the leading tile, e.g. `ri-receipt-line`. */
  icon?: string;
}

export interface ExpenseReportRowModel {
  id: string;
  title: string;
  period: string;
  expenseCount: string;
  total: string;
  status: StatusViewModel;
  /** Freshly submitted note, tinted blue. */
  highlighted?: boolean;
}

/**
 * Presents the expense reports list.
 * Until its use case exists, it receives placeholder data already shaped as
 * the view model, and returns it as is.
 */
export class ExpenseReportsPresenter {
  present(expenseReports: ExpenseReportsViewModel): ExpenseReportsViewModel {
    return expenseReports;
  }
}
