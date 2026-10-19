import {
  ActorContext,
  ExpenseReportStatus,
  ExpenseReportSummary,
} from '@hexagonal-monorepo-template/domain';

/** Only an employer of the report's company moves it along. */
export interface IChangeExpenseReportStatus {
  execute(input: {
    actor: ActorContext;
    expenseReportId: string;
    status: ExpenseReportStatus;
  }): Promise<ExpenseReportSummary>;
}

export const IChangeExpenseReportStatus = Symbol('IChangeExpenseReportStatus');
