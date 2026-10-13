import { describe, expect, it } from 'vitest';
import {
  ExpenseReportSnapshot,
  ExpenseReportStatus,
} from '@hexagonal-monorepo-template/domain';
import { toExpenseReportResponse } from './expense-report.mapper';

const snapshot: ExpenseReportSnapshot = {
  id: 'r1',
  companyId: 'c1',
  employeeId: 'e1',
  label: 'Déplacement Lyon',
  status: ExpenseReportStatus.DRAFT,
  total: 45,
  receipts: [
    {
      id: 'f1',
      fileName: 'ticket.pdf',
      mimeType: 'application/pdf',
      size: 3,
      expenseId: null,
    },
  ],
  expenses: [
    {
      id: 'x1',
      date: '2026-10-05',
      categoryId: 'restaurant',
      amount: 45,
      vat: null,
      paymentMethod: 'Carte',
      description: 'Déjeuner',
      assignment: 'Client Dupont',
    },
  ],
};

describe('toExpenseReportResponse', () => {
  it('exposes the report and its expenses', () => {
    expect(toExpenseReportResponse(snapshot)).toEqual(snapshot);
  });

  it('returns copies so the snapshot stays untouched', () => {
    const response = toExpenseReportResponse(snapshot);

    expect(response.expenses).not.toBe(snapshot.expenses);
    expect(response.expenses[0]).not.toBe(snapshot.expenses[0]);
    expect(response.receipts[0]).not.toBe(snapshot.receipts[0]);
  });
});
