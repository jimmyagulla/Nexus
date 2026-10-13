import { describe, expect, it } from 'vitest';
import {
  ExpenseDetails,
  ExpenseReportLabel,
  ExpenseReportStatus,
} from '@hexagonal-monorepo-template/domain';
import { InMemoryExpenseReportRepository } from './in-memory-expense-report.repository';

const ASSIGNED_ID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const label = ExpenseReportLabel.parse('Déplacement Lyon');

const details = ExpenseDetails.parse({
  date: '2026-10-05',
  categoryId: 'restaurant',
  amount: 45,
  vat: null,
  paymentMethod: 'Carte',
  description: 'Déjeuner',
  assignment: 'Client Dupont',
});

describe('InMemoryExpenseReportRepository', () => {
  it('opens a draft report with an assigned identity', async () => {
    const report = await new InMemoryExpenseReportRepository().insert(
      'c1',
      'e1',
      label,
    );

    expect(report.id).toMatch(ASSIGNED_ID);
    expect(report.status).toBe(ExpenseReportStatus.DRAFT);
    expect(report.companyId).toBe('c1');
    expect(report.employeeId).toBe('e1');
    expect(report.expenses).toEqual([]);
  });

  it('finds a report of the company', async () => {
    const repository = new InMemoryExpenseReportRepository();
    const created = await repository.insert('c1', 'e1', label);

    const found = await repository.findById('c1', created.id);

    expect(found?.id).toBe(created.id);
  });

  it('does not find a report of another company', async () => {
    const repository = new InMemoryExpenseReportRepository();
    const created = await repository.insert('c1', 'e1', label);

    await expect(repository.findById('c2', created.id)).resolves.toBeNull();
  });

  it('keeps an inserted expense on its report', async () => {
    const repository = new InMemoryExpenseReportRepository();
    const created = await repository.insert('c1', 'e1', label);

    const expense = await repository.insertExpense(created.id, details);
    const found = await repository.findById('c1', created.id);

    expect(expense.id).toMatch(ASSIGNED_ID);
    expect(found?.expenses.map((item) => item.id)).toEqual([expense.id]);
  });

  it('lists the reports of the company', async () => {
    const repository = new InMemoryExpenseReportRepository();
    const mine = await repository.insert('c1', 'e1', label);
    await repository.insert('c2', 'e9', label);

    const reports = await repository.list('c1', {});

    expect(reports.map((report) => report.id)).toEqual([mine.id]);
  });

  it('lists the reports of one employee only', async () => {
    const repository = new InMemoryExpenseReportRepository();
    const mine = await repository.insert('c1', 'e1', label);
    await repository.insert('c1', 'e2', label);

    const reports = await repository.list('c1', { employeeId: 'e1' });

    expect(reports.map((report) => report.id)).toEqual([mine.id]);
  });
});
