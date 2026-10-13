import { describe, expect, it } from 'vitest';
import { ExpenseReportStatus } from '@hexagonal-monorepo-template/domain';
import {
  toExpense,
  toExpenseReport,
  toReceipt,
  type PrismaExpenseReportRow,
  type PrismaExpenseRow,
  type PrismaReceiptRow,
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

const receiptRow: PrismaReceiptRow = {
  id: 'f1',
  reportId: 'r1',
  expenseId: 'x1',
  fileName: 'ticket.pdf',
  mimeType: 'application/pdf',
  content: Buffer.from([1, 2, 3]),
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

  it('rebuilds a receipt from its row', () => {
    const receipt = toReceipt(receiptRow);

    expect(receipt.id).toBe('f1');
    expect(receipt.details.fileName).toBe('ticket.pdf');
    expect(receipt.details.mimeType).toBe('application/pdf');
    expect(receipt.details.expenseId).toBe('x1');
    expect(receipt.details.content).toEqual(new Uint8Array([1, 2, 3]));
  });

  it('rebuilds a receipt of the report as a whole', () => {
    expect(
      toReceipt({ ...receiptRow, expenseId: null }).details.expenseId,
    ).toBeNull();
  });

  it('rebuilds the amount a reimbursed report has paid back', () => {
    const report = toExpenseReport({
      id: 'r1',
      companyId: 'c1',
      employeeId: 'e1',
      label: 'Lyon',
      status: ExpenseReportStatus.REIMBURSED,
      reimbursedCents: 12500,
      expenses: [],
      receipts: [],
    });

    expect(report.reimbursedAmount?.euros).toBe(125);
  });

  it('rebuilds a report that has not been reimbursed', () => {
    const report = toExpenseReport({
      id: 'r1',
      companyId: 'c1',
      employeeId: 'e1',
      label: 'Lyon',
      status: ExpenseReportStatus.VALIDATED,
      reimbursedCents: null,
      expenses: [],
      receipts: [],
    });

    expect(report.reimbursedAmount).toBeNull();
  });

  it('rebuilds a report with its expenses and its receipts', () => {
    const row: PrismaExpenseReportRow = {
      id: 'r1',
      companyId: 'c1',
      employeeId: 'e1',
      label: 'Déplacement Lyon',
      status: ExpenseReportStatus.SUBMITTED,
      reimbursedCents: null,
      expenses: [expenseRow],
      receipts: [receiptRow],
    };

    const report = toExpenseReport(row);

    expect(report.id).toBe('r1');
    expect(report.companyId).toBe('c1');
    expect(report.employeeId).toBe('e1');
    expect(report.label.value).toBe('Déplacement Lyon');
    expect(report.status).toBe(ExpenseReportStatus.SUBMITTED);
    expect(report.expenses.map((item) => item.id)).toEqual(['x1']);
    expect(report.receipts.map((item) => item.id)).toEqual(['f1']);
  });
});
