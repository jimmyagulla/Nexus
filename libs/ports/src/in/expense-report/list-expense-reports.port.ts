import {
  ActorContext,
  ExpenseReportListSnapshot,
} from '@hexagonal-monorepo-template/domain';

export interface IListExpenseReports {
  execute(input: {
    actor: ActorContext;
    companyId: string;
  }): Promise<ExpenseReportListSnapshot>;
}

export const IListExpenseReports = Symbol('IListExpenseReports');
