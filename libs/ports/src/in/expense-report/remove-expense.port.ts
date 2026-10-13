import {
  ActorContext,
  ExpenseReportSnapshot,
} from '@hexagonal-monorepo-template/domain';

export interface IRemoveExpense {
  execute(input: {
    actor: ActorContext;
    companyId: string;
    reportId: string;
    expenseId: string;
  }): Promise<ExpenseReportSnapshot>;
}

export const IRemoveExpense = Symbol('IRemoveExpense');
