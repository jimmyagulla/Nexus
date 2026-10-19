import { describe, expect, it } from 'vitest';
import {
  DocumentFileFormat,
  Payslip,
  PayslipEmployerName,
  PayslipFileName,
  PayslipPeriod,
} from '@hexagonal-monorepo-template/domain';
import { InMemoryPayslipFileStorage } from './in-memory-payslip-file.storage';
import { InMemoryPayslipRepository } from './in-memory-payslip.repository';

function payslipOf(id: string, employeeId: string, year: number, month: number): Payslip {
  return new Payslip({
    id, companyId: 'c1', employeeId, uploadedById: 'hr1', employerName: PayslipEmployerName.parse('Atelier Moreau'),
    period: PayslipPeriod.of(year, month), netPayCents: 200000, fileName: PayslipFileName.parse(`Bulletin_${id}.pdf`),
    format: DocumentFileFormat.PDF, sizeBytes: 10, storageKey: `c1/${employeeId}/${id}`,
    availableAt: new Date('2026-01-31T00:00:00Z'), createdAt: new Date('2026-01-31T00:00:00Z'),
  });
}

function repository(): InMemoryPayslipRepository {
  return new InMemoryPayslipRepository(
    new Map([
      ['mar', payslipOf('mar', 'u1', 2026, 3)],
      ['jan', payslipOf('jan', 'u1', 2026, 1)],
      ['old', payslipOf('old', 'u1', 2025, 12)],
      ['other', payslipOf('other', 'u2', 2026, 2)],
    ]),
  );
}

const scope = { companyId: 'c1', ownerId: 'u1' };

describe('InMemoryPayslipRepository', () => {
  it('lists the payslips of the employee for a year, January first', async () => {
    await expect(repository().list(scope, { year: 2026 })).resolves.toMatchObject({
      items: [{ id: 'jan' }, { id: 'mar' }],
      total: 3,
      years: [2025, 2026],
    });
  });

  it('hands back the payslips themselves for every year', async () => {
    const payslips = await repository().findAll(scope, { year: null });

    expect(payslips.map((payslip) => payslip.id)).toEqual(['old', 'jan', 'mar']);
  });

  it('finds a payslip by its identifier, or nothing', async () => {
    await expect(repository().findById('jan')).resolves.toMatchObject({ id: 'jan' });
    await expect(repository().findById('missing')).resolves.toBeNull();
  });
});

describe('InMemoryPayslipFileStorage', () => {
  it('links to a file with a data URL carrying its content', async () => {
    const storage = new InMemoryPayslipFileStorage(
      new Map([['c1/u1/k', { contentType: 'application/pdf', content: Uint8Array.from([0x25, 0x50, 0x44, 0x46]) }]]),
    );

    await expect(storage.linkTo('c1/u1/k')).resolves.toBe('data:application/pdf;base64,JVBERg==');
  });

  it('refuses a key it keeps nothing under', async () => {
    await expect(new InMemoryPayslipFileStorage().linkTo('missing')).rejects.toThrow('missing');
  });
});
