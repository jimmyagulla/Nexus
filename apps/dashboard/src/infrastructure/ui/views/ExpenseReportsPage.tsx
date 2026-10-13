import { useState } from 'react';
import { ExpenseReportFilterInput } from '@hexagonal-monorepo-template/domain';
import { ErrorPresenter } from '../../../adapters/presenters/error.presenter';
import { ExpenseReportsScreenComposition } from '../../composition/expense-reports.composition';
import { useCreateExpenseReport } from '../hooks/useCreateExpenseReport';
import { useGetExpenseReports } from '../hooks/useGetExpenseReports';
import { i18n } from '../i18n/i18n';
import { ExpenseReports } from './ExpenseReports';

interface ExpenseReportsPageProps {
  title: string;
  emptyMessage: string | null;
  byEmployee?: boolean;
  deps: ExpenseReportsScreenComposition;
  onOpen: (reportId: string) => void;
}

export function ExpenseReportsPage({
  title,
  emptyMessage,
  byEmployee = false,
  deps,
  onOpen,
}: ExpenseReportsPageProps) {
  const [filter, setFilter] = useState<ExpenseReportFilterInput>({});
  const reports = useGetExpenseReports(deps, filter);
  const create = useCreateExpenseReport(deps.reports);

  if (reports.isPending) {
    return <p>{i18n.messages.loading}</p>;
  }

  if (reports.isError) {
    return <p>{deps.reports.errorPresenter.present(reports.error)}</p>;
  }

  return (
    <ExpenseReports
      title={title}
      emptyMessage={Object.keys(filter).length === 0 ? emptyMessage : null}
      byEmployee={byEmployee}
      model={reports.data}
      errorPresenter={deps.reports.errorPresenter}
      createError={refusalOf(deps.reports.errorPresenter, create)}
      onCreate={(values) => accepted(create.mutateAsync(values.label))}
      onFilter={setFilter}
      onResetFilter={() => setFilter({})}
      onOpen={onOpen}
    />
  );
}

function refusalOf(
  presenter: ErrorPresenter,
  mutation: { isError: boolean; error: unknown },
): string | null {
  return mutation.isError ? presenter.present(mutation.error) : null;
}

function accepted(mutation: Promise<unknown>): Promise<boolean> {
  return mutation.then(
    () => true,
    () => false,
  );
}
