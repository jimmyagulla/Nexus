import { FetchHttpClient } from '@hexagonal-monorepo-template/adapters';
import { loadDashboardConfig } from './config/load-dashboard-config';
import { createCompanySettingsComposition } from './composition/company-settings.composition';
import { createLoginComposition } from './composition/login.composition';
import { createLoginVerificationComposition } from './composition/login-verification.composition';
import { createEmployeeDashboardComposition } from './composition/employee-dashboard.composition';
import { createPayslipsComposition } from './composition/payslips.composition';
import { createPayslipComposition } from './composition/payslip.composition';
import { createDocumentsComposition } from './composition/documents.composition';
import { createDocumentUploadComposition } from './composition/document-upload.composition';
import { createDocumentSentComposition } from './composition/document-sent.composition';
import { createPersonalInfoComposition } from './composition/personal-info.composition';
import { createPersonalInfoEditComposition } from './composition/personal-info-edit.composition';
import { createPersonalInfoUpdatedComposition } from './composition/personal-info-updated.composition';
import { createLeavesComposition } from './composition/leaves.composition';
import { createLeaveRequestComposition } from './composition/leave-request.composition';
import { createLeaveRequestSentComposition } from './composition/leave-request-sent.composition';
import { createOvertimeComposition } from './composition/overtime.composition';
import { createOvertimeDeclarationComposition } from './composition/overtime-declaration.composition';
import { createExpenseReportsComposition } from './composition/expense-reports.composition';
import { createExpenseReportComposition } from './composition/expense-report.composition';
import { createExpenseReportSubmittedComposition } from './composition/expense-report-submitted.composition';
import { createProfessionalExpensesComposition } from './composition/professional-expenses.composition';
import { createProfessionalExpenseRequestComposition } from './composition/professional-expense-request.composition';
import { createEmployerDashboardComposition } from './composition/employer-dashboard.composition';
import { createEmployeesComposition } from './composition/employees.composition';
import { createEmployeeComposition } from './composition/employee.composition';
import { createEmployeeAttendanceComposition } from './composition/employee-attendance.composition';
import { createLeaveApprovalsComposition } from './composition/leave-approvals.composition';
import { createAccountingFirmComposition } from './composition/accounting-firm.composition';
import { createAccountingFirmUploadComposition } from './composition/accounting-firm-upload.composition';
import { createEmployeeShellComposition } from './composition/employee-shell.composition';
import { createEmployerShellComposition } from './composition/employer-shell.composition';
import { createSessionGateway } from './session/create-session-gateway';

const API_URL = loadDashboardConfig().apiUrl;
const httpClient = new FetchHttpClient(API_URL);

export const companySettingsComposition = createCompanySettingsComposition(
  httpClient,
  createSessionGateway(),
);
export const companySettingsController = companySettingsComposition.controller;
export const companySettingsPresenter = companySettingsComposition.presenter;
export const companySettingsErrorPresenter =
  companySettingsComposition.errorPresenter;

// Screens (placeholder data until their use cases exist)
export const loginComposition = createLoginComposition();
export const loginVerificationComposition = createLoginVerificationComposition();
export const employeeDashboardComposition = createEmployeeDashboardComposition();
export const payslipsComposition = createPayslipsComposition();
export const payslipComposition = createPayslipComposition();
export const documentsComposition = createDocumentsComposition();
export const documentUploadComposition = createDocumentUploadComposition();
export const documentSentComposition = createDocumentSentComposition();
export const personalInfoComposition = createPersonalInfoComposition();
export const personalInfoEditComposition = createPersonalInfoEditComposition();
export const personalInfoUpdatedComposition = createPersonalInfoUpdatedComposition();
export const leavesComposition = createLeavesComposition();
export const leaveRequestComposition = createLeaveRequestComposition();
export const leaveRequestSentComposition = createLeaveRequestSentComposition();
export const overtimeComposition = createOvertimeComposition();
export const overtimeDeclarationComposition = createOvertimeDeclarationComposition();
export const expenseReportsComposition = createExpenseReportsComposition();
export const expenseReportComposition = createExpenseReportComposition();
export const expenseReportSubmittedComposition = createExpenseReportSubmittedComposition();
export const professionalExpensesComposition = createProfessionalExpensesComposition();
export const professionalExpenseRequestComposition = createProfessionalExpenseRequestComposition();
export const employerDashboardComposition = createEmployerDashboardComposition();
export const employeesComposition = createEmployeesComposition();
export const employeeComposition = createEmployeeComposition();
export const employeeAttendanceComposition = createEmployeeAttendanceComposition();
export const leaveApprovalsComposition = createLeaveApprovalsComposition();
export const accountingFirmComposition = createAccountingFirmComposition();
export const accountingFirmUploadComposition = createAccountingFirmUploadComposition();
export const employeeShellComposition = createEmployeeShellComposition();
export const employerShellComposition = createEmployerShellComposition();
