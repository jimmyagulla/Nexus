import {
  ActorContext,
  ExpenseDetailsInput,
  ExpenseReportSnapshot,
} from '@hexagonal-monorepo-template/domain';

export interface IAddExpense {
  execute(input: {
    actor: ActorContext;
    companyId: string;
    reportId: string;
    expense: ExpenseDetailsInput;
  }): Promise<ExpenseReportSnapshot>;
}

export const IAddExpense = Symbol('IAddExpense');
