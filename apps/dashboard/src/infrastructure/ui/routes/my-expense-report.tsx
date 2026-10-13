import { createRoute, useNavigate } from '@tanstack/react-router';
import { expenseReportsScreenComposition } from '../../di';
import { ExpenseReportDetailPage } from '../views/ExpenseReportDetailPage';
import { rootRoute } from './__root';
import { AppRoutes } from './app-routes';

export const myExpenseReportRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: AppRoutes.myExpenseReport,
  component: MyExpenseReportRoute,
});

function MyExpenseReportRoute() {
  const { reportId } = myExpenseReportRoute.useParams();
  const navigate = useNavigate();

  return (
    <ExpenseReportDetailPage
      reportId={reportId}
      deps={expenseReportsScreenComposition}
      onBack={() => void navigate({ to: AppRoutes.myExpenseReports })}
    />
  );
}
