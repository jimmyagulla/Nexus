import { createRoute, Outlet } from '@tanstack/react-router';
import { companySettingsComposition } from '../../di';
import { AppShell } from '../common/layout/AppShell';
import { PageContent } from '../common/page/PageContent';
import { employerShellFixture } from '../fixtures/employer-shell.fixture';
import { i18n } from '../i18n/i18n';
import { AccountingFirmPage } from '../views/accounting-firm/AccountingFirmPage';
import { AccountingFirmUploadPage } from '../views/accounting-firm/AccountingFirmUploadPage';
import { ComingSoonPage } from '../views/coming-soon/ComingSoonPage';
import { EmployeeAttendancePage } from '../views/employees/EmployeeAttendancePage';
import { EmployeePage } from '../views/employees/EmployeePage';
import { EmployeesPage } from '../views/employees/EmployeesPage';
import { EmployerDashboardPage } from '../views/employer-dashboard/EmployerDashboardPage';
import { LeaveApprovalsPage } from '../views/leave-approvals/LeaveApprovalsPage';
import { SettingsPage } from '../views/settings/SettingsPage';
import { rootRoute } from './__root';
import { AppRoutes } from './app-routes';

const nav = i18n.messages.shell.employerNav;

const employerLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'employer',
  component: () => (
    <AppShell model={employerShellFixture}>
      <Outlet />
    </AppShell>
  ),
});

const parent = () => employerLayoutRoute;

function comingSoon(title: string) {
  return () => <ComingSoonPage title={title} backTo={AppRoutes.employer} />;
}

export const employerRoutes = employerLayoutRoute.addChildren([
  createRoute({ getParentRoute: parent, path: AppRoutes.employer, component: EmployerDashboardPage }),
  createRoute({ getParentRoute: parent, path: AppRoutes.employees, component: EmployeesPage }),
  createRoute({ getParentRoute: parent, path: AppRoutes.employee, component: EmployeePage }),
  createRoute({ getParentRoute: parent, path: AppRoutes.employeeAttendance, component: EmployeeAttendancePage }),
  createRoute({ getParentRoute: parent, path: AppRoutes.leaveApprovals, component: LeaveApprovalsPage }),
  createRoute({ getParentRoute: parent, path: AppRoutes.accountingFirm, component: AccountingFirmPage }),
  createRoute({ getParentRoute: parent, path: AppRoutes.accountingFirmUpload, component: AccountingFirmUploadPage }),
  createRoute({
    getParentRoute: parent,
    path: AppRoutes.settings,
    component: () => (
      <PageContent>
        <SettingsPage deps={companySettingsComposition} />
      </PageContent>
    ),
  }),
  createRoute({ getParentRoute: parent, path: AppRoutes.staffRegister, component: comingSoon(nav.staffRegister) }),
  createRoute({ getParentRoute: parent, path: AppRoutes.employerDocuments, component: comingSoon(nav.documents) }),
  createRoute({ getParentRoute: parent, path: AppRoutes.employerPayslips, component: comingSoon(nav.payslips) }),
  createRoute({ getParentRoute: parent, path: AppRoutes.employerAttendance, component: comingSoon(nav.attendance) }),
  createRoute({ getParentRoute: parent, path: AppRoutes.employerOvertime, component: comingSoon(nav.overtime) }),
  createRoute({ getParentRoute: parent, path: AppRoutes.employerExpenseReports, component: comingSoon(nav.expenseReports) }),
  createRoute({ getParentRoute: parent, path: AppRoutes.employerProfessionalExpenses, component: comingSoon(nav.professionalExpenses) }),
  createRoute({ getParentRoute: parent, path: AppRoutes.usersAndAccess, component: comingSoon(nav.usersAndAccess) }),
  createRoute({ getParentRoute: parent, path: AppRoutes.activityLog, component: comingSoon(nav.activityLog) }),
]);
