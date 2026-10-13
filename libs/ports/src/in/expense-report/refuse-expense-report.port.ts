import {
  ActorContext,
  ExpenseReportSnapshot,
} from '@hexagonal-monorepo-template/domain';

export interface IRefuseExpenseReport {
  execute(input: {
    actor: ActorContext;
    companyId: string;
    reportId: string;
  }): Promise<ExpenseReportSnapshot>;
}

export const IRefuseExpenseReport = Symbol('IRefuseExpenseReport');
