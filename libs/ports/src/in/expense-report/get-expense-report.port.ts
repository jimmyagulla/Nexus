import {
  ActorContext,
  ExpenseReportSnapshot,
} from '@hexagonal-monorepo-template/domain';

export interface IGetExpenseReport {
  execute(input: {
    actor: ActorContext;
    companyId: string;
    reportId: string;
  }): Promise<ExpenseReportSnapshot>;
}

export const IGetExpenseReport = Symbol('IGetExpenseReport');
