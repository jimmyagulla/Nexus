import {
  ExpenseDetailsInput,
  ExpenseReportSnapshot,
} from '@hexagonal-monorepo-template/domain';

export interface IUpdateExpenseFromSession {
  execute(input: {
    reportId: string;
    expenseId: string;
    expense: ExpenseDetailsInput;
  }): Promise<ExpenseReportSnapshot>;
}

export const IUpdateExpenseFromSession = Symbol('IUpdateExpenseFromSession');
