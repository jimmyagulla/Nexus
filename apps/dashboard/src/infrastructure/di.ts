import { FetchHttpClient } from '@hexagonal-monorepo-template/adapters';
import { loadDashboardConfig } from './config/load-dashboard-config';
import { createCompanySettingsComposition } from './composition/company-settings.composition';
import { createAuthComposition } from './composition/auth.composition';
import { createEmployeeDashboardComposition } from './composition/employee-dashboard.composition';
import { createPayslipsComposition } from './composition/payslips.composition';
import { createDocumentsComposition } from './composition/documents.composition';
import { createPersonalInfoComposition } from './composition/personal-info.composition';
import { createLeavesComposition } from './composition/leaves.composition';
import { createOvertimeComposition } from './composition/overtime.composition';
import { createExpenseReportsComposition } from './composition/expense-reports.composition';
import { createProfessionalExpensesComposition } from './composition/professional-expenses.composition';
import { createEmployerDashboardComposition } from './composition/employer-dashboard.composition';
import { createEmployeesComposition } from './composition/employees.composition';
import { createLeaveApprovalsComposition } from './composition/leave-approvals.composition';
import { createAccountingFirmComposition } from './composition/accounting-firm.composition';
import { createShellComposition } from './composition/shell.composition';
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

export const authComposition = createAuthComposition();
export const employeeDashboardComposition = createEmployeeDashboardComposition();
export const payslipsComposition = createPayslipsComposition();
export const documentsComposition = createDocumentsComposition();
export const personalInfoComposition = createPersonalInfoComposition();
export const leavesComposition = createLeavesComposition();
export const overtimeComposition = createOvertimeComposition();
export const expenseReportsComposition = createExpenseReportsComposition();
export const professionalExpensesComposition = createProfessionalExpensesComposition();
export const employerDashboardComposition = createEmployerDashboardComposition();
export const employeesComposition = createEmployeesComposition();
export const leaveApprovalsComposition = createLeaveApprovalsComposition();
export const accountingFirmComposition = createAccountingFirmComposition();
export const shellComposition = createShellComposition();
