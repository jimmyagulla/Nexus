import { ErrorPresenter } from '../../../adapters/presenters/error.presenter';
import { ExpenseReportsScreenComposition } from '../../composition/expense-reports.composition';
import { useOpenExpenseReport } from '../hooks/useOpenExpenseReport';
import { useOpenReceipt } from '../hooks/useOpenReceipt';
import { useRefuseExpenseReport } from '../hooks/useRefuseExpenseReport';
import { useRequestExpenseReportInformation } from '../hooks/useRequestExpenseReportInformation';
import { useValidateExpenseReport } from '../hooks/useValidateExpenseReport';
import { i18n } from '../i18n/i18n';
import { EmployerExpenseReport } from './EmployerExpenseReport';

interface EmployerExpenseReportPageProps {
  reportId: string;
  deps: ExpenseReportsScreenComposition;
  onBack: () => void;
}

export function EmployerExpenseReportPage({
  reportId,
  deps,
  onBack,
}: EmployerExpenseReportPageProps) {
  const report = useOpenExpenseReport(reportId, deps);
  const requestInformation = useRequestExpenseReportInformation(
    reportId,
    deps.reports,
  );
  const validate = useValidateExpenseReport(reportId, deps.reports);
  const refuse = useRefuseExpenseReport(reportId, deps.reports);
  const openReceipt = useOpenReceipt(reportId, deps.reports);

  if (report.isPending) {
    return <p>{i18n.messages.loading}</p>;
  }

  if (report.isError) {
    return <p>{deps.reports.errorPresenter.present(report.error)}</p>;
  }

  const presenter = deps.reports.errorPresenter;

  return (
    <EmployerExpenseReport
      report={report.data}
      actionError={
        refusalOf(presenter, requestInformation) ??
        refusalOf(presenter, validate) ??
        refusalOf(presenter, refuse)
      }
      openReceiptError={refusalOf(presenter, openReceipt)}
      onRequestInformation={() => requestInformation.mutate()}
      onValidate={() => validate.mutate()}
      onRefuse={() => refuse.mutate()}
      onOpenReceipt={(receiptId) => openReceipt.mutate(receiptId)}
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
