import {
  countAppliedDocumentFilters,
  DocumentEmitter,
  DocumentList,
  DocumentListCriteria,
} from '@hexagonal-monorepo-template/domain';
import {
  i18n as appI18n,
  type I18n,
} from '../../../infrastructure/ui/i18n/i18n';
import type { DocumentsListState } from '../../controllers/documents.controller';
import type { CountLabelPresenter } from './count-label.presenter';
import {
  DOCUMENT_CATEGORY_DISPLAY_ORDER,
  DOCUMENT_STATUS_DISPLAY_ORDER,
} from './document-display';

/** Value of the emitter toggle that keeps every emitter. */
export const ALL_EMITTERS = 'all';

export interface FilterOptionModel {
  id: string;
  label: string;
  count: number;
  checked: boolean;
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
  /** Calendar days `aaaa-mm-jj`, or '' when none is chosen. */
  from: string;
  to: string;
}

/** Presents the "Filtres" panel of the documents list. */
export class DocumentFiltersPresenter {
  constructor(
    private readonly counts: CountLabelPresenter,
    private readonly i18n: I18n = appI18n,
  ) {}

  /** `state` holds the controls as set, `criteria` what the list was asked with. */
  present(
    list: DocumentList,
    state: DocumentsListState,
    criteria: DocumentListCriteria,
  ): DocumentFiltersModel {
    const labels = this.i18n.messages.documents;
    return {
      appliedLabel: this.counts.present(countAppliedDocumentFilters(criteria), labels.filters.applied),
      showResultsLabel: this.counts.present(list.items.length, labels.filters.showResults),
      categories: DOCUMENT_CATEGORY_DISPLAY_ORDER.map((category) => ({
        id: category,
        label: labels.categories[category],
        count: list.categoryCounts[category],
        checked: state.categories.includes(category),
      })),
      statuses: DOCUMENT_STATUS_DISPLAY_ORDER.map((status) => ({
        id: status,
        label: labels.statuses[status],
        count: list.statusCounts[status],
        checked: state.statuses.includes(status),
      })),
      emitters: [
        { value: ALL_EMITTERS, label: labels.filters.emitterAll },
        { value: DocumentEmitter.HR, label: labels.emitters.HR },
        { value: DocumentEmitter.SELF, label: labels.emitters.SELF },
      ],
      emitter: state.emitters[0] ?? ALL_EMITTERS,
      from: state.from ?? '',
      to: state.to ?? '',
    };
  }
}
