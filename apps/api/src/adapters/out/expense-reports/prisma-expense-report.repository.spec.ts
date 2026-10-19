import { describe, expect, it } from 'vitest';
import {
  CalendarDate,
  ExpenseAmount,
  ExpenseReportDescription,
  ExpenseReportStatus,
} from '@hexagonal-monorepo-template/domain';
import { PrismaDb } from '../../../infrastructure/prisma/prisma-db.port';
import { PrismaExpenseReportRepository } from './prisma-expense-report.repository';
import type { ExpenseReport as ExpenseReportRecord } from '../../../infrastructure/prisma/prisma-client';

const row: ExpenseReportRecord = {
  id: 'e1', companyId: 'c1', ownerId: 'u1', date: new Date('2026-09-28T00:00:00Z'), category: 'TRAVEL',
  paymentMethod: 'PERSONAL_CARD', amount: '68.00', vatRate: 10, vatAmount: '6.18', description: 'Montpellier – Lyon',
  project: 'Client Valette', proofFileName: 'billet.pdf', proofFormat: 'PDF', proofSizeBytes: 214_000,
  proofStorageKey: 'c1/u1/k', status: 'SUBMITTED', submittedAt: new Date('2026-09-28T18:00:00Z'), processedAt: null,
};

type Recorded = { findMany: unknown[]; update: unknown[]; create: unknown[] };

function fakePrisma(): { client: PrismaDb; recorded: Recorded } {
  const recorded: Recorded = { findMany: [], update: [], create: [] };
  const client = {
    expenseReport: {
      create: async (args: { data: Omit<ExpenseReportRecord, 'id'> }) => {
        recorded.create.push(args);
        return { ...args.data, id: 'new-id' };
      },
      update: async (args: unknown) => {
        recorded.update.push(args);
      },
      findUnique: async (args: { where: { id: string } }) => (args.where.id === 'e1' ? row : null),
      findMany: async (args: unknown) => {
        recorded.findMany.push(args);
        return [row];
      },
    },
  };
  return { client: client as unknown as PrismaDb, recorded };
}

describe('PrismaExpenseReportRepository', () => {
  it('reads a row back as a report: its day, its amounts as text and its receipt', async () => {
    const report = await new PrismaExpenseReportRepository(fakePrisma().client).findById('e1');

    expect([report?.date.value, report?.amount.value, report?.vat?.amount.value, report?.proof?.storageKey]).toEqual([
      '2026-09-28', '68.00', '6.18', 'c1/u1/k',
    ]);
  });

  it('hands back nothing for an unknown report', async () => {
    await expect(new PrismaExpenseReportRepository(fakePrisma().client).findById('missing')).resolves.toBeNull();
  });

  it('lists the reports of one owner in one company', async () => {
    const { client, recorded } = fakePrisma();

    const reports = await new PrismaExpenseReportRepository(client).listOwned({ companyId: 'c1', ownerId: 'u1' });

    expect(reports.map((report) => report.id)).toEqual(['e1']);
    expect(recorded.findMany).toEqual([{
      where: { companyId: 'c1', ownerId: 'u1' },
      orderBy: [{ date: 'desc' }, { submittedAt: 'desc' }, { id: 'desc' }],
    }]);
  });

  it('records a report without receipt nor VAT', async () => {
    const { client, recorded } = fakePrisma();

    const inserted = await new PrismaExpenseReportRepository(client).insert({
      companyId: 'c1', ownerId: 'u1', date: CalendarDate.parse('2026-09-12'), category: 'PARKING',
      paymentMethod: 'CASH', amount: ExpenseAmount.parse('12'), vat: null,
      description: ExpenseReportDescription.parse('Parking'), project: null, proof: null,
      status: ExpenseReportStatus.SUBMITTED, submittedAt: new Date('2026-09-12T18:00:00Z'), processedAt: null,
    });

    expect(inserted.id).toBe('new-id');
    expect(recorded.create).toMatchObject([{ data: {
      date: new Date('2026-09-12T00:00:00.000Z'), amount: '12.00', vatRate: null, vatAmount: null,
      proofFileName: null, proofStorageKey: null,
    } }]);
  });

  it('saves the changes of a report, never its owner nor its submission', async () => {
    const { client, recorded } = fakePrisma();
    const repository = new PrismaExpenseReportRepository(client);
    const report = await repository.findById('e1');
    if (report === null) {
      throw new Error('the seeded report is missing');
    }

    await repository.save(report.changeStatus(ExpenseReportStatus.REFUNDED, new Date('2026-10-08T09:00:00Z')));

    expect(recorded.update).toMatchObject([{
      where: { id: 'e1', companyId: 'c1', ownerId: 'u1' },
      data: { status: 'REFUNDED', processedAt: new Date('2026-10-08T09:00:00Z'), amount: '68.00' },
    }]);
  });
});
