import { ExpenseReportStats } from '@hexagonal-monorepo-template/domain';
import {
  i18n as appI18n,
  type I18n,
} from '../../../infrastructure/ui/i18n/i18n';
import type { CountLabelPresenter } from '../documents/count-label.presenter';
import type { ExpenseAmountPresenter } from './expense-amount.presenter';

export interface ExpenseKpiModel {
  label: string;
  value: string;
  /** Remix Icon class of the leading tile, e.g. `ri-receipt-line`. */
  icon?: string;
}

/** Presents the three key figures above the expense reports list. */
export class ExpenseReportKpisPresenter {
  constructor(
    private readonly amounts: ExpenseAmountPresenter,
    private readonly counts: CountLabelPresenter,
    private readonly i18n: I18n = appI18n,
  ) {}

  present(stats: ExpenseReportStats): ExpenseKpiModel[] {
    const labels = this.i18n.messages.expenseReports.kpis;
    return [
      {
        label: this.counts.present(stats.pending.count, labels.pending),
        value: this.amounts.present(stats.pending.amount),
        icon: 'ri-receipt-line',
      },
      {
        label: labels.refunded.replace('{year}', String(stats.refunded.year)),
        value: this.amounts.present(stats.refunded.amount),
      },
      {
        label: labels.averageProcessing,
        value:
          stats.averageProcessingDays === null
            ? labels.noAverage
            : this.counts.present(stats.averageProcessingDays, labels.days),
      },
    ];
  }
}
