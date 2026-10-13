import {
  ActorContext,
  ExpenseReportSnapshot,
} from '@hexagonal-monorepo-template/domain';

export interface IRequestExpenseReportInformation {
  execute(input: {
    actor: ActorContext;
    companyId: string;
    reportId: string;
  }): Promise<ExpenseReportSnapshot>;
}

export const IRequestExpenseReportInformation = Symbol('IRequestExpenseReportInformation');
