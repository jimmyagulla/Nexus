import { ExpenseReportSnapshot } from '@hexagonal-monorepo-template/domain';

export interface IOpenExpenseReportFromSession {
  execute(reportId: string): Promise<ExpenseReportSnapshot>;
}

export const IOpenExpenseReportFromSession = Symbol('IOpenExpenseReportFromSession');
