import { createRoute, useNavigate } from '@tanstack/react-router';
import { expenseReportsScreenComposition } from '../../di';
import { i18n } from '../i18n/i18n';
import { ExpenseReportsPage } from '../views/ExpenseReportsPage';
import { rootRoute } from './__root';
import { AppRoutes } from './app-routes';

export const myExpenseReportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: AppRoutes.myExpenseReports,
  component: MyExpenseReportsRoute,
});

function MyExpenseReportsRoute() {
  const navigate = useNavigate();

  return (
    <ExpenseReportsPage
      title={i18n.messages.expenseReports.title}
      emptyMessage={i18n.messages.expenseReports.empty}
      deps={expenseReportsScreenComposition}
      onOpen={(reportId) =>
        void navigate({
          to: AppRoutes.myExpenseReport,
          params: { reportId },
        })
      }
    />
  );
}
