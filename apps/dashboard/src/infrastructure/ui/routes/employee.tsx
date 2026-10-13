import { createRoute } from '@tanstack/react-router';
import {
  documentSentComposition,
  documentUploadComposition,
  documentsComposition,
  employeeDashboardComposition,
  employeeShellComposition,
  expenseReportComposition,
  expenseReportSubmittedComposition,
  expenseReportsComposition,
  leaveRequestComposition,
  leaveRequestSentComposition,
  leavesComposition,
  overtimeComposition,
  overtimeDeclarationComposition,
  payslipComposition,
  payslipsComposition,
  personalInfoComposition,
  personalInfoEditComposition,
  personalInfoUpdatedComposition,
  professionalExpenseRequestComposition,
  professionalExpensesComposition,
} from '../../di';
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
import { EmployeeShellPage } from '../views/shell/EmployeeShellPage';
import { rootRoute } from './__root';
import { AppRoutes } from './app-routes';

const nav = i18n.messages.shell.employeeNav;

const employeeLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'employee',
  component: () => <EmployeeShellPage deps={employeeShellComposition} />,
});

const parent = () => employeeLayoutRoute;

export const employeeRoutes = employeeLayoutRoute.addChildren([
  createRoute({ getParentRoute: parent, path: AppRoutes.home, component: () => <EmployeeDashboardPage deps={employeeDashboardComposition} /> }),
  createRoute({ getParentRoute: parent, path: AppRoutes.payslips, component: () => <PayslipsPage deps={payslipsComposition} /> }),
  createRoute({ getParentRoute: parent, path: AppRoutes.payslip, component: () => <PayslipPage deps={payslipComposition} /> }),
  createRoute({ getParentRoute: parent, path: AppRoutes.documents, component: () => <DocumentsPage deps={documentsComposition} /> }),
  createRoute({ getParentRoute: parent, path: AppRoutes.documentUpload, component: () => <DocumentUploadPage deps={documentUploadComposition} /> }),
  createRoute({ getParentRoute: parent, path: AppRoutes.documentSent, component: () => <DocumentSentPage deps={documentSentComposition} /> }),
  createRoute({
    getParentRoute: parent,
    path: AppRoutes.documentsToSend,
    component: () => <ComingSoonPage title={nav.documentsToSend} backTo={AppRoutes.home} />,
  }),
  createRoute({ getParentRoute: parent, path: AppRoutes.leaves, component: () => <LeavesPage deps={leavesComposition} /> }),
  createRoute({ getParentRoute: parent, path: AppRoutes.leaveRequest, component: () => <LeaveRequestPage deps={leaveRequestComposition} /> }),
  createRoute({ getParentRoute: parent, path: AppRoutes.leaveRequestSent, component: () => <LeaveRequestSentPage deps={leaveRequestSentComposition} /> }),
  createRoute({ getParentRoute: parent, path: AppRoutes.overtime, component: () => <OvertimePage deps={overtimeComposition} /> }),
  createRoute({ getParentRoute: parent, path: AppRoutes.overtimeDeclaration, component: () => <OvertimeDeclarationPage deps={overtimeDeclarationComposition} /> }),
  createRoute({
    getParentRoute: parent,
    path: AppRoutes.attendance,
    component: () => <ComingSoonPage title={nav.attendance} backTo={AppRoutes.home} />,
  }),
  createRoute({ getParentRoute: parent, path: AppRoutes.expenseReports, component: () => <ExpenseReportsPage deps={expenseReportsComposition} /> }),
  createRoute({ getParentRoute: parent, path: AppRoutes.expenseReportSubmitted, component: () => <ExpenseReportSubmittedPage deps={expenseReportSubmittedComposition} /> }),
  createRoute({ getParentRoute: parent, path: AppRoutes.expenseReport, component: () => <ExpenseReportPage deps={expenseReportComposition} /> }),
  createRoute({ getParentRoute: parent, path: AppRoutes.professionalExpenses, component: () => <ProfessionalExpensesPage deps={professionalExpensesComposition} /> }),
  createRoute({ getParentRoute: parent, path: AppRoutes.professionalExpenseRequest, component: () => <ProfessionalExpenseRequestPage deps={professionalExpenseRequestComposition} /> }),
  createRoute({ getParentRoute: parent, path: AppRoutes.personalInfo, component: () => <PersonalInfoPage deps={personalInfoComposition} /> }),
  createRoute({ getParentRoute: parent, path: AppRoutes.personalInfoEdit, component: () => <PersonalInfoEditPage deps={personalInfoEditComposition} /> }),
  createRoute({ getParentRoute: parent, path: AppRoutes.personalInfoUpdated, component: () => <PersonalInfoUpdatedPage deps={personalInfoUpdatedComposition} /> }),
]);
