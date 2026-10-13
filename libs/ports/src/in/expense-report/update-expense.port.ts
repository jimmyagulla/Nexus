import {
  ActorContext,
  ExpenseDetailsInput,
  ExpenseReportSnapshot,
} from '@hexagonal-monorepo-template/domain';

export interface IUpdateExpense {
  execute(input: {
    actor: ActorContext;
    companyId: string;
    reportId: string;
    expenseId: string;
    expense: ExpenseDetailsInput;
  }): Promise<ExpenseReportSnapshot>;
}

export const IUpdateExpense = Symbol('IUpdateExpense');
