import { ExpenseReportFilterInput } from '@hexagonal-monorepo-template/domain';
import type { ExpenseReportListViewModel } from '../../../adapters/presenters/expense-report.presenter';
import { ErrorPresenter } from '../../../adapters/presenters/error.presenter';
import { CreateExpenseReportDialog } from '../features/expense-reports/create-expense-report/CreateExpenseReportDialog';
import type { CreateExpenseReportValues } from '../features/expense-reports/create-expense-report/create-expense-report.schema';
import { ExpenseReportFilterForm } from '../features/expense-reports/filters/ExpenseReportFilterForm';
import { ExpenseReportList } from '../features/expense-reports/list/ExpenseReportList';
import { i18n } from '../i18n/i18n';

interface ExpenseReportsProps {
  title: string;
  emptyMessage: string | null;
  byEmployee: boolean;
  model: ExpenseReportListViewModel;
  errorPresenter: ErrorPresenter;
  createError: string | null;
  onCreate: (values: CreateExpenseReportValues) => Promise<boolean>;
  onFilter: (filter: ExpenseReportFilterInput) => void;
  onResetFilter: () => void;
  onOpen: (reportId: string) => void;
}

export function ExpenseReports({
  title,
  emptyMessage,
  byEmployee,
  model,
  errorPresenter,
  createError,
  onCreate,
  onFilter,
  onResetFilter,
  onOpen,
}: ExpenseReportsProps) {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">{title}</h1>

      {model.canCreate ? (
        <CreateExpenseReportDialog
          errorPresenter={errorPresenter}
          submissionError={createError}
          onSubmit={onCreate}
        />
      ) : null}

      <ExpenseReportFilterForm
        byEmployee={byEmployee}
        errorPresenter={errorPresenter}
        onApply={onFilter}
        onReset={onResetFilter}
      />

      <p className="text-sm font-medium">
        {i18n.messages.expenseReports.filters.total} : {model.totalAmount}
      </p>

      <ExpenseReportList
        reports={model.reports}
        emptyMessage={emptyMessage}
        onOpen={onOpen}
      />
    </div>
  );
}
