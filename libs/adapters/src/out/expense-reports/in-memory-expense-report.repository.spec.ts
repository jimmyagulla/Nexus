import { describe, expect, it } from 'vitest';
import {
  CalendarDate,
  ExpenseAmount,
  ExpenseReportDescription,
  ExpenseReportStatus,
} from '@hexagonal-monorepo-template/domain';
import { NewExpenseReport } from '@hexagonal-monorepo-template/ports';
import { RandomUuidGenerator } from '../id/random-uuid-generator';
import { InMemoryExpenseReportRepository } from './in-memory-expense-report.repository';

function newReport(ownerId: string, companyId = 'c1'): NewExpenseReport {
  return {
    companyId,
    ownerId,
    date: CalendarDate.parse('2026-09-12'),
    category: 'PARKING',
    paymentMethod: 'PERSONAL_CARD',
    amount: ExpenseAmount.parse('12'),
    vat: null,
    description: ExpenseReportDescription.parse('Parking Polygone'),
    project: null,
    proof: null,
    status: ExpenseReportStatus.SUBMITTED,
    submittedAt: new Date('2026-09-12T18:00:00Z'),
    processedAt: null,
  };
}

describe('InMemoryExpenseReportRepository', () => {
  it('gives each recorded report an identifier and finds it again', async () => {
    const repository = new InMemoryExpenseReportRepository(new RandomUuidGenerator());

    const inserted = await repository.insert(newReport('u1'));

    expect((await repository.findById(inserted.id))?.description.value).toBe('Parking Polygone');
    expect(await repository.findById('missing')).toBeNull();
  });

  it('lists the reports of one person in one company only', async () => {
    const repository = new InMemoryExpenseReportRepository(new RandomUuidGenerator());
    const mine = await repository.insert(newReport('u1'));
    await repository.insert(newReport('u2'));
    await repository.insert(newReport('u1', 'c2'));

    expect((await repository.listOwned({ companyId: 'c1', ownerId: 'u1' })).map((report) => report.id)).toEqual([mine.id]);
  });

  it('keeps the saved state of a report', async () => {
    const repository = new InMemoryExpenseReportRepository(new RandomUuidGenerator());
    const inserted = await repository.insert(newReport('u1'));

    await repository.save(inserted.changeStatus(ExpenseReportStatus.REFUNDED, new Date('2026-10-01T00:00:00Z')));

    expect((await repository.findById(inserted.id))?.status).toBe(ExpenseReportStatus.REFUNDED);
  });
});
