import { createRoute, Outlet } from '@tanstack/react-router';
import { AppShell } from '../common/layout/AppShell';
import { employeeShellFixture } from '../fixtures/employee-shell.fixture';
import { i18n } from '../i18n/i18n';
import { ComingSoonPage } from '../views/coming-soon/ComingSoonPage';
import { DocumentSentPage } from '../views/documents/DocumentSentPage';
import { DocumentUploadPage } from '../views/documents/DocumentUploadPage';
import { DocumentsPage } from '../views/documents/DocumentsPage';
import { EmployeeDashboardPage } from '../views/employee-dashboard/EmployeeDashboardPage';
import { ExpenseReportPage } from '../views/expense-reports/ExpenseReportPage';
import { ExpenseReportSubmittedPage } from '../views/expense-reports/ExpenseReportSubmittedPage';
import { ExpenseReportsPage } from '../views/expense-reports/ExpenseReportsPage';
import { LeaveRequestPage } from '../views/leaves/LeaveRequestPage';
import { LeaveRequestSentPage } from '../views/leaves/LeaveRequestSentPage';
import { LeavesPage } from '../views/leaves/LeavesPage';
import { OvertimeDeclarationPage } from '../views/overtime/OvertimeDeclarationPage';
import { OvertimePage } from '../views/overtime/OvertimePage';
import { PayslipPage } from '../views/payslips/PayslipPage';
import { PayslipsPage } from '../views/payslips/PayslipsPage';
import { PersonalInfoEditPage } from '../views/personal-info/PersonalInfoEditPage';
import { PersonalInfoPage } from '../views/personal-info/PersonalInfoPage';
import { PersonalInfoUpdatedPage } from '../views/personal-info/PersonalInfoUpdatedPage';
import { ProfessionalExpenseRequestPage } from '../views/professional-expenses/ProfessionalExpenseRequestPage';
import { ProfessionalExpensesPage } from '../views/professional-expenses/ProfessionalExpensesPage';
import { rootRoute } from './__root';
import { AppRoutes } from './app-routes';

const nav = i18n.messages.shell.employeeNav;

const employeeLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'employee',
  component: () => (
    <AppShell model={employeeShellFixture}>
      <Outlet />
    </AppShell>
  ),
});

const parent = () => employeeLayoutRoute;

export const employeeRoutes = employeeLayoutRoute.addChildren([
  createRoute({ getParentRoute: parent, path: AppRoutes.home, component: EmployeeDashboardPage }),
  createRoute({ getParentRoute: parent, path: AppRoutes.payslips, component: PayslipsPage }),
  createRoute({ getParentRoute: parent, path: AppRoutes.payslip, component: PayslipPage }),
  createRoute({ getParentRoute: parent, path: AppRoutes.documents, component: DocumentsPage }),
  createRoute({ getParentRoute: parent, path: AppRoutes.documentUpload, component: DocumentUploadPage }),
  createRoute({ getParentRoute: parent, path: AppRoutes.documentSent, component: DocumentSentPage }),
  createRoute({
    getParentRoute: parent,
    path: AppRoutes.documentsToSend,
    component: () => <ComingSoonPage title={nav.documentsToSend} backTo={AppRoutes.home} />,
  }),
  createRoute({ getParentRoute: parent, path: AppRoutes.leaves, component: LeavesPage }),
  createRoute({ getParentRoute: parent, path: AppRoutes.leaveRequest, component: LeaveRequestPage }),
  createRoute({ getParentRoute: parent, path: AppRoutes.leaveRequestSent, component: LeaveRequestSentPage }),
  createRoute({ getParentRoute: parent, path: AppRoutes.overtime, component: OvertimePage }),
  createRoute({ getParentRoute: parent, path: AppRoutes.overtimeDeclaration, component: OvertimeDeclarationPage }),
  createRoute({
    getParentRoute: parent,
    path: AppRoutes.attendance,
    component: () => <ComingSoonPage title={nav.attendance} backTo={AppRoutes.home} />,
  }),
  createRoute({ getParentRoute: parent, path: AppRoutes.expenseReports, component: ExpenseReportsPage }),
  createRoute({ getParentRoute: parent, path: AppRoutes.expenseReportSubmitted, component: ExpenseReportSubmittedPage }),
  createRoute({ getParentRoute: parent, path: AppRoutes.expenseReport, component: ExpenseReportPage }),
  createRoute({ getParentRoute: parent, path: AppRoutes.professionalExpenses, component: ProfessionalExpensesPage }),
  createRoute({ getParentRoute: parent, path: AppRoutes.professionalExpenseRequest, component: ProfessionalExpenseRequestPage }),
  createRoute({ getParentRoute: parent, path: AppRoutes.personalInfo, component: PersonalInfoPage }),
  createRoute({ getParentRoute: parent, path: AppRoutes.personalInfoEdit, component: PersonalInfoEditPage }),
  createRoute({ getParentRoute: parent, path: AppRoutes.personalInfoUpdated, component: PersonalInfoUpdatedPage }),
]);
