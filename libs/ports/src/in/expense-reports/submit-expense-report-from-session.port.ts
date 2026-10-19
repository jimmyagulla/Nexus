import {
  ExpenseReportSubmission,
  ExpenseReportSummary,
} from '@hexagonal-monorepo-template/domain';

export interface ISubmitExpenseReportFromSession {
  execute(submission: ExpenseReportSubmission): Promise<ExpenseReportSummary>;
}

export const ISubmitExpenseReportFromSession = Symbol('ISubmitExpenseReportFromSession');
