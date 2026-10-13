import { createRoute, useNavigate } from '@tanstack/react-router';
import { expenseReportsScreenComposition } from '../../di';
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
