import { describe, expect, it } from 'vitest';
import {
  Expense,
  ExpenseDetails,
  ExpenseReportLabel,
  ExpenseReportStatus,
} from '@hexagonal-monorepo-template/domain';
import { PrismaDb } from '../../../infrastructure/prisma/prisma-db.port';
import { PrismaExpenseReportRepository } from './prisma-expense-report.repository';
import type {
  PrismaExpenseReportRow,
  PrismaExpenseRow,
} from './prisma-expense-report.mapper';

type StoredReport = Omit<PrismaExpenseReportRow, 'expenses'>;

type ReportCreateData = {
  companyId: string;
  employeeId: string;
  label: string;
};

type ExpenseCreateData = Omit<PrismaExpenseRow, 'id'>;

function createFakePrisma() {
  const reports: StoredReport[] = [];
  const expenses: PrismaExpenseRow[] = [];
  const reportCreates: ReportCreateData[] = [];
  const expenseCreates: ExpenseCreateData[] = [];

  const withExpenses = (report: StoredReport): PrismaExpenseReportRow => ({
    ...report,
    expenses: expenses.filter((expense) => expense.reportId === report.id),
  });

  const client = {
    expenseReport: {
      create: async (args: { data: ReportCreateData }) => {
        reportCreates.push(args.data);
        const row: StoredReport = {
          id: `report-${reports.length + 1}`,
          status: ExpenseReportStatus.DRAFT,
          ...args.data,
        };
        reports.push(row);
        return withExpenses(row);
      },
      findFirst: async (args: { where: { id: string; companyId: string } }) => {
        const found = reports.find(
          (row) =>
            row.id === args.where.id && row.companyId === args.where.companyId,
        );
        return found === undefined ? null : withExpenses(found);
      },
      findMany: async (args: {
        where: { companyId: string; employeeId?: string };
      }) =>
        reports
          .filter(
            (row) =>
              row.companyId === args.where.companyId &&
              (args.where.employeeId === undefined ||
                row.employeeId === args.where.employeeId),
          )
          .map(withExpenses),
    },
    expense: {
      create: async (args: { data: ExpenseCreateData }) => {
        expenseCreates.push(args.data);
        const row = { id: `expense-${expenses.length + 1}`, ...args.data };
        expenses.push(row);
        return row;
      },
      updateMany: async (args: {
        where: { id: string; reportId: string };
        data: Omit<ExpenseCreateData, 'reportId'>;
      }) => {
        for (const row of expenses) {
          if (row.id === args.where.id && row.reportId === args.where.reportId) {
            Object.assign(row, args.data);
          }
        }
      },
      deleteMany: async (args: { where: { id: string; reportId: string } }) => {
        const kept = expenses.filter(
          (row) =>
            !(row.id === args.where.id && row.reportId === args.where.reportId),
        );
        expenses.splice(0, expenses.length, ...kept);
      },
    },
  };

  return {
    client: client as unknown as PrismaDb,
    reportCreates,
    expenseCreates,
  };
}

const label = ExpenseReportLabel.parse('Déplacement Lyon');

const details = ExpenseDetails.parse({
  date: '2026-10-05',
  categoryId: 'restaurant',
  amount: 45.5,
  vat: 7.5,
  paymentMethod: 'Carte',
  description: 'Déjeuner',
  assignment: 'Client Dupont',
});

describe('PrismaExpenseReportRepository', () => {
  it('lets the database assign the id of a new draft report', async () => {
    const { client, reportCreates } = createFakePrisma();

    const report = await new PrismaExpenseReportRepository(client).insert(
      'c1',
      'e1',
      label,
    );

    expect(reportCreates).toEqual([
      { companyId: 'c1', employeeId: 'e1', label: 'Déplacement Lyon' },
    ]);
    expect(report.id).toBe('report-1');
    expect(report.status).toBe(ExpenseReportStatus.DRAFT);
    expect(report.expenses).toEqual([]);
  });

  it('turns an expense into a flat record with its amount in cents', async () => {
    const { client, expenseCreates } = createFakePrisma();
    const repository = new PrismaExpenseReportRepository(client);
    const report = await repository.insert('c1', 'e1', label);

    const expense = await repository.insertExpense(report.id, details);

    expect(expenseCreates).toEqual([
      {
        reportId: 'report-1',
        date: '2026-10-05',
        categoryId: 'restaurant',
        amountCents: 4550,
        vatCents: 750,
        paymentMethod: 'Carte',
        description: 'Déjeuner',
        assignment: 'Client Dupont',
      },
    ]);
    expect(expense.id).toBe('expense-1');
    expect(expense.details.amount.euros).toBe(45.5);
  });

  it('stores a missing VAT as null', async () => {
    const { client, expenseCreates } = createFakePrisma();
    const repository = new PrismaExpenseReportRepository(client);
    const report = await repository.insert('c1', 'e1', label);

    await repository.insertExpense(
      report.id,
      ExpenseDetails.parse({
        date: '2026-10-05',
        categoryId: 'train',
        amount: 68,
        vat: null,
        paymentMethod: 'Carte',
        description: 'Billet',
        assignment: 'Projet X',
      }),
    );

    expect(expenseCreates[0]?.vatCents).toBeNull();
  });

  it('reads back a report with the expenses it holds', async () => {
    const { client } = createFakePrisma();
    const repository = new PrismaExpenseReportRepository(client);
    const created = await repository.insert('c1', 'e1', label);
    await repository.insertExpense(created.id, details);

    const found = await repository.findById('c1', created.id);

    expect(found?.expenses.map((item) => item.details.categoryId)).toEqual([
      'restaurant',
    ]);
  });

  it('rewrites a modified expense in place', async () => {
    const { client } = createFakePrisma();
    const repository = new PrismaExpenseReportRepository(client);
    const created = await repository.insert('c1', 'e1', label);
    const expense = await repository.insertExpense(created.id, details);

    await repository.saveExpense(
      created.id,
      new Expense(
        expense.id,
        ExpenseDetails.parse({
          date: '2026-10-06',
          categoryId: 'train',
          amount: 70,
          vat: null,
          paymentMethod: 'Espèces',
          description: 'Billet',
          assignment: 'Projet X',
        }),
      ),
    );
    const found = await repository.findById('c1', created.id);

    expect(found?.expenses).toHaveLength(1);
    expect(found?.expenses[0]?.details.amount.euros).toBe(70);
    expect(found?.expenses[0]?.details.categoryId).toBe('train');
    expect(found?.expenses[0]?.details.vat).toBeNull();
  });

  it('removes a deleted expense from its report only', async () => {
    const { client } = createFakePrisma();
    const repository = new PrismaExpenseReportRepository(client);
    const first = await repository.insert('c1', 'e1', label);
    const second = await repository.insert('c1', 'e1', label);
    const kept = await repository.insertExpense(first.id, details);
    const removed = await repository.insertExpense(second.id, details);

    await repository.deleteExpense(second.id, removed.id);

    expect(
      (await repository.findById('c1', first.id))?.expenses.map((item) => item.id),
    ).toEqual([kept.id]);
    expect((await repository.findById('c1', second.id))?.expenses).toEqual([]);
  });

  it('does not find a report of another company', async () => {
    const { client } = createFakePrisma();
    const repository = new PrismaExpenseReportRepository(client);
    const created = await repository.insert('c1', 'e1', label);

    await expect(repository.findById('c2', created.id)).resolves.toBeNull();
  });

  it('lists the reports of one employee of the company', async () => {
    const { client } = createFakePrisma();
    const repository = new PrismaExpenseReportRepository(client);
    const mine = await repository.insert('c1', 'e1', label);
    await repository.insert('c1', 'e2', label);
    await repository.insert('c2', 'e1', label);

    const reports = await repository.list('c1', { employeeId: 'e1' });

    expect(reports.map((report) => report.id)).toEqual([mine.id]);
  });

  it('lists every report of the company without employee criterion', async () => {
    const { client } = createFakePrisma();
    const repository = new PrismaExpenseReportRepository(client);
    await repository.insert('c1', 'e1', label);
    await repository.insert('c1', 'e2', label);
    await repository.insert('c2', 'e1', label);

    expect(await repository.list('c1', {})).toHaveLength(2);
  });
});
