import {
  ActorContext,
  ExpenseReportSubmission,
  ExpenseReportSummary,
} from '@hexagonal-monorepo-template/domain';

export interface ISubmitExpenseReport {
  execute(input: {
    actor: ActorContext;
    submission: ExpenseReportSubmission;
  }): Promise<ExpenseReportSummary>;
}

export const ISubmitExpenseReport = Symbol('ISubmitExpenseReport');
