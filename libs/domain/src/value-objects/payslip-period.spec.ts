import { ErrorCode } from '../errors/error-code';
import { PayslipEmployerName } from './payslip-employer-name';
import { PayslipFileName } from './payslip-file-name';
import { PAYSLIP_FILE_NAME_MAX_LENGTH, PAYSLIP_MAX_YEAR, PAYSLIP_MIN_YEAR } from './payslip-limits';
import { isPayslipYear, PayslipPeriod } from './payslip-period';

describe('PayslipPeriod', () => {
  it('keeps a year and a month', () => {
    expect(PayslipPeriod.of(2026, 1)).toMatchObject({ year: 2026, month: 1 });
  });

  it.each([
    [2026, 0],
    [2026, 13],
    [2026, 1.5],
    [PAYSLIP_MIN_YEAR - 1, 6],
    [PAYSLIP_MAX_YEAR + 1, 6],
  ])('refuses %i-%i', (year, month) => {
    expect(() => PayslipPeriod.of(year, month)).toThrow(ErrorCode.INVALID_INFORMATION);
  });

  it('orders periods chronologically', () => {
    const periods = [PayslipPeriod.of(2026, 2), PayslipPeriod.of(2025, 12), PayslipPeriod.of(2026, 1)];

    expect(periods.sort((left, right) => left.compare(right)).map(({ year, month }) => `${year}-${month}`)).toEqual([
      '2025-12',
      '2026-1',
      '2026-2',
    ]);
  });
});

describe('isPayslipYear', () => {
  it('accepts the years a payslip may cover only', () => {
    expect([PAYSLIP_MIN_YEAR, 2026, PAYSLIP_MAX_YEAR, PAYSLIP_MIN_YEAR - 1, 2026.5].map(isPayslipYear)).toEqual([
      true,
      true,
      true,
      false,
      false,
    ]);
  });
});

describe('PayslipFileName', () => {
  it('keeps the name without its surrounding spaces', () => {
    expect(PayslipFileName.parse('  Bulletin.pdf ').value).toBe('Bulletin.pdf');
  });

  it('refuses an empty name', () => {
    expect(() => PayslipFileName.parse('   ')).toThrow(ErrorCode.REQUIRED_INFORMATION);
  });

  it('refuses a name above the length limit', () => {
    expect(PayslipFileName.parse('a'.repeat(PAYSLIP_FILE_NAME_MAX_LENGTH)).value).toHaveLength(PAYSLIP_FILE_NAME_MAX_LENGTH);
    expect(() => PayslipFileName.parse('a'.repeat(PAYSLIP_FILE_NAME_MAX_LENGTH + 1))).toThrow(ErrorCode.INVALID_INFORMATION);
  });
});

describe('PayslipEmployerName', () => {
  it('keeps the name without its surrounding spaces', () => {
    expect(PayslipEmployerName.parse(' Atelier Moreau ').value).toBe('Atelier Moreau');
  });

  it('refuses an empty or too long name', () => {
    expect(() => PayslipEmployerName.parse('')).toThrow(ErrorCode.REQUIRED_INFORMATION);
    expect(() => PayslipEmployerName.parse('a'.repeat(101))).toThrow(ErrorCode.INVALID_INFORMATION);
  });
});
