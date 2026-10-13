import { createRoute, useNavigate } from '@tanstack/react-router';
import { expenseReportsScreenComposition } from '../../di';
import { EmployerExpenseReportPage } from '../views/EmployerExpenseReportPage';
import { rootRoute } from './__root';
import { AppRoutes } from './app-routes';

export const expenseReportRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: AppRoutes.expenseReport,
  component: ExpenseReportRoute,
});

function ExpenseReportRoute() {
  const { reportId } = expenseReportRoute.useParams();
  const navigate = useNavigate();

  return (
    <EmployerExpenseReportPage
      reportId={reportId}
      deps={expenseReportsScreenComposition}
      onBack={() => void navigate({ to: AppRoutes.expenseReports })}
    />
  );
}
