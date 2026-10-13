import {
  ExpenseDetailsInput,
  ExpenseReportListSnapshot,
  ExpenseReportSnapshot,
} from '@hexagonal-monorepo-template/domain';

export interface IExpenseReportGateway {
  create(
    companyId: string,
    label: string,
    token: string,
  ): Promise<ExpenseReportSnapshot>;
  get(
    companyId: string,
    reportId: string,
    token: string,
  ): Promise<ExpenseReportSnapshot>;
  list(companyId: string, token: string): Promise<ExpenseReportListSnapshot>;
  addExpense(
    companyId: string,
    reportId: string,
    expense: ExpenseDetailsInput,
    token: string,
  ): Promise<ExpenseReportSnapshot>;
  updateExpense(
    companyId: string,
    reportId: string,
    expenseId: string,
    expense: ExpenseDetailsInput,
    token: string,
  ): Promise<ExpenseReportSnapshot>;
  removeExpense(
    companyId: string,
    reportId: string,
    expenseId: string,
    token: string,
  ): Promise<ExpenseReportSnapshot>;
}

export const IExpenseReportGateway = Symbol('IExpenseReportGateway');
