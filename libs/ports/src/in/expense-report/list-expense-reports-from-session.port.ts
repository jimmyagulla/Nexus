import { ExpenseReportListSnapshot } from '@hexagonal-monorepo-template/domain';

export interface IListExpenseReportsFromSession {
  execute(): Promise<ExpenseReportListSnapshot>;
}

export const IListExpenseReportsFromSession = Symbol(
  'IListExpenseReportsFromSession',
);
