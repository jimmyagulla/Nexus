import { ExpenseReportSnapshot } from '@hexagonal-monorepo-template/domain';

export interface IReimburseExpenseReportFromSession {
  execute(reportId: string): Promise<ExpenseReportSnapshot>;
}

export const IReimburseExpenseReportFromSession = Symbol(
  'IReimburseExpenseReportFromSession',
);
