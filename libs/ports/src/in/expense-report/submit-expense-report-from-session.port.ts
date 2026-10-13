import { ExpenseReportSnapshot } from '@hexagonal-monorepo-template/domain';

export interface ISubmitExpenseReportFromSession {
  execute(reportId: string): Promise<ExpenseReportSnapshot>;
}

export const ISubmitExpenseReportFromSession = Symbol(
  'ISubmitExpenseReportFromSession',
);
