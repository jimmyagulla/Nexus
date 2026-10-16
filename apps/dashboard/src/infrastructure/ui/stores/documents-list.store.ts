import { create } from 'zustand';
import {
  DEFAULT_DOCUMENT_SORT,
  DocumentCategory,
  DocumentEmitter,
  DocumentSort,
  DocumentStatus,
} from '@hexagonal-monorepo-template/domain';
import type { DocumentsListState } from '../../../adapters/controllers/documents.controller';
import type { DocumentFilterKey } from '../../../adapters/presenters/documents/documents.presenter';

interface DocumentsListStore extends DocumentsListState {
  setSearch: (search: string) => void;
  toggleCategory: (category: DocumentCategory) => void;
  toggleStatus: (status: DocumentStatus) => void;
  setEmitter: (emitter: DocumentEmitter | null) => void;
  setFrom: (from: string) => void;
  setTo: (to: string) => void;
  setSort: (sort: DocumentSort) => void;
  removeFilter: (key: DocumentFilterKey) => void;
  clearFilters: () => void;
}

const noFilter = {
  categories: [] as DocumentCategory[],
  statuses: [] as DocumentStatus[],
  emitter: null as DocumentEmitter | null,
  from: '',
  to: '',
};

function toggled<T>(values: readonly T[], value: T): T[] {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

/** Search, filters and ordering of the documents list; kept while navigating. */
export const useDocumentsListStore = create<DocumentsListStore>((set) => ({
  search: '',
  ...noFilter,
  sort: DEFAULT_DOCUMENT_SORT,

  setSearch: (search) => set({ search }),
  toggleCategory: (category) =>
    set((state) => ({ categories: toggled(state.categories, category) })),
  toggleStatus: (status) =>
    set((state) => ({ statuses: toggled(state.statuses, status) })),
  setEmitter: (emitter) => set({ emitter }),
  setFrom: (from) => set({ from }),
  setTo: (to) => set({ to }),
  setSort: (sort) => set({ sort }),
  removeFilter: (key) => {
    switch (key) {
      case 'categories':
        return set({ categories: [] });
      case 'statuses':
        return set({ statuses: [] });
      case 'period':
        return set({ from: '', to: '' });
      case 'emitter':
        return set({ emitter: null });
    }
  },
  clearFilters: () => set(noFilter),
}));
