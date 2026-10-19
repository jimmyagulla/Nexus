import { ActiveFilters } from '../../common/data/ActiveFilters';
import { FilterChip } from '../../common/data/FilterChip';
import { PageContent } from '../../common/page/PageContent';
import { PageHeader } from '../../common/page/PageHeader';
import { i18n } from '../../i18n/i18n';
import { ExpenseKpiCard } from './components/ExpenseKpiCard';
import { ExpenseReportsTable } from './components/ExpenseReportsTable';
import { ExpenseReportsToolbar } from './components/ExpenseReportsToolbar';
import { NewExpenseReportButton } from './components/NewExpenseReportButton';
import { SubmittedBanner } from './components/SubmittedBanner';
import type { ExpenseReportsListHandlers } from './components/expense-reports-list.handlers';
import type { ExpenseReportActiveFilterModel } from '../../../../adapters/presenters/expense-reports/expense-report-active-filters.presenter';
import type { ExpenseReportConfirmationModel } from '../../../../adapters/presenters/expense-reports/expense-report-confirmation.presenter';
import type { ExpenseReportFiltersModel } from '../../../../adapters/presenters/expense-reports/expense-report-filters.presenter';
import type { ExpenseKpiModel } from '../../../../adapters/presenters/expense-reports/expense-report-kpis.presenter';
import type { ExpenseReportListSummaryModel } from '../../../../adapters/presenters/expense-reports/expense-report-list-summary.presenter';
import type { ExpenseReportRowModel } from '../../../../adapters/presenters/expense-reports/expense-report-row.presenter';
import type { ExpenseReportSortModel } from '../../../../adapters/presenters/expense-reports/expense-report-sort.presenter';

interface ExpenseReportsProps {
  kpis: ExpenseKpiModel[];
  summary: ExpenseReportListSummaryModel;
  activeFilters: ExpenseReportActiveFilterModel[];
  filters: ExpenseReportFiltersModel;
  sort: ExpenseReportSortModel;
  rows: ExpenseReportRowModel[];
  /** Text of the search box, as typed. */
  search: string;
  /** Banner of the report just submitted or changed, if any. */
  confirmation: ExpenseReportConfirmationModel | null;
  handlers: ExpenseReportsListHandlers;
  onNew: () => void;
  onDismissConfirmation: () => void;
}

/** P6.1 — the employee's expense reports. */
export function ExpenseReports({
  kpis,
  summary,
  activeFilters,
  filters,
  sort,
  rows,
  search,
  confirmation,
  handlers,
  onNew,
  onDismissConfirmation,
}: ExpenseReportsProps) {
  const labels = i18n.messages.expenseReports.list;

  return (
    <PageContent className="gap-4.5 md:py-7">
      {confirmation !== null && (
        <SubmittedBanner
          title={confirmation.title}
          description={confirmation.description}
          onDismiss={onDismissConfirmation}
        />
      )}
      <PageHeader
        className="*:gap-1"
        title={labels.title}
        description={labels.description}
        actions={<NewExpenseReportButton onClick={onNew} />}
      />
      <div className="grid grid-cols-3 gap-3.5">
        {kpis.map((kpi) => (
          <ExpenseKpiCard key={kpi.label} kpi={kpi} />
        ))}
      </div>
      <ExpenseReportsToolbar
        search={search}
        appliedFilterCount={summary.appliedFilterCount}
        filters={filters}
        handlers={handlers}
      />
      <ActiveFilters
        summary={summary.resultSummary}
        canClear={summary.canClearFilters}
        onClear={handlers.onClearFilters}
      >
        {activeFilters.map((filter) => (
          <FilterChip
            key={filter.key}
            label={filter.label}
            value={filter.value}
            onRemove={() => handlers.onRemoveFilter(filter.key)}
          />
        ))}
      </ActiveFilters>
      <ExpenseReportsTable
        rows={rows}
        sort={sort}
        emptyMessage={summary.emptyMessage}
        highlightedId={confirmation?.id ?? null}
        onCycleSort={handlers.onCycleSort}
        onOpen={handlers.onOpen}
      />
    </PageContent>
  );
}
