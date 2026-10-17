import type {
  DocumentCategory,
  DocumentEmitter,
  DocumentSort,
  DocumentStatus,
} from '@hexagonal-monorepo-template/domain';
import type { DocumentFilterKey } from '../../../../../adapters/presenters/documents/document-active-filters.presenter';

/** What the documents screen lets the person do. */
export interface DocumentsListHandlers {
  onSearchChange: (search: string) => void;
  onToggleCategory: (category: DocumentCategory) => void;
  onToggleStatus: (status: DocumentStatus) => void;
  onEmitterChange: (emitter: DocumentEmitter | null) => void;
  onFromChange: (from: string) => void;
  onToChange: (to: string) => void;
  onCycleSort: (sort: DocumentSort) => void;
  onRemoveFilter: (key: DocumentFilterKey) => void;
  onClearFilters: () => void;
  onView: (documentId: string) => void;
  onDownload: (documentId: string) => void;
}
