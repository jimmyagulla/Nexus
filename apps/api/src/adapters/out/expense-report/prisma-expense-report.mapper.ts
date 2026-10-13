import {
  Expense,
  ExpenseDetails,
  ExpenseReport,
  ExpenseReportLabel,
  ExpenseReportStatus,
} from '@hexagonal-monorepo-template/domain';

export type PrismaExpenseRow = {
  id: string;
  reportId: string;
  date: string;
  categoryId: string;
  amountCents: number;
  vatCents: number | null;
  paymentMethod: string;
  description: string;
  assignment: string;
};

export type PrismaExpenseReportRow = {
  id: string;
  companyId: string;
  employeeId: string;
  label: string;
  status: ExpenseReportStatus;
  expenses: PrismaExpenseRow[];
};

export function toExpense(row: PrismaExpenseRow): Expense {
  return new Expense(
    row.id,
    ExpenseDetails.parse({
      date: row.date,
      categoryId: row.categoryId,
      amount: row.amountCents / 100,
      vat: row.vatCents === null ? null : row.vatCents / 100,
      paymentMethod: row.paymentMethod,
      description: row.description,
      assignment: row.assignment,
    }),
  );
}

export function toExpenseReport(row: PrismaExpenseReportRow): ExpenseReport {
  return new ExpenseReport({
    id: row.id,
    companyId: row.companyId,
    employeeId: row.employeeId,
    label: ExpenseReportLabel.parse(row.label),
    status: row.status,
    expenses: row.expenses.map(toExpense),
  });
}
