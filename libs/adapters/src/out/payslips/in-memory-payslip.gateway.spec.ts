import { describe, expect, it } from 'vitest';
import {
  DocumentFileFormat,
  ErrorCode,
  Payslip,
  PayslipEmployerName,
  PayslipFileName,
  PayslipPeriod,
} from '@hexagonal-monorepo-template/domain';
import { InMemoryPayslipGateway } from './in-memory-payslip.gateway';

const pdf = Uint8Array.from([0x25, 0x50, 0x44, 0x46]);

function stored(id: string, employeeId: string, month: number) {
  return {
    payslip: new Payslip({
      id, companyId: 'c1', employeeId, uploadedById: 'hr1', employerName: PayslipEmployerName.parse('Atelier Moreau'),
      period: PayslipPeriod.of(2026, month), netPayCents: 200000, fileName: PayslipFileName.parse(`Bulletin_${id}`),
      format: DocumentFileFormat.PDF, sizeBytes: pdf.length, storageKey: `c1/${employeeId}/${id}`,
      availableAt: new Date('2026-01-31T00:00:00Z'), createdAt: new Date('2026-01-31T00:00:00Z'),
    }),
    content: pdf,
  };
}

function gateway(): InMemoryPayslipGateway {
  return new InMemoryPayslipGateway(
    new Map([
      ['feb', stored('feb', 'u1', 2)],
      ['jan', stored('jan', 'u1', 1)],
      ['other', stored('other', 'u2', 1)],
    ]),
  );
}

const link = (payslipId: string) => ({
  payslipId,
  url: 'data:application/pdf;base64,JVBERg==',
  fileName: `Bulletin_${payslipId}.pdf`,
  contentType: 'application/pdf',
});

describe('InMemoryPayslipGateway', () => {
  it('lists the payslips of the employee the token stands for', async () => {
    await expect(gateway().list('c1', { year: 2026 }, 'u1')).resolves.toMatchObject({
      items: [{ id: 'jan' }, { id: 'feb' }],
      total: 2,
    });
  });

  it('opens and downloads a payslip of the employee', async () => {
    await expect(gateway().view('c1', 'jan', 'u1')).resolves.toEqual(link('jan'));
    await expect(gateway().download('c1', 'jan', 'u1')).resolves.toEqual(link('jan'));
  });

  it('exports the links of every payslip of the list, January first', async () => {
    await expect(gateway().export('c1', { year: 2026 }, 'u1')).resolves.toEqual([link('jan'), link('feb')]);
  });

  it('refuses the payslip of a colleague', async () => {
    await expect(gateway().view('c1', 'other', 'u1')).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });
});
