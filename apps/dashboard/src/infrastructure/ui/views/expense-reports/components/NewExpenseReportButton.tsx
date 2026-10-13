import { Link } from '@tanstack/react-router';
import { i18n } from '../../../i18n/i18n';
import { AppRoutes } from '../../../routes/app-routes';
import { Button } from '../../../shared/button';

/** Opens the current draft note. */
export function NewExpenseReportButton({ draftId }: { draftId: string }) {
  return (
    <Button asChild>
      <Link to={AppRoutes.expenseReport} params={{ expenseReportId: draftId }}>
        <i aria-hidden className="ri-add-line text-18" />
        {i18n.messages.expenseReports.list.newReport}
      </Link>
    </Button>
  );
}
