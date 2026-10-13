import { PageContent } from '../../common/page/PageContent';
import { i18n } from '../../i18n/i18n';
import { Badge } from '../../shared/badge';
import { ExpenseReportTotals } from './components/ExpenseReportTotals';
import { ExpensesTable } from './components/ExpensesTable';
import type { ExpenseReportViewModel } from '../../../../adapters/presenters/expense-reports/expense-reports.view-models';

/** P6.3 — a draft expense report and its expenses. */
export function ExpenseReport({ model }: { model: ExpenseReportViewModel }) {
  return (
    <PageContent className="gap-4.5 md:py-7">
      <div className="flex items-center gap-3">
        <h1 className="text-24 leading-8 font-bold text-heading">{model.title}</h1>
        <button
          type="button"
          aria-label={i18n.messages.expenseReports.report.rename}
          className="flex text-primary focus-visible:outline-none focus-visible:shadow-focus"
        >
          <i aria-hidden className="ri-edit-line text-18" />
        </button>
        <Badge tone={model.status.tone}>{model.status.label}</Badge>
      </div>
      <ExpensesTable
        expenses={model.expenses}
        vatTotal={model.vatTotal}
        newExpense={model.newExpense}
      />
      <ExpenseReportTotals total={model.total} summary={model.summary} />
    </PageContent>
  );
}
