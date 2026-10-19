import { EXPENSE_REPORT_SEARCH_MAX_LENGTH } from '@hexagonal-monorepo-template/domain';
import { FilterButton } from '../../../common/data/FilterButton';
import { SearchField } from '../../../common/data/SearchField';
import { i18n } from '../../../i18n/i18n';
import { Sheet, SheetTrigger } from '../../../shared/sheet';
import { ExpenseReportFiltersSheet } from './ExpenseReportFiltersSheet';
import type { ExpenseReportsListHandlers } from './expense-reports-list.handlers';
import type { ExpenseReportFiltersModel } from '../../../../../adapters/presenters/expense-reports/expense-report-filters.presenter';

interface ExpenseReportsToolbarProps {
  /** Text of the search box, as typed. */
  search: string;
  appliedFilterCount: number;
  filters: ExpenseReportFiltersModel;
  handlers: ExpenseReportsListHandlers;
}

/** Search box and "Filtres" panel of the expense reports list. */
export function ExpenseReportsToolbar({
  search,
  appliedFilterCount,
  filters,
  handlers,
}: ExpenseReportsToolbarProps) {
  return (
    <div className="flex items-center gap-2">
      <SearchField
        placeholder={i18n.messages.expenseReports.list.search}
        value={search}
        maxLength={EXPENSE_REPORT_SEARCH_MAX_LENGTH}
        onValueChange={handlers.onSearchChange}
      />
      <Sheet>
        <SheetTrigger asChild>
          <FilterButton count={appliedFilterCount} />
        </SheetTrigger>
        <ExpenseReportFiltersSheet model={filters} handlers={handlers} />
      </Sheet>
    </div>
  );
}
