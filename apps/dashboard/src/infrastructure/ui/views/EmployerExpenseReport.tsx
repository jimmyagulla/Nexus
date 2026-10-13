import type { ExpenseReportViewModel } from '../../../adapters/presenters/expense-report.presenter';
import { SubmissionError } from '../common/errors/SubmissionError';
import { ExpenseList } from '../features/expense-reports/expenses/ExpenseList';
import { ReceiptList } from '../features/expense-reports/receipts/ReceiptList';
import { ReviewActions } from '../features/expense-reports/review/ReviewActions';
import { Button } from '../shared/button';
import { i18n } from '../i18n/i18n';

interface EmployerExpenseReportProps {
  report: ExpenseReportViewModel;
  actionError: string | null;
  confirmation: string | null;
  openReceiptError: string | null;
  onRequestInformation: () => void;
  onValidate: () => void;
  onRefuse: () => void;
  onReimburse: () => void;
  onOpenReceipt: (receiptId: string) => void;
  onBack: () => void;
}

export function EmployerExpenseReport({
  report,
  actionError,
  confirmation,
  openReceiptError,
  onRequestInformation,
  onValidate,
  onRefuse,
  onReimburse,
  onOpenReceipt,
  onBack,
}: EmployerExpenseReportProps) {
  return (
    <div className="space-y-8">
      <Button type="button" variant="outline" onClick={onBack}>
        {i18n.messages.expenseReports.back}
      </Button>

      {confirmation === null ? null : (
        <p role="status" className="text-sm font-medium text-primary">
          {confirmation}
        </p>
      )}

      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">{report.label}</h1>
        <p className="text-muted-foreground">{report.statusLabel}</p>
        {report.reimbursed === null ? null : (
          <p>
            {i18n.messages.expenseReports.reimbursedAmount} : {report.reimbursed}
          </p>
        )}
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">
          {i18n.messages.expenseReports.expensesTitle}
        </h2>
        <ExpenseList expenses={report.expenses} />
        <p className="text-lg font-semibold">
          {i18n.messages.expenseReports.total} : {report.total}
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">
          {i18n.messages.expenseReports.receiptsTitle}
        </h2>
        <ReceiptList receipts={report.receipts} onOpen={onOpenReceipt} />
        <SubmissionError message={openReceiptError} />
      </section>

      <section className="space-y-2">
        <SubmissionError message={actionError} />
        <ReviewActions
          requestable={report.requestable}
          decidable={report.decidable}
          reimbursable={report.reimbursable}
          onRequestInformation={onRequestInformation}
          onValidate={onValidate}
          onRefuse={onRefuse}
          onReimburse={onReimburse}
        />
      </section>
    </div>
  );
}
