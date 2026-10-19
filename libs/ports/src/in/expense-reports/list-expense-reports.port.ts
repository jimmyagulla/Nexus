import {
  ActorContext,
  ExpenseReportList,
  ExpenseReportListCriteria,
} from '@hexagonal-monorepo-template/domain';

export interface IListExpenseReports {
  execute(input: {
    actor: ActorContext;
    criteria: ExpenseReportListCriteria;
  }): Promise<ExpenseReportList>;
}

export const IListExpenseReports = Symbol('IListExpenseReports');
