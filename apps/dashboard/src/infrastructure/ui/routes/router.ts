import { createRouter } from '@tanstack/react-router';
import { indexRoute } from './index';
import { rootRoute } from './__root';
import { expenseReportRoute } from './expense-report';
import { expenseReportsRoute } from './expense-reports';
import { myExpenseReportRoute } from './my-expense-report';
import { myExpenseReportsRoute } from './my-expense-reports';
import { settingsRoute } from './settings';

const routeTree = rootRoute.addChildren([
  indexRoute,
  settingsRoute,
  myExpenseReportsRoute,
  myExpenseReportRoute,
  expenseReportsRoute,
  expenseReportRoute,
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
