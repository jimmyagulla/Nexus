import { create } from 'zustand';
import {
  DEFAULT_DOCUMENT_SORT_DIRECTION,
  DocumentCategory,
  DocumentEmitter,
  DocumentSort,
  DocumentSortDirection,
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
  /** Neutral → ascending → descending → neutral; another column starts ascending. */
  cycleSort: (sort: DocumentSort) => void;
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
  sort: null,
  direction: DEFAULT_DOCUMENT_SORT_DIRECTION,

  setSearch: (search) => set({ search }),
  toggleCategory: (category) =>
    set((state) => ({ categories: toggled(state.categories, category) })),
  toggleStatus: (status) =>
    set((state) => ({ statuses: toggled(state.statuses, status) })),
  setEmitter: (emitter) => set({ emitter }),
  setFrom: (from) => set({ from }),
  setTo: (to) => set({ to }),
  cycleSort: (sort) =>
    set((state) => {
      if (state.sort !== sort) {
        return { sort, direction: DocumentSortDirection.ASC };
      }
      return state.direction === DocumentSortDirection.ASC
        ? { direction: DocumentSortDirection.DESC }
        : { sort: null, direction: DEFAULT_DOCUMENT_SORT_DIRECTION };
    }),
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
