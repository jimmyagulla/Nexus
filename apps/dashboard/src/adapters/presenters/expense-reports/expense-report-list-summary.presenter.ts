import {
  countAppliedExpenseReportFilters,
  ExpenseReportList,
  ExpenseReportListCriteria,
} from '@hexagonal-monorepo-template/domain';
import {
  i18n as appI18n,
  type I18n,
} from '../../../infrastructure/ui/i18n/i18n';
import type { CountLabelPresenter } from '../documents/count-label.presenter';

export interface ExpenseReportListSummaryModel {
  /** Badge of the "Filtres" button. */
  appliedFilterCount: number;
  /** "2 résultats sur 7 ·" */
  resultSummary: string;
  canClearFilters: boolean;
  /** Shown instead of rows when there is none. */
  emptyMessage: string;
}

/** Presents what the expense reports list says about itself: counts, and why it is empty. */
export class ExpenseReportListSummaryPresenter {
  constructor(
    private readonly counts: CountLabelPresenter,
    private readonly i18n: I18n = appI18n,
  ) {}

  /** `criteria` are those the list was asked with. */
  present(list: ExpenseReportList, criteria: ExpenseReportListCriteria): ExpenseReportListSummaryModel {
    const labels = this.i18n.messages.expenseReports.list;
    const applied = countAppliedExpenseReportFilters(criteria);
    return {
      appliedFilterCount: applied,
      resultSummary: this.presentResults(list, applied > 0 || criteria.search !== ''),
      canClearFilters: applied > 0,
      emptyMessage: list.total === 0 ? labels.emptyAll : labels.empty,
    };
  }

  private presentResults(list: ExpenseReportList, narrowed: boolean): string {
    const results = this.i18n.messages.expenseReports.list.results;
    const total = String(list.total);
    if (!narrowed) {
      return (list.total === 1 ? results.allOne : results.allOther).replace('{total}', total);
    }
    return this.counts.present(list.items.length, results).replace('{total}', total);
  }
}
