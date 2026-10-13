import { ExpenseReportSnapshot } from '@hexagonal-monorepo-template/domain';

export interface IGetExpenseReportFromSession {
  execute(reportId: string): Promise<ExpenseReportSnapshot>;
}

export const IGetExpenseReportFromSession = Symbol(
  'IGetExpenseReportFromSession',
);
