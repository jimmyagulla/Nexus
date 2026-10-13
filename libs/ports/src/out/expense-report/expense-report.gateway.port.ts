import {
  ExpenseDetailsInput,
  ExpenseReportListSnapshot,
  ExpenseReportSnapshot,
  ReceiptDetailsInput,
  ReceiptFileSnapshot,
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
  attachReceipt(
    companyId: string,
    reportId: string,
    receipt: ReceiptDetailsInput,
    token: string,
  ): Promise<ExpenseReportSnapshot>;
  getReceipt(
    companyId: string,
    reportId: string,
    receiptId: string,
    token: string,
  ): Promise<ReceiptFileSnapshot>;
  submit(
    companyId: string,
    reportId: string,
    token: string,
  ): Promise<ExpenseReportSnapshot>;
}

export const IExpenseReportGateway = Symbol('IExpenseReportGateway');
