import { FetchHttpClient } from './network/fetch-http-client';
import { loadDashboardConfig } from './config/load-dashboard-config';
import { createCompanySettingsComposition } from './composition/company-settings.composition';
import { createAuthComposition } from './composition/auth/auth.composition';
import { createEmployeeDashboardComposition } from './composition/employee-dashboard/employee-dashboard.composition';
import { createPayslipComposition } from './composition/payslip/payslip.composition';
import { createDocumentComposition } from './composition/document/document.composition';
import { createPersonalInfoComposition } from './composition/personal-info/personal-info.composition';
import { createLeaveComposition } from './composition/leave/leave.composition';
import { createOvertimeComposition } from './composition/overtime/overtime.composition';
import { createExpenseReportComposition } from './composition/expense-report/expense-report.composition';
import { createProfessionalExpenseComposition } from './composition/professional-expense/professional-expense.composition';
import { createEmployerDashboardComposition } from './composition/employer-dashboard/employer-dashboard.composition';
import { createEmployeeComposition } from './composition/employee/employee.composition';
import { createLeaveApprovalComposition } from './composition/leave-approval/leave-approval.composition';
import { createAccountingFirmComposition } from './composition/accounting-firm/accounting-firm.composition';
import { createShellComposition } from './composition/shell/shell.composition';
import { createSessionGateway } from './session/create-session-gateway';

const API_URL = loadDashboardConfig().apiUrl;
const httpClient = new FetchHttpClient(API_URL);
const sessions = createSessionGateway();

export const companySettingsComposition = createCompanySettingsComposition(
  httpClient,
  sessions,
);
export const companySettingsController = companySettingsComposition.controller;
export const companySettingsPresenter = companySettingsComposition.presenter;
export const companySettingsErrorPresenter =
  companySettingsComposition.errorPresenter;

// Screens (placeholder data until their use cases exist)
export const authComposition = createAuthComposition();
export const employeeDashboardComposition = createEmployeeDashboardComposition();
export const payslipComposition = createPayslipComposition();
export const documentComposition = createDocumentComposition(
  httpClient,
  sessions,
);
export const personalInfoComposition = createPersonalInfoComposition();
export const leaveComposition = createLeaveComposition();
export const overtimeComposition = createOvertimeComposition();
export const expenseReportComposition = createExpenseReportComposition();
export const professionalExpenseComposition = createProfessionalExpenseComposition();
export const employerDashboardComposition = createEmployerDashboardComposition();
export const employeeComposition = createEmployeeComposition();
export const leaveApprovalComposition = createLeaveApprovalComposition();
export const accountingFirmComposition = createAccountingFirmComposition();
export const shellComposition = createShellComposition();
