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
 * Until its use case exists, the composition root hands it placeholder data,
 * which it returns as is.
 */
export class ExpenseReportsPresenter {
  constructor(private readonly placeholder: ExpenseReportsViewModel) {}

  present(): ExpenseReportsViewModel {
    return this.placeholder;
  }
}
