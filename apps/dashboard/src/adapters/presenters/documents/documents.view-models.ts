/** View models of the documents screens, produced by their presenters. */

import type { ProgressStepViewModel, StatusViewModel } from '../display.view-models';

export interface DocumentsViewModel {
  appliedFilterCount: number;
  /** "2 résultats sur 7 ·" */
  resultSummary: string;
  activeFilters: { label: string; value: string }[];
  filters: DocumentFiltersViewModel;
  documents: DocumentRowModel[];
}

export interface DocumentSentViewModel {
  description: string;
  type: string;
  fileName: string;
  sentAt: string;
  recipient: string;
  status: StatusViewModel;
  steps: ProgressStepViewModel[];
}

export interface DocumentUploadViewModel {
  form: DocumentUploadFormModel;
  mobileForm: MobileDocumentUploadFormModel;
}

export interface DocumentFiltersViewModel {
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

export interface DocumentTypeOptionModel {
  value: string;
  /** Remix Icon class, e.g. `ri-first-aid-kit-line`. */
  icon: string;
  label: string;
  /** Label of the compact mobile chip ("Administratif"). */
  shortLabel: string;
  description: string;
}

export interface DocumentUploadFormModel {
  types: DocumentTypeOptionModel[];
  selectedType: string;
  /** Reminder tied to the selected type. */
  note: string;
  file: { name: string; details: string };
  comment: string;
}

export interface MobileDocumentUploadFormModel {
  types: DocumentTypeOptionModel[];
  selectedType: string;
  note: string;
  file: { name: string; details: string };
}
