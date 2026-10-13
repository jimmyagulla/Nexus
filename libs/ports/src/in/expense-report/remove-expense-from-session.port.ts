import { ExpenseReportSnapshot } from '@hexagonal-monorepo-template/domain';

export interface IRemoveExpenseFromSession {
  execute(input: {
    reportId: string;
    expenseId: string;
  }): Promise<ExpenseReportSnapshot>;
}

export const IRemoveExpenseFromSession = Symbol('IRemoveExpenseFromSession');
