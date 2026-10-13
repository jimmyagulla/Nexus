import { PageContent } from '../../common/page/PageContent';
import { PageHeader } from '../../common/page/PageHeader';
import { i18n } from '../../i18n/i18n';
import { ExpenseReportsTable } from './components/ExpenseReportsTable';
import { ExpenseReportsToolbar } from './components/ExpenseReportsToolbar';
import { NewExpenseReportButton } from './components/NewExpenseReportButton';
import { SubmittedBanner } from './components/SubmittedBanner';
import type { ExpenseReportSubmittedViewModel } from '../../../../adapters/presenters/expense-reports/expense-reports.view-models';

/** P6.4 — the list again, once a note is submitted for refund. */
export function ExpenseReportSubmitted({
  model,
}: {
  model: ExpenseReportSubmittedViewModel;
}) {
  return (
    <PageContent className="gap-4.5 md:py-7">
      <SubmittedBanner
        title={model.confirmation.title}
        description={model.confirmation.description}
      />
      <PageHeader
        title={i18n.messages.expenseReports.list.title}
        actions={<NewExpenseReportButton draftId={model.draftId} />}
      />
      <ExpenseReportsToolbar />
      <ExpenseReportsTable reports={model.reports} />
    </PageContent>
  );
}
