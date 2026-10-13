import { PageContent } from '../../common/page/PageContent';
import { type ExpenseFormModel } from '../../features/expense-reports/ExpenseForm';
import { i18n } from '../../i18n/i18n';
import { Badge, type BadgeProps } from '../../shared/badge';
import { ExpenseReportTotals } from './components/ExpenseReportTotals';
import { type ExpenseRowModel } from './components/ExpenseRow';
import { ExpensesTable } from './components/ExpensesTable';

export interface ExpenseReportViewModel {
  title: string;
  status: { label: string; tone: BadgeProps['tone'] };
  expenses: ExpenseRowModel[];
  /** "dont TVA 12,27 €" */
  vatTotal: string;
  total: string;
  /** "3 dépenses · 3 justificatifs · validation par …" */
  summary: string;
  /** Prefilled values of the "Ajouter une dépense" panel. */
  newExpense: ExpenseFormModel;
}

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
