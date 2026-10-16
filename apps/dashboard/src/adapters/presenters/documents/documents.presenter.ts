import {
  DOCUMENT_CATEGORIES,
  DOCUMENT_SORTS,
  DOCUMENT_STATUSES,
  DocumentCategory,
  DocumentEmitter,
  DocumentList,
  DocumentListCriteria,
  DocumentSort,
  DocumentStatus,
  DocumentSummary,
} from '@hexagonal-monorepo-template/domain';
import {
  i18n as appI18n,
  type I18n,
} from '../../../infrastructure/ui/i18n/i18n';
import type { DocumentsListState } from '../../controllers/documents.controller';
import type { StatusTone, StatusViewModel } from '../display.types';

/** Filter groups a chip can remove. */
export type DocumentFilterKey = 'categories' | 'statuses' | 'period' | 'emitter';

/** Value of the emitter toggle that keeps every emitter. */
export const ALL_EMITTERS = 'all';

export interface DocumentsViewModel {
  appliedFilterCount: number;
  /** "2 résultats sur 7 ·" */
  resultSummary: string;
  canClearFilters: boolean;
  activeFilters: ActiveFilterModel[];
  filters: DocumentFiltersModel;
  sort: DocumentSortModel;
  documents: DocumentRowModel[];
  /** Shown instead of rows when there is none. */
  emptyMessage: string;
}

export interface ActiveFilterModel {
  key: DocumentFilterKey;
  label: string;
  value: string;
}

export interface DocumentFiltersModel {
  /** "2 filtres appliqués" */
  appliedLabel: string;
  /** "Afficher 2 résultats" */
  showResultsLabel: string;
  categories: FilterOptionModel[];
  statuses: FilterOptionModel[];
  emitters: { value: string; label: string }[];
  emitter: string;
  from: string;
  to: string;
}

export interface DocumentSortModel {
  current: DocumentSort;
  /** Current ordering, e.g. "date, récent d'abord". */
  label: string;
  options: { value: DocumentSort; label: string; selected: boolean }[];
}

export interface DocumentRowModel {
  id: string;
  /** Remix Icon class of the document kind, e.g. `ri-file-text-line`. */
  icon: string;
  name: string;
  category: string;
  date: string;
  format: string;
  size: string;
  emitter: string;
  status: StatusViewModel;
}

export interface FilterOptionModel {
  id: string;
  label: string;
  count: number;
  checked: boolean;
}

const CATEGORY_ICONS: Record<DocumentCategory, string> = {
  SICK_LEAVE: 'ri-first-aid-kit-line',
  PROOF: 'ri-file-check-line',
  ADMINISTRATIVE: 'ri-file-text-line',
  OTHER: 'ri-file-line',
};

const STATUS_TONES: Record<DocumentStatus, StatusTone> = {
  NEW: 'info',
  SEEN: 'neutral',
  PROCESSED: 'done',
  PENDING: 'warning',
};

/** Order of the filter options: the order of the upload form. */
const CATEGORY_OPTIONS: readonly DocumentCategory[] = ['SICK_LEAVE', 'PROOF', 'ADMINISTRATIVE', 'OTHER'];
const STATUS_OPTIONS: readonly DocumentStatus[] = ['NEW', 'SEEN', 'PROCESSED', 'PENDING'];

/** Presents the documents list of the signed-in employee. */
export class DocumentsPresenter {
  constructor(private readonly i18n: I18n = appI18n) {}

  /** `criteria` are the ones `state` resolved to: a period half typed applies no filter. */
  present(
    list: DocumentList,
    state: DocumentsListState,
    criteria: DocumentListCriteria,
  ): DocumentsViewModel {
    const activeFilters = this.presentActiveFilters(state, criteria);
    const narrowed = activeFilters.length > 0 || state.search.trim() !== '';
    return {
      appliedFilterCount: activeFilters.length,
      resultSummary: this.presentSummary(list, narrowed),
      canClearFilters: activeFilters.length > 0,
      activeFilters,
      filters: this.presentFilters(list, state, activeFilters.length),
      sort: this.presentSort(state.sort),
      documents: list.items.map((item) => this.presentRow(item)),
      emptyMessage: list.total === 0 ? this.labels.list.emptyVault : this.labels.list.empty,
    };
  }

  private get labels() {
    return this.i18n.messages.documents;
  }

  private presentRow(item: DocumentSummary): DocumentRowModel {
    return {
      id: item.id,
      icon: CATEGORY_ICONS[item.category],
      name: item.name,
      category: this.labels.categories[item.category],
      date: this.presentDate(new Date(item.createdAt)),
      format: this.labels.formats[item.format],
      size: this.presentSize(item.sizeBytes),
      emitter: this.labels.emitters[item.emitter],
      status: { label: this.labels.statuses[item.status], tone: STATUS_TONES[item.status] },
    };
  }

  private presentFilters(
    list: DocumentList,
    state: DocumentsListState,
    appliedCount: number,
  ): DocumentFiltersModel {
    const filters = this.labels.filters;
    return {
      appliedLabel: this.plural(appliedCount, filters.applied),
      showResultsLabel: this.plural(list.items.length, filters.showResults),
      categories: CATEGORY_OPTIONS.map((category) => ({
        id: category,
        label: this.labels.categories[category],
        count: list.categoryCounts[category],
        checked: state.categories.includes(category),
      })),
      statuses: STATUS_OPTIONS.map((status) => ({
        id: status,
        label: this.labels.statuses[status],
        count: list.statusCounts[status],
        checked: state.statuses.includes(status),
      })),
      emitters: [
        { value: ALL_EMITTERS, label: filters.emitterAll },
        { value: DocumentEmitter.HR, label: this.labels.emitters.HR },
        { value: DocumentEmitter.SELF, label: this.labels.emitters.SELF },
      ],
      emitter: state.emitter ?? ALL_EMITTERS,
      from: state.from,
      to: state.to,
    };
  }

  private presentActiveFilters(
    state: DocumentsListState,
    criteria: DocumentListCriteria,
  ): ActiveFilterModel[] {
    const filters = this.labels.filters;
    const chips: ActiveFilterModel[] = [];
    if (state.categories.length > 0) {
      chips.push({
        key: 'categories',
        label: filters.category,
        value: DOCUMENT_CATEGORIES.filter((c) => state.categories.includes(c))
          .map((c) => this.labels.categories[c])
          .join(', '),
      });
    }
    if (state.statuses.length > 0) {
      chips.push({
        key: 'statuses',
        label: filters.status,
        value: DOCUMENT_STATUSES.filter((s) => state.statuses.includes(s))
          .map((s) => this.labels.statuses[s])
          .join(', '),
      });
    }
    const period = this.presentPeriod(
      criteria.from === null ? '' : state.from.trim(),
      criteria.to === null ? '' : state.to.trim(),
    );
    if (period !== null) {
      chips.push({ key: 'period', label: filters.period, value: period });
    }
    if (state.emitter !== null) {
      chips.push({ key: 'emitter', label: filters.emitter, value: this.labels.emitters[state.emitter] });
    }
    return chips;
  }

  private presentPeriod(from: string, to: string): string | null {
    const values = this.labels.filters.periodValue;
    if (from !== '' && to !== '') {
      return values.between.replace('{from}', from).replace('{to}', to);
    }
    if (from !== '') {
      return values.from.replace('{from}', from);
    }
    if (to !== '') {
      return values.to.replace('{to}', to);
    }
    return null;
  }

  private presentSort(current: DocumentSort): DocumentSortModel {
    return {
      current,
      label: this.labels.list.sort[current],
      options: DOCUMENT_SORTS.map((sort) => ({
        value: sort,
        label: this.labels.list.sort[sort],
        selected: sort === current,
      })),
    };
  }

  private presentSummary(list: DocumentList, narrowed: boolean): string {
    const results = this.labels.list.results;
    const total = String(list.total);
    if (!narrowed) {
      return (list.total === 1 ? results.allOne : results.allOther).replace('{total}', total);
    }
    return this.plural(list.items.length, results).replace('{total}', total);
  }

  /** `jj/mm/aaaa`, in the time zone of the device. */
  private presentDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}/${date.getFullYear()}`;
  }

  /** "188 Ko", "1,4 Mo". */
  private presentSize(bytes: number): string {
    const sizes = this.labels.sizes;
    if (bytes < 1024) {
      return sizes.bytes.replace('{size}', String(bytes));
    }
    if (bytes < 1024 * 1024) {
      return sizes.kilobytes.replace('{size}', String(Math.round(bytes / 1024)));
    }
    const megabytes = (bytes / (1024 * 1024)).toFixed(1).replace('.0', '');
    return sizes.megabytes.replace('{size}', megabytes.replace('.', ','));
  }

  private plural(count: number, forms: { one: string; other: string; none?: string }): string {
    if (count === 0 && forms.none !== undefined) {
      return forms.none;
    }
    return (count === 1 ? forms.one : forms.other).replace('{count}', String(count));
  }
}
