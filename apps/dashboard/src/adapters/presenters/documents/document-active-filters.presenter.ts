import {
  DOCUMENT_CATEGORIES,
  DOCUMENT_EMITTERS,
  DOCUMENT_STATUSES,
  DocumentListCriteria,
} from '@hexagonal-monorepo-template/domain';
import {
  i18n as appI18n,
  type I18n,
} from '../../../infrastructure/ui/i18n/i18n';

/** Filter groups a chip can remove. */
export type DocumentFilterKey = 'categories' | 'statuses' | 'period' | 'emitter';

export interface ActiveFilterModel {
  key: DocumentFilterKey;
  label: string;
  value: string;
}

/** Presents the chips of the filters in force, one per filter group. */
export class DocumentActiveFiltersPresenter {
  constructor(private readonly i18n: I18n = appI18n) {}

  /** `criteria` are the ones the list was asked with: a period that is not a real one applies no filter. */
  present(criteria: DocumentListCriteria): ActiveFilterModel[] {
    const labels = this.i18n.messages.documents;
    const filters = labels.filters;
    const chips: ActiveFilterModel[] = [];
    if (criteria.categories.length > 0) {
      chips.push({
        key: 'categories',
        label: filters.category,
        value: this.presentValues(DOCUMENT_CATEGORIES, criteria.categories, labels.categories),
      });
    }
    if (criteria.statuses.length > 0) {
      chips.push({
        key: 'statuses',
        label: filters.status,
        value: this.presentValues(DOCUMENT_STATUSES, criteria.statuses, labels.statuses),
      });
    }
    const period = this.presentPeriod(criteria.from, criteria.to);
    if (period !== null) {
      chips.push({ key: 'period', label: filters.period, value: period });
    }
    if (criteria.emitters.length > 0) {
      chips.push({
        key: 'emitter',
        label: filters.emitter,
        value: this.presentValues(DOCUMENT_EMITTERS, criteria.emitters, labels.emitters),
      });
    }
    return chips;
  }

  /** Labels of the chosen values, in the domain order: "Arrêt maladie, Autre". */
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

  private presentPeriod(from: string | null, to: string | null): string | null {
    const values = this.i18n.messages.documents.filters.periodValue;
    if (from !== null && to !== null) {
      return values.between
        .replace('{from}', this.presentDay(from))
        .replace('{to}', this.presentDay(to));
    }
    if (from !== null) {
      return values.from.replace('{from}', this.presentDay(from));
    }
    if (to !== null) {
      return values.to.replace('{to}', this.presentDay(to));
    }
    return null;
  }

  /** `aaaa-mm-jj` → `jj/mm/aaaa`. */
  private presentDay(day: string): string {
    const [year, month, date] = day.split('-');
    return `${date}/${month}/${year}`;
  }
}
