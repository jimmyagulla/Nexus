import { Link } from '@tanstack/react-router';
import { FilterButton } from '../../../common/data/FilterButton';
import { SearchField } from '../../../common/data/SearchField';
import { i18n } from '../../../i18n/i18n';
import { AppRoutes } from '../../../routes/app-routes';

export function ProfessionalExpensesToolbar() {
  const labels = i18n.messages.professionalExpenses.list;

  return (
    <div className="flex items-center gap-2">
      <SearchField placeholder={labels.search} />
      <FilterButton className="border-primary" />
      <span className="flex-1" />
      <span className="text-13 text-muted-foreground">
        {`${labels.expenseReportsHint} `}
        <Link
          to={AppRoutes.expenseReports}
          className="font-semibold text-link hover:text-link-hover hover:underline"
        >
          {labels.expenseReportsLink}
        </Link>
      </span>
    </div>
  );
}
