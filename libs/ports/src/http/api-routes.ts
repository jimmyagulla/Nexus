export const API_ROUTES = {
  companies: {
    base: 'companies',
    settings: ':companyId/settings',
    name: ':companyId/name',
    nonWorkingWeekdays: ':companyId/calendar/non-working-weekdays',
    publicHolidays: ':companyId/calendar/public-holidays',
    publicHoliday: ':companyId/calendar/public-holidays/:publicHolidayId',
    documents: ':companyId/documents',
    documentView: ':companyId/documents/:documentId/view',
    documentDownload: ':companyId/documents/:documentId/download',
    payslips: ':companyId/payslips',
    payslipExport: ':companyId/payslips/export',
    payslipView: ':companyId/payslips/:payslipId/view',
    payslipDownload: ':companyId/payslips/:payslipId/download',
    expenseReports: ':companyId/expense-reports',
    expenseReport: ':companyId/expense-reports/:expenseReportId',
    expenseReportProof: ':companyId/expense-reports/:expenseReportId/proof',
    expenseReportStatus: ':companyId/expense-reports/:expenseReportId/status',
    employeeExpenseReports: ':companyId/employees/:employeeId/expense-reports',
  },
} as const;

export function companyPath(
  template: string,
  params: Record<string, string>,
): string {
  return Object.entries(params).reduce(
    (path, [key, value]) => path.replace(`:${key}`, value),
    `${API_ROUTES.companies.base}/${template}`,
  );
}
