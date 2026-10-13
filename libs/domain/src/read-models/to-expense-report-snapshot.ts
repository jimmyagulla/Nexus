import { Expense } from '../entities/expense';
import { ExpenseReport } from '../entities/expense-report';
import { Receipt } from '../entities/receipt';
import {
  ExpenseReportSnapshot,
  ExpenseSnapshot,
  ReceiptSnapshot,
} from './expense-report-snapshot';

export function toExpenseReportSnapshot(
  report: ExpenseReport,
): ExpenseReportSnapshot {
  return {
    id: report.id,
    companyId: report.companyId,
    employeeId: report.employeeId,
    label: report.label.value,
    status: report.status,
    total: report.total().euros,
    receipts: report.receipts.map(toReceiptSnapshot),
    reimbursedAmount:
      report.reimbursedAmount === null ? null : report.reimbursedAmount.euros,
    expenses: report.expenses.map(toExpenseSnapshot),
  };
}

function toReceiptSnapshot(receipt: Receipt): ReceiptSnapshot {
  const { details } = receipt;
  return {
    id: receipt.id,
    fileName: details.fileName,
    mimeType: details.mimeType,
    size: details.content.length,
    expenseId: details.expenseId,
  };
}

function toExpenseSnapshot(expense: Expense): ExpenseSnapshot {
  const { details } = expense;
  return {
    id: expense.id,
    date: details.date.value,
    categoryId: details.categoryId,
    amount: details.amount.euros,
    vat: details.vat === null ? null : details.vat.euros,
    paymentMethod: details.paymentMethod,
    description: details.description,
    assignment: details.assignment,
  };
}
