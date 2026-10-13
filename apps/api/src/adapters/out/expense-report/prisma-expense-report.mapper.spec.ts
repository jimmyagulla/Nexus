import { describe, expect, it } from 'vitest';
import { ExpenseReportStatus } from '@hexagonal-monorepo-template/domain';
import {
  toExpense,
  toExpenseReport,
  type PrismaExpenseReportRow,
  type PrismaExpenseRow,
} from './prisma-expense-report.mapper';

const expenseRow: PrismaExpenseRow = {
  id: 'x1',
  reportId: 'r1',
  date: '2026-10-05',
  categoryId: 'restaurant',
  amountCents: 4550,
  vatCents: 750,
  paymentMethod: 'Carte',
  description: 'Déjeuner',
  assignment: 'Client Dupont',
};

describe('prisma expense report mapper', () => {
  it('rebuilds an expense from its row', () => {
    const expense = toExpense(expenseRow);

    expect(expense.id).toBe('x1');
    expect(expense.details.date.value).toBe('2026-10-05');
    expect(expense.details.categoryId).toBe('restaurant');
    expect(expense.details.amount.euros).toBe(45.5);
    expect(expense.details.vat?.euros).toBe(7.5);
    expect(expense.details.paymentMethod).toBe('Carte');
    expect(expense.details.description).toBe('Déjeuner');
    expect(expense.details.assignment).toBe('Client Dupont');
  });

  it('rebuilds an expense without VAT', () => {
    expect(toExpense({ ...expenseRow, vatCents: null }).details.vat).toBeNull();
  });

  it('keeps an amount with cents exact', () => {
    expect(
      toExpense({ ...expenseRow, amountCents: 1005, vatCents: null }).details
        .amount.cents,
    ).toBe(1005);
  });

  it('rebuilds a report with its expenses', () => {
    const row: PrismaExpenseReportRow = {
      id: 'r1',
      companyId: 'c1',
      employeeId: 'e1',
      label: 'Déplacement Lyon',
      status: ExpenseReportStatus.DRAFT,
      expenses: [expenseRow],
    };

    const report = toExpenseReport(row);

    expect(report.id).toBe('r1');
    expect(report.companyId).toBe('c1');
    expect(report.employeeId).toBe('e1');
    expect(report.label.value).toBe('Déplacement Lyon');
    expect(report.status).toBe(ExpenseReportStatus.DRAFT);
    expect(report.expenses.map((item) => item.id)).toEqual(['x1']);
  });
});
