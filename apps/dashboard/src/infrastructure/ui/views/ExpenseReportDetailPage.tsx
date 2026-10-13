import { ErrorPresenter } from '../../../adapters/presenters/error.presenter';
import { ExpenseReportsScreenComposition } from '../../composition/expense-reports.composition';
import { readReceiptFile } from '../features/expense-reports/receipts/read-receipt-file';
import { useAddExpense } from '../hooks/useAddExpense';
import { useAttachReceipt } from '../hooks/useAttachReceipt';
import { useGetExpenseCategories } from '../hooks/useGetExpenseCategories';
import { useGetExpenseReport } from '../hooks/useGetExpenseReport';
import { useRemoveExpense } from '../hooks/useRemoveExpense';
import { useSubmitExpenseReport } from '../hooks/useSubmitExpenseReport';
import { useUpdateExpense } from '../hooks/useUpdateExpense';
import { i18n } from '../i18n/i18n';
import { ExpenseReportDetail } from './ExpenseReportDetail';

interface ExpenseReportDetailPageProps {
  reportId: string;
  deps: ExpenseReportsScreenComposition;
  onBack: () => void;
}

export function ExpenseReportDetailPage({
  reportId,
  deps,
  onBack,
}: ExpenseReportDetailPageProps) {
  const report = useGetExpenseReport(reportId, deps);
  const categories = useGetExpenseCategories(deps.categories);
  const addExpense = useAddExpense(reportId, deps.reports);
  const updateExpense = useUpdateExpense(reportId, deps.reports);
  const removeExpense = useRemoveExpense(reportId, deps.reports);
  const attachReceipt = useAttachReceipt(reportId, deps.reports);
  const submit = useSubmitExpenseReport(reportId, deps.reports);

  if (report.isPending || categories.isPending) {
    return <p>{i18n.messages.loading}</p>;
  }

  if (report.isError) {
    return <p>{deps.reports.errorPresenter.present(report.error)}</p>;
  }

  if (categories.isError) {
    return <p>{deps.categories.errorPresenter.present(categories.error)}</p>;
  }

  return (
    <ExpenseReportDetail
      report={report.data}
      categories={categories.data}
      errorPresenter={deps.reports.errorPresenter}
      addExpenseError={refusalOf(deps.reports.errorPresenter, addExpense)}
      editExpenseError={refusalOf(deps.reports.errorPresenter, updateExpense)}
      removeExpenseError={refusalOf(deps.reports.errorPresenter, removeExpense)}
      attachReceiptError={refusalOf(deps.reports.errorPresenter, attachReceipt)}
      submitError={refusalOf(deps.reports.errorPresenter, submit)}
      onAddExpense={(values) => accepted(addExpense.mutateAsync(values))}
      onEditExpense={(expenseId, values) =>
        accepted(updateExpense.mutateAsync({ expenseId, expense: values }))
      }
      onRemoveExpense={(expenseId) => removeExpense.mutate(expenseId)}
      onAttachReceipt={(values) =>
        accepted(
          readReceiptFile(values.file).then((receipt) =>
            attachReceipt.mutateAsync(receipt),
          ),
        )
      }
      onSubmit={() => submit.mutate()}
      onBack={onBack}
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
