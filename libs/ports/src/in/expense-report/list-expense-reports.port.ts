import {
  ActorContext,
  ExpenseReportFilterInput,
  ExpenseReportListSnapshot,
} from '@hexagonal-monorepo-template/domain';

export interface IListExpenseReports {
  execute(input: {
    actor: ActorContext;
    companyId: string;
    filter?: ExpenseReportFilterInput;
  }): Promise<ExpenseReportListSnapshot>;
}

export const IListExpenseReports = Symbol('IListExpenseReports');
