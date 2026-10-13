import {
  ActorContext,
  ExpenseReportSnapshot,
} from '@hexagonal-monorepo-template/domain';

export interface IOpenExpenseReport {
  execute(input: {
    actor: ActorContext;
    companyId: string;
    reportId: string;
  }): Promise<ExpenseReportSnapshot>;
}

export const IOpenExpenseReport = Symbol('IOpenExpenseReport');
