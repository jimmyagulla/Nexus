import {
  DOCUMENT_SORTS,
  DocumentSort,
  DocumentSortDirection,
} from '@hexagonal-monorepo-template/domain';
import {
  i18n as appI18n,
  type I18n,
} from '../../../infrastructure/ui/i18n/i18n';
import type { DocumentsListState } from '../../controllers/documents.controller';

/** State of the sort icon of a column; a click moves to the next one. */
export type SortState = 'neutral' | 'asc' | 'desc';

export interface SortColumnModel {
  state: SortState;
  /** "Trier par Taille (ordre croissant)" */
  label: string;
}

/** Sort control of each orderable column. */
export type DocumentSortModel = Record<DocumentSort, SortColumnModel>;

/** Presents the sort icons of the column headers. */
export class DocumentSortPresenter {
  constructor(private readonly i18n: I18n = appI18n) {}

  present(state: Pick<DocumentsListState, 'sort' | 'direction'>): DocumentSortModel {
    return Object.fromEntries(
      DOCUMENT_SORTS.map((sort) => [sort, this.presentColumn(sort, state)]),
    ) as DocumentSortModel;
  }

  private presentColumn(
    sort: DocumentSort,
    state: Pick<DocumentsListState, 'sort' | 'direction'>,
  ): SortColumnModel {
    const labels = this.i18n.messages.documents.list.sort;
    const sorted = state.sort === sort;
    const ascending = state.direction === DocumentSortDirection.ASC;
    return {
      state: !sorted ? 'neutral' : ascending ? 'asc' : 'desc',
      label: labels.label
        .replace('{column}', this.columnLabel(sort))
        .replace('{state}', labels[!sorted ? 'NONE' : ascending ? 'ASC' : 'DESC']),
    };
  }

  private columnLabel(sort: DocumentSort): string {
    const columns = this.i18n.messages.documents.list.columns;
    const labels: Record<DocumentSort, string> = {
      NAME: columns.name,
      CATEGORY: columns.category,
      DATE: columns.date,
      SIZE: columns.size,
      STATUS: this.i18n.messages.common.status,
    };
    return labels[sort];
  }
}
