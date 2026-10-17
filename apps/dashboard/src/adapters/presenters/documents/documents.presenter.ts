import {
  DocumentList,
  DocumentListCriteria,
} from '@hexagonal-monorepo-template/domain';
import {
  i18n as appI18n,
  type I18n,
} from '../../../infrastructure/ui/i18n/i18n';
import type { DocumentsListState } from '../../controllers/documents.controller';
import { CountLabelPresenter } from './count-label.presenter';
import {
  DocumentActiveFiltersPresenter,
  type ActiveFilterModel,
} from './document-active-filters.presenter';
import {
  DocumentFiltersPresenter,
  type DocumentFiltersModel,
} from './document-filters.presenter';
import {
  DocumentRowPresenter,
  type DocumentRowModel,
} from './document-row.presenter';
import {
  DocumentSortPresenter,
  type DocumentSortModel,
} from './document-sort.presenter';

export type { ActiveFilterModel, DocumentFilterKey } from './document-active-filters.presenter';
export { ALL_EMITTERS } from './document-filters.presenter';
export type { DocumentFiltersModel, FilterOptionModel } from './document-filters.presenter';
export type { DocumentRowModel } from './document-row.presenter';
export type { DocumentSortModel, SortColumnModel, SortState } from './document-sort.presenter';

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

/**
 * Presents the documents list of the signed-in employee. Each part of the
 * screen has its own presenter; this one assembles them.
 */
export class DocumentsPresenter {
  private readonly rows: DocumentRowPresenter;
  private readonly filters: DocumentFiltersPresenter;
  private readonly activeFilters: DocumentActiveFiltersPresenter;
  private readonly sort: DocumentSortPresenter;
  private readonly counts = new CountLabelPresenter();

  constructor(private readonly i18n: I18n = appI18n) {
    this.rows = new DocumentRowPresenter(i18n);
    this.filters = new DocumentFiltersPresenter(i18n);
    this.activeFilters = new DocumentActiveFiltersPresenter(i18n);
    this.sort = new DocumentSortPresenter(i18n);
  }

  /** `criteria` are the ones `state` resolved to, those the list was asked with. */
  present(
    list: DocumentList,
    state: DocumentsListState,
    criteria: DocumentListCriteria,
  ): DocumentsViewModel {
    const labels = this.i18n.messages.documents.list;
    const activeFilters = this.activeFilters.present(criteria);
    const narrowed = activeFilters.length > 0 || criteria.search !== '';
    return {
      appliedFilterCount: activeFilters.length,
      resultSummary: this.presentSummary(list, narrowed),
      canClearFilters: activeFilters.length > 0,
      activeFilters,
      filters: this.filters.present(list, state, activeFilters.length),
      sort: this.sort.present(state),
      documents: list.items.map((item) => this.rows.present(item)),
      emptyMessage: list.total === 0 ? labels.emptyVault : labels.empty,
    };
  }

  private presentSummary(list: DocumentList, narrowed: boolean): string {
    const results = this.i18n.messages.documents.list.results;
    const total = String(list.total);
    if (!narrowed) {
      return (list.total === 1 ? results.allOne : results.allOther).replace('{total}', total);
    }
    return this.counts.present(list.items.length, results).replace('{total}', total);
  }
}
