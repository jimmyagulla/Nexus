import type {
  ExpenseReportCategory,
  ExpenseReportProofPresence,
  ExpenseReportSort,
  ExpenseReportStatus,
} from '@hexagonal-monorepo-template/domain';
import type { ExpenseReportFilterKey } from '../../../../../adapters/presenters/expense-reports/expense-report-active-filters.presenter';

/** What the expense reports screen lets the person do. */
export interface ExpenseReportsListHandlers {
  onSearchChange: (search: string) => void;
  onToggleCategory: (category: ExpenseReportCategory) => void;
  onToggleStatus: (status: ExpenseReportStatus) => void;
  onToggleProject: (project: string) => void;
  onProofChange: (proof: ExpenseReportProofPresence | null) => void;
  onFromChange: (from: string) => void;
  onToChange: (to: string) => void;
  onMinAmountChange: (amount: string) => void;
  onMaxAmountChange: (amount: string) => void;
  onCycleSort: (sort: ExpenseReportSort) => void;
  onRemoveFilter: (key: ExpenseReportFilterKey) => void;
  onClearFilters: () => void;
  onOpen: (expenseReportId: string) => void;
}
