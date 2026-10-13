import { createRoute, useNavigate } from '@tanstack/react-router';
import { expenseReportsScreenComposition } from '../../di';
import { i18n } from '../i18n/i18n';
import { ExpenseReportsPage } from '../views/ExpenseReportsPage';
import { rootRoute } from './__root';
import { AppRoutes } from './app-routes';

export const expenseReportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: AppRoutes.expenseReports,
  component: ExpenseReportsRoute,
});

function ExpenseReportsRoute() {
  const navigate = useNavigate();

  return (
    <ExpenseReportsPage
      title={i18n.messages.expenseReports.employerTitle}
      emptyMessage={null}
      deps={expenseReportsScreenComposition}
      onOpen={(reportId) =>
        void navigate({
          to: AppRoutes.expenseReport,
          params: { reportId },
        })
      }
    />
  );
}
