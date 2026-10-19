import {
  countAppliedExpenseReportFilters,
  ExpenseReportList,
  ExpenseReportListCriteria,
  ExpenseReportProofPresence,
} from '@hexagonal-monorepo-template/domain';
import {
  i18n as appI18n,
  type I18n,
} from '../../../infrastructure/ui/i18n/i18n';
import type { ExpenseReportsListState } from '../../controllers/expense-reports.controller';
import type { CountLabelPresenter } from '../documents/count-label.presenter';
import type { FilterOptionModel } from '../documents/document-filters.presenter';
import {
  EXPENSE_REPORT_CATEGORY_DISPLAY_ORDER,
  EXPENSE_REPORT_STATUS_DISPLAY_ORDER,
} from './expense-report-display';

/** Value of the receipt toggle that keeps every report. */
export const ALL_PROOFS = 'all';

export interface ExpenseReportFiltersModel {
  /** "2 filtres appliqués" */
  appliedLabel: string;
  /** "Afficher 2 résultats" */
  showResultsLabel: string;
  categories: FilterOptionModel[];
  statuses: FilterOptionModel[];
  /** The projects of the person's reports; `id` is the project itself. */
  projects: FilterOptionModel[];
  noProjectsLabel: string;
  proofs: { value: string; label: string }[];
  proof: string;
  /** Calendar days `aaaa-mm-jj`, or '' when none is chosen. */
  from: string;
  to: string;
  /** Amounts as typed, or ''. */
  minAmount: string;
  maxAmount: string;
}

/** Presents the "Filtres" panel of the expense reports list. */
export class ExpenseReportFiltersPresenter {
  constructor(
    private readonly counts: CountLabelPresenter,
    private readonly i18n: I18n = appI18n,
  ) {}

  /** `state` holds the controls as set, `criteria` what the list was asked with. */
  present(
    list: ExpenseReportList,
    state: ExpenseReportsListState,
    criteria: ExpenseReportListCriteria,
  ): ExpenseReportFiltersModel {
    const labels = this.i18n.messages.expenseReports;
    return {
      appliedLabel: this.counts.present(countAppliedExpenseReportFilters(criteria), labels.filters.applied),
      showResultsLabel: this.counts.present(list.items.length, labels.filters.showResults),
      categories: EXPENSE_REPORT_CATEGORY_DISPLAY_ORDER.map((category) => ({
        id: category,
        label: labels.categories[category],
        count: list.categoryCounts[category],
        checked: state.categories.includes(category),
      })),
      statuses: EXPENSE_REPORT_STATUS_DISPLAY_ORDER.map((status) => ({
        id: status,
        label: labels.statuses[status],
        count: list.statusCounts[status],
        checked: state.statuses.includes(status),
      })),
      projects: list.projectCounts.map(({ project, count }) => ({
        id: project,
        label: project,
        count,
        checked: state.projects.includes(project),
      })),
      noProjectsLabel: labels.filters.noProjects,
      proofs: [
        { value: ALL_PROOFS, label: labels.filters.proofAll },
        { value: ExpenseReportProofPresence.WITH, label: labels.proofs.WITH },
        { value: ExpenseReportProofPresence.WITHOUT, label: labels.proofs.WITHOUT },
      ],
      proof: state.proofs[0] ?? ALL_PROOFS,
      from: state.from ?? '',
      to: state.to ?? '',
      minAmount: state.minAmount ?? '',
      maxAmount: state.maxAmount ?? '',
    };
  }
}
