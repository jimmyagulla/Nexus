import { Link } from '@tanstack/react-router';
import { PageContent } from '../../common/page/PageContent';
import { PageHeader } from '../../common/page/PageHeader';
import { i18n } from '../../i18n/i18n';
import { AppRoutes } from '../../routes/app-routes';
import { Button } from '../../shared/button';
import { PendingRequestAlert } from './components/PendingRequestAlert';
import { type ProfessionalExpenseRowModel } from './components/ProfessionalExpenseRow';
import { ProfessionalExpensesTable } from './components/ProfessionalExpensesTable';
import { ProfessionalExpensesToolbar } from './components/ProfessionalExpensesToolbar';

export interface ProfessionalExpensesViewModel {
  pending: { title: string; description: string };
  requests: ProfessionalExpenseRowModel[];
}

/** P7.1 — the employee's professional expense requests. */
export function ProfessionalExpenses({
  model,
}: {
  model: ProfessionalExpensesViewModel;
}) {
  const labels = i18n.messages.professionalExpenses.list;

  return (
    <PageContent className="gap-4.5 md:py-7">
      <PageHeader
        className="*:gap-1"
        title={labels.title}
        description={labels.description}
        actions={
          <Button asChild>
            <Link to={AppRoutes.professionalExpenseRequest}>
              <i aria-hidden className="ri-add-line text-18" />
              {labels.newRequest}
            </Link>
          </Button>
        }
      />
      <PendingRequestAlert
        title={model.pending.title}
        description={model.pending.description}
      />
      <ProfessionalExpensesToolbar />
      <ProfessionalExpensesTable requests={model.requests} />
    </PageContent>
  );
}
