import { ExpenseReportStatus } from '../entities/expense-report-status';

export type ExpenseSnapshot = {
  id: string;
  date: string;
  categoryId: string;
  amount: number;
  vat: number | null;
  paymentMethod: string;
  description: string;
  assignment: string;
};

export type ReceiptSnapshot = {
  id: string;
  fileName: string;
  mimeType: string;
  size: number;
  expenseId: string | null;
};

export type ExpenseReportSnapshot = {
  id: string;
  companyId: string;
  employeeId: string;
  label: string;
  status: ExpenseReportStatus;
  total: number;
  receipts: readonly ReceiptSnapshot[];
  reimbursedAmount: number | null;
  expenses: readonly ExpenseSnapshot[];
};
