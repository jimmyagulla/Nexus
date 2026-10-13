import {
  ExpenseDetailsInput,
  ExpenseReportSnapshot,
} from '@hexagonal-monorepo-template/domain';

export interface IAddExpenseFromSession {
  execute(input: {
    reportId: string;
    expense: ExpenseDetailsInput;
  }): Promise<ExpenseReportSnapshot>;
}

export const IAddExpenseFromSession = Symbol('IAddExpenseFromSession');
