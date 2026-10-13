import { ExpenseReportSnapshot } from '@hexagonal-monorepo-template/domain';

export interface IRefuseExpenseReportFromSession {
  execute(reportId: string): Promise<ExpenseReportSnapshot>;
}

export const IRefuseExpenseReportFromSession = Symbol('IRefuseExpenseReportFromSession');
