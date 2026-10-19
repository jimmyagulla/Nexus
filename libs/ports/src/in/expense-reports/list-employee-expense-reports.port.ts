import {
  ActorContext,
  ExpenseReportList,
  ExpenseReportListCriteria,
} from '@hexagonal-monorepo-template/domain';

/** An employer reads the expense reports of one employee of their company. */
export interface IListEmployeeExpenseReports {
  execute(input: {
    actor: ActorContext;
    employeeId: string;
    criteria: ExpenseReportListCriteria;
  }): Promise<ExpenseReportList>;
}

export const IListEmployeeExpenseReports = Symbol('IListEmployeeExpenseReports');
