import { PageContent } from '../../common/page/PageContent';
import { PageHeader } from '../../common/page/PageHeader';
import { i18n } from '../../i18n/i18n';
import { ExpenseKpiCard } from './components/ExpenseKpiCard';
import { ExpenseReportsTable } from './components/ExpenseReportsTable';
import { ExpenseReportsToolbar } from './components/ExpenseReportsToolbar';
import { NewExpenseReportButton } from './components/NewExpenseReportButton';
import type { ExpenseReportsViewModel } from '../../../../adapters/presenters/expense-reports/expense-reports.presenter';

/** P6.1 — the employee's expense reports. */
export function ExpenseReports({ model }: { model: ExpenseReportsViewModel }) {
  const labels = i18n.messages.expenseReports.list;

  return (
    <PageContent className="gap-4.5 md:py-7">
      <PageHeader
        className="*:gap-1"
        title={labels.title}
        description={labels.description}
        actions={<NewExpenseReportButton draftId={model.draftId} />}
      />
      <div className="grid grid-cols-3 gap-3.5">
        {model.kpis.map((kpi) => (
          <ExpenseKpiCard key={kpi.label} kpi={kpi} />
        ))}
      </div>
      <ExpenseReportsToolbar withProfessionalExpensesHint />
      <ExpenseReportsTable reports={model.reports} />
    </PageContent>
  );
}
