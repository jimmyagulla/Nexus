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

export type ExpenseReportSnapshot = {
  id: string;
  companyId: string;
  employeeId: string;
  label: string;
  status: ExpenseReportStatus;
  expenses: readonly ExpenseSnapshot[];
};
