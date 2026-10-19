import { ExpenseReportSummary } from '@hexagonal-monorepo-template/domain';
import {
  i18n as appI18n,
  type I18n,
} from '../../../infrastructure/ui/i18n/i18n';
import type { ExpenseAmountPresenter } from './expense-amount.presenter';

export interface ExpenseReportConfirmationModel {
  /** The report the banner is about, tinted in the list. */
  id: string;
  title: string;
  description: string;
}

/** Presents the banner shown once a report is submitted or changed. */
export class ExpenseReportConfirmationPresenter {
  constructor(
    private readonly amounts: ExpenseAmountPresenter,
    private readonly i18n: I18n = appI18n,
  ) {}

  present(report: ExpenseReportSummary, revised: boolean): ExpenseReportConfirmationModel {
    const labels = this.i18n.messages.expenseReports.submitted;
    return {
      id: report.id,
      title: (revised ? labels.revisedTitle : labels.submittedTitle).replace(
        '{amount}',
        this.amounts.present(report.amount),
      ),
      description: labels.description,
    };
  }
}
