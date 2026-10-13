import {
  ActorContext,
  ExpenseReportSnapshot,
} from '@hexagonal-monorepo-template/domain';

export interface IValidateExpenseReport {
  execute(input: {
    actor: ActorContext;
    companyId: string;
    reportId: string;
  }): Promise<ExpenseReportSnapshot>;
}

export const IValidateExpenseReport = Symbol('IValidateExpenseReport');
