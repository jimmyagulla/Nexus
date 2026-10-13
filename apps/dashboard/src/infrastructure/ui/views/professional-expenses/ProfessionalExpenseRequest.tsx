import { Link } from '@tanstack/react-router';
import { PageContent } from '../../common/page/PageContent';
import { PageHeader } from '../../common/page/PageHeader';
import { ProfessionalExpenseForm } from '../../features/professional-expenses/ProfessionalExpenseForm';
import { i18n } from '../../i18n/i18n';
import { AppRoutes } from '../../routes/app-routes';
import { Button } from '../../shared/button';
import { Card, CardFooter } from '../../shared/card';
import type { ProfessionalExpenseRequestViewModel } from '../../../../adapters/presenters/professional-expenses/professional-expenses.view-models';

/** P7.2 — new professional expense request. */
export function ProfessionalExpenseRequest({
  model,
}: {
  model: ProfessionalExpenseRequestViewModel;
}) {
  const labels = i18n.messages.professionalExpenses.request;

  return (
    <PageContent className="items-center gap-3.5 md:py-6">
      <PageHeader
        size="form"
        className="w-200"
        title={labels.title}
        description={labels.description}
      />
      <Card className="flex w-200 flex-col">
        <ProfessionalExpenseForm request={model.request} />
        <CardFooter className="py-3.5">
          <Button variant="outline">{i18n.messages.common.saveDraft}</Button>
          <Button asChild className="px-5">
            <Link to={AppRoutes.professionalExpenses}>
              <i aria-hidden className="ri-send-plane-line" />
              {labels.submit}
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </PageContent>
  );
}
