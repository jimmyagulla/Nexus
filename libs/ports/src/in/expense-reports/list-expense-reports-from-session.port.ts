import {
  ExpenseReportList,
  ExpenseReportListCriteria,
} from '@hexagonal-monorepo-template/domain';

export interface IListExpenseReportsFromSession {
  execute(criteria: ExpenseReportListCriteria): Promise<ExpenseReportList>;
}

export const IListExpenseReportsFromSession = Symbol('IListExpenseReportsFromSession');
