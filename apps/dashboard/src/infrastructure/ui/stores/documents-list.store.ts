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
  /** One emitter, or null for every emitter. */
  setEmitter: (emitter: DocumentEmitter | null) => void;
  /** Calendar day `aaaa-mm-jj`, or '' to drop that bound. */
  setFrom: (from: string) => void;
  setTo: (to: string) => void;
  /** Neutral → ascending → descending → neutral; another column starts ascending. */
  cycleSort: (sort: DocumentSort) => void;
  removeFilter: (key: DocumentFilterKey) => void;
  clearFilters: () => void;
}

const noFilter: Pick<DocumentsListState, 'categories' | 'statuses' | 'emitters' | 'from' | 'to'> = {
  categories: [],
  statuses: [],
  emitters: [],
  from: null,
  to: null,
};

function toggled<T>(values: readonly T[], value: T): T[] {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

function dayOrNull(day: string): string | null {
  return day === '' ? null : day;
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
  setEmitter: (emitter) => set({ emitters: emitter === null ? [] : [emitter] }),
  setFrom: (from) => set({ from: dayOrNull(from) }),
  setTo: (to) => set({ to: dayOrNull(to) }),
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
        return set({ from: null, to: null });
      case 'emitter':
        return set({ emitters: [] });
    }
  },
  clearFilters: () => set(noFilter),
}));
