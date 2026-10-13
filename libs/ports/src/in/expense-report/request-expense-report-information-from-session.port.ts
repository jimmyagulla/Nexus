import { ExpenseReportSnapshot } from '@hexagonal-monorepo-template/domain';

export interface IRequestExpenseReportInformationFromSession {
  execute(reportId: string): Promise<ExpenseReportSnapshot>;
}

export const IRequestExpenseReportInformationFromSession = Symbol('IRequestExpenseReportInformationFromSession');
