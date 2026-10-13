import type { ExpenseCategoryViewModel } from '../../../adapters/presenters/expense-category.presenter';
import type { ExpenseReportViewModel } from '../../../adapters/presenters/expense-report.presenter';
import { ErrorPresenter } from '../../../adapters/presenters/error.presenter';
import { SubmissionError } from '../common/errors/SubmissionError';
import { AddExpenseDialog } from '../features/expense-reports/expenses/AddExpenseDialog';
import { ExpenseList } from '../features/expense-reports/expenses/ExpenseList';
import type { ExpenseValues } from '../features/expense-reports/expenses/expense.schema';
import { AttachReceiptDialog } from '../features/expense-reports/receipts/AttachReceiptDialog';
import { ReceiptList } from '../features/expense-reports/receipts/ReceiptList';
import type { ReceiptValues } from '../features/expense-reports/receipts/receipt.schema';
import { Button } from '../shared/button';
import { i18n } from '../i18n/i18n';

interface ExpenseReportDetailProps {
  report: ExpenseReportViewModel;
  categories: ExpenseCategoryViewModel[];
  errorPresenter: ErrorPresenter;
  addExpenseError: string | null;
  editExpenseError: string | null;
  removeExpenseError: string | null;
  attachReceiptError: string | null;
  submitError: string | null;
  onAddExpense: (values: ExpenseValues) => Promise<boolean>;
  onEditExpense: (expenseId: string, values: ExpenseValues) => Promise<boolean>;
  onRemoveExpense: (expenseId: string) => void;
  onAttachReceipt: (values: ReceiptValues) => Promise<boolean>;
  onSubmit: () => void;
  onBack: () => void;
}

export function ExpenseReportDetail({
  report,
  categories,
  errorPresenter,
  addExpenseError,
  editExpenseError,
  removeExpenseError,
  attachReceiptError,
  submitError,
  onAddExpense,
  onEditExpense,
  onRemoveExpense,
  onAttachReceipt,
  onSubmit,
  onBack,
}: ExpenseReportDetailProps) {
  return (
    <div className="space-y-8">
      <Button type="button" variant="outline" onClick={onBack}>
        {i18n.messages.expenseReports.back}
      </Button>

      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">{report.label}</h1>
        <p className="text-muted-foreground">{report.statusLabel}</p>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">
          {i18n.messages.expenseReports.expensesTitle}
        </h2>
        <ExpenseList
          expenses={report.expenses}
          editable={report.editable}
          categories={categories}
          errorPresenter={errorPresenter}
          editError={editExpenseError}
          onEdit={onEditExpense}
          onRemove={onRemoveExpense}
        />
        <SubmissionError message={removeExpenseError} />
        <p className="text-lg font-semibold">
          {i18n.messages.expenseReports.total} : {report.total}
        </p>
        {report.editable ? (
          <AddExpenseDialog
            categories={categories}
            errorPresenter={errorPresenter}
            submissionError={addExpenseError}
            onSubmit={onAddExpense}
          />
        ) : null}
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">
          {i18n.messages.expenseReports.receiptsTitle}
        </h2>
        <ReceiptList receipts={report.receipts} />
        {report.editable ? (
          <AttachReceiptDialog
            errorPresenter={errorPresenter}
            submissionError={attachReceiptError}
            onSubmit={onAttachReceipt}
          />
        ) : null}
      </section>

      {report.editable ? (
        <section className="space-y-2">
          <SubmissionError message={submitError} />
          <Button type="button" onClick={onSubmit}>
            {i18n.messages.expenseReports.submit}
          </Button>
        </section>
      ) : null}
    </div>
  );
}
