import {
  ActorContext,
  ExpenseReportRevision,
  ExpenseReportSummary,
} from '@hexagonal-monorepo-template/domain';

export interface IReviseExpenseReport {
  execute(input: {
    actor: ActorContext;
    expenseReportId: string;
    revision: ExpenseReportRevision;
  }): Promise<ExpenseReportSummary>;
}

export const IReviseExpenseReport = Symbol('IReviseExpenseReport');
