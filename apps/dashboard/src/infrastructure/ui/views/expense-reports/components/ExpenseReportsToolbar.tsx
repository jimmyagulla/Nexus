import { Link } from '@tanstack/react-router';
import { FilterButton } from '../../../common/data/FilterButton';
import { SearchField } from '../../../common/data/SearchField';
import { i18n } from '../../../i18n/i18n';
import { AppRoutes } from '../../../routes/app-routes';

interface ExpenseReportsToolbarProps {
  /** Shows the "Frais professionnels" redirection on the right. */
  withProfessionalExpensesHint?: boolean;
}

export function ExpenseReportsToolbar({
  withProfessionalExpensesHint,
}: ExpenseReportsToolbarProps) {
  const labels = i18n.messages.expenseReports.list;

  return (
    <div className="flex items-center gap-2">
      <SearchField placeholder={labels.search} />
      <FilterButton className="border-primary" />
      {withProfessionalExpensesHint && (
        <>
          <span className="flex-1" />
          <span className="text-13 text-muted-foreground">
            {`${labels.professionalExpensesHint} `}
            <Link
              to={AppRoutes.professionalExpenses}
              className="font-semibold text-link hover:text-link-hover hover:underline"
            >
              {labels.professionalExpensesLink}
            </Link>
          </span>
        </>
      )}
    </div>
  );
}
