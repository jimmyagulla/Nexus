import { createRoute } from '@tanstack/react-router';
import {
  documentsPageComposition,
  employeeDashboardComposition,
  expenseReportComposition,
  leaveComposition,
  overtimeComposition,
  payslipComposition,
  personalInfoComposition,
  professionalExpenseComposition,
  shellComposition,
} from '../../di';
import { i18n } from '../i18n/i18n';
import { ComingSoonPage } from '../views/coming-soon/ComingSoonPage';
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
import { EmployeeShellPage } from '../views/shell/EmployeeShellPage';
import { rootRoute } from './__root';
import { AppRoutes } from './app-routes';

const nav = i18n.messages.shell.employeeNav;

const employeeLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'employee',
  component: () => <EmployeeShellPage deps={shellComposition.employeeShell} />,
});

const parent = () => employeeLayoutRoute;

export const employeeRoutes = employeeLayoutRoute.addChildren([
  createRoute({ getParentRoute: parent, path: AppRoutes.home, component: () => <EmployeeDashboardPage deps={employeeDashboardComposition.employeeDashboard} /> }),
  createRoute({ getParentRoute: parent, path: AppRoutes.payslips, component: () => <PayslipsPage deps={payslipComposition.payslips} /> }),
  createRoute({ getParentRoute: parent, path: AppRoutes.payslip, component: () => <PayslipPage deps={payslipComposition.payslip} /> }),
  createRoute({ getParentRoute: parent, path: AppRoutes.documents, component: () => <DocumentsPage deps={documentsPageComposition} /> }),
  createRoute({ getParentRoute: parent, path: AppRoutes.documentUpload, component: () => <DocumentsPage deps={documentsPageComposition} uploadRoute /> }),
  createRoute({
    getParentRoute: parent,
    path: AppRoutes.documentsToSend,
    component: () => <ComingSoonPage title={nav.documentsToSend} backTo={AppRoutes.home} />,
  }),
  createRoute({ getParentRoute: parent, path: AppRoutes.leaves, component: () => <LeavesPage deps={leaveComposition.leaves} /> }),
  createRoute({ getParentRoute: parent, path: AppRoutes.leaveRequest, component: () => <LeaveRequestPage deps={leaveComposition.leaveRequest} /> }),
  createRoute({ getParentRoute: parent, path: AppRoutes.leaveRequestSent, component: () => <LeaveRequestSentPage deps={leaveComposition.leaveRequestSent} /> }),
  createRoute({ getParentRoute: parent, path: AppRoutes.overtime, component: () => <OvertimePage deps={overtimeComposition.overtime} /> }),
  createRoute({ getParentRoute: parent, path: AppRoutes.overtimeDeclaration, component: () => <OvertimeDeclarationPage deps={overtimeComposition.overtimeDeclaration} /> }),
  createRoute({
    getParentRoute: parent,
    path: AppRoutes.attendance,
    component: () => <ComingSoonPage title={nav.attendance} backTo={AppRoutes.home} />,
  }),
  createRoute({ getParentRoute: parent, path: AppRoutes.expenseReports, component: () => <ExpenseReportsPage deps={expenseReportComposition.expenseReports} /> }),
  createRoute({ getParentRoute: parent, path: AppRoutes.expenseReportSubmitted, component: () => <ExpenseReportSubmittedPage deps={expenseReportComposition.expenseReportSubmitted} /> }),
  createRoute({ getParentRoute: parent, path: AppRoutes.expenseReport, component: () => <ExpenseReportPage deps={expenseReportComposition.expenseReport} /> }),
  createRoute({ getParentRoute: parent, path: AppRoutes.professionalExpenses, component: () => <ProfessionalExpensesPage deps={professionalExpenseComposition.professionalExpenses} /> }),
  createRoute({ getParentRoute: parent, path: AppRoutes.professionalExpenseRequest, component: () => <ProfessionalExpenseRequestPage deps={professionalExpenseComposition.professionalExpenseRequest} /> }),
  createRoute({ getParentRoute: parent, path: AppRoutes.personalInfo, component: () => <PersonalInfoPage deps={personalInfoComposition.personalInfo} /> }),
  createRoute({ getParentRoute: parent, path: AppRoutes.personalInfoEdit, component: () => <PersonalInfoEditPage deps={personalInfoComposition.personalInfoEdit} /> }),
  createRoute({ getParentRoute: parent, path: AppRoutes.personalInfoUpdated, component: () => <PersonalInfoUpdatedPage deps={personalInfoComposition.personalInfoUpdated} /> }),
]);
