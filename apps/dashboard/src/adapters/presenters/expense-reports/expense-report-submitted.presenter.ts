import type { ExpenseReportRowModel } from './expense-reports.presenter';

export interface ExpenseReportSubmittedViewModel {
  confirmation: { title: string; description: string };
  draftId: string;
  reports: ExpenseReportRowModel[];
}

/**
 * Presents the expense report submission confirmation.
 * Until its use case exists, the composition root hands it placeholder data,
 * which it returns as is.
 */
export class ExpenseReportSubmittedPresenter {
  constructor(private readonly placeholder: ExpenseReportSubmittedViewModel) {}

  present(): ExpenseReportSubmittedViewModel {
    return this.placeholder;
  }
}
