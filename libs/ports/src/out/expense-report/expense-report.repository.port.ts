import {
  Expense,
  ExpenseDetails,
  ExpenseReport,
  ExpenseReportLabel,
  Receipt,
  ReceiptDetails,
} from '@hexagonal-monorepo-template/domain';

export type ExpenseReportCriteria = {
  employeeId?: string;
};

export interface IExpenseReportRepository {
  insert(
    companyId: string,
    employeeId: string,
    label: ExpenseReportLabel,
  ): Promise<ExpenseReport>;
  findById(companyId: string, reportId: string): Promise<ExpenseReport | null>;
  insertExpense(reportId: string, details: ExpenseDetails): Promise<Expense>;
  saveExpense(reportId: string, expense: Expense): Promise<void>;
  deleteExpense(reportId: string, expenseId: string): Promise<void>;
  insertReceipt(reportId: string, details: ReceiptDetails): Promise<Receipt>;
  save(report: ExpenseReport): Promise<void>;
  list(
    companyId: string,
    criteria: ExpenseReportCriteria,
  ): Promise<readonly ExpenseReport[]>;
}

export const IExpenseReportRepository = Symbol('IExpenseReportRepository');
