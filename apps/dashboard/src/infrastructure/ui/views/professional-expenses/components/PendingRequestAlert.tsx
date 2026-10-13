import { Link } from '@tanstack/react-router';
import { i18n } from '../../../i18n/i18n';
import { AppRoutes } from '../../../routes/app-routes';
import { Button } from '../../../shared/button';

interface PendingRequestAlertProps {
  /** "1 demande à compléter." */
  title: string;
  /** "Abonnement transport d'octobre : le justificatif est manquant." */
  description: string;
}

/** Orange banner pointing to a request missing a document. */
export function PendingRequestAlert({ title, description }: PendingRequestAlertProps) {
  return (
    <div
      role="alert"
      className="flex items-center gap-3 rounded-lg border border-orange-200 bg-orange-50 px-4 py-3.5"
    >
      <i aria-hidden className="ri-error-warning-line text-20 text-orange-700" />
      <span className="flex-1 text-14 text-orange-900">
        <b>{title}</b>
        {` ${description}`}
      </span>
      <Button asChild size="xs">
        <Link to={AppRoutes.professionalExpenseRequest}>
          {i18n.messages.professionalExpenses.list.complete}
        </Link>
      </Button>
    </div>
  );
}
