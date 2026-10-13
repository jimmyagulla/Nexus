import type { ExpenseReportListViewModel } from '../../../adapters/presenters/expense-report.presenter';
import { ErrorPresenter } from '../../../adapters/presenters/error.presenter';
import { CreateExpenseReportDialog } from '../features/expense-reports/create-expense-report/CreateExpenseReportDialog';
import type { CreateExpenseReportValues } from '../features/expense-reports/create-expense-report/create-expense-report.schema';
import { ExpenseReportList } from '../features/expense-reports/list/ExpenseReportList';

interface ExpenseReportsProps {
  title: string;
  emptyMessage: string | null;
  model: ExpenseReportListViewModel;
  errorPresenter: ErrorPresenter;
  createError: string | null;
  onCreate: (values: CreateExpenseReportValues) => Promise<boolean>;
  onOpen: (reportId: string) => void;
}

export function ExpenseReports({
  title,
  emptyMessage,
  model,
  errorPresenter,
  createError,
  onCreate,
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

      <ExpenseReportList
        reports={model.reports}
        emptyMessage={emptyMessage}
        onOpen={onOpen}
      />
    </div>
  );
}
