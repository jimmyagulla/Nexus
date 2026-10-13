import { createRoute } from '@tanstack/react-router';
import {
  accountingFirmComposition,
  companySettingsComposition,
  employeeComposition,
  employerDashboardComposition,
  leaveApprovalComposition,
  shellComposition,
} from '../../di';
import { PageContent } from '../common/page/PageContent';
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
import { EmployerShellPage } from '../views/shell/EmployerShellPage';
import { rootRoute } from './__root';
import { AppRoutes } from './app-routes';

const nav = i18n.messages.shell.employerNav;

const employerLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'employer',
  component: () => <EmployerShellPage deps={shellComposition.employerShell} />,
});

const parent = () => employerLayoutRoute;

function comingSoon(title: string) {
  return () => <ComingSoonPage title={title} backTo={AppRoutes.employer} />;
}

export const employerRoutes = employerLayoutRoute.addChildren([
  createRoute({ getParentRoute: parent, path: AppRoutes.employer, component: () => <EmployerDashboardPage deps={employerDashboardComposition.employerDashboard} /> }),
  createRoute({ getParentRoute: parent, path: AppRoutes.employees, component: () => <EmployeesPage deps={employeeComposition.employees} /> }),
  createRoute({ getParentRoute: parent, path: AppRoutes.employee, component: () => <EmployeePage deps={employeeComposition.employee} /> }),
  createRoute({ getParentRoute: parent, path: AppRoutes.employeeAttendance, component: () => <EmployeeAttendancePage deps={employeeComposition.employeeAttendance} /> }),
  createRoute({ getParentRoute: parent, path: AppRoutes.leaveApprovals, component: () => <LeaveApprovalsPage deps={leaveApprovalComposition.leaveApprovals} /> }),
  createRoute({ getParentRoute: parent, path: AppRoutes.accountingFirm, component: () => <AccountingFirmPage deps={accountingFirmComposition.accountingFirm} /> }),
  createRoute({ getParentRoute: parent, path: AppRoutes.accountingFirmUpload, component: () => <AccountingFirmUploadPage deps={accountingFirmComposition.accountingFirmUpload} /> }),
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
