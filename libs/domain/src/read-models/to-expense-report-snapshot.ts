import { Expense } from '../entities/expense';
import { ExpenseReport } from '../entities/expense-report';
import {
  ExpenseReportSnapshot,
  ExpenseSnapshot,
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
    expenses: report.expenses.map(toExpenseSnapshot),
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
