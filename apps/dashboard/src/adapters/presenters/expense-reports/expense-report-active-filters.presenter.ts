import {
  EXPENSE_REPORT_CATEGORIES,
  EXPENSE_REPORT_PROOF_PRESENCES,
  EXPENSE_REPORT_STATUSES,
  ExpenseReportListCriteria,
} from '@hexagonal-monorepo-template/domain';
import {
  i18n as appI18n,
  type I18n,
} from '../../../infrastructure/ui/i18n/i18n';
import type { ExpenseAmountPresenter } from './expense-amount.presenter';

/** Filter groups a chip can remove. */
export type ExpenseReportFilterKey =
  | 'categories'
  | 'statuses'
  | 'projects'
  | 'proofs'
  | 'period'
  | 'amount';

export interface ExpenseReportActiveFilterModel {
  key: ExpenseReportFilterKey;
  label: string;
  value: string;
}

/** Presents the chips of the filters in force, one per filter group. */
export class ExpenseReportActiveFiltersPresenter {
  constructor(
    private readonly amounts: ExpenseAmountPresenter,
    private readonly i18n: I18n = appI18n,
  ) {}

  /** `criteria` are the ones the list was asked with: a bound that is not a real one applies no filter. */
  present(criteria: ExpenseReportListCriteria): ExpenseReportActiveFilterModel[] {
    const labels = this.i18n.messages.expenseReports;
    const filters = labels.filters;
    const chips: ExpenseReportActiveFilterModel[] = [];
    if (criteria.categories.length > 0) {
      chips.push({ key: 'categories', label: filters.category, value: this.presentValues(EXPENSE_REPORT_CATEGORIES, criteria.categories, labels.categories) });
    }
    if (criteria.statuses.length > 0) {
      chips.push({ key: 'statuses', label: filters.status, value: this.presentValues(EXPENSE_REPORT_STATUSES, criteria.statuses, labels.statuses) });
    }
    if (criteria.projects.length > 0) {
      chips.push({ key: 'projects', label: filters.project, value: criteria.projects.join(', ') });
    }
    if (criteria.proofs.length > 0) {
      chips.push({ key: 'proofs', label: filters.proof, value: this.presentValues(EXPENSE_REPORT_PROOF_PRESENCES, criteria.proofs, labels.proofs) });
    }
    const period = this.presentBounds(criteria.from, criteria.to, filters.periodValue.between, filters.periodValue.from, filters.periodValue.to, (day) => this.presentDay(day));
    if (period !== null) {
      chips.push({ key: 'period', label: filters.period, value: period });
    }
    const amount = this.presentBounds(criteria.minAmount, criteria.maxAmount, filters.amountValue.between, filters.amountValue.min, filters.amountValue.max, (value) => this.amounts.present(value));
    if (amount !== null) {
      chips.push({ key: 'amount', label: filters.amount, value: amount });
    }
    return chips;
  }

  /** Labels of the chosen values, in the domain order. */
  private presentValues<T extends string>(
    order: readonly T[],
    chosen: readonly T[],
    labels: Readonly<Record<T, string>>,
  ): string {
    return order
      .filter((value) => chosen.includes(value))
      .map((value) => labels[value])
      .join(', ');
  }

  /** "du {from} au {to}", "à partir de {min}"… with `{from}`/`{min}` and `{to}`/`{max}` as the bounds. */
  private presentBounds(
    low: string | null,
    high: string | null,
    between: string,
    fromOnly: string,
    toOnly: string,
    format: (value: string) => string,
  ): string | null {
    const fill = (template: string) =>
      template
        .replace(/\{(from|min)\}/, low === null ? '' : format(low))
        .replace(/\{(to|max)\}/, high === null ? '' : format(high));
    if (low !== null && high !== null) {
      return fill(between);
    }
    if (low !== null) {
      return fill(fromOnly);
    }
    if (high !== null) {
      return fill(toOnly);
    }
    return null;
  }

  /** `aaaa-mm-jj` → `jj/mm/aaaa`. */
  private presentDay(day: string): string {
    const [year, month, date] = day.split('-');
    return `${date}/${month}/${year}`;
  }
}
