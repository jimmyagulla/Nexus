import type { StatusViewModel } from '../display.types';

export interface DocumentsViewModel {
  appliedFilterCount: number;
  /** "2 résultats sur 7 ·" */
  resultSummary: string;
  activeFilters: { label: string; value: string }[];
  filters: DocumentFiltersModel;
  documents: DocumentRowModel[];
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

/**
 * Presents the documents list.
 * Until its use case exists, the composition root hands it placeholder data,
 * which it returns as is.
 */
export class DocumentsPresenter {
  constructor(private readonly placeholder: DocumentsViewModel) {}

  present(): DocumentsViewModel {
    return this.placeholder;
  }
}
