import { describe, expect, it } from 'vitest';
import { DocumentFileFormat } from '@hexagonal-monorepo-template/domain';
import { PrismaDb } from '../../../infrastructure/prisma/prisma-db.port';
import { PrismaPayslipRepository } from './prisma-payslip.repository';
import type { Payslip as PayslipRecord } from '../../../infrastructure/prisma/prisma-client';

const row: PayslipRecord = {
  id: 'p1', companyId: 'c1', employeeId: 'u1', uploadedById: 'hr1', employerName: 'Atelier Moreau', year: 2026, month: 9,
  netPayCents: 218437, fileName: 'Bulletin_2026-09.pdf', format: DocumentFileFormat.PDF, sizeBytes: 217088,
  storageKey: 'c1/u1/k', availableAt: new Date('2026-09-30T08:00:00Z'), createdAt: new Date('2026-09-30T08:00:00Z'),
};

type Recorded = { findMany: unknown[]; groupBy: unknown[] };

function fakePrisma(): { client: PrismaDb; recorded: Recorded } {
  const recorded: Recorded = { findMany: [], groupBy: [] };
  const client = {
    payslip: {
      findUnique: async (args: { where: { id: string } }) => (args.where.id === 'p1' ? row : null),
      findMany: async (args: unknown) => {
        recorded.findMany.push(args);
        return [row];
      },
      groupBy: async (args: unknown) => {
        recorded.groupBy.push(args);
        return [
          { year: 2025, _count: { _all: 12 } },
          { year: 2026, _count: { _all: 9 } },
        ];
      },
    },
  };
  return { client: client as unknown as PrismaDb, recorded };
}

const scope = { companyId: 'c1', ownerId: 'u1' };

describe('PrismaPayslipRepository', () => {
  it('lists the summaries of a year with the years and the total of the employee', async () => {
    const list = await new PrismaPayslipRepository(fakePrisma().client).list(scope, { year: 2026 });

    expect(list).toEqual({
      items: [{
        id: 'p1', year: 2026, month: 9, employerName: 'Atelier Moreau', netPayCents: 218437, fileName: 'Bulletin_2026-09.pdf',
        format: 'PDF', sizeBytes: 217088, availableAt: '2026-09-30T08:00:00.000Z',
      }],
      total: 21,
      years: [2025, 2026],
    });
  });

  it('queries the payslips of the employee for the year, January to December', async () => {
    const { client, recorded } = fakePrisma();

    await new PrismaPayslipRepository(client).list(scope, { year: 2026 });

    expect(recorded.findMany).toEqual([{
      where: { companyId: 'c1', employeeId: 'u1', year: 2026 },
      orderBy: [{ year: 'asc' }, { month: 'asc' }, { id: 'asc' }],
    }]);
    expect(recorded.groupBy).toEqual([{
      by: ['year'], where: { companyId: 'c1', employeeId: 'u1' }, _count: { _all: true }, orderBy: { year: 'asc' },
    }]);
  });

  it('queries every year without one', async () => {
    const { client, recorded } = fakePrisma();

    await new PrismaPayslipRepository(client).findAll(scope, { year: null });

    expect(recorded.findMany).toMatchObject([{ where: { companyId: 'c1', employeeId: 'u1' } }]);
  });

  it('finds a payslip by its identifier, or nothing', async () => {
    const repository = new PrismaPayslipRepository(fakePrisma().client);

    expect((await repository.findById('p1'))?.downloadName).toBe('Bulletin_2026-09.pdf');
    await expect(repository.findById('missing')).resolves.toBeNull();
  });
});
