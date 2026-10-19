import {
  ExpenseReportRevision,
  ExpenseReportSummary,
} from '@hexagonal-monorepo-template/domain';

export interface IReviseExpenseReportFromSession {
  execute(input: {
    expenseReportId: string;
    revision: ExpenseReportRevision;
  }): Promise<ExpenseReportSummary>;
}

export const IReviseExpenseReportFromSession = Symbol('IReviseExpenseReportFromSession');
