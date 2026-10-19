import { Payslip } from '../entities/payslip';
import { DocumentFileFormat } from '../value-objects/document-file-format';
import { PayslipEmployerName } from '../value-objects/payslip-employer-name';
import { PayslipFileName } from '../value-objects/payslip-file-name';
import { PayslipPeriod } from '../value-objects/payslip-period';
import { distinctFileNames } from './distinct-file-names';
import {
  adjacentPayslipYears,
  countUnseenPayslips,
  defaultPayslipYear,
  payslipListOfYear,
  toPayslipList,
} from './payslip-list-rules';

function payslipOf(id: string, year: number, month: number): Payslip {
  return new Payslip({
    id,
    companyId: 'c1',
    employeeId: 'u1',
    uploadedById: 'hr1',
    employerName: PayslipEmployerName.parse('Atelier Moreau'),
    period: PayslipPeriod.of(year, month),
    netPayCents: 200000,
    fileName: PayslipFileName.parse(`Bulletin_${year}-${month}.pdf`),
    format: DocumentFileFormat.PDF,
    sizeBytes: 1000,
    storageKey: `c1/u1/${id}`,
    availableAt: new Date(Date.UTC(year, month - 1, 28)),
    createdAt: new Date(Date.UTC(year, month - 1, 28)),
  });
}

const owned = [
  payslipOf('dec', 2025, 12),
  payslipOf('mar', 2026, 3),
  payslipOf('jan', 2026, 1),
  payslipOf('may', 2024, 5),
];

describe('toPayslipList', () => {
  it('lists the payslips of a year from January to December', () => {
    expect(toPayslipList(owned, { year: 2026 }).items.map((item) => item.id)).toEqual(['jan', 'mar']);
  });

  it('lists every payslip in chronological order without a year', () => {
    expect(toPayslipList(owned, { year: null }).items.map((item) => item.id)).toEqual(['may', 'dec', 'jan', 'mar']);
  });

  it('counts every payslip and every year, whatever the year asked for', () => {
    expect(toPayslipList(owned, { year: 2030 })).toEqual({ items: [], total: 4, years: [2024, 2025, 2026] });
  });

  it('summarises a payslip without its file', () => {
    expect(toPayslipList([payslipOf('jan', 2026, 1)], { year: 2026 }).items).toEqual([
      {
        id: 'jan',
        year: 2026,
        month: 1,
        employerName: 'Atelier Moreau',
        netPayCents: 200000,
        fileName: 'Bulletin_2026-1.pdf',
        format: 'PDF',
        sizeBytes: 1000,
        availableAt: '2026-01-28T00:00:00.000Z',
      },
    ]);
  });
});

describe('payslipListOfYear', () => {
  it('reads the list of a year from the list of every year', () => {
    const everyYear = toPayslipList(owned, { year: null });

    expect(payslipListOfYear(everyYear, 2026)).toEqual(toPayslipList(owned, { year: 2026 }));
  });
});

describe('defaultPayslipYear', () => {
  it('opens on the latest year with a payslip', () => {
    expect(defaultPayslipYear([2024, 2025], new Date('2026-10-19T10:00:00'))).toBe(2025);
  });

  it('opens on the current year when there is no payslip yet', () => {
    expect(defaultPayslipYear([], new Date('2026-10-19T10:00:00'))).toBe(2026);
  });
});

describe('adjacentPayslipYears', () => {
  it('skips the years without a payslip', () => {
    expect(adjacentPayslipYears([2022, 2024, 2026], 2024)).toEqual({ previous: 2022, next: 2026 });
  });

  it('has no neighbour past the first and the last years', () => {
    expect(adjacentPayslipYears([2024], 2024)).toEqual({ previous: null, next: null });
  });

  it('finds the neighbours of a year that has no payslip', () => {
    expect(adjacentPayslipYears([2024, 2026], 2025)).toEqual({ previous: 2024, next: 2026 });
  });
});

describe('countUnseenPayslips', () => {
  it('counts the payslips neither opened nor downloaded', () => {
    expect(countUnseenPayslips([{ id: 'a' }, { id: 'b' }, { id: 'c' }], new Set(['b', 'z']))).toBe(2);
  });
});

describe('distinctFileNames', () => {
  it('numbers a repeated name before its extension, whatever its case', () => {
    expect(distinctFileNames(['a.pdf', 'A.pdf', 'a.pdf', 'b', 'b'])).toEqual(['a.pdf', 'A (2).pdf', 'a (3).pdf', 'b', 'b (2)']);
  });
});
