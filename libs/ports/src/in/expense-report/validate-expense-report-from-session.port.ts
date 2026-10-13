import { ExpenseReportSnapshot } from '@hexagonal-monorepo-template/domain';

export interface IValidateExpenseReportFromSession {
  execute(reportId: string): Promise<ExpenseReportSnapshot>;
}

export const IValidateExpenseReportFromSession = Symbol('IValidateExpenseReportFromSession');
