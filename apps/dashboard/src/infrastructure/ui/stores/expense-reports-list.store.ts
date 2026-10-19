import { create } from 'zustand';
import {
  DEFAULT_EXPENSE_REPORT_SORT_DIRECTION,
  ExpenseReportCategory,
  ExpenseReportProofPresence,
  ExpenseReportSort,
  ExpenseReportSortDirection,
  ExpenseReportStatus,
} from '@hexagonal-monorepo-template/domain';
import {
  EVERY_EXPENSE_REPORT,
  type ExpenseReportsListState,
} from '../../../adapters/controllers/expense-reports.controller';
import type { ExpenseReportFilterKey } from '../../../adapters/presenters/expense-reports/expense-report-active-filters.presenter';

interface ExpenseReportsListStore extends ExpenseReportsListState {
  setSearch: (search: string) => void;
  toggleCategory: (category: ExpenseReportCategory) => void;
  toggleStatus: (status: ExpenseReportStatus) => void;
  toggleProject: (project: string) => void;
  /** With or without a receipt, or null for every report. */
  setProof: (proof: ExpenseReportProofPresence | null) => void;
  /** Calendar day `aaaa-mm-jj`, or '' to drop that bound. */
  setFrom: (from: string) => void;
  setTo: (to: string) => void;
  /** Amount as typed, or '' to drop that bound. */
  setMinAmount: (amount: string) => void;
  setMaxAmount: (amount: string) => void;
  /** Neutral → ascending → descending → neutral; another column starts ascending. */
  cycleSort: (sort: ExpenseReportSort) => void;
  removeFilter: (key: ExpenseReportFilterKey) => void;
  clearFilters: () => void;
}

const noFilter: Omit<ExpenseReportsListState, 'search' | 'sort' | 'direction'> = {
  categories: [],
  statuses: [],
  projects: [],
  proofs: [],
  from: null,
  to: null,
  minAmount: null,
  maxAmount: null,
};

function toggled<T>(values: readonly T[], value: T): T[] {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

function textOrNull(text: string): string | null {
  return text.trim() === '' ? null : text;
}

/** Search, filters and ordering of the expense reports list; kept while navigating. */
export const useExpenseReportsListStore = create<ExpenseReportsListStore>((set) => ({
  ...EVERY_EXPENSE_REPORT,

  setSearch: (search) => set({ search }),
  toggleCategory: (category) =>
    set((state) => ({ categories: toggled(state.categories, category) })),
  toggleStatus: (status) =>
    set((state) => ({ statuses: toggled(state.statuses, status) })),
  toggleProject: (project) =>
    set((state) => ({ projects: toggled(state.projects, project) })),
  setProof: (proof) => set({ proofs: proof === null ? [] : [proof] }),
  setFrom: (from) => set({ from: textOrNull(from) }),
  setTo: (to) => set({ to: textOrNull(to) }),
  setMinAmount: (amount) => set({ minAmount: textOrNull(amount) }),
  setMaxAmount: (amount) => set({ maxAmount: textOrNull(amount) }),
  cycleSort: (sort) =>
    set((state) => {
      if (state.sort !== sort) {
        return { sort, direction: ExpenseReportSortDirection.ASC };
      }
      return state.direction === ExpenseReportSortDirection.ASC
        ? { direction: ExpenseReportSortDirection.DESC }
        : { sort: null, direction: DEFAULT_EXPENSE_REPORT_SORT_DIRECTION };
    }),
  removeFilter: (key) => {
    switch (key) {
      case 'categories':
        return set({ categories: [] });
      case 'statuses':
        return set({ statuses: [] });
      case 'projects':
        return set({ projects: [] });
      case 'proofs':
        return set({ proofs: [] });
      case 'period':
        return set({ from: null, to: null });
      case 'amount':
        return set({ minAmount: null, maxAmount: null });
    }
  },
  clearFilters: () => set(noFilter),
}));
