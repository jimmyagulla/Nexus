import { ExpenseReportSummary } from '@hexagonal-monorepo-template/domain';
import {
  i18n as appI18n,
  type I18n,
} from '../../../infrastructure/ui/i18n/i18n';
import type { StatusViewModel } from '../display.types';
import type { ExpenseAmountPresenter } from './expense-amount.presenter';
import {
  EXPENSE_REPORT_CATEGORY_ICONS,
  EXPENSE_REPORT_STATUS_TONES,
} from './expense-report-display';

export interface ExpenseReportRowModel {
  id: string;
  /** The description of the expense. */
  name: string;
  /** Remix Icon class of the category, e.g. `ri-train-line`. */
  icon: string;
  category: string;
  date: string;
  project: string;
  amount: string;
  status: StatusViewModel;
  proof: { attached: boolean; label: string };
}

/** Presents one row of the expense reports list. */
export class ExpenseReportRowPresenter {
  constructor(
    private readonly amounts: ExpenseAmountPresenter,
    private readonly i18n: I18n = appI18n,
  ) {}

  present(item: ExpenseReportSummary): ExpenseReportRowModel {
    const labels = this.i18n.messages.expenseReports;
    return {
      id: item.id,
      name: item.description,
      icon: EXPENSE_REPORT_CATEGORY_ICONS[item.category],
      category: labels.categories[item.category],
      date: this.presentDay(item.date),
      project: item.project ?? labels.list.noProject,
      amount: this.amounts.present(item.amount),
      status: { label: labels.statuses[item.status], tone: EXPENSE_REPORT_STATUS_TONES[item.status] },
      proof: {
        attached: item.proof !== null,
        label: item.proof === null ? labels.list.proofMissing : labels.list.proofAttached,
      },
    };
  }

  /** `aaaa-mm-jj` → `jj/mm/aaaa`. */
  private presentDay(day: string): string {
    const [year, month, date] = day.split('-');
    return `${date}/${month}/${year}`;
  }
}
