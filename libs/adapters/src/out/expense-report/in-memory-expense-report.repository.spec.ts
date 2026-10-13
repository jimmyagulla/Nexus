import { describe, expect, it } from 'vitest';
import {
  Expense,
  ExpenseDetails,
  ExpenseReportLabel,
  ExpenseReportStatus,
  ReceiptDetails,
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

  it('replaces a stored expense by its modified version', async () => {
    const repository = new InMemoryExpenseReportRepository();
    const created = await repository.insert('c1', 'e1', label);
    const expense = await repository.insertExpense(created.id, details);

    await repository.saveExpense(
      created.id,
      new Expense(
        expense.id,
        ExpenseDetails.parse({
          date: '2026-10-05',
          categoryId: 'restaurant',
          amount: 50,
          vat: null,
          paymentMethod: 'Carte',
          description: 'Déjeuner',
          assignment: 'Client Dupont',
        }),
      ),
    );
    const found = await repository.findById('c1', created.id);

    expect(found?.expenses.map((item) => item.details.amount.euros)).toEqual([
      50,
    ]);
  });

  it('drops a deleted expense from its report', async () => {
    const repository = new InMemoryExpenseReportRepository();
    const created = await repository.insert('c1', 'e1', label);
    const expense = await repository.insertExpense(created.id, details);

    await repository.deleteExpense(created.id, expense.id);

    expect((await repository.findById('c1', created.id))?.expenses).toEqual([]);
  });

  it('keeps an inserted receipt on its report', async () => {
    const repository = new InMemoryExpenseReportRepository();
    const created = await repository.insert('c1', 'e1', label);

    const receipt = await repository.insertReceipt(
      created.id,
      ReceiptDetails.parse({
        fileName: 'ticket.pdf',
        mimeType: 'application/pdf',
        content: new Uint8Array([1, 2, 3]),
        expenseId: null,
      }),
    );
    const found = await repository.findById('c1', created.id);

    expect(receipt.id).toMatch(ASSIGNED_ID);
    expect(found?.receipts.map((item) => item.id)).toEqual([receipt.id]);
  });

  it('stores the new state of a report', async () => {
    const repository = new InMemoryExpenseReportRepository();
    const created = await repository.insert('c1', 'e1', label);
    const withExpense = created.addExpense(
      await repository.insertExpense(created.id, details),
    );
    const withReceipt = withExpense.attachReceipt(
      await repository.insertReceipt(
        created.id,
        ReceiptDetails.parse({
          fileName: 'ticket.pdf',
          mimeType: 'application/pdf',
          content: new Uint8Array([1]),
          expenseId: null,
        }),
      ),
    );

    await repository.save(withReceipt.submit());

    expect((await repository.findById('c1', created.id))?.status).toBe(
      ExpenseReportStatus.SUBMITTED,
    );
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
